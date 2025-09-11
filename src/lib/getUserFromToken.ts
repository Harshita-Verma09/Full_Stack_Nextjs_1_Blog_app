
//3_blog_app\src\lib\getUserFromToken.ts
import { prisma } from "@/lib/prisma";
import { verifyToken } from "@/lib/auth";

export async function getUserFromRequest(req: Request) {
  const authHeader = req.headers.get("authorization");
  if (!authHeader) return null;

  const token = authHeader.split(" ")[1];
  if (!token) return null;

  const decoded = verifyToken(token); // { id, email } ya null
  if (!decoded || typeof decoded === "string") return null;

  // Prisma se user fetch karo
  const user = await prisma.user.findUnique({ where: { id: decoded.id } });
  return user; // agar user exist nahi karta toh null
}
