import * as THREE from "three";
import { ElasticSheet, smooth } from "./elastic-sheet";
import { CAPTURE_FRAME, copyCanvas, type FrameRequest } from "./capture-frame";

const vertexShader = `varying vec2 vUv;
void main(){vUv=uv;gl_Position=vec4(position.xy,0.,1.);}`;
/** Curved-ray disk rendering, visually inspired by Schwarzschild lensing.
 * This is an artistic numerical approximation, not a calibrated relativity solver. */
const fragmentShader = `
precision highp float;
varying vec2 vUv;
uniform vec2 uResolution;
uniform vec2 uCenter;
uniform float uRadius;
uniform float uTime;
uniform float uPresence;
uniform float uPage;
uniform float uTilt;
uniform sampler2D uTexture;
float hash(vec2 p){return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5453);}
float noise(vec2 p){vec2 i=floor(p),f=fract(p);f=f*f*(3.-2.*f);return mix(mix(hash(i),hash(i+vec2(1.,0.)),f.x),mix(hash(i+vec2(0.,1.)),hash(i+vec2(1.,1.)),f.x),f.y);}
vec3 paper(vec2 uv){
 if(uPage<.5)return vec3(1.);
 if(uv.x<0.||uv.y<0.||uv.x>1.||uv.y>1.)return vec3(1.);
 return texture2D(uTexture,uv).rgb;
}
void main(){
 vec3 background=paper(vUv);
 vec2 pixel=vUv*uResolution-uCenter;
 float rotation=-.16;
 pixel=mat2(cos(rotation),-sin(rotation),sin(rotation),cos(rotation))*pixel;
 vec2 p=pixel/max(uRadius,.1);
 vec3 result=background;
 if(length(p)<5.5 && uPresence>.001){
   vec3 origin=vec3(0.,1.35+uTilt*.6,7.);
   vec3 forward=normalize(-origin);
   vec3 right=vec3(1.,0.,0.);
   vec3 up=normalize(cross(right,forward));
   vec3 ray=normalize(forward*4.1+right*p.x+up*p.y);
   vec3 initialRay=ray;
   vec3 pos=origin;
   float angular=dot(cross(pos,ray),cross(pos,ray));
   vec3 light=vec3(0.);
   float transmission=1.;
   float captured=0.;
   float closest=9.;
   for(int i=0;i<88;i++){
     float radius=length(pos);
     closest=min(closest,radius);
     if(radius<1.){captured=1.;break;}
     if(radius>13. && dot(pos,ray)>0.)break;
     float stepSize=clamp(radius*.065,.035,.42);
     vec3 old=pos;
     vec3 acceleration=-1.5*angular*pos/pow(radius,5.);
     ray=normalize(ray+acceleration*stepSize);
     pos+=ray*stepSize;
     if(old.y*pos.y<0.){
       float fraction=abs(old.y)/(abs(old.y)+abs(pos.y));
       vec3 point=mix(old,pos,fraction);
       float r=length(point.xz);
       if(r>1.7 && r<5.2){
         float angle=atan(point.z,point.x);
         float flow=angle-uTime*(1.7/pow(r,.8));
         float n=noise(vec2(r*12.,flow*4.));
         float bands=.45+.55*pow(.5+.5*sin(r*35.+n*5.),2.);
         float edges=smoothstep(1.7,1.95,r)*(1.-smoothstep(3.6,5.2,r));
         float doppler=pow(clamp(1.+.55*point.x/r,.4,1.6),2.);
         float hot=pow(1.8/r,1.6);
         vec3 ink=mix(vec3(.055,.15,.42),vec3(.78,.9,1.),clamp(hot,0.,1.));
         vec3 emission=ink*(.7+2.5*hot)*bands*doppler;
         float alpha=edges*.92;
         light+=transmission*emission*alpha;
         transmission*=1.-alpha;
       }
     }
   }
   // Refract the page locally around the shadow. The elastic sheet has already moved in world space.
   vec2 bend=vec2(dot(ray-initialRay,right),dot(ray-initialRay,up));
   vec3 lensed=paper(vUv+bend*uRadius/uResolution*.24*uPresence);
   vec3 ground=mix(lensed,vec3(.006,.009,.018),captured);
   float photon=exp(-abs(closest-1.52)*32.)*.26;
   vec3 disk=vec3(1.)-exp(-light*2.2);
   result=ground*transmission+disk+photon*vec3(.22,.42,.8);
   result=mix(background,result,uPresence);
 }
 gl_FragColor=vec4(clamp(result,0.,1.),1.);
 #include <colorspace_fragment>
 // The icon is composited over the real page, without an opaque white rectangle.
 if(uPage<.5){
   float alpha=1.-min(gl_FragColor.r,min(gl_FragColor.g,gl_FragColor.b));
   gl_FragColor=vec4(clamp((gl_FragColor.rgb-vec3(1.-alpha))/max(alpha,.0001),0.,1.),alpha);
 }
}`;

function rendererFor(canvas: HTMLCanvasElement, width: number, height: number, ratio: number, transparent = false) {
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: false, alpha: transparent, premultipliedAlpha: false, powerPreference: "high-performance" });
  renderer.setPixelRatio(Math.min(devicePixelRatio, ratio));
  renderer.setSize(width, height, false);
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.setClearColor(0xffffff, transparent ? 0 : 1);
  return renderer;
}
function lens(width: number, height: number, texture: THREE.Texture) {
  const material = new THREE.ShaderMaterial({
    vertexShader, fragmentShader, depthTest: false, depthWrite: false,
    uniforms: {
      uResolution: { value: new THREE.Vector2(width, height) },
      uCenter: { value: new THREE.Vector2(width / 2, height / 2) },
      uRadius: { value: 19 }, uTime: { value: 0 }, uPresence: { value: 1 },
      uPage: { value: 0 }, uTilt: { value: 0 }, uTexture: { value: texture },
    },
  });
  const scene = new THREE.Scene();
  const geometry = new THREE.PlaneGeometry(2, 2);
  scene.add(new THREE.Mesh(geometry, material));
  const camera = new THREE.Camera();
  return { scene, material, camera, dispose: () => { geometry.dispose(); material.dispose(); } };
}

export function createBlackHoleIcon(canvas: HTMLCanvasElement) {
  const width = 176, height = 120;
  const renderer = rendererFor(canvas, width, height, 2, true);
  const white = new THREE.DataTexture(new Uint8Array([255,255,255,255]),1,1);
  white.needsUpdate = true;
  const effect = lens(width, height, white);
  effect.material.uniforms.uRadius.value = 15.5;
  let frame = 0, active = false, disposed = false, clock = 0, last = 0;
  const draw = (now: number) => {
    if (disposed) return;
    clock += Math.min(.04, (now - (last || now)) / 1000); last = now;
    effect.material.uniforms.uTime.value = clock;
    effect.material.uniforms.uTilt.value = .2 * Math.sin(clock * .45);
    renderer.render(effect.scene, effect.camera);
    if (active) frame = requestAnimationFrame(draw);
  };
  draw(performance.now());
  const capture=(event:Event)=>{renderer.render(effect.scene,effect.camera);(event as CustomEvent<FrameRequest>).detail.frame=copyCanvas(canvas);};
  canvas.addEventListener(CAPTURE_FRAME,capture);
  return {
    setActive(value: boolean) {
      active = value && !document.hidden && !matchMedia("(prefers-reduced-motion: reduce)").matches;
      cancelAnimationFrame(frame); last = 0;
      if (active) frame = requestAnimationFrame(draw);
    },
    dispose() { disposed = true; canvas.removeEventListener(CAPTURE_FRAME,capture); cancelAnimationFrame(frame); effect.dispose(); white.dispose(); renderer.dispose(); renderer.forceContextLoss(); },
  };
}

export function startDestruction(canvas: HTMLCanvasElement, image: HTMLCanvasElement, origin: { x: number; y: number }, onReady: () => void, onComplete: () => void) {
  const width = innerWidth, height = innerHeight;
  const ratio = width < 600 ? 1 : 1.15;
  const renderer = rendererFor(canvas, width, height, ratio);
  const source = new THREE.CanvasTexture(image);
  source.colorSpace = THREE.SRGBColorSpace;
  const sheet = new ElasticSheet(width, height, width < 600 ? 26 : 38, 26);
  const geometry = new THREE.PlaneGeometry(width, height, width < 600 ? 26 : 38, 26);
  const vertices = geometry.getAttribute("position") as THREE.BufferAttribute;
  const paperMaterial = new THREE.MeshBasicMaterial({ map: source, side: THREE.DoubleSide, transparent: true });
  const paperScene = new THREE.Scene(); paperScene.background = new THREE.Color(0xffffff);
  paperScene.add(new THREE.Mesh(geometry, paperMaterial));
  const paperCamera = new THREE.OrthographicCamera(-width/2,width/2,height/2,-height/2,.1,3000);
  paperCamera.position.z = 1000;
  const target = new THREE.WebGLRenderTarget(Math.round(width * ratio),Math.round(height * ratio),{depthBuffer:true});
  const effect = lens(width,height,target.texture);
  effect.material.uniforms.uPage.value = 1;
  let frame = 0, disposed = false, start = 0, previous = 0, elapsed = 0, accumulator = 0, frames = 0;
  const duration = 4.7;
  const draw = (now: number) => {
    if (disposed) return;
    if (!start) { start = now; previous = now; }
    // Pause the simulation clock when a tab is hidden; no large catch-up impulse.
    const delta = document.hidden ? 0 : Math.min(.05,(now-previous)/1000);
    previous=now; elapsed+=delta; accumulator+=delta;
    const progress = Math.min(1,elapsed / 3.9);
    const travel = smooth(0,.95,elapsed);
    const cx = THREE.MathUtils.lerp(origin.x,width*.5,travel);
    const cy = THREE.MathUtils.lerp(origin.y,height*.5,travel);
    while(accumulator>=1/120){sheet.step(1/120,progress,cx-width/2,height/2-cy);accumulator-=1/120;}
    vertices.array.set(sheet.positions); vertices.needsUpdate = true;
    renderer.setRenderTarget(target); renderer.render(paperScene,paperCamera);
    effect.material.uniforms.uCenter.value.set(cx,height-cy);
    effect.material.uniforms.uTime.value=elapsed;
    effect.material.uniforms.uRadius.value=(20+60*smooth(0,.9,elapsed))*(1-smooth(4.05,4.7,elapsed));
    effect.material.uniforms.uPresence.value=smooth(0,.18,elapsed)*(1-smooth(4.1,4.7,elapsed));
    renderer.setRenderTarget(null); renderer.render(effect.scene,effect.camera);
    if(frames++===0)onReady();
    canvas.dataset.frames=String(frames); canvas.dataset.captured=String(sheet.captured);
    canvas.dataset.phase=elapsed<.8?"anticipation":elapsed<2.4?"pull":"absorb";
    if(elapsed<duration)frame=requestAnimationFrame(draw);
    else onComplete();
  };
  frame=requestAnimationFrame(draw);
  return () => {
    disposed=true; cancelAnimationFrame(frame); geometry.dispose(); paperMaterial.dispose(); source.dispose();
    target.dispose(); effect.dispose(); renderer.dispose(); renderer.forceContextLoss();
  };
}
