import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts'
import { TrendingUp, AlertTriangle, IndianRupee, Clock, CheckCircle2, XCircle } from 'lucide-react'
import { fetchClaims, fetchCfoInvoices, fetchRecentFollowups, getClaimsStats, Claim, CfoInvoice } from '../lib/cfo-api'

const PAYER_COLORS: Record<string, string> = { ESIC: '#3B82F6', CGHS: '#8B5CF6', ECHS: '#F59E0B', Private: '#EC4899', Other: '#6B7280' }
const STATUS_COLORS: Record<string, string> = { pending: '#6B7280', submitted: '#3B82F6', under_review: '#F59E0B', approved: '#10B981', partially_approved: '#34D399', denied: '#EF4444', appealed: '#F97316', recovered: '#059669', written_off: '#374151' }

const formatINR = (n: number) => '₹' + (n >= 100000 ? (n / 100000).toFixed(1) + 'L' : n.toLocaleString('en-IN'))

const CircularProgress = ({ value, max, label }: { value: number; max: number; label: string }) => {
  const pct = Math.min((value / max) * 100, 100)
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
        <p className="text-3xl font-bold text-white">{formatINR(value)}</p>
        <p className="text-xs text-gray-400">of {formatINR(max)}</p>
        <p className="text-sm text-emerald-400 font-semibold mt-1">{pct.toFixed(1)}%</p>
      </div>
      <p className="text-sm text-gray-400 mt-2">{label}</p>
    </div>
  )
}

const CFO = () => {
  const [claims, setClaims] = useState<Claim[]>([])
  const [invoices, setInvoices] = useState<CfoInvoice[]>([])
  const [followups, setFollowups] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([fetchClaims(), fetchCfoInvoices(), fetchRecentFollowups(5)])
      .then(([c, i, f]) => { setClaims(c); setInvoices(i); setFollowups(f) })
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [])

  if (loading) return <div className="flex items-center justify-center h-64"><div className="w-8 h-8 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin" /></div>

  const stats = getClaimsStats(claims)
  const pieData = Object.entries(stats.byPayer).map(([name, value]) => ({ name, value }))
  const barData = Object.entries(stats.byStatus).map(([name, count]) => ({ name: name.replace('_', ' '), count }))
  const overdueInvoices = invoices.filter(i => i.status === 'overdue' || (i.status === 'unpaid' && i.due_date && new Date(i.due_date) < new Date()))
  const totalInvOutstanding = invoices.reduce((s, i) => s + (Number(i.amount) - Number(i.paid_amount)), 0)

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">CFO Dashboard</h1>
          <p className="text-sm text-gray-400">ZeroRiskAgent — Healthcare Revenue Recovery</p>
        </div>
        <span className="px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 text-xs font-medium border border-emerald-500/20">Hope Hospital</span>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Total Outstanding', value: formatINR(stats.totalOutstanding), icon: IndianRupee, color: 'text-blue-400' },
          { label: 'Recovered', value: formatINR(stats.totalRecovered), icon: CheckCircle2, color: 'text-emerald-400' },
          { label: 'Claims Denied', value: String(stats.byStatus['denied'] || 0), icon: XCircle, color: 'text-red-400' },
          { label: 'Invoices Outstanding', value: formatINR(totalInvOutstanding), icon: Clock, color: 'text-amber-400' },
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
        {/* Recovery Progress */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}
          className="rounded-xl bg-white/[0.03] border border-white/[0.06] p-6 flex flex-col items-center justify-center relative">
          <h3 className="text-sm font-semibold text-gray-300 mb-4">Recovery Target: ₹1 Crore</h3>
          <CircularProgress value={stats.totalRecovered} max={10000000} label="Total Recovered" />
        </motion.div>

        {/* Pie: by payer */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}
          className="rounded-xl bg-white/[0.03] border border-white/[0.06] p-6">
          <h3 className="text-sm font-semibold text-gray-300 mb-4">Claims by Payer Type</h3>
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie data={pieData} cx="50%" cy="50%" innerRadius={40} outerRadius={70} dataKey="value" label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}>
                {pieData.map((d, i) => <Cell key={i} fill={PAYER_COLORS[d.name] || '#6B7280'} />)}
              </Pie>
              <Tooltip formatter={(v: number) => formatINR(v)} contentStyle={{ background: '#1F2937', border: 'none', borderRadius: 8, color: '#fff' }} />
            </PieChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Bar: by status */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}
          className="rounded-xl bg-white/[0.03] border border-white/[0.06] p-6">
          <h3 className="text-sm font-semibold text-gray-300 mb-4">Claims by Status</h3>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={barData}>
              <XAxis dataKey="name" tick={{ fill: '#9CA3AF', fontSize: 10 }} angle={-30} textAnchor="end" height={60} />
              <YAxis tick={{ fill: '#9CA3AF', fontSize: 11 }} allowDecimals={false} />
              <Tooltip contentStyle={{ background: '#1F2937', border: 'none', borderRadius: 8, color: '#fff' }} />
              <Bar dataKey="count" radius={[4, 4, 0, 0]}>
                {barData.map((d, i) => <Cell key={i} fill={STATUS_COLORS[d.name.replace(' ', '_')] || '#6B7280'} />)}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </motion.div>
      </div>

      {/* Bottom row */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Overdue Invoices */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}
          className="rounded-xl bg-white/[0.03] border border-white/[0.06] p-6">
          <div className="flex items-center gap-2 mb-4">
            <AlertTriangle className="w-4 h-4 text-red-400" />
            <h3 className="text-sm font-semibold text-gray-300">Overdue / Urgent Invoices</h3>
          </div>
          {overdueInvoices.length === 0 ? (
            <p className="text-sm text-gray-500">No overdue invoices 🎉</p>
          ) : (
            <div className="space-y-3">
              {overdueInvoices.map(inv => (
                <div key={inv.id} className="flex items-center justify-between p-3 rounded-lg bg-red-500/5 border border-red-500/10">
                  <div>
                    <p className="text-sm text-white font-medium">{inv.client_name}</p>
                    <p className="text-xs text-gray-400">{inv.invoice_number} · Due {inv.due_date}</p>
                  </div>
                  <span className="text-sm font-bold text-red-400">{formatINR(Number(inv.amount) - Number(inv.paid_amount))}</span>
                </div>
              ))}
            </div>
          )}
        </motion.div>

        {/* Recent Followups */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }}
          className="rounded-xl bg-white/[0.03] border border-white/[0.06] p-6">
          <div className="flex items-center gap-2 mb-4">
            <TrendingUp className="w-4 h-4 text-blue-400" />
            <h3 className="text-sm font-semibold text-gray-300">Recent Follow-ups</h3>
          </div>
          <div className="space-y-3">
            {followups.map((f: any) => (
              <div key={f.id} className="flex gap-3 p-3 rounded-lg bg-white/[0.02]">
                <div className="w-2 h-2 rounded-full bg-blue-400 mt-1.5 flex-shrink-0" />
                <div>
                  <p className="text-sm text-white">{f.action}</p>
                  <p className="text-xs text-gray-400">{f.claims?.patient_name || 'Unknown'} · {f.claims?.claim_number}</p>
                  {f.response && <p className="text-xs text-gray-500 mt-1">↳ {f.response}</p>}
                  <p className="text-[10px] text-gray-600 mt-1">{new Date(f.followup_date).toLocaleDateString()}</p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  )
}

export default CFO
