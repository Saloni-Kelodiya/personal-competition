import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

// POST - Save focus session
export async function POST(request) {
  try {
    const body = await request.json();

    const userId = Number(body.userId);
    const minutes = Number(body.minutes);

    if (!userId || !minutes || minutes <= 0) {
      return NextResponse.json(
        {
          success: false,
          error: "Valid userId and minutes are required",
        },
        { status: 400 }
      );
    }

    const stats = await prisma.userstats.upsert({
      where: {
        userId,
      },
      update: {
        totalFocusMinutes: {
          increment: minutes,
        },
      },
      create: {
        userId,
        totalFocusMinutes: minutes,
      },
    });

    return NextResponse.json({
      success: true,
      message: "Focus session saved successfully",
      data: stats,
    });
  } catch (error) {
    console.error("SAVE FOCUS ERROR:", error);

    return NextResponse.json(
      {
        success: false,
        error: "Failed to save focus session",
      },
      { status: 500 }
    );
  }
}

// GET - Get focus minutes
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);

    const userId = Number(searchParams.get("userId"));

    if (!userId) {
      return NextResponse.json(
        {
          success: false,
          error: "userId is required",
        },
        { status: 400 }
      );
    }

    const stats = await prisma.userstats.findUnique({
      where: {
        userId,
      },
      select: {
        totalFocusMinutes: true,
      },
    });

    return NextResponse.json({
      success: true,
      data: {
        totalFocusMinutes: stats?.totalFocusMinutes || 0,
      },
    });
  } catch (error) {
    console.error("GET FOCUS ERROR:", error);

    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch focus minutes",
      },
      { status: 500 }
    );
  }
}