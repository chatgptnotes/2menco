-- Organizations
CREATE TABLE IF NOT EXISTS organizations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  slug text UNIQUE NOT NULL,
  logo_url text,
  plan text DEFAULT 'free',
  created_at timestamptz DEFAULT now()
);
ALTER TABLE organizations ENABLE ROW LEVEL SECURITY;
CREATE POLICY "orgs_read" ON organizations FOR SELECT USING (true);
CREATE POLICY "orgs_insert" ON organizations FOR INSERT WITH CHECK (true);

-- Profiles
CREATE TABLE IF NOT EXISTS profiles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  email text,
  full_name text,
  avatar_url text,
  role text DEFAULT 'user',
  org_id uuid REFERENCES organizations(id),
  created_at timestamptz DEFAULT now()
);
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "profiles_read" ON profiles FOR SELECT USING (true);
CREATE POLICY "profiles_own" ON profiles FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "profiles_insert" ON profiles FOR INSERT WITH CHECK (true);

-- Org Members
CREATE TABLE IF NOT EXISTS org_members (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id uuid REFERENCES organizations(id) ON DELETE CASCADE,
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  role text DEFAULT 'member',
  joined_at timestamptz DEFAULT now()
);
ALTER TABLE org_members ENABLE ROW LEVEL SECURITY;
CREATE POLICY "org_members_read" ON org_members FOR SELECT USING (true);
CREATE POLICY "org_members_insert" ON org_members FOR INSERT WITH CHECK (true);

-- Agents
CREATE TABLE IF NOT EXISTS agents (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id uuid REFERENCES organizations(id) ON DELETE CASCADE,
  name text NOT NULL,
  type text CHECK (type IN ('cmo','cro','cfo','coo','cto','cxo')) NOT NULL,
  status text DEFAULT 'active',
  config jsonb DEFAULT '{}',
  metrics jsonb DEFAULT '{}',
  created_at timestamptz DEFAULT now()
);
ALTER TABLE agents ENABLE ROW LEVEL SECURITY;
CREATE POLICY "agents_read" ON agents FOR SELECT USING (true);
CREATE POLICY "agents_insert" ON agents FOR INSERT WITH CHECK (true);
CREATE POLICY "agents_update" ON agents FOR UPDATE USING (true);

-- Agent Tasks
CREATE TABLE IF NOT EXISTS agent_tasks (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  agent_id uuid REFERENCES agents(id) ON DELETE CASCADE,
  title text NOT NULL,
  description text,
  status text DEFAULT 'pending',
  priority text DEFAULT 'medium',
  due_date timestamptz,
  result jsonb DEFAULT '{}',
  created_at timestamptz DEFAULT now()
);
ALTER TABLE agent_tasks ENABLE ROW LEVEL SECURITY;
CREATE POLICY "agent_tasks_read" ON agent_tasks FOR SELECT USING (true);
CREATE POLICY "agent_tasks_insert" ON agent_tasks FOR INSERT WITH CHECK (true);
CREATE POLICY "agent_tasks_update" ON agent_tasks FOR UPDATE USING (true);

-- Agent Logs
CREATE TABLE IF NOT EXISTS agent_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  agent_id uuid REFERENCES agents(id) ON DELETE CASCADE,
  action text NOT NULL,
  details jsonb DEFAULT '{}',
  created_at timestamptz DEFAULT now()
);
ALTER TABLE agent_logs ENABLE ROW LEVEL SECURITY;
CREATE POLICY "agent_logs_read" ON agent_logs FOR SELECT USING (true);
CREATE POLICY "agent_logs_insert" ON agent_logs FOR INSERT WITH CHECK (true);

-- KPIs
CREATE TABLE IF NOT EXISTS kpis (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id uuid REFERENCES organizations(id) ON DELETE CASCADE,
  name text NOT NULL,
  category text,
  current_value numeric DEFAULT 0,
  target_value numeric DEFAULT 0,
  unit text,
  trend text DEFAULT 'stable',
  updated_at timestamptz DEFAULT now()
);
ALTER TABLE kpis ENABLE ROW LEVEL SECURITY;
CREATE POLICY "kpis_read" ON kpis FOR SELECT USING (true);
CREATE POLICY "kpis_insert" ON kpis FOR INSERT WITH CHECK (true);
CREATE POLICY "kpis_update" ON kpis FOR UPDATE USING (true);

-- Leads
CREATE TABLE IF NOT EXISTS leads (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id uuid REFERENCES organizations(id) ON DELETE CASCADE,
  agent_id uuid REFERENCES agents(id),
  name text NOT NULL,
  email text,
  phone text,
  company text,
  source text,
  status text DEFAULT 'new',
  score integer DEFAULT 0,
  notes text,
  created_at timestamptz DEFAULT now()
);
ALTER TABLE leads ENABLE ROW LEVEL SECURITY;
CREATE POLICY "leads_read" ON leads FOR SELECT USING (true);
CREATE POLICY "leads_insert" ON leads FOR INSERT WITH CHECK (true);
CREATE POLICY "leads_update" ON leads FOR UPDATE USING (true);

-- Proposals
CREATE TABLE IF NOT EXISTS proposals (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id uuid REFERENCES organizations(id) ON DELETE CASCADE,
  lead_id uuid REFERENCES leads(id),
  title text NOT NULL,
  amount numeric DEFAULT 0,
  status text DEFAULT 'draft',
  content jsonb DEFAULT '{}',
  created_at timestamptz DEFAULT now()
);
ALTER TABLE proposals ENABLE ROW LEVEL SECURITY;
CREATE POLICY "proposals_read" ON proposals FOR SELECT USING (true);
CREATE POLICY "proposals_insert" ON proposals FOR INSERT WITH CHECK (true);
CREATE POLICY "proposals_update" ON proposals FOR UPDATE USING (true);

-- Invoices
CREATE TABLE IF NOT EXISTS invoices (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id uuid REFERENCES organizations(id) ON DELETE CASCADE,
  lead_id uuid REFERENCES leads(id),
  proposal_id uuid REFERENCES proposals(id),
  amount numeric DEFAULT 0,
  status text DEFAULT 'pending',
  due_date timestamptz,
  paid_at timestamptz,
  created_at timestamptz DEFAULT now()
);
ALTER TABLE invoices ENABLE ROW LEVEL SECURITY;
CREATE POLICY "invoices_read" ON invoices FOR SELECT USING (true);
CREATE POLICY "invoices_insert" ON invoices FOR INSERT WITH CHECK (true);
CREATE POLICY "invoices_update" ON invoices FOR UPDATE USING (true);

-- Notifications
CREATE TABLE IF NOT EXISTS notifications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  title text NOT NULL,
  message text,
  type text DEFAULT 'info',
  read boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
CREATE POLICY "notifications_own" ON notifications FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "notifications_insert" ON notifications FOR INSERT WITH CHECK (true);

-- Activity Log
CREATE TABLE IF NOT EXISTS activity_log (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id uuid REFERENCES organizations(id) ON DELETE CASCADE,
  user_id uuid,
  action text NOT NULL,
  details jsonb DEFAULT '{}',
  created_at timestamptz DEFAULT now()
);
ALTER TABLE activity_log ENABLE ROW LEVEL SECURITY;
CREATE POLICY "activity_log_read" ON activity_log FOR SELECT USING (true);
CREATE POLICY "activity_log_insert" ON activity_log FOR INSERT WITH CHECK (true);

-- Subscriptions
CREATE TABLE IF NOT EXISTS subscriptions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id uuid REFERENCES organizations(id) ON DELETE CASCADE,
  plan text NOT NULL,
  status text DEFAULT 'active',
  amount numeric DEFAULT 0,
  currency text DEFAULT 'AED',
  started_at timestamptz DEFAULT now(),
  expires_at timestamptz
);
ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "subscriptions_read" ON subscriptions FOR SELECT USING (true);
CREATE POLICY "subscriptions_insert" ON subscriptions FOR INSERT WITH CHECK (true);
