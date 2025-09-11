import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    await prisma.$connect();
    console.log("✅ MongoDB Connected");
    return NextResponse.json({ message: "MongoDB Connected ✅" });
  } catch (err) {
    console.error("❌ MongoDB Connection Failed:", err);
    return NextResponse.json({ error: "MongoDB Connection Failed" }, { status: 500 });
  }
}
