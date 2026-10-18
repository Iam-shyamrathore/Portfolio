"use client";
import {useEffect,useRef,useState} from 'react';
import type {createBlackHoleIcon} from '@/lib/black-hole-engine';
export function BlackHoleIcon({active}:{active:boolean}){
 const canvas=useRef<HTMLCanvasElement>(null),control=useRef<ReturnType<typeof createBlackHoleIcon>|null>(null),current=useRef(active);
 const [failed,setFailed]=useState(false);
 useEffect(()=>{
  let cancelled=false,started=false;
  const observer=new IntersectionObserver(entries=>{
   if(!entries[0].isIntersecting){control.current?.setActive(false);return;}
   if(started){control.current?.setActive(current.current);return;}
   started=true;
   import('@/lib/black-hole-engine').then(({createBlackHoleIcon})=>{
    if(cancelled||!canvas.current)return;
    try{control.current=createBlackHoleIcon(canvas.current);control.current.setActive(current.current);}catch{setFailed(true);}
   }).catch(()=>{if(!cancelled)setFailed(true);});
  },{rootMargin:'120px'});
  if(canvas.current)observer.observe(canvas.current);
  const visibility=()=>control.current?.setActive(current.current);
  document.addEventListener('visibilitychange',visibility);
  return()=>{cancelled=true;observer.disconnect();document.removeEventListener('visibilitychange',visibility);control.current?.dispose();control.current=null;};
 },[]);
 useEffect(()=>{current.current=active;control.current?.setActive(active);},[active]);
 return <span className={`black-hole-preview ${failed?'black-hole-fallback':''}`} aria-hidden="true"><canvas ref={canvas}/><span className="black-hole-fallback-core"/></span>;
}
