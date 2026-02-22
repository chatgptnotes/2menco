import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { TrendingUp, TrendingDown, Minus } from 'lucide-react'
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts'
import { supabase } from '../lib/supabaseClient'
import PageTransition from '../components/PageTransition'

interface KPI {
  id: string; name: string; current_value: number; target_value: number;
  unit: string; trend: string; category: string
}

const categoryColors: Record<string, string> = {
  finance: '#10b981', sales: '#3b82f6', marketing: '#8b5cf6',
  ops: '#f59e0b', tech: '#6366f1', customer: '#ec4899',
}

const KPIs = () => {
  const [kpis, setKpis] = useState<KPI[]>([])
  const [loading, setLoading] = useState(true)
  const [cat, setCat] = useState('all')

  useEffect(() => {
    supabase.from('kpis').select('*').then(({ data }) => {
      if (data) setKpis(data)
      setLoading(false)
    })
  }, [])

  const categories = ['all', ...Array.from(new Set(kpis.map(k => k.category).filter(Boolean)))]
  const filtered = cat === 'all' ? kpis : kpis.filter(k => k.category === cat)

  const pct = (k: KPI) => k.target_value > 0 ? Math.round((k.current_value / k.target_value) * 100) : 0
  const statusColor = (p: number) => p >= 80 ? 'text-emerald-400' : p >= 60 ? 'text-amber-400' : 'text-red-400'
  const barColor = (p: number) => p >= 80 ? 'bg-emerald-500' : p >= 60 ? 'bg-amber-500' : 'bg-red-500'

  const chartData = filtered.map(k => ({
    name: k.name?.length > 15 ? k.name.slice(0, 15) + '…' : k.name,
    progress: pct(k),
    color: categoryColors[k.category] || '#6b7280',
  }))

  if (loading) return <div className="space-y-4 animate-pulse"><div className="h-8 bg-white/5 rounded w-48" /><div className="h-96 bg-white/5 rounded-xl" /></div>

  return (
    <PageTransition>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-white">KPIs & Metrics</h1>
            <p className="text-sm text-gray-500 mt-1">Track progress towards 1M AED</p>
          </div>
          <div className="flex gap-2">
            <select value={cat} onChange={e => setCat(e.target.value)} className="input w-36">
              {categories.map(c => <option key={c} value={c}>{c === 'all' ? 'All Categories' : c}</option>)}
            </select>
          </div>
        </div>

        {/* Summary */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {[
            { label: 'On Track', value: kpis.filter(k => pct(k) >= 80).length, color: 'text-emerald-400' },
            { label: 'At Risk', value: kpis.filter(k => pct(k) >= 60 && pct(k) < 80).length, color: 'text-amber-400' },
            { label: 'Critical', value: kpis.filter(k => pct(k) < 60).length, color: 'text-red-400' },
            { label: 'Avg Progress', value: `${kpis.length > 0 ? Math.round(kpis.reduce((s, k) => s + pct(k), 0) / kpis.length) : 0}%`, color: 'text-blue-400' },
          ].map(s => (
            <div key={s.label} className="card text-center">
              <p className={`text-2xl font-bold ${s.color}`}>{s.value}</p>
              <p className="text-xs text-gray-500 mt-1">{s.label}</p>
            </div>
          ))}
        </div>

        {/* Chart */}
        {filtered.length > 0 && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="card">
            <h3 className="text-sm font-semibold text-white mb-4">Progress Overview</h3>
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={chartData} barSize={24}>
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#6b7280', fontSize: 10 }} />
                <YAxis domain={[0, 100]} axisLine={false} tickLine={false} tick={{ fill: '#6b7280', fontSize: 11 }} tickFormatter={(v: number) => `${v}%`} />
                <Tooltip
                  contentStyle={{ background: 'rgba(0,0,0,0.8)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px' }}
                  labelStyle={{ color: '#fff' }}
                  itemStyle={{ color: '#9ca3af' }}
                />
                <Bar dataKey="progress" radius={[6, 6, 0, 0]}>
                  {chartData.map((entry, i) => <Cell key={i} fill={entry.color} fillOpacity={0.8} />)}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </motion.div>
        )}

        {/* KPI Cards */}
        {filtered.length === 0 ? (
          <div className="card text-center py-12"><p className="text-gray-500 text-sm">No KPIs found</p></div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filtered.map((kpi, i) => {
              const p = pct(kpi)
              return (
                <motion.div key={kpi.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.03 }} className="card-hover">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h3 className="text-sm font-semibold text-white">{kpi.name}</h3>
                      <span className="text-xs text-gray-600">{kpi.category}</span>
                    </div>
                    {kpi.trend === 'up' && <TrendingUp className="h-4 w-4 text-emerald-400" />}
                    {kpi.trend === 'down' && <TrendingDown className="h-4 w-4 text-red-400" />}
                    {kpi.trend === 'stable' && <Minus className="h-4 w-4 text-gray-500" />}
                  </div>
                  <div className="flex items-end justify-between mb-3">
                    <div>
                      <p className="text-2xl font-bold text-white">{kpi.current_value.toLocaleString()}</p>
                      <p className="text-xs text-gray-500">{kpi.unit}</p>
                    </div>
                    <div className="text-right">
                      <p className={`text-lg font-bold ${statusColor(p)}`}>{p}%</p>
                      <p className="text-xs text-gray-600">of {kpi.target_value.toLocaleString()}</p>
                    </div>
                  </div>
                  <div className="w-full bg-white/5 rounded-full h-1.5">
                    <div className={`h-1.5 rounded-full ${barColor(p)}`} style={{ width: `${Math.min(p, 100)}%` }} />
                  </div>
                </motion.div>
              )
            })}
          </div>
        )}
      </div>
    </PageTransition>
  )
}

export default KPIs
