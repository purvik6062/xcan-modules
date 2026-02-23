"use client";

export function SkeletonStat() {
  return (
    <div className="rounded-2xl border border-slate-700/50 bg-slate-800/50 p-5 sm:p-6">
      <div className="mb-3 h-6 w-6 rounded bg-slate-700 animate-pulse" />
      <div className="mb-2 h-10 w-20 rounded bg-slate-700 animate-pulse" />
      <div className="h-4 w-32 rounded bg-slate-700 animate-pulse" />
    </div>
  );
}
