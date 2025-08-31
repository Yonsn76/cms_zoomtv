import React, { useState } from 'react';
import { Sidebar } from './Sidebar';
import { ZoomTvDashboard } from './ZoomTvDashboard';
import { NewsManagement } from './NewsManagement';
import { ProgrammingManagement } from './ProgrammingManagement';
import { SettingsManagement } from './SettingsManagement';
import { AddNewsForm } from './AddNewsForm';
import { AnunciantesManagement } from './AnunciantesManagement';

export const MainLayout: React.FC = () => {
  const [currentPage, setCurrentPage] = useState('dashboard');

  const handleNavigate = (section: string) => {
    setCurrentPage(section);
  };

  const renderCurrentPage = () => {
    switch (currentPage) {
      case 'dashboard':
        return <ZoomTvDashboard onNavigate={handleNavigate} />;
      case 'add-news':
        return <AddNewsForm onNavigate={handleNavigate} />;
      case 'news':
        return <NewsManagement onNavigate={handleNavigate} />;
      case 'anunciantes':
        return <AnunciantesManagement onNavigate={handleNavigate} />;
      case 'programming':
        return <ProgrammingManagement onNavigate={handleNavigate} />;
      case 'settings':
        return <SettingsManagement onNavigate={handleNavigate} />;
      default:
        return <ZoomTvDashboard onNavigate={handleNavigate} />;
    }
  };

  return (
    <div className="min-h-screen flex">
      <Sidebar currentPage={currentPage} onPageChange={setCurrentPage} />
      <main className="flex-1 lg:ml-80 min-h-screen glass-effect">
        <div className="p-6">
          {renderCurrentPage()}
        </div>
      </main>
    </div>
  );
};
