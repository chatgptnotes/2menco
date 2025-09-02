import { useState } from 'react'
import { 
  BarChart3, 
  TrendingUp, 
  Users, 
  DollarSign, 
  Calendar,
  Download,
  Filter,
  RefreshCw,
  Eye,
  EyeOff
} from 'lucide-react'
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  BarChart, 
  Bar, 
  AreaChart, 
  Area,
  PieChart,
  Pie,
  Cell,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar
} from 'recharts'

const Analytics = () => {
  const [timeRange, setTimeRange] = useState('90d')
  const [showRevenue, setShowRevenue] = useState(true)
  const [showLeads, setShowLeads] = useState(true)
  const [showConversion, setShowConversion] = useState(true)

  // Mock data for charts
  const revenueData = [
    { month: 'Jan', revenue: 50000, target: 100000, leads: 800, conversions: 96 },
    { month: 'Feb', revenue: 75000, target: 100000, leads: 950, conversions: 114 },
    { month: 'Mar', revenue: 90000, target: 100000, leads: 1100, conversions: 132 },
    { month: 'Apr', revenue: 120000, target: 100000, leads: 1200, conversions: 144 },
    { month: 'May', revenue: 150000, target: 100000, leads: 1300, conversions: 156 },
    { month: 'Jun', revenue: 180000, target: 100000, leads: 1250, conversions: 150 },
    { month: 'Jul', revenue: 210000, target: 100000, leads: 1400, conversions: 168 },
    { month: 'Aug', revenue: 240000, target: 100000, leads: 1500, conversions: 180 },
    { month: 'Sep', revenue: 270000, target: 100000, leads: 1600, conversions: 192 }
  ]

  const kpiData = [
    { name: 'Revenue Growth', value: 85, target: 100, color: '#22c55e' },
    { name: 'Lead Generation', value: 78, target: 100, color: '#3b82f6' },
    { name: 'Conversion Rate', value: 92, target: 100, color: '#f59e0b' },
    { name: 'Customer Satisfaction', value: 88, target: 100, color: '#8b5cf6' },
    { name: 'Operational Efficiency', value: 82, target: 100, color: '#ef4444' }
  ]

  const agentPerformance = [
    { agent: 'Digital CMO', leads: 1250, revenue: 180000, efficiency: 94 },
    { agent: 'Digital CRO', leads: 1100, revenue: 165000, efficiency: 87 },
    { agent: 'Digital CFO', leads: 800, revenue: 120000, efficiency: 92 },
    { agent: 'Digital COO', leads: 950, revenue: 142500, efficiency: 78 },
    { agent: 'Digital CTO', leads: 700, revenue: 105000, efficiency: 96 },
    { agent: 'Digital CXO', leads: 900, revenue: 135000, efficiency: 65 }
  ]

  const funnelData = [
    { stage: 'Awareness', visitors: 10000, percentage: 100 },
    { stage: 'Interest', visitors: 6000, percentage: 60 },
    { stage: 'Consideration', visitors: 3000, percentage: 30 },
    { stage: 'Intent', visitors: 1500, percentage: 15 },
    { stage: 'Evaluation', visitors: 750, percentage: 7.5 },
    { stage: 'Purchase', visitors: 375, percentage: 3.75 }
  ]

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82CA9D']

  const getProgressColor = (value: number, target: number) => {
    const percentage = (value / target) * 100
    if (percentage >= 80) return 'text-success-600'
    if (percentage >= 60) return 'text-warning-600'
    return 'text-danger-600'
  }

  const exportData = () => {
    // Mock export functionality
    const dataStr = JSON.stringify(revenueData, null, 2)
    const dataBlob = new Blob([dataStr], { type: 'application/json' })
    const url = URL.createObjectURL(dataBlob)
    const link = document.createElement('a')
    link.href = url
    link.download = 'bettroi-analytics.json'
    link.click()
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Advanced Analytics</h1>
          <p className="text-gray-600">Comprehensive business intelligence and performance insights</p>
        </div>
        <div className="flex items-center space-x-3">
          <button className="btn btn-secondary">
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </button>
          <button className="btn btn-primary" onClick={exportData}>
            <Download className="h-4 w-4 mr-2" />
            Export
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="card">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div>
              <label className="label">Time Range</label>
              <select 
                value={timeRange} 
                onChange={(e) => setTimeRange(e.target.value)}
                className="input w-32"
              >
                <option value="30d">30 days</option>
                <option value="90d">90 days</option>
                <option value="6m">6 months</option>
                <option value="1y">1 year</option>
              </select>
            </div>
            
            <div className="flex items-center space-x-4">
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={showRevenue}
                  onChange={(e) => setShowRevenue(e.target.checked)}
                  className="h-4 w-4 text-primary-600"
                />
                <span className="text-sm text-gray-700">Revenue</span>
              </label>
              
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={showLeads}
                  onChange={(e) => setShowLeads(e.target.checked)}
                  className="h-4 w-4 text-primary-600"
                />
                <span className="text-sm text-gray-700">Leads</span>
              </label>
              
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={showConversion}
                  onChange={(e) => setShowConversion(e.target.checked)}
                  className="h-4 w-4 text-primary-600"
                />
                <span className="text-sm text-gray-700">Conversion</span>
              </label>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <Filter className="h-4 w-4 text-gray-400" />
            <span className="text-sm text-gray-500">Advanced Filters</span>
          </div>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="card text-center">
          <div className="text-2xl font-bold text-success-600">AED 1,245,000</div>
          <div className="text-sm text-gray-500">Total Revenue</div>
          <div className="text-xs text-success-600 mt-1">+15.2% vs target</div>
        </div>
        <div className="card text-center">
          <div className="text-2xl font-bold text-primary-600">9,200</div>
          <div className="text-sm text-gray-500">Total Leads</div>
          <div className="text-xs text-primary-600 mt-1">+8.7% vs last period</div>
        </div>
        <div className="card text-center">
          <div className="text-2xl font-bold text-warning-600">12.5%</div>
          <div className="text-sm text-gray-500">Conversion Rate</div>
          <div className="text-xs text-warning-600 mt-1">+2.1% vs target</div>
        </div>
        <div className="card text-center">
          <div className="text-2xl font-bold text-purple-600">85.3%</div>
          <div className="text-sm text-gray-500">Goal Achievement</div>
          <div className="text-xs text-purple-600 mt-1">On track for 1M AED</div>
        </div>
      </div>

      {/* Main Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Revenue & Performance Chart */}
        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Revenue & Performance Trends</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={revenueData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              {showRevenue && (
                <>
                  <Line type="monotone" dataKey="revenue" stroke="#3b82f6" strokeWidth={3} name="Revenue" />
                  <Line type="monotone" dataKey="target" stroke="#ef4444" strokeWidth={2} strokeDasharray="5 5" name="Target" />
                </>
              )}
              {showLeads && (
                <Line type="monotone" dataKey="leads" stroke="#22c55e" strokeWidth={2} name="Leads" yAxisId={1} />
              )}
              {showConversion && (
                <Line type="monotone" dataKey="conversions" stroke="#f59e0b" strokeWidth={2} name="Conversions" yAxisId={1} />
              )}
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* KPI Radar Chart */}
        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">KPI Performance Overview</h3>
          <ResponsiveContainer width="100%" height={300}>
            <RadarChart data={kpiData}>
              <PolarGrid />
              <PolarAngleAxis dataKey="name" />
              <PolarRadiusAxis angle={90} domain={[0, 100]} />
              <Radar
                name="Current"
                dataKey="value"
                stroke="#3b82f6"
                fill="#3b82f6"
                fillOpacity={0.3}
              />
              <Radar
                name="Target"
                dataKey="target"
                stroke="#ef4444"
                fill="#ef4444"
                fillOpacity={0.1}
              />
              <Tooltip />
            </RadarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Agent Performance */}
      <div className="card">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Digital Agent Performance</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={agentPerformance}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="agent" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="revenue" fill="#3b82f6" name="Revenue (AED)" />
            <Bar dataKey="leads" fill="#22c55e" name="Leads Generated" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Conversion Funnel */}
      <div className="card">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Customer Journey Funnel</h3>
        <div className="grid grid-cols-6 gap-2">
          {funnelData.map((stage, index) => (
            <div key={stage.stage} className="text-center">
              <div className="bg-gradient-to-t from-primary-600 to-primary-400 text-white p-4 rounded-t-lg">
                <div className="text-lg font-bold">{stage.percentage}%</div>
                <div className="text-xs">{stage.visitors.toLocaleString()}</div>
              </div>
              <div className="bg-gray-100 p-2 rounded-b-lg">
                <div className="text-xs font-medium text-gray-700">{stage.stage}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Detailed Metrics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* KPI Details */}
        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">KPI Details</h3>
          <div className="space-y-4">
            {kpiData.map((kpi, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div 
                    className="w-3 h-3 rounded-full" 
                    style={{ backgroundColor: kpi.color }}
                  />
                  <span className="text-sm font-medium text-gray-900">{kpi.name}</span>
                </div>
                <div className="text-right">
                  <div className={`text-sm font-bold ${getProgressColor(kpi.value, kpi.target)}`}>
                    {kpi.value}%
                  </div>
                  <div className="text-xs text-gray-500">Target: {kpi.target}%</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Agent Efficiency */}
        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Agent Efficiency</h3>
          <div className="space-y-4">
            {agentPerformance.map((agent, index) => (
              <div key={index} className="flex items-center justify-between">
                <div>
                  <div className="text-sm font-medium text-gray-900">{agent.agent}</div>
                  <div className="text-xs text-gray-500">
                    {agent.leads} leads • AED {agent.revenue.toLocaleString()}
                  </div>
                </div>
                <div className="text-right">
                  <div className={`text-sm font-bold ${
                    agent.efficiency >= 90 ? 'text-success-600' :
                    agent.efficiency >= 80 ? 'text-warning-600' : 'text-danger-600'
                  }`}>
                    {agent.efficiency}%
                  </div>
                  <div className="text-xs text-gray-500">Efficiency</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Insights & Recommendations */}
      <div className="card">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">AI Insights & Recommendations</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div className="p-4 bg-success-50 border border-success-200 rounded-lg">
              <h4 className="font-medium text-success-900 mb-2">🚀 Revenue Growth Opportunity</h4>
              <p className="text-sm text-success-700">
                Your Digital CMO agent is performing exceptionally well. Consider increasing its budget allocation by 20% to accelerate lead generation.
              </p>
            </div>
            
            <div className="p-4 bg-warning-50 border border-warning-200 rounded-lg">
              <h4 className="font-medium text-warning-900 mb-2">⚠️ Conversion Rate Alert</h4>
              <p className="text-sm text-warning-700">
                Lead quality has improved but conversion rate needs attention. Review your Digital CRO agent's sales process optimization.
              </p>
            </div>
          </div>
          
          <div className="space-y-4">
            <div className="p-4 bg-info-50 border border-info-200 rounded-lg">
              <h4 className="font-medium text-info-900 mb-2">💡 Performance Insight</h4>
              <p className="text-sm text-info-700">
                Customer satisfaction is high at 88%. Focus on Digital CXO agent to maintain this level while scaling operations.
              </p>
            </div>
            
            <div className="p-4 bg-purple-50 border border-purple-200 rounded-lg">
              <h4 className="font-medium text-purple-900 mb-2">🎯 Goal Achievement</h4>
              <p className="text-sm text-purple-700">
                You're 85.3% toward your 1M AED goal. At current pace, you'll reach it in 7.8 months instead of 9.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Analytics
