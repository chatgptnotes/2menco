import { useState } from 'react'
import { motion } from 'framer-motion'
import { TrendingUp } from 'lucide-react'
import {
  Line, XAxis, YAxis, Tooltip, ResponsiveContainer,
  BarChart, Bar, AreaChart, Area, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar
} from 'recharts'
import PageTransition from '../components/PageTransition'

const Analytics = () => {
  const [timeRange, setTimeRange] = useState('90d')

  const revenueData = [
    { month: 'Jan', revenue: 50000, target: 100000 },
    { month: 'Feb', revenue: 75000, target: 100000 },
    { month: 'Mar', revenue: 90000, target: 100000 },
    { month: 'Apr', revenue: 120000, target: 100000 },
    { month: 'May', revenue: 150000, target: 100000 },
    { month: 'Jun', revenue: 180000, target: 100000 },
    { month: 'Jul', revenue: 210000, target: 100000 },
    { month: 'Aug', revenue: 240000, target: 100000 },
    { month: 'Sep', revenue: 270000, target: 100000 },
  ]

  const kpiData = [
    { name: 'Revenue', value: 85, target: 100 },
    { name: 'Leads', value: 78, target: 100 },
    { name: 'Conversion', value: 92, target: 100 },
    { name: 'Satisfaction', value: 88, target: 100 },
    { name: 'Efficiency', value: 82, target: 100 },
  ]

  const agentPerformance = [
    { agent: 'CMO', revenue: 180000, leads: 1250 },
    { agent: 'CRO', revenue: 165000, leads: 1100 },
    { agent: 'CFO', revenue: 120000, leads: 800 },
    { agent: 'COO', revenue: 142500, leads: 950 },
    { agent: 'CTO', revenue: 105000, leads: 700 },
    { agent: 'CXO', revenue: 135000, leads: 900 },
  ]

  const funnelData = [
    { stage: 'Awareness', value: 10000 },
    { stage: 'Interest', value: 6000 },
    { stage: 'Consider', value: 3000 },
    { stage: 'Intent', value: 1500 },
    { stage: 'Purchase', value: 375 },
  ]

  const tooltipStyle = {
    contentStyle: { background: 'rgba(0,0,0,0.8)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px' },
    labelStyle: { color: '#fff' },
    itemStyle: { color: '#9ca3af' },
  }

  return (
    <PageTransition>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-white">Analytics</h1>
            <p className="text-sm text-gray-500 mt-1">Business intelligence & performance insights</p>
          </div>
          <div className="flex gap-2">
            <select value={timeRange} onChange={e => setTimeRange(e.target.value)} className="input w-32">
              <option value="30d">30 days</option>
              <option value="90d">90 days</option>
              <option value="6m">6 months</option>
              <option value="1y">1 year</option>
            </select>
          </div>
        </div>

        {/* Key metrics */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {[
            { label: 'Total Revenue', value: 'AED 1,245K', change: '+15.2%', color: 'text-emerald-400' },
            { label: 'Total Leads', value: '9,200', change: '+8.7%', color: 'text-blue-400' },
            { label: 'Conversion', value: '12.5%', change: '+2.1%', color: 'text-violet-400' },
            { label: 'Goal', value: '85.3%', change: 'On track', color: 'text-amber-400' },
          ].map(s => (
            <div key={s.label} className="card">
              <p className={`text-2xl font-bold ${s.color}`}>{s.value}</p>
              <p className="text-xs text-gray-500 mt-1">{s.label}</p>
              <p className="text-xs text-emerald-400 mt-0.5 flex items-center gap-1"><TrendingUp className="h-3 w-3" />{s.change}</p>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Revenue Trend */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="card">
            <h3 className="text-sm font-semibold text-white mb-4">Revenue vs Target</h3>
            <ResponsiveContainer width="100%" height={260}>
              <AreaChart data={revenueData}>
                <defs>
                  <linearGradient id="revG" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#3b82f6" stopOpacity={0.3} />
                    <stop offset="100%" stopColor="#3b82f6" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fill: '#6b7280', fontSize: 11 }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#6b7280', fontSize: 11 }} tickFormatter={(v: number) => `${v/1000}k`} />
                <Tooltip {...tooltipStyle} />
                <Area type="monotone" dataKey="revenue" stroke="#3b82f6" strokeWidth={2} fill="url(#revG)" />
                <Line type="monotone" dataKey="target" stroke="#ef4444" strokeWidth={1.5} strokeDasharray="4 4" dot={false} />
              </AreaChart>
            </ResponsiveContainer>
          </motion.div>

          {/* KPI Radar */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="card">
            <h3 className="text-sm font-semibold text-white mb-4">Performance Radar</h3>
            <ResponsiveContainer width="100%" height={260}>
              <RadarChart data={kpiData}>
                <PolarGrid stroke="rgba(255,255,255,0.06)" />
                <PolarAngleAxis dataKey="name" tick={{ fill: '#9ca3af', fontSize: 11 }} />
                <PolarRadiusAxis angle={90} domain={[0, 100]} tick={{ fill: '#6b7280', fontSize: 10 }} />
                <Radar name="Current" dataKey="value" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.2} />
                <Radar name="Target" dataKey="target" stroke="#ef4444" fill="#ef4444" fillOpacity={0.05} />
              </RadarChart>
            </ResponsiveContainer>
          </motion.div>
        </div>

        {/* Agent Performance */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="card">
          <h3 className="text-sm font-semibold text-white mb-4">Agent Performance</h3>
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={agentPerformance} barSize={20}>
              <XAxis dataKey="agent" axisLine={false} tickLine={false} tick={{ fill: '#9ca3af', fontSize: 11 }} />
              <YAxis axisLine={false} tickLine={false} tick={{ fill: '#6b7280', fontSize: 11 }} />
              <Tooltip {...tooltipStyle} />
              <Bar dataKey="revenue" fill="#3b82f6" radius={[4, 4, 0, 0]} fillOpacity={0.8} name="Revenue (AED)" />
              <Bar dataKey="leads" fill="#8b5cf6" radius={[4, 4, 0, 0]} fillOpacity={0.8} name="Leads" />
            </BarChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Funnel */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="card">
          <h3 className="text-sm font-semibold text-white mb-4">Conversion Funnel</h3>
          <div className="flex items-end justify-between gap-2 h-48">
            {funnelData.map((stage) => {
              const maxVal = funnelData[0].value
              const heightPct = (stage.value / maxVal) * 100
              return (
                <div key={stage.stage} className="flex-1 flex flex-col items-center gap-2">
                  <span className="text-xs text-gray-400">{stage.value.toLocaleString()}</span>
                  <div className="w-full rounded-t-lg bg-gradient-to-t from-blue-600/80 to-violet-500/80" style={{ height: `${heightPct}%`, minHeight: '16px' }} />
                  <span className="text-[10px] text-gray-500">{stage.stage}</span>
                </div>
              )
            })}
          </div>
        </motion.div>

        {/* Insights */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="card border-emerald-500/10">
            <h4 className="text-sm font-medium text-emerald-400 mb-2">🚀 Growth Opportunity</h4>
            <p className="text-xs text-gray-400">Digital CMO is outperforming targets. Consider increasing marketing budget allocation by 20%.</p>
          </div>
          <div className="card border-amber-500/10">
            <h4 className="text-sm font-medium text-amber-400 mb-2">⚠️ Attention Needed</h4>
            <p className="text-xs text-gray-400">Conversion rate from Qualified → Proposal has dropped 3%. Review CRO agent configuration.</p>
          </div>
        </div>
      </div>
    </PageTransition>
  )
}

export default Analytics
