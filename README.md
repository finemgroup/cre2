# Sophex Marketplace and Content Engine

Sophex is a public-facing commercial real estate intelligence marketplace.
It is intended to support property intelligence, contributed comps, document-backed valuation, and reporting products.
Sophex is a separate product and external trust boundary from the CRE Platform.
Sophex is aligned with the CRE Platform and Finem Fabricator, but it does not own, fork, or copy their production data.
The CRE Platform remains the governed internal substrate for canonical evidence, observations, audit, idempotency, and correlation.
Finem Fabricator remains a workflow and agent factory, not the Sophex data owner.
Sophex should later integrate with CRE through approved APIs and contracts instead of direct production coupling.
Uploaded documents and user-entered facts are evidence, not automatic canonical truth.
Field values should resolve from permissioned observations, so different actors may see different latest permitted values.
The setup phase is documentation-first and creates the boundary for future product work.
See [docs/INDEX.md](docs/INDEX.md) for the full setup packet.

## Repository Status

- **GitHub remote:** [finemgroup/cre2](https://github.com/finemgroup/cre2)
- **Project identity:** Sophex Marketplace and Content Engine
- **Current status:** docs/control-plane setup — sister-project harvest integration complete; no runtime, schema, or deploy implementation authorized
- **Branch:** `master` tracking `origin/master`
- **Local-only (untracked):** `Content Engine/` reference folder — not pushed

No schema/runtime implementation is authorized by this setup packet.
