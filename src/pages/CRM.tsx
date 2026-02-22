import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Users, Briefcase, RefreshCw, DollarSign } from 'lucide-react'
import { apiCRM } from '../lib/api'
import PageTransition from '../components/PageTransition'

const CRM = () => {
  const [contacts, setContacts] = useState<Record<string, unknown>[]>([])
  const [deals, setDeals] = useState<Record<string, unknown>[]>([])
  const [loading, setLoading] = useState(true)
  const [syncing, setSyncing] = useState(false)
  const [tab, setTab] = useState<'contacts' | 'deals'>('contacts')

  useEffect(() => {
    Promise.all([apiCRM.contacts(), apiCRM.deals()])
      .then(([c, d]) => { setContacts(c.contacts); setDeals(d.deals) })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  const handleSync = async () => {
    setSyncing(true)
    try {
      await apiCRM.sync()
      const [c, d] = await Promise.all([apiCRM.contacts(), apiCRM.deals()])
      setContacts(c.contacts)
      setDeals(d.deals)
    } catch { /* noop */ }
    setSyncing(false)
  }

  return (
    <PageTransition>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-white">CRM</h1>
            <p className="text-sm text-gray-500 mt-1">HubSpot contacts &amp; deals</p>
          </div>
          <button onClick={handleSync} disabled={syncing} className="btn btn-primary flex items-center gap-2">
            <RefreshCw className={`h-4 w-4 ${syncing ? 'animate-spin' : ''}`} />
            {syncing ? 'Syncing...' : 'Sync HubSpot'}
          </button>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="card text-center">
            <Users className="h-5 w-5 text-blue-400 mx-auto mb-1" />
            <p className="text-2xl font-bold text-white">{contacts.length}</p>
            <p className="text-xs text-gray-500">Contacts</p>
          </div>
          <div className="card text-center">
            <Briefcase className="h-5 w-5 text-emerald-400 mx-auto mb-1" />
            <p className="text-2xl font-bold text-white">{deals.length}</p>
            <p className="text-xs text-gray-500">Deals</p>
          </div>
        </div>

        <div className="flex gap-1 border-b border-white/[0.06] pb-px">
          {(['contacts', 'deals'] as const).map(t => (
            <button key={t} onClick={() => setTab(t)}
              className={`px-4 py-2 text-sm font-medium rounded-t-lg transition-colors capitalize ${
                tab === t ? 'text-white bg-white/[0.06] border-b-2 border-blue-500' : 'text-gray-500 hover:text-gray-300'
              }`}>
              {t} ({t === 'contacts' ? contacts.length : deals.length})
            </button>
          ))}
        </div>

        {loading ? (
          <div className="space-y-2">
            {[1,2,3,4].map(i => <div key={i} className="h-14 bg-white/5 rounded-xl animate-pulse" />)}
          </div>
        ) : tab === 'contacts' ? (
          contacts.length === 0 ? (
            <div className="card text-center py-16">
              <Users className="h-10 w-10 text-gray-700 mx-auto mb-3" />
              <p className="text-gray-500">No contacts. Click &quot;Sync HubSpot&quot; to import.</p>
            </div>
          ) : (
            <div className="space-y-2">
              {contacts.map((c, i) => (
                <motion.div key={i} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.02 }} className="card-hover flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-blue-500/10 flex items-center justify-center text-blue-400 text-sm font-medium">
                    {String(c.name || c.email || '?').charAt(0).toUpperCase()}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-white truncate">{String(c.name || c.first_name || 'Unknown')}</p>
                    <p className="text-xs text-gray-500 truncate">{String(c.email || '')}</p>
                  </div>
                  {c.company && <span className="text-xs text-gray-600">{String(c.company)}</span>}
                </motion.div>
              ))}
            </div>
          )
        ) : (
          deals.length === 0 ? (
            <div className="card text-center py-16">
              <Briefcase className="h-10 w-10 text-gray-700 mx-auto mb-3" />
              <p className="text-gray-500">No deals yet.</p>
            </div>
          ) : (
            <div className="space-y-2">
              {deals.map((d, i) => (
                <motion.div key={i} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.02 }} className="card-hover flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <DollarSign className="h-4 w-4 text-emerald-400" />
                    <div>
                      <p className="text-sm text-white">{String(d.name || d.deal_name || 'Untitled')}</p>
                      <p className="text-xs text-gray-500">{String(d.stage || d.deal_stage || '')}</p>
                    </div>
                  </div>
                  {d.amount && <span className="text-sm font-medium text-emerald-400">${Number(d.amount).toLocaleString()}</span>}
                </motion.div>
              ))}
            </div>
          )
        )}
      </div>
    </PageTransition>
  )
}

export default CRM
