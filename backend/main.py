from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, validator
from typing import Optional
import re
import logging
import time

from model import FakeNewsDetector

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = FastAPI(
    title="AI Fake News Detection API",
    description="Production-grade API for detecting fake news using NLP",
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

detector = FakeNewsDetector()


class PredictRequest(BaseModel):
    headline: str
    article: Optional[str] = ""

    @validator("headline")
    def headline_not_empty(cls, v):
        if not v or not v.strip():
            raise ValueError("Headline cannot be empty")
        return v.strip()

    @validator("article")
    def clean_article(cls, v):
        return (v or "").strip()


class PredictResponse(BaseModel):
    label: str
    confidence: float
    explanation: str
    processing_time_ms: float


@app.get("/", tags=["Health"])
async def root():
    return {
        "status": "ok",
        "service": "AI Fake News Detection API",
        "version": "1.0.0",
    }


@app.get("/health", tags=["Health"])
async def health_check():
    return {"status": "healthy", "model_loaded": detector.is_ready()}


@app.post("/predict", response_model=PredictResponse, tags=["Detection"])
async def predict(request: PredictRequest):
    try:
        start = time.time()
        result = detector.predict(request.headline, request.article)
        elapsed_ms = round((time.time() - start) * 1000, 2)

        return PredictResponse(
            label=result["label"],
            confidence=result["confidence"],
            explanation=result["explanation"],
            processing_time_ms=elapsed_ms,
        )
    except Exception as e:
        logger.error(f"Prediction error: {e}")
        raise HTTPException(status_code=500, detail=str(e))
