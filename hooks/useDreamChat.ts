"use client";

import { useRef, useState } from "react";
import type { DreamReplyResponse, DreamRequest } from "@/types/dream";
import { getDreamErrorMessage } from "@/lib/dreamErrors";

export function useDreamChat() {
  const pending = useRef(false);
  const [response, setResponse] = useState<DreamReplyResponse | null>(null);
  const [isSending, setIsSending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const sendMessage = async (text: string): Promise<boolean> => {
    const message = text.trim();
    if (!message || pending.current) return false;

    pending.current = true;
    setIsSending(true);
    setError(null);
    setResponse(null);

    try {
      const result = await fetch("/api/dream", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message } satisfies DreamRequest),
        signal: AbortSignal.timeout(60_000),
      });
      if (!result.ok) {
        const data: unknown = await result.json().catch(() => null);
        setError(getDreamErrorMessage(data) ?? `サーバーでエラーが発生しました（${result.status}）。時間をおいて再送信してください。`);
        return false;
      }
      const data: unknown = await result.json().catch(() => null);
      if (
        !data || typeof data !== "object" ||
        !("reply" in data) || typeof data.reply !== "string" || !data.reply.trim()
      ) {
        setError("回答の形式が正しくありません。もう一度送信してください。");
        return false;
      }
      setResponse({ reply: data.reply });
      return true;
    } catch (cause) {
      setError(cause instanceof Error && cause.name === "TimeoutError"
        ? "回答を待つ時間が長すぎたため、送信を終了しました。もう一度お試しください。"
        : "通信に失敗しました。接続を確認して、もう一度送信してください。");
      return false;
    } finally {
      pending.current = false;
      setIsSending(false);
    }
  };

  return { response, isSending, error, sendMessage };
}
