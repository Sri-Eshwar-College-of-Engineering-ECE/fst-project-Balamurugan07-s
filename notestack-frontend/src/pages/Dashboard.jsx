import { useEffect, useState } from 'react'
import api from '../api/axiosConfig'
import NoteCard from '../components/NoteCard'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { FileText, ArrowRight, Loader2, PlusCircle, Notebook } from 'lucide-react'

export default function Dashboard() {
  const [notes, setNotes] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const username = localStorage.getItem('username') || 'User'

  useEffect(() => {
    api.get('/notes')
      .then(res => setNotes(res.data))
      .catch(() => setError('Failed to load notes'))
      .finally(() => setLoading(false))
  }, [])

  const stats = [
    { title: 'Total Notes', value: notes.length, icon: Notebook, color: 'text-blue-600', bg: 'bg-blue-50' },
    { title: 'With Attachments', value: notes.filter(n => n.filePath).length, icon: FileText, color: 'text-indigo-600', bg: 'bg-indigo-50' },
  ]

  return (
    <div className="min-h-screen bg-[#FAFAFA] px-4 sm:px-6 lg:px-8 py-12">
      <div className="max-w-7xl mx-auto space-y-12">
        {/* Welcome Banner */}
        <motion.div 
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col sm:flex-row sm:items-end justify-between gap-6"
        >
          <div>
            <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-gray-900 to-gray-700">
              Welcome back, {username} 👋
            </h1>
            <p className="text-gray-500 mt-2 text-lg">Here's what's happening with your notes today.</p>
          </div>
          <Link
            to="/upload"
            className="flex items-center gap-2 bg-gray-900 text-white px-5 py-2.5 rounded-xl text-sm font-semibold hover:bg-indigo-600 transition-colors shadow-sm hover:shadow-md"
          >
            <PlusCircle size={18} />
            New Note
          </Link>
        </motion.div>

        {/* Stats Grid */}
        {!loading && !error && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
          >
            {stats.map((stat, i) => {
              const Icon = stat.icon
              return (
                <div key={i} className="glass rounded-2xl p-6 flex items-center gap-5">
                  <div className={`p-4 rounded-2xl ${stat.bg} ${stat.color}`}>
                    <Icon size={24} />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500 mb-1">{stat.title}</p>
                    <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                  </div>
                </div>
              )
            })}
          </motion.div>
        )}

        {/* Content Section */}
        <div>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-800">Recent Notes</h2>
            <Link to="/mynotes" className="text-sm font-medium text-indigo-600 hover:text-indigo-800 flex items-center gap-1">
              View all <ArrowRight size={16} />
            </Link>
          </div>

          {loading && (
            <div className="flex flex-col items-center justify-center py-20 text-gray-400">
              <Loader2 className="animate-spin mb-4" size={32} />
              <p>Loading your notes...</p>
            </div>
          )}

          {error && (
            <div className="bg-red-50 text-red-500 p-6 rounded-2xl text-center font-medium border border-red-100">
              {error}
            </div>
          )}

          {!loading && !error && notes.length === 0 && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="glass p-12 rounded-3xl text-center flex flex-col items-center justify-center border-dashed border-2 border-gray-200"
            >
              <div className="bg-indigo-50 p-6 rounded-full text-indigo-500 mb-6">
                <Notebook size={48} strokeWidth={1.5} />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">No notes yet</h3>
              <p className="text-gray-500 max-w-sm mx-auto mb-8">
                Get started by creating your first note. You can add descriptions and upload file attachments.
              </p>
              <Link
                to="/upload"
                className="bg-indigo-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-indigo-700 transition-colors shadow-lg shadow-indigo-200 flex items-center gap-2"
              >
                <PlusCircle size={20} />
                Create First Note
              </Link>
            </motion.div>
          )}

          {!loading && !error && notes.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {notes.slice(0, 6).map((note, idx) => (
                <NoteCard key={note.id} note={note} index={idx} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
