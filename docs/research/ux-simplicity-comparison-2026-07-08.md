# UX Simplicity Comparison

Date: 2026-07-08

Comparator: `https://rm1.riskacademy.ai/`

Target: Risk Workbench Web

## Scope

Compare the original Digital Risk Manager flow against Risk Workbench and simplify the first-run experience without removing important evidence features.

## Captured Evidence

Local audit screenshots and DOM captures:

- `/Users/lukestambaugh/.codex/reports/ux-audits/risk-workbench-20260708-simplicity/01-original-riskacademy-dashboard.png`
- `/Users/lukestambaugh/.codex/reports/ux-audits/risk-workbench-20260708-simplicity/02-original-after-start.png`
- `/Users/lukestambaugh/.codex/reports/ux-audits/risk-workbench-20260708-simplicity/04-current-risk-workbench-before.png`
- `/Users/lukestambaugh/.codex/reports/ux-audits/risk-workbench-20260708-simplicity/08-final-simple-flow-initial.png`
- `/Users/lukestambaugh/.codex/reports/ux-audits/risk-workbench-20260708-simplicity/09-final-simple-flow-generated.png`

The original site reached a daily-budget blocker after the research stage, so the comparison uses the visible first screen and the visible in-progress research state.

## What The Original Does Better

The original screen is simpler because it makes one path obvious:

- Company name.
- Optional country or website.
- One start button.
- Status and time on task.
- One stage at a time after the user starts.

The user does not see uploads, imports, report downloads, or empty output panels before starting.

## What Risk Workbench Did Before

Before this cleanup, the first screen exposed too much of the system at once:

- Core company fields.
- Evidence notes.
- Four management-context questions.
- Local file upload.
- GitHub import.
- GitHub token field.
- Imported file list.
- Output navigation.
- Download section state.
- Empty gate, quality, evidence, dashboard, register, and report sections.

This made the app powerful but visually noisy before the user had taken the first action.

## Recommendation

Keep the advanced capabilities, but remove them from the default first-run path.

Implemented recommendation:

- Keep company, country, website, evidence notes, Generate, and sample buttons visible.
- Add a compact Plan -> Do -> Check -> Review workflow strip.
- Collapse the four management-context questions into `Optional management context`.
- Collapse local upload and GitHub import into `Evidence file workspace`.
- Hide generated-output sections until an assessment exists.
- Show a quiet output placeholder before generation.
- Keep downloads, reports, evidence, dashboard, and register available after generation.

This keeps Risk Workbench more capable than the original while borrowing the original's first-screen restraint.

## Verification

Local tests:

- `python3 -m unittest discover -s tests -v`
- Result: 15/15 passing.

Browser checks:

- Initial desktop state: 8 visible controls, uploads hidden, GitHub import hidden, output nav hidden, no horizontal overflow.
- Generated desktop state: PASS, 8 evidence items, 6 risks, 12 visual sections, downloads available, board report 797 lines, detailed report 842 lines, no horizontal overflow.
- Mobile 390x844: no horizontal overflow before or after generation.
- Tablet 768x1024: no horizontal overflow before or after generation.

## Remaining UX Follow-Up

The next cleanup should focus on the generated-state side:

- Make the output nav feel more like tabs.
- Keep the board decision strip higher than long evidence lists after generation.
- Consider a dedicated full-page evidence workspace route if imports become more complex.
