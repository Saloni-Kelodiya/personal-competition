import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(request, { params }) {
  try {
    const { userId } = await params;

    const stats = await prisma.userstats.findUnique({
      where: {
        userId: Number(userId),
      },
    });

    if (!stats) {
      return NextResponse.json({
        success: true,
        data: {
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

    return NextResponse.json({
      success: true,
      data: stats,
    });
  } catch (error) {
    console.error("GET STATS ERROR:", error);

    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch stats",
      },
      { status: 500 }
    );
  }
}