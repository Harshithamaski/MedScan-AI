import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { GoogleLogin } from '@react-oauth/google'
import toast from 'react-hot-toast'
import { useAuth } from '../context/AuthContext'
import api from '../services/api'

export default function GoogleSignInButton({ mode = 'login' }) {
  const { login } = useAuth()
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)

  const handleSuccess = async (credentialResponse) => {
    const credential = credentialResponse?.credential
    if (!credential) {
      toast.error('Google did not return a sign-in token')
      return
    }

    setLoading(true)
    try {
      const data = await api.post('/auth/google', { idToken: credential })
      login(data.token, data.user)
      toast.success(mode === 'login' ? 'Signed in with Google!' : 'Account created with Google!')
      navigate('/dashboard')
    } catch (err) {
      toast.error(err.message || 'Google sign-in failed')
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="w-full flex items-center justify-center py-3 px-4 rounded-xl border border-slate-700 bg-slate-900/50">
        <div className="w-5 h-5 border-2 border-teal-400/30 border-t-teal-400 rounded-full animate-spin" />
      </div>
    )
  }

  return (
    <div className="w-full google-btn-wrap flex justify-center">
      <GoogleLogin
        onSuccess={handleSuccess}
        onError={() => toast.error('Google sign-in was cancelled or failed')}
        useOneTap={false}
        theme="outline"
        size="large"
        text={mode === 'login' ? 'continue_with' : 'signup_with'}
        shape="rectangular"
        width="380"
      />
    </div>
  )
}
