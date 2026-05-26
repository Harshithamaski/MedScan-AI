import React from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import { AuthProvider, useAuth } from './context/AuthContext'
import LandingPage from './pages/LandingPage'
import LoginPage from './pages/LoginPage'
import SignupPage from './pages/SignupPage'
import Dashboard from './pages/Dashboard'
import UploadPage from './pages/UploadPage'
import AnalysisResult from './pages/AnalysisResult'
import ReportsPage from './pages/ReportsPage'
import ProfilePage from './pages/ProfilePage'
import Layout from './components/Layout'
import LoadingScreen from './components/LoadingScreen'

const PrivateRoute = ({ children }) => {
  const { user, loading } = useAuth()

  if (loading) return <LoadingScreen />

  return user ? children : <Navigate to="/login" replace />
}

const PublicRoute = ({ children }) => {
  const { user, loading } = useAuth()

  if (loading) return <LoadingScreen />

  return user ? <Navigate to="/dashboard" replace /> : children
}

const AppRoutes = () => (
  <Routes>
    <Route path="/" element={<LandingPage />} />

    <Route
      path="/login"
      element={
        <PublicRoute>
          <LoginPage />
        </PublicRoute>
      }
    />

    <Route
      path="/signup"
      element={
        <PublicRoute>
          <SignupPage />
        </PublicRoute>
      }
    />

    <Route
      element={
        <PrivateRoute>
          <Layout />
        </PrivateRoute>
      }
    >
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/upload" element={<UploadPage />} />
      <Route path="/reports" element={<ReportsPage />} />
      <Route path="/reports/:id" element={<AnalysisResult />} />
      <Route path="/profile" element={<ProfilePage />} />
    </Route>

    <Route path="*" element={<Navigate to="/" replace />} />
  </Routes>
)

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Toaster position="top-right" />
        <AppRoutes />
      </BrowserRouter>
    </AuthProvider>
  )
}

export default App