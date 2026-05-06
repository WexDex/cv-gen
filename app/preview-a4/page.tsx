"use client";

import { useEffect, useState } from "react";

const PREVIEW_HTML_KEY = "cv-gen:a4-preview-html";
const PREVIEW_TITLE_KEY = "cv-gen:a4-preview-title";

export default function PreviewA4Page() {
  const [html, setHtml] = useState<string | null>(null);

  useEffect(() => {
    queueMicrotask(() => {
      const h = sessionStorage.getItem(PREVIEW_HTML_KEY);
      const t = sessionStorage.getItem(PREVIEW_TITLE_KEY);
      if (t) document.title = t;
      setHtml(h);
    });
  }, []);

  if (html === null) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-zinc-100 text-zinc-500 text-sm">
        Loading preview…
      </main>
    );
  }

  if (!html) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-zinc-100 p-4 text-center text-sm text-zinc-600">
        No preview data. Use Preview from the builder (pop-ups must be allowed).
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-zinc-200">
      <div className="sticky top-0 z-10 flex flex-wrap items-center justify-between gap-3 border-b border-zinc-300 bg-zinc-900 px-4 py-2 text-sm text-white print:hidden">
        <span>A4 preview — use Print / Save as PDF for multiple pages if needed</span>
        <button
          type="button"
          className="rounded border border-zinc-600 bg-zinc-800 px-3 py-1.5 text-xs font-medium hover:bg-zinc-700"
          onClick={() => window.print()}
        >
          Print / Save PDF
        </button>
      </div>
      <div className="bg-zinc-200 p-4 print:bg-white print:p-0 print:overflow-visible">
        <div dangerouslySetInnerHTML={{ __html: html }} />
      </div>
    </main>
  );
}
