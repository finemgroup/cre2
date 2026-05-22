-- CONTRACT ONLY
-- NOT APPLIED
-- NO DATABASE CONNECTION
-- DO NOT RUN IN PRODUCTION
-- Sophex schema foundation contract draft, 2026-05-22.
-- This is not a migration and has not been executed.
-- No triggers, stored functions, RLS policies, seeds, backfills, queues, workers, or runtime clients are authorized here.

-- Core account and organization scope.
CREATE TABLE IF NOT EXISTS sophex_organizations_contract (
  id uuid PRIMARY KEY,
  name text NOT NULL,
  organization_kind text NOT NULL,
  public_private_posture text NOT NULL,
  review_status text NOT NULL,
  operational_action_receipt_ref text,
  idempotency_key text,
  correlation_id text,
  created_at timestamptz NOT NULL,
  updated_at timestamptz NOT NULL
);

CREATE TABLE IF NOT EXISTS sophex_users_contract (
  id uuid PRIMARY KEY,
  organization_id uuid,
  actor_kind text NOT NULL,
  display_name text,
  role_posture text NOT NULL,
  review_status text NOT NULL,
  operational_action_receipt_ref text,
  idempotency_key text,
  correlation_id text,
  created_at timestamptz NOT NULL,
  updated_at timestamptz NOT NULL
);

-- Public-safe property baseline separate from private observations.
CREATE TABLE IF NOT EXISTS sophex_properties_public_baseline_contract (
  id uuid PRIMARY KEY,
  normalized_address text NOT NULL,
  city text,
  state text,
  postal_code text,
  property_type text,
  public_source_ref text,
  source_use_policy text NOT NULL,
  confidence_score numeric,
  freshness_status text,
  review_status text NOT NULL,
  promotion_status text NOT NULL,
  revoked_at timestamptz,
  superseded_by_ref text,
  created_at timestamptz NOT NULL,
  updated_at timestamptz NOT NULL
);

-- Documents are evidence, not automatic truth.
CREATE TABLE IF NOT EXISTS sophex_document_evidence_contract (
  id uuid PRIMARY KEY,
  organization_id uuid,
  uploader_actor_id uuid,
  source_family text NOT NULL,
  source_ref text NOT NULL,
  source_hash text,
  payload_digest text,
  visibility_posture text NOT NULL,
  source_use_policy text NOT NULL,
  review_status text NOT NULL,
  promotion_status text NOT NULL,
  confidence_score numeric,
  freshness_status text,
  operational_action_receipt_ref text,
  idempotency_key text,
  correlation_id text,
  revoked_at timestamptz,
  superseded_by_ref text,
  created_at timestamptz NOT NULL,
  updated_at timestamptz NOT NULL
);

-- Raw sourced facts from public records, documents, users, agents, or analysts.
CREATE TABLE IF NOT EXISTS sophex_source_observations_contract (
  id uuid PRIMARY KEY,
  document_evidence_id uuid,
  organization_id uuid,
  actor_id uuid,
  source_kind text NOT NULL,
  observed_entity_hint text,
  observed_field text NOT NULL,
  raw_value text NOT NULL,
  typed_text_value text,
  typed_numeric_value numeric,
  typed_date_value timestamptz,
  typed_boolean_value boolean,
  visibility_posture text NOT NULL,
  source_use_policy text NOT NULL,
  review_status text NOT NULL,
  promotion_status text NOT NULL,
  confidence_score numeric,
  freshness_status text,
  operational_action_receipt_ref text,
  idempotency_key text,
  correlation_id text,
  revoked_at timestamptz,
  superseded_by_ref text,
  created_at timestamptz NOT NULL,
  updated_at timestamptz NOT NULL
);

-- Field-level candidate values derived from observations.
CREATE TABLE IF NOT EXISTS sophex_field_observations_contract (
  id uuid PRIMARY KEY,
  source_observation_id uuid NOT NULL,
  property_baseline_id uuid,
  organization_id uuid,
  field_name text NOT NULL,
  value_text text,
  value_numeric numeric,
  value_date timestamptz,
  value_boolean boolean,
  visibility_posture text NOT NULL,
  source_use_policy text NOT NULL,
  review_status text NOT NULL,
  promotion_status text NOT NULL,
  confidence_score numeric,
  freshness_status text,
  operational_action_receipt_ref text,
  idempotency_key text,
  correlation_id text,
  revoked_at timestamptz,
  superseded_by_ref text,
  created_at timestamptz NOT NULL,
  updated_at timestamptz NOT NULL
);

-- Query-level access policy. Not UI-only permission.
CREATE TABLE IF NOT EXISTS sophex_observation_visibility_policies_contract (
  id uuid PRIMARY KEY,
  field_observation_id uuid NOT NULL,
  organization_id uuid,
  actor_id uuid,
  visibility_posture text NOT NULL,
  publication_state text NOT NULL,
  can_read boolean NOT NULL,
  can_export boolean NOT NULL,
  can_revoke boolean NOT NULL,
  source_use_policy text NOT NULL,
  review_status text NOT NULL,
  operational_action_receipt_ref text,
  idempotency_key text,
  correlation_id text,
  created_at timestamptz NOT NULL,
  updated_at timestamptz NOT NULL
);

-- Evidence-backed comp ecosystem records, not one giant canonical table.
CREATE TABLE IF NOT EXISTS sophex_comp_candidates_contract (
  id uuid PRIMARY KEY,
  organization_id uuid,
  document_evidence_id uuid,
  source_observation_id uuid,
  property_baseline_id uuid,
  candidate_kind text NOT NULL,
  record_subtype text NOT NULL,
  address_hint text,
  sale_price numeric,
  asking_price numeric,
  cap_rate_stated numeric,
  noi_stated numeric,
  price_per_sqft numeric,
  closing_date timestamptz,
  data_completeness_score numeric,
  visibility_posture text NOT NULL,
  source_use_policy text NOT NULL,
  review_status text NOT NULL,
  promotion_status text NOT NULL,
  confidence_score numeric,
  freshness_status text,
  ghost_posture text,
  operational_action_receipt_ref text,
  idempotency_key text,
  correlation_id text,
  revoked_at timestamptz,
  superseded_by_ref text,
  created_at timestamptz NOT NULL,
  updated_at timestamptz NOT NULL
);

CREATE TABLE IF NOT EXISTS sophex_deal_ecosystem_records_contract (
  id uuid PRIMARY KEY,
  organization_id uuid,
  primary_comp_candidate_id uuid,
  deal_record_kind text NOT NULL,
  subtype_posture text NOT NULL,
  visibility_posture text NOT NULL,
  source_use_policy text NOT NULL,
  review_status text NOT NULL,
  promotion_status text NOT NULL,
  confidence_score numeric,
  data_completeness_score numeric,
  ghost_posture text,
  operational_action_receipt_ref text,
  idempotency_key text,
  correlation_id text,
  revoked_at timestamptz,
  superseded_by_ref text,
  created_at timestamptz NOT NULL,
  updated_at timestamptz NOT NULL
);

-- Lease economics are first-class records.
CREATE TABLE IF NOT EXISTS sophex_tenants_contract (
  id uuid PRIMARY KEY,
  organization_id uuid,
  document_evidence_id uuid,
  source_observation_id uuid,
  tenant_name text,
  brand_parent_company text,
  occupancy_status text,
  visibility_posture text NOT NULL,
  source_use_policy text NOT NULL,
  review_status text NOT NULL,
  promotion_status text NOT NULL,
  confidence_score numeric,
  ghost_posture text,
  operational_action_receipt_ref text,
  idempotency_key text,
  correlation_id text,
  revoked_at timestamptz,
  superseded_by_ref text,
  created_at timestamptz NOT NULL,
  updated_at timestamptz NOT NULL
);

CREATE TABLE IF NOT EXISTS sophex_leases_contract (
  id uuid PRIMARY KEY,
  organization_id uuid,
  document_evidence_id uuid,
  tenant_id uuid,
  lease_kind text NOT NULL,
  lease_start_date timestamptz,
  lease_expiration_date timestamptz,
  space_sqft numeric,
  base_rent_psf numeric,
  base_rent_annual numeric,
  renewal_options_summary text,
  visibility_posture text NOT NULL,
  source_use_policy text NOT NULL,
  review_status text NOT NULL,
  promotion_status text NOT NULL,
  confidence_score numeric,
  ghost_posture text,
  operational_action_receipt_ref text,
  idempotency_key text,
  correlation_id text,
  revoked_at timestamptz,
  superseded_by_ref text,
  created_at timestamptz NOT NULL,
  updated_at timestamptz NOT NULL
);

CREATE TABLE IF NOT EXISTS sophex_rent_schedules_contract (
  id uuid PRIMARY KEY,
  organization_id uuid,
  document_evidence_id uuid,
  lease_id uuid NOT NULL,
  effective_date timestamptz,
  expiration_date timestamptz,
  rent_psf numeric,
  annual_rent numeric,
  escalation_kind text,
  escalation_value numeric,
  is_current_period boolean,
  visibility_posture text NOT NULL,
  source_use_policy text NOT NULL,
  review_status text NOT NULL,
  promotion_status text NOT NULL,
  confidence_score numeric,
  operational_action_receipt_ref text,
  idempotency_key text,
  correlation_id text,
  revoked_at timestamptz,
  superseded_by_ref text,
  created_at timestamptz NOT NULL,
  updated_at timestamptz NOT NULL
);

-- Derived read model. Lease and rent schedule facts feed this later.
CREATE TABLE IF NOT EXISTS sophex_investment_details_projection_contract (
  id uuid PRIMARY KEY,
  organization_id uuid,
  deal_ecosystem_record_id uuid,
  valuation_date timestamptz NOT NULL,
  noi_calculated numeric,
  noi_includes_ghost_tenants boolean,
  walt_calculated numeric,
  occupancy_rate numeric,
  blended_cap_rate numeric,
  projection_confidence_score numeric,
  freshness_status text,
  review_status text NOT NULL,
  promotion_status text NOT NULL,
  source_use_policy text NOT NULL,
  operational_action_receipt_ref text,
  idempotency_key text,
  correlation_id text,
  revoked_at timestamptz,
  superseded_by_ref text,
  created_at timestamptz NOT NULL,
  updated_at timestamptz NOT NULL
);

-- Named edge examples. Universal entity_edges needs later governance before activation.
CREATE TABLE IF NOT EXISTS sophex_deal_property_edges_contract (
  id uuid PRIMARY KEY,
  deal_ecosystem_record_id uuid NOT NULL,
  property_baseline_id uuid NOT NULL,
  relationship_kind text NOT NULL,
  document_evidence_id uuid,
  source_observation_id uuid,
  confidence_score numeric,
  review_status text NOT NULL,
  operational_action_receipt_ref text,
  idempotency_key text,
  correlation_id text,
  created_at timestamptz NOT NULL,
  updated_at timestamptz NOT NULL
);

CREATE TABLE IF NOT EXISTS sophex_deal_lease_edges_contract (
  id uuid PRIMARY KEY,
  deal_ecosystem_record_id uuid NOT NULL,
  lease_id uuid NOT NULL,
  relationship_kind text NOT NULL,
  document_evidence_id uuid,
  source_observation_id uuid,
  confidence_score numeric,
  review_status text NOT NULL,
  operational_action_receipt_ref text,
  idempotency_key text,
  correlation_id text,
  created_at timestamptz NOT NULL,
  updated_at timestamptz NOT NULL
);

CREATE TABLE IF NOT EXISTS sophex_tenant_lease_edges_contract (
  id uuid PRIMARY KEY,
  tenant_id uuid NOT NULL,
  lease_id uuid NOT NULL,
  relationship_kind text NOT NULL,
  document_evidence_id uuid,
  source_observation_id uuid,
  confidence_score numeric,
  review_status text NOT NULL,
  operational_action_receipt_ref text,
  idempotency_key text,
  correlation_id text,
  created_at timestamptz NOT NULL,
  updated_at timestamptz NOT NULL
);

-- Future report artifact family.
CREATE TABLE IF NOT EXISTS sophex_report_artifacts_contract (
  id uuid PRIMARY KEY,
  organization_id uuid,
  actor_id uuid,
  report_kind text NOT NULL,
  subject_property_ref text,
  comp_candidate_ref text,
  deal_ecosystem_record_id uuid,
  evidence_manifest_ref text,
  warnings_ref text,
  review_required boolean NOT NULL,
  review_status text NOT NULL,
  export_policy text NOT NULL,
  source_use_policy text NOT NULL,
  visibility_posture text NOT NULL,
  confidence_score numeric,
  operational_action_receipt_ref text,
  idempotency_key text,
  correlation_id text,
  revoked_at timestamptz,
  superseded_by_ref text,
  created_at timestamptz NOT NULL,
  updated_at timestamptz NOT NULL
);

-- Future only: pgvector indexes, RLS policies, generated columns, calculation workers, and graph exports are intentionally absent.
