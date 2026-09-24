import { prisma } from "@/lib/prisma";
import { getCurrentUserId } from "@/lib/auth";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const userId = await getCurrentUserId();

    if (!userId) {
      return NextResponse.json(
        { success: false, error: "Not authenticated" },
        { status: 401 }
      );
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { id: true, name: true, email: true },
    });

    if (!user) {
      return NextResponse.json(
        { success: false, error: "User not found" },
        { status: 404 }
      );
    }

    const [stats, goals, tasks, english, career, achievements] =
      await Promise.all([
        prisma.userstats.findUnique({ where: { userId } }),
        prisma.goal.findMany({ where: { userId }, orderBy: { id: "desc" } }),
        prisma.task.findMany({ where: { userId }, orderBy: { id: "desc" } }),
        prisma.englishpractice.findMany({
          where: { userId },
          orderBy: { createdAt: "desc" },
        }),
        prisma.careerprogress.findMany({
          where: { userId },
          orderBy: { updatedAt: "desc" },
        }),
        prisma.userachievement.findMany({ where: { userId } }),
      ]);

    const totalEnglishMinutes = english.reduce(
      (total, item) => total + item.minutes,
      0
    );

    const completedTasks = tasks.filter((task) => task.completed).length;
    const unlockedAchievements = achievements.filter(
      (item) => item.unlocked
    ).length;

    return NextResponse.json({
      success: true,
      data: {
        user,
        stats: {
          xp: stats?.xp ?? 0,
          level: stats?.level ?? 1,
          currentStreak: stats?.currentStreak ?? 0,
          longestStreak: stats?.longestStreak ?? 0,
          completedTasks: stats?.completedTasks ?? completedTasks,
          totalFocusMinutes: stats?.totalFocusMinutes ?? 0,
        },
        summary: {
          totalGoals: goals.length,
          recentTasks: Math.min(tasks.length, 5),
          recentCompletedTasks: completedTasks,
          totalEnglishMinutes,
          unlockedAchievements,
        },
        goals,
        recentTasks: tasks.slice(0, 5),
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
      { success: false, error: "Failed to fetch dashboard data" },
      { status: 500 }
    );
  }
}
