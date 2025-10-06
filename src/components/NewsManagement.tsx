import React, { useState, useEffect } from 'react';
import { 
  Plus, 
  Search, 
  Filter, 
  Edit, 
  Trash2, 
  Image,
  Save,
  X,
  CheckCircle,
  Star,
  RefreshCw,
  AlertCircle,
  FileText
} from 'lucide-react';
import { newsApi, type News, type NewsFormData } from '../services/zoomTvApi';
import type { NewsFilters } from '../types/zoomTv';

interface NewsManagementProps {
  onNavigate?: (section: string) => void;
}

// Categorías disponibles
const CATEGORIES = [
  { value: 'actualidad', label: 'Actualidad', color: '#3B82F6' },
  { value: 'deportes', label: 'Deportes', color: '#10B981' },
  { value: 'musica', label: 'Música', color: '#F59E0B' },
  { value: 'nacionales', label: 'Nacionales', color: '#EF4444' },
  { value: 'regionales', label: 'Regionales', color: '#8B5CF6' }
];

// Estados disponibles
const STATUS_OPTIONS = [
  { value: 'draft', label: 'Borrador', color: '#F59E0B' },
  { value: 'published', label: 'Publicada', color: '#10B981' },
  { value: 'archived', label: 'Archivada', color: '#6B7280' }
];

export const NewsManagement: React.FC<NewsManagementProps> = () => {
  const [news, setNews] = useState<News[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingNews, setEditingNews] = useState<News | null>(null);
  const [filters, setFilters] = useState<NewsFilters>({
    page: 1,
    limit: 10,
    category: undefined,
    status: undefined,
    search: ''
  });
  const [totalPages, setTotalPages] = useState(1);
  const [totalNews, setTotalNews] = useState(0);
  const [selectedNews, setSelectedNews] = useState<string[]>([]);
  const [showFilters, setShowFilters] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Form state
  const [formData, setFormData] = useState<NewsFormData>({
    id: '',
    title: '',
    author: '',
    date: new Date().toISOString().split('T')[0],
    summary: '',
    content: '',
    imageUrl: '',
    category: 'actualidad',
    status: 'draft',
    featured: false,
    tags: [],
    seoTitle: '',
    seoDescription: '',
    seoKeywords: []
  });

  useEffect(() => {
    loadData();
  }, [filters]);

  const loadData = async () => {
    try {
      setLoading(true);
      setError('');
      
      console.log('Cargando noticias con filtros:', filters);
      const newsResponse = await newsApi.getAll(filters);

      if (newsResponse.success) {
        setNews(newsResponse.data || []);
        setTotalPages(newsResponse.pagination?.pages || 1);
        setTotalNews(newsResponse.pagination?.total || 0);
        console.log('Noticias cargadas:', newsResponse.data?.length || 0);
        console.log('URLs de imágenes:', newsResponse.data?.map(n => n.imageUrl));
      } else {
        setError(newsResponse.message || 'Error al cargar las noticias');
        console.error('Error loading news:', newsResponse.message);
      }
    } catch (error: any) {
      console.error('Error loading data:', error);
      setError(error.response?.data?.message || 'Error al cargar las noticias');
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (key: keyof NewsFilters, value: string | number) => {
    setFilters(prev => ({
      ...prev,
      [key]: value,
      page: 1 // Reset to first page when filters change
    }));
  };

  const handlePageChange = (page: number) => {
    setFilters(prev => ({ ...prev, page }));
  };

  const handleCreateNews = () => {
    setEditingNews(null);
    setFormData({
      id: '',
      title: '',
      author: '',
      date: new Date().toISOString().split('T')[0],
      summary: '',
      content: '',
      imageUrl: '',
      category: 'actualidad',
      status: 'draft',
      featured: false,
      tags: [],
      seoTitle: '',
      seoDescription: '',
      seoKeywords: []
    });
    setShowForm(true);
  };

  const handleEditNews = (news: News) => {
    setEditingNews(news);
    setFormData({
      id: news.id || '',
      title: news.title,
      author: news.author,
      date: news.date,
      summary: news.summary,
      content: news.content,
      imageUrl: news.imageUrl || '',
      category: news.category,
      status: news.status,
      featured: news.featured,
      tags: news.tags,
      seoTitle: news.seoTitle || '',
      seoDescription: news.seoDescription || '',
      seoKeywords: news.seoKeywords || []
    });
    setShowForm(true);
  };

  const handleSaveNews = async () => {
    try {
      setError('');
      setSuccess('');

      if (!formData.title || !formData.content || !formData.summary) {
        setError('Por favor completa todos los campos obligatorios');
        return;
      }

      if (editingNews) {
        const response = await newsApi.update(editingNews._id, formData);
        if (response.success) {
          setSuccess('Noticia actualizada exitosamente');
          setShowForm(false);
          loadData();
        } else {
          setError(response.message || 'Error al actualizar la noticia');
        }
      } else {
        const response = await newsApi.create(formData);
        if (response.success) {
          setSuccess('Noticia creada exitosamente');
          setShowForm(false);
          loadData();
        } else {
          setError(response.message || 'Error al crear la noticia');
        }
      }
    } catch (error: any) {
      console.error('Error saving news:', error);
      setError(error.response?.data?.message || 'Error al guardar la noticia');
    }
  };

  const handleDeleteNews = async (id: string) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar esta noticia? Esta acción no se puede deshacer.')) {
      try {
        setError('');
        const response = await newsApi.delete(id);
        if (response.success) {
          setSuccess('Noticia eliminada exitosamente');
          loadData();
        } else {
          setError(response.message || 'Error al eliminar la noticia');
        }
      } catch (error: any) {
        console.error('Error deleting news:', error);
        setError(error.response?.data?.message || 'Error al eliminar la noticia');
      }
    }
  };

  const handleBulkAction = async (action: string) => {
    if (selectedNews.length === 0) return;

    try {
      setError('');
      setSuccess('');

      switch (action) {
        case 'publish':
          await Promise.all(selectedNews.map(id => newsApi.publish(id)));
          setSuccess(`${selectedNews.length} noticia(s) publicada(s) exitosamente`);
          break;
        case 'archive':
          await Promise.all(selectedNews.map(id => newsApi.archive(id)));
          setSuccess(`${selectedNews.length} noticia(s) archivada(s) exitosamente`);
          break;
        case 'delete':
          if (window.confirm(`¿Estás seguro de eliminar ${selectedNews.length} noticia(s)? Esta acción no se puede deshacer.`)) {
            await Promise.all(selectedNews.map(id => newsApi.delete(id)));
            setSuccess(`${selectedNews.length} noticia(s) eliminada(s) exitosamente`);
          }
          break;
      }
      setSelectedNews([]);
      loadData();
    } catch (error: any) {
      console.error('Error in bulk action:', error);
      setError('Error al ejecutar la acción en lote');
    }
  };

  const getStatusColor = (status: string) => {
    const statusOption = STATUS_OPTIONS.find(s => s.value === status);
    return statusOption?.color || '#6B7280';
  };

  const getCategoryColor = (category: string) => {
    const categoryOption = CATEGORIES.find(c => c.value === category);
    return categoryOption?.color || '#3B82F6';
  };

  const getCategoryLabel = (category: string) => {
    const categoryOption = CATEGORIES.find(c => c.value === category);
    return categoryOption?.label || category;
  };

  const getStatusLabel = (status: string) => {
    const statusOption = STATUS_OPTIONS.find(s => s.value === status);
    return statusOption?.label || status;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-blue-500/30 border-t-blue-500 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Cargando noticias...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {!showForm ? (
        <>
          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-black">
                Administración de Noticias
              </h1>
              <p className="text-gray-600 dark:text-gray-400">
                Gestiona todas las noticias de Zoom TV ({totalNews} total)
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={handleCreateNews}
                className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
              >
                <Plus size={16} />
                <span>Nueva Noticia</span>
              </button>
            </div>
          </div>

          {/* Success/Error Messages */}
          {success && (
            <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-xl p-4">
              <div className="flex items-center">
                <CheckCircle className="text-green-500 mr-2" size={20} />
                <p className="text-green-700 dark:text-green-300">{success}</p>
              </div>
            </div>
          )}

          {error && (
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-4">
              <div className="flex items-center">
                <AlertCircle className="text-red-500 mr-2" size={20} />
                <p className="text-red-700 dark:text-red-300">{error}</p>
              </div>
            </div>
          )}

          {/* Filters */}
          <div className="glass-effect rounded-xl p-6 shadow-lg border border-white/30 dark:border-gray-600/30">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-black">
                Filtros y Búsqueda
              </h3>
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center space-x-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
              >
                <Filter size={16} />
                <span>{showFilters ? 'Ocultar' : 'Mostrar'} Filtros</span>
              </button>
            </div>

            <div className="flex items-center space-x-4 mb-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
                <input
                  type="text"
                  placeholder="Buscar noticias por título o contenido..."
                  value={filters.search}
                  onChange={(e) => handleFilterChange('search', e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-white/30 dark:border-gray-600/30 rounded-lg glass-effect text-gray-900 dark:text-black focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <button
                onClick={() => loadData()}
                className="p-2 glass-effect rounded-lg hover:bg-white/20 dark:hover:bg-black/20 transition-colors"
                title="Actualizar"
              >
                <RefreshCw size={16} />
              </button>
            </div>

            {showFilters && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <select
                  value={filters.category || ''}
                  onChange={(e) => handleFilterChange('category', e.target.value)}
                  className="px-3 py-2 border border-white/30 dark:border-gray-600/30 rounded-lg glass-effect text-gray-900 dark:text-black focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Todas las categorías</option>
                  {CATEGORIES.map(category => (
                    <option key={category.value} value={category.value}>
                      {category.label}
                    </option>
                  ))}
                </select>

                <select
                  value={filters.status || ''}
                  onChange={(e) => handleFilterChange('status', e.target.value)}
                  className="px-3 py-2 border border-white/30 dark:border-gray-600/30 rounded-lg glass-effect text-gray-900 dark:text-black focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Todos los estados</option>
                  {STATUS_OPTIONS.map(status => (
                    <option key={status.value} value={status.value}>
                      {status.label}
                    </option>
                  ))}
                </select>

                <select
                  value={filters.limit}
                  onChange={(e) => handleFilterChange('limit', parseInt(e.target.value))}
                  className="px-3 py-2 border border-white/30 dark:border-gray-600/30 rounded-lg glass-effect text-gray-900 dark:text-black focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value={10}>10 por página</option>
                  <option value={20}>20 por página</option>
                  <option value={50}>50 por página</option>
                </select>
              </div>
            )}
          </div>

          {/* Bulk Actions */}
          {selectedNews.length > 0 && (
            <div className="glass-effect rounded-xl p-4 border border-blue-200/30 dark:border-blue-800/30">
              <div className="flex items-center justify-between">
                <span className="text-blue-800 dark:text-blue-200">
                  {selectedNews.length} noticia(s) seleccionada(s)
                </span>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => handleBulkAction('publish')}
                    className="px-3 py-1 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm"
                  >
                    Publicar
                  </button>
                  <button
                    onClick={() => handleBulkAction('archive')}
                    className="px-3 py-1 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors text-sm"
                  >
                    Archivar
                  </button>
                  <button
                    onClick={() => handleBulkAction('delete')}
                    className="px-3 py-1 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm"
                  >
                    Eliminar
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* News List */}
          <div className="glass-effect rounded-xl shadow-lg border border-white/30 dark:border-gray-600/30">
            {news.length === 0 ? (
              <div className="p-8 text-center">
                <FileText className="mx-auto text-gray-400 mb-4" size={48} />
                <h3 className="text-lg font-medium text-gray-900 dark:text-black mb-2">
                  No hay noticias
                </h3>
                <p className="text-gray-600 dark:text-gray-400 mb-4">
                  {filters.search || filters.category || filters.status 
                    ? 'No se encontraron noticias con los filtros aplicados'
                    : 'Aún no hay noticias creadas. Crea la primera noticia.'
                  }
                </p>
                {!filters.search && !filters.category && !filters.status && (
                  <button
                    onClick={handleCreateNews}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
                  >
                    Crear Primera Noticia
                  </button>
                )}
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 dark:bg-gray-700">
                    <tr>
                      <th className="px-6 py-3 text-left">
                        <input
                          type="checkbox"
                          onChange={(e) => {
                            if (e.target.checked) {
                              setSelectedNews(news.map(n => n._id));
                            } else {
                              setSelectedNews([]);
                            }
                          }}
                          className="rounded border-gray-300 dark:border-gray-600"
                        />
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Noticia
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Categoría
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Estado
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Vistas
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Fecha
                      </th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Acciones
                      </th>
                    </tr>
                  </thead>
                  <tbody className="glass-effect divide-y divide-white/20 dark:divide-gray-600/20">
                    {news.map((item) => (
                      <tr key={item._id} className="hover:bg-white/10 dark:hover:bg-black/10 transition-colors">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <input
                            type="checkbox"
                            checked={selectedNews.includes(item._id)}
                            onChange={(e) => {
                              if (e.target.checked) {
                                setSelectedNews([...selectedNews, item._id]);
                              } else {
                                setSelectedNews(selectedNews.filter(id => id !== item._id));
                              }
                            }}
                            className="rounded border-gray-300 dark:border-gray-600"
                          />
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center">
                            <div className="w-12 h-12 glass-effect rounded-lg mr-4 flex items-center justify-center">
                              {item.imageUrl ? (
                                <img
                                  src={item.imageUrl.startsWith('http') ? item.imageUrl : `https://api-zoomtv.onrender.com${item.imageUrl}`}
                                  alt={item.title}
                                  className="w-12 h-12 object-cover rounded-lg"
                                  onError={(e) => {
                                    console.error('Error loading image:', item.imageUrl);
                                    e.currentTarget.style.display = 'none';
                                  }}
                                />
                              ) : (
                                <Image className="text-gray-400" size={24} />
                              )}
                            </div>
                            <div>
                              <div className="text-sm font-medium text-gray-900 dark:text-black">
                                {item.title}
                              </div>
                              <div className="text-sm text-gray-500 dark:text-gray-400">
                                {item.author}
                              </div>
                              {item.featured && (
                                <div className="flex items-center mt-1">
                                  <Star size={12} className="text-yellow-500 mr-1" />
                                  <span className="text-xs text-yellow-600 dark:text-yellow-400">Destacada</span>
                                </div>
                              )}
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span
                            className="px-2 py-1 text-xs rounded-full glass-effect"
                            style={{
                              color: getCategoryColor(item.category)
                            }}
                          >
                            {getCategoryLabel(item.category)}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span
                            className="px-2 py-1 text-xs rounded-full glass-effect"
                            style={{
                              color: getStatusColor(item.status)
                            }}
                          >
                            {getStatusLabel(item.status)}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                          {item.views.toLocaleString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                          {new Date(item.date).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <div className="flex items-center justify-end space-x-2">
                            <button
                              onClick={() => handleEditNews(item)}
                              className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300 p-1 rounded glass-effect hover:bg-white/20 dark:hover:bg-black/20 transition-colors"
                              title="Editar"
                            >
                              <Edit size={16} />
                            </button>
                            <button
                              onClick={() => handleDeleteNews(item._id)}
                              className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300 p-1 rounded glass-effect hover:bg-white/20 dark:hover:bg-black/20 transition-colors"
                              title="Eliminar"
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="px-6 py-4 border-t border-gray-200 dark:border-gray-700">
                <div className="flex items-center justify-between">
                  <div className="text-sm text-gray-700 dark:text-gray-300">
                    Mostrando {(((filters.page || 1) - 1) * (filters.limit || 10)) + 1} a {Math.min((filters.page || 1) * (filters.limit || 10), totalNews)} de {totalNews} noticias
                  </div>
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => handlePageChange((filters.page || 1) - 1)}
                      disabled={(filters.page || 1) === 1}
                      className="px-3 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Anterior
                    </button>
                    <span className="px-3 py-1 bg-blue-600 text-white rounded-lg">
                      {filters.page || 1}
                    </span>
                    <button
                      onClick={() => handlePageChange((filters.page || 1) + 1)}
                      disabled={(filters.page || 1) === totalPages}
                      className="px-3 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Siguiente
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </>
      ) : (
        <>
          {/* Form Header */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-black">
                {editingNews ? 'Editar Noticia' : 'Nueva Noticia'}
              </h1>
              <p className="text-gray-600 dark:text-gray-400">
                {editingNews ? 'Modifica los datos de la noticia' : 'Completa el formulario para crear una nueva noticia'}
              </p>
            </div>
            <button
              onClick={() => setShowForm(false)}
              className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white transition-colors"
            >
              <X size={20} />
              <span>Volver</span>
            </button>
          </div>

          {/* Success/Error Messages */}
          {success && (
            <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-xl p-4">
              <div className="flex items-center">
                <CheckCircle className="text-green-500 mr-2" size={20} />
                <p className="text-green-700 dark:text-green-300">{success}</p>
              </div>
            </div>
          )}

          {error && (
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-4">
              <div className="flex items-center">
                <AlertCircle className="text-red-500 mr-2" size={20} />
                <p className="text-red-700 dark:text-red-300">{error}</p>
              </div>
            </div>
          )}

          {/* Form */}
          <div className="glass-effect dark:bg-gray-800 rounded-xl shadow-lg border border-white/30 dark:border-gray-600/30 p-6">
            <form onSubmit={(e) => { e.preventDefault(); handleSaveNews(); }} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Basic Information */}
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    ID de la Noticia
                  </label>
                  <input
                    type="text"
                    value={formData.id}
                    onChange={(e) => setFormData({...formData, id: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600/30 rounded-lg glass-effect dark:bg-gray-800 text-black dark:text-black focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="ID único de la noticia"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Título * <span className="text-red-500">*</span>
                  </label>
                                  <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({...formData, title: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600/30 rounded-lg glass-effect dark:bg-gray-800 text-black dark:text-black focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Título de la noticia"
                  required
                />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Autor * <span className="text-red-500">*</span>
                  </label>
                                  <input
                  type="text"
                  value={formData.author}
                  onChange={(e) => setFormData({...formData, author: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600/30 rounded-lg glass-effect dark:bg-gray-800 text-black dark:text-black focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Nombre del autor"
                  required
                />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Fecha * <span className="text-red-500">*</span>
                  </label>
                                  <input
                  type="date"
                  value={formData.date}
                  onChange={(e) => setFormData({...formData, date: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600/30 rounded-lg glass-effect dark:bg-gray-800 text-black dark:text-black focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Categoría * <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({...formData, category: e.target.value as any})}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600/30 rounded-lg glass-effect dark:bg-gray-800 text-black dark:text-black focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  >
                    {CATEGORIES.map(category => (
                      <option key={category.value} value={category.value}>
                        {category.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Estado
                  </label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({...formData, status: e.target.value as any})}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600/30 rounded-lg glass-effect dark:bg-gray-800 text-black dark:text-black focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    {STATUS_OPTIONS.map(status => (
                      <option key={status.value} value={status.value}>
                        {status.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="flex items-center">
                  <input
                    type="checkbox"
                    checked={formData.featured}
                    onChange={(e) => setFormData({...formData, featured: e.target.checked})}
                    className="rounded border-gray-300 dark:border-gray-600"
                  />
                  <label className="ml-2 text-sm text-gray-700 dark:text-gray-300">
                    Noticia destacada
                  </label>
                </div>
              </div>

              {/* Content */}
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Resumen * <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    value={formData.summary}
                    onChange={(e) => setFormData({...formData, summary: e.target.value})}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600/30 rounded-lg glass-effect dark:bg-gray-800 text-black dark:text-black focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Resumen de la noticia"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Contenido * <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    value={formData.content}
                    onChange={(e) => setFormData({...formData, content: e.target.value})}
                    rows={8}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600/30 rounded-lg glass-effect dark:bg-gray-800 text-black dark:text-black focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Contenido completo de la noticia"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    URL de la imagen
                  </label>
                  <input
                    type="url"
                    value={formData.imageUrl}
                    onChange={(e) => setFormData({...formData, imageUrl: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600/30 rounded-lg glass-effect dark:bg-gray-800 text-black dark:text-black focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="https://ejemplo.com/imagen.jpg"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Etiquetas
                  </label>
                  <input
                    type="text"
                    value={formData.tags.join(', ')}
                    onChange={(e) => setFormData({...formData, tags: e.target.value.split(',').map(tag => tag.trim()).filter(tag => tag)})}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600/30 rounded-lg glass-effect dark:bg-gray-800 text-black dark:text-black focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="etiqueta1, etiqueta2, etiqueta3"
                  />
                </div>
              </div>
            </div>

            {/* SEO Section */}
            <div className="mt-6 border-t border-gray-200 dark:border-gray-700 pt-6">
                          <h3 className="text-lg font-medium text-gray-900 dark:text-black mb-4">
              Configuración SEO
            </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Título SEO
                  </label>
                  <input
                    type="text"
                    value={formData.seoTitle}
                    onChange={(e) => setFormData({...formData, seoTitle: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600/30 rounded-lg glass-effect dark:bg-gray-800 text-black dark:text-black focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Título optimizado para SEO"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Descripción SEO
                  </label>
                  <textarea
                    value={formData.seoDescription}
                    onChange={(e) => setFormData({...formData, seoDescription: e.target.value})}
                    rows={2}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600/30 rounded-lg glass-effect dark:bg-gray-800 text-black dark:text-black focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Descripción optimizada para SEO"
                  />
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center justify-end space-x-4 pt-6 border-t border-gray-200 dark:border-gray-700">
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="px-4 py-2 text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
              >
                <Save size={16} />
                <span>{editingNews ? 'Actualizar' : 'Crear'} Noticia</span>
              </button>
            </div>
          </form>
        </div>
        </>
      )}
    </div>
  );
};
