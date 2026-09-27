import { prisma } from "@/lib/prisma";
import { getCurrentUserId } from "@/lib/auth";
import { NextResponse } from "next/server";

const FOCUS_XP = 5;

const defaultAchievements = [
  { title: "First Step", description: "Complete your first task", icon: "🎯" },
  { title: "100 XP", description: "Reach 100 XP", icon: "⭐" },
  { title: "7 Day Streak", description: "Maintain a 7 day streak", icon: "🔥" },
  { title: "10 Tasks", description: "Complete 10 tasks", icon: "🏆" },
];

async function ensureAchievements(tx, userId) {
  for (const achievement of defaultAchievements) {
    const existing = await tx.userachievement.findFirst({ where: { userId, title: achievement.title } });
    if (!existing) await tx.userachievement.create({ data: { ...achievement, userId } });
  }
}

export async function POST(request) {
  try {
    const userId = await getCurrentUserId();
    if (!userId) return NextResponse.json({ success: false, error: "Not authenticated" }, { status: 401 });

    let body = {};
    try { body = await request.json(); } catch {}
    const minutes = Number(body.minutes ?? 5);

    if (!Number.isFinite(minutes) || minutes <= 0) {
      return NextResponse.json({ success: false, error: "Valid minutes are required" }, { status: 400 });
    }

    const result = await prisma.$transaction(async (tx) => {
      const currentStats = await tx.userstats.upsert({ where: { userId }, update: {}, create: { userId } });
      const xp = currentStats.xp + FOCUS_XP;
      const level = Math.floor(xp / 100) + 1;

      const stats = await tx.userstats.update({
        where: { userId },
        data: { xp, level, totalFocusMinutes: { increment: minutes } },
      });

      await ensureAchievements(tx, userId);

      if (xp >= 100) {
        await tx.userachievement.updateMany({ where: { userId, title: "100 XP", unlocked: false }, data: { unlocked: true, unlockedAt: new Date() } });
      }

      return stats;
    });

    return NextResponse.json({ success: true, message: `Focus session saved: +${FOCUS_XP} XP and +${minutes} minutes`, data: result });
  } catch (error) {
    console.error("SAVE FOCUS ERROR:", error);
    return NextResponse.json({ success: false, error: "Failed to save focus session" }, { status: 500 });
  }
}

export async function GET() {
  try {
    const userId = await getCurrentUserId();
    if (!userId) return NextResponse.json({ success: false, error: "Not authenticated" }, { status: 401 });

    const stats = await prisma.userstats.findUnique({ where: { userId }, select: { totalFocusMinutes: true } });
    return NextResponse.json({ success: true, data: { totalFocusMinutes: stats?.totalFocusMinutes ?? 0 } });
  } catch (error) {
    console.error("GET FOCUS ERROR:", error);
    return NextResponse.json({ success: false, error: "Failed to fetch focus minutes" }, { status: 500 });
  }
}
