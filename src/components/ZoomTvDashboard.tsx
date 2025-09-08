import React, { useState, useEffect } from 'react';
import { 
  FileText,
  Loader2,
  Tag,
  Calendar,
  Mail,
  Phone,
  Globe,
  MapPin
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
import { newsApi, anunciantesApi, programmingApi, companyApi } from '../services/zoomTvApi';

import type { News } from '../types/zoomTv';

interface DashboardProps {
  onNavigate: (section: string) => void;
}

export const ZoomTvDashboard: React.FC<DashboardProps> = ({ onNavigate }) => {
  const { user } = useAuth();
  const { themeMode, toggleTheme } = useTheme();
  const [recentNews, setRecentNews] = useState<News[]>([]);
  const [recentAnunciantes, setRecentAnunciantes] = useState<any[]>([]);
  const [currentProgramming, setCurrentProgramming] = useState<any[]>([]);
  const [companyInfo, setCompanyInfo] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Load real data from API
      const newsResponse = await newsApi.getAll({ limit: 5, status: 'published' });
      if (newsResponse.success) {
        setRecentNews(newsResponse.data || []);
      } else {
        console.error('Error loading dashboard data:', newsResponse.message);
        setError('Error al cargar las noticias recientes');
        setRecentNews([]);
      }

      // Load recent anunciantes
      const anunciantesResponse = await anunciantesApi.getAll();
      if (anunciantesResponse.success) {
        setRecentAnunciantes(anunciantesResponse.data || []);
      } else {
        console.error('Error loading anunciantes:', anunciantesResponse.message);
        setRecentAnunciantes([]);
      }

      // Load current programming
      const today = new Date().toLocaleDateString('es-ES', { weekday: 'long' }).toUpperCase();
      const programmingResponse = await programmingApi.getByDay(today);
      if (programmingResponse.success) {
        setCurrentProgramming(programmingResponse.data || []);
      } else {
        console.error('Error loading programming:', programmingResponse.message);
        setCurrentProgramming([]);
      }

      // Load company info
      const companyResponse = await companyApi.getInfo();
      if (companyResponse.success) {
        setCompanyInfo(companyResponse.data);
      } else {
        console.error('Error loading company info:', companyResponse.message);
        setCompanyInfo(null);
      }
    } catch (error) {
      console.error('Error loading dashboard data:', error);
      setError('Error al conectar con el servidor');
      setRecentNews([]);
      setRecentAnunciantes([]);
      setCurrentProgramming([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSectionChange = (section: string) => {
    onNavigate(section);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="flex items-center space-x-2">
          <Loader2 className="w-6 h-6 animate-spin text-blue-600" />
          <span className="text-gray-600 dark:text-gray-400">Cargando dashboard...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Logo Header */}
      <div className="text-center py-4">
        <img 
          src="/src/assets/logo_detallado.png" 
          alt="Zoom TV Logo" 
          className="h-70 mx-auto mb-0"
        />
        <p className="text-gray-600 dark:text-gray-400">
          Bienvenido, {user?.name}. Gestiona el contenido de tu plataforma.
        </p>
      </div>

      {/* Theme Toggle */}
      <div className="flex justify-end">
        <button 
          onClick={toggleTheme}
          className="p-2 bg-gray-200 dark:bg-gray-700 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
        >
          {themeMode === 'light' ? '🌙' : '☀️'}
        </button>
      </div>

      {/* Content Area */}
              <div className="glass-effect rounded-xl shadow-lg border border-white/30 dark:border-gray-600/30 p-6">
          <div className="space-y-6">
              {/* Company Information */}
              {companyInfo && (
                <div className="glass-effect rounded-xl p-6 shadow-lg border border-white/30 dark:border-gray-600/30">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-xl font-bold text-black dark:text-black">
                      Información de la Empresa
                    </h3>
                    <button
                      onClick={() => handleSectionChange('company')}
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
                    >
                      Gestionar Empresa
                    </button>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="text-center">
                      <img src={companyInfo.logo} alt="Logo" className="w-20 h-20 mx-auto mb-3 rounded-lg object-cover" />
                      <h4 className="font-semibold text-gray-900 dark:text-black">{companyInfo.name}</h4>
                      <p className="text-sm text-blue-600 dark:text-blue-400">{companyInfo.slogan}</p>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2">
                        <Calendar className="w-4 h-4 text-gray-500" />
                        <span className="text-sm text-gray-600 dark:text-gray-400">Fundado en {companyInfo.foundedYear}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Mail className="w-4 h-4 text-gray-500" />
                        <span className="text-sm text-gray-600 dark:text-gray-400">{companyInfo.contactInfo?.email}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Phone className="w-4 h-4 text-gray-500" />
                        <span className="text-sm text-gray-600 dark:text-gray-400">{companyInfo.contactInfo?.phone}</span>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2">
                        <Globe className="w-4 h-4 text-gray-500" />
                        <span className="text-sm text-gray-600 dark:text-gray-400">{companyInfo.contactInfo?.website}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <MapPin className="w-4 h-4 text-gray-500" />
                        <span className="text-sm text-gray-600 dark:text-gray-400">{companyInfo.headquarters}</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* CMS Information */}
              <div className="glass-effect rounded-xl p-6 shadow-lg border border-white/30 dark:border-gray-600/30">
                <h3 className="text-xl font-bold text-black dark:text-black mb-4">
                  ¿Qué es el CMS de Zoom TV?
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <p className="text-gray-700 dark:text-gray-300 mb-4 leading-relaxed">
                      El <strong>Sistema de Gestión de Contenido (CMS)</strong> de Zoom TV es una plataforma integral 
                      diseñada para administrar todo el contenido de tu canal de televisión digital. 
                      Permite crear, editar y gestionar noticias, anunciantes y configuraciones 
                      de manera eficiente y profesional.
                    </p>
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2">
                        <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                        <span className="text-sm text-gray-600 dark:text-gray-400">Gestión completa de noticias</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        <span className="text-sm text-gray-600 dark:text-gray-400">Administración de anunciantes</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                        <span className="text-sm text-gray-600 dark:text-gray-400">Interfaz intuitiva y moderna</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                        <span className="text-sm text-gray-600 dark:text-gray-400">Acceso seguro y controlado</span>
                      </div>
                    </div>
                  </div>
                  <div className="bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-lg p-4">
                    <h4 className="font-semibold text-black dark:text-black mb-2">Estadísticas Rápidas</h4>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-gray-600 dark:text-gray-400">Noticias Publicadas:</span>
                        <span className="font-semibold text-black dark:text-black">{recentNews.length}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600 dark:text-gray-400">Anunciantes Activos:</span>
                        <span className="font-semibold text-black dark:text-black">{recentAnunciantes.length}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600 dark:text-gray-400">Programas Hoy:</span>
                        <span className="font-semibold text-black dark:text-black">{currentProgramming.length}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600 dark:text-gray-400">Usuario Activo:</span>
                        <span className="font-semibold text-black dark:text-black">{user?.name}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Recent Anunciantes */}
              <div>
                <h3 className="text-lg font-semibold text-black dark:text-black mb-4">
                  Anunciantes Recientes
                </h3>
                
                {recentAnunciantes.length === 0 ? (
                  <div className="text-center py-8 glass-effect rounded-xl">
                    <Tag className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-black dark:text-black mb-2">
                      No hay anunciantes registrados
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400 mb-4">
                      No se encontraron anunciantes en el sistema
                    </p>
                    <button
                      onClick={() => handleSectionChange('anunciantes')}
                      className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
                    >
                      Agregar Anunciante
                    </button>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {recentAnunciantes.slice(0, 5).map((anunciante, index) => (
                      <div key={anunciante._id || index} className="flex items-center space-x-4 p-4 glass-effect rounded-lg border border-white/30 dark:border-gray-600/30">
                        <div className="w-12 h-12 rounded-lg overflow-hidden">
                          <img 
                            src={anunciante.imageUrl}
                            alt={anunciante.name}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              e.currentTarget.src = 'https://via.placeholder.com/48x48?text=Imagen';
                            }}
                          />
                        </div>
                        <div className="flex-1">
                          <h4 className="font-medium text-black dark:text-black">
                            {anunciante.name}
                          </h4>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            {anunciante.description}
                          </p>
                        </div>
                        <div className="text-right">
                          <div className="text-sm font-medium text-black dark:text-black">
                            {anunciante.category}
                          </div>
                          <div className="text-xs text-gray-500 dark:text-gray-400">
                            {anunciante.status} • Prioridad: {anunciante.priority}
                          </div>
                        </div>
                      </div>
                    ))}
                    {recentAnunciantes.length > 5 && (
                      <div className="text-center">
                        <button
                          onClick={() => handleSectionChange('anunciantes')}
                          className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 text-sm font-medium"
                        >
                          Ver todos los anunciantes ({recentAnunciantes.length} anunciantes)
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Current Programming */}
              <div>
                <h3 className="text-lg font-semibold text-black dark:text-black mb-4">
                  Programación de Hoy - {new Date().toLocaleDateString('es-ES', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                </h3>
                
                {currentProgramming.length === 0 ? (
                  <div className="text-center py-8 glass-effect rounded-xl">
                    <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-black dark:text-black mb-2">
                      No hay programación para hoy
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400 mb-4">
                      No se encontraron programas programados para hoy
                    </p>
                    <button
                      onClick={() => handleSectionChange('programming')}
                      className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
                    >
                      Agregar Programación
                    </button>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {currentProgramming.slice(0, 5).map((program, index) => (
                      <div key={program._id || index} className="flex items-center space-x-4 p-4 glass-effect rounded-lg border border-white/30 dark:border-gray-600/30">
                        <div 
                          className="w-4 h-4 rounded-full"
                          style={{ backgroundColor: program.color || '#3B82F6' }}
                        ></div>
                        <div className="flex-1">
                          <h4 className="font-medium text-black dark:text-black">
                            {program.title}
                          </h4>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            {program.description}
                          </p>
                        </div>
                        <div className="text-right">
                          <div className="text-sm font-medium text-black dark:text-black">
                            {program.startTime} - {program.endTime}
                          </div>
                          <div className="text-xs text-gray-500 dark:text-gray-400">
                            {program.category} • {program.type}
                          </div>
                        </div>
                      </div>
                    ))}
                    {currentProgramming.length > 5 && (
                      <div className="text-center">
                        <button
                          onClick={() => handleSectionChange('programming')}
                          className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 text-sm font-medium"
                        >
                          Ver toda la programación ({currentProgramming.length} programas)
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Recent News */}
              <div>
                <h3 className="text-lg font-semibold text-black dark:text-black mb-4">
                  Últimas 5 Noticias
                </h3>
                
                {error ? (
                  <div className="text-center py-8">
                    <div className="text-red-600 dark:text-red-400 mb-4">{error}</div>
                    <button
                      onClick={loadDashboardData}
                      className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
                    >
                      Reintentar
                    </button>
                  </div>
                ) : recentNews.length === 0 ? (
                  <div className="text-center py-8">
                    <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-black dark:text-black mb-2">
                      No hay noticias recientes
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400 mb-4">
                      No se encontraron noticias publicadas recientemente
                    </p>
                    <button
                      onClick={() => handleSectionChange('add-news')}
                      className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
                    >
                      Agregar Primera Noticia
                    </button>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {recentNews.map((news) => (
                      <div key={news._id} className="flex items-center space-x-4 p-4 glass-effect rounded-lg border border-white/30 dark:border-gray-600/30">
                        <div className="w-12 h-12 rounded-lg overflow-hidden">
                          {news.imageUrl ? (
                            <img 
                              src={news.imageUrl.startsWith('http') ? news.imageUrl : `https://apizoomtv-production.up.railway.app${news.imageUrl}`}
                              alt={news.title}
                              className="w-full h-full object-cover"
                              onError={(e) => {
                                e.currentTarget.src = 'https://via.placeholder.com/48x48?text=Imagen';
                              }}
                            />
                          ) : (
                            <div className="w-full h-full bg-gray-300 dark:bg-gray-600 flex items-center justify-center">
                              <FileText className="w-6 h-6 text-gray-500" />
                            </div>
                          )}
                        </div>
                        <div className="flex-1">
                          <h4 className="font-medium text-black dark:text-black">
                            {news.title}
                          </h4>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            {news.summary}
                          </p>
                        </div>
                        <div className="text-right">
                          <div className="text-sm font-medium text-black dark:text-black">
                            {news.category}
                          </div>
                          <div className="text-xs text-gray-500 dark:text-gray-400">
                            {news.author} • {new Date(news.createdAt).toLocaleDateString()}
                          </div>
                        </div>
                      </div>
                    ))}
                    {recentNews.length > 5 && (
                      <div className="text-center">
                        <button
                          onClick={() => handleSectionChange('news')}
                          className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 text-sm font-medium"
                        >
                          Ver todas las noticias ({recentNews.length} noticias)
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
        </div>
      </div>
   
  );
};
