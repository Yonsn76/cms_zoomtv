import React, { useState, useEffect } from 'react';
import { 
  Plus, 
  Edit, 
  Trash2, 
  Eye, 
  EyeOff, 
  Search, 
  Filter,
  MoreVertical,
  Calendar,
  Tag,
  Phone,
  Mail,
  Globe,
  MapPin,
  X,
  Save,
  Upload,
  Facebook,
  Instagram,
  Twitter
} from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';
import { useAuth } from '../contexts/AuthContext';
import { anunciantesApi } from '../services/zoomTvApi';

interface Anunciante {
  _id: string;
  name: string;
  imageUrl: string;
  description: string;
  isFlyer: boolean;
  enableZoom: boolean;
  status: 'active' | 'inactive' | 'pending';
  priority: number;
  category: string;
  contactInfo?: {
    email?: string;
    phone?: string;
    website?: string;
    address?: string;
  };
  socialMedia?: {
    facebook?: string;
    instagram?: string;
    twitter?: string;
  };
  createdAt: string;
  updatedAt: string;
}

interface AnunciantesManagementProps {
  onNavigate: (section: string) => void;
}

export const AnunciantesManagement: React.FC<AnunciantesManagementProps> = ({ onNavigate }) => {
  const [anunciantes, setAnunciantes] = useState<Anunciante[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingAnunciante, setEditingAnunciante] = useState<Anunciante | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    imageUrl: '',
    description: '',
    isFlyer: false,
    enableZoom: true,
    status: 'active' as 'active' | 'inactive' | 'pending',
    priority: 0,
    category: '',
    contactInfo: {
      email: '',
      phone: '',
      website: '',
      address: ''
    },
    socialMedia: {
      facebook: '',
      instagram: '',
      twitter: ''
    }
  });
  const [saving, setSaving] = useState(false);
  const { themeMode } = useTheme();
  const { user } = useAuth();

  // Cargar anunciantes
  const loadAnunciantes = async () => {
    try {
      setLoading(true);
      const response = await anunciantesApi.getAll();
      
      if (response.success) {
        setAnunciantes(response.data || []);
      } else {
        console.error('Error cargando anunciantes');
      }
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAnunciantes();
  }, []);

  // Filtrar anunciantes
  const filteredAnunciantes = anunciantes.filter(anunciante => {
    const matchesSearch = anunciante.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         anunciante.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || anunciante.status === statusFilter;
    const matchesCategory = categoryFilter === 'all' || anunciante.category === categoryFilter;
    
    return matchesSearch && matchesStatus && matchesCategory;
  });

  // Cambiar estado del anunciante
  const toggleStatus = async (anunciante: Anunciante) => {
    try {
      const newStatus = anunciante.status === 'active' ? 'inactive' : 'active';
      const response = await anunciantesApi.updateStatus(anunciante._id, newStatus);

      if (response.success) {
        setAnunciantes(prev => prev.map(a => 
          a._id === anunciante._id ? { ...a, status: newStatus } : a
        ));
      }
    } catch (error) {
      console.error('Error cambiando estado:', error);
    }
  };

  // Eliminar anunciante
  const deleteAnunciante = async (id: string) => {
    if (!confirm('¿Estás seguro de que quieres eliminar este anunciante?')) return;

    try {
      const response = await anunciantesApi.delete(id);

      if (response.success) {
        setAnunciantes(prev => prev.filter(a => a._id !== id));
      }
    } catch (error) {
      console.error('Error eliminando anunciante:', error);
    }
  };

  // Abrir formulario para editar
  const openEditForm = (anunciante: Anunciante) => {
    setFormData({
      name: anunciante.name,
      imageUrl: anunciante.imageUrl,
      description: anunciante.description,
      isFlyer: anunciante.isFlyer,
      enableZoom: anunciante.enableZoom,
      status: anunciante.status,
      priority: anunciante.priority,
      category: anunciante.category,
      contactInfo: {
        email: anunciante.contactInfo?.email || '',
        phone: anunciante.contactInfo?.phone || '',
        website: anunciante.contactInfo?.website || '',
        address: anunciante.contactInfo?.address || ''
      },
      socialMedia: {
        facebook: anunciante.socialMedia?.facebook || '',
        instagram: anunciante.socialMedia?.instagram || '',
        twitter: anunciante.socialMedia?.twitter || ''
      }
    });
    setEditingAnunciante(anunciante);
  };

  // Abrir formulario para agregar
  const openAddForm = () => {
    setFormData({
      name: '',
      imageUrl: '',
      description: '',
      isFlyer: false,
      enableZoom: true,
      status: 'active',
      priority: 0,
      category: '',
      contactInfo: {
        email: '',
        phone: '',
        website: '',
        address: ''
      },
      socialMedia: {
        facebook: '',
        instagram: '',
        twitter: ''
      }
    });
    setShowAddForm(true);
  };

  // Cerrar formulario
  const closeForm = () => {
    setShowAddForm(false);
    setEditingAnunciante(null);
    setFormData({
      name: '',
      imageUrl: '',
      description: '',
      isFlyer: false,
      enableZoom: true,
      status: 'active',
      priority: 0,
      category: '',
      contactInfo: {
        email: '',
        phone: '',
        website: '',
        address: ''
      },
      socialMedia: {
        facebook: '',
        instagram: '',
        twitter: ''
      }
    });
  };

  // Guardar anunciante
  const saveAnunciante = async () => {
    // Validación de campos obligatorios
    if (!formData.name || !formData.imageUrl || !formData.description || !formData.category) {
      alert('Por favor completa todos los campos obligatorios:\n- Nombre del Anunciante\n- URL de la Imagen\n- Descripción\n- Categoría');
      return;
    }

    // Validación de URLs
    try {
      new URL(formData.imageUrl);
    } catch {
      alert('Por favor ingresa una URL válida para la imagen');
      return;
    }

    try {
      setSaving(true);
      
      // Limpiar datos antes de enviar (remover campos vacíos)
      const cleanData: any = {
        name: formData.name.trim(),
        imageUrl: formData.imageUrl.trim(),
        description: formData.description.trim(),
        category: formData.category.trim(),
        isFlyer: formData.isFlyer,
        enableZoom: formData.enableZoom,
        status: formData.status,
        priority: formData.priority,
        contactInfo: {},
        socialMedia: {}
      };

      // Solo agregar campos de contacto que no estén vacíos
      if (formData.contactInfo.email.trim()) cleanData.contactInfo.email = formData.contactInfo.email.trim();
      if (formData.contactInfo.phone.trim()) cleanData.contactInfo.phone = formData.contactInfo.phone.trim();
      if (formData.contactInfo.website.trim()) {
        try {
          new URL(formData.contactInfo.website.trim());
          cleanData.contactInfo.website = formData.contactInfo.website.trim();
        } catch {
          alert('Por favor ingresa una URL válida para el sitio web');
          return;
        }
      }
      if (formData.contactInfo.address.trim()) cleanData.contactInfo.address = formData.contactInfo.address.trim();

      // Solo agregar campos de redes sociales que no estén vacíos
      if (formData.socialMedia.facebook.trim()) {
        try {
          new URL(formData.socialMedia.facebook.trim());
          cleanData.socialMedia.facebook = formData.socialMedia.facebook.trim();
        } catch {
          alert('Por favor ingresa una URL válida para Facebook');
          return;
        }
      }
      if (formData.socialMedia.instagram.trim()) {
        try {
          new URL(formData.socialMedia.instagram.trim());
          cleanData.socialMedia.instagram = formData.socialMedia.instagram.trim();
        } catch {
          alert('Por favor ingresa una URL válida para Instagram');
          return;
        }
      }
      if (formData.socialMedia.twitter.trim()) {
        try {
          new URL(formData.socialMedia.twitter.trim());
          cleanData.socialMedia.twitter = formData.socialMedia.twitter.trim();
        } catch {
          alert('Por favor ingresa una URL válida para Twitter');
          return;
        }
      }

      let response;
      if (editingAnunciante) {
        response = await anunciantesApi.update(editingAnunciante._id, cleanData);
      } else {
        response = await anunciantesApi.create(cleanData);
      }

      if (response.success) {
        const savedAnunciante = response.data;
        
        if (editingAnunciante) {
          setAnunciantes(prev => prev.map(a => 
            a._id === editingAnunciante._id ? savedAnunciante : a
          ));
        } else {
          setAnunciantes(prev => [savedAnunciante, ...prev]);
        }
        
        closeForm();
        alert(editingAnunciante ? 'Anunciante actualizado exitosamente' : 'Anunciante creado exitosamente');
      } else {
        alert(`Error: ${response.message || 'No se pudo guardar el anunciante'}`);
      }
    } catch (error: any) {
      console.error('Error guardando anunciante:', error);
      let errorMessage = 'Error al guardar el anunciante';
      
      if (error.response?.data?.errors) {
        // Mostrar errores de validación específicos
        const validationErrors = error.response.data.errors.map((err: any) => err.msg).join('\n');
        errorMessage = `Errores de validación:\n${validationErrors}`;
      } else if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      }
      
      alert(errorMessage);
    } finally {
      setSaving(false);
    }
  };

  // Manejar cambios en el formulario
  const handleFormChange = (field: string, value: any) => {
    if (field.includes('.')) {
      const [parent, child] = field.split('.');
      setFormData(prev => ({
        ...prev,
        [parent]: {
          ...(prev[parent as keyof typeof prev] as any),
          [child]: value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [field]: value
      }));
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-500';
      case 'inactive': return 'bg-red-500';
      case 'pending': return 'bg-yellow-500';
      default: return 'bg-gray-500';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'active': return 'Activo';
      case 'inactive': return 'Inactivo';
      case 'pending': return 'Pendiente';
      default: return status;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {!showAddForm && !editingAnunciante ? (
        <>
          {/* Header */}
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div>
                        <h1 className="text-3xl font-bold text-gray-900 dark:text-black">
            Gestión de Anunciantes
          </h1>
          <p className="text-gray-900 dark:text-black mt-2">
            Administra los anunciantes de Zoom TV
          </p>
            </div>
            
            <button
              onClick={openAddForm}
              className="flex items-center space-x-2 px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors shadow-lg"
            >
              <Plus size={20} />
              <span>Agregar Anunciante</span>
            </button>
          </div>

          {/* Filtros */}
          <div className="glass-effect p-6 rounded-2xl">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Búsqueda */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-900 dark:text-black" size={20} />
                <input
                  type="text"
                  placeholder="Buscar anunciantes..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-white/50 dark:bg-black/20 border border-white/30 dark:border-gray-600/30 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Filtro por estado */}
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-4 py-3 bg-white/50 dark:bg-black/20 border border-white/30 dark:border-gray-600/30 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">Todos los estados</option>
                <option value="active">Activo</option>
                <option value="inactive">Inactivo</option>
                <option value="pending">Pendiente</option>
              </select>

              {/* Filtro por categoría */}
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="px-4 py-3 bg-white/50 dark:bg-black/20 border border-white/30 dark:border-gray-600/30 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">Todas las categorías</option>
                <option value="restaurante">Restaurante</option>
                <option value="farmacia">Farmacia</option>
                <option value="automotriz">Automotriz</option>
                <option value="salud">Salud</option>
                <option value="promocion">Promoción</option>
                <option value="educacion">Educación</option>
                <option value="deportes">Deportes</option>
                <option value="turismo">Turismo</option>
                <option value="cafe">Café</option>
              </select>
            </div>
          </div>

          {/* Lista de anunciantes */}
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {filteredAnunciantes.map((anunciante) => (
              <div key={anunciante._id} className="glass-effect rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300">
                {/* Imagen */}
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={anunciante.imageUrl}
                    alt={anunciante.name}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.currentTarget.src = 'https://via.placeholder.com/400x300?text=Imagen+no+disponible';
                    }}
                  />
                  <div className="absolute top-4 right-4 flex space-x-2">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium text-white ${getStatusColor(anunciante.status)}`}>
                      {getStatusText(anunciante.status)}
                    </span>
                    {anunciante.isFlyer && (
                      <span className="px-3 py-1 rounded-full text-xs font-medium text-white bg-orange-500">
                        Flyer
                      </span>
                    )}
                  </div>
                </div>

                {/* Contenido */}
                <div className="p-6">
                  <div className="flex items-start justify-between mb-4">
                                    <h3 className="text-xl font-bold text-gray-900 dark:text-black">
                  {anunciante.name}
                </h3>
                    <div className="flex space-x-2">
                      <button
                        onClick={() => toggleStatus(anunciante)}
                        className="p-2 rounded-lg hover:bg-white/20 dark:hover:bg-black/20 transition-colors"
                      >
                        {anunciante.status === 'active' ? (
                          <EyeOff size={16} className="text-gray-900 dark:text-black" />
                        ) : (
                          <Eye size={16} className="text-gray-900 dark:text-black" />
                        )}
                      </button>
                      <button
                        onClick={() => openEditForm(anunciante)}
                        className="p-2 rounded-lg hover:bg-white/20 dark:hover:bg-black/20 transition-colors"
                      >
                        <Edit size={16} className="text-blue-600" />
                      </button>
                      <button
                        onClick={() => deleteAnunciante(anunciante._id)}
                        className="p-2 rounded-lg hover:bg-white/20 dark:hover:bg-black/20 transition-colors"
                      >
                        <Trash2 size={16} className="text-red-600" />
                      </button>
                    </div>
                  </div>

                  <p className="text-gray-900 dark:text-black mb-4 line-clamp-3">
                    {anunciante.description}
                  </p>

                  {/* Información adicional */}
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2 text-sm text-gray-900 dark:text-black">
                      <Tag size={14} />
                      <span>{anunciante.category}</span>
                    </div>
                    
                    <div className="flex items-center space-x-2 text-sm text-gray-900 dark:text-black">
                      <Calendar size={14} />
                      <span>Prioridad: {anunciante.priority}</span>
                    </div>

                    {/* Información de contacto */}
                    {anunciante.contactInfo && (
                      <div className="space-y-1">
                        {anunciante.contactInfo.phone && (
                          <div className="flex items-center space-x-2 text-sm text-gray-900 dark:text-black">
                            <Phone size={14} />
                            <span>{anunciante.contactInfo.phone}</span>
                          </div>
                        )}
                        {anunciante.contactInfo.email && (
                          <div className="flex items-center space-x-2 text-sm text-gray-900 dark:text-black">
                            <Mail size={14} />
                            <span>{anunciante.contactInfo.email}</span>
                          </div>
                        )}
                        {anunciante.contactInfo.website && (
                          <div className="flex items-center space-x-2 text-sm text-gray-900 dark:text-black">
                            <Globe size={14} />
                            <span className="truncate">{anunciante.contactInfo.website}</span>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Mensaje cuando no hay anunciantes */}
          {filteredAnunciantes.length === 0 && (
            <div className="text-center py-12">
                        <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center">
            <Tag size={24} className="text-gray-900 dark:text-black" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 dark:text-black mb-2">
            No se encontraron anunciantes
          </h3>
          <p className="text-gray-900 dark:text-black">
                {searchTerm || statusFilter !== 'all' || categoryFilter !== 'all' 
                  ? 'Intenta ajustar los filtros de búsqueda'
                  : 'Comienza agregando tu primer anunciante'
                }
              </p>
            </div>
          )}
        </>
      ) : (
        <>
          {/* Form Header */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-black">
                {editingAnunciante ? 'Editar Anunciante' : 'Nuevo Anunciante'}
              </h1>
              <p className="text-gray-900 dark:text-black">
                {editingAnunciante ? 'Modifica los datos del anunciante' : 'Completa el formulario para crear un nuevo anunciante'}
              </p>
            </div>
            <button
              onClick={closeForm}
              className="flex items-center space-x-2 text-gray-900 dark:text-black hover:text-gray-700 dark:hover:text-gray-300 transition-colors"
            >
              <X size={20} />
              <span>Volver</span>
            </button>
          </div>

                    {/* Form */}
          <div className="glass-effect dark:bg-gray-800 rounded-xl shadow-lg border border-white/30 dark:border-gray-600/30 p-6">
            <form onSubmit={(e) => { e.preventDefault(); saveAnunciante(); }} className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Columna izquierda */}
              <div className="space-y-4">
                {/* Información básica */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-black border-b border-gray-200 dark:border-gray-700 pb-2">
                    Información Básica
                  </h3>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-900 dark:text-black mb-2">
                      Nombre del Anunciante *
                    </label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => handleFormChange('name', e.target.value)}
                      className="w-full px-4 py-3 bg-white/50 dark:bg-black/20 border border-white/30 dark:border-gray-600/30 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Ej: Restaurante El Buen Sabor"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-900 dark:text-black mb-2">
                      URL de la Imagen *
                    </label>
                    <div className="relative">
                      <input
                        type="url"
                        value={formData.imageUrl}
                        onChange={(e) => handleFormChange('imageUrl', e.target.value)}
                        className="w-full px-4 py-3 bg-white/50 dark:bg-black/20 border border-white/30 dark:border-gray-600/30 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="https://ejemplo.com/imagen.jpg"
                      />
                      <Upload className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-900 dark:text-black" size={20} />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-900 dark:text-black mb-2">
                      Descripción *
                    </label>
                    <textarea
                      value={formData.description}
                      onChange={(e) => handleFormChange('description', e.target.value)}
                      rows={3}
                      className="w-full px-4 py-3 bg-white/50 dark:bg-black/20 border border-white/30 dark:border-gray-600/30 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Describe el negocio o servicio..."
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-900 dark:text-black mb-2">
                      Categoría *
                    </label>
                    <select
                      value={formData.category}
                      onChange={(e) => handleFormChange('category', e.target.value)}
                      className="w-full px-4 py-3 bg-white/50 dark:bg-black/20 border border-white/30 dark:border-gray-600/30 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">Selecciona una categoría</option>
                      <option value="restaurante">Restaurante</option>
                      <option value="farmacia">Farmacia</option>
                      <option value="automotriz">Automotriz</option>
                      <option value="salud">Salud</option>
                      <option value="promocion">Promoción</option>
                      <option value="educacion">Educación</option>
                      <option value="deportes">Deportes</option>
                      <option value="turismo">Turismo</option>
                      <option value="cafe">Café</option>
                    </select>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-900 dark:text-black mb-2">
                        Prioridad
                      </label>
                      <input
                        type="number"
                        value={formData.priority}
                        onChange={(e) => handleFormChange('priority', parseInt(e.target.value) || 0)}
                        min="0"
                        className="w-full px-4 py-3 bg-white/50 dark:bg-black/20 border border-white/30 dark:border-gray-600/30 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-900 dark:text-black mb-2">
                        Estado
                      </label>
                      <select
                        value={formData.status}
                        onChange={(e) => handleFormChange('status', e.target.value)}
                        className="w-full px-4 py-3 bg-white/50 dark:bg-black/20 border border-white/30 dark:border-gray-600/30 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="active">Activo</option>
                        <option value="inactive">Inactivo</option>
                        <option value="pending">Pendiente</option>
                      </select>
                    </div>
                  </div>

                  <div className="flex items-center space-x-4">
                    <label className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={formData.isFlyer}
                        onChange={(e) => handleFormChange('isFlyer', e.target.checked)}
                        className="w-4 h-4 text-blue-600 bg-white/50 dark:bg-black/20 border border-white/30 dark:border-gray-600/30 rounded focus:ring-2 focus:ring-blue-500"
                      />
                      <span className="text-sm text-gray-900 dark:text-black">Es un Flyer</span>
                    </label>
                    <label className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={formData.enableZoom}
                        onChange={(e) => handleFormChange('enableZoom', e.target.checked)}
                        className="w-4 h-4 text-blue-600 bg-white/50 dark:bg-black/20 border border-white/30 dark:border-gray-600/30 rounded focus:ring-2 focus:ring-blue-500"
                      />
                      <span className="text-sm text-gray-900 dark:text-black">Habilitar Zoom</span>
                    </label>
                  </div>
                </div>
              </div>

              {/* Columna derecha */}
              <div className="space-y-4">
                {/* Información de contacto */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-black border-b border-gray-200 dark:border-gray-700 pb-2">
                    Información de Contacto
                  </h3>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-900 dark:text-black mb-2">
                      <Phone size={16} className="inline mr-2" />
                      Teléfono
                    </label>
                    <input
                      type="tel"
                      value={formData.contactInfo.phone}
                      onChange={(e) => handleFormChange('contactInfo.phone', e.target.value)}
                      className="w-full px-4 py-3 bg-white/50 dark:bg-black/20 border border-white/30 dark:border-gray-600/30 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="+51 999 999 999"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-900 dark:text-black mb-2">
                      <Mail size={16} className="inline mr-2" />
                      Email
                    </label>
                    <input
                      type="email"
                      value={formData.contactInfo.email}
                      onChange={(e) => handleFormChange('contactInfo.email', e.target.value)}
                      className="w-full px-4 py-3 bg-white/50 dark:bg-black/20 border border-white/30 dark:border-gray-600/30 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="contacto@ejemplo.com"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-900 dark:text-black mb-2">
                      <Globe size={16} className="inline mr-2" />
                      Sitio Web
                    </label>
                    <input
                      type="url"
                      value={formData.contactInfo.website}
                      onChange={(e) => handleFormChange('contactInfo.website', e.target.value)}
                      className="w-full px-4 py-3 bg-white/50 dark:bg-black/20 border border-white/30 dark:border-gray-600/30 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="https://www.ejemplo.com"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-900 dark:text-black mb-2">
                      <MapPin size={16} className="inline mr-2" />
                      Dirección
                    </label>
                    <input
                      type="text"
                      value={formData.contactInfo.address}
                      onChange={(e) => handleFormChange('contactInfo.address', e.target.value)}
                      className="w-full px-4 py-3 bg-white/50 dark:bg-black/20 border border-white/30 dark:border-gray-600/30 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Av. Principal 123, Huánuco"
                    />
                  </div>
                </div>

                {/* Redes sociales */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-black border-b border-gray-200 dark:border-gray-700 pb-2">
                    Redes Sociales
                  </h3>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-900 dark:text-black mb-2">
                      <Facebook size={16} className="inline mr-2" />
                      Facebook
                    </label>
                    <input
                      type="url"
                      value={formData.socialMedia.facebook}
                      onChange={(e) => handleFormChange('socialMedia.facebook', e.target.value)}
                      className="w-full px-4 py-3 bg-white/50 dark:bg-black/20 border border-white/30 dark:border-gray-600/30 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="https://facebook.com/pagina"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-900 dark:text-black mb-2">
                      <Instagram size={16} className="inline mr-2" />
                      Instagram
                    </label>
                    <input
                      type="url"
                      value={formData.socialMedia.instagram}
                      onChange={(e) => handleFormChange('socialMedia.instagram', e.target.value)}
                      className="w-full px-4 py-3 bg-white/50 dark:bg-black/20 border border-white/30 dark:border-gray-600/30 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="https://instagram.com/usuario"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-900 dark:text-black mb-2">
                      <Twitter size={16} className="inline mr-2" />
                      Twitter
                    </label>
                    <input
                      type="url"
                      value={formData.socialMedia.twitter}
                      onChange={(e) => handleFormChange('socialMedia.twitter', e.target.value)}
                      className="w-full px-4 py-3 bg-white/50 dark:bg-black/20 border border-white/30 dark:border-gray-600/30 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="https://twitter.com/usuario"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Botones de acción */}
            <div className="flex justify-end space-x-4 mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
              <button
                onClick={closeForm}
                disabled={saving}
                className="px-6 py-3 bg-gray-500 text-white rounded-xl hover:bg-gray-600 transition-colors disabled:opacity-50"
              >
                Cancelar
              </button>
              <button
                onClick={saveAnunciante}
                disabled={saving}
                className="flex items-center space-x-2 px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors disabled:opacity-50"
              >
                {saving ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Guardando...</span>
                  </>
                ) : (
                  <>
                    <Save size={16} />
                    <span>Guardar Anunciante</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
        </>
      )}
    </div>
  );
};
