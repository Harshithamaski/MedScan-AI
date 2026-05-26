import React from 'react'
import { motion } from 'framer-motion'

export default function LoadingScreen() {
  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center">
      <div className="text-center">
        <motion.div
          animate={{ scale: [1, 1.1, 1], opacity: [0.7, 1, 0.7] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-teal-500 to-cyan-400 flex items-center justify-center"
        >
          <span className="text-2xl">🔬</span>
        </motion.div>
        <motion.div
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 1.5, repeat: Infinity }}
          className="text-teal-400 font-semibold text-lg"
        >
          MedScan AI
        </motion.div>
        <p className="text-slate-500 text-sm mt-1">Loading...</p>
      </div>
    </div>
  )
}
