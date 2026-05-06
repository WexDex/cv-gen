"use client";

import { useLayoutEffect } from "react";
import type { RefObject } from "react";
import type { Resume } from "@/lib/types";

const SNAP_ATTR = "data-cv-preview-snap";
const STRADDLE_ATTR = "data-cv-preview-straddle";
const GROUP_ATTR = "data-cv-preview-snap-group";

function measureA4HeightPx(root: HTMLElement): number {
  const probe = document.createElement("div");
  probe.className = "cv-a4-band-measure";
  root.appendChild(probe);
  const h = probe.offsetHeight;
  root.removeChild(probe);
  return Math.max(1, h);
}

function topFromRoot(el: Element, root: HTMLElement): number {
  const r = root.getBoundingClientRect();
  const e = el.getBoundingClientRect();
  return e.top - r.top + root.scrollTop;
}

/** True if some horizontal page band edge lies strictly inside [y, y+h). */
function crossesPageBoundary(y: number, h: number, H: number): boolean {
  if (h <= 0 || H <= 0) return false;
  const y1 = y + h;
  return Math.floor(y1 / H - 1e-6) > Math.floor(y / H + 1e-6);
}

function collectBareSections(column: Element): HTMLElement[] {
  const sections = [...column.querySelectorAll(":scope section.cv-print-section")] as HTMLElement[];
  return sections.filter((sec) => !sec.querySelector(".cv-print-subblock"));
}

function collectSnapTargets(column: Element, root: HTMLElement): HTMLElement[] {
  const headers = [...column.querySelectorAll(":scope .cv-print-header")] as HTMLElement[];
  const subblocks = [...column.querySelectorAll(":scope .cv-print-subblock")] as HTMLElement[];
  const bareSections = collectBareSections(column);
  const seen = new Set<HTMLElement>();
  const add = (el: HTMLElement) => {
    if (el.isConnected) seen.add(el);
  };
  headers.forEach(add);
  subblocks.forEach(add);
  bareSections.forEach(add);
  return [...seen].sort((a, b) => topFromRoot(a, root) - topFromRoot(b, root));
}

function clearPreviewPageMarkers(root: HTMLElement) {
  root.querySelectorAll(`[${SNAP_ATTR}]`).forEach((node) => {
    const el = node as HTMLElement;
    el.style.marginTop = "";
    el.removeAttribute(SNAP_ATTR);
  });
  root.querySelectorAll(`[${STRADDLE_ATTR}]`).forEach((n) => n.removeAttribute(STRADDLE_ATTR));
  root.querySelectorAll(`[${GROUP_ATTR}]`).forEach((n) => n.removeAttribute(GROUP_ATTR));
}

function markBlockWrapper(el: HTMLElement) {
  const wrap = el.closest("[data-keep-selection]") as HTMLElement | null;
  if (wrap) wrap.setAttribute(GROUP_ATTR, "1");
}

function applyStraddleAndGroupHighlights(root: HTMLElement, targets: HTMLElement[], H: number) {
  for (const el of targets) {
    el.removeAttribute(STRADDLE_ATTR);
  }
  root.querySelectorAll(`[${GROUP_ATTR}]`).forEach((n) => n.removeAttribute(GROUP_ATTR));

  for (const el of targets) {
    const y = topFromRoot(el, root);
    const h = el.getBoundingClientRect().height;
    if (crossesPageBoundary(y, h, H)) {
      el.setAttribute(STRADDLE_ATTR, "1");
    }
  }

  for (const el of targets) {
    if (el.hasAttribute(SNAP_ATTR) || el.hasAttribute(STRADDLE_ATTR)) {
      markBlockWrapper(el);
    }
  }
}

function applySnap(root: HTMLElement, inner: HTMLElement) {
  clearPreviewPageMarkers(root);
  const H = measureA4HeightPx(root);
  /** Skip snap for blocks nearly a full band tall (print will fragment inside). */
  const tallEpsilon = 6;
  /** Tight band crossing → fewer “extra” highlighted rows vs export. */
  const edgeSlack = 1;
  const columns = inner.querySelectorAll(":scope > div");

  const targets: HTMLElement[] = [];
  columns.forEach((col) => {
    collectSnapTargets(col, root).forEach((t) => targets.push(t));
  });

  let guard = 0;
  while (guard++ < 40) {
    let changed = false;
    const sorted = [...targets].sort((a, b) => topFromRoot(a, root) - topFromRoot(b, root));
    for (const el of sorted) {
      const y = topFromRoot(el, root);
      const h = el.getBoundingClientRect().height;
      const rel = ((y % H) + H) % H;
      if (h >= H - tallEpsilon) continue;
      if (rel + h > H - edgeSlack) {
        const add = H - rel;
        const prev = parseFloat(el.style.marginTop) || 0;
        el.style.marginTop = `${prev + add}px`;
        el.setAttribute(SNAP_ATTR, "1");
        changed = true;
      }
    }
    if (!changed) break;
  }

  applyStraddleAndGroupHighlights(root, targets, H);
}

/** Approximate print pagination on screen: shift “avoid-break” blocks to the next A4 band. */
export function useA4PreviewPageSnap(printRootRef: RefObject<HTMLElement | null> | undefined, resume: Resume) {
  useLayoutEffect(() => {
    const root = printRootRef?.current;
    if (!root) return;

    const inner = root.querySelector(".cv-resume-sheet-inner") as HTMLElement | null;
    if (!inner) return;

    const run = () => {
      applySnap(root, inner);
    };

    const ro = new ResizeObserver(() => {
      requestAnimationFrame(run);
    });
    ro.observe(root);
    ro.observe(inner);
    requestAnimationFrame(run);

    return () => {
      ro.disconnect();
      clearPreviewPageMarkers(root);
    };
  }, [printRootRef, resume]);
}
