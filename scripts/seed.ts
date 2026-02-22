// Run with: npx tsx scripts/seed.ts
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  'https://vtdokcsxdzdwgaatytab.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZ0ZG9rY3N4ZHpkd2dhYXR5dGFiIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1NzA1MTgxMCwiZXhwIjoyMDcyNjI3ODEwfQ.I4aDdvVH4ZYRKaLf19_UKeo1Tru60XKnHS_0zHSxzvM'
)

async function seed() {
  console.log('🌱 Seeding database...')

  // Create org
  const { data: org } = await supabase.from('organizations').upsert({ name: '2MEN.co', slug: '2menco', plan: 'pro' }, { onConflict: 'slug' }).select().single()
  if (!org) { console.error('Failed to create org'); return }
  const orgId = org.id
  console.log('✅ Organization:', orgId)

  // Agents
  const agentDefs = [
    { name: 'Digital CMO', type: 'cmo', status: 'active', config: { description: 'Handles marketing campaigns, lead generation, and brand management', focus: ['SEO', 'Content', 'Social Media', 'PPC'] }, metrics: { performance: 94, uptime: 99.8 } },
    { name: 'Digital CRO', type: 'cro', status: 'active', config: { description: 'Manages sales pipeline, conversion optimization, and revenue growth', focus: ['Pipeline', 'Deals', 'Forecasting'] }, metrics: { performance: 87, uptime: 99.5 } },
    { name: 'Digital CFO', type: 'cfo', status: 'active', config: { description: 'Tracks financial metrics, cash flow, and budget management', focus: ['P&L', 'Cash Flow', 'Budgets'] }, metrics: { performance: 92, uptime: 99.9 } },
    { name: 'Digital COO', type: 'coo', status: 'active', config: { description: 'Manages daily operations, process optimization, and team coordination', focus: ['Processes', 'HR', 'Logistics'] }, metrics: { performance: 88, uptime: 98.5 } },
    { name: 'Digital CTO', type: 'cto', status: 'active', config: { description: 'Manages technology infrastructure, security, and system architecture', focus: ['Infrastructure', 'Security', 'DevOps'] }, metrics: { performance: 96, uptime: 99.9 } },
    { name: 'Digital CXO', type: 'cxo', status: 'active', config: { description: 'Manages customer experience, satisfaction, and retention', focus: ['NPS', 'Support', 'Onboarding'] }, metrics: { performance: 82, uptime: 97.0 } },
  ]
  const { data: agents } = await supabase.from('agents').upsert(agentDefs.map(a => ({ ...a, org_id: orgId })), { onConflict: 'id' }).select()
  console.log('✅ Agents:', agents?.length)

  const agentMap: Record<string, string> = {}
  agents?.forEach(a => { agentMap[a.type] = a.id })

  // KPIs
  const kpiDefs = [
    { name: 'Monthly Recurring Revenue', category: 'financial', current_value: 575000, target_value: 1000000, unit: 'AED', trend: 'up' },
    { name: 'Gross Profit Margin', category: 'financial', current_value: 68, target_value: 75, unit: '%', trend: 'up' },
    { name: 'Cash Runway', category: 'financial', current_value: 8, target_value: 12, unit: 'months', trend: 'stable' },
    { name: 'Revenue Growth Rate', category: 'financial', current_value: 15.2, target_value: 20, unit: '%', trend: 'up' },
    { name: 'Lead Generation', category: 'marketing', current_value: 1250, target_value: 2000, unit: 'leads/mo', trend: 'up' },
    { name: 'Website Traffic', category: 'marketing', current_value: 45000, target_value: 100000, unit: 'visits/mo', trend: 'up' },
    { name: 'Social Media Engagement', category: 'marketing', current_value: 4.2, target_value: 6, unit: '%', trend: 'up' },
    { name: 'Email Open Rate', category: 'marketing', current_value: 28, target_value: 35, unit: '%', trend: 'stable' },
    { name: 'Lead-to-Customer Conversion', category: 'sales', current_value: 12.5, target_value: 15, unit: '%', trend: 'up' },
    { name: 'Average Deal Size', category: 'sales', current_value: 25000, target_value: 35000, unit: 'AED', trend: 'up' },
    { name: 'Sales Cycle Length', category: 'sales', current_value: 28, target_value: 21, unit: 'days', trend: 'down' },
    { name: 'Pipeline Value', category: 'sales', current_value: 2500000, target_value: 5000000, unit: 'AED', trend: 'up' },
    { name: 'Customer Satisfaction (NPS)', category: 'customer', current_value: 72, target_value: 80, unit: 'score', trend: 'up' },
    { name: 'Customer Churn Rate', category: 'customer', current_value: 3.2, target_value: 2, unit: '%', trend: 'down' },
    { name: 'Customer Lifetime Value', category: 'customer', current_value: 85000, target_value: 120000, unit: 'AED', trend: 'up' },
    { name: 'Support Ticket Resolution', category: 'customer', current_value: 4.2, target_value: 2, unit: 'hours', trend: 'down' },
    { name: 'Operational Efficiency', category: 'operations', current_value: 78.5, target_value: 85, unit: '%', trend: 'up' },
    { name: 'Employee Productivity', category: 'operations', current_value: 82, target_value: 90, unit: '%', trend: 'up' },
    { name: 'System Uptime', category: 'technology', current_value: 99.8, target_value: 99.9, unit: '%', trend: 'stable' },
    { name: 'Deployment Frequency', category: 'technology', current_value: 12, target_value: 20, unit: 'deploys/mo', trend: 'up' },
  ]
  await supabase.from('kpis').insert(kpiDefs.map(k => ({ ...k, org_id: orgId })))
  console.log('✅ KPIs: 20')

  // Leads
  const leadDefs = [
    { name: 'Ahmed Al-Rashid', email: 'ahmed@techcorp.ae', phone: '+971501234567', company: 'TechCorp UAE', source: 'website', status: 'qualified', score: 85 },
    { name: 'Sarah Johnson', email: 'sarah@globalfin.com', phone: '+971502345678', company: 'GlobalFin', source: 'referral', status: 'contacted', score: 72 },
    { name: 'Mohammed Hassan', email: 'mhassan@dubairetail.ae', phone: '+971503456789', company: 'Dubai Retail Group', source: 'linkedin', status: 'new', score: 60 },
    { name: 'Lisa Chen', email: 'lchen@asiaventures.com', phone: '+971504567890', company: 'Asia Ventures', source: 'conference', status: 'proposal', score: 90 },
    { name: 'Omar Khalid', email: 'omar@buildpro.ae', phone: '+971505678901', company: 'BuildPro Construction', source: 'website', status: 'qualified', score: 78 },
    { name: 'Fatima Al-Zahra', email: 'fatima@healthplus.ae', phone: '+971506789012', company: 'HealthPlus', source: 'referral', status: 'new', score: 55 },
    { name: 'James Wright', email: 'jwright@consultech.com', phone: '+971507890123', company: 'ConsulTech', source: 'linkedin', status: 'contacted', score: 68 },
    { name: 'Aisha Bello', email: 'abello@edutech.ae', phone: '+971508901234', company: 'EduTech Solutions', source: 'website', status: 'qualified', score: 82 },
    { name: 'David Park', email: 'dpark@logisticshub.com', phone: '+971509012345', company: 'Logistics Hub', source: 'conference', status: 'proposal', score: 88 },
    { name: 'Noor Al-Sayed', email: 'noor@mediapro.ae', phone: '+971501112233', company: 'MediaPro Agency', source: 'referral', status: 'new', score: 45 },
  ]
  const { data: leads } = await supabase.from('leads').insert(leadDefs.map(l => ({ ...l, org_id: orgId, agent_id: agentMap['cro'] }))).select()
  console.log('✅ Leads:', leads?.length)

  // Proposals
  if (leads && leads.length >= 5) {
    const proposalDefs = [
      { lead_id: leads[3].id, title: 'Digital Transformation Package', amount: 150000, status: 'sent', content: { services: ['BOS Setup', 'Agent Training', '6-month Support'] } },
      { lead_id: leads[8].id, title: 'Logistics Automation Suite', amount: 85000, status: 'draft', content: { services: ['COO Agent', 'Process Mapping', 'Integration'] } },
      { lead_id: leads[0].id, title: 'Marketing Automation Pro', amount: 65000, status: 'accepted', content: { services: ['CMO Agent', 'Lead Gen', 'Analytics'] } },
      { lead_id: leads[4].id, title: 'Construction Management BOS', amount: 120000, status: 'sent', content: { services: ['Full BOS', 'Custom Agents', 'Training'] } },
      { lead_id: leads[7].id, title: 'EdTech Growth Package', amount: 45000, status: 'negotiation', content: { services: ['CRO Agent', 'Growth Strategy', 'KPIs'] } },
    ]
    await supabase.from('proposals').insert(proposalDefs.map(p => ({ ...p, org_id: orgId })))
    console.log('✅ Proposals: 5')
  }

  // Agent Tasks
  const taskDefs = [
    { agent_id: agentMap['cmo'], title: 'Launch Q1 content calendar', description: 'Plan and schedule 30 days of social media content', status: 'completed', priority: 'high', due_date: '2026-02-15' },
    { agent_id: agentMap['cmo'], title: 'Setup Google Ads campaign', description: 'Create and optimize PPC campaigns for lead generation', status: 'in-progress', priority: 'high', due_date: '2026-02-28' },
    { agent_id: agentMap['cro'], title: 'Review sales pipeline', description: 'Analyze pipeline and identify bottlenecks', status: 'in-progress', priority: 'high', due_date: '2026-02-25' },
    { agent_id: agentMap['cro'], title: 'Prepare quarterly forecast', description: 'Build Q2 revenue forecast model', status: 'pending', priority: 'medium', due_date: '2026-03-01' },
    { agent_id: agentMap['cfo'], title: 'Monthly P&L report', description: 'Generate and analyze February P&L', status: 'pending', priority: 'high', due_date: '2026-03-05' },
    { agent_id: agentMap['coo'], title: 'Optimize onboarding workflow', description: 'Reduce client onboarding time by 30%', status: 'in-progress', priority: 'medium', due_date: '2026-03-10' },
    { agent_id: agentMap['cto'], title: 'Security audit', description: 'Complete quarterly security assessment', status: 'completed', priority: 'critical', due_date: '2026-02-20' },
    { agent_id: agentMap['cxo'], title: 'NPS survey analysis', description: 'Analyze latest NPS scores and create action plan', status: 'pending', priority: 'medium', due_date: '2026-03-15' },
  ]
  await supabase.from('agent_tasks').insert(taskDefs)
  console.log('✅ Tasks: 8')

  // Activity Log
  const activityDefs = [
    { action: 'Agent deployed', details: { agent: 'Digital CMO', type: 'deployment' } },
    { action: 'KPI target updated', details: { kpi: 'MRR', old: 800000, new: 1000000 } },
    { action: 'New lead captured', details: { lead: 'Ahmed Al-Rashid', source: 'website' } },
    { action: 'Proposal sent', details: { proposal: 'Digital Transformation Package', amount: 150000 } },
    { action: 'Task completed', details: { task: 'Security audit', agent: 'Digital CTO' } },
    { action: 'System update', details: { version: '2.1.0', changes: 'Performance improvements' } },
  ]
  await supabase.from('activity_log').insert(activityDefs.map(a => ({ ...a, org_id: orgId })))
  console.log('✅ Activity log: 6')

  console.log('\n🎉 Seeding complete!')
}

seed().catch(console.error)
