import React, { useState } from 'react';
import { User, Lock, Eye, EyeOff, Activity, Zap, Shield, Sparkles } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
import type { LoginCredentials } from '../types/zoomTv';

export const ModernLoginForm: React.FC = () => {
  const [credentials, setCredentials] = useState<LoginCredentials>({ email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [fieldErrors, setFieldErrors] = useState<{ email?: string; password?: string }>({});
  const { login, loading } = useAuth();
  const { themeMode } = useTheme();



  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    
    try {
      await login(credentials);
      setSuccess('¡Login exitoso! Redirigiendo al dashboard...');
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error de autenticación';
      setError(errorMessage);
    }
  };



  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden">
      
      {/* Floating Elements - Black & White Style */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-20 left-20 w-32 h-32 bg-black/5 rounded-full blur-xl animate-pulse"></div>
        <div className="absolute top-40 right-32 w-48 h-48 bg-white/10 rounded-full blur-2xl animate-pulse delay-1000"></div>
        <div className="absolute bottom-32 left-32 w-40 h-40 bg-white/10 rounded-full blur-xl animate-pulse delay-2000"></div>
        
        {/* Floating Icons */}
        <div className="absolute top-1/4 left-1/4 text-black/10 animate-float">
          <Zap size={24} className="text-black dark:text-white" />
        </div>
        <div className="absolute top-1/3 right-1/4 text-gray-800/10 animate-float-delayed">
          <Shield size={20} className="text-black dark:text-white" />
        </div>
        <div className="absolute bottom-1/3 left-1/3 text-gray-600/10 animate-float-slow">
          <Activity size={28} className="text-black dark:text-white" />
        </div>
        <div className="absolute top-1/2 right-1/3 text-black/10 animate-float">
          <Sparkles size={22} className="text-black dark:text-white" />
        </div>
      </div>

      {/* Main Login Card */}
      <div className="relative w-full max-w-lg">
        {/* Glass morphism card */}
        <div className="glass-effect rounded-3xl shadow-2xl p-10 relative overflow-hidden border border-white/30 hover:shadow-3xl transition-all duration-500 hover:scale-[1.02] hover:rotate-1">
          
          {/* Glass shine effect */}
          <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-transparent to-transparent rounded-3xl pointer-events-none"></div>
          
          {/* Header */}
          <div className="relative text-center mb-8">
            {/* Logo */}
            <div className="mx-auto mb-6">
              <img 
                src="/src/assets/logo.png" 
                alt="Zoom TV Logo" 
                className="h-20 mx-auto"
              />
            </div>
            
            <h1 className={`text-4xl lg:text-5xl font-black mb-3 ${themeMode === 'light' ? 'text-black' : 'text-white'}`}>
              Zoom TV CMS
            </h1>
            <p className={`text-sm ${themeMode === 'light' ? 'text-black' : 'text-white'}`}>
              Panel de administración de contenido
            </p>
          </div>

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email Field */}
            <div className="space-y-2">
              <label htmlFor="email" className={`text-sm font-medium ${themeMode === 'light' ? 'text-black' : 'text-white'}`}>
                Correo Electrónico
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <User size={20} className={`text-black dark:text-white ${fieldErrors.email ? 'text-red-500' : ''}`} />
                </div>
                <input
                  id="email"
                  type="email"
                  placeholder="Ingresa tu correo electrónico"
                  value={credentials.email}
                  onChange={(e) => setCredentials(prev => ({ ...prev, email: e.target.value }))}
                  required
                  disabled={loading}
                  className="w-full pl-12 pr-4 py-4 bg-white/80 dark:bg-black/20 backdrop-blur-sm border border-white/30 dark:border-white/10 rounded-2xl text-black dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-transparent transition-all duration-300 shadow-lg"
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="space-y-2">
              <label htmlFor="password" className={`text-sm font-medium ${themeMode === 'light' ? 'text-black' : 'text-white'}`}>
                Contraseña
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Lock size={20} className="text-black dark:text-white" />
                </div>
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Ingresa tu contraseña"
                  value={credentials.password}
                  onChange={(e) => setCredentials(prev => ({ ...prev, password: e.target.value }))}
                  required
                  disabled={loading}
                  className="w-full pl-12 pr-12 py-4 bg-white/80 dark:bg-black/20 backdrop-blur-sm border border-white/30 dark:border-white/10 rounded-2xl text-black dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-transparent transition-all duration-300 shadow-lg"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-4 flex items-center"
                >
                  {showPassword ? (
                    <EyeOff size={20} className="text-black dark:text-white" />
                  ) : (
                    <Eye size={20} className="text-black dark:text-white" />
                  )}
                </button>
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-4 animate-pulse">
                <div className="flex items-center">
                  <span className="text-red-500 mr-2">❌</span>
                  <p className="text-red-600 dark:text-red-400 text-sm font-medium">{error}</p>
                </div>
                {error.includes('conexión') && (
                  <p className="text-red-500 dark:text-red-400 text-xs mt-1">
                    💡 Sugerencia: Verifica tu conexión a internet y vuelve a intentar
                  </p>
                )}
                {error.includes('incorrectos') && (
                  <p className="text-red-500 dark:text-red-400 text-xs mt-1">
                    💡 Sugerencia: Verifica tu email y contraseña. Usa los botones de demo si es necesario
                  </p>
                )}
              </div>
            )}

            {/* Success Message */}
            {success && (
              <div className="bg-green-500/10 border border-green-500/20 rounded-xl p-4 animate-pulse">
                <div className="flex items-center">
                  <span className="text-green-500 mr-2">✅</span>
                  <p className="text-green-600 dark:text-green-400 text-sm font-medium">{success}</p>
                </div>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className={`w-full py-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold rounded-2xl transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-500/50 disabled:opacity-50 disabled:cursor-not-allowed ${themeMode === 'light' ? 'shadow-lg' : 'shadow-2xl'}`}
            >
              {loading ? (
                <div className="flex items-center justify-center">
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2"></div>
                  Iniciando sesión...
                </div>
              ) : (
                'Iniciar Sesión'
              )}
            </button>


          </form>


        </div>
      </div>
    </div>
  );
};