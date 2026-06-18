"use client";
import { useEffect, useRef } from "react";
import Link from "next/link";
import { gsap } from "gsap";
import { ArrowRight, Shield, Zap, History, CheckCircle } from "lucide-react";
import { StatCard } from "@/components/ui/StatCard";
import { useHistory } from "@/hooks/useHistory";

export default function DashboardPage() {
  const heroRef = useRef<HTMLDivElement>(null);
  const { entries } = useHistory();

  const fakeCount      = entries.filter((e) => e.label === "Fake").length;
  const realCount      = entries.filter((e) => e.label === "Real").length;
  const uncertainCount = entries.filter((e) => e.label === "Uncertain").length;

  useEffect(() => {
    if (!heroRef.current) return;
    const els = heroRef.current.querySelectorAll("[data-anim]");
    gsap.fromTo(
      els,
      { opacity: 0, y: 30 },
      { opacity: 1, y: 0, duration: 0.7, stagger: 0.12, ease: "power3.out" }
    );
  }, []);

  const FEATURES = [
    { Icon: Zap,         title: "Real-Time Analysis",   desc: "Transformer-based inference in milliseconds" },
    { Icon: Shield,      title: "Multi-Signal Detection", desc: "Combines NLP models with linguistic heuristics" },
    { Icon: CheckCircle, title: "Confidence Scoring",   desc: "Calibrated confidence with uncertainty flags" },
    { Icon: History,     title: "Analysis History",     desc: "All past analyses stored locally in your browser" },
  ];

  return (
    <div className="p-6 lg:p-10 space-y-10" ref={heroRef}>
      {/* Hero */}
      <div
        data-anim
        className="relative overflow-hidden rounded-3xl bg-ink-950 dark:bg-ink-900 p-8 lg:p-12 border border-ink-800"
        style={{ opacity: 0 }}
      >
        {/* Grid texture */}
        <div className="absolute inset-0 bg-grid-ink opacity-40 pointer-events-none" />
        {/* Glow blob */}
        <div className="absolute -top-20 -right-20 h-72 w-72 rounded-full bg-[--accent]/10 blur-3xl pointer-events-none" />

        <div className="relative space-y-4 max-w-xl">
          <span className="inline-block rounded-full bg-[--accent]/10 px-4 py-1 text-xs font-mono font-semibold text-[--accent] uppercase tracking-widest border border-[--accent]/20">
            AI-Powered · Open Source
          </span>
          <h1 className="font-display text-4xl lg:text-5xl font-extrabold leading-tight text-white">
            Detect Misinformation<br />
            <span className="shimmer-text-hero">Instantly.</span>
          </h1>
          <p className="text-ink-300 text-base leading-relaxed">
            VeritAI uses fine-tuned transformer models combined with linguistic heuristics
            to classify news as Real, Fake, or Uncertain — with a calibrated confidence score.
          </p>
          <Link
            href="/analyze"
            className="inline-flex items-center gap-2 rounded-xl bg-[--accent] px-6 py-3 font-display font-semibold text-white text-sm hover:brightness-110 transition-all"
          >
            Analyze an Article <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>

      {/* Stats */}
      <div data-anim className="grid grid-cols-2 gap-4 lg:grid-cols-4" style={{ opacity: 0 }}>
        <StatCard label="Total Analyzed" value={entries.length}       sub="this session"     />
        <StatCard label="Fake Detected"  value={fakeCount}            sub="flagged articles" accent="text-danger" />
        <StatCard label="Real Verified"  value={realCount}            sub="credible content" accent="text-safe"   />
        <StatCard label="Uncertain"      value={uncertainCount}       sub="needs review"     accent="text-warn"   />
      </div>

      {/* Features */}
      <div data-anim style={{ opacity: 0 }}>
        <h2 className="font-display text-xl font-bold text-base mb-4">How it Works</h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {FEATURES.map(({ Icon, title, desc }) => (
            <div
              key={title}
              className="rounded-2xl border border-base bg-surface p-5 space-y-3 hover:border-[--accent]/40 transition-colors group"
            >
              <div className="inline-flex rounded-lg bg-[--accent]/10 p-2 group-hover:bg-[--accent]/20 transition-colors">
                <Icon className="h-5 w-5 text-[--accent]" />
              </div>
              <div>
                <p className="font-semibold text-base text-sm">{title}</p>
                <p className="text-muted text-xs mt-1 leading-relaxed">{desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
