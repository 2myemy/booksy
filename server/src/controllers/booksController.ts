import type { Request, Response } from "express";
import type { Multer } from "multer";
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

function uploadBufferToCloudinary(buffer: Buffer, folder = "booksy/books") {
  return new Promise<string>((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      // Cloudinary TS 타입에서 folder가 좁게 잡힐 때가 있어서 안전하게 캐스팅
      ({ folder, resource_type: "image" } as any),
      (err: unknown, result?: UploadApiResponse) => {
        if (err || !result) return reject(err);
        resolve(result.secure_url);
      }
    );
    stream.end(buffer);
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
    type UploadedFile = { buffer: Buffer; mimetype?: string; originalname?: string };
    const file = (req as any).file as UploadedFile | undefined;
    if (file?.buffer) {
      coverImageUrl = await uploadBufferToCloudinary(file.buffer);
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
