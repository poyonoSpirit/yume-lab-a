import type { BgRect, Point } from "@/types/scene";

type ScreenPoint = {
  x: number;
  y: number;
};

// 画面上のクリック座標をbg.png基準の0〜1座標へ変換するぽよん
export function convertScreenPointToBackgroundPoint(
  screenPoint: ScreenPoint,
  bgRect: BgRect
): Point | null {
  const bgX =
    (screenPoint.x - bgRect.left) / bgRect.width;

  const bgY =
    (screenPoint.y - bgRect.top) / bgRect.height;

  // 背景画像の外ならnullを返すぽよん
  if (
    bgX < 0 ||
    bgX > 1 ||
    bgY < 0 ||
    bgY > 1
  ) {
    return null;
  }

  return [bgX, bgY];
}