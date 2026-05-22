# Sophex MVP0 Prototype Lane

Phase 1 clickable concept implementation. **Mock data only.** No schema, API, deploy, provider/send, queue, CRM, or sister-project runtime coupling.

## Location

- App: [`prototype/`](../prototype/)
- Runbook: [`prototype/README.md`](../prototype/README.md)

## What Was Made Real

| Layer | Path | Purpose |
| --- | --- | --- |
| Motion tokens | `prototype/src/lib/motion/` | Sophex-native durations, easing, specs, reduced-motion helper |
| Motion components | `prototype/src/components/motion/` | Surface, sheet, page transition |
| Trust UI | `prototype/src/components/ui/` | Stub banner, authority badges, stage rail |
| MVP0 screens | `prototype/src/pages/` | Landing, property, upload, comps, report, export gate |
| Mock data | `prototype/src/data/mock.ts` | Sample properties, comps, report sections |
| Tests | `prototype/src/test/motion.test.tsx` | Reduced-motion + motion metadata proof |

## Doctrine Sources (Docs Only)

Implementation follows Sophex docs, not copied sister-project code:

- [UX_MOTION_TO_SOPHEX_HARVEST_PACKET_AUTHORITATIVE.md](UX_MOTION_TO_SOPHEX_HARVEST_PACKET_AUTHORITATIVE.md)
- [P51_CRE_ANIMATION_TO_SOPHEX_HARVEST_PACKET_PROVISIONAL.md](P51_CRE_ANIMATION_TO_SOPHEX_HARVEST_PACKET_PROVISIONAL.md)
- [MOTION_AND_INTERACTION_GUIDELINES.md](MOTION_AND_INTERACTION_GUIDELINES.md)
- [SOPHEX_MVP0_SCREEN_MAP.md](SOPHEX_MVP0_SCREEN_MAP.md)
- [SOPHEX_TRUST_UI_GUIDELINES.md](SOPHEX_TRUST_UI_GUIDELINES.md)

## Run

```bash
cd prototype
npm install
npm run dev
```

## Still Future-Gated

- Real CRE/Fabricator APIs and contracts
- Database/schema and evidence persistence
- Production auth, org scope, permissions enforcement
- Real export/send/syndication
- Full operator moderation queue
- Authoritative reconciliation of P51 vs clean CRE SHA before promoting primitives to a shared package

## Promotion Path

When approved, extract `prototype/src/lib/motion` and shared UI primitives into a Sophex app package or design-system package. Do not import CRE/P51 repos directly.
