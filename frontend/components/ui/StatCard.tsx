"use client";
interface Props {
  label: string;
  value: string | number;
  sub?: string;
  accent?: string;
}

export function StatCard({ label, value, sub, accent = "text-[--accent]" }: Props) {
  return (
    <div className="rounded-2xl border border-base bg-surface p-5 space-y-1">
      <p className="text-xs text-muted uppercase tracking-widest font-mono">{label}</p>
      <p className={`font-display text-3xl font-bold ${accent}`}>{value}</p>
      {sub && <p className="text-xs text-muted">{sub}</p>}
    </div>
  );
}
