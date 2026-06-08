"use client";
import { useEffect, useRef } from "react";
import { gsap } from "gsap";

interface Props {
  value: number; // 0-1
  label: "Real" | "Fake" | "Uncertain";
}

const COLOR: Record<Props["label"], string> = {
  Real:      "#34e0a1",
  Fake:      "#ff4c6a",
  Uncertain: "#ffb13d",
};

export function ConfidenceMeter({ value, label }: Props) {
  const barRef  = useRef<HTMLDivElement>(null);
  const numRef  = useRef<HTMLSpanElement>(null);
  const color   = COLOR[label];
  const pct     = Math.round(value * 100);

  useEffect(() => {
    if (!barRef.current || !numRef.current) return;
    const tl = gsap.timeline();
    tl.fromTo(
      barRef.current,
      { width: "0%" },
      { width: `${pct}%`, duration: 1.2, ease: "power3.out" }
    );
    tl.fromTo(
      numRef.current,
      { textContent: "0" },
      {
        textContent: String(pct),
        duration: 1.2,
        ease: "power3.out",
        snap: { textContent: 1 },
        onUpdate() {
          if (numRef.current) numRef.current.textContent = numRef.current.textContent + "%";
        },
      },
      "<"
    );
    return () => { tl.kill(); };
  }, [pct]);

  return (
    <div className="w-full space-y-2">
      <div className="flex justify-between items-center">
        <span className="text-xs font-mono text-muted uppercase tracking-widest">
          Confidence
        </span>
        <span ref={numRef} className="font-display font-bold text-lg" style={{ color }}>
          {pct}%
        </span>
      </div>
      <div className="h-2 rounded-full bg-[--border] overflow-hidden">
        <div
          ref={barRef}
          className="h-full rounded-full transition-colors"
          style={{ backgroundColor: color, width: 0 }}
        />
      </div>
    </div>
  );
}
