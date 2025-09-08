import React from 'react';
import { Upload, Building2, Mail, Facebook, Instagram, Twitter, Youtube, Linkedin } from 'lucide-react';

interface CompanyInfoFormProps {
  formData: any;
  onFormChange: (field: string, value: any) => void;
  loading: boolean;
}

export const CompanyInfoForm: React.FC<CompanyInfoFormProps> = ({ formData, onFormChange }) => {
  return (
    <div className="space-y-6">
      {/* Información Básica */}
      <div className="glass-effect rounded-lg border border-white/30 dark:border-gray-600/30 p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-black mb-4 flex items-center space-x-2">
          <Building2 className="w-5 h-5" />
          <span>Información Básica</span>
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Nombre de la Empresa
            </label>
            <input
              type="text"
              value={formData.name || ''}
              onChange={(e) => onFormChange('name', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-800 dark:text-white"
              placeholder="Zoom TV Canal 10"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Slogan
            </label>
            <input
              type="text"
              value={formData.slogan || ''}
              onChange={(e) => onFormChange('slogan', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-800 dark:text-white"
              placeholder="Información veraz, entretenimiento de calidad"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Año de Fundación
            </label>
            <input
              type="number"
              value={formData.foundedYear || ''}
              onChange={(e) => onFormChange('foundedYear', parseInt(e.target.value))}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-800 dark:text-white"
              placeholder="2005"
              min="1900"
              max={new Date().getFullYear()}
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Sede Principal
            </label>
            <input
              type="text"
              value={formData.headquarters || ''}
              onChange={(e) => onFormChange('headquarters', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-800 dark:text-white"
              placeholder="Calle Principal 123, Ciudad Central"
            />
          </div>
        </div>
        
        <div className="mt-6">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Descripción
          </label>
          <textarea
            value={formData.description || ''}
            onChange={(e) => onFormChange('description', e.target.value)}
            rows={4}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-800 dark:text-white"
            placeholder="Descripción de la empresa..."
          />
        </div>
        
        <div className="mt-6">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Logo de la Empresa
          </label>
          <div className="flex items-center space-x-4">
            <input
              type="url"
              value={formData.logo || ''}
              onChange={(e) => onFormChange('logo', e.target.value)}
              className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-800 dark:text-white"
              placeholder="https://ejemplo.com/logo.png"
            />
            <button
              type="button"
              className="px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors flex items-center space-x-2"
            >
              <Upload className="w-4 h-4" />
              <span>Subir</span>
            </button>
          </div>
          {formData.logo && (
            <div className="mt-2">
              <img src={formData.logo} alt="Logo preview" className="w-20 h-20 object-cover rounded-lg border" />
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
              value={formData.contactInfo?.email || ''}
              onChange={(e) => onFormChange('contactInfo', { ...formData.contactInfo, email: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-800 dark:text-white"
              placeholder="contacto@zoomtvcanal10.com"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Teléfono
            </label>
            <input
              type="tel"
              value={formData.contactInfo?.phone || ''}
              onChange={(e) => onFormChange('contactInfo', { ...formData.contactInfo, phone: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-800 dark:text-white"
              placeholder="+1 234 567 890"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Sitio Web
            </label>
            <input
              type="url"
              value={formData.contactInfo?.website || ''}
              onChange={(e) => onFormChange('contactInfo', { ...formData.contactInfo, website: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-800 dark:text-white"
              placeholder="https://zoomtvcanal10.com"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Dirección
            </label>
            <input
              type="text"
              value={formData.contactInfo?.address || ''}
              onChange={(e) => onFormChange('contactInfo', { ...formData.contactInfo, address: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-800 dark:text-white"
              placeholder="Calle Principal 123, Ciudad Central, CP 12345"
            />
          </div>
        </div>
      </div>

      {/* Redes Sociales */}
      <div className="glass-effect rounded-lg border border-white/30 dark:border-gray-600/30 p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-black mb-4 flex items-center space-x-2">
          <Facebook className="w-5 h-5" />
          <span>Redes Sociales</span>
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 flex items-center space-x-2">
              <Facebook className="w-4 h-4 text-blue-600" />
              <span>Facebook</span>
            </label>
            <input
              type="url"
              value={formData.socialMedia?.facebook || ''}
              onChange={(e) => onFormChange('socialMedia', { ...formData.socialMedia, facebook: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-800 dark:text-white"
              placeholder="https://facebook.com/zoomtvcanal10"
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
              placeholder="https://instagram.com/zoomtvcanal10"
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
              placeholder="https://twitter.com/zoomtvcanal10"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 flex items-center space-x-2">
              <Youtube className="w-4 h-4 text-red-600" />
              <span>YouTube</span>
            </label>
            <input
              type="url"
              value={formData.socialMedia?.youtube || ''}
              onChange={(e) => onFormChange('socialMedia', { ...formData.socialMedia, youtube: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-800 dark:text-white"
              placeholder="https://youtube.com/zoomtvcanal10"
            />
          </div>
          
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
              placeholder="https://linkedin.com/company/zoomtvcanal10"
            />
          </div>
        </div>
      </div>
    </div>
  );
};
