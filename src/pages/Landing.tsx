import { useNavigate } from 'react-router-dom'
import { 
  Rocket, 
  Target, 
  Users, 
  Clock, 
  CheckCircle, 
  Shield, 
  BarChart3, 
  Settings,
  ArrowRight,
  Play
} from 'lucide-react'

const Landing = () => {
  const navigate = useNavigate()

  const handleLaunchDashboard = () => {
    navigate('/dashboard')
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-secondary-50">
      {/* Header */}
      <header className="text-center py-20 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="mx-auto h-24 w-24 bg-gradient-to-r from-primary-600 to-secondary-600 rounded-full flex items-center justify-center mb-8">
            <Rocket className="h-12 w-12 text-white" />
          </div>
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
            🚀 BETTROI BOS
          </h1>
          <p className="text-xl md:text-2xl text-gray-600 mb-8">
            Digital Business Operating System
          </p>
          
          {/* Mission Statement */}
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-xl border border-gray-200 mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              🎯 Your Mission: 1 Million in 9 Months
            </h2>
            <p className="text-lg md:text-xl text-gray-700 leading-relaxed">
              Two humans + Digital robot team = Digital Empire! Complete system to automate your business 
              and scale to 1 million AED in 9 months.
            </p>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={handleLaunchDashboard}
              className="btn btn-primary text-lg px-8 py-4 flex items-center justify-center space-x-2 hover:scale-105 transition-transform"
            >
              <Play className="h-6 w-6" />
              <span>Launch Dashboard</span>
              <ArrowRight className="h-6 w-6" />
            </button>
            <a
              href="https://github.com/chatgptnotes/2menco.git"
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-secondary text-lg px-8 py-4 border-2 border-primary-600 text-primary-600 hover:bg-primary-600 hover:text-white transition-colors"
            >
              📚 View Complete System
            </a>
          </div>
        </div>
      </header>

      {/* Stats Grid */}
      <section className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="card text-center hover:shadow-lg transition-shadow">
              <div className="text-4xl font-bold text-primary-600 mb-2">1M</div>
              <div className="text-gray-600 font-medium">Target Revenue (AED)</div>
            </div>
            <div className="card text-center hover:shadow-lg transition-shadow">
              <div className="text-4xl font-bold text-secondary-600 mb-2">9</div>
              <div className="text-gray-600 font-medium">Months Timeline</div>
            </div>
            <div className="card text-center hover:shadow-lg transition-shadow">
              <div className="text-4xl font-bold text-success-600 mb-2">2</div>
              <div className="text-gray-600 font-medium">Human Leaders</div>
            </div>
            <div className="card text-center hover:shadow-lg transition-shadow">
              <div className="text-4xl font-bold text-warning-600 mb-2">24/7</div>
              <div className="text-gray-600 font-medium">Robot Team</div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center text-gray-900 mb-16">
            Complete Digital Empire Building System
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Digital Robot Team */}
            <div className="card hover:shadow-lg transition-shadow">
              <div className="text-center mb-4">
                <Users className="h-16 w-16 text-primary-600 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-gray-900 mb-3">🤖 Digital Robot Team</h3>
              </div>
              <p className="text-gray-600 mb-4">Complete automation with intelligent agents:</p>
              <ul className="space-y-2 text-sm text-gray-600">
                <li className="flex items-center space-x-2">
                  <CheckCircle className="h-4 w-4 text-success-600 flex-shrink-0" />
                  <span>Digital CMO - Marketing & Lead Generation</span>
                </li>
                <li className="flex items-center space-x-2">
                  <CheckCircle className="h-4 w-4 text-success-600 flex-shrink-0" />
                  <span>Digital CRO - Sales & Revenue Optimization</span>
                </li>
                <li className="flex items-center space-x-2">
                  <CheckCircle className="h-4 w-4 text-success-600 flex-shrink-0" />
                  <span>Digital CFO - Financial Management</span>
                </li>
                <li className="flex items-center space-x-2">
                  <CheckCircle className="h-4 w-4 text-success-600 flex-shrink-0" />
                  <span>Digital COO - Operations & Execution</span>
                </li>
                <li className="flex items-center space-x-2">
                  <CheckCircle className="h-4 w-4 text-success-600 flex-shrink-0" />
                  <span>Digital CTO - Technology & Architecture</span>
                </li>
                <li className="flex items-center space-x-2">
                  <CheckCircle className="h-4 w-4 text-success-600 flex-shrink-0" />
                  <span>Digital CXO - Customer Experience</span>
                </li>
              </ul>
            </div>

            {/* KPI-First System */}
            <div className="card hover:shadow-lg transition-shadow">
              <div className="text-center mb-4">
                <BarChart3 className="h-16 w-16 text-secondary-600 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-gray-900 mb-3">📊 KPI-First System</h3>
              </div>
              <p className="text-gray-600 mb-4">Every action drives measurable results:</p>
              <ul className="space-y-2 text-sm text-gray-600">
                <li className="flex items-center space-x-2">
                  <CheckCircle className="h-4 w-4 text-success-600 flex-shrink-0" />
                  <span>Pipeline Growth & Lead Generation</span>
                </li>
                <li className="flex items-center space-x-2">
                  <CheckCircle className="h-4 w-4 text-success-600 flex-shrink-0" />
                  <span>Win Rate & Conversion Optimization</span>
                </li>
                <li className="flex items-center space-x-2">
                  <CheckCircle className="h-4 w-4 text-success-600 flex-shrink-0" />
                  <span>MRR/ARR Revenue Tracking</span>
                </li>
                <li className="flex items-center space-x-2">
                  <CheckCircle className="h-4 w-4 text-success-600 flex-shrink-0" />
                  <span>Customer Satisfaction (NPS/CSAT)</span>
                </li>
                <li className="flex items-center space-x-2">
                  <CheckCircle className="h-4 w-4 text-success-600 flex-shrink-0" />
                  <span>Cash Flow & Runway Management</span>
                </li>
                <li className="flex items-center space-x-2">
                  <CheckCircle className="h-4 w-4 text-success-600 flex-shrink-0" />
                  <span>Real-time Performance Monitoring</span>
                </li>
              </ul>
            </div>

            {/* Enterprise Security */}
            <div className="card hover:shadow-lg transition-shadow">
              <div className="text-center mb-4">
                <Shield className="h-16 w-16 text-success-600 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-gray-900 mb-3">🔐 Enterprise Security</h3>
              </div>
              <p className="text-gray-600 mb-4">Built with security and compliance:</p>
              <ul className="space-y-2 text-sm text-gray-600">
                <li className="flex items-center space-x-2">
                  <CheckCircle className="h-4 w-4 text-success-600 flex-shrink-0" />
                  <span>UAE PDPL Compliance</span>
                </li>
                <li className="flex items-center space-x-2">
                  <CheckCircle className="h-4 w-4 text-success-600 flex-shrink-0" />
                  <span>India DPDP Compliance</span>
                </li>
                <li className="flex items-center space-x-2">
                  <CheckCircle className="h-4 w-4 text-success-600 flex-shrink-0" />
                  <span>EU GDPR Compliance</span>
                </li>
                <li className="flex items-center space-x-2">
                  <CheckCircle className="h-4 w-4 text-success-600 flex-shrink-0" />
                  <span>Role-Based Access Control</span>
                </li>
                <li className="flex items-center space-x-2">
                  <CheckCircle className="h-4 w-4 text-success-600 flex-shrink-0" />
                  <span>Data Residency Management</span>
                </li>
                <li className="flex items-center space-x-2">
                  <CheckCircle className="h-4 w-4 text-success-600 flex-shrink-0" />
                  <span>24/7 Security Monitoring</span>
                </li>
              </ul>
            </div>

            {/* Command Center Dashboard */}
            <div className="card hover:shadow-lg transition-shadow">
              <div className="text-center mb-4">
                <Settings className="h-16 w-16 text-warning-600 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-gray-900 mb-3">🎛️ Command Center Dashboard</h3>
              </div>
              <p className="text-gray-600 mb-4">One screen to control everything:</p>
              <ul className="space-y-2 text-sm text-gray-600">
                <li className="flex items-center space-x-2">
                  <CheckCircle className="h-4 w-4 text-success-600 flex-shrink-0" />
                  <span>Real-time KPI Monitoring</span>
                </li>
                <li className="flex items-center space-x-2">
                  <CheckCircle className="h-4 w-4 text-success-600 flex-shrink-0" />
                  <span>Agent Performance Tracking</span>
                </li>
                <li className="flex items-center space-x-2">
                  <CheckCircle className="h-4 w-4 text-success-600 flex-shrink-0" />
                  <span>Incident & Alert Management</span>
                </li>
                <li className="flex items-center space-x-2">
                  <CheckCircle className="h-4 w-4 text-success-600 flex-shrink-0" />
                  <span>Financial Dashboard</span>
                </li>
                <li className="flex items-center space-x-2">
                  <CheckCircle className="h-4 w-4 text-success-600 flex-shrink-0" />
                  <span>Task Management System</span>
                </li>
                <li className="flex items-center space-x-2">
                  <CheckCircle className="h-4 w-4 text-success-600 flex-shrink-0" />
                  <span>Automated Reporting</span>
                </li>
              </ul>
            </div>

            {/* Complete Documentation */}
            <div className="card hover:shadow-lg transition-shadow">
              <div className="text-center mb-4">
                <Target className="h-16 w-16 text-info-600 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-gray-900 mb-3">📋 Complete Documentation</h3>
              </div>
              <p className="text-gray-600 mb-4">Everything you need to succeed:</p>
              <ul className="space-y-2 text-sm text-gray-600">
                <li className="flex items-center space-x-2">
                  <CheckCircle className="h-4 w-4 text-success-600 flex-shrink-0" />
                  <span>9-Month Million Dollar Plan</span>
                </li>
                <li className="flex items-center space-x-2">
                  <CheckCircle className="h-4 w-4 text-success-600 flex-shrink-0" />
                  <span>Standard Operating Procedures</span>
                </li>
                <li className="flex items-center space-x-2">
                  <CheckCircle className="h-4 w-4 text-success-600 flex-shrink-0" />
                  <span>Agent Configuration Templates</span>
                </li>
                <li className="flex items-center space-x-2">
                  <CheckCircle className="h-4 w-4 text-success-600 flex-shrink-0" />
                  <span>Task Contract System</span>
                </li>
                <li className="flex items-center space-x-2">
                  <CheckCircle className="h-4 w-4 text-success-600 flex-shrink-0" />
                  <span>Quick Start Guide</span>
                </li>
                <li className="flex items-center space-x-2">
                  <CheckCircle className="h-4 w-4 text-success-600 flex-shrink-0" />
                  <span>Acronyms & Glossary</span>
                </li>
              </ul>
            </div>

            {/* Scalable Architecture */}
            <div className="card hover:shadow-lg transition-shadow">
              <div className="text-center mb-4">
                <Rocket className="h-16 w-16 text-purple-600 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-gray-900 mb-3">🚀 Scalable Architecture</h3>
              </div>
              <p className="text-gray-600 mb-4">Grows with your business:</p>
              <ul className="space-y-2 text-sm text-gray-600">
                <li className="flex items-center space-x-2">
                  <CheckCircle className="h-4 w-4 text-success-600 flex-shrink-0" />
                  <span>Modular Agent System</span>
                </li>
                <li className="flex items-center space-x-2">
                  <CheckCircle className="h-4 w-4 text-success-600 flex-shrink-0" />
                  <span>Cloud-Native Infrastructure</span>
                </li>
                <li className="flex items-center space-x-2">
                  <CheckCircle className="h-4 w-4 text-success-600 flex-shrink-0" />
                  <span>Auto-Scaling Capabilities</span>
                </li>
                <li className="flex items-center space-x-2">
                  <CheckCircle className="h-4 w-4 text-success-600 flex-shrink-0" />
                  <span>Multi-Region Deployment</span>
                </li>
                <li className="flex items-center space-x-2">
                  <CheckCircle className="h-4 w-4 text-success-600 flex-shrink-0" />
                  <span>Continuous Integration/Deployment</span>
                </li>
                <li className="flex items-center space-x-2">
                  <CheckCircle className="h-4 w-4 text-success-600 flex-shrink-0" />
                  <span>Performance Optimization</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="py-20 px-4 bg-gradient-to-r from-primary-600 to-secondary-600">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            Ready to Build Your Digital Empire?
          </h2>
          <p className="text-xl text-white/90 mb-8 leading-relaxed">
            Start your journey to 1 million in 9 months with the complete BETTROI BOS system. 
            Launch the dashboard now and begin building your digital empire!
          </p>
          <button
            onClick={handleLaunchDashboard}
            className="btn bg-white text-primary-600 hover:bg-gray-100 text-lg px-8 py-4 flex items-center justify-center space-x-2 mx-auto hover:scale-105 transition-transform"
          >
            <Play className="h-6 w-6" />
            <span>Launch Dashboard Now</span>
            <ArrowRight className="h-6 w-6" />
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-4 text-center text-gray-600">
        <div className="max-w-4xl mx-auto">
          <p className="mb-4">© 2025 BETTROI BOS - Digital Business Operating System</p>
          <p className="mb-4">Owner: BT (Biji Tharakan Thomas) | Version: 1.0 | Timezone: Asia/Dubai</p>
          <div className="flex flex-wrap justify-center gap-4 text-sm">
            <a 
              href="https://github.com/chatgptnotes/2menco.git" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-primary-600 hover:text-primary-700 underline"
            >
              GitHub Repository
            </a>
            <a 
              href="https://github.com/chatgptnotes/2menco/blob/main/docs/million-dollar-plan.md" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-primary-600 hover:text-primary-700 underline"
            >
              Million Dollar Plan
            </a>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default Landing
