import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Mail, RefreshCw, Sparkles, Clock, ChevronRight } from 'lucide-react'
import { apiEmails, type Email } from '../lib/api'
import PageTransition from '../components/PageTransition'
const Emails = () => {
  const [emails, setEmails] = useState<Email[]>([])
  const [loading, setLoading] = useState(true)
  const [syncing, setSyncing] = useState(false)
  const [selected, setSelected] = useState<string | null>(null)
  const [summary, setSummary] = useState<Record<string, string>>({})
  useEffect(() => { apiEmails.list().then(d => setEmails(d.emails)).catch(() => {}).finally(() => setLoading(false)) }, [])
  const handleSync = async () => { setSyncing(true); try { await apiEmails.sync(); const d = await apiEmails.list(); setEmails(d.emails) } catch {} setSyncing(false) }
  const handleSummary = async (id: string) => {
    if (summary[id]) { setSelected(selected === id ? null : id); return }
    setSelected(id)
    try { const res = await apiEmails.summary(id); setSummary(prev => ({ ...prev, [id]: typeof res.summary === 'string' ? res.summary : JSON.stringify(res.summary) })) }
    catch { setSummary(prev => ({ ...prev, [id]: 'Could not generate summary' })) }
  }
  return (
    <PageTransition>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div><h1 className="text-2xl font-bold text-white">Emails</h1><p className="text-sm text-gray-500 mt-1">Gmail integration with AI summaries</p></div>
          <button onClick={handleSync} disabled={syncing} className="btn btn-primary flex items-center gap-2"><RefreshCw className={`h-4 w-4 ${syncing ? 'animate-spin' : ''}`} />{syncing ? 'Syncing...' : 'Sync Gmail'}</button>
        </div>
        <div className="grid grid-cols-3 gap-4">
          <div className="card text-center"><Mail className="h-5 w-5 text-blue-400 mx-auto mb-1" /><p className="text-2xl font-bold text-white">{emails.length}</p><p className="text-xs text-gray-500">Total</p></div>
          <div className="card text-center"><Sparkles className="h-5 w-5 text-violet-400 mx-auto mb-1" /><p className="text-2xl font-bold text-white">{Object.keys(summary).length}</p><p className="text-xs text-gray-500">Summarized</p></div>
          <div className="card text-center"><Clock className="h-5 w-5 text-amber-400 mx-auto mb-1" /><p className="text-2xl font-bold text-white">{emails.length > 0 ? new Date(emails[0].received_at).toLocaleDateString() : '\u2014'}</p><p className="text-xs text-gray-500">Latest</p></div>
        </div>
        {loading ? (<div className="space-y-2">{[1,2,3,4,5].map(i => <div key={i} className="h-16 bg-white/5 rounded-xl animate-pulse" />)}</div>)
        : emails.length === 0 ? (<div className="card text-center py-16"><Mail className="h-10 w-10 text-gray-700 mx-auto mb-3" /><p className="text-gray-500">No emails yet. Click Sync Gmail.</p></div>)
        : (<div className="space-y-2">{emails.map((em, i) => (
            <motion.div key={em.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.02 }}>
              <div className="card-hover cursor-pointer" onClick={() => handleSummary(em.id)}>
                <div className="flex items-center gap-3">
                  <Mail className="h-4 w-4 text-blue-400 flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2"><h3 className="text-sm font-medium text-white truncate">{em.subject || '(no subject)'}</h3><ChevronRight className={`h-3 w-3 text-gray-600 transition-transform ${selected === em.id ? 'rotate-90' : ''}`} /></div>
                    <p className="text-xs text-gray-500 truncate">{em.from_email}</p>
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <button onClick={e => { e.stopPropagation(); handleSummary(em.id) }} className="text-xs text-violet-400 hover:text-violet-300 flex items-center gap-1"><Sparkles className="h-3 w-3" /> AI Summary</button>
                    <span className="text-xs text-gray-600">{new Date(em.received_at).toLocaleDateString()}</span>
                  </div>
                </div>
                {selected === em.id && summary[em.id] && (<motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} className="mt-3 pt-3 border-t border-white/[0.06]"><p className="text-sm text-gray-300">{summary[em.id]}</p></motion.div>)}
              </div>
            </motion.div>
          ))}</div>)}
      </div>
    </PageTransition>
  )
}
export default Emails
