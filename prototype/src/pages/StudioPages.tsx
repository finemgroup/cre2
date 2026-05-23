import { useMemo, useState, type CSSProperties, type ReactElement } from 'react';
import { Link, useParams } from 'react-router-dom';

import {
  AnimatedList,
  DataTable,
  DetailDrawer,
  JobStreamsTable,
  JsonContextViewer,
  MaterialIcon,
  MetricCard,
  MotionBlock,
  NonProductionCallout,
  PageTitle,
  PaywallOverlay,
  StageStepper,
  StatusBadge,
  StickyActionBar,
  StudioCard,
  Swatch,
  TrustBadge,
  WorkflowContextHeader,
} from '@/components/studio/StudioPrimitives';
import {
  AssumptionsPanel,
  GatesPanel,
  MetricsPanel,
  SensitivityMatrix,
  SyntheticDataBanner,
  VersionLockCard,
} from '@/components/underwriting/UnderwritingPanels';
import {
  ProvenanceCell,
  ReviewPostureBanner,
  SourceEvidenceBlockCard,
} from '@/components/provenance/ProvenanceWidgets';
import {
  ExportReadinessCard,
  ReportProvenanceCard,
  ReportSectionReviewCard,
} from '@/components/report-governance/ReportGovernanceCards';
import { UploadDropzone } from '@/components/upload/UploadDropzone';
import { StagedImportReviewPanel } from '@/components/review/StagedImportReviewPanel';
import {
  ActivityTimelinePanel,
  ScreenReaderAnnouncement,
  WorkflowContinuityContainer,
  WorkflowHandoffLink,
} from '@/components/workflow/WorkflowPrimitives';
import { useA11yAnnouncement } from '@/lib/a11y/useA11yAnnouncement';
import {
  buildProFormaRows,
  buildSensitivityGrid,
  calculateUnderwritingMetrics,
  evaluateUnderwritingGates,
  formatCurrency,
  formatMultiple,
  formatPercent,
} from '@/lib/underwriting';
import { mockSourceBlocks } from '@/lib/source-bundle';
import { mockCandidateFields, mockUploadFiles } from '@/lib/staged-import';
import {
  activity,
  agentCapabilities,
  brandConfig,
  comps,
  deals,
  getStudioDeal,
  jobStreams,
  reportSections,
  studioDealPath,
  underwritingAssumptionsByDeal,
  underwritingProvenanceByDeal,
  type Comp,
} from '@/data/studio';
import {
  DealWorkflowTabs,
  SegmentedControl,
  StudioDealNotFound,
  useStudioDeal,
} from '@/pages/studio/StudioShared';

export function StudioLandingPage(): ReactElement {
  return (
    <div className="studio-marketing">
      <header className="studio-public-nav">
        <Link to="/studio" className="studio-topbar-brand">
          Finem CRE Studio
        </Link>
        <nav aria-label="Marketing navigation">
          <a href="#how-it-works">How it works</a>
          <a href="#workflows">Workflows</a>
          <Link to="/studio/settings/billing">Pricing</Link>
          <Link to="/studio/dashboard">Sign in</Link>
        </nav>
      </header>
      <section className="studio-hero">
        <MotionBlock motionName="stageItem">
          <p className="studio-eyebrow">CRE intelligence for modern broker teams</p>
          <h1>From intake packet to investor-ready report in one governed workflow.</h1>
          <p>
            Finem CRE Studio centralizes deal intake, comps, underwriting, scenario analysis,
            reporting, and white-label investor presentation surfaces.
          </p>
          <div className="studio-actions">
            <Link to="/studio/onboarding" className="btn btn-primary">
              Start workspace
            </Link>
            <Link to="/studio/dashboard" className="btn btn-secondary">
              View dashboard
            </Link>
          </div>
        </MotionBlock>
        <MotionBlock className="hero-product-card" motionName="railEnter">
          <div className="mini-browser-bar">
            <span />
            <span />
            <span />
          </div>
          <MetricCard label="Pipeline" value="$193.5M" detail="3 active mock deals" icon="monitoring" />
          <div className="mini-grid">
            {deals.map((deal) => (
              <div key={deal.id}>
                <strong>{deal.name}</strong>
                <span>{deal.stage}</span>
              </div>
            ))}
          </div>
        </MotionBlock>
      </section>

      <NonProductionCallout>
        Prototype data is synthetic and for product validation only. It is not market, valuation, or
        investment advice.
      </NonProductionCallout>

      <section id="how-it-works" className="how-it-works">
        {['Import OM', 'Extract candidates', 'Review comps', 'Publish report'].map((step, index) => (
          <StudioCard key={step}>
            <span className="stage-index">{index + 1}</span>
            <h3>{step}</h3>
            <p>Every step keeps candidate evidence separate from reviewed output.</p>
          </StudioCard>
        ))}
      </section>

      <AnimatedList id="workflows" className="workflow-bento">
        {[
          ['Deal Intake', 'Capture property, deal, assumptions, and source packet context.'],
          ['Comps & Evidence', 'Compare public, reviewed, premium-private, and candidate comparable sales.'],
          ['Underwriting', 'Review assumptions, pro forma deltas, and flags before report generation.'],
          ['White-Label Reports', 'Preview investor portal and PDF branding without hiding source limits.'],
          ['Broker OS', 'Monitor sanitized job projections and capability inventory in read-only mode.'],
        ].map(([title, copy]) => (
          <StudioCard key={title} title={title}>
            <p>{copy}</p>
          </StudioCard>
        ))}
      </AnimatedList>

      <section className="studio-cta-band">
        <div>
          <h2>Ready to build the first broker workspace?</h2>
          <p>Start with the guided onboarding flow or jump into the mock dashboard.</p>
        </div>
        <Link to="/studio/settings/billing" className="btn btn-secondary">
          Compare plans
        </Link>
      </section>
      <footer className="studio-footer">
        <span>Finem CRE Studio prototype</span>
        <span>Evidence-first. Mock-data only.</span>
      </footer>
    </div>
  );
}

export function StudioOnboardingPage(): ReactElement {
  const [step, setStep] = useState(0);
  const [tier, setTier] = useState<'Boutique' | 'Institutional'>('Institutional');
  const [assetClasses, setAssetClasses] = useState(['Multifamily']);
  const { message, announce } = useA11yAnnouncement();
  const steps = ['Tier', 'Account', 'Workspace', 'First deal'];
  const goToStep = (nextStep: number) => {
    setStep(nextStep);
    announce(`Onboarding step ${nextStep + 1}: ${steps[nextStep]}`);
  };

  return (
    <div className="onboarding-wrap">
      <ScreenReaderAnnouncement message={message} />
      <StudioCard title="Set up Finem CRE Studio" eyebrow="Step-guided onboarding">
        <StageStepper stages={steps} activeIndex={step} />
        <div className="onboarding-panel">
          {step === 0 ? (
            <div className="choice-grid">
              <button type="button" className={tier === 'Boutique' ? 'choice-card active' : 'choice-card'} aria-pressed={tier === 'Boutique'} onClick={() => setTier('Boutique')}>
                <strong>Boutique</strong>
                <span>$149/mo</span>
                <span>Lean broker teams managing focused mandates.</span>
                <small>3 active deals, draft reports, sample comps.</small>
              </button>
              <button type="button" className={tier === 'Institutional' ? 'choice-card active' : 'choice-card'} aria-pressed={tier === 'Institutional'} onClick={() => setTier('Institutional')}>
                <strong>Institutional</strong>
                <span>Popular · $399/mo</span>
                <span>Multi-market teams requiring advanced controls.</span>
                <small>Unlimited deals, premium comps, white-label portal.</small>
              </button>
            </div>
          ) : null}
          {step === 1 ? (
            <div className="form-grid">
              <label>
                Full name
                <input defaultValue="Alex Morgan" />
              </label>
              <label>
                Work email
                <input defaultValue="investors@acmecapital.com" />
              </label>
              <label>
                Password
                <input type="password" defaultValue="prototype-only" />
              </label>
            </div>
          ) : null}
          {step === 2 ? (
            <div className="form-grid">
              <label>
                Company name
                <input defaultValue="Acme Real Estate Partners" />
              </label>
              <label>
                Role
                <select defaultValue="Principal">
                  <option>Principal</option>
                  <option>Broker</option>
                  <option>Analyst</option>
                </select>
              </label>
              <div className="chip-group" aria-label="Asset classes">
                {['Multifamily', 'Office', 'Industrial', 'Retail'].map((asset) => {
                  const selected = assetClasses.includes(asset);
                  return (
                  <button
                    type="button"
                    key={asset}
                    className={selected ? 'chip active' : 'chip'}
                    aria-pressed={selected}
                    onClick={() =>
                      setAssetClasses((current) =>
                        current.includes(asset)
                          ? current.filter((item) => item !== asset)
                          : [...current, asset]
                      )
                    }
                  >
                    {asset}
                  </button>
                  );
                })}
              </div>
            </div>
          ) : null}
          {step === 3 ? (
            <div className="choice-grid">
              <Link to="/studio/deal-intake" className="choice-card active">
                <strong>Create first deal</strong>
                <span>Start with an intake packet and source materials.</span>
              </Link>
              <Link to="/studio/dashboard" className="choice-card">
                <strong>Explore dashboard</strong>
                <span>Review the mock broker workspace first.</span>
              </Link>
              <Link to={studioDealPath()} className="choice-card">
                <strong>Open sample deal</strong>
                <span>Use Riverside Flats to inspect the full workflow.</span>
              </Link>
            </div>
          ) : null}
        </div>
        <div className="wizard-actions">
          <button className="btn btn-secondary" type="button" disabled={step === 0} onClick={() => goToStep(step - 1)}>
            Back
          </button>
          {step < steps.length - 1 ? (
            <button className="btn btn-primary" type="button" onClick={() => goToStep(step + 1)}>
              Continue
            </button>
          ) : (
            <Link className="btn btn-primary" to="/studio/dashboard">
              Finish
            </Link>
          )}
        </div>
      </StudioCard>
    </div>
  );
}

export function StudioPricingPage(): ReactElement {
  const [annual, setAnnual] = useState(true);
  const plans = [
    ['Free', '$0', 'Starter comps and one draft report'],
    ['Premium', annual ? '$149/mo' : '$199/mo', 'Pipeline, comps, underwriting, report builder'],
    ['Enterprise', 'Custom', 'White-label portal, team governance, Broker OS'],
  ];

  return (
    <div>
      <PageTitle
        eyebrow="Settings"
        title="Billing & Plans"
        lede="Choose the workspace tier that fits your broker workflow."
        actions={
          <SegmentedControl
            label="Billing cadence"
            value={annual ? 'Annual' : 'Monthly'}
            options={['Monthly', 'Annual']}
            onChange={(value) => setAnnual(value === 'Annual')}
          />
        }
      />
      <div className="pricing-grid">
        {plans.map(([name, price, copy]) => (
          <StudioCard key={name} title={name} className={name === 'Premium' ? 'featured-card' : ''}>
            <p className="plan-price">{price}</p>
            <p>{copy}</p>
            <Link to="/studio/dashboard" className="btn btn-primary">
              {name === 'Enterprise' ? 'Contact sales' : 'Select plan'}
            </Link>
          </StudioCard>
        ))}
      </div>
      <StudioCard title="Feature comparison">
        <DataTable
          caption="Plan feature comparison"
          headers={['Feature', 'Free', 'Premium', 'Enterprise']}
          rows={[
            ['Deal pipeline', '1 active', 'Unlimited', 'Team controls'],
            ['Comps', 'Sample only', 'Reviewed + candidate', 'Premium/private tiers'],
            ['Reports', 'Draft preview', 'Export gate', 'White-label portal'],
            ['Broker OS', 'No', 'Read-only summary', 'Full operator inventory'],
          ]}
        />
      </StudioCard>
      <StudioCard title="FAQ">
        <div className="faq-list faq-card-list">
          {[
            ['Can I upgrade later?', 'Yes. Upgrade paths are mocked here and route through the same governed workspace.'],
            ['Do reports export automatically?', 'No. Exports remain gated by review, consent, and source-rights posture.'],
            ['Does white-label change source limits?', 'No. Branding never hides evidence posture, consent state, or non-production labels.'],
          ].map(([question, answer]) => (
            <div className="faq-card" key={question}>
              <strong>{question}</strong>
              <p>{answer}</p>
            </div>
          ))}
        </div>
      </StudioCard>
      <footer className="studio-footer">Billing prototype · no live Stripe or provider calls.</footer>
    </div>
  );
}

export function StudioDashboardPage(): ReactElement {
  return (
    <div>
      <PageTitle
        eyebrow="Welcome back, Alex"
        title="Main Deal Dashboard"
        lede="Track active mandates, plan usage, and source-aware broker workflow activity."
        actions={<><div className="usage-pill"><span>Plan usage</span><strong>1 of 2 deals</strong><i style={{ width: '50%' }} /></div><Link to="/studio/deal-intake" className="btn btn-primary">Import OM</Link><Link to="/studio/deal-intake" className="btn btn-secondary">New Deal</Link></>}
      />
      <NonProductionCallout>Dashboard KPIs are synthetic projections for product validation.</NonProductionCallout>
      <div className="metric-grid four">
        <MetricCard label="Active pipeline" value="$193.5M" detail="3 tracked deals" />
        <MetricCard label="Reports drafted" value="12" detail="4 need review" icon="description" />
        <MetricCard label="Comp sets" value="28" detail="7 premium-private" icon="analytics" />
        <MetricCard label="Plan usage" value="72%" detail="Premium mock tier" icon="speed" />
      </div>
      <div className="dashboard-grid">
        <StudioCard title="Deal Pipeline" className="wide-card">
          <DataTable
            caption="Deal pipeline"
            headers={['Deal', 'Market', 'Stage', 'Value', 'Authority']}
            getRowKey={(_row, index) => deals[index].id}
            rows={deals.map((deal) => [
              <Link to={studioDealPath(deal.id)}>{deal.name}</Link>,
              deal.market,
              <StatusBadge status={deal.stage} />,
              deal.value,
              <TrustBadge state={deal.authority} />,
            ])}
          />
        </StudioCard>
        <div>
        <StudioCard title="Upgrade Coverage">
          <p>Premium unlocks additional comp authority tiers, scenario sensitivity, and white-label exports.</p>
          <Link to="/studio/settings/billing" className="btn btn-primary">Upgrade plan</Link>
        </StudioCard>
        <StudioCard title="Recent Activity">
          <AnimatedList className="activity-list">
            <ActivityTimelinePanel items={activity} />
          </AnimatedList>
        </StudioCard>
        </div>
      </div>
      <footer className="studio-footer">Finem CRE Studio dashboard · mock data only.</footer>
    </div>
  );
}

export function StudioDealOverviewPage(): ReactElement {
  const deal = useStudioDeal();
  const [drawerOpen, setDrawerOpen] = useState(false);
  if (!deal) return <StudioDealNotFound />;

  return (
    <div>
      <WorkflowContextHeader dealName={deal.name} stage="Underwriting workspace" returnTo="/studio/dashboard" />
      <NonProductionCallout>Deal metrics are mock projections with candidate/review state labels.</NonProductionCallout>
      <div className="metric-grid four">
        <MetricCard label="Asking Price" value={deal.value} detail={deal.authority} />
        <MetricCard label="Indicated Value" value="$46.8M" detail="Model-inferred" />
        <MetricCard label="Target IRR" value="14.8%" detail="Scenario draft" />
        <MetricCard label="Equity Multiple" value="1.82x" detail="Analyst review active" />
      </div>
      <DealWorkflowTabs deal={deal} />
      <div className="dashboard-grid">
        <StudioCard title="Property Snapshot" className="wide-card">
          <div className="property-snapshot">
            <div className="property-image" aria-label="Mock property image" />
            <div>
              <p>{deal.address} in {deal.market}. {deal.assetClass} value-add opportunity with source-backed assumptions pending review.</p>
              <div className="mini-grid">
                <div><strong>Asset Class</strong><span>{deal.assetClass}</span></div>
                <div><strong>Status</strong><span>{deal.status}</span></div>
                <div><strong>Authority</strong><TrustBadge state={deal.authority} /></div>
              </div>
            </div>
          </div>
          <div className="timeline">
            {['Packet received', 'Comps matched', 'Underwriting flags', 'Report draft'].map((step, index) => (
              <div key={step} className={index < 2 ? 'done' : ''}>
                <span>{index + 1}</span>
                {step}
              </div>
            ))}
          </div>
        </StudioCard>
        <StudioCard title="Source Documents" actions={<button className="btn btn-secondary" type="button" onClick={() => setDrawerOpen(true)}>Open drawer</button>}>
          <DataTable
            caption="Source documents"
            headers={['Document', 'Type', 'Uploaded', 'State']}
            rows={[
              ['Offering memorandum.pdf', 'Offering memorandum', 'Today', <TrustBadge state="Candidate evidence" />],
              ['Rent roll.xlsx', 'Rent roll', 'Yesterday', <TrustBadge state="Reviewed" />],
              ['T12.pdf', 'Operating statement', 'Yesterday', <TrustBadge state="Candidate evidence" />],
            ]}
          />
        </StudioCard>
        <StudioCard title="Analyst Notes">
          <div className="notes-thread">
            <p><strong>Alex:</strong> Rent roll normalization and exit cap assumptions require final review before report export.</p>
            <p><strong>Priya:</strong> Waiting on lender quote before clearing DSCR warning.</p>
            <label>
              Add note
              <textarea defaultValue="Mock note draft only." />
            </label>
          </div>
          <TrustBadge state="Candidate evidence" />
        </StudioCard>
        <StudioCard title="Deal Team">
          <div className="team-list">
            {['Alex Morgan · Lead', 'Priya Shah · Underwriting', 'Chris Lee · Capital Markets'].map((member) => (
              <div key={member}>{member}</div>
            ))}
          </div>
        </StudioCard>
      </div>
      <DetailDrawer isOpen={drawerOpen} onClose={() => setDrawerOpen(false)} title="Document Evidence">
        <p>Candidate document evidence remains separate from canonical deal facts until reviewed.</p>
        <TrustBadge state="Candidate evidence" />
      </DetailDrawer>
    </div>
  );
}

export function StudioDealIntakePage(): ReactElement {
  const [propertyName, setPropertyName] = useState('Riverside Flats');
  return (
    <div className="split-layout with-sticky">
      <div>
        <PageTitle title="Deal Intake" lede="Capture deal basics, assumptions, and source materials before promotion." />
        <StudioCard title="Property Basics">
          <div className="form-grid">
            <label>
              Property name
              <input value={propertyName} onChange={(event) => setPropertyName(event.target.value)} />
            </label>
            <label>
              Market
              <input defaultValue="Austin, TX" />
            </label>
            <label>
              Units
              <input defaultValue="196" />
            </label>
            <label>
              Year Built
              <input defaultValue="2018" />
            </label>
          </div>
        </StudioCard>
        <StudioCard title="Deal Basics">
          <div className="form-grid">
            <label>
              Asking price
              <input defaultValue="$42,500,000" />
            </label>
            <label>
              Status
              <select defaultValue="Candidate evidence">
                <option>Candidate evidence</option>
                <option>Needs review</option>
              </select>
            </label>
          </div>
          <p className="field-error" id="cap-rate-error">Validation: cap-rate basis requires a cited source before export.</p>
        </StudioCard>
        <StudioCard title="Source Materials">
          <UploadDropzone files={mockUploadFiles} />
        </StudioCard>
        <StudioCard title="Financial Assumptions">
          <div className="form-grid">
            <label>T12 NOI<input defaultValue="$2,900,000" /></label>
            <label>Implied Cap Rate<input defaultValue="5.8%" /></label>
            <label>Vacancy<input defaultValue="4.5%" aria-invalid="true" aria-describedby="vacancy-error" /></label>
          </div>
          <p className="field-error" id="vacancy-error">Vacancy assumption requires a supporting rent roll citation.</p>
        </StudioCard>
        <StagedImportReviewPanel files={mockUploadFiles} candidates={mockCandidateFields} />
        <StickyActionBar>
          <span>Last saved just now</span>
          <button className="btn btn-secondary" type="button">Save draft</button>
          <Link to={studioDealPath(undefined, 'comps')} className="btn btn-primary">Continue to Comps</Link>
        </StickyActionBar>
      </div>
      <StudioCard title="Packet Preview">
        <div className="packet-preview">
          <h3>{propertyName || 'Untitled deal'}</h3>
          <p>Austin multifamily acquisition packet</p>
          <TrustBadge state="Candidate evidence" />
          <div className="metric-grid">
            <MetricCard label="Asking" value="$42.5M" detail="From OM" />
            <MetricCard label="T12 NOI" value="$2.9M" detail="Candidate" />
          </div>
          <StageStepper stages={['Uploaded', 'Extracting', 'Needs review', 'Ready']} activeIndex={2} />
        </div>
      </StudioCard>
    </div>
  );
}

export function StudioCompsPage(): ReactElement {
  const deal = useStudioDeal();
  const [selected, setSelected] = useState<Comp | null>(comps[0]);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [view, setView] = useState<'table' | 'map'>('table');
  if (!deal) return <StudioDealNotFound />;

  return (
    <div>
      <WorkflowContextHeader dealName={deal.name} stage="Comparable sales review" returnTo={studioDealPath(deal.id)} returnLabel="Return to deal" />
      <DealWorkflowTabs deal={deal} />
      <NonProductionCallout>Comparable sales are sample rows with mixed authority states.</NonProductionCallout>
      <ReviewPostureBanner blocks={mockSourceBlocks} />
      <div className="comps-grid">
        <StudioCard title="Subject Property">
          <div className="property-image small" aria-label="Mock subject property image" />
          <p>{deal.address}</p>
          <MetricCard label="Units" value="196" detail="Candidate from OM" />
          <MetricCard label="Target basis" value="$217k/unit" detail="Model-inferred" />
        </StudioCard>
        <StudioCard
          title="Sales Comparables"
          className="wide-card"
          actions={
            <SegmentedControl label="Comp view mode" value={view} options={['table', 'map']} onChange={setView} />
          }
        >
          {view === 'map' ? (
            <div className="mock-map">
              <MaterialIcon name="map" />
              Sample map view. No precise public markers in MVP0.
            </div>
          ) : null}
          <DataTable
            caption="Sales comparables"
            headers={['Comp', 'Distance', 'Units', 'Sale Price', 'Authority']}
            getRowKey={(_row, index) => comps[index].id}
            rows={comps.map((comp) => [
              <button type="button" className="table-link" onClick={() => { setSelected(comp); setDrawerOpen(true); }}>{comp.name}</button>,
              comp.distance,
              comp.units,
              <ProvenanceCell value={comp.salePrice} citation={mockSourceBlocks[2].citations[0]} state={comp.authority} />,
              <TrustBadge state={comp.authority} />,
            ])}
          />
          <div className="paywall-zone">
            <PaywallOverlay>
              <h3>Premium comp set locked</h3>
              <p>Upgrade to view provider-restricted and organization-private comparables.</p>
              <Link to="/studio/settings/billing" className="btn btn-primary">Upgrade</Link>
            </PaywallOverlay>
          </div>
        </StudioCard>
        <StudioCard title="Comp Detail" className="comp-aside">
          {selected ? (
            <div className="drawer-facts">
              <MetricCard label="Selected comp" value={selected.name} detail={`${selected.distance} from subject`} />
              <MetricCard label="Price / Unit" value={selected.pricePerUnit} detail={selected.authority} />
              <TrustBadge state={selected.authority} />
            </div>
          ) : (
            <p>Select a comparable sale to inspect authority and valuation context.</p>
          )}
        </StudioCard>
      </div>
      <DetailDrawer isOpen={drawerOpen} onClose={() => setDrawerOpen(false)} title={selected?.name ?? 'Comparable'}>
        {selected ? (
          <div className="drawer-facts">
            <MetricCard label="Price / Unit" value={selected.pricePerUnit} detail={selected.authority} />
            <MetricCard label="Cap Rate" value={selected.capRate} detail="Reviewed comparison basis" />
            <TrustBadge state={selected.authority} />
            {mockSourceBlocks.map((block) => (
              <SourceEvidenceBlockCard key={block.id} block={block} />
            ))}
          </div>
        ) : null}
      </DetailDrawer>
    </div>
  );
}

export function StudioUnderwritingPage(): ReactElement {
  const deal = useStudioDeal();
  const [activeScenario, setActiveScenario] = useState('Base Case');
  const [locked, setLocked] = useState(false);
  const [overriddenGates, setOverriddenGates] = useState<string[]>([]);
  const [assumptions, setAssumptions] = useState(() => underwritingAssumptionsByDeal[deal?.id ?? ''] ?? underwritingAssumptionsByDeal['riverside-flats']);
  const metrics = useMemo(() => calculateUnderwritingMetrics(assumptions), [assumptions]);
  const gates = useMemo(
    () =>
      evaluateUnderwritingGates(
        assumptions,
        metrics,
        comps.filter((comp) => comp.authority === 'Reviewed').length
      ).map((gate) => (overriddenGates.includes(gate.id) ? { ...gate, status: 'OVERRIDDEN' as const } : gate)),
    [assumptions, metrics, overriddenGates]
  );
  const proFormaRows = useMemo(() => buildProFormaRows(assumptions), [assumptions]);
  if (!deal) return <StudioDealNotFound />;

  return (
    <WorkflowContinuityContainer label="Underwriting workflow">
      <WorkflowContextHeader dealName={deal.name} stage="Underwriting cockpit" returnTo={studioDealPath(deal.id)} returnLabel="Return to deal" />
      <DealWorkflowTabs deal={deal} />
      <SyntheticDataBanner />
      <div className="tabs-row" role="group" aria-label="Scenario controls">
        {['Base Case', 'Upside', 'Downside'].map((scenario) => (
          <button
            key={scenario}
            type="button"
            aria-pressed={activeScenario === scenario}
            className={activeScenario === scenario ? 'active' : ''}
            onClick={() => setActiveScenario(scenario)}
          >
            {scenario}
          </button>
        ))}
        <Link to={studioDealPath(deal.id, 'scenarios')} className="btn btn-secondary">Compare Scenarios</Link>
      </div>
      <div className="cockpit-grid">
        <AssumptionsPanel assumptions={assumptions} provenance={underwritingProvenanceByDeal[deal.id]} onChange={setAssumptions} />
        <MetricsPanel metrics={metrics} />
        <GatesPanel gates={gates} onOverride={(gateId) => setOverriddenGates((current) => [...new Set([...current, gateId])])} />
      </div>
      <StudioCard title="Pro Forma Cash Flow">
        <DataTable
          caption="Five-year pro forma cash flow"
          headers={['Year', 'Gross Revenue', 'Expenses', 'NOI', 'Debt Service', 'Cash Flow']}
          rows={proFormaRows}
        />
      </StudioCard>
      <div className="dashboard-grid">
        <VersionLockCard canLock={gates.every((gate) => gate.status !== 'BLOCKED')} locked={locked} onLock={() => setLocked(true)} />
        <StudioCard title="Next Handoff">
          <WorkflowHandoffLink
            to={studioDealPath(deal.id, 'scenarios')}
            label="Compare scenarios"
            reason={`${activeScenario} metrics are formula-backed but still mock-only.`}
          />
        </StudioCard>
      </div>
    </WorkflowContinuityContainer>
  );
}

export function StudioScenarioComparisonPage(): ReactElement {
  const deal = useStudioDeal();
  const assumptions = underwritingAssumptionsByDeal[deal?.id ?? ''] ?? underwritingAssumptionsByDeal['riverside-flats'];
  const grid = useMemo(() => buildSensitivityGrid(assumptions), [assumptions]);
  const scenarioMetrics = useMemo(
    () =>
      [
        ['Base Case', assumptions],
        ['Upside', { ...assumptions, annualAppreciationRate: assumptions.annualAppreciationRate + 0.012, vacancyRate: Math.max(0.02, assumptions.vacancyRate - 0.01) }],
        ['Downside', { ...assumptions, annualAppreciationRate: assumptions.annualAppreciationRate - 0.012, exitCapRate: assumptions.exitCapRate + 0.005 }],
        ['Lender Case', { ...assumptions, ltv: Math.max(0.5, assumptions.ltv - 0.06), interestRate: assumptions.interestRate + 0.004 }],
      ].map(([name, scenarioAssumptions]) => ({
        name: name as string,
        metrics: calculateUnderwritingMetrics(scenarioAssumptions as typeof assumptions),
      })),
    [assumptions]
  );
  if (!deal) return <StudioDealNotFound />;

  return (
    <div>
      <WorkflowContextHeader dealName={deal.name} stage="Scenario comparison" returnTo={studioDealPath(deal.id, 'underwriting')} returnLabel="Return to underwriting" />
      <DealWorkflowTabs deal={deal} />
      <NonProductionCallout>Scenario outputs are mock calculations and not investment recommendations.</NonProductionCallout>
      <div className="scenario-grid">
        {scenarioMetrics.map((scenario) => (
          <StudioCard key={scenario.name} title={scenario.name}>
            <MetricCard label="IRR" value={formatPercent(scenario.metrics.irr)} detail="Model-inferred" />
            <MetricCard label="Equity Multiple" value={formatMultiple(scenario.metrics.equityMultiple)} detail={`Value ${formatCurrency(scenario.metrics.indicatedValue)}`} />
          </StudioCard>
        ))}
      </div>
      <StudioCard title="Key Metrics Matrix">
        <SensitivityMatrix grid={grid} />
      </StudioCard>
      <StudioCard title="IRR Bar Chart">
        <div className="bar-chart vertical-bars" aria-label="IRR bar chart">
          {scenarioMetrics.map((scenario) => (
            <div key={scenario.name}>
              <span>{scenario.name}</span>
              <div><i style={{ '--bar-height': formatPercent(scenario.metrics.irr) } as CSSProperties} /></div>
              <strong>{formatPercent(scenario.metrics.irr)}</strong>
            </div>
          ))}
        </div>
      </StudioCard>
      <MotionBlock className="locked-panel" motionName="collapse">
        <PaywallOverlay>
          <h3>Sensitivity heatmap locked</h3>
          <p>Premium tier required for advanced scenario sensitivity views.</p>
          <Link className="btn btn-primary" to="/studio/settings/billing">View plans</Link>
        </PaywallOverlay>
      </MotionBlock>
    </div>
  );
}

export function StudioReportBuilderPage(): ReactElement {
  const { reportId } = useParams();
  const deal = getStudioDeal(reportId);
  const approvedCount = reportSections.filter((section) => section.status === 'Approved').length;
  if (!deal) return <StudioDealNotFound />;

  return (
    <div className="report-builder-workspace">
      <PageTitle
        title="Report Builder"
        lede="Review sections, citations, branding, and export readiness before delivery."
        actions={<><StatusBadge status={`${approvedCount}/${reportSections.length} approved`} /><button className="btn btn-primary" type="button" disabled>Export PDF</button></>}
      />
      <ReviewPostureBanner blocks={mockSourceBlocks} />
      <div className="report-builder-grid">
        <StudioCard title="Sections">
          <label>
            Report type
            <select defaultValue="Investment Preview">
              <option>Investment Preview</option>
              <option>Broker Opinion of Value</option>
              <option>IC Memo</option>
            </select>
          </label>
          {reportSections.map((section) => <ReportSectionReviewCard key={section.id} section={section} />)}
          <div className="studio-actions">
            <button type="button" className="btn btn-secondary">Export Excel</button>
            <button type="button" className="btn btn-primary" disabled>Export PDF</button>
          </div>
          <ReportProvenanceCard sections={reportSections} />
        </StudioCard>
        <StudioCard title="Live PDF Preview" className="pdf-preview-card">
          <div className="pdf-preview">
            <h2>{brandConfig.company}</h2>
            <p>{deal.name} Investment Preview</p>
            <div className="property-image report-hero" aria-label="Mock report hero image" />
            <div className="metric-grid">
              <MetricCard label="Target IRR" value="14.8%" detail="Draft" />
              <MetricCard label="Equity Multiple" value="1.82x" detail="Draft" />
              <MetricCard label="Hold" value="5 yrs" detail="Base case" />
            </div>
            <div className="pdf-line" />
            <div className="pdf-block" />
            <div className="pdf-block short" />
            <small>{brandConfig.disclaimer}</small>
          </div>
        </StudioCard>
        <StudioCard title="Branding & Export">
          <label>Logo upload<div className="upload-zone"><MaterialIcon name="upload_file" /> Mock logo dropzone</div></label>
          <p><Swatch color={brandConfig.accentColor} /> Accent color</p>
          <label>Font<select defaultValue="Inter"><option>Inter</option><option>Roboto</option></select></label>
          <label>Disclaimer<textarea defaultValue={brandConfig.disclaimer} /></label>
          <TrustBadge state="Candidate evidence" />
          <NonProductionCallout>Export is disabled until section review and source-rights gates clear.</NonProductionCallout>
          <ExportReadinessCard sections={reportSections} />
          <Link to="/studio/settings/white-label" className="btn btn-secondary">Edit branding</Link>
        </StudioCard>
      </div>
    </div>
  );
}

export function StudioWhiteLabelPage(): ReactElement {
  const [company, setCompany] = useState(brandConfig.company);
  const [primary, setPrimary] = useState(brandConfig.primaryColor);
  const [accent, setAccent] = useState(brandConfig.accentColor);
  const [preview, setPreview] = useState<'portal' | 'report'>('portal');
  const [domainEnabled, setDomainEnabled] = useState(true);

  return (
    <div className="split-layout">
      <div>
        <PageTitle
          title="White Label Settings"
          lede="Customize platform appearance for clients and reports without hiding source limits."
          actions={<button className="btn btn-primary" type="button">Save Changes</button>}
        />
        <StudioCard title="Brand Basics">
          <div className="form-grid">
            <label>Company Display Name<input value={company} onChange={(event) => setCompany(event.target.value)} /></label>
            <label>Support Email<input defaultValue={brandConfig.supportEmail} /></label>
          </div>
        </StudioCard>
        <StudioCard title="Logo & Assets">
          <div className="upload-grid">
            <div className="upload-zone"><MaterialIcon name="upload_file" /> Primary logo mock upload</div>
            <div className="upload-zone"><MaterialIcon name="image" /> Favicon mock upload</div>
          </div>
        </StudioCard>
        <StudioCard title="Colors & Typography">
          <div className="form-grid">
            <label>Primary Brand Color<input type="color" value={primary} onChange={(event) => setPrimary(event.target.value)} /></label>
            <label>Accent Color<input type="color" value={accent} onChange={(event) => setAccent(event.target.value)} /></label>
            <label>Heading Typeface<select defaultValue="Inter"><option>Inter</option><option>Roboto</option></select></label>
          </div>
        </StudioCard>
        <StudioCard title="Report Branding">
          <label>Cover Page Disclaimer<textarea defaultValue={brandConfig.disclaimer} /></label>
          <label>Footer Text<input defaultValue={brandConfig.footer} /></label>
        </StudioCard>
        <StudioCard title="Client Portal Access" className="enterprise-card">
          <label className="toggle-row">
            <input type="checkbox" checked={domainEnabled} onChange={(event) => setDomainEnabled(event.target.checked)} />
            Custom domain enabled
          </label>
          <label>Custom Domain<input defaultValue={brandConfig.domain} /></label>
          <p>Requires DNS CNAME configuration. Enterprise mock only.</p>
        </StudioCard>
      </div>
      <StudioCard
        title="Live Preview"
        actions={
          <SegmentedControl label="Preview mode" value={preview} options={['portal', 'report']} onChange={setPreview} />
        }
      >
        <div className="portal-preview" style={{ '--brand-accent': accent, '--brand-primary': primary } as CSSProperties}>
          <div className="mini-browser-bar"><span /><span /><span /><strong>{domainEnabled ? brandConfig.domain : 'preview.finemstudio.local'}</strong></div>
          <h3>{company}</h3>
          <div className="preview-accent" />
          {preview === 'portal' ? (
            <>
              <div className="pdf-block" />
              <div className="preview-card-row"><div /><div /></div>
              <small>Powered by Finem Studio</small>
            </>
          ) : (
            <>
              <h4>Riverside Flats Investment Preview</h4>
              <p>{brandConfig.disclaimer}</p>
              <small>{brandConfig.footer}</small>
            </>
          )}
        </div>
      </StudioCard>
    </div>
  );
}

export function StudioBrokerOsPage(): ReactElement {
  const planningContext = useMemo(
    () => ({
      mission_id: 'mb_2024_08_x9A',
      asset_class: 'Multifamily',
      target_markets: ['Austin, TX', 'Nashville, TN'],
      parameters: { min_units: 150, max_vintage: 2010, value_add_req: true },
      assigned_agents: ['Comp_Matcher_AI', 'Underwrite_Model'],
      execution_status: 'PENDING_REVIEW',
    }),
    []
  );

  return (
    <div>
      <PageTitle
        title="Broker OS Control Panel"
        lede="Read-only monitoring interface for system health, agent inventory, and operational context."
        actions={<><StatusBadge status="System Operational" /><span className="status-badge">Uptime: 99.9%</span></>}
      />
      <div className="broker-grid">
        <StudioCard title="Readiness Summary" className="wide-card" actions={<span>Last ping: 2s ago</span>}>
          <div className="metric-grid four">
            <MetricCard label="API Gateway" value="42ms" detail="Healthy" />
            <MetricCard label="Agent Nodes" value="12/12" detail="Online" />
            <MetricCard label="DB Pool" value="45%" detail="Projection only" icon="water_drop" />
            <MetricCard label="Error Rate" value="0.01%" detail="Sanitized" icon="trending_down" />
          </div>
          <h3>Active Job Streams (GET /api/v1/jobs)</h3>
          <JobStreamsTable jobs={jobStreams} />
        </StudioCard>
        <StudioCard title="Agent Inventory" actions={<span className="status-badge">RO</span>}>
          <div className="agent-list">
            {agentCapabilities.map((agent) => (
              <div className="agent-card" key={agent.id}>
                <div>
                  <strong>{agent.name}</strong>
                  <StatusBadge status={agent.status} />
                </div>
                <p>{agent.description}</p>
                <div className="tag-row">{agent.tags.map((tag) => <span key={tag}>{tag}</span>)}</div>
              </div>
            ))}
          </div>
        </StudioCard>
      </div>
      <StudioCard
        title="Planning Context Builder"
        className="dark-card"
        actions={<button type="button" className="btn btn-secondary" onClick={() => void navigator.clipboard?.writeText(JSON.stringify(planningContext, null, 2))}>Copy JSON</button>}
      >
        <JsonContextViewer value={planningContext} />
      </StudioCard>
    </div>
  );
}
