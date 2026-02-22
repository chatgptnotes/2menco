import { useAuth } from '../contexts/AuthContext'
import { Bell, Search, Command } from 'lucide-react'

const Header = () => {
  const { user } = useAuth()

  return (
    <header className="sticky top-0 z-40 h-14 flex items-center gap-4 border-b border-white/[0.06] bg-gray-950/80 backdrop-blur-xl px-6">
      {/* Search */}
      <div className="flex-1 flex items-center">
        <div className="relative w-full max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
          <input
            type="text"
            placeholder="Search..."
            className="w-full h-9 pl-10 pr-12 bg-white/[0.04] border border-white/[0.06] rounded-lg text-sm text-gray-300 placeholder-gray-600 focus:outline-none focus:ring-1 focus:ring-blue-500/30 focus:border-blue-500/30 transition-all"
          />
          <kbd className="absolute right-3 top-1/2 -translate-y-1/2 hidden sm:flex items-center gap-0.5 text-[10px] text-gray-600 bg-white/5 rounded px-1.5 py-0.5">
            <Command className="h-3 w-3" />K
          </kbd>
        </div>
      </div>

      {/* Right */}
      <div className="flex items-center gap-3">
        <button className="relative p-2 text-gray-500 hover:text-gray-300 transition-colors rounded-lg hover:bg-white/5">
          <Bell className="h-4 w-4" />
          <span className="absolute top-1.5 right-1.5 h-2 w-2 bg-blue-500 rounded-full" />
        </button>

        <div className="h-6 w-px bg-white/[0.06]" />

        <div className="flex items-center gap-2">
          <div className="text-right hidden sm:block">
            <p className="text-xs font-medium text-gray-300">{user?.name || 'BT'}</p>
            <p className="text-[10px] text-gray-600">{user?.role || 'Owner'}</p>
          </div>
          <div className="h-8 w-8 rounded-full bg-gradient-to-br from-blue-500 to-violet-600 flex items-center justify-center text-white text-xs font-bold">
            {user?.name?.charAt(0) || 'B'}
          </div>
        </div>
      </div>
    </header>
  )
}

export default Header
