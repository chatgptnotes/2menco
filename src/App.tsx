import { Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider, useAuth } from './contexts/AuthContext'
import { ToastProvider } from './components/Toast'
import Layout from './components/Layout'
import Landing from './pages/Landing'
import Login from './pages/Login'
import Signup from './pages/Signup'
import Dashboard from './pages/Dashboard'
import Agents from './pages/Agents'
import AgentDetail from './pages/AgentDetail'
import KPIs from './pages/KPIs'
import Leads from './pages/Leads'
import Analytics from './pages/Analytics'
import Tasks from './pages/Tasks'
import Emails from './pages/Emails'
import CRM from './pages/CRM'
import Documents from './pages/Documents'
import Settings from './pages/Settings'
import Help from './pages/Help'

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated, isLoading } = useAuth()
  if (isLoading) return (
    <div className="min-h-screen bg-gray-950 flex items-center justify-center">
      <div className="text-center">
        <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto" />
        <p className="mt-3 text-sm text-gray-500">Loading...</p>
      </div>
    </div>
  )
  if (!isAuthenticated) return <Navigate to="/login" replace />
  return <>{children}</>
}

const AppRoutes = () => (
  <Routes>
    <Route path="/" element={<Landing />} />
    <Route path="/login" element={<Login />} />
    <Route path="/signup" element={<Signup />} />
    <Route path="/dashboard" element={<ProtectedRoute><Layout /></ProtectedRoute>}>
      <Route index element={<Dashboard />} />
      <Route path="agents" element={<Agents />} />
      <Route path="agents/:agentType" element={<AgentDetail />} />
      <Route path="kpis" element={<KPIs />} />
      <Route path="leads" element={<Leads />} />
      <Route path="analytics" element={<Analytics />} />
      <Route path="emails" element={<Emails />} />
      <Route path="crm" element={<CRM />} />
      <Route path="tasks" element={<Tasks />} />
      <Route path="documents" element={<Documents />} />
      <Route path="settings" element={<Settings />} />
      <Route path="help" element={<Help />} />
    </Route>
    <Route path="*" element={<Navigate to="/" replace />} />
  </Routes>
)

const App = () => (
  <AuthProvider>
    <ToastProvider>
      <AppRoutes />
    </ToastProvider>
  </AuthProvider>
)

export default App
