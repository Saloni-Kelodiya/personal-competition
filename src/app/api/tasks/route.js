import { prisma } from "@/lib/prisma";
import { getCurrentUserId } from "@/lib/auth";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const userId = await getCurrentUserId();

    if (!userId) {
      return NextResponse.json({ success: false, error: "Not authenticated" }, { status: 401 });
    }

    const tasks = await prisma.task.findMany({
      where: { userId },
      orderBy: { date: "desc" },
    });

    return NextResponse.json({ success: true, data: tasks });
  } catch (error) {
    console.error("GET TASKS ERROR:", error);
    return NextResponse.json({ success: false, error: "Failed to fetch tasks" }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const userId = await getCurrentUserId();

    if (!userId) {
      return NextResponse.json({ success: false, error: "Not authenticated" }, { status: 401 });
    }

    const body = await request.json();
    const { title, category, xp, date } = body;

    if (!title || !category || !date) {
      return NextResponse.json(
        { success: false, error: "title, category and date are required" },
        { status: 400 }
      );
    }

    const task = await prisma.task.create({
      data: {
        title,
        category,
        xp: xp !== undefined ? Number(xp) : 0,
        date: new Date(date),
        userId,
      },
    });

    return NextResponse.json({ success: true, data: task }, { status: 201 });
  } catch (error) {
    console.error("CREATE TASK ERROR:", error);
    return NextResponse.json({ success: false, error: "Failed to create task" }, { status: 500 });
  }
}