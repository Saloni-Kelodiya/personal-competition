import { prisma } from "@/lib/prisma";
import { getCurrentUserId } from "@/lib/auth";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const userId = await getCurrentUserId();
    if (!userId) return NextResponse.json({ success: false, error: "Not authenticated" }, { status: 401 });

    const records = await prisma.englishpractice.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ success: true, data: records });
  } catch (error) {
    console.error("GET ENGLISH ERROR:", error);
    return NextResponse.json({ success: false, error: "Failed to fetch English records" }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const userId = await getCurrentUserId();
    if (!userId) return NextResponse.json({ success: false, error: "Not authenticated" }, { status: 401 });

    const body = await request.json();
    const minutes = Number(body.minutes);

    if (!body.activity || !Number.isFinite(minutes) || minutes <= 0) {
      return NextResponse.json({ success: false, error: "activity and valid minutes are required" }, { status: 400 });
    }

    const record = await prisma.englishpractice.create({
      data: {
        userId,
        activity: body.activity,
        minutes,
        description: body.description || null,
      },
    });

    return NextResponse.json({ success: true, data: record }, { status: 201 });
  } catch (error) {
    console.error("CREATE ENGLISH ERROR:", error);
    return NextResponse.json({ success: false, error: "Failed to save English practice" }, { status: 500 });
  }
}
