import type { Request, Response } from "express";
import { pool } from "../db";
import cloudinary from "../lib/cloudinary";

const CONDITIONS = ["NEW", "LIKE_NEW", "VERY_GOOD", "GOOD", "ACCEPTABLE"] as const;
type Condition = (typeof CONDITIONS)[number];

function toCents(input: unknown): number | null {
  // input이 "12.50" / 12.5 / "12" 등일 수 있으니 처리
  if (typeof input === "number") {
    if (!Number.isFinite(input)) return null;
    return Math.round(input * 100);
  }
  if (typeof input === "string") {
    const n = Number(input);
    if (!Number.isFinite(n)) return null;
    return Math.round(n * 100);
  }
  return null;
}

function uploadBufferToCloudinary(buffer: Buffer, folder = "booksy/books") {
  return new Promise<string>((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { folder, resource_type: "image" },
      (err, result) => {
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
      price?: string | number;     // 프론트에서는 입력값이라 string일 수 있음
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
    const file = (req as any).file as Express.Multer.File | undefined;

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
  } catch (err: any) {
    console.error("CREATE_BOOK_ERROR:", err);
    return res.status(500).json({ message: "Server error" });
  }
}
