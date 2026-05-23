import { useMemo, useState, type ReactElement } from 'react';
import { Link } from 'react-router-dom';

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
const techDeal = deals[1];

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

      <section className="workflow-bento">
        {[
          ['Deal Intake', 'Capture property, deal, assumptions, and source packet context.'],
          ['Comps & Evidence', 'Compare public, reviewed, premium-private, and candidate comparable sales.'],
          ['Underwriting', 'Review assumptions, pro forma deltas, and flags before report generation.'],
          ['White-Label Reports', 'Preview investor portal and PDF branding without hiding source limits.'],
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
    </div>
  );
}

export function StudioOnboardingPage(): ReactElement {
  const [step, setStep] = useState(0);
  const steps = ['Tier', 'Account', 'Workspace', 'First deal'];

  return (
    <div className="onboarding-wrap">
      <StudioCard title="Set up Finem CRE Studio" eyebrow="Step-guided onboarding">
        <StageStepper stages={steps} activeIndex={step} />
        <div className="onboarding-panel">
          {step === 0 ? (
            <div className="choice-grid">
              <button type="button" className="choice-card active">
                <strong>Boutique</strong>
                <span>Lean broker teams managing focused mandates.</span>
              </button>
              <button type="button" className="choice-card">
                <strong>Institutional</strong>
                <span>Multi-market teams requiring advanced controls.</span>
              </button>
            </div>
          ) : null}
          {step === 1 ? (
            <div className="form-grid">
              <label>
                Work email
                <input defaultValue="investors@acmecapital.com" />
              </label>
              <label>
                Company name
                <input defaultValue="Acme Real Estate Partners" />
              </label>
            </div>
          ) : null}
          {step === 2 ? (
            <div className="form-grid">
              <label>
                Primary asset class
                <select defaultValue="Multifamily">
                  <option>Multifamily</option>
                  <option>Office</option>
                  <option>Industrial</option>
                </select>
              </label>
              <label>
                Source-use posture
                <select defaultValue="Candidate evidence">
                  <option>Candidate evidence</option>
                  <option>Organization-private</option>
                </select>
              </label>
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
          headers={['Feature', 'Free', 'Premium', 'Enterprise']}
          rows={[
            ['Deal pipeline', '1 active', 'Unlimited', 'Team controls'],
            ['Comps', 'Sample only', 'Reviewed + candidate', 'Premium/private tiers'],
            ['Reports', 'Draft preview', 'Export gate', 'White-label portal'],
            ['Broker OS', 'No', 'Read-only summary', 'Full operator inventory'],
          ]}
        />
      </StudioCard>
    </div>
  );
}

export function StudioDashboardPage(): ReactElement {
  return (
    <div>
      <PageTitle
        title="Main Deal Dashboard"
        lede="Track active mandates, plan usage, and source-aware broker workflow activity."
        actions={<Link to="/studio/deal-intake" className="btn btn-primary">New Deal</Link>}
      />
      <div className="metric-grid four">
        <MetricCard label="Active pipeline" value="$193.5M" detail="3 tracked deals" />
        <MetricCard label="Reports drafted" value="12" detail="4 need review" icon="description" />
        <MetricCard label="Comp sets" value="28" detail="7 premium-private" icon="analytics" />
        <MetricCard label="Plan usage" value="72%" detail="Premium mock tier" icon="speed" />
      </div>
      <div className="dashboard-grid">
        <StudioCard title="Deal Pipeline" className="wide-card">
          <DataTable
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
        <StudioCard title="Recent Activity">
          <AnimatedList className="activity-list">
            {activity.map((item) => (
              <div key={item}>
                <MaterialIcon name="history" />
                <span>{item}</span>
              </div>
            ))}
          </AnimatedList>
        </StudioCard>
      </div>
    </div>
  );
}

export function StudioDealOverviewPage(): ReactElement {
  const [drawerOpen, setDrawerOpen] = useState(false);
  return (
    <div>
      <WorkflowContextHeader dealName={primaryDeal.name} stage="Underwriting workspace" returnTo="/studio/dashboard" />
      <div className="metric-grid four">
        <MetricCard label="Value" value={primaryDeal.value} detail={primaryDeal.authority} />
        <MetricCard label="NOI" value={primaryDeal.noi} detail="Rent roll candidate" />
        <MetricCard label="Cap Rate" value={primaryDeal.capRate} detail="Model-inferred" />
        <MetricCard label="Stage" value={primaryDeal.stage} detail="Analyst review active" />
      </div>
      <div className="tabs-row" role="tablist" aria-label="Deal sections">
        {['Overview', 'Documents', 'Activity', 'Team'].map((tab, index) => (
          <button key={tab} className={index === 0 ? 'active' : ''} type="button">
            {tab}
          </button>
        ))}
      </div>
      <div className="dashboard-grid">
        <StudioCard title="Property Snapshot" className="wide-card">
          <p>{primaryDeal.address} in {primaryDeal.market}. Multifamily value-add opportunity with source-backed assumptions pending review.</p>
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
            headers={['Document', 'State']}
            rows={[
              ['Offering memorandum.pdf', <TrustBadge state="Candidate evidence" />],
              ['Rent roll.xlsx', <TrustBadge state="Reviewed" />],
              ['T12.pdf', <TrustBadge state="Candidate evidence" />],
            ]}
          />
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
          <div className="upload-zone">
            <MaterialIcon name="upload_file" />
            <strong>Drop OM, rent roll, and T12 files here</strong>
            <span>Mock upload only. Extracted values remain candidate evidence.</span>
          </div>
        </StudioCard>
        <StickyActionBar>
          <button className="btn btn-secondary" type="button">Save draft</button>
          <Link to="/studio/deals/riverside-flats" className="btn btn-primary">Continue</Link>
        </StickyActionBar>
      </div>
      <StudioCard title="Packet Preview">
        <div className="packet-preview">
          <h3>{propertyName || 'Untitled deal'}</h3>
          <p>Austin multifamily acquisition packet</p>
          <TrustBadge state="Candidate evidence" />
          <StageStepper stages={['Uploaded', 'Extracting', 'Needs review', 'Ready']} activeIndex={2} />
        </div>
      </StudioCard>
    </div>
  );
}

export function StudioCompsPage(): ReactElement {
  const [selected, setSelected] = useState<Comp | null>(comps[0]);
  const [drawerOpen, setDrawerOpen] = useState(false);

  return (
    <div>
      <WorkflowContextHeader dealName={primaryDeal.name} stage="Comparable sales review" returnTo="/studio/deals/riverside-flats" />
      <NonProductionCallout>Comparable sales are sample rows with mixed authority states.</NonProductionCallout>
      <div className="dashboard-grid">
        <StudioCard title="Subject Property">
          <p>{primaryDeal.address}</p>
          <MetricCard label="Units" value="196" detail="Candidate from OM" />
          <MetricCard label="Target basis" value="$217k/unit" detail="Model-inferred" />
        </StudioCard>
        <StudioCard title="Sales Comparables" className="wide-card">
          <DataTable
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
  return (
    <div>
      <WorkflowContextHeader dealName={techDeal.name} stage="Underwriting cockpit" returnTo="/studio/dashboard" />
      <div className="cockpit-grid">
        <StudioCard title="Assumptions Editor">
          {['Rent growth', 'Exit cap', 'Vacancy', 'Renovation budget'].map((label) => (
            <label key={label}>
              {label}
              <input defaultValue={label === 'Exit cap' ? '5.75%' : label === 'Vacancy' ? '6.0%' : '3.0%'} />
            </label>
          ))}
        </StudioCard>
        <StudioCard title="Key Metrics">
          <div className="metric-grid">
            <MetricCard label="IRR" value="14.8%" detail="Model-inferred" />
            <MetricCard label="EMx" value="1.82x" detail="Base case" />
            <MetricCard label="Yield" value="7.1%" detail="Stabilized" />
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
          headers={['Year', 'NOI', 'Debt Service', 'Cash Flow']}
          rows={[
            ['Year 1', '$4.1M', '$2.0M', '$2.1M'],
            ['Year 2', '$4.4M', '$2.0M', '$2.4M'],
            ['Year 3', '$4.8M', '$2.0M', '$2.8M'],
          ]}
        />
      </StudioCard>
    </div>
  );
}

export function StudioScenarioComparisonPage(): ReactElement {
  return (
    <div>
      <WorkflowContextHeader dealName={primaryDeal.name} stage="Scenario comparison" returnTo="/studio/deals/riverside-flats/underwriting" />
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
          headers={['Scenario', 'IRR', 'Equity Multiple', 'Exit Cap', 'Status']}
          rows={scenarios.map((scenario) => [
            scenario.name,
            scenario.irr,
            scenario.equityMultiple,
            scenario.exitCap,
            <StatusBadge status={scenario.status} />,
          ])}
        />
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
          {reportSections.map((section) => (
            <div className="section-check" key={section.id}>
              <MaterialIcon name={section.status === 'Approved' ? 'check_circle' : 'radio_button_unchecked'} />
              <div>
                <strong>{section.name}</strong>
                <span>{section.citationCount} citations</span>
              </div>
              <StatusBadge status={section.status} />
            </div>
          ))}
        </StudioCard>
        <StudioCard title="Live PDF Preview" className="pdf-preview-card">
          <div className="pdf-preview">
            <h2>{brandConfig.company}</h2>
            <p>Riverside Flats Investment Preview</p>
            <div className="pdf-line" />
            <div className="pdf-block" />
            <div className="pdf-block short" />
            <small>{brandConfig.disclaimer}</small>
          </div>
        </StudioCard>
        <StudioCard title="Branding & Export">
          <p><Swatch color={brandConfig.accentColor} /> Accent color</p>
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
  const [accent, setAccent] = useState(brandConfig.accentColor);
  const [preview, setPreview] = useState<'portal' | 'report'>('portal');

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
            <label>Accent Color<input type="color" value={accent} onChange={(event) => setAccent(event.target.value)} /></label>
            <label>Heading Typeface<select defaultValue="Inter"><option>Inter</option><option>Roboto</option></select></label>
          </div>
        </StudioCard>
        <StudioCard title="Client Portal Access" className="enterprise-card">
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
        <div className="portal-preview" style={{ '--brand-accent': accent } as React.CSSProperties}>
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
        actions={<StatusBadge status="System Operational" />}
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
      <StudioCard title="Planning Context Builder" className="dark-card" actions={<span>Mission Brief Preview</span>}>
        <JsonContextViewer value={planningContext} />
      </StudioCard>
    </div>
  );
}
