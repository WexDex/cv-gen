# cv-gen

Next.js CV/resume sandbox with:

- JSON-first resume data model
- Grid-based layout (1-column or 2-column sidebar) with drag-and-drop sections
- Template switching (Modern, Classic, Minimal, WebDev) with light/dark where supported
- Per-block styling, display variants, and optional data slices
- Local persistence (`localStorage`)
- Export: PDF (print), PNG, DOCX, JSON

## Getting started

```bash
npm install
npm run dev
```

The app opens at `http://localhost:3000` and redirects to `/builder`.

### Production build (static site)

The project uses **static export** (`output: "export"` in `next.config.ts`). The deployable site is emitted to the `out/` directory.

```bash
npm run build
```

For a subdirectory host (for example GitHub project pages at `https://<user>.github.io/<repo>/`), set `BASE_PATH` when building:

```bash
# POSIX
BASE_PATH=/<repo-name> npm run build

# Windows PowerShell
$env:BASE_PATH='/repo-name'; npm run build
```

`next start` is not used for this setup; serve `out/` with any static file host.

## Routes

- `/builder` — three-pane editor (forms, live preview, layout sandbox)
- `/templates` — template gallery and quick apply
- `/preview-a4` — A4-focused preview (also used for print layout checks)

## Data and state

- Resume schema: `lib/types.ts`
- **Default sample resume** is loaded from `public/zendouh-abdelhamid-cv.json` via `createDefaultResume()` in `lib/defaults.ts` (new IDs and timestamps are applied when the factory runs).
- **Blank resume**: `createBlankResume()` in `lib/defaults.ts`
- Zustand store and persistence: `lib/store.ts` (storage key `cv-gen:store:v1`)

When the persisted store version in the browser is older than the current migration, the app may **reset stored resumes** to the bundled default (see `version` / `migrate` in `lib/store.ts`).

## Deploying to GitHub Pages

1. In the repository, enable **Settings → Pages → Build and deployment → Source: GitHub Actions**.
2. Push to `main` (or adjust the branch in `.github/workflows/pages.yml`). The workflow builds with the correct `BASE_PATH` for either a `username.github.io` repo (root site) or a normal project repo (subpath).

## Export notes

- **PDF** relies on print styles in `app/globals.css` and the `#print-root` region in the preview.
- **PNG** uses `html-to-image`.
- **DOCX** is generated from the resume data structure, not from the visual template DOM.
