// // //3_blog_app\src\app\api\posts\[id]\route.ts

// // import { prisma } from "@/lib/prisma";
// // import { NextResponse } from "next/server";
// // import { getUserFromRequest } from "@/lib/getUserFromToken";
// // import { z } from "zod";

// // // 🔹 Schema for Updating Post
// // const updatePostSchema = z.object({
// //   title: z.string().min(3, "Title must be at least 3 characters").optional(),
// //   content: z.string().optional(),
// // });

// // // GET single post
// // export async function GET(_: Request, { params }: { params: { id: string } }) {
// //   const post = await prisma.post.findUnique({
// //     where: { id: params.id },
// //     include: { author: true, comments: true },
// //   });
// //   if (!post) {
// //     return NextResponse.json({ error: "Post not found" }, { status: 404 });
// //   }
// //   return NextResponse.json(post);
// // }

// // // UPDATE post
// // export async function PUT(req: Request, { params }: { params: { id: string } }) {
// //   const user = await getUserFromRequest(req);
// //   if (!user) {
// //     return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
// //   }

// //   const post = await prisma.post.findUnique({ where: { id: params.id } });
// //   if (!post || post.authorId !== user.id) {
// //     return NextResponse.json({ error: "Not allowed" }, { status: 403 });
// //   }

// //   const body = await req.json();
// //   const parsed = updatePostSchema.safeParse(body);
// //   if (!parsed.success) {
// //     return NextResponse.json(
// //       { error: parsed.error.issues.map(e => e.message).join(", ") },
// //       { status: 400 }
// //     );
// //   }

// //   const updateUser = await prisma.post.update({
// //     where: { id: params.id },
// //     data: parsed.data,
// //     include: { author: true, comments: true },
// //   });

// //   return NextResponse.json(updateUser);
// // }

// // // DELETE post
// // export async function DELETE(req: Request, { params }: { params: { id: string } }) {
// //   const user = await getUserFromRequest(req);
// //   if (!user) {
// //     return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
// //   }

// //   const post = await prisma.post.findUnique({ where: { id: params.id } });
// //   if (!post || post.authorId !== user.id) {
// //     return NextResponse.json({ error: "Not allowed" }, { status: 403 });
// //   }

// //   await prisma.post.delete({ where: { id: params.id } });
// //   return NextResponse.json({ success: true });
// // }

// //3_blog_app/src/app/api/posts/[id]/route.ts
// import { prisma } from "@/lib/prisma";
// import { NextResponse, NextRequest } from "next/server";
// import { requireAuth } from "@/lib/middleware";
// import { z } from "zod";

// // 🔹 Schema for Updating Post + Adding Comments
// const updatePostSchema = z.object({
//   title: z.string().min(3, "Title must be at least 3 characters").optional(),
//   content: z.string().optional(),
//   comments: z
//     .array(z.object({ text: z.string().min(1, "Comment cannot be empty") }))
//     .optional(),
// });

// // 🔹 GET single post (public)
// export async function GET(_: Request, { params }: { params: { id: string } }) {
//   const post = await prisma.post.findUnique({
//     where: { id: params.id },
//     include: { author: true, comments: { include: { user: true } } },
//   });

//   if (!post) {
//     return NextResponse.json({ error: "Post not found" }, { status: 404 });
//   }

//   return NextResponse.json(post);
// }

// // 🔹 UPDATE post (PUT) - protected
// export async function PUT(
//   req: Request,
//   { params }: { params: { id: string } }
// ) {
//   try {
//     // ✅ Get user via middleware
//     const user = await requireAuth(req as NextRequest);

//     const post = await prisma.post.findUnique({ where: { id: params.id } });
//     if (!post || post.authorId !== user.id) {
//       return NextResponse.json({ error: "Not allowed" }, { status: 403 });
//     }

//     const body = await req.json();
//     const parsed = updatePostSchema.safeParse(body);
//     if (!parsed.success) {
//       return NextResponse.json(
//         { error: parsed.error.issues.map((e) => e.message).join(", ") },
//         { status: 400 }
//       );
//     }

//     const updatedPost = await prisma.post.update({
//       where: { id: params.id },
//       data: {
//         title: parsed.data.title,
//         content: parsed.data.content,
//         comments: parsed.data.comments
//           ? {
//               create: parsed.data.comments.map((c) => ({
//                 text: c.text,
//                 userId: user.id,
//               })),
//             }
//           : undefined,
//       },
//       include: { author: true, comments: { include: { user: true } } },
//     });

//     return NextResponse.json(updatedPost);
//   } catch (err) {
//     return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
//   }
// }

// // 🔹 DELETE post - protected
// export async function DELETE(
//   req: Request,
//   { params }: { params: { id: string } }
// ) {
//   try {
//     const user = await requireAuth(req as NextRequest);

//     const post = await prisma.post.findUnique({ where: { id: params.id } });
//     if (!post || post.authorId !== user.id) {
//       return NextResponse.json({ error: "Not allowed" }, { status: 403 });
//     }

//     await prisma.post.delete({ where: { id: params.id } });
//     return NextResponse.json({ success: true });
//   } catch (err) {
//     return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
//   }
// }





import { prisma } from "@/lib/prisma";
import { NextResponse, NextRequest } from "next/server";
import { requireAuth } from "@/lib/middleware";
import { z } from "zod";

const updatePostSchema = z.object({
  title: z.string().min(3).optional(),
  content: z.string().optional(),
  comments: z.array(z.object({ text: z.string().min(1) })).optional(),
});

// Helper to extract ID from URL
function getIdFromRequest(request: NextRequest) {
  const parts = request.nextUrl.pathname.split("/");
  return parts[parts.length - 1]; // last part is the ID
}

// GET single post
export async function GET(request: NextRequest) {
  const id = getIdFromRequest(request);
  const post = await prisma.post.findUnique({
    where: { id },
    include: { author: true, comments: { include: { user: true } } },
  });
  if (!post) return NextResponse.json({ error: "Post not found" }, { status: 404 });
  return NextResponse.json(post);
}

// PUT update post
export async function PUT(request: NextRequest) {
  try {
    const user = await requireAuth(request);
    const id = getIdFromRequest(request);

    const post = await prisma.post.findUnique({ where: { id } });
    if (!post || post.authorId !== user.id) return NextResponse.json({ error: "Not allowed" }, { status: 403 });

    const body = await request.json();
    const parsed = updatePostSchema.safeParse(body);
    if (!parsed.success) return NextResponse.json({ error: parsed.error.issues.map(e => e.message).join(", ") }, { status: 400 });

    const updatedPost = await prisma.post.update({
      where: { id },
      data: {
        title: parsed.data.title,
        content: parsed.data.content,
        comments: parsed.data.comments
          ? { create: parsed.data.comments.map(c => ({ text: c.text, userId: user.id })) }
          : undefined,
      },
      include: { author: true, comments: { include: { user: true } } },
    });

    return NextResponse.json(updatedPost);
  } catch (err) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
}

// DELETE post
export async function DELETE(request: NextRequest) {
  try {
    const user = await requireAuth(request);
    const id = getIdFromRequest(request);

    const post = await prisma.post.findUnique({ where: { id } });
    if (!post || post.authorId !== user.id) return NextResponse.json({ error: "Not allowed" }, { status: 403 });

    await prisma.post.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (err) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
}
