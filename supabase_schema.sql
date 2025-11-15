-- =====================================================
-- COMPLETE DATABASE SCHEMA FOR SUPABASE
-- Real Estate Conversion Funnel System
-- =====================================================
-- 
-- Instructions:
-- 1. Go to your Supabase project dashboard
-- 2. Navigate to SQL Editor
-- 3. Paste this entire file and run it
-- 4. All tables will be created with proper structure
-- =====================================================

-- Enable UUID extension (if not already enabled)
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =====================================================
-- USERS TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS users (
  id VARCHAR PRIMARY KEY DEFAULT gen_random_uuid()::text,
  username TEXT NOT NULL UNIQUE,
  password TEXT NOT NULL,
  role TEXT NOT NULL DEFAULT 'user',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================================================
-- PROPERTIES TABLE (Enhanced with funnel analytics)
-- =====================================================
CREATE TABLE IF NOT EXISTS properties (
  id VARCHAR PRIMARY KEY DEFAULT gen_random_uuid()::text,
  title TEXT NOT NULL,
  title_en TEXT,
  city TEXT NOT NULL,
  property_type TEXT NOT NULL,
  price NUMERIC NOT NULL,
  size_sqm NUMERIC,
  description TEXT,
  description_en TEXT,
  images TEXT[] NOT NULL DEFAULT ARRAY[]::TEXT[],
  status TEXT NOT NULL DEFAULT 'available',
  views NUMERIC NOT NULL DEFAULT '0',
  -- New fields for funnel analytics
  real_sales_rate NUMERIC,
  common_objections TEXT,
  closing_features TEXT,
  demand_indicator TEXT,
  -- New Property Layer fields
  payment_plan TEXT, -- نظام السداد
  cash_percentage NUMERIC, -- نسبة الكاش
  delivery_time TEXT, -- وقت الاستلام
  services TEXT[] DEFAULT ARRAY[]::TEXT[], -- الخدمات
  developer TEXT, -- المطور
  project_name TEXT, -- اسم المشروع
  unit_number TEXT, -- رقم الشقة
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- =====================================================
-- MARKET TRENDS TABLE (Enhanced with demand tracking)
-- =====================================================
CREATE TABLE IF NOT EXISTS market_trends (
  id VARCHAR PRIMARY KEY DEFAULT gen_random_uuid()::text,
  city TEXT NOT NULL,
  avg_price NUMERIC,
  demand_level TEXT,
  change_percent NUMERIC,
  notes TEXT,
  notes_en TEXT,
  views NUMERIC NOT NULL DEFAULT '0',
  -- New fields for market layer
  daily_demand NUMERIC,
  weekly_demand NUMERIC,
  monthly_demand NUMERIC,
  supply NUMERIC, -- العرض لكل منطقة
  new_project_indicator TEXT,
  sales_velocity NUMERIC,
  broker_performance TEXT, -- JSON: { topBrokers: [{ name, deals, area }] }
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- =====================================================
-- LEADS TABLE (Enhanced with funnel tracking)
-- =====================================================
CREATE TABLE IF NOT EXISTS leads (
  id VARCHAR PRIMARY KEY DEFAULT gen_random_uuid()::text,
  name TEXT NOT NULL,
  phone TEXT NOT NULL,
  email TEXT,
  purpose TEXT,
  city TEXT,
  budget TEXT,
  message TEXT,
  -- New fields for funnel tracking
  funnel_stage TEXT DEFAULT 'curiosity',
  purchase_probability NUMERIC DEFAULT '0',
  decision_type TEXT, -- 'fast', 'hesitant', 'researcher'
  behavioral_triggers TEXT,
  last_interaction_at TIMESTAMPTZ,
  session_id TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Create index on session_id for faster lookups
CREATE INDEX IF NOT EXISTS idx_leads_session_id ON leads(session_id);
CREATE INDEX IF NOT EXISTS idx_leads_funnel_stage ON leads(funnel_stage);
CREATE INDEX IF NOT EXISTS idx_leads_phone ON leads(phone);

-- =====================================================
-- CONTENT TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS content (
  id VARCHAR PRIMARY KEY DEFAULT gen_random_uuid()::text,
  title TEXT NOT NULL,
  title_en TEXT,
  body TEXT,
  body_en TEXT,
  category TEXT,
  views NUMERIC NOT NULL DEFAULT '0',
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- =====================================================
-- ROI CALCULATOR USAGE TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS roi_calculator_usage (
  id VARCHAR PRIMARY KEY DEFAULT gen_random_uuid()::text,
  total_usage NUMERIC NOT NULL DEFAULT '0',
  last_used TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- =====================================================
-- AGENTS TABLE (New - Agent Layer)
-- =====================================================
CREATE TABLE IF NOT EXISTS agents (
  id VARCHAR PRIMARY KEY DEFAULT gen_random_uuid()::text,
  name TEXT NOT NULL,
  email TEXT,
  phone TEXT,
  daily_contacts NUMERIC DEFAULT '0',
  interested_clients NUMERIC DEFAULT '0', -- عدد العملاء المهتمين
  closing_rate NUMERIC DEFAULT '0',
  response_speed NUMERIC, -- سرعة الرد (بالدقائق)
  total_deals NUMERIC DEFAULT '0',
  total_revenue NUMERIC DEFAULT '0',
  active_projects TEXT[] DEFAULT ARRAY[]::TEXT[],
  scripts TEXT, -- JSON: { commonObjections: [], bestResponses: [], pitchTemplates: [] }
  pitch_effectiveness TEXT, -- JSON: { bestPitches: [{ pitch, conversionRate }] }
  objections TEXT, -- JSON: { common: [{ objection, frequency }], responses: [] }
  average_deal_price NUMERIC, -- الأسعار اللي بيقفل بيها
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- =====================================================
-- USER BEHAVIORS TABLE (New - Behavior Layer)
-- =====================================================
CREATE TABLE IF NOT EXISTS user_behaviors (
  id VARCHAR PRIMARY KEY DEFAULT gen_random_uuid()::text,
  session_id TEXT NOT NULL,
  lead_id TEXT,
  behavior_type TEXT NOT NULL,
  action TEXT NOT NULL,
  target TEXT,
  target_id TEXT,
  metadata TEXT, -- JSON string
  time_spent NUMERIC,
  scroll_depth NUMERIC,
  page_url TEXT,
  user_agent TEXT,
  ip_address TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Create indexes for faster queries
CREATE INDEX IF NOT EXISTS idx_user_behaviors_session_id ON user_behaviors(session_id);
CREATE INDEX IF NOT EXISTS idx_user_behaviors_lead_id ON user_behaviors(lead_id);
CREATE INDEX IF NOT EXISTS idx_user_behaviors_behavior_type ON user_behaviors(behavior_type);
CREATE INDEX IF NOT EXISTS idx_user_behaviors_action ON user_behaviors(action);
CREATE INDEX IF NOT EXISTS idx_user_behaviors_created_at ON user_behaviors(created_at DESC);

-- =====================================================
-- TRANSACTIONS TABLE (New - Purchase tracking)
-- =====================================================
CREATE TABLE IF NOT EXISTS transactions (
  id VARCHAR PRIMARY KEY DEFAULT gen_random_uuid()::text,
  lead_id TEXT NOT NULL,
  property_id TEXT NOT NULL,
  agent_id TEXT,
  deal_value NUMERIC NOT NULL,
  commission NUMERIC,
  status TEXT DEFAULT 'pending',
  purchase_date TIMESTAMPTZ,
  contract_signed TIMESTAMPTZ,
  payment_received TIMESTAMPTZ,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Create indexes for faster queries
CREATE INDEX IF NOT EXISTS idx_transactions_lead_id ON transactions(lead_id);
CREATE INDEX IF NOT EXISTS idx_transactions_property_id ON transactions(property_id);
CREATE INDEX IF NOT EXISTS idx_transactions_agent_id ON transactions(agent_id);
CREATE INDEX IF NOT EXISTS idx_transactions_status ON transactions(status);

-- =====================================================
-- FOREIGN KEY CONSTRAINTS (Optional but recommended)
-- =====================================================
-- Note: These are commented out because the schema uses TEXT for IDs
-- If you want to enforce referential integrity, you'll need to adjust
-- the data types to match (e.g., use UUID type for foreign keys)

-- ALTER TABLE user_behaviors ADD CONSTRAINT fk_user_behaviors_lead 
--   FOREIGN KEY (lead_id) REFERENCES leads(id) ON DELETE CASCADE;

-- ALTER TABLE transactions ADD CONSTRAINT fk_transactions_lead 
--   FOREIGN KEY (lead_id) REFERENCES leads(id) ON DELETE RESTRICT;

-- ALTER TABLE transactions ADD CONSTRAINT fk_transactions_property 
--   FOREIGN KEY (property_id) REFERENCES properties(id) ON DELETE RESTRICT;

-- ALTER TABLE transactions ADD CONSTRAINT fk_transactions_agent 
--   FOREIGN KEY (agent_id) REFERENCES agents(id) ON DELETE SET NULL;

-- =====================================================
-- VIEWS FOR ANALYTICS (Optional helpful views)
-- =====================================================

-- View: Funnel Distribution
CREATE OR REPLACE VIEW funnel_distribution AS
SELECT 
  funnel_stage,
  COUNT(*) as count,
  ROUND(COUNT(*) * 100.0 / NULLIF(SUM(COUNT(*)) OVER (), 0), 2) as percentage
FROM leads
GROUP BY funnel_stage
ORDER BY 
  CASE funnel_stage
    WHEN 'curiosity' THEN 1
    WHEN 'understanding' THEN 2
    WHEN 'trust' THEN 3
    WHEN 'desire' THEN 4
    WHEN 'purchase' THEN 5
    ELSE 6
  END;

-- View: High Intent Leads
CREATE OR REPLACE VIEW high_intent_leads AS
SELECT 
  id,
  name,
  phone,
  email,
  funnel_stage,
  purchase_probability,
  decision_type,
  city,
  budget,
  last_interaction_at,
  created_at
FROM leads
WHERE funnel_stage IN ('desire', 'purchase')
   OR purchase_probability >= 75
ORDER BY purchase_probability DESC, last_interaction_at DESC;

-- View: Agent Performance Summary
CREATE OR REPLACE VIEW agent_performance AS
SELECT 
  a.id,
  a.name,
  a.email,
  a.phone,
  a.daily_contacts,
  a.closing_rate,
  a.total_deals,
  a.total_revenue,
  COUNT(t.id) as actual_transactions,
  COALESCE(SUM(t.deal_value), 0) as total_deal_value
FROM agents a
LEFT JOIN transactions t ON a.id = t.agent_id
GROUP BY a.id, a.name, a.email, a.phone, a.daily_contacts, 
         a.closing_rate, a.total_deals, a.total_revenue
ORDER BY total_deal_value DESC;

-- =====================================================
-- ROW LEVEL SECURITY (RLS) Policies (Optional)
-- =====================================================
-- Uncomment these if you want to enable RLS in Supabase

-- ALTER TABLE leads ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE user_behaviors ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;

-- Example: Allow service role to access all data
-- CREATE POLICY "Service role can access all leads" ON leads
--   FOR ALL USING (auth.role() = 'service_role');

-- =====================================================
-- COMPLETION MESSAGE
-- =====================================================
DO $$
BEGIN
  RAISE NOTICE '✅ Database schema created successfully!';
  RAISE NOTICE '📊 Tables created: users, properties, market_trends, leads, content, roi_calculator_usage, agents, user_behaviors, transactions';
  RAISE NOTICE '📈 Views created: funnel_distribution, high_intent_leads, agent_performance';
  RAISE NOTICE '🔍 Indexes created for optimal query performance';
  RAISE NOTICE '';
  RAISE NOTICE 'Next steps:';
  RAISE NOTICE '1. Update your .env file with your Supabase DATABASE_URL';
  RAISE NOTICE '2. Test the connection with: npm run db:push';
  RAISE NOTICE '3. Seed initial data if needed';
END $$;

