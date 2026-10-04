"use client";

import {
  RefObject,
  useEffect,
  useState,
} from "react";

import type {
  BgRect,
  SceneData,
} from "@/types/scene";

export function useBackgroundRect(
  sceneRef: RefObject<HTMLElement | null>,
  scene: SceneData | null
) {
  const [bgRect, setBgRect] =
    useState<BgRect | null>(null);

  useEffect(() => {
    if (!scene) return;

    const updateBackgroundRect = () => {
      const element = sceneRef.current;
      if (!element) return;

      const screenWidth = element.clientWidth;
      const screenHeight = element.clientHeight;

      const imageRatio =
        scene.background.width /
        scene.background.height;

      const screenRatio =
        screenWidth / screenHeight;

      let width: number;
      let height: number;
      let left: number;
      let top: number;

      // object-fit: contain相当の表示領域を計算するぽよん
      if (screenRatio > imageRatio) {
        height = screenHeight;
        width = height * imageRatio;
        left = (screenWidth - width) / 2;
        top = 0;
      } else {
        width = screenWidth;
        height = width / imageRatio;
        left = 0;
        top = (screenHeight - height) / 2;
      }

      setBgRect({
        left,
        top,
        width,
        height,
      });
    };

    requestAnimationFrame(updateBackgroundRect);

    window.addEventListener(
      "resize",
      updateBackgroundRect
    );

    return () => {
      window.removeEventListener(
        "resize",
        updateBackgroundRect
      );
    };
  }, [scene, sceneRef]);

  return bgRect;
}