import type { Point } from "@/types/scene";

// 点がpolygonの内側にあるか判定する純粋関数ぽよん
export function isPointInPolygon(
  point: Point,
  polygon: Point[]
): boolean {
  const [x, y] = point;
  let inside = false;

  for (
    let i = 0, j = polygon.length - 1;
    i < polygon.length;
    j = i++
  ) {
    const [xi, yi] = polygon[i];
    const [xj, yj] = polygon[j];

    const intersects =
      yi > y !== yj > y &&
      x < ((xj - xi) * (y - yi)) / (yj - yi) + xi;

    if (intersects) {
      inside = !inside;
    }
  }

  return inside;
}