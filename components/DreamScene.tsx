"use client";

import { MouseEvent, useEffect, useRef, useState } from "react";
import DreamInput from "./DreamInput";
import DreamBubble from "./DreamBubble";

//⭐️クリックテキスト入力パート

// polygonの1点。bg.png基準の 0〜1 座標ぽよん
type Point = [number, number];

type SceneObject = {
  id: string;
  src?: string;
  x?: number;
  y?: number;
  w?: number;
  h?: number;
  action: string;
  hitArea: {
    type: "polygon";
    points: Point[];
  };
};

type SceneData = {
  background: {
    src: string;
    width: number;
    height: number;
  };
  objects: SceneObject[];
};

type BgRect = {
  left: number;
  top: number;
  width: number;
  height: number;
};

type Bubble = {
  id: string;
  text: string;
  from: "user" | "poyon";
};

// 点がpolygonの内側か判定するぽよん
function isPointInPolygon(point: Point, polygon: Point[]) {
  const [x, y] = point;
  let inside = false;

  for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
    const [xi, yi] = polygon[i];
    const [xj, yj] = polygon[j];

    const isIntersect =
      yi > y !== yj > y &&
      x < ((xj - xi) * (y - yi)) / (yj - yi) + xi;

    if (isIntersect) inside = !inside;
  }

  return inside;
}

export default function DreamScene() {
  const sceneRef = useRef<HTMLElement | null>(null);

  const [scene, setScene] = useState<SceneData | null>(null);
  const [bgRect, setBgRect] = useState<BgRect | null>(null);
  const [isInputOpen, setIsInputOpen] = useState(false);

  const [bubbles, setBubbles] = useState<Bubble[]>([]);

  // scene.jsonを読み込むぽよん
  useEffect(() => {
    fetch("/scenes/desktop/scene.json")
      .then((res) => {
        if (!res.ok) {
          throw new Error("scene.json を読み込めなかったぽよん");
        }
        return res.json();
      })
      .then((data: SceneData) => {
        setScene(data);
      })
      .catch((error) => {
        console.error(error);
      });
  }, []);

  // 画面内でbg.pngがどの位置・サイズで表示されるか計算するぽよん
  useEffect(() => {
    if (!scene) return;

    const updateBgRect = () => {
      const el = sceneRef.current;
      if (!el) return;

      const screenW = el.clientWidth;
      const screenH = el.clientHeight;

      const imageRatio = scene.background.width / scene.background.height;
      const screenRatio = screenW / screenH;

      let width: number;
      let height: number;
      let left: number;
      let top: number;

      // background-size: contain と同じ計算ぽよん
      if (screenRatio > imageRatio) {
        height = screenH;
        width = height * imageRatio;
        left = (screenW - width) / 2;
        top = 0;
      } else {
        width = screenW;
        height = width / imageRatio;
        left = 0;
        top = (screenH - height) / 2;
      }

      setBgRect({ left, top, width, height });
    };

    // 初回描画後に計算するぽよん
    requestAnimationFrame(updateBgRect);

    window.addEventListener("resize", updateBgRect);
    return () => window.removeEventListener("resize", updateBgRect);
  }, [scene]);

  const handleSceneClick = (event: MouseEvent<HTMLElement>) => {
    if (!scene || !bgRect) return;

    const rect = event.currentTarget.getBoundingClientRect();

    // クリック位置を画面内座標に変換するぽよん
    const screenX = event.clientX - rect.left;
    const screenY = event.clientY - rect.top;

    // 画面内座標をbg.png基準の 0〜1 座標へ変換するぽよん
    const bgX = (screenX - bgRect.left) / bgRect.width;
    const bgY = (screenY - bgRect.top) / bgRect.height;

    // bg.pngの外側をクリックしたら無視ぽよん
    if (bgX < 0 || bgX > 1 || bgY < 0 || bgY > 1) return;

    const clickedObject = scene.objects.find((object) =>
      isPointInPolygon([bgX, bgY], object.hitArea.points)
    );

    if (!clickedObject) return;

    if (clickedObject.action === "openDreamInput") {
      setIsInputOpen(true);
    }
  };


  const handleSubmitDream = (text: string) => {
    const newBubble: Bubble = {
      id: crypto.randomUUID(),
      text,
      from: "user",
    };
    setBubbles((current) => [...current, newBubble]);
    setIsInputOpen(false);
  };

  return (
    <main
      ref={sceneRef}
      onClick={handleSceneClick}
      style={{
        position: "relative",
        width: "100vw",
        height: "100vh",
        overflow: "hidden",
        background: "#20193f",
      }}
    >
      {/* scene.json読込前でも、とりあえず背景色は出るぽよん */}
      {scene && bgRect && (
        <>
          {/* bg.pngを表示するぽよん */}
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

          {/* futon.pngなどのオブジェクト画像を表示するぽよん */}
          {scene.objects.map((object) => {
            if (!object.src) return null;

            return (
              <img
                key={object.id}
                src={object.src}
                alt=""
                style={{
                  position: "absolute",
                  left: bgRect.left + (object.x ?? 0) * bgRect.width,
                  top: bgRect.top + (object.y ?? 0) * bgRect.height,
                  width: (object.w ?? 0.1) * bgRect.width,
                  height: (object.h ?? 0.1) * bgRect.height,
                  objectFit: "contain",
                  userSelect: "none",
                  pointerEvents: "none",
                }}
              />
            );
          })}

          {/* polygonクリック範囲のデバッグ表示ぽよん。邪魔なら消してOKぽよん */}
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
        </>
      )}

      {isInputOpen && <DreamInput onSubmit={handleSubmitDream} />}

      {bubbles.map((bubble) => (
        <DreamBubble
          key={bubble.id}
          text={bubble.text}
          from={bubble.from}
          onDone={() => {
            setBubbles((current) =>
              current.filter((item) => item.id !== bubble.id)
            );
          }}
        />
      ))}
    </main>
  );
}

