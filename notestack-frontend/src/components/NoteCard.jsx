import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { FileText, Paperclip, ChevronRight, Trash2 } from 'lucide-react'

export default function NoteCard({ note, onDelete, index = 0 }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95, y: 10 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ delay: index * 0.05, duration: 0.3 }}
      whileHover={{ y: -4, scale: 1.01 }}
      className="bg-white/80 backdrop-blur-md rounded-2xl border border-gray-200/60 p-6 flex flex-col gap-4 shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] transition-all group"
    >
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="bg-indigo-50 p-2.5 rounded-xl text-indigo-600 group-hover:scale-110 group-hover:bg-indigo-100 transition-all">
            <FileText size={20} />
          </div>
          <h3 className="text-[17px] font-semibold text-gray-800 line-clamp-1 leading-snug">{note.title}</h3>
        </div>
        {onDelete && (
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={(e) => { e.preventDefault(); onDelete(note.id); }}
            className="text-gray-400 hover:text-red-500 hover:bg-red-50 p-1.5 rounded-lg transition-colors"
            title="Delete note"
          >
            <Trash2 size={16} />
          </motion.button>
        )}
      </div>

      <p className="text-sm text-gray-500 line-clamp-2 leading-relaxed flex-grow">
        {note.description || <span className="italic opacity-50">No description provided</span>}
      </p>

      <div className="flex items-center justify-between pt-4 border-t border-gray-100/80 mt-1">
        {note.filePath ? (
          <div className="flex items-center gap-1.5 text-xs font-medium text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-md">
            <Paperclip size={12} />
            <span>Attachment</span>
          </div>
        ) : (
          <div className="text-xs text-gray-400 font-medium px-2.5 py-1">Text Only</div>
        )}

        <Link
          to={`/note/${note.id}`}
          className="flex items-center gap-1 text-sm text-indigo-600 font-semibold hover:text-indigo-700 transition relative"
        >
          View 
          <ChevronRight size={16} className="group-hover:translate-x-1 transition-transform" />
        </Link>
      </div>
    </motion.div>
  )
}
