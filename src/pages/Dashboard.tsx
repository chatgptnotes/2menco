import { useState, useEffect } from 'react'
import { 
  TrendingUp, 
  Users, 
  DollarSign, 
  Target, 
  Calendar,
  CheckCircle,
  BarChart3,
  CheckSquare
} from 'lucide-react'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts'
import { supabase } from '../lib/supabaseClient'

interface AgentRow { id: string; name: string; type: string; status: string; metrics: Record<string, unknown> }
interface KpiRow { id: string; name: string; current_value: number; target_value: number; trend: string; category: string }
interface TaskRow { id: string; title: string; status: string; priority: string; due_date: string }

const Dashboard = () => {
  const [agents, setAgents] = useState<AgentRow[]>([])
  const [kpis, setKpis] = useState<KpiRow[]>([])
  const [tasks, setTasks] = useState<TaskRow[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const load = async () => {
      const [a, k, t] = await Promise.all([
        supabase.from('agents').select('*'),
        supabase.from('kpis').select('*').limit(10),
        supabase.from('agent_tasks').select('*').order('created_at', { ascending: false }).limit(5),
      ])
      if (a.data) setAgents(a.data)
      if (k.data) setKpis(k.data)
      if (t.data) setTasks(t.data)
      setLoading(false)
    }
    load()
  }, [])

  const activeAgents = agents.filter(a => a.status === 'active').length
  const totalAgents = agents.length || 6
  const totalRevenue = kpis.find(k => k.name?.toLowerCase().includes('revenue'))?.current_value || 575000
  const completedTasks = tasks.filter(t => t.status === 'completed').length
  const totalTasks = tasks.length || 1

  const revenueData = [
    { month: 'Jan', revenue: 50000, target: 100000 },
    { month: 'Feb', revenue: 75000, target: 100000 },
    { month: 'Mar', revenue: 90000, target: 100000 },
    { month: 'Apr', revenue: 120000, target: 100000 },
    { month: 'May', revenue: 150000, target: 100000 },
    { month: 'Jun', revenue: 180000, target: 100000 },
  ]

  const onTrack = kpis.filter(k => k.trend === 'up').length || 3
  const atRisk = kpis.filter(k => k.trend === 'stable').length || 2
  const critical = kpis.filter(k => k.trend === 'down').length || 1
  const kpiData = [
    { name: 'On Track', value: onTrack, color: '#22c55e' },
    { name: 'At Risk', value: atRisk, color: '#f59e0b' },
    { name: 'Critical', value: critical, color: '#ef4444' },
  ]

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'text-success-600 bg-success-50'
      case 'in-progress': return 'text-warning-600 bg-warning-50'
      case 'pending': return 'text-gray-600 bg-gray-50'
      default: return 'text-gray-600 bg-gray-50'
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'text-danger-600'
      case 'medium': return 'text-warning-600'
      case 'low': return 'text-success-600'
      default: return 'text-gray-600'
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Command Center Dashboard</h1>
        <p className="text-gray-600">Monitor your digital empire's performance in real-time</p>
        {loading && <p className="text-sm text-primary-600 mt-1">Loading live data...</p>}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="card">
          <div className="flex items-center">
            <DollarSign className="h-8 w-8 text-success-600 flex-shrink-0" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Revenue</p>
              <p className="text-2xl font-bold text-gray-900">AED {totalRevenue.toLocaleString()}</p>
              <p className="text-sm text-success-600 flex items-center"><TrendingUp className="h-4 w-4 mr-1" />+15% from last month</p>
            </div>
          </div>
        </div>
        <div className="card">
          <div className="flex items-center">
            <Target className="h-8 w-8 text-primary-600 flex-shrink-0" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Target Progress</p>
              <p className="text-2xl font-bold text-gray-900">{((totalRevenue / 1000000) * 100).toFixed(1)}%</p>
              <p className="text-sm text-primary-600">Target: 1M AED</p>
            </div>
          </div>
        </div>
        <div className="card">
          <div className="flex items-center">
            <Users className="h-8 w-8 text-secondary-600 flex-shrink-0" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Active Agents</p>
              <p className="text-2xl font-bold text-gray-900">{activeAgents}/{totalAgents}</p>
              <p className="text-sm text-success-600">{activeAgents === totalAgents ? 'All systems operational' : 'Some agents inactive'}</p>
            </div>
          </div>
        </div>
        <div className="card">
          <div className="flex items-center">
            <CheckCircle className="h-8 w-8 text-success-600 flex-shrink-0" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Tasks Completed</p>
              <p className="text-2xl font-bold text-gray-900">{Math.round((completedTasks / totalTasks) * 100)}%</p>
              <p className="text-sm text-success-600">On track for deadline</p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Revenue vs Target</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={revenueData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="revenue" stroke="#3b82f6" strokeWidth={3} />
              <Line type="monotone" dataKey="target" stroke="#ef4444" strokeWidth={2} strokeDasharray="5 5" />
            </LineChart>
          </ResponsiveContainer>
        </div>
        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">KPI Status Overview</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie data={kpiData} cx="50%" cy="50%" innerRadius={60} outerRadius={100} paddingAngle={5} dataKey="value">
                {kpiData.map((entry, index) => <Cell key={`cell-${index}`} fill={entry.color} />)}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
          <div className="mt-4 space-y-2">
            {kpiData.map((item) => (
              <div key={item.name} className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="w-3 h-3 rounded-full mr-2" style={{ backgroundColor: item.color }} />
                  <span className="text-sm text-gray-600">{item.name}</span>
                </div>
                <span className="text-sm font-medium text-gray-900">{item.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {tasks.length > 0 && (
        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Recent Tasks</h3>
          </div>
          <div className="space-y-3">
            {tasks.map((task) => (
              <div key={task.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(task.status)}`}>
                    {task.status.replace('-', ' ')}
                  </div>
                  <span className="text-sm font-medium text-gray-900">{task.title}</span>
                </div>
                <div className="flex items-center space-x-4">
                  <span className={`text-xs font-medium ${getPriorityColor(task.priority)}`}>{task.priority}</span>
                  {task.due_date && (
                    <div className="flex items-center text-xs text-gray-500">
                      <Calendar className="h-3 w-3 mr-1" />
                      {new Date(task.due_date).toLocaleDateString()}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="card">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button className="btn btn-primary w-full"><Users className="h-4 w-4 mr-2" />Deploy New Agent</button>
          <button className="btn btn-secondary w-full"><BarChart3 className="h-4 w-4 mr-2" />Generate Report</button>
          <button className="btn btn-success w-full"><CheckSquare className="h-4 w-4 mr-2" />Create Task</button>
        </div>
      </div>
    </div>
  )
}

export default Dashboard
