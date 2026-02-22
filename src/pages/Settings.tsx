import { User, Bell, Shield, Palette } from 'lucide-react'
import PageTransition from '../components/PageTransition'

const Settings = () => (
  <PageTransition>
    <div className="space-y-6">
      <div><h1 className="text-2xl font-bold text-white">Settings</h1><p className="text-sm text-gray-500 mt-1">Manage your preferences</p></div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {[
          { icon: User, title: 'Profile', desc: 'Update your personal information' },
          { icon: Bell, title: 'Notifications', desc: 'Configure alert preferences' },
          { icon: Shield, title: 'Security', desc: 'Password & authentication' },
          { icon: Palette, title: 'Appearance', desc: 'Theme & display settings' },
        ].map(s => (
          <div key={s.title} className="card-hover cursor-pointer">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-white/5 flex items-center justify-center"><s.icon className="h-5 w-5 text-gray-400" /></div>
              <div><p className="text-sm font-medium text-white">{s.title}</p><p className="text-xs text-gray-500">{s.desc}</p></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  </PageTransition>
)

export default Settings
