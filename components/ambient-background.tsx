"use client";
import { useState } from "react";
import { Pause, Play } from "lucide-react";
import { AsciiArt } from "@/components/ui/minimal";
export function AmbientBackground() {
  const [paused, setPaused] = useState(false);
  return (
    <>
      <div className="ambient-ascii" aria-hidden="true">
        <AsciiArt paused={paused} decorative />
      </div>
      <button
        className="ambient-control"
        onClick={() => setPaused(!paused)}
        aria-label={
          paused ? "Play background animation" : "Pause background animation"
        }
      >
        {paused ? (
          <Play size={11} aria-hidden="true" />
        ) : (
          <Pause size={11} aria-hidden="true" />
        )}
        <span>{paused ? "Background paused" : "Pause background"}</span>
      </button>
    </>
  );
}
