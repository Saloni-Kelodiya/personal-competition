import { prisma } from "@/lib/prisma";
import { getCurrentUserId } from "@/lib/auth";
import { NextResponse } from "next/server";

async function getOwnedGoal(id, userId) {
  return prisma.goal.findFirst({ where: { id, userId } });
}

export async function GET(request, { params }) {
  try {
    const userId = await getCurrentUserId();
    if (!userId) return NextResponse.json({ success: false, error: "Not authenticated" }, { status: 401 });
    const { id } = await params;
    const goal = await getOwnedGoal(Number(id), userId);
    if (!goal) return NextResponse.json({ success: false, error: "Goal not found" }, { status: 404 });
    return NextResponse.json({ success: true, data: goal });
  } catch (error) {
    console.error("GET SINGLE GOAL ERROR:", error);
    return NextResponse.json({ success: false, error: "Failed to fetch goal" }, { status: 500 });
  }
}

export async function PUT(request, { params }) {
  try {
    const userId = await getCurrentUserId();
    if (!userId) return NextResponse.json({ success: false, error: "Not authenticated" }, { status: 401 });
    const { id } = await params;
    const goalId = Number(id);
    const existing = await getOwnedGoal(goalId, userId);
    if (!existing) return NextResponse.json({ success: false, error: "Goal not found" }, { status: 404 });

    const body = await request.json();
    const goal = await prisma.goal.update({
      where: { id: goalId },
      data: {
        ...(body.title !== undefined && { title: body.title }),
        ...(body.description !== undefined && { description: body.description }),
        ...(body.category !== undefined && { category: body.category }),
        ...(body.progress !== undefined && { progress: Math.max(0, Math.min(Number(body.progress), existing.target)) }),
        ...(body.target !== undefined && { target: Number(body.target) }),
        ...(body.deadline !== undefined && { deadline: body.deadline ? new Date(body.deadline) : null }),
      },
    });

    return NextResponse.json({ success: true, data: goal });
  } catch (error) {
    console.error("UPDATE GOAL ERROR:", error);
    return NextResponse.json({ success: false, error: "Failed to update goal" }, { status: 500 });
  }
}

export async function DELETE(request, { params }) {
  try {
    const userId = await getCurrentUserId();
    if (!userId) return NextResponse.json({ success: false, error: "Not authenticated" }, { status: 401 });
    const { id } = await params;
    const goalId = Number(id);
    const existing = await getOwnedGoal(goalId, userId);
    if (!existing) return NextResponse.json({ success: false, error: "Goal not found" }, { status: 404 });

    await prisma.goal.delete({ where: { id: goalId } });
    return NextResponse.json({ success: true, message: "Goal deleted successfully" });
  } catch (error) {
    console.error("DELETE GOAL ERROR:", error);
    return NextResponse.json({ success: false, error: "Failed to delete goal" }, { status: 500 });
  }
}
