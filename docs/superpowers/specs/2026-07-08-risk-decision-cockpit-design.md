# Risk Decision Cockpit Design

## Goal

Broaden the Risk Workbench dashboard from a score-and-report view into a decision cockpit that makes board decisions, appetite breaches, treatments, evidence quality, KRIs, and dependency stress visible before the user opens long markdown reports.

## Research Basis

- ISO 31000 supports a full risk-management cycle: identify, analyze, evaluate, treat, monitor, and communicate.
- NIST SP 800-30 frames risk assessment as decision support for senior leaders.
- The Orange Book emphasizes risk appetite, escalation triggers, transparent principal-risk reporting, and timely review.
- NIST SP 800-55 supports measures that show whether controls and procedures are working.
- NN/g dashboard guidance favors quick comparison using length and position rather than circular or decorative charts.
- WCAG requires sufficient contrast, visible focus, and usable target sizes for controls and meaningful graphics.

## Product Design

Keep the existing static browser-only architecture. Add a new dashboard layer inside the current `Visual Dashboard` section with these bands:

1. Board Decision Strip: principal risks, appetite breaches, decisions needed, reviews due, and evidence warnings.
2. Risk Motion View: inherent-to-residual movement, treatment effectiveness, velocity, and appetite status.
3. Treatment and Assurance View: 30 / 60 / 90 action runway, controls versus gaps, owner workload, and assurance prompts.
4. Evidence Intelligence View: evidence source coverage, single-source/multi-source distribution, open evidence requests, and confidence.
5. KRI / Early Warning View: KRIs and early warnings tied to each risk.
6. Dependency / Scenario View: management dependencies plus red-team and postmortem scenario chains.

## Data Contract

Extend `assessment.visuals` with:

- `decision_summary`
- `risk_motion`
- `treatment_assurance`
- `evidence_intelligence`
- `kri_watchlist`
- `dependency_scenarios`

The renderer must continue to support the existing fields and downloads.

## UI Rules

- Keep downloads reachable before long reports.
- Use text labels and bars/tables instead of circular gauges, pie charts, radar charts, or decorative visuals.
- Keep mobile readable at 390px with no horizontal page overflow.
- Keep all generation local in the browser.

## Verification

- Unit tests must prove the new data fields and rendered sections exist.
- Full Python unittest suite must pass.
- Browser smoke must pass on desktop and mobile.
- GitHub Pages must deploy and serve matching committed files.
