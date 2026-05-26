import { useState, type CSSProperties, type ReactElement } from 'react';
import { Link, useParams } from 'react-router-dom';

import {
  MaterialIcon,
  MetricCard,
  NonProductionCallout,
  PageTitle,
  StatusBadge,
  StudioCard,
  Swatch,
  TrustBadge,
  WorkflowContextHeader,
} from '@/components/studio/StudioPrimitives';
import { ExportGovernanceModal } from '@/components/overlays/ExportGovernanceModal';
import { EmptyStateCard } from '@/components/overlays/EmptyStateCard';
import { PrototypeActionButton } from '@/components/overlays/PrototypeActionButton';
import { ReviewPostureBanner } from '@/components/provenance/ProvenanceWidgets';
import { ValuationReadinessRail } from '@/components/workflow/ValuationReadinessRail';
import { ContextualSurfaceTriggers } from '@/components/workflow/ContextualSurfaceTriggers';
import { GateResolutionCallout } from '@/components/workflow/GateResolutionCallout';
import { MockBoundaryBanner } from '@/components/workflow/MockBoundaryBanner';
import { StageRail } from '@/components/ui/StageRail';
import { VALUATION_READINESS_STAGES } from '@/lib/readiness-stages';
import {
  ExportReadinessCard,
  ExportManifestCard,
  ReportProvenanceCard,
  ReportSectionReviewCard,
} from '@/components/report-governance/ReportGovernanceCards';
import { brandConfig, studioDealPath } from '@/data/studio';
import { fixtureActors } from '@/lib/contracts/fixtures';
import type { GovernedReceipt } from '@/lib/contracts/receipts';
import { getLinkedPropertyId } from '@/lib/workflow-identity';
import { evaluateExportPolicy } from '@/lib/runtime/export-policy';
import { getStudioReportBuilderView } from '@/lib/runtime/studio-workspace';
import { runtimeServices } from '@/lib/runtime/runtime-services';
import { useRuntimeResource } from '@/lib/runtime/useRuntimeResource';
import { RuntimeResourceStatus } from '@/components/runtime/RuntimeResourceStatus';
import { SegmentedControl, StudioDealNotFound, TabPanelSwitch } from '@/pages/studio/StudioShared';

export function StudioReportBuilderPage(): ReactElement {
  const { dealId } = useParams();
  const reportState = useRuntimeResource(
    () => runtimeServices.studio.getReportBuilder(dealId),
    `report-builder-${dealId ?? 'missing'}`,
    getStudioReportBuilderView(dealId)
  );
  const [receipt, setReceipt] = useState<GovernedReceipt | null>(null);
  const [exportModalOpen, setExportModalOpen] = useState(false);
  const reportView = reportState.value;
  if (!reportView) return <StudioDealNotFound />;
  const {
    deal,
    sections,
    sourceBlocks,
    readiness,
    valuationVersion,
    brandConfig: reportBrandConfig,
  } = reportView;
  const propertyId = getLinkedPropertyId(deal.id) ?? 'demo-001';
  const approvedCount = sections.filter((section) => section.status === 'Approved').length;
  const needsReviewCount = sections.filter((section) => section.status === 'Needs review').length;
  const draftCount = sections.filter((section) => section.status === 'Draft').length;
  const studioExportDecision = evaluateExportPolicy({
    actor: fixtureActors.orgAdmin,
    reportId: `studio-report-${deal.id}`,
    scope: 'download',
    readiness,
    consent: true,
    idempotencyKey: `studio-export-${deal.id}`,
  });

  return (
    <div className="report-builder-workspace">
      <nav className="deal-breadcrumb" aria-label="Deal context">
        <Link to={studioDealPath(deal.id)}>Studio</Link>
        <span aria-hidden="true">/</span>
        <Link to={studioDealPath(deal.id)}>{deal.name}</Link>
        <span aria-hidden="true">/</span>
        <Link to={studioDealPath(deal.id, 'versions')}>
          Snapshot {valuationVersion.evidenceSnapshot.id}
        </Link>
        <span aria-hidden="true">/</span>
        <span>Report builder</span>
      </nav>
      <WorkflowContextHeader
        dealName={deal.name}
        stage="Report builder"
        returnTo={studioDealPath(deal.id, 'underwriting')}
        returnLabel="Return to underwriting"
      />
      <PageTitle
        title="Report Builder"
        lede="Review sections, citations, branding, and export readiness before delivery."
        actions={
          <>
            <StatusBadge status={`${approvedCount}/${sections.length} approved`} />
            <StatusBadge status={studioExportDecision.allowed ? 'Policy clear' : 'Policy blocked'} />
            {!readiness.ready ? (
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => setExportModalOpen(true)}
              >
                Review blockers
              </button>
            ) : null}
            <button
              className="btn btn-primary"
              type="button"
              disabled={!studioExportDecision.allowed}
              aria-describedby="report-export-blocked"
              onClick={() => {
                setReceipt(studioExportDecision.receipt);
                setExportModalOpen(true);
              }}
            >
              Generate governed receipt
            </button>
          </>
        }
      />
      <ReviewPostureBanner blocks={sourceBlocks} />
      <MockBoundaryBanner variant="export" />
      <RuntimeResourceStatus
        loading={reportState.loading}
        error={reportState.error}
        variant="studio-report"
      />
      {!reportState.loading && sections.length > 0 ? (
        <div className="proof-strip" aria-label="Report section posture">
          {[
            [approvedCount, 'Approved sections'],
            [needsReviewCount, 'Need review'],
            [draftCount, 'Draft sections'],
            [sections.length, 'Total sections'],
          ].map(([value, label]) => (
            <article key={String(label)}>
              <strong className="fin-value">{value}</strong>
              <span>{label}</span>
            </article>
          ))}
        </div>
      ) : null}
      <GateResolutionCallout
        action="Generate governed receipt"
        prerequisite="Section review and source-rights gates remain open for this report."
        owner="A report reviewer"
        resolveTo={studioDealPath(deal.id, 'versions')}
        resolveLabel="Review valuation snapshots"
      />
      <StageRail stages={[...VALUATION_READINESS_STAGES]} activeIndex={3} />
      <p className="sr-only" id="report-export-blocked">
        Export is disabled until section review and source-rights gates clear.
      </p>
      <div className="report-builder-grid">
        <StudioCard title="Readiness Gates">
          <p>{valuationVersion.resultSummary}</p>
          <p className="muted">
            Evidence snapshot {valuationVersion.evidenceSnapshot.id} ·{' '}
            {valuationVersion.evidenceSnapshot.manifestHash}
          </p>
          <ValuationReadinessRail evaluation={valuationVersion.readiness} orientation="vertical" />
          <StatusBadge status={valuationVersion.readiness.safeNextAction} />
        </StudioCard>
        <StudioCard title="Sections">
          <label>
            Report type
            <select defaultValue="Investment Preview">
              <option>Investment Preview</option>
              <option>Broker Opinion of Value</option>
              <option>IC Memo</option>
            </select>
          </label>
          {sections.length === 0 ? (
            <EmptyStateCard
              icon="description"
              title="No report sections returned"
              description="The studio report builder adapter returned an empty section list. Export remains blocked until sections and source-rights gates clear."
              tone="warning"
            />
          ) : (
            sections.map((section) => (
              <ReportSectionReviewCard key={section.id} section={section} />
            ))
          )}
          <div className="studio-actions">
            <PrototypeActionButton feature="Export Excel" className="btn btn-secondary">
              Export Excel
            </PrototypeActionButton>
            <button
              type="button"
              className="btn btn-primary"
              disabled={!studioExportDecision.allowed}
              aria-describedby="report-export-blocked"
              onClick={() => {
                setReceipt(studioExportDecision.receipt);
                setExportModalOpen(true);
              }}
            >
              Generate governed receipt
            </button>
          </div>
          <ReportProvenanceCard sections={sections} sourceBlocks={sourceBlocks} />
        </StudioCard>
        <StudioCard title="Live PDF Preview" className="pdf-preview-card">
          <div className="pdf-preview">
            <h2>{reportBrandConfig.company}</h2>
            <p>{deal.name} Investment Preview</p>
            <div className="property-image report-hero" role="img" aria-label="Mock report hero image" />
            <div className="metric-grid">
              <MetricCard label="Target IRR" value="14.8%" detail="Draft" />
              <MetricCard label="Equity Multiple" value="1.82x" detail="Draft" />
              <MetricCard label="Hold" value="5 yrs" detail="Base case" />
            </div>
            <div className="pdf-line" />
            <div className="pdf-block" />
            <div className="pdf-block short" />
            <small>{reportBrandConfig.disclaimer}</small>
          </div>
        </StudioCard>
        <StudioCard title="Branding & Export">
          <div className="form-field">
            <strong>Logo upload</strong>
            <PrototypeActionButton feature="Logo upload" className="upload-zone">
              <MaterialIcon name="upload_file" /> Mock logo dropzone
            </PrototypeActionButton>
          </div>
          <p>
            <Swatch color={reportBrandConfig.accentColor} /> Accent color
          </p>
          <label>
            Font
            <select defaultValue="Inter">
              <option>Inter</option>
              <option>Roboto</option>
            </select>
          </label>
          <label>
            Disclaimer
            <textarea defaultValue={reportBrandConfig.disclaimer} />
          </label>
          <TrustBadge state="Candidate evidence" />
          <NonProductionCallout>
            Export is disabled until section review and source-rights gates clear.
          </NonProductionCallout>
          <ExportReadinessCard sections={sections} sourceBlocks={sourceBlocks} />
          <ExportManifestCard sections={sections} sourceBlocks={sourceBlocks} />
          {receipt ? (
            <div className="receipt" role="status">
              <p>
                Studio receipt <code>{receipt.id}</code> · {receipt.policyDecision}
              </p>
              <p>{receipt.safeMessage}</p>
              {studioExportDecision.exportManifest ? (
                <p>Manifest checksum: {studioExportDecision.exportManifest.checksum}</p>
              ) : null}
            </div>
          ) : null}
          <Link to="/studio/settings/white-label" className="btn btn-secondary">
            Edit branding
          </Link>
        </StudioCard>
      </div>
      <ContextualSurfaceTriggers
        dealId={deal.id}
        route="report-builder"
        propertyId={propertyId}
      />
      <ExportGovernanceModal
        isOpen={exportModalOpen}
        onClose={() => setExportModalOpen(false)}
        readiness={readiness}
        policyDecision={studioExportDecision}
      />
    </div>
  );
}

export function StudioWhiteLabelPage(): ReactElement {
  const [company, setCompany] = useState(brandConfig.company);
  const [primary, setPrimary] = useState(brandConfig.primaryColor);
  const [accent, setAccent] = useState(brandConfig.accentColor);
  const [preview, setPreview] = useState<'portal' | 'report'>('portal');
  const [domainEnabled, setDomainEnabled] = useState(true);
  const [saved, setSaved] = useState(false);

  return (
    <div className="split-layout">
      <div>
        <NonProductionCallout>
          Branding previews are mock-only. Evidence posture and source limits remain visible in
          reports regardless of accent color or logo.
        </NonProductionCallout>
        <PageTitle
          title="White Label Settings"
          lede="Customize platform appearance for clients and reports without hiding source limits."
          actions={
            <PrototypeActionButton
              feature="Save branding changes"
              className="btn btn-primary"
              onClick={() => setSaved(true)}
            >
              Save Changes
            </PrototypeActionButton>
          }
        />
        {saved ? (
          <p className="status-badge" role="status">
            Prototype branding changes saved.
          </p>
        ) : null}
        <StudioCard title="Brand Basics">
          <div className="form-grid">
            <label>
              Company Display Name
              <input value={company} onChange={(event) => setCompany(event.target.value)} />
            </label>
            <label>
              Support Email
              <input defaultValue={brandConfig.supportEmail} />
            </label>
          </div>
        </StudioCard>
        <StudioCard title="Logo & Assets">
          <div className="upload-grid">
            <PrototypeActionButton feature="Primary logo upload" className="upload-zone">
              <MaterialIcon name="upload_file" /> Primary logo mock upload
            </PrototypeActionButton>
            <PrototypeActionButton feature="Favicon upload" className="upload-zone">
              <MaterialIcon name="image" /> Favicon mock upload
            </PrototypeActionButton>
          </div>
        </StudioCard>
        <StudioCard title="Colors & Typography">
          <div className="form-grid">
            <label>
              Primary Brand Color
              <input
                type="color"
                value={primary}
                onChange={(event) => setPrimary(event.target.value)}
              />
            </label>
            <label>
              Accent Color
              <input
                type="color"
                value={accent}
                onChange={(event) => setAccent(event.target.value)}
              />
            </label>
            <label>
              Heading Typeface
              <select defaultValue="Inter">
                <option>Inter</option>
                <option>Roboto</option>
              </select>
            </label>
          </div>
        </StudioCard>
        <StudioCard title="Report Branding">
          <label>
            Cover Page Disclaimer
            <textarea defaultValue={brandConfig.disclaimer} />
          </label>
          <label>
            Footer Text
            <input defaultValue={brandConfig.footer} />
          </label>
        </StudioCard>
        <StudioCard title="Client Portal Access" className="enterprise-card">
          <label className="toggle-row">
            <input
              type="checkbox"
              checked={domainEnabled}
              onChange={(event) => setDomainEnabled(event.target.checked)}
            />
            Custom domain enabled
          </label>
          <label>
            Custom Domain
            <input defaultValue={brandConfig.domain} />
          </label>
          <p>Requires DNS CNAME configuration. Enterprise mock only.</p>
        </StudioCard>
      </div>
      <StudioCard
        title="Live Preview"
        actions={
          <SegmentedControl
            label="Preview mode"
            value={preview}
            options={['portal', 'report']}
            onChange={setPreview}
          />
        }
      >
        <div
          className="portal-preview"
          style={{ '--brand-accent': accent, '--brand-primary': primary } as CSSProperties}
        >
          <div className="mini-browser-bar">
            <span />
            <span />
            <span />
            <strong>{domainEnabled ? brandConfig.domain : 'preview.finemstudio.local'}</strong>
          </div>
          <h3>{company}</h3>
          <div className="preview-accent" />
          <TabPanelSwitch panelKey={preview}>
          {preview === 'portal' ? (
            <>
              <div className="pdf-block" />
              <div className="preview-card-row">
                <div />
                <div />
              </div>
              <small>Powered by Finem Studio</small>
            </>
          ) : (
            <>
              <h4>Riverside Flats Investment Preview</h4>
              <p>{brandConfig.disclaimer}</p>
              <small>{brandConfig.footer}</small>
            </>
          )}
          </TabPanelSwitch>
        </div>
      </StudioCard>
    </div>
  );
}
