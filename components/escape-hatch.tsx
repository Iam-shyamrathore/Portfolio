"use client";
import {useCallback,useEffect,useRef,useState} from 'react';
import {createPortal} from 'react-dom';
import {RotateCcw} from 'lucide-react';
import {DeskScene} from './desk-scene';
import {BlackHoleIcon} from './black-hole-icon';
import {captureAmbient} from '@/lib/capture-ambient';
import {requestCanvasFrame} from '@/lib/capture-frame';
import {capturePage} from '@/lib/capture-page';

function CollapseViewport({image,origin,onReady,onComplete,onError}:{image:HTMLCanvasElement;origin:{x:number;y:number};onReady:()=>void;onComplete:()=>void;onError:(error:unknown)=>void}){
 const canvas=useRef<HTMLCanvasElement>(null);
 useEffect(()=>{
  let cancelled=false,dispose:(()=>void)|undefined;
  import('@/lib/black-hole-engine').then(({startDestruction})=>{
   if(cancelled||!canvas.current)return;
   try{dispose=startDestruction(canvas.current,image,origin,onReady,onComplete);}catch(error){onError(error);}
  }).catch(error=>{if(!cancelled)onError(error);});
  return()=>{cancelled=true;dispose?.();};
 },[image,origin,onReady,onComplete,onError]);
 return <canvas className="collapse-viewport" ref={canvas} aria-hidden="true"/>;
}

type Stage='idle'|'preparing'|'collapsing'|'quiet'|'restoring';
export function EscapeHatch(){
 const [stage,setStage]=useState<Stage>('idle'),[hover,setHover]=useState(false),[error,setError]=useState<string|null>(null);
 const trigger=useRef<HTMLButtonElement>(null),dialog=useRef<HTMLDialogElement>(null);
 const timer=useRef<ReturnType<typeof setTimeout>|null>(null),request=useRef(0);
 const [capture,setCapture]=useState<{image:HTMLCanvasElement;origin:{x:number;y:number}}|null>(null);
 const consume=useCallback(()=>{document.documentElement.classList.add('site-consumed');},[]);
 const finishCollapse=useCallback(()=>{consume();setStage('quiet');},[consume]);
 const failAnimation=useCallback((reason:unknown)=>{
  console.error('Black-hole animation could not start',reason);
  request.current++;dialog.current?.close();setCapture(null);
  document.documentElement.classList.remove('site-consumed','site-restoring','site-capturing');
  setStage('idle');setError("The animation couldn't start. Please try again.");
  trigger.current?.focus({preventScroll:true});
 },[]);
 function finishRestore(){
  dialog.current?.close();setCapture(null);
  document.documentElement.classList.remove('site-consumed','site-restoring','site-capturing');
  setStage('idle');trigger.current?.focus({preventScroll:true});
 }
 function restore(){
  request.current++;
  if(timer.current)clearTimeout(timer.current);
  if(stage!=='quiet'||matchMedia('(prefers-reduced-motion: reduce)').matches){finishRestore();return;}
  setStage('restoring');document.documentElement.classList.remove('site-consumed','site-capturing');document.documentElement.classList.add('site-restoring');
  timer.current=setTimeout(finishRestore,650);
 }
 useEffect(()=>()=>{
  request.current++;
  if(timer.current)clearTimeout(timer.current);
  document.documentElement.classList.remove('site-consumed','site-restoring','site-capturing');
 },[]);
 useEffect(()=>{
  if(stage!=='idle'&&dialog.current&&!dialog.current.open)dialog.current.showModal();
  if(stage==='quiet')dialog.current?.querySelector<HTMLButtonElement>('.quiet-restore')?.focus();
 },[stage]);
 async function collapse(){
  if(stage!=='idle')return;
  const id=++request.current;setError(null);
  const preview=trigger.current!.querySelector('.black-hole-preview')!.getBoundingClientRect();
  const origin={x:preview.left+preview.width/2,y:preview.top+preview.height/2};
  document.documentElement.classList.add('site-capturing');
  setStage('preparing');
  if(matchMedia('(prefers-reduced-motion: reduce)').matches){finishCollapse();return;}
  try{
   // Desk preloading is optional and must never cancel the destruction animation.
   void import('@/lib/desk-model').catch(reason=>console.warn('Desk prefetch unavailable',reason));
   const [{default:html2canvas}]=await Promise.all([import('html2canvas'),import('@/lib/black-hole-engine')]);
   if(id!==request.current)return;
   const world=document.querySelector<HTMLElement>('.site-world')!;
   const image=await capturePage(()=>html2canvas(world,{
    backgroundColor:null,scale:Math.min(devicePixelRatio,1.5),useCORS:true,logging:false,imageTimeout:1600,
    x:0,y:scrollY,width:innerWidth,height:innerHeight,windowWidth:innerWidth,windowHeight:innerHeight,
    ignoreElements:el=>el.classList.contains('ambient-ascii')||el.classList.contains('ambient-clouds')||el.classList.contains('ambient-control')||el.tagName==='CANVAS',
   }),()=>captureAmbient(world));
   // The preview is decorative; failure to copy it must not bypass the animation.
   try{
    const icon=trigger.current?.querySelector('canvas');
    if(icon){
      const rect=icon.getBoundingClientRect(),ratio=image.width/innerWidth;
      image.getContext('2d')!.drawImage(requestCanvasFrame(icon),rect.x*ratio,rect.y*ratio,rect.width*ratio,rect.height*ratio);
    }
   }catch(reason){console.warn('Black-hole preview capture unavailable',reason);}
   if(id!==request.current)return;
   setCapture({image,origin});setStage('collapsing');
  }catch(reason){if(id===request.current)failAnimation(reason);}
 }
 return <>
  <button ref={trigger} className="escape-trigger" onClick={collapse} onPointerEnter={()=>setHover(true)} onPointerLeave={()=>setHover(false)} onFocus={()=>setHover(true)} onBlur={()=>setHover(false)} aria-label="Collapse the website into a black hole. You can restore it afterwards." aria-busy={stage==='preparing'}>
   <BlackHoleIcon active={hover&&stage==='idle'}/>
   <span className="escape-label">A little less internet?<small>Make some space.</small></span>
  </button>
  {error&&<p className="escape-error" role="alert">{error}</p>}
  {stage!=='idle'&&createPortal(
   <dialog ref={dialog} className={`quiet-dialog stage-${stage}`} onCancel={e=>{e.preventDefault();restore();}} aria-labelledby="quiet-title">
    {(stage==='preparing'||stage==='collapsing')&&<button className="quiet-skip" onClick={()=>{request.current++;finishCollapse();}}>Skip animation</button>}
    {stage==='collapsing'&&capture&&<CollapseViewport image={capture.image} origin={capture.origin} onReady={consume} onComplete={finishCollapse} onError={failAnimation}/>}
    <div className="quiet-scene">
     {(stage==='quiet'||stage==='restoring')&&<DeskScene/>}
     <h2 id="quiet-title">Just me and the next idea.</h2>
     <button className="quiet-restore text-link" onClick={restore}><RotateCcw size={14} aria-hidden="true"/>Bring the website back</button>
    </div>
   </dialog>,document.body
  )}
 </>;
}
