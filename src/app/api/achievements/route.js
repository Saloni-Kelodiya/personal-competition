import { prisma } from "@/lib/prisma";
import { getCurrentUserId } from "@/lib/auth";
import { NextResponse } from "next/server";

const defaultAchievements = [
  { title: "First Step", description: "Complete your first task", icon: "🎯" },
  { title: "100 XP", description: "Reach 100 XP", icon: "⭐" },
  { title: "7 Day Streak", description: "Maintain a 7 day streak", icon: "🔥" },
  { title: "10 Tasks", description: "Complete 10 tasks", icon: "🏆" },
];

export async function GET() {
  try {
    const userId = await getCurrentUserId();
    if (!userId) {
      return NextResponse.json({ success: false, error: "Not authenticated" }, { status: 401 });
    }

    for (const achievement of defaultAchievements) {
      const existing = await prisma.userachievement.findFirst({
        where: { userId, title: achievement.title },
      });

      if (!existing) {
        await prisma.userachievement.create({ data: { ...achievement, userId } });
      }
    }

    const achievements = await prisma.userachievement.findMany({
      where: { userId },
      orderBy: { id: "asc" },
    });

    return NextResponse.json({ success: true, data: achievements });
  } catch (error) {
    console.error("GET ACHIEVEMENTS ERROR:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch achievements" },
      { status: 500 }
    );
  }
}
