
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

// GET - English practice records
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

    const records = await prisma.englishpractice.findMany({
      where: {
        userId,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json({
      success: true,
      data: records,
    });
  } catch (error) {
    console.error("GET ENGLISH ERROR:", error);

    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch English records",
      },
      { status: 500 }
    );
  }
}

// POST - Add English practice
export async function POST(request) {
  try {
    const body = await request.json();

    const userId = Number(body.userId);
    const minutes = Number(body.minutes);

    if (!userId || !body.activity || !minutes || minutes <= 0) {
      return NextResponse.json(
        {
          success: false,
          error: "userId, activity and valid minutes are required",
        },
        { status: 400 }
      );
    }

    const record = await prisma.englishpractice.create({
      data: {
        userId,
        activity: body.activity,
        minutes,
        description: body.description || null,
      },
    });

    return NextResponse.json(
      {
        success: true,
        data: record,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("CREATE ENGLISH ERROR:", error);

    return NextResponse.json(
      {
        success: false,
        error: "Failed to save English practice",
      },
      { status: 500 }
    );
  }
}