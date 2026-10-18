"use client";
import { useEffect, useRef } from "react";
export function AsciiArt({
  className,
  paused = false,
  decorative = false,
}: {
  className?: string;
  paused?: boolean;
  decorative?: boolean;
}) {
  const ref = useRef<HTMLVideoElement>(null);
  useEffect(() => {
    const video = ref.current;
    if (!video) return;
    const motion = window.matchMedia("(prefers-reduced-motion: reduce)");
    let visible = false;
    const sync = () => {
      if (visible && !paused && !motion.matches && !document.hidden)
        void video.play().catch(() => {});
      else video.pause();
    };
    const observer = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      sync();
    });
    observer.observe(video);
    motion.addEventListener("change", sync);
    document.addEventListener("visibilitychange", sync);
    return () => {
      observer.disconnect();
      motion.removeEventListener("change", sync);
      document.removeEventListener("visibilitychange", sync);
    };
  }, [paused]);
  return (
    <video
      ref={ref}
      className={className}
      src="https://assets.21st.dev/ascii-recipes/videos/user_3GdLUDAN6ieID1Fu8OTL6zl5Al1/d75636de-972c-4d6c-8781-0594203f1996.mp4"
      poster="https://assets.21st.dev/ascii-recipes/thumbnails/user_3GdLUDAN6ieID1Fu8OTL6zl5Al1/9e491c00-28aa-41a0-a325-2c7f061a44a0.webp"
      loop
      muted
      playsInline
      preload="none"
      aria-label={decorative ? undefined : "Minimal, animated ASCII art"}
      aria-hidden={decorative || undefined}
    />
  );
}
