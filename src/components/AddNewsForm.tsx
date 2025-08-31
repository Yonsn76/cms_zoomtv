import React, { useState } from 'react';
import { 
  FileText, 
  Upload, 
  X, 
  Save, 
  ArrowLeft,
  Image as ImageIcon
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
import { newsApi, mediaApi } from '../services/zoomTvApi';

interface AddNewsFormProps {
  onNavigate: (section: string) => void;
  selectedCategory?: string;
}

interface NewsFormData {
  id: string;
  title: string;
  author: string;
  date: string;
  summary: string;
  content: string;
  imageUrl: string;
  category: 'actualidad' | 'deportes' | 'musica' | 'nacionales' | 'regionales';
  status: 'draft' | 'published';
  featured: boolean;
  tags: string[];
  seoTitle: string;
  seoDescription: string;
  seoKeywords: string[];
}

const CATEGORIES = [
  { id: 'actualidad', name: 'Actualidad', color: 'blue', icon: 'A' },
  { id: 'deportes', name: 'Deportes', color: 'green', icon: 'D' },
  { id: 'nacionales', name: 'Nacionales', color: 'red', icon: 'N' },
  { id: 'regionales', name: 'Regionales', color: 'orange', icon: 'R' },
  { id: 'musica', name: 'Música', color: 'purple', icon: 'M' }
];

export const AddNewsForm: React.FC<AddNewsFormProps> = ({ onNavigate, selectedCategory }) => {
  const { user } = useAuth();
  const { themeMode } = useTheme();
  const [formData, setFormData] = useState<NewsFormData>({
    id: '',
    title: '',
    author: user?.name || '',
    date: new Date().toISOString().split('T')[0],
    summary: '',
    content: '',
    imageUrl: '',
    category: (selectedCategory as 'actualidad' | 'deportes' | 'musica' | 'nacionales' | 'regionales') || 'actualidad',
    status: 'draft',
    featured: false,
    tags: [],
    seoTitle: '',
    seoDescription: '',
    seoKeywords: []
  });

  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [showCategorySelector, setShowCategorySelector] = useState(!selectedCategory);

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedImage(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      let finalImageUrl = formData.imageUrl;

      // Subir imagen si se seleccionó una
      if (selectedImage) {
        try {
          console.log('Iniciando subida de imagen:', selectedImage.name);
          const uploadResponse = await mediaApi.uploadImage(selectedImage);
          console.log('Respuesta de subida:', uploadResponse);
          
          if (uploadResponse.success && uploadResponse.data) {
            // Construir la URL completa para la imagen
            finalImageUrl = `https://apizoomtv-production.up.railway.app${uploadResponse.data.url}`;
            console.log('URL final de imagen:', finalImageUrl);
          } else {
            console.error('Respuesta de subida no exitosa:', uploadResponse);
            throw new Error(uploadResponse.message || 'Error en la respuesta de subida');
          }
        } catch (uploadError: any) {
          console.error('Error detallado al subir imagen:', uploadError);
          console.error('Error response:', uploadError.response?.data);
          console.error('Error status:', uploadError.response?.status);
          
          const errorMessage = uploadError.response?.data?.message || uploadError.message || 'Error desconocido';
          alert(`Error al subir la imagen: ${errorMessage}. La noticia se creará sin imagen.`);
        }
      }

      // Preparar datos de la noticia
      const newsData = {
        id: formData.id,
        title: formData.title,
        author: formData.author,
        date: formData.date,
        summary: formData.summary,
        content: formData.content,
        imageUrl: finalImageUrl,
        category: formData.category,
        status: formData.status,
        featured: formData.featured,
        tags: formData.tags,
        seoTitle: formData.seoTitle,
        seoDescription: formData.seoDescription,
        seoKeywords: formData.seoKeywords
      };

      // Crear la noticia usando la API real
      const response = await newsApi.create(newsData);
      
      if (response.success) {
        // Limpiar formulario
        setFormData({
          id: '',
          title: '',
          author: user?.name || '',
          date: new Date().toISOString().split('T')[0],
          summary: '',
          content: '',
          imageUrl: '',
          category: (selectedCategory as 'actualidad' | 'deportes' | 'musica' | 'nacionales' | 'regionales') || 'actualidad',
          status: 'draft',
          featured: false,
          tags: [],
          seoTitle: '',
          seoDescription: '',
          seoKeywords: []
        });
        setSelectedImage(null);
        setImagePreview('');
        
        alert('Noticia creada exitosamente');
        onNavigate('news');
      } else {
        throw new Error(response.message || 'Error al crear la noticia');
      }
    } catch (error: any) {
      console.error('Error creating news:', error);
      const errorMessage = error.response?.data?.message || error.message || 'Error al crear la noticia';
      alert(`Error: ${errorMessage}`);
    } finally {
      setLoading(false);
    }
  };

  const getCategoryColor = (categoryId: string) => {
    const category = CATEGORIES.find(c => c.id === categoryId);
    const colors = {
      blue: 'bg-blue-100 text-blue-800 border-blue-200 dark:bg-blue-900/20 dark:text-blue-300 dark:border-blue-800',
      green: 'bg-green-100 text-green-800 border-green-200 dark:bg-green-900/20 dark:text-green-300 dark:border-green-800',
      red: 'bg-red-100 text-red-800 border-red-200 dark:bg-red-900/20 dark:text-red-300 dark:border-red-800',
      orange: 'bg-orange-100 text-orange-800 border-orange-200 dark:bg-orange-900/20 dark:text-orange-300 dark:border-orange-800',
      purple: 'bg-purple-100 text-purple-800 border-purple-200 dark:bg-purple-900/20 dark:text-purple-300 dark:border-purple-800'
    };
    return colors[category?.color as keyof typeof colors] || colors.blue;
  };

  if (showCategorySelector) {
    return (
      <div className="space-y-6">
        <div className="flex items-center space-x-4 mb-6">
          <button
            onClick={() => onNavigate('overview')}
            className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white transition-colors"
          >
            <ArrowLeft size={20} />
            <span>Volver</span>
          </button>
        </div>

        <div className="text-center py-8">
          <FileText className="w-12 h-12 text-blue-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 dark:text-black mb-2">
            Agregar Nueva Noticia
          </h3>
          <p className="text-gray-500 dark:text-gray-400 mb-6">
            Selecciona una categoría para crear una nueva noticia
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-w-4xl mx-auto">
            {CATEGORIES.map((category) => (
              <button
                key={category.id}
                onClick={() => {
                  setFormData(prev => ({ ...prev, category: category.id as any }));
                  setShowCategorySelector(false);
                }}
                className={`p-6 rounded-xl border-2 transition-all duration-300 hover:scale-105 ${getCategoryColor(category.id)}`}
              >
                <div className="text-2xl font-bold mb-2">{category.icon}</div>
                <div className="font-medium">{category.name}</div>
              </button>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
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
              Agregar Noticia - {CATEGORIES.find(c => c.id === formData.category)?.name}
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Completa el formulario para crear una nueva noticia
            </p>
          </div>
        </div>
      </div>

      {/* Form */}
      <div className="glass-effect dark:bg-gray-800 rounded-xl shadow-lg border border-white/30 dark:border-gray-600/30 p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                Categoría
              </label>
              <div className={`p-3 rounded-lg border ${getCategoryColor(formData.category)}`}>
                {CATEGORIES.find(c => c.id === formData.category)?.name}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Estado
              </label>
              <select
                value={formData.status}
                onChange={(e) => setFormData({...formData, status: e.target.value as 'draft' | 'published'})}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600/30 rounded-lg glass-effect dark:bg-gray-800 text-black dark:text-black focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="draft">Borrador</option>
                <option value="published">Publicada</option>
              </select>
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
          </div>

          {/* Image Upload */}
          <div className="space-y-4">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Imagen de la Noticia
            </label>
            
            <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-6 text-center hover:border-blue-500 dark:hover:border-blue-400 transition-colors">
              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
                id="image-upload"
              />
              <label htmlFor="image-upload" className="cursor-pointer">
                <ImageIcon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600 dark:text-gray-400">
                  Haz clic para seleccionar una imagen o arrastra aquí
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-500 mt-1">
                  PNG, JPG, GIF hasta 5MB
                </p>
              </label>
            </div>

            {imagePreview && (
              <div className="relative">
                <img
                  src={imagePreview}
                  alt="Preview"
                  className="w-full max-w-md h-48 object-cover rounded-lg"
                />
                <button
                  type="button"
                  onClick={() => {
                    setSelectedImage(null);
                    setImagePreview('');
                  }}
                  className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors"
                >
                  <X size={16} />
                </button>
              </div>
            )}
          </div>

          {/* Additional Settings */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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

          {/* SEO Section */}
          <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
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
              onClick={() => onNavigate('overview')}
              className="px-4 py-2 text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  <span>Creando...</span>
                </>
              ) : (
                <>
                  <Save size={16} />
                  <span>Crear Noticia</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
