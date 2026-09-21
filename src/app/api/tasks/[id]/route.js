import { prisma } from "@/lib/prisma";
import { getCurrentUserId } from "@/lib/auth";
import { NextResponse } from "next/server";
import { updateStreak } from "@/lib/streak";

async function getOwnedTask(taskId, userId) {
  return prisma.task.findFirst({ where: { id: taskId, userId } });
}

export async function PUT(request, { params }) {
  try {
    const userId = await getCurrentUserId();
    if (!userId) return NextResponse.json({ success: false, error: "Not authenticated" }, { status: 401 });

    const { id } = await params;
    const taskId = Number(id);
    if (!Number.isInteger(taskId)) return NextResponse.json({ success: false, error: "Invalid task id" }, { status: 400 });

    const body = await request.json();
    const existingTask = await getOwnedTask(taskId, userId);

    if (!existingTask) return NextResponse.json({ success: false, error: "Task not found" }, { status: 404 });

    if (body.completed === undefined) {
      const task = await prisma.task.update({
        where: { id: taskId },
        data: {
          ...(body.title !== undefined && { title: body.title }),
          ...(body.category !== undefined && { category: body.category }),
          ...(body.xp !== undefined && { xp: Number(body.xp) }),
          ...(body.date !== undefined && { date: new Date(body.date) }),
        },
      });
      return NextResponse.json({ success: true, data: task });
    }

    if (existingTask.completed === true) {
      return NextResponse.json({ success: false, error: "Task is already completed" }, { status: 400 });
    }

    if (Boolean(body.completed) === true) {
      const completionDate = new Date();

      const result = await prisma.$transaction(async (tx) => {
        const task = await tx.task.update({
          where: { id: taskId },
          data: { completed: true },
        });

        const currentStats = await tx.userstats.upsert({
          where: { userId },
          update: {},
          create: { userId },
        });

        const newXP = currentStats.xp + existingTask.xp;
        const newLevel = Math.floor(newXP / 100) + 1;
        const newCompletedTasks = currentStats.completedTasks + 1;

        const streak = updateStreak(
          currentStats.currentStreak,
          currentStats.longestStreak,
          currentStats.lastActiveDate
        );

        const stats = await tx.userstats.update({
          where: { userId },
          data: {
            xp: newXP,
            level: newLevel,
            completedTasks: newCompletedTasks,
            currentStreak: streak.currentStreak,
            longestStreak: streak.longestStreak,
            lastActiveDate: completionDate,
          },
        });

        const achievementUpdates = [];
        const rules = [
          ["First Step", newCompletedTasks >= 1],
          ["100 XP", newXP >= 100],
          ["7 Day Streak", streak.currentStreak >= 7],
          ["10 Tasks", newCompletedTasks >= 10],
        ];

        for (const [title, unlocked] of rules) {
          if (!unlocked) continue;
          const achievement = await tx.userachievement.findFirst({
            where: { userId, title, unlocked: false },
          });
          if (achievement) {
            const updated = await tx.userachievement.update({
              where: { id: achievement.id },
              data: { unlocked: true, unlockedAt: completionDate },
            });
            achievementUpdates.push(updated);
          }
        }

        return { task, stats, achievements: achievementUpdates };
      });

      return NextResponse.json({
        success: true,
        message: "Task completed, XP and streak updated",
        data: result,
      });
    }

    return NextResponse.json({ success: true, data: existingTask });
  } catch (error) {
    console.error("COMPLETE TASK ERROR:", error);
    return NextResponse.json({ success: false, error: "Failed to update task" }, { status: 500 });
  }
}

export async function GET(request, { params }) {
  try {
    const userId = await getCurrentUserId();
    if (!userId) return NextResponse.json({ success: false, error: "Not authenticated" }, { status: 401 });

    const { id } = await params;
    const taskId = Number(id);
    if (!Number.isInteger(taskId)) return NextResponse.json({ success: false, error: "Invalid task id" }, { status: 400 });

    const task = await getOwnedTask(taskId, userId);
    if (!task) return NextResponse.json({ success: false, error: "Task not found" }, { status: 404 });

    return NextResponse.json({ success: true, data: task });
  } catch (error) {
    console.error("GET TASK ERROR:", error);
    return NextResponse.json({ success: false, error: "Failed to fetch task" }, { status: 500 });
  }
}

export async function DELETE(request, { params }) {
  try {
    const userId = await getCurrentUserId();
    if (!userId) return NextResponse.json({ success: false, error: "Not authenticated" }, { status: 401 });

    const { id } = await params;
    const taskId = Number(id);
    if (!Number.isInteger(taskId)) return NextResponse.json({ success: false, error: "Invalid task id" }, { status: 400 });

    const task = await getOwnedTask(taskId, userId);
    if (!task) return NextResponse.json({ success: false, error: "Task not found" }, { status: 404 });

    await prisma.task.delete({ where: { id: taskId } });
    return NextResponse.json({ success: true, message: "Task deleted successfully" });
  } catch (error) {
    console.error("DELETE TASK ERROR:", error);
    return NextResponse.json({ success: false, error: "Failed to delete task" }, { status: 500 });
  }
}