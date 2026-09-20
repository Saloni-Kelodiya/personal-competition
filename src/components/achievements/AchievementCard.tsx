"use client";

import { Achievement } from "@/types";

interface AchievementCardProps {
  achievement: Achievement;
}

export default function AchievementCard({
  achievement,
}: AchievementCardProps) {
  return (
    <div
      className={`rounded-3xl border p-6 transition ${
        achievement.unlocked
          ? "border-slate-600 bg-slate-900"
          : "border-slate-800 bg-slate-950 opacity-60"
      }`}
    >
      <div className="flex items-start gap-4">

        <div
          className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl text-2xl ${
            achievement.unlocked
              ? "bg-slate-800"
              : "bg-slate-900 grayscale"
          }`}
        >
          {achievement.icon}
        </div>

        <div>
          <h3 className="font-bold">
            {achievement.title}
          </h3>

          <p className="mt-1 text-sm text-slate-400">
            {achievement.description}
          </p>

          <p className="mt-3 text-xs font-medium">
            {achievement.unlocked
              ? "✓ Unlocked"
              : "🔒 Locked"}
          </p>
        </div>

      </div>
    </div>
  );
}