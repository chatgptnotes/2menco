import { adamrit } from './adamritClient'

// ─── Types ───

export interface Bill {
  id: string
  patient_id: string
  bill_no: string | null
  claim_id: string | null
  date: string | null
  category: string
  total_amount: number
  status: string
  created_at: string
  updated_at: string
  visit_id: string | null
  // joined
  patient_name?: string
  patient_uhid?: string
  patient_corporate?: string
}

export interface Patient {
  id: string
  name: string
  patients_id: string // UHID
  corporate: string
  age: number | null
  gender: string | null
  phone: string | null
  hospital_name: string | null
  created_at: string
}

export interface EsicStageStatus {
  status: string
  counts: number
  opd: number
  inPatient: number
  enhancement: number
  isHighlighted: boolean
}

export interface EsicStage {
  stage: string
  statuses: EsicStageStatus[]
}

export interface EsicExtraction {
  id: string
  hospital_name: string
  extracted_at: string
  total_claims: { counts: number; opd: number; inPatient: number; enhancement: number }
  stage_data: EsicStage[]
  payer_type: string
}

export interface FollowUp {
  id: string
  name: string
  contact_type: string | null
  phone: string | null
  email: string | null
  organization: string | null
  notes: string | null
  created_at: string
}

export interface FollowUpTask {
  id: string
  follow_up_id: string
  title: string
  description: string | null
  status: string
  due_date: string | null
  created_at: string
  updated_at: string
}

// ─── ESIC Claims Pipeline ───

export const fetchEsicPipeline = async (): Promise<EsicExtraction | null> => {
  const { data, error } = await adamrit
    .from('esic_claims_extractions')
    .select('*')
    .eq('hospital_name', 'HOPE MULTISPECIALITY HOSPITAL')
    .order('extracted_at', { ascending: false })
    .limit(1)
    .single()
  if (error) { console.error('ESIC fetch error:', error); return null }
  return data as EsicExtraction
}

export const getStagesSummary = (stages: EsicStage[]) => {
  return stages.map(s => {
    const total = s.statuses.reduce((sum, st) => sum + st.counts, 0)
    const highlighted = s.statuses.filter(st => st.isHighlighted && st.counts > 0)
    return { stage: s.stage, total, highlighted, statuses: s.statuses.filter(st => st.counts > 0) }
  }).filter(s => s.total > 0)
}

// ─── Bills ───

export const fetchBills = async (filters?: { status?: string; category?: string; limit?: number }) => {
  let query = adamrit
    .from('bills')
    .select('*, patients(name, patients_id, corporate)')
    .order('created_at', { ascending: false })

  if (filters?.status) query = query.eq('status', filters.status)
  if (filters?.category) query = query.eq('category', filters.category)
  if (filters?.limit) query = query.limit(filters.limit)

  const { data, error } = await query
  if (error) { console.error('Bills fetch error:', error); return [] }
  return (data || []).map((b: any) => ({
    ...b,
    patient_name: b.patients?.name?.trim() || 'Unknown',
    patient_uhid: b.patients?.patients_id || '',
    patient_corporate: b.patients?.corporate || '',
  })) as Bill[]
}

export const fetchBillsCount = async () => {
  const { count, error } = await adamrit
    .from('bills')
    .select('*', { count: 'exact', head: true })
  if (error) return 0
  return count || 0
}

export const fetchBillsSummary = async () => {
  // Get aggregated stats
  const { data, error } = await adamrit
    .from('bills')
    .select('total_amount, status, category')

  if (error || !data) return { totalBilled: 0, totalDraft: 0, byCategory: {} as Record<string, number>, byStatus: {} as Record<string, number>, count: 0 }

  const totalBilled = data.reduce((s, b) => s + Number(b.total_amount || 0), 0)
  const byCategory: Record<string, number> = {}
  const byStatus: Record<string, number> = {}

  data.forEach(b => {
    byCategory[b.category || 'OTHER'] = (byCategory[b.category || 'OTHER'] || 0) + 1
    byStatus[b.status || 'UNKNOWN'] = (byStatus[b.status || 'UNKNOWN'] || 0) + 1
  })

  return { totalBilled, totalDraft: byStatus['DRAFT'] || 0, byCategory, byStatus, count: data.length }
}

// ─── Patients ───

export const fetchPatients = async (search?: string, limit = 50) => {
  let query = adamrit.from('patients').select('*').order('created_at', { ascending: false }).limit(limit)
  if (search) query = query.ilike('name', `%${search}%`)
  const { data, error } = await query
  if (error) return []
  return data as Patient[]
}

export const fetchPatientDetail = async (patientId: string) => {
  const [patientRes, billsRes, visitsRes] = await Promise.all([
    adamrit.from('patients').select('*').eq('id', patientId).single(),
    adamrit.from('bills').select('*').eq('patient_id', patientId),
    adamrit.from('visits').select('*').eq('patient_id', patientId),
  ])
  return {
    patient: patientRes.data as Patient | null,
    bills: (billsRes.data || []) as Bill[],
    visits: visitsRes.data || [],
  }
}

// ─── Follow-ups ───

export const fetchFollowUps = async () => {
  const { data, error } = await adamrit
    .from('follow_ups')
    .select('*')
    .order('created_at', { ascending: false })
  if (error) return []
  return data as FollowUp[]
}

export const fetchFollowUpTasks = async (followUpId?: string) => {
  let query = adamrit
    .from('follow_up_tasks')
    .select('*, follow_ups(name, organization)')
    .order('created_at', { ascending: false })
  if (followUpId) query = query.eq('follow_up_id', followUpId)
  const { data, error } = await query
  if (error) return []
  return data as (FollowUpTask & { follow_ups?: { name: string; organization: string } })[]
}

export const createFollowUpTask = async (task: Partial<FollowUpTask>) => {
  const { data, error } = await adamrit.from('follow_up_tasks').insert(task).select().single()
  if (error) throw error
  return data
}

export const updateFollowUpTask = async (id: string, updates: Partial<FollowUpTask>) => {
  const { data, error } = await adamrit.from('follow_up_tasks').update({ ...updates, updated_at: new Date().toISOString() }).eq('id', id).select().single()
  if (error) throw error
  return data
}

// ─── Legacy compat (used by CFO page) ───

export type Claim = Bill // alias
export type CfoInvoice = Bill // alias
export type ClaimFollowup = FollowUpTask

export const fetchClaims = fetchBills
export const fetchCfoInvoices = async (filters?: { client_type?: string; status?: string }) => {
  return fetchBills({ category: filters?.client_type?.toUpperCase(), status: filters?.status?.toUpperCase(), limit: 200 })
}
export const fetchRecentFollowups = async (_limit = 10) => {
  return fetchFollowUpTasks()
}
export const fetchFollowups = async (claimId: string) => {
  return fetchFollowUpTasks(claimId)
}
export const createClaim = async (_claim: any) => {
  // no-op for now
  console.warn('createClaim not implemented for Adamrit')
}

export const getClaimsStats = (bills: Bill[]) => {
  const totalOutstanding = bills.reduce((sum, b) => sum + Number(b.total_amount || 0), 0)
  const totalRecovered = 0 // No recovered amount field in bills
  const byPayer: Record<string, number> = {}
  const byStatus: Record<string, number> = {}
  bills.forEach(b => {
    const payer = b.patient_corporate || b.category || 'Other'
    byPayer[payer] = (byPayer[payer] || 0) + Number(b.total_amount || 0)
    byStatus[b.status] = (byStatus[b.status] || 0) + 1
  })
  return { totalOutstanding, totalRecovered, byPayer, byStatus }
}
