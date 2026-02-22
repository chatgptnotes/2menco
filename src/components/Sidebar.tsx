import { NavLink } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  LayoutDashboard, Users, BarChart3, CheckSquare, FileText, Settings,
  Target, TrendingUp, HelpCircle, LogOut, Zap, UserCircle, Menu, X, ChevronRight,
  Mail, Briefcase
} from 'lucide-react'

const navigation = [
  { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { name: 'Agents', href: '/dashboard/agents', icon: Users },
  { name: 'Emails', href: '/dashboard/emails', icon: Mail },
  { name: 'CRM', href: '/dashboard/crm', icon: Briefcase },
  { name: 'KPIs', href: '/dashboard/kpis', icon: BarChart3 },
  { name: 'Leads', href: '/dashboard/leads', icon: UserCircle },
  { name: 'Analytics', href: '/dashboard/analytics', icon: TrendingUp },
  { name: 'Tasks', href: '/dashboard/tasks', icon: CheckSquare },
  { name: 'Documents', href: '/dashboard/documents', icon: FileText },
  { name: 'Settings', href: '/dashboard/settings', icon: Settings },
  { name: 'Help', href: '/dashboard/help', icon: HelpCircle },
]

const Sidebar = () => {
  const { user, logout } = useAuth()
  const [mobileOpen, setMobileOpen] = useState(false)

  const nav = (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className="flex items-center h-16 px-6 border-b border-white/[0.06]">
        <div className="flex items-center space-x-3">
          <div className="w-9 h-9 bg-gradient-to-br from-blue-500 to-violet-600 rounded-lg flex items-center justify-center shadow-lg shadow-blue-500/20">
            <Zap className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-base font-bold text-white tracking-tight">BETTROI</h1>
            <p className="text-[10px] text-gray-500 uppercase tracking-widest">Business OS</p>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        {navigation.map((item) => (
          <NavLink
            key={item.name}
            to={item.href}
            end={item.href === '/dashboard'}
            onClick={() => setMobileOpen(false)}
            className={({ isActive }) =>
              `group flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-all duration-150 ${
                isActive
                  ? 'bg-white/[0.08] text-white'
                  : 'text-gray-400 hover:text-white hover:bg-white/[0.04]'
              }`
            }
          >
            {({ isActive }) => (
              <>
                <item.icon className={`h-[18px] w-[18px] flex-shrink-0 ${isActive ? 'text-blue-400' : ''}`} />
                <span className="flex-1">{item.name}</span>
                {isActive && <ChevronRight className="h-3 w-3 text-gray-600" />}
              </>
            )}
          </NavLink>
        ))}
      </nav>

      {/* Mission card */}
      <div className="px-3 pb-3">
        <div className="rounded-xl bg-gradient-to-br from-blue-500/10 to-violet-500/10 border border-blue-500/10 p-4">
          <div className="flex items-center gap-2 mb-2">
            <Target className="w-4 h-4 text-blue-400" />
            <span className="text-xs font-semibold text-white">Mission</span>
          </div>
          <p className="text-xs text-gray-400">1M AED in 9 months</p>
          <div className="mt-2 w-full bg-white/5 rounded-full h-1.5">
            <div className="bg-gradient-to-r from-blue-500 to-violet-500 h-1.5 rounded-full" style={{ width: '57.5%' }} />
          </div>
          <p className="text-[10px] text-gray-500 mt-1">57.5% — AED 575K</p>
        </div>
      </div>

      {/* User */}
      <div className="px-3 pb-4 border-t border-white/[0.06] pt-3">
        <div className="flex items-center gap-3 px-2 mb-3">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-violet-600 flex items-center justify-center text-white text-xs font-bold">
            {user?.name?.charAt(0) || 'B'}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-gray-200 truncate">{user?.name || 'BT'}</p>
            <p className="text-[11px] text-gray-500 truncate">{user?.role || 'Owner'}</p>
          </div>
        </div>
        <button
          onClick={logout}
          className="w-full flex items-center gap-2 px-3 py-2 text-sm text-gray-400 hover:text-red-400 hover:bg-red-500/5 rounded-lg transition-colors"
        >
          <LogOut className="h-4 w-4" />
          Sign Out
        </button>
      </div>
    </div>
  )

  return (
    <>
      {/* Mobile toggle */}
      <button
        onClick={() => setMobileOpen(true)}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 rounded-lg glass text-gray-400"
      >
        <Menu className="h-5 w-5" />
      </button>

      {/* Mobile overlay */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="lg:hidden fixed inset-0 bg-black/60 z-40"
              onClick={() => setMobileOpen(false)}
            />
            <motion.div
              initial={{ x: -280 }}
              animate={{ x: 0 }}
              exit={{ x: -280 }}
              transition={{ type: 'spring', damping: 30, stiffness: 300 }}
              className="lg:hidden fixed inset-y-0 left-0 w-[280px] z-50 bg-gray-950 border-r border-white/[0.06]"
            >
              <button
                onClick={() => setMobileOpen(false)}
                className="absolute top-4 right-4 text-gray-500 hover:text-white"
              >
                <X className="h-5 w-5" />
              </button>
              {nav}
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Desktop sidebar */}
      <div className="hidden lg:fixed lg:inset-y-0 lg:z-50 lg:flex lg:w-[260px] lg:flex-col bg-gray-950 border-r border-white/[0.06]">
        {nav}
      </div>
    </>
  )
}

export default Sidebar
