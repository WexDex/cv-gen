"use client";

import { useLayoutEffect } from "react";
import type { RefObject } from "react";
import type { Resume } from "@/lib/types";

const SNAP_ATTR = "data-cv-preview-snap";
const STRADDLE_ATTR = "data-cv-preview-straddle";
const GROUP_ATTR = "data-cv-preview-snap-group";
/** Stores the pre-snap inline marginTop so it survives clear/re-snap cycles. */
const ORIG_MT_ATTR = "data-cv-snap-orig-mt";

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

/** True if a page band edge lies strictly inside [y, y+h). */
function crossesPageBoundary(y: number, h: number, H: number): boolean {
  if (h <= 0 || H <= 0) return false;
  const y1 = y + h;
  return Math.floor(y1 / H - 1e-6) > Math.floor(y / H + 1e-6);
}

/**
 * Returns the element's effective height including its computed bottom margin.
 * This catches cases where a custom margin-bottom pushes into the next page band.
 */
function effectiveHeight(el: HTMLElement): number {
  const bcrH = el.getBoundingClientRect().height;
  const mb = parseFloat(getComputedStyle(el).marginBottom) || 0;
  return bcrH + mb;
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
  const add = (el: HTMLElement) => { if (el.isConnected) seen.add(el); };
  headers.forEach(add);
  subblocks.forEach(add);
  bareSections.forEach(add);
  return [...seen].sort((a, b) => topFromRoot(a, root) - topFromRoot(b, root));
}

/**
 * Restores the element's inline marginTop to the value saved before snapping,
 * then clears the saved value and the snap marker.
 */
function restoreAndClear(el: HTMLElement) {
  const orig = el.getAttribute(ORIG_MT_ATTR);
  el.style.marginTop = orig ?? "";
  el.removeAttribute(ORIG_MT_ATTR);
  el.removeAttribute(SNAP_ATTR);
}

function clearPreviewPageMarkers(root: HTMLElement) {
  root.querySelectorAll(`[${SNAP_ATTR}]`).forEach((node) => restoreAndClear(node as HTMLElement));
  root.querySelectorAll(`[${STRADDLE_ATTR}]`).forEach((n) => n.removeAttribute(STRADDLE_ATTR));
  root.querySelectorAll(`[${GROUP_ATTR}]`).forEach((n) => n.removeAttribute(GROUP_ATTR));
}

/**
 * Snap an element to the next page band.
 * Saves the original inline marginTop on first snap so it can be restored on clear.
 * Accounts for any existing custom inline marginTop (e.g. from BlockStyle.margin.top).
 */
function snapElement(el: HTMLElement, H: number, tallEpsilon: number, edgeSlack: number, root: HTMLElement): boolean {
  const y = topFromRoot(el, root);
  const h = effectiveHeight(el);
  const rel = ((y % H) + H) % H;
  if (h >= H - tallEpsilon) return false;
  if (rel + h > H - edgeSlack) {
    // Save original margin before first snap in this cycle.
    if (!el.hasAttribute(SNAP_ATTR)) {
      el.setAttribute(ORIG_MT_ATTR, el.style.marginTop || "");
    }
    const prev = parseFloat(el.style.marginTop) || 0;
    el.style.marginTop = `${prev + (H - rel)}px`;
    el.setAttribute(SNAP_ATTR, "1");
    return true;
  }
  return false;
}

function snapOrphanTitles(column: Element, root: HTMLElement, H: number, tallEpsilon: number, edgeSlack: number) {
  const sections = [...column.querySelectorAll(":scope section.cv-print-section")] as HTMLElement[];
  for (const sec of sections) {
    const h3 = sec.querySelector(":scope > h3") as HTMLElement | null;
    const firstSubblock = sec.querySelector(":scope .cv-print-subblock") as HTMLElement | null;
    if (!h3 || !firstSubblock) continue;
    const titlePage = Math.floor(topFromRoot(h3, root) / H);
    const subPage = Math.floor(topFromRoot(firstSubblock, root) / H);
    if (subPage > titlePage) {
      snapElement(sec, H, tallEpsilon, edgeSlack, root);
    }
  }
}

function markBlockWrapper(el: HTMLElement) {
  const wrap = el.closest("[data-keep-selection]") as HTMLElement | null;
  if (wrap) wrap.setAttribute(GROUP_ATTR, "1");
}

function applyStraddleAndGroupHighlights(root: HTMLElement, targets: HTMLElement[], H: number) {
  // Full clear of straddle/group attrs (both targets and any propagated children from last pass).
  root.querySelectorAll(`[${STRADDLE_ATTR}]`).forEach((n) => n.removeAttribute(STRADDLE_ATTR));
  root.querySelectorAll(`[${GROUP_ATTR}]`).forEach((n) => n.removeAttribute(GROUP_ATTR));

  // Mark individual snap targets that still cross a page boundary.
  for (const el of targets) {
    const y = topFromRoot(el, root);
    const h = effectiveHeight(el);
    if (crossesPageBoundary(y, h, H)) {
      el.setAttribute(STRADDLE_ATTR, "1");
      markBlockWrapper(el);
    }
  }

  // Check every section: if it straddles, mark it AND all its subblock children.
  const allSections = [...root.querySelectorAll("section.cv-print-section")] as HTMLElement[];
  for (const sec of allSections) {
    const y = topFromRoot(sec, root);
    const h = effectiveHeight(sec);
    if (crossesPageBoundary(y, h, H)) {
      sec.setAttribute(STRADDLE_ATTR, "1");
      sec.querySelectorAll(".cv-print-subblock").forEach((child) => {
        (child as HTMLElement).setAttribute(STRADDLE_ATTR, "1");
      });
      markBlockWrapper(sec);
    }
  }

  // Mark wrappers for snapped targets too.
  for (const el of targets) {
    if (el.hasAttribute(SNAP_ATTR)) {
      markBlockWrapper(el);
    }
  }
}

function applySnap(root: HTMLElement, inner: HTMLElement) {
  clearPreviewPageMarkers(root);
  const H = measureA4HeightPx(root);
  const tallEpsilon = 6;
  const edgeSlack = 1;
  const columns = inner.querySelectorAll(":scope > div");

  const targets: HTMLElement[] = [];
  columns.forEach((col) => {
    collectSnapTargets(col, root).forEach((t) => targets.push(t));
  });

  // Main snap loop: push subblocks/headers/bare-sections to next page.
  let guard = 0;
  while (guard++ < 40) {
    let changed = false;
    const sorted = [...targets].sort((a, b) => topFromRoot(a, root) - topFromRoot(b, root));
    for (const el of sorted) {
      if (snapElement(el, H, tallEpsilon, edgeSlack, root)) changed = true;
    }
    if (!changed) break;
  }

  // Orphan-title pass: snap whole section when h3 and first subblock end up on different pages.
  columns.forEach((col) => snapOrphanTitles(col, root, H, tallEpsilon, edgeSlack));

  // Post-snap pass: if a subblock still straddles, snap its parent section instead.
  const allSubblocks = [...inner.querySelectorAll(".cv-print-subblock")] as HTMLElement[];
  for (const el of allSubblocks) {
    const y = topFromRoot(el, root);
    const h = effectiveHeight(el);
    if (!crossesPageBoundary(y, h, H) || h >= H - tallEpsilon) continue;
    const parentSection = el.closest("section.cv-print-section") as HTMLElement | null;
    if (!parentSection) continue;
    const py = topFromRoot(parentSection, root);
    const ph = effectiveHeight(parentSection);
    if (ph >= H - tallEpsilon) continue;
    const rel = ((py % H) + H) % H;
    if (rel + ph > H - edgeSlack) {
      if (!parentSection.hasAttribute(SNAP_ATTR)) {
        parentSection.setAttribute(ORIG_MT_ATTR, parentSection.style.marginTop || "");
      }
      const prev = parseFloat(parentSection.style.marginTop) || 0;
      parentSection.style.marginTop = `${prev + (H - rel)}px`;
      parentSection.setAttribute(SNAP_ATTR, "1");
    }
  }

  applyStraddleAndGroupHighlights(root, targets, H);
}

/** Approximate print pagination on screen: shift "avoid-break" blocks to the next A4 band. */
export function useA4PreviewPageSnap(printRootRef: RefObject<HTMLElement | null> | undefined, resume: Resume) {
  useLayoutEffect(() => {
    const root = printRootRef?.current;
    if (!root) return;

    const inner = root.querySelector(".cv-resume-sheet-inner") as HTMLElement | null;
    if (!inner) return;

    const run = () => { applySnap(root, inner); };

    const ro = new ResizeObserver(() => { requestAnimationFrame(run); });
    ro.observe(root);
    ro.observe(inner);
    requestAnimationFrame(run);

    return () => {
      ro.disconnect();
      clearPreviewPageMarkers(root);
    };
  }, [printRootRef, resume]);
}
