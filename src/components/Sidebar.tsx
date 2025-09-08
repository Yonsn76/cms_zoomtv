import React, { useState } from 'react';
import {
  Settings,
  User,
  LogOut,
  Menu,
  X,
  Newspaper,
  FileText,
  Calendar,
  Bell,
  Tag,
  Building2,
  Radio
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
import { ThemeToggle } from './ThemeToggle';

interface SidebarProps {
  currentPage: string;
  onPageChange: (page: string) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ currentPage, onPageChange }) => {
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const { user, logout } = useAuth();
  const { themeMode } = useTheme();

  const menuItems = [
    { id: 'dashboard', label: 'Panel Principal', icon: Bell },
    { id: 'add-news', label: 'Agregar Noticia', icon: FileText },
    { id: 'news', label: 'Administración de Noticias', icon: Newspaper },
    { id: 'anunciantes', label: 'Anunciantes', icon: Tag },
    { id: 'programming', label: 'Programación', icon: Calendar },
    { id: 'transmisiones', label: 'Transmisiones', icon: Radio },
    { id: 'company', label: 'Gestión de Empresa', icon: Building2 },
    { id: 'settings', label: 'Configuración', icon: Settings },
  ];

  const handleMenuClick = (pageId: string) => {
    onPageChange(pageId);
    setIsMobileOpen(false);
  };

  return (
    <>
      {/* Mobile Menu Button */}
      <button
        className="fixed top-4 left-4 z-50 lg:hidden p-2 glass-effect"
        onClick={() => setIsMobileOpen(!isMobileOpen)}
      >
        <Menu size={20} className={themeMode === 'light' ? 'text-gray-800' : 'text-black'} />
      </button>

      {/* Mobile Overlay */}
      {isMobileOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`
        fixed top-0 left-0 h-full z-50 w-80 glass-effect border-r border-white/30 shadow-2xl hover:shadow-3xl
        transition-all duration-500 lg:translate-x-0
        ${isMobileOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        
        <div className="h-full flex flex-col">
          {/* Header */}
          <div className="p-8 border-b border-white/30 dark:border-gray-600/30">
            <div className="flex items-center justify-between">
              {/* Logo */}
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 glass-effect border border-white/20 flex items-center justify-center shadow-lg">
                  <img 
                    src="/src/assets/logo.png" 
                    alt="Zoom TV Logo" 
                    className="h-8 w-8"
                  />
                </div>
                <div>
                  <h1 className="text-xl font-black text-gray-900 dark:text-black">
                    Zoom TV CMS
                  </h1>
                  <p className="text-xs text-gray-800 dark:text-black">
                    Panel de Control
                  </p>
                </div>
              </div>
              
              {/* Mobile Close Button */}
              <button
                className="lg:hidden p-2 rounded-lg glass-effect hover:bg-white/40 dark:hover:bg-black/40"
                onClick={() => setIsMobileOpen(false)}
              >
                <X size={18} className={themeMode === 'light' ? 'text-gray-800' : 'text-black'} />
              </button>
            </div>
          </div>

          {/* User Info */}
          <div className="p-4">
            <div className="flex items-center space-x-3 p-3 glass-effect rounded-lg">
              <div className="w-10 h-10 glass-effect flex items-center justify-center">
                <User size={18} className={themeMode === 'light' ? 'text-gray-800' : 'text-black'} />
              </div>
              <div className="flex-1 min-w-0">
                <p className={`text-sm font-medium ${themeMode === 'light' ? 'text-gray-800' : 'text-black'}`}>
                  {user?.name || 'Usuario'}
                </p>
                <p className={`text-xs ${themeMode === 'light' ? 'text-gray-600' : 'text-black'}`}>
                  {user?.role || 'Usuario'}
                </p>
              </div>
            </div>
          </div>

          {/* Navigation Menu */}
          <nav className="flex-1 px-4 py-2">
            <ul className="space-y-2">
              {menuItems.map((item) => {
                const Icon = item.icon;
                const isActive = currentPage === item.id;
                
                return (
                  <li key={item.id}>
                    <button
                      onClick={() => handleMenuClick(item.id)}
                      className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-300 group ${
                        isActive
                          ? 'bg-blue-600 text-white shadow-lg'
                          : 'hover:bg-white/20 dark:hover:bg-black/20'
                      }`}
                    >
                      <Icon 
                        size={20} 
                        className={`${
                          isActive 
                            ? 'text-white' 
                            : themeMode === 'light' ? 'text-gray-800' : 'text-black'
                        }`} 
                      />
                      <span className={`font-medium ${
                        isActive 
                          ? 'text-white' 
                          : themeMode === 'light' ? 'text-gray-800' : 'text-black'
                      }`}>
                        {item.label}
                      </span>
                    </button>
                  </li>
                );
              })}
            </ul>
          </nav>

          {/* Footer */}
          <div className="p-4 border-t border-white/30 dark:border-gray-600/30">
            <div className="flex items-center justify-between">
              <ThemeToggle />
              <button
                onClick={logout}
                className="flex items-center space-x-2 p-2 glass-effect hover:bg-white/20 dark:hover:bg-black/20 rounded-lg transition-colors"
              >
                <LogOut size={16} className={themeMode === 'light' ? 'text-gray-800' : 'text-black'} />
                <span className={`text-sm ${themeMode === 'light' ? 'text-gray-800' : 'text-black'}`}>
                  Salir
                </span>
              </button>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};