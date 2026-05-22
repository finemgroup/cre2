# Sophex Agent Instructions

This project is the Sophex separate product setup lane. Treat it as a public-facing CRE intelligence and valuation marketplace with its own external trust boundary.

## Operating Rules

- No worktrees.
- One lane equals one branch equals one scope equals one PR.
- `master` is the default branch for this new local project shell unless a later remote policy changes it.
- This setup phase is docs-only unless later explicitly authorized.
- Cross-project harvest work may update markdown doctrine, contracts, UX guidance, sister-project source maps, conceptual contracts, MVP0 screen maps, trust UI guidelines, and open questions only.
- Do not implement application runtime code.
- Do not create database schema, migrations, Prisma changes, generated clients, or destructive DDL.
- Do not run deploys, production services, provider sends, queue workers, or production database commands.
- Do not connect this repo to any CRE or Finem Fabricator remote.
- Do not copy secrets.
- Do not edit CRE production, CRE schema lanes, Fabricator runtime lanes, R2/Docling, MotherDuck/vector runtime, provider/send context, queue/Dragonfly, or deploy contexts from this project.
- Use explicit path staging only. Never use `git add -A` for this lane.
- Do not stage or commit untracked source/reference material, including `Content Engine/`, unless the operator explicitly includes those paths.
- Authoritative sister-project harvests must come from clean source checkouts at the expected branch and upstream HEAD. Stale or dirty-source harvest packets are provisional archives only.

## Stop Conditions

Stop and ask for operator direction if:

- The repo path or cloud workspace is unclear.
- The branch, HEAD, origin/default, or cleanliness cannot be confirmed.
- The checkout has dirty unexpected files.
- The request touches schema, migrations, deploys, providers, queues, production services, or production data.
- The request requires private data handling terms that are not documented.
- The request creates remote confusion or suggests connecting to a CRE/Fabricator remote.
- Secret-like filenames or private data handling are ambiguous.
- A task would require edits outside Sophex setup docs/rules files.
- A request asks to turn conceptual schema docs into Prisma, SQL, migrations, generated clients, or runtime data models.

## Allowed Files In This Packet

The approved setup packet may create or update `README.md`, `AGENTS.md`, `DECISIONS.md`, files under `docs/`, and concise project rules under `.cursor/rules/`.
