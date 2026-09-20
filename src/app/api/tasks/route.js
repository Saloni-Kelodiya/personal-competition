import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

// GET - user's tasks
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

    const tasks = await prisma.task.findMany({
      where: {
        userId,
      },
      orderBy: {
        date: "desc",
      },
    });

    return NextResponse.json({
      success: true,
      data: tasks,
    });
  } catch (error) {
    console.error("GET TASKS ERROR:", error);

    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch tasks",
      },
      { status: 500 }
    );
  }
}

// POST - create a new task
export async function POST(request) {
  try {
    const body = await request.json();

    const {
      title,
      category,
      xp,
      date,
      userId,
    } = body;

    if (!title || !category || !userId || !date) {
      return NextResponse.json(
        {
          success: false,
          error: "title, category, date and userId are required",
        },
        { status: 400 }
      );
    }

    const task = await prisma.task.create({
      data: {
        title,
        category,
        xp: xp !== undefined ? Number(xp) : 0,
        date: new Date(date),
        userId: Number(userId),
      },
    });

    return NextResponse.json(
      {
        success: true,
        data: task,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("CREATE TASK ERROR:", error);

    return NextResponse.json(
      {
        success: false,
        error: "Failed to create task",
      },
      { status: 500 }
    );
  }
}