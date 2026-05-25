import { useState, type ReactElement } from 'react';
import { Link } from 'react-router-dom';

import {
  AnimatedList,
  DataTable,
  MetricCard,
  MotionBlock,
  NonProductionCallout,
  PageTitle,
  StageStepper,
  StudioCard,
} from '@/components/studio/StudioPrimitives';
import { PrototypeActionAnchor } from '@/components/overlays/PrototypeActionAnchor';
import { PrototypeActionLink } from '@/components/overlays/PrototypeActionLink';
import { ScreenReaderAnnouncement } from '@/components/workflow/WorkflowPrimitives';
import { useA11yAnnouncement } from '@/lib/a11y/useA11yAnnouncement';
import { DEFAULT_DEAL_ID, deals, studioDealPath } from '@/data/studio';
import { SegmentedControl } from '@/pages/studio/StudioShared';

export function StudioLandingPage(): ReactElement {
  return (
    <div className="studio-marketing">
      <header className="studio-public-nav">
        <Link to="/studio" className="studio-topbar-brand">
          Finem CRE Studio
        </Link>
        <nav aria-label="Marketing navigation">
          <PrototypeActionAnchor href="#how-it-works" feature="How it works navigation">
            How it works
          </PrototypeActionAnchor>
          <PrototypeActionAnchor href="#workflows" feature="Workflows navigation">
            Workflows
          </PrototypeActionAnchor>
          <PrototypeActionLink to="/studio/settings/billing" feature="Pricing navigation">
            Pricing
          </PrototypeActionLink>
          <PrototypeActionLink to="/studio/dashboard" feature="Studio sign in">
            Sign in
          </PrototypeActionLink>
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
            <PrototypeActionLink to="/studio/onboarding" className="btn btn-primary" feature="Start workspace">
              Start workspace
            </PrototypeActionLink>
            <PrototypeActionLink
              to="/studio/dashboard"
              className="btn btn-secondary"
              feature="View dashboard"
            >
              View dashboard
            </PrototypeActionLink>
          </div>
        </MotionBlock>
        <MotionBlock className="hero-product-card" motionName="railEnter">
          <div className="mini-browser-bar">
            <span />
            <span />
            <span />
          </div>
          <MetricCard
            label="Pipeline"
            value="$193.5M"
            detail="3 active mock deals"
            icon="monitoring"
          />
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
        {['Import OM', 'Extract candidates', 'Review comps', 'Publish report'].map(
          (step, index) => (
            <StudioCard key={step}>
              <span className="stage-index">{index + 1}</span>
              <h3>{step}</h3>
              <p>Every step keeps candidate evidence separate from reviewed output.</p>
            </StudioCard>
          )
        )}
      </section>

      <AnimatedList id="workflows" className="workflow-bento">
        {[
          ['Deal Intake', 'Capture property, deal, assumptions, and source packet context.'],
          [
            'Comps & Evidence',
            'Compare public, reviewed, premium-private, and candidate comparable sales.',
          ],
          [
            'Underwriting',
            'Review assumptions, pro forma deltas, and flags before report generation.',
          ],
          [
            'White-Label Reports',
            'Preview investor portal and PDF branding without hiding source limits.',
          ],
          [
            'Broker OS',
            'Monitor sanitized job projections and capability inventory in read-only mode.',
          ],
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
        <PrototypeActionLink
          to="/studio/settings/billing"
          className="btn btn-secondary"
          feature="Compare plans"
        >
          Compare plans
        </PrototypeActionLink>
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
              <button
                type="button"
                className={tier === 'Boutique' ? 'choice-card active' : 'choice-card'}
                aria-pressed={tier === 'Boutique'}
                onClick={() => setTier('Boutique')}
              >
                <strong>Boutique</strong>
                <span>$149/mo</span>
                <span>Lean broker teams managing focused mandates.</span>
                <small>3 active deals, draft reports, sample comps.</small>
              </button>
              <button
                type="button"
                className={tier === 'Institutional' ? 'choice-card active' : 'choice-card'}
                aria-pressed={tier === 'Institutional'}
                onClick={() => setTier('Institutional')}
              >
                <strong>Institutional</strong>
                <span>Popular - $399/mo</span>
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
              <PrototypeActionLink
                to={studioDealPath(DEFAULT_DEAL_ID, 'intake')}
                className="choice-card active"
                feature="Create first deal"
              >
                <strong>Create first deal</strong>
                <span>Start with an intake packet and source materials.</span>
              </PrototypeActionLink>
              <PrototypeActionLink
                to="/studio/dashboard"
                className="choice-card"
                feature="Explore dashboard"
              >
                <strong>Explore dashboard</strong>
                <span>Review the mock broker workspace first.</span>
              </PrototypeActionLink>
              <PrototypeActionLink
                to={studioDealPath()}
                className="choice-card"
                feature="Open sample deal"
              >
                <strong>Open sample deal</strong>
                <span>Use Riverside Flats to inspect the full workflow.</span>
              </PrototypeActionLink>
            </div>
          ) : null}
        </div>
        <div className="wizard-actions">
          <button
            className="btn btn-secondary"
            type="button"
            disabled={step === 0}
            onClick={() => goToStep(step - 1)}
          >
            Back
          </button>
          {step < steps.length - 1 ? (
            <button className="btn btn-primary" type="button" onClick={() => goToStep(step + 1)}>
              Continue
            </button>
          ) : (
            <PrototypeActionLink className="btn btn-primary" to="/studio/dashboard" feature="Finish onboarding">
              Finish
            </PrototypeActionLink>
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
            <PrototypeActionLink
              to="/studio/dashboard"
              className="btn btn-primary"
              feature={
                name === 'Enterprise' ? 'Enterprise sales contact' : `${name} plan selection`
              }
            >
              {name === 'Enterprise' ? 'Contact sales' : 'Select plan'}
            </PrototypeActionLink>
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
            [
              'Can I upgrade later?',
              'Yes. Upgrade paths are mocked here and route through the same governed workspace.',
            ],
            [
              'Do reports export automatically?',
              'No. Exports remain gated by review, consent, and source-rights posture.',
            ],
            [
              'Does white-label change source limits?',
              'No. Branding never hides evidence posture, consent state, or non-production labels.',
            ],
          ].map(([question, answer]) => (
            <div className="faq-card" key={question}>
              <strong>{question}</strong>
              <p>{answer}</p>
            </div>
          ))}
        </div>
      </StudioCard>
      <footer className="studio-footer">
        Billing prototype - no live Stripe or provider calls.
      </footer>
    </div>
  );
}
