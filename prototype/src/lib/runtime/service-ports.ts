import type { ActorContext } from '@/lib/contracts/actor-context';
import type { PropertyRecord } from '@/data/mock';
import { getPublicCompContextView, type PublicCompContextView } from '@/lib/runtime/public-comps';
import { getPublicPropertyView, type PublicPropertyView } from '@/lib/runtime/public-property';
import { getPublicReportView, getPublicExportDecision } from '@/lib/runtime/report-flow';
import {
  getStudioCompViews,
  getStudioDashboardView,
  getStudioDealView,
  getStudioReportBuilderView,
  getStudioScenarioView,
} from '@/lib/runtime/studio-workspace';
import { getPublicSearchProperties } from '@/lib/runtime/public-search';
import type { ExportPolicyDecision, ExportScope } from '@/lib/runtime/export-policy';
import {
  getDealNextAction,
  getDealStageProgress,
  type DealNextAction,
  type DealStageStatus,
  type DealWorkflowStage,
} from '@/lib/workflow/deal-stage-model';

export type RuntimeMode = 'fixture' | 'api';

export type PublicReportView = NonNullable<ReturnType<typeof getPublicReportView>>;
export type StudioDashboardView = ReturnType<typeof getStudioDashboardView>;
export type StudioDealView = NonNullable<ReturnType<typeof getStudioDealView>>;
export type StudioCompView = ReturnType<typeof getStudioCompViews>[number];
export type StudioReportBuilderView = NonNullable<ReturnType<typeof getStudioReportBuilderView>>;
export type StudioScenarioView = ReturnType<typeof getStudioScenarioView>;

export type PublicRuntimeServices = {
  searchProperties(query?: string): Promise<PropertyRecord[]>;
  getPropertyView(
    propertyId: string | undefined,
    actor?: ActorContext
  ): Promise<PublicPropertyView | undefined>;
  getCompContext(actor?: ActorContext, propertyId?: string): Promise<PublicCompContextView>;
  getReportView(
    propertyId: string | undefined,
    actor?: ActorContext
  ): Promise<PublicReportView | undefined>;
  evaluateExport(input: {
    propertyId: string;
    actor?: ActorContext;
    scope?: ExportScope;
    consent: boolean;
    idempotencyKey: string;
  }): Promise<ExportPolicyDecision | undefined>;
};

export type StudioRuntimeServices = {
  getDashboard(actor?: ActorContext): Promise<StudioDashboardView>;
  getDeal(dealId: string | undefined, actor?: ActorContext): Promise<StudioDealView | undefined>;
  getComps(actor?: ActorContext): Promise<StudioCompView[]>;
  getReportBuilder(
    dealId: string | undefined,
    actor?: ActorContext
  ): Promise<StudioReportBuilderView | undefined>;
  getScenarios(): Promise<StudioScenarioView>;
  getWorkflowProgress(dealId: string): Promise<Record<DealWorkflowStage, DealStageStatus>>;
  getNextAction(dealId: string): Promise<DealNextAction>;
};

export type RuntimeServices = {
  mode: RuntimeMode;
  public: PublicRuntimeServices;
  studio: StudioRuntimeServices;
};

export const fixtureRuntimeServices: RuntimeServices = {
  mode: 'fixture',
  public: {
    async searchProperties(query) {
      return getPublicSearchProperties(query);
    },
    async getPropertyView(propertyId, actor) {
      return getPublicPropertyView(propertyId, actor);
    },
    async getCompContext(actor, propertyId) {
      return getPublicCompContextView(actor, propertyId);
    },
    async getReportView(propertyId, actor) {
      return getPublicReportView(propertyId, actor);
    },
    async evaluateExport(input) {
      return getPublicExportDecision(input);
    },
  },
  studio: {
    async getDashboard(actor) {
      return getStudioDashboardView(actor);
    },
    async getDeal(dealId, actor) {
      return getStudioDealView(dealId, actor);
    },
    async getComps(actor) {
      return getStudioCompViews(actor);
    },
    async getReportBuilder(dealId, actor) {
      return getStudioReportBuilderView(dealId, actor);
    },
    async getScenarios() {
      return getStudioScenarioView();
    },
    async getWorkflowProgress(dealId) {
      return getDealStageProgress(dealId);
    },
    async getNextAction(dealId) {
      return getDealNextAction(dealId);
    },
  },
};
