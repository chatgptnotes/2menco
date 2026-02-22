import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { Eye, EyeOff, Lock, Mail, Zap, User } from 'lucide-react'
import { motion } from 'framer-motion'

const Signup = () => {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  const { signup } = useAuth()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); setError('')
    if (password.length < 6) { setError('Password must be at least 6 characters'); return }
    setIsLoading(true)
    try { await signup(email, password, name); setSuccess(true) }
    catch (err) { setError(err instanceof Error ? err.message : 'Signup failed') }
    finally { setIsLoading(false) }
  }

  if (success) return (
    <div className="min-h-screen bg-gray-950 flex items-center justify-center p-4">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="card text-center max-w-sm w-full">
        <Zap className="h-10 w-10 text-blue-400 mx-auto mb-3" />
        <h2 className="text-lg font-bold text-white">Check your email</h2>
        <p className="text-xs text-gray-500 mt-1">Confirmation link sent to <strong className="text-gray-300">{email}</strong></p>
        <Link to="/login" className="btn btn-primary mt-6 inline-block">Go to Login</Link>
      </motion.div>
    </div>
  )

  return (
    <div className="min-h-screen bg-gray-950 flex items-center justify-center p-4">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-sm space-y-8">
        <div className="text-center">
          <div className="mx-auto w-12 h-12 bg-gradient-to-br from-blue-500 to-violet-600 rounded-xl flex items-center justify-center mb-4">
            <Zap className="h-6 w-6 text-white" />
          </div>
          <h2 className="text-2xl font-bold text-white">Create Account</h2>
          <p className="text-sm text-gray-500 mt-1">Join BETTROI BOS</p>
        </div>
        <div className="card">
          <form className="space-y-4" onSubmit={handleSubmit}>
            {error && <div className="bg-red-500/10 border border-red-500/20 text-red-400 px-3 py-2 rounded-lg text-xs">{error}</div>}
            <div><label className="label">Name</label><div className="relative"><User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" /><input type="text" required value={name} onChange={e => setName(e.target.value)} className="input pl-9" placeholder="Your name" /></div></div>
            <div><label className="label">Email</label><div className="relative"><Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" /><input type="email" required value={email} onChange={e => setEmail(e.target.value)} className="input pl-9" placeholder="you@example.com" /></div></div>
            <div><label className="label">Password</label><div className="relative"><Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" /><input type={showPassword ? 'text' : 'password'} required value={password} onChange={e => setPassword(e.target.value)} className="input pl-9 pr-9" placeholder="Min 6 chars" /><button type="button" className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500" onClick={() => setShowPassword(!showPassword)}>{showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}</button></div></div>
            <button type="submit" disabled={isLoading} className="btn btn-primary w-full">{isLoading ? 'Creating...' : 'Create Account'}</button>
          </form>
        </div>
        <p className="text-center text-xs text-gray-500">
          Have an account? <Link to="/login" className="text-blue-400 hover:text-blue-300">Sign in</Link>
        </p>
      </motion.div>
    </div>
  )
}

export default Signup
