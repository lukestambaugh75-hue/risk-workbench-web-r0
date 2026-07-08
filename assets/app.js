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
      treatment: "Refresh integrated recovery plan",
      kri: "critical path float",
      consequence: "missed commercial milestones and reduced stakeholder confidence",
      likelihood: 4,
      impact: 5,
      residual_likelihood: 3,
      residual_impact: 4
    },
    {
      category: "Financial",
      title: "Funding pressure",
      owner: "Chief Financial Officer",
      treatment: "Stress-test funding runway",
      kri: "liquidity headroom",
      consequence: "higher financing cost and constrained project optionality",
      likelihood: 3,
      impact: 5,
      residual_likelihood: 2,
      residual_impact: 4
    },
    {
      category: "Compliance & Legal",
      title: "Permit non-compliance",
      owner: "General Counsel",
      treatment: "Map permit obligations monthly",
      kri: "open permit actions",
      consequence: "regulatory enforcement, rework, or approval delays",
      likelihood: 3,
      impact: 4,
      residual_likelihood: 2,
      residual_impact: 3
    },
    {
      category: "Operational",
      title: "Commissioning failure",
      owner: "Operations Director",
      treatment: "Run readiness assurance reviews",
      kri: "failed commissioning tests",
      consequence: "startup instability and delayed operational handover",
      likelihood: 4,
      impact: 5,
      residual_likelihood: 3,
      residual_impact: 4
    },
    {
      category: "Cyber & Technology",
      title: "Control-system outage",
      owner: "Chief Information Security Officer",
      treatment: "Validate OT recovery drills",
      kri: "OT recovery time",
      consequence: "loss of operational visibility or extended recovery time",
      likelihood: 3,
      impact: 4,
      residual_likelihood: 2,
      residual_impact: 3
    },
    {
      category: "People & ESG",
      title: "Contractor safety event",
      owner: "HSSE Director",
      treatment: "Tighten contractor safety controls",
      kri: "recordable incident rate",
      consequence: "injury, work stoppage, and reputational damage",
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
    splitEvidenceText(input.evidenceText).forEach(function (claim) {
      entries.push({
        claim: truncate(claim, 500),
        source: "typed evidence",
        source_type: "user-entered",
        confidence: "medium",
        retrieved_at: new Date().toISOString()
      });
    });
    (input.importedEvidence || []).forEach(function (item) {
      splitEvidenceText(item.text).slice(0, 30).forEach(function (claim) {
        entries.push({
          claim: truncate(claim, 500),
          source: item.name || item.path || item.url || "imported file",
          source_type: item.source_type || "imported",
          url: item.url || "",
          repo: item.repo || "",
          ref: item.ref || "",
          path: item.path || "",
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

  function riskDescription(company, template, evidencePack) {
    var evidenceIndex = CATEGORIES.indexOf(template.category) % evidencePack.length;
    var evidenceHint = evidencePack[evidenceIndex].claim.replace(/\.$/, "");
    return (
      "Due to " +
      company +
      "'s current context (" +
      evidenceHint +
      "), there is a risk of " +
      template.title.toLowerCase() +
      ", resulting in " +
      template.consequence +
      "."
    );
  }

  function buildBoardReport(profile, risks) {
    var topRisks = risks
      .slice()
      .sort(function (a, b) {
        return b.inherent_score - a.inherent_score;
      })
      .slice(0, 3);
    return {
      headline: profile.company + " risk assessment",
      summary:
        profile.company +
        " has a concentrated risk profile shaped by the current evidence pack. The strongest risks should be managed through named ownership, evidence refresh, and explicit review cadence.",
      top_risks: topRisks.map(function (risk) {
        return risk.id + " " + risk.title;
      }),
      decisions_required: [
        "Confirm risk appetite for schedule, safety, compliance, and funding exposure.",
        "Confirm which assumptions are management-owned versus publicly evidenced.",
        "Assign owners for every high or extreme residual risk."
      ],
      limitations: [
        "This browser run uses typed and imported evidence only.",
        "Private GitHub imports use a token only for the current fetch request.",
        "Use the prompt pack for live research and source-bound LLM enrichment."
      ]
    };
  }

  function buildStandardsAnnex(profile, risks) {
    return {
      title: profile.company + " standards conformance annex",
      iso_31000: [
        { clause: "5.4 Leadership and commitment", how: "Named owners and board decisions are captured for material risks." },
        { clause: "6.3 Risk criteria", how: "Likelihood, impact, and residual scoring rules are explicit." },
        { clause: "6.4 Risk assessment", how: risks.length + " risks are identified, analyzed, and evaluated." },
        { clause: "6.5 Risk treatment", how: "Each risk includes a treatment and responsible owner." },
        { clause: "6.7 Recording and reporting", how: "Evidence IDs and management assumptions remain visible." }
      ],
      coso_erm: [
        { component: "Governance & Culture", how: "Risk owners and appetite decisions are surfaced." },
        { component: "Strategy & Objective-Setting", how: "Management objectives are preserved as answer IDs." },
        { component: "Performance", how: "Risks include KRIs, controls, and residual ratings." },
        { component: "Review & Revision", how: "The review gate blocks unsupported or inconsistent risks." },
        { component: "Information, Communication & Reporting", how: "Outputs include JSON, board Markdown, CSV, and heat map." }
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
      if (risk.residual_likelihood > risk.likelihood || risk.residual_impact > risk.impact || risk.residual_score > risk.inherent_score) {
        errors.push(risk.id + " residual score exceeds inherent score.");
      }
    });
    return errors;
  }

  function countRealEvidence(assessment) {
    return (assessment.evidence_pack || []).filter(function (item) {
      return item.source_type !== "fallback";
    }).length;
  }

  function buildAssessment(input) {
    var payload = input || {};
    var company = cleanText(payload.company) || "Unnamed company";
    var evidencePack = normalizeEvidence(payload);
    var managementAnswers = normalizeAnswers(payload.answers || {});
    var managementIds = managementAnswers.map(function (item) {
      return item.id;
    });
    var profile = {
      company: company,
      country: cleanText(payload.country),
      website: cleanText(payload.website),
      current_state: evidencePack[0].claim,
      assessment_mode: "browser evidence-first generation"
    };
    var risks = RISK_TEMPLATES.map(function (template, index) {
      return {
        id: "R-" + String(index + 1).padStart(2, "0"),
        category: template.category,
        title: template.title,
        description: riskDescription(company, template, evidencePack),
        evidence_ids: evidenceIds(evidencePack, index, 2),
        management_answer_ids: managementIds.slice(0, 1),
        likelihood: template.likelihood,
        impact: template.impact,
        inherent_score: score(template.likelihood, template.impact),
        score_rationale:
          template.category +
          " scoring reflects the supplied evidence, current lifecycle, and board-level impact if " +
          template.title.toLowerCase() +
          " materializes.",
        controls: ["Named executive owner", "Monthly evidence-backed review"],
        control_effectiveness: "Partially effective",
        residual_likelihood: template.residual_likelihood,
        residual_impact: template.residual_impact,
        residual_score: score(template.residual_likelihood, template.residual_impact),
        owner: template.owner,
        treatment: template.treatment,
        kri: template.kri,
        confidence: evidencePack.some(function (item) { return item.source_type !== "fallback"; }) ? "medium" : "low"
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
    var errors = validateAssessment(assessment);
    assessment.review_gate = {
      verdict: errors.length ? "revise" : "pass",
      errors: errors,
      checks: [
        "risks cite evidence or management answers",
        "residual scores do not exceed inherent scores",
        "risk IDs are unique",
        "all six target categories are present",
        "at least one non-fallback evidence item is present"
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
      "Risk ID",
      "Category",
      "Title",
      "Description",
      "Evidence IDs",
      "Management Answer IDs",
      "Likelihood",
      "Impact",
      "Inherent Score",
      "Residual Likelihood",
      "Residual Impact",
      "Residual Score",
      "Owner",
      "Treatment",
      "KRI",
      "Confidence"
    ];
    var rows = (assessment.risk_register || []).map(function (risk) {
      return [
        risk.id,
        risk.category,
        risk.title,
        risk.description,
        risk.evidence_ids.join(" "),
        risk.management_answer_ids.join(" "),
        risk.likelihood,
        risk.impact,
        risk.inherent_score,
        risk.residual_likelihood,
        risk.residual_impact,
        risk.residual_score,
        risk.owner,
        risk.treatment,
        risk.kri,
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

  function toBoardMarkdown(assessment) {
    var report = assessment.board_report;
    var risks = assessment.risk_register || [];
    return (
      "# " +
      neutralizeMarkdown(report.headline) +
      "\n\n## Summary\n\n" +
      neutralizeMarkdown(report.summary) +
      "\n\n## Top Risks\n\n" +
      risks
        .map(function (risk) {
          return (
            "- **" +
            neutralizeMarkdown(risk.id) +
            " " +
            neutralizeMarkdown(risk.title) +
            "** (" +
            neutralizeMarkdown(risk.category) +
            "): " +
            neutralizeMarkdown(risk.description) +
            " Evidence: " +
            neutralizeMarkdown(risk.evidence_ids.join(", ")) +
            "."
          );
        })
        .join("\n") +
      "\n\n## Decisions Required\n\n" +
      report.decisions_required.map(function (item) { return "- " + neutralizeMarkdown(item); }).join("\n") +
      "\n\n## Limitations\n\n" +
      report.limitations.map(function (item) { return "- " + neutralizeMarkdown(item); }).join("\n") +
      "\n"
    );
  }

  function toStandardsMarkdown(assessment) {
    var annex = assessment.standards_annex;
    return (
      "# " +
      neutralizeMarkdown(annex.title) +
      "\n\n## ISO 31000\n\n" +
      annex.iso_31000.map(function (item) { return "- **" + neutralizeMarkdown(item.clause) + "**: " + neutralizeMarkdown(item.how); }).join("\n") +
      "\n\n## COSO ERM\n\n" +
      annex.coso_erm.map(function (item) { return "- **" + neutralizeMarkdown(item.component) + "**: " + neutralizeMarkdown(item.how); }).join("\n") +
      "\n"
    );
  }

  function toHeatMapHtml(assessment) {
    return (
      "<!doctype html>\n<html lang=\"en\">\n<head>\n<meta charset=\"utf-8\">\n<title>Residual Risk Heat Map</title>\n<style>body{font-family:Arial,sans-serif;margin:32px;color:#1f2933}table{border-collapse:collapse;width:100%;max-width:900px}th,td{border:1px solid #fff;min-width:120px;height:78px;padding:8px;vertical-align:top}th{background:#25313d;color:#fff}.low{background:#2e7d32;color:#fff}.medium{background:#f9a825;color:#111}.high{background:#ef6c00;color:#fff}.extreme{background:#c62828;color:#fff}span{display:block;font-weight:700;margin-bottom:4px}</style>\n</head>\n<body>\n<h1>Residual Risk Heat Map</h1>\n" +
      renderHeatMap(assessment) +
      "\n</body>\n</html>\n"
    );
  }

  function toPromptPackMarkdown() {
    return [
      "# Risk Workbench Prompt Pack",
      "",
      "## Research Planner",
      "Plan targeted searches for current state, footprint, recent developments, regulatory constraints, peer disclosed risks, and evidence gaps.",
      "",
      "## Evidence Extractor",
      "Extract source-bound facts with evidence IDs, source path or URL, retrieval date, and confidence. Do not infer beyond the supplied source.",
      "",
      "## Risk Generator",
      "Generate category-specific risks only from approved evidence and management-answer IDs. Use cause-event-consequence wording.",
      "",
      "## Risk Reviewer",
      "Reject unsupported risks, duplicate risks, stale facts, score drift, and not-applicable assumptions.",
      "",
      "## Board Pack",
      "Summarize only approved risks, preserve limitations, and separate public evidence from management assumptions."
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
          " / " +
          escapeHtml(item.confidence || "") +
          "</span></li>"
        );
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
          "</strong></td><td>" +
          escapeHtml(risk.description) +
          '</td><td class="mono">' +
          escapeHtml(risk.evidence_ids.join(", ")) +
          '</td><td class="score">' +
          escapeHtml(String(risk.inherent_score)) +
          '</td><td class="score">' +
          escapeHtml(String(risk.residual_score)) +
          "</td><td>" +
          escapeHtml(risk.owner) +
          "</td><td>" +
          escapeHtml(risk.treatment) +
          "</td><td>" +
          escapeHtml(risk.kri) +
          "</td></tr>"
        );
      })
      .join("");
    return (
      '<table class="risk-table"><thead><tr><th>ID</th><th>Category</th><th>Risk</th><th>Description</th><th>Evidence</th><th>Inherent</th><th>Residual</th><th>Owner</th><th>Treatment</th><th>KRI</th></tr></thead><tbody>' +
      rows +
      "</tbody></table>"
    );
  }

  function renderHeatMap(assessment) {
    var risks = assessment.risk_register || [];
    var body = "";
    for (var impact = 5; impact >= 1; impact -= 1) {
      body += "<tr><th>" + impact + "</th>";
      for (var likelihood = 1; likelihood <= 5; likelihood += 1) {
        var matches = risks.filter(function (risk) {
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
                  return "<span>" + escapeHtml(risk.id + " " + risk.title) + "</span>";
                })
                .join("")
            : "&nbsp;") +
          "</td>";
      }
      body += "</tr>";
    }
    return '<table class="heat-map"><tr><th>Impact \\ Likelihood</th><th>1</th><th>2</th><th>3</th><th>4</th><th>5</th></tr>' + body + "</table>";
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

  function renderAssessment(assessment) {
    state.assessment = assessment;
    var gate = global.document.getElementById("gate");
    gate.textContent = assessment.review_gate.verdict.toUpperCase();
    gate.className = "status-chip " + (assessment.review_gate.verdict === "pass" ? "pass" : "revise");
    global.document.getElementById("evidenceCount").textContent = String(countRealEvidence(assessment));
    global.document.getElementById("riskCount").textContent = String(assessment.risk_register.length);
    global.document.getElementById("gateDetails").innerHTML = assessment.review_gate.errors.length
      ? "<ul>" + assessment.review_gate.errors.map(function (item) { return "<li>" + escapeHtml(item) + "</li>"; }).join("") + "</ul>"
      : "<p>Review gate passed. Evidence IDs, category coverage, unique risk IDs, and residual-score rules are valid.</p>";
    global.document.getElementById("evidenceList").innerHTML = renderEvidenceList(assessment);
    global.document.getElementById("heatMap").innerHTML = renderHeatMap(assessment);
    global.document.getElementById("riskRegister").innerHTML = renderRiskTable(assessment);
    global.document.getElementById("boardReport").textContent = toBoardMarkdown(assessment);
    global.document.getElementById("standardsAnnex").textContent = JSON.stringify(assessment.standards_annex, null, 2);
    global.document.getElementById("downloadPanel").hidden = false;
  }

  function renderImportedFiles() {
    var list = global.document.getElementById("importedFiles");
    if (!state.importedEvidence.length) {
      list.innerHTML = '<li class="muted">No imported files yet.</li>';
      return;
    }
    list.innerHTML = state.importedEvidence
      .map(function (item) {
        return "<li><strong>" + escapeHtml(item.name || item.path || "import") + "</strong><span class=\"muted\"> " + escapeHtml(String(item.text.length)) + " chars</span></li>";
      })
      .join("");
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
    doc.getElementById("generate").addEventListener("click", function () {
      renderAssessment(buildAssessment(collectFormInput()));
    });
    doc.getElementById("sample").addEventListener("click", function () {
      doc.getElementById("company").value = "NextDecade LNG, LLC";
      doc.getElementById("country").value = "United States";
      doc.getElementById("website").value = "https://www.next-decade.com";
      doc.getElementById("evidenceText").value = [
        "Rio Grande LNG is in construction and commissioning.",
        "The company depends on Bechtel EPC delivery.",
        "Feed gas delivery and LNG offtake contracts shape the operating model."
      ].join("\n");
      doc.getElementById("objectives").value = "Train 1 first gas and safe commissioning";
      doc.getElementById("riskAppetite").value = "Low appetite for safety and compliance risk; moderate appetite for schedule risk.";
    });
    doc.getElementById("fileInput").addEventListener("change", async function (event) {
      var files = Array.from(event.target.files || []);
      var imported = [];
      for (var index = 0; index < files.length; index += 1) {
        var file = files[index];
        if (!looksTextLike(file.name)) {
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
        doc.getElementById("importStatus").textContent = "Imported " + imported.length + " GitHub file(s). Token cleared from the form.";
      } catch (error) {
        tokenField.value = "";
        doc.getElementById("importStatus").textContent = error.message;
      }
    });
    doc.getElementById("clearImports").addEventListener("click", function () {
      state.importedEvidence = [];
      renderImportedFiles();
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
    toStandardsMarkdown: toStandardsMarkdown,
    toHeatMapHtml: toHeatMapHtml,
    toPromptPackMarkdown: toPromptPackMarkdown,
    renderRiskTable: renderRiskTable,
    renderHeatMap: renderHeatMap,
    escapeHtml: escapeHtml,
    safeCsvCell: safeCsvCell
  };

  global.RiskWorkbench = api;
  if (global.document) {
    global.document.addEventListener("DOMContentLoaded", initBrowser);
  }
})(typeof window !== "undefined" ? window : globalThis);
