import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Search, Plus, X, Mail, Phone, Building2, DollarSign,
  LayoutGrid, List, ChevronRight
} from 'lucide-react'
import { supabase } from '../lib/supabaseClient'
import { useToast } from '../components/Toast'
import PageTransition from '../components/PageTransition'

interface Lead {
  id: string; name: string; email: string; phone: string; company: string;
  status: string; source: string; value: number; notes: string; created_at: string
}

const PIPELINE = ['new', 'contacted', 'qualified', 'proposal', 'won', 'lost'] as const
const pipelineColors: Record<string, string> = {
  new: 'border-blue-500/30 bg-blue-500/5',
  contacted: 'border-violet-500/30 bg-violet-500/5',
  qualified: 'border-amber-500/30 bg-amber-500/5',
  proposal: 'border-cyan-500/30 bg-cyan-500/5',
  won: 'border-emerald-500/30 bg-emerald-500/5',
  lost: 'border-red-500/30 bg-red-500/5',
}
const dotColors: Record<string, string> = {
  new: 'bg-blue-400', contacted: 'bg-violet-400', qualified: 'bg-amber-400',
  proposal: 'bg-cyan-400', won: 'bg-emerald-400', lost: 'bg-red-400',
}

const Leads = () => {
  const [leads, setLeads] = useState<Lead[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [view, setView] = useState<'kanban' | 'table'>('kanban')
  const [showForm, setShowForm] = useState(false)
  const [editLead, setEditLead] = useState<Lead | null>(null)
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null)
  const { toast } = useToast()

  const [form, setForm] = useState({ name: '', email: '', phone: '', company: '', status: 'new', source: '', value: 0, notes: '' })

  useEffect(() => {
    supabase.from('leads').select('*').order('created_at', { ascending: false }).then(({ data }) => {
      if (data) setLeads(data)
      setLoading(false)
    })
  }, [])

  const filtered = leads.filter(l =>
    !search || l.name?.toLowerCase().includes(search.toLowerCase()) ||
    l.company?.toLowerCase().includes(search.toLowerCase()) ||
    l.email?.toLowerCase().includes(search.toLowerCase())
  )

  const openAdd = () => { setForm({ name: '', email: '', phone: '', company: '', status: 'new', source: '', value: 0, notes: '' }); setEditLead(null); setShowForm(true) }
  const openEdit = (l: Lead) => { setForm({ name: l.name, email: l.email || '', phone: l.phone || '', company: l.company || '', status: l.status, source: l.source || '', value: l.value || 0, notes: l.notes || '' }); setEditLead(l); setShowForm(true) }

  const saveLead = async () => {
    if (!form.name) { toast('Name is required', 'error'); return }
    if (editLead) {
      const { error } = await supabase.from('leads').update(form).eq('id', editLead.id)
      if (!error) {
        setLeads(prev => prev.map(l => l.id === editLead.id ? { ...l, ...form } : l))
        toast('Lead updated', 'success')
      }
    } else {
      const { data, error } = await supabase.from('leads').insert(form).select().single()
      if (!error && data) {
        setLeads(prev => [data, ...prev])
        toast('Lead created', 'success')
      }
    }
    setShowForm(false)
  }

  const moveStatus = async (id: string, status: string) => {
    await supabase.from('leads').update({ status }).eq('id', id)
    setLeads(prev => prev.map(l => l.id === id ? { ...l, status } : l))
    toast(`Moved to ${status}`, 'info')
  }

  if (loading) return <div className="space-y-4 animate-pulse"><div className="h-8 bg-white/5 rounded w-48" /><div className="h-96 bg-white/5 rounded-xl" /></div>

  return (
    <PageTransition>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-white">Leads</h1>
            <p className="text-sm text-gray-500 mt-1">{leads.length} total · AED {leads.reduce((s, l) => s + (l.value || 0), 0).toLocaleString()} pipeline</p>
          </div>
          <div className="flex items-center gap-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
              <input type="text" placeholder="Search leads..." value={search} onChange={e => setSearch(e.target.value)} className="input pl-9 w-52" />
            </div>
            <div className="flex bg-white/5 rounded-lg p-0.5">
              <button onClick={() => setView('kanban')} className={`p-1.5 rounded ${view === 'kanban' ? 'bg-white/10 text-white' : 'text-gray-500'}`}><LayoutGrid className="h-4 w-4" /></button>
              <button onClick={() => setView('table')} className={`p-1.5 rounded ${view === 'table' ? 'bg-white/10 text-white' : 'text-gray-500'}`}><List className="h-4 w-4" /></button>
            </div>
            <button onClick={openAdd} className="btn btn-primary"><Plus className="h-4 w-4 mr-1" /> Add Lead</button>
          </div>
        </div>

        {/* Kanban View */}
        {view === 'kanban' && (
          <div className="flex gap-4 overflow-x-auto pb-4">
            {PIPELINE.map(stage => {
              const stageLeads = filtered.filter(l => l.status === stage)
              return (
                <div key={stage} className="flex-shrink-0 w-64">
                  <div className="flex items-center gap-2 mb-3">
                    <div className={`w-2 h-2 rounded-full ${dotColors[stage]}`} />
                    <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">{stage}</span>
                    <span className="text-xs text-gray-600 ml-auto">{stageLeads.length}</span>
                  </div>
                  <div className="space-y-2">
                    {stageLeads.map(lead => (
                      <motion.div
                        key={lead.id}
                        layout
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className={`rounded-xl border p-3 cursor-pointer hover:border-white/10 transition-all ${pipelineColors[stage]}`}
                        onClick={() => setSelectedLead(lead)}
                      >
                        <div className="flex items-center gap-2 mb-1">
                          <div className="w-6 h-6 rounded-full bg-white/10 flex items-center justify-center text-[10px] font-bold text-gray-300">
                            {lead.name?.charAt(0)}
                          </div>
                          <p className="text-sm font-medium text-white truncate">{lead.name}</p>
                        </div>
                        {lead.company && <p className="text-xs text-gray-500 truncate ml-8">{lead.company}</p>}
                        {lead.value > 0 && <p className="text-xs text-emerald-400 ml-8 mt-1">AED {lead.value.toLocaleString()}</p>}
                      </motion.div>
                    ))}
                  </div>
                </div>
              )
            })}
          </div>
        )}

        {/* Table View */}
        {view === 'table' && (
          <div className="card overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-xs text-gray-500 border-b border-white/[0.06]">
                  <th className="pb-3 font-medium">Name</th>
                  <th className="pb-3 font-medium">Company</th>
                  <th className="pb-3 font-medium">Status</th>
                  <th className="pb-3 font-medium">Value</th>
                  <th className="pb-3 font-medium">Source</th>
                  <th className="pb-3 font-medium">Date</th>
                  <th className="pb-3 font-medium"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/[0.04]">
                {filtered.map(lead => (
                  <tr key={lead.id} className="hover:bg-white/[0.02] cursor-pointer" onClick={() => setSelectedLead(lead)}>
                    <td className="py-3">
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-full bg-white/5 flex items-center justify-center text-xs font-bold text-gray-400">{lead.name?.charAt(0)}</div>
                        <div>
                          <p className="text-gray-200 font-medium">{lead.name}</p>
                          {lead.email && <p className="text-xs text-gray-600">{lead.email}</p>}
                        </div>
                      </div>
                    </td>
                    <td className="py-3 text-gray-400">{lead.company || '—'}</td>
                    <td className="py-3">
                      <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${pipelineColors[lead.status] || 'bg-white/5 text-gray-400'}`}>{lead.status}</span>
                    </td>
                    <td className="py-3 text-gray-300">{lead.value ? `AED ${lead.value.toLocaleString()}` : '—'}</td>
                    <td className="py-3 text-gray-500">{lead.source || '—'}</td>
                    <td className="py-3 text-gray-600 text-xs">{new Date(lead.created_at).toLocaleDateString()}</td>
                    <td className="py-3">
                      <button onClick={e => { e.stopPropagation(); openEdit(lead) }} className="text-gray-600 hover:text-gray-300"><ChevronRight className="h-4 w-4" /></button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Lead Detail Drawer */}
        <AnimatePresence>
          {selectedLead && (
            <>
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/50 z-40" onClick={() => setSelectedLead(null)} />
              <motion.div
                initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }}
                transition={{ type: 'spring', damping: 30, stiffness: 300 }}
                className="fixed right-0 top-0 bottom-0 w-96 bg-gray-950 border-l border-white/[0.06] z-50 p-6 overflow-y-auto"
              >
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-lg font-bold text-white">Lead Details</h2>
                  <button onClick={() => setSelectedLead(null)} className="text-gray-500 hover:text-white"><X className="h-5 w-5" /></button>
                </div>
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center text-lg font-bold text-gray-300">{selectedLead.name?.charAt(0)}</div>
                    <div>
                      <p className="font-semibold text-white">{selectedLead.name}</p>
                      <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${pipelineColors[selectedLead.status]}`}>{selectedLead.status}</span>
                    </div>
                  </div>
                  {selectedLead.email && <div className="flex items-center gap-2 text-sm text-gray-400"><Mail className="h-4 w-4" />{selectedLead.email}</div>}
                  {selectedLead.phone && <div className="flex items-center gap-2 text-sm text-gray-400"><Phone className="h-4 w-4" />{selectedLead.phone}</div>}
                  {selectedLead.company && <div className="flex items-center gap-2 text-sm text-gray-400"><Building2 className="h-4 w-4" />{selectedLead.company}</div>}
                  {selectedLead.value > 0 && <div className="flex items-center gap-2 text-sm text-emerald-400"><DollarSign className="h-4 w-4" />AED {selectedLead.value.toLocaleString()}</div>}
                  {selectedLead.notes && <div className="card"><p className="text-xs text-gray-500 mb-1">Notes</p><p className="text-sm text-gray-300">{selectedLead.notes}</p></div>}

                  <div>
                    <p className="text-xs text-gray-500 mb-2">Move to stage</p>
                    <div className="flex flex-wrap gap-1">
                      {PIPELINE.map(s => (
                        <button key={s} onClick={() => { moveStatus(selectedLead.id, s); setSelectedLead({ ...selectedLead, status: s }) }}
                          className={`px-2 py-1 rounded text-xs font-medium transition-all ${selectedLead.status === s ? 'bg-blue-500/20 text-blue-400' : 'bg-white/5 text-gray-500 hover:text-gray-300'}`}
                        >{s}</button>
                      ))}
                    </div>
                  </div>

                  <div className="flex gap-2 pt-4">
                    <button onClick={() => { openEdit(selectedLead); setSelectedLead(null) }} className="btn btn-secondary flex-1">Edit</button>
                  </div>
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>

        {/* Add/Edit Form Modal */}
        <AnimatePresence>
          {showForm && (
            <>
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/50 z-40" onClick={() => setShowForm(false)} />
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}
                className="fixed inset-0 z-50 flex items-center justify-center p-4"
              >
                <div className="bg-gray-900 border border-white/[0.06] rounded-2xl p-6 w-full max-w-md space-y-4">
                  <div className="flex items-center justify-between">
                    <h2 className="text-lg font-bold text-white">{editLead ? 'Edit Lead' : 'Add Lead'}</h2>
                    <button onClick={() => setShowForm(false)} className="text-gray-500 hover:text-white"><X className="h-5 w-5" /></button>
                  </div>
                  <div className="space-y-3">
                    <div><label className="label">Name *</label><input className="input" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} /></div>
                    <div className="grid grid-cols-2 gap-3">
                      <div><label className="label">Email</label><input className="input" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} /></div>
                      <div><label className="label">Phone</label><input className="input" value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} /></div>
                    </div>
                    <div><label className="label">Company</label><input className="input" value={form.company} onChange={e => setForm({ ...form, company: e.target.value })} /></div>
                    <div className="grid grid-cols-2 gap-3">
                      <div><label className="label">Status</label>
                        <select className="input" value={form.status} onChange={e => setForm({ ...form, status: e.target.value })}>
                          {PIPELINE.map(s => <option key={s} value={s}>{s}</option>)}
                        </select>
                      </div>
                      <div><label className="label">Value (AED)</label><input type="number" className="input" value={form.value} onChange={e => setForm({ ...form, value: Number(e.target.value) })} /></div>
                    </div>
                    <div><label className="label">Source</label><input className="input" value={form.source} onChange={e => setForm({ ...form, source: e.target.value })} /></div>
                    <div><label className="label">Notes</label><textarea className="input" rows={2} value={form.notes} onChange={e => setForm({ ...form, notes: e.target.value })} /></div>
                  </div>
                  <div className="flex gap-2 pt-2">
                    <button onClick={() => setShowForm(false)} className="btn btn-secondary flex-1">Cancel</button>
                    <button onClick={saveLead} className="btn btn-primary flex-1">{editLead ? 'Update' : 'Create'}</button>
                  </div>
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </div>
    </PageTransition>
  )
}

export default Leads
