import { lazy } from 'react';
import { Route, Routes } from 'react-router-dom';
import type { ReactElement } from 'react';

import { LazyPage } from '@/components/layout/LazyPage';
import { PrototypeToastProvider } from '@/components/overlays/PrototypeToast';
import { PublicShell } from '@/components/layout/PublicShell';
import { StudioAppShell } from '@/components/layout/StudioAppShell';
import { StudioStandaloneShell } from '@/components/layout/StudioStandaloneShell';
import { DealWorkflowLayout } from '@/components/layout/DealWorkflowLayout';

const LandingPage = lazy(() =>
  import('@/pages/LandingPage').then((module) => ({ default: module.LandingPage }))
);
const PropertyPage = lazy(() =>
  import('@/pages/PropertyPage').then((module) => ({ default: module.PropertyPage }))
);
const UploadPage = lazy(() =>
  import('@/pages/UploadPage').then((module) => ({ default: module.UploadPage }))
);
const CompsPage = lazy(() =>
  import('@/pages/CompsPage').then((module) => ({ default: module.CompsPage }))
);
const ReportPage = lazy(() =>
  import('@/pages/ReportPage').then((module) => ({ default: module.ReportPage }))
);
const ExportPage = lazy(() =>
  import('@/pages/ExportPage').then((module) => ({ default: module.ExportPage }))
);
const NotFoundPage = lazy(() =>
  import('@/pages/NotFoundPage').then((module) => ({ default: module.NotFoundPage }))
);

const StudioLandingPage = lazy(() =>
  import('@/pages/studio/MarketingRoutes').then((module) => ({ default: module.StudioLandingPage }))
);
const StudioOnboardingPage = lazy(() =>
  import('@/pages/studio/MarketingRoutes').then((module) => ({
    default: module.StudioOnboardingPage,
  }))
);
const StudioPricingPage = lazy(() =>
  import('@/pages/studio/MarketingRoutes').then((module) => ({ default: module.StudioPricingPage }))
);
const StudioDashboardPage = lazy(() =>
  import('@/pages/studio/DealRoutes').then((module) => ({ default: module.StudioDashboardPage }))
);
const StudioDealIntakeRedirect = lazy(() =>
  import('@/pages/studio/StudioDealIntakeRedirect').then((module) => ({
    default: module.StudioDealIntakeRedirect,
  }))
);
const StudioDealIntakePage = lazy(() =>
  import('@/pages/studio/DealRoutes').then((module) => ({ default: module.StudioDealIntakePage }))
);
const StudioDataReviewPage = lazy(() =>
  import('@/pages/studio/DealRoutes').then((module) => ({ default: module.StudioDataReviewPage }))
);
const StudioDealOverviewPage = lazy(() =>
  import('@/pages/studio/DealRoutes').then((module) => ({
    default: module.StudioDealOverviewPage,
  }))
);
const StudioCompsPage = lazy(() =>
  import('@/pages/studio/DealRoutes').then((module) => ({ default: module.StudioCompsPage }))
);
const StudioUnderwritingPage = lazy(() =>
  import('@/pages/studio/DealRoutes').then((module) => ({
    default: module.StudioUnderwritingPage,
  }))
);
const StudioAssumptionSourceTracePage = lazy(() =>
  import('@/pages/studio/DealRoutes').then((module) => ({
    default: module.StudioAssumptionSourceTracePage,
  }))
);
const StudioDebtPanelPage = lazy(() =>
  import('@/pages/studio/DealRoutes').then((module) => ({ default: module.StudioDebtPanelPage }))
);
const StudioScenarioComparisonPage = lazy(() =>
  import('@/pages/studio/DealRoutes').then((module) => ({
    default: module.StudioScenarioComparisonPage,
  }))
);
const StudioValuationVersionTimelinePage = lazy(() =>
  import('@/pages/studio/DealRoutes').then((module) => ({
    default: module.StudioValuationVersionTimelinePage,
  }))
);
const StudioCapitalStackPage = lazy(() =>
  import('@/pages/studio/DesignReferenceRoutes').then((module) => ({
    default: module.StudioCapitalStackPage,
  }))
);
const StudioIcPacketPage = lazy(() =>
  import('@/pages/studio/DesignReferenceRoutes').then((module) => ({
    default: module.StudioIcPacketPage,
  }))
);
const StudioHitlReviewPage = lazy(() =>
  import('@/pages/studio/DesignReferenceRoutes').then((module) => ({
    default: module.StudioHitlReviewPage,
  }))
);
const StudioSpatialWorkbenchPage = lazy(() =>
  import('@/pages/studio/GisRoutes').then((module) => ({
    default: module.StudioSpatialWorkbenchPage,
  }))
);
const StudioReportBuilderPage = lazy(() =>
  import('@/pages/studio/ReportRoutes').then((module) => ({
    default: module.StudioReportBuilderPage,
  }))
);
const StudioWhiteLabelPage = lazy(() =>
  import('@/pages/studio/ReportRoutes').then((module) => ({
    default: module.StudioWhiteLabelPage,
  }))
);
const StudioBrokerOsPage = lazy(() =>
  import('@/pages/studio/OperatorRoutes').then((module) => ({ default: module.StudioBrokerOsPage }))
);
const StudioDesignSystemPage = lazy(() =>
  import('@/pages/studio/DesignSystemRoutes').then((module) => ({
    default: module.StudioDesignSystemPage,
  }))
);

export default function App(): ReactElement {
  return (
    <PrototypeToastProvider>
      <Routes>
        <Route element={<PublicShell />}>
          <Route index element={<LazyPage page={LandingPage} />} />
          <Route path="property/:id" element={<LazyPage page={PropertyPage} />} />
          <Route path="property/:id/comps" element={<LazyPage page={CompsPage} />} />
          <Route path="upload" element={<LazyPage page={UploadPage} />} />
          <Route path="comps" element={<LazyPage page={CompsPage} />} />
          <Route path="report/:id" element={<LazyPage page={ReportPage} />} />
          <Route path="export/:id" element={<LazyPage page={ExportPage} />} />
          <Route path="*" element={<LazyPage page={NotFoundPage} />} />
        </Route>
        <Route path="studio" element={<StudioAppShell />}>
          <Route index element={<LazyPage page={StudioLandingPage} />} />
          <Route path="dashboard" element={<LazyPage page={StudioDashboardPage} />} />
          <Route path="onboarding" element={<LazyPage page={StudioOnboardingPage} />} />
          <Route path="deal-intake" element={<LazyPage page={StudioDealIntakeRedirect} />} />
          <Route path="deals/:dealId" element={<DealWorkflowLayout />}>
            <Route index element={<LazyPage page={StudioDealOverviewPage} />} />
            <Route path="intake" element={<LazyPage page={StudioDealIntakePage} />} />
            <Route path="data-review" element={<LazyPage page={StudioDataReviewPage} />} />
            <Route path="comps" element={<LazyPage page={StudioCompsPage} />} />
            <Route path="underwriting" element={<LazyPage page={StudioUnderwritingPage} />} />
            <Route
              path="underwriting/sources"
              element={<LazyPage page={StudioAssumptionSourceTracePage} />}
            />
            <Route path="underwriting/debt" element={<LazyPage page={StudioDebtPanelPage} />} />
            <Route path="scenarios" element={<LazyPage page={StudioScenarioComparisonPage} />} />
            <Route
              path="versions"
              element={<LazyPage page={StudioValuationVersionTimelinePage} />}
            />
            <Route path="capital-stack" element={<LazyPage page={StudioCapitalStackPage} />} />
            <Route path="ic-packet" element={<LazyPage page={StudioIcPacketPage} />} />
            <Route path="hitl-review" element={<LazyPage page={StudioHitlReviewPage} />} />
            <Route path="spatial" element={<LazyPage page={StudioSpatialWorkbenchPage} />} />
          </Route>
          <Route path="settings/billing" element={<LazyPage page={StudioPricingPage} />} />
          <Route path="settings/white-label" element={<LazyPage page={StudioWhiteLabelPage} />} />
          <Route path="design-system" element={<LazyPage page={StudioDesignSystemPage} />} />
          <Route path="broker-os" element={<LazyPage page={StudioBrokerOsPage} />} />
        </Route>
        <Route path="studio/reports" element={<StudioStandaloneShell />}>
          <Route path=":dealId/builder" element={<LazyPage page={StudioReportBuilderPage} />} />
          <Route path="*" element={<LazyPage page={NotFoundPage} />} />
        </Route>
      </Routes>
    </PrototypeToastProvider>
  );
}
