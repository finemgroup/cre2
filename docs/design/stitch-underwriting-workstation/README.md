# Stitch Underwriting Workstation Artifacts

This folder preserves Google Stitch outputs for the Finem CRE Studio / Sophex underwriting workstation.

## Contents

- `wave-1/screenshots/`: first Stitch batch screenshots for executive cockpit, assumption source trace, data normalization, and debt assumptions.
- `wave-1/raw-html/`: raw generated Stitch HTML captured from the conversation transcript.
- `wave-2/screenshots/`: second Stitch batch screenshots for scenario/version/report governance pages and modal/drawer states.
- `wave-2/raw-html/`: raw generated Stitch HTML captured from the conversation transcript.
- `QUALITY_REVIEW.md`: design-quality review, adaptation notes, and prototype implementation priorities.

## Boundary

These artifacts are design references. Do not copy the generated HTML directly into `prototype/`: it includes Tailwind CDN setup, duplicate font links, static external image URLs, and generated utility markup. Adapt accepted ideas into existing React components, mock fixtures, CSS tokens, and trust vocabulary.
