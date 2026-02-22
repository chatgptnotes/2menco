import { supabase } from './supabaseClient'

export interface Claim {
  id: string
  hospital_id: string | null
  patient_name: string
  patient_id: string | null
  claim_number: string | null
  payer_type: 'ESIC' | 'CGHS' | 'ECHS' | 'Private' | 'Other'
  payer_name: string | null
  claim_amount: number
  approved_amount: number | null
  recovered_amount: number
  status: string
  denial_reason: string | null
  appeal_text: string | null
  submission_date: string | null
  last_followup: string | null
  next_followup: string | null
  notes: string | null
  created_at: string
  updated_at: string
}

export interface ClaimFollowup {
  id: string
  claim_id: string
  action: string
  response: string | null
  followup_by: string | null
  followup_date: string
  next_action: string | null
  next_date: string | null
}

export interface CfoInvoice {
  id: string
  client_name: string
  client_type: 'hospital' | 'software' | 'bettroi' | 'other'
  invoice_number: string | null
  amount: number
  paid_amount: number
  status: string
  due_date: string | null
  issued_date: string | null
  description: string | null
  created_at: string
  updated_at: string
}

export interface CfoDailySummary {
  id: string
  summary_date: string
  total_outstanding: number
  total_recovered: number
  claims_pending: number
  claims_approved: number
  claims_denied: number
  claims_appealed: number
  invoices_unpaid: number
  invoices_overdue: number
  recovery_rate: number
}

// Claims
export const fetchClaims = async (filters?: { payer_type?: string; status?: string }) => {
  let query = supabase.from('claims').select('*').order('created_at', { ascending: false })
  if (filters?.payer_type) query = query.eq('payer_type', filters.payer_type)
  if (filters?.status) query = query.eq('status', filters.status)
  const { data, error } = await query
  if (error) throw error
  return data as Claim[]
}

export const fetchClaim = async (id: string) => {
  const { data, error } = await supabase.from('claims').select('*').eq('id', id).single()
  if (error) throw error
  return data as Claim
}

export const createClaim = async (claim: Partial<Claim>) => {
  const { data, error } = await supabase.from('claims').insert(claim).select().single()
  if (error) throw error
  return data as Claim
}

export const updateClaim = async (id: string, updates: Partial<Claim>) => {
  const { data, error } = await supabase.from('claims').update({ ...updates, updated_at: new Date().toISOString() }).eq('id', id).select().single()
  if (error) throw error
  return data as Claim
}

// Followups
export const fetchFollowups = async (claimId: string) => {
  const { data, error } = await supabase.from('claim_followups').select('*').eq('claim_id', claimId).order('followup_date', { ascending: false })
  if (error) throw error
  return data as ClaimFollowup[]
}

export const createFollowup = async (followup: Partial<ClaimFollowup>) => {
  const { data, error } = await supabase.from('claim_followups').insert(followup).select().single()
  if (error) throw error
  return data as ClaimFollowup
}

export const fetchRecentFollowups = async (limit = 10) => {
  const { data, error } = await supabase.from('claim_followups').select('*, claims(patient_name, claim_number, payer_type)').order('followup_date', { ascending: false }).limit(limit)
  if (error) throw error
  return data
}

// Invoices
export const fetchCfoInvoices = async (filters?: { client_type?: string; status?: string }) => {
  let query = supabase.from('cfo_invoices').select('*').order('created_at', { ascending: false })
  if (filters?.client_type) query = query.eq('client_type', filters.client_type)
  if (filters?.status) query = query.eq('status', filters.status)
  const { data, error } = await query
  if (error) throw error
  return data as CfoInvoice[]
}

export const createCfoInvoice = async (invoice: Partial<CfoInvoice>) => {
  const { data, error } = await supabase.from('cfo_invoices').insert(invoice).select().single()
  if (error) throw error
  return data as CfoInvoice
}

export const updateCfoInvoice = async (id: string, updates: Partial<CfoInvoice>) => {
  const { data, error } = await supabase.from('cfo_invoices').update({ ...updates, updated_at: new Date().toISOString() }).eq('id', id).select().single()
  if (error) throw error
  return data as CfoInvoice
}

// Summary
export const fetchLatestSummary = async () => {
  const { data, error } = await supabase.from('cfo_daily_summary').select('*').order('summary_date', { ascending: false }).limit(1).single()
  if (error) throw error
  return data as CfoDailySummary
}

// Aggregations (computed client-side from claims)
export const getClaimsStats = (claims: Claim[]) => {
  const totalOutstanding = claims.reduce((sum, c) => sum + Number(c.claim_amount), 0)
  const totalRecovered = claims.reduce((sum, c) => sum + Number(c.recovered_amount), 0)
  const byPayer: Record<string, number> = {}
  const byStatus: Record<string, number> = {}
  claims.forEach(c => {
    byPayer[c.payer_type] = (byPayer[c.payer_type] || 0) + Number(c.claim_amount)
    byStatus[c.status] = (byStatus[c.status] || 0) + 1
  })
  return { totalOutstanding, totalRecovered, byPayer, byStatus }
}
