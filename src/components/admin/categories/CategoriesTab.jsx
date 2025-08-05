import React, { useState } from 'react';

const CategoriesTab = () => {
  const [categories, setCategories] = useState([
    { 
      id: 1, 
      name: 'Obligatorio', 
      description: 'Cursos que deben ser aprobados obligatoriamente según la malla curricular',
      subcategoriesCount: 8,
      coursesCount: 45,
      color: '#06b6d4',
      cycleAssociation: true,
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
      createdAt: '2024-01-15'
    }
  ]);

  const [showAddForm, setShowAddForm] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  
  const [newCategory, setNewCategory] = useState({
    name: '',
    description: '',
    cycleAssociation: true,
    color: '#06b6d4'
  });

  const colorOptions = [
    '#06b6d4', '#3b82f6', '#8b5cf6', '#10b981', 
    '#f59e0b', '#ef4444', '#ec4899', '#14b8a6'
  ];

  const filteredCategories = categories.filter(category =>
    category.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    category.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddCategory = () => {
    if (newCategory.name.trim()) {
      const category = {
        id: Date.now(),
        ...newCategory,
        subcategoriesCount: 0,
        coursesCount: 0,
        createdAt: new Date().toISOString().split('T')[0]
      };
      setCategories([...categories, category]);
      setNewCategory({ name: '', description: '', cycleAssociation: true, color: '#06b6d4' });
      setShowAddForm(false);
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
    setEditingCategory(null);
    setNewCategory({ name: '', description: '', type: 'core', color: '#06b6d4' });
    setShowAddForm(false);
  };

  const handleDeleteCategory = (id) => {
    if (window.confirm('¿Estás seguro de eliminar esta categoría? Esta acción no se puede deshacer.')) {
      setCategories(categories.filter(cat => cat.id !== id));
    }
  };

  const cancelForm = () => {
    setShowAddForm(false);
    setEditingCategory(null);
    setNewCategory({ name: '', description: '', cycleAssociation: true, color: '#06b6d4' });
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
              <p style={{ 
                color: '#94a3b8', 
                fontSize: '12px', 
                margin: '4px 0 0 30px',
                fontStyle: 'italic'
              }}>
                {newCategory.cycleAssociation 
                  ? 'Las subcategorías aparecerán organizadas por ciclo en la malla'
                  : 'Las subcategorías son transversales a todos los ciclos'
                }
              </p>
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

          <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
            <button
              onClick={cancelForm}
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
              onClick={editingCategory ? handleUpdateCategory : handleAddCategory}
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
      )}

      {/* Categories Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))',
        gap: '24px'
      }}>
        {filteredCategories.map((category) => (
          <div
            key={category.id}
            onClick={() => {
              // Aquí navegaremos a la gestión de subcategorías de esta categoría
              console.log('Navegando a subcategorías de:', category.name);
              // En el futuro: onCategoryClick(category.id)
            }}
            style={{
              background: 'linear-gradient(135deg, rgba(15, 23, 42, 0.9) 0%, rgba(30, 41, 59, 0.8) 100%)',
              borderRadius: '16px',
              border: `1px solid ${category.color}60`,
              padding: '24px',
              transition: 'all 0.3s ease',
              backdropFilter: 'blur(10px)',
              position: 'relative',
              overflow: 'hidden',
              cursor: 'pointer'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-4px)';
              e.currentTarget.style.boxShadow = `0 12px 40px ${category.color}40`;
              e.currentTarget.style.borderColor = `${category.color}80`;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = 'none';
              e.currentTarget.style.borderColor = `${category.color}60`;
            }}
          >
            {/* Color accent bar */}
            <div style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              height: '4px',
              background: `linear-gradient(90deg, ${category.color}, ${category.color}80)`
            }} />
            
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
                  background: category.color,
                  boxShadow: `0 0 10px ${category.color}60`
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
              
              <div style={{
                display: 'flex',
                gap: '8px'
              }}>
                <button
                  onClick={(e) => {
                    e.stopPropagation(); // Evita que se active el onClick del card
                    handleEditCategory(category);
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
                  onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(16, 185, 129, 0.3)'}
                  onMouseLeave={(e) => e.currentTarget.style.background = 'rgba(16, 185, 129, 0.2)'}
                >
                  ✏️ Editar
                </button>
                {category.subcategoriesCount === 0 && category.coursesCount === 0 && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation(); // Evita que se active el onClick del card
                      handleDeleteCategory(category.id);
                    }}
                    style={{
                      padding: '6px 12px',
                      borderRadius: '6px',
                      border: 'none',
                      background: 'rgba(239, 68, 68, 0.2)',
                      color: '#ef4444',
                      cursor: 'pointer',
                      fontSize: '12px',
                      fontWeight: '500',
                      transition: 'all 0.2s ease'
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(239, 68, 68, 0.3)'}
                    onMouseLeave={(e) => e.currentTarget.style.background = 'rgba(239, 68, 68, 0.2)'}
                  >
                    🗑️ Eliminar
                  </button>
                )}
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
                  <span style={{ fontWeight: '600', color: category.color }}>
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
                  <span style={{ fontWeight: '600', color: category.color }}>
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

            {(category.subcategoriesCount > 0 || category.coursesCount > 0) && (
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

            {/* Indicador visual de que es clickeable */}
            <div style={{
              position: 'absolute',
              bottom: '12px',
              right: '12px',
              color: category.color,
              fontSize: '16px',
              opacity: 0.6
            }}>
              →
            </div>
          </div>
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
  );
};

export default CategoriesTab;