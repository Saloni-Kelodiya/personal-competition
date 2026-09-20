import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

const achievements = [
  {
    title: "First Step",
    description: "Complete your first task",
    icon: "🎯",
  },
  {
    title: "100 XP",
    description: "Reach 100 XP",
    icon: "⭐",
  },
  {
    title: "7 Day Streak",
    description: "Maintain a 7 day streak",
    icon: "🔥",
  },
  {
    title: "10 Tasks",
    description: "Complete 10 tasks",
    icon: "🏆",
  },
];

export async function POST(request) {
  try {
    const body = await request.json();

    const userId = Number(body.userId);

    if (!userId) {
      return NextResponse.json(
        {
          success: false,
          error: "userId is required",
        },
        { status: 400 }
      );
    }

    const created = [];

    for (const achievement of achievements) {
      const existing =
        await prisma.userachievement.findFirst({
          where: {
            userId,
            title: achievement.title,
          },
        });

      if (!existing) {
        const newAchievement =
          await prisma.userachievement.create({
            data: {
              ...achievement,
              userId,
            },
          });

        created.push(newAchievement);
      }
    }

    return NextResponse.json({
      success: true,
      message: "Achievements initialized",
      data: created,
    });
  } catch (error) {
    console.error(
      "INIT ACHIEVEMENTS ERROR:",
      error
    );

    return NextResponse.json(
      {
        success: false,
        error: "Failed to initialize achievements",
      },
      { status: 500 }
    );
  }
}