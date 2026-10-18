"use client";
import { useEffect, useRef, useState, type CSSProperties, type PointerEvent } from "react";
import { createPortal } from "react-dom";
import Image from "next/image";
import { Lightbulb, RotateCcw } from "lucide-react";

function DeskScene() {
  const [lit, setLit] = useState(true);
  const [turn, setTurn] = useState(0);
  const surface = useRef<HTMLButtonElement>(null);
  const pointer = useRef({ x: 0, moved: false, dragging: false });
  function reducedMotion() {
    return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  }
  function move(event: PointerEvent<HTMLButtonElement>) {
    if (reducedMotion()) return;
    const box = event.currentTarget.getBoundingClientRect();
    const x = Math.max(-1, Math.min(1, (event.clientX - box.left) / box.width * 2 - 1));
    const y = Math.max(-1, Math.min(1, (event.clientY - box.top) / box.height * 2 - 1));
    event.currentTarget.style.setProperty("--desk-y", `${x * 12}deg`);
    event.currentTarget.style.setProperty("--desk-x", `${y * -5}deg`);
    if (pointer.current.dragging && Math.abs(event.clientX - pointer.current.x) > 5) pointer.current.moved = true;
  }
  function reset() {
    surface.current?.style.setProperty("--desk-y", "0deg");
    surface.current?.style.setProperty("--desk-x", "0deg");
  }
  return (
    <>
      <button
        ref={surface}
        className={`desk-surface ${lit ? "desk-lit" : ""}`}
        style={{ "--desk-turn": `${turn}deg` } as CSSProperties}
        aria-label="Desk scene. Move or drag to tilt; press to switch the lamp. Left and right arrow keys tilt the scene."
        aria-pressed={lit}
        onPointerMove={move}
        onPointerDown={(event) => {
          pointer.current = { x: event.clientX, moved: false, dragging: true };
          event.currentTarget.setPointerCapture(event.pointerId);
        }}
        onPointerUp={() => { pointer.current.dragging = false; }}
        onPointerCancel={() => { pointer.current.dragging = false; reset(); }}
        onPointerLeave={reset}
        onClick={() => {
          if (!pointer.current.moved) setLit((value) => !value);
          pointer.current.moved = false;
        }}
        onKeyDown={(event) => {
          if (["ArrowLeft", "ArrowRight", "Home"].includes(event.key)) {
            event.preventDefault();
            if (reducedMotion()) return;
            setTurn((value) => event.key === "Home" ? 0 : Math.max(-14, Math.min(14, value + (event.key === "ArrowRight" ? 4 : -4))));
          }
        }}
      >
        <span className="desk-ground" aria-hidden="true" />
        <span className="desk-object">
          <span className="desk-lamp-glow" aria-hidden="true" />
          <Image src="/art/desk-miniature.webp" alt="A three-dimensional-style miniature of Shyam at a white desk with a blue laptop and lamp" width={832} height={1000} draggable={false} priority />
        </span>
      </button>
      <button className="desk-lamp-control" onClick={() => setLit((value) => !value)} aria-pressed={lit}>
        <Lightbulb size={14} aria-hidden="true" /> Lamp {lit ? "on" : "off"}
      </button>
      <p className="desk-hint">Move around a little. Click the desk to switch the light.</p>
    </>
  );
}

export function EscapeHatch() {
  const [stage, setStage] = useState<"idle" | "collapsing" | "quiet" | "restoring">("idle");
  const trigger = useRef<HTMLButtonElement>(null);
  const dialog = useRef<HTMLDialogElement>(null);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  function finishRestore() {
    dialog.current?.close();
    document.documentElement.classList.remove("site-collapsing", "site-restoring");
    setStage("idle");
    trigger.current?.focus({ preventScroll: true });
  }
  function restore() {
    if (timer.current) clearTimeout(timer.current);
    if (stage !== "quiet" || window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      finishRestore();
      return;
    }
    setStage("restoring");
    document.documentElement.classList.remove("site-collapsing");
    document.documentElement.classList.add("site-restoring");
    timer.current = setTimeout(finishRestore, 650);
  }
  useEffect(() => () => {
    if (timer.current) clearTimeout(timer.current);
    document.documentElement.classList.remove("site-collapsing", "site-restoring");
  }, []);
  useEffect(() => {
    if ((stage === "collapsing" || stage === "quiet") && dialog.current && !dialog.current.open) dialog.current.showModal();
    if (stage === "quiet") dialog.current?.querySelector<HTMLButtonElement>(".quiet-restore")?.focus();
  }, [stage]);
  function collapse() {
    if (stage !== "idle") return;
    document.documentElement.style.setProperty("--collapse-y", `${window.scrollY + window.innerHeight / 2}px`);
    setStage("collapsing");
    document.documentElement.classList.add("site-collapsing");
    timer.current = setTimeout(() => setStage("quiet"), window.matchMedia("(prefers-reduced-motion: reduce)").matches ? 0 : 1800);
  }
  return (
    <>
      <button ref={trigger} className="escape-trigger" onClick={collapse} aria-label="Collapse the website into a black hole. You can restore it afterwards.">
        <span className="black-hole-mark" aria-hidden="true" />
        <span>A little less internet?</span>
      </button>
      {stage !== "idle" && createPortal(
        <dialog ref={dialog} className={`quiet-dialog stage-${stage}`} onCancel={(event) => { event.preventDefault(); restore(); }} aria-labelledby="quiet-title">
          <div className="collapse-singularity" aria-hidden="true"><span /></div>
          <div className="quiet-scene">
            <DeskScene />
            <h2 id="quiet-title">Just me and the next idea.</h2>
            <button className="quiet-restore text-link" onClick={restore}><RotateCcw size={14} aria-hidden="true" /> Bring the website back</button>
          </div>
        </dialog>, document.body
      )}
    </>
  );
}
