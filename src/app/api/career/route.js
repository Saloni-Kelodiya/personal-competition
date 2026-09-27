import { prisma } from "@/lib/prisma";
import { getCurrentUserId } from "@/lib/auth";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const userId = await getCurrentUserId();
    if (!userId) return NextResponse.json({ success: false, error: "Not authenticated" }, { status: 401 });

    const skills = await prisma.careerprogress.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ success: true, data: skills });
  } catch (error) {
    console.error("GET CAREER ERROR:", error);
    return NextResponse.json({ success: false, error: "Failed to fetch career progress" }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const userId = await getCurrentUserId();
    if (!userId) return NextResponse.json({ success: false, error: "Not authenticated" }, { status: 401 });

    const body = await request.json();
    const skill = String(body.skill || "").trim();
    const category = String(body.category || "").trim();
    const amount = Number(body.amount ?? body.progress ?? 0);

    if (!skill || !category || !Number.isFinite(amount) || amount <= 0) {
      return NextResponse.json({ success: false, error: "skill, category and valid amount are required" }, { status: 400 });
    }

    const record = await prisma.careerprogress.create({
      data: {
        userId,
        skill,
        category,
        progress: amount,
        target: category === "coding" ? 100000 : 1,
      },
    });

    return NextResponse.json({ success: true, data: record }, { status: 201 });
  } catch (error) {
    console.error("CREATE CAREER ERROR:", error);
    return NextResponse.json({ success: false, error: "Failed to save career progress" }, { status: 500 });
  }
}
