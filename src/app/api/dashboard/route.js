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

    const user = await prisma.user.findUnique({
      where: {
        id: userId,
      },
      select: {
        id: true,
        name: true,
        email: true,
      },
    });

    if (!user) {
      return NextResponse.json(
        {
          success: false,
          error: "User not found",
        },
        { status: 404 }
      );
    }

    const stats = await prisma.userstats.findUnique({
      where: {
        userId,
      },
    });

    const goals = await prisma.goal.findMany({
      where: {
        userId,
      },
    });

    const tasks = await prisma.task.findMany({
      where: {
        userId,
      },
      orderBy: {
        id: "desc",
      },
      take: 5,
    });

    const english = await prisma.englishpractice.findMany({
      where: {
        userId,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    const career = await prisma.careerprogress.findMany({
      where: {
        userId,
      },
      orderBy: {
        updatedAt: "desc",
      },
    });

    const achievements = await prisma.userachievement.findMany({
      where: {
        userId,
      },
    });

    const totalEnglishMinutes = english.reduce(
      (total, item) => total + item.minutes,
      0
    );

    const completedTasks = tasks.filter(
      (task) => task.completed
    ).length;

   const unlockedAchievements = achievements.filter(
  (item) => item.unlocked
).length;

    return NextResponse.json({
      success: true,

      data: {
        user,

        stats: {
          xp: stats?.xp || 0,
          level: stats?.level || 1,
          currentStreak: stats?.currentStreak || 0,
          longestStreak: stats?.longestStreak || 0,
          completedTasks: stats?.completedTasks || 0,
          totalFocusMinutes: stats?.totalFocusMinutes || 0,
        },

        summary: {
          totalGoals: goals.length,
          recentTasks: tasks.length,
          recentCompletedTasks: completedTasks,
          totalEnglishMinutes,
          unlockedAchievements,
        },

        goals,

        recentTasks: tasks,

        english: {
          totalMinutes: totalEnglishMinutes,
          recent: english.slice(0, 5),
        },

        career,

        achievements,
      },
    });
  } catch (error) {
    console.error("DASHBOARD ERROR:", error);

    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch dashboard data",
      },
      { status: 500 }
    );
  }
}