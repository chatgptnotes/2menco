import { FileText, Download } from 'lucide-react'
import PageTransition from '../components/PageTransition'

const docs = [
  { name: 'Million Dollar Plan', type: 'PDF', size: '2.4 MB', date: '2025-01-15' },
  { name: 'Agent Configuration Guide', type: 'PDF', size: '1.8 MB', date: '2025-01-10' },
  { name: 'KPI Framework', type: 'XLSX', size: '450 KB', date: '2025-01-08' },
  { name: 'SOPs - Operations', type: 'PDF', size: '3.2 MB', date: '2025-01-05' },
  { name: 'Financial Model', type: 'XLSX', size: '1.1 MB', date: '2025-01-03' },
]

const Documents = () => (
  <PageTransition>
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div><h1 className="text-2xl font-bold text-white">Documents</h1><p className="text-sm text-gray-500 mt-1">Business documents & templates</p></div>
      </div>
      <div className="space-y-2">
        {docs.map(doc => (
          <div key={doc.name} className="card-hover flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-blue-500/10 flex items-center justify-center"><FileText className="h-5 w-5 text-blue-400" /></div>
              <div><p className="text-sm font-medium text-gray-200">{doc.name}</p><p className="text-xs text-gray-600">{doc.type} · {doc.size}</p></div>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-xs text-gray-600">{doc.date}</span>
              <button className="text-gray-600 hover:text-gray-300"><Download className="h-4 w-4" /></button>
            </div>
          </div>
        ))}
      </div>
    </div>
  </PageTransition>
)

export default Documents
