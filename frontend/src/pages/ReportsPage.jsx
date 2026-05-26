import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { FileText, Clock, ArrowRight, Search, Trash2, Loader2, Upload } from 'lucide-react'
import toast from 'react-hot-toast'
import api from '../services/api'

const typeLabel = { prescription: 'Prescription', blood_report: 'Blood Report', scan_report: 'Scan Report', other: 'Medical Report' }
const statusBadge = { completed: 'badge-teal', processing: 'badge-yellow', failed: 'badge-red' }
const typeIcon = { prescription: '💊', blood_report: '🩸', scan_report: '🔬', other: '📄' }

export default function ReportsPage() {
  const [reports, setReports] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [deleting, setDeleting] = useState(null)

  useEffect(() => {
    api.get('/reports?limit=50')
      .then(d => setReports(d.reports))
      .catch(() => toast.error('Failed to load reports'))
      .finally(() => setLoading(false))
  }, [])

  const handleDelete = async (e, id) => {
    e.preventDefault()
    e.stopPropagation()
    if (!confirm('Delete this report?')) return
    setDeleting(id)
    try {
      await api.delete(`/reports/${id}`)
      setReports(r => r.filter(rep => rep._id !== id))
      toast.success('Report deleted')
    } catch {
      toast.error('Failed to delete')
    } finally {
      setDeleting(null)
    }
  }

  const filtered = reports.filter(r =>
    r.fileName.toLowerCase().includes(search.toLowerCase()) ||
    typeLabel[r.reportType]?.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="max-w-4xl mx-auto">
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white">My Reports</h1>
          <p className="text-slate-400 mt-1">{reports.length} report{reports.length !== 1 ? 's' : ''} analyzed</p>
        </div>
        <Link to="/upload" className="btn-primary flex items-center gap-2 self-start">
          <Upload className="w-4 h-4" /> Upload New
        </Link>
      </motion.div>

      {/* Search */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }} className="relative mb-6">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
        <input
          type="text"
          className="input-field pl-11"
          placeholder="Search reports by name or type..."
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
      </motion.div>

      {loading ? (
        <div className="space-y-3">
          {[1,2,3,4].map(i => (
            <div key={i} className="glass-card p-5 animate-pulse">
              <div className="flex gap-4">
                <div className="w-12 h-12 rounded-xl bg-slate-700" />
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-slate-700 rounded w-2/5" />
                  <div className="h-3 bg-slate-800 rounded w-1/3" />
                  <div className="h-3 bg-slate-800 rounded w-3/4" />
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="glass-card p-16 text-center">
          <div className="text-6xl mb-4">{search ? '🔍' : '📋'}</div>
          <h3 className="text-white font-semibold text-xl mb-2">
            {search ? 'No matching reports' : 'No reports yet'}
          </h3>
          <p className="text-slate-400 mb-6">
            {search ? 'Try a different search term' : 'Upload your first medical report to get AI-powered explanations'}
          </p>
          {!search && (
            <Link to="/upload" className="btn-primary inline-flex items-center gap-2">
              <Upload className="w-4 h-4" /> Upload Report
            </Link>
          )}
        </motion.div>
      ) : (
        <div className="space-y-3">
          {filtered.map((report, i) => (
            <motion.div
              key={report._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.04 }}
            >
              <Link to={`/reports/${report._id}`} className="block glass-card p-5 hover:border-teal-500/30 transition-all duration-200 group">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-teal-500/10 border border-teal-500/20 flex items-center justify-center text-xl flex-shrink-0">
                    {typeIcon[report.reportType] || '📄'}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <p className="font-semibold text-white group-hover:text-teal-300 transition-colors truncate">{report.fileName}</p>
                        <p className="text-slate-400 text-sm">{typeLabel[report.reportType]}</p>
                      </div>
                      <div className="flex items-center gap-2 flex-shrink-0">
                        <span className={statusBadge[report.status] || 'badge-teal'}>{report.status}</span>
                        <button
                          onClick={(e) => handleDelete(e, report._id)}
                          disabled={deleting === report._id}
                          className="p-1.5 text-slate-500 hover:text-red-400 rounded-lg hover:bg-red-500/10 transition-all opacity-0 group-hover:opacity-100"
                        >
                          {deleting === report._id
                            ? <Loader2 className="w-4 h-4 animate-spin" />
                            : <Trash2 className="w-4 h-4" />
                          }
                        </button>
                        <ArrowRight className="w-4 h-4 text-slate-600 group-hover:text-teal-400 transition-colors" />
                      </div>
                    </div>
                    {report.analysis?.summary && (
                      <p className="text-slate-500 text-sm mt-2 line-clamp-2">{report.analysis.summary}</p>
                    )}
                    <p className="text-slate-600 text-xs mt-2 flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {new Date(report.createdAt).toLocaleDateString('en-US', { year:'numeric', month:'short', day:'numeric', hour:'2-digit', minute:'2-digit' })}
                    </p>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  )
}
