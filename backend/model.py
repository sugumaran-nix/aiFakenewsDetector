import re
import logging
from typing import Dict, Any

logger = logging.getLogger(__name__)

# Attempt to load transformers; fall back gracefully for cold starts
try:
    from transformers import pipeline, AutoTokenizer, AutoModelForSequenceClassification
    import torch
    TRANSFORMERS_AVAILABLE = True
except ImportError:
    TRANSFORMERS_AVAILABLE = False
    logger.warning("transformers not available — using heuristic fallback")


# ---------------------------------------------------------------------------
# Heuristic / rule-based signals (always available, used as secondary layer)
# ---------------------------------------------------------------------------
SENSATIONAL_WORDS = [
    "shocking", "breaking", "exclusive", "bombshell", "exposed", "leaked",
    "hoax", "conspiracy", "cover-up", "truth", "secret", "hidden", "banned",
    "censored", "they don't want you to know", "wake up", "scam",
    "miracle", "cure", "deep state", "false flag", "illuminati",
    "mainstream media", "fake news", "crisis actor", "staged",
]

CREDIBILITY_SIGNALS = [
    "according to", "researchers found", "study shows", "scientists say",
    "official statement", "confirmed by", "evidence suggests",
    "peer-reviewed", "published in", "reported by",
]

EXCESSIVE_CAPS_RE = re.compile(r"\b[A-Z]{3,}\b")
URL_RE = re.compile(r"https?://\S+")
SPECIAL_CHAR_RE = re.compile(r"[!?]{2,}")


def _heuristic_score(text: str) -> float:
    """
    Returns a 0-1 score: higher = more likely fake.
    """
    lower = text.lower()
    score = 0.0

    # Sensational language
    hits = sum(1 for w in SENSATIONAL_WORDS if w in lower)
    score += min(hits * 0.08, 0.40)

    # Excessive capitalisation
    caps = len(EXCESSIVE_CAPS_RE.findall(text))
    score += min(caps * 0.05, 0.20)

    # Repeated punctuation (!!, ??, ...)
    special = len(SPECIAL_CHAR_RE.findall(text))
    score += min(special * 0.07, 0.14)

    # Very short article is suspicious
    words = text.split()
    if len(words) < 30:
        score += 0.10

    # Credibility signals lower the score
    cred = sum(1 for s in CREDIBILITY_SIGNALS if s in lower)
    score -= min(cred * 0.07, 0.21)

    return max(0.0, min(1.0, score))


# ---------------------------------------------------------------------------
# Transformers-based classifier
# ---------------------------------------------------------------------------
_TRANSFORMER_MODELS = [
    # Lighter model first — works on free-tier inference
    "mrm8488/bert-tiny-finetuned-fake-news-detection",
    # Larger fallback
    "hamzab/roberta-fake-news-classification",
]


class FakeNewsDetector:
    def __init__(self):
        self._classifier = None
        self._model_name = None
        self._load_model()

    def _load_model(self):
        if not TRANSFORMERS_AVAILABLE:
            logger.info("Using heuristic-only mode (no transformers)")
            return
        for name in _TRANSFORMER_MODELS:
            try:
                logger.info(f"Loading model: {name}")
                self._classifier = pipeline(
                    "text-classification",
                    model=name,
                    truncation=True,
                    max_length=512,
                )
                self._model_name = name
                logger.info(f"Model loaded: {name}")
                return
            except Exception as e:
                logger.warning(f"Could not load {name}: {e}")
        logger.warning("All transformer models failed — heuristic-only mode")

    def is_ready(self) -> bool:
        return True  # always ready (may be heuristic-only)

    def _preprocess(self, headline: str, article: str) -> str:
        combined = f"{headline}. {article}" if article else headline
        # Collapse whitespace
        combined = re.sub(r"\s+", " ", combined).strip()
        # Truncate to 512 tokens worth (~2000 chars)
        return combined[:2000]

    def predict(self, headline: str, article: str) -> Dict[str, Any]:
        text = self._preprocess(headline, article)
        heuristic = _heuristic_score(text)

        # --- Transformer path ---
        if self._classifier is not None:
            try:
                raw = self._classifier(text[:512])[0]
                raw_label: str = raw["label"].upper()
                transformer_conf: float = round(float(raw["score"]), 4)

                # Normalise label variants across different model vocabularies
                if any(k in raw_label for k in ["FAKE", "LABEL_1", "NEGATIVE", "0"]):
                    model_is_fake = True
                else:
                    model_is_fake = False

                # Blend: 70% transformer + 30% heuristic
                blended_fake_prob = (
                    (transformer_conf if model_is_fake else 1 - transformer_conf) * 0.70
                    + heuristic * 0.30
                )

                return self._build_response(blended_fake_prob)
            except Exception as e:
                logger.error(f"Transformer inference failed: {e} — falling back")

        # --- Heuristic-only path ---
        return self._build_response(heuristic)

    @staticmethod
    def _build_response(fake_prob: float) -> Dict[str, Any]:
        fake_prob = round(fake_prob, 4)

        if fake_prob >= 0.65:
            label = "Fake"
            confidence = fake_prob
            explanation = (
                "Multiple indicators of misinformation detected: sensational language, "
                "lack of credible sourcing, or unusual text patterns."
            )
        elif fake_prob <= 0.35:
            label = "Real"
            confidence = round(1 - fake_prob, 4)
            explanation = (
                "Content appears credible. Language is measured, sourcing signals are "
                "present, and no strong misinformation markers were found."
            )
        else:
            label = "Uncertain"
            confidence = round(1 - abs(fake_prob - 0.5) * 2, 4)
            explanation = (
                "The model is not confident. Cross-reference with trusted fact-checking "
                "sources such as Snopes, PolitiFact, or AP Fact Check."
            )

        return {
            "label": label,
            "confidence": confidence,
            "explanation": explanation,
        }
