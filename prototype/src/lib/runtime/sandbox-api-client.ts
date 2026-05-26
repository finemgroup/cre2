import { fixtureActors } from '@/lib/contracts/fixtures';
import type { ActorContext } from '@/lib/contracts/actor-context';
import type { PropertyRecord } from '@/data/mock';
import type { PublicPropertyView } from '@/lib/runtime/public-property';
import type { PublicCompContextView } from '@/lib/runtime/public-comps';
import type {
  PublicReportView,
  RuntimeServices,
  StudioCompView,
  StudioDashboardView,
  StudioDealView,
  StudioReportBuilderView,
  StudioScenarioView,
  StudioUnderwritingView,
  StudioSpatialWorkbenchView,
  StudioSourceTraceView,
  StudioValuationVersionsView,
} from '@/lib/runtime/service-ports';
import type { DealCockpitProjection } from '@/lib/workflow/cockpit-projection';
import type { DealNextAction, DealStageStatus, DealWorkflowStage } from '@/lib/workflow/deal-stage-model';
import type { ExportPolicyDecision } from '@/lib/runtime/export-policy';
import { handleSandboxApiRequest } from '@/lib/runtime/sandbox-api';

export type SandboxClientOptions = {
  baseUrl?: string;
};

export function createSandboxApiRuntimeServices(
  options: SandboxClientOptions = {}
): RuntimeServices {
  const client = new SandboxApiClient(options);

  return {
    mode: 'api',
    public: {
      async searchProperties(query) {
        const response = await client.get<{ items: PropertyRecord[] }>('/properties', {
          query: query ? { q: query } : undefined,
        });
        return response.items;
      },
      async getPropertyView(propertyId, actor) {
        if (!propertyId) return undefined;
        return client.get<PublicPropertyView>(`/properties/${propertyId}`, { actor });
      },
      async getCompContext(actor, propertyId = 'demo-001') {
        return client.get<PublicCompContextView>(`/properties/${propertyId}/comps`, { actor });
      },
      async getReportView(propertyId, actor) {
        if (!propertyId) return undefined;
        return client.get<PublicReportView>(`/reports/report-${propertyId}`, { actor });
      },
      async evaluateExport(input) {
        return client.post<ExportPolicyDecision>('/exports', {
          actor: input.actor,
          idempotencyKey: input.idempotencyKey,
          body: {
            actorContext: input.actor ?? fixtureActors.public,
            propertyId: input.propertyId,
            reportId: `report-${input.propertyId}`,
            scope: input.scope ?? 'download',
            consent: input.consent,
            idempotencyKey: input.idempotencyKey,
          },
        });
      },
    },
    studio: {
      async getDashboard(actor) {
        return client.get<StudioDashboardView>('/studio/dashboard', { actor });
      },
      async getDeal(dealId, actor) {
        if (!dealId) return undefined;
        return client.get<StudioDealView>(`/studio/deals/${dealId}`, { actor });
      },
      async getComps(actor) {
        const response = await client.get<{ items: StudioCompView[] }>('/studio/comps', { actor });
        return response.items;
      },
      async getReportBuilder(dealId, actor) {
        if (!dealId) return undefined;
        return client.get<StudioReportBuilderView>(`/studio/deals/${dealId}/report-builder`, {
          actor,
        });
      },
      async getScenarios() {
        return client.get<StudioScenarioView>('/studio/scenarios');
      },
      async getUnderwriting(dealId, actor) {
        if (!dealId) return undefined;
        return client.get<StudioUnderwritingView>(`/studio/deals/${dealId}/underwriting`, {
          actor,
        });
      },
      async getSpatialWorkbench(dealId, actor) {
        if (!dealId) return undefined;
        return client.get<StudioSpatialWorkbenchView>(`/studio/deals/${dealId}/spatial`, {
          actor,
        });
      },
      async getValuationVersions(dealId, actor) {
        if (!dealId) return undefined;
        return client.get<StudioValuationVersionsView>(`/studio/deals/${dealId}/versions`, {
          actor,
        });
      },
      async getSourceTrace(dealId, actor) {
        if (!dealId) return undefined;
        return client.get<StudioSourceTraceView>(`/studio/deals/${dealId}/source-trace`, {
          actor,
        });
      },
      async getWorkflowProgress(dealId) {
        const response = await client.get<{ progress: Record<DealWorkflowStage, DealStageStatus> }>(
          `/studio/deals/${dealId}/workflow/progress`
        );
        return response.progress;
      },
      async getNextAction(dealId) {
        return client.get<DealNextAction>(`/studio/deals/${dealId}/workflow/next-action`);
      },
      async getCockpitProjection(dealId, actor) {
        return client.get<DealCockpitProjection>(`/studio/deals/${dealId}/cockpit`, { actor });
      },
    },
  };
}

class SandboxApiClient {
  private readonly baseUrl?: string;

  constructor(options: SandboxClientOptions) {
    this.baseUrl = options.baseUrl?.replace(/\/$/, '');
  }

  async get<T>(
    path: string,
    options: { actor?: ActorContext; query?: Record<string, string> } = {}
  ): Promise<T> {
    const request = this.createRequest(path, {
      actor: options.actor,
      query: options.query,
    });
    return this.send<T>(request);
  }

  async post<T>(
    path: string,
    options: { actor?: ActorContext; idempotencyKey?: string; body: unknown }
  ): Promise<T> {
    const request = this.createRequest(path, {
      actor: options.actor,
      idempotencyKey: options.idempotencyKey,
      init: {
        method: 'POST',
        body: JSON.stringify(options.body),
      },
    });
    return this.send<T>(request);
  }

  private createRequest(
    path: string,
    options: {
      actor?: ActorContext;
      idempotencyKey?: string;
      query?: Record<string, string>;
      init?: RequestInit;
    }
  ): Request {
    const url = new URL(`${this.baseUrl ?? 'http://sophex.local'}/sandbox/v0${path}`);
    Object.entries(options.query ?? {}).forEach(([key, value]) => {
      url.searchParams.set(key, value);
    });
    const headers = new Headers(options.init?.headers);
    headers.set('content-type', 'application/json');
    if (options.actor) headers.set('X-Sophex-Actor-Context', JSON.stringify(options.actor));
    if (options.idempotencyKey) headers.set('Idempotency-Key', options.idempotencyKey);
    return new Request(url, {
      ...options.init,
      headers,
    });
  }

  private async send<T>(request: Request): Promise<T> {
    const response = this.baseUrl ? await fetch(request) : await handleSandboxApiRequest(request);
    const body = (await response.json()) as T | SandboxErrorBody;
    if (!response.ok) {
      const safeMessage =
        isSandboxErrorBody(body) && body.error?.safeMessage
          ? body.error.safeMessage
          : 'Sandbox API request failed.';
      throw new Error(safeMessage);
    }
    return body as T;
  }
}

type SandboxErrorBody = {
  error?: {
    safeMessage: string;
  };
};

function isSandboxErrorBody(value: unknown): value is SandboxErrorBody {
  return typeof value === 'object' && value !== null && 'error' in value;
}
