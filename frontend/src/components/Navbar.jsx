import { Link, useNavigate } from 'react-router-dom'

export default function Navbar() {
  const navigate = useNavigate()
  const isLoggedIn = !!localStorage.getItem('access_token')

  const handleLogout = () => {
    localStorage.removeItem('access_token')
    navigate('/admin-login')
  }

  return (
    <nav className="bg-white shadow-md border-b-2 border-portal-blue">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link
            to="/"
            className="text-portal-blue font-bold text-lg sm:text-xl truncate max-w-xs sm:max-w-none"
          >
            Incident Reporting Portal
          </Link>

          <div className="flex items-center gap-4">
            {isLoggedIn ? (
              <>
                <Link
                  to="/admin"
                  className="text-portal-blue hover:text-blue-800 font-medium transition-colors"
                >
                  Dashboard
                </Link>
                <button
                  onClick={handleLogout}
                  className="bg-portal-red text-white px-4 py-2 rounded hover:bg-red-700 transition-colors text-sm font-medium"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/report"
                  className="text-portal-blue hover:text-blue-800 font-medium transition-colors"
                >
                  Report Incident
                </Link>
                <Link
                  to="/admin-login"
                  className="bg-portal-blue text-white px-4 py-2 rounded hover:bg-blue-900 transition-colors text-sm font-medium"
                >
                  Staff Login
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
}
