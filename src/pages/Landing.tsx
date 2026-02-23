import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  Zap, ArrowRight, Users, DollarSign, BarChart3, CheckSquare, Settings, FileText,
  Check, Star, Shield, Globe, Clock, Bot
} from 'lucide-react'

const agents = [
  { type: 'CMO', title: 'AI CMO Agent', desc: 'Automated lead generation, content marketing, SEO campaigns & multi-channel outreach — your AI CMO software runs 24/7.', icon: Users, color: 'from-blue-500 to-cyan-500', glow: 'shadow-blue-500/20' },
  { type: 'CRO', title: 'AI CRO Agent', desc: 'Smart deal pipeline management, conversion optimization & revenue forecasting to close more deals faster.', icon: DollarSign, color: 'from-emerald-500 to-green-500', glow: 'shadow-emerald-500/20' },
  { type: 'CFO', title: 'AI CFO Agent', desc: 'Automated invoicing, claims processing, cash-flow forecasting & zero-risk revenue recovery for healthcare.', icon: BarChart3, color: 'from-violet-500 to-purple-500', glow: 'shadow-violet-500/20' },
  { type: 'COO', title: 'AI COO Agent', desc: 'Workflow automation, task orchestration, vendor management & operational efficiency optimization.', icon: CheckSquare, color: 'from-orange-500 to-amber-500', glow: 'shadow-orange-500/20' },
  { type: 'CTO', title: 'AI CTO Agent', desc: 'Technology stack management, system monitoring, architecture decisions & infrastructure automation.', icon: Settings, color: 'from-indigo-500 to-blue-500', glow: 'shadow-indigo-500/20' },
  { type: 'CXO', title: 'AI CXO Agent', desc: 'Customer satisfaction tracking, support automation, NPS management & experience optimization.', icon: FileText, color: 'from-pink-500 to-rose-500', glow: 'shadow-pink-500/20' },
]

const pricing = [
  {
    name: 'Starter', price: 49, period: '/mo', desc: 'Perfect for solo founders',
    features: ['2 AI Agents', '5 KPI Tracking', 'Basic Analytics', 'Email Support', '100 Leads'],
    cta: 'Start Free Trial', highlight: false,
  },
  {
    name: 'Pro', price: 149, period: '/mo', desc: 'For growing businesses',
    features: ['All 6 AI Agents', 'Unlimited KPIs', 'Advanced Analytics', 'Priority Support', 'Unlimited Leads', 'Custom Dashboards', 'API Access'],
    cta: 'Get Started', highlight: true,
  },
  {
    name: 'Enterprise', price: 499, period: '/mo', desc: 'For scaling organizations',
    features: ['Everything in Pro', 'Custom AI Training', 'Dedicated Account Manager', 'SLA Guarantee', 'White Label', 'Multi-team Access', 'On-premise Option'],
    cta: 'Contact Sales', highlight: false,
  },
]

const Landing = () => {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      {/* Nav */}
      <nav className="fixed top-0 w-full z-50 bg-gray-950/80 backdrop-blur-xl border-b border-white/[0.04]">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-violet-600 rounded-lg flex items-center justify-center">
              <Zap className="w-4 h-4 text-white" />
            </div>
            <span className="font-bold text-lg tracking-tight">BETTROI</span>
          </div>
          <div className="flex items-center gap-4">
            <button onClick={() => navigate('/login')} className="text-sm text-gray-400 hover:text-white transition-colors">Sign In</button>
            <button onClick={() => navigate('/signup')} className="btn btn-primary text-sm">Get Started</button>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="pt-32 pb-20 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-medium mb-8">
              <Bot className="h-3 w-3" /> Powered by 6 AI Agents
            </div>
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-black tracking-tight leading-[1.1] mb-6">
              Your AI-Powered<br />
              <span className="text-gradient">Business Operating</span><br />
              System
            </h1>
            <p className="text-lg sm:text-xl text-gray-400 max-w-2xl mx-auto mb-10 leading-relaxed">
              The AI business operating system with 6 autonomous agents for SMBs. Automate lead generation, sales, invoicing, operations, and customer experience — all from one business automation platform.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={() => navigate('/dashboard')}
                className="btn bg-white text-gray-900 hover:bg-gray-100 text-base px-8 py-3 font-semibold"
              >
                Launch Dashboard <ArrowRight className="h-5 w-5 ml-2" />
              </button>
              <button
                onClick={() => navigate('/signup')}
                className="btn btn-secondary text-base px-8 py-3"
              >
                Start Free Trial
              </button>
            </div>
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="grid grid-cols-2 sm:grid-cols-4 gap-6 mt-20"
          >
            {[
              { value: '6', label: 'AI Agents' },
              { value: '24/7', label: 'Autonomous' },
              { value: '1M', label: 'AED Target' },
              { value: '9mo', label: 'Timeline' },
            ].map(s => (
              <div key={s.label}>
                <p className="text-3xl sm:text-4xl font-black text-gradient">{s.value}</p>
                <p className="text-sm text-gray-500 mt-1">{s.label}</p>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Agents Showcase */}
      <section className="py-24 px-6">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">6 AI Agents for Business — Your Digital Executive Team</h2>
            <p className="text-gray-500 max-w-xl mx-auto">AI agents for business that work 24/7 — automated business management from marketing to finance</p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {agents.map((agent, i) => (
              <motion.div
                key={agent.type}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                className="card-hover group cursor-pointer"
              >
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${agent.color} flex items-center justify-center text-white mb-4 shadow-lg ${agent.glow}`}>
                  <agent.icon className="h-6 w-6" />
                </div>
                <h3 className="text-base font-semibold text-white mb-1 group-hover:text-blue-400 transition-colors">{agent.title}</h3>
                <p className="text-sm text-gray-500">{agent.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-24 px-6 bg-white/[0.01]">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">Enterprise-Grade Platform</h2>
            <p className="text-gray-500">Everything you need to run a digital-first business</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { icon: BarChart3, title: 'Real-time KPIs', desc: 'Track every metric that matters' },
              { icon: Shield, title: 'Enterprise Security', desc: 'GDPR, PDPL compliant' },
              { icon: Globe, title: 'Multi-region', desc: 'Deploy anywhere globally' },
              { icon: Clock, title: '24/7 Automation', desc: 'Never stops working' },
            ].map((f, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.05 }} className="card text-center">
                <f.icon className="h-8 w-8 text-blue-400 mx-auto mb-3" />
                <h3 className="text-sm font-semibold text-white mb-1">{f.title}</h3>
                <p className="text-xs text-gray-500">{f.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section className="py-24 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">Simple Pricing</h2>
            <p className="text-gray-500">Start free, scale as you grow</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {pricing.map((plan, i) => (
              <motion.div
                key={plan.name}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className={`rounded-2xl border p-6 ${
                  plan.highlight
                    ? 'border-blue-500/30 bg-blue-500/5 shadow-lg shadow-blue-500/10'
                    : 'border-white/[0.06] bg-white/[0.02]'
                }`}
              >
                {plan.highlight && (
                  <div className="flex items-center gap-1 text-xs font-medium text-blue-400 mb-4">
                    <Star className="h-3 w-3" /> Most Popular
                  </div>
                )}
                <h3 className="text-lg font-bold text-white">{plan.name}</h3>
                <p className="text-xs text-gray-500 mb-4">{plan.desc}</p>
                <div className="flex items-baseline gap-1 mb-6">
                  <span className="text-4xl font-black text-white">${plan.price}</span>
                  <span className="text-gray-500 text-sm">{plan.period}</span>
                </div>
                <ul className="space-y-2 mb-6">
                  {plan.features.map(f => (
                    <li key={f} className="flex items-center gap-2 text-sm text-gray-400">
                      <Check className="h-4 w-4 text-emerald-400 flex-shrink-0" />{f}
                    </li>
                  ))}
                </ul>
                <button
                  onClick={() => navigate('/signup')}
                  className={`w-full py-2.5 rounded-lg text-sm font-semibold transition-all ${
                    plan.highlight ? 'bg-blue-600 text-white hover:bg-blue-500' : 'bg-white/5 text-gray-300 hover:bg-white/10'
                  }`}
                >
                  {plan.cta}
                </button>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 px-6">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">Ready to Automate Your Business?</h2>
          <p className="text-gray-500 mb-8 text-lg">Join SMBs using the AI business operating system to scale faster with automated business management</p>
          <button
            onClick={() => navigate('/dashboard')}
            className="btn bg-white text-gray-900 hover:bg-gray-100 text-base px-8 py-3 font-semibold"
          >
            Launch Dashboard <ArrowRight className="h-5 w-5 ml-2" />
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/[0.04] py-8 px-6">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Zap className="h-4 w-4 text-blue-400" />
            <span className="text-sm text-gray-500">© 2025 BETTROI BOS</span>
          </div>
          <p className="text-xs text-gray-600">Digital Business Operating System · 2men.co</p>
        </div>
      </footer>
    </div>
  )
}

export default Landing
