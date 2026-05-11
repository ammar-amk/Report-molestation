import { useState } from 'react'
import { BrowserRouter, Navigate, Route, Routes, useNavigate } from 'react-router-dom'
import api from './api/axios'
import LandingPage from './pages/LandingPage'
import ComplaintForm from './pages/ComplaintForm'
import AdminDashboard from './pages/AdminDashboard'

function ProtectedRoute({ children }) {
  const token = localStorage.getItem('access_token')
  if (!token) return <Navigate to="/admin-login" replace />
  return children
}

function LoginPage() {
  const navigate = useNavigate()
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    try {
      const res = await api.post('/login/', { username, password })
      localStorage.setItem('access_token', res.data.access)
      navigate('/admin')
    } catch {
      setError('Invalid credentials. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      <header className="bg-portal-blue py-4 px-6 shadow">
        <h1 className="text-white text-xl font-bold">Confidential Incident Reporting Portal</h1>
        <p className="text-blue-200 text-sm">Staff Access</p>
      </header>

      <div className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="bg-white rounded-lg shadow-md w-full max-w-sm p-8">
          <h2 className="text-portal-blue text-2xl font-bold mb-1">Staff Login</h2>
          <p className="text-gray-500 text-sm mb-6">Authorized personnel only</p>

          {error && (
            <div className="bg-red-50 border border-red-300 rounded p-3 mb-4 text-red-700 text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-portal-blue font-medium text-sm mb-1">Username</label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-portal-blue"
                placeholder="Enter username"
              />
            </div>
            <div>
              <label className="block text-portal-blue font-medium text-sm mb-1">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-portal-blue"
                placeholder="Enter password"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-portal-blue text-white py-2.5 rounded font-semibold hover:bg-blue-900 transition-colors disabled:opacity-60"
            >
              {loading ? 'Signing in…' : 'Sign In'}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/report" element={<ComplaintForm />} />
        <Route path="/admin-login" element={<LoginPage />} />
        <Route
          path="/admin"
          element={
            <ProtectedRoute>
              <AdminDashboard />
            </ProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  )
}
