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
  getStudioSpatialWorkbenchView,
  getStudioSourceTraceView,
  getStudioUnderwritingView,
  getStudioValuationVersionsView,
  getStudioDataReviewView,
  getStudioDebtPanelView,
  getStudioDealIntakeView,
  getBrokerOsView,
} from '@/lib/runtime/studio-workspace';
import { getPublicSearchProperties } from '@/lib/runtime/public-search';
import { getPublicUploadGuideView } from '@/lib/runtime/public-upload';
import type { ExportPolicyDecision, ExportScope } from '@/lib/runtime/export-policy';
import {
  getDealCockpitProjection,
  type DealCockpitProjection,
} from '@/lib/workflow/cockpit-projection';
import {
  getDealNextAction,
  getDealStageProgress,
  type DealNextAction,
  type DealStageStatus,
  type DealWorkflowStage,
} from '@/lib/workflow/deal-stage-model';

export type RuntimeMode = 'fixture' | 'api';

export type PublicReportView = NonNullable<ReturnType<typeof getPublicReportView>>;
export type PublicUploadGuideView = ReturnType<typeof getPublicUploadGuideView>;
export type StudioDashboardView = ReturnType<typeof getStudioDashboardView>;
export type StudioDealView = NonNullable<ReturnType<typeof getStudioDealView>>;
export type StudioCompView = ReturnType<typeof getStudioCompViews>[number];
export type StudioReportBuilderView = NonNullable<ReturnType<typeof getStudioReportBuilderView>>;
export type StudioScenarioView = ReturnType<typeof getStudioScenarioView>;
export type StudioUnderwritingView = NonNullable<ReturnType<typeof getStudioUnderwritingView>>;
export type StudioSpatialWorkbenchView = NonNullable<
  ReturnType<typeof getStudioSpatialWorkbenchView>
>;
export type StudioValuationVersionsView = NonNullable<
  ReturnType<typeof getStudioValuationVersionsView>
>;
export type StudioSourceTraceView = NonNullable<ReturnType<typeof getStudioSourceTraceView>>;
export type StudioDataReviewView = NonNullable<ReturnType<typeof getStudioDataReviewView>>;
export type StudioDebtPanelView = NonNullable<ReturnType<typeof getStudioDebtPanelView>>;
export type StudioDealIntakeView = NonNullable<ReturnType<typeof getStudioDealIntakeView>>;
export type StudioBrokerOsView = ReturnType<typeof getBrokerOsView>;

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
  getUploadGuide(propertyId?: string): Promise<PublicUploadGuideView>;
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
  getUnderwriting(
    dealId: string | undefined,
    actor?: ActorContext
  ): Promise<StudioUnderwritingView | undefined>;
  getSpatialWorkbench(
    dealId: string | undefined,
    actor?: ActorContext
  ): Promise<StudioSpatialWorkbenchView | undefined>;
  getValuationVersions(
    dealId: string | undefined,
    actor?: ActorContext
  ): Promise<StudioValuationVersionsView | undefined>;
  getSourceTrace(
    dealId: string | undefined,
    actor?: ActorContext
  ): Promise<StudioSourceTraceView | undefined>;
  getDataReview(
    dealId: string | undefined,
    actor?: ActorContext
  ): Promise<StudioDataReviewView | undefined>;
  getDebtPanel(
    dealId: string | undefined,
    actor?: ActorContext
  ): Promise<StudioDebtPanelView | undefined>;
  getDealIntake(
    dealId: string | undefined,
    actor?: ActorContext
  ): Promise<StudioDealIntakeView | undefined>;
  getWorkflowProgress(dealId: string): Promise<Record<DealWorkflowStage, DealStageStatus>>;
  getNextAction(dealId: string): Promise<DealNextAction>;
  getCockpitProjection(
    dealId: string,
    actor?: ActorContext
  ): Promise<DealCockpitProjection>;
  getBrokerOs(): Promise<StudioBrokerOsView>;
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
    async getUploadGuide(propertyId) {
      return getPublicUploadGuideView(propertyId);
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
    async getUnderwriting(dealId, actor) {
      return getStudioUnderwritingView(dealId, actor);
    },
    async getSpatialWorkbench(dealId, actor) {
      return getStudioSpatialWorkbenchView(dealId, actor);
    },
    async getValuationVersions(dealId, actor) {
      return getStudioValuationVersionsView(dealId, actor);
    },
    async getSourceTrace(dealId, actor) {
      return getStudioSourceTraceView(dealId, actor);
    },
    async getDataReview(dealId, actor) {
      return getStudioDataReviewView(dealId, actor);
    },
    async getDebtPanel(dealId, actor) {
      return getStudioDebtPanelView(dealId, actor);
    },
    async getDealIntake(dealId, actor) {
      return getStudioDealIntakeView(dealId, actor);
    },
    async getWorkflowProgress(dealId) {
      return getDealStageProgress(dealId);
    },
    async getNextAction(dealId) {
      return getDealNextAction(dealId);
    },
    async getCockpitProjection(dealId, actor) {
      return getDealCockpitProjection(dealId, actor);
    },
    async getBrokerOs() {
      return getBrokerOsView();
    },
  },
};
