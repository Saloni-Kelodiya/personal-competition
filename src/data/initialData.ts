import { AppData } from "@/types";
const today = new Date().toISOString().split("T")[0];
export const initialData: AppData = {
 stats: {
  xp: 120,
  level: 2,
  currentStreak: 4,
  longestStreak: 9,
  lastActiveDate: today,
  completedTasks: 18,
  totalFocusMinutes: 320,
},

  tasks: [
    {
      id: "task-1",
      title: "Practice JavaScript",
      category: "career",
      completed: true,
      xp: 20,
      date: new Date().toISOString().split("T")[0],
    },
    {
      id: "task-2",
      title: "Practice English speaking",
      category: "english",
      completed: false,
      xp: 15,
      date: new Date().toISOString().split("T")[0],
    },
    {
      id: "task-3",
      title: "Learn one React concept",
      category: "learning",
      completed: false,
      xp: 20,
      date: new Date().toISOString().split("T")[0],
    },
  ],

  goals: [
  {
    id: "goal-1",
    title: "Become a Better Developer",
    description:
      "Improve my programming and software engineering skills.",
    category: "career",
    progress: 35,
    target: 100,
    deadline: "2026-09-30",
  },

  {
    id: "goal-2",
    title: "Improve English",
    description:
      "Improve speaking, vocabulary, reading and listening.",
    category: "english",
    progress: 25,
    target: 100,
    deadline: "2026-10-31",
  },

  {
    id: "goal-3",
    title: "Build Personal Competition App",
    description:
      "Build and complete my own productivity application.",
    category: "learning",
    progress: 20,
    target: 100,
    deadline: "2026-12-31",
  },
],

  achievements: [
  {
    id: "achievement-1",
    title: "First Step",
    description: "Complete your first task.",
    icon: "🚀",
    unlocked: true,
    unlockedAt: today,
  },
  {
    id: "achievement-2",
    title: "3 Day Warrior",
    description: "Maintain a 3-day streak.",
    icon: "🔥",
    unlocked: true,
    unlockedAt: today,
  },
  {
    id: "achievement-3",
    title: "7 Day Warrior",
    description: "Maintain a 7-day streak.",
    icon: "🏆",
    unlocked: false,
  },
  {
    id: "achievement-4",
    title: "XP Hunter",
    description: "Earn 500 XP.",
    icon: "⭐",
    unlocked: false,
  },
  {
    id: "achievement-5",
    title: "Focus Master",
    description: "Complete 60 minutes of focus sessions.",
    icon: "🎯",
    unlocked: false,
  },
],

  english: {
    speakingMinutes: 45,
    vocabularyLearned: 32,
    readingMinutes: 60,
    listeningMinutes: 40,
  },

  career: {
    codingMinutes: 240,
    projectsCompleted: 2,
    skillsImproved: 5,
  },
};