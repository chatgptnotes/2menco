import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts'
import { TrendingUp, AlertTriangle, IndianRupee, Clock, CheckCircle2, FileText, Users } from 'lucide-react'
import { fetchBills, fetchBillsSummary, fetchBillsCount, fetchEsicPipeline, fetchFollowUpTasks, getStagesSummary, Bill, EsicExtraction } from '../lib/cfo-api'

const formatINR = (n: number) => '₹' + (n >= 10000000 ? (n / 10000000).toFixed(2) + 'Cr' : n >= 100000 ? (n / 100000).toFixed(1) + 'L' : n.toLocaleString('en-IN'))

const CircularProgress = ({ value, max, label }: { value: number; max: number; label: string }) => {
  const pct = max > 0 ? Math.min((value / max) * 100, 100) : 0
  const r = 70, c = 2 * Math.PI * r
  return (
    <div className="flex flex-col items-center">
      <svg width="180" height="180" className="-rotate-90">
        <circle cx="90" cy="90" r={r} fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="12" />
        <motion.circle cx="90" cy="90" r={r} fill="none" stroke="#10B981" strokeWidth="12" strokeLinecap="round"
          strokeDasharray={c} initial={{ strokeDashoffset: c }} animate={{ strokeDashoffset: c - (c * pct / 100) }}
          transition={{ duration: 1.5, ease: 'easeOut' }} />
      </svg>
      <div className="absolute mt-12 text-center">
        <p className="text-3xl font-bold text-white">{value.toLocaleString()}</p>
        <p className="text-xs text-gray-400">of {max.toLocaleString()}</p>
        <p className="text-sm text-emerald-400 font-semibold mt-1">{pct.toFixed(1)}%</p>
      </div>
      <p className="text-sm text-gray-400 mt-2">{label}</p>
    </div>
  )
}

const STAGE_COLORS = ['#3B82F6', '#8B5CF6', '#F59E0B', '#EC4899', '#10B981', '#EF4444', '#06B6D4', '#F97316', '#84CC16', '#A855F7', '#14B8A6', '#E11D48', '#6366F1', '#22D3EE', '#FB923C', '#4ADE80']

const CFO = () => {
  const [esic, setEsic] = useState<EsicExtraction | null>(null)
  const [recentBills, setRecentBills] = useState<Bill[]>([])
  const [, setSummary] = useState<any>(null)
  const [billsCount, setBillsCount] = useState(0)
  const [tasks, setTasks] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([
      fetchEsicPipeline(),
      fetchBills({ limit: 10 }),
      fetchBillsSummary(),
      fetchBillsCount(),
      fetchFollowUpTasks(),
    ])
      .then(([e, b, s, c, t]) => { setEsic(e); setRecentBills(b); setSummary(s); setBillsCount(c); setTasks(t) })
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [])

  if (loading) return <div className="flex items-center justify-center h-64"><div className="w-8 h-8 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin" /></div>

  const stagesSummary = esic ? getStagesSummary(esic.stage_data) : []
  const barData = stagesSummary.map(s => ({ name: s.stage.length > 20 ? s.stage.slice(0, 18) + '…' : s.stage, count: s.total, fullName: s.stage }))

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">CFO Dashboard</h1>
          <p className="text-sm text-gray-400">Hope Multispeciality Hospital — Revenue & Claims</p>
        </div>
        <span className="px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 text-xs font-medium border border-emerald-500/20">Live Data</span>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Total Bills', value: billsCount.toLocaleString(), icon: FileText, color: 'text-blue-400' },
          { label: 'ESIC Claims', value: esic ? esic.total_claims.counts.toLocaleString() : '—', icon: CheckCircle2, color: 'text-emerald-400' },
          { label: 'Inpatient Claims', value: esic ? esic.total_claims.inPatient.toLocaleString() : '—', icon: IndianRupee, color: 'text-violet-400' },
          { label: 'OPD Claims', value: esic ? esic.total_claims.opd.toLocaleString() : '—', icon: Users, color: 'text-amber-400' },
        ].map((s, i) => (
          <motion.div key={i} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}
            className="rounded-xl bg-white/[0.03] border border-white/[0.06] p-4">
            <div className="flex items-center gap-2 mb-2">
              <s.icon className={`w-4 h-4 ${s.color}`} />
              <span className="text-xs text-gray-400">{s.label}</span>
            </div>
            <p className="text-xl font-bold text-white">{s.value}</p>
          </motion.div>
        ))}
      </div>

      {/* Main content */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* ESIC Pipeline Progress */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}
          className="rounded-xl bg-white/[0.03] border border-white/[0.06] p-6 flex flex-col items-center justify-center relative">
          <h3 className="text-sm font-semibold text-gray-300 mb-4">ESIC Claims Pipeline</h3>
          {esic && (
            <CircularProgress
              value={esic.total_claims.counts}
              max={2000}
              label="Total ESIC Claims"
            />
          )}
          <div className="mt-4 flex gap-4 text-xs">
            <span className="text-blue-400">IP: {esic?.total_claims.inPatient || 0}</span>
            <span className="text-amber-400">OPD: {esic?.total_claims.opd || 0}</span>
          </div>
        </motion.div>

        {/* Claims by Stage */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}
          className="rounded-xl bg-white/[0.03] border border-white/[0.06] p-6 lg:col-span-2">
          <h3 className="text-sm font-semibold text-gray-300 mb-4">Claims by Pipeline Stage</h3>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={barData}>
              <XAxis dataKey="name" tick={{ fill: '#9CA3AF', fontSize: 9 }} angle={-35} textAnchor="end" height={80} />
              <YAxis tick={{ fill: '#9CA3AF', fontSize: 11 }} allowDecimals={false} />
              <Tooltip
                contentStyle={{ background: '#1F2937', border: 'none', borderRadius: 8, color: '#fff' }}
                labelFormatter={(_, payload) => payload?.[0]?.payload?.fullName || ''}
              />
              <Bar dataKey="count" radius={[4, 4, 0, 0]}>
                {barData.map((_, i) => (
                  <motion.rect key={i} fill={STAGE_COLORS[i % STAGE_COLORS.length]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </motion.div>
      </div>

      {/* ESIC Stage Details */}
      {stagesSummary.length > 0 && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}
          className="rounded-xl bg-white/[0.03] border border-white/[0.06] p-6">
          <h3 className="text-sm font-semibold text-gray-300 mb-4 flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-emerald-400" /> ESIC Pipeline Detail
          </h3>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-3">
            {stagesSummary.map((s, i) => (
              <div key={i} className="p-3 rounded-lg bg-white/[0.02] border border-white/[0.04]">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-sm text-white font-medium truncate">{s.stage}</p>
                  <span className="text-sm font-bold text-emerald-400 ml-2">{s.total}</span>
                </div>
                <div className="space-y-1">
                  {s.statuses.slice(0, 3).map((st, j) => (
                    <div key={j} className="flex justify-between text-xs">
                      <span className={`truncate mr-2 ${st.isHighlighted ? 'text-amber-400' : 'text-gray-400'}`}>{st.status}</span>
                      <span className="text-gray-300 flex-shrink-0">{st.counts} <span className="text-gray-500">(IP:{st.inPatient} OPD:{st.opd})</span></span>
                    </div>
                  ))}
                  {s.statuses.length > 3 && <p className="text-[10px] text-gray-500">+{s.statuses.length - 3} more</p>}
                </div>
                {s.highlighted.length > 0 && (
                  <div className="mt-2 flex items-center gap-1">
                    <AlertTriangle className="w-3 h-3 text-amber-400" />
                    <span className="text-[10px] text-amber-400">{s.highlighted.length} need attention</span>
                  </div>
                )}
              </div>
            ))}
          </div>
        </motion.div>
      )}

      {/* Bottom row */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Recent Bills */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}
          className="rounded-xl bg-white/[0.03] border border-white/[0.06] p-6">
          <div className="flex items-center gap-2 mb-4">
            <FileText className="w-4 h-4 text-blue-400" />
            <h3 className="text-sm font-semibold text-gray-300">Recent Bills</h3>
            <span className="text-xs text-gray-500 ml-auto">{billsCount.toLocaleString()} total</span>
          </div>
          <div className="space-y-2">
            {recentBills.slice(0, 8).map(bill => (
              <div key={bill.id} className="flex items-center justify-between p-2 rounded-lg bg-white/[0.02] hover:bg-white/[0.04] transition-colors">
                <div className="min-w-0 flex-1">
                  <p className="text-sm text-white truncate">{bill.patient_name}</p>
                  <p className="text-[10px] text-gray-500">{bill.bill_no} · {bill.claim_id} · {bill.patient_corporate || bill.category}</p>
                </div>
                <div className="text-right ml-3">
                  <p className="text-sm font-medium text-white">{formatINR(bill.total_amount)}</p>
                  <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-gray-500/10 text-gray-400 border border-gray-500/20">{bill.status}</span>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Follow-up Tasks */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }}
          className="rounded-xl bg-white/[0.03] border border-white/[0.06] p-6">
          <div className="flex items-center gap-2 mb-4">
            <Clock className="w-4 h-4 text-amber-400" />
            <h3 className="text-sm font-semibold text-gray-300">Follow-up Tasks</h3>
          </div>
          <div className="space-y-2">
            {tasks.length === 0 ? (
              <p className="text-sm text-gray-500">No follow-up tasks yet</p>
            ) : tasks.slice(0, 8).map((t: any) => (
              <div key={t.id} className="flex gap-3 p-2 rounded-lg bg-white/[0.02]">
                <div className="w-2 h-2 rounded-full bg-amber-400 mt-1.5 flex-shrink-0" />
                <div className="min-w-0 flex-1">
                  <p className="text-sm text-white truncate">{t.title}</p>
                  <p className="text-xs text-gray-400">{t.follow_ups?.name || ''} · {t.follow_ups?.organization || ''}</p>
                  {t.due_date && <p className="text-[10px] text-gray-500">{new Date(t.due_date).toLocaleDateString()}</p>}
                </div>
                <span className={`text-[10px] px-1.5 py-0.5 rounded-full self-start ${t.status === 'done' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-amber-500/10 text-amber-400'}`}>{t.status}</span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  )
}

export default CFO
