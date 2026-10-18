/** Keep optional background capture independent of the page animation.
 * Paint it behind a transparent DOM capture rather than injecting images into
 * html2canvas's cloned document (which can reject the whole capture). */
export async function capturePage(
  renderForeground: () => Promise<HTMLCanvasElement>,
  renderBackground: () => HTMLCanvasElement,
  warn: (error: unknown) => void = error => console.warn("Black-hole background capture unavailable", error),
) {
  let background: HTMLCanvasElement | undefined;
  try { background = renderBackground(); } catch (error) { warn(error); }
  const page = await renderForeground();
  // html2canvas retains its DPR/scroll transform and clipping state on `page`.
  // Never reuse that context to fill a viewport: flatten on a fresh opaque bitmap.
  const flattened = document.createElement("canvas");
  flattened.width = page.width; flattened.height = page.height;
  const context = flattened.getContext("2d", { alpha: false });
  if (!context) throw new Error("Page capture has no 2D context");
  context.fillStyle = "#fff";
  context.fillRect(0, 0, flattened.width, flattened.height);
  if (background) context.drawImage(background, 0, 0, flattened.width, flattened.height);
  context.drawImage(page, 0, 0);
  return flattened;
}
