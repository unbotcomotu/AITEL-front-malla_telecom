import React, { useState } from 'react';
import CategoriesTab from './categories/CategoriesTab';
import SubcategoriesTab from './subcategories/SubcategoriesTab';
import CoursesTab from './courses/CoursesTab';
import CourseScheduleManager from './courses/CourseScheduleManager';
import SearchTab from './search/SearchTab';

const CourseAdminSystem = () => {
  const [currentView, setCurrentView] = useState('categories');
  const [navigationState, setNavigationState] = useState({
    selectedCategory: null,
    selectedSubcategory: null,
    selectedCourse: null
  });

  // Definir las vistas disponibles y sus dependencias
  const views = {
    categories: { name: 'Categorías', icon: '📂', level: 0 },
    subcategories: { name: 'Subcategorías', icon: '📁', level: 1, requires: 'selectedCategory' },
    courses: { name: 'Cursos', icon: '📚', level: 2, requires: 'selectedSubcategory' },
    schedules: { name: 'Horarios', icon: '📅', level: 3, requires: 'selectedCourse' },
    search: { name: 'Buscador', icon: '🔍', level: 4 }
  };

  // Verificar qué vistas están disponibles según el estado actual
  const isViewAvailable = (viewId) => {
    const view = views[viewId];
    if (!view.requires) return true;
    return navigationState[view.requires] !== null;
  };

  // Navegar a una vista específica
  const navigateTo = (viewId) => {
    if (isViewAvailable(viewId) || viewId === 'search') {
      setCurrentView(viewId);
    }
  };

  // Handlers para navegar con selección
  const handleCategorySelect = (category) => {
    setNavigationState({
      selectedCategory: category,
      selectedSubcategory: null,
      selectedCourse: null
    });
    setCurrentView('subcategories');
  };

  const handleSubcategorySelect = (subcategory) => {
    setNavigationState({
      ...navigationState,
      selectedSubcategory: subcategory,
      selectedCourse: null
    });
    setCurrentView('courses');
  };

  const handleCourseSelect = (course) => {
    setNavigationState({
      ...navigationState,
      selectedCourse: course
    });
    setCurrentView('schedules');
  };

  // Función para retroceder en el flujo
  const goBack = () => {
    switch (currentView) {
      case 'subcategories':
        setNavigationState({
          selectedCategory: null,
          selectedSubcategory: null,
          selectedCourse: null
        });
        setCurrentView('categories');
        break;
      case 'courses':
        setNavigationState({
          ...navigationState,
          selectedSubcategory: null,
          selectedCourse: null
        });
        setCurrentView('subcategories');
        break;
      case 'schedules':
        setNavigationState({
          ...navigationState,
          selectedCourse: null
        });
        setCurrentView('courses');
        break;
      default:
        break;
    }
  };

  // Función para resetear todo el flujo
  const resetFlow = () => {
    setNavigationState({
      selectedCategory: null,
      selectedSubcategory: null,
      selectedCourse: null
    });
    setCurrentView('categories');
  };

  const renderContent = () => {
    switch (currentView) {
      case 'categories':
        return <CategoriesTab onCategorySelect={handleCategorySelect} />;
      case 'subcategories':
        return (
          <SubcategoriesTab 
            selectedCategory={navigationState.selectedCategory}
            onSubcategorySelect={handleSubcategorySelect}
            onBack={goBack}
          />
        );
      case 'courses':
        return (
          <CoursesTab 
            selectedSubcategory={navigationState.selectedSubcategory}
            onCourseSelect={handleCourseSelect}
            onBack={goBack}
          />
        );
      case 'schedules':
        return (
          <CourseScheduleManager 
            course={navigationState.selectedCourse}
            onClose={goBack}
            onSave={(scheduleData) => {
              // Aquí se guardarían los horarios
              console.log('Guardando horarios:', scheduleData);
            }}
          />
        );
      case 'search':
        return <SearchTab onNavigate={(type, item) => {
          // Permitir navegar desde el buscador a cualquier elemento
          if (type === 'category') {
            handleCategorySelect(item);
          } else if (type === 'subcategory') {
            // Primero seleccionar la categoría padre
            setNavigationState({
              selectedCategory: item.category,
              selectedSubcategory: item,
              selectedCourse: null
            });
            setCurrentView('courses');
          } else if (type === 'course') {
            // Seleccionar toda la jerarquía
            setNavigationState({
              selectedCategory: item.category,
              selectedSubcategory: item.subcategory,
              selectedCourse: item
            });
            setCurrentView('schedules');
          }
        }} />;
      default:
        return <CategoriesTab onCategorySelect={handleCategorySelect} />;
    }
  };

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

        {/* Navigation Flow */}
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          marginBottom: '32px',
          background: 'rgba(30, 41, 59, 0.6)',
          borderRadius: '16px',
          padding: '16px',
          border: '1px solid rgba(148, 163, 184, 0.3)',
          gap: '8px',
          flexWrap: 'wrap'
        }}>
          {/* Reset Button */}
          <button
            onClick={resetFlow}
            style={{
              padding: '8px 12px',
              borderRadius: '8px',
              border: 'none',
              background: 'rgba(239, 68, 68, 0.2)',
              color: '#ef4444',
              cursor: 'pointer',
              fontSize: '12px',
              fontWeight: '500',
              transition: 'all 0.2s ease',
              marginRight: '16px'
            }}
            onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(239, 68, 68, 0.3)'}
            onMouseLeave={(e) => e.currentTarget.style.background = 'rgba(239, 68, 68, 0.2)'}
          >
            🏠 Inicio
          </button>

          {/* Navigation Steps */}
          {Object.entries(views).map(([viewId, view], index) => {
            const isActive = currentView === viewId;
            const isAvailable = isViewAvailable(viewId) || viewId === 'search';
            const isCompleted = view.level < views[currentView]?.level;
            
            return (
              <React.Fragment key={viewId}>
                {/* Step Button */}
                <button
                  onClick={() => navigateTo(viewId)}
                  disabled={!isAvailable}
                  style={{
                    padding: '12px 20px',
                    borderRadius: '12px',
                    border: 'none',
                    background: isActive 
                      ? 'linear-gradient(135deg, #06b6d4, #3b82f6)'
                      : isCompleted
                      ? 'linear-gradient(135deg, #10b981, #059669)'
                      : isAvailable 
                      ? 'rgba(148, 163, 184, 0.2)'
                      : 'rgba(71, 85, 105, 0.3)',
                    color: isActive || isCompleted 
                      ? 'white' 
                      : isAvailable 
                      ? '#cbd5e1' 
                      : '#64748b',
                    cursor: isAvailable ? 'pointer' : 'not-allowed',
                    fontSize: '14px',
                    fontWeight: '600',
                    transition: 'all 0.3s ease',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    position: 'relative',
                    transform: isActive ? 'scale(1.05)' : 'scale(1)',
                    boxShadow: isActive ? '0 4px 15px rgba(6, 182, 212, 0.4)' : 'none'
                  }}
                >
                  <span style={{ fontSize: '16px' }}>
                    {isCompleted ? '✅' : view.icon}
                  </span>
                  <span>{view.name}</span>
                  
                  {/* Active indicator */}
                  {isActive && (
                    <div style={{
                      position: 'absolute',
                      bottom: '-8px',
                      left: '50%',
                      transform: 'translateX(-50%)',
                      width: '6px',
                      height: '6px',
                      borderRadius: '50%',
                      background: '#06b6d4',
                      boxShadow: '0 0 10px #06b6d4'
                    }} />
                  )}
                </button>

                {/* Arrow between steps */}
                {index < Object.keys(views).length - 1 && viewId !== 'schedules' && (
                  <div style={{
                    color: isCompleted ? '#10b981' : '#64748b',
                    fontSize: '16px',
                    fontWeight: 'bold',
                    margin: '0 4px',
                    transition: 'color 0.3s ease'
                  }}>
                    →
                  </div>
                )}
              </React.Fragment>
            );
          })}
        </div>

        {/* Breadcrumb Current Selection */}
        {(navigationState.selectedCategory || navigationState.selectedSubcategory || navigationState.selectedCourse) && (
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            marginBottom: '24px',
            padding: '12px 20px',
            background: 'rgba(6, 182, 212, 0.1)',
            borderRadius: '12px',
            border: '1px solid rgba(6, 182, 212, 0.3)',
            fontSize: '14px',
            color: '#67e8f9',
            flexWrap: 'wrap'
          }}>
            <span style={{ fontWeight: '600' }}>📍 Navegación actual:</span>
            
            {navigationState.selectedCategory && (
              <>
                <span style={{
                  padding: '4px 8px',
                  borderRadius: '6px',
                  background: 'rgba(6, 182, 212, 0.2)',
                  color: '#06b6d4',
                  fontSize: '12px'
                }}>
                  📂 {navigationState.selectedCategory.name}
                </span>
                {navigationState.selectedSubcategory && <span>→</span>}
              </>
            )}
            
            {navigationState.selectedSubcategory && (
              <>
                <span style={{
                  padding: '4px 8px',
                  borderRadius: '6px',
                  background: 'rgba(139, 92, 246, 0.2)',
                  color: '#8b5cf6',
                  fontSize: '12px'
                }}>
                  📁 {navigationState.selectedSubcategory.name}
                </span>
                {navigationState.selectedCourse && <span>→</span>}
              </>
            )}
            
            {navigationState.selectedCourse && (
              <span style={{
                padding: '4px 8px',
                borderRadius: '6px',
                background: 'rgba(16, 185, 129, 0.2)',
                color: '#10b981',
                fontSize: '12px'
              }}>
                📚 {navigationState.selectedCourse.name}
              </span>
            )}
          </div>
        )}

        {/* Content Area */}
        <div style={{
          background: 'linear-gradient(135deg, rgba(15, 23, 42, 0.9) 0%, rgba(30, 41, 59, 0.8) 100%)',
          borderRadius: '20px',
          border: '1px solid rgba(148, 163, 184, 0.3)',
          backdropFilter: 'blur(20px)',
          minHeight: '600px',
          position: 'relative',
          overflow: 'hidden'
        }}>
          {/* Back Button (only show when not in categories or search) */}
          {currentView !== 'categories' && currentView !== 'search' && (
            <button
              onClick={goBack}
              style={{
                position: 'absolute',
                top: '20px',
                left: '20px',
                padding: '8px 16px',
                borderRadius: '8px',
                border: 'none',
                background: 'rgba(148, 163, 184, 0.2)',
                color: '#cbd5e1',
                cursor: 'pointer',
                fontSize: '14px',
                fontWeight: '500',
                transition: 'all 0.2s ease',
                zIndex: 10,
                display: 'flex',
                alignItems: 'center',
                gap: '6px'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'rgba(148, 163, 184, 0.3)';
                e.currentTarget.style.transform = 'translateX(-2px)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'rgba(148, 163, 184, 0.2)';
                e.currentTarget.style.transform = 'translateX(0)';
              }}
            >
              ← Volver
            </button>
          )}

          {/* Render Current View */}
          <div style={{ padding: currentView !== 'categories' && currentView !== 'search' ? '60px 0 0 0' : '0' }}>
            {renderContent()}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseAdminSystem;