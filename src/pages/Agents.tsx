import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  Users, DollarSign, BarChart3, CheckSquare, FileText, Settings,
  ArrowRight, CheckCircle, Pause, Zap, AlertCircle
} from 'lucide-react'
import { apiAgents, type Agent } from '../lib/api'
import PageTransition from '../components/PageTransition'
import { CardSkeleton } from '../components/LoadingSkeleton'

const iconMap: Record<string, typeof Users> = {
  cmo: Users, cro: DollarSign, cfo: BarChart3, coo: CheckSquare, cto: Settings, cxo: FileText,
}
const colorMap: Record<string, string> = {
  cmo: 'from-blue-500 to-cyan-500', cro: 'from-emerald-500 to-green-500',
  cfo: 'from-violet-500 to-purple-500', coo: 'from-orange-500 to-amber-500',
  cto: 'from-indigo-500 to-blue-500', cxo: 'from-pink-500 to-rose-500',
}

const statusIcon = (s: string) => {
  switch (s) {
    case 'active': case 'working': return <Zap className="h-3 w-3" />
    case 'error': return <AlertCircle className="h-3 w-3" />
    case 'idle': return <Pause className="h-3 w-3" />
    default: return <CheckCircle className="h-3 w-3" />
  }
}
const statusStyle = (s: string) => {
  switch (s) {
    case 'active': case 'working': return 'bg-emerald-500/10 text-emerald-400'
    case 'error': return 'bg-red-500/10 text-red-400'
    default: return 'bg-amber-500/10 text-amber-400'
  }
}

const Agents = () => {
  const [agents, setAgents] = useState<Agent[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    apiAgents.list()
      .then(setAgents)
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  if (loading) return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {[1,2,3,4,5,6].map(i => <CardSkeleton key={i} />)}
    </div>
  )

  const activeCount = agents.filter(a => a.status === 'active' || a.status === 'working').length

  return (
    <PageTransition>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-white">Digital Agents</h1>
          <p className="text-sm text-gray-500 mt-1">Your AI-powered executive team</p>
        </div>

        {/* Summary */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {[
            { label: 'Total Agents', value: agents.length, color: 'text-blue-400' },
            { label: 'Active', value: activeCount, color: 'text-emerald-400' },
            { label: 'Idle', value: agents.length - activeCount, color: 'text-amber-400' },
            { label: 'Tasks Done', value: agents.reduce((s, a) => s + (a.tasks_completed || 0), 0), color: 'text-violet-400' },
          ].map(s => (
            <div key={s.label} className="card text-center">
              <p className={`text-2xl font-bold ${s.color}`}>{s.value}</p>
              <p className="text-xs text-gray-500 mt-1">{s.label}</p>
            </div>
          ))}
        </div>

        {/* Agent Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {agents.map((agent, i) => {
            const Icon = iconMap[agent.role] || Users
            return (
              <motion.div
                key={agent.role}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
              >
                <Link
                  to={`/dashboard/agents/${agent.role}`}
                  className="card-hover block group"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className={`w-11 h-11 rounded-xl bg-gradient-to-br ${colorMap[agent.role] || 'from-gray-500 to-gray-400'} flex items-center justify-center text-white shadow-lg`}>
                        <Icon className="h-5 w-5" />
                      </div>
                      <div>
                        <h3 className="text-sm font-semibold text-white group-hover:text-blue-400 transition-colors">{agent.name}</h3>
                        <p className="text-xs text-gray-500">{agent.title}</p>
                      </div>
                    </div>
                    <ArrowRight className="h-4 w-4 text-gray-700 group-hover:text-gray-400 transition-colors" />
                  </div>

                  <div className="flex items-center gap-2 mb-3">
                    <span className={`px-2 py-0.5 rounded-full text-[11px] font-medium flex items-center gap-1 ${statusStyle(agent.status)}`}>
                      {statusIcon(agent.status)}
                      {agent.status}
                    </span>
                    {agent.tasks_completed > 0 && (
                      <span className="text-[11px] text-gray-600">{agent.tasks_completed} tasks</span>
                    )}
                  </div>

                  <p className="text-xs text-gray-500 line-clamp-2">{agent.description}</p>

                  <div className="flex flex-wrap gap-1 mt-3">
                    {agent.capabilities.slice(0, 3).map(c => (
                      <span key={c} className="text-[10px] px-1.5 py-0.5 rounded bg-white/5 text-gray-500">{c.replace(/_/g, ' ')}</span>
                    ))}
                    {agent.capabilities.length > 3 && (
                      <span className="text-[10px] px-1.5 py-0.5 rounded bg-white/5 text-gray-500">+{agent.capabilities.length - 3}</span>
                    )}
                  </div>
                </Link>
              </motion.div>
            )
          })}
        </div>
      </div>
    </PageTransition>
  )
}

export default Agents
