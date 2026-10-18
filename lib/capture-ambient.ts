import { requestCanvasFrame } from "./capture-frame";

/** Rasterize the current decorative layers with their CSS blend modes and masks.
 * html2canvas cannot reproduce video filters, live WebGL, or CSS mask-image itself. */
export function captureAmbient(world: HTMLElement) {
  const width=innerWidth, height=innerHeight, ratio=Math.min(devicePixelRatio||1,1.5);
  const makeCanvas=()=>{const canvas=document.createElement("canvas");canvas.width=Math.ceil(width*ratio);canvas.height=Math.ceil(height*ratio);return canvas;};
  const background=makeCanvas(), output=background.getContext("2d")!;
  output.scale(ratio,ratio);output.fillStyle="#fff";output.fillRect(0,0,width,height);
  const rootStyle=getComputedStyle(world);
  const readingWidth=parseFloat(rootStyle.getPropertyValue("--ambient-reading-width"))||1040;
  const start=Math.max(20,(width-readingWidth)/2),end=Math.min(width-20,(width+readingWidth)/2);
  const layers=Array.from(world.querySelectorAll<HTMLElement>(".ambient-clouds,.ambient-ascii"))
    .sort((a,b)=>Number(getComputedStyle(a).zIndex)-Number(getComputedStyle(b).zIndex));
  for(const element of layers){
    const style=getComputedStyle(element), bounds=element.getBoundingClientRect();
    const layer=makeCanvas(), ctx=layer.getContext("2d")!;ctx.scale(ratio,ratio);
    const isCloud=element.classList.contains("ambient-clouds");
    if(isCloud){
      const source=element.querySelector("canvas");
      if(source&&getComputedStyle(source).visibility!=="hidden"){
        ctx.drawImage(requestCanvasFrame(source),bounds.x,bounds.y,bounds.width,bounds.height);
      }else{
        const sky=ctx.createLinearGradient(0,bounds.y,0,bounds.bottom);
        sky.addColorStop(0,rootStyle.getPropertyValue("--ambient-sky-top").trim()||"#89addb");
        sky.addColorStop(1,rootStyle.getPropertyValue("--ambient-sky-bottom").trim()||"#d5e5f7");
        ctx.fillStyle=sky;ctx.fillRect(bounds.x,bounds.y,bounds.width,bounds.height);
      }
    }else{
      ctx.fillStyle=style.backgroundColor;ctx.fillRect(0,0,width,height);
      const video=element.querySelector("video");
      if(video&&video.readyState>=2){
        const scale=Math.max(width/video.videoWidth,height/video.videoHeight);
        ctx.globalCompositeOperation="screen";ctx.filter="invert(1)";
        ctx.drawImage(video,(width-video.videoWidth*scale)/2,(height-video.videoHeight*scale)/2,video.videoWidth*scale,video.videoHeight*scale);
        ctx.filter="none";ctx.globalCompositeOperation="source-over";
        // A stale, non-CORS video frame must not taint the entire page capture.
        try{ctx.getImageData(0,0,1,1);}catch{
          layer.width=layer.width;ctx.scale(ratio,ratio);ctx.fillStyle=style.backgroundColor;ctx.fillRect(0,0,width,height);
        }
      }
    }
    const parsed=parseFloat(rootStyle.getPropertyValue(isCloud?"--ambient-cloud-content-opacity":"--ambient-ascii-content-opacity"));
    const inner=Number.isFinite(parsed)?Math.min(1,Math.max(0,parsed)):(isCloud?.2:1/3);
    const horizontal=ctx.createLinearGradient(0,0,width,0);
    horizontal.addColorStop(0,"#000");horizontal.addColorStop(start/width,`rgba(0,0,0,${inner})`);
    horizontal.addColorStop(end/width,`rgba(0,0,0,${inner})`);horizontal.addColorStop(1,"#000");
    ctx.globalCompositeOperation="destination-in";ctx.fillStyle=horizontal;ctx.fillRect(0,0,width,height);
    if(isCloud){
      const fade=parseFloat(rootStyle.getPropertyValue("--ambient-cloud-fade-start"))||.65;
      const vertical=ctx.createLinearGradient(0,bounds.y,0,bounds.bottom);
      vertical.addColorStop(0,"#000");vertical.addColorStop(fade,"#000");vertical.addColorStop(1,"#0000");
      ctx.fillStyle=vertical;ctx.fillRect(0,0,width,height);
    }
    output.globalAlpha=Number(style.opacity);output.drawImage(layer,0,0,width,height);
  }
  return background;
}
