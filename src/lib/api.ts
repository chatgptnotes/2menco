import { supabase } from './supabaseClient'
const API_BASE = import.meta.env.VITE_API_URL || 'https://agentsdr2.onrender.com/api'
async function getAuthHeaders(): Promise<Record<string, string>> {
  const { data } = await supabase.auth.getSession()
  const token = data?.session?.access_token
  return token ? { Authorization: `Bearer ${token}` } : {}
}
async function apiFetch<T = unknown>(path: string, options: RequestInit = {}): Promise<T> {
  const authHeaders = await getAuthHeaders()
  const res = await fetch(`${API_BASE}${path}`, {
    ...options, headers: { 'Content-Type': 'application/json', ...authHeaders, ...(options.headers || {}) },
  })
  if (!res.ok) { const err = await res.json().catch(() => ({ error: res.statusText })); throw new Error(err.error || `API error ${res.status}`) }
  return res.json()
}
export interface Agent { role: string; name: string; title: string; description: string; status: string; color: string; capabilities: string[]; tasks_completed: number; last_run: string | null; metrics?: Record<string, unknown>; recent_tasks?: Task[]; id?: string }
export const apiAgents = {
  list: () => apiFetch<Agent[]>('/agents'),
  get: (role: string) => apiFetch<Agent>(`/agents/${role}`),
  run: (role: string, task?: string, description?: string) => apiFetch(`/agents/${role}/run`, { method: 'POST', body: JSON.stringify({ task: task || 'default', description }) }),
}
export interface Task { id: string; title: string; description: string; status: string; priority: string; due_date?: string; created_at?: string; agent_id?: string }
export const apiTasks = {
  list: (status?: string) => apiFetch<{ tasks: Task[] }>(`/tasks${status && status !== 'all' ? `?status=${status}` : ''}`),
  create: (data: Partial<Task>) => apiFetch<Task>('/tasks', { method: 'POST', body: JSON.stringify(data) }),
}
export interface Email { id: string; subject: string; from_email: string; body: string; received_at: string; ai_summary?: string }
export const apiEmails = {
  list: (limit = 50, offset = 0) => apiFetch<{ emails: Email[]; total: number }>(`/emails?limit=${limit}&offset=${offset}`),
  sync: () => apiFetch('/emails/sync', { method: 'POST' }),
  summary: (id: string) => apiFetch<{ summary: unknown }>(`/emails/${id}/summary`),
}
export const apiCRM = {
  contacts: () => apiFetch<{ contacts: unknown[] }>('/crm/contacts'),
  deals: () => apiFetch<{ deals: unknown[] }>('/crm/deals'),
  sync: () => apiFetch('/crm/sync', { method: 'POST' }),
}
export const apiOrgs = {
  list: () => apiFetch<unknown[]>('/orgs'),
  create: (name: string, slug?: string) => apiFetch('/orgs', { method: 'POST', body: JSON.stringify({ name, slug }) }),
  get: (id: string) => apiFetch(`/orgs/${id}`),
}
export interface AnalyticsData { agents: { total: number; active: number; idle: number }; tasks: { total: number; completed: number; pending: number; in_progress: number }; emails: { total: number; unread: number }; deals: { total: number; won: number; pipeline_value: number }; activity: { id: string; action: string; details: string; created_at: string; agent_type?: string }[] }
export const apiAnalytics = { get: () => apiFetch<AnalyticsData>('/analytics') }
