import { NextResponse } from "next/server";
import { ApiError, GoogleGenAI } from "@google/genai";
import type { DreamReplyResponse } from "@/types/dream";
import { dreamErrorMessages, type DreamErrorCode } from "@/lib/dreamErrors";

function failure(code: DreamErrorCode, status: number) {
  return NextResponse.json({ code, error: dreamErrorMessages[code] }, { status });
}

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return failure("INVALID_REQUEST", 400);
  }

  const message = body && typeof body === "object" && "message" in body
    && typeof body.message === "string" ? body.message.trim() : "";
  if (!message) {
    return failure("INVALID_REQUEST", 400);
  }

  // 再試行を含む全体を50秒以内に収め、ブラウザの60秒制限より先に応答する。
  const deadline = AbortSignal.timeout(50_000);
  try {
    const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
    const response = await ai.models.generateContent({
      model: "gemini-3.7-flash",
      contents: message,
      config: {
        abortSignal: AbortSignal.any([request.signal, deadline]),
        httpOptions: {
          timeout: 50_000,
          retryOptions: {
            attempts: 3,
            initialDelay: 1,
            maxDelay: 4,
            expBase: 2,
            jitter: 1,
            httpStatusCodes: [408, 429, 500, 502, 503, 504],
          },
        },
      },
    });
    const reply = response.text;
    if (!reply?.trim()) {
      return failure("EMPTY_RESPONSE", 502);
    }
    return NextResponse.json({ reply } satisfies DreamReplyResponse);
  } catch (cause) {
    const status = cause instanceof ApiError ? cause.status : undefined;
    // SDKのエラー本文にはリクエスト情報が含まれ得るため、数値の状態だけ記録する。
    console.warn("Dream API failed", { status: status ?? null, timedOut: deadline.aborted });
    if (deadline.aborted || status === 408 || status === 504) return failure("TIMEOUT", 504);
    if (status === 429) return failure("RATE_LIMITED", 429);
    if (status === 500 || status === 502 || status === 503) return failure("UNAVAILABLE", 503);
    if (status === 400 || status === 401 || status === 403 || status === 404) return failure("CONFIGURATION", 502);
    return failure("UPSTREAM_ERROR", 502);
  }
}
