# Risk Workbench Web r0

Static GitHub Pages app for browser-only enterprise risk register generation.

## What It Does

- Accepts typed company details, evidence notes, and management answers.
- Imports local text-like files.
- Imports public GitHub files or private GitHub files when the user pastes a temporary token.
- Generates an evidence-linked risk register, residual heat map, board report, standards annex, and downloadable artifacts.

## Privacy Boundary

- Core generation runs in the browser.
- No backend, analytics, telemetry, CDN scripts, hosted AI calls, or remote logging.
- GitHub import is the only external request path and only runs when the user clicks import.
- A pasted GitHub token is used only for that fetch request and is cleared from the form after import.

## Local Check

```bash
python3 -m http.server 8766
```

Open:

```text
http://127.0.0.1:8766/
```
