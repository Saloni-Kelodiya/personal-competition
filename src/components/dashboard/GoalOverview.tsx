"use client";

import Link from "next/link";
import { Goal } from "@/types";

interface GoalOverviewProps {
  goals: Goal[];
}

export default function GoalOverview({
  goals,
}: GoalOverviewProps) {
  return (
    <section className="rounded-3xl border border-slate-800 bg-slate-900 p-6">

      <div className="flex items-center justify-between">

        <div>
          <h2 className="text-xl font-bold">
            My Goals
          </h2>

          <p className="mt-1 text-sm text-slate-400">
            Keep moving forward.
          </p>
        </div>

        <Link
          href="/goals"
          className="text-sm text-slate-400 hover:text-white"
        >
          View all →
        </Link>

      </div>

      <div className="mt-5 space-y-5">

        {goals.length === 0 ? (

          <p className="py-5 text-center text-sm text-slate-500">
            No goals yet.
          </p>

        ) : (

          goals.slice(0, 3).map((goal) => {

            const percentage = Math.min(
              100,
              Math.round(
                (goal.progress / goal.target) * 100
              )
            );

            return (
              <div key={goal.id}>

                <div className="mb-2 flex items-center justify-between">

                  <div>
                    <p className="text-sm font-medium">
                      {goal.title}
                    </p>

                    <p className="text-xs capitalize text-slate-500">
                      {goal.category}
                    </p>
                  </div>

                  <span className="text-sm font-semibold">
                    {percentage}%
                  </span>

                </div>

                <div className="h-2 overflow-hidden rounded-full bg-slate-800">

                  <div
                    className="h-full rounded-full bg-white transition-all"
                    style={{
                      width: `${percentage}%`,
                    }}
                  />

                </div>

              </div>
            );
          })

        )}

      </div>

    </section>
  );
}