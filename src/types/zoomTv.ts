// Base types
export interface BaseEntity {
  _id: string;
  createdAt: string;
  updatedAt: string;
}

// News types
export interface News extends BaseEntity {
  id: string;
  title: string;
  author: string;
  date: string;
  summary: string;
  content: string;
  imageUrl?: string;
  category: NewsCategory;
  status: NewsStatus;
  featured: boolean;
  tags: string[];
  views: number;
  seoTitle?: string;
  seoDescription?: string;
  seoKeywords?: string[];
  publishedAt?: string;
}

export type NewsCategory = 'actualidad' | 'deportes' | 'musica' | 'nacionales' | 'regionales';
export type NewsStatus = 'published' | 'draft' | 'archived';

// Category types
export interface Category extends BaseEntity {
  name: string;
  slug: string;
  description?: string;
  color?: string;
  icon?: string;
  isActive: boolean;
  newsCount?: number;
}

// Author types
export interface Author extends BaseEntity {
  name: string;
  email: string;
  bio?: string;
  avatar?: string;
  socialMedia?: {
    twitter?: string;
    facebook?: string;
    instagram?: string;
    linkedin?: string;
  };
  isActive: boolean;
  newsCount?: number;
}

// User types
export interface User extends BaseEntity {
  name: string;
  email: string;
  role: UserRole;
  isActive: boolean;
  lastLogin?: string;
  avatar?: string;
  permissions?: string[];
}

export type UserRole = 'admin' | 'editor' | 'author' | 'viewer';

// Media types
export interface Media extends BaseEntity {
  filename: string;
  originalName: string;
  mimeType: string;
  size: number;
  url: string;
  thumbnailUrl?: string;
  alt?: string;
  caption?: string;
  tags?: string[];
  isPublic: boolean;
  uploadedBy: string;
}

// API Response types
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  errors?: any[];
}

export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

// Dashboard Stats types
export interface DashboardStats {
  totalNews: number;
  publishedNews: number;
  draftNews: number;
  totalViews: number;
  totalUsers: number;
  totalAuthors: number;
  totalCategories: number;
  recentNews: News[];
  topViewedNews: News[];
  categoryStats: CategoryStat[];
  authorStats: AuthorStat[];
}

export interface CategoryStat {
  category: string;
  count: number;
  views: number;
}

export interface AuthorStat {
  author: string;
  count: number;
  views: number;
}

// Form types
export interface NewsFormData {
  title: string;
  author: string;
  date: string;
  summary: string;
  content: string;
  imageUrl?: string;
  category: NewsCategory;
  status: NewsStatus;
  featured: boolean;
  tags: string[];
  seoTitle?: string;
  seoDescription?: string;
  seoKeywords?: string[];
}

export interface CategoryFormData {
  name: string;
  slug: string;
  description?: string;
  color?: string;
  icon?: string;
  isActive: boolean;
}

export interface AuthorFormData {
  name: string;
  email: string;
  bio?: string;
  avatar?: string;
  socialMedia?: {
    twitter?: string;
    facebook?: string;
    instagram?: string;
    linkedin?: string;
  };
  isActive: boolean;
}

export interface UserFormData {
  name: string;
  email: string;
  password?: string;
  role: UserRole;
  isActive: boolean;
  avatar?: string;
}

// Filter types
export interface NewsFilters {
  page?: number;
  limit?: number;
  category?: NewsCategory;
  status?: NewsStatus;
  search?: string;
  author?: string;
  featured?: boolean;
  dateFrom?: string;
  dateTo?: string;
}

export interface UserFilters {
  page?: number;
  limit?: number;
  role?: UserRole;
  search?: string;
  isActive?: boolean;
}

export interface MediaFilters {
  page?: number;
  limit?: number;
  type?: string;
  search?: string;
  isPublic?: boolean;
  uploadedBy?: string;
}

// Auth types
export interface LoginCredentials {
  email: string;
  password: string;
}

export interface AuthResponse {
  success: boolean;
  data: {
    user: User;
    token: string;
  };
  message?: string;
}

export interface ProfileUpdateData {
  name?: string;
  email?: string;
  avatar?: string;
}

export interface PasswordChangeData {
  currentPassword: string;
  newPassword: string;
}

// Notification types
export interface Notification {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  title: string;
  message: string;
  duration?: number;
  action?: {
    label: string;
    onClick: () => void;
  };
}

// Chart data types
export interface ChartData {
  labels: string[];
  datasets: {
    label: string;
    data: number[];
    backgroundColor?: string | string[];
    borderColor?: string | string[];
    borderWidth?: number;
  }[];
}

export interface ViewsChartData {
  daily: ChartData;
  weekly: ChartData;
  monthly: ChartData;
}

export interface CategoryChartData {
  distribution: ChartData;
  views: ChartData;
}

export interface AuthorChartData {
  articles: ChartData;
  views: ChartData;
}

// Programming types
export interface ProgrammingItem extends BaseEntity {
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
  duration?: number; // Virtual field
  timeSlot?: string; // Virtual field
}

export interface ProgrammingFormData {
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
