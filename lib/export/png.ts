import { toPng } from "html-to-image";
import { saveAs } from "file-saver";

export const exportAsPng = async (element: HTMLElement, filename = "resume.png") => {
  const dataUrl = await toPng(element, {
    cacheBust: true,
    pixelRatio: 2,
    backgroundColor: "#ffffff",
  });

  saveAs(dataUrl, filename);
};
