import type { ReactElement } from 'react';
import { Link, useParams } from 'react-router-dom';

import { getPublicReportView } from '@/lib/runtime/report-flow';

const NAV_ITEMS = [
  ['Dashboard', '/studio/dashboard'],
  ['Deal Intake', '/studio/deal-intake'],
  ['Deal Overview', '/studio/deals/demo-deal-001'],
  ['Comps', '/comps'],
  ['Underwriting', '/studio/deals/demo-deal-001/underwriting'],
  ['Scenarios', '/studio/deals/demo-deal-001/scenarios'],
  ['Reports', '/report/demo-001'],
  ['Billing', '/studio/settings/billing'],
  ['Broker OS', '/studio/broker-os'],
] as const;

const WARNING_REGISTER = [
  'Lender quote missing',
  'T12 expense normalization needs review',
  'Provider-restricted comp excluded from export',
] as const;

const ASSUMPTIONS = [
  {
    metric: 'Pro Forma NOI',
    value: '$2,845,000',
    confidence: '82% High',
    confidenceTone: 'strong',
    reviewState: 'Candidate evidence',
  },
  {
    metric: 'Market Cap Rate',
    value: '5.75%',
    confidence: '64% Med',
    confidenceTone: 'warning',
    reviewState: 'Reviewed',
  },
  {
    metric: 'Target IRR',
    value: '14.2%',
    confidence: '91% High',
    confidenceTone: 'strong',
    reviewState: 'Candidate evidence',
  },
] as const;

const REPORT_SECTIONS = [
  { title: 'Executive Summary', status: 'Draft', tone: 'warning' },
  { title: 'Financials', status: 'Blocked', tone: 'danger' },
  { title: 'Market Analysis', status: 'Ready for Review', tone: 'strong' },
] as const;

const STATUS_RAIL = ['Assumptions', 'Evidence', 'Scenarios', 'Review'] as const;

export function ReportPage(): ReactElement {
  const { id } = useParams();
  const reportView = getPublicReportView(id) ?? getPublicReportView('demo-001');
  const reportProperty = reportView?.property;
  const routePropertyLabel = reportProperty
    ? `${reportProperty.assetType} sample in ${reportProperty.market}`
    : 'Mock property report';

  return (
    <section className="reporting-golden-shell" aria-labelledby="reporting-golden-heading">
      <header className="reporting-golden-topbar" aria-label="Sophex public intelligence bar">
        <div className="reporting-golden-brand">
          <strong>Sophex</strong>
          <span>Public Intelligence</span>
        </div>
        <label className="reporting-golden-search">
          <span className="sr-only">Search properties, deals, or comps</span>
          <input readOnly value="Search properties, deals, or comps..." />
        </label>
        <div className="reporting-golden-user-context">
          <Link to="/property/demo-001">456 Riverside Drive</Link>
          <span>In-Underwriting</span>
          <span aria-hidden="true">?</span>
        </div>
      </header>

      <div className="reporting-golden-context-bar">
        <strong>Riverside Flats</strong>
        <span>456 Riverside Drive, Austin TX</span>
        <span>Multifamily</span>
        <code>PID: 9823-A</code>
        <span className="reporting-golden-review">Review Required</span>
      </div>

      <div className="reporting-golden-workspace">
        <aside className="reporting-golden-sidebar" aria-label="Mock Broker OS navigation">
          <div className="reporting-golden-sidebar-brand">
            <span aria-hidden="true">OS</span>
            <div>
              <strong>Broker OS</strong>
              <small>Institutional Grade</small>
            </div>
          </div>
          <nav>
            {NAV_ITEMS.map(([label, href]) => (
              <Link
                key={label}
                to={href}
                className={label === 'Deal Overview' ? 'active' : undefined}
              >
                {label}
              </Link>
            ))}
          </nav>
        </aside>

        <main className="reporting-golden-main">
          <header className="reporting-golden-heading-block">
            <p className="eyebrow">SOPHEX-REPORT-001</p>
            <h1 id="reporting-golden-heading">Intelligence Dashboard</h1>
            <p>
              Not an appraisal. Data is synthesized from public records and candidate evidence.
            </p>
            <small>{routePropertyLabel}</small>
          </header>

          <div className="reporting-golden-grid">
            <section className="reporting-golden-card reporting-golden-valuation">
              <div className="reporting-golden-card-header">
                <div>
                  <p>Estimated Valuation Range</p>
                  <strong>$44.2M - $48.7M</strong>
                </div>
                <span>Advisory / Model-Inferred</span>
              </div>
              <div className="reporting-golden-progress-row">
                <span>Source Coverage</span>
                <strong>72%</strong>
              </div>
              <div className="reporting-golden-progress" aria-label="Source coverage 72 percent">
                <span />
              </div>
              <div className="reporting-golden-signal-row">
                <span className="danger">3 Blockers</span>
                <span className="warning">2 Warnings</span>
              </div>
            </section>

            <section className="reporting-golden-card reporting-golden-baseline">
              <h2>Public Property Baseline</h2>
              <dl>
                <div>
                  <dt>Units</dt>
                  <dd>248</dd>
                </div>
                <div>
                  <dt>NRA (SF)</dt>
                  <dd>210,500</dd>
                </div>
                <div>
                  <dt>Year Built</dt>
                  <dd>2018</dd>
                </div>
              </dl>
              <span className="reporting-golden-source">County Assessor</span>
            </section>

            <section className="reporting-golden-card reporting-golden-warning-card">
              <h2>Warning &amp; Gap Register</h2>
              <ul>
                {WARNING_REGISTER.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </section>

            <section className="reporting-golden-card reporting-golden-assumptions">
              <div className="reporting-golden-card-title-row">
                <h2>Comps &amp; Assumptions</h2>
                <span>Authority Labels Applied</span>
              </div>
              <div className="reporting-golden-table-wrap">
                <table>
                  <thead>
                    <tr>
                      <th>Metric</th>
                      <th>Value</th>
                      <th>Confidence</th>
                      <th>Review State</th>
                    </tr>
                  </thead>
                  <tbody>
                    {ASSUMPTIONS.map((assumption) => (
                      <tr key={assumption.metric}>
                        <td>{assumption.metric}</td>
                        <td>{assumption.value}</td>
                        <td className={assumption.confidenceTone}>{assumption.confidence}</td>
                        <td>
                          <span>{assumption.reviewState}</span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>
          </div>

          <section className="reporting-golden-sections" aria-labelledby="draft-sections-heading">
            <h2 id="draft-sections-heading">Draft Reporting Sections</h2>
            <div>
              {REPORT_SECTIONS.map((section) => (
                <article key={section.title} className="reporting-golden-section-card">
                  <h3>{section.title}</h3>
                  <span className={section.tone}>{section.status}</span>
                </article>
              ))}
            </div>
          </section>
        </main>

        <aside className="reporting-golden-rail" aria-label="Readiness status rail">
          {STATUS_RAIL.map((item, index) => (
            <span key={item} className={index === 0 ? 'active' : undefined}>
              {item}
            </span>
          ))}
          <button
            type="button"
            disabled
            title="Export gated: source rights and review pending"
            aria-label="Export gated: source rights and review pending"
          >
            Export gated
          </button>
        </aside>
      </div>

      <footer className="reporting-golden-footer">
        <span>Prototype-only. No live valuation or export.</span>
        <nav aria-label="Prototype policy links">
          <a href="#security-policy">Security Policy</a>
          <a href="#system-status">System Status</a>
        </nav>
      </footer>
    </section>
  );
}
