import json
import shutil
import subprocess
import textwrap
import unittest
from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]


def run_node(script: str) -> dict:
    result = subprocess.run(
        ["node", "-e", script],
        cwd=ROOT,
        text=True,
        capture_output=True,
        check=True,
    )
    return json.loads(result.stdout)


@unittest.skipUnless(shutil.which("node"), "node required for browser-engine tests")
class RiskWorkbenchWebTests(unittest.TestCase):
    def test_static_app_files_exist_and_are_wired_without_external_runtime(self):
        index = ROOT / "index.html"
        app = ROOT / "assets/app.js"
        styles = ROOT / "assets/styles.css"

        self.assertTrue(index.exists(), "index.html should be the GitHub Pages entrypoint")
        self.assertTrue(app.exists(), "assets/app.js should hold the browser app")
        self.assertTrue(styles.exists(), "assets/styles.css should hold the app styles")

        html = index.read_text(encoding="utf-8")
        self.assertIn("assets/app.js", html)
        self.assertIn("assets/styles.css", html)
        self.assertIn("Risk Workbench", html)
        self.assertIn("github", html.lower())
        self.assertNotIn("https://cdn", html.lower())
        self.assertNotIn("analytics", html.lower())

    def test_output_layout_keeps_downloads_reachable_and_reports_bounded(self):
        html = (ROOT / "index.html").read_text(encoding="utf-8")
        css = (ROOT / "assets/styles.css").read_text(encoding="utf-8")

        self.assertLess(html.index('id="downloadPanel"'), html.index('id="boardReport"'))
        self.assertLess(html.index('id="downloadPanel"'), html.index('id="detailedAnalysis"'))
        self.assertIn('class="output-nav"', html)
        self.assertIn('id="boardReportMeta"', html)
        self.assertIn('id="detailedAnalysisMeta"', html)
        self.assertIn('id="standardsAnnexMeta"', html)
        self.assertIn('class="report-shell"', html)
        self.assertIn(".report-shell pre", css)
        self.assertIn("max-height", css)
        self.assertIn("position: sticky", css)

    def test_generator_builds_cause_event_consequence_register_and_quality_fields(self):
        script = textwrap.dedent(
            """
            const fs = require('fs');
            const vm = require('vm');
            const assert = require('assert');
            const code = fs.readFileSync('assets/app.js', 'utf8');
            const sandbox = { window: { URL }, console, document: undefined, URL };
            sandbox.globalThis = sandbox.window;
            vm.runInNewContext(code, sandbox, { filename: 'app.js' });
            const WB = sandbox.window.RiskWorkbench;

            const assessment = WB.buildAssessment({
              company: 'NextDecade LNG, LLC',
              country: 'United States',
              website: 'https://www.next-decade.com',
              evidenceText: [
                'Rio Grande LNG construction schedule and critical path float are reviewed.',
                'Funding liquidity headroom and contingency draw are tracked.',
                'Permit obligations are mapped to regulators and field records.',
                'Commissioning test failures and punch-list aging are monitored.',
                'OT recovery drills and cyber access reviews are tracked.',
                'Contractor safety near misses and recordable incident rates are reviewed.',
                'Bechtel EPC delivery is a critical dependency.',
                'Feed gas delivery and LNG offtake contracts shape the operating model.'
              ].join('\\n'),
              importedEvidence: [{ name: 'github:README.md', text: 'Cyber recovery drills and contractor safety leading indicators are tracked monthly.' }],
              answers: {
                objectives: 'Train 1 first gas and safe commissioning',
                risk_appetite: 'Low appetite for safety and compliance risk; moderate appetite for schedule risk.',
                dependencies: 'Bechtel EPC, feed gas, offtakers, regulators'
              }
            });

            assert.equal(assessment.review_gate.verdict, 'pass');
            assert.ok(assessment.risk_register.length >= 6);
            assert.ok(assessment.quality_review);
            assert.ok(assessment.visuals);

            assessment.risk_register.forEach((risk) => {
              assert.ok(risk.cause, `${risk.id} should state a cause`);
              assert.ok(risk.risk_event, `${risk.id} should state an event`);
              assert.ok(risk.consequence, `${risk.id} should state a consequence`);
              assert.ok(Array.isArray(risk.existing_controls) && risk.existing_controls.length >= 2, `${risk.id} should list controls`);
              assert.ok(Array.isArray(risk.control_gaps) && risk.control_gaps.length >= 1, `${risk.id} should list gaps`);
              assert.ok(Array.isArray(risk.mitigation_actions) && risk.mitigation_actions.length >= 2, `${risk.id} should list mitigations`);
              assert.ok(risk.early_warning, `${risk.id} should have early warning`);
              assert.ok(risk.risk_velocity, `${risk.id} should have velocity`);
              assert.ok(risk.appetite_alignment, `${risk.id} should have appetite alignment`);
              assert.ok(risk.red_team_challenge, `${risk.id} should have red-team challenge`);
              assert.ok(risk.postmortem_scenario, `${risk.id} should have postmortem scenario`);
              assert.ok(risk.residual_score <= risk.inherent_score, `${risk.id} residual must not exceed inherent`);
            });

            console.log(JSON.stringify({
              verdict: assessment.review_gate.verdict,
              risks: assessment.risk_register.length,
              reviewFindings: assessment.quality_review.findings.length,
              visualCount: Object.keys(assessment.visuals).length
            }));
            """
        )

        result = run_node(script)
        self.assertEqual(result["verdict"], "pass")
        self.assertGreaterEqual(result["risks"], 6)
        self.assertGreaterEqual(result["reviewFindings"], 1)
        self.assertGreaterEqual(result["visualCount"], 4)

    def test_visual_renderers_include_inherent_residual_and_challenge_views(self):
        script = textwrap.dedent(
            """
            const fs = require('fs');
            const vm = require('vm');
            const assert = require('assert');
            const code = fs.readFileSync('assets/app.js', 'utf8');
            const sandbox = { window: { URL }, console, document: undefined, URL };
            sandbox.globalThis = sandbox.window;
            vm.runInNewContext(code, sandbox, { filename: 'app.js' });
            const WB = sandbox.window.RiskWorkbench;

            const assessment = WB.buildAssessment({
              company: 'NextDecade LNG, LLC',
              evidenceText: 'Rio Grande LNG is in construction and commissioning.\\nBechtel EPC delivery is a dependency.',
              importedEvidence: [],
              answers: { objectives: 'Safe commissioning', risk_appetite: 'Low appetite for safety and compliance.' }
            });

            const dashboard = WB.renderVisualDashboard(assessment);
            assert.ok(dashboard.includes('Inherent Heat Map'));
            assert.ok(dashboard.includes('Residual Heat Map'));
            assert.ok(dashboard.includes('Top Residual Risks'));
            assert.ok(dashboard.includes('Control Effectiveness'));
            assert.ok(dashboard.includes('Evidence Coverage'));
            assert.ok(dashboard.includes('Red Team Challenge'));
            assert.ok(WB.toHeatMapHtml(assessment).includes('Inherent Heat Map'));
            assert.ok(WB.toHeatMapHtml(assessment).includes('Residual Heat Map'));

            console.log(JSON.stringify({ visualDashboard: true }));
            """
        )

        self.assertEqual(run_node(script), {"visualDashboard": True})

    def test_visual_summary_includes_decision_cockpit_layers(self):
        script = textwrap.dedent(
            """
            const fs = require('fs');
            const vm = require('vm');
            const assert = require('assert');
            const code = fs.readFileSync('assets/app.js', 'utf8');
            const sandbox = { window: { URL }, console, document: undefined, URL };
            sandbox.globalThis = sandbox.window;
            vm.runInNewContext(code, sandbox, { filename: 'app.js' });
            const WB = sandbox.window.RiskWorkbench;

            const assessment = WB.buildAssessment({
              company: 'NextDecade LNG, LLC',
              country: 'United States',
              website: 'https://www.next-decade.com',
              evidenceText: [
                'Rio Grande LNG construction schedule and critical path float are reviewed weekly by the project team.',
                'Funding liquidity headroom and contingency draw are tracked against financing assumptions.',
                'Permit obligations are mapped to regulators, site commitments, and field records.',
                'Commissioning test failures and punch-list aging are monitored before startup handover.',
                'OT recovery drills, privileged access, vendor remote access, and cyber access reviews are tracked.',
                'Contractor safety near misses, stop-work events, and recordable incident rates are reviewed by workfront.',
                'Bechtel EPC delivery, feed gas readiness, LNG offtake commitments, and marine logistics are critical dependencies.',
                'Management has low appetite for safety, compliance, cyber, and uncontrolled startup risk.'
              ].join('\\n'),
              importedEvidence: [{ name: 'github:project-notes.md', text: [
                'Schedule recovery action owners are assigned for critical path float erosion.',
                'Treasury downside cases model cost growth, contingency use, and financing timing.',
                'Permit evidence packs include closure proof, correspondence, and obligation owner.',
                'Operations readiness reviews connect failed tests to procedures, training, spares, and hold points.',
                'Cyber response exercises validate OT backup restoration, vendor access, and manual fallback.',
                'Safety leadership reviews near misses by contractor, workfront, shift, and corrective action aging.'
              ].join('\\n') }],
              answers: {
                objectives: 'Train 1 first gas, safe commissioning, and evidence-ready handover.',
                incidents: 'No fatal events supplied; near-miss and stop-work signals still require trend review.',
                risk_appetite: 'Low appetite for safety, compliance, cyber, and uncontrolled startup risk; moderate appetite for schedule recovery with proven controls.',
                dependencies: 'Bechtel EPC, regulators, feed gas, offtakers, marine logistics, OT vendors, contractor workforce.'
              }
            });

            const visuals = assessment.visuals;
            console.log(JSON.stringify({
              hasDecisionSummary: Boolean(visuals.decision_summary),
              hasRiskMotion: Boolean(visuals.risk_motion),
              hasTreatmentAssurance: Boolean(visuals.treatment_assurance),
              hasEvidenceIntelligence: Boolean(visuals.evidence_intelligence),
              hasKriWatchlist: Boolean(visuals.kri_watchlist),
              hasDependencyScenarios: Boolean(visuals.dependency_scenarios),
              totalRisks: visuals.decision_summary ? visuals.decision_summary.total_risks : 0,
              principalRisks: visuals.decision_summary ? visuals.decision_summary.principal_risks.length : 0,
              decisionsNeeded: visuals.decision_summary ? visuals.decision_summary.decisions_needed.length : 0,
              reviewsDue: visuals.decision_summary ? visuals.decision_summary.reviews_due.length : 0,
              motionRows: visuals.risk_motion ? visuals.risk_motion.length : 0,
              motionHasReduction: visuals.risk_motion ? visuals.risk_motion.every((item) => typeof item.reduction_percent === 'number') : false,
              motionHasAppetiteStatus: visuals.risk_motion ? visuals.risk_motion.every((item) => item.appetite_status) : false,
              actionRunwayThirty: visuals.treatment_assurance ? visuals.treatment_assurance.action_runway.thirty.length : 0,
              ownerWorkload: visuals.treatment_assurance ? visuals.treatment_assurance.owner_workload.length : 0,
              coverageRows: visuals.evidence_intelligence ? visuals.evidence_intelligence.coverage_rows.length : 0,
              openRequests: visuals.evidence_intelligence ? visuals.evidence_intelligence.open_requests.length : 0,
              kriRows: visuals.kri_watchlist ? visuals.kri_watchlist.length : 0,
              dependencies: visuals.dependency_scenarios ? visuals.dependency_scenarios.dependencies.length : 0,
              scenarioCards: visuals.dependency_scenarios ? visuals.dependency_scenarios.scenario_cards.length : 0
            }));
            """
        )

        result = run_node(script)
        self.assertTrue(result["hasDecisionSummary"])
        self.assertTrue(result["hasRiskMotion"])
        self.assertTrue(result["hasTreatmentAssurance"])
        self.assertTrue(result["hasEvidenceIntelligence"])
        self.assertTrue(result["hasKriWatchlist"])
        self.assertTrue(result["hasDependencyScenarios"])
        self.assertGreaterEqual(result["totalRisks"], 6)
        self.assertGreaterEqual(result["principalRisks"], 1)
        self.assertGreaterEqual(result["decisionsNeeded"], 3)
        self.assertGreaterEqual(result["reviewsDue"], 3)
        self.assertGreaterEqual(result["motionRows"], 6)
        self.assertTrue(result["motionHasReduction"])
        self.assertTrue(result["motionHasAppetiteStatus"])
        self.assertGreaterEqual(result["actionRunwayThirty"], 1)
        self.assertGreaterEqual(result["ownerWorkload"], 1)
        self.assertGreaterEqual(result["coverageRows"], 6)
        self.assertGreaterEqual(result["openRequests"], 6)
        self.assertGreaterEqual(result["kriRows"], 6)
        self.assertGreaterEqual(result["dependencies"], 4)
        self.assertGreaterEqual(result["scenarioCards"], 6)

    def test_visual_dashboard_renders_decision_cockpit_sections(self):
        script = textwrap.dedent(
            """
            const fs = require('fs');
            const vm = require('vm');
            const code = fs.readFileSync('assets/app.js', 'utf8');
            const css = fs.readFileSync('assets/styles.css', 'utf8');
            const sandbox = { window: { URL }, console, document: undefined, URL };
            sandbox.globalThis = sandbox.window;
            vm.runInNewContext(code, sandbox, { filename: 'app.js' });
            const WB = sandbox.window.RiskWorkbench;

            const assessment = WB.buildAssessment({
              company: 'NextDecade LNG, LLC',
              country: 'United States',
              website: 'https://www.next-decade.com',
              evidenceText: [
                'Rio Grande LNG construction schedule and critical path float are reviewed weekly by the project team.',
                'Funding liquidity headroom and contingency draw are tracked against financing assumptions.',
                'Permit obligations are mapped to regulators, site commitments, and field records.',
                'Commissioning test failures and punch-list aging are monitored before startup handover.',
                'OT recovery drills, privileged access, vendor remote access, and cyber access reviews are tracked.',
                'Contractor safety near misses, stop-work events, and recordable incident rates are reviewed by workfront.',
                'Bechtel EPC delivery, feed gas readiness, LNG offtake commitments, and marine logistics are critical dependencies.',
                'Management has low appetite for safety, compliance, cyber, and uncontrolled startup risk.'
              ].join('\\n'),
              importedEvidence: [],
              answers: {
                objectives: 'Train 1 first gas, safe commissioning, and evidence-ready handover.',
                risk_appetite: 'Low appetite for safety, compliance, cyber, and uncontrolled startup risk; moderate appetite for schedule recovery with proven controls.',
                dependencies: 'Bechtel EPC, regulators, feed gas, offtakers, marine logistics, OT vendors, contractor workforce.'
              }
            });

            const dashboard = WB.renderVisualDashboard(assessment);
            console.log(JSON.stringify({
              hasDecisionStrip: dashboard.includes('Board Decision Strip'),
              hasRiskMotion: dashboard.includes('Risk Motion'),
              hasTreatment: dashboard.includes('Treatment and Assurance'),
              hasEvidence: dashboard.includes('Evidence Intelligence'),
              hasKri: dashboard.includes('KRI Watchlist'),
              hasDependency: dashboard.includes('Dependency and Scenario Stress'),
              hasDecisionClass: dashboard.includes('decision-strip'),
              hasMotionClass: dashboard.includes('motion-table'),
              hasTreatmentClass: dashboard.includes('treatment-board'),
              hasEvidenceClass: dashboard.includes('evidence-intelligence'),
              hasKriClass: dashboard.includes('kri-watchlist'),
              hasDependencyClass: dashboard.includes('dependency-scenarios'),
              cssHasDecisionStrip: css.includes('.decision-strip'),
              cssHasMotionTable: css.includes('.motion-table'),
              cssHasStatusPill: css.includes('.status-pill'),
              cssHasKriWatchlist: css.includes('.kri-watchlist'),
              noInlineStyle: !dashboard.includes('style=')
            }));
            """
        )

        result = run_node(script)
        self.assertTrue(result["hasDecisionStrip"])
        self.assertTrue(result["hasRiskMotion"])
        self.assertTrue(result["hasTreatment"])
        self.assertTrue(result["hasEvidence"])
        self.assertTrue(result["hasKri"])
        self.assertTrue(result["hasDependency"])
        self.assertTrue(result["hasDecisionClass"])
        self.assertTrue(result["hasMotionClass"])
        self.assertTrue(result["hasTreatmentClass"])
        self.assertTrue(result["hasEvidenceClass"])
        self.assertTrue(result["hasKriClass"])
        self.assertTrue(result["hasDependencyClass"])
        self.assertTrue(result["cssHasDecisionStrip"])
        self.assertTrue(result["cssHasMotionTable"])
        self.assertTrue(result["cssHasStatusPill"])
        self.assertTrue(result["cssHasKriWatchlist"])
        self.assertTrue(result["noInlineStyle"])

    def test_visual_dashboard_avoids_inline_styles_blocked_by_csp(self):
        script = textwrap.dedent(
            """
            const fs = require('fs');
            const vm = require('vm');
            const assert = require('assert');
            const code = fs.readFileSync('assets/app.js', 'utf8');
            const sandbox = { window: { URL }, console, document: undefined, URL };
            sandbox.globalThis = sandbox.window;
            vm.runInNewContext(code, sandbox, { filename: 'app.js' });
            const WB = sandbox.window.RiskWorkbench;

            const assessment = WB.buildAssessment({
              company: 'NextDecade LNG, LLC',
              evidenceText: [
                'Rio Grande LNG construction schedule and critical path float are reviewed.',
                'Funding liquidity headroom and contingency draw are tracked.',
                'Permit obligations are mapped to regulators and field records.',
                'Commissioning test failures and punch-list aging are monitored.',
                'OT recovery drills and cyber access reviews are tracked.',
                'Contractor safety near misses and recordable incident rates are reviewed.'
              ].join('\\n'),
              importedEvidence: [],
              answers: { risk_appetite: 'Low appetite for safety, compliance, and cyber risk.' }
            });

            const dashboard = WB.renderVisualDashboard(assessment);
            assert.ok(!dashboard.includes('style='));
            assert.ok(dashboard.includes('bar-fill w-'));

            console.log(JSON.stringify({ noInlineStyle: true }));
            """
        )

        self.assertEqual(run_node(script), {"noInlineStyle": True})

    def test_download_serializers_include_rich_register_fields_and_sanitize_cells(self):
        script = textwrap.dedent(
            """
            const fs = require('fs');
            const vm = require('vm');
            const assert = require('assert');
            const code = fs.readFileSync('assets/app.js', 'utf8');
            const sandbox = { window: { URL }, console, document: undefined, URL };
            sandbox.globalThis = sandbox.window;
            vm.runInNewContext(code, sandbox, { filename: 'app.js' });
            const WB = sandbox.window.RiskWorkbench;

            const assessment = WB.buildAssessment({
              company: '=HYPERLINK("https://bad.example")',
              evidenceText: '=HYPERLINK("https://bad.example")\\nRio Grande LNG is in construction.',
              importedEvidence: [],
              answers: { objectives: '+SUM(A1:A2)' }
            });

            const csv = WB.toRiskCsv(assessment);
            assert.ok(csv.includes('Cause'));
            assert.ok(csv.includes('Risk Event'));
            assert.ok(csv.includes('Existing Controls'));
            assert.ok(csv.includes('Control Gaps'));
            assert.ok(csv.includes('Mitigation Actions'));
            assert.ok(csv.includes('Red Team Challenge'));
            assert.ok(csv.includes("'=HYPERLINK"));
            assert.equal(WB.safeCsvCell('\\t=2+2'), "'\\t=2+2");

            const register = JSON.parse(WB.toRiskRegisterJson(assessment));
            assert.ok(register.risks[0].cause);
            assert.ok(register.risks[0].mitigation_actions.length >= 2);

            console.log(JSON.stringify({ csv: true, risks: register.risks.length }));
            """
        )

        result = run_node(script)
        self.assertTrue(result["csv"])
        self.assertGreaterEqual(result["risks"], 6)

    def test_no_evidence_still_fails_gate_and_challenge_explains_why(self):
        script = textwrap.dedent(
            """
            const fs = require('fs');
            const vm = require('vm');
            const assert = require('assert');
            const code = fs.readFileSync('assets/app.js', 'utf8');
            const sandbox = { window: { URL }, console, document: undefined, URL };
            sandbox.globalThis = sandbox.window;
            vm.runInNewContext(code, sandbox, { filename: 'app.js' });
            const WB = sandbox.window.RiskWorkbench;

            const noEvidence = WB.buildAssessment({ company: 'No Evidence LLC', evidenceText: '', importedEvidence: [], answers: {} });
            assert.equal(noEvidence.review_gate.verdict, 'revise');
            assert.equal(WB.countRealEvidence(noEvidence), 0);
            assert.ok(noEvidence.quality_review.findings.some((item) => item.toLowerCase().includes('evidence')));
            assert.ok(noEvidence.risk_register.every((risk) => risk.confidence === 'low'));

            console.log(JSON.stringify({ verdict: noEvidence.review_gate.verdict, realEvidence: WB.countRealEvidence(noEvidence) }));
            """
        )

        self.assertEqual(run_node(script), {"verdict": "revise", "realEvidence": 0})

    def test_irrelevant_evidence_does_not_pass_or_bind_to_template_risks(self):
        script = textwrap.dedent(
            """
            const fs = require('fs');
            const vm = require('vm');
            const assert = require('assert');
            const code = fs.readFileSync('assets/app.js', 'utf8');
            const sandbox = { window: { URL }, console, document: undefined, URL };
            sandbox.globalThis = sandbox.window;
            vm.runInNewContext(code, sandbox, { filename: 'app.js' });
            const WB = sandbox.window.RiskWorkbench;

            const assessment = WB.buildAssessment({
              company: 'Generic Cafe LLC',
              evidenceText: 'The cafeteria menu changed from soup to salad on Tuesday.',
              importedEvidence: [],
              answers: { objectives: 'Improve lunch satisfaction.' }
            });

            assert.equal(assessment.review_gate.verdict, 'revise');
            assert.ok(assessment.review_gate.errors.some((item) => item.includes('source-bound evidence')));
            assert.ok(assessment.risk_register.every((risk) => risk.evidence_coverage === 'needs-source'));
            assert.ok(assessment.risk_register.every((risk) => risk.evidence_ids.length === 0));

            console.log(JSON.stringify({ verdict: assessment.review_gate.verdict, unsupported: assessment.risk_register.length }));
            """
        )

        result = run_node(script)
        self.assertEqual(result["verdict"], "revise")
        self.assertGreaterEqual(result["unsupported"], 6)

    def test_standards_annex_is_conditional_not_a_conformance_claim(self):
        script = textwrap.dedent(
            """
            const fs = require('fs');
            const vm = require('vm');
            const assert = require('assert');
            const code = fs.readFileSync('assets/app.js', 'utf8');
            const sandbox = { window: { URL }, console, document: undefined, URL };
            sandbox.globalThis = sandbox.window;
            vm.runInNewContext(code, sandbox, { filename: 'app.js' });
            const WB = sandbox.window.RiskWorkbench;

            const assessment = WB.buildAssessment({
              company: 'NextDecade LNG, LLC',
              evidenceText: [
                'Rio Grande LNG construction schedule and critical path float are reviewed.',
                'Funding liquidity headroom and contingency draw are tracked.',
                'Permit obligations are mapped to regulators and field records.',
                'Commissioning test failures and punch-list aging are monitored.',
                'OT recovery drills and cyber access reviews are tracked.',
                'Contractor safety near misses and recordable incident rates are reviewed.'
              ].join('\\n'),
              importedEvidence: [],
              answers: { risk_appetite: 'Low appetite for safety, compliance, and cyber risk.' }
            });

            const markdown = WB.toStandardsMarkdown(assessment);
            assert.ok(markdown.includes('Draft standards mapping'));
            assert.ok(markdown.includes('conditional'));
            assert.ok(!markdown.includes('standards conformance annex'));

            console.log(JSON.stringify({ conditional: true }));
            """
        )

        self.assertEqual(run_node(script), {"conditional": True})

    def test_imported_evidence_reports_line_and_truncation_metadata(self):
        script = textwrap.dedent(
            """
            const fs = require('fs');
            const vm = require('vm');
            const assert = require('assert');
            const code = fs.readFileSync('assets/app.js', 'utf8');
            const sandbox = { window: { URL }, console, document: undefined, URL };
            sandbox.globalThis = sandbox.window;
            vm.runInNewContext(code, sandbox, { filename: 'app.js' });
            const WB = sandbox.window.RiskWorkbench;

            const text = Array.from({ length: 35 }, (_, index) => `Line ${index + 1} commissioning schedule permit safety cyber funding evidence`).join('\\n');
            const assessment = WB.buildAssessment({
              company: 'NextDecade LNG, LLC',
              evidenceText: '',
              importedEvidence: [{ name: 'local:long.md', text, source_type: 'local-file' }],
              answers: {}
            });
            const importedRows = assessment.evidence_pack.filter((item) => item.source === 'local:long.md');
            assert.equal(importedRows.length, 30);
            assert.equal(importedRows[0].line_number, 1);
            assert.equal(importedRows[29].line_number, 30);
            assert.equal(importedRows[29].truncated_from_file, true);

            console.log(JSON.stringify({ importedRows: importedRows.length, lastLine: importedRows[29].line_number, truncated: importedRows[29].truncated_from_file }));
            """
        )

        self.assertEqual(run_node(script), {"importedRows": 30, "lastLine": 30, "truncated": True})

    def test_long_form_outputs_include_hundreds_of_lines_of_supporting_analysis(self):
        script = textwrap.dedent(
            """
            const fs = require('fs');
            const vm = require('vm');
            const assert = require('assert');
            const code = fs.readFileSync('assets/app.js', 'utf8');
            const sandbox = { window: { URL }, console, document: undefined, URL };
            sandbox.globalThis = sandbox.window;
            vm.runInNewContext(code, sandbox, { filename: 'app.js' });
            const WB = sandbox.window.RiskWorkbench;

            const assessment = WB.buildAssessment({
              company: 'NextDecade LNG, LLC',
              country: 'United States',
              website: 'https://www.next-decade.com',
              evidenceText: [
                'Rio Grande LNG construction schedule and critical path float are reviewed weekly by the project team.',
                'Funding liquidity headroom and contingency draw are tracked against financing assumptions.',
                'Permit obligations are mapped to regulators, site commitments, and field records.',
                'Commissioning test failures and punch-list aging are monitored before startup handover.',
                'OT recovery drills, privileged access, vendor remote access, and cyber access reviews are tracked.',
                'Contractor safety near misses, stop-work events, and recordable incident rates are reviewed by workfront.',
                'Bechtel EPC delivery, feed gas readiness, LNG offtake commitments, and marine logistics are critical dependencies.',
                'Management has low appetite for safety, compliance, cyber, and uncontrolled startup risk.'
              ].join('\\n'),
              importedEvidence: [{ name: 'github:project-notes.md', text: [
                'Schedule recovery action owners are assigned for critical path float erosion.',
                'Treasury downside cases model cost growth, contingency use, and financing timing.',
                'Permit evidence packs include closure proof, correspondence, and obligation owner.',
                'Operations readiness reviews connect failed tests to procedures, training, spares, and hold points.',
                'Cyber response exercises validate OT backup restoration, vendor access, and manual fallback.',
                'Safety leadership reviews near misses by contractor, workfront, shift, and corrective action aging.'
              ].join('\\n') }],
              answers: {
                objectives: 'Train 1 first gas, safe commissioning, and evidence-ready handover.',
                incidents: 'No fatal events supplied; near-miss and stop-work signals still require trend review.',
                risk_appetite: 'Low appetite for safety, compliance, cyber, and uncontrolled startup risk; moderate appetite for schedule recovery with proven controls.',
                dependencies: 'Bechtel EPC, regulators, feed gas, offtakers, marine logistics, OT vendors, contractor workforce.'
              }
            });

            assert.equal(assessment.review_gate.verdict, 'pass');
            assert.ok(assessment.risk_register.every((risk) => risk.supporting_analysis));
            assert.ok(assessment.risk_register.every((risk) => risk.supporting_analysis.evidence_interpretation.length >= 4));
            assert.ok(assessment.risk_register.every((risk) => risk.supporting_analysis.mitigation_workplan.length >= 5));
            assert.ok(assessment.risk_register.every((risk) => risk.supporting_analysis.board_questions.length >= 5));

            const board = WB.toBoardMarkdown(assessment);
            const detailed = WB.toDetailedAnalysisMarkdown(assessment);
            const standards = WB.toStandardsMarkdown(assessment);
            const prompts = WB.toPromptPackMarkdown();

            assert.ok(board.split('\\n').length >= 220, `board lines ${board.split('\\n').length}`);
            assert.ok(detailed.split('\\n').length >= 300, `detailed lines ${detailed.split('\\n').length}`);
            assert.ok(standards.split('\\n').length >= 95, `standards lines ${standards.split('\\n').length}`);
            assert.ok(prompts.split('\\n').length >= 95, `prompt lines ${prompts.split('\\n').length}`);
            assert.ok(detailed.includes('Evidence Interpretation'));
            assert.ok(detailed.includes('Management Assumptions'));
            assert.ok(detailed.includes('Control Assurance Plan'));
            assert.ok(detailed.includes('30 / 60 / 90 Day Workplan'));
            assert.ok(board.includes('Risk Deep Dives'));

            console.log(JSON.stringify({
              boardLines: board.split('\\n').length,
              detailedLines: detailed.split('\\n').length,
              standardsLines: standards.split('\\n').length,
              promptLines: prompts.split('\\n').length
            }));
            """
        )

        result = run_node(script)
        self.assertGreaterEqual(result["boardLines"], 220)
        self.assertGreaterEqual(result["detailedLines"], 300)
        self.assertGreaterEqual(result["standardsLines"], 95)
        self.assertGreaterEqual(result["promptLines"], 95)

    def test_github_json_files_and_directory_import_are_bounded(self):
        script = textwrap.dedent(
            """
            const fs = require('fs');
            const vm = require('vm');
            const assert = require('assert');
            const code = fs.readFileSync('assets/app.js', 'utf8');
            const sandbox = { window: { URL, TextDecoder, atob }, console, document: undefined, URL, TextDecoder, atob };
            sandbox.globalThis = sandbox.window;
            vm.runInNewContext(code, sandbox, { filename: 'app.js' });
            const WB = sandbox.window.RiskWorkbench;

            assert.deepEqual(
              WB.parseGitHubUrl('https://github.com/acme/risk-repo/blob/main/docs/source.md'),
              { owner: 'acme', repo: 'risk-repo', ref: 'main', path: 'docs/source.md' }
            );

            const directoryEntries = Array.from({ length: 30 }, (_, index) => ({
              type: 'file',
              path: `docs/file-${index}.md`
            }));
            let fileCalls = 0;
            const directoryFetch = async (url) => {
              if (url.includes('/contents/docs?')) {
                return {
                  ok: true,
                  status: 200,
                  headers: { get: () => 'application/json; charset=utf-8' },
                  text: async () => JSON.stringify(directoryEntries)
                };
              }
              fileCalls += 1;
              return {
                ok: true,
                status: 200,
                headers: {
                  get: (name) => name.toLowerCase() === 'content-length' ? '12' : 'text/plain'
                },
                text: async () => 'bounded file'
              };
            };

            WB.importGitHubPath({
              owner: 'acme',
              repo: 'risk-repo',
              ref: 'main',
              path: 'docs'
            }, directoryFetch).then((boundedItems) => {
              assert.equal(boundedItems.length, 25);
              assert.equal(fileCalls, 25);
              console.log(JSON.stringify({ bounded: boundedItems.length, fileCalls }));
            }).catch((error) => {
              console.error(error);
              process.exit(1);
            });
            """
        )

        self.assertEqual(run_node(script), {"bounded": 25, "fileCalls": 25})


if __name__ == "__main__":
    unittest.main()
