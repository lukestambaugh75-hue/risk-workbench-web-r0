# Risk Website, Report, and Register Gap Analysis

Date: 2026-07-08

Target: Risk Workbench public dashboard at `https://lukestambaugh75-hue.github.io/risk-workbench-web-r0/`

Purpose: compare current Risk Workbench behavior against current risk-management, risk-reporting, dashboard, and accessibility practices, then produce a direct build prompt to improve the dashboard.

## Executive Finding

Risk Workbench has crossed the line from a toy register generator into a usable browser-based risk workbench. The current public build already runs locally in the browser, imports text-like GitHub files, blocks weak evidence through a review gate, creates a cause-event-consequence risk register, renders a decision cockpit, and exports board and detailed reports with hundreds of lines.

The remaining quality gap is not "more output." The gap is structure, traceability, board usability, trend intelligence, appetite math, assurance evidence, and interactive review workflow. A good risk site should make the next management decision obvious, show why each risk exists, prove what evidence supports it, expose what could be wrong, and give a reviewer a practical path to accept, reject, assign, monitor, or export the work.

## Sources Used

- ISO 31000 overview: https://www.iso.org/standard/65694.html
- COSO Enterprise Risk Management overview: https://www.coso.org/enterprise-risk-management
- NIST SP 800-30 Rev. 1 risk assessment guide: https://csrc.nist.gov/pubs/sp/800/30/r1/final
- NIST SP 800-30 Rev. 1 PDF: https://nvlpubs.nist.gov/nistpubs/Legacy/SP/nistspecialpublication800-30r1.pdf
- UK HM Treasury Orange Book: https://assets.publishing.service.gov.uk/media/6453acadc33b460012f5e6b8/HMT_Orange_Book_May_2023.pdf
- NIST SP 800-55 performance measurement guide: https://nvlpubs.nist.gov/nistpubs/SpecialPublications/NIST.SP.800-55v1.pdf
- NC State ERM KRI case study: https://erm.ncsu.edu/az/erm/i/chan/library/ERM_KRI_Case_Study_FINAL.pdf
- FSB Principles for an Effective Risk Appetite Framework: https://www.fsb.org/wp-content/uploads/r_131118.pdf
- EBRD Risk Appetite Statement: https://www.ebrd.com/documents/comms-and-bis/ebrd-risk-appetite-statement.pdf
- OCC Corporate and Risk Governance handbook: https://www.occ.treas.gov/publications-and-resources/publications/comptrollers-handbook/files/corporate-risk-governance/pub-ch-corporate-risk.pdf
- US Web Design System: https://designsystem.digital.gov/
- USWDS design principles: https://designsystem.digital.gov/design-principles/
- Nielsen Norman Group dashboard guidance: https://www.nngroup.com/articles/dashboards-preattentive/
- WCAG 2.2: https://www.w3.org/TR/WCAG22/
- WCAG non-text contrast explanation: https://www.w3.org/WAI/WCAG21/Understanding/non-text-contrast.html
- WCAG 2.2 quick reference: https://www.w3.org/WAI/WCAG22/quickref/

## Research Synthesis

Good risk management is not just a list of scary things. The useful pattern across ISO 31000, COSO ERM, NIST SP 800-30, the Orange Book, the FSB, the EBRD, and OCC governance guidance is:

- Risk should be connected to objectives, risk criteria, appetite, ownership, controls, treatment, monitoring, and review.
- Assessment should separate risk identification, analysis, evaluation, response, communication, and maintenance.
- Board reporting should be concise enough for action but backed by enough detail to challenge assumptions.
- Appetite should be stated in a way that informs decisions and limits, not just as narrative intent.
- KRIs should be linked to causes and early warning signals, with thresholds and named response actions.
- Reporting should show movement over time, material changes, breaches, overdue actions, and assurance quality.
- Evidence quality matters because risk scoring is only as good as the sources and assumptions behind it.

Good dashboards are not only attractive. NN/g frames dashboards as single-page views that support fast action. USWDS and WCAG add that a serious web tool needs keyboard access, contrast, readable focus states, predictable navigation, responsive layout, and accessible non-text cues. For Risk Workbench, the interface should feel like an operational decision cockpit, not a static report preview.

## Current Dashboard Baseline

Live public check on 2026-07-08:

- Public build loads versioned assets: `assets/app.js?v=20260708-risk-cockpit` and `assets/styles.css?v=20260708-risk-cockpit`.
- Sample workflow passes the review gate.
- Sample output shows 8 evidence items and 6 risk rows.
- Visual dashboard renders 12 sections: Board Decision Strip, Risk Motion, Treatment and Assurance, Evidence Intelligence, KRI Watchlist, Dependency and Scenario Stress, Top Residual Risks, Control Effectiveness, Evidence Coverage, Inherent Heat Map, Residual Heat Map, and Red Team Challenge.
- Downloads are available after gate pass: board report, detailed analysis, standards annex, assessment JSON, risk-register CSV, risk-register JSON, evidence pack JSON, heat-map HTML, and prompt pack.
- Generated line counts in live sample: board report 797 lines, detailed analysis 842 lines, standards annex 183 lines.
- The live page showed no horizontal overflow in the tested desktop browser.

Source-code anchors:

- Inputs, local file import, GitHub import, privacy notice, outputs, and downloads live in `index.html`.
- The register CSV includes cause, risk event, consequence, inherent score, residual score, owner, controls, control gaps, treatment, mitigation, KRI, early warning, appetite, red-team, postmortem, review due date, evidence coverage, and confidence.
- The visual dashboard renderer creates the 12 cockpit sections listed above.
- The standards annex maps draft output to ISO 31000, COSO ERM, NIST SP 800-30, and Orange Book concepts while preserving the caveat that it is draft support, not a conformance claim.

## 90 Findings and Fix Directions

| # | Area | Status | Finding | Fix direction |
|---|---|---|---|---|
| 1 | Website purpose | Present | The app states that it is an evidence-first LNG project risk manager, which is stronger than a generic form. | Keep the domain-specific framing, but add a compact purpose bar that tells the reviewer whether the current run is draft, gated, accepted, or rejected. |
| 2 | Website workflow | Partial | The workflow supports input, generate, review, and download, but the page does not yet feel like a managed review cycle. | Add explicit workflow states: Draft inputs, Gate review, Management review, Export package, and Archive. |
| 3 | Website workflow | Missing | There is no persistent run history or comparison to prior assessments. | Add local export/import of prior assessment JSON and a compare view that highlights new risks, changed scores, closed risks, and stale items. |
| 4 | Website navigation | Partial | Output links jump to sections, but long reports and visuals still compete for attention on one page. | Add sticky tabs or segmented controls for Register, Dashboard, Board Pack, Evidence, Actions, and Exports. |
| 5 | Website navigation | Missing | There is no search across risks, owners, categories, evidence IDs, or controls. | Add a global filter box with highlighted matches and count summaries. |
| 6 | Website navigation | Missing | There is no saved URL state for the active tab, filters, or sort order. | Store view state in query parameters or hash fragments so a reviewer can share a specific filtered view. |
| 7 | Website interaction | Partial | The generated register is rich, but it is mostly static. | Add sortable columns, category filters, appetite filters, owner filters, residual band filters, and evidence coverage filters. |
| 8 | Website interaction | Missing | There is no reviewer action panel per risk. | Add per-risk controls for Accept draft, Needs evidence, Needs owner, Needs treatment, and Board escalation. |
| 9 | Website interaction | Missing | There is no inline editing of draft owner, due date, action, or status. | Add controlled inline edits stored in the assessment JSON as reviewer overrides with timestamps. |
| 10 | Website accessibility | Partial | The page uses semantic sections and labels, but visual cards and generated tables need stronger keyboard validation. | Add keyboard traversal tests for inputs, buttons, nav links, report details, generated table controls, and downloads. |
| 11 | Website accessibility | Missing | Visual status uses color-heavy cues that may not be enough for all users. | Pair every color state with text labels, icons, and accessible names. |
| 12 | Website accessibility | Missing | Heat map cells need explicit screen-reader text for likelihood, impact, score, and risk IDs. | Add `aria-label` or visually hidden text to each heat map cell. |
| 13 | Website accessibility | Missing | There is no documented contrast audit for all generated chart elements. | Add a browser test that samples key computed colors and checks WCAG contrast targets for text and non-text cues. |
| 14 | Website accessibility | Missing | Focus appearance has not been validated against WCAG 2.2 focus requirements. | Add focus-visible styling and screenshot or computed-style tests for keyboard focus. |
| 15 | Website responsiveness | Partial | Desktop live check shows no horizontal overflow, but mobile visual density is unproven in the latest audit. | Add Playwright checks at mobile, tablet, and desktop widths for overflow, tappable target size, and report readability. |
| 16 | Risk register model | Present | Risks are already written in cause, event, consequence structure. | Keep this as a hard output requirement and reject rows that collapse into vague topic labels. |
| 17 | Risk register model | Present | Each risk has an ID, category, title, description, evidence, inherent score, residual score, owner, controls, treatment, KRI, and challenge. | Preserve this schema as the core export contract. |
| 18 | Risk register model | Partial | The register has useful fields, but it lacks explicit objective linkage per risk. | Add `linked_objectives` and show which business objective each risk threatens. |
| 19 | Risk register model | Partial | Appetite alignment exists, but it is mostly a label rather than a threshold comparison. | Add appetite criteria with numeric limits, qualitative limits, breach reason, and escalation rule. |
| 20 | Risk register model | Missing | Risk capacity is not represented. | Add optional capacity fields for maximum tolerable exposure, budget, schedule float, outage tolerance, or compliance tolerance. |
| 21 | Risk register model | Partial | Treatment type exists, but treatment status is not explicit enough. | Add treatment status values such as Not started, In progress, Blocked, Complete, Accepted, and Retired. |
| 22 | Risk register model | Missing | Risk acceptance is not captured as a formal decision. | Add accepted-by, accepted-date, acceptance rationale, expiration date, and required review evidence. |
| 23 | Risk register model | Missing | There is no residual risk acceptance workflow. | Require a named accountable approver when residual risk remains high or outside appetite. |
| 24 | Risk register model | Missing | There is no owner workload or accountability check in the register export itself. | Add owner workload counts and flag owners with too many high-residual actions. |
| 25 | Risk register model | Partial | Review due dates exist, but review cadence is not first-class. | Add cadence, last reviewed date, next review date, overdue status, and review trigger. |
| 26 | Risk register model | Missing | There is no action due date per mitigation action. | Model mitigation actions as child records with owner, due date, status, evidence requirement, and escalation trigger. |
| 27 | Risk register model | Missing | Control testing evidence is not separated from control description. | Add control test date, tester, result, evidence ID, and next test due. |
| 28 | Risk register model | Missing | Control effectiveness is represented but not supported by test history. | Add effectiveness basis: tested, self-attested, inferred, expired, or missing. |
| 29 | Risk register model | Missing | There is no inherent-to-residual calculation explanation per row. | Add a short rationale field explaining how controls reduce likelihood or impact. |
| 30 | Risk register model | Missing | There is no confidence score breakdown. | Split confidence into evidence coverage, evidence freshness, source quality, method certainty, and management uncertainty. |
| 31 | Risk register model | Missing | Risk interdependencies are visual but not structured as a graph in exports. | Add dependency IDs with upstream and downstream relationship type. |
| 32 | Risk register model | Missing | There is no risk taxonomy manager. | Add a small editable taxonomy for category, subcategory, source, impact type, and objective. |
| 33 | Risk register model | Missing | There is no risk status lifecycle. | Add Open, Monitoring, Treating, Accepted, Closed, and Retired states with status rationale. |
| 34 | Risk register model | Missing | There is no materiality flag beyond score. | Add principal risk, material change, board attention, and regulatory attention flags. |
| 35 | Risk register model | Missing | There is no link between incident history and risk scoring. | Add incident linkage and require the scoring rationale to mention relevant incidents or confirm none were provided. |
| 36 | Risk report | Present | The board and detailed reports are now long enough to avoid shallow output. | Keep the hundreds-of-lines expectation, but make the report easier to scan with decision-first structure. |
| 37 | Risk report | Partial | The board report includes decisions and limitations, but it should open with a tighter executive decision page. | Add a one-page board brief with top decisions, breaches, new movement, overdue actions, and evidence caveats. |
| 38 | Risk report | Missing | There is no audience-specific report mode. | Add report modes for Board, Executive, Risk Owner, Auditor, and Project Team. |
| 39 | Risk report | Missing | There is no management attestation section. | Add a section for preparer, reviewer, accountable executive, date, and attestation status. |
| 40 | Risk report | Missing | There is no explicit reporting period. | Add period start, period end, generated date, evidence cutoff date, and review date. |
| 41 | Risk report | Missing | There is no material change log. | Add new since last run, changed since last run, score changed, owner changed, action overdue, and evidence changed. |
| 42 | Risk report | Partial | Limitations are disclosed, but data quality is not summarized in a board-friendly way. | Add a data quality panel with source count, freshness, unsupported claims, conflicts, and assumptions. |
| 43 | Risk report | Missing | There is no assurance map in the board pack. | Add first-line owner, second-line challenge, third-line assurance, and missing assurance notes. |
| 44 | Risk report | Missing | There is no risk appetite dashboard in the report. | Add appetite statement, metric, limit, current value, trend, breach status, owner, and response. |
| 45 | Risk report | Missing | There is no KRI threshold report. | Add KRI target, amber threshold, red threshold, current value, trend, data source, and response owner. |
| 46 | Risk report | Missing | The reports do not provide an action tracker table. | Add all mitigation actions with owner, due date, status, blocker, evidence required, and escalation path. |
| 47 | Risk report | Missing | There is no board question checklist tailored to the current top risks. | Add a short challenge checklist that directors can use in the meeting. |
| 48 | Risk report | Missing | There is no postmortem summary across risks. | Add a top failure chains section showing common missed signals, weak controls, and decision delays. |
| 49 | Risk report | Missing | There is no explicit "what changed my mind" evidence summary. | Add a section listing the evidence items that most affected scores and what would change the conclusion. |
| 50 | Risk report | Missing | There is no export cover page with scope and caveats. | Add a Markdown and HTML cover sheet for audit-friendly export packages. |
| 51 | Dashboard visuals | Present | The current visual dashboard has a decision strip, motion view, assurance runway, evidence view, KRI watchlist, scenario stress, heat maps, and red-team panel. | Preserve these 12 sections as the visual minimum. |
| 52 | Dashboard visuals | Partial | The decision strip shows key counts but not enough trend context. | Add prior-run deltas for risk count, appetite breaches, evidence warnings, and overdue actions. |
| 53 | Dashboard visuals | Partial | Risk Motion shows inherent and residual movement, but it is not visually comparable enough across many risks. | Add a slope chart or compact dumbbell chart with sorted residual score and appetite breach markers. |
| 54 | Dashboard visuals | Missing | There is no drill-down from visual cards to filtered register rows. | Make each visual card clickable and filter the register to the relevant risk set. |
| 55 | Dashboard visuals | Missing | There is no cross-filtering between owner, category, appetite, score, and evidence quality. | Add dashboard filters that update cards, heat maps, and register rows together. |
| 56 | Dashboard visuals | Missing | Heat maps do not show change over time. | Add old score markers when a prior assessment is loaded. |
| 57 | Dashboard visuals | Missing | The dashboard does not distinguish new, worsening, improving, unchanged, and closed risks. | Add movement badges and a risk motion legend with text and color cues. |
| 58 | Dashboard visuals | Missing | The dashboard lacks a specific overdue-action visual. | Add a 30, 60, 90 day action runway with overdue and blocked counts. |
| 59 | Dashboard visuals | Missing | The dashboard lacks a bowtie view for causes, controls, event, consequences, and recovery actions. | Add a generated bowtie panel for each principal risk. |
| 60 | Dashboard visuals | Missing | The dashboard lacks an assurance coverage heat map. | Add control assurance by risk and line of defense. |
| 61 | Dashboard visuals | Missing | The dashboard lacks an evidence freshness visual. | Add evidence age buckets and source retrieval dates. |
| 62 | Dashboard visuals | Missing | The dashboard lacks a "confidence versus severity" view. | Add a scatter plot that flags high-severity low-confidence risks first. |
| 63 | Dashboard visuals | Missing | The dashboard lacks a dependency network view. | Add a lightweight dependency graph or adjacency table showing shared contractors, permits, systems, or counterparties. |
| 64 | Dashboard visuals | Missing | The dashboard lacks a concise mobile dashboard layout. | Build a mobile-first summary stack with key metrics, filters, and expandable sections. |
| 65 | Dashboard visuals | Missing | The dashboard lacks print-specific layout validation. | Add print CSS and a browser test that creates a clean board-pack print view. |
| 66 | Evidence and provenance | Present | The app preserves evidence IDs and imported file metadata. | Keep evidence IDs visible in all exports. |
| 67 | Evidence and provenance | Present | GitHub imports include repo, ref, path, URL, and retrieved timestamp. | Keep this metadata and surface it more clearly in the evidence view. |
| 68 | Evidence and provenance | Partial | Evidence coverage is shown, but the reason each evidence item supports each risk is not always clear. | Add evidence-to-claim mapping with cited claim, risk field affected, and confidence impact. |
| 69 | Evidence and provenance | Missing | There is no source freshness scoring. | Add freshness age, stale threshold, and stale evidence warning. |
| 70 | Evidence and provenance | Missing | There is no conflict detection between sources. | Add contradiction flags where evidence notes imply different dates, statuses, scores, or ownership. |
| 71 | Evidence and provenance | Missing | There is no unsupported-claim inventory. | Add a list of statements in the report that came from assumptions rather than evidence. |
| 72 | Evidence and provenance | Missing | There is no evidence sufficiency threshold per risk type. | Require minimum evidence categories for schedule, financial, compliance, cyber, safety, and commissioning risks. |
| 73 | Evidence and provenance | Missing | There is no source credibility rating. | Add source type and credibility values such as public filing, owner document, management answer, imported note, and inferred. |
| 74 | Evidence and provenance | Missing | There is no explicit source cutoff date. | Add evidence cutoff date and warn when report text implies currentness beyond the cutoff. |
| 75 | Evidence and provenance | Missing | There is no quote or excerpt capture for source-bound claims. | For imported files, store short excerpts with line or character offsets where possible. |
| 76 | Evidence and provenance | Missing | There is no evidence request workflow. | Add open evidence request records with owner, needed artifact, reason, due date, and risk affected. |
| 77 | Evidence and provenance | Missing | There is no package integrity manifest. | Add a manifest JSON listing generated files, creation time, source evidence IDs, and hash values. |
| 78 | Evidence and provenance | Missing | There is no audit note for manual reviewer overrides. | Log every manual edit with field, old value, new value, reviewer, and timestamp. |
| 79 | KRI and monitoring | Present | Each risk has a KRI and early warning field. | Keep this as a required risk field. |
| 80 | KRI and monitoring | Partial | KRIs are useful text but not yet measurement objects. | Add KRI current value, data source, measurement frequency, threshold, and trend. |
| 81 | KRI and monitoring | Missing | There is no KRI breach workflow. | Add breach status, breach date, response owner, action required, and escalation status. |
| 82 | KRI and monitoring | Missing | KRIs are not visibly linked back to root causes. | Add `cause_linked_kri` and show which cause each KRI monitors. |
| 83 | KRI and monitoring | Missing | KRIs lack threshold rationale. | Add rationale explaining why green, amber, and red thresholds are credible. |
| 84 | KRI and monitoring | Missing | There is no KRI stale-data warning. | Add last-updated date and stale threshold by KRI. |
| 85 | KRI and monitoring | Missing | There is no KRI owner separate from risk owner. | Add KRI owner, data steward, and response owner fields. |
| 86 | KRI and monitoring | Missing | There is no monitoring calendar. | Add next KRI check date, next control test date, next risk review date, and next board review date. |
| 87 | KRI and monitoring | Missing | There is no aggregation of KRI health by objective or owner. | Add KRI health summary by objective, category, and owner. |
| 88 | KRI and monitoring | Missing | There is no tolerance for qualitative KRIs. | Add qualitative KRI support with evidence condition, observed status, trigger, and required response. |
| 89 | KRI and monitoring | Missing | There is no monitoring quality challenge. | Add a red-team check that asks whether the KRI would move early enough to prevent or reduce the event. |
| 90 | KRI and monitoring | Missing | There is no automatic prompt to refresh stale or breached KRIs. | Add generated follow-up prompts for each stale, breached, or low-confidence KRI. |

## Build Prompt to Fix the Issues

Use this prompt for the next implementation loop.

```text
You are improving the Risk Workbench Web app in the repository:
/Users/lukestambaugh/Documents/Files for GitHub/Risk Workbench Web r0

Goal:
Turn the current static browser risk-register generator into a stronger operational risk review cockpit. Preserve the existing privacy model, static GitHub Pages deployment, no external AI runtime, GitHub file import, local file import, deterministic generation, evidence gate, long-form exports, and current 12 visual dashboard sections.

Research-backed requirements:
1. Risk records must remain cause-event-consequence based.
2. Every risk must link to objectives, appetite criteria, controls, treatment, KRIs, evidence, owner, review cadence, and challenge questions.
3. Board reporting must be decision-first, showing top decisions, appetite breaches, material changes, overdue actions, KRI breaches, evidence quality, assurance gaps, and limitations.
4. KRIs must become measurement objects with owner, source, frequency, thresholds, trend, current value, stale-data status, and breach response.
5. Evidence must become claim-bound. Show which evidence supports which risk field, which statements are assumptions, which evidence is stale, and which evidence requests are open.
6. The dashboard must support action, not just reading: filters, sorting, drill-down, cross-filtering, reviewer decisions, and export package integrity.
7. Accessibility must meet practical WCAG 2.2 expectations for keyboard navigation, focus visibility, text contrast, non-text contrast, touch targets, and screen-reader labels.
8. Outputs should remain detailed. Board and detailed reports should normally contain hundreds of lines when evidence is adequate, but start with a concise executive decision page.

Implementation phases:
Phase 1 - Schema hardening:
- Extend the assessment JSON with objectives linked per risk, appetite criteria, risk capacity, lifecycle status, treatment status, risk acceptance, review cadence, mitigation action child records, control test records, KRI measurement objects, evidence claim mappings, evidence quality scoring, assurance ownership, and change-log support.
- Keep backward compatibility with the existing sample and tests.

Phase 2 - Register usability:
- Add search, sort, and filters for category, owner, residual band, appetite status, evidence quality, treatment status, review due date, and principal-risk flag.
- Add per-risk review controls: Accept draft, Needs evidence, Needs owner, Needs treatment, Board escalation, and Mark closed.
- Store reviewer overrides in the downloadable JSON with timestamped audit entries.

Phase 3 - Dashboard upgrade:
- Keep the 12 current visual sections.
- Add prior-run comparison when a prior assessment JSON is loaded.
- Add cross-filtering from visual cards to register rows.
- Add confidence-versus-severity view, overdue action runway, evidence freshness buckets, assurance coverage view, KRI breach panel, and principal-risk bowtie panels.
- Add mobile and print-specific layouts.

Phase 4 - Report upgrade:
- Add a one-page board brief before the long report.
- Add report modes: Board, Executive, Risk Owner, Auditor, and Project Team.
- Add material change log, action tracker, appetite dashboard, KRI threshold report, assurance map, evidence quality page, unsupported-claim inventory, open evidence request list, and management attestation.
- Keep detailed analysis highly detailed. Do not reduce depth to make the UI look cleaner.

Phase 5 - Evidence and provenance:
- Add evidence-to-claim mappings.
- Add stale evidence warnings, source credibility, source cutoff date, conflict detection, and evidence sufficiency checks by risk type.
- Add export package manifest JSON with generated file list and hashes where feasible in-browser.

Phase 6 - Accessibility and QA:
- Add unit tests for all new serializers, schema fields, filters, gates, reviewer overrides, reports, and prompt-pack output.
- Add browser checks on desktop, tablet, and mobile widths for no horizontal overflow, visible controls, usable reports, and generated dashboard sections.
- Add keyboard navigation and focus-visible checks.
- Add contrast checks for key text, badges, heat maps, and chart marks.
- Verify GitHub Pages live URL after push and confirm cache-busted assets.

Constraints:
- Do not add a backend.
- Do not send user evidence to an AI API.
- Do not store GitHub tokens beyond the current import request.
- Do not remove existing downloads.
- Do not flatten detailed outputs.
- Do not claim compliance certification. Use "draft support" unless a human validated the control framework.

Acceptance criteria:
- Existing tests pass.
- New tests cover schema, UI, reports, downloads, and accessibility.
- Public sample run passes the gate.
- Public sample run renders the existing 12 sections plus new panels.
- Board report and detailed report remain hundreds of lines when sample evidence is loaded.
- Register supports search, sort, filters, reviewer states, and export of reviewer audit trail.
- Prior assessment import shows material changes.
- Evidence panel identifies source freshness, source credibility, unsupported claims, conflicts, and open evidence requests.
- KRI panel shows thresholds, current value, trend, owner, stale status, breach status, and required response.
- No horizontal overflow at mobile, tablet, or desktop widths.
- GitHub Pages live URL is verified after deployment.
```

## Red-Team Prompts for the Next Loop

Use these prompts after implementation:

```text
Attack the Risk Workbench as a skeptical board risk committee. Identify every place where the output could create false confidence, hide uncertainty, understate a principal risk, overstate evidence quality, or make a risk owner look accountable when no action is actually due.
```

```text
Attack the Risk Workbench as an internal auditor. Test whether every score, control effectiveness claim, KRI status, appetite breach, mitigation status, and assurance statement is traceable to evidence, management input, or a clearly labeled assumption.
```

```text
Attack the Risk Workbench as a usability reviewer. Find every screen, table, visual, report, or download path that slows a reviewer down, hides the next decision, breaks keyboard use, creates mobile overflow, or buries high-severity low-confidence risks.
```

```text
Attack the Risk Workbench as a postmortem team after a major LNG project failure. Ask what signals were missed, which controls were paper-only, which owner did not act, which KRI was stale, which evidence was misleading, and which board decision should have been escalated sooner.
```

## Definition of Better

The next version is better only if a reviewer can answer these questions within a few minutes:

- What are the top risks and which are outside appetite?
- What decision is needed now?
- What changed since the last review?
- Which evidence supports the score?
- Which assumptions are unsupported?
- Which controls are proven, weak, stale, or untested?
- Which KRIs are breached, stale, or not early enough?
- Which actions are overdue or blocked?
- Who owns the next action?
- What would make the current conclusion wrong?

If the dashboard cannot answer those questions quickly, the output may be long, but it is not yet good.
