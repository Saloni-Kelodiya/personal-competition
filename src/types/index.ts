export type TaskCategory =
  | "career"
  | "english"
  | "health"
  | "learning"
  | "personal";

export interface Task {
  id: string;
  title: string;
  category: TaskCategory;
  completed: boolean;
  xp: number;
  date: string;
}

export interface Goal {
  id: string;
  title: string;
  description?: string;
  category: TaskCategory;
  progress: number;
  target: number;
  deadline?: string;
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  unlocked: boolean;
  unlockedAt?: string;
}

export interface UserStats {
  xp: number;
  level: number;
  currentStreak: number;
  longestStreak: number;
  lastActiveDate?: string;
  completedTasks: number;
  totalFocusMinutes: number;
}
export interface EnglishStats {
  speakingMinutes: number;
  vocabularyLearned: number;
  readingMinutes: number;
  listeningMinutes: number;
}

export interface CareerStats {
  codingMinutes: number;
  projectsCompleted: number;
  skillsImproved: number;
}

export interface AppData {
  stats: UserStats;
  tasks: Task[];
  goals: Goal[];
  achievements: Achievement[];
  english: EnglishStats;
  career: CareerStats;
}