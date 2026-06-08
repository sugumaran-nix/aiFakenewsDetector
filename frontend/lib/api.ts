import axios from "axios";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000";

export const apiClient = axios.create({
  baseURL: API_URL,
  timeout: 30_000,
  headers: { "Content-Type": "application/json" },
});

export interface PredictPayload {
  headline: string;
  article?: string;
}

export interface PredictResult {
  label: "Real" | "Fake" | "Uncertain";
  confidence: number;
  explanation: string;
  processing_time_ms: number;
}

export async function predict(payload: PredictPayload): Promise<PredictResult> {
  const { data } = await apiClient.post<PredictResult>("/predict", payload);
  return data;
}
