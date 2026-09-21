import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { updateStreak } from "@/lib/streak";

export async function PUT(request, { params }) {
  try {
    const { id } = await params;
    const body = await request.json();

    const taskId = Number(id);

    const existingTask = await prisma.task.findUnique({
      where: {
        id: taskId,
      },
    });

    if (!existingTask) {
      return NextResponse.json(
        {
          success: false,
          error: "Task not found",
        },
        { status: 404 }
      );
    }

    // --------------------------------
    // NORMAL TASK UPDATE
    // --------------------------------

    if (body.completed === undefined) {
      const task = await prisma.task.update({
        where: {
          id: taskId,
        },
        data: {
          ...(body.title !== undefined && {
            title: body.title,
          }),

          ...(body.category !== undefined && {
            category: body.category,
          }),

          ...(body.xp !== undefined && {
            xp: Number(body.xp),
          }),

          ...(body.date !== undefined && {
            date: new Date(body.date),
          }),
        },
      });

      return NextResponse.json({
        success: true,
        data: task,
      });
    }

    // --------------------------------
    // ALREADY COMPLETED CHECK
    // --------------------------------

    if (existingTask.completed === true) {
      return NextResponse.json(
        {
          success: false,
          error: "Task is already completed",
        },
        { status: 400 }
      );
    }

    const completed = Boolean(body.completed);

    // --------------------------------
    // ONLY HANDLE COMPLETION
    // --------------------------------

    if (completed === true) {
      const completionDate = new Date();

      const result = await prisma.$transaction(async (tx) => {
        // Complete task
        const task = await tx.task.update({
          where: {
            id: taskId,
          },
          data: {
            completed: true,
          },
        });

        // Get/create user stats
        const currentStats = await tx.userstats.upsert({
          where: {
            userId: existingTask.userId,
          },
          update: {},
          create: {
            userId: existingTask.userId,
          },
        });

        // --------------------------------
        // XP
        // --------------------------------

        const xpToAdd = existingTask.xp;

        const newXP = currentStats.xp + xpToAdd;

        const newLevel = Math.floor(newXP / 100) + 1;

        // --------------------------------
        // COMPLETED TASKS
        // --------------------------------

        const newCompletedTasks =
          currentStats.completedTasks + 1;

        // --------------------------------
        // STREAK SYSTEM
        // --------------------------------

        const streak = updateStreak(
          currentStats.currentStreak,
          currentStats.longestStreak,
          currentStats.lastActiveDate
        );

        const currentStreak = streak.currentStreak;
        const longestStreak = streak.longestStreak;

        // --------------------------------
        // UPDATE STATS
        // --------------------------------

        const stats = await tx.userstats.update({
          where: {
            userId: existingTask.userId,
          },
          data: {
            xp: newXP,
            level: newLevel,
            completedTasks: newCompletedTasks,
            currentStreak,
            longestStreak,
            lastActiveDate: completionDate,
          },
        });
        
        // --------------------------------
// AUTO UNLOCK ACHIEVEMENTS
// --------------------------------

const achievementUpdates = [];

// 1. First Step
if (newCompletedTasks >= 1) {
  const achievement =
    await tx.userachievement.findFirst({
      where: {
        userId: existingTask.userId,
        title: "First Step",
        unlocked: false,
      },
    });

  if (achievement) {
    const updated =
      await tx.userachievement.update({
        where: {
          id: achievement.id,
        },
        data: {
          unlocked: true,
          unlockedAt: completionDate,
        },
      });

    achievementUpdates.push(updated);
  }
}

// 2. 100 XP
if (newXP >= 100) {
  const achievement =
    await tx.userachievement.findFirst({
      where: {
        userId: existingTask.userId,
        title: "100 XP",
        unlocked: false,
      },
    });

  if (achievement) {
    const updated =
      await tx.userachievement.update({
        where: {
          id: achievement.id,
        },
        data: {
          unlocked: true,
          unlockedAt: completionDate,
        },
      });

    achievementUpdates.push(updated);
  }
}

// 3. 7 Day Streak
if (currentStreak >= 7) {
  const achievement =
    await tx.userachievement.findFirst({
      where: {
        userId: existingTask.userId,
        title: "7 Day Streak",
        unlocked: false,
      },
    });

  if (achievement) {
    const updated =
      await tx.userachievement.update({
        where: {
          id: achievement.id,
        },
        data: {
          unlocked: true,
          unlockedAt: completionDate,
        },
      });

    achievementUpdates.push(updated);
  }
}

// 4. 10 Tasks
if (newCompletedTasks >= 10) {
  const achievement =
    await tx.userachievement.findFirst({
      where: {
        userId: existingTask.userId,
        title: "10 Tasks",
        unlocked: false,
      },
    });

  if (achievement) {
    const updated =
      await tx.userachievement.update({
        where: {
          id: achievement.id,
        },
        data: {
          unlocked: true,
          unlockedAt: completionDate,
        },
      });

    achievementUpdates.push(updated);
  }
}
        return {
  task,
  stats,
  achievements: achievementUpdates,
};
      });

      return NextResponse.json({
        success: true,
        message: "Task completed, XP and streak updated",
        data: result,
      });
    }

    return NextResponse.json({
      success: true,
      data: existingTask,
    });
  } catch (error) {
    console.error("COMPLETE TASK ERROR:", error);

    return NextResponse.json(
      {
        success: false,
        error: "Failed to update task",
      },
      { status: 500 }
    );
  }
}

// --------------------------------
// GET SINGLE TASK
// --------------------------------

export async function GET(request, { params }) {
  try {
    const { id } = await params;

    const task = await prisma.task.findUnique({
      where: {
        id: Number(id),
      },
    });

    if (!task) {
      return NextResponse.json(
        {
          success: false,
          error: "Task not found",
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: task,
    });
  } catch (error) {
    console.error("GET TASK ERROR:", error);

    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch task",
      },
      { status: 500 }
    );
  }
}

// --------------------------------
// DELETE TASK
// --------------------------------

export async function DELETE(request, { params }) {
  try {
    const { id } = await params;

    const task = await prisma.task.findUnique({
      where: {
        id: Number(id),
      },
    });

    if (!task) {
      return NextResponse.json(
        {
          success: false,
          error: "Task not found",
        },
        { status: 404 }
      );
    }

    await prisma.task.delete({
      where: {
        id: Number(id),
      },
    });

    return NextResponse.json({
      success: true,
      message: "Task deleted successfully",
    });
  } catch (error) {
    console.error("DELETE TASK ERROR:", error);

    return NextResponse.json(
      {
        success: false,
        error: "Failed to delete task",
      },
      { status: 500 }
    );
  }
}