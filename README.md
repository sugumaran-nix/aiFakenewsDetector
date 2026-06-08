# VeritAI — AI Fake News Detection Platform

> A production-grade, full-stack AI SaaS platform that classifies news as **Real**, **Fake**, or **Uncertain** using transformer-based NLP models and linguistic heuristics.

![VeritAI](https://img.shields.io/badge/VeritAI-v1.0.0-brightgreen?style=for-the-badge)
![Next.js](https://img.shields.io/badge/Next.js-14-black?style=for-the-badge&logo=next.js)
![FastAPI](https://img.shields.io/badge/FastAPI-0.111-009688?style=for-the-badge&logo=fastapi)
![HuggingFace](https://img.shields.io/badge/HuggingFace-Transformers-orange?style=for-the-badge)

---

## 📋 Table of Contents

1. [Project Overview](#-project-overview)
2. [Features](#-features)
3. [Tech Stack](#-tech-stack)
4. [Project Structure](#-project-structure)
5. [Local Setup](#-local-setup)
6. [Running the Backend](#-running-the-backend)
7. [Running the Frontend](#-running-the-frontend)
8. [Environment Variables](#-environment-variables)
9. [API Reference](#-api-reference)
10. [Deployment](#-deployment)
    - [Frontend → Vercel](#frontend--vercel)
    - [Backend → Render](#backend--render)
    - [Backend → Railway](#backend--railway)
11. [How Detection Works](#-how-detection-works)
12. [Common Errors & Fixes](#-common-errors--fixes)

---

## 🧠 Project Overview

VeritAI is an end-to-end AI application that analyses news headlines and article bodies to determine whether the content is **Real**, **Fake**, or **Uncertain**. It uses:

- A **fine-tuned BERT / RoBERTa model** loaded via Hugging Face Transformers for semantic classification.
- A **linguistic heuristics layer** (scikit-learn style scoring) that detects sensational language, credibility signals, excessive capitalisation, and repeated punctuation.
- A **blended confidence score** (70% model / 30% heuristics) for robust, calibrated output.

The frontend is a polished dark/light mode SaaS dashboard built with Next.js 14 App Router, Tailwind CSS, and GSAP animations.

---

## ✨ Features

| Feature | Description |
|---|---|
| 🔍 Fake News Detection | Classify any headline + article body as Real / Fake / Uncertain |
| 📊 Confidence Score | Calibrated 0–100% confidence with animated meter |
| 🌙 Dark / Light Mode | Persistent theme toggle |
| 📜 Analysis History | Last 50 analyses stored in localStorage |
| 📱 Responsive UI | Mobile-first layout with collapsible sidebar |
| ⚡ GSAP Animations | Staggered reveals, result card entrance, confidence bar animation |
| 📖 API Docs | Auto-generated Swagger UI at `/docs` |

---

## 🛠 Tech Stack

### Frontend
| Technology | Version | Purpose |
|---|---|---|
| Next.js | 14.2.3 | React framework with App Router |
| React | 18.3 | UI library |
| Tailwind CSS | 3.4 | Utility-first styling |
| GSAP | 3.12 | Professional animations |
| Axios | 1.7 | API client |
| TypeScript | 5.4 | Type safety |

### Backend
| Technology | Version | Purpose |
|---|---|---|
| Python | 3.11+ | Runtime |
| FastAPI | 0.111 | API framework |
| Uvicorn | 0.29 | ASGI server |
| Transformers | 4.41 | HuggingFace model inference |
| PyTorch | 2.3 | Deep learning runtime |
| scikit-learn | 1.5 | Heuristic scoring support |
| Pydantic | 2.7 | Request / response validation |

---

## 📁 Project Structure

```
fake-news-detector/
├── backend/
│   ├── main.py           # FastAPI app, routes, CORS
│   ├── model.py          # FakeNewsDetector class
│   ├── requirements.txt  # Python dependencies
│   ├── Procfile          # Render / Railway deployment
│   └── .env.example      # Environment variable template
│
├── frontend/
│   ├── app/
│   │   ├── layout.tsx         # Root layout with fonts + providers
│   │   ├── globals.css        # CSS variables, Tailwind base
│   │   ├── page.tsx           # Dashboard page
│   │   ├── analyze/page.tsx   # Analysis input + result
│   │   ├── history/page.tsx   # localStorage history
│   │   └── about/page.tsx     # About + stack info
│   ├── components/
│   │   ├── layout/
│   │   │   ├── Shell.tsx         # Sidebar + topbar shell
│   │   │   └── ThemeProvider.tsx # Dark/light context
│   │   └── ui/
│   │       ├── ResultCard.tsx    # GSAP-animated result
│   │       ├── ConfidenceMeter.tsx # Animated confidence bar
│   │       └── StatCard.tsx      # Dashboard stat card
│   ├── hooks/
│   │   └── useHistory.ts     # localStorage history hook
│   ├── lib/
│   │   ├── api.ts            # Axios API client
│   │   └── utils.ts          # clsx + tailwind-merge
│   ├── package.json
│   ├── tailwind.config.js
│   ├── tsconfig.json
│   └── .env.example
│
└── README.md
```

---

## 🚀 Local Setup

### Prerequisites

| Tool | Minimum Version |
|---|---|
| Node.js | 18.x |
| Python | 3.11 |
| pip | 23+ |
| Git | any |

---

## ⚙️ Running the Backend

```bash
# 1. Clone the repository
git clone https://github.com/YOUR_USERNAME/fake-news-detector.git
cd fake-news-detector/backend

# 2. Create a virtual environment
python -m venv venv

# Activate (Linux / macOS)
source venv/bin/activate

# Activate (Windows PowerShell)
.\venv\Scripts\Activate.ps1

# 3. Install dependencies
pip install -r requirements.txt

# 4. Copy env file
cp .env.example .env

# 5. Start the server
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

✅ Backend is live at: `http://localhost:8000`  
📖 Swagger UI: `http://localhost:8000/docs`

> **Note on model download:** On first run, Hugging Face will automatically download
> `mrm8488/bert-tiny-finetuned-fake-news-detection` (~25 MB). This requires an internet connection
> and may take 30–60 seconds. Subsequent starts are instant (cached locally).

---

## 🖥 Running the Frontend

```bash
# From the project root
cd frontend

# 1. Install dependencies
npm install

# 2. Copy env file
cp .env.example .env.local

# 3. Edit .env.local — set your backend URL
# NEXT_PUBLIC_API_URL=http://localhost:8000

# 4. Start the dev server
npm run dev
```

✅ Frontend is live at: `http://localhost:3000`

---

## 🔐 Environment Variables

### Backend (`backend/.env`)

| Variable | Default | Description |
|---|---|---|
| `HOST` | `0.0.0.0` | Server bind host |
| `PORT` | `8000` | Server port |
| `ALLOWED_ORIGINS` | `*` | Comma-separated CORS origins |
| `LOG_LEVEL` | `INFO` | Python logging level |

### Frontend (`frontend/.env.local`)

| Variable | Required | Description |
|---|---|---|
| `NEXT_PUBLIC_API_URL` | ✅ | Full URL to the FastAPI backend |

---

## 📡 API Reference

### `GET /`
Health check — returns service name and version.

### `GET /health`
Returns `{ "status": "healthy", "model_loaded": true }`.

### `POST /predict`

**Request body:**
```json
{
  "headline": "Breaking: Scientists discover cure for cancer",
  "article": "Optional full article text..."
}
```

**Response:**
```json
{
  "label": "Fake",
  "confidence": 0.91,
  "explanation": "Multiple indicators of misinformation detected...",
  "processing_time_ms": 84.3
}
```

**Labels:** `Real` | `Fake` | `Uncertain`

---

## ☁️ Deployment

### Frontend → Vercel

1. Push the repo to GitHub.
2. Go to [vercel.com](https://vercel.com) → **New Project** → import the repo.
3. Set **Root Directory** to `frontend`.
4. Add **Environment Variable**:
   ```
   NEXT_PUBLIC_API_URL = https://your-backend.onrender.com
   ```
5. Click **Deploy**.

Vercel auto-detects Next.js — no further config needed.

---

### Backend → Render

1. Go to [render.com](https://render.com) → **New Web Service**.
2. Connect GitHub, select the repo.
3. Settings:
   | Field | Value |
   |---|---|
   | Root Directory | `backend` |
   | Environment | `Python 3` |
   | Build Command | `pip install -r requirements.txt` |
   | Start Command | `uvicorn main:app --host 0.0.0.0 --port $PORT` |
4. Add environment variable: `ALLOWED_ORIGINS` = your Vercel URL.
5. **Free tier** works but may cold-start in ~30s. Upgrade to a paid plan for production.

---

### Backend → Railway

1. Go to [railway.app](https://railway.app) → **New Project** → Deploy from GitHub.
2. Select the repo. Railway auto-detects the `Procfile`.
3. Set the root to `backend` in Settings → Source.
4. Add `ALLOWED_ORIGINS` environment variable.
5. Railway auto-assigns a public URL.

---

## 🔍 How Detection Works

```
Input (headline + article)
        │
        ▼
  Text Preprocessing
  (whitespace cleanup, 2000-char truncation)
        │
        ├─────────────────────────────────────┐
        ▼                                     ▼
 Transformer Model                    Heuristic Scorer
 (BERT/RoBERTa fine-tuned)            (sensational words,
  → fake probability 0–1               caps, credibility
                                       signals)
        │                                     │
        └──────── Blended Score ──────────────┘
                  (70% model + 30% heuristics)
                           │
                     Threshold check
                    ┌──────┴──────┐
                 ≥0.65        ≤0.35     else
                  FAKE         REAL   UNCERTAIN
```

---

## 🛠 Common Errors & Fixes

### `ECONNREFUSED` / `Network Error` in browser
**Cause:** Frontend can't reach the backend.  
**Fix:** Ensure the backend is running (`uvicorn main:app --reload`) and `NEXT_PUBLIC_API_URL` in `.env.local` matches exactly (no trailing slash).

---

### `OSError: Can't load tokenizer for '...'`
**Cause:** First-time model download failed (no internet or timeout).  
**Fix:** Ensure internet access. Run `python -c "from transformers import pipeline; pipeline('text-classification', model='mrm8488/bert-tiny-finetuned-fake-news-detection')"` to pre-download manually.

---

### `torch not found` or slow install
**Cause:** PyTorch is large (~800 MB).  
**Fix:** Install CPU-only PyTorch instead:
```bash
pip install torch --index-url https://download.pytorch.org/whl/cpu
pip install -r requirements.txt
```

---

### `Module 'next' not found`
**Cause:** Node modules not installed.  
**Fix:**
```bash
cd frontend && npm install
```

---

### CORS error (`blocked by CORS policy`)
**Cause:** Frontend origin not whitelisted in backend.  
**Fix:** In `backend/.env`, set:
```
ALLOWED_ORIGINS=http://localhost:3000,https://your-app.vercel.app
```
In `main.py`, replace `allow_origins=["*"]` with:
```python
allow_origins=os.getenv("ALLOWED_ORIGINS", "*").split(",")
```

---

### Cold-start 503 on Render (free tier)
**Cause:** Free-tier services spin down after 15 min of inactivity.  
**Fix:** Upgrade to a paid plan, or add a cron job to ping `/health` every 10 minutes.

---

### Build error: `Type error: ...` in Next.js
**Fix:**
```bash
cd frontend && npm run lint
```
Check for missing props or incorrect types. All types are defined in `lib/api.ts` and `hooks/useHistory.ts`.

---

## 📝 License

MIT © 2024 — Built as a portfolio project. Free to use and modify.

---

## 🙌 Acknowledgements

- [Hugging Face](https://huggingface.co) for open-source transformer models
- [mrm8488](https://huggingface.co/mrm8488) for the fake-news BERT fine-tune
- [FastAPI](https://fastapi.tiangolo.com) for the blazing-fast Python API framework
- [GSAP](https://greensock.com) for professional-grade animations
