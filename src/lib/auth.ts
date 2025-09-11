//3_blog_app\src\lib\auth.ts

import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

const JWT_SECRET = process.env.JWT_SECRET!; 

// Hash password
export async function hashPassword(password: string) {
  return await bcrypt.hash(password, 10);
}

// Verify password
export async function comparePassword(password: string, hash: string) {
  return await bcrypt.compare(password, hash);
}

// Generate JWT
export function generateToken(payload: object) {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: "7d" });
}

// Verify JWT
export function verifyToken(token: string) {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch {
    return null;
  }
}
