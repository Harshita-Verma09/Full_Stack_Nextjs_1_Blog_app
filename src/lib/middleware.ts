// src/lib/middleware.ts
import { NextRequest } from "next/server";
import jwt from "jsonwebtoken";

export async function requireAuth(req: NextRequest) {
  const authHeader = req.headers.get("authorization");
  if (!authHeader) throw new Error("Unauthorized");

  const token = authHeader.split(" ")[1];
  const decoded = jwt.verify(token, process.env.JWT_SECRET!);
  if (!decoded || typeof decoded === "string") throw new Error("Unauthorized");

  return decoded; 
}
