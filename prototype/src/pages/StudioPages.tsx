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
  NonProductionCallout,
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
  activity,
  agentCapabilities,
  brandConfig,
  comps,
  deals,
  jobStreams,
  reportSections,
  scenarios,
  type Comp,
} from '@/data/studio';

const primaryDeal = deals[0];
function useStudioDeal() {
  const { dealId } = useParams();
  return deals.find((deal) => deal.id === dealId) ?? primaryDeal;
}

function PageTitle({
  eyebrow,
  title,
  lede,
  actions,
}: {
  eyebrow?: string;
  title: string;
  lede?: string;
  actions?: ReactElement;
}): ReactElement {
  return (
    <header className="studio-page-title">
      <div>
        {eyebrow ? <p className="studio-eyebrow">{eyebrow}</p> : null}
        <h1>{title}</h1>
        {lede ? <p>{lede}</p> : null}
      </div>
      {actions ? <div className="studio-actions">{actions}</div> : null}
    </header>
  );
}

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
        <div>
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
        </div>
        <div className="hero-product-card" aria-label="Product preview">
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
        </div>
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

      <section id="workflows" className="workflow-bento">
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
      </section>

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
  const steps = ['Tier', 'Account', 'Workspace', 'First deal'];

  return (
    <div className="onboarding-wrap">
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
                {['Multifamily', 'Office', 'Industrial', 'Retail'].map((asset, index) => (
                  <button type="button" key={asset} className={index === 0 ? 'chip active' : 'chip'}>
                    {asset}
                  </button>
                ))}
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
              <Link to="/studio/deals/riverside-flats" className="choice-card">
                <strong>Open sample deal</strong>
                <span>Use Riverside Flats to inspect the full workflow.</span>
              </Link>
            </div>
          ) : null}
        </div>
        <div className="wizard-actions">
          <button className="btn btn-secondary" type="button" disabled={step === 0} onClick={() => setStep(step - 1)}>
            Back
          </button>
          {step < steps.length - 1 ? (
            <button className="btn btn-primary" type="button" onClick={() => setStep(step + 1)}>
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
    ['Premium', annual ? '$199/mo' : '$249/mo', 'Pipeline, comps, underwriting, report builder'],
    ['Enterprise', 'Custom', 'White-label portal, team governance, Broker OS'],
  ];

  return (
    <div>
      <PageTitle
        eyebrow="Settings"
        title="Billing & Plans"
        lede="Choose the workspace tier that fits your broker workflow."
        actions={
          <button className="btn btn-secondary" type="button" onClick={() => setAnnual(!annual)}>
            {annual ? 'Annual billing' : 'Monthly billing'}
          </button>
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
        <div className="faq-list">
          <details open>
            <summary>Can I upgrade later?</summary>
            <p>Yes. Upgrade paths are mocked here and route through the same governed workspace.</p>
          </details>
          <details>
            <summary>Do reports export automatically?</summary>
            <p>No. Exports remain gated by review, consent, and source-rights posture.</p>
          </details>
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
        actions={<><Link to="/studio/deal-intake" className="btn btn-primary">Import OM</Link><Link to="/studio/deal-intake" className="btn btn-secondary">New Deal</Link></>}
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
            rows={deals.map((deal) => [
              <Link to={`/studio/deals/${deal.id}`}>{deal.name}</Link>,
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
            {activity.map((item) => (
              <div key={item}>
                <MaterialIcon name="history" />
                <span>{item}</span>
                <TrustBadge state="Candidate evidence" />
              </div>
            ))}
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
      <div className="tabs-row" role="tablist" aria-label="Deal workflow sections">
        {[
          ['Overview', `/studio/deals/${deal.id}`],
          ['Inputs', '/studio/deal-intake'],
          ['Comps', `/studio/deals/${deal.id}/comps`],
          ['Underwriting', `/studio/deals/${deal.id}/underwriting`],
          ['Scenarios', `/studio/deals/${deal.id}/scenarios`],
          ['Reports', '/studio/reports/riverside-flats/builder'],
        ].map(([tab, href], index) => (
          <Link key={tab} className={index === 0 ? 'active tab-link' : 'tab-link'} to={href} role="tab" aria-selected={index === 0}>
            {tab}
          </Link>
        ))}
      </div>
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
            headers={['Document', 'State']}
            rows={[
              ['Offering memorandum.pdf', <TrustBadge state="Candidate evidence" />],
              ['Rent roll.xlsx', <TrustBadge state="Reviewed" />],
              ['T12.pdf', <TrustBadge state="Candidate evidence" />],
            ]}
          />
        </StudioCard>
        <StudioCard title="Analyst Notes">
          <p>Rent roll normalization and exit cap assumptions require final review before report export.</p>
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
          <p className="field-error">Validation: cap-rate basis requires a cited source before export.</p>
        </StudioCard>
        <StudioCard title="Source Materials">
          <button type="button" className="upload-zone">
            <MaterialIcon name="upload_file" />
            <strong>Drop OM, rent roll, and T12 files here</strong>
            <span>Mock upload only. Extracted values remain candidate evidence.</span>
          </button>
          <div className="uploaded-list">
            {['Offering memorandum.pdf', 'Rent roll.xlsx', 'T12.pdf'].map((file) => (
              <div key={file}><MaterialIcon name="description" /> {file} <TrustBadge state="Candidate evidence" /></div>
            ))}
          </div>
        </StudioCard>
        <StudioCard title="Financial Assumptions">
          <div className="form-grid">
            <label>T12 NOI<input defaultValue="$2,900,000" /></label>
            <label>Implied Cap Rate<input defaultValue="5.8%" /></label>
            <label>Vacancy<input defaultValue="4.5%" aria-invalid="true" /></label>
          </div>
          <p className="field-error">Vacancy assumption requires a supporting rent roll citation.</p>
        </StudioCard>
        <StickyActionBar>
          <span>Last saved just now</span>
          <button className="btn btn-secondary" type="button">Save draft</button>
          <Link to="/studio/deals/riverside-flats/comps" className="btn btn-primary">Continue to Comps</Link>
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

  return (
    <div>
      <WorkflowContextHeader dealName={deal.name} stage="Comparable sales review" returnTo={`/studio/deals/${deal.id}`} returnLabel="Return to deal" />
      <NonProductionCallout>Comparable sales are sample rows with mixed authority states.</NonProductionCallout>
      <div className="dashboard-grid">
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
            <div className="segmented-control" role="tablist" aria-label="Comp view mode">
              <button type="button" role="tab" aria-selected={view === 'table'} className={view === 'table' ? 'active' : ''} onClick={() => setView('table')}>Table</button>
              <button type="button" role="tab" aria-selected={view === 'map'} className={view === 'map' ? 'active' : ''} onClick={() => setView('map')}>Map</button>
            </div>
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
            rows={comps.map((comp) => [
              <button type="button" className="table-link" onClick={() => { setSelected(comp); setDrawerOpen(true); }}>{comp.name}</button>,
              comp.distance,
              comp.units,
              comp.salePrice,
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
      </div>
      <DetailDrawer isOpen={drawerOpen} onClose={() => setDrawerOpen(false)} title={selected?.name ?? 'Comparable'}>
        {selected ? (
          <div className="drawer-facts">
            <MetricCard label="Price / Unit" value={selected.pricePerUnit} detail={selected.authority} />
            <MetricCard label="Cap Rate" value={selected.capRate} detail="Reviewed comparison basis" />
            <TrustBadge state={selected.authority} />
          </div>
        ) : null}
      </DetailDrawer>
    </div>
  );
}

export function StudioUnderwritingPage(): ReactElement {
  const deal = useStudioDeal();
  return (
    <div>
      <WorkflowContextHeader dealName={deal.name} stage="Underwriting cockpit" returnTo={`/studio/deals/${deal.id}`} returnLabel="Return to deal" />
      <div className="tabs-row" role="tablist" aria-label="Scenario tabs">
        {['Base Case', 'Upside', 'Downside'].map((scenario, index) => (
          <button key={scenario} type="button" role="tab" aria-selected={index === 0} className={index === 0 ? 'active' : ''}>
            {scenario}
          </button>
        ))}
        <Link to={`/studio/deals/${deal.id}/scenarios`} className="btn btn-secondary">Compare Scenarios</Link>
      </div>
      <div className="cockpit-grid">
        <StudioCard title="Assumptions Editor">
          <h3>Acquisition</h3>
          {['Purchase Price', 'Closing Costs', 'Renovation Budget'].map((label) => (
            <label key={label}>
              {label}
              <input defaultValue={label === 'Purchase Price' ? deal.value : label === 'Closing Costs' ? '1.5%' : '$12,000/unit'} />
            </label>
          ))}
          <h3>Debt & Exit</h3>
          {['Debt Yield', 'Exit Cap', 'Rent Growth'].map((label) => (
            <label key={label}>
              {label}
              <input defaultValue={label === 'Exit Cap' ? '5.75%' : label === 'Debt Yield' ? '8.4%' : '3.0%'} />
            </label>
          ))}
        </StudioCard>
        <StudioCard title="Key Metrics">
          <div className="metric-grid">
            <MetricCard label="IRR" value="14.8%" detail="Model-inferred" />
            <MetricCard label="EMx" value="1.82x" detail="Base case" />
            <MetricCard label="Yield" value="7.1%" detail="Stabilized" />
            <MetricCard label="DSCR" value="1.31x" detail="Needs lender quote" icon="warning" />
          </div>
          <NonProductionCallout>Metrics are mock calculations and require review before export.</NonProductionCallout>
        </StudioCard>
        <StudioCard title="Review Flags">
          {['Rent growth exceeds market sample', 'Exit cap sourced from candidate comp', 'Debt terms need lender quote'].map((flag) => (
            <div className="flag-row" key={flag}>
              <MaterialIcon name="warning" />
              {flag}
            </div>
          ))}
        </StudioCard>
      </div>
      <StudioCard title="Pro Forma Cash Flow">
        <DataTable
          caption="Five-year pro forma cash flow"
          headers={['Line Item', 'Year 1', 'Year 2', 'Year 3', 'Year 4', 'Year 5']}
          rows={[
            ['Gross Revenue', '$7.2M', '$7.5M', '$7.8M', '$8.0M', '$8.3M'],
            ['Operating Expenses', '($3.1M)', '($3.1M)', '($3.2M)', '($3.3M)', '($3.4M)'],
            ['NOI', '$4.1M', '$4.4M', '$4.6M', '$4.8M', '$4.9M'],
            ['Debt Service', '($2.0M)', '($2.0M)', '($2.0M)', '($2.0M)', '($2.0M)'],
            ['Cash Flow', '$2.1M', '$2.4M', '$2.6M', '$2.8M', '$2.9M'],
          ]}
        />
      </StudioCard>
    </div>
  );
}

export function StudioScenarioComparisonPage(): ReactElement {
  const deal = useStudioDeal();
  return (
    <div>
      <WorkflowContextHeader dealName={deal.name} stage="Scenario comparison" returnTo={`/studio/deals/${deal.id}/underwriting`} returnLabel="Return to underwriting" />
      <NonProductionCallout>Scenario outputs are mock calculations and not investment recommendations.</NonProductionCallout>
      <div className="scenario-grid">
        {scenarios.map((scenario) => (
          <StudioCard key={scenario.id} title={scenario.name}>
            <MetricCard label="IRR" value={scenario.irr} detail={scenario.status} />
            <MetricCard label="Equity Multiple" value={scenario.equityMultiple} detail={`Exit cap ${scenario.exitCap}`} />
          </StudioCard>
        ))}
      </div>
      <StudioCard title="Key Metrics Matrix">
        <DataTable
          caption="Scenario comparison matrix"
          headers={['Metric', ...scenarios.map((scenario) => scenario.name)]}
          rows={[
            ['IRR', ...scenarios.map((scenario) => scenario.irr)],
            ['Equity Multiple', ...scenarios.map((scenario) => scenario.equityMultiple)],
            ['Exit Cap', ...scenarios.map((scenario) => scenario.exitCap)],
            ['Status', ...scenarios.map((scenario) => <StatusBadge status={scenario.status} />)],
            ['Premium Sensitivity', ...scenarios.map(() => <span className="blurred-cell">Locked</span>)],
          ]}
        />
      </StudioCard>
      <StudioCard title="IRR Bar Chart">
        <div className="bar-chart" aria-label="IRR bar chart">
          {scenarios.map((scenario) => (
            <div key={scenario.id}>
              <span>{scenario.name}</span>
              <div><i style={{ width: scenario.irr }} /></div>
              <strong>{scenario.irr}</strong>
            </div>
          ))}
        </div>
      </StudioCard>
      <div className="locked-panel">
        <PaywallOverlay>
          <h3>Sensitivity heatmap locked</h3>
          <p>Premium tier required for advanced scenario sensitivity views.</p>
          <Link className="btn btn-primary" to="/studio/settings/billing">View plans</Link>
        </PaywallOverlay>
      </div>
    </div>
  );
}

export function StudioReportBuilderPage(): ReactElement {
  const approvedCount = reportSections.filter((section) => section.status === 'Approved').length;
  return (
    <div>
      <PageTitle
        title="Report Builder"
        lede="Review sections, citations, branding, and export readiness before delivery."
        actions={<StatusBadge status={`${approvedCount}/${reportSections.length} approved`} />}
      />
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
          {reportSections.map((section) => (
            <div className="section-check" key={section.id}>
              <span className="drag-handle" aria-hidden="true">::</span>
              <MaterialIcon name={section.status === 'Approved' ? 'check_circle' : 'radio_button_unchecked'} />
              <div>
                <strong>{section.name}</strong>
                <span>{section.citationCount} citations</span>
              </div>
              <StatusBadge status={section.status} />
            </div>
          ))}
          <div className="studio-actions">
            <button type="button" className="btn btn-secondary">Export Excel</button>
            <button type="button" className="btn btn-primary" disabled>Export PDF</button>
          </div>
        </StudioCard>
        <StudioCard title="Live PDF Preview" className="pdf-preview-card">
          <div className="pdf-preview">
            <h2>{brandConfig.company}</h2>
            <p>Riverside Flats Investment Preview</p>
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
          <button className="btn btn-primary" type="button" disabled>Export PDF</button>
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
          <div className="segmented-control">
            <button type="button" className={preview === 'portal' ? 'active' : ''} onClick={() => setPreview('portal')}>Portal</button>
            <button type="button" className={preview === 'report' ? 'active' : ''} onClick={() => setPreview('report')}>Report</button>
          </div>
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
