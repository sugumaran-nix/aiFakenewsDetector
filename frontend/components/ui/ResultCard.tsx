"use client";
import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ShieldCheck, ShieldAlert, ShieldQuestion, Clock } from "lucide-react";
import { ConfidenceMeter } from "./ConfidenceMeter";
import type { PredictResult } from "@/lib/api";

const CFG = {
  Real: {
    Icon:      ShieldCheck,
    bg:        "bg-safe/10",
    border:    "border-safe/30",
    text:      "text-safe",
    badge:     "bg-safe/20 text-safe",
    glow:      "shadow-[0_0_32px_rgba(52,224,161,0.15)]",
  },
  Fake: {
    Icon:      ShieldAlert,
    bg:        "bg-danger/10",
    border:    "border-danger/30",
    text:      "text-danger",
    badge:     "bg-danger/20 text-danger",
    glow:      "shadow-[0_0_32px_rgba(255,76,106,0.15)]",
  },
  Uncertain: {
    Icon:      ShieldQuestion,
    bg:        "bg-warn/10",
    border:    "border-warn/30",
    text:      "text-warn",
    badge:     "bg-warn/20 text-warn",
    glow:      "shadow-[0_0_32px_rgba(255,177,61,0.15)]",
  },
};

interface Props {
  result: PredictResult;
  headline: string;
}

export function ResultCard({ result, headline }: Props) {
  const cardRef   = useRef<HTMLDivElement>(null);
  const iconRef   = useRef<HTMLDivElement>(null);
  const cfg       = CFG[result.label];
  const { Icon }  = cfg;

  useEffect(() => {
    if (!cardRef.current) return;
    const tl = gsap.timeline();
    tl.fromTo(cardRef.current,  { opacity: 0, y: 24, scale: 0.97 }, { opacity: 1, y: 0, scale: 1, duration: 0.55, ease: "back.out(1.4)" });
    tl.fromTo(iconRef.current,  { scale: 0, rotate: -15 }, { scale: 1, rotate: 0, duration: 0.45, ease: "back.out(2)" }, "-=0.3");
    return () => { tl.kill(); };
  }, [result]);

  return (
    <div
      ref={cardRef}
      className={`rounded-2xl border p-6 space-y-5 ${cfg.bg} ${cfg.border} ${cfg.glow}`}
      style={{ opacity: 0 }}
    >
      {/* Header */}
      <div className="flex items-start gap-4">
        <div
          ref={iconRef}
          className={`flex-shrink-0 rounded-xl p-3 ${cfg.badge}`}
        >
          <Icon className="h-7 w-7" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className={`font-display text-3xl font-bold ${cfg.text}`}>
              {result.label}
            </span>
            <span className={`rounded-full px-2.5 py-0.5 text-xs font-mono font-semibold uppercase tracking-widest ${cfg.badge}`}>
              {result.label === "Uncertain" ? "Low Confidence" : "High Confidence"}
            </span>
          </div>
          <p className="mt-1 text-sm text-muted line-clamp-2 font-medium">{headline}</p>
        </div>
      </div>

      {/* Confidence bar */}
      <ConfidenceMeter value={result.confidence} label={result.label} />

      {/* Explanation */}
      <p className="text-sm text-muted leading-relaxed border-t border-base/40 pt-4">
        {result.explanation}
      </p>

      {/* Processing time */}
      <div className="flex items-center gap-1.5 text-xs text-muted/70">
        <Clock className="h-3.5 w-3.5" />
        Analyzed in {result.processing_time_ms}ms
      </div>
    </div>
  );
}
