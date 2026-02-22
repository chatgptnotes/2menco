import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import {
  TrendingUp, TrendingDown, Users, DollarSign, Target, Activity,
  ArrowUpRight, ArrowDownRight, BarChart3
} from 'lucide-react'
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, BarChart, Bar, Cell } from 'recharts'
import { supabase } from '../lib/supabaseClient'
import AnimatedCounter from '../components/AnimatedCounter'
import { DashboardSkeleton } from '../components/LoadingSkeleton'
import PageTransition from '../components/PageTransition'

interface AgentRow { id: string; name: string; type: string; status: string; metrics: Record<string, unknown> }
interface KpiRow { id: string; name: string; current_value: number; target_value: number; trend: string; category: string }
interface ActivityRow { id: string; action: string; details: string; created_at: string; agent_type?: string }

const agentColors: Record<string, string> = {
  cmo: 'from-blue-500 to-cyan-500',
  cro: 'from-emerald-500 to-green-500',
  cfo: 'from-violet-500 to-purple-500',
  coo: 'from-orange-500 to-amber-500',
  cto: 'from-indigo-500 to-blue-500',
  cxo: 'from-pink-500 to-rose-500',
}

const agentDotColors: Record<string, string> = {
  cmo: 'bg-blue-400', cro: 'bg-emerald-400', cfo: 'bg-violet-400',
  coo: 'bg-orange-400', cto: 'bg-indigo-400', cxo: 'bg-pink-400',
}

const Dashboard = () => {
  const [agents, setAgents] = useState<AgentRow[]>([])
  const [kpis, setKpis] = useState<KpiRow[]>([])
  const [activities, setActivities] = useState<ActivityRow[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const load = async () => {
      const [a, k, act] = await Promise.all([
        supabase.from('agents').select('*'),
        supabase.from('kpis').select('*'),
        supabase.from('activity_log').select('*').order('created_at', { ascending: false }).limit(8),
      ])
      if (a.data) setAgents(a.data)
      if (k.data) setKpis(k.data)
      if (act.data) setActivities(act.data)
      setLoading(false)
    }
    load()
  }, [])

  if (loading) return <DashboardSkeleton />

  const activeAgents = agents.filter(a => a.status === 'active').length
  const totalRevenue = kpis.find(k => k.name?.toLowerCase().includes('revenue'))?.current_value || 575000
  const totalLeads = kpis.find(k => k.name?.toLowerCase().includes('lead') || k.name?.toLowerCase().includes('pipeline'))?.current_value || 142

  const revenueData = [
    { month: 'Jan', revenue: 50000 }, { month: 'Feb', revenue: 75000 },
    { month: 'Mar', revenue: 90000 }, { month: 'Apr', revenue: 120000 },
    { month: 'May', revenue: 150000 }, { month: 'Jun', revenue: 180000 },
    { month: 'Jul', revenue: 210000 }, { month: 'Aug', revenue: 240000 },
  ]

  const funnelData = [
    { stage: 'New', count: 42, color: '#3b82f6' },
    { stage: 'Contacted', count: 28, color: '#8b5cf6' },
    { stage: 'Qualified', count: 18, color: '#f59e0b' },
    { stage: 'Proposal', count: 12, color: '#10b981' },
    { stage: 'Won', count: 7, color: '#22c55e' },
  ]

  const stats = [
    {
      label: 'Total Revenue',
      value: totalRevenue,
      prefix: 'AED ',
      change: '+15.2%',
      up: true,
      icon: DollarSign,
      gradient: 'from-emerald-500/10 to-emerald-500/5',
      iconColor: 'text-emerald-400',
    },
    {
      label: 'Active Agents',
      value: activeAgents,
      suffix: `/${agents.length || 6}`,
      change: 'All operational',
      up: true,
      icon: Users,
      gradient: 'from-blue-500/10 to-blue-500/5',
      iconColor: 'text-blue-400',
    },
    {
      label: 'Pipeline Leads',
      value: totalLeads,
      change: '+8.7%',
      up: true,
      icon: Target,
      gradient: 'from-violet-500/10 to-violet-500/5',
      iconColor: 'text-violet-400',
    },
    {
      label: 'Goal Progress',
      value: Math.round((totalRevenue / 1000000) * 100 * 10) / 10,
      suffix: '%',
      change: 'Target: 1M AED',
      up: true,
      icon: TrendingUp,
      gradient: 'from-amber-500/10 to-amber-500/5',
      iconColor: 'text-amber-400',
    },
  ]

  const customTooltip = ({ active, payload }: any) => {
    if (!active || !payload?.length) return null
    return (
      <div className="glass rounded-lg px-3 py-2">
        <p className="text-sm font-medium text-white">AED {payload[0].value?.toLocaleString()}</p>
      </div>
    )
  }

  return (
    <PageTransition>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold text-white">Command Center</h1>
          <p className="text-gray-500 text-sm mt-1">Real-time overview of your digital empire</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="card-hover"
            >
              <div className="flex items-start justify-between">
                <div className={`p-2 rounded-lg bg-gradient-to-br ${stat.gradient}`}>
                  <stat.icon className={`h-4 w-4 ${stat.iconColor}`} />
                </div>
                <span className={`flex items-center gap-0.5 text-xs font-medium ${stat.up ? 'text-emerald-400' : 'text-red-400'}`}>
                  {stat.up ? <ArrowUpRight className="h-3 w-3" /> : <ArrowDownRight className="h-3 w-3" />}
                  {stat.change}
                </span>
              </div>
              <div className="mt-3">
                <p className="text-2xl font-bold text-white">
                  <AnimatedCounter value={stat.value} prefix={stat.prefix} suffix={stat.suffix} />
                </p>
                <p className="text-xs text-gray-500 mt-1">{stat.label}</p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Revenue Chart */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="card lg:col-span-2"
          >
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-sm font-semibold text-white">Revenue Growth</h3>
                <p className="text-xs text-gray-500 mt-0.5">Monthly revenue trend</p>
              </div>
              <div className="flex items-center gap-1 text-xs text-emerald-400 bg-emerald-500/10 px-2 py-1 rounded-md">
                <TrendingUp className="h-3 w-3" /> +32%
              </div>
            </div>
            <ResponsiveContainer width="100%" height={240}>
              <AreaChart data={revenueData}>
                <defs>
                  <linearGradient id="revGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#3b82f6" stopOpacity={0.3} />
                    <stop offset="100%" stopColor="#3b82f6" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fill: '#6b7280', fontSize: 11 }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#6b7280', fontSize: 11 }} tickFormatter={(v: number) => `${v/1000}k`} />
                <Tooltip content={customTooltip} />
                <Area type="monotone" dataKey="revenue" stroke="#3b82f6" strokeWidth={2} fill="url(#revGrad)" />
              </AreaChart>
            </ResponsiveContainer>
          </motion.div>

          {/* Lead Funnel */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="card"
          >
            <h3 className="text-sm font-semibold text-white mb-1">Lead Funnel</h3>
            <p className="text-xs text-gray-500 mb-4">Conversion pipeline</p>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={funnelData} layout="vertical" barSize={20}>
                <XAxis type="number" axisLine={false} tickLine={false} tick={{ fill: '#6b7280', fontSize: 11 }} />
                <YAxis type="category" dataKey="stage" axisLine={false} tickLine={false} tick={{ fill: '#9ca3af', fontSize: 11 }} width={70} />
                <Bar dataKey="count" radius={[0, 6, 6, 0]}>
                  {funnelData.map((entry, index) => (
                    <Cell key={index} fill={entry.color} fillOpacity={0.8} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </motion.div>
        </div>

        {/* Agents + Activity */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Agent Cards */}
          <div className="lg:col-span-2">
            <h3 className="text-sm font-semibold text-white mb-3">Agent Fleet</h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {agents.map((agent, i) => (
                <motion.div
                  key={agent.id}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.3 + i * 0.05 }}
                  className="card-hover cursor-pointer group"
                >
                  <div className="flex items-center gap-2 mb-2">
                    <div className={`w-2 h-2 rounded-full ${agent.status === 'active' ? agentDotColors[agent.type] || 'bg-gray-400' : 'bg-gray-600'}`} />
                    <span className="text-xs text-gray-500 uppercase tracking-wider font-medium">{agent.type}</span>
                  </div>
                  <p className="text-sm font-semibold text-white truncate">{agent.name}</p>
                  <div className="mt-2 flex items-center justify-between">
                    <span className={`text-xs ${agent.status === 'active' ? 'text-emerald-400' : 'text-gray-500'}`}>
                      {agent.status}
                    </span>
                    <span className="text-xs text-gray-600">
                      {(agent.metrics as { performance?: number })?.performance || 85}%
                    </span>
                  </div>
                  <div className="mt-1.5 w-full bg-white/5 rounded-full h-1">
                    <div
                      className={`h-1 rounded-full bg-gradient-to-r ${agentColors[agent.type] || 'from-gray-500 to-gray-400'}`}
                      style={{ width: `${(agent.metrics as { performance?: number })?.performance || 85}%` }}
                    />
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Activity Feed */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="card"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-semibold text-white">Recent Activity</h3>
              <Activity className="h-4 w-4 text-gray-600" />
            </div>
            {activities.length === 0 ? (
              <p className="text-xs text-gray-600">No recent activity</p>
            ) : (
              <div className="space-y-3">
                {activities.slice(0, 6).map((act) => (
                  <div key={act.id} className="flex items-start gap-3">
                    <div className="mt-1 w-1.5 h-1.5 rounded-full bg-blue-400 flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="text-xs text-gray-300 truncate">{act.action}</p>
                      {act.details && <p className="text-[11px] text-gray-600 truncate mt-0.5">{act.details}</p>}
                      <p className="text-[10px] text-gray-700 mt-0.5">
                        {new Date(act.created_at).toLocaleString(undefined, { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </motion.div>
        </div>

        {/* KPI summary bar */}
        {kpis.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="card"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-semibold text-white">KPI Overview</h3>
              <BarChart3 className="h-4 w-4 text-gray-600" />
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
              {kpis.slice(0, 6).map((kpi) => {
                const pct = kpi.target_value > 0 ? Math.round((kpi.current_value / kpi.target_value) * 100) : 0
                return (
                  <div key={kpi.id}>
                    <p className="text-xs text-gray-500 truncate mb-1">{kpi.name}</p>
                    <div className="flex items-end gap-1">
                      <span className="text-lg font-bold text-white">{pct}%</span>
                      {kpi.trend === 'up' && <TrendingUp className="h-3 w-3 text-emerald-400 mb-1" />}
                      {kpi.trend === 'down' && <TrendingDown className="h-3 w-3 text-red-400 mb-1" />}
                    </div>
                    <div className="mt-1 w-full bg-white/5 rounded-full h-1">
                      <div
                        className={`h-1 rounded-full ${pct >= 80 ? 'bg-emerald-500' : pct >= 60 ? 'bg-amber-500' : 'bg-red-500'}`}
                        style={{ width: `${Math.min(pct, 100)}%` }}
                      />
                    </div>
                  </div>
                )
              })}
            </div>
          </motion.div>
        )}
      </div>
    </PageTransition>
  )
}

export default Dashboard
