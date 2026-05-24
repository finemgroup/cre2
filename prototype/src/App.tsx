import { lazy } from 'react';
import { Route, Routes } from 'react-router-dom';
import type { ReactElement } from 'react';

import { LazyPage } from '@/components/layout/LazyPage';
import { PrototypeToastProvider } from '@/components/overlays/PrototypeToast';
import { PublicShell } from '@/components/layout/PublicShell';
import { StudioAppShell } from '@/components/layout/StudioAppShell';
import { StudioStandaloneShell } from '@/components/layout/StudioStandaloneShell';

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
const StudioScenarioComparisonPage = lazy(() =>
  import('@/pages/studio/DealRoutes').then((module) => ({
    default: module.StudioScenarioComparisonPage,
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
          <Route path="deals/:dealId/intake" element={<LazyPage page={StudioDealIntakePage} />} />
          <Route path="deals/:dealId" element={<LazyPage page={StudioDealOverviewPage} />} />
          <Route path="deals/:dealId/comps" element={<LazyPage page={StudioCompsPage} />} />
          <Route
            path="deals/:dealId/underwriting"
            element={<LazyPage page={StudioUnderwritingPage} />}
          />
          <Route
            path="deals/:dealId/scenarios"
            element={<LazyPage page={StudioScenarioComparisonPage} />}
          />
          <Route path="settings/billing" element={<LazyPage page={StudioPricingPage} />} />
          <Route path="settings/white-label" element={<LazyPage page={StudioWhiteLabelPage} />} />
          <Route path="broker-os" element={<LazyPage page={StudioBrokerOsPage} />} />
        </Route>
        <Route path="studio/reports" element={<StudioStandaloneShell />}>
          <Route path=":dealId/builder" element={<LazyPage page={StudioReportBuilderPage} />} />
        </Route>
      </Routes>
    </PrototypeToastProvider>
  );
}
