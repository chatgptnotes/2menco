// Static agent definitions — these 6 roles are fixed
export interface Agent {
  role: string
  name: string
  title: string
  description: string
  status: 'active' | 'working' | 'idle' | 'error'
  capabilities: string[]
  tasks_completed: number
  last_run: string | null
  metrics: Record<string, number>
}

export const AGENTS: Agent[] = [
  {
    role: 'cmo', name: 'Digital CMO', title: 'Chief Marketing Officer',
    description: 'AI-powered lead generation, outreach campaigns, email marketing automation, and brand management.',
    status: 'active', capabilities: ['email_outreach', 'lead_generation', 'campaign_management', 'brand_monitoring', 'social_media'],
    tasks_completed: 12, last_run: new Date().toISOString(),
    metrics: { emails_sent: 145, leads_generated: 23, campaigns_active: 3 },
  },
  {
    role: 'cro', name: 'Digital CRO', title: 'Chief Revenue Officer',
    description: 'Deal tracking, pipeline management, conversion optimization, and HubSpot CRM integration.',
    status: 'active', capabilities: ['deal_tracking', 'pipeline_management', 'hubspot_sync', 'conversion_analytics', 'follow_ups'],
    tasks_completed: 8, last_run: new Date().toISOString(),
    metrics: { deals_tracked: 18, conversion_rate: 34, revenue_pipeline: 250000 },
  },
  {
    role: 'cfo', name: 'Digital CFO', title: 'Chief Financial Officer',
    description: 'ESIC claim recovery, invoice tracking, payment follow-ups, and financial analytics powered by Adamrit HMS data.',
    status: 'working', capabilities: ['claim_recovery', 'invoice_tracking', 'payment_reminders', 'esic_appeals', 'financial_reports'],
    tasks_completed: 24, last_run: new Date().toISOString(),
    metrics: { claims_tracked: 1992, recovered_amount: 3500000, outstanding: 6500000 },
  },
  {
    role: 'coo', name: 'Digital COO', title: 'Chief Operating Officer',
    description: 'Task scheduling, team coordination, SOP compliance monitoring, and operational workflows.',
    status: 'idle', capabilities: ['task_scheduling', 'team_coordination', 'sop_monitoring', 'workflow_automation', 'reporting'],
    tasks_completed: 5, last_run: '2026-02-21T18:00:00Z',
    metrics: { tasks_managed: 42, sop_compliance: 87 },
  },
  {
    role: 'cto', name: 'Digital CTO', title: 'Chief Technology Officer',
    description: 'System health monitoring, deployment management, infrastructure alerts, and security scanning.',
    status: 'active', capabilities: ['system_monitoring', 'deployment_management', 'infrastructure_alerts', 'security_scanning', 'performance_tracking'],
    tasks_completed: 31, last_run: new Date().toISOString(),
    metrics: { uptime: 99.8, deployments: 12, alerts_resolved: 8 },
  },
  {
    role: 'cxo', name: 'Digital CXO', title: 'Chief Experience Officer',
    description: 'Customer feedback analysis, NPS tracking, support ticket management, and satisfaction monitoring.',
    status: 'idle', capabilities: ['feedback_analysis', 'nps_tracking', 'support_tickets', 'satisfaction_surveys', 'customer_insights'],
    tasks_completed: 3, last_run: '2026-02-20T12:00:00Z',
    metrics: { nps_score: 72, tickets_resolved: 15 },
  },
]

export const getAgent = (role: string) => AGENTS.find(a => a.role === role) || null
export const getAgents = () => AGENTS
