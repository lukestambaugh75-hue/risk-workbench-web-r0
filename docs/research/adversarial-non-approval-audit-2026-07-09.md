# Adversarial Non-Approval Audit

Date: 2026-07-09

Target: Risk Workbench public dashboard at `https://lukestambaugh75-hue.github.io/risk-workbench-web-r0/`

Position: I do not approve the current product as a "researching" risk agent. I approve it only as a deterministic draft risk-register formatter that can organize evidence supplied by a human.

## What I Tested

- Opened the live public GitHub Pages build.
- Loaded the NextDecade sample.
- Generated the register.
- Captured the live output to `/Users/lukestambaugh/.codex/reports/ux-audits/risk-workbench-20260709-redteam/01-live-sample-generated.json`.
- Reviewed the source code paths that normalize evidence, create the review gate, render the gate message, and generate board outputs.
- Compared the sample output against current public NextDecade / Rio Grande LNG facts from company releases, the Rio Grande LNG project page, SEC filings, and Federal Register notices.

## Blunt Verdict

The app looks more confident than it deserves to look.

The main failure is not visual polish. The main failure is epistemic: the UI and outputs still let a reviewer believe a current-source risk assessment happened when the browser app did not fetch the website URL, SEC filings, FERC records, Federal Register notices, investor news, or current project pages.

That is unacceptable if the product is sold or used as a research agent. It is acceptable only if the product is framed as a local evidence formatter with a separate research pack required before board use.

## Live Behavior That Triggered This Audit

The live sample generated:

- Gate: `PASS`.
- Evidence items: `8`.
- Risks: `6`.
- Board report: `797` lines.
- Detailed analysis: `842` lines.
- Standards annex: `183` lines.

The eight evidence notes were generic typed notes:

- construction schedule reviewed.
- liquidity headroom tracked.
- permit obligations mapped.
- commissioning failures monitored.
- OT recovery drills tracked.
- contractor safety near misses reviewed.
- Bechtel EPC dependency.
- feed gas and offtake contracts.

Those are plausible notes, but they are not enough to prove a current NextDecade / Rio Grande LNG risk picture.

## Current Source Facts The App Did Not Force Into The Output

These facts are material enough that a serious LNG project risk register should either include them or explicitly say they were not researched.

| # | Current fact | Why it matters to risk output | Source |
|---|---|---|---|
| 1 | As of March 2026, Trains 1 and 2 plus common facilities were 67.8% complete; Train 3 was 44.2%; Train 4 was 10.6%; Train 5 was 6.8%. | Schedule, commissioning, construction, staffing, procurement, and assurance risk should be train-specific. | NextDecade Q1 2026 update: https://investors.next-decade.com/news-releases/news-release-details/nextdecade-provides-first-quarter-2026-business-update/ |
| 2 | Early electrical commissioning of Train 1 was continuing, with first gas expected in H2 2026 and first LNG production from Train 1 in H1 2027. | The sample says commissioning generically, but does not make Train 1 startup readiness the focal risk. | NextDecade Q1 2026 update |
| 3 | The Rio Grande LNG site covers about 1,000 acres and has 15,000 feet of Brownsville Ship Channel frontage. | Marine, site logistics, perimeter, emergency response, and construction interface risks need site-specific treatment. | NextDecade Q1 2026 update; Rio Grande LNG page: https://www.next-decade.com/our-business/rio-grande-lng/ |
| 4 | Trains 1 through 5 are under construction, and Trains 6 through 8 are being developed/permitted. | The risk register should separate execution risk from expansion-permitting/commercialization risk. | NextDecade Q1 2026 update |
| 5 | Construction began on Phase 1 in July 2023, Train 4 in September 2025, and Train 5 in October 2025 after FID and project financing. | FID, financing close, phase sequencing, and contractor capacity are not optional context. | NextDecade Q1 2026 update |
| 6 | Trains 6 through 8 are expected to add about 18 MTPA if constructed and placed into operation. | Strategic and regulatory risk should include expansion dependency, not only the first five trains. | NextDecade Q1 2026 update |
| 7 | Train 6 entered FERC pre-filing in November 2025, with a formal application expected before the end of Q2 2026. | A July 2026-quality risk assessment should ask whether that filing occurred, slipped, or changed scope. | NextDecade Q1 2026 update; Rio Grande LNG page |
| 8 | Rio Grande LNG requested a Federal Register/FERC extension until November 22, 2031, after a prior extension to November 22, 2028. | This is a direct schedule/regulatory risk signal; it should be surfaced above generic schedule language. | Federal Register notice: https://www.federalregister.gov/documents/2026/05/05/2026-08707/rio-grande-lng-llc-rio-grande-lng-train-4-llc-rio-grande-lng-train-5-llc-notice-of-request-for |
| 9 | The Federal Register notice says Train 1 completion was not anticipated until Q4 2027 and Train 5 was scheduled for Q2 2031. | This appears to tension with company first-gas/first-LNG language and should trigger source-conflict handling. | Federal Register notice |
| 10 | Rio Grande LNG planned a $3.50 billion senior secured notes offering across 2031, 2034, 2036, and 2041 maturities. | Financing and refinancing risk should mention debt maturity structure, pari passu ranking, and proceeds use. | NextDecade June 25, 2026 note pricing release: https://investors.next-decade.com/news-releases/news-release-details/nextdecade-corporation-announces-pricing-350-billion-rio-grande |
| 11 | Proceeds from the 2026 note offering were intended to repay existing borrowings and pay related fees/expenses. | "Funding headroom tracked" is too vague without refinancing, covenants, rates, and liquidity triggers. | NextDecade June 25, 2026 note pricing release |
| 12 | SEC risk factors say local/community/environmental opposition can impede or delay construction and operation, increase construction capital cost, cause reputation damage, and impede approvals. | The People & ESG row is too safety-focused; stakeholder/regulatory litigation opposition deserves its own treatment. | NextDecade 2025 Form 10-K: https://www.sec.gov/Archives/edgar/data/1612720/000161272026000009/next-20251231.htm |
| 13 | SEC risk factors say development requires substantial time and capital, may be delayed by uncontrollable factors, and depends on financial viability and ability to market LNG internationally. | Strategic and financial risk should include marketability and capital-deployment dependency, not only generic cost pressure. | NextDecade 2025 Form 10-K |
| 14 | Investor relations showed June 2026 note sale news and a June 3, 2026 CFO appointment. | A live risk register should force a recent-events scan before accepting a management-ready output. | NextDecade Investor Relations: https://investors.next-decade.com/ |
| 15 | NextDecade's project page says approximately 48 MTPA under construction/development, potential site space up to 10 trains, about 7,500 peak construction/trade workers, and 2027 expected first LNG. | Workforce scale, expansion scale, and first-LNG timing should drive People, ESG, safety, execution, and stakeholder risks. | Rio Grande LNG project page |

## Reasons I Do Not Approve The Current Product

### Research And Data Problems

1. The `Website or reference URL` field implies external context, but the app does not fetch that URL.
2. The app does not fetch SEC 10-K or 10-Q filings.
3. The app does not fetch Federal Register or FERC records.
4. The app does not fetch press releases.
5. The app does not fetch investor presentations.
6. The app does not fetch project pages.
7. The app does not fetch current news.
8. The app does not fetch rating-agency, debt-market, or financing materials.
9. The app does not force a source cutoff date.
10. The app does not tell the user what source universe was not searched.
11. The app treats typed notes as "medium" confidence by default.
12. The app can pass with generic notes that do not contain URLs, filing references, retrieval dates, excerpts, or source authority.
13. The app counts evidence quantity but does not score evidence authority.
14. The app does not distinguish company statements, regulator notices, SEC risk factors, management answers, imported notes, and assumptions strongly enough.
15. The app does not detect source conflicts, such as company production timing versus Federal Register completion language.
16. The app does not detect material changes since a prior run.
17. The app does not identify missing recent events.
18. The app does not verify that a company name maps to the correct legal entity or subsidiary structure.
19. The app does not ask whether the register is for NextDecade Corporation, NextDecade LNG, LLC, Rio Grande LNG, LLC, Train 4 LLC, or Train 5 LLC.
20. The app does not map evidence to the exact field it changes: score, owner, control, KRI, mitigation, or assumption.
21. The app does not preserve source excerpts for typed notes.
22. The app does not require line references for imported files.
23. The app does not flag stale imported files.
24. The app does not flag empty or low-authority sources before producing large reports.
25. The app's current "research" is deterministic patterning over supplied text, not research.

### Run Flow And UX Problems

26. The first run is cleaner than before, but the central action still suggests generation rather than research intake.
27. The app should start with "Build source pack" or "Use draft mode" as an explicit choice.
28. The sample button creates a false sense of adequacy because it passes without current public-source facts.
29. The PASS chip is too strong for a draft evidence-structure gate.
30. The status area does not show "not researched" prominently enough.
31. The output appears immediately polished, which can mask weak inputs.
32. The downloads become available even when source currentness is unproven.
33. The evidence workspace is hidden for simplicity, but research depth depends on it.
34. The UI does not guide a user through source collection by source class.
35. The UI does not show a checklist of required LNG/project source types.
36. The UI does not ask whether the user wants public-company, project-company, subsidiary, or asset-level analysis.
37. The app does not make the user confirm scope before generating.
38. The generated page still mixes board pack, register, evidence, dashboard, reports, and downloads into one long surface.
39. The output nav is a jump list, not a real workbench review state.
40. The review gate is visually simple but conceptually overloaded.
41. The app has no "reject this risk" or "needs source" workflow per row.
42. The app has no reviewer comments.
43. The app has no accepted/rejected/follow-up state.
44. The app has no run history.
45. The app has no prior-run comparison.

### Output Quality Problems

46. The output is long, but length is not the same as evidence quality.
47. The board report should lead with source gaps and material recent events, not just generated risk rows.
48. The sample board pack should say which 2026 facts were not present in the supplied evidence.
49. The detailed analysis does not clearly separate "evidence says" from "template inferred."
50. The report does not list unsupported claims.
51. The report does not list assumptions in a table with owner, confidence, and validation requirement.
52. The report does not show source conflict resolution.
53. The report does not show currentness risk.
54. The report does not show what sources were searched and what sources were not searched.
55. The report does not show source priority.
56. The report does not show a material-change log.
57. The report does not show recent-events triage.
58. The report does not include entity-structure caveats.
59. The report does not include FERC/Federal Register date reconciliation.
60. The report does not include debt maturity/refinancing details in the financial risk.
61. The report does not include train-by-train progress in the schedule risk.
62. The report does not include train-by-train commissioning/readiness gates.
63. The report does not split stakeholder opposition/litigation/permitting from contractor safety.
64. The report does not include expansion-train permitting as a distinct strategic/compliance risk.
65. The report does not tie each mitigation to evidence required for closure.

### Risk Methodology Problems

66. The scoring is deterministic but not defensible enough for board use.
67. The app does not explain why likelihood and impact values were selected.
68. The app does not show how controls reduce inherent to residual risk.
69. The app does not calibrate scores against objective thresholds.
70. The app does not include risk appetite limits with breach logic.
71. The app does not model risk capacity.
72. KRIs are still text labels, not measured indicators.
73. KRIs have no current value.
74. KRIs have no green/amber/red thresholds.
75. KRIs have no data source.
76. KRIs have no stale-data date.
77. Controls have no test date.
78. Controls have no tester/result/evidence ID.
79. Mitigations have no due-date quality check beyond generated text.
80. Owners are role labels, not accountable named roles or people.
81. The app does not model risk interdependency in exports.
82. The app does not model control dependency.
83. The app does not model scenario severity.
84. The app does not model upside/opportunity risk where relevant.
85. The app does not have a formal risk acceptance workflow.

### Governance, Security, And Trust Problems

86. The product can be misunderstood as an agent even though it is static browser logic.
87. The prompt pack exists, but using it is optional and not enforced by the gate.
88. The app does not produce an evidence manifest with hashes.
89. The app does not produce an audit trail for manual edits.
90. The app does not mark generated content as draft in every exported file header.
91. The GitHub import token handling is local-per-request, but the UX still needs clearer warnings for non-technical users.
92. The app does not prove that imported GitHub files are from the intended repo or branch unless the user checks.
93. The app does not block accidental import of irrelevant files beyond text-ish filtering.
94. The app does not have a source-size/depth report showing what was truncated.
95. The app does not force post-generation human signoff.
96. The app does not generate a handoff package for another model or reviewer with the exact source gaps at the top.
97. The app does not validate live public Pages after every user-visible change from inside the product.
98. The app has unit tests, but not enough browser tests for keyboard flow, mobile review, contrast, or downloadable file integrity.
99. The app has visual dashboard sections, but not enough evidence that each section improves decision quality.
100. The app is useful, but the current trust posture is still too permissive.

## The Single Biggest Product Issue

The gate name is wrong.

Today it behaves like:

`Draft evidence-structure gate`

But the UI can read like:

`Research quality gate`

That difference matters. A draft evidence-structure gate checks whether supplied notes can support a generated register. A research quality gate checks whether current, authoritative, relevant, and complete sources were actually gathered and analyzed.

The app currently does the first one. It does not do the second one.

## Changes Made From This Audit

I changed the app so it is more honest:

- Added a visible Research boundary warning to the UI.
- Cache-busted assets to `20260709-research-boundary`.
- Changed the pass message to say PASS applies to supplied evidence only.
- Added a board-report limitation stating the website/reference URL is not fetched and current filings, agency records, websites, and news must be imported or researched separately.
- Added tests for the new boundary language.

These changes reduce the chance of a false confidence failure. They do not solve the deeper research problem.

## What I Would Require Before Approving The Product As A Research Agent

### P0 - Source Pack Builder

Add a source-pack stage before generation:

- Company/project official site pages.
- Investor relations news.
- SEC 10-K.
- Latest SEC 10-Q.
- Latest 8-Ks.
- Federal Register and FERC docket references.
- Project page.
- Investor presentation.
- Safety/sustainability page.
- Financing/debt releases.
- Relevant local/community/regulatory opposition sources.
- User-provided internal docs.

The app should show each source as `found`, `missing`, `not searched`, `imported`, or `stale`.

### P0 - Research Gate

Rename the current PASS gate or add a second gate:

- `Draft structure gate`: checks field completeness and internal consistency.
- `Research sufficiency gate`: checks source authority, source freshness, source coverage, currentness, conflicts, and material gaps.

No export should look board-ready unless both gates pass or the exported cover page clearly says draft/source-incomplete.

### P1 - Evidence Model

Every evidence item should include:

- source title.
- source type.
- URL or file path.
- publication date.
- retrieval date.
- source authority.
- excerpt.
- line/page reference when available.
- freshness age.
- claim supported.
- risk field affected.
- confidence effect.

### P1 - Currentness And Conflict Engine

Add explicit checks for:

- stale sources.
- conflicting dates.
- conflicting project status.
- missing latest filings.
- missing latest news.
- management assumptions not found in evidence.
- generated claims not traceable to source.

### P2 - LNG Project Source Checklist

For LNG/project risk registers, force source coverage for:

- train-by-train construction progress.
- commissioning/startup readiness.
- EPC contractor and contract model.
- project financing and debt maturity.
- offtake/SPAs and market exposure.
- FERC/Federal Register/DOE/regulatory status.
- local/community/environmental challenge status.
- feed gas/pipeline/marine logistics.
- safety/contractor workforce scale.
- cyber/OT readiness.
- insurance/force majeure/weather.
- expansion trains and future FID conditions.

### P2 - Output Rebuild

Restructure the board pack:

1. Scope and source status.
2. Current material facts.
3. Source gaps and conflicts.
4. Decisions required.
5. Top risk movements.
6. Risk register.
7. Evidence map.
8. Unsupported claims.
9. Actions and owners.
10. Appendix.

### P3 - UX Rebuild

Keep the simple Plan / Do / Check / Review frame, but make the steps real:

- Plan: select entity scope and source checklist.
- Do: import or paste sources.
- Check: show source quality, freshness, conflicts, and draft register.
- Review: accept/reject risks, assign evidence requests, export.

Uploads should stay behind a progressive panel, but source completeness must be visible on the first screen.

### P4 - Test Requirements

Add tests for:

- source checklist state.
- missing source warnings.
- currentness cutoffs.
- conflict detection.
- no research gate pass without authoritative sources.
- no board-ready download when research gate fails.
- sample output includes current NextDecade material facts or explicitly says they are not researched.
- browser flow at desktop, tablet, and mobile.
- keyboard access to generate, import, nav, report downloads, and review controls.
- exported file headers and caveats.

## New Approval Standard

I would approve the app when it can answer these questions visibly:

- What entity did we assess?
- What date is the research current through?
- Which sources were searched?
- Which sources were imported?
- Which sources are missing?
- Which facts changed the risk picture?
- Which facts conflict?
- Which risk scores are evidence-backed?
- Which risks are assumption-led?
- Which claims are unsupported?
- Which owner must act next?
- What would change the conclusion?
- Why is this safe to export?

Until then, the right product label is:

`Evidence-first draft risk workbench`

The wrong product label is:

`Researching risk agent`

