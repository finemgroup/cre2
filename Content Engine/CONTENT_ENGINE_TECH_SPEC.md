# 🛠️ TECHNICAL SPECIFICATION: AI-DRIVEN MARKET RESEARCH CONTENT ENGINE

**Date**: January 14, 2026  
**Architecture Version**: 1.0  
**Integration**: Map-Based Workflow (Next.js/TypeScript/PostgreSQL/n8n)

---

## SYSTEM OVERVIEW

```
┌─────────────────────────────────────────────────────────────────┐
│                    CONTENT RESEARCH ENGINE                      │
├─────────────────────────────────────────────────────────────────┤
│  INPUT                                                           │
│  ├─ Tenant name (e.g., "Chick-fil-A", "Bank of America")       │
│  ├─ Publication date target                                     │
│  └─ Data sources (public APIs, proprietary DB, web research)   │
│                                                                  │
│  PROCESSING                                                      │
│  ├─ AI Research Agent (n8n + Claude)                            │
│  ├─ Content Generation (Claude 3.5 Sonnet)                      │
│  ├─ SEO Optimization Engine                                     │
│  ├─ Plagiarism/quality checks                                   │
│  └─ Human review workflow                                        │
│                                                                  │
│  OUTPUT                                                          │
│  ├─ Blog post (WordPress/Headless CMS)                          │
│  ├─ PDF report (downloadable)                                   │
│  ├─ Email sequences (auto-nurture)                              │
│  ├─ Social variations (LinkedIn, Twitter)                       │
│  └─ Syndication versions (Medium, etc.)                         │
│                                                                  │
│  DISTRIBUTION                                                    │
│  ├─ finegroup.com/blog (primary)                                │
│  ├─ Medium.com syndication                                      │
│  ├─ LinkedIn newsletter                                         │
│  ├─ Email list                                                  │
│  └─ Industry publications                                        │
│                                                                  │
│  LEAD CAPTURE & NURTURE                                          │
│  ├─ Embedded forms (mid-article, bottom, exit-intent)          │
│  ├─ Email sequences (auto-triggered)                            │
│  ├─ Lead scoring (AI-driven)                                    │
│  └─ CRM integration (Salesforce sync)                           │
└─────────────────────────────────────────────────────────────────┘
```

---

## PART 1: CORE ARCHITECTURE (DATABASE SCHEMA)

### 1.1 New Tables (PostgreSQL)

```sql
-- Research Project / Tenant
CREATE TABLE market_research_projects (
  id SERIAL PRIMARY KEY,
  tenant_id UUID,                    -- Link to existing Tenant
  tenant_name VARCHAR(255),          -- "Chick-fil-A", "Bank of America"
  
  -- Metadata
  status ENUM('planned', 'researching', 'drafting', 'review', 'published', 'archived'),
  priority INT,                      -- 1-10 (1 = highest)
  
  -- Content basics
  title VARCHAR(500),                -- "Chick-fil-A NNN Lease Trends 2026"
  slug VARCHAR(500) UNIQUE,          -- "chick-fil-a-nnn-trends-2026"
  description TEXT,                  -- Meta description for SEO
  
  -- Targeting
  primary_keyword VARCHAR(200),      -- "chick-fil-a nnn lease"
  target_keywords TEXT[],            -- Array of 50+ related keywords
  target_audience VARCHAR(100),      -- "nnn_investors", "brokers", "agents"
  
  -- Timeline
  research_start_date TIMESTAMP,
  published_date TIMESTAMP,
  update_frequency VARCHAR(50),      -- "monthly", "quarterly", "annually"
  next_refresh_date TIMESTAMP,
  
  -- Performance tracking
  organic_traffic INT DEFAULT 0,
  form_submissions INT DEFAULT 0,
  avg_ranking_position DECIMAL(3,1),
  estimated_seo_value DECIMAL(10,2), -- Estimated lead value
  
  -- Ownership
  created_by UUID,
  assigned_to UUID,
  created_at TIMESTAMP DEFAULT now(),
  updated_at TIMESTAMP DEFAULT now()
);

-- Research Data / Sources
CREATE TABLE market_research_sources (
  id SERIAL PRIMARY KEY,
  project_id INT REFERENCES market_research_projects(id),
  
  -- Source metadata
  source_name VARCHAR(255),          -- "CoStar", "SEC Filings", "Google Trends"
  source_type ENUM('api', 'web_scrape', 'database', 'proprietary', 'manual'),
  source_url VARCHAR(500),           -- URL if applicable
  
  -- Data collected
  data_collected JSONB,              -- Flexible JSON for varied data types
  extracted_at TIMESTAMP,
  data_freshness ENUM('real_time', 'hourly', 'daily', 'weekly', 'monthly'),
  
  -- Trust score
  citation_required BOOLEAN,
  credibility_score INT,             -- 1-100
  
  -- AI processing
  ai_extraction_notes TEXT,          -- What Claude extracted from this source
  created_at TIMESTAMP DEFAULT now()
);

-- Content Generation History
CREATE TABLE content_versions (
  id SERIAL PRIMARY KEY,
  project_id INT REFERENCES market_research_projects(id),
  version_number INT,                -- 1, 2, 3... (tracking iterations)
  
  -- Content
  title VARCHAR(500),
  content_markdown TEXT,             -- Full report in Markdown
  content_html TEXT,                 -- Rendered HTML
  
  -- Metadata
  word_count INT,
  readability_score INT,             -- Flesch-Kincaid grade level
  
  -- SEO metrics
  target_keyword VARCHAR(200),
  keyword_density DECIMAL(3,1),      -- % of content
  meta_tags JSONB,                   -- {title, description, keywords}
  internal_links INT,
  external_links INT,
  schema_markup JSONB,               -- JSON-LD structured data
  
  -- Generation process
  generation_method VARCHAR(50),     -- "ai_draft", "human_edited", "ai_regenerated"
  generated_by VARCHAR(50),          -- "claude-3.5", "human", "combined"
  human_review_notes TEXT,
  approved BOOLEAN,
  approved_by UUID,
  approved_at TIMESTAMP,
  
  created_at TIMESTAMP DEFAULT now()
);

-- Publishing Destinations
CREATE TABLE content_syndication (
  id SERIAL PRIMARY KEY,
  content_version_id INT REFERENCES content_versions(id),
  
  -- Where published
  channel VARCHAR(100),              -- "blog", "medium", "linkedin", "email", "naiop"
  channel_url VARCHAR(500),          -- Published URL
  
  -- Performance
  impressions INT DEFAULT 0,
  clicks INT DEFAULT 0,
  ctr DECIMAL(5,2),
  form_submissions INT DEFAULT 0,
  last_synced TIMESTAMP,
  
  published_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT now()
);

-- Lead Captures (from content)
CREATE TABLE content_lead_captures (
  id SERIAL PRIMARY KEY,
  project_id INT REFERENCES market_research_projects(id),
  content_version_id INT REFERENCES content_versions(id),
  
  -- Lead info
  lead_id UUID,                      -- Link to existing Lead/Contact
  email VARCHAR(255),
  name VARCHAR(255),
  phone VARCHAR(20),
  company VARCHAR(255),
  
  -- Context
  capture_source VARCHAR(100),       -- "mid_article_cta", "bottom_cta", "gated_pdf", "exit_intent"
  capture_timestamp TIMESTAMP,
  referral_source VARCHAR(100),      -- "organic", "linkedin", "email", "syndication"
  
  -- Lead scoring
  lead_score INT DEFAULT 0,
  segment VARCHAR(100),              -- "high_net_worth", "institutional", "small_investor"
  
  -- Nurture
  email_sequence_triggered VARCHAR(100), -- "welcome_sequence_chick_fil_a"
  email_sequence_step INT DEFAULT 0,
  engagement_score INT DEFAULT 0,    -- Emails opened, links clicked, etc.
  
  -- CRM sync
  salesforce_contact_id VARCHAR(255),
  synced_to_sf BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT now()
);

-- SEO Performance Tracking
CREATE TABLE seo_analytics (
  id SERIAL PRIMARY KEY,
  project_id INT REFERENCES market_research_projects(id),
  date DATE,
  
  -- Traffic
  organic_impressions INT,
  organic_clicks INT,
  avg_position DECIMAL(3,1),         -- Average rank position
  
  -- Engagement
  page_views INT,
  sessions INT,
  bounce_rate DECIMAL(5,2),
  avg_time_on_page INT,
  
  -- Conversions
  form_submissions INT,
  form_completion_rate DECIMAL(5,2),
  
  -- Keywords
  top_keywords JSON,                 -- {keyword, position, impressions, clicks}
  
  created_at TIMESTAMP DEFAULT now()
);

-- AI Agent Execution Log (for debugging)
CREATE TABLE ai_agent_execution_log (
  id SERIAL PRIMARY KEY,
  project_id INT REFERENCES market_research_projects(id),
  
  -- Execution details
  agent_name VARCHAR(100),           -- "research_agent", "content_gen_agent"
  execution_status ENUM('pending', 'running', 'success', 'failed'),
  execution_start TIMESTAMP,
  execution_end TIMESTAMP,
  
  -- Inputs / Outputs
  input_data JSONB,
  output_data JSONB,
  error_message TEXT,
  
  -- Performance
  duration_seconds INT,
  tokens_used INT,
  cost DECIMAL(10,4),
  
  created_at TIMESTAMP DEFAULT now()
);
```

---

## PART 2: N8N WORKFLOW ARCHITECTURE

### 2.1 Workflow 1: AI Research Agent

**Trigger**: Webhook or manual trigger (new project created)  
**Frequency**: Weekly or on-demand per project

```
Start
  ├─ Input: project_id (e.g., "Chick-fil-A Q1 2026")
  ├─ Load project config + data sources
  │
  ├─ [AI Agent] Research data collection
  │  ├─ CoStar API: Fetch latest lease comps (cap rates, terms)
  │  ├─ SEC Edgar: Scrape company filings (expansion plans, store count)
  │  ├─ Google Trends: Fetch search volume trends (interest over time)
  │  ├─ Exa AI: Web research (news, industry reports, blog posts)
  │  ├─ Custom DB: Pull your proprietary transaction data
  │  └─ Compile into research_brief.json
  │
  ├─ Data enrichment (n8n nodes)
  │  ├─ Deduplicate statistics
  │  ├─ Cross-reference sources (flag if contradictory)
  │  ├─ Add citations (URL + publication date for each stat)
  │  └─ Sort by importance/recency
  │
  ├─ Store in market_research_sources table
  │  └─ Save research_brief as JSONB
  │
  ├─ Trigger Content Generation workflow
  │  └─ Pass project_id + research_brief
  │
  ├─ Log execution (ai_agent_execution_log table)
  │  ├─ Duration, tokens used, cost
  │  └─ Success/failure + error message
  │
  └─ Webhook: Notify team (Slack: "Research complete for [Tenant]")
```

**Execution**: 15-30 minutes per project

**Cost**: ~$0.50-1.00 per execution (API calls + Claude)

---

### 2.2 Workflow 2: Content Generation & Optimization

**Trigger**: Completion of Research Agent OR manual trigger  
**Frequency**: As needed (weekly or on-demand)

```
Start
  ├─ Input: project_id + research_brief.json
  │
  ├─ [STEP 1] Keyword Research & Intent Analysis
  │  ├─ Claude: Analyze primary keyword "chick-fil-a nnn lease"
  │  ├─ SimilarWeb / Google Keyword Planner API:
  │  │  ├─ Search volume: ~2,400/month
  │  │  ├─ Difficulty: Medium
  │  │  ├─ Competition: High (BofA, Equity CRE rank top 3)
  │  │  └─ Related keywords (50+ variations)
  │  ├─ Google Search Console: Fetch your current rankings for similar keywords
  │  ├─ Compile keyword strategy: primary, secondary, long-tail targets
  │  └─ Store in project.target_keywords[] array
  │
  ├─ [STEP 2] Content Generation (Claude 3.5 Sonnet)
  │  │
  │  ├─ System Prompt:
  │  │  """
  │  │  You are an expert commercial real estate market analyst.
  │  │  Write a comprehensive, data-driven market report for real estate investors.
  │  │  
  │  │  REQUIREMENTS:
  │  │  - 3,500-5,000 words
  │  │  - Include: Overview, Financial Metrics, Tenant Health, Regional Insights, Investment Thesis
  │  │  - Every statistic must have a citation (inline: [source: CoStar, 2026])
  │  │  - Answer investor questions (Is this a good investment? What's the risk?)
  │  │  - Use professional tone + accessible language (Flesch-Kincaid Grade 8-10)
  │  │  - Include multiple viewpoints (bull + bear case)
  │  │  - Target keyword (\"chick-fil-a nnn lease\"): use 2-3% density, naturally
  │  │  - Sections: use H2/H3 hierarchy for SEO
  │  │  - Include FAQ section (4-5 common investor questions)
  │  │  - Include CTA at end: sign up, explore opportunities, webinar
  │  │  - Format: Markdown with citations
  │  │  \"\"\"\n
  │  │
  │  ├─ User Prompt:
  │  │  """
  │  │  Write a market report for [Tenant Name] using this research data:
  │  │  \n
  │  │  {research_brief.json}
  │  │  \n
  │  │  Target keyword: {primary_keyword}
  │  │  Related keywords: {target_keywords}
  │  │  Target audience: {target_audience}
  │  │  Publication date: {pub_date}
  │  │  \"\"\"\n
  │  │
  │  └─ Output: content_draft.markdown
  │
  ├─ [STEP 3] SEO Optimization
  │  ├─ Parse markdown → Extract sections, headers, word count
  │  ├─ Analyze keyword density:
  │  │  ├─ Primary keyword: target 2-3%
  │  │  ├─ Related keywords: distributed naturally
  │  │  └─ Suggest additions if gaps found
  │  ├─ Generate SEO metadata:
  │  │  ├─ Title tag (60 char): Optimize for primary keyword
  │  │  ├─ Meta description (160 char): Include CTA, keyword
  │  │  ├─ H1 tag: Align with title tag
  │  │  └─ URL slug: /blog/[tenant]-nnn-trends-[year]
  │  ├─ Generate FAQ schema:
  │  │  ├─ Extract 4-5 questions from FAQ section
  │  │  └─ Format as JSON-LD (for Google Featured Snippets)
  │  ├─ Internal linking suggestions:
  │  │  ├─ Link to related reports (\"See also: Bank of America NNN\")
  │  │  └─ Link to your core landing pages
  │  ├─ Generate structured data (schema.markup):
  │  │  ├─ Article schema (author, publish date, word count)
  │  │  ├─ BreadcrumbList (site hierarchy)
  │  │  └─ Organization schema (your company)
  │  └─ Store metadata in content_versions table
  │
  ├─ [STEP 4] Quality Checks
  │  ├─ Readability: Flesch-Kincaid grade level (target: 8-10)
  │  ├─ Plagiarism check (Copyscape API): Ensure <5% similarity to web
  │  ├─ Citation verification: Flag any unsourced statistics
  │  ├─ Tone check: Ensure professional + accessible balance
  │  ├─ Fact-check key statistics against source data
  │  └─ Store results in content_versions table
  │
  ├─ [STEP 5] Human Review Workflow
  │  ├─ Create review task in your project management (Notion/Linear)
  │  ├─ Assign to: Product owner / editor
  │  ├─ Include: Draft content + quality check results + SEO metadata
  │  ├─ Slack notification: \"Content ready for review: [Tenant] report\"
  │  ├─ Wait for approval (synchronous - pause workflow)
  │  └─ On approval: Continue to publishing
  │
  ├─ [STEP 6] Generate Variations
  │  ├─ LinkedIn version (1,500 words, teaser format)
  │  ├─ Email subject + preview (160 char)
  │  ├─ Social media posts (Twitter/LinkedIn, 280 char each)
  │  ├─ PDF version (formatted with branding)
  │  └─ Store all variations in content_versions table
  │
  ├─ Log execution
  │  └─ Store in ai_agent_execution_log
  │
  └─ End: Trigger publishing workflow (next step)
```

**Execution**: 5-10 minutes (waiting for human review adds 4-24 hours)

**Cost**: ~$3-5 per execution (Claude tokens)

---

### 2.3 Workflow 3: Publishing & Syndication

**Trigger**: Content approved by human  
**Frequency**: On approval

```
Start
  ├─ Input: content_version_id (approved content)
  │
  ├─ [STEP 1] Publish to Primary Channel (Your Blog)
  │  ├─ WordPress API or Headless CMS (Contentful/Strapi):
  │  │  ├─ Create post with:
  │  │  │  ├─ Title, content, featured image
  │  │  │  ├─ Meta tags, slug, publish date
  │  │  │  ├─ SEO plugins: Rank Math / Yoast configuration
  │  │  │  ├─ Categories/tags: "NNN Lease", "[Tenant Name]", "Market Report"
  │  │  │  └─ Featured image: Design with Canva API (tenant logo + report title)
  │  │  └─ Set to publish immediately or schedule
  │  │
  │  ├─ Insert lead capture forms:
  │  │  ├─ Mid-article CTA (after 40% of content)
  │  │  ├─ End-of-article CTA
  │  │  ├─ Exit-intent popup (Optinmonster / Leadbox)
  │  │  └─ Gated PDF download link
  │  │
  │  ├─ Add tracking parameters to all CTAs
  │  │  └─ utm_source=blog, utm_medium=cta, utm_campaign=[tenant]
  │  │
  │  └─ Publish + update market_research_projects.published_date
  │
  ├─ [STEP 2] Syndicate to Secondary Channels
  │  │
  │  ├─ Medium.com:
  │  │  ├─ Use Medium API to publish content
  │  │  ├─ Add canonical tag: link back to your blog
  │  │  ├─ Custom URL: medium.com/@finegroup/[slug]
  │  │  └─ Submit to Medium publications (if applicable)
  │  │
  │  ├─ LinkedIn Newsletter:
  │  │  ├─ Use LinkedIn API (if available) OR manual setup (Zapier)
  │  │  ├─ 50% of report as teaser
  │  │  ├─ Link to full report on your blog
  │  │  ├─ Tag: #CommercialRealEstate #NNNLease #[Tenant]
  │  │  ├─ Add CTA: \"Full report: [link]\"
  │  │  └─ Schedule for Tuesday/Thursday 8am (high engagement time)
  │  │
  │  ├─ Email Subscribers:
  │  │  ├─ Segment list: by interest (NNN, investors, brokers, etc.)
  │  │  ├─ Send to: existing signups + past leads
  │  │  ├─ Subject: \"New Report: [Tenant] NNN Market Trends 2026\"
  │  │  ├─ Email body: summary + prominent link + CTA
  │  │  └─ Track opens, clicks, signups
  │  │
  │  ├─ Industry Publications (manual / future):
  │  │  ├─ NAIOP.org (guest article)
  │  │  ├─ Commercial Real Estate publications
  │  │  └─ Local commercial association newsletters
  │  │
  │  └─ Store syndication records in content_syndication table
  │
  ├─ [STEP 3] Set Up Tracking & Monitoring
  │  ├─ Google Search Console:
  │  │  ├─ Submit sitemap (auto-updated)
  │  │  ├─ Request indexing for new URL
  │  │  └─ Monitor impressions/clicks (daily sync to analytics table)
  │  ├─ Rank tracker (SimilarWeb API):
  │  │  ├─ Add primary keyword to tracking
  │  │  ├─ Daily rank checking (store in seo_analytics table)
  │  │  └─ Set alerts: If rank drops >5 positions, flag for review
  │  ├─ GA4 + form tracking:
  │  │  ├─ Track form submissions by source (blog, email, linkedin, etc.)
  │  │  └─ Create custom events for lead capture
  │  └─ CRM sync ready (next workflow)
  │
  ├─ [STEP 4] Create Lead Capture Form
  │  ├─ Add form embed to blog post:
  │  │  ├─ Form platform: HubSpot / Typeform / Leadpages
  │  │  ├─ Fields: Name, Email, Company, Market Interest, Investment Amount
  │  │  ├─ Progressive profiling: Ask different Q's on 2nd+ visit
  │  │  ├─ CTA text: \"Explore Opportunities\" or \"Get Market Alerts\"
  │  │  └─ Thank you page: Offer PDF download + confirm email
  │  │
  │  └─ Track submissions in content_lead_captures table
  │
  ├─ Slack notification:
  │  └─ \"Published: [Tenant] report on blog + Medium + LinkedIn + email\"
  │
  └─ End: Trigger lead nurture workflow
```

**Execution**: 10-15 minutes

**Cost**: Free (APIs are free tier or included in subscriptions)

---

### 2.4 Workflow 4: Lead Capture & Nurture Automation

**Trigger**: Form submission on blog OR content_lead_captures record created  
**Frequency**: Real-time

```
Start
  ├─ Input: New form submission (name, email, company, etc.)
  │
  ├─ [STEP 1] Validate & Deduplicate
  │  ├─ Check if email exists in Salesforce:
  │  │  ├─ If found: Is this a known lead? Update with new info
  │  │  ├─ If not found: Create new lead in Salesforce
  │  │  └─ Link to content_lead_captures record
  │  │
  │  ├─ Check for disposable email / spam:
  │  │  ├─ Use email validation API (ZeroBounce / AbstractAPI)
  │  │  └─ Flag if suspicious, store but don't nurture
  │  │
  │  └─ Store in content_lead_captures table
  │
  ├─ [STEP 2] Lead Scoring (AI-driven)
  │  ├─ Analyze form data:
  │  │  ├─ Investment amount: High ($1M+) = +20 pts, Medium (+10), Low (+5)
  │  │  ├─ Company type: Institutional = +15 pts, Fund = +10, Individual = +5
  │  │  ├─ Email domain: Corporate = +5 pts, Gmail = 0
  │  │  └─ Referral source: Organic = +10 pts, Email = +5
  │  ├─ Initial score stored in content_lead_captures.lead_score
  │  └─ Segment: \"high_net_worth\", \"institutional\", \"small_investor\"
  │
  ├─ [STEP 3] Trigger Email Nurture Sequence
  │  │
  │  ├─ Day 0: Welcome email
  │  │  ├─ Subject: \"Welcome to Finem Group – Your Market Insights\"
  │  │  ├─ Body: Thank you + brief about Finem + link to full report
  │  │  ├─ CTA: \"Read the full report\"
  │  │  └─ Wait 24 hours before next email
  │  │
  │  ├─ Day 3: Educational email (if no click yet)
  │  │  ├─ Subject: \"Why Institutional Investors Choose [Tenant] NNN\"
  │  │  ├─ Body: Case study / social proof (other successful deals)
  │  │  ├─ CTA: \"See recent deals\"
  │  │  └─ Wait 4 days
  │  │
  │  ├─ Day 7: Social proof email
  │  │  ├─ Subject: \"3 Reasons Smart Investors Prefer [Tenant] Properties\"
  │  │  ├─ Body: Testimonial + metrics (avg return, deal quality)
  │  │  ├─ CTA: \"Schedule a call\"
  │  │  └─ Wait 7 days
  │  │
  │  ├─ Day 14: Property showcase
  │  │  ├─ Subject: \"5 Available [Tenant] NNN Properties in Your Market\"
  │  │  ├─ Body: Property list (if applicable to their market interest)
  │  │  ├─ CTA: \"Request details\"
  │  │  └─ Wait 7 days
  │  │
  │  ├─ Day 21: Webinar invite
  │  │  ├─ Subject: \"Join Our Webinar: NNN Trends & Opportunities\"
  │  │  ├─ Body: Webinar details (date, time, topic)
  │  │  ├─ CTA: \"Register now\"
  │  │  └─ Conditional: Only if engagement score > 20
  │  │
  │  └─ Send emails via HubSpot / Klaviyo API
  │
  ├─ [STEP 4] Track Engagement & Update Lead Score
  │  ├─ Monitor email opens:
  │  │  ├─ Open = +2 pts
  │  │  ├─ Click = +5 pts
  │  │  ├─ Download PDF = +10 pts
  │  │  ├─ Webinar register = +20 pts
  │  │  └─ Demo request = +50 pts
  │  │
  │  ├─ Update engagement_score in content_lead_captures
  │  ├─ Recalculate lead_score = initial_score + engagement_score
  │  └─ Segment: Re-evaluate (\"hot\", \"warm\", \"cold\")
  │
  ├─ [STEP 5] CRM Sync (Salesforce)
  │  ├─ If lead_score >= 50: Sync to Salesforce
  │  │  ├─ Create Lead record:
  │  │  │  ├─ Name, email, phone, company
  │  │  │  ├─ Lead source: \"Content - [Tenant] Report\"
  │  │  │  ├─ Campaign: \"[Tenant] NNN Market Report 2026\"
  │  │  │  ├─ Rating: Based on lead_score (A/B/C/D)
  │  │  │  └─ Next Action: \"Schedule call\"
  │  │  │
  │  │  └─ Store salesforce_contact_id in content_lead_captures
  │  │
  │  └─ If lead_score < 50: Continue nurture sequence
  │
  ├─ [STEP 6] Sales Notification
  │  ├─ If lead_score >= 50:
  │  │  ├─ Slack: \"Hot lead: [Name] interested in [Tenant]\"
  │  │  ├─ Assign to AE (based on market / investment size)
  │  │  ├─ Create Salesforce task: \"Call [Name] re: [Tenant] opportunities\"
  │  │  └─ Set due date: Tomorrow
  │  │
  │  └─ If webinar register:
  │  │  └─ Add to webinar attendee list + reminder email 24h before
  │
  └─ End: Wait for follow-up actions
```

**Execution**: 2-5 seconds per form submission

**Cost**: Free (using existing email platform + Salesforce)

---

### 2.5 Workflow 5: SEO Monitoring & Optimization

**Trigger**: Daily or weekly (scheduled)  
**Frequency**: Daily at 6am EST

```
Start
  │
  ├─ [STEP 1] Fetch Rankings (Rank Tracker API)
  │  ├─ For each published project:
  │  │  ├─ Query SimilarWeb or Ahrefs API
  │  │  ├─ Track ranking position for primary + target keywords
  │  │  ├─ Store daily ranking in seo_analytics table
  │  │  └─ Calculate 30-day trending (going up, stable, down)
  │  │
  │  └─ Set alerts if:
  │  │  ├─ Rank drops >5 positions (might be de-indexed or penalized)
  │  │  ├─ Rank > 30 (effectively invisible, needs refresh)
  │  │  └─ New keyword ranking in top 10 (celebrate!)
  │
  ├─ [STEP 2] Fetch Traffic Data (GA4 API)
  │  ├─ For each published project:
  │  │  ├─ Sessions, pageviews, bounce rate, avg time on page
  │  │  ├─ Store in seo_analytics table (daily)
  │  │  └─ Calculate conversion funnel:
  │  │  │  ├─ Pageviews → Form impressions
  │  │  │  ├─ Form impressions → Form submissions
  │  │  │  ├─ Form submission rate (%)
  │  │  │  └─ Track by source (organic, email, linkedin, etc.)
  │
  ├─ [STEP 3] Analyze Performance & Generate Recommendations
  │  │
  │  ├─ AI Analysis (Claude):
  │  │  ├─ Input: 30 days of seo_analytics + ranking data
  │  │  ├─ Analyze patterns:
  │  │  │  ├─ \"Traffic dropped 20% last week. Rank fell from 3 → 5. Competitor published fresher data.\"
  │  │  │  ├─ \"Form submission rate is 1.5%, below industry avg (3.2%). Form has 6 required fields.\"
  │  │  │  ├─ \"Long-tail keyword '[tenant] cap rates [city]' ranking #18. Optimize for this.\"
  │  │  │  └─ \"Email open rate 28%, but 0 link clicks. Email subject line needs work.\"
  │  │  │
  │  │  ├─ Recommend actions:
  │  │  │  ├─ Priority 1: Update report with Q1 2026 data (top 3 findings + new stats)
  │  │  │  ├─ Priority 2: Reduce form to 3 required fields (reduce drop-off)
  │  │  │  ├─ Priority 3: Rewrite FAQ section for long-tail keyword
  │  │  │  └─ Priority 4: A/B test email subject line (\"Insights\" vs \"Trends\")
  │  │  │
  │  │  └─ Output: Optimization report (stored in ai_agent_execution_log)
  │  │
  │  └─ Create task in project management:
  │     └─ \"Optimize [Tenant] report: Update data + forms + emails\"
  │
  ├─ [STEP 4] Check Data Freshness
  │  ├─ For each published project:
  │  │  ├─ If data > 90 days old:
  │  │  │  ├─ Flag for refresh: \"Data is stale, update needed\"
  │  │  │  ├─ Create calendar event: \"Refresh [Tenant] report\"
  │  │  │  └─ Trigger research workflow (Workflow 1)
  │  │  │
  │  │  ├─ If data 30-90 days old:
  │  │  │  └─ Minor update recommended (new news, recent deals)
  │  │  │
  │  │  └─ If data < 30 days old:
  │  │     └─ Check again next week
  │
  ├─ [STEP 5] Generate Monthly Dashboard
  │  ├─ Each project:
  │  │  ├─ Organic traffic (trending)
  │  │  ├─ Rank position (trending)
  │  │  ├─ Form submissions (trending)
  │  │  ├─ Email engagement rate
  │  │  ├─ Lead score distribution
  │  │  └─ Estimated lead value (lead_score * avg_deal_size)
  │  │
  │  ├─ Overall metrics:
  │  │  ├─ Total organic traffic (all projects)
  │  │  ├─ Total form submissions
  │  │  ├─ Total leads > score 50
  │  │  ├─ Cost per lead (content creation / leads)
  │  │  └─ Estimated pipeline value (leads * avg_deal_value)
  │  │
  │  └─ Slack/Email: Post dashboard to team
  │
  └─ End: Schedule next run (tomorrow at 6am)
```

**Execution**: 5-10 minutes per run

**Cost**: ~$1-2 per run (Rank tracker API calls)

---

## PART 3: FRONTEND COMPONENTS (Next.js/React)

### 3.1 Admin Dashboard (Content Management)

**URL**: `/admin/content-engine`

```typescript
// Key pages:

1. PROJECT OVERVIEW
   ├─ Table of all projects (tenant, status, traffic, forms, score)
   ├─ Filter by: status, priority, date
   ├─ Actions: Create new, edit, view analytics, refresh data
   └─ Quick stats: Total traffic, total leads, avg ranking

2. PROJECT DETAIL
   ├─ Project header (tenant name, primary keyword, target audience)
   ├─ Status pipeline (planned → researching → drafting → review → published)
   ├─ Timeline (research start, publish date, next refresh)
   │
   ├─ Research tab
   │  ├─ Data sources (linked, data collected, freshness)
   │  ├─ Manual data entry (add your proprietary data)
   │  └─ "Refresh Research" button (trigger Workflow 1)
   │
   ├─ Content tab
   │  ├─ Content versions (v1, v2, v3... with timestamps)
   │  ├─ SEO metadata (title, meta desc, keywords, schema)
   │  ├─ Preview (HTML rendering)
   │  ├─ "Generate Content" button (trigger Workflow 2)
   │  └─ Edit metadata / approve content
   │
   ├─ Publishing tab
   │  ├─ Primary channel (blog): Published status + URL
   │  ├─ Secondary channels (Medium, LinkedIn, Email): Status + URLs
   │  ├─ "Publish" button (trigger Workflow 3)
   │  └─ Publication history + edits
   │
   ├─ Analytics tab
   │  ├─ Traffic chart (last 30 days, by source: organic, email, linkedin, etc.)
   │  ├─ Ranking position (trending)
   │  ├─ Form submissions (by CTA type: mid-article, bottom, exit-intent)
   │  ├─ Lead capture funnel (impressions → clicks → form fills → submit)
   │  ├─ Email engagement (opens, clicks, unsubscribes)
   │  └─ Export analytics (CSV / PDF)
   │
   └─ AI Recommendations tab
      ├─ Display optimization suggestions
      ├─ Priority ranking (quick wins first)
      ├─ Estimated impact (traffic increase, conversion lift)
      └─ "Apply Recommendation" button (queue task)

3. LEAD CAPTURE DASHBOARD
   ├─ Table of all leads (name, email, source, score, status)
   ├─ Filter: by project, by score, by engagement level
   ├─ Actions: View lead details, send to Salesforce, email, score
   │
   ├─ Lead detail modal:
   │  ├─ Contact info
   │  ├─ Lead source (which blog/email/form)
   │  ├─ Lead score breakdown (form data + engagement score)
   │  ├─ Email history (opened, clicked, bounced)
   │  ├─ Email sequence progress
   │  └─ Link to Salesforce lead record
   │
   └─ Bulk actions: Mark as qualified, export to CSV, send bulk email

4. SYNDICATION MANAGER
   ├─ Configure channels:
   │  ├─ Blog (WordPress, Contentful, etc.)
   │  ├─ Medium (API token)
   │  ├─ LinkedIn (auth)
   │  ├─ Email service (HubSpot, Klaviyo, Mailchimp)
   │  └─ Manual channels (NAIOP, publications)
   │
   ├─ Publishing calendar
   │  ├─ Schedule content across channels
   │  ├─ Set publish dates + times (e.g., LinkedIn Tue 8am)
   │  └─ Monitor publication status
   │
   └─ Performance by channel
      ├─ Impressions, clicks, leads per channel
      └─ ROI per channel (leads / effort)
```

---

### 3.2 Public-Facing Components

#### A. Blog Post Template

```typescript
// finegroup.com/blog/[slug]

<BlogPost>
  <Header>
    <Title>{project.title}</Title>
    <Meta>Published: {date} | Updated: {updated_date} | Read time: {est_time}</Meta>
    <FeaturedImage src={project.featured_image} />
  </Header>
  
  <Breadcrumb path={["Blog", project.category, project.title]} />
  
  <TOC // Table of contents (auto-generated from H2/H3)
    headings={content.headings}
    sticky={true}
  />
  
  <Content>
    {/* Render markdown as HTML */}
    {content.html}
    
    {/* Mid-article CTA (after 40% of content) */}
    <CTA 
      position="mid"
      text="Get pre-screened opportunities"
      form={<LeadCaptureForm project={project} source="mid_article" />}
    />
  </Content>
  
  <BottomCTA>
    <LeadCaptureForm project={project} source="bottom_article" />
  </BottomCTA>
  
  <SocialShare />
  
  <RelatedPosts>
    {/* Auto-suggest related projects */}
    {relatedProjects.slice(0, 3).map(p => (
      <PostCard key={p.id} {...p} />
    ))}
  </RelatedPosts>
  
  <FAQ 
    items={project.faq}
    schema={project.schema_markup}
  />
  
  <AuthorBio author={project.created_by} />
  
  <Comments enabled={true} />
</BlogPost>
```

---

#### B. Lead Capture Form Component

```typescript
// Reusable form component

<LeadCaptureForm 
  project={project}
  source={source} // "mid_article", "bottom", "exit_intent", "gated_pdf"
  fields={["name", "email", "company", "market"]} // Configurable
  onSubmit={async (data) => {
    // 1. Validate
    // 2. Create record in content_lead_captures
    // 3. Trigger nurture workflow
    // 4. Show thank you + PDF download link
    // 5. Track analytics (form_submissions +1)
  }}
  progressiveProfile={true} // Different questions on 2nd+ visit
/>
```

---

#### C. Gated PDF Download

```typescript
// Modal appears on CTA click
// Only after email is provided

<GatedPDFModal>
  <Content>
    <p>Download the full report + detailed analysis (PDF)</p>
    <LeadCaptureForm 
      fields={["name", "email"]}
      onSubmit={async (data) => {
        // 1. Create lead capture record
        // 2. Generate PDF on-the-fly (if needed)
        // 3. Email PDF link to user
        // 4. Redirect to thank-you page
        // 5. Start nurture sequence
      }}
    />
  </Content>
</GatedPDFModal>
```

---

## PART 4: DATABASE INDEXES & PERFORMANCE

```sql
-- Critical indexes for fast queries

CREATE INDEX idx_market_research_projects_status 
  ON market_research_projects(status);

CREATE INDEX idx_market_research_projects_published_date 
  ON market_research_projects(published_date DESC);

CREATE INDEX idx_content_versions_project_id 
  ON content_versions(project_id);

CREATE INDEX idx_content_lead_captures_project_id 
  ON content_lead_captures(project_id);

CREATE INDEX idx_content_lead_captures_email 
  ON content_lead_captures(email);

CREATE INDEX idx_content_lead_captures_lead_score 
  ON content_lead_captures(lead_score DESC);

CREATE INDEX idx_seo_analytics_project_id_date 
  ON seo_analytics(project_id, date DESC);

CREATE INDEX idx_syndication_project_id 
  ON content_syndication(content_version_id);

-- Partial indexes (for fast filtering)

CREATE INDEX idx_projects_published 
  ON market_research_projects(id) 
  WHERE status = 'published';

CREATE INDEX idx_leads_qualified 
  ON content_lead_captures(id) 
  WHERE lead_score >= 50;
```

---

## PART 5: API ENDPOINTS (Next.js API Routes)

```typescript
// Key API endpoints for workflows

POST /api/projects
  // Create new market research project

GET /api/projects
  // List all projects (with filtering)

GET /api/projects/[id]
  // Get project details + related data

PUT /api/projects/[id]
  // Update project (status, metadata)

POST /api/projects/[id]/research
  // Trigger research workflow

POST /api/projects/[id]/generate-content
  // Trigger content generation

POST /api/projects/[id]/publish
  // Trigger publishing workflow

POST /api/form-submissions
  // Handle form submissions from blog
  // Create content_lead_captures record + trigger nurture

GET /api/analytics/projects/[id]
  // Get seo_analytics + traffic data for project

GET /api/leads
  // List leads with filtering + sorting

PUT /api/leads/[id]/score
  // Update lead score (manual adjustment)

POST /api/ai-recommendations/[id]
  // Trigger AI analysis + recommendation generation

GET /api/syndication/[id]
  // Get syndication status for content
```

---

## PART 6: INTEGRATION WITH EXISTING FINEM SYSTEMS

### Map-Based Workflow Integration Points

```typescript
// Existing systems to leverage:

1. SALESFORCE CRM
   ├─ Lead object: Already synced
   ├─ Activity object: Log content engagement
   ├─ Campaign object: "Chick-fil-A Market Report 2026"
   └─ New mapping:
      ├─ content_lead_captures.salesforce_contact_id
      ├─ Lead.Source = "Content - [Project Name]"
      └─ Activity records for: form fills, email opens, demo requests

2. n8n WORKFLOW ORCHESTRATION
   ├─ New workflows: Research, Content Gen, Publishing, Nurture, Monitoring
   ├─ Existing workflows: CRM sync, email sending
   └─ Integration: Workflows communicate via webhooks + shared database

3. POSTGRESQL DATABASE
   ├─ New tables: market_research_projects, content_versions, etc. (5 tables above)
   ├─ Existing tables: contacts, properties, activities
   └─ FK relationships to link content leads to existing contacts

4. EMAIL SERVICE (HubSpot, Klaviyo, Mailchimp)
   ├─ New email sequences: Nurture flows per tenant
   ├─ Existing segments: Reuse existing lists
   └─ Integration: n8n triggers emails + tracks engagement

5. GOOGLE ANALYTICS 4
   ├─ New events: form_submission, lead_scored, pdf_downloaded
   ├─ Existing goals: Conversion tracking
   └─ Integration: GA4 API syncs data to seo_analytics table daily

6. GOOGLE SEARCH CONSOLE
   ├─ New properties: Track each blog post
   ├─ Integration: GSC API fetches ranking data daily
   └─ Monitor for: indexing issues, ranking changes

7. RANK TRACKING API (SimilarWeb, Ahrefs, or Semrush)
   ├─ Track keywords per project
   ├─ Daily sync to seo_analytics table
   └─ Alerts on rank changes

8. CONTENT MANAGEMENT SYSTEM
   ├─ WordPress, Contentful, or Strapi
   ├─ API integration: Publish content automatically
   ├─ New posts created from content_versions
   └─ Tracking: UTM parameters + form embeds
```

---

## PART 7: DEPLOYMENT & ROLLOUT

### Phase 1: Foundation (Week 1-2)
- [ ] Create database tables (PostgreSQL)
- [ ] Set up indexes
- [ ] Build Admin Dashboard UI

### Phase 2: Workflows (Week 3-6)
- [ ] Build n8n workflows (Research, Content Gen, Publishing, Nurture, Monitoring)
- [ ] Test with 1 pilot project (Chick-fil-A)
- [ ] Iterate based on feedback

### Phase 3: Frontend (Week 7-8)
- [ ] Build public blog post template
- [ ] Add lead capture forms
- [ ] Test form submissions + email triggers

### Phase 4: Go-Live (Week 9+)
- [ ] Launch pilot project publicly
- [ ] Monitor performance (rankings, leads, conversions)
- [ ] Scale to next 5-10 projects
- [ ] Refine based on performance data

---

## PART 8: SUCCESS METRICS & KPIs

```
CONTENT METRICS:
├─ Reports published: Target 1-2/week → 10-20 total in 12 months
├─ Keyword rankings: Target top 3 for 50+ primary keywords
├─ Organic traffic: Target 20-50K monthly impressions → 5-10K clicks
└─ Form impressions: Target 500+ per project per month

LEAD METRICS:
├─ Form submission rate: Target 5-8% (above industry 3.2%)
├─ Cost per lead: Target $20 (content creation / leads)
├─ Lead-to-opportunity rate: Target 10-25% (qualified investors)
└─ Total qualified leads: Target 500-1000/month

FINANCIAL METRICS:
├─ Content creation cost: $2,000-3,000 per report ($500 AI + $1,500 human review + $500 tooling)
├─ Lead cost: $20-50 per lead
├─ Deal size: $50K-200K average (NNN property)
├─ Customer lifetime value: $200K-500K (multiple deals)
└─ ROI: 10:1 to 25:1 (cost per lead vs LTV)

EMAIL METRICS:
├─ Email open rate: Target 35-45%
├─ Click-through rate: Target 15-25%
├─ Unsubscribe rate: Target <1%
└─ Conversion to qualified lead: Target 5-10%
```

---

## FINAL ARCHITECTURE DIAGRAM

```
┌─────────────────────────────────────────────────────────────┐
│                   FINEM CONTENT ENGINE                       │
└─────────────────────────────────────────────────────────────┘

LAYER 1: DATA
├─ PostgreSQL (market_research_projects, content_versions, etc.)
├─ API integrations (CoStar, SEC Edgar, Google Trends, Exa AI)
└─ CRM (Salesforce) for lead storage

LAYER 2: ORCHESTRATION (n8n)
├─ Workflow 1: Research Agent (pull data)
├─ Workflow 2: Content Gen (create report)
├─ Workflow 3: Publishing (syndicate)
├─ Workflow 4: Lead Nurture (auto-email)
└─ Workflow 5: SEO Monitoring (track + optimize)

LAYER 3: ADMIN (Next.js React Dashboard)
├─ Project management
├─ Content editing
├─ Lead management
└─ Analytics + insights

LAYER 4: PUBLIC (Blog + Forms)
├─ Blog posts (finegroup.com/blog)
├─ Lead capture forms
├─ Gated PDFs
└─ Syndication channels (Medium, LinkedIn, email)

LAYER 5: INTEGRATION
├─ Salesforce CRM (lead sync)
├─ Email service (nurture)
├─ GA4 (analytics)
├─ Rank tracking (SEO)
└─ Search Console (indexing)
```

---

**End of Technical Specification**

**Next Steps**:
1. Review architecture with engineering team
2. Begin Phase 1: Database + Admin Dashboard
3. Test Workflow 2 (Content Generation) with pilot project
4. Monitor KPIs closely; optimize based on real-world performance

This system is designed to integrate seamlessly with your existing Map-Based Workflow infrastructure while building a powerful, scalable content marketing engine. 🚀
