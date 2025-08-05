import React, { useState } from 'react';

const SubcategoriesTab = ({ selectedCategoryId = 2 }) => {
  // Datos mock - en producción vendrían del backend basado en selectedCategoryId
  const [selectedCategory] = useState({
    id: 2,
    name: 'Electivo',
    description: 'Cursos optativos que permiten personalizar la formación académica',
    color: '#8b5cf6',
    cycleAssociation: false
  });

  const [subcategories, setSubcategories] = useState([
    { 
      id: 1, 
      name: 'Electivo de Humanidades 1', 
      description: 'Cursos de desarrollo personal y habilidades blandas para estudiantes de primeros ciclos',
      cycle: 2,
      coursesCount: 8,
      color: '#8b5cf6',
      requiredCourses: 1, // Solo necesitas aprobar 1 curso de esta subcategoría
      createdAt: '2024-01-15'
    },
    { 
      id: 2, 
      name: 'Electivo de Humanidades 2', 
      description: 'Cursos avanzados de formación humanística y ética profesional',
      cycle: 5,
      coursesCount: 6,
      color: '#8b5cf6',
      requiredCourses: 1,
      createdAt: '2024-01-20'
    },
    { 
      id: 3, 
      name: 'Electivo de Especialización', 
      description: 'Cursos especializados en áreas específicas de telecomunicaciones',
      cycle: 8,
      coursesCount: 12,
      color: '#8b5cf6',
      requiredCourses: 2, // Necesitas aprobar 2 cursos de esta subcategoría
      createdAt: '2024-02-01'
    },
    { 
      id: 4, 
      name: 'Electivo de Investigación', 
      description: 'Cursos orientados a metodología de investigación and desarrollo de tesis',
      cycle: 9,
      coursesCount: 4,
      color: '#8b5cf6',
      requiredCourses: 1,
      createdAt: '2024-02-10'
    }
  ]);

  const [showAddForm, setShowAddForm] = useState(false);
  const [editingSubcategory, setEditingSubcategory] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  
  const [newSubcategory, setNewSubcategory] = useState({
    name: '',
    description: '',
    cycle: 1,
    requiredCourses: 1,
    color: selectedCategory.color
  });

  // Ciclos disponibles (1-10 típicamente)
  const availableCycles = Array.from({length: 10}, (_, i) => i + 1);

  const filteredSubcategories = subcategories.filter(subcategory =>
    subcategory.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    subcategory.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddSubcategory = () => {
    if (newSubcategory.name.trim()) {
      const subcategory = {
        id: Date.now(),
        ...newSubcategory,
        coursesCount: 0,
        createdAt: new Date().toISOString().split('T')[0]
      };
      setSubcategories([...subcategories, subcategory]);
      setNewSubcategory({ 
        name: '', 
        description: '', 
        cycle: 1, 
        requiredCourses: 1, 
        color: selectedCategory.color 
      });
      setShowAddForm(false);
    }
  };

  const handleEditSubcategory = (subcategory) => {
    setEditingSubcategory(subcategory);
    setNewSubcategory({ ...subcategory });
    setShowAddForm(true);
  };

  const handleUpdateSubcategory = () => {
    setSubcategories(subcategories.map(sub => 
      sub.id === editingSubcategory.id ? { ...newSubcategory, id: editingSubcategory.id } : sub
    ));
    setEditingSubcategory(null);
    setNewSubcategory({ 
      name: '', 
      description: '', 
      cycle: 1, 
      requiredCourses: 1, 
      color: selectedCategory.color 
    });
    setShowAddForm(false);
  };

  const handleDeleteSubcategory = (id) => {
    if (window.confirm('¿Estás seguro de eliminar esta subcategoría? Esta acción no se puede deshacer.')) {
      setSubcategories(subcategories.filter(sub => sub.id !== id));
    }
  };

  const cancelForm = () => {
    setShowAddForm(false);
    setEditingSubcategory(null);
    setNewSubcategory({ 
      name: '', 
      description: '', 
      cycle: 1, 
      requiredCourses: 1, 
      color: selectedCategory.color 
    });
  };

  const groupedByCycle = selectedCategory.cycleAssociation 
    ? subcategories.reduce((acc, sub) => {
        const cycle = sub.cycle;
        if (!acc[cycle]) acc[cycle] = [];
        acc[cycle].push(sub);
        return acc;
      }, {})
    : { 'all': filteredSubcategories };

  return (
    <div style={{ padding: '32px' }}>
      {/* Breadcrumb Navigation */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        marginBottom: '24px',
        fontSize: '14px',
        color: '#94a3b8'
      }}>
        <button
          onClick={() => console.log('Volver a categorías')} // En producción: onBackToCategories()
          style={{
            background: 'none',
            border: 'none',
            color: '#06b6d4',
            cursor: 'pointer',
            fontSize: '14px',
            textDecoration: 'underline'
          }}
        >
          📂 Categorías
        </button>
        <span>→</span>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px'
        }}>
          <div style={{
            width: '8px',
            height: '8px',
            borderRadius: '50%',
            background: selectedCategory.color
          }} />
          <span style={{ color: 'white', fontWeight: '500' }}>
            {selectedCategory.name}
          </span>
        </div>
      </div>

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
            background: `linear-gradient(to right, ${selectedCategory.color}, ${selectedCategory.color}80)`,
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            margin: 0,
            marginBottom: '8px'
          }}>
            📁 Subcategorías de {selectedCategory.name}
          </h2>
          <p style={{ color: '#94a3b8', margin: 0, fontSize: '16px' }}>
            {selectedCategory.description}
          </p>
        </div>
        
        <button
          onClick={() => setShowAddForm(true)}
          style={{
            padding: '12px 24px',
            borderRadius: '12px',
            border: 'none',
            background: `linear-gradient(135deg, ${selectedCategory.color}, ${selectedCategory.color}80)`,
            color: 'white',
            cursor: 'pointer',
            fontSize: '16px',
            fontWeight: '600',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            transition: 'all 0.3s ease',
            boxShadow: `0 4px 15px ${selectedCategory.color}30`
          }}
          onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-2px)'}
          onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
        >
          <span style={{ fontSize: '18px' }}>+</span>
          Nueva Subcategoría
        </button>
      </div>

      {/* Search Bar */}
      <div style={{
        marginBottom: '24px',
        position: 'relative'
      }}>
        <input
          type="text"
          placeholder="🔍 Buscar subcategorías..."
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
          onFocus={(e) => e.currentTarget.style.borderColor = selectedCategory.color}
          onBlur={(e) => e.currentTarget.style.borderColor = 'rgba(148, 163, 184, 0.3)'}
        />
      </div>

      {/* Add/Edit Form */}
      {showAddForm && (
        <div style={{
          background: `linear-gradient(135deg, ${selectedCategory.color}15 0%, rgba(30, 41, 59, 0.8) 100%)`,
          borderRadius: '16px',
          border: `1px solid ${selectedCategory.color}40`,
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
            {editingSubcategory ? '✏️ Editar Subcategoría' : '✨ Nueva Subcategoría'}
          </h3>
          
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
            gap: '20px',
            marginBottom: '20px'
          }}>
            <div>
              <label style={{ color: '#cbd5e1', fontSize: '14px', marginBottom: '8px', display: 'block' }}>
                Nombre de la subcategoría
              </label>
              <input
                type="text"
                value={newSubcategory.name}
                onChange={(e) => setNewSubcategory({...newSubcategory, name: e.target.value})}
                placeholder="Ej: Electivo de Humanidades 1, Electivo de IA..."
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
            
            {selectedCategory.cycleAssociation && (
              <div>
                <label style={{ color: '#cbd5e1', fontSize: '14px', marginBottom: '8px', display: 'block' }}>
                  Ciclo asociado
                </label>
                <select
                  value={newSubcategory.cycle}
                  onChange={(e) => setNewSubcategory({...newSubcategory, cycle: parseInt(e.target.value)})}
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
                >
                  {availableCycles.map(cycle => (
                    <option key={cycle} value={cycle}>Ciclo {cycle}</option>
                  ))}
                </select>
              </div>
            )}

            <div>
              <label style={{ color: '#cbd5e1', fontSize: '14px', marginBottom: '8px', display: 'block' }}>
                Cursos requeridos
              </label>
              <input
                type="number"
                min="1"
                max="10"
                value={newSubcategory.requiredCourses}
                onChange={(e) => setNewSubcategory({...newSubcategory, requiredCourses: parseInt(e.target.value)})}
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
              <p style={{ 
                color: '#94a3b8', 
                fontSize: '12px', 
                margin: '4px 0 0 0',
                fontStyle: 'italic'
              }}>
                Número de cursos que el estudiante debe aprobar de esta subcategoría
              </p>
            </div>
          </div>

          <div style={{ marginBottom: '20px' }}>
            <label style={{ color: '#cbd5e1', fontSize: '14px', marginBottom: '8px', display: 'block' }}>
              Descripción
            </label>
            <textarea
              value={newSubcategory.description}
              onChange={(e) => setNewSubcategory({...newSubcategory, description: e.target.value})}
              placeholder="Describe los cursos que abarca esta subcategoría y su objetivo académico..."
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
              onClick={editingSubcategory ? handleUpdateSubcategory : handleAddSubcategory}
              style={{
                padding: '10px 20px',
                borderRadius: '8px',
                border: 'none',
                background: `linear-gradient(135deg, ${selectedCategory.color}, ${selectedCategory.color}80)`,
                color: 'white',
                cursor: 'pointer',
                fontSize: '14px',
                fontWeight: '600'
              }}
            >
              {editingSubcategory ? 'Actualizar' : 'Crear'} Subcategoría
            </button>
          </div>
        </div>
      )}

      {/* Subcategories Content */}
      {selectedCategory.cycleAssociation ? (
        // Vista agrupada por ciclos
        <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
          {Object.entries(groupedByCycle)
            .sort(([a], [b]) => parseInt(a) - parseInt(b))
            .map(([cycle, subcategoriesInCycle]) => (
            <div key={cycle}>
              <h3 style={{
                color: selectedCategory.color,
                fontSize: '20px',
                fontWeight: '600',
                marginBottom: '16px',
                display: 'flex',
                alignItems: 'center',
                gap: '12px'
              }}>
                <span style={{
                  padding: '6px 12px',
                  borderRadius: '20px',
                  background: `${selectedCategory.color}20`,
                  fontSize: '14px'
                }}>
                  Ciclo {cycle}
                </span>
                <span style={{ color: '#94a3b8', fontSize: '14px', fontWeight: '400' }}>
                  {subcategoriesInCycle.length} subcategoría{subcategoriesInCycle.length !== 1 ? 's' : ''}
                </span>
              </h3>
              
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))',
                gap: '20px'
              }}>
                {subcategoriesInCycle.map((subcategory) => (
                  <SubcategoryCard 
                    key={subcategory.id}
                    subcategory={subcategory}
                    selectedCategory={selectedCategory}
                    onEdit={handleEditSubcategory}
                    onDelete={handleDeleteSubcategory}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      ) : (
        // Vista de grid simple
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))',
          gap: '24px'
        }}>
          {filteredSubcategories.map((subcategory) => (
            <SubcategoryCard 
              key={subcategory.id}
              subcategory={subcategory}
              selectedCategory={selectedCategory}
              onEdit={handleEditSubcategory}
              onDelete={handleDeleteSubcategory}
            />
          ))}
        </div>
      )}

      {filteredSubcategories.length === 0 && (
        <div style={{
          textAlign: 'center',
          padding: '64px 24px',
          color: '#94a3b8'
        }}>
          <div style={{ fontSize: '48px', marginBottom: '16px' }}>📁</div>
          <h3 style={{ fontSize: '20px', marginBottom: '8px' }}>
            No se encontraron subcategorías
          </h3>
          <p style={{ fontSize: '16px' }}>
            {searchTerm ? 'Intenta con otros términos de búsqueda' : 'Comienza creando tu primera subcategoría'}
          </p>
        </div>
      )}
    </div>
  );
};

// Componente reutilizable para las cards de subcategorías
const SubcategoryCard = ({ subcategory, selectedCategory, onEdit, onDelete }) => {
  return (
    <div
      onClick={() => {
        // Aquí navegaremos a la gestión de cursos de esta subcategoría
        console.log('Navegando a cursos de:', subcategory.name);
        // En el futuro: onSubcategoryClick(subcategory.id)
      }}
      style={{
        background: 'linear-gradient(135deg, rgba(15, 23, 42, 0.9) 0%, rgba(30, 41, 59, 0.8) 100%)',
        borderRadius: '16px',
        border: `1px solid ${selectedCategory.color}60`,
        padding: '24px',
        transition: 'all 0.3s ease',
        backdropFilter: 'blur(10px)',
        position: 'relative',
        overflow: 'hidden',
        cursor: 'pointer'
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = 'translateY(-4px)';
        e.currentTarget.style.boxShadow = `0 12px 40px ${selectedCategory.color}40`;
        e.currentTarget.style.borderColor = `${selectedCategory.color}80`;
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'translateY(0)';
        e.currentTarget.style.boxShadow = 'none';
        e.currentTarget.style.borderColor = `${selectedCategory.color}60`;
      }}
    >
      {/* Color accent bar */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        height: '4px',
        background: `linear-gradient(90deg, ${selectedCategory.color}, ${selectedCategory.color}80)`
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
            background: selectedCategory.color,
            boxShadow: `0 0 10px ${selectedCategory.color}60`
          }} />
          <h3 style={{
            color: 'white',
            fontSize: '18px',
            fontWeight: '700',
            margin: 0
          }}>
            {subcategory.name}
          </h3>
        </div>
        
        <div style={{
          display: 'flex',
          gap: '8px'
        }}>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onEdit(subcategory);
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
          {subcategory.coursesCount === 0 && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onDelete(subcategory.id);
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
        {subcategory.description}
      </p>

      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '12px'
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
            <span>📚</span>
            <span style={{ fontWeight: '600', color: selectedCategory.color }}>
              {subcategory.coursesCount}
            </span>
            <span>cursos</span>
          </div>
          
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            color: '#94a3b8',
            fontSize: '14px'
          }}>
            <span>✅</span>
            <span style={{ fontWeight: '600', color: '#10b981' }}>
              {subcategory.requiredCourses}
            </span>
            <span>requerido{subcategory.requiredCourses !== 1 ? 's' : ''}</span>
          </div>
        </div>
        
        {selectedCategory.cycleAssociation && (
          <div style={{
            padding: '4px 8px',
            borderRadius: '12px',
            background: `${selectedCategory.color}20`,
            color: selectedCategory.color,
            fontSize: '12px',
            fontWeight: '600'
          }}>
            Ciclo {subcategory.cycle}
          </div>
        )}
      </div>

      {subcategory.coursesCount > 0 && (
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
          No se puede eliminar: tiene cursos asociados
        </div>
      )}

      {/* Indicador visual de que es clickeable */}
      <div style={{
        position: 'absolute',
        bottom: '12px',
        right: '12px',
        color: selectedCategory.color,
        fontSize: '16px',
        opacity: 0.6
      }}>
        →
      </div>
    </div>
  );
};

export default SubcategoriesTab;