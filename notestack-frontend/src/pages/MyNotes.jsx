import { useEffect, useState } from 'react'
import api from '../api/axiosConfig'
import NoteCard from '../components/NoteCard'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Loader2, PlusCircle, Notebook, FolderOpen } from 'lucide-react'
import toast from 'react-hot-toast'

export default function MyNotes() {
  const [notes, setNotes] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    api.get('/notes')
      .then(res => setNotes(res.data))
      .catch(() => setError('Failed to load notes'))
      .finally(() => setLoading(false))
  }, [])

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this note?')) return
    const toastId = toast.loading('Deleting note...')
    try {
      await api.delete(`/notes/${id}`)
      setNotes(prev => prev.filter(n => n.id !== id))
      toast.success('Note deleted successfully', { id: toastId })
    } catch {
      toast.error('Failed to delete note', { id: toastId })
    }
  }

  return (
    <div className="min-h-screen bg-[#FAFAFA] px-4 sm:px-6 lg:px-8 py-12">
      <div className="max-w-7xl mx-auto space-y-8">
        
        <motion.div 
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col sm:flex-row sm:items-end justify-between gap-6"
        >
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className="bg-white p-2 border border-gray-200 rounded-lg shadow-sm text-gray-500">
                <FolderOpen size={24} />
              </div>
              <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-gray-900 to-gray-700">
                My Notes
              </h1>
            </div>
            <p className="text-gray-500 text-lg">Manage all your uploaded knowledge base.</p>
          </div>
          <Link
            to="/upload"
            className="flex items-center gap-2 bg-indigo-600 text-white px-5 py-2.5 rounded-xl text-sm font-semibold hover:bg-indigo-700 transition-colors shadow-lg shadow-indigo-200"
          >
            <PlusCircle size={18} />
            Upload Note
          </Link>
        </motion.div>

        {loading && (
          <div className="flex flex-col items-center justify-center py-24 text-gray-400">
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
            className="bg-white p-16 rounded-3xl text-center flex flex-col items-center justify-center border border-gray-200/60 shadow-sm"
          >
            <div className="bg-gray-50 p-6 rounded-full text-gray-400 mb-6 border border-gray-100">
              <Notebook size={48} strokeWidth={1.5} />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Empty Library</h3>
            <p className="text-gray-500 max-w-sm mx-auto mb-8">
              Looks like you haven't uploaded anything to this repository yet.
            </p>
            <Link
              to="/upload"
              className="bg-white border border-gray-300 text-gray-700 px-6 py-2.5 rounded-xl font-semibold hover:bg-gray-50 transition-colors shadow-sm flex items-center gap-2"
            >
              Start Uploading
            </Link>
          </motion.div>
        )}

        {!loading && !error && notes.length > 0 && (
          <motion.div layout className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            <AnimatePresence>
              {notes.map((note, idx) => (
                <motion.div
                  key={note.id}
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.2 } }}
                >
                  <NoteCard note={note} onDelete={handleDelete} index={idx} />
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        )}
      </div>
    </div>
  )
}
