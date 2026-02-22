import { useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  ArrowLeft, Play, Square, Settings, Activity,
  Users, DollarSign, BarChart3, CheckSquare, FileText
} from 'lucide-react'
import { getAgent, type Agent } from '../lib/agentData'
import { useToast } from '../components/Toast'
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
  const agentData = getAgent(agentType || '')
  const [status, setStatus] = useState(agentData?.status || 'idle')
  const [tab, setTab] = useState<'overview' | 'tasks' | 'logs' | 'config'>('overview')
  const { toast } = useToast()

  if (!agentData) return (
    <div className="text-center py-20">
      <p className="text-gray-500">Agent not found</p>
      <Link to="/dashboard/agents" className="text-blue-400 text-sm mt-2 inline-block">Back to Agents</Link>
    </div>
  )

  const Icon = iconMap[agentData.role] || Users
  const toggleStatus = () => {
    const newStatus = status === 'active' || status === 'working' ? 'idle' : 'active'
    setStatus(newStatus as Agent['status'])
    toast(`Agent ${newStatus === 'active' ? 'started' : 'stopped'}`, newStatus === 'active' ? 'success' : 'warning')
  }

  const tabList = [
    { key: 'overview' as const, label: 'Overview' },
    { key: 'tasks' as const, label: 'Tasks' },
    { key: 'logs' as const, label: 'Activity' },
    { key: 'config' as const, label: 'Configuration' },
  ]

  return (
    <PageTransition>
      <div className="space-y-6">
        <Link to="/dashboard/agents" className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-gray-300 transition-colors">
          <ArrowLeft className="h-4 w-4" /> Back to Agents
        </Link>

        <div className="card">
          <div className="flex flex-col sm:flex-row sm:items-center gap-4">
            <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${colorMap[agentData.role] || 'from-gray-500 to-gray-400'} flex items-center justify-center text-white shadow-lg`}>
              <Icon className="h-7 w-7" />
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-3">
                <h1 className="text-xl font-bold text-white">{agentData.name}</h1>
                <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${status === 'active' || status === 'working' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-amber-500/10 text-amber-400'}`}>
                  {status}
                </span>
              </div>
              <p className="text-sm text-gray-500 mt-0.5">{agentData.title}</p>
            </div>
            <div className="flex gap-2">
              <button onClick={toggleStatus} className={`btn ${status === 'active' || status === 'working' ? 'btn-warning' : 'btn-success'}`}>
                {status === 'active' || status === 'working' ? <><Square className="h-4 w-4 mr-1" /> Stop</> : <><Play className="h-4 w-4 mr-1" /> Start</>}
              </button>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6 pt-6 border-t border-white/[0.06]">
            <div><p className="text-xs text-gray-500">Tasks Completed</p><p className="text-lg font-bold text-white">{agentData.tasks_completed}</p></div>
            <div><p className="text-xs text-gray-500">Capabilities</p><p className="text-lg font-bold text-white">{agentData.capabilities.length}</p></div>
            <div><p className="text-xs text-gray-500">Status</p><p className="text-lg font-bold text-white capitalize">{status}</p></div>
            <div><p className="text-xs text-gray-500">Last Run</p><p className="text-lg font-bold text-white">{agentData.last_run ? new Date(agentData.last_run).toLocaleDateString() : 'Never'}</p></div>
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
              <h3 className="text-sm font-semibold text-white mb-4">Description</h3>
              <p className="text-sm text-gray-400 leading-relaxed">{agentData.description}</p>
              <h3 className="text-sm font-semibold text-white mt-6 mb-3">Capabilities</h3>
              <div className="flex flex-wrap gap-2">
                {agentData.capabilities.map(c => (
                  <span key={c} className="text-xs px-2 py-1 rounded-lg bg-white/5 text-gray-400">{c.replace(/_/g, ' ')}</span>
                ))}
              </div>
            </div>
            <div className="card">
              <h3 className="text-sm font-semibold text-white mb-4">Metrics</h3>
              <div className="space-y-3">
                {Object.entries(agentData.metrics).map(([k, v]) => (
                  <div key={k} className="flex justify-between items-center">
                    <span className="text-sm text-gray-400">{k.replace(/_/g, ' ')}</span>
                    <span className="text-sm font-semibold text-white">{typeof v === 'number' && v > 1000 ? `₹${(v / 100000).toFixed(1)}L` : v}</span>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}

        {tab === 'tasks' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <div className="card text-center py-12">
              <Activity className="h-8 w-8 text-gray-600 mx-auto mb-3" />
              <p className="text-gray-500 text-sm">Tasks will appear here when the agent is connected to the Flask backend.</p>
              <p className="text-gray-600 text-xs mt-1">AgentSDR API integration coming in Phase 2</p>
            </div>
          </motion.div>
        )}

        {tab === 'logs' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <div className="card text-center py-12">
              <Activity className="h-8 w-8 text-gray-600 mx-auto mb-3" />
              <p className="text-gray-500 text-sm">Activity logs will appear here when agents run tasks.</p>
            </div>
          </motion.div>
        )}

        {tab === 'config' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="card">
            <h3 className="text-sm font-semibold text-white mb-4">Agent Configuration</h3>
            <pre className="text-xs text-gray-400 bg-white/[0.02] rounded-lg p-4 overflow-auto">
              {JSON.stringify({ role: agentData.role, name: agentData.name, title: agentData.title, status, capabilities: agentData.capabilities, metrics: agentData.metrics }, null, 2)}
            </pre>
          </motion.div>
        )}
      </div>
    </PageTransition>
  )
}

export default AgentDetail
