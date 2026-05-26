import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { User, Mail, Phone, Calendar, Droplets, Lock, Save, Loader2, ShieldCheck } from 'lucide-react'
import toast from 'react-hot-toast'
import { useAuth } from '../context/AuthContext'
import api from '../services/api'

export default function ProfilePage() {
  const { user, updateUser } = useAuth()
  const [profile, setProfile] = useState({
    name: user?.name || '',
    phone: user?.phone || '',
    bloodGroup: user?.bloodGroup || '',
    gender: user?.gender || '',
    dateOfBirth: user?.dateOfBirth ? user.dateOfBirth.slice(0, 10) : ''
  })
  const [passwords, setPasswords] = useState({ currentPassword: '', newPassword: '', confirm: '' })
  const [savingProfile, setSavingProfile] = useState(false)
  const [savingPass, setSavingPass] = useState(false)

  const handleProfileSave = async (e) => {
    e.preventDefault()
    setSavingProfile(true)
    try {
      const data = await api.put('/user/profile', profile)
      updateUser(data.user)
      toast.success('Profile updated!')
    } catch (err) {
      toast.error(err.message || 'Failed to update profile')
    } finally {
      setSavingProfile(false)
    }
  }

  const handlePasswordSave = async (e) => {
    e.preventDefault()
    if (passwords.newPassword !== passwords.confirm) return toast.error('Passwords do not match')
    if (passwords.newPassword.length < 6) return toast.error('Password must be at least 6 characters')
    setSavingPass(true)
    try {
      await api.put('/user/change-password', {
        currentPassword: passwords.currentPassword,
        newPassword: passwords.newPassword
      })
      toast.success('Password changed!')
      setPasswords({ currentPassword: '', newPassword: '', confirm: '' })
    } catch (err) {
      toast.error(err.message || 'Failed to change password')
    } finally {
      setSavingPass(false)
    }
  }

  return (
    <div className="max-w-2xl mx-auto">
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
        <h1 className="text-3xl font-bold text-white">Profile Settings</h1>
        <p className="text-slate-400 mt-1">Manage your account information</p>
      </motion.div>

      {/* Avatar */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}
        className="glass-card p-6 mb-6 flex items-center gap-5">
        <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-teal-500 to-cyan-400 flex items-center justify-center text-3xl font-bold text-slate-900 flex-shrink-0 overflow-hidden">
          {user?.avatar
            ? <img src={user.avatar} alt="" className="w-full h-full object-cover" />
            : (user?.name?.[0] || 'U').toUpperCase()
          }
        </div>
        <div>
          <h2 className="text-xl font-bold text-white">{user?.name}</h2>
          <p className="text-slate-400 flex items-center gap-2 mt-1">
            <Mail className="w-4 h-4" /> {user?.email}
          </p>
          <div className="flex items-center gap-2 mt-2">
            <span className={`badge ${user?.authProvider === 'google' ? 'badge-teal' : 'badge-green'}`}>
              {user?.authProvider === 'google' ? '🔵 Google Account' : '📧 Email Account'}
            </span>
            <span className="badge-teal">{user?.reportsCount || 0} Reports</span>
          </div>
        </div>
      </motion.div>

      {/* Profile form */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
        className="glass-card p-6 mb-6">
        <div className="flex items-center gap-2 text-teal-400 font-semibold mb-5 text-sm border-b border-slate-800 pb-4">
          <User className="w-4 h-4" /> Personal Information
        </div>
        <form onSubmit={handleProfileSave} className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="label">Full Name</label>
              <input className="input-field" value={profile.name}
                onChange={e => setProfile({ ...profile, name: e.target.value })} required />
            </div>
            <div>
              <label className="label">Phone Number</label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input className="input-field pl-10" placeholder="+1 234 567 8900"
                  value={profile.phone} onChange={e => setProfile({ ...profile, phone: e.target.value })} />
              </div>
            </div>
            <div>
              <label className="label">Date of Birth</label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input type="date" className="input-field pl-10"
                  value={profile.dateOfBirth} onChange={e => setProfile({ ...profile, dateOfBirth: e.target.value })} />
              </div>
            </div>
            <div>
              <label className="label">Gender</label>
              <select className="input-field" value={profile.gender}
                onChange={e => setProfile({ ...profile, gender: e.target.value })}>
                <option value="">Select gender</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </select>
            </div>
            <div>
              <label className="label">Blood Group</label>
              <div className="relative">
                <Droplets className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <select className="input-field pl-10" value={profile.bloodGroup}
                  onChange={e => setProfile({ ...profile, bloodGroup: e.target.value })}>
                  <option value="">Select blood group</option>
                  {['A+','A-','B+','B-','AB+','AB-','O+','O-'].map(bg => (
                    <option key={bg} value={bg}>{bg}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>
          <div className="flex justify-end pt-2">
            <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
              type="submit" disabled={savingProfile}
              className="btn-primary flex items-center gap-2 px-6">
              {savingProfile ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
              Save Changes
            </motion.button>
          </div>
        </form>
      </motion.div>

      {/* Change password */}
      {user?.authProvider !== 'google' && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}
          className="glass-card p-6">
          <div className="flex items-center gap-2 text-teal-400 font-semibold mb-5 text-sm border-b border-slate-800 pb-4">
            <Lock className="w-4 h-4" /> Change Password
          </div>
          <form onSubmit={handlePasswordSave} className="space-y-4">
            {['currentPassword', 'newPassword', 'confirm'].map(field => (
              <div key={field}>
                <label className="label capitalize">{field === 'confirm' ? 'Confirm New Password' : field.replace(/([A-Z])/g, ' $1')}</label>
                <input type="password" className="input-field"
                  placeholder={field === 'confirm' ? 'Repeat new password' : '••••••••'}
                  value={passwords[field]}
                  onChange={e => setPasswords({ ...passwords, [field]: e.target.value })}
                  required />
              </div>
            ))}
            <div className="flex justify-end pt-2">
              <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                type="submit" disabled={savingPass}
                className="btn-primary flex items-center gap-2 px-6">
                {savingPass ? <Loader2 className="w-4 h-4 animate-spin" /> : <ShieldCheck className="w-4 h-4" />}
                Update Password
              </motion.button>
            </div>
          </form>
        </motion.div>
      )}

      {user?.authProvider === 'google' && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}
          className="glass-card p-5 text-center">
          <p className="text-slate-400 text-sm">🔵 You're signed in with Google. Password management is handled by Google.</p>
        </motion.div>
      )}
    </div>
  )
}
