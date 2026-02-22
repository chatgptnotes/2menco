import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  Users, DollarSign, BarChart3, CheckSquare, FileText, Settings,
  ArrowRight, CheckCircle, Pause
} from 'lucide-react'
import { supabase } from '../lib/supabaseClient'
import PageTransition from '../components/PageTransition'
import { CardSkeleton } from '../components/LoadingSkeleton'

interface Agent {
  id: string; name: string; type: string; status: string;
  config: Record<string, unknown>; metrics: Record<string, unknown>
}

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

const Agents = () => {
  const [agents, setAgents] = useState<Agent[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    supabase.from('agents').select('*').then(({ data }) => {
      if (data) setAgents(data)
      setLoading(false)
    })
  }, [])

  const perf = (a: Agent) => (a.metrics as { performance?: number })?.performance ?? 85
  const uptime = (a: Agent) => (a.metrics as { uptime?: number })?.uptime ?? 99

  if (loading) return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {[1,2,3,4,5,6].map(i => <CardSkeleton key={i} />)}
    </div>
  )

  return (
    <PageTransition>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-white">Digital Agents</h1>
            <p className="text-sm text-gray-500 mt-1">Your AI-powered executive team</p>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {[
            { label: 'Active', value: agents.filter(a => a.status === 'active').length, color: 'text-emerald-400' },
            { label: 'Inactive', value: agents.filter(a => a.status !== 'active').length, color: 'text-gray-400' },
            { label: 'Avg Performance', value: `${agents.length > 0 ? Math.round(agents.reduce((s, a) => s + perf(a), 0) / agents.length) : 0}%`, color: 'text-blue-400' },
            { label: 'Avg Uptime', value: `${agents.length > 0 ? Math.round(agents.reduce((s, a) => s + uptime(a), 0) / agents.length * 10) / 10 : 0}%`, color: 'text-violet-400' },
          ].map(s => (
            <div key={s.label} className="card text-center">
              <p className={`text-2xl font-bold ${s.color}`}>{s.value}</p>
              <p className="text-xs text-gray-500 mt-1">{s.label}</p>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {agents.map((agent, i) => {
            const Icon = iconMap[agent.type] || Users
            const p = perf(agent)
            return (
              <motion.div
                key={agent.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
              >
                <Link to={`/dashboard/agents/${agent.type}`} className="card-hover block group">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className={`w-11 h-11 rounded-xl bg-gradient-to-br ${colorMap[agent.type] || 'from-gray-500 to-gray-400'} flex items-center justify-center text-white shadow-lg`}>
                        <Icon className="h-5 w-5" />
                      </div>
                      <div>
                        <h3 className="text-sm font-semibold text-white group-hover:text-blue-400 transition-colors">{agent.name}</h3>
                        <p className="text-xs text-gray-500">{roleMap[agent.type] || agent.type}</p>
                      </div>
                    </div>
                    <ArrowRight className="h-4 w-4 text-gray-700 group-hover:text-gray-400 transition-colors" />
                  </div>
                  <div className="flex items-center gap-2 mb-3">
                    <span className={`px-2 py-0.5 rounded-full text-[11px] font-medium flex items-center gap-1 ${
                      agent.status === 'active' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-white/5 text-gray-500'
                    }`}>
                      {agent.status === 'active' ? <CheckCircle className="h-3 w-3" /> : <Pause className="h-3 w-3" />}
                      {agent.status}
                    </span>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-xs">
                      <span className="text-gray-500">Performance</span>
                      <span className={`font-medium ${p >= 90 ? 'text-emerald-400' : p >= 80 ? 'text-amber-400' : 'text-red-400'}`}>{p}%</span>
                    </div>
                    <div className="w-full bg-white/5 rounded-full h-1">
                      <div className={`h-1 rounded-full bg-gradient-to-r ${colorMap[agent.type] || 'from-gray-500 to-gray-400'}`} style={{ width: `${p}%` }} />
                    </div>
                    <div className="flex justify-between text-xs">
                      <span className="text-gray-500">Uptime</span>
                      <span className="text-gray-300 font-medium">{uptime(agent)}%</span>
                    </div>
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
