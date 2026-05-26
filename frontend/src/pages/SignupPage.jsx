import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import toast from 'react-hot-toast'
import GoogleSignInButton from '../components/GoogleSignInButton'
import { Stethoscope, Eye, EyeOff, Mail, Lock, User, ArrowRight } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import api from '../services/api'

export default function SignupPage() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const [form, setForm] = useState({ name: '', email: '', password: '' })
  const [showPass, setShowPass] = useState(false)
  const [loading, setLoading] = useState(false)
  const handleSubmit = async (e) => {
    e.preventDefault()
    if (form.password.length < 6) return toast.error('Password must be at least 6 characters')
    setLoading(true)
    try {
      const data = await api.post('/auth/register', form)
      login(data.token, data.user)
      toast.success('Account created! Welcome to MedScan AI 🎉')
      navigate('/dashboard')
    } catch (err) {
      toast.error(err.message || 'Registration failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-slate-950 bg-grid flex items-center justify-center px-4 relative overflow-hidden">
      <div className="orb orb-teal w-96 h-96 -top-20 -right-20" />
      <div className="orb orb-blue w-80 h-80 -bottom-10 -left-10" />

      <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-md relative z-10">
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2 mb-6">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-teal-500 to-cyan-400 flex items-center justify-center">
              <Stethoscope className="w-5 h-5 text-slate-900" />
            </div>
            <span className="text-xl font-bold text-white">MedScan AI</span>
          </Link>
          <h1 className="text-3xl font-bold text-white mb-2">Create your account</h1>
          <p className="text-slate-400">Start understanding your health reports today</p>
        </div>

        <div className="glass-card p-8">
          <div className="mb-6">
            <GoogleSignInButton mode="signup" />
          </div>

          <div className="relative mb-6">
            <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-slate-700" /></div>
            <div className="relative flex justify-center text-xs">
              <span className="px-3 bg-slate-900 text-slate-500">or sign up with email</span>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="label">Full name</label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input type="text" className="input-field pl-10" placeholder="John Doe"
                  value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} required />
              </div>
            </div>
            <div>
              <label className="label">Email address</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input type="email" className="input-field pl-10" placeholder="you@example.com"
                  value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} required />
              </div>
            </div>
            <div>
              <label className="label">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input type={showPass ? 'text' : 'password'} className="input-field pl-10 pr-10"
                  placeholder="Min 6 characters" value={form.password}
                  onChange={e => setForm({ ...form, password: e.target.value })} required />
                <button type="button" onClick={() => setShowPass(!showPass)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200">
                  {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
              type="submit" disabled={loading}
              className="btn-primary w-full flex items-center justify-center gap-2 py-3.5 mt-2">
              {loading
                ? <div className="w-5 h-5 border-2 border-slate-900/30 border-t-slate-900 rounded-full animate-spin" />
                : <>Create Account <ArrowRight className="w-4 h-4" /></>}
            </motion.button>
          </form>

          <p className="text-center text-slate-400 text-sm mt-6">
            Already have an account?{' '}
            <Link to="/login" className="text-teal-400 hover:text-teal-300 font-medium transition-colors">Sign in</Link>
          </p>
        </div>
      </motion.div>
    </div>
  )
}
