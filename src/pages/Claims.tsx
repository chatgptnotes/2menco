import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Search, Plus, X, ChevronDown, Sparkles, MessageSquare } from 'lucide-react'
import { fetchClaims, fetchFollowups, createClaim, Claim, ClaimFollowup } from '../lib/cfo-api'

const STATUS_BADGE: Record<string, string> = {
  pending: 'bg-gray-500/10 text-gray-400 border-gray-500/20',
  submitted: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
  under_review: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
  approved: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
  partially_approved: 'bg-teal-500/10 text-teal-400 border-teal-500/20',
  denied: 'bg-red-500/10 text-red-400 border-red-500/20',
  appealed: 'bg-orange-500/10 text-orange-400 border-orange-500/20',
  recovered: 'bg-green-500/10 text-green-300 border-green-500/20',
  written_off: 'bg-gray-600/10 text-gray-500 border-gray-600/20',
}

const formatINR = (n: number) => '₹' + Number(n).toLocaleString('en-IN')
const PAYER_TYPES = ['', 'ESIC', 'CGHS', 'ECHS', 'Private', 'Other']
const STATUSES = ['', 'pending', 'submitted', 'under_review', 'approved', 'partially_approved', 'denied', 'appealed', 'recovered', 'written_off']

const Claims = () => {
  const [claims, setClaims] = useState<Claim[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [payerFilter, setPayerFilter] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [selected, setSelected] = useState<Claim | null>(null)
  const [followups, setFollowups] = useState<ClaimFollowup[]>([])
  const [showAdd, setShowAdd] = useState(false)
  const [newClaim, setNewClaim] = useState({ patient_name: '', payer_type: 'ESIC', claim_amount: '', claim_number: '' })

  const load = () => {
    setLoading(true)
    fetchClaims({ payer_type: payerFilter || undefined, status: statusFilter || undefined })
      .then(setClaims).catch(console.error).finally(() => setLoading(false))
  }

  useEffect(() => { load() }, [payerFilter, statusFilter])

  const openDetail = async (c: Claim) => {
    setSelected(c)
    const f = await fetchFollowups(c.id)
    setFollowups(f)
  }

  const handleAdd = async () => {
    if (!newClaim.patient_name || !newClaim.claim_amount) return
    await createClaim({ patient_name: newClaim.patient_name, payer_type: newClaim.payer_type as any, claim_amount: Number(newClaim.claim_amount), claim_number: newClaim.claim_number || undefined })
    setShowAdd(false)
    setNewClaim({ patient_name: '', payer_type: 'ESIC', claim_amount: '', claim_number: '' })
    load()
  }

  const filtered = claims.filter(c => !search || c.patient_name.toLowerCase().includes(search.toLowerCase()) || c.claim_number?.toLowerCase().includes(search.toLowerCase()))

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Claims Management</h1>
          <p className="text-sm text-gray-400">{claims.length} claims · {formatINR(claims.reduce((s, c) => s + Number(c.claim_amount), 0))} total</p>
        </div>
        <button onClick={() => setShowAdd(true)} className="flex items-center gap-2 px-4 py-2 rounded-lg bg-emerald-500 hover:bg-emerald-600 text-white text-sm font-medium transition-colors">
          <Plus className="w-4 h-4" /> Add Claim
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search patient or claim #..."
            className="w-full pl-10 pr-4 py-2 rounded-lg bg-white/[0.03] border border-white/[0.06] text-white text-sm placeholder-gray-500 focus:outline-none focus:border-emerald-500/50" />
        </div>
        <div className="relative">
          <select value={payerFilter} onChange={e => setPayerFilter(e.target.value)}
            className="appearance-none px-4 py-2 pr-8 rounded-lg bg-white/[0.03] border border-white/[0.06] text-gray-300 text-sm focus:outline-none">
            <option value="">All Payers</option>
            {PAYER_TYPES.filter(Boolean).map(p => <option key={p} value={p}>{p}</option>)}
          </select>
          <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 pointer-events-none" />
        </div>
        <div className="relative">
          <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)}
            className="appearance-none px-4 py-2 pr-8 rounded-lg bg-white/[0.03] border border-white/[0.06] text-gray-300 text-sm focus:outline-none">
            <option value="">All Statuses</option>
            {STATUSES.filter(Boolean).map(s => <option key={s} value={s}>{s.replace('_', ' ')}</option>)}
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
                  {['Patient', 'Claim #', 'Payer', 'Amount', 'Recovered', 'Status', 'Next Follow-up'].map(h => (
                    <th key={h} className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-white/[0.04]">
                {filtered.map(c => (
                  <tr key={c.id} onClick={() => openDetail(c)} className="hover:bg-white/[0.02] cursor-pointer transition-colors">
                    <td className="px-4 py-3 text-white font-medium">{c.patient_name}</td>
                    <td className="px-4 py-3 text-gray-400 font-mono text-xs">{c.claim_number}</td>
                    <td className="px-4 py-3"><span className="px-2 py-0.5 rounded text-xs font-medium" style={{ color: c.payer_type === 'ESIC' ? '#3B82F6' : c.payer_type === 'CGHS' ? '#8B5CF6' : '#F59E0B' }}>{c.payer_type}</span></td>
                    <td className="px-4 py-3 text-white">{formatINR(c.claim_amount)}</td>
                    <td className="px-4 py-3 text-emerald-400">{formatINR(c.recovered_amount)}</td>
                    <td className="px-4 py-3"><span className={`px-2 py-0.5 rounded-full text-xs border ${STATUS_BADGE[c.status] || STATUS_BADGE.pending}`}>{c.status.replace('_', ' ')}</span></td>
                    <td className="px-4 py-3 text-gray-400 text-xs">{c.next_followup || '—'}</td>
                  </tr>
                ))}
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
                    ['Claim #', selected.claim_number],
                    ['Payer', `${selected.payer_type} — ${selected.payer_name || ''}`],
                    ['Amount', formatINR(selected.claim_amount)],
                    ['Approved', selected.approved_amount ? formatINR(selected.approved_amount) : '—'],
                    ['Recovered', formatINR(selected.recovered_amount)],
                    ['Status', selected.status.replace('_', ' ')],
                    ['Submitted', selected.submission_date || '—'],
                    ['Next Follow-up', selected.next_followup || '—'],
                  ].map(([l, v]) => (
                    <div key={l as string}>
                      <p className="text-xs text-gray-500">{l}</p>
                      <p className="text-sm text-white font-medium">{v}</p>
                    </div>
                  ))}
                </div>
                {selected.denial_reason && (
                  <div className="p-3 rounded-lg bg-red-500/5 border border-red-500/10">
                    <p className="text-xs text-red-400 font-medium mb-1">Denial Reason</p>
                    <p className="text-sm text-gray-300">{selected.denial_reason}</p>
                  </div>
                )}
                {selected.notes && (
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Notes</p>
                    <p className="text-sm text-gray-300">{selected.notes}</p>
                  </div>
                )}
                <button className="flex items-center gap-2 px-4 py-2 rounded-lg bg-violet-500/10 border border-violet-500/20 text-violet-400 text-sm font-medium hover:bg-violet-500/20 transition-colors w-full justify-center">
                  <Sparkles className="w-4 h-4" /> Generate AI Appeal
                </button>
                <div>
                  <h3 className="text-sm font-semibold text-gray-300 mb-3 flex items-center gap-2"><MessageSquare className="w-4 h-4" /> Follow-up Log</h3>
                  <div className="space-y-2">
                    {followups.length === 0 ? <p className="text-xs text-gray-500">No follow-ups yet</p> : followups.map(f => (
                      <div key={f.id} className="p-3 rounded-lg bg-white/[0.02] border border-white/[0.04]">
                        <p className="text-sm text-white">{f.action}</p>
                        {f.response && <p className="text-xs text-gray-400 mt-1">↳ {f.response}</p>}
                        <div className="flex gap-4 mt-1">
                          <span className="text-[10px] text-gray-500">By: {f.followup_by || '—'}</span>
                          <span className="text-[10px] text-gray-500">{new Date(f.followup_date).toLocaleDateString()}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Add Modal */}
      <AnimatePresence>
        {showAdd && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/60 z-40" onClick={() => setShowAdd(false)} />
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}
              className="fixed inset-0 z-50 flex items-center justify-center p-4">
              <div className="bg-gray-900 border border-white/[0.06] rounded-xl p-6 w-full max-w-md space-y-4">
                <h2 className="text-lg font-bold text-white">Add New Claim</h2>
                {[
                  { label: 'Patient Name', key: 'patient_name', type: 'text' },
                  { label: 'Claim Number', key: 'claim_number', type: 'text' },
                  { label: 'Claim Amount (₹)', key: 'claim_amount', type: 'number' },
                ].map(f => (
                  <div key={f.key}>
                    <label className="text-xs text-gray-400">{f.label}</label>
                    <input type={f.type} value={(newClaim as any)[f.key]} onChange={e => setNewClaim(p => ({ ...p, [f.key]: e.target.value }))}
                      className="w-full mt-1 px-3 py-2 rounded-lg bg-white/[0.03] border border-white/[0.06] text-white text-sm focus:outline-none focus:border-emerald-500/50" />
                  </div>
                ))}
                <div>
                  <label className="text-xs text-gray-400">Payer Type</label>
                  <select value={newClaim.payer_type} onChange={e => setNewClaim(p => ({ ...p, payer_type: e.target.value }))}
                    className="w-full mt-1 px-3 py-2 rounded-lg bg-white/[0.03] border border-white/[0.06] text-white text-sm focus:outline-none">
                    {PAYER_TYPES.filter(Boolean).map(p => <option key={p} value={p}>{p}</option>)}
                  </select>
                </div>
                <div className="flex gap-3 pt-2">
                  <button onClick={() => setShowAdd(false)} className="flex-1 px-4 py-2 rounded-lg border border-white/[0.06] text-gray-400 text-sm hover:bg-white/[0.03]">Cancel</button>
                  <button onClick={handleAdd} className="flex-1 px-4 py-2 rounded-lg bg-emerald-500 text-white text-sm font-medium hover:bg-emerald-600">Add Claim</button>
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
