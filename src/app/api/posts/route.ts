import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import { getUserFromRequest } from "@/lib/getUserFromToken";
import { z } from "zod";

// 🔹 Schema for Post Creation
const postSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters"),
  content: z.string().optional(),
  comments: z
    .array(
      z.object({
        text: z.string().optional(),
      })
    )
    .optional(),
});

// GET /api/posts
export async function GET() {
  const posts = await prisma.post.findMany({
    include: { author: true, comments: true },
    orderBy: { createdAt: "desc" },
  });
  return NextResponse.json(posts);
}

// POST /api/posts

export async function POST(req: NextRequest) {
  const user = await getUserFromRequest(req);
  if (!user)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  const parsed = postSchema.safeParse(body);
  if (!parsed.success)
    return NextResponse.json(
      { error: parsed.error.issues.map((e) => e.message).join(", ") },
      { status: 400 }
    );

  const { title, content, comments } = parsed.data;

  const post = await prisma.post.create({
    data: {
      title,
      content,
      authorId: user.id,
      comments: comments
        ? {
            create: comments.map((c) => ({
              text: c.text || "",
              userId: user.id,
            })),
          }
        : undefined,
    },
    include: { author: true, comments: true },
  });

  return NextResponse.json(post, { status: 201 });
}
