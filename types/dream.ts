// ========================================
// Dream Bubble
// ========================================

// 発話者ぽよん
export type DreamSpeaker = "user" | "poyon";

// 画面上を流れる夢の泡ぽよん
export type Bubble = {
  id: string;
  text: string;
  from: DreamSpeaker;
};


// ========================================
// Dream API Request
// ========================================

// DreamScene → /api/dream に送るデータぽよん
export type DreamRequest = {
  message: string;
};


// ========================================
// Dream API Response
// ========================================

// ぽよんの感情ぽよん
export type DreamEmotion =
  | "neutral"
  | "happy"
  | "thinking"
  | "surprised";

// ぽよんの姿勢ぽよん
export type DreamPose =
  | "sleeping"
  | "sitting"
  | "thinking";

// 表示するスライドぽよん
export type DreamSlide =
  | "roadmap"
  | "skills"
  | "architecture"
  | null;

// Geminiから受け取って画面へ返すデータぽよん
export type DreamResponse = {
  reply: string;
  emotion: DreamEmotion;
  pose: DreamPose;
  slide: DreamSlide;
};

// 現在の会話APIが返すJSONぽよん
export type DreamReplyResponse = Pick<DreamResponse, "reply">;
