import { Link, useLocation } from 'react-router-dom'
import { ChevronRight, Home } from 'lucide-react'

const nameMap: Record<string, string> = {
  dashboard: 'Dashboard',
  agents: 'Agents',
  kpis: 'KPIs & Metrics',
  analytics: 'Analytics',
  tasks: 'Tasks',
  leads: 'Leads',
  documents: 'Documents',
  settings: 'Settings',
  help: 'Help',
}

const Breadcrumbs = () => {
  const { pathname } = useLocation()
  const parts = pathname.split('/').filter(Boolean)

  if (parts.length <= 1) return null

  return (
    <nav className="flex items-center space-x-1 text-sm text-gray-500 mb-6">
      <Link to="/dashboard" className="hover:text-gray-300 transition-colors">
        <Home className="h-4 w-4" />
      </Link>
      {parts.slice(1).map((part, i) => (
        <span key={part} className="flex items-center">
          <ChevronRight className="h-3 w-3 mx-1" />
          {i === parts.length - 2 ? (
            <span className="text-gray-300 font-medium">{nameMap[part] || part}</span>
          ) : (
            <Link
              to={'/' + parts.slice(0, i + 2).join('/')}
              className="hover:text-gray-300 transition-colors"
            >
              {nameMap[part] || part}
            </Link>
          )}
        </span>
      ))}
    </nav>
  )
}

export default Breadcrumbs
