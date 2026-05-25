# Staging Deploy And Hardening Checklist

**Purpose:** Define the staging path for the live functionality push. This checklist does not authorize production deploys, provider sends, queues, real document storage, or schema migrations.

## Staging Target

| Area             | Requirement                                                                                       | Initial status               |
| ---------------- | ------------------------------------------------------------------------------------------------- | ---------------------------- |
| Frontend mode    | `VITE_SOPHEX_RUNTIME_MODE=api` for API-backed rehearsal; `fixture` remains the default local mode | Configured in `.env.example` |
| API base URL     | `VITE_SOPHEX_API_BASE_URL` points to the approved sandbox API origin                              | Pending target selection     |
| Data posture     | Synthetic or approved schema-backed staging data only                                             | Synthetic first              |
| Public exposure  | Controlled staging/preview until launch gates are cleared                                         | Pending approval             |
| Real uploads     | Disabled until contribution terms and file safety clear                                           | Blocked                      |
| Export artifacts | Receipt-only/blocker-only until consent, section review, and source-rights gates clear            | Blocked                      |

## Minimum CI Gates Before Staging

| Gate           | Command or check                                        | Required result                     |
| -------------- | ------------------------------------------------------- | ----------------------------------- |
| TypeScript     | `npm run typecheck` from `prototype/`                   | Pass                                |
| Lint           | `npm run lint` from `prototype/`                        | Pass                                |
| Formatting     | `npm run format:check` from `prototype/`                | Pass                                |
| Unit/API tests | `npm run test` and `npm run test:api` from `prototype/` | Pass                                |
| Build          | `npm run build` from `prototype/`                       | Pass                                |
| Bundle budget  | `npm run budget:check` from `prototype/`                | Pass                                |
| E2E smoke      | `npm run test:e2e` from `prototype/`                    | Pass or documented flake with rerun |
| Lighthouse     | `npm run test:lighthouse` from `prototype/`             | Pass thresholds                     |

## Security And Privacy Gates

| Gate               | Initial implementation expectation                                                           |
| ------------------ | -------------------------------------------------------------------------------------------- |
| Secret scanning    | No committed `.env`; no real keys in docs, tests, or generated artifacts                     |
| Dependency audit   | Run before public staging and review high/critical findings                                  |
| Safe errors        | API responses use safe envelopes without private field values                                |
| Permission tests   | Anonymous/source-owner/org/paid/operator/partner fixture matrix covered at API level         |
| Idempotency        | Governed writes require `Idempotency-Key` and fail closed on conflict                        |
| Headers            | Staging host must set CSP, frame, referrer, content-type, and permissions policies           |
| Observability      | Logs use correlation ids and redacted event labels only                                      |
| Incident readiness | Security contact, privacy request path, and rollback owner identified before public exposure |

## Staging Smoke Tests

1. Search returns public baseline property cards.
2. Property detail excludes private rent roll, org survey, provider payloads, and source-owner ids for anonymous actors.
3. Candidate upload endpoint creates metadata-only evidence and receipt for a source owner.
4. Review queue is denied to public actors and visible to internal operators only.
5. Report endpoint returns source bundle posture without hidden facts.
6. Export endpoint returns a receipt or blocked receipt; replay returns the same receipt and conflict fails closed.
7. UI in `api` mode shows loading/error states without removing mock-boundary banners from gated surfaces.

## Production Go/No-Go

Production exposure requires a separate approval after:

- Sister schema harvest and any schema-backed repository mapping are reviewed.
- Security/privacy launch gates are marked ready for the exact exposed surfaces.
- Deploy target, rollback path, secret management, observability, and incident runbooks are confirmed.
- Provider, upload, export, queue, and outbound capabilities remain disabled unless their specific gates clear.
