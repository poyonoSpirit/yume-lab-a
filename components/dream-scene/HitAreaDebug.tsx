import type {
  BgRect,
  SceneData,
} from "@/types/scene";

type HitAreaDebugProps = {
  scene: SceneData;
  bgRect: BgRect;
  visible?: boolean;
};

export default function HitAreaDebug({
  scene,
  bgRect,
  visible = true,
}: HitAreaDebugProps) {
  if (!visible) return null;

  return (
    <svg
      style={{
        position: "absolute",
        left: bgRect.left,
        top: bgRect.top,
        width: bgRect.width,
        height: bgRect.height,
        pointerEvents: "none",
      }}
      viewBox="0 0 1 1"
      preserveAspectRatio="none"
    >
      {scene.objects.map((object) => (
        <polygon
          key={`${object.id}-hitArea`}
          points={object.hitArea.points
            .map(([x, y]) => `${x},${y}`)
            .join(" ")}
          fill="rgba(255, 0, 0, 0.18)"
          stroke="red"
          strokeWidth="0.003"
        />
      ))}
    </svg>
  );
}