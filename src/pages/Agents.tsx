import { useState, useEffect } from 'react'
import { 
  Pause, Activity, CheckCircle, AlertCircle, Clock,
  TrendingUp, Users, DollarSign, BarChart3, CheckSquare, FileText,
  Settings as SettingsIcon
} from 'lucide-react'
import { supabase } from '../lib/supabaseClient'

interface Agent {
  id: string
  name: string
  type: string
  status: string
  config: Record<string, unknown>
  metrics: Record<string, unknown>
}

const iconMap: Record<string, React.ReactNode> = {
  cmo: <Users className="h-6 w-6" />,
  cro: <DollarSign className="h-6 w-6" />,
  cfo: <BarChart3 className="h-6 w-6" />,
  coo: <CheckSquare className="h-6 w-6" />,
  cto: <SettingsIcon className="h-6 w-6" />,
  cxo: <FileText className="h-6 w-6" />,
}

const colorMap: Record<string, string> = {
  cmo: 'bg-blue-500', cro: 'bg-green-500', cfo: 'bg-purple-500',
  coo: 'bg-orange-500', cto: 'bg-indigo-500', cxo: 'bg-pink-500',
}

const roleMap: Record<string, string> = {
  cmo: 'Chief Marketing Officer', cro: 'Chief Revenue Officer', cfo: 'Chief Financial Officer',
  coo: 'Chief Operations Officer', cto: 'Chief Technology Officer', cxo: 'Chief Experience Officer',
}

const Agents = () => {
  const [agents, setAgents] = useState<Agent[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    supabase.from('agents').select('*').then(({ data }) => {
      if (data && data.length > 0) setAgents(data)
      setLoading(false)
    })
  }, [])

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'text-success-600 bg-success-50'
      case 'inactive': return 'text-gray-600 bg-gray-50'
      case 'error': return 'text-danger-600 bg-danger-50'
      case 'maintenance': return 'text-warning-600 bg-warning-50'
      default: return 'text-gray-600 bg-gray-50'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active': return <CheckCircle className="h-4 w-4" />
      case 'error': return <AlertCircle className="h-4 w-4" />
      case 'maintenance': return <Clock className="h-4 w-4" />
      default: return <Pause className="h-4 w-4" />
    }
  }

  const performance = (a: Agent) => (a.metrics as { performance?: number })?.performance ?? 85
  const uptime = (a: Agent) => (a.metrics as { uptime?: number })?.uptime ?? 99

  const getPerformanceColor = (p: number) => p >= 90 ? 'text-success-600' : p >= 80 ? 'text-warning-600' : 'text-danger-600'

  if (loading) return <div className="text-center py-12"><p className="text-gray-500">Loading agents...</p></div>

  if (agents.length === 0) return (
    <div className="space-y-6">
      <div><h1 className="text-2xl font-bold text-gray-900">Digital Agents</h1>
      <p className="text-gray-600">No agents found. Run the SQL migration and seed script to populate data.</p></div>
    </div>
  )

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div><h1 className="text-2xl font-bold text-gray-900">Digital Agents</h1>
        <p className="text-gray-600">Manage your AI-powered business team</p></div>
        <button className="btn btn-primary"><Users className="h-4 w-4 mr-2" />Deploy New Agent</button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {agents.map((agent) => {
          const perf = performance(agent)
          return (
            <div key={agent.id} className="card hover:shadow-lg transition-shadow">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className={`w-12 h-12 rounded-lg flex items-center justify-center text-white ${colorMap[agent.type] || 'bg-gray-500'}`}>
                    {iconMap[agent.type] || <Users className="h-6 w-6" />}
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">{agent.name}</h3>
                    <p className="text-sm text-gray-500">{roleMap[agent.type] || agent.type.toUpperCase()}</p>
                  </div>
                </div>
              </div>
              <div className="flex items-center space-x-2 mb-4">
                <div className={`px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1 ${getStatusColor(agent.status)}`}>
                  {getStatusIcon(agent.status)}<span>{agent.status}</span>
                </div>
              </div>
              <p className="text-sm text-gray-600 mb-4">{(agent.config as { description?: string })?.description || `AI-powered ${roleMap[agent.type] || agent.type}`}</p>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500">Performance</span>
                  <span className={`text-sm font-medium ${getPerformanceColor(perf)}`}>{perf}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className={`h-2 rounded-full ${getPerformanceColor(perf).replace('text-', 'bg-')}`} style={{ width: `${perf}%` }} />
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500">Uptime</span>
                  <span className="text-sm font-medium text-gray-900">{uptime(agent)}%</span>
                </div>
              </div>
              <div className="mt-4 pt-4 border-t border-gray-200 flex space-x-2">
                <button className="btn btn-secondary flex-1 text-xs"><Activity className="h-3 w-3 mr-1" />Monitor</button>
                <button className="btn btn-primary flex-1 text-xs"><TrendingUp className="h-3 w-3 mr-1" />Optimize</button>
              </div>
            </div>
          )
        })}
      </div>

      <div className="card">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Agent Performance Summary</h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="text-center"><div className="text-2xl font-bold text-success-600">{agents.filter(a => a.status === 'active').length}</div><div className="text-sm text-gray-500">Active</div></div>
          <div className="text-center"><div className="text-2xl font-bold text-warning-600">{agents.filter(a => a.status === 'maintenance').length}</div><div className="text-sm text-gray-500">Maintenance</div></div>
          <div className="text-center"><div className="text-2xl font-bold text-danger-600">{agents.filter(a => a.status === 'error').length}</div><div className="text-sm text-gray-500">Needs Attention</div></div>
          <div className="text-center"><div className="text-2xl font-bold text-primary-600">{Math.round(agents.reduce((s, a) => s + performance(a), 0) / agents.length)}%</div><div className="text-sm text-gray-500">Avg Performance</div></div>
        </div>
      </div>
    </div>
  )
}

export default Agents
