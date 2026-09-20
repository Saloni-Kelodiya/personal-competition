import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

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

    const achievements =
      await prisma.userachievement.findMany({
        where: {
          userId,
        },
        orderBy: {
          id: "asc",
        },
      });

    return NextResponse.json({
      success: true,
      data: achievements,
    });
  } catch (error) {
    console.error("GET ACHIEVEMENTS ERROR:", error);

    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch achievements",
      },
      { status: 500 }
    );
  }
}