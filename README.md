# Risk Workbench Web r0

Static GitHub Pages app for browser-only LNG/project-delivery risk register generation.

Live app:

```text
https://lukestambaugh75-hue.github.io/risk-workbench-web-r0/
```

## What It Does

- Accepts typed company details, evidence notes, and management answers.
- Imports local text-like files.
- Imports public GitHub files or private GitHub files when the user pastes a temporary token.
- Generates an evidence-linked risk register, inherent and residual heat maps, visual dashboard, board report, standards annex, and downloadable artifacts.
- Builds each risk as cause, event, consequence, existing controls, control gaps, mitigation actions, owner, KRI, early warning, appetite alignment, red-team challenge, and postmortem scenario.
- Runs a browser-side quality gate that rejects no-evidence runs, irrelevant evidence, and risks without category-relevant source-bound support.
- Treats outputs as LNG/project-delivery drafts until management confirms source evidence, scoring, owners, and treatment actions.

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

Automated checks:

```bash
python3 -m unittest discover -s tests -v
```

## Research Basis

The generator is shaped by ISO 31000, COSO ERM, NIST SP 800-30, and the UK Orange Book. See:

```text
docs/research/risk-register-best-practices.md
```
