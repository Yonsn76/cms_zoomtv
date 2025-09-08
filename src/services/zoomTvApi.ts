import axios from 'axios';

// Configuración de la API
const API_BASE_URL = 'https://apizoomtv-production.up.railway.app/api';

// Crear instancia de axios con configuración base
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor para agregar token de autenticación
apiClient.interceptors.request.use(
  (config) => {
    // Rutas que NO requieren token (públicas)
    const publicRoutes = ['/auth/login', '/auth/register', '/auth/verify'];
    const isPublicRoute = publicRoutes.some(route => config.url?.includes(route));
    
    if (isPublicRoute) {
      console.log('Interceptor - Ruta pública, no se requiere token:', config.url);
      return config;
    }
    
    const token = localStorage.getItem('zoomTvToken');
    console.log('Interceptor - Token encontrado:', token ? 'Sí' : 'No');
    console.log('Interceptor - URL:', config.url);
    
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
      console.log('Interceptor - Token agregado a headers');
    } else {
      console.warn('Interceptor - No se encontró token de autenticación para ruta protegida');
    }
    return config;
  },
  (error) => {
    console.error('Interceptor - Error en request:', error);
    return Promise.reject(error);
  }
);

// Interceptor para manejar errores de respuesta
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expirado o inválido
      localStorage.removeItem('zoomTvToken');
      localStorage.removeItem('zoomTvUser');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Tipos de respuesta de la API
interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  errors?: any[];
  pagination?: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

// Tipos para noticias
export interface News {
  _id: string;
  id: string;
  title: string;
  author: string;
  date: string;
  summary: string;
  content: string;
  imageUrl?: string;
  category: 'actualidad' | 'deportes' | 'musica' | 'nacionales' | 'regionales';
  status: 'published' | 'draft' | 'archived';
  featured: boolean;
  tags: string[];
  seoTitle?: string;
  seoDescription?: string;
  seoKeywords?: string[];
  views: number;
  createdAt: string;
  updatedAt: string;
  publishedAt?: string;
}

export interface NewsFormData {
  id: string;
  title: string;
  author: string;
  date: string;
  summary: string;
  content: string;
  imageUrl?: string;
  category: 'actualidad' | 'deportes' | 'musica' | 'nacionales' | 'regionales';
  status: 'published' | 'draft' | 'archived';
  featured: boolean;
  tags: string[];
  seoTitle?: string;
  seoDescription?: string;
  seoKeywords?: string[];
}

export interface NewsFilters {
  page?: number;
  limit?: number;
  category?: string;
  status?: string;
  search?: string;
}

// API para noticias
export const newsApi = {
  // Obtener todas las noticias
  getAll: async (filters?: NewsFilters): Promise<ApiResponse<News[]>> => {
    try {
      const params = new URLSearchParams();
      if (filters?.page) params.append('page', filters.page.toString());
      if (filters?.limit) params.append('limit', filters.limit.toString());
      if (filters?.category) params.append('category', filters.category);
      if (filters?.status) params.append('status', filters.status);
      if (filters?.search) params.append('search', filters.search);

      const response = await apiClient.get(`/noticias?${params.toString()}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching news:', error);
      throw error;
    }
  },

  // Obtener noticia por ID
  getById: async (id: string): Promise<ApiResponse<News>> => {
    try {
      const response = await apiClient.get(`/noticias/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching news by ID:', error);
      throw error;
    }
  },

  // Crear nueva noticia
  create: async (newsData: NewsFormData): Promise<ApiResponse<News>> => {
    try {
      const response = await apiClient.post('/noticias', newsData);
      return response.data;
    } catch (error) {
      console.error('Error creating news:', error);
      throw error;
    }
  },

  // Actualizar noticia
  update: async (id: string, newsData: Partial<NewsFormData>): Promise<ApiResponse<News>> => {
    try {
      const response = await apiClient.put(`/noticias/${id}`, newsData);
      return response.data;
    } catch (error) {
      console.error('Error updating news:', error);
      throw error;
    }
  },

  // Eliminar noticia
  delete: async (id: string): Promise<ApiResponse<void>> => {
    try {
      const response = await apiClient.delete(`/noticias/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error deleting news:', error);
      throw error;
    }
  },

  // Publicar noticia
  publish: async (id: string): Promise<ApiResponse<News>> => {
    try {
      const response = await apiClient.put(`/noticias/${id}/publish`);
      return response.data;
    } catch (error) {
      console.error('Error publishing news:', error);
      throw error;
    }
  },

  // Archivar noticia
  archive: async (id: string): Promise<ApiResponse<News>> => {
    try {
      const response = await apiClient.put(`/noticias/${id}/archive`);
      return response.data;
    } catch (error) {
      console.error('Error archiving news:', error);
      throw error;
    }
  },

  // Obtener noticias destacadas
  getFeatured: async (limit: number = 5): Promise<ApiResponse<News[]>> => {
    try {
      const response = await apiClient.get(`/noticias/featured/featured?limit=${limit}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching featured news:', error);
      throw error;
    }
  },

  // Buscar noticias
  search: async (query: string, limit: number = 10): Promise<ApiResponse<News[]>> => {
    try {
      const response = await apiClient.get(`/noticias/search/search?q=${encodeURIComponent(query)}&limit=${limit}`);
      return response.data;
    } catch (error) {
      console.error('Error searching news:', error);
      throw error;
    }
  },

  // Obtener noticias por categoría
  getByCategory: async (category: string, limit: number = 10): Promise<ApiResponse<News[]>> => {
    try {
      const response = await apiClient.get(`/noticias/category/${category}?limit=${limit}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching news by category:', error);
      throw error;
    }
  }
};

// API para autenticación
export interface LoginCredentials {
  email: string;
  password: string;
}

export interface AuthResponse {
  success: boolean;
  token?: string;
  user?: {
    id: string;
    username: string;
    email: string;
    fullName: string;
    role: string;
    permissions: string[];
    profile?: {
      firstName?: string;
      lastName?: string;
      bio?: string;
    };
  };
  message?: string;
}

export const authApi = {
  // Login
  login: async (credentials: LoginCredentials): Promise<AuthResponse> => {
    try {
      const response = await apiClient.post('/auth/login', credentials);
      return response.data;
    } catch (error) {
      console.error('Error logging in:', error);
      throw error;
    }
  },

  // Logout
  logout: async (): Promise<ApiResponse<void>> => {
    try {
      const response = await apiClient.post('/auth/logout');
      return response.data;
    } catch (error) {
      console.error('Error logging out:', error);
      throw error;
    }
  },

  // Verificar token
  verifyToken: async (): Promise<ApiResponse<any>> => {
    try {
      const response = await apiClient.get('/auth/verify');
      return response.data;
    } catch (error) {
      console.error('Error verifying token:', error);
      throw error;
    }
  }
};

// API para subida de archivos
export const mediaApi = {
  // Subir imagen
  uploadImage: async (file: File): Promise<ApiResponse<{
    _id: string;
    filename: string;
    originalName: string;
    url: string;
    size: number;
    mimeType: string;
    alt: string;
    caption: string;
    uploadedBy: string;
    isActive: boolean;
    createdAt: string;
    updatedAt: string;
  }>> => {
    try {
      console.log('Iniciando subida de imagen en API:', file.name);
      console.log('Token disponible:', localStorage.getItem('zoomTvToken'));
      
      const formData = new FormData();
      formData.append('file', file);

      const response = await apiClient.post('/media/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      
      console.log('Respuesta exitosa de API:', response.data);
      return response.data;
    } catch (error: any) {
      console.error('Error detallado en API de subida:', error);
      console.error('Error response:', error.response?.data);
      console.error('Error status:', error.response?.status);
      throw error;
    }
  }
};

// API para estadísticas del dashboard
export interface DashboardStats {
  totalNews: number;
  publishedNews: number;
  draftNews: number;
  totalViews: number;
  recentNews: News[];
  categoryStats: Array<{
    category: string;
    count: number;
    views: number;
  }>;
}

export const dashboardApi = {
  // Obtener estadísticas del dashboard
  getStats: async (): Promise<ApiResponse<DashboardStats>> => {
    try {
      const response = await apiClient.get('/dashboard/stats');
      return response.data;
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
      throw error;
    }
  }
};

// Programming types
export interface ProgrammingItem {
  _id: string;
  title: string;
  description?: string;
  day: 'LUNES' | 'MARTES' | 'MIÉRCOLES' | 'JUEVES' | 'VIERNES' | 'SÁBADO' | 'DOMINGO';
  startTime: string;
  endTime: string;
  category: 'Noticias' | 'Música' | 'Cine' | 'Series' | 'Anime' | 'Entretenimiento' | 'Deportes' | 'Documentales' | 'Otros';
  type: 'Programa en vivo' | 'Película' | 'Serie' | 'Música' | 'Anime' | 'Documental' | 'Otros';
  isActive: boolean;
  imageUrl?: string;
  color?: string;
  priority: number;
  notes?: string;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
  duration?: number;
  timeSlot?: string;
}

export interface ProgrammingFormData {
  title: string;
  description?: string;
  day: 'LUNES' | 'MARTES' | 'MIÉRCOLES' | 'JUEVES' | 'VIERNES' | 'SÁBADO' | 'DOMINGO';
  startTime: string;
  endTime: string;
  category: 'Noticias' | 'Música' | 'Cine' | 'Series' | 'Anime' | 'Entretenimiento' | 'Deportes' | 'Documentales' | 'Otros';
  type: 'Programa en vivo' | 'Película' | 'Serie' | 'Música' | 'Anime' | 'Documental' | 'Otros';
  color?: string;
}

export interface ProgrammingFilters {
  day?: string;
  category?: string;
  type?: string;
  isActive?: boolean;
  search?: string;
}

export interface WeeklySchedule {
  'LUNES': ProgrammingItem[];
  'MARTES': ProgrammingItem[];
  'MIÉRCOLES': ProgrammingItem[];
  'JUEVES': ProgrammingItem[];
  'VIERNES': ProgrammingItem[];
  'SÁBADO': ProgrammingItem[];
  'DOMINGO': ProgrammingItem[];
}

// API para programación
export const programmingApi = {
  // Obtener toda la programación
  getAll: async (filters?: ProgrammingFilters): Promise<ApiResponse<ProgrammingItem[]>> => {
    try {
      const params = new URLSearchParams();
      if (filters?.day) params.append('day', filters.day);
      if (filters?.category) params.append('category', filters.category);
      if (filters?.type) params.append('type', filters.type);
      if (filters?.isActive !== undefined) params.append('isActive', filters.isActive.toString());
      if (filters?.search) params.append('search', filters.search);

      const response = await apiClient.get(`/programacion?${params.toString()}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching programming:', error);
      throw error;
    }
  },

  // Obtener programación semanal
  getWeekly: async (): Promise<ApiResponse<WeeklySchedule>> => {
    try {
      const response = await apiClient.get('/programacion/weekly');
      return response.data;
    } catch (error) {
      console.error('Error fetching weekly programming:', error);
      throw error;
    }
  },

  // Obtener programa por ID
  getById: async (id: string): Promise<ApiResponse<ProgrammingItem>> => {
    try {
      const response = await apiClient.get(`/programacion/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching programming by ID:', error);
      throw error;
    }
  },

  // Crear nuevo programa
  create: async (programData: ProgrammingFormData): Promise<ApiResponse<ProgrammingItem>> => {
    try {
      const response = await apiClient.post('/programacion', programData);
      return response.data;
    } catch (error) {
      console.error('Error creating programming:', error);
      throw error;
    }
  },

  // Actualizar programa
  update: async (id: string, programData: Partial<ProgrammingFormData>): Promise<ApiResponse<ProgrammingItem>> => {
    try {
      const response = await apiClient.put(`/programacion/${id}`, programData);
      return response.data;
    } catch (error) {
      console.error('Error updating programming:', error);
      throw error;
    }
  },

  // Eliminar programa
  delete: async (id: string): Promise<ApiResponse<void>> => {
    try {
      const response = await apiClient.delete(`/programacion/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error deleting programming:', error);
      throw error;
    }
  },

  // Activar/desactivar programa
  toggleActive: async (id: string): Promise<ApiResponse<ProgrammingItem>> => {
    try {
      const response = await apiClient.patch(`/programacion/${id}/toggle`);
      return response.data;
    } catch (error) {
      console.error('Error toggling programming:', error);
      throw error;
    }
  },

  // Obtener programas por día
  getByDay: async (day: string): Promise<ApiResponse<ProgrammingItem[]>> => {
    try {
      const response = await apiClient.get(`/programacion/day/${day}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching programming by day:', error);
      throw error;
    }
  }
};

// API para anunciantes
export const anunciantesApi = {
  // Obtener todos los anunciantes
  getAll: async (filters?: any): Promise<ApiResponse<any[]>> => {
    try {
      const params = new URLSearchParams();
      if (filters?.status) params.append('status', filters.status);
      if (filters?.category) params.append('category', filters.category);
      if (filters?.limit) params.append('limit', filters.limit.toString());
      if (filters?.search) params.append('search', filters.search);

      const response = await apiClient.get(`/anunciantes?${params.toString()}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching anunciantes:', error);
      throw error;
    }
  },

  // Obtener anunciante por ID
  getById: async (id: string): Promise<ApiResponse<any>> => {
    try {
      const response = await apiClient.get(`/anunciantes/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching anunciante by ID:', error);
      throw error;
    }
  },

  // Crear nuevo anunciante
  create: async (anuncianteData: any): Promise<ApiResponse<any>> => {
    try {
      const response = await apiClient.post('/anunciantes', anuncianteData);
      return response.data;
    } catch (error) {
      console.error('Error creating anunciante:', error);
      throw error;
    }
  },

  // Actualizar anunciante
  update: async (id: string, anuncianteData: any): Promise<ApiResponse<any>> => {
    try {
      const response = await apiClient.put(`/anunciantes/${id}`, anuncianteData);
      return response.data;
    } catch (error) {
      console.error('Error updating anunciante:', error);
      throw error;
    }
  },

  // Eliminar anunciante
  delete: async (id: string): Promise<ApiResponse<void>> => {
    try {
      const response = await apiClient.delete(`/anunciantes/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error deleting anunciante:', error);
      throw error;
    }
  },

  // Actualizar estado del anunciante
  updateStatus: async (id: string, status: string): Promise<ApiResponse<any>> => {
    try {
      const response = await apiClient.put(`/anunciantes/${id}/status`, { status });
      return response.data;
    } catch (error) {
      console.error('Error updating anunciante status:', error);
      throw error;
    }
  },

  // Reordenar anunciantes
  reorder: async (anunciantes: any[]): Promise<ApiResponse<any[]>> => {
    try {
      const response = await apiClient.put('/anunciantes/reorder', { anunciantes });
      return response.data;
    } catch (error) {
      console.error('Error reordering anunciantes:', error);
      throw error;
    }
  }
};

// API para información de la empresa
export const companyApi = {
  // Información de la empresa
  getInfo: async () => {
    try {
      const response = await apiClient.get('/company/info');
      return response.data;
    } catch (error) {
      console.error('Error fetching company info:', error);
      throw error;
    }
  },

  updateInfo: async (data: any) => {
    try {
      const response = await apiClient.put('/company/info', data);
      return response.data;
    } catch (error) {
      console.error('Error updating company info:', error);
      throw error;
    }
  },

  // Miembros del equipo
  getTeam: async () => {
    try {
      const response = await apiClient.get('/company/team');
      return response.data;
    } catch (error) {
      console.error('Error fetching team members:', error);
      throw error;
    }
  },

  getTeamMember: async (id: string) => {
    try {
      const response = await apiClient.get(`/company/team/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching team member:', error);
      throw error;
    }
  },

  createTeamMember: async (data: any) => {
    try {
      const response = await apiClient.post('/company/team', data);
      return response.data;
    } catch (error) {
      console.error('Error creating team member:', error);
      throw error;
    }
  },

  updateTeamMember: async (id: string, data: any) => {
    try {
      const response = await apiClient.put(`/company/team/${id}`, data);
      return response.data;
    } catch (error) {
      console.error('Error updating team member:', error);
      throw error;
    }
  },

  deleteTeamMember: async (id: string) => {
    try {
      const response = await apiClient.delete(`/company/team/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error deleting team member:', error);
      throw error;
    }
  },

  // Historia de la empresa
  getHistory: async () => {
    try {
      const response = await apiClient.get('/company/history');
      return response.data;
    } catch (error) {
      console.error('Error fetching company history:', error);
      throw error;
    }
  },

  updateHistory: async (data: any) => {
    try {
      const response = await apiClient.put('/company/history', data);
      return response.data;
    } catch (error) {
      console.error('Error updating company history:', error);
      throw error;
    }
  },

  // Valores de la empresa
  getValues: async () => {
    try {
      const response = await apiClient.get('/company/values');
      return response.data;
    } catch (error) {
      console.error('Error fetching company values:', error);
      throw error;
    }
  },

  updateValues: async (data: any) => {
    try {
      const response = await apiClient.put('/company/values', data);
      return response.data;
    } catch (error) {
      console.error('Error updating company values:', error);
      throw error;
    }
  }
};

// Tipos para transmisiones (actualizados según el modelo del backend)
export interface Transmision {
  _id?: string;  // Opcional para compatibilidad
  id: string;    // Campo principal que devuelve el backend
  nombre: string;
  url: string;
  isActive: boolean;
  isLive: boolean;
  createdBy: {
    _id: string;
    name: string;
    email: string;
  } | null;  // Puede ser null según los logs
  createdAt: string;
  updatedAt: string;
}

export interface TransmisionFormData {
  nombre: string;
  url: string;
}

export interface TransmisionFilters {
  category?: string;
  isLive?: boolean;
  isActive?: boolean;
  page?: number;
  limit?: number;
}

// API para transmisiones
export const transmisionesApi = {
  // Obtener todas las transmisiones
  getAll: async (filters?: TransmisionFilters, abortSignal?: AbortSignal): Promise<ApiResponse<Transmision[]>> => {
    try {
      const params = new URLSearchParams();
      if (filters?.category) params.append('category', filters.category);
      if (filters?.isLive !== undefined) params.append('isLive', filters.isLive.toString());
      if (filters?.isActive !== undefined) params.append('isActive', filters.isActive.toString());
      if (filters?.page) params.append('page', filters.page.toString());
      if (filters?.limit) params.append('limit', filters.limit.toString());

      const response = await apiClient.get(`/transmisiones?${params.toString()}`, {
        signal: abortSignal
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching transmisiones:', error);
      throw error;
    }
  },

  // Obtener transmisión en vivo activa
  getLive: async (abortSignal?: AbortSignal): Promise<ApiResponse<Transmision | null>> => {
    try {
      const response = await apiClient.get('/transmisiones/live', {
        signal: abortSignal
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching live transmision:', error);
      throw error;
    }
  },

  // Obtener transmisión por ID
  getById: async (id: string, abortSignal?: AbortSignal): Promise<ApiResponse<Transmision>> => {
    try {
      const response = await apiClient.get(`/transmisiones/${id}`, {
        signal: abortSignal
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching transmision by ID:', error);
      throw error;
    }
  },

  // Crear nueva transmisión
  create: async (transmisionData: TransmisionFormData, abortSignal?: AbortSignal): Promise<ApiResponse<Transmision>> => {
    try {
      const response = await apiClient.post('/transmisiones', transmisionData, {
        signal: abortSignal
      });
      return response.data;
    } catch (error) {
      console.error('Error creating transmision:', error);
      throw error;
    }
  },

  // Actualizar transmisión
  update: async (id: string, transmisionData: Partial<TransmisionFormData>, abortSignal?: AbortSignal): Promise<ApiResponse<Transmision>> => {
    try {
      const response = await apiClient.put(`/transmisiones/${id}`, transmisionData, {
        signal: abortSignal
      });
      return response.data;
    } catch (error) {
      console.error('Error updating transmision:', error);
      throw error;
    }
  },


  // Eliminar transmisión
  delete: async (id: string): Promise<ApiResponse<void>> => {
    try {
      const response = await apiClient.delete(`/transmisiones/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error deleting transmision:', error);
      throw error;
    }
  },

  // Lanzar transmisión en vivo
  launchLive: async (id: string): Promise<ApiResponse<Transmision>> => {
    try {
      const response = await apiClient.put(`/transmisiones/${id}/live`);
      return response.data;
    } catch (error) {
      console.error('Error launching live transmision:', error);
      throw error;
    }
  },

  // Detener transmisión en vivo
  stopLive: async (id: string): Promise<ApiResponse<Transmision>> => {
    try {
      const response = await apiClient.put(`/transmisiones/${id}/stop`);
      return response.data;
    } catch (error) {
      console.error('Error stopping live transmision:', error);
      throw error;
    }
  }
};

export default apiClient;
