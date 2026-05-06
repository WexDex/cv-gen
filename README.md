# cv-gen

Next.js CV/Resume sandbox with:

- JSON-first resume data model
- Grid-based layout sandbox (1-col or 2-col with drag and drop sections)
- Template switching (Modern, Classic, Minimal, WebDev)
- Local persistence (`localStorage`)
- Export: PDF (print), PNG, DOCX, JSON

## Start

```bash
npm install
npm run dev
```

Open `http://localhost:3000` and you will be redirected to `/builder`.

## Main Routes

- `/builder` - 3-pane editor (forms/JSON, preview, layout sandbox)
- `/templates` - template gallery and quick apply

## Data and State

- Resume schema: `lib/types.ts`
- Sample resume: `lib/defaults.ts`
- Store and persistence: `lib/store.ts` (`cv-gen:store:v1`)

## Export Notes

- PDF uses browser print styles in `app/globals.css` and prints `#print-root`
- PNG uses `html-to-image`
- DOCX is generated from resume data structure, not from visual template HTML
