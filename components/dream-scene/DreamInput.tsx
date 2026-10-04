// サーバ上ではなくブラウザ上でインタラクティブに動くコンポーネントであることを宣言ぽよん
"use client";

import { FormEvent, useState } from "react";

type DreamInputProps = {
  // DreamSceneから受け取る送信処理ぽよん
  onSubmit: (text: string) => Promise<boolean>;
  isSending: boolean;
};

export default function DreamInput({
  onSubmit,
  isSending,
}: DreamInputProps) {
  // 現在入力されている文字を保存するぽよん
  const [text, setText] = useState("");

  const handleSubmit = async (
    event: FormEvent<HTMLFormElement>
  ) => {
    // ページ再読み込みを防ぐぽよん
    event.preventDefault();

    const trimmed = text.trim();

    // 空文字は送らないぽよん
    if (!trimmed || isSending) return;

    // DreamSceneへ文字列を渡すぽよん
    if (await onSubmit(trimmed)) {
      setText("");
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      style={{
        position: "absolute",
        left: "50%",
        bottom: "max(24px, env(safe-area-inset-bottom))",
        width: "min(560px, calc(100% - 32px))",
        display: "flex",
        gap: "8px",
        transform: "translateX(-50%)",
        zIndex: 30,
      }}
    >
      <input
        aria-label="Geminiへ送るメッセージ"
        disabled={isSending}
        autoFocus
        value={text}
        onChange={(event) => setText(event.target.value)}
        placeholder="夢に話しかける..."
        style={{
          flex: 1,
          minWidth: 0,
          color: "#302449",
          padding: "12px 20px",
          borderRadius: "9999px",
          border: "none",
          background: "rgba(255, 255, 255, 0.9)",
        }}
      />
      <button
        type="submit"
        disabled={isSending || !text.trim()}
        style={{
          padding: "12px 20px", borderRadius: "9999px", border: "none",
          background: "#e4d6ff", color: "#302449",
          cursor: isSending || !text.trim() ? "not-allowed" : "pointer",
          opacity: isSending || !text.trim() ? 0.65 : 1,
        }}
      >{isSending ? "送信中…" : "送信"}</button>
    </form>
  );
}