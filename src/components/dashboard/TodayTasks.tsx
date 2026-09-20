"use client";

import Link from "next/link";
import { Task } from "@/types";

interface TodayTasksProps {
  tasks: Task[];
}

export default function TodayTasks({
  tasks,
}: TodayTasksProps) {
  const completedTasks = tasks.filter(
    (task) => task.completed
  ).length;

  return (
    <section className="rounded-3xl border border-slate-800 bg-slate-900 p-6">

      <div className="flex items-center justify-between">

        <div>
          <h2 className="text-xl font-bold">
            Today's Tasks
          </h2>

          <p className="mt-1 text-sm text-slate-400">
            {completedTasks} of {tasks.length} completed
          </p>
        </div>

        <Link
          href="/tasks"
          className="text-sm text-slate-400 hover:text-white"
        >
          View all →
        </Link>

      </div>

      <div className="mt-5 space-y-3">

        {tasks.length === 0 ? (

          <p className="py-5 text-center text-sm text-slate-500">
            No tasks for today.
          </p>

        ) : (

          tasks.slice(0, 5).map((task) => (
            <div
              key={task.id}
              className="flex items-center justify-between rounded-2xl bg-slate-950 p-4"
            >

              <div className="flex items-center gap-3">

                <span
                  className={`flex h-7 w-7 items-center justify-center rounded-full border ${
                    task.completed
                      ? "border-white bg-white text-slate-950"
                      : "border-slate-700"
                  }`}
                >
                  {task.completed ? "✓" : ""}
                </span>

                <div>
                  <p
                    className={`text-sm font-medium ${
                      task.completed
                        ? "text-slate-500 line-through"
                        : "text-white"
                    }`}
                  >
                    {task.title}
                  </p>

                  <p className="mt-1 text-xs capitalize text-slate-500">
                    {task.category}
                  </p>
                </div>

              </div>

              <span className="text-xs font-medium text-slate-400">
                +{task.xp} XP
              </span>

            </div>
          ))

        )}

      </div>

    </section>
  );
}