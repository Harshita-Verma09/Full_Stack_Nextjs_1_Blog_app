// //3_blog_app\src\app\api\auth\login\route.ts

// import { prisma } from "@/lib/prisma";
// import { comparePassword, generateToken } from "@/lib/auth";
// import { NextResponse } from "next/server";

// export async function POST(req: Request) {
//   const { email, password } = await req.json();

//   const user = await prisma.user.findUnique({ where: { email } });
//   if (!user) {
//     return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
//   }

  

//   const valid = await comparePassword(password, user.password);
//   if (!valid) {
//     return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
//   }

//   const token = generateToken({ id: user.id, email: user.email });

//   return NextResponse.json({ token });
// }








// // src/app/api/auth/login/route.ts
// import { prisma } from "@/lib/prisma";
// import { comparePassword, generateToken } from "@/lib/auth";
// import { NextResponse } from "next/server";

// export async function POST(req: Request) {
//   try {
//     const { email, password } = await req.json();

//     if (!email || !password) {
//       return NextResponse.json({ error: "Missing fields" }, { status: 400 });
//     }

//     const user = await prisma.user.findUnique({ where: { email } });
//     if (!user) {
//       return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
//     }

//     const valid = await comparePassword(password, user.password);
//     if (!valid) {
//       return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
//     }

//     const token = generateToken({ id: user.id, email: user.email });

//     return NextResponse.json({ token });
//   } catch (err: unknown) {
//     console.error("Login error:", err);
//     return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
//   }
// }










// src/app/api/auth/login/route.ts
import { prisma } from "@/lib/prisma";
import { comparePassword, generateToken } from "@/lib/auth";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
    }

    const valid = await comparePassword(password, user.password);
    if (!valid) {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
    }

    const token = generateToken({ id: user.id, email: user.email });

    return NextResponse.json({ token }, { status: 200 });
  } catch (err) {
    console.error("Login error:", err);
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}
