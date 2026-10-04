"use client";

import { useRef } from "react";

import DreamInput from "./DreamInput";
import DreamResponseBubble from "./DreamResponseBubble";
import SceneRenderer from "./SceneRenderer";
import HitAreaDebug from "./HitAreaDebug";

import { useSceneData } from "@/hooks/useSceneData";
import { useBackgroundRect } from "@/hooks/useBackgroundRect";
import { useDreamChat } from "@/hooks/useDreamChat";

export default function DreamScene() {
  // シーン全体のDOM参照ぽよん
  const sceneRef =
    useRef<HTMLElement | null>(null);

  // scene.json読込ぽよん
  const { scene, error } = useSceneData(
    "/scenes/desktop/scene.json"
  );

  // 背景画像の実表示領域ぽよん
  const bgRect = useBackgroundRect(
    sceneRef,
    scene
  );

  const { response, isSending, error: chatError, sendMessage } = useDreamChat();

  return (
    <main
      ref={sceneRef}
      style={{
        position: "relative",
        width: "100vw",
        height: "100dvh",
        overflow: "hidden",
        background: "#20193f",
      }}
    >
      {/* scene読込エラー表示ぽよん */}
      {error && (
        <p
          style={{
            color: "white",
            padding: "16px",
          }}
        >
          {error}
        </p>
      )}

      {/* 背景とオブジェクト描画ぽよん */}
      {scene && bgRect && (
        <>
          <SceneRenderer
            scene={scene}
            bgRect={bgRect}
          />

          <HitAreaDebug
            scene={scene}
            bgRect={bgRect}
            visible={true}
          />
        </>
      )}

      <DreamInput onSubmit={sendMessage} isSending={isSending} />
      <DreamResponseBubble
        response={response}
        isSending={isSending}
        error={chatError}
      />
    </main>
  );
}