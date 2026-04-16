import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowLeft, Download, Trash2, Calendar, FileText, Loader2 } from 'lucide-react'
import toast from 'react-hot-toast'
import api from '../api/axiosConfig'

export default function NoteDetails() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [note, setNote] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    api.get(`/notes/${id}`)
      .then(res => setNote(res.data))
      .catch(() => setError('Note not found or access denied'))
      .finally(() => setLoading(false))
  }, [id])

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to permanently delete this note?')) return
    const toastId = toast.loading('Deleting...')
    try {
      await api.delete(`/notes/${id}`)
      toast.success('Note deleted', { id: toastId })
      navigate('/mynotes')
    } catch {
      toast.error('Failed to delete note', { id: toastId })
    }
  }

  if (loading) return (
    <div className="min-h-screen bg-[#FAFAFA] flex flex-col items-center justify-center text-gray-400">
      <Loader2 className="animate-spin mb-4" size={32} />
      <p>Loading note details...</p>
    </div>
  )
  
  if (error) return (
    <div className="min-h-screen bg-[#FAFAFA] flex items-center justify-center p-4">
      <div className="bg-white p-8 rounded-2xl shadow-sm text-center max-w-md w-full border border-red-100">
        <div className="text-red-500 mb-4 flex justify-center"><FileText size={48} /></div>
        <h3 className="text-xl font-bold text-gray-900 mb-2">Error Loading Note</h3>
        <p className="text-gray-500 mb-6">{error}</p>
        <button onClick={() => navigate(-1)} className="text-indigo-600 font-medium hover:underline">Go Back</button>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen bg-[#FAFAFA] px-4 sm:px-6 py-12">
      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-3xl mx-auto"
      >
        <button 
          onClick={() => navigate(-1)} 
          className="group flex items-center gap-2 text-sm font-medium text-gray-500 hover:text-gray-900 transition-colors mb-8"
        >
          <div className="bg-white p-1.5 rounded-full shadow-sm border border-gray-200 group-hover:border-gray-300 transition-colors">
            <ArrowLeft size={16} />
          </div>
          Back to Notes
        </button>

        <div className="bg-white rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100 p-8 sm:p-12">
          
          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-6 mb-8">
            <div>
              <div className="flex items-center gap-2 text-xs font-semibold text-indigo-600 uppercase tracking-wider mb-3 bg-indigo-50 w-fit px-3 py-1 rounded-full">
                <FileText size={14} /> Note Document
              </div>
              <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 tracking-tight leading-tight mb-4">
                {note.title}
              </h1>
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <Calendar size={16} />
                <span>Uploaded recently</span>
              </div>
            </div>
            
            <div className="flex items-center gap-3 shrink-0">
              {note.filePath && (
                <>
                  <a
                    href={`http://localhost:8080/${note.filePath.replace(/\\/g, '/')}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 bg-white text-indigo-600 border border-indigo-200 px-5 py-2.5 rounded-xl text-sm font-semibold hover:bg-indigo-50 transition shadow-sm"
                  >
                    <FileText size={18} />
                    View
                  </a>
                  <button
                    onClick={async () => {
                      const toastId = toast.loading('Downloading file...');
                      try {
                        const url = `http://localhost:8080/${note.filePath.replace(/\\/g, '/')}`;
                        const response = await fetch(url);
                        if (!response.ok) throw new Error('Download failed');
                        const blob = await response.blob();
                        
                        const filename = note.filePath.split(/[\\/]/).pop() || `${note.title}-attachment`;
                        const blobUrl = window.URL.createObjectURL(blob);
                        
                        const link = document.createElement('a');
                        link.href = blobUrl;
                        link.download = filename;
                        document.body.appendChild(link);
                        link.click();
                        document.body.removeChild(link);
                        window.URL.revokeObjectURL(blobUrl);
                        
                        toast.success('Download complete!', { id: toastId });
                      } catch (error) {
                        toast.error('Failed to download file', { id: toastId });
                      }
                    }}
                    className="flex items-center gap-2 bg-indigo-600 text-white px-5 py-2.5 rounded-xl text-sm font-semibold hover:bg-indigo-700 transition shadow-sm hover:shadow-md"
                  >
                    <Download size={18} />
                    Download
                  </button>
                </>
              )}
              <button
                onClick={handleDelete}
                className="p-2.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition"
                title="Delete Note"
              >
                <Trash2 size={20} />
              </button>
            </div>
          </div>

          <hr className="border-gray-100 mb-8" />

          <div className="prose prose-indigo max-w-none text-gray-600 leading-relaxed">
            {note.description ? (
              <p className="whitespace-pre-wrap text-[17px]">{note.description}</p>
            ) : (
              <div className="text-center py-12 bg-gray-50 rounded-2xl border border-dashed border-gray-200">
                <p className="italic text-gray-400">No description provided for this note.</p>
              </div>
            )}
          </div>

        </div>
      </motion.div>
    </div>
  )
}
