export const dreamErrorMessages = {
  INVALID_REQUEST: "入力内容を確認して、もう一度送信してください。",
  RATE_LIMITED: "Geminiの利用制限に達しました。時間をおいて再送信してください。",
  UNAVAILABLE: "Geminiが混み合っています。自動再試行でも回答を取得できなかったため、少し待って再送信してください。",
  TIMEOUT: "回答の待ち時間を超えました。時間をおいて再送信してください。",
  CONFIGURATION: "Geminiの接続設定に問題があります。管理者による確認が必要です。",
  EMPTY_RESPONSE: "Geminiから回答文が返りませんでした。表現を変えて再送信してください。",
  UPSTREAM_ERROR: "Geminiから回答を取得できませんでした。時間をおいて再送信してください。",
} as const;

export type DreamErrorCode = keyof typeof dreamErrorMessages;

export function getDreamErrorMessage(data: unknown): string | null {
  if (!data || typeof data !== "object" || !("code" in data)) return null;
  const code = data.code;
  return typeof code === "string" && Object.hasOwn(dreamErrorMessages, code)
    ? dreamErrorMessages[code as DreamErrorCode]
    : null;
}
