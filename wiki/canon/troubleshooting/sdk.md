---
title: "SDK Registration Troubleshooting"
page_type: "canonical-runbook"
canonical: true
source_refs:
  - "services/backend/src/services/sdk.service.ts"
last_verified: "2026-04-25"
service_tags: ["s2"]
decision_tags: []
related_pages: ["wiki/canon/api/shared-models.md", "wiki/canon/handoff/s2/api-endpoints.md"]
---

# SDK Registration Troubleshooting

Canonical S2 troubleshooting anchors for `sdk-error.troubleshootingUrl`.

S2 returns `troubleshootingUrl` as a wiki-canonical anchor path shaped like:

```text
wiki/canon/troubleshooting/sdk#<sdk-error-code-kebab-case>
```

S1 may route this to its own help UI or render it as a documentation link. These anchors intentionally summarize remediation without exposing server internals.

## upload-invalid-input

The multipart request was invalid or incomplete.

Recommended user action: verify that `name` is present and at least one `file` part is attached, then upload again.

## extract-archive-empty

The uploaded archive had no entries.

Recommended user action: choose a non-empty SDK archive.

## extract-unsafe-entry

The archive or folder upload contained a path that escapes the SDK root.

Recommended user action: rebuild the archive without absolute paths, drive-letter paths, or `..` traversal entries.

## extract-failed

S2 could not inspect or extract the archive.

Recommended user action: verify the archive format (`.zip`, `.tar`, `.tar.gz`, `.tgz`) and re-upload a valid SDK package.

## install-etxtbsy

The uploaded installer was still busy after upload.

Recommended user action: retry after the upload fully completes, or re-upload the installer.

## install-process-failed

The `.bin` installer exited with a non-zero status.

Recommended user action: open/download the install log and check installer stdout/stderr. If needed, retry or upload a corrected installer.

## install-timeout

The installer exceeded S2's install timeout.

Recommended user action: inspect the install log for stalled prompts or long-running steps, then retry with an unattended-compatible installer.

## verify-path-escaped

The resolved SDK path escaped the managed uploads root.

Recommended user action: repackage the SDK so all files remain under the SDK root.

## verify-path-missing

The expected materialized SDK path does not exist.

Recommended user action: re-upload or retry only if the SDK row reports `retryable: true`.

## verify-content-empty

The materialized SDK directory has no visible content.

Recommended user action: upload a non-empty SDK package.

## verify-profile-path-invalid

S2 or Build Agent metadata referenced a path outside/missing from the materialized SDK root.

Recommended user action: inspect detected profile metadata and retry analysis/verification if the retained artifact is retryable; otherwise re-upload.

## analyze-unavailable

Build Agent SDK analysis was unavailable.

Recommended user action: S2 currently continues with inferred metadata when possible. Retry analysis if profile metadata is incomplete.

## retry-unsupported-phase

The requested retry phase is unsupported.

Recommended user action: use `fromPhase: "verifying"` or `fromPhase: "analyzing"`.

## retry-quota-exceeded

The SDK row exceeded its retry limit.

Recommended user action: upload a fresh SDK package.

## retry-cooldown-active

The SDK row is still inside the retry cooldown window.

Recommended user action: wait until cooldown expires and try again.

## retry-artifact-unavailable

The failed SDK's retained materialized artifact is no longer available.

Recommended user action: upload a fresh SDK package.

## unknown-sdk-error

An unexpected SDK registration error occurred.

Recommended user action: download the install log if available, then retry or report the SDK id and request id to S2 maintainers.
