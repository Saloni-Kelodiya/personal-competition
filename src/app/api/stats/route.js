import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(request) {
  try {
    const body = await request.json();

    const userId = Number(body.userId);

    if (!userId) {
      return NextResponse.json(
        {
          success: false,
          error: "userId is required",
        },
        { status: 400 }
      );
    }

    const stats = await prisma.userstats.upsert({
      where: {
        userId,
      },
      update: {},
      create: {
        userId,
      },
    });

    return NextResponse.json({
      success: true,
      data: stats,
    });
  } catch (error) {
    console.error("CREATE STATS ERROR:", error);

    return NextResponse.json(
      {
        success: false,
        error: "Failed to create stats",
      },
      { status: 500 }
    );
  }
}