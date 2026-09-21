import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

// GET - user's stats
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = Number(searchParams.get("userId"));

    if (!userId) {
      return NextResponse.json(
        { success: false, error: "userId is required" },
        { status: 400 }
      );
    }

    const stats = await prisma.userstats.findUnique({
      where: { userId },
    });

    if (!stats) {
      return NextResponse.json({
        success: true,
        data: {
          userId,
          xp: 0,
          level: 1,
          currentStreak: 0,
          longestStreak: 0,
          completedTasks: 0,
          totalFocusMinutes: 0,
          lastActiveDate: null,
        },
      });
    }

    return NextResponse.json({ success: true, data: stats });
  } catch (error) {
    console.error("GET STATS ERROR:", error);

    return NextResponse.json(
      { success: false, error: "Failed to fetch stats" },
      { status: 500 }
    );
  }
}

// POST - create stats if missing
export async function POST(request) {
  try {
    const body = await request.json();
    const userId = Number(body.userId);

    if (!userId) {
      return NextResponse.json(
        { success: false, error: "userId is required" },
        { status: 400 }
      );
    }

    const stats = await prisma.userstats.upsert({
      where: { userId },
      update: {},
      create: { userId },
    });

    return NextResponse.json({ success: true, data: stats });
  } catch (error) {
    console.error("CREATE STATS ERROR:", error);

    return NextResponse.json(
      { success: false, error: "Failed to create stats" },
      { status: 500 }
    );
  }
}
