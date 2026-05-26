import React from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Stethoscope, Upload, Brain, Shield, ArrowRight, CheckCircle, Zap, Heart, FileText } from 'lucide-react'

const features = [
  { icon: Upload, title: 'Upload Any Report', desc: 'Blood tests, prescriptions, scans, X-rays — upload PDF or images' },
  { icon: Brain, title: 'AI-Powered Analysis', desc: 'Gemini AI reads and understands your medical reports instantly' },
  { icon: Heart, title: 'Simple Explanations', desc: 'Complex medical terms explained in language anyone can understand' },
  { icon: Shield, title: 'Private & Secure', desc: 'Your health data is encrypted and never shared with anyone' }
]

const stats = [
  { value: '50+', label: 'Report Types Supported' },
  { value: '99%', label: 'Analysis Accuracy' },
  { value: '<30s', label: 'Average Analysis Time' },
  { value: '100%', label: 'Private & Secure' }
]

const steps = [
  { num: '01', title: 'Upload Your Report', desc: 'Take a photo or upload a PDF of any medical report' },
  { num: '02', title: 'AI Reads & Understands', desc: 'Our AI extracts all text and understands medical terminology' },
  { num: '03', title: 'Get Clear Explanation', desc: 'Receive a simple, easy-to-understand analysis in seconds' }
]

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-slate-950 bg-grid overflow-hidden">
      {/* Background orbs */}
      <div className="orb orb-teal w-[600px] h-[600px] -top-40 -left-40" />
      <div className="orb orb-blue w-[500px] h-[500px] top-1/2 -right-60" />
      <div className="orb orb-teal w-[400px] h-[400px] bottom-0 left-1/3" />

      {/* Navbar */}
      <nav className="relative z-10 flex items-center justify-between px-6 md:px-12 py-5 glass border-b border-slate-800/50">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-teal-500 to-cyan-400 flex items-center justify-center shadow-lg shadow-teal-500/30">
            <Stethoscope className="w-5 h-5 text-slate-900" />
          </div>
          <span className="text-xl font-bold text-white">MedScan <span className="gradient-text">AI</span></span>
        </div>
        <div className="flex items-center gap-3">
          <Link to="/login" className="btn-secondary text-sm py-2.5">Sign In</Link>
          <Link to="/signup" className="btn-primary text-sm py-2.5">Get Started Free</Link>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative z-10 max-w-6xl mx-auto px-6 pt-24 pb-20 text-center">
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-lighter text-teal-400 text-sm font-medium mb-8 border border-teal-500/20">
            <Zap className="w-4 h-4" />
            Powered by Google Gemini AI
          </div>

          <h1 className="text-5xl md:text-7xl font-bold text-white leading-tight mb-6">
            Understand Your<br />
            <span className="gradient-text">Medical Reports</span><br />
            Instantly
          </h1>

          <p className="text-xl text-slate-400 max-w-2xl mx-auto mb-10 leading-relaxed">
            Upload any prescription, blood test, or scan report and get a clear, 
            simple explanation in plain English — no medical degree required.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link to="/signup">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="btn-primary flex items-center gap-2 text-base px-8 py-4"
              >
                Analyze My Report Free
                <ArrowRight className="w-5 h-5" />
              </motion.button>
            </Link>
            <Link to="/login" className="text-slate-400 hover:text-teal-400 transition-colors flex items-center gap-2 font-medium">
              Already have an account? Sign in →
            </Link>
          </div>
        </motion.div>

        {/* Hero card mockup */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.8 }}
          className="mt-16 max-w-2xl mx-auto"
        >
          <div className="glass-card p-6 text-left shadow-2xl shadow-teal-900/20">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-8 h-8 rounded-lg bg-teal-500/20 flex items-center justify-center">
                <FileText className="w-4 h-4 text-teal-400" />
              </div>
              <div>
                <p className="text-sm font-semibold text-white">Blood Test Report Analysis</p>
                <p className="text-xs text-slate-400">Analyzed 2 seconds ago</p>
              </div>
              <span className="ml-auto badge-teal">Completed</span>
            </div>
            <div className="space-y-3">
              <div className="glass-lighter p-3 rounded-xl">
                <p className="text-xs text-teal-400 font-semibold mb-1">📋 Summary</p>
                <p className="text-sm text-slate-300">Your blood sugar is slightly elevated at 108 mg/dL. This is in the pre-diabetes range. Your cholesterol and other markers look normal. No immediate concern, but lifestyle changes are recommended.</p>
              </div>
              <div className="grid grid-cols-3 gap-2">
                {['Glucose: 108 ⚠️', 'HbA1c: 5.8%', 'Cholesterol: Normal ✓'].map(v => (
                  <div key={v} className="glass p-2 rounded-lg text-center">
                    <p className="text-xs text-slate-300">{v}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      </section>

      {/* Stats */}
      <section className="relative z-10 border-y border-slate-800/50 py-12">
        <div className="max-w-4xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          {stats.map(({ value, label }, i) => (
            <motion.div
              key={label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
            >
              <div className="text-3xl font-bold gradient-text mb-1">{value}</div>
              <div className="text-slate-400 text-sm">{label}</div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section className="relative z-10 max-w-6xl mx-auto px-6 py-24">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-white mb-4">Everything You Need to Understand Your Health</h2>
          <p className="text-slate-400 text-lg">No confusing medical jargon. Just clear, actionable insights.</p>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map(({ icon: Icon, title, desc }, i) => (
            <motion.div
              key={title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              whileHover={{ y: -5 }}
              className="glass-card p-6 hover:border-teal-500/30 transition-all duration-300"
            >
              <div className="w-12 h-12 rounded-xl bg-teal-500/15 border border-teal-500/20 flex items-center justify-center mb-4">
                <Icon className="w-6 h-6 text-teal-400" />
              </div>
              <h3 className="text-white font-semibold text-lg mb-2">{title}</h3>
              <p className="text-slate-400 text-sm leading-relaxed">{desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section className="relative z-10 max-w-4xl mx-auto px-6 py-20">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-white mb-4">How It Works</h2>
          <p className="text-slate-400">Simple 3-step process to understand any medical report</p>
        </div>
        <div className="space-y-6">
          {steps.map(({ num, title, desc }, i) => (
            <motion.div
              key={num}
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.15 }}
              className="glass-card p-6 flex items-start gap-6"
            >
              <div className="text-4xl font-bold gradient-text font-mono flex-shrink-0">{num}</div>
              <div>
                <h3 className="text-white font-semibold text-xl mb-2">{title}</h3>
                <p className="text-slate-400">{desc}</p>
              </div>
              <CheckCircle className="w-6 h-6 text-teal-500 ml-auto flex-shrink-0 mt-1" />
            </motion.div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="relative z-10 max-w-3xl mx-auto px-6 py-20 text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          className="glass-card p-12"
        >
          <div className="text-5xl mb-6">🩺</div>
          <h2 className="text-3xl font-bold text-white mb-4">Ready to Understand Your Health?</h2>
          <p className="text-slate-400 mb-8">Join thousands who use MedScan AI to make sense of their medical reports.</p>
          <Link to="/signup">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="btn-primary text-base px-10 py-4"
            >
              Start For Free — No Credit Card
            </motion.button>
          </Link>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 border-t border-slate-800/50 py-8 text-center">
        <div className="flex items-center justify-center gap-2 text-slate-400 text-sm">
          <Stethoscope className="w-4 h-4 text-teal-500" />
          <span>MedScan AI — For educational purposes only. Always consult a licensed doctor.</span>
        </div>
      </footer>
    </div>
  )
}
