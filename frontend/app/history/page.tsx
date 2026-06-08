"use client";
import { useState } from "react";
import { ShieldCheck, ShieldAlert, ShieldQuestion, Trash2, ExternalLink } from "lucide-react";
import Link from "next/link";
import { useHistory, type HistoryEntry } from "@/hooks/useHistory";
import { cn } from "@/lib/utils";

const ICON: Record<string, React.ElementType> = {
  Real: ShieldCheck, Fake: ShieldAlert, Uncertain: ShieldQuestion,
};
const COLOR: Record<string, string> = {
  Real: "text-safe", Fake: "text-danger", Uncertain: "text-warn",
};
const BG: Record<string, string> = {
  Real: "bg-safe/10 border-safe/20", Fake: "bg-danger/10 border-danger/20", Uncertain: "bg-warn/10 border-warn/20",
};

function HistoryRow({ entry }: { entry: HistoryEntry }) {
  const Icon  = ICON[entry.label];
  const [exp, setExp] = useState(false);

  return (
    <div
      className="rounded-xl border border-base bg-surface overflow-hidden hover:border-[--accent]/30 transition-colors cursor-pointer"
      onClick={() => setExp((v) => !v)}
    >
      <div className="flex items-center gap-4 p-4">
        <div className={cn("rounded-lg p-2 border", BG[entry.label])}>
          <Icon className={cn("h-4 w-4", COLOR[entry.label])} />
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-medium text-sm text-base truncate">{entry.headline}</p>
          <p className="text-xs text-muted mt-0.5">
            {new Date(entry.timestamp).toLocaleString()}
          </p>
        </div>
        <div className="flex items-center gap-3 flex-shrink-0">
          <span className={cn("font-display font-bold text-sm", COLOR[entry.label])}>
            {entry.label}
          </span>
          <span className="text-xs font-mono text-muted">
            {Math.round(entry.confidence * 100)}%
          </span>
        </div>
      </div>
      {exp && (
        <div className="border-t border-base px-4 pb-4 pt-3 space-y-2">
          {entry.article && (
            <p className="text-xs text-muted line-clamp-3">{entry.article}</p>
          )}
          <p className="text-xs text-muted/80 italic">{entry.explanation}</p>
          <p className="text-xs text-muted/50 font-mono">
            {entry.processing_time_ms}ms · {entry.id}
          </p>
        </div>
      )}
    </div>
  );
}

export default function HistoryPage() {
  const { entries, clear } = useHistory();
  const [filter, setFilter] = useState<"All" | "Real" | "Fake" | "Uncertain">("All");

  const visible = filter === "All" ? entries : entries.filter((e) => e.label === filter);

  return (
    <div className="p-6 lg:p-10 space-y-8 max-w-3xl mx-auto">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-3xl font-bold text-base">History</h1>
          <p className="text-muted text-sm mt-1">{entries.length} analyses stored locally</p>
        </div>
        {entries.length > 0 && (
          <button
            onClick={clear}
            className="flex items-center gap-2 rounded-lg border border-danger/30 bg-danger/10 px-3 py-2 text-xs text-danger hover:bg-danger/20 transition-all"
          >
            <Trash2 className="h-3.5 w-3.5" /> Clear All
          </button>
        )}
      </div>

      {/* Filter pills */}
      {entries.length > 0 && (
        <div className="flex gap-2">
          {(["All", "Real", "Fake", "Uncertain"] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={cn(
                "rounded-full px-3 py-1 text-xs font-mono transition-all border",
                filter === f
                  ? "bg-[--accent]/10 border-[--accent]/30 text-[--accent]"
                  : "border-base text-muted hover:border-[--accent]/20"
              )}
            >
              {f}
            </button>
          ))}
        </div>
      )}

      {visible.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-base bg-surface py-20 space-y-4">
          <ShieldQuestion className="h-12 w-12 text-muted/40" />
          <p className="text-muted text-sm">
            {entries.length === 0 ? "No analyses yet." : "No results for this filter."}
          </p>
          {entries.length === 0 && (
            <Link
              href="/analyze"
              className="rounded-lg bg-[--accent]/10 border border-[--accent]/20 px-4 py-2 text-xs text-[--accent] hover:bg-[--accent]/20 transition-all flex items-center gap-2"
            >
              Start analyzing <ExternalLink className="h-3 w-3" />
            </Link>
          )}
        </div>
      ) : (
        <div className="space-y-3">
          {visible.map((e) => <HistoryRow key={e.id} entry={e} />)}
        </div>
      )}
    </div>
  );
}
