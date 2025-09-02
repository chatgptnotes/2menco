import { useState } from 'react'
import { 
  TrendingUp, 
  TrendingDown, 
  Target, 
  DollarSign, 
  Users, 
  CheckCircle,
  AlertCircle,
  Clock,
  BarChart3,
  Calendar,
  Filter,
  Download
} from 'lucide-react'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, AreaChart, Area } from 'recharts'

interface KPI {
  id: string
  name: string
  current: number
  target: number
  unit: string
  trend: 'up' | 'down' | 'stable'
  change: number
  status: 'on-track' | 'at-risk' | 'critical'
  category: string
}

const KPIs = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  const [timeRange, setTimeRange] = useState<string>('30d')

  const kpis: KPI[] = [
    {
      id: 'revenue',
      name: 'Monthly Recurring Revenue (MRR)',
      current: 575000,
      target: 1000000,
      unit: 'AED',
      trend: 'up',
      change: 15.2,
      status: 'on-track',
      category: 'financial'
    },
    {
      id: 'leads',
      name: 'Lead Generation',
      current: 1250,
      target: 2000,
      unit: 'leads/month',
      trend: 'up',
      change: 8.7,
      status: 'on-track',
      category: 'marketing'
    },
    {
      id: 'conversion',
      name: 'Lead to Customer Conversion',
      current: 12.5,
      target: 15.0,
      unit: '%',
      trend: 'up',
      change: 2.1,
      status: 'at-risk',
      category: 'sales'
    },
    {
      id: 'churn',
      name: 'Customer Churn Rate',
      current: 3.2,
      target: 2.0,
      unit: '%',
      trend: 'down',
      change: -0.8,
      status: 'critical',
      category: 'customer'
    },
    {
      id: 'satisfaction',
      name: 'Customer Satisfaction (NPS)',
      current: 72,
      target: 80,
      unit: 'score',
      trend: 'up',
      change: 3.5,
      status: 'at-risk',
      category: 'customer'
    },
    {
      id: 'efficiency',
      name: 'Operational Efficiency',
      current: 78.5,
      target: 85.0,
      unit: '%',
      trend: 'up',
      change: 1.2,
      status: 'on-track',
      category: 'operations'
    }
  ]

  const categories = [
    { id: 'all', name: 'All KPIs', count: kpis.length },
    { id: 'financial', name: 'Financial', count: kpis.filter(k => k.category === 'financial').length },
    { id: 'marketing', name: 'Marketing', count: kpis.filter(k => k.category === 'marketing').length },
    { id: 'sales', name: 'Sales', count: kpis.filter(k => k.category === 'sales').length },
    { id: 'customer', name: 'Customer', count: kpis.filter(k => k.category === 'customer').length },
    { id: 'operations', name: 'Operations', count: kpis.filter(k => k.category === 'operations').length }
  ]

  const filteredKPIs = selectedCategory === 'all' 
    ? kpis 
    : kpis.filter(k => k.category === selectedCategory)

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'on-track': return 'text-success-600 bg-success-50'
      case 'at-risk': return 'text-warning-600 bg-warning-50'
      case 'critical': return 'text-danger-600 bg-danger-50'
      default: return 'text-gray-600 bg-gray-50'
    }
  }

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up': return <TrendingUp className="h-4 w-4 text-success-600" />
      case 'down': return <TrendingDown className="h-4 w-4 text-danger-600" />
      default: return <Clock className="h-4 w-4 text-gray-600" />
    }
  }

  const getProgressColor = (current: number, target: number) => {
    const percentage = (current / target) * 100
    if (percentage >= 80) return 'bg-success-500'
    if (percentage >= 60) return 'bg-warning-500'
    return 'bg-danger-500'
  }

  // Mock data for charts
  const revenueData = [
    { month: 'Jan', actual: 50000, target: 100000 },
    { month: 'Feb', actual: 75000, target: 100000 },
    { month: 'Mar', actual: 90000, target: 100000 },
    { month: 'Apr', actual: 120000, target: 100000 },
    { month: 'May', actual: 150000, target: 100000 },
    { month: 'Jun', actual: 180000, target: 100000 },
  ]

  const leadData = [
    { month: 'Jan', leads: 800, conversions: 96 },
    { month: 'Feb', leads: 950, conversions: 114 },
    { month: 'Mar', leads: 1100, conversions: 132 },
    { month: 'Apr', leads: 1200, conversions: 144 },
    { month: 'May', leads: 1300, conversions: 156 },
    { month: 'Jun', leads: 1250, conversions: 150 },
  ]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">KPIs & Metrics</h1>
          <p className="text-gray-600">Track your progress towards 1 million AED in 9 months</p>
        </div>
        <div className="flex items-center space-x-3">
          <button className="btn btn-secondary">
            <Download className="h-4 w-4 mr-2" />
            Export Report
          </button>
          <button className="btn btn-primary">
            <BarChart3 className="h-4 w-4 mr-2" />
            Add KPI
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="card">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div>
              <label className="label">Category</label>
              <select 
                value={selectedCategory} 
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="input w-40"
              >
                {categories.map(category => (
                  <option key={category.id} value={category.id}>
                    {category.name} ({category.count})
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="label">Time Range</label>
              <select 
                value={timeRange} 
                onChange={(e) => setTimeRange(e.target.value)}
                className="input w-32"
              >
                <option value="7d">7 days</option>
                <option value="30d">30 days</option>
                <option value="90d">90 days</option>
                <option value="1y">1 year</option>
              </select>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Filter className="h-4 w-4 text-gray-400" />
            <span className="text-sm text-gray-500">Advanced Filters</span>
          </div>
        </div>
      </div>

      {/* KPI Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredKPIs.map((kpi) => (
          <div key={kpi.id} className="card hover:shadow-lg transition-shadow">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">{kpi.name}</h3>
                <div className="flex items-center space-x-2 mt-1">
                  <div className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(kpi.status)}`}>
                    {kpi.status.replace('-', ' ')}
                  </div>
                  {getTrendIcon(kpi.trend)}
                  <span className={`text-xs font-medium ${
                    kpi.trend === 'up' ? 'text-success-600' : 
                    kpi.trend === 'down' ? 'text-danger-600' : 'text-gray-600'
                  }`}>
                    {kpi.change > 0 ? '+' : ''}{kpi.change}%
                  </span>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-end justify-between">
                <div>
                  <p className="text-2xl font-bold text-gray-900">
                    {kpi.current.toLocaleString()}
                  </p>
                  <p className="text-sm text-gray-500">{kpi.unit}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-500">Target</p>
                  <p className="text-lg font-semibold text-gray-700">
                    {kpi.target.toLocaleString()}
                  </p>
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between text-sm mb-1">
                  <span className="text-gray-500">Progress</span>
                  <span className="font-medium">
                    {Math.round((kpi.current / kpi.target) * 100)}%
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className={`h-2 rounded-full ${getProgressColor(kpi.current, kpi.target)}`}
                    style={{ width: `${Math.min((kpi.current / kpi.target) * 100, 100)}%` }}
                  />
                </div>
              </div>
            </div>

            <div className="mt-4 pt-4 border-t border-gray-200">
              <button className="btn btn-secondary w-full text-sm">
                <BarChart3 className="h-4 w-4 mr-2" />
                View Details
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Revenue Chart */}
        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Revenue Progress</h3>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={revenueData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Area type="monotone" dataKey="actual" stackId="1" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.6} />
              <Area type="monotone" dataKey="target" stackId="1" stroke="#ef4444" fill="#ef4444" fillOpacity={0.3} />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Lead Generation Chart */}
        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Lead Generation & Conversion</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={leadData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="leads" fill="#3b82f6" />
              <Bar dataKey="conversions" fill="#22c55e" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Summary Stats */}
      <div className="card">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Performance Summary</h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-success-600">3</div>
            <div className="text-sm text-gray-500">On Track</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-warning-600">2</div>
            <div className="text-sm text-gray-500">At Risk</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-danger-600">1</div>
            <div className="text-sm text-gray-500">Critical</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-primary-600">57.5%</div>
            <div className="text-sm text-gray-500">Overall Progress</div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default KPIs
