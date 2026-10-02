"use client";

import { useSyncExternalStore } from "react";
import { isMuted, setMuted } from "./sound";

// tiny external store so the toggle reads localStorage without a hydration mismatch
const listeners = new Set<() => void>();
const subscribe = (fn: () => void) => (listeners.add(fn), () => listeners.delete(fn));

export default function SoundToggle() {
  const muted = useSyncExternalStore(subscribe, isMuted, () => false);
  return (
    <button
      onClick={() => {
        setMuted(!muted);
        listeners.forEach((fn) => fn());
      }}
      aria-pressed={!muted}
      className="rounded-full border border-rule px-3 py-1.5 font-mono text-[0.7rem] tracking-[0.14em] whitespace-nowrap uppercase transition-colors hover:border-ink"
    >
      Sound {muted ? "off" : "on"}
    </button>
  );
}
