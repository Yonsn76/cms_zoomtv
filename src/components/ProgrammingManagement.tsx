import React, { useState, useEffect } from 'react';
import { 
  Calendar, 
  Clock, 
  Plus, 
  Edit, 
  Trash2, 
  Save, 
  X,
  Play,
  Pause,
  Eye,
  EyeOff,
  ArrowLeft,
  Loader2
} from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';
import { programmingApi } from '../services/zoomTvApi';
import type { ProgrammingItem, ProgrammingFormData } from '../services/zoomTvApi';

const DAYS = [
  'LUNES', 'MARTES', 'MIÉRCOLES', 'JUEVES', 'VIERNES', 'SÁBADO', 'DOMINGO'
];

const CATEGORIES = [
  'Noticias', 'Música', 'Cine', 'Series', 'Anime', 'Entretenimiento', 'Deportes', 'Documentales', 'Otros'
];

const TYPES = [
  'Programa en vivo', 'Película', 'Serie', 'Música', 'Anime', 'Documental', 'Otros'
];

export const ProgrammingManagement: React.FC<{ onNavigate: (section: string) => void }> = ({ onNavigate }) => {
  const { themeMode } = useTheme();
  const [programs, setPrograms] = useState<ProgrammingItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [editingProgram, setEditingProgram] = useState<ProgrammingItem | null>(null);
  const [selectedDay, setSelectedDay] = useState<string>('LUNES');
  const [submitting, setSubmitting] = useState(false);

  // Fetch programming data from API
  useEffect(() => {
    const fetchPrograms = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await programmingApi.getAll();
        setPrograms(response.data || []);
      } catch (err) {
        console.error('Error fetching programming:', err);
        setError('Error al cargar la programación');
      } finally {
        setLoading(false);
      }
    };

    fetchPrograms();
  }, []);

  const [formData, setFormData] = useState<ProgrammingFormData>({
    title: '',
    description: '',
    day: 'LUNES',
    startTime: '19:00',
    endTime: '20:00',
    category: 'Noticias',
    type: 'Programa en vivo',
    color: '#3B82F6'
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      setSubmitting(true);
      
      if (editingProgram) {
        await programmingApi.update(editingProgram._id, formData);
        setPrograms(prev => prev.map(p => 
          p._id === editingProgram._id 
            ? { ...p, ...formData }
            : p
        ));
      } else {
        const response = await programmingApi.create(formData);
        setPrograms(prev => [...prev, response.data!]);
      }
      
      setShowForm(false);
      setEditingProgram(null);
      setFormData({
        title: '',
        description: '',
        day: 'LUNES',
        startTime: '19:00',
        endTime: '20:00',
        category: 'Noticias',
        type: 'Programa en vivo',
        color: '#3B82F6'
      });
    } catch (err) {
      console.error('Error saving programming:', err);
      alert('Error al guardar el programa');
    } finally {
      setSubmitting(false);
    }
  };

  const handleEdit = (program: ProgrammingItem) => {
    setEditingProgram(program);
    setFormData({
      title: program.title,
      description: program.description || '',
      day: program.day,
      startTime: program.startTime,
      endTime: program.endTime,
      category: program.category,
      type: program.type,
      color: program.color || '#3B82F6'
    });
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar este programa?')) {
      try {
        await programmingApi.delete(id);
        setPrograms(prev => prev.filter(p => p._id !== id));
      } catch (err) {
        console.error('Error deleting programming:', err);
        alert('Error al eliminar el programa');
      }
    }
  };

  const toggleActive = async (id: string) => {
    const program = programs.find(p => p._id === id);
    if (!program) return;

    try {
      const updatedData = { ...program, isActive: !program.isActive };
      await programmingApi.update(id, updatedData);
      setPrograms(prev => prev.map(p => 
        p._id === id ? { ...p, isActive: !p.isActive } : p
      ));
    } catch (err) {
      console.error('Error updating programming:', err);
      alert('Error al actualizar el programa');
    }
  };

  const getCategoryColor = (category: string) => {
    const colors: { [key: string]: string } = {
      'Noticias': 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-300',
      'Deportes': 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300',
      'Entretenimiento': 'bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-300',
      'Música': 'bg-pink-100 text-pink-800 dark:bg-pink-900/20 dark:text-pink-300',
      'Documentales': 'bg-orange-100 text-orange-800 dark:bg-orange-900/20 dark:text-orange-300',
      'Cine': 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-300',
      'Series': 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900/20 dark:text-indigo-300',
      'Anime': 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-300',
      'Otros': 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-300'
    };
    return colors[category] || colors['Otros'];
  };

  const filteredPrograms = programs.filter(program => program.day === selectedDay);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="flex items-center space-x-2">
          <Loader2 className="w-6 h-6 animate-spin text-blue-600" />
          <span className="text-gray-600 dark:text-gray-400">Cargando programación...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <div className="text-red-600 dark:text-red-400 mb-4">{error}</div>
        <button
          onClick={() => window.location.reload()}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
        >
          Reintentar
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {!showForm ? (
        <>
          {/* Header */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => onNavigate('overview')}
                className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white transition-colors"
              >
                <ArrowLeft size={20} />
                <span>Volver</span>
              </button>
              <div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-black">
                  Gestión de Programación
                </h1>
                <p className="text-gray-600 dark:text-gray-400">
                  Administra la programación semanal de Zoom TV
                </p>
              </div>
            </div>
            <button
              onClick={() => setShowForm(true)}
              className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
            >
              <Plus size={16} />
              <span>Nuevo Programa</span>
            </button>
          </div>

          {/* Day Selector */}
          <div className="glass-effect rounded-xl p-6 shadow-lg border border-white/30 dark:border-gray-600/30">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-black mb-4">
              Seleccionar Día
            </h3>
            <div className="grid grid-cols-7 gap-2">
              {DAYS.map((day) => (
                <button
                  key={day}
                  onClick={() => setSelectedDay(day)}
                  className={`p-3 rounded-lg text-sm font-medium transition-colors ${
                    selectedDay === day
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600'
                  }`}
                >
                  {day.slice(0, 3)}
                </button>
              ))}
            </div>
          </div>

          {/* Programs List */}
          <div className="glass-effect rounded-xl shadow-lg border border-white/30 dark:border-gray-600/30">
            <div className="p-6 border-b border-gray-200 dark:border-gray-700">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-black">
                Programación - {selectedDay}
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                {filteredPrograms.length} programa(s) programado(s)
              </p>
            </div>

            {filteredPrograms.length === 0 ? (
              <div className="p-8 text-center">
                <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 dark:text-black mb-2">
                  No hay programas
                </h3>
                <p className="text-gray-600 dark:text-gray-400 mb-4">
                  No hay programas programados para {selectedDay}
                </p>
                <button
                  onClick={() => setShowForm(true)}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
                >
                  Agregar Primer Programa
                </button>
              </div>
            ) : (
              <div className="divide-y divide-gray-200 dark:divide-gray-700">
                {filteredPrograms.map((program) => (
                  <div key={program._id} className="p-6 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className="flex-shrink-0">
                          <div 
                            className="w-12 h-12 rounded-lg flex items-center justify-center"
                            style={{ 
                              backgroundColor: program.color || '#3B82F6',
                              color: 'white'
                            }}
                          >
                            <Play size={20} />
                          </div>
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-1">
                            <h4 className="text-lg font-medium text-gray-900 dark:text-black">
                              {program.title}
                            </h4>
                            <span className={`px-2 py-1 text-xs rounded-full ${getCategoryColor(program.category)}`}>
                              {program.category}
                            </span>
                            <span className="px-2 py-1 text-xs rounded-full bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300">
                              {program.type}
                            </span>
                            {program.priority > 1 && (
                              <span className="px-2 py-1 text-xs rounded-full bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-300">
                                P{program.priority}
                              </span>
                            )}
                          </div>
                          <p className="text-gray-600 dark:text-gray-400 text-sm mb-2">
                            {program.description}
                          </p>
                          <div className="flex items-center space-x-4 text-sm text-gray-500 dark:text-gray-400">
                            <div className="flex items-center space-x-1">
                              <Clock size={14} />
                              <span>{program.startTime} - {program.endTime}</span>
                            </div>
                            <div className={`flex items-center space-x-1 ${program.isActive ? 'text-green-600 dark:text-green-400' : 'text-gray-400'}`}>
                              {program.isActive ? <Eye size={14} /> : <EyeOff size={14} />}
                              <span>{program.isActive ? 'Activo' : 'Inactivo'}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => toggleActive(program._id)}
                          className={`p-2 rounded-lg transition-colors ${
                            program.isActive
                              ? 'bg-green-100 text-green-600 hover:bg-green-200 dark:bg-green-900/20 dark:text-green-400'
                              : 'bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-400'
                          }`}
                        >
                          {program.isActive ? <Eye size={16} /> : <EyeOff size={16} />}
                        </button>
                        <button
                          onClick={() => handleEdit(program)}
                          className="p-2 text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300 hover:bg-blue-100 dark:hover:bg-blue-900/20 rounded-lg transition-colors"
                        >
                          <Edit size={16} />
                        </button>
                        <button
                          onClick={() => handleDelete(program._id)}
                          className="p-2 text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300 hover:bg-red-100 dark:hover:bg-red-900/20 rounded-lg transition-colors"
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
        </>
      ) : (
                /* Form */
        <div className="space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => {
                  setShowForm(false);
                  setEditingProgram(null);
                }}
                className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white transition-colors"
              >
                <ArrowLeft size={20} />
                <span>Volver</span>
              </button>
              <div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-black">
                  {editingProgram ? 'Editar Programa' : 'Nuevo Programa'}
                </h1>
                <p className="text-gray-600 dark:text-gray-400">
                  Completa el formulario para {editingProgram ? 'editar' : 'crear'} un programa
                </p>
              </div>
            </div>
          </div>

          {/* Form */}
          <div className="glass-effect rounded-xl shadow-lg border border-white/30 dark:border-gray-600/30 p-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Basic Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Título * <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData({...formData, title: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600/30 rounded-lg glass-effect dark:bg-gray-800 text-black dark:text-black focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Título del programa"
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
                      <option key={category} value={category}>
                        {category}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Tipo * <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={formData.type}
                    onChange={(e) => setFormData({...formData, type: e.target.value as any})}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600/30 rounded-lg glass-effect dark:bg-gray-800 text-black dark:text-black focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  >
                    {TYPES.map(type => (
                      <option key={type} value={type}>
                        {type}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Día * <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={formData.day}
                    onChange={(e) => setFormData({...formData, day: e.target.value as any})}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600/30 rounded-lg glass-effect dark:bg-gray-800 text-black dark:text-black focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  >
                    {DAYS.map(day => (
                      <option key={day} value={day as any}>
                        {day}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Hora de Inicio * <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="time"
                    value={formData.startTime}
                    onChange={(e) => setFormData({...formData, startTime: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600/30 rounded-lg glass-effect dark:bg-gray-800 text-black dark:text-black focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Hora de Fin * <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="time"
                    value={formData.endTime}
                    onChange={(e) => setFormData({...formData, endTime: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600/30 rounded-lg glass-effect dark:bg-gray-800 text-black dark:text-black focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>
              </div>

              {/* Content */}
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Descripción
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({...formData, description: e.target.value})}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600/30 rounded-lg glass-effect dark:bg-gray-800 text-black dark:text-black focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Descripción del programa"
                  />
                </div>
              </div>

              {/* Additional Settings */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Color del Programa
                  </label>
                  <input
                    type="color"
                    value={formData.color}
                    onChange={(e) => setFormData({...formData, color: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600/30 rounded-lg glass-effect dark:bg-gray-800 text-black dark:text-black focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div className="flex items-center">
                  <div className="w-8 h-8 rounded-lg mr-3" style={{ backgroundColor: formData.color }}></div>
                  <span className="text-sm text-gray-700 dark:text-gray-300">
                    Vista previa del color
                  </span>
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center justify-end space-x-4 pt-6 border-t border-gray-200 dark:border-gray-700">
                <button
                  type="button"
                  onClick={() => {
                    setShowForm(false);
                    setEditingProgram(null);
                  }}
                  className="px-4 py-2 text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {submitting ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                      <span>{editingProgram ? 'Actualizando...' : 'Creando...'}</span>
                    </>
                  ) : (
                    <>
                      <Save size={16} />
                      <span>{editingProgram ? 'Actualizar' : 'Crear'} Programa</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
