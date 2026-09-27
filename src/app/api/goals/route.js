import { prisma } from "@/lib/prisma";
import { getCurrentUserId } from "@/lib/auth";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const userId = await getCurrentUserId();
    if (!userId) return NextResponse.json({ success: false, error: "Not authenticated" }, { status: 401 });

    const goals = await prisma.goal.findMany({ where: { userId }, orderBy: { createdAt: "desc" } });
    return NextResponse.json({ success: true, data: goals });
  } catch (error) {
    console.error("GET GOALS ERROR:", error);
    return NextResponse.json({ success: false, error: "Failed to fetch goals" }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const userId = await getCurrentUserId();
    if (!userId) return NextResponse.json({ success: false, error: "Not authenticated" }, { status: 401 });

    const body = await request.json();
    if (!body.title || !body.category) {
      return NextResponse.json({ success: false, error: "title and category are required" }, { status: 400 });
    }

    const goal = await prisma.goal.create({
      data: {
        title: body.title,
        description: body.description || null,
        category: body.category,
        progress: 0,
        target: Number(body.target) || 100,
        userId,
        deadline: body.deadline ? new Date(body.deadline) : null,
      },
    });

    return NextResponse.json({ success: true, data: goal }, { status: 201 });
  } catch (error) {
    console.error("CREATE GOAL ERROR:", error);
    return NextResponse.json({ success: false, error: "Failed to create goal" }, { status: 500 });
  }
}
