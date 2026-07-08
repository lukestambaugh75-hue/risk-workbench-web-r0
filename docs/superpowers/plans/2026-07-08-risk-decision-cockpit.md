# Risk Decision Cockpit Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Broaden the existing Risk Workbench dashboard into a research-backed risk decision cockpit.

**Architecture:** Keep the current static app. Extend `buildVisualSummary()` with richer derived dashboard data, then render that data in `renderVisualDashboard()` using existing HTML string patterns and CSS classes.

**Tech Stack:** Browser-only HTML, CSS, vanilla JavaScript, Python `unittest`, Node VM tests.

## Global Constraints

- No server or framework migration.
- No external runtime dependency or CDN.
- No AI calls from the browser.
- Keep downloads before long report previews.
- Use TDD: failing tests before production code.
- Preserve GitHub Pages compatibility.

---

### Task 1: Cockpit Data Contract

**Files:**
- Modify: `tests/test_risk_workbench_web.py`
- Modify: `assets/app.js`

**Interfaces:**
- Consumes: `WB.buildAssessment(input)`
- Produces: `assessment.visuals.decision_summary`, `risk_motion`, `treatment_assurance`, `evidence_intelligence`, `kri_watchlist`, `dependency_scenarios`

- [ ] **Step 1: Write failing test**

Add a Node VM test that builds the NextDecade sample and asserts the six new `assessment.visuals` groups exist with concrete data.

- [ ] **Step 2: Verify red**

Run:

```bash
python3 -m unittest tests.test_risk_workbench_web.RiskWorkbenchWebTests.test_visual_summary_includes_decision_cockpit_layers -v
```

Expected: FAIL because fields do not exist.

- [ ] **Step 3: Implement minimal data model**

Extend `buildVisualSummary()` with deterministic derived fields from the existing risk register, evidence pack, and management answers.

- [ ] **Step 4: Verify green**

Run the focused test and then the full suite.

### Task 2: Cockpit Renderer

**Files:**
- Modify: `tests/test_risk_workbench_web.py`
- Modify: `assets/app.js`
- Modify: `assets/styles.css`

**Interfaces:**
- Consumes: the Task 1 `assessment.visuals` contract.
- Produces: rendered sections named Board Decision Strip, Risk Motion, Treatment and Assurance, Evidence Intelligence, KRI Watchlist, Dependency and Scenario Stress.

- [ ] **Step 1: Write failing renderer test**

Assert `WB.renderVisualDashboard(assessment)` includes the new section titles and semantic CSS classes.

- [ ] **Step 2: Verify red**

Run the focused renderer test and confirm it fails before production code.

- [ ] **Step 3: Implement renderer**

Add helper renderers for decision metrics, motion bars, treatment rows, evidence rows, KRI cards, and dependency scenario cards.

- [ ] **Step 4: Verify green**

Run focused and full tests.

### Task 3: Runtime Verification and Release

**Files:**
- Modify only if verification exposes a defect: `assets/app.js`, `assets/styles.css`, `index.html`, tests.

**Interfaces:**
- Consumes: public GitHub Pages URL.
- Produces: live verified dashboard.

- [ ] **Step 1: Local browser smoke**

Run the sample workflow locally and verify PASS, new cockpit headings, no console warnings/errors, desktop no overflow, mobile 390px no overflow.

- [ ] **Step 2: Commit and push**

Stage only touched files and push to `origin/main`.

- [ ] **Step 3: Pages verification**

Wait for Pages, hash-verify live assets, and smoke-test live desktop/mobile.
