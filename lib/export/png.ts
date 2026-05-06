import { toPng } from "html-to-image";
import { saveAs } from "file-saver";

const shouldIncludeNode = (node: unknown) =>
  !(node instanceof HTMLElement && node.closest("[data-export-ignore]"));

/** Trim a uniform margin around the image (uses top-left pixel as reference “background”). */
const trimPngDataUrl = (dataUrl: string, tolerance = 14): Promise<string> =>
  new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = img.naturalWidth;
      canvas.height = img.naturalHeight;
      const ctx = canvas.getContext("2d");
      if (!ctx || canvas.width === 0 || canvas.height === 0) {
        resolve(dataUrl);
        return;
      }
      ctx.drawImage(img, 0, 0);
      let imageData: ImageData;
      try {
        imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      } catch {
        resolve(dataUrl);
        return;
      }
      const { data, width, height } = imageData;
      const refR = data[0];
      const refG = data[1];
      const refB = data[2];
      const refA = data[3];

      const sameBg = (i: number) => {
        const r = data[i];
        const g = data[i + 1];
        const b = data[i + 2];
        const a = data[i + 3];
        if (a < 12) return true;
        return (
          Math.abs(r - refR) <= tolerance &&
          Math.abs(g - refG) <= tolerance &&
          Math.abs(b - refB) <= tolerance &&
          Math.abs(a - refA) <= 20
        );
      };

      let top = 0;
      let bottom = height - 1;
      let left = 0;
      let right = width - 1;

      outerTop: for (let y = 0; y < height; y++) {
        for (let x = 0; x < width; x++) {
          const i = (y * width + x) * 4;
          if (!sameBg(i)) {
            top = y;
            break outerTop;
          }
        }
      }

      outerBottom: for (let y = height - 1; y >= top; y--) {
        for (let x = 0; x < width; x++) {
          const i = (y * width + x) * 4;
          if (!sameBg(i)) {
            bottom = y;
            break outerBottom;
          }
        }
      }

      outerLeft: for (let x = 0; x < width; x++) {
        for (let y = top; y <= bottom; y++) {
          const i = (y * width + x) * 4;
          if (!sameBg(i)) {
            left = x;
            break outerLeft;
          }
        }
      }

      outerRight: for (let x = width - 1; x >= left; x--) {
        for (let y = top; y <= bottom; y++) {
          const i = (y * width + x) * 4;
          if (!sameBg(i)) {
            right = x;
            break outerRight;
          }
        }
      }

      const w = right - left + 1;
      const h = bottom - top + 1;
      if (w <= 0 || h <= 0 || (w === width && h === height)) {
        resolve(dataUrl);
        return;
      }

      const trimmed = document.createElement("canvas");
      trimmed.width = w;
      trimmed.height = h;
      const tctx = trimmed.getContext("2d");
      if (!tctx) {
        resolve(dataUrl);
        return;
      }
      tctx.drawImage(canvas, left, top, w, h, 0, 0, w, h);
      resolve(trimmed.toDataURL("image/png"));
    };
    img.onerror = () => reject(new Error("PNG trim: failed to load image"));
    img.src = dataUrl;
  });

export const exportAsPng = async (element: HTMLElement, filename = "resume.png") => {
  const scrollHost = element.closest(".overflow-auto");
  if (scrollHost instanceof HTMLElement) {
    scrollHost.scrollTop = 0;
    scrollHost.scrollLeft = 0;
  }

  const width = Math.round(element.offsetWidth || element.getBoundingClientRect().width);
  const height = Math.round(element.offsetHeight || element.getBoundingClientRect().height);

  const raw = await toPng(element, {
    cacheBust: true,
    pixelRatio: 2,
    width,
    height,
    backgroundColor: "#ffffff",
    filter: (domNode) => shouldIncludeNode(domNode),
    style: {
      margin: "0",
      transform: "none",
      boxShadow: "none",
      outline: "none",
    },
  });

  const trimmed = await trimPngDataUrl(raw);
  saveAs(trimmed, filename);
};
