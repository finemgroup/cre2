# Permission Test Fixtures

This document maps prototype fixture actors and facts to future sandbox API tests.
It is documentation only and contains no schema, migrations, or production data.

## Actors

| Fixture | Actor class | Purpose |
| --- | --- | --- |
| `actor-public` | Anonymous public user | Public baseline search and report preview. |
| `actor-free` | Free contributor | Upload/contribution exchange. |
| `actor-paid` | Paid/private user | Premium feature access without bypassing source rights. |
| `actor-source-owner` | Source owner | Private uploaded evidence visibility. |
| `actor-org-member` | Organization member | Org-private report/evidence visibility. |
| `actor-org-admin` | Organization admin | Plan/entitlement and org-scoped workflows. |
| `actor-operator` | Internal operator | Review queue and moderation. |
| `actor-partner` | Partner/API consumer | Contract-scoped redacted access. |

## Facts

| Fixture | Sensitivity | Expected behavior |
| --- | --- | --- |
| Public cap rate | Public baseline | Visible to all actors. |
| Private rent roll cap rate | User-private | Visible only to source owner and internal operator. |
| Org survey acreage | Organization-private | Visible only to matching org and internal operator. |
| Provider comp cap rate | Provider-restricted | Visible only with provider entitlement/scope or internal operator. |
| Candidate evidence | Candidate/private | Never public until explicit review and policy allow. |
| Blocked export source | Source-rights blocked | Produces blocker receipt, not artifact success. |
| Redacted receipt | Public-safe audit projection | Hides private evidence ids and raw payload names. |

## Required Future API Tests

- Anonymous public property response does not contain private rent roll strings.
- Source owner evidence response contains their candidate upload metadata.
- Org member report response contains org-private source where policy allows.
- Paid user cannot access provider-restricted source without source-rights policy.
- Internal operator review queue returns candidate evidence.
- Partner API response excludes fields outside partner scope.
- Export replay with same idempotency key returns same receipt.
- Analytics payload validator rejects raw private values and forbidden keys.
