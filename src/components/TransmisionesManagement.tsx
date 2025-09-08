import React, { useState, useEffect } from "react";
import { transmisionesApi, type Transmision, type TransmisionFormData } from "../services/zoomTvApi";
import { 
  Radio, 
  Plus, 
  Edit, 
  Trash2, 
  Play, 
  Square, 
  AlertCircle, 
  CheckCircle,
  Search,
  Zap,
  Globe,
  Clock
} from "lucide-react";

const TransmisionesManagement = () => {
  const [transmisiones, setTransmisiones] = useState<Transmision[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [editingTransmision, setEditingTransmision] = useState<Transmision | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoadingTransmisiones, setIsLoadingTransmisiones] = useState(false);
  const [abortController, setAbortController] = useState<AbortController | null>(null);
  const [formData, setFormData] = useState<TransmisionFormData>({
    nombre: "",
    url: ""
  });

  useEffect(() => {
    // Crear nuevo AbortController para esta sesión
    const controller = new AbortController();
    setAbortController(controller);
    
    console.log('🚀 Iniciando carga de transmisiones...');
    loadTransmisiones(0, controller.signal);
    
    // Cleanup: cancelar consultas cuando el componente se desmonte
    return () => {
      console.log('🛑 Cancelando consultas de transmisiones...');
      controller.abort();
    };
  }, []);

  const loadTransmisiones = async (retryCount = 0, abortSignal?: AbortSignal) => {
    // Evitar múltiples llamadas simultáneas
    if (isLoadingTransmisiones) {
      console.log('⏸️ Ya hay una carga en progreso, saltando...');
      return;
    }

    // Verificar si la consulta fue cancelada
    if (abortSignal?.aborted) {
      console.log('🚫 Consulta cancelada antes de ejecutarse');
      return;
    }

    try {
      setIsLoadingTransmisiones(true);
      setLoading(true);
      setError(null);
      console.log('🔄 Cargando transmisiones desde la API...', retryCount > 0 ? `(Intento ${retryCount + 1})` : '');
      
      const response = await transmisionesApi.getAll(undefined, abortSignal);
      console.log('📡 Respuesta de la API:', response);
      
      if (response.success) {
        const transmisionesData = response.data || [];
        console.log('📺 Transmisiones cargadas:', transmisionesData.length);
        console.log('📺 Datos de transmisiones:', transmisionesData);
        
        // Validar y limpiar datos
        const transmisionesValidas = transmisionesData.filter(transmision => {
          // El backend devuelve 'id' en lugar de '_id'
          const id = transmision._id || transmision.id;
          const isValid = transmision && 
            id && 
            transmision.nombre && 
            transmision.url &&
            typeof id === 'string' &&
            typeof transmision.nombre === 'string' &&
            typeof transmision.url === 'string';
          
          if (!isValid) {
            console.log('❌ Transmisión inválida:', transmision);
            console.log('❌ Campos faltantes:', {
              transmision: !!transmision,
              id: !!id,
              nombre: !!transmision?.nombre,
              url: !!transmision?.url,
              idType: typeof id,
              nombreType: typeof transmision?.nombre,
              urlType: typeof transmision?.url
            });
          }
          
          return isValid;
        });
        
        console.log('📺 Transmisiones válidas:', transmisionesValidas.length);
        setTransmisiones(transmisionesValidas);
        
        if (transmisionesValidas.length === 0) {
          console.log('ℹ️ No hay transmisiones válidas en la base de datos');
        }
      } else {
        console.error('❌ Error en la respuesta de la API:', response.message);
        setError(`Error al cargar transmisiones: ${response.message || 'Error desconocido'}`);
      }
    } catch (err: any) {
      // Verificar si la consulta fue cancelada
      if (err.name === 'AbortError' || abortSignal?.aborted) {
        console.log('🚫 Consulta cancelada');
        return;
      }
      
      console.error('❌ Error cargando transmisiones:', err);
      
      // Manejo específico para error 429 (Too Many Requests)
      if (err.response?.status === 429) {
        if (retryCount < 3) {
          const delay = Math.pow(2, retryCount) * 1000; // Backoff exponencial: 1s, 2s, 4s
          console.log(`⏳ Rate limit alcanzado. Reintentando en ${delay}ms...`);
          setError(`Demasiadas solicitudes. Reintentando en ${delay/1000} segundos...`);
          
          setTimeout(() => {
            if (!abortSignal?.aborted) {
              loadTransmisiones(retryCount + 1, abortSignal);
            }
          }, delay);
          return;
        } else {
          setError('Demasiadas solicitudes. Por favor, espera unos minutos antes de recargar la página.');
        }
      } else {
        setError(`Error al cargar transmisiones: ${err.message || 'Error de conexión'}`);
      }
    } finally {
      if (!abortSignal?.aborted) {
        setLoading(false);
        setIsLoadingTransmisiones(false);
      }
    }
  };

  const validateForm = (): string | null => {
    if (!formData.nombre.trim()) {
      return 'El nombre de la transmisión es obligatorio';
    }
    if (!formData.url.trim()) {
      return 'La URL del stream es obligatoria';
    }
    // Validar formato de URL
    try {
      new URL(formData.url);
    } catch {
      return 'La URL debe tener un formato válido (ej: https://example.com/stream.m3u8)';
    }
    return null;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validar formulario
    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      return;
    }

    try {
      setSubmitting(true);
      setError(null);
      setSuccess(null);
      
      if (editingTransmision) {
        const response = await transmisionesApi.update(getTransmisionId(editingTransmision), formData);
        if (response.success) {
          const updatedTransmisiones = transmisiones.map(t => 
            getTransmisionId(t) === getTransmisionId(editingTransmision)
              ? { ...t, ...formData }
              : t
          );
          setTransmisiones(updatedTransmisiones);
          setSuccess('Transmisión actualizada exitosamente');
          setShowForm(false);
          setEditingTransmision(null);
          resetForm();
        } else {
          setError(response.message || 'Error al actualizar transmisión');
        }
      } else {
        const response = await transmisionesApi.create(formData);
        if (response.success && response.data) {
          setTransmisiones([response.data, ...transmisiones]);
          setSuccess('Transmisión creada exitosamente');
          setShowForm(false);
          resetForm();
        } else {
          setError(response.message || 'Error al crear transmisión');
        }
      }
    } catch (err: any) {
      console.error('Error en handleSubmit:', err);
      if (err.response?.data?.message) {
        setError(err.response.data.message);
      } else if (err.message) {
        setError(`Error: ${err.message}`);
      } else {
        setError('Error de conexión. Por favor, intenta nuevamente.');
      }
    } finally {
      setSubmitting(false);
    }
  };

  const handleEdit = (transmision: Transmision) => {
    setEditingTransmision(transmision);
    setFormData({
      nombre: transmision.nombre,
      url: transmision.url
    });
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('¿Estás seguro de que quieres eliminar esta transmisión?')) {
      return;
    }

    try {
      setError(null);
      setSuccess(null);
      
      const response = await transmisionesApi.delete(id);
      if (response.success) {
        setTransmisiones(transmisiones.filter(t => getTransmisionId(t) !== id));
        setSuccess('Transmisión eliminada exitosamente');
      } else {
        setError(response.message || 'Error al eliminar transmisión');
      }
    } catch (err: any) {
      console.error('Error eliminando transmisión:', err);
      if (err.response?.data?.message) {
        setError(err.response.data.message);
      } else if (err.message) {
        setError(`Error: ${err.message}`);
      } else {
        setError('Error de conexión. Por favor, intenta nuevamente.');
      }
    }
  };

  const handleLaunchLive = async (id: string) => {
    console.log('🚀 Intentando lanzar transmisión con ID:', id);
    
    if (!id) {
      console.error('❌ ID de transmisión no válido');
      setError('ID de transmisión no válido');
      return;
    }

    try {
      setError(null);
      setSuccess(null);
      
      console.log('📡 Llamando a la API para lanzar transmisión...');
      const response = await transmisionesApi.launchLive(id);
      console.log('📡 Respuesta de la API:', response);
      
      if (response.success) {
        console.log('✅ Transmisión lanzada exitosamente, recargando datos...');
        // Recargar transmisiones para actualizar estados
        await loadTransmisiones(0, abortController?.signal);
        setSuccess('Transmisión lanzada en vivo exitosamente');
      } else {
        console.error('❌ Error en la respuesta:', response.message);
        setError(response.message || 'Error al lanzar transmisión en vivo');
      }
    } catch (err: any) {
      console.error('❌ Error lanzando transmisión:', err);
      if (err.response?.data?.message) {
        setError(err.response.data.message);
      } else if (err.message) {
        setError(`Error: ${err.message}`);
      } else {
        setError('Error de conexión. Por favor, intenta nuevamente.');
      }
    }
  };

  const handleStopLive = async (id: string) => {
    if (!id) {
      setError('ID de transmisión no válido');
      return;
    }

    try {
      setError(null);
      setSuccess(null);
      
      const response = await transmisionesApi.stopLive(id);
      if (response.success) {
        // Recargar transmisiones para actualizar estados
        await loadTransmisiones(0, abortController?.signal);
        setSuccess('Transmisión detenida exitosamente');
      } else {
        setError(response.message || 'Error al detener transmisión');
      }
    } catch (err: any) {
      console.error('Error deteniendo transmisión:', err);
      if (err.response?.data?.message) {
        setError(err.response.data.message);
      } else if (err.message) {
        setError(`Error: ${err.message}`);
      } else {
        setError('Error de conexión. Por favor, intenta nuevamente.');
      }
    }
  };

  const resetForm = () => {
    setFormData({
      nombre: "",
      url: ""
    });
    setEditingTransmision(null);
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingTransmision(null);
    resetForm();
  };

  // Filtrar transmisiones por término de búsqueda
  const filteredTransmisiones = transmisiones.filter(transmision =>
    transmision?.nombre?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    transmision?.url?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Helper para obtener el ID correcto (compatibilidad con backend)
  const getTransmisionId = (transmision: Transmision): string => {
    return transmision._id || transmision.id;
  };

  // Obtener transmisión en vivo actual
  const transmisionLive = transmisiones.find(t => t.isLive) || null;
  
  // Debug: Log de transmisiones cargadas
  console.log('📺 Transmisiones cargadas:', transmisiones);
  console.log('📺 Transmisión en vivo actual:', transmisionLive);
  
  // Debug: Verificar estructura de cada transmisión
  transmisiones.forEach((transmision, index) => {
    const id = transmision?._id || transmision?.id;
    console.log(`📺 Transmisión ${index}:`, {
      id: id,
      nombre: transmision?.nombre,
      url: transmision?.url,
      isLive: transmision?.isLive,
      isActive: transmision?.isActive,
      estructura: transmision
    });
  });

  // Estadísticas
  const stats = {
    total: transmisiones.length,
    active: transmisiones.filter(t => t?.isActive).length,
    live: transmisiones.filter(t => t?.isLive).length,
    inactive: transmisiones.filter(t => !t?.isActive).length
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="glass-effect p-8 rounded-2xl">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Cargando transmisiones...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="glass-effect rounded-2xl p-6 border border-white/30 dark:border-gray-600/30">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 glass-effect border border-white/20 dark:border-gray-600/20 flex items-center justify-center rounded-xl">
              <Radio className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                Gestión de Transmisiones
              </h1>
              <p className="text-gray-600 dark:text-gray-400 mt-1">
                Administra las transmisiones en vivo del canal de TV
              </p>
            </div>
          </div>
          <button
            onClick={() => setShowForm(true)}
            className="glass-effect hover:bg-white/20 dark:hover:bg-black/20 px-6 py-3 rounded-xl transition-all duration-300 flex items-center space-x-2 text-white bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
          >
            <Plus size={20} />
            <span>Nueva Transmisión</span>
          </button>
        </div>
      </div>

      {/* Estadísticas */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="glass-effect rounded-2xl p-6 border border-white/30 dark:border-gray-600/30">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 glass-effect border border-white/20 dark:border-gray-600/20 flex items-center justify-center rounded-xl">
              <Radio className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Total</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.total}</p>
            </div>
          </div>
        </div>

        <div className="glass-effect rounded-2xl p-6 border border-white/30 dark:border-gray-600/30">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 glass-effect border border-white/20 dark:border-gray-600/20 flex items-center justify-center rounded-xl">
              <CheckCircle className="w-6 h-6 text-green-600 dark:text-green-400" />
            </div>
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Activas</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.active}</p>
            </div>
          </div>
        </div>

        <div className="glass-effect rounded-2xl p-6 border border-white/30 dark:border-gray-600/30">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 glass-effect border border-white/20 dark:border-gray-600/20 flex items-center justify-center rounded-xl">
              <Zap className="w-6 h-6 text-red-600 dark:text-red-400" />
            </div>
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">En Vivo</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.live}</p>
            </div>
          </div>
        </div>

        <div className="glass-effect rounded-2xl p-6 border border-white/30 dark:border-gray-600/30">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 glass-effect border border-white/20 dark:border-gray-600/20 flex items-center justify-center rounded-xl">
              <Square className="w-6 h-6 text-gray-600 dark:text-gray-400" />
            </div>
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Inactivas</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.inactive}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Estado de Transmisión en Vivo */}
      {transmisionLive && getTransmisionId(transmisionLive) ? (
        <div className="glass-effect rounded-2xl p-6 border border-green-200/50 dark:border-green-800/50 bg-gradient-to-r from-green-50/50 to-emerald-50/50 dark:from-green-900/20 dark:to-emerald-900/20">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 glass-effect border border-green-200/50 dark:border-green-800/50 flex items-center justify-center rounded-xl">
                <div className="w-4 h-4 bg-red-500 rounded-full animate-pulse"></div>
              </div>
              <div>
                <h3 className="font-semibold text-green-800 dark:text-green-200 text-lg">
                  Transmitiendo en Vivo
                </h3>
                <p className="text-green-700 dark:text-green-300 font-medium">
                  {transmisionLive.nombre}
                </p>
                <p className="text-sm text-green-600 dark:text-green-400 flex items-center space-x-2">
                  <Globe size={14} />
                  <span>{transmisionLive.url}</span>
                </p>
              </div>
            </div>
            <button
              onClick={() => transmisionLive && handleStopLive(getTransmisionId(transmisionLive))}
              className="glass-effect hover:bg-red-500/20 dark:hover:bg-red-500/20 px-4 py-2 rounded-xl transition-all duration-300 flex items-center space-x-2 text-red-600 dark:text-red-400 border border-red-200/50 dark:border-red-800/50"
            >
              <Square size={16} />
              <span>Detener</span>
            </button>
          </div>
        </div>
      ) : (
        <div className="glass-effect rounded-2xl p-6 border border-white/30 dark:border-gray-600/30">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 glass-effect border border-white/20 dark:border-gray-600/20 flex items-center justify-center rounded-xl">
              <div className="w-4 h-4 bg-gray-400 rounded-full"></div>
            </div>
            <div>
              <h3 className="font-semibold text-gray-700 dark:text-gray-300 text-lg">
                Sin Transmisión en Vivo
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                Selecciona una transmisión para lanzar en vivo
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Alertas */}
      {error && (
        <div className="glass-effect rounded-2xl p-4 border border-red-200/50 dark:border-red-800/50 bg-gradient-to-r from-red-50/50 to-pink-50/50 dark:from-red-900/20 dark:to-pink-900/20">
          <div className="flex items-center space-x-3">
            <AlertCircle size={20} className="text-red-600 dark:text-red-400" />
            <span className="text-red-700 dark:text-red-300">{error}</span>
          </div>
        </div>
      )}

      {success && (
        <div className="glass-effect rounded-2xl p-4 border border-green-200/50 dark:border-green-800/50 bg-gradient-to-r from-green-50/50 to-emerald-50/50 dark:from-green-900/20 dark:to-emerald-900/20">
          <div className="flex items-center space-x-3">
            <CheckCircle size={20} className="text-green-600 dark:text-green-400" />
            <span className="text-green-700 dark:text-green-300">{success}</span>
          </div>
        </div>
      )}

      {/* Formulario */}
      {showForm && (
        <div className="glass-effect rounded-2xl p-6 border border-white/30 dark:border-gray-600/30">
          <div className="flex items-center space-x-3 mb-6">
            <div className="w-10 h-10 glass-effect border border-white/20 dark:border-gray-600/20 flex items-center justify-center rounded-xl">
              <Plus className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
              {editingTransmision ? 'Editar Transmisión' : 'Nueva Transmisión'}
            </h3>
          </div>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Nombre de la Transmisión
                </label>
                <input
                  type="text"
                  value={formData.nombre}
                  onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                  className="w-full px-4 py-3 border border-white/30 dark:border-gray-600/30 rounded-xl glass-effect text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                  placeholder="Ej: Noticias 24/7"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  URL del Stream
                </label>
                <input
                  type="url"
                  value={formData.url}
                  onChange={(e) => setFormData({ ...formData, url: e.target.value })}
                  className="w-full px-4 py-3 border border-white/30 dark:border-gray-600/30 rounded-xl glass-effect text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                  placeholder="https://example.com/stream.m3u8"
                  required
                />
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  Formatos soportados: HLS (.m3u8), RTMP, MP4, etc.
                </p>
              </div>
            </div>

            <div className="flex space-x-4">
              <button
                type="submit"
                disabled={submitting}
                className="glass-effect hover:bg-white/20 dark:hover:bg-black/20 px-6 py-3 rounded-xl transition-all duration-300 flex items-center space-x-2 text-white bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 disabled:opacity-50"
              >
                {submitting ? (
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                ) : (
                  <CheckCircle size={16} />
                )}
                <span>{editingTransmision ? 'Actualizar' : 'Crear'}</span>
              </button>
              <button
                type="button"
                onClick={handleCancel}
                className="glass-effect hover:bg-white/20 dark:hover:bg-black/20 px-6 py-3 rounded-xl transition-all duration-300 text-gray-700 dark:text-gray-300 border border-white/30 dark:border-gray-600/30"
              >
                Cancelar
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Búsqueda */}
      <div className="glass-effect rounded-2xl p-6 border border-white/30 dark:border-gray-600/30">
        <div className="flex items-center space-x-3">
          <Search size={20} className="text-gray-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Buscar transmisiones..."
            className="flex-1 px-4 py-3 border border-white/30 dark:border-gray-600/30 rounded-xl glass-effect text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
          />
        </div>
      </div>

      {/* Lista de Transmisiones */}
      <div className="glass-effect rounded-2xl border border-white/30 dark:border-gray-600/30 overflow-hidden">
        <div className="p-6 border-b border-white/20 dark:border-gray-600/20">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 glass-effect border border-white/20 dark:border-gray-600/20 flex items-center justify-center rounded-xl">
                <Radio className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                Transmisiones ({filteredTransmisiones.length})
              </h3>
            </div>
          </div>
        </div>
        
        {filteredTransmisiones.length === 0 ? (
          <div className="p-12 text-center">
            <div className="w-16 h-16 glass-effect border border-white/20 dark:border-gray-600/20 flex items-center justify-center rounded-2xl mx-auto mb-4">
              <Radio className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-xl font-medium text-gray-900 dark:text-white mb-2">
              {searchTerm ? 'No se encontraron transmisiones' : 'No hay transmisiones configuradas'}
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              {searchTerm 
                ? 'Intenta cambiar el término de búsqueda o crear una nueva transmisión.'
                : 'Configura tu primera transmisión para comenzar a transmitir desde el canal de TV.'
              }
            </p>
            {!searchTerm && (
              <button
                onClick={() => setShowForm(true)}
                className="glass-effect hover:bg-white/20 dark:hover:bg-black/20 px-6 py-3 rounded-xl transition-all duration-300 text-white bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
              >
                Configurar Primera Transmisión
              </button>
            )}
          </div>
        ) : (
          <div className="divide-y divide-white/20 dark:divide-gray-600/20">
            {filteredTransmisiones.map((transmision) => (
              <div key={getTransmisionId(transmision)} className="p-6 hover:bg-white/5 dark:hover:bg-black/5 transition-colors duration-300">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4 flex-1">
                    <div className="w-12 h-12 glass-effect border border-white/20 dark:border-gray-600/20 flex items-center justify-center rounded-xl">
                      <Radio className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                    </div>
                    <div className="flex-1">
                      <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">
                        {transmision?.nombre || 'Sin nombre'}
                      </h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-2 flex items-center space-x-2">
                        <Globe size={14} />
                        <span className="truncate">{transmision?.url || 'Sin URL'}</span>
                      </p>
                      <div className="flex items-center space-x-3">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                          transmision?.isActive 
                            ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300' 
                            : 'bg-gray-100 text-gray-800 dark:bg-gray-600/20 dark:text-gray-300'
                        }`}>
                          {transmision?.isActive ? 'Activo' : 'Inactivo'}
                        </span>
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                          transmision?.isLive 
                            ? 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-300' 
                            : 'bg-gray-100 text-gray-800 dark:bg-gray-600/20 dark:text-gray-300'
                        }`}>
                          {transmision?.isLive ? 'En Vivo' : 'Offline'}
                        </span>
                        <span className="text-xs text-gray-500 dark:text-gray-400 flex items-center space-x-1">
                          <Clock size={12} />
                          <span>{transmision?.createdAt ? new Date(transmision.createdAt).toLocaleDateString() : 'Sin fecha'}</span>
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    {!transmision?.isLive ? (
                      <button
                        onClick={() => {
                          console.log('🎯 Botón Play clickeado para transmisión:', transmision);
                          console.log('🎯 ID de la transmisión:', getTransmisionId(transmision));
                          console.log('🎯 Estado isLive:', transmision?.isLive);
                          if (getTransmisionId(transmision)) {
                            handleLaunchLive(getTransmisionId(transmision));
                          } else {
                            console.error('❌ No se puede lanzar: ID no disponible');
                            setError('No se puede lanzar la transmisión: ID no disponible');
                          }
                        }}
                        className="glass-effect hover:bg-green-500/20 dark:hover:bg-green-500/20 p-2 rounded-xl transition-all duration-300 text-green-600 dark:text-green-400 border border-green-200/50 dark:border-green-800/50"
                        title="Lanzar en Vivo"
                      >
                        <Play size={16} />
                      </button>
                    ) : (
                      <button
                        onClick={() => transmision && handleStopLive(getTransmisionId(transmision))}
                        className="glass-effect hover:bg-red-500/20 dark:hover:bg-red-500/20 p-2 rounded-xl transition-all duration-300 text-red-600 dark:text-red-400 border border-red-200/50 dark:border-red-800/50"
                        title="Detener"
                      >
                        <Square size={16} />
                      </button>
                    )}
                    <button
                      onClick={() => transmision && handleEdit(transmision)}
                      className="glass-effect hover:bg-blue-500/20 dark:hover:bg-blue-500/20 p-2 rounded-xl transition-all duration-300 text-blue-600 dark:text-blue-400 border border-blue-200/50 dark:border-blue-800/50"
                      title="Editar"
                    >
                      <Edit size={16} />
                    </button>
                    <button
                      onClick={() => transmision && handleDelete(getTransmisionId(transmision))}
                      className="glass-effect hover:bg-red-500/20 dark:hover:bg-red-500/20 p-2 rounded-xl transition-all duration-300 text-red-600 dark:text-red-400 border border-red-200/50 dark:border-red-800/50"
                      title="Eliminar"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default TransmisionesManagement;