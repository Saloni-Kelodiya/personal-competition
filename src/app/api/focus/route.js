import { prisma } from "@/lib/prisma";
import { getCurrentUserId } from "@/lib/auth";
import { NextResponse } from "next/server";

const FOCUS_XP = 5;

export async function POST(request) {
  try {
    const userId = await getCurrentUserId();

    if (!userId) {
      return NextResponse.json(
        { success: false, error: "Not authenticated" },
        { status: 401 }
      );
    }

    let body = {};
    try {
      body = await request.json();
    } catch {
      // No request body is required.
    }

    const minutes = Number(body.minutes ?? 5);

    if (!Number.isFinite(minutes) || minutes <= 0) {
      return NextResponse.json(
        { success: false, error: "Valid minutes are required" },
        { status: 400 }
      );
    }

    const result = await prisma.$transaction(async (tx) => {
      const currentStats = await tx.userstats.upsert({
        where: { userId },
        update: {},
        create: { userId },
      });

      const xp = currentStats.xp + FOCUS_XP;
      const level = Math.floor(xp / 100) + 1;

      const stats = await tx.userstats.update({
        where: { userId },
        data: {
          xp,
          level,
          totalFocusMinutes: {
            increment: minutes,
          },
        },
      });

      return stats;
    });

    return NextResponse.json({
      success: true,
      message: `Focus session saved: +${FOCUS_XP} XP and +${minutes} minutes`,
      data: result,
    });
  } catch (error) {
    console.error("SAVE FOCUS ERROR:", error);

    return NextResponse.json(
      { success: false, error: "Failed to save focus session" },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const userId = await getCurrentUserId();

    if (!userId) {
      return NextResponse.json(
        { success: false, error: "Not authenticated" },
        { status: 401 }
      );
    }

    const stats = await prisma.userstats.findUnique({
      where: { userId },
      select: { totalFocusMinutes: true },
    });

    return NextResponse.json({
      success: true,
      data: { totalFocusMinutes: stats?.totalFocusMinutes ?? 0 },
    });
  } catch (error) {
    console.error("GET FOCUS ERROR:", error);

    return NextResponse.json(
      { success: false, error: "Failed to fetch focus minutes" },
      { status: 500 }
    );
  }
}
