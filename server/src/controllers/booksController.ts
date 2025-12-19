import type { Request, Response } from "express";
import type { UploadApiResponse } from "cloudinary";
import { pool } from "../db";
import cloudinary from "../lib/cloudinary";

const CONDITIONS = ["NEW", "LIKE_NEW", "VERY_GOOD", "GOOD", "ACCEPTABLE"] as const;
type Condition = (typeof CONDITIONS)[number];

function toCents(input: unknown): number | null {
  if (typeof input === "number") return Number.isFinite(input) ? Math.round(input * 100) : null;
  if (typeof input === "string") {
    const n = Number(input);
    return Number.isFinite(n) ? Math.round(n * 100) : null;
  }
  return null;
}

type UploadedFile = {
  buffer: Buffer;
  mimetype?: string;
  originalname?: string;
};

function uploadBufferToCloudinary(
  file: UploadedFile,
  folder = "booksy/books"
): Promise<string> {
  return new Promise<string>((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        folder,
        resource_type: "image",
        // 원하면 파일명 유지(선택)
        // public_id: file.originalname ? file.originalname.replace(/\.[^/.]+$/, "") : undefined,
      },
      (err: unknown, result?: UploadApiResponse) => {
        if (err || !result) return reject(err);
        resolve(result.secure_url);
      }
    );

    stream.end(file.buffer);
  });
}

export async function createBook(req: Request, res: Response) {
  try {
    const ownerId = (req as any).userId as string | undefined;
    if (!ownerId) return res.status(401).json({ message: "Not authenticated" });

    const { title, author, price, condition } = req.body as {
      title?: string;
      author?: string;
      price?: string | number;
      condition?: Condition;
    };

    if (!title?.trim() || !author?.trim() || price === undefined || !condition) {
      return res.status(400).json({ message: "title, author, price, condition are required." });
    }
    if (!CONDITIONS.includes(condition)) {
      return res.status(400).json({ message: "Invalid condition." });
    }

    const priceCents = toCents(price);
    if (priceCents === null || priceCents < 0) {
      return res.status(400).json({ message: "Invalid price." });
    }

    let coverImageUrl: string | null = null;

    // multer가 넣어준 파일
    const file = (req as any).file as UploadedFile | undefined;

    // (선택) 이미지 mimetype만 허용 - multer fileFilter가 이미 막고 있지만, 서버 쪽에서도 한 번 더 방어
    if (file?.buffer) {
      if (file.mimetype && !file.mimetype.startsWith("image/")) {
        return res.status(400).json({ message: "Cover must be an image file." });
      }
      coverImageUrl = await uploadBufferToCloudinary(file, "booksy/books");
    }

    const result = await pool.query(
      `
      INSERT INTO books (title, author, price_cents, condition, owner_id, cover_image_url)
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING id, title, author, price_cents, condition, status, owner_id, cover_image_url, created_at;
      `,
      [title.trim(), author.trim(), priceCents, condition, ownerId, coverImageUrl]
    );

    return res.status(201).json({ book: result.rows[0] });
  } catch (err) {
    console.error("CREATE_BOOK_ERROR:", err);
    return res.status(500).json({ message: "Server error" });
  }
}

export async function listBooks(_req: Request, res: Response) {
  try {
    const result = await pool.query(
      `
      SELECT
        b.id, b.title, b.author, b.price_cents,
        b.condition, b.status, b.cover_image_url,
        b.owner_id, b.created_at,
        u.username
      FROM books b
      JOIN users u ON u.id = b.owner_id
      WHERE b.status = 'ACTIVE'
      ORDER BY b.created_at DESC
      LIMIT 50;
      `
    );

    return res.json({ books: result.rows });
  } catch (err) {
    console.error("LIST_BOOKS_ERROR:", err);
    return res.status(500).json({ message: "Server error" });
  }
}

export async function listMyBooks(req: Request, res: Response) {
  try {
    const ownerId = (req as any).userId as string | undefined;
    if (!ownerId) return res.status(401).json({ message: "Not authenticated" });

    const result = await pool.query(
      `
      SELECT
        id, title, author, price_cents,
        condition, status, cover_image_url, created_at
      FROM books
      WHERE owner_id = $1
      ORDER BY created_at DESC;
      `,
      [ownerId]
    );

    return res.json({ books: result.rows });
  } catch (err) {
    console.error("LIST_MY_BOOKS_ERROR:", err);
    return res.status(500).json({ message: "Server error" });
  }
}

export async function getBookById(req: Request, res: Response) {
  try {
    const { id } = req.params;

    if (!id) return res.status(400).json({ message: "Missing book id" });

    const result = await pool.query(
      `
      SELECT
        b.id, b.title, b.author, b.price_cents,
        b.condition, b.status, b.cover_image_url,
        b.owner_id, b.created_at,
        u.username
      FROM books b
      JOIN users u ON u.id = b.owner_id
      WHERE b.id = $1
      LIMIT 1;
      `,
      [id]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ message: "Book not found" });
    }

    return res.json({ book: result.rows[0] });
  } catch (err) {
    console.error("GET_BOOK_BY_ID_ERROR:", err);
    return res.status(500).json({ message: "Server error" });
  }
}