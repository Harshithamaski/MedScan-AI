import React, { useEffect, useState } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  ArrowLeft, Pill, AlertTriangle, CheckCircle, Utensils,
  Activity, Heart, FileText, User, Trash2, TrendingUp, TrendingDown,
  AlertCircle, Info, Loader2, Shield
} from 'lucide-react'
import toast from 'react-hot-toast'
import api from '../services/api'

const SeverityBadge = ({ severity }) => {
  const map = {
    mild: 'badge-green', moderate: 'badge-yellow',
    severe: 'badge-red', critical: 'badge-red',
    low: 'badge-teal', borderline: 'badge-yellow',
    high: 'badge-red'
  }
  return <span className={map[severity?.toLowerCase()] || 'badge-teal'}>{severity || 'Normal'}</span>
}

const Section = ({ icon: Icon, title, children, color = 'teal', delay = 0 }) => {
  const colors = {
    teal: 'text-teal-400 bg-teal-500/10 border-teal-500/20',
    red: 'text-red-400 bg-red-500/10 border-red-500/20',
    yellow: 'text-yellow-400 bg-yellow-500/10 border-yellow-500/20',
    green: 'text-green-400 bg-green-500/10 border-green-500/20',
    blue: 'text-blue-400 bg-blue-500/10 border-blue-500/20',
    purple: 'text-purple-400 bg-purple-500/10 border-purple-500/20'
  }
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
      className="glass-card p-6"
    >
      <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-xl border text-sm font-semibold mb-4 ${colors[color]}`}>
        <Icon className="w-4 h-4" />
        {title}
      </div>
      {children}
    </motion.div>
  )
}

export default function AnalysisResult() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [report, setReport] = useState(null)
  const [loading, setLoading] = useState(true)
  const [deleting, setDeleting] = useState(false)

  const loadReport = () =>
    api.get(`/reports/${id}`).then((d) => {
      setReport(d.report)
      return d.report
    })

  useEffect(() => {
    let cancelled = false
    let pollTimer

    const fetchReport = async () => {
      try {
        const r = await loadReport()
        if (cancelled) return

        if (r.status === 'processing') {
          pollTimer = setTimeout(fetchReport, 2000)
          return
        }

        setLoading(false)
      } catch {
        if (!cancelled) {
          toast.error('Report not found')
          navigate('/reports')
        }
      }
    }

    setLoading(true)
    fetchReport()

    return () => {
      cancelled = true
      if (pollTimer) clearTimeout(pollTimer)
    }
  }, [id, navigate])

  const handleDelete = async () => {
    if (!confirm('Delete this report? This cannot be undone.')) return
    setDeleting(true)
    try {
      await api.delete(`/reports/${id}`)
      toast.success('Report deleted')
      navigate('/reports')
    } catch {
      toast.error('Failed to delete report')
      setDeleting(false)
    }
  }

  if (loading) return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <div className="text-center">
        <Loader2 className="w-10 h-10 text-teal-400 animate-spin mx-auto mb-3" />
        <p className="text-slate-400">Loading report...</p>
      </div>
    </div>
  )

  if (!report) return null

  if (report.status === 'failed') {
    return (
      <div className="max-w-2xl mx-auto text-center py-16">
        <AlertTriangle className="w-12 h-12 text-red-400 mx-auto mb-4" />
        <h1 className="text-xl font-bold text-white mb-2">Analysis failed</h1>
        <p className="text-slate-400 mb-6">{report.errorMessage || 'Something went wrong during analysis.'}</p>
        <Link to="/upload" className="btn-primary inline-flex">Try again</Link>
      </div>
    )
  }

  if (report.status === 'processing') {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <Loader2 className="w-10 h-10 text-teal-400 animate-spin mx-auto mb-3" />
          <p className="text-white font-medium">AI is still analyzing this report...</p>
          <p className="text-slate-400 text-sm mt-2">This page will update automatically.</p>
        </div>
      </div>
    )
  }

  const a = report.analysis || {}
  const hasContent =
    a.summary ||
    a.generalExplanation ||
    (a.medicines?.length > 0) ||
    (a.abnormalValues?.length > 0) ||
    (a.diseases?.length > 0)

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="flex items-start justify-between gap-4 mb-8">
        <div>
          <Link to="/reports" className="inline-flex items-center gap-2 text-slate-400 hover:text-teal-400 transition-colors text-sm mb-3">
            <ArrowLeft className="w-4 h-4" /> Back to Reports
          </Link>
          <h1 className="text-2xl font-bold text-white">{report.fileName}</h1>
          <div className="flex items-center gap-3 mt-2">
            <span className="badge-teal">{a.reportType || 'Medical Report'}</span>
            <span className="text-slate-400 text-sm">{new Date(report.createdAt).toLocaleString()}</span>
          </div>
        </div>
        <button onClick={handleDelete} disabled={deleting}
          className="flex items-center gap-2 px-4 py-2 rounded-xl text-red-400 hover:bg-red-500/10 border border-red-500/20 transition-all text-sm">
          {deleting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
          Delete
        </button>
      </motion.div>

      {!hasContent && (
        <div className="mb-6 p-5 rounded-2xl border border-yellow-500/30 bg-yellow-500/10 text-yellow-200/90 text-sm">
          No analysis content was saved for this report. Upload again or check that GEMINI_API_KEY is set on the backend.
        </div>
      )}

      {/* Serious warnings */}
      {a.seriousWarnings?.length > 0 && (
        <motion.div initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }}
          className="mb-6 p-5 rounded-2xl border border-red-500/40 bg-red-500/10">
          <div className="flex items-center gap-2 text-red-400 font-semibold mb-3">
            <AlertTriangle className="w-5 h-5" /> Serious Findings — Please See a Doctor
          </div>
          <ul className="space-y-2">
            {a.seriousWarnings.map((w, i) => (
              <li key={i} className="text-red-300/90 text-sm flex items-start gap-2">
                <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5 text-red-400" /> {w}
              </li>
            ))}
          </ul>
        </motion.div>
      )}

      {/* Summary */}
      {a.summary && (
        <Section icon={Info} title="Summary" color="teal" delay={0.05}>
          <p className="text-slate-300 leading-relaxed">{a.summary}</p>
        </Section>
      )}

      <div className="mt-5 space-y-5">
        {/* Patient info */}
        {a.patientInfo && Object.values(a.patientInfo).some(Boolean) && (
          <Section icon={User} title="Patient Information" color="blue" delay={0.1}>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {Object.entries(a.patientInfo).map(([k, v]) => v ? (
                <div key={k} className="bg-slate-800/50 p-3 rounded-xl">
                  <p className="text-slate-500 text-xs capitalize mb-1">{k}</p>
                  <p className="text-white font-medium text-sm">{v}</p>
                </div>
              ) : null)}
            </div>
          </Section>
        )}

        {/* General explanation */}
        {a.generalExplanation && (
          <Section icon={FileText} title="Detailed Explanation" color="teal" delay={0.12}>
            <div className="text-slate-300 leading-relaxed whitespace-pre-line">{a.generalExplanation}</div>
          </Section>
        )}

        {/* Diseases */}
        {a.diseases?.length > 0 && (
          <Section icon={Activity} title="Conditions Identified" color="red" delay={0.14}>
            <div className="space-y-3">
              {a.diseases.map((d, i) => (
                <div key={i} className="p-4 rounded-xl bg-slate-800/40 border border-slate-700/50">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-semibold text-white">{d.name}</span>
                    <SeverityBadge severity={d.severity} />
                  </div>
                  <p className="text-slate-400 text-sm">{d.description}</p>
                </div>
              ))}
            </div>
          </Section>
        )}

        {/* Medicines */}
        {a.medicines?.length > 0 && (
          <Section icon={Pill} title="Medicines" color="purple" delay={0.16}>
            <div className="space-y-4">
              {a.medicines.map((m, i) => (
                <div key={i} className="p-4 rounded-xl bg-slate-800/40 border border-slate-700/50">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-8 h-8 rounded-lg bg-purple-500/20 flex items-center justify-center">
                      <Pill className="w-4 h-4 text-purple-400" />
                    </div>
                    <span className="font-bold text-white text-lg">{m.name}</span>
                  </div>
                  <div className="grid md:grid-cols-3 gap-3">
                    {m.usage && (
                      <div className="bg-slate-900/50 p-3 rounded-lg">
                        <p className="text-slate-500 text-xs mb-1">Purpose</p>
                        <p className="text-slate-300 text-sm">{m.usage}</p>
                      </div>
                    )}
                    {m.dosage && (
                      <div className="bg-slate-900/50 p-3 rounded-lg">
                        <p className="text-slate-500 text-xs mb-1">Dosage</p>
                        <p className="text-slate-300 text-sm">{m.dosage}</p>
                      </div>
                    )}
                    {m.sideEffects && (
                      <div className="bg-slate-900/50 p-3 rounded-lg">
                        <p className="text-slate-500 text-xs mb-1">Side Effects</p>
                        <p className="text-slate-300 text-sm">{m.sideEffects}</p>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </Section>
        )}

        {/* Abnormal values */}
        {a.abnormalValues?.length > 0 && (
          <Section icon={TrendingUp} title="Abnormal Test Values" color="yellow" delay={0.18}>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="text-left text-slate-500 text-xs border-b border-slate-700/50">
                    <th className="pb-3 pr-4">Parameter</th>
                    <th className="pb-3 pr-4">Your Value</th>
                    <th className="pb-3 pr-4">Normal Range</th>
                    <th className="pb-3 pr-4">Status</th>
                    <th className="pb-3">Meaning</th>
                  </tr>
                </thead>
                <tbody className="space-y-2">
                  {a.abnormalValues.map((v, i) => (
                    <tr key={i} className="border-b border-slate-800/50 last:border-0">
                      <td className="py-3 pr-4 font-medium text-white text-sm">{v.parameter}</td>
                      <td className="py-3 pr-4">
                        <span className={`font-mono font-semibold text-sm ${
                          ['high','critical','severe'].includes(v.severity?.toLowerCase()) ? 'text-red-400' :
                          v.severity?.toLowerCase() === 'borderline' ? 'text-yellow-400' : 'text-teal-400'
                        }`}>{v.value}</span>
                      </td>
                      <td className="py-3 pr-4 text-slate-400 text-sm">{v.normalRange}</td>
                      <td className="py-3 pr-4"><SeverityBadge severity={v.severity} /></td>
                      <td className="py-3 text-slate-400 text-sm">{v.interpretation}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Section>
        )}

        {/* Precautions, food, lifestyle grid */}
        <div className="grid md:grid-cols-3 gap-5">
          {a.precautions?.length > 0 && (
            <Section icon={Shield} title="Precautions" color="yellow" delay={0.2}>
              <ul className="space-y-2">
                {a.precautions.map((p, i) => (
                  <li key={i} className="flex items-start gap-2 text-slate-300 text-sm">
                    <CheckCircle className="w-4 h-4 text-yellow-400 flex-shrink-0 mt-0.5" /> {p}
                  </li>
                ))}
              </ul>
            </Section>
          )}

          {a.foodSuggestions?.length > 0 && (
            <Section icon={Utensils} title="Food & Diet" color="green" delay={0.22}>
              <ul className="space-y-2">
                {a.foodSuggestions.map((f, i) => (
                  <li key={i} className="flex items-start gap-2 text-slate-300 text-sm">
                    <CheckCircle className="w-4 h-4 text-green-400 flex-shrink-0 mt-0.5" /> {f}
                  </li>
                ))}
              </ul>
            </Section>
          )}

          {a.lifestyleSuggestions?.length > 0 && (
            <Section icon={Heart} title="Lifestyle" color="teal" delay={0.24}>
              <ul className="space-y-2">
                {a.lifestyleSuggestions.map((l, i) => (
                  <li key={i} className="flex items-start gap-2 text-slate-300 text-sm">
                    <CheckCircle className="w-4 h-4 text-teal-400 flex-shrink-0 mt-0.5" /> {l}
                  </li>
                ))}
              </ul>
            </Section>
          )}
        </div>

        {/* Doctor advice */}
        {a.doctorAdvice && (
          <Section icon={Activity} title="When to See a Doctor" color="red" delay={0.26}>
            <p className="text-slate-300 leading-relaxed">{a.doctorAdvice}</p>
          </Section>
        )}

        {/* Disclaimer */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}
          className="p-4 rounded-xl border border-slate-700/50 bg-slate-900/30">
          <p className="text-slate-500 text-xs text-center">
            ⚕️ This analysis is for educational purposes only and does not constitute medical advice. Please consult a qualified healthcare professional for proper diagnosis and treatment.
          </p>
        </motion.div>
      </div>
    </div>
  )
}
