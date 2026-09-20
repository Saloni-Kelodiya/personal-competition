"use client";

import { Task } from "@/types";
import TaskItem from "./TaskItem";

interface TaskListProps {
  tasks: Task[];
  onToggle: (taskId: string) => void;
}

export default function TaskList({
  tasks,
  onToggle,
}: TaskListProps) {
  if (tasks.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-slate-700 p-8 text-center">
        <p className="text-slate-400">
          No tasks for today.
        </p>

        <p className="mt-1 text-sm text-slate-600">
          Add a task and start competing with yourself.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {tasks.map((task) => (
        <TaskItem
          key={task.id}
          task={task}
          onToggle={onToggle}
        />
      ))}
    </div>
  );
}