import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  ArrowLeft, Play, Settings, Activity, Users, DollarSign, BarChart3,
  CheckSquare, FileText, Zap, Clock
} from 'lucide-react'
import { apiAgents, type Agent, type Task } from '../lib/api'
import PageTransition from '../components/PageTransition'

const iconMap: Record<string, typeof Users> = {
  cmo: Users, cro: DollarSign, cfo: BarChart3, coo: CheckSquare, cto: Settings, cxo: FileText,
}
const colorMap: Record<string, string> = {
  cmo: 'from-blue-500 to-cyan-500', cro: 'from-emerald-500 to-green-500',
  cfo: 'from-violet-500 to-purple-500', coo: 'from-orange-500 to-amber-500',
  cto: 'from-indigo-500 to-blue-500', cxo: 'from-pink-500 to-rose-500',
}

const AgentDetail = () => {
  const { agentType } = useParams<{ agentType: string }>()
  const [agent, setAgent] = useState<Agent | null>(null)
  const [loading, setLoading] = useState(true)
  const [running, setRunning] = useState(false)
  const [tab, setTab] = useState<'overview' | 'tasks' | 'capabilities'>('overview')

  useEffect(() => {
    if (!agentType) return
    apiAgents.get(agentType)
      .then(setAgent)
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [agentType])

  const handleRun = async () => {
    if (!agentType || running) return
    setRunning(true)
    try {
      await apiAgents.run(agentType)
      // Refresh agent data
      const updated = await apiAgents.get(agentType)
      setAgent(updated)
    } catch {}
    setRunning(false)
  }

  if (loading) return (
    <div className="space-y-4 animate-pulse">
      <div className="h-8 bg-white/5 rounded w-48" />
      <div className="h-40 bg-white/5 rounded-xl" />
    </div>
  )

  if (!agent) return (
    <div className="text-center py-20">
      <p className="text-gray-500">Agent not found</p>
      <Link to="/dashboard/agents" className="text-blue-400 text-sm mt-2 inline-block">← Back to Agents</Link>
    </div>
  )

  const Icon = iconMap[agent.role] || Users
  const tasks: Task[] = agent.recent_tasks || []

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
            <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${colorMap[agent.role] || 'from-gray-500 to-gray-400'} flex items-center justify-center text-white shadow-lg`}>
              <Icon className="h-7 w-7" />
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-3">
                <h1 className="text-xl font-bold text-white">{agent.name}</h1>
                <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                  agent.status === 'active' || agent.status === 'working' ? 'bg-emerald-500/10 text-emerald-400' :
                  agent.status === 'error' ? 'bg-red-500/10 text-red-400' : 'bg-amber-500/10 text-amber-400'
                }`}>
                  {agent.status}
                </span>
              </div>
              <p className="text-sm text-gray-500 mt-0.5">{agent.title}</p>
            </div>
            <button onClick={handleRun} disabled={running} className="btn btn-primary flex items-center gap-2">
              {running ? <Clock className="h-4 w-4 animate-spin" /> : <Play className="h-4 w-4" />}
              {running ? 'Running...' : 'Run Task'}
            </button>
          </div>

          <p className="text-sm text-gray-400 mt-4">{agent.description}</p>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6 pt-6 border-t border-white/[0.06]">
            <div><p className="text-xs text-gray-500">Status</p><p className="text-lg font-bold text-white capitalize">{agent.status}</p></div>
            <div><p className="text-xs text-gray-500">Tasks Completed</p><p className="text-lg font-bold text-white">{agent.tasks_completed}</p></div>
            <div><p className="text-xs text-gray-500">Capabilities</p><p className="text-lg font-bold text-white">{agent.capabilities.length}</p></div>
            <div><p className="text-xs text-gray-500">Last Run</p><p className="text-lg font-bold text-white">{agent.last_run ? new Date(agent.last_run).toLocaleDateString() : 'Never'}</p></div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 border-b border-white/[0.06] pb-px">
          {(['overview', 'tasks', 'capabilities'] as const).map(t => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`px-4 py-2 text-sm font-medium rounded-t-lg transition-colors capitalize ${
                tab === t ? 'text-white bg-white/[0.06] border-b-2 border-blue-500' : 'text-gray-500 hover:text-gray-300'
              }`}
            >
              {t === 'tasks' ? `Tasks (${tasks.length})` : t}
            </button>
          ))}
        </div>

        {tab === 'overview' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="card">
              <h3 className="text-sm font-semibold text-white mb-4">Capabilities</h3>
              <div className="flex flex-wrap gap-2">
                {agent.capabilities.map(c => (
                  <span key={c} className="px-3 py-1.5 rounded-lg bg-white/5 text-sm text-gray-300 flex items-center gap-1.5">
                    <Zap className="h-3 w-3 text-blue-400" />
                    {c.replace(/_/g, ' ')}
                  </span>
                ))}
              </div>
            </div>
            <div className="card">
              <h3 className="text-sm font-semibold text-white mb-4">Recent Activity</h3>
              {tasks.length === 0 ? (
                <p className="text-sm text-gray-500">No recent tasks</p>
              ) : (
                <div className="space-y-2">
                  {tasks.slice(0, 5).map(t => (
                    <div key={t.id} className="flex items-center gap-3 text-sm">
                      <Activity className="h-3.5 w-3.5 text-blue-400 flex-shrink-0" />
                      <span className="text-gray-300 truncate flex-1">{t.title}</span>
                      <span className={`px-1.5 py-0.5 rounded text-[11px] ${statusColor(t.status)}`}>{t.status}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        )}

        {tab === 'tasks' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-2">
            {tasks.length === 0 ? (
              <div className="card text-center py-12"><p className="text-gray-500 text-sm">No tasks yet. Click "Run Task" to start.</p></div>
            ) : tasks.map(task => (
              <div key={task.id} className="card-hover flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={`px-2 py-0.5 rounded text-xs font-medium ${statusColor(task.status)}`}>{task.status}</div>
                  <span className="text-sm text-gray-200">{task.title}</span>
                </div>
                <span className="text-xs text-gray-600">{task.priority}</span>
              </div>
            ))}
          </motion.div>
        )}

        {tab === 'capabilities' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {agent.capabilities.map(cap => (
              <div key={cap} className="card">
                <div className="flex items-center gap-2 mb-2">
                  <Zap className="h-4 w-4 text-blue-400" />
                  <h4 className="text-sm font-medium text-white capitalize">{cap.replace(/_/g, ' ')}</h4>
                </div>
                <p className="text-xs text-gray-500">Automated capability powered by AI</p>
              </div>
            ))}
          </motion.div>
        )}
      </div>
    </PageTransition>
  )
}

export default AgentDetail
