import type { DreamReplyResponse } from "@/types/dream";

type Props = {
  response: DreamReplyResponse | null;
  isSending: boolean;
  error: string | null;
};

export default function DreamResponseBubble({ response, isSending, error }: Props) {
  return (
    <section
      aria-label="Geminiの回答"
      aria-live="polite"
      aria-busy={isSending}
      style={{
        position: "absolute", left: "50%", top: "50%",
        transform: "translate(-50%, -50%)", zIndex: 40,
        width: "min(560px, calc(100% - 32px))",
      }}
    >
      {(response || isSending || error) && (
        <div style={{
          position: "relative", padding: "24px", borderRadius: "28px",
          background: "rgba(244, 239, 255, 0.95)", color: "#302449",
          boxShadow: "0 8px 40px rgba(20, 12, 48, 0.3)",
        }}>
          {isSending ? <p>Geminiが考え中ぽよん…</p> : error ? (
            <p role="alert">{error}</p>
          ) : (
            <pre style={{
              margin: 0, maxHeight: "45dvh", overflow: "auto",
              whiteSpace: "pre-wrap", overflowWrap: "anywhere",
              fontSize: "14px", lineHeight: 1.7,
            }}>{JSON.stringify(response, null, 2)}</pre>
          )}
          <span aria-hidden="true" style={{
            position: "absolute", bottom: "-12px", left: "50%",
            width: "24px", height: "24px", transform: "translateX(-50%) rotate(45deg)",
            background: "rgba(244, 239, 255, 0.95)",
          }} />
        </div>
      )}
    </section>
  );
}
