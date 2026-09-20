"use client";

import { useEffect, useState } from "react";

import TaskForm from "@/components/tasks/TaskForm";
import TaskList from "@/components/tasks/TaskList";

import { initialData } from "@/data/initialData";
import { AppData } from "@/types";

export default function TasksPage() {
  const [data, setData] = useState<AppData>(initialData);
  const [loaded, setLoaded] = useState(false);
  const [loading, setLoading] = useState(false);

  const userId = 1;

  // Load tasks from backend
  useEffect(() => {
    async function loadTasks() {
      try {
        const response = await fetch(
          `/api/tasks?userId=${userId}`
        );

        if (!response.ok) {
          throw new Error("Failed to fetch tasks");
        }

        const result = await response.json();

        if (!result.success) {
          throw new Error(result.error || "Failed to load tasks");
        }

        const apiTasks = result.data || [];

       const formattedTasks = apiTasks.map((task: any) => ({
  id: String(task.id),
  title: task.title,
  category: task.category,
  xp: task.xp,
  date: task.date
    ? task.date.split("T")[0]
    : "",
  completed: task.completed,
}));
        setData((previous) => ({
          ...previous,
          tasks: formattedTasks,
        }));
      } catch (error) {
        console.error("LOAD TASKS ERROR:", error);
      } finally {
        setLoaded(true);
      }
    }

    loadTasks();
  }, []);

  // Add task

const handleAddTask = async (
  title: string,
  category:
    | "career"
    | "english"
    | "health"
    | "learning"
    | "personal",
  xp: number
) => {
  try {
    setLoading(true);

    console.log("Creating task:", {
      userId,
      title,
      category,
      xp,
    });

    const response = await fetch("/api/tasks", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        userId,
        title,
        category,
        xp,
        date: new Date().toISOString().split("T")[0],
      }),
    });

    const result = await response.json();

    console.log("Create task response:", result);

    if (!response.ok || !result.success) {
      throw new Error(
        result.error || "Failed to create task"
      );
    }

    const task = result.data;

    const newTask = {
      id: String(task.id),
      title: task.title,
      category: task.category,
      xp: task.xp,
      date: task.date.split("T")[0],
      completed: task.completed,
    };

    setData((previous) => ({
      ...previous,
      tasks: [
        ...previous.tasks,
        newTask,
      ],
    }));

    console.log("Task created successfully:", newTask);
  } catch (error) {
    console.error("CREATE TASK ERROR:", error);

    alert(
      error instanceof Error
        ? error.message
        : "Failed to create task"
    );
  } finally {
    setLoading(false);
  }
};


  // Toggle task
const handleToggleTask = async (taskId: string) => {
  try {
    const currentTask = data.tasks.find(
      (task) => task.id === taskId
    );

    if (!currentTask) return;

    const newCompleted = !currentTask.completed;

    const response = await fetch(`/api/tasks/${taskId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        completed: newCompleted,
      }),
    });

    const result = await response.json();

    if (!response.ok || !result.success) {
      throw new Error(
        result.error || "Failed to update task"
      );
    }

    // Fresh tasks from database
    const tasksResponse = await fetch(
      `/api/tasks?userId=${userId}`
    );

    const tasksResult = await tasksResponse.json();

    if (!tasksResponse.ok || !tasksResult.success) {
      throw new Error("Failed to refresh tasks");
    }

    const formattedTasks = tasksResult.data.map(
      (task: any) => ({
        id: String(task.id),
        title: task.title,
        category: task.category,
        xp: task.xp,
        date: task.date
          ? task.date.split("T")[0]
          : "",
        completed: task.completed,
      })
    );

    setData((previous) => ({
      ...previous,
      tasks: formattedTasks,
    }));
  } catch (error) {
    console.error("TOGGLE TASK ERROR:", error);

    alert(
      error instanceof Error
        ? error.message
        : "Failed to update task"
    );
  }
};



  // Loading
  if (!loaded) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-slate-950 text-white">
        <p className="text-slate-400">
          Loading tasks...
        </p>
      </main>
    );
  }

  const today = new Date()
    .toISOString()
    .split("T")[0];

  const todayTasks = data.tasks.filter(
    (task) => task.date === today
  );

  return (
    <main className="min-h-screen bg-slate-950 text-white">
      <div className="mx-auto max-w-4xl px-4 py-8">

        {/* Header */}
        <header className="mb-8">
          <p className="text-sm text-slate-400">
            Organize your day
          </p>

          <h1 className="mt-1 text-3xl font-bold">
            My Tasks
          </h1>

          <p className="mt-2 text-slate-400">
            Every completed task makes you
            stronger than yesterday.
          </p>
        </header>

        {/* Add Task */}
        <TaskForm
          onAddTask={handleAddTask}
        />

        {loading && (
          <p className="mt-3 text-sm text-slate-500">
            Saving task...
          </p>
        )}

        {/* Today's Tasks */}
        <section className="mt-8">
          <div className="mb-5 flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold">
                Today's Tasks
              </h2>

              <p className="text-sm text-slate-400">
                {
                  todayTasks.filter(
                    (task) => task.completed
                  ).length
                }{" "}
                of {todayTasks.length} completed
              </p>
            </div>
          </div>

          <TaskList
            tasks={todayTasks}
            onToggle={handleToggleTask}
          />
        </section>

      </div>
    </main>
  );
}

