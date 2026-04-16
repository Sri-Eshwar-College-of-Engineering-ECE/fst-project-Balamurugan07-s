import { Link, useNavigate, useLocation } from 'react-router-dom'
import { motion } from 'framer-motion'
import { BookOpen, LogOut, UserCircle, PlusCircle, LayoutDashboard } from 'lucide-react'

export default function Navbar() {
  const navigate = useNavigate()
  const location = useLocation()
  const token = localStorage.getItem('token')
  const username = localStorage.getItem('username') || 'User'

  const logout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('username')
    navigate('/login')
  }

  const NavLink = ({ to, icon: Icon, children }) => {
    const isActive = location.pathname === to
    return (
      <Link to={to} className="relative px-3 py-2 text-sm font-medium transition-colors hover:text-indigo-600 flex items-center gap-2">
        <Icon size={16} className={isActive ? "text-indigo-600" : "text-gray-500"} />
        <span className={isActive ? "text-indigo-600" : "text-gray-600"}>{children}</span>
        {isActive && (
          <motion.div
            layoutId="navbar-indicator"
            className="absolute bottom-0 left-0 right-0 h-0.5 bg-indigo-600 rounded-t-full"
            initial={false}
            transition={{ type: "spring", stiffness: 500, damping: 30 }}
          />
        )}
      </Link>
    )
  }

  return (
    <nav className="sticky top-0 z-50 glass border-b border-gray-200/50 bg-white/70 backdrop-blur-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link to="/dashboard" className="flex items-center gap-3">
            <div className="bg-gradient-to-tr from-indigo-600 to-purple-600 p-2 rounded-xl text-white shadow-lg shadow-indigo-200">
              <BookOpen size={20} />
            </div>
            <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-gray-900 to-gray-600 tracking-tight">
              NoteStack
            </span>
          </Link>

          {token ? (
            <div className="flex items-center gap-2 sm:gap-6">
              <div className="hidden sm:flex items-center gap-1">
                <NavLink to="/dashboard" icon={LayoutDashboard}>Dashboard</NavLink>
                <NavLink to="/mynotes" icon={BookOpen}>My Notes</NavLink>
                <NavLink to="/upload" icon={PlusCircle}>Upload</NavLink>
              </div>
              
              <div className="flex items-center gap-4 border-l border-gray-200 pl-6 ml-2">
                <div className="flex items-center gap-2 text-sm font-medium text-gray-700">
                  <UserCircle size={20} className="text-gray-400" />
                  <span className="hidden sm:inline-block">{username}</span>
                </div>
                <button
                  onClick={logout}
                  className="flex items-center gap-2 bg-gray-50 hover:bg-red-50 text-gray-600 hover:text-red-600 px-3 py-1.5 rounded-lg transition-colors text-sm font-medium"
                >
                  <LogOut size={16} />
                  <span>Logout</span>
                </button>
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-4 text-sm font-medium">
              <Link to="/login" className="text-gray-500 hover:text-gray-900 transition">Login</Link>
              <Link to="/register" className="bg-indigo-600 text-white px-4 py-2 rounded-xl hover:bg-indigo-700 hover:shadow-md transition shadow-sm">
                Get Started
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  )
}
