import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './index.css'
import { BrowserRouter } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import ErrorBoundary from './components/ErrorBoundary'

console.log('🚀 main.tsx yükleniyor...')

try {
  console.log('🎯 DOM root bulunuyor...')
  const root = document.getElementById('root')
  console.log('📍 Root element:', root)
  
  console.log('⚛️ React render başlıyor...')
  ReactDOM.createRoot(root!).render(
  <React.StrictMode>
    <ErrorBoundary>
      <BrowserRouter>
        <App />
        <Toaster 
          position="bottom-right"
          toastOptions={{
            duration: 4000,
            style: {
              background: '#363636',
              color: '#fff',
              fontFamily: 'Inter, sans-serif',
            },
            success: {
              style: {
                background: '#10B981',
              },
            },
            error: {
              style: {
                background: '#EF4444',
              },
            },
          }}
        />
      </BrowserRouter>
    </ErrorBoundary>
  </React.StrictMode>,
  )
  console.log('✅ React render tamamlandı!')
} catch (error) {
  console.error('❌ React render hatası:', error)
  document.body.innerHTML = `<div style="color: red; padding: 20px;">
    <h1>React Render Hatası!</h1>
    <pre>${error}</pre>
  </div>`
}
