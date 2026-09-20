import { AppData, Task, TaskCategory } from "@/types";
import { getLevelProgress } from "./xp";
import { updateStreak } from "./streak";
import { checkAchievements } from "./achievements";

export function addTask(
  data: AppData,
  title: string,
  category: TaskCategory,
  xp: number
): AppData {
  const today = new Date()
    .toISOString()
    .split("T")[0];

  const newTask: Task = {
    id: `task-${Date.now()}`,
    title,
    category,
    completed: false,
    xp,
    date: today,
  };

  return {
    ...data,
    tasks: [
      ...data.tasks,
      newTask,
    ],
  };
}

export function toggleTask(
  data: AppData,
  taskId: string
): AppData {
  const task = data.tasks.find(
    (item) => item.id === taskId
  );

  if (!task) {
    return data;
  }

  const isCompleting = !task.completed;

  const updatedTasks = data.tasks.map(
    (item) => {
      if (item.id !== taskId) {
        return item;
      }

      return {
        ...item,

        completed: isCompleting,

        completedAt: isCompleting
          ? new Date().toISOString()
          : undefined,
      };
    }
  );

  /*
   * XP
   */

  const xpChange = isCompleting
    ? task.xp
    : -task.xp;

  const newXP = Math.max(
    0,
    data.stats.xp + xpChange
  );

  /*
   * Completed task count
   */

  const completedChange =
    isCompleting ? 1 : -1;

  const completedTasks = Math.max(
    0,
    data.stats.completedTasks +
      completedChange
  );

  /*
   * Streak
   */

  let streak = {
    currentStreak:
      data.stats.currentStreak,

    longestStreak:
      data.stats.longestStreak,

    lastActiveDate:
      data.stats.lastActiveDate,
  };

  if (isCompleting) {
    streak = updateStreak(
      data.stats.currentStreak,
      data.stats.longestStreak,
      data.stats.lastActiveDate
    );
  }

  /*
   * Stats
   */

  const updatedStats = {
    ...data.stats,

    xp: newXP,

    level:
      getLevelProgress(newXP).level,

    completedTasks,

    currentStreak:
      streak.currentStreak,

    longestStreak:
      streak.longestStreak,

    lastActiveDate:
      streak.lastActiveDate,
  };

  /*
   * Achievements
   */

  const updatedAchievements =
    checkAchievements(
      data.achievements,
      updatedStats
    );

  return {
    ...data,

    tasks: updatedTasks,

    stats: updatedStats,

    achievements:
      updatedAchievements,
  };
}