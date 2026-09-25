import { prisma } from "@/lib/prisma";
import { getCurrentUserId } from "@/lib/auth";
import { NextResponse } from "next/server";

const FOCUS_XP = 5;
const FOCUS_MINUTES = 5;

export async function POST() {
  try {
    const userId = await getCurrentUserId();

    if (!userId) {
      return NextResponse.json(
        { success: false, error: "Not authenticated" },
        { status: 401 }
      );
    }

    const stats = await prisma.userstats.upsert({
      where: { userId },
      update: {
        xp: { increment: FOCUS_XP },
        totalFocusMinutes: { increment: FOCUS_MINUTES },
      },
      create: {
        userId,
        xp: FOCUS_XP,
        level: 1,
        totalFocusMinutes: FOCUS_MINUTES,
      },
    });

    return NextResponse.json({ success: true, data: stats });
  } catch (error) {
    console.error("COMPLETE FOCUS SESSION ERROR:", error);
    return NextResponse.json(
      { success: false, error: "Failed to save focus session" },
      { status: 500 }
    );
  }
}
