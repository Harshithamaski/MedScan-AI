import api from '../services/api'

/**
 * Poll until report analysis completes or fails (max ~3 min)
 */
export async function pollReportUntilDone(reportId, { onProgress } = {}) {
  const maxAttempts = 90
  const intervalMs = 2000

  for (let attempt = 0; attempt < maxAttempts; attempt++) {
    const data = await api.get(`/reports/${reportId}`)
    const report = data.report

    if (onProgress) onProgress(report, attempt)

    if (report.status === 'completed') {
      return report
    }

    if (report.status === 'failed') {
      throw new Error(report.errorMessage || 'Analysis failed. Please try again.')
    }

    await new Promise((r) => setTimeout(r, intervalMs))
  }

  throw new Error('Analysis is taking too long. Check that the backend is running and GEMINI_API_KEY is set.')
}
