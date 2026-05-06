export const exportAsPrint = () => {
  window.print();
};

export const openA4Preview = (element: HTMLElement, title = "Resume Preview") => {
  const previewWindow = window.open("", "_blank", "noopener,noreferrer");
  if (!previewWindow) {
    throw new Error("Could not open preview tab.");
  }

  const html = `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>${title}</title>
  <style>
    :root {
      color-scheme: light;
    }
    * {
      box-sizing: border-box;
    }
    body {
      margin: 0;
      background: #e5e7eb;
      font-family: Arial, Helvetica, sans-serif;
    }
    .toolbar {
      position: sticky;
      top: 0;
      z-index: 10;
      display: flex;
      justify-content: space-between;
      gap: 12px;
      align-items: center;
      padding: 10px 14px;
      background: rgba(17, 24, 39, 0.9);
      color: #f9fafb;
      backdrop-filter: blur(8px);
    }
    .toolbar button {
      cursor: pointer;
      border: 1px solid #4b5563;
      border-radius: 8px;
      background: #111827;
      color: #f9fafb;
      padding: 6px 10px;
      font-size: 12px;
    }
    .preview-stage {
      padding: 12px 0 24px;
    }
    .paper {
      width: 210mm;
      min-height: 297mm;
      margin: 0 auto 12px;
      background: white;
      box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
    }
    @page {
      size: A4;
      margin: 0;
    }
    @media print {
      body {
        background: white;
      }
      .toolbar {
        display: none;
      }
      .preview-stage {
        padding: 0;
      }
      .paper {
        margin: 0;
        box-shadow: none;
        page-break-after: auto;
      }
    }
  </style>
</head>
<body>
  <div class="toolbar">
    <span>A4 Preview (supports multi-page printing)</span>
    <button type="button" onclick="window.print()">Print / Save PDF</button>
  </div>
  <div class="preview-stage">
    <div class="paper">${element.innerHTML}</div>
  </div>
</body>
</html>`;

  previewWindow.document.open();
  previewWindow.document.write(html);
  previewWindow.document.close();
};
