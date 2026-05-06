const PREVIEW_HTML_KEY = "cv-gen:a4-preview-html";
const PREVIEW_TITLE_KEY = "cv-gen:a4-preview-title";

export const exportAsPrint = () => {
  window.print();
};

export const openA4Preview = (element: HTMLElement, title = "Resume Preview") => {
  const safeTitle = title.replace(/[\u0000-\u001F<>"]/g, " ").trim() || "Resume Preview";

  const clone = element.cloneNode(true) as HTMLElement;
  for (const attr of ["data-cv-preview-snap", "data-cv-preview-straddle", "data-cv-preview-snap-group"]) {
    clone.querySelectorAll(`[${attr}]`).forEach((node) => {
      const el = node as HTMLElement;
      if (attr === "data-cv-preview-snap") el.style.marginTop = "";
      el.removeAttribute(attr);
    });
  }

  try {
    sessionStorage.setItem(PREVIEW_HTML_KEY, clone.outerHTML);
    sessionStorage.setItem(PREVIEW_TITLE_KEY, safeTitle);
  } catch {
    throw new Error("Could not store preview (session storage may be full or disabled).");
  }

  const url = `${window.location.origin}/preview-a4`;
  const previewWindow = window.open(url, "_blank", "noopener,noreferrer");

  if (!previewWindow) {
    throw new Error("Could not open preview tab. Check your popup blocker.");
  }
};
