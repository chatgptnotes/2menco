import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { ChevronDown } from 'lucide-react'
import { fetchCfoInvoices, CfoInvoice } from '../lib/cfo-api'

const formatINR = (n: number) => '₹' + Number(n).toLocaleString('en-IN')
const STATUS_STYLE: Record<string, string> = {
  unpaid: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
  partial: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
  paid: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
  overdue: 'bg-red-500/10 text-red-400 border-red-500/20',
  written_off: 'bg-gray-500/10 text-gray-400 border-gray-500/20',
}
const TYPE_LABEL: Record<string, string> = { hospital: '🏥 Hospital', software: '💻 Software', bettroi: '🤖 BettrOI', other: '📦 Other' }

const Invoices = () => {
  const [invoices, setInvoices] = useState<CfoInvoice[]>([])
  const [loading, setLoading] = useState(true)
  const [typeFilter, setTypeFilter] = useState('')

  useEffect(() => {
    fetchCfoInvoices({ client_type: typeFilter || undefined })
      .then(setInvoices).catch(console.error).finally(() => setLoading(false))
  }, [typeFilter])

  const totalAmount = invoices.reduce((s, i) => s + Number(i.amount), 0)
  const totalPaid = invoices.reduce((s, i) => s + Number(i.paid_amount), 0)
  const totalOutstanding = totalAmount - totalPaid
  const overdueCount = invoices.filter(i => i.status === 'overdue' || (i.status === 'unpaid' && i.due_date && new Date(i.due_date) < new Date())).length

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Invoices</h1>
          <p className="text-sm text-gray-400">Track receivables across all client types</p>
        </div>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Total Invoiced', value: formatINR(totalAmount), color: 'text-white' },
          { label: 'Received', value: formatINR(totalPaid), color: 'text-emerald-400' },
          { label: 'Outstanding', value: formatINR(totalOutstanding), color: 'text-amber-400' },
          { label: 'Overdue', value: String(overdueCount), color: 'text-red-400' },
        ].map((s, i) => (
          <motion.div key={i} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}
            className="rounded-xl bg-white/[0.03] border border-white/[0.06] p-4">
            <p className="text-xs text-gray-400 mb-1">{s.label}</p>
            <p className={`text-xl font-bold ${s.color}`}>{s.value}</p>
          </motion.div>
        ))}
      </div>

      {/* Filter */}
      <div className="flex gap-3">
        <div className="relative">
          <select value={typeFilter} onChange={e => { setTypeFilter(e.target.value); setLoading(true) }}
            className="appearance-none px-4 py-2 pr-8 rounded-lg bg-white/[0.03] border border-white/[0.06] text-gray-300 text-sm focus:outline-none">
            <option value="">All Types</option>
            <option value="hospital">Hospital</option>
            <option value="software">Software</option>
            <option value="bettroi">BettrOI</option>
            <option value="other">Other</option>
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
                  {['Client', 'Type', 'Invoice #', 'Amount', 'Paid', 'Outstanding', 'Status', 'Due Date'].map(h => (
                    <th key={h} className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-white/[0.04]">
                {invoices.map(inv => {
                  const outstanding = Number(inv.amount) - Number(inv.paid_amount)
                  const isOverdue = inv.status === 'overdue' || (inv.status === 'unpaid' && inv.due_date && new Date(inv.due_date) < new Date())
                  return (
                    <tr key={inv.id} className={`transition-colors ${isOverdue ? 'bg-red-500/[0.03]' : 'hover:bg-white/[0.02]'}`}>
                      <td className="px-4 py-3">
                        <p className="text-white font-medium">{inv.client_name}</p>
                        {inv.description && <p className="text-xs text-gray-500 mt-0.5">{inv.description}</p>}
                      </td>
                      <td className="px-4 py-3 text-xs text-gray-400">{TYPE_LABEL[inv.client_type] || inv.client_type}</td>
                      <td className="px-4 py-3 text-gray-400 font-mono text-xs">{inv.invoice_number || '—'}</td>
                      <td className="px-4 py-3 text-white">{formatINR(inv.amount)}</td>
                      <td className="px-4 py-3 text-emerald-400">{formatINR(inv.paid_amount)}</td>
                      <td className="px-4 py-3 font-medium" style={{ color: outstanding > 0 ? '#F59E0B' : '#10B981' }}>{formatINR(outstanding)}</td>
                      <td className="px-4 py-3">
                        <span className={`px-2 py-0.5 rounded-full text-xs border ${STATUS_STYLE[isOverdue ? 'overdue' : inv.status] || STATUS_STYLE.unpaid}`}>
                          {isOverdue ? '⚠ overdue' : inv.status}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-gray-400 text-xs">{inv.due_date || '—'}</td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  )
}

export default Invoices
