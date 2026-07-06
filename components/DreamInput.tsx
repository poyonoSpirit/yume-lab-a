// サーバ上ではなくブラウザ上でインタラクティブに動くコンポーネントであることを宣言ぽよん
"use client";

import { FormEvent, useState } from "react";

type DreamInputProps = {
  // DreamSceneから受け取る送信処理ぽよん
  onSubmit: (text: string) => void;
};

export default function DreamInput({
  onSubmit,
}: DreamInputProps) {
  // 現在入力されている文字を保存するぽよん
  const [text, setText] = useState("");

  const handleSubmit = (
    event: FormEvent<HTMLFormElement>
  ) => {
    // ページ再読み込みを防ぐぽよん
    event.preventDefault();

    const trimmed = text.trim();

    // 空文字は送らないぽよん
    if (!trimmed) return;

    // DreamSceneへ文字列を渡すぽよん
    onSubmit(trimmed);

    // 入力欄を空に戻すぽよん
    setText("");
  };

  return (
    <form
      onSubmit={handleSubmit}
      style={{
        position: "absolute",
        left: "50%",
        bottom: "32px",
        transform: "translateX(-50%)",
        zIndex: 30,
      }}
    >
      <input
        autoFocus
        value={text}
        onChange={(event) => setText(event.target.value)}
        placeholder="夢に話しかける..."
        style={{
          width: "320px",
          padding: "12px 20px",
          borderRadius: "9999px",
          border: "none",
          outline: "none",
          background: "rgba(255, 255, 255, 0.3)",
        }}
      />
    </form>
  );
}