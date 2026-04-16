import { useState, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { useDropzone } from 'react-dropzone'
import { motion, AnimatePresence } from 'framer-motion'
import { UploadCloud, File, X, Info } from 'lucide-react'
import toast from 'react-hot-toast'
import api from '../api/axiosConfig'

export default function UploadNote() {
  const navigate = useNavigate()
  const [form, setForm] = useState({ title: '', description: '' })
  const [file, setFile] = useState(null)
  const [loading, setLoading] = useState(false)

  const onDrop = useCallback(acceptedFiles => {
    if (acceptedFiles.length > 0) {
      setFile(acceptedFiles[0])
    }
  }, [])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    maxFiles: 1,
    accept: {
      'application/pdf': ['.pdf'],
      'application/msword': ['.doc', '.docx'],
      'application/vnd.ms-powerpoint': ['.ppt', '.pptx'],
      'text/plain': ['.txt']
    }
  })

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!form.title.trim()) {
      toast.error('Please provide a title')
      return
    }

    setLoading(true)
    const toastId = toast.loading('Uploading note...')

    const data = new FormData()
    data.append('title', form.title)
    if (form.description) data.append('description', form.description)
    if (file) data.append('file', file)

    try {
      await api.post('/notes', data, {
        headers: { 'Content-Type': 'multipart/form-data' },
      })
      toast.success('Note uploaded successfully!', { id: toastId })
      navigate('/mynotes')
    } catch {
      toast.error('Failed to upload note. Please try again.', { id: toastId })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#FAFAFA] flex items-center justify-center p-4 py-12">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass rounded-3xl p-8 w-full max-w-xl relative overflow-hidden"
      >
        <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-blue-500 to-indigo-500" />
        
        <div className="mb-8 mt-2">
          <div className="bg-blue-50 w-12 h-12 rounded-xl flex items-center justify-center text-blue-600 mb-4 shadow-sm border border-blue-100">
            <UploadCloud size={24} />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-1">Upload Note</h2>
          <p className="text-gray-500">Share your knowledge with others or keep it for yourself.</p>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5 ">Title <span className="text-red-500">*</span></label>
            <input
              type="text"
              placeholder="E.g., Quantum Physics Midterm Review"
              value={form.title}
              onChange={e => setForm({ ...form, title: e.target.value })}
              required
              className="w-full bg-white/60 border border-gray-200/80 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all shadow-sm"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">Description</label>
            <textarea
              placeholder="Add some context about what this note contains..."
              value={form.description}
              onChange={e => setForm({ ...form, description: e.target.value })}
              rows={4}
              className="w-full bg-white/60 border border-gray-200/80 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all shadow-sm resize-none"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">Attachment</label>
            
            <AnimatePresence mode="wait">
              {!file ? (
                <motion.div
                  key="dropzone"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  {...getRootProps()}
                  className={`border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer transition-all ${
                    isDragActive ? 'border-blue-500 bg-blue-50/50' : 'border-gray-200 hover:border-blue-400 hover:bg-gray-50/50'
                  }`}
                >
                  <input {...getInputProps()} />
                  <UploadCloud size={32} className={`mx-auto mb-3 ${isDragActive ? 'text-blue-500' : 'text-gray-400'}`} />
                  <p className="text-sm font-medium text-gray-700 mb-1">
                    {isDragActive ? 'Drop file here' : 'Drag & drop a file here, or click to select'}
                  </p>
                  <p className="text-xs text-gray-500">Supports PDF, DOC, DOCX, PPT, PPTX, TXT (Max 10MB)</p>
                </motion.div>
              ) : (
                <motion.div
                  key="file"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="bg-indigo-50 border border-indigo-100 rounded-2xl p-4 flex items-center justify-between shadow-sm"
                >
                  <div className="flex items-center gap-3 overflow-hidden">
                    <div className="bg-white p-2 rounded-lg text-indigo-600 shadow-sm border border-indigo-50">
                      <File size={20} />
                    </div>
                    <div className="truncate pr-4">
                      <p className="text-sm font-semibold text-gray-800 truncate">{file.name}</p>
                      <p className="text-xs text-gray-500">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => setFile(null)}
                    className="p-2 text-gray-400 hover:text-red-500 hover:bg-white rounded-lg transition-colors flex-shrink-0"
                  >
                    <X size={18} />
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <motion.button
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.98 }}
            type="submit"
            disabled={loading}
            className="mt-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-200 py-3.5 rounded-xl font-semibold hover:shadow-xl hover:from-blue-700 hover:to-indigo-700 transition-all disabled:opacity-70 disabled:cursor-not-allowed flex justify-center items-center gap-2"
          >
            {loading ? (
              <>Uploading...</>
            ) : (
              <>
                <UploadCloud size={18} />
                Publish Note
              </>
            )}
          </motion.button>
        </form>
      </motion.div>
    </div>
  )
}
