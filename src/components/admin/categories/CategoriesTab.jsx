import React, { useState, useEffect } from 'react';

const CategoriesTab = ({ onCategorySelect }) => {
  const [categories, setCategories] = useState([
    { 
      id: 1, 
      name: 'Obligatorio', 
      description: 'Cursos que deben ser aprobados obligatoriamente según la malla curricular',
      subcategoriesCount: 8,
      coursesCount: 45,
      color: '#06b6d4',
      cycleAssociation: true,
      isFrozen: false,
      isHidden: false,
      createdAt: '2024-01-15'
    },
    { 
      id: 2, 
      name: 'Electivo', 
      description: 'Cursos optativos que permiten personalizar la formación académica',
      subcategoriesCount: 12,
      coursesCount: 28,
      color: '#8b5cf6',
      cycleAssociation: false,
      isFrozen: false,
      isHidden: false,
      createdAt: '2024-01-15'
    }
  ]);

  // Mock data para subcategorías (normalmente vendría del backend)
  const [subcategoriesByCategory, setSubcategoriesByCategory] = useState({
    1: [
      { id: 1, name: 'Matemáticas', coursesCount: 8 },
      { id: 2, name: 'Física', coursesCount: 6 },
      { id: 3, name: 'Programación', coursesCount: 12 },
      { id: 4, name: 'Redes', coursesCount: 10 }
    ],
    2: [
      { id: 5, name: 'Electivo de Humanidades 1', coursesCount: 8 },
      { id: 6, name: 'Electivo de Humanidades 2', coursesCount: 6 },
      { id: 7, name: 'Electivo de Especialización', coursesCount: 12 },
      { id: 8, name: 'Electivo de Investigación', coursesCount: 4 }
    ]
  });

  const [showAddForm, setShowAddForm] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategoryInfo, setSelectedCategoryInfo] = useState(null);
  
  // Estados para modales de confirmación
  const [showFreezeConfirmation, setShowFreezeConfirmation] = useState(null);
  const [showUnfreezeConfirmation, setShowUnfreezeConfirmation] = useState(null);
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(null);
  const [confirmationTimer, setConfirmationTimer] = useState(10);
  const [canConfirm, setCanConfirm] = useState(false);
  
  const [newCategory, setNewCategory] = useState({
    name: '',
    description: '',
    cycleAssociation: true,
    color: '#06b6d4',
    isHidden: false
  });

  const colorOptions = [
    '#06b6d4', '#3b82f6', '#8b5cf6', '#10b981', 
    '#f59e0b', '#ef4444', '#ec4899', '#14b8a6'
  ];

  const filteredCategories = categories.filter(category =>
    category.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    category.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Timer effect para confirmaciones
  useEffect(() => {
    let timer;
    if ((showFreezeConfirmation || showUnfreezeConfirmation || showDeleteConfirmation) && confirmationTimer > 0) {
      timer = setTimeout(() => {
        setConfirmationTimer(confirmationTimer - 1);
      }, 1000);
    } else if (confirmationTimer === 0) {
      setCanConfirm(true);
    }
    return () => clearTimeout(timer);
  }, [showFreezeConfirmation, showUnfreezeConfirmation, showDeleteConfirmation, confirmationTimer]);

  const resetConfirmationState = () => {
    setShowFreezeConfirmation(null);
    setShowUnfreezeConfirmation(null);
    setShowDeleteConfirmation(null);
    setConfirmationTimer(10);
    setCanConfirm(false);
  };

  const handleAddCategory = () => {
    if (newCategory.name.trim()) {
      const category = {
        id: Date.now(),
        ...newCategory,
        subcategoriesCount: 0,
        coursesCount: 0,
        isFrozen: false,
        createdAt: new Date().toISOString().split('T')[0]
      };
      setCategories([...categories, category]);
      resetForm();
    }
  };

  const handleEditCategory = (category) => {
    setEditingCategory(category);
    setNewCategory({ ...category });
    setShowAddForm(true);
  };

  const handleUpdateCategory = () => {
    setCategories(categories.map(cat => 
      cat.id === editingCategory.id ? { ...newCategory, id: editingCategory.id } : cat
    ));
    resetForm();
  };

  const handleDeleteCategory = (category) => {
    setShowDeleteConfirmation(category);
  };

  const confirmDeleteCategory = () => {
    setCategories(categories.filter(cat => cat.id !== showDeleteConfirmation.id));
    resetConfirmationState();
  };

  const handleFreezeCategory = (category) => {
    setShowFreezeConfirmation(category);
  };

  const confirmFreezeCategory = () => {
    setCategories(categories.map(cat => 
      cat.id === showFreezeConfirmation.id ? { ...cat, isFrozen: true } : cat
    ));
    resetConfirmationState();
  };

  const handleUnfreezeCategory = (category) => {
    setShowUnfreezeConfirmation(category);
  };

  const confirmUnfreezeCategory = () => {
    setCategories(categories.map(cat => 
      cat.id === showUnfreezeConfirmation.id ? { ...cat, isFrozen: false } : cat
    ));
    resetConfirmationState();
  };

  const handleToggleHidden = (categoryId) => {
    setCategories(categories.map(cat => 
      cat.id === categoryId ? { ...cat, isHidden: !cat.isHidden } : cat
    ));
  };

  const handleCategoryClick = (category) => {
    if (category.isFrozen) return; // No permitir seleccionar categorías congeladas
    
    if (selectedCategoryInfo?.id === category.id) {
      // Si ya está seleccionada, navegamos a subcategorías
      onCategorySelect(category);
    } else {
      // Mostrar información de la categoría
      setSelectedCategoryInfo(category);
    }
  };

  const resetForm = () => {
    setShowAddForm(false);
    setEditingCategory(null);
    setNewCategory({
      name: '',
      description: '',
      cycleAssociation: true,
      color: '#06b6d4',
      isHidden: false
    });
  };

  const getStatusColor = (category) => {
    if (category.isFrozen) return '#64748b';
    if (category.isHidden) return '#f59e0b';
    return category.color;
  };

  const getStatusIcon = (category) => {
    if (category.isFrozen) return '❄️';
    if (category.isHidden) return '👁️‍🗨️';
    return '✅';
  };

  return (
    <div style={{ padding: '32px' }}>
      {/* Header Section */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '32px',
        flexWrap: 'wrap',
        gap: '16px'
      }}>
        <div>
          <h2 style={{
            fontSize: '28px',
            fontWeight: 'bold',
            background: 'linear-gradient(to right, #06b6d4, #3b82f6)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            margin: 0,
            marginBottom: '8px'
          }}>
            📂 Gestión de Categorías
          </h2>
          <p style={{ color: '#94a3b8', margin: 0, fontSize: '16px' }}>
            Define y organiza las categorías principales de los cursos
          </p>
        </div>
        
        <button
          onClick={() => setShowAddForm(true)}
          style={{
            padding: '12px 24px',
            borderRadius: '12px',
            border: 'none',
            background: 'linear-gradient(135deg, #06b6d4, #3b82f6)',
            color: 'white',
            cursor: 'pointer',
            fontSize: '16px',
            fontWeight: '600',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            transition: 'all 0.3s ease',
            boxShadow: '0 4px 15px rgba(6, 182, 212, 0.3)'
          }}
          onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-2px)'}
          onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
        >
          <span style={{ fontSize: '18px' }}>+</span>
          Nueva Categoría
        </button>
      </div>

      {/* Search Bar */}
      <div style={{
        marginBottom: '24px',
        position: 'relative'
      }}>
        <input
          type="text"
          placeholder="🔍 Buscar categorías..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{
            width: '100%',
            padding: '16px 20px',
            borderRadius: '12px',
            border: '1px solid rgba(148, 163, 184, 0.3)',
            background: 'rgba(30, 41, 59, 0.6)',
            color: 'white',
            fontSize: '16px',
            backdropFilter: 'blur(10px)',
            outline: 'none',
            transition: 'all 0.3s ease'
          }}
          onFocus={(e) => e.currentTarget.style.borderColor = '#06b6d4'}
          onBlur={(e) => e.currentTarget.style.borderColor = 'rgba(148, 163, 184, 0.3)'}
        />
      </div>

      {/* Add/Edit Form */}
      {showAddForm && (
        <CategoryForm
          newCategory={newCategory}
          setNewCategory={setNewCategory}
          colorOptions={colorOptions}
          editingCategory={editingCategory}
          onSave={editingCategory ? handleUpdateCategory : handleAddCategory}
          onCancel={resetForm}
          onToggleHidden={handleToggleHidden}
        />
      )}

      {/* Main Content Layout */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: selectedCategoryInfo ? '1fr 400px' : '1fr',
        gap: '32px'
      }}>
        
        {/* Categories Grid */}
        <div>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))',
            gap: '24px'
          }}>
            {filteredCategories.map((category) => (
              <CategoryCard
                key={category.id}
                category={category}
                isSelected={selectedCategoryInfo?.id === category.id}
                onSelect={() => handleCategoryClick(category)}
                onEdit={() => handleEditCategory(category)}
                onDelete={() => handleDeleteCategory(category)}
                onFreeze={() => handleFreezeCategory(category)}
                onUnfreeze={() => handleUnfreezeCategory(category)}
                onToggleHidden={() => handleToggleHidden(category.id)}
                getStatusColor={getStatusColor}
                getStatusIcon={getStatusIcon}
              />
            ))}
          </div>

          {filteredCategories.length === 0 && (
            <div style={{
              textAlign: 'center',
              padding: '64px 24px',
              color: '#94a3b8'
            }}>
              <div style={{ fontSize: '48px', marginBottom: '16px' }}>🔍</div>
              <h3 style={{ fontSize: '20px', marginBottom: '8px' }}>
                No se encontraron categorías
              </h3>
              <p style={{ fontSize: '16px' }}>
                {searchTerm ? 'Intenta con otros términos de búsqueda' : 'Comienza creando tu primera categoría'}
              </p>
            </div>
          )}
        </div>

        {/* Category Details Panel */}
        {selectedCategoryInfo && (
          <CategoryDetailsPanel
            category={selectedCategoryInfo}
            subcategories={subcategoriesByCategory[selectedCategoryInfo.id] || []}
            onClose={() => setSelectedCategoryInfo(null)}
            onNavigateToSubcategories={() => onCategorySelect(selectedCategoryInfo)}
            getStatusColor={getStatusColor}
          />
        )}
      </div>

      {/* Confirmation Modals */}
      {(showFreezeConfirmation || showUnfreezeConfirmation || showDeleteConfirmation) && (
        <ConfirmationModal
          type={showFreezeConfirmation ? 'freeze' : showUnfreezeConfirmation ? 'unfreeze' : 'delete'}
          category={showFreezeConfirmation || showUnfreezeConfirmation || showDeleteConfirmation}
          timer={confirmationTimer}
          canConfirm={canConfirm}
          onConfirm={showFreezeConfirmation ? confirmFreezeCategory : showUnfreezeConfirmation ? confirmUnfreezeCategory : confirmDeleteCategory}
          onCancel={resetConfirmationState}
        />
      )}
    </div>
  );
};

// Componente para el formulario de categorías
const CategoryForm = ({ newCategory, setNewCategory, colorOptions, editingCategory, onSave, onCancel }) => (
  <div style={{
    background: 'linear-gradient(135deg, rgba(6, 182, 212, 0.1) 0%, rgba(59, 130, 246, 0.1) 100%)',
    borderRadius: '16px',
    border: '1px solid rgba(6, 182, 212, 0.3)',
    padding: '24px',
    marginBottom: '24px',
    backdropFilter: 'blur(10px)'
  }}>
    <h3 style={{
      color: '#67e8f9',
      marginBottom: '20px',
      fontSize: '20px',
      fontWeight: '600'
    }}>
      {editingCategory ? '✏️ Editar Categoría' : '✨ Nueva Categoría'}
    </h3>
    
    <div style={{
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
      gap: '20px',
      marginBottom: '20px'
    }}>
      <div>
        <label style={{ color: '#cbd5e1', fontSize: '14px', marginBottom: '8px', display: 'block' }}>
          Nombre de la categoría
        </label>
        <input
          type="text"
          value={newCategory.name}
          onChange={(e) => setNewCategory({...newCategory, name: e.target.value})}
          placeholder="Ej: Especialización, Formación General..."
          style={{
            width: '100%',
            padding: '12px 16px',
            borderRadius: '8px',
            border: '1px solid rgba(148, 163, 184, 0.3)',
            background: 'rgba(15, 23, 42, 0.6)',
            color: 'white',
            fontSize: '14px',
            outline: 'none'
          }}
        />
      </div>
      
      <div>
        <label style={{ color: '#cbd5e1', fontSize: '14px', marginBottom: '8px', display: 'block' }}>
          Asociación por ciclo
        </label>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          padding: '12px 0'
        }}>
          <input
            type="checkbox"
            id="cycleAssociation"
            checked={newCategory.cycleAssociation}
            onChange={(e) => setNewCategory({...newCategory, cycleAssociation: e.target.checked})}
            style={{
              width: '18px',
              height: '18px',
              accentColor: '#06b6d4',
              cursor: 'pointer'
            }}
          />
          <label 
            htmlFor="cycleAssociation"
            style={{ 
              color: '#cbd5e1', 
              fontSize: '14px',
              cursor: 'pointer',
              userSelect: 'none'
            }}
          >
            Las subcategorías se asocian a ciclos específicos
          </label>
        </div>
      </div>
    </div>

    <div style={{ marginBottom: '20px' }}>
      <label style={{ color: '#cbd5e1', fontSize: '14px', marginBottom: '8px', display: 'block' }}>
        Descripción
      </label>
      <textarea
        value={newCategory.description}
        onChange={(e) => setNewCategory({...newCategory, description: e.target.value})}
        placeholder="Describe el propósito y alcance de esta categoría..."
        rows={3}
        style={{
          width: '100%',
          padding: '12px 16px',
          borderRadius: '8px',
          border: '1px solid rgba(148, 163, 184, 0.3)',
          background: 'rgba(15, 23, 42, 0.6)',
          color: 'white',
          fontSize: '14px',
          outline: 'none',
          resize: 'vertical',
          minHeight: '80px'
        }}
      />
    </div>

    <div style={{ marginBottom: '20px' }}>
      <label style={{ color: '#cbd5e1', fontSize: '14px', marginBottom: '8px', display: 'block' }}>
        Color identificativo
      </label>
      <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
        {colorOptions.map(color => (
          <button
            key={color}
            onClick={() => setNewCategory({...newCategory, color})}
            style={{
              width: '40px',
              height: '40px',
              borderRadius: '8px',
              border: newCategory.color === color ? '3px solid white' : '2px solid rgba(148, 163, 184, 0.3)',
              background: color,
              cursor: 'pointer',
              transition: 'all 0.2s ease',
              boxShadow: newCategory.color === color ? `0 0 20px ${color}40` : 'none'
            }}
          />
        ))}
      </div>
    </div>

    {/* Visibilidad */}
    <div style={{ marginBottom: '20px' }}>
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '12px'
      }}>
        <input
          type="checkbox"
          id="isHidden"
          checked={newCategory.isHidden}
          onChange={(e) => setNewCategory({...newCategory, isHidden: e.target.checked})}
          style={{
            width: '18px',
            height: '18px',
            accentColor: '#f59e0b',
            cursor: 'pointer'
          }}
        />
        <label 
          htmlFor="isHidden"
          style={{ 
            color: '#cbd5e1', 
            fontSize: '14px',
            cursor: 'pointer',
            userSelect: 'none'
          }}
        >
          Ocultar categoría (no visible para estudiantes)
        </label>
      </div>
    </div>

    <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
      <button
        onClick={onCancel}
        style={{
          padding: '10px 20px',
          borderRadius: '8px',
          border: '1px solid rgba(148, 163, 184, 0.3)',
          background: 'transparent',
          color: '#94a3b8',
          cursor: 'pointer',
          fontSize: '14px'
        }}
      >
        Cancelar
      </button>
      <button
        onClick={onSave}
        style={{
          padding: '10px 20px',
          borderRadius: '8px',
          border: 'none',
          background: 'linear-gradient(135deg, #06b6d4, #3b82f6)',
          color: 'white',
          cursor: 'pointer',
          fontSize: '14px',
          fontWeight: '600'
        }}
      >
        {editingCategory ? 'Actualizar' : 'Crear'} Categoría
      </button>
    </div>
  </div>
);

// Componente para cada card de categoría
const CategoryCard = ({ 
  category, isSelected, onSelect, onEdit, onDelete, onFreeze, onUnfreeze, onToggleHidden, 
  getStatusColor, getStatusIcon 
}) => {
  const canDelete = category.subcategoriesCount === 0 && category.coursesCount === 0;
  
  return (
    <div
      onClick={onSelect}
      style={{
        background: `linear-gradient(135deg, rgba(15, 23, 42, 0.9) 0%, rgba(30, 41, 59, 0.8) 100%)`,
        borderRadius: '16px',
        border: `2px solid ${isSelected ? getStatusColor(category) : `${getStatusColor(category)}60`}`,
        padding: '24px',
        transition: 'all 0.3s ease',
        backdropFilter: 'blur(10px)',
        position: 'relative',
        overflow: 'hidden',
        cursor: category.isFrozen ? 'not-allowed' : 'pointer',
        opacity: category.isFrozen ? 0.7 : 1,
        transform: isSelected ? 'scale(1.02)' : 'scale(1)',
        boxShadow: isSelected ? `0 8px 30px ${getStatusColor(category)}40` : 'none'
      }}
      onMouseEnter={(e) => {
        if (!category.isFrozen) {
          e.currentTarget.style.transform = isSelected ? 'scale(1.02)' : 'translateY(-4px)';
          e.currentTarget.style.boxShadow = `0 12px 40px ${getStatusColor(category)}40`;
        }
      }}
      onMouseLeave={(e) => {
        if (!category.isFrozen) {
          e.currentTarget.style.transform = isSelected ? 'scale(1.02)' : 'translateY(0)';
          e.currentTarget.style.boxShadow = isSelected ? `0 8px 30px ${getStatusColor(category)}40` : 'none';
        }
      }}
    >
      {/* Color accent bar */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        height: '4px',
        background: `linear-gradient(90deg, ${getStatusColor(category)}, ${getStatusColor(category)}80)`
      }} />
      
      {/* Status indicator */}
      <div style={{
        position: 'absolute',
        top: '12px',
        right: '12px',
        fontSize: '20px'
      }}>
        {getStatusIcon(category)}
      </div>
      
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: '16px'
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '12px'
        }}>
          <div style={{
            width: '12px',
            height: '12px',
            borderRadius: '50%',
            background: getStatusColor(category),
            boxShadow: `0 0 10px ${getStatusColor(category)}60`
          }} />
          <h3 style={{
            color: 'white',
            fontSize: '20px',
            fontWeight: '700',
            margin: 0
          }}>
            {category.name}
          </h3>
        </div>
      </div>

      <p style={{
        color: '#cbd5e1',
        fontSize: '14px',
        lineHeight: '1.5',
        marginBottom: '20px',
        opacity: 0.9
      }}>
        {category.description}
      </p>

      {/* Action Buttons */}
      <div style={{
        display: 'flex',
        gap: '8px',
        flexWrap: 'wrap',
        marginBottom: '16px'
      }}>
        {!category.isFrozen && (
          <>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onEdit(category);
              }}
              style={{
                padding: '6px 12px',
                borderRadius: '6px',
                border: 'none',
                background: 'rgba(16, 185, 129, 0.2)',
                color: '#10b981',
                cursor: 'pointer',
                fontSize: '12px',
                fontWeight: '500',
                transition: 'all 0.2s ease'
              }}
            >
              ✏️ Editar
            </button>

            <button
              onClick={(e) => {
                e.stopPropagation();
                onFreeze(category);
              }}
              style={{
                padding: '6px 12px',
                borderRadius: '6px',
                border: 'none',
                background: 'rgba(100, 116, 139, 0.2)',
                color: '#64748b',
                cursor: 'pointer',
                fontSize: '12px',
                fontWeight: '500'
              }}
            >
              ❄️ Congelar
            </button>

            <button
              onClick={(e) => {
                e.stopPropagation();
                onToggleHidden(category.id);
              }}
              style={{
                padding: '6px 12px',
                borderRadius: '6px',
                border: 'none',
                background: category.isHidden ? 'rgba(16, 185, 129, 0.2)' : 'rgba(245, 158, 11, 0.2)',
                color: category.isHidden ? '#10b981' : '#f59e0b',
                cursor: 'pointer',
                fontSize: '12px',
                fontWeight: '500'
              }}
            >
              {category.isHidden ? '👁️ Mostrar' : '🙈 Ocultar'}
            </button>
          </>
        )}

        {category.isFrozen && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onUnfreeze(category);
            }}
            style={{
              padding: '6px 12px',
              borderRadius: '6px',
              border: 'none',
              background: 'rgba(6, 182, 212, 0.2)',
              color: '#06b6d4',
              cursor: 'pointer',
              fontSize: '12px',
              fontWeight: '500'
            }}
          >
            🔥 Descongelar
          </button>
        )}

        {canDelete && !category.isFrozen && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onDelete(category);
            }}
            style={{
              padding: '6px 12px',
              borderRadius: '6px',
              border: 'none',
              background: 'rgba(239, 68, 68, 0.2)',
              color: '#ef4444',
              cursor: 'pointer',
              fontSize: '12px',
              fontWeight: '500'
            }}
          >
            🗑️ Eliminar
          </button>
        )}
      </div>

      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '16px'
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            color: '#94a3b8',
            fontSize: '14px'
          }}>
            <span>📁</span>
            <span style={{ fontWeight: '600', color: getStatusColor(category) }}>
              {category.subcategoriesCount}
            </span>
            <span>subcategorías</span>
          </div>
          
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            color: '#94a3b8',
            fontSize: '14px'
          }}>
            <span>📚</span>
            <span style={{ fontWeight: '600', color: getStatusColor(category) }}>
              {category.coursesCount}
            </span>
            <span>cursos</span>
          </div>
        </div>
        
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          color: '#94a3b8',
          fontSize: '12px'
        }}>
          {category.cycleAssociation ? (
            <>
              <span>🔗</span>
              <span>Por ciclo</span>
            </>
          ) : (
            <>
              <span>🌐</span>
              <span>Transversal</span>
            </>
          )}
        </div>
      </div>

      {!canDelete && !category.isFrozen && (
        <div style={{
          marginTop: '12px',
          padding: '8px 12px',
          borderRadius: '8px',
          background: 'rgba(71, 85, 105, 0.2)',
          fontSize: '12px',
          color: '#94a3b8',
          display: 'flex',
          alignItems: 'center',
          gap: '6px'
        }}>
          <span>⚠️</span>
          No se puede eliminar: tiene {category.subcategoriesCount > 0 ? 'subcategorías' : 'cursos'} asociados
        </div>
      )}

      {/* Selection indicator */}
      {isSelected && (
        <div style={{
          position: 'absolute',
          bottom: '12px',
          right: '12px',
          color: getStatusColor(category),
          fontSize: '16px',
          animation: 'pulse 2s infinite'
        }}>
          ✨ Seleccionada
        </div>
      )}

      {/* Click indicator for non-frozen categories */}
      {!category.isFrozen && !isSelected && (
        <div style={{
          position: 'absolute',
          bottom: '12px',
          right: '12px',
          color: getStatusColor(category),
          fontSize: '16px',
          opacity: 0.6
        }}>
          👆 Clic para ver detalles
        </div>
      )}
    </div>
  );
};

// Componente para el panel de detalles de categoría
const CategoryDetailsPanel = ({ category, subcategories, onClose, onNavigateToSubcategories, getStatusColor }) => (
  <div style={{
    background: 'linear-gradient(135deg, rgba(15, 23, 42, 0.9) 0%, rgba(30, 41, 59, 0.8) 100%)',
    borderRadius: '16px',
    border: `1px solid ${getStatusColor(category)}60`,
    padding: '24px',
    height: 'fit-content',
    position: 'sticky',
    top: '20px'
  }}>
    {/* Header */}
    <div style={{
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'flex-start',
      marginBottom: '20px'
    }}>
      <div>
        <h3 style={{
          color: getStatusColor(category),
          fontSize: '20px',
          fontWeight: '700',
          margin: 0,
          marginBottom: '8px'
        }}>
          📂 {category.name}
        </h3>
        <p style={{
          color: '#94a3b8',
          fontSize: '14px',
          margin: 0,
          lineHeight: '1.4'
        }}>
          {category.description}
        </p>
      </div>
      
      <button
        onClick={onClose}
        style={{
          background: 'rgba(148, 163, 184, 0.2)',
          border: 'none',
          borderRadius: '6px',
          color: '#94a3b8',
          cursor: 'pointer',
          fontSize: '14px',
          padding: '6px 10px',
          fontWeight: '500'
        }}
      >
        ✕
      </button>
    </div>

    {/* Status Info */}
    <div style={{
      display: 'flex',
      gap: '12px',
      marginBottom: '20px',
      flexWrap: 'wrap'
    }}>
      <span style={{
        padding: '4px 8px',
        borderRadius: '12px',
        background: `${getStatusColor(category)}20`,
        color: getStatusColor(category),
        fontSize: '12px',
        fontWeight: '600'
      }}>
        {category.isFrozen ? '❄️ Congelada' : category.isHidden ? '🙈 Oculta' : '✅ Activa'}
      </span>
      
      <span style={{
        padding: '4px 8px',
        borderRadius: '12px',
        background: 'rgba(148, 163, 184, 0.2)',
        color: '#94a3b8',
        fontSize: '12px',
        fontWeight: '600'
      }}>
        {category.cycleAssociation ? '🔗 Por ciclo' : '🌐 Transversal'}
      </span>
    </div>

    {/* Statistics */}
    <div style={{
      display: 'grid',
      gridTemplateColumns: '1fr 1fr',
      gap: '12px',
      marginBottom: '24px'
    }}>
      <div style={{
        padding: '12px',
        borderRadius: '8px',
        background: 'rgba(30, 41, 59, 0.6)',
        textAlign: 'center'
      }}>
        <div style={{
          fontSize: '20px',
          fontWeight: '700',
          color: getStatusColor(category),
          marginBottom: '4px'
        }}>
          {category.subcategoriesCount}
        </div>
        <div style={{
          fontSize: '12px',
          color: '#94a3b8'
        }}>
          Subcategorías
        </div>
      </div>
      
      <div style={{
        padding: '12px',
        borderRadius: '8px',
        background: 'rgba(30, 41, 59, 0.6)',
        textAlign: 'center'
      }}>
        <div style={{
          fontSize: '20px',
          fontWeight: '700',
          color: getStatusColor(category),
          marginBottom: '4px'
        }}>
          {category.coursesCount}
        </div>
        <div style={{
          fontSize: '12px',
          color: '#94a3b8'
        }}>
          Cursos
        </div>
      </div>
    </div>

    {/* Subcategories List */}
    <div style={{ marginBottom: '20px' }}>
      <h4 style={{
        color: '#cbd5e1',
        fontSize: '16px',
        fontWeight: '600',
        marginBottom: '12px'
      }}>
        📁 Subcategorías
      </h4>
      
      {subcategories.length > 0 ? (
        <div style={{
          maxHeight: '200px',
          overflowY: 'auto',
          display: 'flex',
          flexDirection: 'column',
          gap: '8px'
        }}>
          {subcategories.map(subcategory => (
            <div
              key={subcategory.id}
              style={{
                padding: '10px 12px',
                borderRadius: '8px',
                background: 'rgba(30, 41, 59, 0.4)',
                border: `1px solid ${getStatusColor(category)}30`,
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                transition: 'all 0.2s ease'
              }}
              onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(30, 41, 59, 0.6)'}
              onMouseLeave={(e) => e.currentTarget.style.background = 'rgba(30, 41, 59, 0.4)'}
            >
              <span style={{
                color: '#cbd5e1',
                fontSize: '14px',
                fontWeight: '500'
              }}>
                {subcategory.name}
              </span>
              <span style={{
                color: getStatusColor(category),
                fontSize: '12px',
                fontWeight: '600'
              }}>
                {subcategory.coursesCount} cursos
              </span>
            </div>
          ))}
        </div>
      ) : (
        <div style={{
          padding: '20px',
          textAlign: 'center',
          color: '#94a3b8',
          fontSize: '14px',
          fontStyle: 'italic'
        }}>
          No hay subcategorías registradas
        </div>
      )}
    </div>

    {/* Actions */}
    <div style={{
      display: 'flex',
      gap: '12px',
      flexDirection: 'column'
    }}>
      <button
        onClick={onNavigateToSubcategories}
        disabled={category.isFrozen}
        style={{
          padding: '12px 20px',
          borderRadius: '8px',
          border: 'none',
          background: category.isFrozen 
            ? 'rgba(148, 163, 184, 0.3)' 
            : `linear-gradient(135deg, ${getStatusColor(category)}, ${getStatusColor(category)}80)`,
          color: 'white',
          cursor: category.isFrozen ? 'not-allowed' : 'pointer',
          fontSize: '14px',
          fontWeight: '600',
          opacity: category.isFrozen ? 0.5 : 1,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '8px'
        }}
      >
        <span>📁</span>
        Ver Subcategorías
      </button>
      
      {category.isFrozen && (
        <div style={{
          padding: '8px 12px',
          borderRadius: '6px',
          background: 'rgba(100, 116, 139, 0.2)',
          color: '#64748b',
          fontSize: '12px',
          textAlign: 'center',
          fontStyle: 'italic'
        }}>
          ❄️ Categoría congelada - No se pueden realizar acciones
        </div>
      )}
    </div>
  </div>
);

// Componente para modales de confirmación
const ConfirmationModal = ({ type, category, timer, canConfirm, onConfirm, onCancel }) => {
  const getModalConfig = () => {
    switch (type) {
      case 'freeze':
        return {
          title: '❄️ Congelar Categoría',
          message: `¿Estás seguro de que deseas congelar la categoría "${category.name}"?`,
          warning: 'Esta acción congelará en cadena todas las subcategorías, cursos y horarios asociados. No se podrán realizar acciones de edición hasta descongelar.',
          confirmText: 'Congelar',
          color: '#64748b'
        };
      case 'unfreeze':
        return {
          title: '🔥 Descongelar Categoría',
          message: `¿Estás seguro de que deseas descongelar la categoría "${category.name}"?`,
          warning: 'Esta acción descongelará en cadena todas las subcategorías, cursos y horarios asociados.',
          confirmText: 'Descongelar',
          color: '#06b6d4'
        };
      case 'delete':
        return {
          title: '🗑️ Eliminar Categoría',
          message: `¿Estás seguro de que deseas eliminar la categoría "${category.name}"?`,
          warning: 'Esta acción es irreversible. La categoría será eliminada permanentemente.',
          confirmText: 'Eliminar',
          color: '#ef4444'
        };
      default:
        return {};
    }
  };

  const config = getModalConfig();

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: 'rgba(0, 0, 0, 0.8)',
      backdropFilter: 'blur(8px)',
      zIndex: 1000,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px'
    }}>
      <div style={{
        background: 'linear-gradient(135deg, rgba(15, 23, 42, 0.95) 0%, rgba(30, 41, 59, 0.95) 100%)',
        borderRadius: '20px',
        border: `2px solid ${config.color}60`,
        padding: '32px',
        maxWidth: '500px',
        width: '100%',
        position: 'relative',
        animation: 'modalSlideIn 0.3s ease-out'
      }}>
        {/* Animated border */}
        <div style={{
          position: 'absolute',
          top: '-2px',
          left: '-2px',
          right: '-2px',
          bottom: '-2px',
          borderRadius: '20px',
          background: `linear-gradient(45deg, ${config.color}, transparent, ${config.color})`,
          zIndex: -1,
          animation: 'borderGlow 2s linear infinite'
        }} />

        <h3 style={{
          color: config.color,
          fontSize: '24px',
          fontWeight: '700',
          marginBottom: '16px',
          textAlign: 'center'
        }}>
          {config.title}
        </h3>

        <p style={{
          color: '#cbd5e1',
          fontSize: '16px',
          lineHeight: '1.5',
          marginBottom: '16px',
          textAlign: 'center'
        }}>
          {config.message}
        </p>

        <div style={{
          padding: '16px',
          borderRadius: '12px',
          background: `${config.color}15`,
          border: `1px solid ${config.color}30`,
          marginBottom: '24px'
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'flex-start',
            gap: '12px'
          }}>
            <span style={{
              fontSize: '20px',
              animation: 'pulse 2s infinite'
            }}>
              ⚠️
            </span>
            <p style={{
              color: '#fbbf24',
              fontSize: '14px',
              lineHeight: '1.4',
              margin: 0
            }}>
              {config.warning}
            </p>
          </div>
        </div>

        {/* Timer Circle */}
        {timer > 0 && (
          <div style={{
            display: 'flex',
            justifyContent: 'center',
            marginBottom: '24px'
          }}>
            <div style={{
              width: '80px',
              height: '80px',
              borderRadius: '50%',
              border: `4px solid ${config.color}30`,
              borderTop: `4px solid ${config.color}`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              animation: 'spin 1s linear infinite',
              position: 'relative'
            }}>
              <span style={{
                color: config.color,
                fontSize: '24px',
                fontWeight: '700'
              }}>
                {timer}
              </span>
            </div>
          </div>
        )}

        {canConfirm && (
          <div style={{
            textAlign: 'center',
            marginBottom: '20px',
            color: '#10b981',
            fontSize: '14px',
            fontWeight: '600',
            animation: 'fadeIn 0.5s ease-in'
          }}>
            ✅ Ya puedes confirmar la acción
          </div>
        )}

        <div style={{
          display: 'flex',
          gap: '12px',
          justifyContent: 'center'
        }}>
          <button
            onClick={onCancel}
            style={{
              padding: '12px 24px',
              borderRadius: '8px',
              border: '1px solid rgba(148, 163, 184, 0.3)',
              background: 'transparent',
              color: '#94a3b8',
              cursor: 'pointer',
              fontSize: '14px',
              fontWeight: '600'
            }}
          >
            Cancelar
          </button>
          
          <button
            onClick={onConfirm}
            disabled={!canConfirm}
            style={{
              padding: '12px 24px',
              borderRadius: '8px',
              border: 'none',
              background: canConfirm 
                ? `linear-gradient(135deg, ${config.color}, ${config.color}80)` 
                : 'rgba(148, 163, 184, 0.3)',
              color: 'white',
              cursor: canConfirm ? 'pointer' : 'not-allowed',
              fontSize: '14px',
              fontWeight: '600',
              opacity: canConfirm ? 1 : 0.5,
              transition: 'all 0.3s ease'
            }}
          >
            {config.confirmText}
          </button>
        </div>
      </div>

      <style jsx>{`
        @keyframes modalSlideIn {
          from {
            opacity: 0;
            transform: translateY(-50px) scale(0.9);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }

        @keyframes borderGlow {
          0%, 100% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
        }

        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }

        @keyframes pulse {
          0%, 100% {
            opacity: 1;
            transform: scale(1);
          }
          50% {
            opacity: 0.7;
            transform: scale(1.1);
          }
        }

        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
      `}</style>
    </div>
  );
};

export default CategoriesTab;