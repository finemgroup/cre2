# Sophex MVP0 Prototype

Phase 1 clickable concept for Sophex — mock data only, no backend, schema, deploy, or sister-project runtime coupling.

## What this is

- Sophex-native motion layer derived from CRE/P51 doctrine (`src/lib/motion`, `src/components/motion`)
- Six MVP0 screens from `docs/SOPHEX_MVP0_SCREEN_MAP.md`
- Non-production banner on every route
- Authority badges, stage rails, evidence drawer, export gate with blocked state
- Vitest coverage for reduced-motion flattening and motion metadata

## What this is not

- Not production Sophex
- Not a copy of CRE/P51 source code
- No real data, APIs, queues, provider/send, CRM, or export automation

## Run locally

```bash
cd prototype
npm install
npm run dev
```

Open the URL Vite prints (default `http://localhost:5173`).

## Commands

```bash
npm run build   # typecheck + production bundle
npm test        # motion/accessibility unit tests
```

## Sister-project references

Motion doctrine comes from Sophex docs only:

- `docs/UX_MOTION_TO_SOPHEX_HARVEST_PACKET_AUTHORITATIVE.md`
- `docs/P51_CRE_ANIMATION_TO_SOPHEX_HARVEST_PACKET_PROVISIONAL.md`
- `docs/MOTION_AND_INTERACTION_GUIDELINES.md`

Implementation is recreated in Sophex-native primitives — not imported from CRE/P51 repos.
