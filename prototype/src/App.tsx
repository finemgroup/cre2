import { Route, Routes } from 'react-router-dom';
import type { ReactElement } from 'react';

import { PrototypeToastProvider } from '@/components/overlays/PrototypeToast';
import { PublicShell } from '@/components/layout/PublicShell';
import { StudioAppShell } from '@/components/layout/StudioAppShell';
import { StudioStandaloneShell } from '@/components/layout/StudioStandaloneShell';
import { LandingPage } from '@/pages/LandingPage';
import { PropertyPage } from '@/pages/PropertyPage';
import { UploadPage } from '@/pages/UploadPage';
import { CompsPage } from '@/pages/CompsPage';
import { ReportPage } from '@/pages/ReportPage';
import { ExportPage } from '@/pages/ExportPage';
import { NotFoundPage } from '@/pages/NotFoundPage';
import {
  StudioBrokerOsPage,
  StudioCompsPage,
  StudioDashboardPage,
  StudioDealIntakePage,
  StudioDealOverviewPage,
  StudioLandingPage,
  StudioOnboardingPage,
  StudioPricingPage,
  StudioReportBuilderPage,
  StudioScenarioComparisonPage,
  StudioUnderwritingPage,
  StudioWhiteLabelPage,
} from '@/pages/studio';

export default function App(): ReactElement {
  return (
    <PrototypeToastProvider>
      <Routes>
      <Route element={<PublicShell />}>
        <Route index element={<LandingPage />} />
        <Route path="property/:id" element={<PropertyPage />} />
        <Route path="property/:id/comps" element={<CompsPage />} />
        <Route path="upload" element={<UploadPage />} />
        <Route path="comps" element={<CompsPage />} />
        <Route path="report/:id" element={<ReportPage />} />
        <Route path="export/:id" element={<ExportPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Route>
      <Route path="studio" element={<StudioAppShell />}>
        <Route index element={<StudioLandingPage />} />
        <Route path="dashboard" element={<StudioDashboardPage />} />
        <Route path="onboarding" element={<StudioOnboardingPage />} />
        <Route path="deal-intake" element={<StudioDealIntakePage />} />
        <Route path="deals/:dealId/intake" element={<StudioDealIntakePage />} />
        <Route path="deals/:dealId" element={<StudioDealOverviewPage />} />
        <Route path="deals/:dealId/comps" element={<StudioCompsPage />} />
        <Route path="deals/:dealId/underwriting" element={<StudioUnderwritingPage />} />
        <Route path="deals/:dealId/scenarios" element={<StudioScenarioComparisonPage />} />
        <Route path="settings/billing" element={<StudioPricingPage />} />
        <Route path="settings/white-label" element={<StudioWhiteLabelPage />} />
        <Route path="broker-os" element={<StudioBrokerOsPage />} />
      </Route>
      <Route path="studio/reports" element={<StudioStandaloneShell />}>
        <Route path=":dealId/builder" element={<StudioReportBuilderPage />} />
      </Route>
    </Routes>
    </PrototypeToastProvider>
  );
}
