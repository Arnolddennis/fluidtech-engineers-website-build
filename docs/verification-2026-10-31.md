# Verification — 31 October 2026

## Passed
- 12 Node tests: enquiry validation, return-state handling, catalogue consistency and comparison state/values.
- 3 Python test cases covering all 11 responsive image sets, all 9 PDFs and their product download links.
- 19 browser acceptance assertions at controlled 390 px and 1366 px document widths; initial 18 assertions also passed at 820 px. Desktop and tablet/mobile navigation regression branches pass.
- English, German, Spanish and French comparison rendering; no observed page overflow in inspected layouts.
- Translation coverage: 40 pages, 587 source strings, 599 entries per language.
- Local reference check: 40 pages, 3,181 references, no missing targets.
- All nine PDF pages rendered and visually inspected for clipped text, tables and images.
- Existing branding, all 29 clients, anniversary wording, current contact numbers and latest product photographs retained.
- Final diff review found no remaining actionable regression in the changed paths. No dependency installation or AI/API setup performed.

## Limits and launch blockers
The one authorised live FormSubmit test timed out. Notification receipt and customer acknowledgement remain unverified; connected mail access does not cover the destination inbox. No duplicate was sent. Client-side tests use mocked transport and do not establish real delivery.

Technical review verifies transcription, not machine performance. See technical-review.md for contradictory bead-mill source ranges and missing model data requiring engineering confirmation. English PDFs identify unpublished values and need the same engineering sign-off.

Image bytes: 11 source files total 12,487,862 bytes; largest responsive replacements total 1,067,650 bytes (91.5% reduction). This is an asset-size comparison, not a measured Core Web Vitals improvement.

Browser viewport overrides did not reliably resize an existing tab, so desktop/mobile regression checks used explicitly sized same-origin test frames. This is responsive browser QA, not a physical iPad device test.
