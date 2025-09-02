import { useState } from 'react'
import { 
  Play, 
  Pause, 
  Settings, 
  Activity, 
  CheckCircle, 
  AlertCircle, 
  Clock,
  TrendingUp,
  Users,
  DollarSign,
  BarChart3,
  CheckSquare,
  FileText,
  Settings as SettingsIcon
} from 'lucide-react'

interface Agent {
  id: string
  name: string
  role: string
  status: 'active' | 'inactive' | 'error' | 'maintenance'
  performance: number
  uptime: number
  lastActivity: string
  description: string
  icon: React.ReactNode
  color: string
}

const Agents = () => {
  const [agents, setAgents] = useState<Agent[]>([
    {
      id: 'cmo',
      name: 'Digital CMO',
      role: 'Chief Marketing Officer',
      status: 'active',
      performance: 94,
      uptime: 99.8,
      lastActivity: '2 minutes ago',
      description: 'Handles marketing campaigns, lead generation, and brand management',
      icon: <Users className="h-6 w-6" />,
      color: 'bg-blue-500'
    },
    {
      id: 'cro',
      name: 'Digital CRO',
      role: 'Chief Revenue Officer',
      status: 'active',
      performance: 87,
      uptime: 99.5,
      lastActivity: '5 minutes ago',
      description: 'Manages sales pipeline, conversion optimization, and revenue growth',
      icon: <DollarSign className="h-6 w-6" />,
      color: 'bg-green-500'
    },
    {
      id: 'cfo',
      name: 'Digital CFO',
      role: 'Chief Financial Officer',
      status: 'active',
      performance: 92,
      uptime: 99.9,
      lastActivity: '1 minute ago',
      description: 'Tracks financial metrics, cash flow, and budget management',
      icon: <BarChart3 className="h-6 w-6" />,
      color: 'bg-purple-500'
    },
    {
      id: 'coo',
      name: 'Digital COO',
      role: 'Chief Operations Officer',
      status: 'maintenance',
      performance: 78,
      uptime: 95.2,
      lastActivity: '1 hour ago',
      description: 'Manages daily operations, process optimization, and team coordination',
      icon: <CheckSquare className="h-6 w-6" />,
      color: 'bg-orange-500'
    },
    {
      id: 'cto',
      name: 'Digital CTO',
      role: 'Chief Technology Officer',
      status: 'active',
      performance: 96,
      uptime: 99.9,
      lastActivity: '30 seconds ago',
      description: 'Manages technology infrastructure, security, and system architecture',
      icon: <SettingsIcon className="h-6 w-6" />,
      color: 'bg-indigo-500'
    },
    {
      id: 'cxo',
      name: 'Digital CXO',
      role: 'Chief Experience Officer',
      status: 'error',
      performance: 65,
      uptime: 87.3,
      lastActivity: '3 hours ago',
      description: 'Manages customer experience, satisfaction, and retention',
      icon: <FileText className="h-6 w-6" />,
      color: 'bg-pink-500'
    }
  ])

  const toggleAgentStatus = (agentId: string) => {
    setAgents(prev => prev.map(agent => 
      agent.id === agentId 
        ? { ...agent, status: agent.status === 'active' ? 'inactive' : 'active' }
        : agent
    ))
  }

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
      case 'inactive': return <Pause className="h-4 w-4" />
      case 'error': return <AlertCircle className="h-4 w-4" />
      case 'maintenance': return <Clock className="h-4 w-4" />
      default: return <Clock className="h-4 w-4" />
    }
  }

  const getPerformanceColor = (performance: number) => {
    if (performance >= 90) return 'text-success-600'
    if (performance >= 80) return 'text-warning-600'
    return 'text-danger-600'
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Digital Agents</h1>
          <p className="text-gray-600">Manage your AI-powered business team</p>
        </div>
        <button className="btn btn-primary">
          <Users className="h-4 w-4 mr-2" />
          Deploy New Agent
        </button>
      </div>

      {/* Agent Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {agents.map((agent) => (
          <div key={agent.id} className="card hover:shadow-lg transition-shadow">
            {/* Agent Header */}
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className={`w-12 h-12 rounded-lg flex items-center justify-center text-white ${agent.color}`}>
                  {agent.icon}
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">{agent.name}</h3>
                  <p className="text-sm text-gray-500">{agent.role}</p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => toggleAgentStatus(agent.id)}
                  className={`p-2 rounded-md hover:bg-gray-100 ${
                    agent.status === 'active' ? 'text-success-600' : 'text-gray-400'
                  }`}
                >
                  {agent.status === 'active' ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                </button>
                <button className="p-2 rounded-md hover:bg-gray-100 text-gray-400">
                  <Settings className="h-4 w-4" />
                </button>
              </div>
            </div>

            {/* Status */}
            <div className="flex items-center space-x-2 mb-4">
              <div className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(agent.status)}`}>
                {getStatusIcon(agent.status)}
                <span className="ml-1">{agent.status}</span>
              </div>
            </div>

            {/* Description */}
            <p className="text-sm text-gray-600 mb-4">{agent.description}</p>

            {/* Metrics */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-500">Performance</span>
                <span className={`text-sm font-medium ${getPerformanceColor(agent.performance)}`}>
                  {agent.performance}%
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className={`h-2 rounded-full ${getPerformanceColor(agent.performance).replace('text-', 'bg-')}`}
                  style={{ width: `${agent.performance}%` }}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-500">Uptime</span>
                <span className="text-sm font-medium text-gray-900">{agent.uptime}%</span>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-500">Last Activity</span>
                <span className="text-sm text-gray-900">{agent.lastActivity}</span>
              </div>
            </div>

            {/* Actions */}
            <div className="mt-4 pt-4 border-t border-gray-200">
              <div className="flex space-x-2">
                <button className="btn btn-secondary flex-1 text-xs">
                  <Activity className="h-3 w-3 mr-1" />
                  Monitor
                </button>
                <button className="btn btn-primary flex-1 text-xs">
                  <TrendingUp className="h-3 w-3 mr-1" />
                  Optimize
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Agent Performance Summary */}
      <div className="card">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Agent Performance Summary</h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-success-600">4</div>
            <div className="text-sm text-gray-500">Active Agents</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-warning-600">1</div>
            <div className="text-sm text-gray-500">In Maintenance</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-danger-600">1</div>
            <div className="text-sm text-gray-500">Needs Attention</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-primary-600">85.3%</div>
            <div className="text-sm text-gray-500">Average Performance</div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Agents
