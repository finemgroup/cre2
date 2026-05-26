import { type ReactElement } from 'react';

import { BentoGrid, BentoTile } from '@/components/studio/BentoTile';
import {
  DataTable,
  MaterialIcon,
  MetricCard,
  PageTitle,
  StatusBadge,
  StudioCard,
  TrustBadge,
} from '@/components/studio/StudioPrimitives';
import { AuthorityBadge } from '@/components/ui/AuthorityBadge';

import { PresentationModeToggle } from '@/components/layout/PresentationModeToggle';
import { usePresentationMode } from '@/lib/studio/usePresentationMode';

const swatches = [
  ['Ink', '--ink'],
  ['Paper', '--paper'],
  ['Parchment', '--parchment'],
  ['CRE Green', '--cre-green'],
  ['CRE Gold', '--cre-gold'],
  ['Chrome Forest', '--chrome-forest'],
] as const;

export function StudioDesignSystemPage(): ReactElement {
  const { enabled: presentationMode } = usePresentationMode();

  return (
    <div className={presentationMode ? 'presentation-mode' : undefined}>
      <PageTitle
        eyebrow="Design system"
        title="Sophex Visual Language"
        lede="Institutional CRE palette harvested from cre-platform and ICSC warm workbench patterns."
        actions={<PresentationModeToggle className="btn btn-secondary" />}
      />

      <StudioCard title="Color tokens" eyebrow="Institutional ladder">
        <div className="card-grid">
          {swatches.map(([label, token]) => (
            <div key={token} className="card">
              <span
                style={{
                  display: 'block',
                  height: '3rem',
                  borderRadius: '0.45rem',
                  border: '1px solid var(--cre-border-gold)',
                  background: `var(${token})`,
                  marginBottom: '0.5rem',
                }}
                aria-hidden
              />
              <strong>{label}</strong>
              <p className="muted">
                <code>{token}</code>
              </p>
            </div>
          ))}
        </div>
      </StudioCard>

      <StudioCard title="Typography" eyebrow="Hierarchy">
        <p className="micro-label">Micro label · evidence posture</p>
        <h2 style={{ margin: '0.35rem 0', fontSize: 'var(--type-display)' }}>Display headline</h2>
        <p className="lede">Lead copy for cockpit context with institutional spacing.</p>
        <p>
          Body copy. KPI values use <span className="fin-value">$42,500,000</span> tabular nums.
        </p>
      </StudioCard>

      <StudioCard title="Buttons & chips" eyebrow="Interaction">
        <div className="studio-actions">
          <button type="button" className="btn btn-primary">
            Primary
          </button>
          <button type="button" className="btn btn-secondary">
            Secondary
          </button>
          <button type="button" className="btn btn-ghost">
            Ghost
          </button>
          <span className="badge badge-advisory">Advisory</span>
        </div>
      </StudioCard>

      <StudioCard title="Trust badges" eyebrow="Unified vocabulary">
        <div className="provenance-labels">
          <AuthorityBadge label="candidate-evidence" />
          <AuthorityBadge label="approved-public-projection" />
          <TrustBadge state="Reviewed" />
          <StatusBadge status="Blocked" />
        </div>
      </StudioCard>

      <StudioCard title="Surfaces" eyebrow="Depth">
        <div className="card-grid">
          <div className="card elevation-low hover-lift-subtle">Public card</div>
          <div className="studio-card elevation-medium">Studio card</div>
          <div className="mock-map">
            <MaterialIcon name="map" />
            Map HUD
          </div>
        </div>
      </StudioCard>

      <StudioCard title="Data table" eyebrow="Institutional density">
        <DataTable
          dense
          caption="Sample comps"
          headers={['Comp', 'Distance', 'Sale Price', 'Authority']}
          rows={[
            ['Riverside Flats', '0.4 mi', <span className="fin-value">$42.5M</span>, 'Reviewed'],
            ['Harbor View', '0.8 mi', <span className="fin-value">$39.1M</span>, 'Candidate'],
          ]}
        />
      </StudioCard>

      <BentoGrid>
        <BentoTile
          title="Metric tile"
          variant="metric"
          primary={<p className="sophex-bento-metric-value fin-value">18.4%</p>}
          subtitle="Formula-backed IRR"
        />
        <BentoTile
          title="Status tile"
          variant="status"
          status="Advisory"
          span={2}
          to="/studio/dashboard"
        />
      </BentoGrid>

      <div className="metric-grid four">
        <MetricCard label="NOI" value="$4.2M" detail="Formula-backed" />
        <MetricCard label="IRR" value="18.4%" detail="Model-inferred" />
      </div>
    </div>
  );
}
