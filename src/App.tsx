import React from 'react'
import { AuthProvider, useAuth } from './contexts/AuthContext'
import { ThemeProvider, useTheme } from './contexts/ThemeContext'
import { ModernLoginForm } from './components/ModernLoginForm'
import { MainLayout } from './components/MainLayout'

const AppContent: React.FC = () => {
  const { isAuthenticated, loading } = useAuth()
  const { themeMode } = useTheme()

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-100 dark:from-gray-900 dark:via-blue-900 dark:to-indigo-950 flex items-center justify-center">
        <div className="glass-panel p-8 rounded-3xl backdrop-blur-xl bg-white/70 dark:bg-black/20 border border-white/20 shadow-2xl flex flex-col items-center space-y-4">
          <div className="w-12 h-12 border-4 border-blue-500/30 border-t-blue-500 rounded-full animate-spin"></div>
          <p className={`font-medium ${themeMode === 'light' ? 'text-black' : 'text-white'}`}>Cargando aplicación...</p>
        </div>
      </div>
    )
  }

  return (
    <>
      {isAuthenticated ? <MainLayout /> : <ModernLoginForm />}
    </>
  )
}

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </ThemeProvider>
  )
}

export default App
