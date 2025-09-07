import { Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from '@/contexts/AuthContext'
import { ThemeProvider } from '@/contexts/ThemeContext'
import { EditorProvider } from '@/contexts/EditorContext'
import Login from '@/pages/Login'
import Register from '@/pages/Register'
import Editor from '@/pages/Editor'
import Dashboard from '@/pages/Dashboard'
import Projects from '@/pages/Projects'
import ProtectedRoute from '@/components/ProtectedRoute'

console.log('📱 App.tsx yükleniyor...')

function App() {
  console.log('🎯 App component render ediliyor...')
  return (
    <ThemeProvider>
      <AuthProvider>
        <div className="min-h-screen bg-white dark:bg-gray-900">
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/dashboard" element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            } />
            <Route path="/projects" element={
              <ProtectedRoute>
                <Projects />
              </ProtectedRoute>
            } />
            <Route path="/editor" element={
              <ProtectedRoute>
                <EditorProvider>
                  <Editor />
                </EditorProvider>
              </ProtectedRoute>
            } />
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
          </Routes>
        </div>
      </AuthProvider>
    </ThemeProvider>
  )
}

export default App
