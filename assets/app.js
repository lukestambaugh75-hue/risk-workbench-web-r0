(function (global) {
  "use strict";

  var CATEGORIES = [
    "Strategic",
    "Financial",
    "Compliance & Legal",
    "Operational",
    "Cyber & Technology",
    "People & ESG"
  ];

  var RISK_TEMPLATES = [
    {
      category: "Strategic",
      title: "Milestone slippage",
      owner: "Chief Projects Officer",
      cause: "critical path work, contractor dependencies, and commercial commitments are tightly coupled",
      event: "one or more construction or commissioning milestones move outside the approved recovery window",
      treatment: "Refresh integrated recovery plan",
      treatment_type: "Reduce",
      kri: "critical path float",
      early_warning: "critical path float falls below 30 days or recovery actions miss two reporting cycles",
      consequence: "missed commercial milestones and reduced stakeholder confidence",
      existing_controls: ["integrated master schedule", "monthly executive project review", "contractor progress reporting"],
      control_gaps: ["independent schedule confidence and recovery-plan evidence may be incomplete"],
      mitigation_actions: [
        "Run a 30/60/90-day schedule risk review with owner, trigger, and recovery action for each critical path constraint.",
        "Require evidence-backed variance explanations from each material contractor dependency."
      ],
      red_team_challenge: "What evidence proves the recovery path is achievable rather than optimistic?",
      postmortem_scenario: "A missed handover date was accepted as a one-month slip until cascading contractor and permit constraints made the delay unrecoverable.",
      appetite_key: "schedule",
      risk_velocity: "Fast",
      likelihood: 4,
      impact: 5,
      residual_likelihood: 3,
      residual_impact: 4
    },
    {
      category: "Financial",
      title: "Funding pressure",
      owner: "Chief Financial Officer",
      cause: "large capital needs, interest-rate exposure, and project contingency demands can converge",
      event: "available funding headroom tightens before the next financing or contingency decision",
      treatment: "Stress-test funding runway",
      treatment_type: "Reduce",
      kri: "liquidity headroom",
      early_warning: "forecast liquidity headroom drops below the board threshold or contingency draw accelerates",
      consequence: "higher financing cost and constrained project optionality",
      existing_controls: ["treasury forecast", "board financing updates", "contingency tracking"],
      control_gaps: ["downside cases may not connect schedule delay, commodity exposure, and financing timing"],
      mitigation_actions: [
        "Maintain a downside funding case that links schedule slippage, contingency usage, and covenant sensitivity.",
        "Pre-clear financing decision points with triggers for draw, hedge, or scope tradeoff decisions."
      ],
      red_team_challenge: "Which assumption would break first if schedule recovery or market access worsened?",
      postmortem_scenario: "A manageable variance became a funding decision because contingency use and financing timing were reviewed separately.",
      appetite_key: "funding",
      risk_velocity: "Medium",
      likelihood: 3,
      impact: 5,
      residual_likelihood: 2,
      residual_impact: 4
    },
    {
      category: "Compliance & Legal",
      title: "Permit non-compliance",
      owner: "General Counsel",
      cause: "permit commitments, regulatory conditions, and field execution records can drift apart",
      event: "a material permit obligation is missed, undocumented, or disputed by a regulator",
      treatment: "Map permit obligations monthly",
      treatment_type: "Avoid / Reduce",
      kri: "open permit actions",
      early_warning: "open permit actions age past 30 days or field records do not reconcile to the permit matrix",
      consequence: "regulatory enforcement, rework, or approval delays",
      existing_controls: ["permit obligation matrix", "legal review cadence", "regulatory correspondence log"],
      control_gaps: ["evidence of closure may be scattered across teams and not audit-ready"],
      mitigation_actions: [
        "Create a permit control register with obligation, owner, due date, evidence location, and closure status.",
        "Run monthly legal-field reconciliation on open obligations and exceptions."
      ],
      red_team_challenge: "Can every permit-critical assertion be traced to a dated source and a responsible owner?",
      postmortem_scenario: "A low-visibility permit action was treated as administrative until it blocked approval of dependent work.",
      appetite_key: "compliance",
      risk_velocity: "Fast",
      likelihood: 3,
      impact: 4,
      residual_likelihood: 2,
      residual_impact: 3
    },
    {
      category: "Operational",
      title: "Commissioning failure",
      owner: "Operations Director",
      cause: "construction completion, procedures, people readiness, and system handover are not fully synchronized",
      event: "commissioning tests fail or reveal readiness gaps that prevent stable startup",
      treatment: "Run readiness assurance reviews",
      treatment_type: "Reduce",
      kri: "failed commissioning tests",
      early_warning: "test failures, punch-list aging, or procedure exceptions rise for two consecutive reviews",
      consequence: "startup instability and delayed operational handover",
      existing_controls: ["commissioning test plan", "punch-list review", "operations readiness review"],
      control_gaps: ["readiness assurance may not connect failed tests to training, spares, and procedure updates"],
      mitigation_actions: [
        "Tie each failed test to root cause, retest owner, operating procedure update, and startup hold point.",
        "Run pre-startup assurance reviews for people, spares, procedures, permits, and cyber/OT readiness."
      ],
      red_team_challenge: "Which failed or deferred test could invalidate the claimed startup-readiness date?",
      postmortem_scenario: "Startup began with accepted exceptions that later combined into unstable operations and delayed handover.",
      appetite_key: "operations",
      risk_velocity: "Fast",
      likelihood: 4,
      impact: 5,
      residual_likelihood: 3,
      residual_impact: 4
    },
    {
      category: "Cyber & Technology",
      title: "Control-system outage",
      owner: "Chief Information Security Officer",
      cause: "OT systems, vendor access, and recovery procedures can be under-tested during project transition",
      event: "a control-system outage or cyber event disrupts visibility, control, or recovery",
      treatment: "Validate OT recovery drills",
      treatment_type: "Reduce / Transfer",
      kri: "OT recovery time",
      early_warning: "critical OT backups, access reviews, or recovery drills miss planned cadence",
      consequence: "loss of operational visibility or extended recovery time",
      existing_controls: ["OT access review", "backup and recovery plan", "incident response procedure"],
      control_gaps: ["tabletop success may not prove technical recovery under startup conditions"],
      mitigation_actions: [
        "Run an OT recovery exercise that proves restore time, decision authority, vendor access, and manual fallback.",
        "Validate privileged access and remote vendor pathways before commissioning hold points."
      ],
      red_team_challenge: "Has recovery been proven technically, or only discussed in a tabletop?",
      postmortem_scenario: "A routine vendor access issue became an outage because backup, escalation, and manual fallback were not tested together.",
      appetite_key: "cyber",
      risk_velocity: "Immediate",
      likelihood: 3,
      impact: 4,
      residual_likelihood: 2,
      residual_impact: 3
    },
    {
      category: "People & ESG",
      title: "Contractor safety event",
      owner: "HSSE Director",
      cause: "high-consequence field work, contractor turnover, and schedule pressure can weaken safety discipline",
      event: "a contractor safety event causes injury, work stoppage, or regulatory attention",
      treatment: "Tighten contractor safety controls",
      treatment_type: "Avoid / Reduce",
      kri: "recordable incident rate",
      early_warning: "near misses, stop-work events, or supervisor observations trend adversely",
      consequence: "injury, work stoppage, and reputational damage",
      existing_controls: ["HSSE plan", "contractor onboarding", "incident and near-miss reporting"],
      control_gaps: ["leading indicators may not be separated by contractor, workfront, and shift"],
      mitigation_actions: [
        "Segment leading indicators by contractor and workfront, then trigger focused field verification.",
        "Require corrective-action closure evidence before high-risk workfronts proceed."
      ],
      red_team_challenge: "Are safety indicators leading enough to prevent the event, or only lagging after harm occurs?",
      postmortem_scenario: "Near-miss signals were visible but not escalated because they were aggregated across contractors and workfronts.",
      appetite_key: "safety",
      risk_velocity: "Immediate",
      likelihood: 4,
      impact: 4,
      residual_likelihood: 2,
      residual_impact: 3
    }
  ];

  var TEXT_EXTENSIONS = [
    ".txt",
    ".md",
    ".csv",
    ".json",
    ".html",
    ".htm",
    ".log",
    ".yaml",
    ".yml",
    ".xml"
  ];
  var MAX_GITHUB_IMPORT_FILES = 25;
  var MAX_GITHUB_FILE_BYTES = 900000;
  var MAX_LOCAL_IMPORT_FILES = 25;
  var MAX_LOCAL_FILE_BYTES = 900000;

  var CATEGORY_KEYWORDS = {
    "Strategic": ["schedule", "milestone", "critical path", "construction", "epc", "contractor", "recovery", "delay", "float", "bechtel"],
    "Financial": ["funding", "liquidity", "finance", "financing", "contingency", "covenant", "capital", "cost", "budget", "runway"],
    "Compliance & Legal": ["permit", "regulator", "regulatory", "compliance", "legal", "obligation", "approval", "enforcement", "condition"],
    "Operational": ["commissioning", "startup", "start-up", "handover", "readiness", "test", "punch-list", "operations", "spares"],
    "Cyber & Technology": ["cyber", "ot", "control system", "recovery", "backup", "access", "vendor", "incident response", "technology"],
    "People & ESG": ["safety", "hsse", "contractor", "injury", "near miss", "recordable", "environmental", "esg", "workfront", "stop-work"]
  };

  var state = {
    importedEvidence: [],
    assessment: null
  };

  function cleanText(value) {
    return String(value || "").replace(/\s+/g, " ").trim();
  }

  function truncate(value, limit) {
    var text = cleanText(value);
    if (text.length <= limit) {
      return text;
    }
    return text.slice(0, limit - 1).trim() + "...";
  }

  function escapeHtml(value) {
    return String(value || "")
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#39;");
  }

  function safeCsvCell(value) {
    var text = String(value == null ? "" : value);
    if (/^[\s=+\-@]/.test(text)) {
      text = "'" + text;
    }
    if (/[",\n\r]/.test(text)) {
      return '"' + text.replace(/"/g, '""') + '"';
    }
    return text;
  }

  function neutralizeMarkdown(value) {
    return escapeHtml(value)
      .replace(/\[/g, "&#91;")
      .replace(/\]/g, "&#93;")
      .replace(/`/g, "&#96;")
      .replace(/\|/g, "&#124;");
  }

  function score(likelihood, impact) {
    return likelihood * impact;
  }

  function bandName(value) {
    if (value >= 15) {
      return "Extreme";
    }
    if (value >= 10) {
      return "High";
    }
    if (value >= 5) {
      return "Medium";
    }
    return "Low";
  }

  function splitEvidenceText(text) {
    var normalized = String(text || "").replace(/\r/g, "\n");
    var lines = normalized
      .split(/\n+/)
      .map(function (line) {
        return cleanText(line.replace(/^[-*]\s*/, ""));
      })
      .filter(Boolean);
    if (lines.length) {
      return lines;
    }
    return cleanText(normalized) ? [cleanText(normalized)] : [];
  }

  function normalizeEvidence(input) {
    var entries = [];
    splitEvidenceText(input.evidenceText).forEach(function (claim, index) {
      entries.push({
        claim: truncate(claim, 500),
        source: "typed evidence",
        source_type: "user-entered",
        line_number: index + 1,
        truncated_from_file: false,
        confidence: "medium",
        retrieved_at: new Date().toISOString()
      });
    });
    (input.importedEvidence || []).forEach(function (item) {
      var claims = splitEvidenceText(item.text);
      var visibleClaims = claims.slice(0, 30);
      visibleClaims.forEach(function (claim, index) {
        entries.push({
          claim: truncate(claim, 500),
          source: item.name || item.path || item.url || "imported file",
          source_type: item.source_type || "imported",
          url: item.url || "",
          repo: item.repo || "",
          ref: item.ref || "",
          path: item.path || "",
          line_number: index + 1,
          truncated_from_file: claims.length > visibleClaims.length && index === visibleClaims.length - 1,
          source_line_count: claims.length,
          assessed_line_count: visibleClaims.length,
          confidence: "medium",
          retrieved_at: item.retrieved_at || new Date().toISOString()
        });
      });
    });
    if (!entries.length) {
      entries.push({
        claim: "No evidence supplied; assessment is assumption-led and must be revised before use.",
        source: "system fallback",
        source_type: "fallback",
        line_number: 1,
        truncated_from_file: false,
        confidence: "low",
        retrieved_at: new Date().toISOString()
      });
    }
    return entries.map(function (entry, index) {
      return Object.assign({ id: "E" + String(index + 1).padStart(3, "0") }, entry);
    });
  }

  function normalizeAnswers(answers) {
    return Object.keys(answers || {})
      .sort()
      .map(function (key, index) {
        return {
          id: "M" + String(index + 1).padStart(3, "0"),
          question: key,
          answer: cleanText(answers[key])
        };
      })
      .filter(function (entry) {
        return entry.answer;
      });
  }

  function evidenceIds(evidencePack, start, count) {
    var ids = evidencePack.map(function (item) {
      return item.id;
    });
    var selected = [];
    if (!ids.length) {
      return selected;
    }
    for (var index = 0; index < Math.min(count || 2, ids.length); index += 1) {
      selected.push(ids[(start + index) % ids.length]);
    }
    return selected;
  }

  function evidenceMatchesCategory(evidence, category) {
    var text = cleanText(evidence && evidence.claim).toLowerCase();
    var keywords = CATEGORY_KEYWORDS[category] || [];
    return keywords.some(function (keyword) {
      return text.indexOf(keyword) !== -1;
    });
  }

  function evidenceIdsForCategory(evidencePack, category, count) {
    return (evidencePack || [])
      .filter(function (item) {
        return item.source_type !== "fallback" && evidenceMatchesCategory(item, category);
      })
      .slice(0, count || 2)
      .map(function (item) {
        return item.id;
      });
  }

  function managementIdsForTemplate(managementAnswers, template) {
    var relevantKeys = ["risk_appetite"];
    if (template.category === "Strategic" || template.category === "Operational") {
      relevantKeys.push("objectives", "dependencies");
    }
    if (template.category === "People & ESG" || template.category === "Compliance & Legal" || template.category === "Cyber & Technology") {
      relevantKeys.push("incidents", "dependencies");
    }
    if (template.category === "Financial") {
      relevantKeys.push("objectives", "dependencies");
    }
    return (managementAnswers || [])
      .filter(function (answer) {
        return relevantKeys.indexOf(answer.question) !== -1;
      })
      .map(function (answer) {
        return answer.id;
      });
  }

  function countRealEvidenceItems(evidencePack) {
    return (evidencePack || []).filter(function (item) {
      return item.source_type !== "fallback";
    }).length;
  }

  function confidenceForEvidence(evidencePack) {
    var realEvidenceCount = countRealEvidenceItems(evidencePack);
    if (realEvidenceCount >= 5) {
      return "high";
    }
    if (realEvidenceCount > 0) {
      return "medium";
    }
    return "low";
  }

  function evidenceCoverage(evidencePack, risk) {
    var count = (risk.evidence_ids || []).filter(Boolean).length;
    if (confidenceForEvidence(evidencePack) === "low") {
      return "unsupported";
    }
    if (count >= 2) {
      return "multi-source";
    }
    if (count === 1) {
      return "single-source";
    }
    return "needs-source";
  }

  function displayEvidenceCoverage(value) {
    if (value === "multi-source") {
      return "Multi-source evidence";
    }
    if (value === "single-source") {
      return "Single-source evidence";
    }
    if (value === "needs-source") {
      return "Needs source-bound evidence";
    }
    if (value === "unsupported") {
      return "Unsupported";
    }
    return "single-source";
  }

  function appetiteAlignment(template, answers) {
    var appetite = cleanText((answers || {}).risk_appetite).toLowerCase();
    if (!appetite) {
      return "Not stated; board should confirm appetite for " + template.appetite_key + " exposure.";
    }
    if (appetite.indexOf("low") !== -1 && ["safety", "compliance", "cyber"].indexOf(template.appetite_key) !== -1) {
      return "Low appetite stated; residual exposure requires named owner and trigger-based reporting.";
    }
    if (appetite.indexOf(template.appetite_key) !== -1) {
      return "Appetite statement mentions " + template.appetite_key + "; align residual target and escalation trigger.";
    }
    return "Appetite statement supplied but not specific to " + template.appetite_key + "; confirm tolerance.";
  }

  function nextReviewDue(index, evidencePack) {
    var date = new Date();
    var days = confidenceForEvidence(evidencePack) === "low" ? 7 : 30 + index * 3;
    date.setDate(date.getDate() + days);
    return date.toISOString().slice(0, 10);
  }

  function riskDescription(company, template, evidencePack) {
    var evidenceIndex = CATEGORIES.indexOf(template.category) % evidencePack.length;
    var evidenceHint = evidencePack[evidenceIndex].claim.replace(/\.$/, "");
    return (
      "Cause: " +
      template.cause +
      ". Evidence signal: " +
      evidenceHint +
      ". Event: " +
      template.event +
      ". Consequence: " +
      template.consequence +
      "."
    );
  }

  function buildQualityReview(assessment) {
    var findings = [];
    var risks = assessment.risk_register || [];
    var realEvidenceCount = countRealEvidenceItems(assessment.evidence_pack || []);
    if (!realEvidenceCount) {
      findings.push("Evidence challenge: no real evidence was supplied; this run is assumption-led and cannot be used without source material.");
    } else if (realEvidenceCount < 3) {
      findings.push("Evidence challenge: fewer than three real evidence items were supplied; ask for more source coverage before relying on priority ranking.");
    } else {
      findings.push("Evidence challenge: evidence exists, but every high residual risk still needs source-specific owner confirmation.");
    }
    if (!(assessment.management_answers || []).length) {
      findings.push("Management challenge: no management answers were supplied; objectives, appetite, incidents, and dependencies should be confirmed.");
    }
    risks
      .filter(function (risk) { return risk.residual_score >= 10; })
      .forEach(function (risk) {
        findings.push(risk.id + " challenge: residual score remains " + risk.residual_score + "; verify treatment capacity, due date, and escalation trigger.");
      });
    risks
      .filter(function (risk) { return risk.evidence_coverage === "unsupported" || risk.evidence_coverage === "needs-source"; })
      .forEach(function (risk) {
        findings.push(risk.id + " evidence gap: risk needs category-relevant source-bound evidence before it can be treated as approved.");
      });
    return {
      findings: findings,
      postmortem_questions: [
        "What early warning was visible before the event, and who saw it?",
        "Which control was assumed to work but had not been proven with current evidence?",
        "Which owner, date, or funding decision was missing when escalation was needed?"
      ],
      quality_rules: [
        "Use cause-event-consequence wording.",
        "Separate existing controls from control gaps and future mitigation actions.",
        "Do not allow residual ratings to exceed inherent ratings.",
        "Flag evidence gaps and management assumptions before board use."
      ]
    };
  }

  function scoreReductionPercent(risk) {
    if (!risk || !risk.inherent_score) {
      return 0;
    }
    return Math.max(0, Math.round(((risk.inherent_score - risk.residual_score) / risk.inherent_score) * 100));
  }

  function appetiteStatusForRisk(risk) {
    var appetite = cleanText(risk.appetite_alignment).toLowerCase();
    if (risk.residual_score >= 10 || appetite.indexOf("low appetite") !== -1) {
      return "Escalate";
    }
    if (risk.residual_score >= 6 || appetite.indexOf("confirm") !== -1) {
      return "Watch";
    }
    return "Inside appetite";
  }

  function countBy(items, fn) {
    return (items || []).reduce(function (acc, item) {
      var key = fn(item);
      acc[key] = (acc[key] || 0) + 1;
      return acc;
    }, {});
  }

  function objectCountsToRows(counts) {
    return Object.keys(counts || {})
      .sort()
      .map(function (key) {
        return { label: key, value: counts[key] };
      });
  }

  function extractDependencyList(assessment) {
    var answer = (assessment.management_answers || []).filter(function (item) {
      return cleanText(item.question).toLowerCase().indexOf("dependencies") !== -1;
    })[0];
    var source = answer ? answer.answer : "";
    var dependencies = source
      .replace(/\band\b/gi, ",")
      .split(/[,;|]/)
      .map(function (item) { return cleanText(item); })
      .filter(Boolean);
    if (!dependencies.length) {
      dependencies = ["Board decision cadence", "Control owner capacity", "Evidence availability", "Treatment funding"];
    }
    return dependencies;
  }

  function buildVisualSummary(assessment) {
    var risks = assessment.risk_register || [];
    var categoryCounts = {};
    risks.forEach(function (risk) {
      categoryCounts[risk.category] = (categoryCounts[risk.category] || 0) + 1;
    });
    var riskMotion = risks.map(function (risk) {
      return {
        id: risk.id,
        title: risk.title,
        category: risk.category,
        inherent_score: risk.inherent_score,
        residual_score: risk.residual_score,
        reduction_percent: scoreReductionPercent(risk),
        residual_band: risk.residual_band,
        velocity: risk.risk_velocity,
        appetite_status: appetiteStatusForRisk(risk),
        owner: risk.owner
      };
    });
    var principalRisks = riskMotion
      .slice()
      .sort(function (a, b) { return b.residual_score - a.residual_score; })
      .filter(function (risk, index) { return risk.residual_score >= 10 || index < 3; })
      .slice(0, 5);
    var risksByOwner = objectCountsToRows(countBy(risks, function (risk) { return risk.owner; }));
    var dependencies = extractDependencyList(assessment);
    return {
      top_residual_risks: risks
        .slice()
        .sort(function (a, b) { return b.residual_score - a.residual_score; })
        .slice(0, 5)
        .map(function (risk) { return { id: risk.id, title: risk.title, score: risk.residual_score, band: bandName(risk.residual_score), coverage: risk.evidence_coverage }; }),
      category_counts: categoryCounts,
      evidence_coverage: {
        real_evidence: countRealEvidenceItems(assessment.evidence_pack || []),
        fallback_evidence: (assessment.evidence_pack || []).length - countRealEvidenceItems(assessment.evidence_pack || [])
      },
      control_effectiveness: risks.reduce(function (acc, risk) {
        acc[risk.control_effectiveness] = (acc[risk.control_effectiveness] || 0) + 1;
        return acc;
      }, {}),
      decision_summary: {
        total_risks: risks.length,
        principal_risks: principalRisks,
        appetite_breaches: riskMotion.filter(function (risk) { return risk.appetite_status === "Escalate"; }),
        decisions_needed: principalRisks.map(function (risk) {
          return risk.id + ": confirm appetite position, owner authority, treatment funding, and escalation trigger.";
        }),
        reviews_due: risks
          .slice()
          .sort(function (a, b) { return String(a.next_review_due).localeCompare(String(b.next_review_due)); })
          .slice(0, 5)
          .map(function (risk) {
            return { id: risk.id, title: risk.title, due: risk.next_review_due, owner: risk.owner };
          }),
        evidence_warnings: risks
          .filter(function (risk) { return risk.evidence_coverage !== "multi-source"; })
          .map(function (risk) {
            return risk.id + ": " + displayEvidenceCoverage(risk.evidence_coverage) + " before board reliance.";
          })
      },
      risk_motion: riskMotion,
      treatment_assurance: {
        action_runway: {
          thirty: risks.map(function (risk) {
            return { id: risk.id, owner: risk.owner, action: (risk.mitigation_actions || [])[0] || "Confirm treatment owner and first action." };
          }),
          sixty: risks.map(function (risk) {
            return { id: risk.id, owner: risk.owner, action: (risk.mitigation_actions || [])[1] || "Test the highest-impact control and record evidence." };
          }),
          ninety: risks.map(function (risk) {
            return { id: risk.id, owner: risk.owner, action: "Re-score residual exposure and close or escalate evidence gaps." };
          })
        },
        owner_workload: risksByOwner,
        control_gap_total: risks.reduce(function (total, risk) { return total + (risk.control_gaps || []).length; }, 0),
        control_gap_rows: risks.map(function (risk) {
          return { id: risk.id, title: risk.title, controls: (risk.existing_controls || []).length, gaps: (risk.control_gaps || []).length, effectiveness: risk.control_effectiveness };
        })
      },
      evidence_intelligence: {
        coverage_mix: objectCountsToRows(countBy(risks, function (risk) { return displayEvidenceCoverage(risk.evidence_coverage); })),
        confidence_counts: objectCountsToRows(countBy(risks, function (risk) { return risk.confidence; })),
        coverage_rows: risks.map(function (risk) {
          return { id: risk.id, title: risk.title, coverage: displayEvidenceCoverage(risk.evidence_coverage), evidence_ids: risk.evidence_ids.slice(), confidence: risk.confidence };
        }),
        open_requests: risks.map(function (risk) {
          return {
            id: risk.id,
            title: risk.title,
            requests: ((risk.supporting_analysis || {}).open_evidence_requests || []).slice(0, 3)
          };
        }),
        source_counts: {
          real_evidence: countRealEvidenceItems(assessment.evidence_pack || []),
          fallback_evidence: (assessment.evidence_pack || []).length - countRealEvidenceItems(assessment.evidence_pack || [])
        }
      },
      kri_watchlist: risks.map(function (risk) {
        return {
          id: risk.id,
          title: risk.title,
          kri: risk.kri,
          early_warning: risk.early_warning,
          velocity: risk.risk_velocity,
          escalation: risk.residual_score >= 10 ? "Board escalation trigger" : "Management watch trigger"
        };
      }),
      dependency_scenarios: {
        dependencies: dependencies,
        scenario_cards: risks.map(function (risk, index) {
          return {
            id: risk.id,
            title: risk.title,
            dependency: dependencies[index % dependencies.length],
            first_failure_signal: risk.early_warning,
            red_team: risk.red_team_challenge,
            postmortem: risk.postmortem_scenario
          };
        })
      }
    };
  }

  function findByIds(items, ids) {
    var wanted = {};
    (ids || []).forEach(function (id) {
      wanted[id] = true;
    });
    return (items || []).filter(function (item) {
      return wanted[item.id];
    });
  }

  function formatEvidenceReference(item) {
    if (!item) {
      return "No evidence reference supplied.";
    }
    return item.id + " - " + item.claim + " (" + (item.source || item.path || "source") + (item.line_number ? ", line " + item.line_number : "") + ")";
  }

  function formatManagementReference(item) {
    if (!item) {
      return "No management answer supplied.";
    }
    return item.id + " - " + item.question + ": " + item.answer;
  }

  function buildSupportingAnalysis(template, evidencePack, managementAnswers, evidenceIdList, managementIdList, inherentScore, residualScore) {
    var evidenceItems = findByIds(evidencePack, evidenceIdList);
    var managementItems = findByIds(managementAnswers, managementIdList);
    var primaryEvidence = evidenceItems[0];
    var secondEvidence = evidenceItems[1];
    var evidenceSummary = evidenceItems.map(formatEvidenceReference);
    if (!evidenceSummary.length) {
      evidenceSummary.push("No category-relevant evidence was found; gate should remain REVISE until supplied.");
    }
    return {
      evidence_interpretation: [
        "Primary evidence signal: " + formatEvidenceReference(primaryEvidence),
        "Secondary evidence signal: " + formatEvidenceReference(secondEvidence),
        "The evidence is relevant because it contains category-specific terms tied to " + template.category + " exposure.",
        "The evidence should be treated as directional until source owner, date, and completeness are confirmed.",
        "Evidence limitation: this browser run can only evaluate supplied text snippets, not the full external record unless imported."
      ],
      management_assumptions: [
        managementItems.length ? "Management references: " + managementItems.map(formatManagementReference).join(" | ") : "No direct management answer was mapped; confirm objective, appetite, incidents, and dependency context.",
        "Assumption: the owner role listed has authority to assign actions and escalate exceptions.",
        "Assumption: the supplied evidence is current enough for the next review cycle.",
        "Assumption: residual scores reflect controls operating as described, not merely planned controls.",
        "Assumption: risk appetite remains unchanged until management updates it."
      ],
      score_support: [
        "Inherent score " + inherentScore + " reflects likelihood " + template.likelihood + " x impact " + template.impact + ".",
        "Residual score " + residualScore + " reflects likelihood " + template.residual_likelihood + " x impact " + template.residual_impact + ".",
        "Residual reduction is only credible if existing controls are operating and the mitigation workplan is funded.",
        "If evidence is stale, incomplete, or contradicted by management, move confidence down and re-score.",
        "If a control gap has no owner or due date, residual likelihood should not be reduced."
      ],
      control_assurance_plan: [
        "Confirm each existing control has a named control owner and a current evidence artifact.",
        "Sample the evidence trail for the highest-impact control before board reporting.",
        "Check whether the control prevents the event, detects it early, or only responds after impact.",
        "Verify control cadence matches the risk velocity of " + template.risk_velocity + ".",
        "Record test result, exception owner, corrective action, and next test date."
      ],
      mitigation_workplan: [
        template.mitigation_actions[0],
        template.mitigation_actions[1],
        "Add a dated action log with accountable owner, decision needed, dependency, and blocker status.",
        "Define the trigger that escalates this risk from management review to board attention.",
        "Confirm whether the treatment type is still appropriate: " + template.treatment_type + ".",
        "Identify budget, contract, people, or technology constraints that could prevent treatment completion."
      ],
      monitoring_plan: [
        "Track KRI: " + template.kri + ".",
        "Track early warning: " + template.early_warning + ".",
        "Review frequency should increase if the KRI moves adversely for two consecutive cycles.",
        "Archive evidence snapshots so trend movement can be audited later.",
        "Tie each KRI breach to an owner action rather than a narrative status note."
      ],
      board_questions: [
        "What decision is required now to keep the residual risk inside appetite?",
        "Which evidence item would change the score most if it were wrong?",
        "Which control is assumed to be effective but has not been independently tested?",
        "What is the consequence of waiting one more review cycle?",
        "Who owns the next action, what is the due date, and what blocker would trigger escalation?",
        "What information would a skeptical director ask for before accepting this residual score?"
      ],
      red_team_tests: [
        template.red_team_challenge,
        "Try to disprove the score using stale evidence, missing evidence, or a contradictory management answer.",
        "Ask whether the treatment action is measurable or just a management activity.",
        "Look for hidden dependencies outside the named owner role.",
        "Check whether the KRI would move early enough to prevent the event."
      ],
      postmortem_chain: [
        template.postmortem_scenario,
        "Missed signal: the early warning was present but not escalated to the right decision forum.",
        "Failed control: an existing control existed on paper but was not proven under current conditions.",
        "Decision gap: ownership, budget, timing, or authority was unclear when action was needed.",
        "Evidence gap: the source record did not show whether treatment actions were completed and effective."
      ],
      open_evidence_requests: evidenceSummary.concat([
        "Request a current owner-confirmed artifact for the leading KRI.",
        "Request evidence that the mitigation action has a due date and closure proof.",
        "Request confirmation that residual risk is inside or outside stated appetite."
      ])
    };
  }

  function buildBoardReport(profile, risks) {
    var topRisks = risks
      .slice()
      .sort(function (a, b) {
        return b.residual_score - a.residual_score;
      })
      .slice(0, 3);
    return {
      headline: profile.company + " risk assessment",
      summary:
        profile.company +
        " has a concentrated risk profile shaped by the current evidence pack. The strongest residual risks should be managed through named ownership, source refresh, early-warning triggers, and explicit treatment decisions.",
      top_risks: topRisks.map(function (risk) {
        return risk.id + " " + risk.title + " (" + risk.residual_score + " residual)";
      }),
      decisions_required: [
        "Confirm risk appetite for schedule, safety, compliance, and funding exposure.",
        "Confirm which assumptions are management-owned versus publicly evidenced.",
        "Assign owners, due dates, and escalation triggers for every high or extreme residual risk.",
        "Challenge whether the listed controls are proven, current, and effective under the stated scenario."
      ],
      limitations: [
        "This browser run uses typed and imported evidence only.",
        "Private GitHub imports use a token only for the current fetch request.",
        "Use the prompt pack for live research and source-bound LLM enrichment.",
        "Risk scoring is deterministic and should be reviewed by accountable management before use."
      ]
    };
  }

  function buildStandardsAnnex(profile, risks) {
    return {
      title: profile.company + " Draft standards mapping",
      iso_31000: [
        { clause: "5.4 Leadership and commitment", how: "Draft support: named owners and board decisions are captured for material risks; final conformance is conditional on accountable review." },
        { clause: "6.3 Risk criteria", how: "Draft support: likelihood, impact, appetite alignment, confidence, and residual scoring rules are explicit." },
        { clause: "6.4 Risk assessment", how: "Draft support: " + risks.length + " candidate risks are identified, analyzed, evaluated, and worded as cause-event-consequence scenarios." },
        { clause: "6.5 Risk treatment", how: "Draft support: each candidate risk includes existing controls, control gaps, mitigation actions, owner, KRI, and review date." },
        { clause: "6.7 Recording and reporting", how: "Draft support: evidence IDs, management assumptions, quality findings, and downloadable records remain visible." }
      ],
      coso_erm: [
        { component: "Governance & Culture", how: "Risk owners and appetite decisions are surfaced." },
        { component: "Strategy & Objective-Setting", how: "Management objectives are preserved as answer IDs." },
        { component: "Performance", how: "Risks include KRIs, controls, and residual ratings." },
        { component: "Review & Revision", how: "The review gate blocks unsupported or inconsistent risks." },
        { component: "Information, Communication & Reporting", how: "Outputs include JSON, board Markdown, CSV, and heat map." }
      ],
      nist_sp_800_30: [
        { concept: "Risk model", how: "Risk rows explicitly separate threat-style event, vulnerability/control gap, likelihood, impact, residual risk, and uncertainty." },
        { concept: "Monitoring", how: "Each risk includes KRI, early warning, review due date, and quality challenges." }
      ],
      orange_book: [
        { concept: "Risk appetite", how: "Appetite alignment is called out for each risk instead of assumed." },
        { concept: "Constructive challenge", how: "Red-team challenge and postmortem scenario fields are included for every risk." },
        { concept: "Useful reporting", how: "Top residual risks, evidence coverage, controls, gaps, and mitigation actions are visible in the board pack." }
      ]
    };
  }

  function validateAssessment(assessment) {
    var errors = [];
    var risks = assessment.risk_register || [];
    var evidencePack = assessment.evidence_pack || [];
    var realEvidence = evidencePack.filter(function (item) {
      return item.source_type !== "fallback";
    });
    if (!realEvidence.length) {
      errors.push("At least one evidence note or imported evidence file is required before this can be treated as usable.");
    }
    if (risks.length < CATEGORIES.length) {
      errors.push("Risk register must include at least six risks.");
    }
    CATEGORIES.forEach(function (category) {
      if (!risks.some(function (risk) { return risk.category === category; })) {
        errors.push("Missing category: " + category);
      }
    });
    var seen = {};
    risks.forEach(function (risk) {
      if (seen[risk.id]) {
        errors.push("Duplicate risk ID: " + risk.id);
      }
      seen[risk.id] = true;
      if (!risk.evidence_ids.length && !risk.management_answer_ids.length) {
        errors.push(risk.id + " lacks evidence or management answer IDs.");
      }
      if (!risk.evidence_ids.length) {
        errors.push(risk.id + " lacks category-relevant source-bound evidence.");
      }
      if (!risk.cause || !risk.risk_event || !risk.consequence) {
        errors.push(risk.id + " must use cause-event-consequence wording.");
      }
      if (!risk.existing_controls || risk.existing_controls.length < 2) {
        errors.push(risk.id + " needs at least two existing controls.");
      }
      if (!risk.control_gaps || !risk.control_gaps.length) {
        errors.push(risk.id + " needs at least one control gap.");
      }
      if (!risk.mitigation_actions || risk.mitigation_actions.length < 2) {
        errors.push(risk.id + " needs at least two mitigation actions.");
      }
      if (!risk.red_team_challenge || !risk.postmortem_scenario) {
        errors.push(risk.id + " needs red-team and postmortem challenge text.");
      }
      if (risk.evidence_coverage === "needs-source" || risk.evidence_coverage === "unsupported") {
        errors.push(risk.id + " needs source-bound evidence before it can be treated as approved.");
      }
      if (risk.residual_likelihood > risk.likelihood || risk.residual_impact > risk.impact || risk.residual_score > risk.inherent_score) {
        errors.push(risk.id + " residual score exceeds inherent score.");
      }
    });
    return errors;
  }

  function countRealEvidence(assessment) {
    return countRealEvidenceItems(assessment.evidence_pack || []);
  }

  function buildAssessment(input) {
    var payload = input || {};
    var company = cleanText(payload.company) || "Unnamed company";
    var evidencePack = normalizeEvidence(payload);
    var managementAnswers = normalizeAnswers(payload.answers || {});
    var profile = {
      company: company,
      country: cleanText(payload.country),
      website: cleanText(payload.website),
      current_state: evidencePack[0].claim,
      assessment_mode: "browser evidence-first generation"
    };
    var risks = RISK_TEMPLATES.map(function (template, index) {
      var selectedEvidenceIds = evidenceIdsForCategory(evidencePack, template.category, 2);
      var selectedManagementIds = managementIdsForTemplate(managementAnswers, template);
      var inherentScore = score(template.likelihood, template.impact);
      var residualScore = score(template.residual_likelihood, template.residual_impact);
      var effectiveness = residualScore <= Math.floor(inherentScore * 0.55) ? "Effective" : "Partially effective";
      var supportingAnalysis = buildSupportingAnalysis(
        template,
        evidencePack,
        managementAnswers,
        selectedEvidenceIds,
        selectedManagementIds,
        inherentScore,
        residualScore
      );
      return {
        id: "R-" + String(index + 1).padStart(2, "0"),
        category: template.category,
        title: template.title,
        cause: template.cause,
        risk_event: template.event,
        consequence: template.consequence,
        description: riskDescription(company, template, evidencePack),
        evidence_ids: selectedEvidenceIds,
        management_answer_ids: selectedManagementIds,
        likelihood: template.likelihood,
        impact: template.impact,
        inherent_score: inherentScore,
        inherent_band: bandName(inherentScore),
        score_rationale:
          template.category +
          " scoring reflects the supplied evidence, current lifecycle, and board-level impact if " +
          template.title.toLowerCase() +
          " materializes.",
        existing_controls: template.existing_controls.slice(),
        controls: template.existing_controls.slice(),
        control_effectiveness: effectiveness,
        control_gaps: template.control_gaps.slice(),
        residual_likelihood: template.residual_likelihood,
        residual_impact: template.residual_impact,
        residual_score: residualScore,
        residual_band: bandName(residualScore),
        owner: template.owner,
        treatment: template.treatment,
        treatment_type: template.treatment_type,
        mitigation_actions: template.mitigation_actions.slice(),
        kri: template.kri,
        early_warning: template.early_warning,
        risk_velocity: template.risk_velocity,
        appetite_alignment: appetiteAlignment(template, payload.answers || {}),
        red_team_challenge: template.red_team_challenge,
        postmortem_scenario: template.postmortem_scenario,
        next_review_due: nextReviewDue(index, evidencePack),
        evidence_coverage: evidenceCoverage(evidencePack, { evidence_ids: selectedEvidenceIds }),
        confidence: confidenceForEvidence(evidencePack),
        supporting_analysis: supportingAnalysis
      };
    });
    var assessment = {
      profile: profile,
      evidence_pack: evidencePack,
      management_answers: managementAnswers,
      scoring_rubric: {
        likelihood: {
          "1": "rare under current operating conditions",
          "3": "credible within the planning horizon",
          "5": "expected or already emerging"
        },
        impact: {
          "1": "localized inconvenience",
          "3": "material management attention",
          "5": "board-level schedule, safety, financial, or compliance impact"
        },
        rule: "Residual likelihood and impact must not exceed inherent ratings."
      },
      risk_register: risks
    };
    assessment.board_report = buildBoardReport(profile, risks);
    assessment.standards_annex = buildStandardsAnnex(profile, risks);
    assessment.quality_review = buildQualityReview(assessment);
    assessment.visuals = buildVisualSummary(assessment);
    var errors = validateAssessment(assessment);
    assessment.review_gate = {
      verdict: errors.length ? "revise" : "pass",
      errors: errors,
      checks: [
        "risks cite category-relevant source-bound evidence",
        "residual scores do not exceed inherent scores",
        "risk IDs are unique",
        "all six target categories are present",
        "at least one non-fallback evidence item is present",
        "failed-gate outputs are blocked from download"
      ]
    };
    return assessment;
  }

  function parseGitHubUrl(value) {
    var url = new URL(value);
    if (url.hostname === "github.com") {
      var parts = url.pathname.split("/").filter(Boolean);
      var blobIndex = parts.indexOf("blob");
      if (parts.length >= 5 && blobIndex === 2) {
        return {
          owner: parts[0],
          repo: parts[1],
          ref: parts[3],
          path: parts.slice(4).join("/")
        };
      }
    }
    if (url.hostname === "raw.githubusercontent.com") {
      var rawParts = url.pathname.split("/").filter(Boolean);
      if (rawParts.length >= 4) {
        return {
          owner: rawParts[0],
          repo: rawParts[1],
          ref: rawParts[2],
          path: rawParts.slice(3).join("/")
        };
      }
    }
    throw new Error("Use a GitHub blob URL or raw.githubusercontent.com URL.");
  }

  function encodePath(path) {
    return String(path || "")
      .split("/")
      .map(encodeURIComponent)
      .join("/");
  }

  function looksTextLike(path) {
    var lower = String(path || "").toLowerCase();
    var filename = lower.split("/").pop();
    if (["readme", "license", "notice", "changelog", "authors", "contributors"].indexOf(filename) !== -1) {
      return true;
    }
    return TEXT_EXTENSIONS.some(function (extension) {
      return lower.endsWith(extension);
    });
  }

  function decodeBase64Utf8(value) {
    var binary = atob(String(value || "").replace(/\n/g, ""));
    var bytes = new Uint8Array(binary.length);
    for (var index = 0; index < binary.length; index += 1) {
      bytes[index] = binary.charCodeAt(index);
    }
    return new TextDecoder("utf-8", { fatal: false }).decode(bytes);
  }

  async function importGitHubPath(options, fetchImpl, depth) {
    var config = options || {};
    var path = cleanText(config.path);
    if (!config.owner || !config.repo || !path) {
      throw new Error("GitHub owner, repo, and path are required.");
    }
    var fetcher = fetchImpl || global.fetch;
    if (!fetcher) {
      throw new Error("Fetch is not available in this browser.");
    }
    var headers = { Accept: "application/vnd.github.raw" };
    if (config.token) {
      headers.Authorization = "Bearer " + config.token;
    }
    var url =
      "https://api.github.com/repos/" +
      encodeURIComponent(config.owner) +
      "/" +
      encodeURIComponent(config.repo) +
      "/contents/" +
      encodePath(path) +
      "?ref=" +
      encodeURIComponent(config.ref || "main");
    var response = await fetcher(url, { headers: headers });
    if (!response.ok) {
      throw new Error("GitHub import failed with HTTP " + response.status + ".");
    }
    var contentType = (response.headers && response.headers.get && response.headers.get("content-type")) || "";
    var declaredLength = Number((response.headers && response.headers.get && response.headers.get("content-length")) || 0);
    if (declaredLength > MAX_GITHUB_FILE_BYTES) {
      throw new Error("GitHub file is too large for browser import. Keep files under 900 KB.");
    }
    var bodyText = await response.text();
    if (bodyText.length > MAX_GITHUB_FILE_BYTES) {
      throw new Error("GitHub file is too large for browser import. Keep files under 900 KB.");
    }
    if (contentType.indexOf("application/json") !== -1) {
      var json = null;
      try {
        json = JSON.parse(bodyText);
      } catch (error) {
        json = null;
      }
      if (Array.isArray(json)) {
        var collected = [];
        if ((depth || 0) >= 2) {
          return collected;
        }
        var candidates = json.filter(function (item) {
          return item.type === "file" && looksTextLike(item.path);
        }).slice(0, MAX_GITHUB_IMPORT_FILES);
        for (var index = 0; index < candidates.length; index += 1) {
          var item = candidates[index];
          var childItems = await importGitHubPath(
            Object.assign({}, config, { path: item.path }),
            fetcher,
            (depth || 0) + 1
          );
          collected = collected.concat(childItems);
        }
        return collected;
      }
      if (json && json.content && json.encoding === "base64") {
        var decoded = decodeBase64Utf8(json.content);
        if (decoded.length > MAX_GITHUB_FILE_BYTES) {
          throw new Error("GitHub file is too large for browser import. Keep files under 900 KB.");
        }
        return [
          {
            name: "github:" + path,
            text: decoded,
            source_type: "github",
            repo: config.owner + "/" + config.repo,
            ref: config.ref || "main",
            path: path,
            url: "https://github.com/" + config.owner + "/" + config.repo + "/blob/" + (config.ref || "main") + "/" + path,
            retrieved_at: new Date().toISOString()
          }
        ];
      }
    }
    if (!looksTextLike(path)) {
      throw new Error("Only text-like files can be imported into the browser app.");
    }
    return [
      {
        name: "github:" + path,
        text: bodyText,
        source_type: "github",
        repo: config.owner + "/" + config.repo,
        ref: config.ref || "main",
        path: path,
        url: "https://github.com/" + config.owner + "/" + config.repo + "/blob/" + (config.ref || "main") + "/" + path,
        retrieved_at: new Date().toISOString()
      }
    ];
  }

  function toRiskCsv(assessment) {
    var headers = [
      "Company",
      "Risk ID",
      "Category",
      "Title",
      "Cause",
      "Risk Event",
      "Consequence",
      "Description",
      "Evidence IDs",
      "Management Answer IDs",
      "Likelihood",
      "Impact",
      "Inherent Score",
      "Inherent Band",
      "Residual Likelihood",
      "Residual Impact",
      "Residual Score",
      "Residual Band",
      "Owner",
      "Existing Controls",
      "Control Effectiveness",
      "Control Gaps",
      "Treatment",
      "Treatment Type",
      "Mitigation Actions",
      "KRI",
      "Early Warning",
      "Risk Velocity",
      "Appetite Alignment",
      "Red Team Challenge",
      "Postmortem Scenario",
      "Next Review Due",
      "Evidence Coverage",
      "Confidence"
    ];
    var rows = (assessment.risk_register || []).map(function (risk) {
      return [
        assessment.profile && assessment.profile.company,
        risk.id,
        risk.category,
        risk.title,
        risk.cause,
        risk.risk_event,
        risk.consequence,
        risk.description,
        risk.evidence_ids.join(" "),
        risk.management_answer_ids.join(" "),
        risk.likelihood,
        risk.impact,
        risk.inherent_score,
        risk.inherent_band,
        risk.residual_likelihood,
        risk.residual_impact,
        risk.residual_score,
        risk.residual_band,
        risk.owner,
        (risk.existing_controls || []).join(" | "),
        risk.control_effectiveness,
        (risk.control_gaps || []).join(" | "),
        risk.treatment,
        risk.treatment_type,
        (risk.mitigation_actions || []).join(" | "),
        risk.kri,
        risk.early_warning,
        risk.risk_velocity,
        risk.appetite_alignment,
        risk.red_team_challenge,
        risk.postmortem_scenario,
        risk.next_review_due,
        risk.evidence_coverage,
        risk.confidence
      ].map(safeCsvCell).join(",");
    });
    return [headers.join(",")].concat(rows).join("\n") + "\n";
  }

  function toRiskRegisterJson(assessment) {
    return JSON.stringify({ risks: assessment.risk_register || [] }, null, 2) + "\n";
  }

  function toEvidencePackJson(assessment) {
    return JSON.stringify({ evidence: assessment.evidence_pack || [] }, null, 2) + "\n";
  }

  function addMarkdownList(lines, items) {
    (items || []).forEach(function (item) {
      lines.push("- " + neutralizeMarkdown(item));
    });
  }

  function addNumberedMarkdownList(lines, items) {
    (items || []).forEach(function (item, index) {
      lines.push(String(index + 1) + ". " + neutralizeMarkdown(item));
    });
  }

  function addRiskDeepDive(lines, risk, index) {
    var support = risk.supporting_analysis || {};
    lines.push("### " + neutralizeMarkdown(risk.id + " " + risk.title));
    lines.push("");
    lines.push("**Category:** " + neutralizeMarkdown(risk.category));
    lines.push("**Owner:** " + neutralizeMarkdown(risk.owner));
    lines.push("**Risk velocity:** " + neutralizeMarkdown(risk.risk_velocity));
    lines.push("**Confidence:** " + neutralizeMarkdown(risk.confidence));
    lines.push("**Evidence coverage:** " + neutralizeMarkdown(displayEvidenceCoverage(risk.evidence_coverage)));
    lines.push("**Inherent score:** " + neutralizeMarkdown(String(risk.inherent_score)) + " (" + neutralizeMarkdown(risk.inherent_band) + ")");
    lines.push("**Residual score:** " + neutralizeMarkdown(String(risk.residual_score)) + " (" + neutralizeMarkdown(risk.residual_band) + ")");
    lines.push("");
    lines.push("#### Cause, Event, Consequence");
    lines.push("");
    lines.push("- Cause: " + neutralizeMarkdown(risk.cause));
    lines.push("- Event: " + neutralizeMarkdown(risk.risk_event));
    lines.push("- Consequence: " + neutralizeMarkdown(risk.consequence));
    lines.push("");
    lines.push("#### Evidence Interpretation");
    lines.push("");
    addMarkdownList(lines, support.evidence_interpretation);
    lines.push("");
    lines.push("#### Management Assumptions");
    lines.push("");
    addMarkdownList(lines, support.management_assumptions);
    lines.push("");
    lines.push("#### Scoring Rationale");
    lines.push("");
    addMarkdownList(lines, support.score_support);
    lines.push("");
    lines.push("#### Existing Controls");
    lines.push("");
    addMarkdownList(lines, risk.existing_controls);
    lines.push("");
    lines.push("#### Control Gaps");
    lines.push("");
    addMarkdownList(lines, risk.control_gaps);
    lines.push("");
    lines.push("#### Control Assurance Plan");
    lines.push("");
    addNumberedMarkdownList(lines, support.control_assurance_plan);
    lines.push("");
    lines.push("#### Mitigation Actions");
    lines.push("");
    addNumberedMarkdownList(lines, risk.mitigation_actions);
    lines.push("");
    lines.push("#### 30 / 60 / 90 Day Workplan");
    lines.push("");
    addNumberedMarkdownList(lines, support.mitigation_workplan);
    lines.push("");
    lines.push("#### Monitoring Plan");
    lines.push("");
    addMarkdownList(lines, support.monitoring_plan);
    lines.push("");
    lines.push("#### Board Questions");
    lines.push("");
    addNumberedMarkdownList(lines, support.board_questions);
    lines.push("");
    lines.push("#### Red Team Tests");
    lines.push("");
    addNumberedMarkdownList(lines, support.red_team_tests);
    lines.push("");
    lines.push("#### Postmortem Chain");
    lines.push("");
    addNumberedMarkdownList(lines, support.postmortem_chain);
    lines.push("");
    lines.push("#### Open Evidence Requests");
    lines.push("");
    addMarkdownList(lines, support.open_evidence_requests);
    lines.push("");
    lines.push("#### Draft Acceptance Criteria");
    lines.push("");
    lines.push("- Evidence IDs are current, traceable, and category relevant.");
    lines.push("- Owner accepts the action plan and can fund or escalate the work.");
    lines.push("- Residual score remains inside stated appetite or is explicitly escalated.");
    lines.push("- Next review date is set and tied to the KRI.");
    lines.push("- Board decision, if needed, is written as an explicit ask.");
    lines.push("");
    lines.push("#### Analyst Note");
    lines.push("");
    lines.push("This is candidate risk " + neutralizeMarkdown(String(index + 1)) + " of the register. Treat the narrative as a source-bound draft: useful for review, but not final until management confirms the evidence, score, and workplan.");
    lines.push("");
  }

  function toBoardMarkdown(assessment) {
    var report = assessment.board_report;
    var risks = assessment.risk_register || [];
    var lines = [];
    lines.push("# " + neutralizeMarkdown(report.headline));
    lines.push("");
    lines.push("## Executive Summary");
    lines.push("");
    lines.push(neutralizeMarkdown(report.summary));
    lines.push("");
    lines.push("This board pack is intentionally detailed. It is designed to make evidence, assumptions, confidence, treatment work, and challenge questions visible before any risk is accepted as management-ready.");
    lines.push("");
    lines.push("## Register Snapshot");
    lines.push("");
    lines.push("- Company: " + neutralizeMarkdown(assessment.profile.company));
    lines.push("- Country or market: " + neutralizeMarkdown(assessment.profile.country || "not supplied"));
    lines.push("- Website/reference: " + neutralizeMarkdown(assessment.profile.website || "not supplied"));
    lines.push("- Evidence items: " + neutralizeMarkdown(String((assessment.evidence_pack || []).length)));
    lines.push("- Real evidence items: " + neutralizeMarkdown(String(countRealEvidence(assessment))));
    lines.push("- Risks generated: " + neutralizeMarkdown(String(risks.length)));
    lines.push("- Review gate: " + neutralizeMarkdown(assessment.review_gate.verdict.toUpperCase()));
    lines.push("");
    lines.push("## Top Risks");
    lines.push("");
    risks.forEach(function (risk) {
      lines.push("- **" + neutralizeMarkdown(risk.id + " " + risk.title) + "**: " + neutralizeMarkdown(risk.category) + ", residual " + neutralizeMarkdown(String(risk.residual_score)) + ", owner " + neutralizeMarkdown(risk.owner) + ", evidence " + neutralizeMarkdown(displayEvidenceCoverage(risk.evidence_coverage)) + ".");
    });
    lines.push("");
    lines.push("## Decisions Required");
    lines.push("");
    addMarkdownList(lines, report.decisions_required);
    lines.push("");
    lines.push("## Risk Deep Dives");
    lines.push("");
    risks.forEach(function (risk, index) {
      addRiskDeepDive(lines, risk, index);
    });
    lines.push("## Cross-Risk Themes");
    lines.push("");
    lines.push("- Schedule, commissioning, safety, compliance, cyber/OT, and funding risks interact; do not review them only as isolated rows.");
    lines.push("- Evidence quality is as important as score quality. A high score with weak evidence should trigger source collection, not false certainty.");
    lines.push("- Controls should be tested against current project conditions, not accepted because they exist in a plan.");
    lines.push("- Mitigation actions should have owners, due dates, evidence of completion, and escalation triggers.");
    lines.push("- Board reporting should separate decisions, watch items, and management follow-up.");
    lines.push("");
    lines.push("## Limitations");
    lines.push("");
    addMarkdownList(lines, report.limitations);
    lines.push("");
    return lines.join("\n") + "\n";
  }

  function toDetailedAnalysisMarkdown(assessment) {
    var risks = assessment.risk_register || [];
    var lines = [];
    lines.push("# " + neutralizeMarkdown(assessment.profile.company) + " Detailed Risk Analysis");
    lines.push("");
    lines.push("## Purpose");
    lines.push("");
    lines.push("This file is the long-form working analysis behind the risk register. It is intentionally verbose so reviewers can inspect evidence, assumptions, controls, scoring, treatment work, open questions, and failure modes without relying on terse spreadsheet cells.");
    lines.push("");
    lines.push("## Evidence Pack Summary");
    lines.push("");
    (assessment.evidence_pack || []).forEach(function (item) {
      lines.push("- " + neutralizeMarkdown(formatEvidenceReference(item)) + " / confidence " + neutralizeMarkdown(item.confidence || ""));
    });
    lines.push("");
    lines.push("## Management Answer Summary");
    lines.push("");
    if ((assessment.management_answers || []).length) {
      (assessment.management_answers || []).forEach(function (item) {
        lines.push("- " + neutralizeMarkdown(formatManagementReference(item)));
      });
    } else {
      lines.push("- No management answers were supplied.");
    }
    lines.push("");
    lines.push("## Method");
    lines.push("");
    lines.push("1. Normalize supplied evidence into evidence IDs.");
    lines.push("2. Map evidence to risk categories using category-relevant signals.");
    lines.push("3. Generate candidate risks only when evidence supports the category.");
    lines.push("4. Keep management answers separate from evidence but visible as assumptions.");
    lines.push("5. Attach controls, gaps, mitigations, KRIs, early warnings, and owner roles.");
    lines.push("6. Challenge every risk with red-team and postmortem questions.");
    lines.push("7. Block downloads when the review gate is marked REVISE.");
    lines.push("");
    lines.push("## Detailed Risk Sections");
    lines.push("");
    risks.forEach(function (risk, index) {
      addRiskDeepDive(lines, risk, index);
      lines.push("#### Extra Reviewer Checklist");
      lines.push("");
      lines.push("- Has the risk owner accepted the cause-event-consequence wording?");
      lines.push("- Is every evidence item current, source-bound, and specific enough?");
      lines.push("- Does the score change if the strongest evidence item is removed?");
      lines.push("- Are controls independently testable?");
      lines.push("- Are mitigations written as deliverables rather than intentions?");
      lines.push("- Would a board member understand the decision needed from this narrative?");
      lines.push("");
    });
    lines.push("## Register-Level Follow-Up");
    lines.push("");
    lines.push("- Confirm whether any category should be split into multiple risks because the evidence points to distinct causes.");
    lines.push("- Confirm whether residual risk bands match appetite after mitigation, not before mitigation.");
    lines.push("- Confirm whether each owner can act without waiting for a separate governance approval.");
    lines.push("- Confirm whether any key evidence is absent because it sits in a private repo, filing, contract, or operational tracker.");
    lines.push("- Confirm whether the board pack should separate urgent decisions from monitoring items.");
    lines.push("");
    return lines.join("\n") + "\n";
  }

  function toStandardsMarkdown(assessment) {
    var annex = assessment.standards_annex;
    var lines = [];
    lines.push("# " + neutralizeMarkdown(annex.title));
    lines.push("");
    lines.push("This is a draft standards mapping, not a certification or conformance claim. It explains how the browser workbench supports risk-management practices and where management confirmation is still required.");
    lines.push("");
    [
      { title: "ISO 31000", items: annex.iso_31000, key: "clause" },
      { title: "COSO ERM", items: annex.coso_erm, key: "component" },
      { title: "NIST SP 800-30", items: annex.nist_sp_800_30, key: "concept" },
      { title: "Orange Book", items: annex.orange_book, key: "concept" }
    ].forEach(function (section) {
      lines.push("## " + section.title);
      lines.push("");
      (section.items || []).forEach(function (item) {
        lines.push("### " + neutralizeMarkdown(item[section.key]));
        lines.push("");
        lines.push("- Mapping: " + neutralizeMarkdown(item.how));
        lines.push("- Evidence in this run: risk IDs, evidence IDs, management answers, review gate status, and supporting analysis are preserved in downloadable artifacts.");
        lines.push("- Management confirmation needed: confirm source completeness, owner accountability, scoring, and action status before relying on this as a formal record.");
        lines.push("- Audit note: retain the generated JSON and evidence pack with the board report so future reviewers can reproduce the draft basis.");
        lines.push("- Improvement note: if review finds weak evidence, rerun the workbench after importing the missing source file or GitHub path.");
        lines.push("");
      });
    });
    lines.push("## Risk-by-Risk Standards Crosswalk");
    lines.push("");
    (assessment.risk_register || []).forEach(function (risk) {
      lines.push("### " + neutralizeMarkdown(risk.id + " " + risk.title));
      lines.push("");
      lines.push("- ISO 31000 assessment support: cause-event-consequence wording, criteria, treatment, monitoring, and reporting are visible.");
      lines.push("- COSO support: owner, appetite alignment, performance impact, review question, and communication artifact are visible.");
      lines.push("- NIST support: likelihood, impact, vulnerability/control gap, monitoring factor, and uncertainty are visible.");
      lines.push("- Orange Book support: risk appetite, challenge, reporting, owner, and escalation question are visible.");
      lines.push("- Conditionality: this row remains a draft until management validates evidence and action ownership.");
      lines.push("");
    });
    return lines.join("\n") + "\n";
  }

  function toHeatMapHtml(assessment) {
    return (
      "<!doctype html>\n<html lang=\"en\">\n<head>\n<meta charset=\"utf-8\">\n<title>Residual Risk Heat Map</title>\n<style>body{font-family:Arial,sans-serif;margin:32px;color:#1f2933}table{border-collapse:collapse;width:100%;max-width:900px}th,td{border:1px solid #fff;min-width:120px;height:78px;padding:8px;vertical-align:top}th{background:#25313d;color:#fff}.low{background:#2e7d32;color:#fff}.medium{background:#f9a825;color:#111}.high{background:#ef6c00;color:#fff}.extreme{background:#c62828;color:#fff}span{display:block;font-weight:700;margin-bottom:4px}</style>\n</head>\n<body>\n<h1>Residual Risk Heat Map</h1>\n" +
      "<h2>Inherent Heat Map</h2>\n" +
      renderHeatMap(assessment, "inherent") +
      "\n<h2>Residual Heat Map</h2>\n" +
      renderHeatMap(assessment, "residual") +
      "\n</body>\n</html>\n"
    );
  }

  function toPromptPackMarkdown() {
    return [
      "# Risk Workbench Prompt Pack",
      "",
      "Use this prompt pack when a human wants an AI model to enrich the browser-generated draft with current, source-bound research. Every prompt is written to prevent unsupported invention.",
      "",
      "## Research Planner",
      "Plan targeted searches for current state, footprint, recent developments, regulatory constraints, peer disclosed risks, and evidence gaps.",
      "",
      "Required output:",
      "- Research objective.",
      "- Source classes to inspect.",
      "- Search terms by risk category.",
      "- Expected evidence artifacts.",
      "- Known blind spots.",
      "- Stop rule for insufficient evidence.",
      "",
      "Search categories:",
      "- Schedule, construction, commissioning, contractor, critical path, recovery, float.",
      "- Funding, liquidity, financing, covenant, contingency, cost growth, market access.",
      "- Permit, regulator, approval, obligation, correspondence, enforcement, legal condition.",
      "- Startup, operations readiness, punch-list, failed tests, spares, training, procedures.",
      "- OT, cyber, backup, privileged access, vendor remote access, recovery drill.",
      "- HSSE, safety, near miss, recordable incident, workfront, stop-work, corrective action.",
      "",
      "## Evidence Extractor",
      "Extract source-bound facts with evidence IDs, source path or URL, retrieval date, confidence, and the exact objective or dependency affected. Do not infer beyond the supplied source.",
      "",
      "Required fields for every extracted fact:",
      "- Evidence ID.",
      "- Exact source name, URL, file path, or GitHub path.",
      "- Retrieval date.",
      "- Quoted or closely paraphrased fact.",
      "- Risk category relevance.",
      "- Confidence.",
      "- Whether the fact supports cause, event, consequence, control, gap, mitigation, KRI, or appetite.",
      "- Limitation or ambiguity.",
      "",
      "## Risk Generator",
      "Generate category-specific risks only from approved evidence and management-answer IDs. Use cause-event-consequence wording. Separate existing controls, control gaps, mitigation actions, KRI, early warning, owner, appetite alignment, and review date.",
      "",
      "For each risk, produce:",
      "- Title.",
      "- Category.",
      "- Cause.",
      "- Event.",
      "- Consequence.",
      "- Evidence IDs.",
      "- Management answer IDs.",
      "- Existing controls.",
      "- Control gaps.",
      "- Inherent likelihood and impact.",
      "- Residual likelihood and impact.",
      "- Owner.",
      "- Treatment type.",
      "- Mitigation actions.",
      "- KRI.",
      "- Early warning.",
      "- Confidence.",
      "- Source limitations.",
      "",
      "## Risk Reviewer",
      "Reject unsupported risks, duplicate risks, stale facts, score drift, missing owners, weak controls, untestable mitigations, and not-applicable assumptions. Residual risk cannot exceed inherent risk.",
      "",
      "Review checklist:",
      "- Does every risk have category-relevant evidence?",
      "- Is the evidence current enough for the review cycle?",
      "- Is the risk specific to the company/project, not a generic template?",
      "- Are management assumptions separate from public evidence?",
      "- Does each mitigation action have an owner, due date, and proof standard?",
      "- Is residual score lower only because current controls or funded actions justify it?",
      "- Are limitations visible to a board reader?",
      "",
      "## Red Team",
      "Attack every risk as if the register will fail in front of the board. Identify generic wording, missing evidence, false precision, weak mitigation, unowned controls, stale assumptions, and hidden dependencies.",
      "",
      "Red-team prompts:",
      "- What would make this risk title misleading?",
      "- What evidence is being stretched beyond what it says?",
      "- Which hidden dependency could invalidate the mitigation?",
      "- Which control is assumed rather than proven?",
      "- What would a regulator, lender, contractor, or board member challenge?",
      "- What score would change first if the strongest evidence item were removed?",
      "",
      "## Postmortem",
      "Assume the risk materialized six months later. Explain the missed signal, failed control, missing owner decision, and evidence that would have changed the outcome.",
      "",
      "Postmortem prompts:",
      "- What happened?",
      "- What warning appeared first?",
      "- Who saw it?",
      "- Which meeting or report failed to escalate it?",
      "- Which control did not work under real conditions?",
      "- Which owner lacked authority, budget, or timing?",
      "- What evidence would have changed the decision?",
      "- What permanent control should be added?",
      "",
      "## Board Pack",
      "Summarize only approved risks, preserve limitations, separate public evidence from management assumptions, and call out the decisions needed before the register can be relied on.",
      "",
      "Board-pack structure:",
      "- Executive summary.",
      "- Top residual risks.",
      "- Decisions required.",
      "- Per-risk deep dives.",
      "- Evidence limitations.",
      "- Control assurance plan.",
      "- 30 / 60 / 90 day workplan.",
      "- Board questions.",
      "- Red-team challenges.",
      "- Postmortem scenarios.",
      "- Open evidence requests."
    ].join("\n");
  }

  function renderEvidenceList(assessment) {
    return (assessment.evidence_pack || [])
      .map(function (item) {
        return (
          "<li><strong>" +
          escapeHtml(item.id) +
          "</strong> " +
          escapeHtml(item.claim) +
          '<span class="muted"> — ' +
          escapeHtml(item.source || item.path || "") +
          (item.line_number ? " line " + escapeHtml(String(item.line_number)) : "") +
          (item.truncated_from_file ? " / file truncated for assessment" : "") +
          " / " +
          escapeHtml(item.confidence || "") +
          "</span></li>"
        );
      })
      .join("");
  }

  function renderInlineList(items) {
    return (items || [])
      .map(function (item) {
        return "<li>" + escapeHtml(item) + "</li>";
      })
      .join("");
  }

  function renderRiskTable(assessment) {
    var rows = (assessment.risk_register || [])
      .map(function (risk) {
        return (
          "<tr><td>" +
          escapeHtml(risk.id) +
          "</td><td>" +
          escapeHtml(risk.category) +
          "</td><td><strong>" +
          escapeHtml(risk.title) +
          "</strong><div class=\"muted\">" +
          escapeHtml(risk.residual_band || bandName(risk.residual_score)) +
          " residual</div></td><td>" +
          "<strong>Cause</strong><br>" +
          escapeHtml(risk.cause) +
          "<br><strong>Event</strong><br>" +
          escapeHtml(risk.risk_event) +
          "<br><strong>Consequence</strong><br>" +
          escapeHtml(risk.consequence) +
          '</td><td class="mono">' +
          escapeHtml(risk.evidence_ids.join(", ")) +
          '<br><span class="muted">' +
          escapeHtml(displayEvidenceCoverage(risk.evidence_coverage)) +
          "</span>" +
          '</td><td class="score">' +
          escapeHtml(String(risk.inherent_score)) +
          '</td><td class="score">' +
          escapeHtml(String(risk.residual_score)) +
          "</td><td>" +
          escapeHtml(risk.owner) +
          "</td><td><strong>Controls</strong><ul>" +
          renderInlineList(risk.existing_controls) +
          "</ul><strong>Gaps</strong><ul>" +
          renderInlineList(risk.control_gaps) +
          "</ul></td><td><strong>" +
          escapeHtml(risk.treatment) +
          "</strong><ul>" +
          renderInlineList(risk.mitigation_actions) +
          "</ul></td><td>" +
          escapeHtml(risk.kri) +
          "<br><span class=\"muted\">" +
          escapeHtml(risk.early_warning) +
          "</span></td><td>" +
          escapeHtml(risk.red_team_challenge) +
          "</td></tr>"
        );
      })
      .join("");
    return (
      '<table class="risk-table"><thead><tr><th>ID</th><th>Category</th><th>Risk</th><th>Cause / Event / Consequence</th><th>Evidence</th><th>Inherent</th><th>Residual</th><th>Owner</th><th>Controls / Gaps</th><th>Mitigation</th><th>KRI / Early Warning</th><th>Red Team Challenge</th></tr></thead><tbody>' +
      rows +
      "</tbody></table>"
    );
  }

  function renderHeatMap(assessment, mode) {
    var risks = assessment.risk_register || [];
    var selectedMode = mode === "inherent" ? "inherent" : "residual";
    var body = "";
    for (var impact = 5; impact >= 1; impact -= 1) {
      body += "<tr><th>" + impact + "</th>";
      for (var likelihood = 1; likelihood <= 5; likelihood += 1) {
        var matches = risks.filter(function (risk) {
          if (selectedMode === "inherent") {
            return risk.likelihood === likelihood && risk.impact === impact;
          }
          return risk.residual_likelihood === likelihood && risk.residual_impact === impact;
        });
        var cellScore = likelihood * impact;
        var band = bandName(cellScore).toLowerCase();
        body +=
          '<td class="' +
          band +
          '">' +
          (matches.length
            ? matches
                .map(function (risk) {
                  return "<span>" + escapeHtml(risk.id + " " + risk.title) + "</span><small>" + escapeHtml(bandName(cellScore)) + " / " + escapeHtml(displayEvidenceCoverage(risk.evidence_coverage)) + "</small>";
                })
                .join("")
            : '<small>' + escapeHtml(bandName(cellScore)) + "</small>") +
          "</td>";
      }
      body += "</tr>";
    }
    return '<table class="heat-map"><caption>' + (selectedMode === "inherent" ? "Inherent Heat Map" : "Residual Heat Map") + '</caption><tr><th>Impact \\ Likelihood</th><th>1</th><th>2</th><th>3</th><th>4</th><th>5</th></tr>' + body + "</table>";
  }

  function renderBarList(items, valueKey, labelKey) {
    var max = items.reduce(function (highest, item) {
      return Math.max(highest, Number(item[valueKey]) || 0);
    }, 1);
    return items
      .map(function (item) {
        var value = Number(item[valueKey]) || 0;
        var width = Math.max(10, Math.round((value / max) * 100));
        var widthClass = "w-" + Math.max(10, Math.min(100, Math.round(width / 10) * 10));
        return (
          '<div class="bar-row"><span>' +
          escapeHtml(item[labelKey]) +
          '</span><div class="bar-track"><div class="bar-fill ' +
          widthClass +
          '"></div></div><strong>' +
          escapeHtml(String(value)) +
          "</strong></div>"
        );
      })
      .join("");
  }

  function widthClassForPercent(value) {
    var bounded = Math.max(10, Math.min(100, Math.round((Number(value) || 0) / 10) * 10));
    return "w-" + bounded;
  }

  function renderDecisionStrip(visuals) {
    var summary = visuals.decision_summary || { principal_risks: [], appetite_breaches: [], decisions_needed: [], reviews_due: [], evidence_warnings: [], total_risks: 0 };
    return (
      '<div class="decision-strip">' +
      '<div class="decision-metrics">' +
      '<span><strong>' + escapeHtml(String(summary.total_risks)) + '</strong>Total risks</span>' +
      '<span><strong>' + escapeHtml(String(summary.principal_risks.length)) + '</strong>Principal risks</span>' +
      '<span><strong>' + escapeHtml(String(summary.appetite_breaches.length)) + '</strong>Appetite breaches</span>' +
      '<span><strong>' + escapeHtml(String(summary.evidence_warnings.length)) + '</strong>Evidence warnings</span>' +
      '</div><div class="decision-columns"><section><h5>Decisions Needed</h5><ul>' +
      renderInlineList(summary.decisions_needed.slice(0, 5)) +
      '</ul></section><section><h5>Next Reviews</h5><ul>' +
      (summary.reviews_due || []).map(function (item) {
        return '<li><strong>' + escapeHtml(item.id) + '</strong> ' + escapeHtml(item.due) + ' / ' + escapeHtml(item.owner) + '</li>';
      }).join("") +
      "</ul></section></div></div>"
    );
  }

  function renderRiskMotion(rows) {
    return (
      '<div class="scroll-box"><table class="motion-table"><thead><tr><th>Risk</th><th>Inherent</th><th>Residual</th><th>Reduction</th><th>Velocity</th><th>Appetite</th></tr></thead><tbody>' +
      (rows || []).map(function (item) {
        return (
          '<tr><td><strong>' + escapeHtml(item.id) + '</strong> ' + escapeHtml(item.title) + '</td><td class="score">' +
          escapeHtml(String(item.inherent_score)) +
          '</td><td class="score">' +
          escapeHtml(String(item.residual_score)) +
          '</td><td><div class="bar-row compact"><span>' +
          escapeHtml(String(item.reduction_percent)) +
          '%</span><div class="bar-track"><div class="bar-fill ' +
          escapeHtml(widthClassForPercent(item.reduction_percent)) +
          '"></div></div></div></td><td>' +
          escapeHtml(item.velocity) +
          '</td><td><span class="status-pill ' +
          (item.appetite_status === "Escalate" ? "alert" : item.appetite_status === "Watch" ? "watch" : "ok") +
          '">' +
          escapeHtml(item.appetite_status) +
          "</span></td></tr>"
        );
      }).join("") +
      "</tbody></table></div>"
    );
  }

  function renderTreatmentAssurance(treatment) {
    var data = treatment || { action_runway: { thirty: [], sixty: [], ninety: [] }, owner_workload: [], control_gap_rows: [], control_gap_total: 0 };
    return (
      '<div class="treatment-board"><div class="runway-grid">' +
      ['thirty', 'sixty', 'ninety'].map(function (key) {
        var label = key === "thirty" ? "30 Days" : key === "sixty" ? "60 Days" : "90 Days";
        return '<section><h5>' + label + '</h5><ul>' + (data.action_runway[key] || []).slice(0, 4).map(function (item) {
          return '<li><strong>' + escapeHtml(item.id) + '</strong> ' + escapeHtml(item.action) + '</li>';
        }).join("") + '</ul></section>';
      }).join("") +
      '</div><div class="assurance-grid"><section><h5>Owner Workload</h5>' +
      renderBarList(data.owner_workload || [], "value", "label") +
      '</section><section><h5>Controls / Gaps</h5><ul>' +
      (data.control_gap_rows || []).map(function (item) {
        return '<li><strong>' + escapeHtml(item.id) + '</strong> ' + escapeHtml(String(item.controls)) + ' controls / ' + escapeHtml(String(item.gaps)) + ' gaps / ' + escapeHtml(item.effectiveness) + '</li>';
      }).join("") +
      "</ul></section></div></div>"
    );
  }

  function renderEvidenceIntelligence(evidence) {
    var data = evidence || { coverage_mix: [], confidence_counts: [], coverage_rows: [], open_requests: [], source_counts: { real_evidence: 0, fallback_evidence: 0 } };
    return (
      '<div class="evidence-intelligence"><div class="metric-pair"><span><strong>' +
      escapeHtml(String(data.source_counts.real_evidence)) +
      '</strong> source-bound items</span><span><strong>' +
      escapeHtml(String(data.source_counts.fallback_evidence)) +
      '</strong> fallback items</span></div><div class="assurance-grid"><section><h5>Coverage Mix</h5>' +
      renderBarList(data.coverage_mix || [], "value", "label") +
      '<h5>Confidence</h5>' +
      renderBarList(data.confidence_counts || [], "value", "label") +
      '</section><section><h5>Open Evidence Requests</h5><ul>' +
      (data.open_requests || []).map(function (item) {
        return '<li><strong>' + escapeHtml(item.id) + '</strong> ' + escapeHtml((item.requests || [])[0] || "Confirm evidence before board reliance.") + '</li>';
      }).join("") +
      "</ul></section></div></div>"
    );
  }

  function renderKriWatchlist(rows) {
    return (
      '<div class="kri-watchlist">' +
      (rows || []).map(function (item) {
        return '<article><h5>' + escapeHtml(item.id + " " + item.title) + '</h5><p><strong>KRI:</strong> ' + escapeHtml(item.kri) + '</p><p><strong>Early warning:</strong> ' + escapeHtml(item.early_warning) + '</p><p class="muted">' + escapeHtml(item.velocity + " / " + item.escalation) + '</p></article>';
      }).join("") +
      "</div>"
    );
  }

  function renderDependencyScenarios(data) {
    var scenarios = data || { dependencies: [], scenario_cards: [] };
    return (
      '<div class="dependency-scenarios"><div class="dependency-list"><h5>Critical Dependencies</h5><ul>' +
      (scenarios.dependencies || []).map(function (item) { return '<li>' + escapeHtml(item) + '</li>'; }).join("") +
      '</ul></div><div class="scenario-grid">' +
      (scenarios.scenario_cards || []).map(function (item) {
        return '<article><h5>' + escapeHtml(item.id + " " + item.title) + '</h5><p><strong>Dependency:</strong> ' + escapeHtml(item.dependency) + '</p><p><strong>First signal:</strong> ' + escapeHtml(item.first_failure_signal) + '</p><p><strong>Challenge:</strong> ' + escapeHtml(item.red_team) + '</p><p class="muted">' + escapeHtml(item.postmortem) + '</p></article>';
      }).join("") +
      "</div></div>"
    );
  }

  function renderVisualDashboard(assessment) {
    var visuals = assessment.visuals || buildVisualSummary(assessment);
    var controlItems = Object.keys(visuals.control_effectiveness || {}).map(function (key) {
      return { label: key, value: visuals.control_effectiveness[key] };
    });
    var coverage = visuals.evidence_coverage || { real_evidence: 0, fallback_evidence: 0 };
    var top = (visuals.top_residual_risks || []).map(function (risk) {
      return { label: risk.id + " " + risk.title + " - " + displayEvidenceCoverage(risk.coverage), value: risk.score };
    });
    return (
      '<div class="visual-grid">' +
      '<section class="visual-card wide"><h4>Board Decision Strip</h4>' +
      renderDecisionStrip(visuals) +
      "</section>" +
      '<section class="visual-card wide"><h4>Risk Motion</h4>' +
      renderRiskMotion(visuals.risk_motion || []) +
      "</section>" +
      '<section class="visual-card wide"><h4>Treatment and Assurance</h4>' +
      renderTreatmentAssurance(visuals.treatment_assurance) +
      "</section>" +
      '<section class="visual-card wide"><h4>Evidence Intelligence</h4>' +
      renderEvidenceIntelligence(visuals.evidence_intelligence) +
      "</section>" +
      '<section class="visual-card wide"><h4>KRI Watchlist</h4>' +
      renderKriWatchlist(visuals.kri_watchlist || []) +
      "</section>" +
      '<section class="visual-card wide"><h4>Dependency and Scenario Stress</h4>' +
      renderDependencyScenarios(visuals.dependency_scenarios) +
      "</section>" +
      '<section class="visual-card wide"><h4>Top Residual Risks</h4>' +
      renderBarList(top, "value", "label") +
      "</section>" +
      '<section class="visual-card"><h4>Control Effectiveness</h4>' +
      renderBarList(controlItems, "value", "label") +
      "</section>" +
      '<section class="visual-card"><h4>Evidence Coverage</h4><div class="metric-pair"><span><strong>' +
      escapeHtml(String(coverage.real_evidence)) +
      "</strong> real evidence</span><span><strong>" +
      escapeHtml(String(coverage.fallback_evidence)) +
      "</strong> fallback</span></div></section>" +
      '<section class="visual-card wide"><h4>Inherent Heat Map</h4><div class="scroll-box">' +
      renderHeatMap(assessment, "inherent") +
      "</div></section>" +
      '<section class="visual-card wide"><h4>Residual Heat Map</h4><div class="scroll-box">' +
      renderHeatMap(assessment, "residual") +
      "</div></section>" +
      '<section class="visual-card wide"><h4>Red Team Challenge</h4>' +
      renderChallengePanel(assessment) +
      "</section>" +
      "</div>"
    );
  }

  function renderChallengePanel(assessment) {
    var risks = assessment.risk_register || [];
    return (
      '<div class="challenge-list">' +
      risks
        .map(function (risk) {
          return (
            "<article><strong>" +
            escapeHtml(risk.id + " " + risk.title) +
            "</strong><p>" +
            escapeHtml(risk.red_team_challenge) +
            '</p><p class="muted">' +
            escapeHtml(risk.postmortem_scenario) +
            "</p></article>"
          );
        })
        .join("") +
      "</div>"
    );
  }

  function downloadFile(filename, mimeType, text) {
    var blob = new Blob([text], { type: mimeType });
    var url = global.URL.createObjectURL(blob);
    var link = global.document.createElement("a");
    link.href = url;
    link.download = filename;
    link.click();
    global.URL.revokeObjectURL(url);
  }

  function reportLineCount(text) {
    return text ? text.split("\n").length : 0;
  }

  function setReportOutput(textId, metaId, text) {
    var output = global.document.getElementById(textId);
    if (output) {
      output.textContent = text;
    }
    var meta = global.document.getElementById(metaId);
    if (meta) {
      var lines = reportLineCount(text);
      meta.textContent = lines ? String(lines) + " lines / preview capped" : "Not generated";
    }
  }

  function collectFormInput() {
    return {
      company: global.document.getElementById("company").value,
      country: global.document.getElementById("country").value,
      website: global.document.getElementById("website").value,
      evidenceText: global.document.getElementById("evidenceText").value,
      importedEvidence: state.importedEvidence,
      answers: {
        objectives: global.document.getElementById("objectives").value,
        incidents: global.document.getElementById("incidents").value,
        risk_appetite: global.document.getElementById("riskAppetite").value,
        dependencies: global.document.getElementById("dependencies").value
      }
    };
  }

  function setGeneratedOutputVisible(isVisible) {
    var generatedOutputs = global.document.getElementById("generatedOutputs");
    if (generatedOutputs) {
      generatedOutputs.hidden = !isVisible;
    }
    var emptyOutputState = global.document.getElementById("emptyOutputState");
    if (emptyOutputState) {
      emptyOutputState.hidden = isVisible;
    }
  }

  function renderAssessment(assessment) {
    state.assessment = assessment;
    setGeneratedOutputVisible(true);
    var gate = global.document.getElementById("gate");
    gate.textContent = assessment.review_gate.verdict.toUpperCase();
    gate.className = "status-chip " + (assessment.review_gate.verdict === "pass" ? "pass" : "revise");
    global.document.getElementById("evidenceCount").textContent = String(countRealEvidence(assessment));
    global.document.getElementById("riskCount").textContent = String(assessment.risk_register.length);
    global.document.getElementById("gateDetails").innerHTML = assessment.review_gate.errors.length
      ? "<ul>" + assessment.review_gate.errors.map(function (item) { return "<li>" + escapeHtml(item) + "</li>"; }).join("") + "</ul>"
      : "<p>Review gate passed for this draft. Every risk has category-relevant source-bound evidence, unique IDs, and valid residual-score rules.</p>";
    var qualityReview = global.document.getElementById("qualityReview");
    if (qualityReview) {
      qualityReview.innerHTML = renderQualityReview(assessment);
    }
    global.document.getElementById("evidenceList").innerHTML = renderEvidenceList(assessment);
    global.document.getElementById("heatMap").innerHTML = renderVisualDashboard(assessment);
    global.document.getElementById("riskRegister").innerHTML = renderRiskTable(assessment);
    setReportOutput("boardReport", "boardReportMeta", toBoardMarkdown(assessment));
    setReportOutput("detailedAnalysis", "detailedAnalysisMeta", toDetailedAnalysisMarkdown(assessment));
    setReportOutput("standardsAnnex", "standardsAnnexMeta", toStandardsMarkdown(assessment));
    global.document.getElementById("downloadPanel").hidden = assessment.review_gate.verdict !== "pass";
    var downloadStatus = global.document.getElementById("downloadStatus");
    if (downloadStatus) {
      downloadStatus.textContent = assessment.review_gate.verdict === "pass"
        ? "Downloads are ready. Full reports stay detailed; previews below are capped for easier review."
        : "Downloads are disabled because this assessment is marked REVISE.";
    }
  }

  function renderImportedFiles() {
    var list = global.document.getElementById("importedFiles");
    if (!state.importedEvidence.length) {
      list.innerHTML = '<li class="muted">No imported files yet.</li>';
      return;
    }
    list.innerHTML = state.importedEvidence
      .map(function (item) {
        var lineCount = splitEvidenceText(item.text).length;
        var assessedCount = Math.min(lineCount, 30);
        return "<li><strong>" + escapeHtml(item.name || item.path || "import") + "</strong><span class=\"muted\"> " + escapeHtml(String(item.text.length)) + " chars / " + escapeHtml(String(assessedCount)) + " of " + escapeHtml(String(lineCount)) + " evidence lines assessed</span></li>";
      })
      .join("");
  }

  function renderQualityReview(assessment) {
    var review = assessment.quality_review || { findings: [], postmortem_questions: [], quality_rules: [] };
    return (
      '<div class="quality-grid"><section><h4>Challenge Findings</h4><ul>' +
      renderInlineList(review.findings) +
      '</ul></section><section><h4>Postmortem Questions</h4><ul>' +
      renderInlineList(review.postmortem_questions) +
      '</ul></section><section><h4>Quality Rules</h4><ul>' +
      renderInlineList(review.quality_rules) +
      "</ul></section></div>"
    );
  }

  function resetAssessmentOutputs(reason) {
    state.assessment = null;
    if (!global.document) {
      return;
    }
    setGeneratedOutputVisible(false);
    var gate = global.document.getElementById("gate");
    if (gate) {
      gate.textContent = "STALE";
      gate.className = "status-chip revise";
    }
    var fields = {
      evidenceCount: "0",
      riskCount: "0"
    };
    Object.keys(fields).forEach(function (id) {
      var node = global.document.getElementById(id);
      if (node) {
        node.textContent = fields[id];
      }
    });
    var gateDetails = global.document.getElementById("gateDetails");
    if (gateDetails) {
      gateDetails.innerHTML = "<p>" + escapeHtml(reason || "Inputs changed. Regenerate the assessment before using outputs.") + "</p>";
    }
    var qualityReview = global.document.getElementById("qualityReview");
    if (qualityReview) {
      qualityReview.innerHTML = "<p>Regenerate the assessment to refresh quality challenges.</p>";
    }
    ["evidenceList", "heatMap", "riskRegister"].forEach(function (id) {
      var node = global.document.getElementById(id);
      if (node) {
        node.innerHTML = "";
      }
    });
    setReportOutput("boardReport", "boardReportMeta", "");
    setReportOutput("detailedAnalysis", "detailedAnalysisMeta", "");
    setReportOutput("standardsAnnex", "standardsAnnexMeta", "");
    var downloadPanel = global.document.getElementById("downloadPanel");
    if (downloadPanel) {
      downloadPanel.hidden = true;
    }
    var downloadStatus = global.document.getElementById("downloadStatus");
    if (downloadStatus) {
      downloadStatus.textContent = "Downloads are disabled until a fresh assessment passes the review gate.";
    }
  }

  function initBrowser() {
    var doc = global.document;
    if (!doc) {
      return;
    }
    try {
      if (global.self && global.top && global.self !== global.top) {
        global.top.location = global.self.location;
      }
    } catch (error) {
      // Cross-origin frame access can throw; continue without breaking the app.
    }
    renderImportedFiles();
    [
      "company",
      "country",
      "website",
      "evidenceText",
      "objectives",
      "incidents",
      "riskAppetite",
      "dependencies",
      "githubUrl",
      "githubOwner",
      "githubRepo",
      "githubRef",
      "githubPath"
    ].forEach(function (id) {
      var field = doc.getElementById(id);
      if (field) {
        field.addEventListener("input", function () {
          if (state.assessment) {
            resetAssessmentOutputs("Inputs changed. Regenerate the assessment before using outputs.");
          }
        });
      }
    });
    doc.getElementById("generate").addEventListener("click", function () {
      renderAssessment(buildAssessment(collectFormInput()));
    });
    doc.getElementById("sample").addEventListener("click", function () {
      doc.getElementById("company").value = "NextDecade LNG, LLC";
      doc.getElementById("country").value = "United States";
      doc.getElementById("website").value = "https://www.next-decade.com";
      doc.getElementById("evidenceText").value = [
        "Rio Grande LNG construction schedule and critical path float are reviewed.",
        "Funding liquidity headroom and contingency draw are tracked.",
        "Permit obligations are mapped to regulators and field records.",
        "Commissioning test failures and punch-list aging are monitored.",
        "OT recovery drills and cyber access reviews are tracked.",
        "Contractor safety near misses and recordable incident rates are reviewed.",
        "The company depends on Bechtel EPC delivery.",
        "Feed gas delivery and LNG offtake contracts shape the operating model."
      ].join("\n");
      doc.getElementById("objectives").value = "Train 1 first gas and safe commissioning";
      doc.getElementById("riskAppetite").value = "Low appetite for safety and compliance risk; moderate appetite for schedule risk.";
      if (state.assessment) {
        resetAssessmentOutputs("Sample data loaded. Regenerate the assessment before using outputs.");
      }
    });
    doc.getElementById("fileInput").addEventListener("change", async function (event) {
      var files = Array.from(event.target.files || []);
      var imported = [];
      var skipped = {
        tooMany: Math.max(0, files.length - MAX_LOCAL_IMPORT_FILES),
        notText: 0,
        tooLarge: 0
      };
      for (var index = 0; index < Math.min(files.length, MAX_LOCAL_IMPORT_FILES); index += 1) {
        var file = files[index];
        if (!looksTextLike(file.name)) {
          skipped.notText += 1;
          continue;
        }
        if (file.size > MAX_LOCAL_FILE_BYTES) {
          skipped.tooLarge += 1;
          continue;
        }
        imported.push({
          name: "local:" + file.name,
          text: await file.text(),
          source_type: "local-file",
          retrieved_at: new Date().toISOString()
        });
      }
      state.importedEvidence = state.importedEvidence.concat(imported);
      renderImportedFiles();
      resetAssessmentOutputs("Local evidence changed. Regenerate the assessment before using outputs.");
      doc.getElementById("importStatus").textContent =
        "Imported " +
        imported.length +
        " local file(s). Skipped " +
        (skipped.tooMany + skipped.notText + skipped.tooLarge) +
        " file(s): " +
        skipped.tooMany +
        " over count limit, " +
        skipped.notText +
        " non-text, " +
        skipped.tooLarge +
        " over 900 KB.";
      event.target.value = "";
    });
    doc.getElementById("parseGithubUrl").addEventListener("click", function () {
      try {
        var parsed = parseGitHubUrl(doc.getElementById("githubUrl").value);
        doc.getElementById("githubOwner").value = parsed.owner;
        doc.getElementById("githubRepo").value = parsed.repo;
        doc.getElementById("githubRef").value = parsed.ref;
        doc.getElementById("githubPath").value = parsed.path;
        doc.getElementById("importStatus").textContent = "Parsed GitHub URL.";
      } catch (error) {
        doc.getElementById("importStatus").textContent = error.message;
      }
    });
    doc.getElementById("importGithub").addEventListener("click", async function () {
      var tokenField = doc.getElementById("githubToken");
      try {
        doc.getElementById("importStatus").textContent = "Importing from GitHub...";
        var imported = await importGitHubPath({
          owner: doc.getElementById("githubOwner").value.trim(),
          repo: doc.getElementById("githubRepo").value.trim(),
          ref: doc.getElementById("githubRef").value.trim() || "main",
          path: doc.getElementById("githubPath").value.trim(),
          token: tokenField.value.trim()
        });
        tokenField.value = "";
        state.importedEvidence = state.importedEvidence.concat(imported);
        renderImportedFiles();
        resetAssessmentOutputs("GitHub evidence changed. Regenerate the assessment before using outputs.");
        doc.getElementById("importStatus").textContent =
          "Imported " +
          imported.length +
          " GitHub file(s). Token cleared from the form." +
          (imported.length >= MAX_GITHUB_IMPORT_FILES ? " Directory import reached the 25-file browser cap; narrow the path for full coverage." : "");
      } catch (error) {
        tokenField.value = "";
        doc.getElementById("importStatus").textContent = error.message;
      }
    });
    doc.getElementById("clearImports").addEventListener("click", function () {
      state.importedEvidence = [];
      renderImportedFiles();
      resetAssessmentOutputs("Imported evidence cleared. Previous generated outputs and downloads were cleared.");
    });
    doc.getElementById("downloadJson").addEventListener("click", function () {
      if (state.assessment) {
        downloadFile("assessment.json", "application/json", JSON.stringify(state.assessment, null, 2));
      }
    });
    doc.getElementById("downloadCsv").addEventListener("click", function () {
      if (state.assessment) {
        downloadFile("risk-register.csv", "text/csv", toRiskCsv(state.assessment));
      }
    });
    doc.getElementById("downloadRegisterJson").addEventListener("click", function () {
      if (state.assessment) {
        downloadFile("risk-register.json", "application/json", toRiskRegisterJson(state.assessment));
      }
    });
    doc.getElementById("downloadEvidenceJson").addEventListener("click", function () {
      if (state.assessment) {
        downloadFile("evidence-pack.json", "application/json", toEvidencePackJson(state.assessment));
      }
    });
    doc.getElementById("downloadBoard").addEventListener("click", function () {
      if (state.assessment) {
        downloadFile("board-report.md", "text/markdown", toBoardMarkdown(state.assessment));
      }
    });
    doc.getElementById("downloadDetailed").addEventListener("click", function () {
      if (state.assessment) {
        downloadFile("detailed-analysis.md", "text/markdown", toDetailedAnalysisMarkdown(state.assessment));
      }
    });
    doc.getElementById("downloadStandards").addEventListener("click", function () {
      if (state.assessment) {
        downloadFile("standards-annex.md", "text/markdown", toStandardsMarkdown(state.assessment));
      }
    });
    doc.getElementById("downloadHeatMap").addEventListener("click", function () {
      if (state.assessment) {
        downloadFile("heat-map.html", "text/html", toHeatMapHtml(state.assessment));
      }
    });
    doc.getElementById("downloadPrompts").addEventListener("click", function () {
      downloadFile("prompt-pack.md", "text/markdown", toPromptPackMarkdown());
    });
  }

  var api = {
    buildAssessment: buildAssessment,
    validateAssessment: validateAssessment,
    parseGitHubUrl: parseGitHubUrl,
    importGitHubPath: importGitHubPath,
    countRealEvidence: countRealEvidence,
    toRiskCsv: toRiskCsv,
    toRiskRegisterJson: toRiskRegisterJson,
    toEvidencePackJson: toEvidencePackJson,
    toBoardMarkdown: toBoardMarkdown,
    toDetailedAnalysisMarkdown: toDetailedAnalysisMarkdown,
    toStandardsMarkdown: toStandardsMarkdown,
    toHeatMapHtml: toHeatMapHtml,
    toPromptPackMarkdown: toPromptPackMarkdown,
    renderRiskTable: renderRiskTable,
    renderHeatMap: renderHeatMap,
    renderVisualDashboard: renderVisualDashboard,
    renderChallengePanel: renderChallengePanel,
    escapeHtml: escapeHtml,
    safeCsvCell: safeCsvCell
  };

  global.RiskWorkbench = api;
  if (global.document) {
    global.document.addEventListener("DOMContentLoaded", initBrowser);
  }
})(typeof window !== "undefined" ? window : globalThis);
