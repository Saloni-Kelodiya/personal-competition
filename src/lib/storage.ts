import { AppData } from "@/types";
import { initialData } from "@/data/initialData";

const STORAGE_KEY = "personal-competition-data";

export function getStoredData(): AppData {
  if (typeof window === "undefined") {
    return initialData;
  }

  try {
    const storedData = localStorage.getItem(STORAGE_KEY);

    if (!storedData) {
      return initialData;
    }

    const parsedData = JSON.parse(storedData) as Partial<AppData>;

    const mergedData: AppData = {
      ...initialData,
      ...parsedData,

      stats: {
        ...initialData.stats,
        ...parsedData.stats,
      },

      tasks: parsedData.tasks ?? initialData.tasks,
      goals: parsedData.goals ?? initialData.goals,

      achievements: initialData.achievements.map((initialAchievement) => {
        const storedAchievement = parsedData.achievements?.find(
          (achievement) => achievement.id === initialAchievement.id
        );

        return storedAchievement
          ? {
              ...initialAchievement,
              ...storedAchievement,
            }
          : initialAchievement;
      }),

      english: {
        ...initialData.english,
        ...parsedData.english,
      },

      career: {
        ...initialData.career,
        ...parsedData.career,
      },
    };

    return mergedData;
  } catch (error) {
    console.error("Failed to load application data:", error);
    return initialData;
  }
}

export function saveData(data: AppData) {
  if (typeof window === "undefined") {
    return;
  }

  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch (error) {
    console.error("Failed to save application data:", error);
  }
}

export function clearStoredData() {
  if (typeof window === "undefined") {
    return;
  }

  localStorage.removeItem(STORAGE_KEY);
}

export function resetStoredData() {
  if (typeof window === "undefined") {
    return;
  }

  localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify(initialData)
  );
}