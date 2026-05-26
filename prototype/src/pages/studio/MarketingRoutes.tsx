import { useState, type ReactElement } from 'react';
import { Link, useNavigate } from 'react-router-dom';

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
import { DEFAULT_DEAL_ID, studioDealPath } from '@/data/studio';
import { getStudioDashboardView } from '@/lib/runtime/studio-workspace';
import { getStudioBillingView } from '@/lib/studio/billing-plans';
import { getStudioOnboardingView, type StudioOnboardingView } from '@/lib/studio/onboarding-flow';

type OnboardingTierOption = StudioOnboardingView['tierOptions'][number];
import { runtimeServices } from '@/lib/runtime/runtime-services';
import { useRuntimeResource } from '@/lib/runtime/useRuntimeResource';
import { RuntimeResourceStatus } from '@/components/runtime/RuntimeResourceStatus';
import { saveOnboardingProfile } from '@/lib/studio/onboarding-profile';
import { SegmentedControl, TabPanelSwitch } from '@/pages/studio/StudioShared';

export function StudioLandingPage(): ReactElement {
  const dashboardView = getStudioDashboardView();

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
            <PrototypeActionLink
              to="/studio/onboarding"
              className="btn btn-primary"
              feature="Start workspace"
            >
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
          <div className="proof-strip" aria-label="Product proof points">
            {[
              ['3', 'Active mock deals'],
              ['12', 'Review gates enforced'],
              ['100%', 'Evidence posture visible'],
            ].map(([value, label]) => (
              <article key={label}>
                <strong className="fin-value">{value}</strong>
                <span>{label}</span>
              </article>
            ))}
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
            {dashboardView.deals.map((deal) => (
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

      <section className="proof-strip studio-outcomes" aria-label="Workflow outcomes">
        {[
          [
            'Governed intake',
            'Every packet keeps candidate evidence separate from reviewed output.',
          ],
          [
            'Visible comps posture',
            'Public, reviewed, and restricted tiers stay labeled in the UI.',
          ],
          [
            'Export discipline',
            'Reports stay gated until review, consent, and source rights clear.',
          ],
        ].map(([title, copy]) => (
          <article key={title}>
            <strong>{title}</strong>
            <p>{copy}</p>
          </article>
        ))}
      </section>

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
            'Operator monitoring',
            'Track sanitized job projections and capability inventory in read-only mode.',
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
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [tier, setTier] = useState<'Boutique' | 'Institutional'>('Institutional');
  const [assetClasses, setAssetClasses] = useState(['Multifamily']);
  const [companyName, setCompanyName] = useState('Acme Real Estate Partners');
  const { message, announce } = useA11yAnnouncement();
  const onboardingState = useRuntimeResource(
    () => runtimeServices.studio.getOnboardingView(),
    'studio-onboarding',
    getStudioOnboardingView()
  );
  const onboardingView = onboardingState.value;
  const steps = onboardingView?.steps ?? ['Tier', 'Account', 'Workspace', 'First deal'];
  const goToStep = (nextStep: number) => {
    setStep(nextStep);
    announce(`Onboarding step ${nextStep + 1}: ${steps[nextStep]}`);
  };

  function finishOnboarding() {
    saveOnboardingProfile({ tier, assetClasses, companyName });
    navigate('/studio/dashboard');
  }

  return (
    <div className="onboarding-wrap">
      <ScreenReaderAnnouncement message={message} />
      <StudioCard title="Set up Finem CRE Studio" eyebrow="Step-guided onboarding">
        <NonProductionCallout>
          {onboardingView?.accountCreationNote ??
            'Account creation remains operator gated in this prototype.'}
        </NonProductionCallout>
        <RuntimeResourceStatus
          loading={onboardingState.loading}
          error={onboardingState.error}
          variant="studio"
        />
        {onboardingView && !onboardingState.loading ? (
          <div className="proof-strip" aria-label="Onboarding posture">
            {[
              [onboardingView.steps.length, 'Wizard steps'],
              [onboardingView.tierOptions.length, 'Plan tiers'],
              ['Local', 'Profile storage'],
              ['Blocked', 'Live signup'],
            ].map(([value, label]) => (
              <article key={String(label)}>
                <strong className="fin-value">{value}</strong>
                <span>{label}</span>
              </article>
            ))}
          </div>
        ) : null}
        <StageStepper stages={steps} activeIndex={step} />
        <TabPanelSwitch panelKey={String(step)} className="onboarding-panel">
          {step === 0 ? (
            <div className="choice-grid">
              {onboardingView?.tierOptions.map((option: OnboardingTierOption) => {
                const selectedTier = option.label as 'Boutique' | 'Institutional';
                return (
                  <button
                    type="button"
                    key={option.id}
                    className={tier === selectedTier ? 'choice-card active' : 'choice-card'}
                    aria-pressed={tier === selectedTier}
                    onClick={() => setTier(selectedTier)}
                  >
                    <strong>{option.label}</strong>
                    <span>{option.price}</span>
                    <span>{option.copy}</span>
                    <small>{option.detail}</small>
                  </button>
                );
              })}
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
                <input
                  value={companyName}
                  onChange={(event) => setCompanyName(event.target.value)}
                />
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
                {(
                  onboardingView?.assetClassOptions ?? [
                    'Multifamily',
                    'Office',
                    'Industrial',
                    'Retail',
                  ]
                ).map((asset: string) => {
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
              {onboardingView?.linkedBillingPath ? (
                <p className="contextual-handoffs">
                  <PrototypeActionLink
                    to={onboardingView.linkedBillingPath}
                    feature="Compare billing plans during onboarding"
                  >
                    Compare full plan matrix
                  </PrototypeActionLink>
                </p>
              ) : null}
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
        </TabPanelSwitch>
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
            <button className="btn btn-primary" type="button" onClick={finishOnboarding}>
              Finish
            </button>
          )}
        </div>
      </StudioCard>
    </div>
  );
}

export function StudioPricingPage(): ReactElement {
  const [annual, setAnnual] = useState(true);
  const billingState = useRuntimeResource(
    () => runtimeServices.studio.getBillingPlans(),
    'studio-billing',
    getStudioBillingView()
  );
  const billingView = billingState.value;

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
      <NonProductionCallout>
        {billingView?.entitlementsNote ??
          'Plan entitlements are fixture-only until billing provider approval.'}
      </NonProductionCallout>
      <RuntimeResourceStatus
        loading={billingState.loading}
        error={billingState.error}
        variant="studio"
      />
      {billingView && !billingState.loading ? (
        <>
          <div className="proof-strip" aria-label="Billing plan posture">
            {[
              [billingView.plans.length, 'Plan tiers'],
              [annual ? 'Annual' : 'Monthly', 'Selected cadence'],
              ['Mock', 'Checkout posture'],
              ['Blocked', 'Live billing'],
            ].map(([value, label]) => (
              <article key={String(label)}>
                <strong className="fin-value">{value}</strong>
                <span>{label}</span>
              </article>
            ))}
          </div>
          <TabPanelSwitch panelKey={annual ? 'annual' : 'monthly'}>
            <div className="pricing-grid">
              {billingView.plans.map((plan) => (
                <StudioCard
                  key={plan.id}
                  title={plan.name}
                  className={plan.featured ? 'featured-card' : ''}
                >
                  <p className="plan-price">{annual ? plan.annualPrice : plan.monthlyPrice}</p>
                  <p>{plan.copy}</p>
                  <PrototypeActionLink
                    to="/studio/dashboard"
                    className="btn btn-primary"
                    feature={
                      plan.id === 'enterprise'
                        ? 'Enterprise sales contact'
                        : `${plan.name} plan selection`
                    }
                  >
                    {plan.id === 'enterprise' ? 'Contact sales' : 'Select plan'}
                  </PrototypeActionLink>
                </StudioCard>
              ))}
            </div>
          </TabPanelSwitch>
          <StudioCard title="Feature comparison">
            <DataTable
              caption="Plan feature comparison"
              headers={['Feature', 'Free', 'Premium', 'Enterprise']}
              rows={billingView.featureComparison}
            />
          </StudioCard>
          <StudioCard title="FAQ">
            <div className="faq-list faq-card-list">
              {billingView.faq.map(([question, answer]) => (
                <div className="faq-card" key={question}>
                  <strong>{question}</strong>
                  <p>{answer}</p>
                </div>
              ))}
            </div>
          </StudioCard>
        </>
      ) : null}
      <footer className="studio-footer">
        Billing prototype - no live Stripe or provider calls.
      </footer>
    </div>
  );
}
