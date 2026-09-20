import { Achievement, UserStats } from "@/types";

export function checkAchievements(
  achievements: Achievement[],
  stats: UserStats
): Achievement[] {
  return achievements.map((achievement) => {
    if (achievement.unlocked) {
      return achievement;
    }

    let shouldUnlock = false;

    switch (achievement.id) {
      case "achievement-1":
        shouldUnlock = stats.completedTasks >= 1;
        break;

      case "achievement-2":
        shouldUnlock = stats.currentStreak >= 3;
        break;

      case "achievement-3":
        shouldUnlock = stats.currentStreak >= 7;
        break;

      case "achievement-4":
        shouldUnlock = stats.xp >= 500;
        break;

      case "achievement-5":
  shouldUnlock = stats.totalFocusMinutes >= 5;
  break;

      default:
        shouldUnlock = false;
    }

    if (!shouldUnlock) {
      return achievement;
    }

    return {
      ...achievement,
      unlocked: true,
      unlockedAt: new Date().toISOString(),
    };
  });
}