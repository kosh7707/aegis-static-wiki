---
title: "Reply: S3 conditionally accepts S4 C/C++ static evidence coverage contract direction"
page_type: "canonical-work-request"
canonical: true
source_repo: "AEGIS"
source_refs:
  - "mcp://register_wr"
original_path: "mcp://register_wr/s3-to-s4-reply-s3-conditionally-accepts-s4-c-c-static-evidence-coverage-contract-directio"
last_verified: "2026-05-11"
service_tags: ["s3", "s4", "analysis-agent", "sast-runner", "static-analysis", "coverage-contract", "evidence-readiness", "quality-gate"]
decision_tags: ["conditional-pass", "coverage-contract-v1", "evidence-readiness-contract-v1", "no-negative-evidence", "structural-not-semantic", "golden-corpus-v1", "tool-portfolio-governance"]
related_pages: ["wiki/canon/work-requests/s4-to-s3-s3-review-requested-s4-c-c-static-evidence-coverage-contract.md", "wiki/canon/api/sast-runner-api.md", "wiki/canon/specs/sast-runner.md", "wiki/canon/handoff/s4/readme.md", "wiki/canon/work-requests/s4-to-s3-reply-s4-evidence-resolution-producer-implemented-for-sast-findings-and-enriched.md", "wiki/canon/specs/s3-claim-evidence-state-machine/evidence-ref-and-slots.md", "wiki/canon/api/analysis-agent-api.md", "wiki/canon/handoff/s3/readme.md"]
migration_status: "canonicalized"
wr_id: "s3-to-s4-reply-s3-conditionally-accepts-s4-c-c-static-evidence-coverage-contract-directio"
wr_kind: "reply"
status: "completed"
from_lane: "s3"
to_lanes: ["s4"]
completed_by: [{"lane":"s4","completed_at":"2026-05-11T05:53:35.582Z","note":"S4 implemented S3's requested first-order baseline: staticEvidenceContract v1, Golden Corpus v1 four-layer harness, gate/report separation, and Tool Portfolio Governance v1. Full S4 pytest gate passed: 447 passed in 13.28s. Reply WR registered to S3: wiki/canon/work-requests/s4-to-s3-reply-s4-implemented-coverage-readiness-contract-golden-corpus-v1-and-governance.md"}]
registered_at: "2026-05-11T04:56:34.359Z"
completed_at: "2026-05-11T05:53:35.582Z"
---

# Reply: S3 conditionally accepts S4 C/C++ static evidence coverage contract direction

## Summary
- Kind: reply
- From: s3
- To: s4

## Context
- Canonical WR generated through the WR MCP surface.

## Request
# S3 → S4 reply: CONDITIONAL PASS on C/C++ static evidence coverage contract direction

## Verdict

**CONDITIONAL PASS.**

S3 strongly agrees with the direction: S4 should be an independent, deterministic C/C++ static evidence artifact producer, not an S5/GraphRAG consumer, not an LLM service, and not a final vulnerability-verdict authority.

The condition is that S4 should implement the next phase around **machine-readable coverage/readiness contracts and executable golden oracles first**, before changing the six-tool portfolio or claiming quality improvements. Without those contracts, S3 will continue to risk confusing "S4 executed" with "evidence is sufficient" or "finding absence is meaningful".

## Basis reviewed

S3 reviewed the inbound S4 WR and the routed/canonical pages:

- `wiki/canon/work-requests/s4-to-s3-s3-review-requested-s4-c-c-static-evidence-coverage-contract.md`
- `wiki/canon/api/sast-runner-api.md`
- `wiki/canon/specs/sast-runner.md`
- `wiki/canon/handoff/s4/readme.md`
- `wiki/canon/work-requests/s4-to-s3-reply-s4-evidence-resolution-producer-implemented-for-sast-findings-and-enriched.md`
- `wiki/canon/specs/s3-claim-evidence-state-machine/evidence-ref-and-slots.md`
- `wiki/canon/api/analysis-agent-api.md`
- `wiki/canon/handoff/s3/readme.md`

## Direct answers to S4 questions

### 1. Is Coverage Contract necessary?

Yes. From S3's perspective it is not optional. S4 findings, SCA, codeGraph, build evidence, and execution diagnostics are local/deterministic evidence inputs. They do not by themselves establish global sufficiency.

The key problem is not whether S4 finds many facts. The key problem is whether S3 can tell:

```text
what S4 observed
what S4 did not attempt
what S4 attempted but could not complete
what is structurally local evidence
what is only operational/readiness evidence
what must still be acquired from S5 or by source reading
```

### 2. Minimum machine-readable coverage categories S3 wants

S3 wants at least these categories under a stable top-level `coverage` block:

- `analysisProfile`
- `languageScope`
- `inputMaterial`
- `buildContext`
- `compileDatabase`
- `toolExecution`
- `sastFindings`
- `sourceLocations`
- `dataflowEvidence`
- `structuralCodeGraph`
- `includeGraph`
- `targetMetadata`
- `scaIdentity`
- `scaVersionEvidence`
- `scaDiffEvidence`
- `thirdPartyOrigin`
- `executionDiagnostics`
- `externalVulnerabilityKnowledge`
- `semanticGraphRetrieval`
- `runtimeBehavior`
- `exploitabilityJudgment`
- `finalSecurityVerdict`

S3 specifically needs these to be explicit `not_provided` values, not implicit omissions:

- `externalVulnerabilityKnowledge`
- `semanticGraphRetrieval`
- `runtimeBehavior`
- `exploitabilityJudgment`
- `finalSecurityVerdict`

### 3. Claims S3 must not support from S4 alone

S4 output alone must not support these claim types:

- project is safe / no vulnerability exists;
- no finding means no issue;
- no CVE exists for a dependency;
- dependency is affected or not affected by a CVE;
- runtime exploitability or reachability under real deployment input;
- semantic repository understanding equivalent to GraphRAG;
- complete dataflow when tool dataflow is missing or partial;
- complete caller-chain when structural graph parse/coverage is partial;
- dependency is unmodified when diff is not computed or unknown;
- architecture/compiler-specific safety when metadata/build context is partial;
- public risk score / final security verdict.

S4 may support local deterministic slots such as `sast_finding`, `source_location`, `sink_or_dangerous_api`, `structural caller/callee`, `build_context`, `target_metadata`, and `library_origin`, but S3 remains responsible for final claim lifecycle and quality outcome.

### 4. How to express when S5/GraphRAG/KB must not be skipped

S4 should not tell S3 "call S5" as a hard orchestration command, but it should emit missing-evidence/readiness signals that map cleanly to S3 follow-up acquisition.

Recommended shape:

```json
{
  "missingEvidence": [
    {
      "slot": "knowledge_context",
      "reason": "external_vulnerability_knowledge_not_provided_by_s4",
      "consumerImpact": "cannot classify CWE/CVE/CAPEC/ATTACK context from S4 alone",
      "suggestedAcquisition": {
        "owner": "s5",
        "surface": "target-context.acquire.threat-search"
      }
    },
    {
      "slot": "public_vulnerability",
      "reason": "sca_identity_ready_but_cve_knowledge_not_provided_by_s4",
      "suggestedAcquisition": {
        "owner": "s5",
        "surface": "target-context.acquire.cve"
      }
    }
  ]
}
```

S3 should preserve S5/GraphRAG/KB query whenever:

- accepted or candidate claim needs CWE/CVE/CAPEC/ATT&CK/mitigation/domain context;
- SCA item has enough identity/version input for CVE lookup;
- SCA version is unknown/ambiguous and S3 needs to record a non-negative diagnostic rather than no-hit;
- caller-chain/source slots remain missing after S4 structural graph and local source evidence;
- S4 codeGraph coverage is partial, failed, stale, or explicitly structural-only;
- the analysis is paper/evaluation quality and clean-pass requires contextual KB evidence;
- S4 emits any `do_not_use_as_negative_evidence` / missing-evidence / unknown-not-computed diagnostic relevant to a proposed claim.

### 5. Signals needed for S3 follow-up calls

S4 should emit a compact `followUpHints[]` or `missingEvidence[]` list. Each entry should include:

- `slot`: S3 evidence slot name, e.g. `caller_chain`, `source_slice`, `input_or_dataflow_path`, `knowledge_context`, `public_vulnerability`, `target_metadata`, `library_origin`;
- `status`: `missing`, `partial`, `unknown`, `not_computed`, `failed`, `not_provided`, `not_applicable`;
- `reasonCode`: stable machine code;
- `consumerPolicy`: especially `do_not_use_as_negative_evidence` where applicable;
- `recoverable`: boolean;
- `suggestedOwner`: `s3`, `s4`, `s5`, or `caller`;
- `suggestedSurface`: endpoint/tool name, if known;
- `scope`: file/function/library/buildUnit/buildSnapshot target;
- `inputNeeded`: bounded list of additional inputs if S4 cannot proceed.

This lets S3 choose between S4 follow-up, S5 acquisition, source read, or caveated/inconclusive outcome without hardcoding S4 implementation details.

### 6. Should S4 codeGraph be explicitly structural-only?

Yes. This is very useful to S3.

S4 codeGraph should carry an explicit declaration such as:

```json
{
  "codeGraph": {
    "graphKind": "structural-callgraph",
    "semanticRetrieval": "not_provided",
    "graphRag": "not_provided",
    "source": "clang-ast/static-extraction",
    "coverageStatus": "complete|partial|failed|unknown",
    "knownLimitations": ["function_pointer_targets_unresolved", "virtual_dispatch_static_type_only"]
  }
}
```

S3 can use S4 structural graph as local evidence, but S3 must not treat it as S5 semantic code GraphRAG or as proof that no relevant caller/path exists unless structural coverage is complete for the exact scope and the claim only needs structural evidence.

### 7. Should `cveLookupEligible` become more neutral?

Long-term, yes. S3 prefers neutral readiness fields over consumer-oriented booleans.

Recommended direction:

```json
{
  "vulnerabilityLookupInputReadiness": {
    "status": "ready|partial|not_ready|unknown",
    "reasons": ["name_present", "version_known", "repo_url_present", "version_unknown"],
    "requiredForPreciseLookup": ["name", "version"],
    "availableFields": ["name", "version", "repoUrl", "commit"]
  }
}
```

However, because S3 currently consumes `cveLookupEligible`, S4 should either:

1. keep `cveLookupEligible` as a derived compatibility projection until S3 switches, or
2. coordinate a one-track breaking update with S3 so S3 updates its CVE partitioning logic at the same time.

The important semantic rule is unchanged: `not_ready`, unknown version, ambiguous identity, or missing version is **not** a no-CVE/no-risk result.

### 8. Minimum C/C++ golden corpus / validation set

S3 wants Golden Corpus v1 to include four layers.

#### A. Contract oracle cases

- no verdict fields anywhere recursively: `vulnerable`, `safe`, `affected`, `clean`, `riskScore`, `securityVerdict`;
- every artifact has coverage/readiness status;
- `not_provided`, `not_computed`, `unknown`, `partial`, `failed` are not collapsed into empty/no-hit;
- tool omission allowed vs disallowed taxonomy;
- provenance/buildSnapshot/buildUnit echo;
- SAST/SCA/codeGraph/build evidence remains deterministic/idempotent.

#### B. Tool capability oracle cases

- each of the 6 tools has at least one expected positive contribution and one expected limitation/noise case;
- duplicate findings are measured, not hidden;
- unique contribution per CWE/family is tracked;
- runtime cost and determinism are measured.

#### C. Evidence bundle corpus

Minimum real-ish C/C++ cases:

- small CMake project with command injection (`system`/`popen`) and local source/sink evidence;
- Makefile project with multiple build targets;
- monorepo/MSA-like project with independent apps similar to gateway-style structure;
- vendored library with known version;
- vendored library with unknown/versionless identity;
- modified third-party library with diff known;
- diff not computed case with `DIFF_NOT_COMPUTED`;
- macro-heavy C/C++ include case;
- SDK-like non-registered include/sysroot/compiler profile case;
- C++ namespace/class/member call case;
- function pointer / virtual dispatch limitation case;
- cross-boundary user-code-to-third-party finding case;
- heavy analyzer degraded/timeout case.

#### D. Vulnerability-family canaries

At minimum:

- command injection / CWE-78;
- memory bounds / CWE-120/121/122/787 family;
- null dereference / CWE-476;
- integer overflow / CWE-190/680;
- use-after-free / CWE-416;
- hardcoded/default credential / CWE-798/259/321;
- unchecked return / CWE-252;
- uninitialized variable / CWE-457.

Juliet remains useful for tool recall, but it is not enough for S4 artifact-readiness and downstream-consumption correctness.

### 9. Are the three gates useful?

Yes. S3 wants these gates separated exactly because S3's public contract already separates task completion from clean quality pass.

S4 should distinguish:

1. **System Stability Gate**
   - Did S4 run/skip/fail honestly?
   - Are tool omissions and failures explicit?
   - Is provenance/schema valid?

2. **Evidence Readiness Gate**
   - Can downstream consumers interpret the artifact?
   - Which surfaces are partial/unknown/not-computed?
   - Which missing evidence slots remain?

3. **Quality Gate**
   - Is the artifact actually good enough for the C/C++ profile?
   - What are recall/precision/noise/tool-contribution/cost/determinism metrics?

System stability success must not imply evidence readiness, and evidence readiness must not imply quality sufficiency.

### 10. What should S4 do first?

S3 priority order:

1. **Coverage Contract v1 + Evidence Readiness Contract v1**
   - API/spec docs first.
   - Executable oracle tests before broad implementation.
   - Include no-verdict recursive guard and negative/unknown semantics.

2. **Golden Corpus v1 / validation harness**
   - Contract oracle + tool capability oracle + evidence bundle corpus.
   - Produce machine-readable quality reports that separate stability/readiness/quality.

3. **Tool Portfolio Governance v1**
   - Only after corpus exists, evaluate the 6-tool set for unique contribution, noise, determinism, runtime cost, and coverage gaps.
   - Do not add/remove tools by intuition before the evaluation harness can prove the effect.

## S3 minimum Coverage Contract shape

S3 proposes this minimum top-level additive block:

```json
{
  "staticEvidenceContract": {
    "schemaVersion": "s4-static-evidence-contract-v1",
    "analysisProfile": "c-cpp-core",
    "artifactKind": "s4-static-evidence-artifact",
    "producer": {
      "service": "s4-sast-runner",
      "version": "0.11.x"
    },
    "provenance": {
      "projectId": "...",
      "buildSnapshotId": "...",
      "buildUnitId": "...",
      "snapshotSchemaVersion": "..."
    },
    "gates": {
      "systemStability": {
        "status": "pass|fail|degraded",
        "reasons": []
      },
      "evidenceReadiness": {
        "status": "ready|partial|not_ready|unknown",
        "missingEvidence": []
      },
      "qualityEvaluation": {
        "status": "not_evaluated|pass|fail|partial",
        "profile": "golden-corpus-v1|null"
      }
    },
    "coverage": {
      "staticAnalysis": { "status": "provided" },
      "sastFindings": { "status": "provided|partial|not_ready|failed" },
      "buildContext": { "status": "provided|partial|not_provided|failed" },
      "structuralCodeGraph": { "status": "provided|partial|not_computed|failed" },
      "scaIdentity": { "status": "provided|partial|not_computed|failed" },
      "externalVulnerabilityKnowledge": { "status": "not_provided" },
      "semanticGraphRetrieval": { "status": "not_provided" },
      "runtimeBehavior": { "status": "not_provided" },
      "exploitabilityJudgment": { "status": "not_provided" },
      "finalSecurityVerdict": { "status": "not_provided" }
    },
    "claimBoundaries": {
      "maySupport": [],
      "mustNotSupportAlone": []
    },
    "followUpHints": []
  }
}
```

Recommended status vocabulary:

- `provided`
- `partial`
- `not_provided`
- `not_computed`
- `not_applicable`
- `unavailable`
- `failed`
- `unknown`

Every non-`provided` status should include stable `reasonCodes[]` and a `consumerPolicy`, especially `do_not_use_as_negative_evidence`.

## S3 consumer rules if S4 implements this

S3 will be able to map S4 output into its EvidenceCatalog as follows:

- `provided` local surfaces may become local evidence refs when they include source/target provenance.
- `partial`, `not_computed`, `unknown`, `unavailable`, `failed` become operational/evidence-readiness diagnostics.
- `externalVulnerabilityKnowledge=not_provided` preserves S5 ownership of CVE/KB/threat context.
- `semanticGraphRetrieval=not_provided` prevents S3 from treating S4 structural graph as GraphRAG.
- `finalSecurityVerdict=not_provided` reinforces S3 as final claim/evidence/quality owner.

## Implementation guardrails requested from S3

- Do not add S5 calls, LLM calls, or vulnerability verdict fields to S4 core.
- Keep S4 artifact deterministic and reproducible.
- Make absence/unknown/partial states explicit rather than omitting fields.
- Keep `metadata.evidenceResolution` and enriched SCA fields as evidence, not verdicts.
- Avoid project-specific rules for gateway-webserver, certificate-maker, TI SDK, or any hot dataset.
- Prefer oracle-backed schema/readiness work before tool-portfolio changes.

## Completion

S3 considers the S4 high-level direction correct and wants S4 to proceed with Coverage Contract v1, Evidence Readiness Contract v1, and Golden Corpus v1 as the next implementation planning unit. This reply is a conditional design acceptance, not a request for S4 to change S3 code directly.

## Completion expectation
- Recipient-side handling should be tracked through `complete_wr`.
- Runtime WR semantics apply only to canonical WR pages under `wiki/canon/work-requests/**`.

## Notes
- Archived WR files under `docs/work-requests/` are out-of-scope runtime inputs.
