import { Routes, Route, Navigate } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import Login from './pages/Login'
import Register from './pages/Register'
import Dashboard from './pages/Dashboard'
import MyNotes from './pages/MyNotes'
import UploadNote from './pages/UploadNote'
import NoteDetails from './pages/NoteDetails'
import Navbar from './components/Navbar'

const ProtectedRoute = ({ children }) => {
  return localStorage.getItem('token') ? children : <Navigate to="/login" />
}

export default function App() {
  return (
    <>
      <Toaster position="top-center" toastOptions={{ duration: 3000, style: { background: '#333', color: '#fff', borderRadius: '12px' } }} />
      <Navbar />
      <Routes>
        <Route path="/" element={<Navigate to="/dashboard" />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
        <Route path="/mynotes" element={<ProtectedRoute><MyNotes /></ProtectedRoute>} />
        <Route path="/upload" element={<ProtectedRoute><UploadNote /></ProtectedRoute>} />
        <Route path="/note/:id" element={<ProtectedRoute><NoteDetails /></ProtectedRoute>} />
      </Routes>
    </>
  )
}
