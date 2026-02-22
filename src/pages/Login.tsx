import { useState, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { Eye, EyeOff, Lock, Mail, Zap, Wand2 } from 'lucide-react'
import { motion } from 'framer-motion'

const Login = () => {
  const { isAuthenticated } = useAuth()
  const nav = useNavigate()
  useEffect(() => { if (isAuthenticated) nav('/dashboard', { replace: true }) }, [isAuthenticated])
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [magicLinkSent, setMagicLinkSent] = useState(false)

  const { login, loginWithMagicLink } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setIsLoading(true)
    try { await login(email, password); navigate('/dashboard') }
    catch (err) { setError(err instanceof Error ? err.message : 'Login failed') }
    finally { setIsLoading(false) }
  }

  const handleMagicLink = async () => {
    if (!email) { setError('Enter your email first'); return }
    setError(''); setIsLoading(true)
    try { await loginWithMagicLink(email); setMagicLinkSent(true) }
    catch (err) { setError(err instanceof Error ? err.message : 'Failed to send magic link') }
    finally { setIsLoading(false) }
  }

  return (
    <div className="min-h-screen bg-gray-950 flex items-center justify-center p-4">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-sm space-y-8">
        <div className="text-center">
          <div className="mx-auto w-12 h-12 bg-gradient-to-br from-blue-500 to-violet-600 rounded-xl flex items-center justify-center mb-4">
            <Zap className="h-6 w-6 text-white" />
          </div>
          <h2 className="text-2xl font-bold text-white">Welcome back</h2>
          <p className="text-sm text-gray-500 mt-1">Sign in to BETTROI BOS</p>
        </div>

        <div className="card">
          {magicLinkSent ? (
            <div className="text-center py-6">
              <Wand2 className="h-10 w-10 text-blue-400 mx-auto mb-3" />
              <h3 className="text-sm font-medium text-white">Check your email</h3>
              <p className="text-xs text-gray-500 mt-1">Magic link sent to <strong className="text-gray-300">{email}</strong></p>
              <button onClick={() => setMagicLinkSent(false)} className="mt-4 text-blue-400 text-xs">← Back</button>
            </div>
          ) : (
            <form className="space-y-4" onSubmit={handleSubmit}>
              {error && <div className="bg-red-500/10 border border-red-500/20 text-red-400 px-3 py-2 rounded-lg text-xs">{error}</div>}
              <div>
                <label className="label">Email</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
                  <input type="email" required value={email} onChange={e => setEmail(e.target.value)} className="input pl-9" placeholder="you@example.com" />
                </div>
              </div>
              <div>
                <label className="label">Password</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
                  <input type={showPassword ? 'text' : 'password'} required value={password} onChange={e => setPassword(e.target.value)} className="input pl-9 pr-9" placeholder="••••••••" />
                  <button type="button" className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500" onClick={() => setShowPassword(!showPassword)}>
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>
              <button type="submit" disabled={isLoading} className="btn btn-primary w-full">{isLoading ? 'Signing in...' : 'Sign In'}</button>
              <div className="relative"><div className="absolute inset-0 flex items-center"><div className="w-full border-t border-white/[0.06]" /></div><div className="relative flex justify-center"><span className="px-2 bg-white/[0.03] text-xs text-gray-500">or</span></div></div>
              <button type="button" onClick={handleMagicLink} disabled={isLoading} className="btn btn-secondary w-full"><Wand2 className="h-4 w-4 mr-2" /> Magic Link</button>
            </form>
          )}
        </div>

        <p className="text-center text-xs text-gray-500">
          No account? <Link to="/signup" className="text-blue-400 hover:text-blue-300">Sign up</Link>
          <span className="mx-2">·</span>
          <Link to="/" className="text-gray-500 hover:text-gray-300">Home</Link>
        </p>
      </motion.div>
    </div>
  )
}

export default Login
