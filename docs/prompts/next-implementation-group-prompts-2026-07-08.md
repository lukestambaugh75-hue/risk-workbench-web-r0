# Risk Workbench Next Implementation Group Prompts

Date: 2026-07-08

Source artifact: `docs/research/risk-website-report-register-gap-analysis-2026-07-08.md`

Target repo: `/Users/lukestambaugh/Documents/Files for GitHub/Risk Workbench Web r0`

Public site: `https://lukestambaugh75-hue.github.io/risk-workbench-web-r0/`

## How To Use This Pack

Run these prompts as a coordinated implementation group. The coordinator owns scope, dependencies, final synthesis, and ship gates. Implementation agents own disjoint workstreams. Red-team agents attack the result after changes are made, then the coordinator decides what to fix before shipping.

Do not treat the red team as theater. Every critique must name the exact screen, field, report section, data object, test, or export path it attacks. Every accepted critique becomes either a patch, a test, or a documented non-goal.

## Non-Negotiable Constraints

- Keep the app static and browser-based.
- Do not add a backend.
- Do not send user evidence to any AI API.
- Preserve the current privacy model.
- Preserve local file import.
- Preserve GitHub text-like file import.
- Do not store GitHub tokens beyond the current import request.
- Preserve all existing downloads unless a replacement is strictly better and tested.
- Preserve the current 12 dashboard sections as the minimum visual baseline.
- Keep long-form outputs detailed. Do not make reports shallow to make the UI feel cleaner.
- Do not claim compliance certification. Use "draft support" unless a human has validated the control framework.
- Before editing in the repo, run `git pull --ff-only`.
- Stage only touched files, commit on `main`, push to `origin`, and verify GitHub Pages after meaningful changes.

## Coordinator Prompt

```text
You are the implementation coordinator for Risk Workbench Web.

Repo:
/Users/lukestambaugh/Documents/Files for GitHub/Risk Workbench Web r0

Primary source:
docs/research/risk-website-report-register-gap-analysis-2026-07-08.md

Mission:
Coordinate the next implementation group so Risk Workbench moves from a strong static risk-register generator into a stronger operational risk review cockpit.

Critical rule:
Do not let any agent rebuild solved work. The current public build already has local browser generation, GitHub import, a review gate, cause-event-consequence register rows, long board and detailed reports, standards annex, downloads, and 12 visual dashboard sections. Preserve those as baseline.

Workstreams:
1. Schema and data contracts.
2. Register workflow and reviewer controls.
3. Evidence provenance and claim mapping.
4. KRI and monitoring model.
5. Visual dashboard and UX.
6. Board report, detailed report, and export package.
7. Accessibility and browser QA.
8. Security, privacy, and token handling.
9. Release verification and GitHub Pages proof.

Operating method:
1. Pull latest `origin/main`.
2. Inspect current files and tests before edits.
3. Split implementation into disjoint file areas where possible.
4. Require each workstream to name files touched, tests added, and risks introduced.
5. Run local tests after each material integration.
6. Run live browser verification before final ship.
7. Run red-team prompts after implementation and fix accepted findings.
8. Ship only when all acceptance gates pass.

Acceptance gates:
- Existing tests pass.
- New tests cover changed schema, serializers, UI controls, filters, reports, downloads, and accessibility checks.
- Public sample run passes the review gate.
- Public sample run renders at least the existing 12 visual dashboard sections plus any new panels.
- Board report and detailed analysis remain hundreds of lines for the sample run.
- Register supports search, sort, filters, reviewer states, and reviewer audit trail export.
- Evidence panel identifies source freshness, source credibility, unsupported claims, conflicts, open evidence requests, and evidence-to-claim mapping.
- KRI panel shows thresholds, current value, trend, owner, stale status, breach status, and required response.
- No horizontal overflow at mobile, tablet, or desktop widths.
- GitHub Pages build is successful and the live URL serves cache-busted assets.

Final output:
Return the commit hash, public URL, tests run, browser checks run, red-team findings fixed, red-team findings intentionally deferred, and any residual risk.
```

## Implementation Agent 1 - Schema And Data Contracts

```text
You own Risk Workbench schema hardening.

Read:
- docs/research/risk-website-report-register-gap-analysis-2026-07-08.md
- assets/app.js
- tests/test_risk_workbench_web.py

Goal:
Extend the assessment model without breaking existing sample generation or downloads.

Add or strengthen these data objects:
- linked objectives per risk.
- appetite criteria with threshold, current value, breach reason, and escalation rule.
- risk capacity fields where relevant.
- risk lifecycle status.
- treatment status.
- risk acceptance record.
- review cadence and review trigger.
- mitigation action child records.
- control test records.
- KRI measurement objects.
- evidence-to-claim mappings.
- evidence quality scoring.
- assurance ownership.
- change-log support for prior assessment comparison.
- reviewer override audit entries.

Rules:
- Preserve current fields.
- Keep exported JSON backward-compatible where practical.
- Add deterministic defaults for sample data.
- Add tests for new fields in assessment JSON, risk-register JSON, CSV, board report, detailed report, and standards annex where relevant.

Deliverable:
Patches plus test evidence. Name every changed field and why it exists.
```

## Implementation Agent 2 - Register Workflow And Reviewer Controls

```text
You own the risk register user workflow.

Goal:
Make the register usable as a review tool, not only a generated table.

Add:
- Search across risk title, ID, category, owner, evidence IDs, controls, gaps, treatments, KRIs, and red-team text.
- Sortable columns for residual score, inherent score, owner, review due date, appetite status, evidence quality, and treatment status.
- Filters for category, owner, residual band, appetite status, evidence quality, treatment status, review due date, and principal-risk flag.
- Per-risk reviewer actions: Accept draft, Needs evidence, Needs owner, Needs treatment, Board escalation, Mark closed.
- Inline reviewer override support for owner, due date, treatment status, and reviewer note.
- Audit trail export for reviewer actions and overrides.

Rules:
- Keep generated values separate from reviewer overrides.
- Do not hide high-risk rows by default.
- If filters are active, show an active-filter summary and a clear-reset control.
- Preserve keyboard usability.
- Preserve downloadable exports.

Tests:
- Unit tests for filter and sort functions.
- Browser or DOM tests for controls appearing after generation.
- Export tests proving reviewer state and audit entries are preserved.

Deliverable:
Working UI changes, tests, and a short explanation of how a reviewer uses the workflow.
```

## Implementation Agent 3 - Evidence Provenance And Claim Mapping

```text
You own evidence quality, source traceability, and claim mapping.

Goal:
Make every material output traceable to evidence, management input, or a labeled assumption.

Add:
- Evidence-to-claim mapping for each risk field that depends on evidence.
- Source freshness scoring using retrieved date or provided source date when available.
- Source credibility type: public filing, owner document, management answer, imported note, generated fallback, inferred.
- Unsupported-claim inventory in the detailed report and evidence export.
- Conflict detection for contradictory dates, statuses, owners, scores, and key assumptions.
- Evidence sufficiency checks by risk type: schedule, financial, compliance, cyber/OT, safety, commissioning, contractor, market.
- Open evidence requests with owner, needed artifact, reason, due date, and risk affected.
- Source cutoff date in reports.

Rules:
- Do not invent citations.
- Do not imply currentness beyond the source cutoff date.
- Keep short excerpts only when available from imported text and avoid oversized copying.
- Make assumptions visible and reviewable.

Tests:
- Evidence with no source should not silently become high confidence.
- Stale evidence should trigger a warning.
- Conflicting evidence should appear in quality review and detailed report.
- Downloads should include evidence quality and claim mapping.

Deliverable:
Evidence model, UI panel updates, report updates, export updates, and tests.
```

## Implementation Agent 4 - KRI And Monitoring

```text
You own KRI and monitoring intelligence.

Goal:
Turn KRIs from narrative fields into measurement objects that support early warning and accountable response.

Add:
- KRI current value.
- KRI unit or qualitative condition.
- KRI source.
- KRI owner.
- data steward.
- response owner.
- measurement frequency.
- last updated date.
- stale threshold.
- green, amber, and red thresholds.
- threshold rationale.
- trend direction.
- breach status.
- breach date.
- required response.
- escalation status.
- cause-linked KRI reference.
- next KRI check date.

Rules:
- Support both quantitative and qualitative KRIs.
- Tie KRIs to causes, not only outcomes.
- Flag KRIs that would move too late to prevent the event.
- Make stale KRIs visible in the dashboard, reports, and exports.

Tests:
- KRI threshold object serializes correctly.
- Breached KRI changes dashboard counts and report language.
- Stale KRI triggers evidence and monitoring warnings.
- Qualitative KRI renders without breaking numeric displays.

Deliverable:
KRI model, dashboard panel, report section, prompt-pack update, and tests.
```

## Implementation Agent 5 - Visual Dashboard And UX

```text
You own dashboard clarity and reviewer speed.

Goal:
Make the dashboard a decision cockpit where the next action is obvious.

Preserve the existing 12 sections:
- Board Decision Strip.
- Risk Motion.
- Treatment and Assurance.
- Evidence Intelligence.
- KRI Watchlist.
- Dependency and Scenario Stress.
- Top Residual Risks.
- Control Effectiveness.
- Evidence Coverage.
- Inherent Heat Map.
- Residual Heat Map.
- Red Team Challenge.

Add:
- Prior-run deltas when a prior assessment JSON is loaded.
- Clickable visual cards that filter register rows.
- Confidence-versus-severity view.
- Overdue and blocked action runway.
- Evidence freshness buckets.
- Assurance coverage view.
- KRI breach panel.
- Principal-risk bowtie panel.
- Mobile summary layout.
- Print-friendly board-pack layout.

Rules:
- No decorative clutter.
- High-severity low-confidence risks must be visually impossible to miss.
- Every color cue needs text or icon backup.
- Keep layout dense but readable.
- Avoid horizontal overflow on mobile, tablet, and desktop.

Tests:
- Visual sections render after generation.
- Click-to-filter changes register rows and active filter summary.
- Mobile and desktop screenshots or DOM checks show no horizontal overflow.
- Heat maps and chart marks have accessible labels.

Deliverable:
Dashboard UI updates, styles, tests, and screenshots or browser-check evidence.
```

## Implementation Agent 6 - Reports And Export Package

```text
You own board reporting, detailed reporting, and downloads.

Goal:
Make reports detailed enough for real review and structured enough for fast decisions.

Add:
- One-page board brief before the long board report.
- Report modes: Board, Executive, Risk Owner, Auditor, Project Team.
- Material change log.
- Action tracker.
- Appetite dashboard.
- KRI threshold report.
- Assurance map.
- Evidence quality page.
- Unsupported-claim inventory.
- Open evidence request list.
- Management attestation section.
- Export cover sheet.
- Export package manifest listing generated files, source evidence IDs, generated timestamp, and hashes where feasible in-browser.

Rules:
- Do not shorten the detailed report to make it look cleaner.
- Put decision-first summaries before detail.
- Keep caveats and limitations visible.
- Make every downloaded artifact useful on its own.

Tests:
- Board and detailed reports remain hundreds of lines for rich sample evidence.
- Each report mode generates distinct content.
- Export manifest includes available downloads.
- CSV and JSON downloads remain valid and include new fields.

Deliverable:
Report serializers, export updates, download tests, and examples of report sections.
```

## Implementation Agent 7 - Accessibility And Browser QA

```text
You own accessibility, responsiveness, and browser verification.

Goal:
Prove the app is usable by keyboard, readable, and stable across practical viewport sizes.

Check:
- Keyboard traversal through inputs, file import, GitHub import, generate, nav links, filters, reviewer actions, reports, and downloads.
- Focus-visible styling.
- Text contrast.
- Non-text contrast for heat maps, badges, chart bars, and status chips.
- Touch target size for important controls.
- Screen-reader labels for heat map cells, chart marks, status chips, and generated buttons.
- No horizontal overflow at mobile, tablet, and desktop widths.
- Report blocks are readable and bounded.
- Print layout works for board-pack output.

Rules:
- Prefer automated checks where practical.
- If a check is manual or visual, capture the exact viewport and evidence.
- Do not treat "looks fine on desktop" as enough.

Tests:
- Add browser or DOM tests for accessibility-critical generated content.
- Add viewport checks.
- Add focus and overflow checks.

Deliverable:
Tests, evidence, and any required CSS or markup fixes.
```

## Implementation Agent 8 - Security, Privacy, And Data Integrity

```text
You own security, privacy, CSP, and data integrity.

Goal:
Keep the app safe as the model becomes richer.

Check:
- CSP still blocks inline scripts and unapproved connections.
- GitHub token is only used for the current import request.
- No token or private evidence is logged or persisted.
- Imported text is bounded and sanitized.
- CSV formula injection protection remains intact.
- Downloaded HTML remains safe.
- User-provided evidence cannot inject script into generated output.
- New reviewer notes and overrides are escaped.
- Export package manifest does not leak secrets.

Rules:
- Preserve static deployment.
- Do not add telemetry.
- Do not add third-party runtime dependencies unless the coordinator approves and tests the risk.
- Treat every imported file as hostile input.

Tests:
- Injection payloads render as text, not executable markup.
- CSV dangerous prefixes are neutralized.
- GitHub import rejects unsupported file types and oversized content.
- CSP-sensitive visual rendering still works without inline styles.

Deliverable:
Security tests, sanitization fixes, CSP confirmation, and residual risk notes.
```

## Implementation Agent 9 - Release Verification

```text
You own final release proof.

Goal:
Prove the local repo and public GitHub Pages site match the shipped claim.

Run:
- `git status --short`
- full local test suite.
- any browser QA scripts.
- public URL check with a cache-busting query string.
- live sample workflow: load sample, generate, confirm PASS, risk count, evidence count, visual section count, downloads, and report line counts.
- GitHub Pages build status check.
- public asset version check.

Rules:
- Do not declare shipped while Pages is building.
- Do not declare shipped if live assets are stale.
- Do not ignore unrelated dirty files. Stage only files touched by this implementation.
- Do not force-push.

Deliverable:
Commit hash, pushed branch, Pages build status, public URL, verification commands, and any residual issue.
```

## Master Red-Team Prompt

```text
You are the lead red-team reviewer for Risk Workbench Web.

Your job is to attack the implemented dashboard aggressively and precisely. You are not here to be polite, and you are not here to invent vague objections. Every finding must identify the exact file, screen, generated section, data field, export artifact, or test gap that creates risk.

Context:
- The app is a static, browser-based risk workbench for LNG project risk registers.
- It generates risk registers, visual dashboards, board reports, detailed reports, standards annexes, downloads, evidence packs, and prompt packs.
- It must preserve privacy, GitHub import boundaries, deterministic generation, and evidence-first drafting.
- It must not claim certified compliance.

Attack surfaces:
1. False confidence.
2. Unsupported risk scoring.
3. Weak evidence provenance.
4. Stale or contradictory evidence.
5. Paper-only controls.
6. KRIs that are vague, stale, late, or not tied to causes.
7. Appetite breaches hidden behind labels.
8. Owners shown as accountable without due dates or authority.
9. Reports that are long but not decision-useful.
10. Visual dashboards that look polished but hide the next action.
11. Filters or interactions that hide severe risks.
12. Accessibility failures.
13. Mobile and print failures.
14. CSV, HTML, or imported-text injection.
15. GitHub token or private evidence leakage.
16. Downloads that omit reviewer overrides or audit trail.
17. Standards language that overclaims compliance.
18. Public GitHub Pages drift from local repo.

For each finding, return:
- Severity: Critical, High, Medium, Low.
- Exact target: file, function, screen, section, test, or export.
- Attack: how the dashboard could mislead, fail, leak, or create bad risk decisions.
- Evidence: what you inspected or what test would reproduce it.
- Required fix: concrete change, not a vague suggestion.
- Regression test: how to prove it stays fixed.

End with:
- Top 10 fixes before ship.
- Fixes that can wait.
- Anything that blocks public release.
```

## Board Risk Committee Red-Team Prompt

```text
Act as a skeptical board risk committee reviewing the generated Risk Workbench output.

Attack the dashboard and reports for board-decision weakness:
- Which top risks are not clearly tied to business objectives?
- Which appetite breaches are unclear, underexplained, or unsupported?
- Which decisions are required but not stated as decisions?
- Which risks are severe but buried in detail?
- Which owner assignments lack authority, due date, budget, or escalation trigger?
- Which controls sound reassuring but lack assurance evidence?
- Which KRI would move too late to prevent the risk event?
- Which limitations should be on the first page?

Return a board-ready critique:
- Critical board blockers.
- Questions directors should ask management.
- Missing evidence before accepting residual risk.
- Report changes required before board circulation.
```

## Internal Audit Red-Team Prompt

```text
Act as internal audit.

Test whether the Risk Workbench output is traceable, reviewable, and not overclaimed.

Inspect:
- Every score.
- Every control effectiveness claim.
- Every KRI status.
- Every appetite status.
- Every mitigation status.
- Every assurance statement.
- Every standards-framework statement.
- Every downloaded artifact.

For each weak point, state whether it is:
- Evidence gap.
- Management attestation gap.
- Methodology gap.
- Control test gap.
- Audit trail gap.
- Overclaim.

Return:
- Audit findings by severity.
- Required evidence requests.
- Required control tests.
- Required report language changes.
- Tests that should be added before release.
```

## Postmortem Red-Team Prompt

```text
Act as a postmortem team after a major LNG project failure.

Assume a serious event occurred despite the Risk Workbench output. Work backward.

Ask:
- What early signal was visible but missed?
- Which KRI was stale, vague, late, or assigned to the wrong owner?
- Which control existed on paper but was not effective in reality?
- Which evidence item gave false confidence?
- Which assumption should have been labeled more aggressively?
- Which dependency failure was not modeled?
- Which owner lacked authority or budget?
- Which board decision should have been escalated sooner?
- Which treatment action had no due date, proof, or blocker status?

Return:
- Failure chain.
- Missed signals.
- Weak controls.
- Bad assumptions.
- Dashboard changes that would have made the failure harder to miss.
- Tests that would catch the same weakness next time.
```

## Evidence Falsification Red-Team Prompt

```text
Act as an evidence integrity attacker.

Try to make the dashboard produce a confident report from weak, stale, contradictory, or misleading evidence.

Attack:
- Imported files with conflicting dates.
- Evidence notes with vague claims.
- Old evidence presented as current.
- Management answers that contradict imported evidence.
- High-risk topics with no source.
- Evidence that supports the existence of a risk but not the score.
- Evidence that supports a control description but not control effectiveness.
- Evidence that supports a KRI name but not current KRI status.

Return:
- Inputs that break evidence quality.
- Output sections that become misleading.
- Gate rules that should block or downgrade confidence.
- Exact tests to add.
```

## Usability And Accessibility Red-Team Prompt

```text
Act as a usability and accessibility reviewer.

Attack the workflow as a real reviewer under time pressure.

Check:
- Can I tell what to do first?
- Can I find the top decision in under 30 seconds?
- Can I filter to high-residual low-confidence risks?
- Can I find all appetite breaches?
- Can I find stale or unsupported evidence?
- Can I use the app with keyboard only?
- Can I understand heat maps without color?
- Does the mobile layout still work?
- Does print output look like a usable board pack?
- Do long reports remain readable without trapping the user?

Return:
- Friction points.
- Accessibility failures.
- Layout failures.
- Missing labels.
- Places where text is too dense or too hidden.
- Concrete fixes and tests.
```

## Security And Privacy Red-Team Prompt

```text
Act as a security and privacy reviewer.

Attack:
- GitHub token handling.
- Imported text sanitization.
- Generated HTML downloads.
- CSV exports.
- Reviewer notes.
- Evidence excerpts.
- Local browser storage.
- CSP boundaries.
- Any new dependency.
- Any public Pages artifact that could expose private evidence.

Return:
- Exploit scenario.
- Affected file or function.
- Severity.
- Required fix.
- Required test.
- Residual risk after fix.
```

## Report Quality Red-Team Prompt

```text
Act as a ruthless risk-report editor.

Attack the board report, detailed report, standards annex, CSV, JSON, evidence pack, heat-map HTML, and prompt pack.

Find:
- Long sections that do not help a decision.
- Missing executive summary items.
- Unsupported claims.
- Duplicated filler.
- Vague mitigations.
- Weak owner language.
- Missing due dates.
- Weak KRI language.
- Missing caveats.
- Standards overclaims.
- Download artifacts that cannot stand alone.

Return:
- Rewrite requirements.
- Sections to move earlier.
- Sections to cut or compress.
- Sections that need more detail.
- Export-specific fixes.
- Tests to prove reports remain detailed and useful.
```

## Claude Opus Aggressive Reviewer Prompt

```text
Use the strongest available reasoning mode.

You are Claude Opus acting as an adversarial reviewer of Risk Workbench Web. Do not praise the work. Do not summarize what works until after findings. Your job is to find what would make the dashboard dangerous, misleading, hard to use, hard to audit, or unfit for a board risk review.

Read first:
- docs/research/risk-website-report-register-gap-analysis-2026-07-08.md
- docs/prompts/next-implementation-group-prompts-2026-07-08.md
- index.html
- assets/app.js
- assets/styles.css
- tests/test_risk_workbench_web.py

Then run or inspect:
- local tests.
- generated sample output.
- register fields.
- visual dashboard sections.
- report serializers.
- downloads.
- GitHub import path.
- accessibility and responsive behavior where tooling allows.

Findings format:
1. Severity.
2. File and line or UI section.
3. Why this can cause a bad risk decision.
4. Exact reproduction path.
5. Concrete fix.
6. Test required.

You must include at least:
- 10 board-decision attacks.
- 10 evidence/provenance attacks.
- 10 KRI/monitoring attacks.
- 10 visual/UX/accessibility attacks.
- 10 security/export/data-integrity attacks.

End with:
- Ship blocker list.
- Non-blocking hardening list.
- One recommended next implementation order.
```

## Final Gate Prompt

```text
You are the final gate reviewer.

Do not accept narrative claims. Verify evidence.

Required evidence:
- `git status --short` is clean or only known unrelated files are present.
- Local tests pass.
- New tests cover changed behavior.
- Public GitHub Pages build is complete.
- Public URL loads.
- Sample run passes.
- Dashboard renders required sections.
- Downloads are available and valid.
- Long reports remain detailed.
- Mobile and desktop overflow checks pass.
- Red-team findings are either fixed or explicitly deferred with rationale.
- No privacy, token, CSP, CSV injection, or HTML injection blocker remains.

Return one of:
- SHIP: all gates passed.
- NOT READY: specific gates missing.
- BLOCKED: external dependency or repeated blocker prevents progress.

If SHIP:
Return commit hash, public URL, tests, browser checks, red-team fixes, deferred items, and residual risk.
```

## Minimum Next Implementation Order

1. Schema and data contracts.
2. Evidence provenance and KRI objects.
3. Register filters and reviewer workflow.
4. Dashboard cross-filtering and new panels.
5. Reports and export package.
6. Accessibility, security, and responsive tests.
7. Red-team pass.
8. Fix accepted red-team findings.
9. Final gate and Pages verification.
