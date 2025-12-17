import { Request, Response } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { pool } from "../db";

function signToken(payload: object) {
  const secret = process.env.JWT_SECRET as string;
  if (!secret) throw new Error("JWT_SECRET is not set");
  return jwt.sign(payload, secret, { expiresIn: "7d" });
}

export const register = async (req: Request, res: Response) => {
  console.log("BODY:", req.body);

  try {
    const { email, password, username } = req.body;

    // 1) 입력값 검증
    if (!email || !password || !username) {
      return res
        .status(400)
        .json({ message: "username, email, and password are required." });
    }

    // 2) 중복 체크 (email OR username)
    const existing = await pool.query(
      `SELECT id FROM users WHERE email = $1 OR username = $2`,
      [email, username]
    );
    if (existing.rows.length > 0) {
      return res
        .status(409)
        .json({ message: "Email or username already in use." });
    }

    // 3) 비밀번호 해싱
    const passwordHash = await bcrypt.hash(password, 10);

    // 4) 유저 생성 (name 컬럼 없음 → username 사용)
    const result = await pool.query(
      `
      INSERT INTO users (email, password_hash, username)
      VALUES ($1, $2, $3)
      RETURNING id, email, username, role, is_active, created_at
      `,
      [email, passwordHash, username]
    );

    const user = result.rows[0];

    // 5) 가입 즉시 로그인용 JWT 발급
    // payload는 최소 정보만: userId(+role 추천)
    const token = signToken({ userId: user.id, role: user.role });

    // 6) 프론트에서 바로 저장 가능
    return res.status(201).json({ user, token });
  } catch (err: any) {
    console.error("REGISTER_ERROR:", err);

    // UNIQUE 충돌 잡고 싶으면(이메일/유저네임)
    if (err?.code === "23505") {
      return res
        .status(409)
        .json({ message: "Email or username already in use." });
    }

    return res.status(500).json({ message: "Server error" });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "Email and password are required." });
    }

    const result = await pool.query(
      `SELECT id, email, username, role, is_active, password_hash
       FROM users
       WHERE email = $1`,
      [email]
    );

    const user = result.rows[0];

    // 유저 없거나 비활성 계정
    if (!user || !user.is_active) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const isMatch = await bcrypt.compare(password, user.password_hash);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const token = signToken({ userId: user.id, role: user.role });

    // 프론트에서 유저 정보도 필요하면 같이 내려주는 게 편함
    return res.json({
      token,
      user: {
        id: user.id,
        email: user.email,
        username: user.username,
        role: user.role,
        is_active: user.is_active,
      },
    });
  } catch (err) {
    console.error("LOGIN_ERROR:", err);
    return res.status(500).json({ message: "Server error" });
  }
};
