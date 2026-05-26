import React, { useState, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Upload, FileText, Image, X, CheckCircle, Loader2, AlertTriangle } from 'lucide-react'
import toast from 'react-hot-toast'
import api from '../services/api'
import { pollReportUntilDone } from '../utils/pollReport'

const reportTypes = [
  { value: 'blood_report', label: '🩸 Blood Report', desc: 'CBC, lipid panel, glucose, etc.' },
  { value: 'prescription', label: '💊 Prescription', desc: 'Doctor prescriptions & medicines' },
  { value: 'scan_report', label: '🔬 Scan/X-Ray Report', desc: 'MRI, CT, X-Ray, ultrasound' },
  { value: 'other', label: '📄 Other Report', desc: 'Any other medical document' }
]

export default function UploadPage() {
  const navigate = useNavigate()
  const [file, setFile] = useState(null)
  const [reportType, setReportType] = useState('blood_report')
  const [uploading, setUploading] = useState(false)
  const [progress, setProgress] = useState(0)
  const [dragOver, setDragOver] = useState(false)
  const [stage, setStage] = useState('')

  const handleFile = (f) => {
    if (!f) return
    const allowed = ['application/pdf', 'image/jpeg', 'image/jpg', 'image/png', 'image/webp']
    if (!allowed.includes(f.type)) return toast.error('Only PDF, JPG, PNG, WebP allowed')
    if (f.size > 20 * 1024 * 1024) return toast.error('File too large. Max 20MB.')
    setFile(f)
  }

  const handleDrop = useCallback((e) => {
    e.preventDefault()
    setDragOver(false)
    handleFile(e.dataTransfer.files[0])
  }, [])

  const handleUpload = async () => {
    if (!file) return toast.error('Please select a file first')

    const token = localStorage.getItem('medscan_token')
    if (!token) {
      toast.error('Please log in first')
      navigate('/login')
      return
    }

    setUploading(true)
    setProgress(10)
    setStage('uploading')

    const formData = new FormData()
    formData.append('report', file)
    formData.append('reportType', reportType)

    let progressInterval
    try {
      progressInterval = setInterval(() => {
        setProgress((p) => {
          if (p < 30) return p + 2
          if (p < 85) return p + 1
          return p
        })
      }, 600)

      const data = await api.post('/reports/upload', formData)

      const reportId = data?.report?._id
      if (!reportId) {
        throw new Error('Server did not return a report ID. Is the backend running?')
      }

      setStage('analyzing')
      setProgress(35)

      await pollReportUntilDone(reportId, {
        onProgress: (report) => {
          if (report.status === 'processing') {
            setStage('analyzing')
            setProgress((p) => Math.min(p + 2, 92))
          }
        }
      })

      clearInterval(progressInterval)
      setProgress(100)
      setStage('done')
      toast.success('Report analyzed successfully!')
      setTimeout(() => navigate(`/reports/${reportId}`), 600)
    } catch (err) {
      toast.error(err.message || 'Upload failed. Please try again.')
      setUploading(false)
      setProgress(0)
      setStage('')
    } finally {
      if (progressInterval) clearInterval(progressInterval)
    }
  }

  const stageLabel = {
    uploading: 'Uploading your file...',
    extracting: 'Extracting text from your report...',
    analyzing: 'AI is analyzing your report (30–90 sec)...',
    done: 'Analysis complete! Redirecting...'
  }

  return (
    <div className="max-w-2xl mx-auto">
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">Upload Medical Report</h1>
        <p className="text-slate-400">Get instant AI-powered explanations in simple language</p>
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="mb-6">
        <label className="label text-base mb-3">What type of report is this?</label>
        <div className="grid grid-cols-2 gap-3">
          {reportTypes.map(({ value, label, desc }) => (
            <button
              key={value}
              type="button"
              onClick={() => setReportType(value)}
              className={`p-4 rounded-xl border text-left transition-all duration-200 ${
                reportType === value
                  ? 'border-teal-500/60 bg-teal-500/10 text-white'
                  : 'border-slate-700 bg-slate-900/50 text-slate-400 hover:border-slate-600'
              }`}
            >
              <div className="font-medium text-sm">{label}</div>
              <div className="text-xs opacity-70 mt-0.5">{desc}</div>
            </button>
          ))}
        </div>
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}>
        <AnimatePresence>
          {!file ? (
            <motion.div
              key="dropzone"
              onDragOver={(e) => { e.preventDefault(); setDragOver(true) }}
              onDragLeave={() => setDragOver(false)}
              onDrop={handleDrop}
              onClick={() => document.getElementById('fileInput').click()}
              className={`border-2 border-dashed rounded-2xl p-12 text-center cursor-pointer transition-all duration-300 ${
                dragOver
                  ? 'border-teal-400 bg-teal-500/10'
                  : 'border-slate-700 hover:border-teal-500/50 hover:bg-slate-800/30'
              }`}
            >
              <input
                id="fileInput"
                type="file"
                accept=".pdf,image/jpeg,image/jpg,image/png,image/webp"
                className="hidden"
                onChange={(e) => handleFile(e.target.files[0])}
              />
              <motion.div animate={dragOver ? { scale: 1.1 } : { scale: 1 }} className="flex flex-col items-center gap-4">
                <div className={`w-20 h-20 rounded-2xl flex items-center justify-center ${dragOver ? 'bg-teal-500/20' : 'bg-slate-800'}`}>
                  <Upload className={`w-10 h-10 ${dragOver ? 'text-teal-400' : 'text-slate-400'}`} />
                </div>
                <div>
                  <p className="text-white font-semibold text-lg">Drop your file here</p>
                  <p className="text-slate-400 text-sm mt-1">or click to browse</p>
                </div>
                <div className="flex items-center gap-4 text-slate-500 text-xs">
                  <span className="flex items-center gap-1"><FileText className="w-3 h-3" /> PDF</span>
                  <span className="flex items-center gap-1"><Image className="w-3 h-3" /> JPG, PNG, WebP</span>
                  <span>Max 20MB</span>
                </div>
              </motion.div>
            </motion.div>
          ) : (
            <motion.div
              key="file-preview"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="glass-card p-6"
            >
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-xl bg-teal-500/10 flex items-center justify-center flex-shrink-0">
                  {file.type === 'application/pdf'
                    ? <FileText className="w-7 h-7 text-teal-400" />
                    : <Image className="w-7 h-7 text-teal-400" />}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-white truncate">{file.name}</p>
                  <p className="text-slate-400 text-sm">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                </div>
                {!uploading && (
                  <button
                    type="button"
                    onClick={() => setFile(null)}
                    className="p-2 text-slate-400 hover:text-red-400 rounded-lg hover:bg-red-500/10 transition-all"
                  >
                    <X className="w-5 h-5" />
                  </button>
                )}
              </div>

              {file.type !== 'application/pdf' && (
                <div className="mt-4 rounded-xl overflow-hidden border border-slate-700 max-h-48">
                  <img src={URL.createObjectURL(file)} alt="Preview" className="w-full object-contain max-h-48" />
                </div>
              )}

              {uploading && (
                <div className="mt-5">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-teal-400 flex items-center gap-2">
                      {stage === 'done'
                        ? <CheckCircle className="w-4 h-4" />
                        : <Loader2 className="w-4 h-4 animate-spin" />}
                      {stageLabel[stage] || 'Processing...'}
                    </span>
                    <span className="text-sm font-mono text-slate-400">{progress}%</span>
                  </div>
                  <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
                    <motion.div
                      className="h-full bg-gradient-to-r from-teal-500 to-cyan-400 rounded-full"
                      animate={{ width: `${progress}%` }}
                      transition={{ duration: 0.5 }}
                    />
                  </div>
                  <div className="mt-3 p-3 rounded-xl bg-teal-500/5 border border-teal-500/10">
                    <p className="text-xs text-slate-400">
                      Keep this page open. Analysis runs on the server and usually takes 30–90 seconds.
                    </p>
                  </div>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="flex items-start gap-3 mt-5 p-4 rounded-xl bg-yellow-500/5 border border-yellow-500/20"
      >
        <AlertTriangle className="w-5 h-5 text-yellow-400 flex-shrink-0 mt-0.5" />
        <p className="text-yellow-300/80 text-sm">
          <strong>Medical Disclaimer:</strong> MedScan AI provides educational explanations only. Always consult a qualified doctor for medical advice.
        </p>
      </motion.div>

      {file && !uploading && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mt-6">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type="button"
            onClick={handleUpload}
            className="btn-primary w-full py-4 text-base flex items-center justify-center gap-2"
          >
            <Upload className="w-5 h-5" />
            Analyze Report with AI
          </motion.button>
        </motion.div>
      )}
    </div>
  )
}
