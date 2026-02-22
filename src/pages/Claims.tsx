import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Search, X, ChevronDown, TrendingUp, AlertTriangle } from 'lucide-react'
import { fetchBills, fetchEsicPipeline, getStagesSummary, Bill, EsicExtraction } from '../lib/cfo-api'

const STATUS_BADGE: Record<string, string> = {
  DRAFT: 'bg-gray-500/10 text-gray-400 border-gray-500/20',
  PENDING: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
  PARTIAL: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
  PAID: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
  APPROVED: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
  DENIED: 'bg-red-500/10 text-red-400 border-red-500/20',
}

const formatINR = (n: number) => '₹' + Number(n).toLocaleString('en-IN')
const CORPORATE_TYPES = ['', 'ESIC', 'CGHS', 'ECHS', 'private', 'ayushman']
const STATUSES = ['', 'DRAFT', 'PENDING', 'PARTIAL', 'PAID', 'APPROVED', 'DENIED']

const Claims = () => {
  const [bills, setBills] = useState<Bill[]>([])
  const [esic, setEsic] = useState<EsicExtraction | null>(null)
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [corpFilter, setCorpFilter] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [selected, setSelected] = useState<Bill | null>(null)
  const [showPipeline, setShowPipeline] = useState(true)

  const load = () => {
    setLoading(true)
    Promise.all([
      fetchBills({ status: statusFilter || undefined, limit: 200 }),
      fetchEsicPipeline(),
    ])
      .then(([b, e]) => { setBills(b); setEsic(e) })
      .catch(console.error)
      .finally(() => setLoading(false))
  }

  useEffect(() => { load() }, [statusFilter])

  const filtered = bills.filter(b => {
    if (corpFilter && b.patient_corporate?.toLowerCase() !== corpFilter.toLowerCase()) return false
    if (search) {
      const s = search.toLowerCase()
      return (b.patient_name?.toLowerCase().includes(s) || b.claim_id?.toLowerCase().includes(s) || b.bill_no?.toLowerCase().includes(s))
    }
    return true
  })

  const stagesSummary = esic ? getStagesSummary(esic.stage_data) : []

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Claims & Bills</h1>
          <p className="text-sm text-gray-400">{bills.length} bills loaded · ESIC: {esic?.total_claims.counts || 0} claims in pipeline</p>
        </div>
        <button onClick={() => setShowPipeline(!showPipeline)}
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-sm font-medium hover:bg-emerald-500/20 transition-colors">
          <TrendingUp className="w-4 h-4" /> {showPipeline ? 'Hide' : 'Show'} ESIC Pipeline
        </button>
      </div>

      {/* ESIC Pipeline */}
      <AnimatePresence>
        {showPipeline && esic && stagesSummary.length > 0 && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}
            className="rounded-xl bg-white/[0.03] border border-white/[0.06] p-6 overflow-hidden">
            <div className="flex items-center gap-2 mb-4">
              <TrendingUp className="w-4 h-4 text-emerald-400" />
              <h3 className="text-sm font-semibold text-gray-300">ESIC Pipeline — {esic.total_claims.counts} claims ({esic.total_claims.inPatient} IP, {esic.total_claims.opd} OPD)</h3>
            </div>
            {/* Pipeline flow */}
            <div className="flex gap-2 overflow-x-auto pb-2">
              {stagesSummary.map((s, i) => (
                <div key={i} className="flex-shrink-0 w-48 p-3 rounded-lg bg-white/[0.02] border border-white/[0.04]">
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-xs text-gray-300 font-medium truncate" title={s.stage}>{s.stage}</p>
                    <span className="text-sm font-bold text-emerald-400 ml-1">{s.total}</span>
                  </div>
                  <div className="space-y-1">
                    {s.statuses.slice(0, 4).map((st, j) => (
                      <div key={j} className="flex justify-between text-[10px]">
                        <span className={`truncate mr-1 ${st.isHighlighted ? 'text-amber-400' : 'text-gray-500'}`}>{st.status}</span>
                        <span className="text-gray-400 flex-shrink-0">{st.counts}</span>
                      </div>
                    ))}
                    {s.statuses.length > 4 && <p className="text-[9px] text-gray-600">+{s.statuses.length - 4} more</p>}
                  </div>
                  {s.highlighted.length > 0 && (
                    <div className="mt-1 flex items-center gap-1">
                      <AlertTriangle className="w-2.5 h-2.5 text-amber-400" />
                      <span className="text-[9px] text-amber-400">{s.highlighted.length} flagged</span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Filters */}
      <div className="flex flex-wrap gap-3">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search patient, claim ID, bill #..."
            className="w-full pl-10 pr-4 py-2 rounded-lg bg-white/[0.03] border border-white/[0.06] text-white text-sm placeholder-gray-500 focus:outline-none focus:border-emerald-500/50" />
        </div>
        <div className="relative">
          <select value={corpFilter} onChange={e => setCorpFilter(e.target.value)}
            className="appearance-none px-4 py-2 pr-8 rounded-lg bg-white/[0.03] border border-white/[0.06] text-gray-300 text-sm focus:outline-none">
            <option value="">All Corporate</option>
            {CORPORATE_TYPES.filter(Boolean).map(p => <option key={p} value={p}>{p.toUpperCase()}</option>)}
          </select>
          <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 pointer-events-none" />
        </div>
        <div className="relative">
          <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)}
            className="appearance-none px-4 py-2 pr-8 rounded-lg bg-white/[0.03] border border-white/[0.06] text-gray-300 text-sm focus:outline-none">
            <option value="">All Statuses</option>
            {STATUSES.filter(Boolean).map(s => <option key={s} value={s}>{s}</option>)}
          </select>
          <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 pointer-events-none" />
        </div>
      </div>

      {/* Table */}
      {loading ? (
        <div className="flex justify-center py-12"><div className="w-6 h-6 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin" /></div>
      ) : (
        <div className="rounded-xl border border-white/[0.06] overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-white/[0.06] bg-white/[0.02]">
                  {['Patient', 'UHID', 'Bill #', 'Claim ID', 'Corporate', 'Amount', 'Status', 'Date'].map(h => (
                    <th key={h} className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-white/[0.04]">
                {filtered.map(b => (
                  <tr key={b.id} onClick={() => setSelected(b)} className="hover:bg-white/[0.02] cursor-pointer transition-colors">
                    <td className="px-4 py-3 text-white font-medium truncate max-w-[200px]">{b.patient_name}</td>
                    <td className="px-4 py-3 text-gray-400 font-mono text-xs">{b.patient_uhid}</td>
                    <td className="px-4 py-3 text-gray-400 font-mono text-xs">{b.bill_no}</td>
                    <td className="px-4 py-3 text-gray-400 font-mono text-xs">{b.claim_id}</td>
                    <td className="px-4 py-3"><span className="text-xs text-blue-400">{(b.patient_corporate || b.category || '').toUpperCase()}</span></td>
                    <td className="px-4 py-3 text-white">{formatINR(b.total_amount)}</td>
                    <td className="px-4 py-3"><span className={`px-2 py-0.5 rounded-full text-xs border ${STATUS_BADGE[b.status] || STATUS_BADGE.DRAFT}`}>{b.status}</span></td>
                    <td className="px-4 py-3 text-gray-400 text-xs">{b.date || '—'}</td>
                  </tr>
                ))}
                {filtered.length === 0 && (
                  <tr><td colSpan={8} className="px-4 py-8 text-center text-gray-500">No bills found</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Detail Drawer */}
      <AnimatePresence>
        {selected && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/60 z-40" onClick={() => setSelected(null)} />
            <motion.div initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }} transition={{ type: 'spring', damping: 30, stiffness: 300 }}
              className="fixed right-0 top-0 bottom-0 w-full max-w-lg z-50 bg-gray-950 border-l border-white/[0.06] overflow-y-auto p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-bold text-white">{selected.patient_name}</h2>
                <button onClick={() => setSelected(null)} className="text-gray-400 hover:text-white"><X className="w-5 h-5" /></button>
              </div>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  {[
                    ['Bill #', selected.bill_no],
                    ['Claim ID', selected.claim_id],
                    ['UHID', selected.patient_uhid],
                    ['Corporate', (selected.patient_corporate || '').toUpperCase()],
                    ['Category', selected.category],
                    ['Amount', formatINR(selected.total_amount)],
                    ['Status', selected.status],
                    ['Date', selected.date || '—'],
                  ].map(([l, v]) => (
                    <div key={l as string}>
                      <p className="text-xs text-gray-500">{l}</p>
                      <p className="text-sm text-white font-medium">{v}</p>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  )
}

export default Claims
