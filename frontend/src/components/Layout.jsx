import React, { useState } from 'react'
import { Outlet, NavLink, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { useAuth } from '../context/AuthContext'
import {
  LayoutDashboard, Upload, FileText, User, LogOut,
  Menu, X, Stethoscope, ChevronRight
} from 'lucide-react'

const navItems = [
  { to: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/upload', icon: Upload, label: 'Upload Report' },
  { to: '/reports', icon: FileText, label: 'My Reports' },
  { to: '/profile', icon: User, label: 'Profile' }
]

export default function Layout() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [mobileOpen, setMobileOpen] = useState(false)

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className="p-6 border-b border-slate-800/50">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-teal-500 to-cyan-400 flex items-center justify-center shadow-lg shadow-teal-500/25">
            <Stethoscope className="w-5 h-5 text-slate-900" />
          </div>
          <div>
            <div className="font-bold text-white text-lg leading-none">MedScan</div>
            <div className="text-teal-400 text-xs font-semibold">AI Healthcare</div>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-1">
        {navItems.map(({ to, icon: Icon, label }) => (
          <NavLink
            key={to}
            to={to}
            onClick={() => setMobileOpen(false)}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group ${
                isActive
                  ? 'bg-teal-500/15 text-teal-400 border border-teal-500/25'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
              }`
            }
          >
            {({ isActive }) => (
              <>
                <Icon className={`w-5 h-5 ${isActive ? 'text-teal-400' : 'text-slate-500 group-hover:text-slate-300'}`} />
                <span className="font-medium text-sm">{label}</span>
                {isActive && <ChevronRight className="w-4 h-4 ml-auto text-teal-500" />}
              </>
            )}
          </NavLink>
        ))}
      </nav>

      {/* User + Logout */}
      <div className="p-4 border-t border-slate-800/50">
        <div className="flex items-center gap-3 p-3 rounded-xl glass-lighter mb-2">
          <div className="w-9 h-9 rounded-full bg-gradient-to-br from-teal-500 to-cyan-400 flex items-center justify-center text-sm font-bold text-slate-900 flex-shrink-0">
            {user?.avatar
              ? <img src={user.avatar} alt="" className="w-full h-full rounded-full object-cover" />
              : (user?.name?.[0] || 'U').toUpperCase()
            }
          </div>
          <div className="min-w-0">
            <p className="text-sm font-semibold text-white truncate">{user?.name}</p>
            <p className="text-xs text-slate-400 truncate">{user?.email}</p>
          </div>
        </div>
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-slate-400 hover:text-red-400 hover:bg-red-500/10 transition-all duration-200 text-sm"
        >
          <LogOut className="w-4 h-4" />
          <span>Sign Out</span>
        </button>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen bg-slate-950 bg-grid flex">
      {/* Background orbs */}
      <div className="orb orb-teal w-96 h-96 top-0 left-0" />
      <div className="orb orb-blue w-80 h-80 bottom-0 right-0" />

      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex w-64 flex-shrink-0 glass border-r border-slate-800/50 flex-col relative z-10">
        <SidebarContent />
      </aside>

      {/* Mobile Sidebar */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden"
              onClick={() => setMobileOpen(false)}
            />
            <motion.aside
              initial={{ x: -280 }}
              animate={{ x: 0 }}
              exit={{ x: -280 }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed left-0 top-0 bottom-0 w-72 glass border-r border-slate-800/50 z-50 lg:hidden"
            >
              <SidebarContent />
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0 relative z-10">
        {/* Mobile header */}
        <header className="lg:hidden flex items-center justify-between px-4 py-3 glass border-b border-slate-800/50">
          <button onClick={() => setMobileOpen(true)} className="p-2 text-slate-400 hover:text-white">
            <Menu className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-teal-500 to-cyan-400 flex items-center justify-center">
              <Stethoscope className="w-4 h-4 text-slate-900" />
            </div>
            <span className="font-bold text-white">MedScan AI</span>
          </div>
          <div className="w-9 h-9 rounded-full bg-gradient-to-br from-teal-500 to-cyan-400 flex items-center justify-center text-sm font-bold text-slate-900">
            {(user?.name?.[0] || 'U').toUpperCase()}
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-auto p-4 lg:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
