"use client";
import { useState, useRef, useCallback } from "react";
import { gsap } from "gsap";
import { Loader2, Sparkles, RotateCcw } from "lucide-react";
import { predict, type PredictResult } from "@/lib/api";
import { ResultCard } from "@/components/ui/ResultCard";
import { useHistory } from "@/hooks/useHistory";

const EXAMPLES = [
  {
    headline: "Scientists Discover Ancient Underwater City Off the Coast of Greece",
    article:
      "Marine archaeologists have uncovered a well-preserved ancient settlement 50 meters below the surface near the island of Zakynthos, Greece. The site, estimated to be over 3,000 years old, contains architectural structures, pottery, and artifacts consistent with Bronze Age civilization. The discovery was reported in the Journal of Maritime Archaeology.",
  },
  {
    headline: "SHOCKING: Government Secretly Puts Mind Control Chips in Vaccines!!!",
    article:
      "WAKE UP PEOPLE! Multiple WHISTLEBLOWERS have come forward to reveal the TRUTH about what is REALLY in those so-called vaccines. They are using 5G technology to CONTROL YOUR MIND. Share this before they DELETE IT. The mainstream media is hiding this because they are part of the DEEP STATE conspiracy.",
  },
];

export default function AnalyzePage() {
  const [headline,  setHeadline]  = useState("");
  const [article,   setArticle]   = useState("");
  const [result,    setResult]    = useState<PredictResult | null>(null);
  const [loading,   setLoading]   = useState(false);
  const [error,     setError]     = useState<string | null>(null);
  const formRef   = useRef<HTMLDivElement>(null);
  const { add }   = useHistory();

  const handleSubmit = useCallback(async () => {
    if (!headline.trim()) {
      setError("Please enter a headline.");
      return;
    }
    setError(null);
    setLoading(true);
    setResult(null);

    // Button press animation
    if (formRef.current) {
      gsap.fromTo(formRef.current, { scale: 1 }, { scale: 0.99, yoyo: true, repeat: 1, duration: 0.1 });
    }

    try {
      const res = await predict({ headline: headline.trim(), article: article.trim() });
      setResult(res);
      add({ ...res, headline: headline.trim(), article: article.trim() });
    } catch (err: any) {
      const msg =
        err?.response?.data?.detail ??
        err?.message ??
        "Could not reach the backend. Is it running?";
      setError(msg);
    } finally {
      setLoading(false);
    }
  }, [headline, article, add]);

  const reset = () => {
    setHeadline("");
    setArticle("");
    setResult(null);
    setError(null);
  };

  const loadExample = (ex: typeof EXAMPLES[0]) => {
    setHeadline(ex.headline);
    setArticle(ex.article);
    setResult(null);
    setError(null);
  };

  return (
    <div className="p-6 lg:p-10 max-w-3xl mx-auto space-y-8">
      {/* Header */}
      <div className="space-y-1 animate-fadeUp">
        <h1 className="font-display text-3xl font-bold text-base">Analyze Article</h1>
        <p className="text-muted text-sm">
          Paste a headline and optional article body. Our AI will classify it.
        </p>
      </div>

      {/* Example buttons */}
      <div className="flex gap-2 flex-wrap">
        {EXAMPLES.map((ex, i) => (
          <button
            key={i}
            onClick={() => loadExample(ex)}
            className="rounded-lg border border-base bg-surface px-3 py-1.5 text-xs text-muted hover:border-[--accent]/40 hover:text-base transition-all"
          >
            Example {i + 1}
          </button>
        ))}
      </div>

      {/* Form */}
      <div ref={formRef} className="rounded-2xl border border-base bg-surface p-6 space-y-5">
        {/* Headline */}
        <div className="space-y-2">
          <label className="text-xs font-mono uppercase tracking-widest text-muted">
            Headline <span className="text-danger">*</span>
          </label>
          <input
            value={headline}
            onChange={(e) => setHeadline(e.target.value)}
            placeholder="Enter the news headline…"
            className="w-full rounded-xl border border-base bg-app px-4 py-3 text-sm text-base placeholder:text-muted/60 focus:border-[--accent]/60 focus:outline-none transition-colors"
          />
        </div>

        {/* Article */}
        <div className="space-y-2">
          <label className="text-xs font-mono uppercase tracking-widest text-muted">
            Article Body <span className="text-muted/50">(optional)</span>
          </label>
          <textarea
            value={article}
            onChange={(e) => setArticle(e.target.value)}
            placeholder="Paste the article content here for better accuracy…"
            rows={6}
            className="w-full rounded-xl border border-base bg-app px-4 py-3 text-sm text-base placeholder:text-muted/60 focus:border-[--accent]/60 focus:outline-none transition-colors resize-none"
          />
        </div>

        {/* Error */}
        {error && (
          <div className="rounded-lg border border-danger/30 bg-danger/10 px-4 py-3 text-sm text-danger">
            {error}
          </div>
        )}

        {/* Actions */}
        <div className="flex gap-3">
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-[--accent] px-6 py-3 font-display font-semibold text-ink-950 text-sm hover:brightness-110 disabled:opacity-60 disabled:cursor-not-allowed transition-all"
          >
            {loading ? (
              <><Loader2 className="h-4 w-4 animate-spin" /> Analyzing…</>
            ) : (
              <><Sparkles className="h-4 w-4" /> Analyze</>
            )}
          </button>
          {(headline || article || result) && (
            <button
              onClick={reset}
              className="flex items-center gap-2 rounded-xl border border-base bg-surface px-4 py-3 text-sm text-muted hover:text-base transition-all"
            >
              <RotateCcw className="h-4 w-4" />
            </button>
          )}
        </div>
      </div>

      {/* Result */}
      {result && <ResultCard result={result} headline={headline} />}
    </div>
  );
}
