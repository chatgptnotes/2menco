import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  ArrowLeft, Play, Square, Settings, Activity,
  Users, DollarSign, BarChart3, CheckSquare, FileText
} from 'lucide-react'
import { supabase } from '../lib/supabaseClient'
import { useToast } from '../components/Toast'
import PageTransition from '../components/PageTransition'

interface Agent {
  id: string; name: string; type: string; status: string;
  config: Record<string, unknown>; metrics: Record<string, unknown>
}
interface Task { id: string; title: string; status: string; priority: string; due_date: string }
interface LogEntry { id: string; action: string; details: string; created_at: string }

const iconMap: Record<string, typeof Users> = {
  cmo: Users, cro: DollarSign, cfo: BarChart3, coo: CheckSquare, cto: Settings, cxo: FileText,
}
const colorMap: Record<string, string> = {
  cmo: 'from-blue-500 to-cyan-500', cro: 'from-emerald-500 to-green-500',
  cfo: 'from-violet-500 to-purple-500', coo: 'from-orange-500 to-amber-500',
  cto: 'from-indigo-500 to-blue-500', cxo: 'from-pink-500 to-rose-500',
}
const roleMap: Record<string, string> = {
  cmo: 'Chief Marketing Officer', cro: 'Chief Revenue Officer', cfo: 'Chief Financial Officer',
  coo: 'Chief Operations Officer', cto: 'Chief Technology Officer', cxo: 'Chief Experience Officer',
}

const AgentDetail = () => {
  const { agentType } = useParams<{ agentType: string }>()
  const [agent, setAgent] = useState<Agent | null>(null)
  const [tasks, setTasks] = useState<Task[]>([])
  const [logs, setLogs] = useState<LogEntry[]>([])
  const [loading, setLoading] = useState(true)
  const [tab, setTab] = useState<'overview' | 'tasks' | 'logs' | 'config'>('overview')
  const { toast } = useToast()

  useEffect(() => {
    const load = async () => {
      const { data: agents } = await supabase.from('agents').select('*').eq('type', agentType || '').limit(1)
      if (agents?.[0]) {
        setAgent(agents[0])
        const [t, l] = await Promise.all([
          supabase.from('agent_tasks').select('*').eq('agent_id', agents[0].id).order('created_at', { ascending: false }).limit(20),
          supabase.from('agent_logs').select('*').eq('agent_id', agents[0].id).order('created_at', { ascending: false }).limit(20),
        ])
        if (t.data) setTasks(t.data)
        if (l.data) setLogs(l.data)
      }
      setLoading(false)
    }
    load()
  }, [agentType])

  const toggleStatus = async () => {
    if (!agent) return
    const newStatus = agent.status === 'active' ? 'inactive' : 'active'
    await supabase.from('agents').update({ status: newStatus }).eq('id', agent.id)
    setAgent({ ...agent, status: newStatus })
    toast(`Agent ${newStatus === 'active' ? 'started' : 'stopped'}`, newStatus === 'active' ? 'success' : 'warning')
  }

  if (loading) return <div className="space-y-4 animate-pulse"><div className="h-8 bg-white/5 rounded w-48" /><div className="h-40 bg-white/5 rounded-xl" /></div>

  if (!agent) return (
    <div className="text-center py-20">
      <p className="text-gray-500">Agent not found</p>
      <Link to="/dashboard/agents" className="text-blue-400 text-sm mt-2 inline-block">Back to Agents</Link>
    </div>
  )

  const Icon = iconMap[agent.type] || Users
  const perf = (agent.metrics as { performance?: number })?.performance ?? 85
  const ut = (agent.metrics as { uptime?: number })?.uptime ?? 99

  const tabList = [
    { key: 'overview' as const, label: 'Overview' },
    { key: 'tasks' as const, label: `Tasks (${tasks.length})` },
    { key: 'logs' as const, label: `Activity (${logs.length})` },
    { key: 'config' as const, label: 'Configuration' },
  ]

  const priorityColor = (p: string) => {
    switch (p) { case 'critical': case 'high': return 'text-red-400'; case 'medium': return 'text-amber-400'; default: return 'text-emerald-400' }
  }
  const statusColor = (s: string) => {
    switch (s) { case 'completed': return 'bg-emerald-500/10 text-emerald-400'; case 'in-progress': return 'bg-amber-500/10 text-amber-400'; default: return 'bg-white/5 text-gray-400' }
  }

  return (
    <PageTransition>
      <div className="space-y-6">
        <Link to="/dashboard/agents" className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-gray-300 transition-colors">
          <ArrowLeft className="h-4 w-4" /> Back to Agents
        </Link>

        <div className="card">
          <div className="flex flex-col sm:flex-row sm:items-center gap-4">
            <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${colorMap[agent.type] || 'from-gray-500 to-gray-400'} flex items-center justify-center text-white shadow-lg`}>
              <Icon className="h-7 w-7" />
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-3">
                <h1 className="text-xl font-bold text-white">{agent.name}</h1>
                <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${agent.status === 'active' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-gray-500/10 text-gray-400'}`}>
                  {agent.status}
                </span>
              </div>
              <p className="text-sm text-gray-500 mt-0.5">{roleMap[agent.type] || agent.type.toUpperCase()}</p>
            </div>
            <div className="flex gap-2">
              <button onClick={toggleStatus} className={`btn ${agent.status === 'active' ? 'btn-warning' : 'btn-success'}`}>
                {agent.status === 'active' ? <><Square className="h-4 w-4 mr-1" /> Stop</> : <><Play className="h-4 w-4 mr-1" /> Start</>}
              </button>
              <button className="btn btn-secondary"><Settings className="h-4 w-4 mr-1" /> Configure</button>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6 pt-6 border-t border-white/[0.06]">
            <div><p className="text-xs text-gray-500">Performance</p><p className="text-lg font-bold text-white">{perf}%</p></div>
            <div><p className="text-xs text-gray-500">Uptime</p><p className="text-lg font-bold text-white">{ut}%</p></div>
            <div><p className="text-xs text-gray-500">Tasks</p><p className="text-lg font-bold text-white">{tasks.length}</p></div>
            <div><p className="text-xs text-gray-500">Status</p><p className="text-lg font-bold text-white capitalize">{agent.status}</p></div>
          </div>
        </div>

        <div className="flex gap-1 border-b border-white/[0.06] pb-px">
          {tabList.map(t => (
            <button key={t.key} onClick={() => setTab(t.key)}
              className={`px-4 py-2 text-sm font-medium rounded-t-lg transition-colors ${tab === t.key ? 'text-white bg-white/[0.06] border-b-2 border-blue-500' : 'text-gray-500 hover:text-gray-300'}`}
            >{t.label}</button>
          ))}
        </div>

        {tab === 'overview' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="card">
              <h3 className="text-sm font-semibold text-white mb-4">Performance Metrics</h3>
              <div className="space-y-4">
                {[
                  { label: 'Performance Score', value: perf, color: 'bg-blue-500' },
                  { label: 'System Uptime', value: ut, color: 'bg-emerald-500' },
                  { label: 'Task Completion', value: tasks.length > 0 ? Math.round(tasks.filter(t => t.status === 'completed').length / tasks.length * 100) : 0, color: 'bg-violet-500' },
                ].map(m => (
                  <div key={m.label}>
                    <div className="flex justify-between text-xs mb-1"><span className="text-gray-400">{m.label}</span><span className="text-white font-medium">{m.value}%</span></div>
                    <div className="w-full bg-white/5 rounded-full h-1.5"><div className={`h-1.5 rounded-full ${m.color}`} style={{ width: `${m.value}%` }} /></div>
                  </div>
                ))}
              </div>
            </div>
            <div className="card">
              <h3 className="text-sm font-semibold text-white mb-4">Description</h3>
              <p className="text-sm text-gray-400 leading-relaxed">
                {(agent.config as { description?: string })?.description || `AI-powered ${roleMap[agent.type] || agent.type} agent managing business operations autonomously.`}
              </p>
            </div>
          </motion.div>
        )}

        {tab === 'tasks' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-2">
            {tasks.length === 0 ? <div className="card text-center py-12"><p className="text-gray-500 text-sm">No tasks assigned</p></div>
            : tasks.map(task => (
              <div key={task.id} className="card-hover flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={`px-2 py-0.5 rounded text-xs font-medium ${statusColor(task.status)}`}>{task.status}</div>
                  <span className="text-sm text-gray-200">{task.title}</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className={`text-xs font-medium ${priorityColor(task.priority)}`}>{task.priority}</span>
                  {task.due_date && <span className="text-xs text-gray-600">{new Date(task.due_date).toLocaleDateString()}</span>}
                </div>
              </div>
            ))}
          </motion.div>
        )}

        {tab === 'logs' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-2">
            {logs.length === 0 ? <div className="card text-center py-12"><p className="text-gray-500 text-sm">No activity logs</p></div>
            : logs.map(log => (
              <div key={log.id} className="card flex items-start gap-3">
                <Activity className="h-4 w-4 text-blue-400 mt-0.5 flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-gray-200">{log.action}</p>
                  {log.details && <p className="text-xs text-gray-500 mt-0.5">{log.details}</p>}
                </div>
                <span className="text-xs text-gray-600 flex-shrink-0">
                  {new Date(log.created_at).toLocaleString(undefined, { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
            ))}
          </motion.div>
        )}

        {tab === 'config' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="card">
            <h3 className="text-sm font-semibold text-white mb-4">Agent Configuration</h3>
            <pre className="text-xs text-gray-400 bg-white/[0.02] rounded-lg p-4 overflow-auto">
              {JSON.stringify(agent.config || {}, null, 2)}
            </pre>
          </motion.div>
        )}
      </div>
    </PageTransition>
  )
}

export default AgentDetail
