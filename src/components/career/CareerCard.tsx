"use client";

interface CareerCardProps {
  title: string;
  value: number;
  unit: string;
  icon: string;
  step: number;
  onUpdate: (amount: number) => void;
}

export default function CareerCard({
  title,
  value,
  unit,
  icon,
  step,
  onUpdate,
}: CareerCardProps) {
  return (
    <div className="rounded-3xl border border-slate-800 bg-slate-900 p-6">

      {/* Header */}

      <div className="flex items-start justify-between">

        <div>
          <p className="text-sm text-slate-400">
            {title}
          </p>

          <div className="mt-2 flex items-baseline gap-2">

            <span className="text-3xl font-bold">
              {value}
            </span>

            <span className="text-sm text-slate-500">
              {unit}
            </span>

          </div>
        </div>

        <span className="text-3xl">
          {icon}
        </span>

      </div>

      {/* Controls */}

      <div className="mt-6 flex gap-3">

        <button
          type="button"
          onClick={() => onUpdate(-step)}
          disabled={value <= 0}
          className="flex-1 rounded-xl border border-slate-700 px-4 py-3 font-medium transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-40"
        >
          −{step}
        </button>

        <button
          type="button"
          onClick={() => onUpdate(step)}
          className="flex-1 rounded-xl bg-white px-4 py-3 font-semibold text-slate-950 transition hover:bg-slate-200"
        >
          +{step}
        </button>

      </div>

    </div>
  );
}