import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { ChevronDown, Search } from 'lucide-react'
import { fetchBills, fetchBillsSummary, Bill } from '../lib/cfo-api'

const formatINR = (n: number) => '₹' + Number(n).toLocaleString('en-IN')
const STATUS_STYLE: Record<string, string> = {
  DRAFT: 'bg-gray-500/10 text-gray-400 border-gray-500/20',
  PENDING: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
  PARTIAL: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
  PAID: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
  APPROVED: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
  DENIED: 'bg-red-500/10 text-red-400 border-red-500/20',
}

const Invoices = () => {
  const [bills, setBills] = useState<Bill[]>([])
  const [summary, setSummary] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [catFilter, setCatFilter] = useState('')
  const [search, setSearch] = useState('')

  useEffect(() => {
    setLoading(true)
    Promise.all([
      fetchBills({ category: catFilter || undefined, limit: 200 }),
      fetchBillsSummary(),
    ])
      .then(([b, s]) => { setBills(b); setSummary(s) })
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [catFilter])

  const filtered = bills.filter(b => {
    if (!search) return true
    const s = search.toLowerCase()
    return b.patient_name?.toLowerCase().includes(s) || b.bill_no?.toLowerCase().includes(s) || b.claim_id?.toLowerCase().includes(s)
  })

  const totalAmount = filtered.reduce((s, b) => s + Number(b.total_amount || 0), 0)
  const draftCount = filtered.filter(b => b.status === 'DRAFT').length
  const categories = summary ? Object.entries(summary.byCategory) : []

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Invoices & Bills</h1>
          <p className="text-sm text-gray-400">Track all hospital bills — {summary?.count?.toLocaleString() || 0} total</p>
        </div>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Total Bills', value: summary?.count?.toLocaleString() || '0', color: 'text-white' },
          { label: 'Total Billed', value: formatINR(summary?.totalBilled || 0), color: 'text-emerald-400' },
          { label: 'Draft Bills', value: (summary?.totalDraft || 0).toLocaleString(), color: 'text-amber-400' },
          { label: 'Categories', value: String(categories.length), color: 'text-blue-400' },
        ].map((s, i) => (
          <motion.div key={i} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}
            className="rounded-xl bg-white/[0.03] border border-white/[0.06] p-4">
            <p className="text-xs text-gray-400 mb-1">{s.label}</p>
            <p className={`text-xl font-bold ${s.color}`}>{s.value}</p>
          </motion.div>
        ))}
      </div>

      {/* Category breakdown */}
      {categories.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {categories.map(([cat, count]) => (
            <button key={cat} onClick={() => setCatFilter(catFilter === cat ? '' : cat)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors border ${
                catFilter === cat
                  ? 'bg-emerald-500/20 border-emerald-500/30 text-emerald-400'
                  : 'bg-white/[0.03] border-white/[0.06] text-gray-400 hover:bg-white/[0.05]'
              }`}>
              {cat}: {(count as number).toLocaleString()}
            </button>
          ))}
        </div>
      )}

      {/* Filters */}
      <div className="flex gap-3">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search patient, bill #, claim ID..."
            className="w-full pl-10 pr-4 py-2 rounded-lg bg-white/[0.03] border border-white/[0.06] text-white text-sm placeholder-gray-500 focus:outline-none focus:border-emerald-500/50" />
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
                  {['Patient', 'UHID', 'Bill #', 'Corporate', 'Category', 'Amount', 'Status', 'Date'].map(h => (
                    <th key={h} className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-white/[0.04]">
                {filtered.map(b => (
                  <tr key={b.id} className="hover:bg-white/[0.02] transition-colors">
                    <td className="px-4 py-3">
                      <p className="text-white font-medium truncate max-w-[180px]">{b.patient_name}</p>
                    </td>
                    <td className="px-4 py-3 text-gray-400 font-mono text-xs">{b.patient_uhid}</td>
                    <td className="px-4 py-3 text-gray-400 font-mono text-xs">{b.bill_no || '—'}</td>
                    <td className="px-4 py-3 text-xs text-blue-400">{(b.patient_corporate || '').toUpperCase()}</td>
                    <td className="px-4 py-3 text-xs text-gray-400">{b.category}</td>
                    <td className="px-4 py-3 text-white">{formatINR(b.total_amount)}</td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-0.5 rounded-full text-xs border ${STATUS_STYLE[b.status] || STATUS_STYLE.DRAFT}`}>{b.status}</span>
                    </td>
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
    </div>
  )
}

export default Invoices
