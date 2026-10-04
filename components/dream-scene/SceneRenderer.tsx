import type {
  BgRect,
  SceneData,
} from "@/types/scene";

type SceneRendererProps = {
  scene: SceneData;
  bgRect: BgRect;
};

export default function SceneRenderer({
  scene,
  bgRect,
}: SceneRendererProps) {
  return (
    <>
      {/* 背景画像ぽよん */}
      <img
        src={scene.background.src}
        alt=""
        style={{
          position: "absolute",
          left: bgRect.left,
          top: bgRect.top,
          width: bgRect.width,
          height: bgRect.height,
          objectFit: "contain",
          userSelect: "none",
          pointerEvents: "none",
        }}
      />

      {/* シーン内オブジェクトぽよん */}
      {scene.objects.map((object) => {
        if (!object.src) return null;

        return (
          <img
            key={object.id}
            src={object.src}
            alt=""
            style={{
              position: "absolute",
              left:
                bgRect.left +
                (object.x ?? 0) * bgRect.width,
              top:
                bgRect.top +
                (object.y ?? 0) * bgRect.height,
              width:
                (object.w ?? 0.1) *
                bgRect.width,
              height:
                (object.h ?? 0.1) *
                bgRect.height,
              objectFit: "contain",
              userSelect: "none",
              pointerEvents: "none",
            }}
          />
        );
      })}
    </>
  );
}