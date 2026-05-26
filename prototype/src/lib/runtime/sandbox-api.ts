import { fixtureActors } from '@/lib/contracts/fixtures';
import type { ActorContext } from '@/lib/contracts/actor-context';
import { createCandidateUpload } from '@/lib/runtime/upload-flow';
import { getReviewQueue } from '@/lib/runtime/review-queue';
import { getPublicSearchProperties } from '@/lib/runtime/public-search';
import { getPublicPropertyView } from '@/lib/runtime/public-property';
import { getPublicCompContextView } from '@/lib/runtime/public-comps';
import { getPublicReportView, getPublicExportDecision } from '@/lib/runtime/report-flow';
import type { ExportScope } from '@/lib/runtime/export-policy';
import {
  getStudioCompViews,
  getStudioDashboardView,
  getStudioDealView,
  getStudioReportBuilderView,
  getStudioScenarioView,
  getStudioSpatialWorkbenchView,
  getStudioSourceTraceView,
  getStudioUnderwritingView,
  getStudioValuationVersionsView,
} from '@/lib/runtime/studio-workspace';
import { getDealCockpitProjection } from '@/lib/workflow/cockpit-projection';
import { getDealNextAction, getDealStageProgress } from '@/lib/workflow/deal-stage-model';

export type SandboxApiSuccess<T> = {
  status: number;
  body: T;
};

export type SandboxApiError = {
  status: number;
  body: {
    error: {
      code: string;
      safeMessage: string;
      correlationId: string;
    };
  };
};

export type SandboxApiResponse<T = unknown> = SandboxApiSuccess<T> | SandboxApiError;

const IDEMPOTENCY_SIGNATURES = new Map<string, string>();

export function resetSandboxApiState(): void {
  IDEMPOTENCY_SIGNATURES.clear();
}

export async function handleSandboxApiRequest(request: Request): Promise<Response> {
  const result = await routeSandboxRequest(request);
  return jsonResponse(result.status, result.body);
}

export async function routeSandboxRequest(request: Request): Promise<SandboxApiResponse> {
  const url = new URL(request.url);
  const path = url.pathname.replace(/^\/sandbox\/v0/, '');
  const actor = readActorContext(request);

  if (request.method === 'GET' && path === '/health') {
    return ok({
      status: 'ok',
      boundary: 'synthetic-sandbox',
      productionData: false,
    });
  }

  if (request.method === 'GET' && path === '/properties') {
    return ok({ items: getPublicSearchProperties(url.searchParams.get('q') ?? undefined) });
  }

  const propertyMatch = path.match(/^\/properties\/([^/]+)$/);
  if (request.method === 'GET' && propertyMatch) {
    const view = getPublicPropertyView(propertyMatch[1], actor);
    return view ? ok(view) : safeError(404, 'not_found', 'Property was not found.');
  }

  const compsMatch = path.match(/^\/properties\/([^/]+)\/comps$/);
  if (request.method === 'GET' && compsMatch) {
    return ok(getPublicCompContextView(actor, compsMatch[1]));
  }

  if (request.method === 'POST' && path === '/uploads/candidates') {
    const body = await readJson<{
      actorContext?: ActorContext;
      propertyId?: string;
      fileName?: string;
      idempotencyKey?: string;
    }>(request);
    const requestActor = body.actorContext ?? actor;
    const idempotencyKey = readIdempotencyKey(request, body.idempotencyKey);
    if (!body.propertyId || !body.fileName || !idempotencyKey) {
      return safeError(400, 'invalid_request', 'Upload metadata is incomplete.');
    }
    if (!canCreateCandidateUpload(requestActor)) {
      return safeError(
        403,
        'visibility_denied',
        'This action is not available in the current view.'
      );
    }
    const conflict = recordIdempotency(
      idempotencyKey,
      `${requestActor.id}:upload:${body.propertyId}:${body.fileName}`
    );
    if (conflict) return conflict;
    return ok(
      createCandidateUpload({
        actor: requestActor,
        propertyId: body.propertyId,
        fileName: body.fileName,
        idempotencyKey,
      }),
      201
    );
  }

  if (request.method === 'GET' && path === '/review-queue') {
    if (actor.actorClass !== 'internal-operator') {
      return safeError(
        403,
        'visibility_denied',
        'This queue is not available in the current view.'
      );
    }
    return ok({ items: getReviewQueue(actor) });
  }

  if (request.method === 'GET' && path === '/studio/dashboard') {
    return ok(getStudioDashboardView(actor));
  }

  const studioDealMatch = path.match(/^\/studio\/deals\/([^/]+)$/);
  if (request.method === 'GET' && studioDealMatch) {
    const view = getStudioDealView(studioDealMatch[1], actor);
    return view ? ok(view) : safeError(404, 'not_found', 'Deal was not found.');
  }

  if (request.method === 'GET' && path === '/studio/comps') {
    return ok({ items: getStudioCompViews(actor) });
  }

  const reportBuilderMatch = path.match(/^\/studio\/deals\/([^/]+)\/report-builder$/);
  if (request.method === 'GET' && reportBuilderMatch) {
    const view = getStudioReportBuilderView(reportBuilderMatch[1], actor);
    return view ? ok(view) : safeError(404, 'not_found', 'Report builder view was not found.');
  }

  if (request.method === 'GET' && path === '/studio/scenarios') {
    return ok(getStudioScenarioView());
  }

  const underwritingMatch = path.match(/^\/studio\/deals\/([^/]+)\/underwriting$/);
  if (request.method === 'GET' && underwritingMatch) {
    const view = getStudioUnderwritingView(underwritingMatch[1], actor);
    return view ? ok(view) : safeError(404, 'not_found', 'Underwriting view was not found.');
  }

  const spatialMatch = path.match(/^\/studio\/deals\/([^/]+)\/spatial$/);
  if (request.method === 'GET' && spatialMatch) {
    const view = getStudioSpatialWorkbenchView(spatialMatch[1], actor);
    return view ? ok(view) : safeError(404, 'not_found', 'Spatial workbench view was not found.');
  }

  const versionsMatch = path.match(/^\/studio\/deals\/([^/]+)\/versions$/);
  if (request.method === 'GET' && versionsMatch) {
    const view = getStudioValuationVersionsView(versionsMatch[1], actor);
    return view ? ok(view) : safeError(404, 'not_found', 'Valuation versions view was not found.');
  }

  const sourceTraceMatch = path.match(/^\/studio\/deals\/([^/]+)\/source-trace$/);
  if (request.method === 'GET' && sourceTraceMatch) {
    const view = getStudioSourceTraceView(sourceTraceMatch[1], actor);
    return view ? ok(view) : safeError(404, 'not_found', 'Source trace view was not found.');
  }

  const workflowProgressMatch = path.match(/^\/studio\/deals\/([^/]+)\/workflow\/progress$/);
  if (request.method === 'GET' && workflowProgressMatch) {
    return ok({ progress: getDealStageProgress(workflowProgressMatch[1]) });
  }

  const workflowNextActionMatch = path.match(/^\/studio\/deals\/([^/]+)\/workflow\/next-action$/);
  if (request.method === 'GET' && workflowNextActionMatch) {
    return ok(getDealNextAction(workflowNextActionMatch[1]));
  }

  const cockpitMatch = path.match(/^\/studio\/deals\/([^/]+)\/cockpit$/);
  if (request.method === 'GET' && cockpitMatch) {
    const projection = getDealCockpitProjection(cockpitMatch[1], actor);
    return ok({
      ...projection,
      reviewSummary: projection.reviewSummary.visible
        ? projection.reviewSummary
        : { pendingCount: 0, highestTrustTier: null, visible: false },
    });
  }

  const reportMatch = path.match(/^\/reports\/([^/]+)$/);
  if (request.method === 'GET' && reportMatch) {
    const propertyId = reportMatch[1].replace(/^report-/, '');
    const view = getPublicReportView(propertyId, actor);
    return view ? ok(view) : safeError(404, 'not_found', 'Report was not found.');
  }

  if (request.method === 'POST' && path === '/exports') {
    const body = await readJson<{
      actorContext?: ActorContext;
      reportId?: string;
      propertyId?: string;
      scope?: ExportScope;
      consent?: boolean;
      idempotencyKey?: string;
    }>(request);
    const requestActor = body.actorContext ?? actor;
    const propertyId = body.propertyId ?? body.reportId?.replace(/^report-/, '');
    const idempotencyKey = readIdempotencyKey(request, body.idempotencyKey);
    if (!propertyId || !idempotencyKey) {
      return safeError(400, 'invalid_request', 'Export request metadata is incomplete.');
    }
    const scope = body.scope ?? 'download';
    const conflict = recordIdempotency(
      idempotencyKey,
      `${requestActor.id}:export:${propertyId}:${scope}:${Boolean(body.consent)}`
    );
    if (conflict) return conflict;
    const decision = getPublicExportDecision({
      propertyId,
      actor: requestActor,
      scope,
      consent: Boolean(body.consent),
      idempotencyKey,
    });
    return decision ? ok(decision) : safeError(404, 'not_found', 'Report was not found.');
  }

  return safeError(404, 'not_found', 'Sandbox endpoint was not found.');
}

function ok<T>(body: T, status = 200): SandboxApiSuccess<T> {
  return { status, body };
}

function safeError(status: number, code: string, safeMessage: string): SandboxApiError {
  return {
    status,
    body: {
      error: {
        code,
        safeMessage,
        correlationId: `corr_${Math.abs(hash(`${status}:${code}:${safeMessage}`)).toString(16)}`,
      },
    },
  };
}

function readActorContext(request: Request): ActorContext {
  const raw = request.headers.get('X-Sophex-Actor-Context');
  if (!raw) return fixtureActors.public;
  try {
    return JSON.parse(raw) as ActorContext;
  } catch {
    return fixtureActors.public;
  }
}

async function readJson<T>(request: Request): Promise<T> {
  try {
    return (await request.json()) as T;
  } catch {
    return {} as T;
  }
}

function readIdempotencyKey(request: Request, fallback?: string): string | undefined {
  return request.headers.get('Idempotency-Key') ?? fallback;
}

function canCreateCandidateUpload(actor: ActorContext): boolean {
  return [
    'free-contributor',
    'source-owner',
    'org-member',
    'org-admin',
    'internal-operator',
  ].includes(actor.actorClass);
}

function recordIdempotency(idempotencyKey: string, signature: string): SandboxApiError | undefined {
  const existing = IDEMPOTENCY_SIGNATURES.get(idempotencyKey);
  if (existing && existing !== signature) {
    return safeError(
      409,
      'idempotency_conflict',
      'This request key was already used for a different governed action.'
    );
  }
  IDEMPOTENCY_SIGNATURES.set(idempotencyKey, signature);
  return undefined;
}

function jsonResponse(status: number, body: unknown): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'content-type': 'application/json' },
  });
}

function hash(value: string): number {
  let next = 0;
  for (let index = 0; index < value.length; index += 1) {
    next = (next * 31 + value.charCodeAt(index)) | 0;
  }
  return next;
}
