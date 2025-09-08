import { useState, useEffect } from 'react';
import { 
  Building2, 
  Users, 
  History, 
  Heart, 
  Edit, 
  Save, 
  X, 
  Phone,
  Mail,
  Globe,
  MapPin,
  Calendar,
  Target,
  Lightbulb,
  Plus,
  Trash2
} from 'lucide-react';
import { companyApi } from '../services/zoomTvApi';
import { CompanyInfoForm } from './forms/CompanyInfoForm';
import { TeamMemberForm } from './forms/TeamMemberForm';

interface CompanyInfo {
  _id: string;
  name: string;
  logo: string;
  slogan: string;
  description: string;
  foundedYear: number;
  headquarters: string;
  contactInfo: {
    email: string;
    phone: string;
    website: string;
    address: string;
  };
  socialMedia: {
    facebook: string;
    instagram: string;
    twitter: string;
    youtube: string;
    linkedin: string;
  };
  isActive: boolean;
}

interface TeamMember {
  _id: string;
  name: string;
  position: string;
  image: string;
  bio: string;
  department: string;
  email: string;
  phone: string;
  socialMedia: {
    linkedin: string;
    twitter: string;
    instagram: string;
  };
  order: number;
  isActive: boolean;
  startDate: string;
  skills: string[];
}

interface CompanyHistory {
  _id: string;
  title: string;
  content: string;
  image: string;
  milestones: Array<{
    year: number;
    title: string;
    description: string;
    image: string;
  }>;
  isActive: boolean;
}

interface CompanyValues {
  _id: string;
  mission: {
    title: string;
    content: string;
    image: string;
    commitments: string[];
  };
  vision: {
    title: string;
    content: string;
    image: string;
    aspirations: string[];
  };
  values: Array<{
    name: string;
    description: string;
    icon: string;
    order: number;
  }>;
  isActive: boolean;
}

const CompanyManagement = () => {
  const [activeTab, setActiveTab] = useState<'info' | 'team' | 'history' | 'values'>('info');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Estados de datos
  const [companyInfo, setCompanyInfo] = useState<CompanyInfo | null>(null);
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [companyHistory, setCompanyHistory] = useState<CompanyHistory | null>(null);
  const [companyValues, setCompanyValues] = useState<CompanyValues | null>(null);
  
  // Estados de formularios
  const [showForm, setShowForm] = useState(false);
  const [editingItem, setEditingItem] = useState<any>(null);
  const [formData, setFormData] = useState<any>({});

  // Cargar datos iniciales
  useEffect(() => {
    loadAllData();
  }, []);

  const loadAllData = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const [infoResponse, teamResponse, historyResponse, valuesResponse] = await Promise.all([
        companyApi.getInfo(),
        companyApi.getTeam(),
        companyApi.getHistory(),
        companyApi.getValues()
      ]);

      if (infoResponse.success) setCompanyInfo(infoResponse.data);
      if (teamResponse.success) setTeamMembers(teamResponse.data);
      if (historyResponse.success) setCompanyHistory(historyResponse.data);
      if (valuesResponse.success) setCompanyValues(valuesResponse.data);
      
    } catch (err: any) {
      console.error('Error loading company data:', err);
      setError('Error al cargar los datos de la empresa');
    } finally {
      setLoading(false);
    }
  };

  const handleFormChange = (field: string, value: any) => {
    setFormData((prev: any) => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSave = async () => {
    setLoading(true);
    setError(null);
    
    try {
      let response;
      
      switch (activeTab) {
        case 'info':
          response = await companyApi.updateInfo(formData);
          if (response.success) {
            setCompanyInfo(response.data);
            setShowForm(false);
          }
          break;
          
        case 'team':
          if (editingItem) {
            response = await companyApi.updateTeamMember(editingItem._id, formData);
          } else {
            response = await companyApi.createTeamMember(formData);
          }
          if (response.success) {
            await loadAllData();
            setShowForm(false);
            setEditingItem(null);
          }
          break;
          
        case 'history':
          response = await companyApi.updateHistory(formData);
          if (response.success) {
            setCompanyHistory(response.data);
            setShowForm(false);
          }
          break;
          
        case 'values':
          response = await companyApi.updateValues(formData);
          if (response.success) {
            setCompanyValues(response.data);
            setShowForm(false);
          }
          break;
      }
      
    } catch (err: any) {
      console.error('Error saving data:', err);
      setError('Error al guardar los datos');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (item: any) => {
    setEditingItem(item);
    setFormData(item);
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('¿Estás seguro de que quieres eliminar este miembro del equipo?')) return;
    
    setLoading(true);
    try {
      const response = await companyApi.deleteTeamMember(id);
      if (response.success) {
        await loadAllData();
      }
    } catch (err: any) {
      console.error('Error deleting team member:', err);
      setError('Error al eliminar el miembro del equipo');
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({});
    setEditingItem(null);
    setShowForm(false);
  };

  if (loading && !companyInfo) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
        <p className="text-red-600 dark:text-red-400">{error}</p>
        <button 
          onClick={loadAllData}
          className="mt-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
        >
          Reintentar
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-black">Gestión de Empresa</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Administra la información de Zoom TV Canal 10
          </p>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200 dark:border-gray-700">
        <nav className="-mb-px flex space-x-8">
          {[
            { id: 'info', label: 'Información General', icon: Building2 },
            { id: 'team', label: 'Equipo de Trabajo', icon: Users },
            { id: 'history', label: 'Historia', icon: History },
            { id: 'values', label: 'Valores', icon: Heart }
          ].map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setActiveTab(id as any)}
              className={`flex items-center space-x-2 py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === id
                  ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                  : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:border-gray-300'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{label}</span>
            </button>
          ))}
        </nav>
      </div>

      {/* Content */}
      {!showForm ? (
        <>
          {/* Información General */}
          {activeTab === 'info' && companyInfo && (
            <div className="glass-effect rounded-lg border border-white/30 dark:border-gray-600/30 p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-black">Información de la Empresa</h2>
                <button
                  onClick={() => handleEdit(companyInfo)}
                  className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <Edit className="w-4 h-4" />
                  <span>Editar</span>
                </button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <img src={companyInfo.logo} alt="Logo" className="w-32 h-32 object-cover rounded-lg mb-4" />
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-black">{companyInfo.name}</h3>
                  <p className="text-lg text-blue-600 dark:text-blue-400 font-medium">{companyInfo.slogan}</p>
                  <p className="text-gray-600 dark:text-gray-400 mt-2">{companyInfo.description}</p>
                </div>
                
                <div className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <Calendar className="w-5 h-5 text-gray-500" />
                    <span className="text-gray-900 dark:text-black">Fundado en {companyInfo.foundedYear}</span>
                  </div>
                  
                  <div className="flex items-center space-x-3">
                    <MapPin className="w-5 h-5 text-gray-500" />
                    <span className="text-gray-900 dark:text-black">{companyInfo.headquarters}</span>
                  </div>
                  
                  <div className="flex items-center space-x-3">
                    <Mail className="w-5 h-5 text-gray-500" />
                    <span className="text-gray-900 dark:text-black">{companyInfo.contactInfo.email}</span>
                  </div>
                  
                  <div className="flex items-center space-x-3">
                    <Phone className="w-5 h-5 text-gray-500" />
                    <span className="text-gray-900 dark:text-black">{companyInfo.contactInfo.phone}</span>
                  </div>
                  
                  <div className="flex items-center space-x-3">
                    <Globe className="w-5 h-5 text-gray-500" />
                    <span className="text-gray-900 dark:text-black">{companyInfo.contactInfo.website}</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Equipo de Trabajo */}
          {activeTab === 'team' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-black">Miembros del Equipo</h2>
                <button
                  onClick={() => {
                    setEditingItem(null);
                    setFormData({});
                    setShowForm(true);
                  }}
                  className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                >
                  <Plus className="w-4 h-4" />
                  <span>Agregar Miembro</span>
                </button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {teamMembers.map((member) => (
                  <div key={member._id} className="glass-effect rounded-lg border border-white/30 dark:border-gray-600/30 p-6">
                    <div className="flex items-start justify-between mb-4">
                      <img src={member.image} alt={member.name} className="w-16 h-16 rounded-full object-cover" />
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleEdit(member)}
                          className="p-2 text-gray-500 hover:text-blue-600 transition-colors"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(member._id)}
                          className="p-2 text-gray-500 hover:text-red-600 transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                    
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-black">{member.name}</h3>
                    <p className="text-blue-600 dark:text-blue-400 font-medium">{member.position}</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">{member.department}</p>
                    <p className="text-gray-600 dark:text-gray-400 mt-2 text-sm">{member.bio}</p>
                    
                    <div className="mt-4 flex flex-wrap gap-2">
                      {member.skills?.map((skill, index) => (
                        <span key={index} className="px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-200 text-xs rounded-full">
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Historia */}
          {activeTab === 'history' && companyHistory && (
            <div className="glass-effect rounded-lg border border-white/30 dark:border-gray-600/30 p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-black">Historia de la Empresa</h2>
                <button
                  onClick={() => handleEdit(companyHistory)}
                  className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <Edit className="w-4 h-4" />
                  <span>Editar</span>
                </button>
              </div>
              
              <div className="space-y-6">
                <div>
                  <img src={companyHistory.image} alt="Historia" className="w-full h-64 object-cover rounded-lg mb-4" />
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-black mb-4">{companyHistory.title}</h3>
                  <div className="prose dark:prose-invert max-w-none">
                    {companyHistory.content.split('\n').map((paragraph, index) => (
                      <p key={index} className="text-gray-600 dark:text-gray-400 mb-4">{paragraph}</p>
                    ))}
                  </div>
                </div>
                
                <div>
                  <h4 className="text-lg font-semibold text-gray-900 dark:text-black mb-4">Hitos Importantes</h4>
                  <div className="space-y-4">
                    {companyHistory.milestones.map((milestone, index) => (
                      <div key={index} className="flex items-start space-x-4 p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
                        <div className="flex-shrink-0">
                          <div className="w-12 h-12 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold">
                            {milestone.year}
                          </div>
                        </div>
                        <div>
                          <h5 className="font-semibold text-gray-900 dark:text-black">{milestone.title}</h5>
                          <p className="text-gray-600 dark:text-gray-400">{milestone.description}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Valores */}
          {activeTab === 'values' && companyValues && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-black">Valores Corporativos</h2>
                <button
                  onClick={() => handleEdit(companyValues)}
                  className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <Edit className="w-4 h-4" />
                  <span>Editar</span>
                </button>
              </div>
              
              {/* Misión */}
              <div className="glass-effect rounded-lg border border-white/30 dark:border-gray-600/30 p-6">
                <div className="flex items-center space-x-3 mb-4">
                  <Target className="w-6 h-6 text-blue-600" />
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-black">{companyValues.mission.title}</h3>
                </div>
                <img src={companyValues.mission.image} alt="Misión" className="w-full h-48 object-cover rounded-lg mb-4" />
                <p className="text-gray-600 dark:text-gray-400 mb-4">{companyValues.mission.content}</p>
                <div>
                  <h4 className="font-semibold text-gray-900 dark:text-black mb-2">Nuestros Compromisos:</h4>
                  <ul className="list-disc list-inside space-y-1">
                    {companyValues.mission.commitments.map((commitment, index) => (
                      <li key={index} className="text-gray-600 dark:text-gray-400">{commitment}</li>
                    ))}
                  </ul>
                </div>
              </div>
              
              {/* Visión */}
              <div className="glass-effect rounded-lg border border-white/30 dark:border-gray-600/30 p-6">
                <div className="flex items-center space-x-3 mb-4">
                  <Lightbulb className="w-6 h-6 text-yellow-600" />
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-black">{companyValues.vision.title}</h3>
                </div>
                <img src={companyValues.vision.image} alt="Visión" className="w-full h-48 object-cover rounded-lg mb-4" />
                <p className="text-gray-600 dark:text-gray-400 mb-4">{companyValues.vision.content}</p>
                <div>
                  <h4 className="font-semibold text-gray-900 dark:text-black mb-2">Nuestras Aspiraciones:</h4>
                  <ul className="list-disc list-inside space-y-1">
                    {companyValues.vision.aspirations.map((aspiration, index) => (
                      <li key={index} className="text-gray-600 dark:text-gray-400">{aspiration}</li>
                    ))}
                  </ul>
                </div>
              </div>
              
              {/* Valores */}
              <div className="glass-effect rounded-lg border border-white/30 dark:border-gray-600/30 p-6">
                <div className="flex items-center space-x-3 mb-6">
                  <Heart className="w-6 h-6 text-red-600" />
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-black">Nuestros Valores</h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {companyValues.values.map((value, index) => (
                    <div key={index} className="flex items-start space-x-4 p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
                      <img src={value.icon} alt={value.name} className="w-12 h-12 rounded-lg object-cover" />
                      <div>
                        <h4 className="font-semibold text-gray-900 dark:text-black">{value.name}</h4>
                        <p className="text-gray-600 dark:text-gray-400 text-sm">{value.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </>
      ) : (
        /* Formulario */
        <div className="glass-effect rounded-lg border border-white/30 dark:border-gray-600/30 p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-black">
              {editingItem ? 'Editar' : 'Agregar'} {activeTab === 'info' ? 'Información' : activeTab === 'team' ? 'Miembro del Equipo' : activeTab === 'history' ? 'Historia' : 'Valores'}
            </h2>
            <button
              onClick={resetForm}
              className="p-2 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          
          {/* Formularios específicos para cada sección */}
          {activeTab === 'info' && (
            <CompanyInfoForm 
              formData={formData} 
              onFormChange={handleFormChange} 
              loading={loading} 
            />
          )}
          
          {activeTab === 'team' && (
            <TeamMemberForm 
              formData={formData} 
              onFormChange={handleFormChange} 
              loading={loading} 
            />
          )}
          
          {(activeTab === 'history' || activeTab === 'values') && (
            <div className="space-y-4">
              <p className="text-gray-600 dark:text-gray-400">
                Los formularios para {activeTab === 'history' ? 'Historia' : 'Valores'} se implementarán próximamente.
              </p>
            </div>
          )}
          
          <div className="flex justify-end space-x-4 mt-6">
            <button
              onClick={resetForm}
              className="px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
            >
              Cancelar
            </button>
            <button
              onClick={handleSave}
              disabled={loading}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors flex items-center space-x-2"
            >
              {loading && <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>}
              <Save className="w-4 h-4" />
              <span>Guardar</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CompanyManagement;
