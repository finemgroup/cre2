import { useMemo, useState, type ReactElement } from 'react';

import { PrototypeActionButton } from '@/components/overlays/PrototypeActionButton';
import {
  JobStreamsTable,
  JsonContextViewer,
  MetricCard,
  PageTitle,
  StatusBadge,
  StudioCard,
} from '@/components/studio/StudioPrimitives';
import { getBrokerOsProjection } from '@/lib/runtime/studio-workspace';

export function StudioBrokerOsPage(): ReactElement {
  const [copied, setCopied] = useState(false);
  const brokerProjection = getBrokerOsProjection();
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
        actions={
          <>
            <StatusBadge status="System Operational" />
            <span className="status-badge">Uptime: 99.9%</span>
          </>
        }
      />
      <div className="broker-grid">
        <StudioCard
          title="Readiness Summary"
          className="wide-card"
          actions={
            <PrototypeActionButton feature="Broker OS job refresh" className="btn btn-ghost">
              Refresh streams
            </PrototypeActionButton>
          }
        >
          <div className="metric-grid four">
            <MetricCard label="API Gateway" value="42ms" detail="Healthy" />
            <MetricCard label="Agent Nodes" value="12/12" detail="Online" />
            <MetricCard label="DB Pool" value="45%" detail="Projection only" icon="water_drop" />
            <MetricCard label="Error Rate" value="0.01%" detail="Sanitized" icon="trending_down" />
          </div>
          <h3>Active Job Streams (GET /api/v1/jobs)</h3>
          <p className="muted">{brokerProjection.safeProjectionLabel}</p>
          <JobStreamsTable jobs={brokerProjection.jobStreams} />
        </StudioCard>
        <StudioCard title="Agent Inventory" actions={<span className="status-badge">RO</span>}>
          <div className="agent-list">
            {brokerProjection.agentCapabilities.map((agent) => (
              <PrototypeActionButton
                key={agent.id}
                feature={`${agent.name} agent inventory`}
                className="agent-card"
                aria-label={`View ${agent.name} agent details`}
              >
                <div>
                  <strong>{agent.name}</strong>
                  <StatusBadge status={agent.status} />
                </div>
                <p>{agent.description}</p>
                <div className="tag-row">
                  {agent.tags.map((tag) => (
                    <span key={tag}>{tag}</span>
                  ))}
                </div>
              </PrototypeActionButton>
            ))}
          </div>
        </StudioCard>
      </div>
      <StudioCard
        title="Planning Context Builder"
        className="dark-card"
        actions={
          <button
            type="button"
            className="btn btn-secondary"
            onClick={() => {
              void navigator.clipboard?.writeText(JSON.stringify(planningContext, null, 2));
              setCopied(true);
            }}
          >
            Copy JSON
          </button>
        }
      >
        {copied ? (
          <p className="status-badge" role="status">
            Sanitized mock planning context copied.
          </p>
        ) : null}
        <JsonContextViewer value={planningContext} />
      </StudioCard>
    </div>
  );
}
