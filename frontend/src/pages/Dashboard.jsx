import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Upload, FileText, CheckCircle, Clock, ArrowRight, TrendingUp, Activity } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import api from '../services/api'
import toast from 'react-hot-toast'

const reportTypeLabel = {
  prescription: 'Prescription',
  blood_report: 'Blood Report',
  scan_report: 'Scan Report',
  other: 'Medical Report'
}

const statusBadge = {
  completed: 'badge-teal',
  processing: 'badge-yellow',
  failed: 'badge-red'
}

export default function Dashboard() {
  const { user } = useAuth()
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api.get('/reports/dashboard-stats')
      .then(d => setStats(d.stats))
      .catch(() => toast.error('Failed to load dashboard'))
      .finally(() => setLoading(false))
  }, [])

  const greeting = () => {
    const h = new Date().getHours()
    if (h < 12) return 'Good morning'
    if (h < 17) return 'Good afternoon'
    return 'Good evening'
  }

  return (
    <div className="max-w-5xl mx-auto">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
        <h1 className="text-3xl font-bold text-white">
          {greeting()}, <span className="gradient-text">{user?.name?.split(' ')[0]}</span> 👋
        </h1>
        <p className="text-slate-400 mt-1">Here's an overview of your health report history</p>
      </motion.div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {[
          { label: 'Total Reports', value: stats?.total ?? '—', icon: FileText, color: 'text-teal-400', bg: 'bg-teal-500/10' },
          { label: 'Analyzed', value: stats?.completed ?? '—', icon: CheckCircle, color: 'text-green-400', bg: 'bg-green-500/10' },
          { label: 'This Month', value: stats?.recentReports?.length ?? '—', icon: TrendingUp, color: 'text-cyan-400', bg: 'bg-cyan-500/10' },
          { label: 'Reports Left', value: '∞', icon: Activity, color: 'text-purple-400', bg: 'bg-purple-500/10' }
        ].map(({ label, value, icon: Icon, color, bg }, i) => (
          <motion.div
            key={label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.08 }}
            className="glass-card p-5"
          >
            <div className={`w-10 h-10 rounded-xl ${bg} flex items-center justify-center mb-3`}>
              <Icon className={`w-5 h-5 ${color}`} />
            </div>
            <div className="text-2xl font-bold text-white">{loading ? '...' : value}</div>
            <div className="text-slate-400 text-sm mt-0.5">{label}</div>
          </motion.div>
        ))}
      </div>

      {/* Upload CTA */}
      <motion.div
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.2 }}
        className="glass-card p-8 mb-8 bg-gradient-to-br from-teal-900/20 to-slate-900/0 border-teal-500/20"
      >
        <div className="flex flex-col md:flex-row items-center gap-6">
          <div className="flex-1">
            <div className="text-3xl mb-3">🔬</div>
            <h2 className="text-2xl font-bold text-white mb-2">Analyze a New Report</h2>
            <p className="text-slate-400">Upload a prescription, blood test, or any medical report and get instant AI-powered explanations in simple language.</p>
          </div>
          <Link to="/upload">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="btn-primary flex items-center gap-2 px-8 py-4 text-base whitespace-nowrap"
            >
              <Upload className="w-5 h-5" />
              Upload Report
            </motion.button>
          </Link>
        </div>
      </motion.div>

      {/* Recent reports */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-white">Recent Reports</h2>
          <Link to="/reports" className="text-teal-400 hover:text-teal-300 text-sm flex items-center gap-1 transition-colors">
            View all <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {loading ? (
          <div className="space-y-3">
            {[1,2,3].map(i => (
              <div key={i} className="glass-card p-5 animate-pulse">
                <div className="h-4 bg-slate-700 rounded w-1/3 mb-2" />
                <div className="h-3 bg-slate-800 rounded w-1/2" />
              </div>
            ))}
          </div>
        ) : stats?.recentReports?.length > 0 ? (
          <div className="space-y-3">
            {stats.recentReports.map((report, i) => (
              <motion.div
                key={report._id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 * i }}
              >
                <Link to={`/reports/${report._id}`} className="block glass-card p-5 hover:border-teal-500/30 transition-all duration-200 group">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-start gap-3 min-w-0">
                      <div className="w-10 h-10 rounded-xl bg-teal-500/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <FileText className="w-5 h-5 text-teal-400" />
                      </div>
                      <div className="min-w-0">
                        <p className="font-semibold text-white truncate group-hover:text-teal-300 transition-colors">{report.fileName}</p>
                        <p className="text-slate-400 text-sm">{reportTypeLabel[report.reportType]}</p>
                        {report.analysis?.summary && (
                          <p className="text-slate-500 text-xs mt-1 line-clamp-1">{report.analysis.summary}</p>
                        )}
                      </div>
                    </div>
                    <div className="flex flex-col items-end gap-2 flex-shrink-0">
                      <span className={statusBadge[report.status] || 'badge-teal'}>{report.status}</span>
                      <span className="text-slate-500 text-xs flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {new Date(report.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="glass-card p-12 text-center">
            <div className="text-5xl mb-4">📋</div>
            <h3 className="text-white font-semibold text-lg mb-2">No reports yet</h3>
            <p className="text-slate-400 mb-6">Upload your first medical report to get started</p>
            <Link to="/upload" className="btn-primary inline-flex items-center gap-2">
              <Upload className="w-4 h-4" /> Upload Your First Report
            </Link>
          </div>
        )}
      </motion.div>
    </div>
  )
}
