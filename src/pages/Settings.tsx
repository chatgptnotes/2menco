import { useState } from 'react'
import { 
  Settings as SettingsIcon, 
  User, 
  Shield, 
  Bell, 
  Palette, 
  Database,
  Globe,
  Key,
  Save,
  Eye,
  EyeOff,
  CheckCircle,
  AlertCircle
} from 'lucide-react'

interface SettingSection {
  id: string
  title: string
  description: string
  icon: React.ReactNode
  color: string
}

const Settings = () => {
  const [activeSection, setActiveSection] = useState<string>('profile')
  const [showPassword, setShowPassword] = useState(false)
  const [notifications, setNotifications] = useState({
    email: true,
    push: true,
    sms: false,
    weekly: true,
    daily: false
  })

  const settingSections: SettingSection[] = [
    {
      id: 'profile',
      title: 'Profile Settings',
      description: 'Manage your personal information and preferences',
      icon: <User className="h-6 w-6" />,
      color: 'bg-blue-500'
    },
    {
      id: 'security',
      title: 'Security & Privacy',
      description: 'Configure security settings and privacy preferences',
      icon: <Shield className="h-6 w-6" />,
      color: 'bg-green-500'
    },
    {
      id: 'notifications',
      title: 'Notifications',
      description: 'Customize your notification preferences',
      icon: <Bell className="h-6 w-6" />,
      color: 'bg-purple-500'
    },
    {
      id: 'appearance',
      title: 'Appearance',
      description: 'Customize the look and feel of your BOS',
      icon: <Palette className="h-6 w-6" />,
      color: 'bg-orange-500'
    },
    {
      id: 'integrations',
      title: 'Integrations',
      description: 'Manage third-party service connections',
      icon: <Database className="h-6 w-6" />,
      color: 'bg-indigo-500'
    },
    {
      id: 'regional',
      title: 'Regional Settings',
      description: 'Configure timezone, language, and currency',
      icon: <Globe className="h-6 w-6" />,
      color: 'bg-teal-500'
    }
  ]

  const renderProfileSettings = () => (
    <div className="space-y-6">
      <div className="card">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Personal Information</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="label">First Name</label>
            <input type="text" className="input" defaultValue="Biji Tharakan" />
          </div>
          <div>
            <label className="label">Last Name</label>
            <input type="text" className="input" defaultValue="Thomas" />
          </div>
          <div>
            <label className="label">Email Address</label>
            <input type="email" className="input" defaultValue="bt@bettroi.com" />
          </div>
          <div>
            <label className="label">Phone Number</label>
            <input type="tel" className="input" defaultValue="+971 50 123 4567" />
          </div>
          <div>
            <label className="label">Job Title</label>
            <input type="text" className="input" defaultValue="Owner & CEO" />
          </div>
          <div>
            <label className="label">Company</label>
            <input type="text" className="input" defaultValue="BETTROI" />
          </div>
        </div>
      </div>

      <div className="card">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Business Information</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="label">Business Name</label>
            <input type="text" className="input" defaultValue="BETTROI BOS" />
          </div>
          <div>
            <label className="label">Business Type</label>
            <select className="input">
              <option>Digital Business Operating System</option>
              <option>Technology Consulting</option>
              <option>Business Automation</option>
            </select>
          </div>
          <div>
            <label className="label">Industry</label>
            <select className="input">
              <option>Technology</option>
              <option>Consulting</option>
              <option>Automation</option>
            </select>
          </div>
          <div>
            <label className="label">Timezone</label>
            <select className="input">
              <option>Asia/Dubai (UTC+4)</option>
              <option>UTC</option>
              <option>America/New_York</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  )

  const renderSecuritySettings = () => (
    <div className="space-y-6">
      <div className="card">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Password & Authentication</h3>
        <div className="space-y-4">
          <div>
            <label className="label">Current Password</label>
            <div className="relative">
              <input 
                type={showPassword ? "text" : "password"} 
                className="input pr-10" 
                placeholder="Enter current password"
              />
              <button
                type="button"
                className="absolute inset-y-0 right-0 pr-3 flex items-center"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOff className="h-4 w-4 text-gray-400" /> : <Eye className="h-4 w-4 text-gray-400" />}
              </button>
            </div>
          </div>
          <div>
            <label className="label">New Password</label>
            <input type="password" className="input" placeholder="Enter new password" />
          </div>
          <div>
            <label className="label">Confirm New Password</label>
            <input type="password" className="input" placeholder="Confirm new password" />
          </div>
          <div className="flex items-center space-x-2">
            <CheckCircle className="h-4 w-4 text-success-600" />
            <span className="text-sm text-gray-600">Password must be at least 8 characters long</span>
          </div>
        </div>
      </div>

      <div className="card">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Two-Factor Authentication</h3>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-600">Add an extra layer of security to your account</p>
            <p className="text-xs text-gray-500 mt-1">Currently disabled</p>
          </div>
          <button className="btn btn-primary">Enable 2FA</button>
        </div>
      </div>

      <div className="card">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Session Management</h3>
        <div className="space-y-3">
          <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
            <div>
              <p className="text-sm font-medium text-gray-900">Current Session</p>
              <p className="text-xs text-gray-500">MacBook Pro - Chrome • Active now</p>
            </div>
            <span className="text-xs text-success-600 bg-success-50 px-2 py-1 rounded-full">Active</span>
          </div>
          <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
            <div>
              <p className="text-sm font-medium text-gray-900">iPhone - Safari</p>
              <p className="text-xs text-gray-500">Last active 2 hours ago</p>
            </div>
            <button className="text-xs text-danger-600 hover:text-danger-700">Terminate</button>
          </div>
        </div>
      </div>
    </div>
  )

  const renderNotificationSettings = () => (
    <div className="space-y-6">
      <div className="card">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Notification Channels</h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <label className="text-sm font-medium text-gray-900">Email Notifications</label>
              <p className="text-xs text-gray-500">Receive notifications via email</p>
            </div>
            <input
              type="checkbox"
              checked={notifications.email}
              onChange={(e) => setNotifications(prev => ({ ...prev, email: e.target.checked }))}
              className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
            />
          </div>
          <div className="flex items-center justify-between">
            <div>
              <label className="text-sm font-medium text-gray-900">Push Notifications</label>
              <p className="text-xs text-gray-500">Receive push notifications in browser</p>
            </div>
            <input
              type="checkbox"
              checked={notifications.push}
              onChange={(e) => setNotifications(prev => ({ ...prev, push: e.target.checked }))}
              className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
            />
          </div>
          <div className="flex items-center justify-between">
            <div>
              <label className="text-sm font-medium text-gray-900">SMS Notifications</label>
              <p className="text-xs text-gray-500">Receive notifications via SMS</p>
            </div>
            <input
              type="checkbox"
              checked={notifications.sms}
              onChange={(e) => setNotifications(prev => ({ ...prev, sms: e.target.checked }))}
              className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
            />
          </div>
        </div>
      </div>

      <div className="card">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Notification Frequency</h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <label className="text-sm font-medium text-gray-900">Weekly Summary</label>
              <p className="text-xs text-gray-500">Receive a weekly summary of activities</p>
            </div>
            <input
              type="checkbox"
              checked={notifications.weekly}
              onChange={(e) => setNotifications(prev => ({ ...prev, weekly: e.target.checked }))}
              className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
            />
          </div>
          <div className="flex items-center justify-between">
            <div>
              <label className="text-sm font-medium text-gray-900">Daily Digest</label>
              <p className="text-xs text-gray-500">Receive a daily digest of important updates</p>
            </div>
            <input
              type="checkbox"
              checked={notifications.daily}
              onChange={(e) => setNotifications(prev => ({ ...prev, daily: e.target.checked }))}
              className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
            />
          </div>
        </div>
      </div>
    </div>
  )

  const renderAppearanceSettings = () => (
    <div className="space-y-6">
      <div className="card">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Theme & Colors</h3>
        <div className="space-y-4">
          <div>
            <label className="label">Theme</label>
            <select className="input">
              <option>Light</option>
              <option>Dark</option>
              <option>System</option>
            </select>
          </div>
          <div>
            <label className="label">Primary Color</label>
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-blue-600 rounded-full border-2 border-gray-300"></div>
              <div className="w-8 h-8 bg-green-600 rounded-full border-2 border-gray-300"></div>
              <div className="w-8 h-8 bg-purple-600 rounded-full border-2 border-gray-300"></div>
              <div className="w-8 h-8 bg-orange-600 rounded-full border-2 border-gray-300"></div>
            </div>
          </div>
        </div>
      </div>

      <div className="card">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Layout & Display</h3>
        <div className="space-y-4">
          <div>
            <label className="label">Sidebar Width</label>
            <select className="input">
              <option>Compact (240px)</option>
              <option>Default (288px)</option>
              <option>Wide (336px)</option>
            </select>
          </div>
          <div>
            <label className="label">Content Density</label>
            <select className="input">
              <option>Comfortable</option>
              <option>Compact</option>
              <option>Tight</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  )

  const renderIntegrationsSettings = () => (
    <div className="space-y-6">
      <div className="card">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Connected Services</h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <span className="text-white text-xs font-bold">G</span>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900">Google Workspace</p>
                <p className="text-xs text-gray-500">Connected for email and calendar</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-xs text-success-600 bg-success-50 px-2 py-1 rounded-full">Connected</span>
              <button className="text-xs text-danger-600 hover:text-danger-700">Disconnect</button>
            </div>
          </div>
          
          <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-green-600 rounded-lg flex items-center justify-center">
                <span className="text-white text-xs font-bold">S</span>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900">Slack</p>
                <p className="text-xs text-gray-500">Connected for team communication</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-xs text-success-600 bg-success-50 px-2 py-1 rounded-full">Connected</span>
              <button className="text-xs text-danger-600 hover:text-danger-700">Disconnect</button>
            </div>
          </div>
        </div>
      </div>

      <div className="card">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">API Keys</h3>
        <div className="space-y-4">
          <div>
            <label className="label">OpenAI API Key</label>
            <div className="flex items-center space-x-2">
              <input type="password" className="input flex-1" defaultValue="sk-..." />
              <button className="btn btn-secondary">Show</button>
              <button className="btn btn-primary">Update</button>
            </div>
          </div>
          <div>
            <label className="label">Stripe API Key</label>
            <div className="flex items-center space-x-2">
              <input type="password" className="input flex-1" defaultValue="sk_live..." />
              <button className="btn btn-secondary">Show</button>
              <button className="btn btn-primary">Update</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )

  const renderRegionalSettings = () => (
    <div className="space-y-6">
      <div className="card">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Regional Preferences</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="label">Language</label>
            <select className="input">
              <option>English (US)</option>
              <option>English (UK)</option>
              <option>Arabic</option>
              <option>Hindi</option>
            </select>
          </div>
          <div>
            <label className="label">Currency</label>
            <select className="input">
              <option>United Arab Emirates Dirham (AED)</option>
              <option>US Dollar (USD)</option>
              <option>Euro (EUR)</option>
              <option>Indian Rupee (INR)</option>
            </select>
          </div>
          <div>
            <label className="label">Date Format</label>
            <select className="input">
              <option>MM/DD/YYYY</option>
              <option>DD/MM/YYYY</option>
              <option>YYYY-MM-DD</option>
            </select>
          </div>
          <div>
            <label className="label">Time Format</label>
            <select className="input">
              <option>12-hour</option>
              <option>24-hour</option>
            </select>
          </div>
        </div>
      </div>

      <div className="card">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Business Hours</h3>
        <div className="space-y-4">
          <div className="flex items-center space-x-4">
            <div>
              <label className="label">Start Time</label>
              <input type="time" className="input" defaultValue="09:00" />
            </div>
            <div>
              <label className="label">End Time</label>
              <input type="time" className="input" defaultValue="18:00" />
            </div>
          </div>
          <div>
            <label className="label">Business Days</label>
            <div className="flex items-center space-x-4 mt-2">
              {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day) => (
                <label key={day} className="flex items-center space-x-2">
                  <input type="checkbox" className="h-4 w-4 text-primary-600" defaultChecked={day !== 'Sun'} />
                  <span className="text-sm text-gray-700">{day}</span>
                </label>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )

  const renderContent = () => {
    switch (activeSection) {
      case 'profile': return renderProfileSettings()
      case 'security': return renderSecuritySettings()
      case 'notifications': return renderNotificationSettings()
      case 'appearance': return renderAppearanceSettings()
      case 'integrations': return renderIntegrationsSettings()
      case 'regional': return renderRegionalSettings()
      default: return renderProfileSettings()
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
        <p className="text-gray-600">Configure your Business Operating System preferences</p>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Sidebar */}
        <div className="lg:w-80">
          <div className="card">
            <nav className="space-y-2">
              {settingSections.map((section) => (
                <button
                  key={section.id}
                  onClick={() => setActiveSection(section.id)}
                  className={`w-full flex items-center space-x-3 px-3 py-2 rounded-md text-left transition-colors ${
                    activeSection === section.id
                      ? 'bg-primary-50 text-primary-700'
                      : 'text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-white ${section.color}`}>
                    {section.icon}
                  </div>
                  <div>
                    <p className="text-sm font-medium">{section.title}</p>
                    <p className="text-xs text-gray-500">{section.description}</p>
                  </div>
                </button>
              ))}
            </nav>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1">
          {renderContent()}
          
          {/* Save Button */}
          <div className="mt-6 flex justify-end">
            <button className="btn btn-primary">
              <Save className="h-4 w-4 mr-2" />
              Save Changes
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Settings
