"use client";
import { Brain, Github, ExternalLink } from "lucide-react";

const STACK = [
  { layer: "Frontend",  items: ["Next.js 14 (App Router)", "React 18", "Tailwind CSS", "GSAP"] },
  { layer: "Backend",   items: ["Python FastAPI", "Hugging Face Transformers", "scikit-learn"] },
  { layer: "Inference", items: ["BERT / RoBERTa fine-tuned", "Linguistic heuristics", "Confidence blending"] },
  { layer: "Deployment", items: ["Frontend → Vercel", "Backend → Render / Railway"] },
];

export default function AboutPage() {
  return (
    <div className="p-6 lg:p-10 max-w-2xl mx-auto space-y-10">
      {/* Hero */}
      <div className="rounded-2xl border border-base bg-surface p-8 space-y-4">
        <div className="flex items-center gap-3">
          <div className="rounded-xl bg-[--accent]/10 p-3">
            <Brain className="h-7 w-7 text-[--accent]" />
          </div>
          <div>
            <h1 className="font-display text-2xl font-bold text-base">VeritAI</h1>
            <p className="text-xs text-muted font-mono">v1.0.0 · Open Source</p>
          </div>
        </div>
        <p className="text-sm text-muted leading-relaxed">
          VeritAI is a production-grade AI platform for detecting misinformation in news articles.
          It combines fine-tuned transformer models with rule-based linguistic analysis to provide
          calibrated Real / Fake / Uncertain classifications with confidence scores.
        </p>
        <div className="flex gap-3">
          <a
            href="https://github.com"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-lg border border-base px-4 py-2 text-xs text-muted hover:text-base hover:border-[--accent]/30 transition-all"
          >
            <Github className="h-3.5 w-3.5" /> GitHub
          </a>
          <a
            href="http://localhost:8000/docs"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-lg border border-base px-4 py-2 text-xs text-muted hover:text-base hover:border-[--accent]/30 transition-all"
          >
            <ExternalLink className="h-3.5 w-3.5" /> API Docs
          </a>
        </div>
      </div>

      {/* How it works */}
      <div className="space-y-4">
        <h2 className="font-display text-xl font-bold text-base">How Detection Works</h2>
        <ol className="space-y-3">
          {[
            "Input is preprocessed — whitespace normalised, truncated to 512 tokens.",
            "A fine-tuned BERT / RoBERTa model classifies the text (Fake vs Real).",
            "Independently, linguistic heuristics score sensational language, credibility signals, excessive capitalisation, and repetitive punctuation.",
            "Both scores are blended (70% model / 30% heuristic) for a final fake-probability.",
            "Thresholds: ≥0.65 → Fake · ≤0.35 → Real · in between → Uncertain.",
          ].map((s, i) => (
            <li key={i} className="flex gap-4 text-sm text-muted">
              <span className="flex-shrink-0 font-mono text-[--accent] font-bold w-6">{i + 1}.</span>
              <span className="leading-relaxed">{s}</span>
            </li>
          ))}
        </ol>
      </div>

      {/* Stack */}
      <div className="space-y-4">
        <h2 className="font-display text-xl font-bold text-base">Tech Stack</h2>
        <div className="grid gap-3 sm:grid-cols-2">
          {STACK.map(({ layer, items }) => (
            <div key={layer} className="rounded-xl border border-base bg-surface p-4 space-y-2">
              <p className="text-xs font-mono uppercase tracking-widest text-[--accent]">{layer}</p>
              <ul className="space-y-1">
                {items.map((i) => (
                  <li key={i} className="text-xs text-muted flex items-center gap-2">
                    <span className="h-1 w-1 rounded-full bg-[--accent]/50 flex-shrink-0" />
                    {i}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* Disclaimer */}
      <div className="rounded-xl border border-warn/20 bg-warn/10 p-4 text-xs text-warn/80 leading-relaxed">
        <strong>Disclaimer:</strong> VeritAI is a research and educational tool. No AI system is
        100% accurate at detecting misinformation. Always cross-reference with trusted fact-checking
        sources such as Snopes, PolitiFact, Reuters Fact Check, or AP Fact Check before drawing conclusions.
      </div>
    </div>
  );
}
