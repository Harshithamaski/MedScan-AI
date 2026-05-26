import React from 'react'
import ReactDOM from 'react-dom/client'
import { GoogleOAuthProvider } from '@react-oauth/google'
import App from './App.jsx'
import './index.css'

const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID

if (!GOOGLE_CLIENT_ID) {
  console.error(
    'Missing VITE_GOOGLE_CLIENT_ID. Add it to frontend/.env (local) or Vercel Environment Variables (production).'
  )
}

const clientId = GOOGLE_CLIENT_ID || 'missing-client-id.apps.googleusercontent.com'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <GoogleOAuthProvider clientId={clientId}>
      <App />
    </GoogleOAuthProvider>
  </React.StrictMode>
)
