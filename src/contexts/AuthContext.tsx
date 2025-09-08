import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { authApi } from '../services/zoomTvApi';
import type { User, LoginCredentials, UserRole } from '../types/zoomTv';

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
}

type AuthAction =
  | { type: 'LOGIN_START' }
  | { type: 'LOGIN_SUCCESS'; payload: User }
  | { type: 'LOGIN_ERROR' }
  | { type: 'LOGOUT' }
  | { type: 'UPDATE_PROFILE'; payload: User }
  | { type: 'CLEAR_ERROR' };

const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
  loading: false,
  error: null,
};

const authReducer = (state: AuthState, action: AuthAction): AuthState => {
  switch (action.type) {
    case 'LOGIN_START':
      return {
        ...state,
        loading: true,
        error: null,
      };
    case 'LOGIN_SUCCESS':
      return {
        ...state,
        user: action.payload,
        isAuthenticated: true,
        loading: false,
        error: null,
      };
    case 'LOGIN_ERROR':
      return {
        ...state,
        user: null,
        isAuthenticated: false,
        loading: false,
        error: 'Error de autenticación',
      };
    case 'LOGOUT':
      return {
        ...state,
        user: null,
        isAuthenticated: false,
        loading: false,
        error: null,
      };
    case 'UPDATE_PROFILE':
      return {
        ...state,
        user: action.payload,
      };
    case 'CLEAR_ERROR':
      return {
        ...state,
        error: null,
      };
    default:
      return state;
  }
};

interface AuthContextType extends AuthState {
  login: (credentials: LoginCredentials) => Promise<void>;
  logout: () => Promise<void>;
  updateProfile: (data: Partial<User>) => Promise<void>;
  changePassword: (data: { currentPassword: string; newPassword: string }) => Promise<void>;
  clearError: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  // Check for existing token on mount
  useEffect(() => {
    const token = localStorage.getItem('zoomTvToken');
    const userData = localStorage.getItem('zoomTvUser');
    
    if (token && userData) {
      try {
        const user = JSON.parse(userData);
        dispatch({ type: 'LOGIN_SUCCESS', payload: user });
      } catch (error) {
        localStorage.removeItem('zoomTvToken');
        localStorage.removeItem('zoomTvUser');
      }
    }
  }, []);

  const login = async (credentials: LoginCredentials): Promise<void> => {
    dispatch({ type: 'LOGIN_START' });
    try {
      const response = await authApi.login(credentials);
      
      if (response.success && response.token && response.user) {
        const apiUser = response.user;
        const mappedUser: User = {
          _id: apiUser.id,
          name: apiUser.fullName || apiUser.username,
          email: apiUser.email,
          role: apiUser.role as UserRole,
          isActive: true,
          avatar: '',
          permissions: apiUser.permissions || [],
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        };

        localStorage.setItem('zoomTvToken', response.token);
        localStorage.setItem('zoomTvUser', JSON.stringify(mappedUser));
        dispatch({ type: 'LOGIN_SUCCESS', payload: mappedUser });
      } else {
        throw new Error(response.message || 'Error de autenticación');
      }
    } catch (error: any) {
      dispatch({ type: 'LOGIN_ERROR' });
      
      // Manejar errores específicos del backend
      if (error.response?.status === 401) {
        if (error.response?.data?.message === 'Credenciales inválidas') {
          throw new Error('Email o contraseña incorrectos');
        } else if (error.response?.data?.message === 'Usuario inactivo') {
          throw new Error('Tu cuenta está inactiva. Contacta al administrador.');
        } else {
          throw new Error('Credenciales inválidas');
        }
      } else if (error.response?.status === 400) {
        // Errores de validación
        const validationErrors = error.response?.data?.errors;
        if (validationErrors && validationErrors.length > 0) {
          const errorMessages = validationErrors.map((err: any) => err.msg).join(', ');
          throw new Error(errorMessages);
        } else {
          throw new Error(error.response?.data?.message || 'Datos de entrada inválidos');
        }
      } else if (error.response?.status === 500) {
        throw new Error('Error en el servidor. Intenta nuevamente más tarde.');
      } else if (error.code === 'NETWORK_ERROR' || error.message.includes('Network Error')) {
        throw new Error('Error de conexión. Verifica tu conexión a internet.');
      } else {
        throw new Error(error.response?.data?.message || error.message || 'Error de autenticación');
      }
    }
  };

  const logout = async (): Promise<void> => {
    try {
      await authApi.logout();
    } catch (error) {
      console.error('Error during logout:', error);
    } finally {
      localStorage.removeItem('zoomTvToken');
      localStorage.removeItem('zoomTvUser');
      dispatch({ type: 'LOGOUT' });
    }
  };

  const updateProfile = async (data: Partial<User>): Promise<void> => {
    // Implementación temporal
    if (state.user) {
      const updatedUser = { ...state.user, ...data } as User;
      localStorage.setItem('zoomTvUser', JSON.stringify(updatedUser));
      dispatch({ type: 'UPDATE_PROFILE', payload: updatedUser });
    }
  };

  const changePassword = async (data: { currentPassword: string; newPassword: string }): Promise<void> => {
    // Implementación temporal
    console.log('Change password:', data);
  };

  const clearError = () => {
    dispatch({ type: 'CLEAR_ERROR' });
  };

  const value: AuthContextType = {
    ...state,
    login,
    logout,
    updateProfile,
    changePassword,
    clearError,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
