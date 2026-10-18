"use client";
import { useCallback, useEffect, useRef, useState } from "react";
import { Lightbulb, Dumbbell, Laptop, RotateCcw } from "lucide-react";
import type { createDeskModel, DeskAction } from "@/lib/desk-model";

type Controller=ReturnType<typeof createDeskModel>;
export function DeskScene(){
  const canvas=useRef<HTMLCanvasElement>(null), model=useRef<Controller|null>(null);
  const [lit,setLit]=useState(true),[working,setWorking]=useState(true),[failed,setFailed]=useState(false),[ready,setReady]=useState(false);
  const action=useCallback((value:DeskAction)=>{if(value==='lamp')setLit(v=>!v);else setWorking(v=>!v);},[]);
  useEffect(()=>{
    let cancelled=false;
    import('@/lib/desk-model').then(({createDeskModel})=>{
      if(cancelled||!canvas.current)return;
      try{model.current=createDeskModel(canvas.current,action);setReady(true);}catch{setFailed(true);}
    }).catch(()=>{if(!cancelled)setFailed(true);});
    return()=>{cancelled=true;model.current?.dispose();model.current=null;};
  },[action]);
  useEffect(()=>{model.current?.setLamp(lit);},[lit,ready]);
  useEffect(()=>{model.current?.setWorking(working);},[working,ready]);
  return <>
    <div className="desk-model-stage">
      <canvas ref={canvas} className="desk-model" tabIndex={0} role="img" aria-label={working?"Interactive 3D Shyam at his desk. Drag or use arrow keys to rotate; Home resets the view. Click the lamp or laptop to interact.":"Interactive 3D Shyam doing push-ups. Drag or use arrow keys to rotate; Home resets the view. Choose Back to work to return to the desk."}
        onKeyDown={e=>{if(e.key==='ArrowLeft'||e.key==='ArrowRight'){e.preventDefault();model.current?.turn(e.key==='ArrowRight'?1:-1);}if(e.key==='Home'){e.preventDefault();model.current?.reset();}}}/>
      {failed&&<p className="desk-unavailable" role="status">The 3D view is unavailable on this device. You can still return to the website.</p>}
    </div>
    <div className="desk-controls" aria-label="Desk controls">
      <button onClick={()=>setLit(v=>!v)} aria-pressed={lit} disabled={!working}><Lightbulb size={14} aria-hidden="true"/>Lamp {lit?'on':'off'}</button>
      <button onClick={()=>setWorking(v=>!v)} aria-pressed={!working}>{working?<Dumbbell size={14} aria-hidden="true"/>:<Laptop size={14} aria-hidden="true"/>}{working?'Do push-ups':'Back to work'}</button>
      <button onClick={()=>model.current?.reset()}><RotateCcw size={14} aria-hidden="true"/>Reset view</button>
    </div>
    <p className="desk-hint" aria-live="polite">{working?"Drag to look around. Try the lamp and laptop.":"A few push-ups. Then back to building. Drag to look around."}</p>
  </>;
}
