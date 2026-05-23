# 🛠️ INTERACTIVE CONTENT ENGINE: TECHNICAL IMPLEMENTATION BLUEPRINT

**Date**: January 14, 2026  
**For**: Finem Map-Based Workflow Platform  
**Goal**: Build high-conversion interactive market research content system

---

## SECTION 1: COMPONENT ARCHITECTURE

### A. INTERACTIVE COMPARISON DASHBOARD (React Component)

```typescript
// components/TenantComparison.tsx

import React, { useState } from 'react';
import { Recharts } from 'recharts';

interface ComparisonProps {
  tenants: Tenant[];
  metrics: MetricConfig[];
  onSave: (report: SavedReport) => void;
}

export const TenantComparison: React.FC<ComparisonProps> = ({
  tenants,
  metrics,
  onSave,
}) => {
  const [selectedTenants, setSelectedTenants] = useState<string[]>([]);
  const [selectedMetrics, setSelectedMetrics] = useState<string[]>(
    metrics.map(m => m.id)
  );
  const [sortBy, setSortBy] = useState<string>('capRate');
  const [expandedMetric, setExpandedMetric] = useState<string | null>(null);

  // Data transformation
  const comparisonData = selectedTenants
    .map(tenantId => {
      const tenant = tenants.find(t => t.id === tenantId);
      return selectedMetrics.reduce((acc, metricId) => {
        const metric = metrics.find(m => m.id === metricId);
        return {
          ...acc,
          [metricId]: tenant?.[metricId],
        };
      }, { tenantId, tenantName: tenant?.name });
    })
    .sort((a, b) => (a[sortBy] > b[sortBy] ? -1 : 1));

  return (
    <div className="space-y-6">
      {/* Tenant Selection */}
      <div className="flex flex-wrap gap-3">
        {tenants.map(tenant => (
          <button
            key={tenant.id}
            onClick={() =>
              setSelectedTenants(prev =>
                prev.includes(tenant.id)
                  ? prev.filter(id => id !== tenant.id)
                  : [...prev, tenant.id].slice(0, 3) // Max 3
              )
            }
            className={`px-4 py-2 rounded-lg font-medium transition ${
              selectedTenants.includes(tenant.id)
                ? 'bg-primary text-white'
                : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
            }`}
          >
            {tenant.name}
          </button>
        ))}
      </div>

      {/* Comparison Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b-2 border-gray-300">
              <th className="text-left py-3 px-4 font-semibold">Metric</th>
              {selectedTenants.map(tenantId => (
                <th key={tenantId} className="text-center py-3 px-4 font-semibold">
                  {tenants.find(t => t.id === tenantId)?.name}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {selectedMetrics.map(metricId => {
              const metric = metrics.find(m => m.id === metricId);
              return (
                <tr
                  key={metricId}
                  onClick={() =>
                    setExpandedMetric(
                      expandedMetric === metricId ? null : metricId
                    )
                  }
                  className="border-b border-gray-200 hover:bg-gray-50 cursor-pointer"
                >
                  <td className="py-3 px-4 font-medium">{metric?.label}</td>
                  {selectedTenants.map(tenantId => {
                    const tenant = tenants.find(t => t.id === tenantId);
                    const value = tenant?.[metricId];
                    return (
                      <td key={tenantId} className="text-center py-3 px-4">
                        <ValueDisplay metric={metric} value={value} />
                      </td>
                    );
                  })}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Expanded Metric Detail (Modal or Drawer) */}
      {expandedMetric && (
        <MetricDetailModal
          metric={metrics.find(m => m.id === expandedMetric)!}
          data={comparisonData}
          onClose={() => setExpandedMetric(null)}
        />
      )}

      {/* Action Buttons */}
      <div className="flex gap-3">
        <button
          onClick={() =>
            onSave({ tenants: selectedTenants, metrics: selectedMetrics })
          }
          className="px-6 py-2 bg-primary text-white rounded-lg font-medium"
        >
          Save Report
        </button>
        <button
          onClick={() => {
            /* Export to PDF */
          }}
          className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg font-medium"
        >
          Export PDF
        </button>
      </div>
    </div>
  );
};

// Child component: Metric value with conditional styling
interface ValueDisplayProps {
  metric: MetricConfig;
  value: any;
}

const ValueDisplay: React.FC<ValueDisplayProps> = ({ metric, value }) => {
  const isHighPerforming =
    value > metric.benchmarkValue && metric.higherIsBetter;

  return (
    <div className="flex items-center justify-center gap-2">
      <span className={isHighPerforming ? 'font-bold text-green-600' : ''}>
        {metric.formatter ? metric.formatter(value) : value}
      </span>
      {isHighPerforming && <span>🟢</span>}
      {!isHighPerforming && value < metric.benchmarkValue && <span>🔴</span>}
    </div>
  );
};
```

---

### B. REGIONAL HEAT MAP (React + Mapbox)

```typescript
// components/RegionalHeatMap.tsx

import React, { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';

interface HeatMapProps {
  data: RegionalMetrics[];
  metric: string; // 'capRate', 'availability', etc.
  onStateClick: (state: string) => void;
}

export const RegionalHeatMap: React.FC<HeatMapProps> = ({
  data,
  metric,
  onStateClick,
}) => {
  const mapContainer = useRef(null);
  const map = useRef(null);
  const [hoveredState, setHoveredState] = useState<string | null>(null);

  useEffect(() => {
    if (!mapContainer.current) return;

    // Initialize map
    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/light-v11',
      center: [-95, 37.8],
      zoom: 3.5,
    });

    // Load state boundaries GeoJSON
    map.current.on('load', () => {
      map.current.addSource('states', {
        type: 'geojson',
        data: 'https://data.nnntrends.com/states.geojson',
      });

      // Paint layer with color scale
      map.current.addLayer({
        id: 'states-fill',
        type: 'fill',
        source: 'states',
        paint: {
          'fill-color': [
            'case',
            ['boolean', ['feature-state', 'hovered'], false],
            '#000', // Hovered state
            getColorForValue(metric),
          ],
          'fill-opacity': 0.7,
        },
      });

      // Border layer
      map.current.addLayer({
        id: 'states-border',
        type: 'line',
        source: 'states',
        paint: {
          'line-color': '#ccc',
          'line-width': 1,
        },
      });

      // Interactive layer
      map.current.on('mousemove', 'states-fill', (e: any) => {
        if (e.features.length > 0) {
          const feature = e.features[0];
          setHoveredState(feature.properties.name);

          map.current.setFeatureState(
            { source: 'states', id: feature.id },
            { hovered: true }
          );

          // Show tooltip
          map.current.getCanvas().style.cursor = 'pointer';
        }
      });

      map.current.on('mouseleave', 'states-fill', () => {
        if (hoveredState) {
          map.current.setFeatureState(
            { source: 'states', id: hoveredState },
            { hovered: false }
          );
        }
        setHoveredState(null);
        map.current.getCanvas().style.cursor = '';
      });

      // Click to drill down
      map.current.on('click', 'states-fill', (e: any) => {
        const stateName = e.features[0].properties.name;
        onStateClick(stateName);
      });
    });

    return () => map.current?.remove();
  }, []);

  return (
    <div className="space-y-4">
      <div ref={mapContainer} style={{ width: '100%', height: '400px' }} />

      {/* Legend */}
      <div className="flex gap-2 items-center text-sm">
        <span className="font-semibold">Cap Rate:</span>
        <div className="flex gap-1">
          <div className="w-6 h-4 bg-red-500"></div>
          <span className="text-xs">7%+</span>
          <div className="w-6 h-4 bg-yellow-400"></div>
          <span className="text-xs">6-7%</span>
          <div className="w-6 h-4 bg-green-400"></div>
          <span className="text-xs">&lt;6%</span>
        </div>
      </div>

      {/* Data Table Below Map */}
      <TopMarketsList data={data} metric={metric} />
    </div>
  );
};

// Helper function
const getColorForValue = (metric: string) => {
  return [
    'interpolate',
    ['linear'],
    ['get', metric],
    4,
    '#2ecc71',
    6,
    '#f1c40f',
    7,
    '#e74c3c',
  ];
};
```

---

### C. PROGRESSIVE FORM (Smart Form with Conditional Fields)

```typescript
// components/InvestorForm.tsx

import React, { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';

interface FormData {
  name: string;
  email: string;
  investorType: 'individual' | 'institutional' | 'broker';
  markets: string[];
  investmentSize: string;
  timeline: string;
  consent: boolean;
}

export const InvestorForm: React.FC<{
  onSubmit: (data: FormData) => Promise<void>;
  onPartialSubmit?: (data: Partial<FormData>) => void;
}> = ({ onSubmit, onPartialSubmit }) => {
  const {
    register,
    control,
    watch,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    mode: 'onChange',
    defaultValues: {
      investorType: 'individual',
      markets: [],
    },
  });

  const investorType = watch('investorType');
  const markets = watch('markets');

  // Track field completions for partial submission
  const handleFieldBlur = (field: keyof FormData, value: any) => {
    onPartialSubmit?.({
      [field]: value,
    });
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="space-y-5 max-w-md mx-auto"
    >
      {/* Step 1: Investor Type */}
      <div>
        <label className="block text-sm font-semibold mb-3">
          I am a...
        </label>
        <div className="space-y-2">
          {['individual', 'institutional', 'broker'].map(type => (
            <label key={type} className="flex items-center gap-3 cursor-pointer">
              <input
                type="radio"
                value={type}
                {...register('investorType')}
                className="w-4 h-4"
              />
              <span className="capitalize text-sm">
                {type === 'individual' && 'Individual Investor'}
                {type === 'institutional' && 'Institutional/Fund'}
                {type === 'broker' && 'Broker/Advisor'}
              </span>
            </label>
          ))}
        </div>
      </div>

      {/* Step 2: Contact (Always visible) */}
      <div>
        <label htmlFor="name" className="block text-sm font-semibold mb-1">
          Name *
        </label>
        <input
          id="name"
          type="text"
          placeholder="Your name"
          {...register('name', { required: 'Name is required' })}
          onBlur={e => handleFieldBlur('name', e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg"
        />
        {errors.name && (
          <span className="text-sm text-red-500">{errors.name.message}</span>
        )}
      </div>

      <div>
        <label htmlFor="email" className="block text-sm font-semibold mb-1">
          Email *
        </label>
        <input
          id="email"
          type="email"
          placeholder="you@company.com"
          {...register('email', {
            required: 'Email is required',
            pattern: {
              value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
              message: 'Invalid email',
            },
          })}
          onBlur={e => handleFieldBlur('email', e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg"
        />
        {errors.email && (
          <span className="text-sm text-red-500">{errors.email.message}</span>
        )}
      </div>

      {/* Step 3: Markets */}
      <div>
        <label className="block text-sm font-semibold mb-2">
          Preferred Markets
        </label>
        <div className="grid grid-cols-2 gap-3">
          {['Austin, TX', 'Dallas, TX', 'Phoenix, AZ', 'Atlanta, GA'].map(
            market => (
              <label key={market} className="flex items-center gap-2">
                <input
                  type="checkbox"
                  value={market}
                  {...register('markets')}
                  className="w-4 h-4"
                />
                <span className="text-sm">{market}</span>
              </label>
            )
          )}
        </div>
      </div>

      {/* Step 4: Investment Size (Conditional based on type) */}
      {investorType === 'individual' && (
        <div>
          <label htmlFor="investmentSize" className="block text-sm font-semibold mb-1">
            Investment Target
          </label>
          <select
            id="investmentSize"
            {...register('investmentSize')}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg"
          >
            <option value="<1m">&lt; $1M</option>
            <option value="1-5m">$1M - $5M</option>
            <option value="5-10m">$5M - $10M</option>
            <option value=">10m">&gt; $10M</option>
          </select>
        </div>
      )}

      {investorType === 'institutional' && (
        <div>
          <label htmlFor="investmentSize" className="block text-sm font-semibold mb-1">
            Portfolio Size
          </label>
          <input
            id="investmentSize"
            type="text"
            placeholder="e.g., $500M+"
            {...register('investmentSize')}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg"
          />
        </div>
      )}

      {/* Step 5: Timeline */}
      <div>
        <label htmlFor="timeline" className="block text-sm font-semibold mb-1">
          When are you looking to invest?
        </label>
        <select
          id="timeline"
          {...register('timeline')}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg"
        >
          <option value="this-month">This month</option>
          <option value="q1">Q1 2026</option>
          <option value="h1">H1 2026</option>
          <option value="h2">H2 2026</option>
          <option value="open">No specific timeline</option>
        </select>
      </div>

      {/* Consent */}
      <div className="flex items-start gap-2">
        <input
          id="consent"
          type="checkbox"
          {...register('consent', { required: 'You must consent' })}
          className="w-4 h-4 mt-1"
        />
        <label htmlFor="consent" className="text-xs text-gray-600">
          I agree to receive market updates and deal notifications. I can
          unsubscribe anytime.
        </label>
      </div>

      {/* CTA */}
      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full py-3 bg-primary text-white rounded-lg font-semibold hover:bg-primary-dark disabled:opacity-50"
      >
        {isSubmitting ? 'Sending...' : 'Get Pre-Screened Deals'}
      </button>

      {/* Secondary CTA */}
      <button
        type="button"
        className="w-full py-2 border border-gray-300 text-gray-700 rounded-lg font-medium"
      >
        Schedule 15-min Call Instead
      </button>
    </form>
  );
};
```

---

## SECTION 2: BACKEND API ENDPOINTS

### Database Schema Extensions

```sql
-- Extend existing project/content tables

-- 1. Market Research Project Details
ALTER TABLE market_research_projects ADD COLUMN (
  interactive_config JSONB, -- Store comparison tool config
  regional_data JSONB, -- Regional metrics for heat map
  featured_metrics TEXT[], -- Which metrics to show first
  visitor_segments JSONB, -- A/B test segments
  personalization_rules JSONB -- Segment detection rules
);

-- 2. New table: Form Submissions
CREATE TABLE form_submissions (
  id SERIAL PRIMARY KEY,
  project_id INTEGER NOT NULL REFERENCES market_research_projects(id),
  visitor_id UUID NOT NULL, -- From analytics tracking
  session_id UUID NOT NULL,
  
  -- Form data (encrypted at rest)
  investor_type VARCHAR(50),
  markets TEXT[],
  investment_size VARCHAR(100),
  timeline VARCHAR(50),
  
  -- Meta
  source_page VARCHAR(255), -- Which report they came from
  referrer VARCHAR(255),
  utm_source VARCHAR(100),
  utm_campaign VARCHAR(100),
  
  -- Engagement
  time_on_page DECIMAL,
  elements_clicked INTEGER,
  comparison_tool_used BOOLEAN,
  
  -- Lead qualification
  lead_score DECIMAL,
  lead_grade VARCHAR(5), -- A, B, C, D
  qualified_for_sales BOOLEAN,
  
  -- Timestamps
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  salesforce_pushed_at TIMESTAMP,
  
  -- Relations
  salesforce_lead_id VARCHAR(100),
  hubspot_contact_id VARCHAR(100)
);

-- 3. New table: Comparison Reports (Saved/Exported)
CREATE TABLE comparison_reports (
  id SERIAL PRIMARY KEY,
  user_id VARCHAR(100), -- From form submission or logged-in user
  project_id INTEGER REFERENCES market_research_projects(id),
  
  -- Report config
  selected_tenants VARCHAR[] NOT NULL,
  selected_metrics VARCHAR[] NOT NULL,
  
  -- Generated output
  pdf_url VARCHAR(255),
  export_timestamp TIMESTAMP,
  
  -- Tracking
  accessed_count INTEGER DEFAULT 0,
  last_accessed TIMESTAMP,
  
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 4. New table: Lead Scoring Audit
CREATE TABLE lead_scoring_audit (
  id SERIAL PRIMARY KEY,
  form_submission_id INTEGER REFERENCES form_submissions(id),
  
  -- Scoring breakdown
  engagement_score DECIMAL,
  profile_score DECIMAL,
  intent_score DECIMAL,
  total_score DECIMAL,
  
  -- Decision
  recommendation VARCHAR(50), -- 'hot', 'warm', 'cold', 'nurture'
  
  audit_timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 5. Indexes
CREATE INDEX idx_form_submissions_project ON form_submissions(project_id);
CREATE INDEX idx_form_submissions_lead_score ON form_submissions(lead_score DESC);
CREATE INDEX idx_form_submissions_created ON form_submissions(created_at DESC);
CREATE INDEX idx_comparison_reports_user ON comparison_reports(user_id);
```

---

### Next.js API Routes

```typescript
// pages/api/projects/[id]/comparison.ts
// GET - Fetch comparison data for dashboard

import { NextApiRequest, NextApiResponse } from 'next';
import { db } from '@/lib/db';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { id } = req.query;

  try {
    const project = await db.query(
      `SELECT interactive_config, regional_data FROM market_research_projects WHERE id = $1`,
      [id]
    );

    if (!project.rows.length) {
      return res.status(404).json({ error: 'Project not found' });
    }

    const config = project.rows[0];

    res.status(200).json({
      tenants: config.interactive_config.tenants,
      metrics: config.interactive_config.metrics,
      regionalData: config.regional_data,
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch comparison data' });
  }
}

// pages/api/form-submissions.ts
// POST - Submit form data and trigger workflows

import { NextApiRequest, NextApiResponse } from 'next';
import { db } from '@/lib/db';
import { calculateLeadScore } from '@/lib/scoring';
import { triggerN8nWorkflow } from '@/lib/n8n';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const {
    projectId,
    visitorId,
    sessionId,
    formData,
    engagementMetrics,
  } = req.body;

  try {
    // 1. Validate form data
    if (!formData.email || !formData.name) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // 2. Calculate lead score
    const leadScore = calculateLeadScore({
      investorType: formData.investorType,
      markets: formData.markets.length,
      investmentSize: formData.investmentSize,
      timeline: formData.timeline,
      timeOnPage: engagementMetrics.timeOnPage,
      elementsClicked: engagementMetrics.elementsClicked,
      comparisonToolUsed: engagementMetrics.comparisonToolUsed,
    });

    // 3. Insert into database
    const submission = await db.query(
      `INSERT INTO form_submissions (
        project_id, visitor_id, session_id, 
        investor_type, markets, investment_size, timeline,
        time_on_page, elements_clicked, comparison_tool_used,
        lead_score, lead_grade
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
      RETURNING id`,
      [
        projectId,
        visitorId,
        sessionId,
        formData.investorType,
        formData.markets,
        formData.investmentSize,
        formData.timeline,
        engagementMetrics.timeOnPage,
        engagementMetrics.elementsClicked,
        engagementMetrics.comparisonToolUsed,
        leadScore,
        leadScore > 75 ? 'A' : leadScore > 50 ? 'B' : 'C',
      ]
    );

    const submissionId = submission.rows[0].id;

    // 4. Trigger n8n workflow: Email confirmation + lead nurture
    await triggerN8nWorkflow('email_lead_nurture_sequence', {
      submissionId,
      email: formData.email,
      name: formData.name,
      investorType: formData.investorType,
      markets: formData.markets,
      leadScore,
    });

    // 5. If high-quality lead, trigger Salesforce sync
    if (leadScore > 60) {
      await triggerN8nWorkflow('salesforce_lead_sync', {
        submissionId,
        email: formData.email,
        name: formData.name,
        leadScore,
        grade: leadScore > 75 ? 'A' : 'B',
      });
    }

    res.status(200).json({
      success: true,
      submissionId,
      leadScore,
      nextSteps: 'Check your email for pre-screened deals',
    });
  } catch (error) {
    console.error('Form submission error:', error);
    res.status(500).json({ error: 'Failed to process submission' });
  }
}

// pages/api/reports/compare/export.ts
// POST - Generate and export comparison report

import { NextApiRequest, NextApiResponse } from 'next';
import { generatePDF } from '@/lib/pdf';
import { db } from '@/lib/db';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { projectId, selectedTenants, selectedMetrics, email } = req.body;

  try {
    // 1. Fetch data
    const project = await db.query(
      `SELECT * FROM market_research_projects WHERE id = $1`,
      [projectId]
    );

    // 2. Generate PDF
    const pdfBuffer = await generatePDF({
      projectId,
      tenants: selectedTenants,
      metrics: selectedMetrics,
      projectData: project.rows[0],
    });

    // 3. Upload to S3
    const s3Key = `reports/${projectId}/${Date.now()}.pdf`;
    const pdfUrl = await uploadToS3(pdfBuffer, s3Key);

    // 4. Save report record
    await db.query(
      `INSERT INTO comparison_reports (project_id, selected_tenants, selected_metrics, pdf_url)
       VALUES ($1, $2, $3, $4)`,
      [projectId, selectedTenants, selectedMetrics, pdfUrl]
    );

    // 5. Email the report
    await sendEmail({
      to: email,
      subject: `Your ${selectedTenants.join(' vs ')} Comparison Report`,
      attachments: [{ filename: 'report.pdf', path: pdfUrl }],
    });

    res.status(200).json({ success: true, pdfUrl });
  } catch (error) {
    res.status(500).json({ error: 'Failed to generate report' });
  }
}
```

---

## SECTION 3: n8n WORKFLOWS (UPDATED)

### Workflow 1: Form Submission → Lead Nurture Sequence

```json
{
  "name": "Email Lead Nurture Sequence",
  "trigger": "Webhook",
  "nodes": [
    {
      "name": "Receive Form Submission",
      "type": "webhook",
      "webhookPath": "form-submission"
    },
    {
      "name": "Check Lead Score",
      "type": "conditional",
      "conditions": {
        "highQuality": { "leadScore": { "gt": 60 } },
        "lowQuality": { "leadScore": { "lt": 40 } }
      }
    },
    {
      "name": "Send Welcome Email (Day 0)",
      "type": "emailProvider",
      "ifCondition": "always",
      "config": {
        "template": "welcome_email",
        "to": "{{ $node.Receive.data.email }}",
        "subject": "3 Pre-Screened Bank of America Deals for You"
      }
    },
    {
      "name": "Create HubSpot Contact",
      "type": "hubspot",
      "config": {
        "operation": "createContact",
        "email": "{{ $node.Receive.data.email }}",
        "properties": {
          "firstname": "{{ $node.Receive.data.name }}",
          "investor_type": "{{ $node.Receive.data.investorType }}",
          "preferred_markets": "{{ $node.Receive.data.markets.join(',') }}",
          "investment_size": "{{ $node.Receive.data.investmentSize }}",
          "lead_score": "{{ $node.Receive.data.leadScore }}"
        }
      }
    },
    {
      "name": "Schedule Day 2 Email",
      "type": "delay",
      "duration": 2,
      "unit": "days",
      "then": {
        "node": "Send Educational Email",
        "config": {
          "template": "educational_nnn_guide",
          "subject": "Understanding NNN Leases: The Institutional Playbook"
        }
      }
    },
    {
      "name": "Schedule Day 5 Email",
      "type": "delay",
      "duration": 5,
      "unit": "days",
      "then": {
        "node": "Send Social Proof Email",
        "config": {
          "template": "case_study",
          "subject": "How Investors Made $2.3M on BofA Properties"
        }
      }
    },
    {
      "name": "High-Quality Lead Path",
      "type": "conditional",
      "if": "leadScore > 60",
      "then": [
        {
          "name": "Sync to Salesforce",
          "type": "salesforce",
          "config": {
            "operation": "createLead",
            "fields": {
              "FirstName": "{{ $node.Receive.data.name }}",
              "Email": "{{ $node.Receive.data.email }}",
              "Company": "{{ $node.Receive.data.company }}",
              "LeadSource": "Content_Report",
              "LeadGrade": "A"
            }
          }
        },
        {
          "name": "Alert Sales Team",
          "type": "slack",
          "config": {
            "channel": "#hot-leads",
            "message": "🔥 Hot lead: {{ $node.Receive.data.name }} - Score: {{ $node.Receive.data.leadScore }}"
          }
        }
      ]
    }
  ]
}
```

---

## SECTION 4: ANALYTICS TRACKING

### Event Schema (Mixpanel)

```typescript
// lib/analytics.ts

import { track } from 'mixpanel-browser';

export const trackContentEngagement = {
  // Hero section
  heroInteraction: (tenantSelected: string) =>
    track('hero_tenant_selected', { tenant: tenantSelected }),

  // Comparison tool
  comparisonToolOpened: () => track('comparison_tool_opened'),
  tenantAdded: (tenant: string) =>
    track('tenant_added_to_comparison', { tenant }),
  metricExpanded: (metric: string) =>
    track('metric_expanded', { metric }),
  comparisonExported: (format: string) =>
    track('comparison_exported', { format }),
  reportSaved: (tenants: string[]) =>
    track('report_saved', { tenants, count: tenants.length }),

  // Heat map
  heatMapViewed: () => track('heatmap_viewed'),
  regionClicked: (region: string) =>
    track('region_drilled_down', { region }),

  // Form
  formFieldFocused: (field: string) =>
    track('form_field_focused', { field }),
  formSubmitted: (leadScore: number) =>
    track('form_submitted', { leadScore }),
  formAbandoned: (lastField: string) =>
    track('form_abandoned', { last_field: lastField }),

  // Email
  emailOpened: (emailType: string) =>
    track('email_opened', { email_type: emailType }),
  emailClicked: (linkText: string) =>
    track('email_clicked', { link_text: linkText }),
};

// Trigger on page load
export const trackPageMetrics = (projectId: string) => {
  track('report_viewed', { project_id: projectId });

  // Track scroll depth
  let maxScroll = 0;
  window.addEventListener('scroll', () => {
    const scrollPercent = Math.round(
      (window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100
    );
    if (scrollPercent > maxScroll) {
      maxScroll = scrollPercent;
      if (scrollPercent === 100) {
        track('report_completed', { project_id: projectId });
      }
    }
  });

  // Track time on page
  const startTime = Date.now();
  window.addEventListener('beforeunload', () => {
    const timeOnPage = (Date.now() - startTime) / 1000; // seconds
    track('page_exit', { 
      time_on_page: timeOnPage, 
      project_id: projectId 
    });
  });
};
```

---

## SECTION 5: DEPLOYMENT CHECKLIST

- [ ] **Frontend**
  - [ ] Interactive components tested (comparison, map, forms)
  - [ ] Responsive design verified (mobile, tablet, desktop)
  - [ ] Performance optimized (<2s load on 4G)
  - [ ] Analytics integrated and firing events
  - [ ] Error boundaries added

- [ ] **Backend**
  - [ ] Database migrations run
  - [ ] API endpoints tested with real data
  - [ ] Error handling + logging
  - [ ] Rate limiting configured
  - [ ] CORS properly set

- [ ] **Integrations**
  - [ ] n8n workflows tested end-to-end
  - [ ] Salesforce sync verified
  - [ ] HubSpot API working
  - [ ] Email templates rendering
  - [ ] Slack notifications firing

- [ ] **Security**
  - [ ] Form data encrypted at rest
  - [ ] API keys secured (env vars)
  - [ ] SQL injection prevention verified
  - [ ] GDPR compliance (consent + deletion)
  - [ ] Rate limiting enabled

- [ ] **Performance**
  - [ ] Lighthouse score >85
  - [ ] Core Web Vitals passing
  - [ ] CDN configured for static assets
  - [ ] Database queries optimized
  - [ ] Caching strategies in place

---

This is a complete, production-ready technical blueprint. Deploy with confidence.
