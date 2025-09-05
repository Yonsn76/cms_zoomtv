import React from 'react';
import { Upload, User, Mail, Phone, Linkedin, Twitter, Instagram, Plus, X } from 'lucide-react';

interface TeamMemberFormProps {
  formData: any;
  onFormChange: (field: string, value: any) => void;
  loading: boolean;
}

export const TeamMemberForm: React.FC<TeamMemberFormProps> = ({ formData, onFormChange, loading }) => {
  const addSkill = () => {
    const currentSkills = formData.skills || [];
    onFormChange('skills', [...currentSkills, '']);
  };

  const removeSkill = (index: number) => {
    const currentSkills = formData.skills || [];
    onFormChange('skills', currentSkills.filter((_: any, i: number) => i !== index));
  };

  const updateSkill = (index: number, value: string) => {
    const currentSkills = formData.skills || [];
    const newSkills = [...currentSkills];
    newSkills[index] = value;
    onFormChange('skills', newSkills);
  };

  return (
    <div className="space-y-6">
      {/* Información Personal */}
      <div className="glass-effect rounded-lg border border-white/30 dark:border-gray-600/30 p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-black mb-4 flex items-center space-x-2">
          <User className="w-5 h-5" />
          <span>Información Personal</span>
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Nombre Completo
            </label>
            <input
              type="text"
              value={formData.name || ''}
              onChange={(e) => onFormChange('name', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-800 dark:text-white"
              placeholder="María González"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Puesto
            </label>
            <input
              type="text"
              value={formData.position || ''}
              onChange={(e) => onFormChange('position', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-800 dark:text-white"
              placeholder="Directora General"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Departamento
            </label>
            <select
              value={formData.department || ''}
              onChange={(e) => onFormChange('department', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-800 dark:text-white"
            >
              <option value="">Seleccionar departamento</option>
              <option value="Dirección">Dirección</option>
              <option value="Producción">Producción</option>
              <option value="Redacción">Redacción</option>
              <option value="Técnica">Técnica</option>
              <option value="Marketing">Marketing</option>
              <option value="Administración">Administración</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Fecha de Inicio
            </label>
            <input
              type="date"
              value={formData.startDate ? new Date(formData.startDate).toISOString().split('T')[0] : ''}
              onChange={(e) => onFormChange('startDate', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-800 dark:text-white"
            />
          </div>
        </div>
        
        <div className="mt-6">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Biografía
          </label>
          <textarea
            value={formData.bio || ''}
            onChange={(e) => onFormChange('bio', e.target.value)}
            rows={4}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-800 dark:text-white"
            placeholder="Con más de 20 años de experiencia en medios de comunicación..."
          />
        </div>
        
        <div className="mt-6">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Foto del Miembro
          </label>
          <div className="flex items-center space-x-4">
            <input
              type="url"
              value={formData.image || ''}
              onChange={(e) => onFormChange('image', e.target.value)}
              className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-800 dark:text-white"
              placeholder="https://ejemplo.com/foto.jpg"
            />
            <button
              type="button"
              className="px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors flex items-center space-x-2"
            >
              <Upload className="w-4 h-4" />
              <span>Subir</span>
            </button>
          </div>
          {formData.image && (
            <div className="mt-2">
              <img src={formData.image} alt="Foto preview" className="w-20 h-20 object-cover rounded-full border" />
            </div>
          )}
        </div>
      </div>

      {/* Información de Contacto */}
      <div className="glass-effect rounded-lg border border-white/30 dark:border-gray-600/30 p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-black mb-4 flex items-center space-x-2">
          <Mail className="w-5 h-5" />
          <span>Información de Contacto</span>
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Email
            </label>
            <input
              type="email"
              value={formData.email || ''}
              onChange={(e) => onFormChange('email', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-800 dark:text-white"
              placeholder="maria.gonzalez@zoomtvcanal10.com"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Teléfono
            </label>
            <input
              type="tel"
              value={formData.phone || ''}
              onChange={(e) => onFormChange('phone', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-800 dark:text-white"
              placeholder="+1 234 567 891"
            />
          </div>
        </div>
      </div>

      {/* Redes Sociales */}
      <div className="glass-effect rounded-lg border border-white/30 dark:border-gray-600/30 p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-black mb-4 flex items-center space-x-2">
          <Linkedin className="w-5 h-5" />
          <span>Redes Sociales</span>
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 flex items-center space-x-2">
              <Linkedin className="w-4 h-4 text-blue-700" />
              <span>LinkedIn</span>
            </label>
            <input
              type="url"
              value={formData.socialMedia?.linkedin || ''}
              onChange={(e) => onFormChange('socialMedia', { ...formData.socialMedia, linkedin: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-800 dark:text-white"
              placeholder="https://linkedin.com/in/maria-gonzalez"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 flex items-center space-x-2">
              <Twitter className="w-4 h-4 text-blue-400" />
              <span>Twitter</span>
            </label>
            <input
              type="url"
              value={formData.socialMedia?.twitter || ''}
              onChange={(e) => onFormChange('socialMedia', { ...formData.socialMedia, twitter: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-800 dark:text-white"
              placeholder="https://twitter.com/maria_gonzalez"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 flex items-center space-x-2">
              <Instagram className="w-4 h-4 text-pink-600" />
              <span>Instagram</span>
            </label>
            <input
              type="url"
              value={formData.socialMedia?.instagram || ''}
              onChange={(e) => onFormChange('socialMedia', { ...formData.socialMedia, instagram: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-800 dark:text-white"
              placeholder="https://instagram.com/maria_gonzalez"
            />
          </div>
        </div>
      </div>

      {/* Habilidades */}
      <div className="glass-effect rounded-lg border border-white/30 dark:border-gray-600/30 p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-black mb-4">Habilidades</h3>
        
        <div className="space-y-3">
          {(formData.skills || []).map((skill: string, index: number) => (
            <div key={index} className="flex items-center space-x-2">
              <input
                type="text"
                value={skill}
                onChange={(e) => updateSkill(index, e.target.value)}
                className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-800 dark:text-white"
                placeholder="Ej: Liderazgo, Periodismo, Gestión"
              />
              <button
                type="button"
                onClick={() => removeSkill(index)}
                className="p-2 text-red-600 hover:text-red-800 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          ))}
          
          <button
            type="button"
            onClick={addSkill}
            className="flex items-center space-x-2 px-4 py-2 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-lg hover:bg-blue-200 dark:hover:bg-blue-900/50 transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>Agregar Habilidad</span>
          </button>
        </div>
      </div>

      {/* Configuración */}
      <div className="glass-effect rounded-lg border border-white/30 dark:border-gray-600/30 p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-black mb-4">Configuración</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Orden de Visualización
            </label>
            <input
              type="number"
              value={formData.order || 0}
              onChange={(e) => onFormChange('order', parseInt(e.target.value))}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-800 dark:text-white"
              placeholder="0"
              min="0"
            />
          </div>
          
          <div className="flex items-center">
            <input
              type="checkbox"
              id="isActive"
              checked={formData.isActive !== false}
              onChange={(e) => onFormChange('isActive', e.target.checked)}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <label htmlFor="isActive" className="ml-2 block text-sm text-gray-700 dark:text-gray-300">
              Miembro activo
            </label>
          </div>
        </div>
      </div>
    </div>
  );
};
