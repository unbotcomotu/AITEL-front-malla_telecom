import React, { useState } from 'react';
import CategoriesTab from './categories/CategoriesTab';
import SubcategoriesTab from './subcategories/SubcategoriesTab';
import CoursesTab from './courses/CoursesTab';
import SearchTab from './search/SearchTab';

const CourseAdminSystem = () => {
  const [activeTab, setActiveTab] = useState('categories');

  const tabs = [
    { id: 'categories', name: '📂 Categorías', icon: '📂' },
    { id: 'subcategories', name: '📁 Subcategorías', icon: '📁' },
    { id: 'courses', name: '📚 Cursos', icon: '📚' },
    { id: 'search', name: '🔍 Buscador', icon: '🔍' }
  ];

  return (
    <div style={{
      padding: '24px',
      background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 25%, #334155 75%, #475569 100%)',
      minHeight: '100vh',
      color: 'white',
      fontFamily: 'system-ui, -apple-system, sans-serif'
    }}>
      <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
        
        {/* Header */}
        <div style={{ marginBottom: '32px', textAlign: 'center' }}>
          <h1 style={{
            fontSize: '36px',
            fontWeight: 'bold',
            background: 'linear-gradient(to right, #06b6d4, #3b82f6, #8b5cf6)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            marginBottom: '8px'
          }}>
            🎓 Sistema de Administración de Cursos
          </h1>
          <p style={{ color: '#94a3b8', fontSize: '16px' }}>
            Gestiona categorías, subcategorías y cursos de la malla curricular
          </p>
        </div>

        {/* Navigation Tabs */}
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          marginBottom: '32px',
          background: 'rgba(30, 41, 59, 0.6)',
          borderRadius: '16px',
          padding: '8px',
          border: '1px solid rgba(148, 163, 184, 0.3)'
        }}>
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              style={{
                padding: '12px 24px',
                borderRadius: '12px',
                border: 'none',
                background: activeTab === tab.id 
                  ? 'linear-gradient(135deg, #06b6d4, #3b82f6)' 
                  : 'transparent',
                color: activeTab === tab.id ? 'white' : '#94a3b8',
                cursor: 'pointer',
                fontSize: '16px',
                fontWeight: '600',
                transition: 'all 0.3s ease',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}
            >
              <span style={{ fontSize: '18px' }}>{tab.icon}</span>
              {tab.name}
            </button>
          ))}
        </div>

        {/* Content Area */}
        <div style={{
          background: 'linear-gradient(135deg, rgba(15, 23, 42, 0.9) 0%, rgba(30, 41, 59, 0.8) 100%)',
          borderRadius: '20px',
          border: '1px solid rgba(148, 163, 184, 0.3)',
          backdropFilter: 'blur(20px)',
          minHeight: '600px'
        }}>
          {activeTab === 'categories' && <CategoriesTab />}
          {activeTab === 'subcategories' && <SubcategoriesTab />}
          {activeTab === 'courses' && <CoursesTab />}
          {activeTab === 'search' && <SearchTab />}
        </div>
      </div>
    </div>
  );
};

export default CourseAdminSystem;
