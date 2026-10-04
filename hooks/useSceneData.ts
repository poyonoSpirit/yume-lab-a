"use client";

import { useEffect, useState } from "react";
import type { SceneData } from "@/types/scene";

export function useSceneData(scenePath: string) {
  const [scene, setScene] = useState<SceneData | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadScene = async () => {
      try {
        const response = await fetch(scenePath);

        if (!response.ok) {
          throw new Error(
            `scene.jsonを読み込めなかったぽよん: ${response.status}`
          );
        }

        const data: SceneData = await response.json();
        setScene(data);
      } catch (unknownError) {
        const message =
          unknownError instanceof Error
            ? unknownError.message
            : "不明なエラーぽよん";

        console.error(message);
        setError(message);
      }
    };

    loadScene();
  }, [scenePath]);

  return {
    scene,
    error,
  };
}