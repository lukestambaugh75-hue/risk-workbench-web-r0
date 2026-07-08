# Risk Register Best-Practice Notes

These notes ground the browser-only Risk Workbench generator. They are intentionally practical rather than exhaustive.

## Source Baseline

- ISO 31000:2018 frames risk management as identifying, analyzing, evaluating, treating, monitoring, and communicating risks across an organization. The app maps this into evidence intake, explicit scoring, treatment actions, monitoring fields, and board-pack outputs. Source: https://www.iso.org/standard/65694.html
- ISO 31000 also emphasizes context, governance integration, and continual improvement. The app therefore keeps company context, objectives, appetite, evidence IDs, review dates, and quality findings visible.
- NIST SP 800-30 Rev. 1 emphasizes explicit risk models, risk factors, repeatable assessment values, likelihood, impact, threats, vulnerabilities, predisposing conditions, uncertainty, and ongoing monitoring. The app therefore separates cause, event, consequence, controls, control gaps, likelihood, impact, residual risk, confidence, KRI, early warning, and review cadence. Source: https://csrc.nist.gov/pubs/sp/800/30/r1/final
- The UK Orange Book emphasizes risk appetite, roles, responsibility, constructive challenge, useful reporting, and continual learning. The app therefore includes appetite alignment, named owners, evidence quality challenges, red-team questions, and postmortem scenarios. Source: https://www.gov.uk/government/publications/orange-book/the-orange-book-management-of-risk-principles-and-concepts
- COSO ERM links risk to strategy, performance, governance, review, revision, information, communication, and reporting. The app therefore uses board-facing summaries and residual-risk visuals instead of only a spreadsheet-style register. Source: https://www.coso.org/guidance-erm

## Register Quality Rules

Each risk row should include:

- Cause: the condition, dependency, vulnerability, or pressure creating exposure.
- Event: the specific thing that could happen.
- Consequence: the business, safety, compliance, financial, operational, or reputation impact.
- Existing controls: what is already in place.
- Control gaps: why current controls may not be enough.
- Mitigation actions: specific future actions, not generic verbs.
- Owner: a role accountable for action and escalation.
- KRI and early warning: measurable signals that risk is changing.
- Appetite alignment: whether the residual exposure fits the stated tolerance.
- Evidence IDs: traceability to supplied text, imported files, or management answers.
- Red-team challenge: the hardest question a reviewer should ask.
- Postmortem scenario: how this would fail if the team was wrong.

## Anti-Patterns To Reject

- Risk titles with no cause, event, or consequence.
- Mitigations like "monitor," "review," or "improve" without owner, trigger, or proof.
- Residual ratings higher than inherent ratings.
- High residual risks with no early warning or review date.
- Registers that do not distinguish evidence, assumptions, and management judgement.
- Heat maps without evidence quality or control-effectiveness context.
- Board summaries that hide limitations or ask for no decisions.
- Round-robin evidence citations that attach an unrelated source to every risk.
- General-company outputs from a sector-specific template without a clear scope warning.
- Passing gates that prove only schema completeness rather than source relevance.
