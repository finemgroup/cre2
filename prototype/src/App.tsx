import { Route, Routes } from 'react-router-dom';
import type { ReactElement } from 'react';

import { PublicShell } from '@/components/layout/PublicShell';
import { LandingPage } from '@/pages/LandingPage';
import { PropertyPage } from '@/pages/PropertyPage';
import { UploadPage } from '@/pages/UploadPage';
import { CompsPage } from '@/pages/CompsPage';
import { ReportPage } from '@/pages/ReportPage';
import { ExportPage } from '@/pages/ExportPage';

export default function App(): ReactElement {
  return (
    <Routes>
      <Route element={<PublicShell />}>
        <Route index element={<LandingPage />} />
        <Route path="property/:id" element={<PropertyPage />} />
        <Route path="upload" element={<UploadPage />} />
        <Route path="comps" element={<CompsPage />} />
        <Route path="report/:id" element={<ReportPage />} />
        <Route path="export/:id" element={<ExportPage />} />
      </Route>
    </Routes>
  );
}
