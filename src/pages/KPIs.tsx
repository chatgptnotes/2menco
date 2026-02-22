import { useState, useEffect } from 'react'
import { 
  TrendingUp, TrendingDown, Clock, BarChart3, Download
} from 'lucide-react'
// charts available if needed
import { supabase } from '../lib/supabaseClient'

interface KPI {
  id: string
  name: string
  current_value: number
  target_value: number
  unit: string
  trend: string
  category: string
}

const KPIs = () => {
  const [kpis, setKpis] = useState<KPI[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedCategory, setSelectedCategory] = useState('all')

  useEffect(() => {
    supabase.from('kpis').select('*').then(({ data }) => {
      if (data && data.length > 0) setKpis(data)
      setLoading(false)
    })
  }, [])

  const categories = ['all', ...Array.from(new Set(kpis.map(k => k.category).filter(Boolean)))]
  const filtered = selectedCategory === 'all' ? kpis : kpis.filter(k => k.category === selectedCategory)

  const getStatus = (k: KPI) => {
    const pct = k.target_value > 0 ? (k.current_value / k.target_value) * 100 : 100
    if (pct >= 80) return 'on-track'
    if (pct >= 60) return 'at-risk'
    return 'critical'
  }

  const getStatusColor = (s: string) => {
    switch (s) { case 'on-track': return 'text-success-600 bg-success-50'; case 'at-risk': return 'text-warning-600 bg-warning-50'; default: return 'text-danger-600 bg-danger-50' }
  }

  const getTrendIcon = (t: string) => {
    if (t === 'up') return <TrendingUp className="h-4 w-4 text-success-600" />
    if (t === 'down') return <TrendingDown className="h-4 w-4 text-danger-600" />
    return <Clock className="h-4 w-4 text-gray-600" />
  }

  const getProgressColor = (c: number, t: number) => {
    const p = t > 0 ? (c / t) * 100 : 0
    if (p >= 80) return 'bg-success-500'; if (p >= 60) return 'bg-warning-500'; return 'bg-danger-500'
  }

  if (loading) return <div className="text-center py-12"><p className="text-gray-500">Loading KPIs...</p></div>

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div><h1 className="text-2xl font-bold text-gray-900">KPIs & Metrics</h1>
        <p className="text-gray-600">Track your progress towards 1 million AED in 9 months</p></div>
        <div className="flex items-center space-x-3">
          <button className="btn btn-secondary"><Download className="h-4 w-4 mr-2" />Export</button>
          <button className="btn btn-primary"><BarChart3 className="h-4 w-4 mr-2" />Add KPI</button>
        </div>
      </div>

      {kpis.length > 0 && (
        <div className="card">
          <div className="flex items-center space-x-4">
            <div>
              <label className="label">Category</label>
              <select value={selectedCategory} onChange={(e) => setSelectedCategory(e.target.value)} className="input w-40">
                {categories.map(c => <option key={c} value={c}>{c === 'all' ? 'All KPIs' : c}</option>)}
              </select>
            </div>
          </div>
        </div>
      )}

      {filtered.length === 0 ? (
        <div className="card text-center py-12">
          <p className="text-gray-500">No KPIs found. Run the SQL migration and seed script to populate data.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((kpi) => {
            const status = getStatus(kpi)
            const pct = kpi.target_value > 0 ? Math.round((kpi.current_value / kpi.target_value) * 100) : 0
            return (
              <div key={kpi.id} className="card hover:shadow-lg transition-shadow">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">{kpi.name}</h3>
                    <div className="flex items-center space-x-2 mt-1">
                      <div className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(status)}`}>{status.replace('-', ' ')}</div>
                      {getTrendIcon(kpi.trend)}
                    </div>
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="flex items-end justify-between">
                    <div><p className="text-2xl font-bold text-gray-900">{kpi.current_value.toLocaleString()}</p><p className="text-sm text-gray-500">{kpi.unit}</p></div>
                    <div className="text-right"><p className="text-sm text-gray-500">Target</p><p className="text-lg font-semibold text-gray-700">{kpi.target_value.toLocaleString()}</p></div>
                  </div>
                  <div>
                    <div className="flex items-center justify-between text-sm mb-1"><span className="text-gray-500">Progress</span><span className="font-medium">{pct}%</span></div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className={`h-2 rounded-full ${getProgressColor(kpi.current_value, kpi.target_value)}`} style={{ width: `${Math.min(pct, 100)}%` }} />
                    </div>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}

      <div className="card">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Performance Summary</h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="text-center"><div className="text-2xl font-bold text-success-600">{kpis.filter(k => getStatus(k) === 'on-track').length}</div><div className="text-sm text-gray-500">On Track</div></div>
          <div className="text-center"><div className="text-2xl font-bold text-warning-600">{kpis.filter(k => getStatus(k) === 'at-risk').length}</div><div className="text-sm text-gray-500">At Risk</div></div>
          <div className="text-center"><div className="text-2xl font-bold text-danger-600">{kpis.filter(k => getStatus(k) === 'critical').length}</div><div className="text-sm text-gray-500">Critical</div></div>
          <div className="text-center"><div className="text-2xl font-bold text-primary-600">{kpis.length > 0 ? Math.round(kpis.reduce((s, k) => s + (k.target_value > 0 ? (k.current_value / k.target_value) * 100 : 0), 0) / kpis.length) : 0}%</div><div className="text-sm text-gray-500">Avg Progress</div></div>
        </div>
      </div>
    </div>
  )
}

export default KPIs
