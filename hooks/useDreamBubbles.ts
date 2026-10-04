"use client";

import { useState } from "react";
import type { Bubble } from "@/types/dream";

export function useDreamBubbles() {
  const [bubbles, setBubbles] =
    useState<Bubble[]>([]);

  const addBubble = (
    text: string,
    from: Bubble["from"]
  ) => {
    const newBubble: Bubble = {
      id: crypto.randomUUID(),
      text,
      from,
    };

    setBubbles((current) => [
      ...current,
      newBubble,
    ]);
  };

  const removeBubble = (id: string) => {
    setBubbles((current) =>
      current.filter((bubble) => bubble.id !== id)
    );
  };

  return {
    bubbles,
    addBubble,
    removeBubble,
  };
}