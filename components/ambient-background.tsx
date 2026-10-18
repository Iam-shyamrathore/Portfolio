"use client";
import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { Pause, Play } from "lucide-react";
import { AsciiArt } from "@/components/ui/minimal";
const CloudShader = dynamic(() => import("@/components/ui/cloud-shader").then(module => module.CloudShader), { ssr: false });
export function AmbientBackground() {
  const [paused, setPaused] = useState(false);
  const [consumed,setConsumed]=useState(false);
  useEffect(()=>{
    const sync=()=>setConsumed(document.documentElement.classList.contains("site-consumed")||document.documentElement.classList.contains("site-capturing"));
    const observer=new MutationObserver(sync);observer.observe(document.documentElement,{attributes:true,attributeFilter:["class"]});
    return()=>observer.disconnect();
  },[]);
  return (
    <>
      <div className="ambient-clouds" aria-hidden="true">
        <CloudShader className="min-h-0" speed={0.35} count={5} cloudColor="#ffffff" skyTopColor="#89addb" skyBottomColor="#d5e5f7" paused={paused||consumed} maxFps={20} maxPixelRatio={1}/>
      </div>
      <div className="ambient-ascii" aria-hidden="true">
        <AsciiArt paused={paused||consumed} decorative />
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
