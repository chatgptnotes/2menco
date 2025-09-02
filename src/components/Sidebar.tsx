import { NavLink } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { 
  LayoutDashboard, 
  Users, 
  BarChart3, 
  CheckSquare, 
  FileText, 
  Settings,
  Rocket,
  Target,
  TrendingUp,
  HelpCircle,
  LogOut,
  TrendingUp as AnalyticsIcon
} from 'lucide-react'

const navigation = [
  { name: 'Dashboard', href: '/', icon: LayoutDashboard },
  { name: 'Digital Agents', href: '/agents', icon: Users },
  { name: 'KPIs & Metrics', href: '/kpis', icon: BarChart3 },
  { name: 'Analytics', href: '/analytics', icon: AnalyticsIcon },
  { name: 'Task Management', href: '/tasks', icon: CheckSquare },
  { name: 'Documents', href: '/documents', icon: FileText },
  { name: 'Settings', href: '/settings', icon: Settings },
  { name: 'Help & Support', href: '/help', icon: HelpCircle },
]

const Sidebar = () => {
  const { user, logout } = useAuth()

  const handleLogout = () => {
    logout()
  }

  return (
    <div className="hidden lg:fixed lg:inset-y-0 lg:z-50 lg:flex lg:w-72 lg:flex-col">
      <div className="flex grow flex-col gap-y-5 overflow-y-auto bg-white px-6 pb-4 border-r border-gray-200">
        <div className="flex h-16 shrink-0 items-center">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-r from-primary-600 to-secondary-600 rounded-lg flex items-center justify-center">
              <Rocket className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900">BETTROI BOS</h1>
              <p className="text-xs text-gray-500">Digital Empire Builder</p>
            </div>
          </div>
        </div>
        
        <nav className="flex flex-1 flex-col">
          <ul role="list" className="flex flex-1 flex-col gap-y-7">
            <li>
              <ul role="list" className="-mx-2 space-y-1">
                {navigation.map((item) => (
                  <li key={item.name}>
                    <NavLink
                      to={item.href}
                      className={({ isActive }) =>
                        `group flex gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold ${
                          isActive
                            ? 'bg-primary-50 text-primary-600'
                            : 'text-gray-700 hover:text-primary-600 hover:bg-gray-50'
                        }`
                      }
                    >
                      <item.icon className="h-6 w-6 shrink-0" />
                      {item.name}
                    </NavLink>
                  </li>
                ))}
              </ul>
            </li>
            
            <li className="mt-auto">
              <div className="bg-gradient-to-r from-primary-50 to-secondary-50 rounded-lg p-4 mb-4">
                <div className="flex items-center space-x-3">
                  <Target className="w-8 h-8 text-primary-600" />
                  <div>
                    <h3 className="text-sm font-semibold text-gray-900">Mission</h3>
                    <p className="text-xs text-gray-600">1M AED in 9 months</p>
                  </div>
                </div>
                <div className="mt-3 flex items-center space-x-2">
                  <TrendingUp className="w-4 h-4 text-success-600" />
                  <span className="text-xs text-success-600 font-medium">On Track</span>
                </div>
              </div>
              
              {/* User Profile & Logout */}
              <div className="border-t border-gray-200 pt-4">
                <div className="flex items-center space-x-3 mb-3">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-r from-primary-600 to-secondary-600 flex items-center justify-center">
                    <span className="text-white text-sm font-medium">
                      {user?.name?.charAt(0) || 'B'}
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">
                      {user?.name || 'BT (Biji Tharakan Thomas)'}
                    </p>
                    <p className="text-xs text-gray-500 truncate">
                      {user?.role || 'Owner & CEO'}
                    </p>
                  </div>
                </div>
                
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center space-x-3 px-3 py-2 text-sm font-medium text-gray-700 hover:text-danger-600 hover:bg-danger-50 rounded-md transition-colors"
                >
                  <LogOut className="h-5 w-5" />
                  <span>Sign Out</span>
                </button>
              </div>
            </li>
          </ul>
        </nav>
      </div>
    </div>
  )
}

export default Sidebar
