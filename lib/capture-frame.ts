/** Synchronous capture: WebGL must paint and copy before its back buffer is cleared. */
export const CAPTURE_FRAME = "portfolio:capture-frame";
export type FrameRequest = { frame?: HTMLCanvasElement };
export function copyCanvas(source: HTMLCanvasElement) {
  const frame = document.createElement("canvas");
  frame.width = source.width; frame.height = source.height;
  frame.getContext("2d")!.drawImage(source, 0, 0);
  return frame;
}
export function requestCanvasFrame(canvas: HTMLCanvasElement) {
  const detail: FrameRequest = {};
  canvas.dispatchEvent(new CustomEvent<FrameRequest>(CAPTURE_FRAME, { detail }));
  return detail.frame ?? copyCanvas(canvas);
}
