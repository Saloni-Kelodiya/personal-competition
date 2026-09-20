import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

// GET - user's goals
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

    const goals = await prisma.goal.findMany({
      where: {
        userId,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json({
      success: true,
      data: goals,
    });
  } catch (error) {
    console.error("GET GOALS ERROR:", error);

    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch goals",
      },
      { status: 500 }
    );
  }
}

// POST - create a new goal
export async function POST(request) {
  try {
    const body = await request.json();

    const {
      title,
      description,
      category,
      target,
      deadline,
      userId,
    } = body;

    if (!title || !category || !userId) {
      return NextResponse.json(
        {
          success: false,
          error: "title, category and userId are required",
        },
        { status: 400 }
      );
    }

    const goal = await prisma.goal.create({
      data: {
        title,
        description: description || null,
        category,
        target: target || 100,
        userId: Number(userId),
        deadline: deadline ? new Date(deadline) : null,
      },
    });

    return NextResponse.json(
      {
        success: true,
        data: goal,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("CREATE GOAL ERROR:", error);

    return NextResponse.json(
      {
        success: false,
        error: "Failed to create goal",
      },
      { status: 500 }
    );
  }
}