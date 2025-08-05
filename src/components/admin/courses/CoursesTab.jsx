import React, { useState } from 'react';

const CoursesTab = ({ selectedSubcategoryId = 1 }) => {
  // Datos mock - en producción vendrían del backend
  const [selectedSubcategory] = useState({
    id: 1,
    name: 'Electivo de Humanidades 1',
    categoryName: 'Electivo',
    description: 'Cursos de desarrollo personal y habilidades blandas',
    cycle: 2,
    color: '#8b5cf6',
    requiredCourses: 1,
    isElective: true
  });

  const [courses, setCourses] = useState([
    {
      id: 1,
      code: 'HUM101',
      name: 'Motivación y Liderazgo',
      description: 'Desarrollo de habilidades de liderazgo y motivación personal y profesional',
      credits: 3,
      hours: {
        theory: 2,
        practice: 2,
        lab: 0
      },
      prerequisites: [],
      minGradePrereqs: [],
      corequisites: [],
      cycle: 2,
      isActive: true,
      scheduledCycles: ['2024-1', '2024-2', '2025-1'], // Ciclos en los que se ha dictado
      createdAt: '2024-01-15'
    },
    {
      id: 2,
      code: 'HUM102',
      name: 'Desarrollo de Habilidades Personales',
      description: 'Fortalecimiento de competencias interpersonales y comunicativas',
      credits: 3,
      hours: {
        theory: 2,
        practice: 2,
        lab: 0
      },
      prerequisites: [],
      minGradePrereqs: [],
      corequisites: [],
      cycle: 2,
      isActive: true,
      scheduledCycles: ['2024-2', '2025-1'],
      createdAt: '2024-01-20'
    },
    {
      id: 3,
      code: 'HUM103',
      name: 'Ética Profesional',
      description: 'Principios éticos aplicados al ejercicio profesional en ingeniería',
      credits: 2,
      hours: {
        theory: 2,
        practice: 0,
        lab: 0
      },
      prerequisites: ['c1', 'm1'], // IDs de cursos prerequisito
      minGradePrereqs: [
        { courseId: 'f1', minGrade: 13 }
      ],
      corequisites: ['i1'],
      cycle: 2,
      isActive: false,
      scheduledCycles: [],
      createdAt: '2024-02-01'
    }
  ]);

  // Simulamos todos los cursos disponibles para prerrequisitos
  const [allCourses] = useState([
    { id: 'c1', code: 'MAT101', name: 'Cálculo 1', cycle: 1 },
    { id: 'm1', code: 'FIS101', name: 'Física 1', cycle: 1 },
    { id: 'f1', code: 'QUI101', name: 'Química General', cycle: 1 },
    { id: 'i1', code: 'ING101', name: 'Introducción a la Ingeniería', cycle: 1 },
    { id: 'prog1', code: 'COM101', name: 'Programación 1', cycle: 2 }
  ]);

  const [professors] = useState([
    'Dr. Angelo Velarde',
    'Dr. Juan Huapaya', 
    'Dr. Carlos Mendoza',
    'Dra. Ana Vásquez',
    'Dr. Luis Torres',
    'Dra. María González',
    'Ing. Roberto Silva'
  ]);

  const [showScheduleManager, setShowScheduleManager] = useState(false);
  const [selectedCourseForSchedule, setSelectedCourseForSchedule] = useState(null);

  const [showAddForm, setShowAddForm] = useState(false);
  const [editingCourse, setEditingCourse] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterActive, setFilterActive] = useState('all'); // 'all', 'active', 'inactive'
  
  const [newCourse, setNewCourse] = useState({
    code: '',
    name: '',
    description: '',
    credits: 3,
    hours: { theory: 2, practice: 2, lab: 0 },
    prerequisites: [],
    minGradePrereqs: [],
    corequisites: [],
    cycle: selectedSubcategory.cycle,
    isActive: true
  });

  const filteredCourses = courses.filter(course => {
    const matchesSearch = course.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         course.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         course.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesFilter = filterActive === 'all' || 
                         (filterActive === 'active' && course.isActive) ||
                         (filterActive === 'inactive' && !course.isActive);
    
    return matchesSearch && matchesFilter;
  });

  const handleAddCourse = () => {
    if (newCourse.name.trim() && newCourse.code.trim()) {
      const course = {
        id: Date.now(),
        ...newCourse,
        scheduledCycles: [], // Inicialmente sin horarios programados
        createdAt: new Date().toISOString().split('T')[0]
      };
      setCourses([...courses, course]);
      resetForm();
    }
  };

  const handleEditCourse = (course) => {
    setEditingCourse(course);
    setNewCourse({ ...course });
    setShowAddForm(true);
  };

  const handleUpdateCourse = () => {
    setCourses(courses.map(course => 
      course.id === editingCourse.id ? { ...newCourse, id: editingCourse.id } : course
    ));
    resetForm();
  };

  const handleDeleteCourse = (id) => {
    if (window.confirm('¿Estás seguro de eliminar este curso? Esta acción no se puede deshacer.')) {
      setCourses(courses.filter(course => course.id !== id));
    }
  };

  const resetForm = () => {
    setShowAddForm(false);
    setEditingCourse(null);
    setNewCourse({
      code: '',
      name: '',
      description: '',
      credits: 3,
      hours: { theory: 2, practice: 2, lab: 0 },
      prerequisites: [],
      minGradePrereqs: [],
      corequisites: [],
      cycle: selectedSubcategory.cycle,
      isActive: true
    });
  };

  const handleScheduleManager = (course) => {
    setSelectedCourseForSchedule(course);
    setShowScheduleManager(true);
  };

  const addPrerequisite = (type, courseId, minGrade = null) => {
    if (type === 'prerequisite') {
      setNewCourse({
        ...newCourse,
        prerequisites: [...newCourse.prerequisites, courseId]
      });
    } else if (type === 'minGrade') {
      setNewCourse({
        ...newCourse,
        minGradePrereqs: [...newCourse.minGradePrereqs, { courseId, minGrade }]
      });
    } else if (type === 'corequisite') {
      setNewCourse({
        ...newCourse,
        corequisites: [...newCourse.corequisites, courseId]
      });
    }
  };

  const removePrerequisite = (type, index) => {
    if (type === 'prerequisite') {
      setNewCourse({
        ...newCourse,
        prerequisites: newCourse.prerequisites.filter((_, i) => i !== index)
      });
    } else if (type === 'minGrade') {
      setNewCourse({
        ...newCourse,
        minGradePrereqs: newCourse.minGradePrereqs.filter((_, i) => i !== index)
      });
    } else if (type === 'corequisite') {
      setNewCourse({
        ...newCourse,
        corequisites: newCourse.corequisites.filter((_, i) => i !== index)
      });
    }
  };

  const getCourseById = (courseId) => {
    return allCourses.find(c => c.id === courseId) || { code: courseId, name: 'Curso no encontrado' };
  };

  const totalHours = newCourse.hours.theory + newCourse.hours.practice + newCourse.hours.lab;

  return (
    <div style={{ padding: '32px' }}>
      {/* Breadcrumb Navigation */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        marginBottom: '24px',
        fontSize: '14px',
        color: '#94a3b8',
        flexWrap: 'wrap'
      }}>
        <button
          onClick={() => console.log('Volver a categorías')}
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
        <button
          onClick={() => console.log('Volver a subcategorías')}
          style={{
            background: 'none',
            border: 'none',
            color: '#06b6d4',
            cursor: 'pointer',
            fontSize: '14px',
            textDecoration: 'underline'
          }}
        >
          📁 {selectedSubcategory.categoryName}
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
            background: selectedSubcategory.color
          }} />
          <span style={{ color: 'white', fontWeight: '500' }}>
            {selectedSubcategory.name}
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
            background: `linear-gradient(to right, ${selectedSubcategory.color}, ${selectedSubcategory.color}80)`,
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            margin: 0,
            marginBottom: '8px'
          }}>
            📚 Cursos de {selectedSubcategory.name}
          </h2>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flexWrap: 'wrap' }}>
            <p style={{ color: '#94a3b8', margin: 0, fontSize: '16px' }}>
              {selectedSubcategory.description}
            </p>
            {selectedSubcategory.isElective && (
              <span style={{
                padding: '4px 12px',
                borderRadius: '12px',
                background: `${selectedSubcategory.color}20`,
                color: selectedSubcategory.color,
                fontSize: '12px',
                fontWeight: '600'
              }}>
                ✅ {selectedSubcategory.requiredCourses} curso{selectedSubcategory.requiredCourses !== 1 ? 's' : ''} requerido{selectedSubcategory.requiredCourses !== 1 ? 's' : ''}
              </span>
            )}
          </div>
        </div>
        
        <button
          onClick={() => setShowAddForm(true)}
          style={{
            padding: '12px 24px',
            borderRadius: '12px',
            border: 'none',
            background: `linear-gradient(135deg, ${selectedSubcategory.color}, ${selectedSubcategory.color}80)`,
            color: 'white',
            cursor: 'pointer',
            fontSize: '16px',
            fontWeight: '600',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            transition: 'all 0.3s ease',
            boxShadow: `0 4px 15px ${selectedSubcategory.color}30`
          }}
          onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-2px)'}
          onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
        >
          <span style={{ fontSize: '18px' }}>+</span>
          Nuevo Curso
        </button>
      </div>

      {/* Filters and Search */}
      <div style={{
        display: 'flex',
        gap: '16px',
        marginBottom: '24px',
        flexWrap: 'wrap'
      }}>
        <input
          type="text"
          placeholder="🔍 Buscar cursos..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{
            flex: 1,
            minWidth: '250px',
            padding: '12px 16px',
            borderRadius: '8px',
            border: '1px solid rgba(148, 163, 184, 0.3)',
            background: 'rgba(30, 41, 59, 0.6)',
            color: 'white',
            fontSize: '14px',
            outline: 'none'
          }}
        />
        
        <select
          value={filterActive}
          onChange={(e) => setFilterActive(e.target.value)}
          style={{
            padding: '12px 16px',
            borderRadius: '8px',
            border: '1px solid rgba(148, 163, 184, 0.3)',
            background: 'rgba(30, 41, 59, 0.6)',
            color: 'white',
            fontSize: '14px',
            outline: 'none'
          }}
        >
          <option value="all">Todos los cursos</option>
          <option value="active">Solo activos</option>
          <option value="inactive">Solo inactivos</option>
        </select>
      </div>

      {/* Add/Edit Form */}
      {showAddForm && (
        <div style={{
          background: `linear-gradient(135deg, ${selectedSubcategory.color}10 0%, rgba(30, 41, 59, 0.8) 100%)`,
          borderRadius: '16px',
          border: `1px solid ${selectedSubcategory.color}40`,
          padding: '24px',
          marginBottom: '24px',
          backdropFilter: 'blur(10px)'
        }}>
          <h3 style={{
            color: '#67e8f9',
            marginBottom: '24px',
            fontSize: '20px',
            fontWeight: '600'
          }}>
            {editingCourse ? '✏️ Editar Curso' : '✨ Nuevo Curso'}
          </h3>
          
          {/* Basic Information */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
            gap: '20px',
            marginBottom: '24px'
          }}>
            <div>
              <label style={{ color: '#cbd5e1', fontSize: '14px', marginBottom: '8px', display: 'block' }}>
                Código del curso *
              </label>
              <input
                type="text"
                value={newCourse.code}
                onChange={(e) => setNewCourse({...newCourse, code: e.target.value.toUpperCase()})}
                placeholder="Ej: TEL301, HUM101..."
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
                Nombre del curso *
              </label>
              <input
                type="text"
                value={newCourse.name}
                onChange={(e) => setNewCourse({...newCourse, name: e.target.value})}
                placeholder="Ej: Redes de Telecomunicaciones..."
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
                Créditos
              </label>
              <input
                type="number"
                min="1"
                max="6"
                value={newCourse.credits}
                onChange={(e) => setNewCourse({...newCourse, credits: parseInt(e.target.value)})}
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
                Los profesores se asignan en la gestión de horarios
              </p>
            </div>
          </div>

          {/* Hours Distribution */}
          <div style={{ marginBottom: '24px' }}>
            <label style={{ color: '#cbd5e1', fontSize: '14px', marginBottom: '12px', display: 'block' }}>
              Distribución de horas semanales
            </label>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))',
              gap: '16px',
              padding: '16px',
              background: 'rgba(15, 23, 42, 0.4)',
              borderRadius: '8px',
              border: '1px solid rgba(148, 163, 184, 0.2)'
            }}>
              <div>
                <label style={{ color: '#94a3b8', fontSize: '12px', marginBottom: '6px', display: 'block' }}>
                  Teoría
                </label>
                <input
                  type="number"
                  min="0"
                  max="6"
                  value={newCourse.hours.theory}
                  onChange={(e) => setNewCourse({
                    ...newCourse, 
                    hours: {...newCourse.hours, theory: parseInt(e.target.value)}
                  })}
                  style={{
                    width: '100%',
                    padding: '8px 12px',
                    borderRadius: '6px',
                    border: '1px solid rgba(148, 163, 184, 0.3)',
                    background: 'rgba(30, 41, 59, 0.6)',
                    color: 'white',
                    fontSize: '14px',
                    outline: 'none'
                  }}
                />
              </div>
              <div>
                <label style={{ color: '#94a3b8', fontSize: '12px', marginBottom: '6px', display: 'block' }}>
                  Práctica
                </label>
                <input
                  type="number"
                  min="0"
                  max="6"
                  value={newCourse.hours.practice}
                  onChange={(e) => setNewCourse({
                    ...newCourse, 
                    hours: {...newCourse.hours, practice: parseInt(e.target.value)}
                  })}
                  style={{
                    width: '100%',
                    padding: '8px 12px',
                    borderRadius: '6px',
                    border: '1px solid rgba(148, 163, 184, 0.3)',
                    background: 'rgba(30, 41, 59, 0.6)',
                    color: 'white',
                    fontSize: '14px',
                    outline: 'none'
                  }}
                />
              </div>
              <div>
                <label style={{ color: '#94a3b8', fontSize: '12px', marginBottom: '6px', display: 'block' }}>
                  Laboratorio
                </label>
                <input
                  type="number"
                  min="0"
                  max="4"
                  value={newCourse.hours.lab}
                  onChange={(e) => setNewCourse({
                    ...newCourse, 
                    hours: {...newCourse.hours, lab: parseInt(e.target.value)}
                  })}
                  style={{
                    width: '100%',
                    padding: '8px 12px',
                    borderRadius: '6px',
                    border: '1px solid rgba(148, 163, 184, 0.3)',
                    background: 'rgba(30, 41, 59, 0.6)',
                    color: 'white',
                    fontSize: '14px',
                    outline: 'none'
                  }}
                />
              </div>
              <div style={{
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                color: selectedSubcategory.color,
                fontWeight: '600'
              }}>
                <span style={{ fontSize: '12px', color: '#94a3b8' }}>Total</span>
                <span style={{ fontSize: '16px' }}>{totalHours}h</span>
              </div>
            </div>
          </div>

          {/* Description */}
          <div style={{ marginBottom: '24px' }}>
            <label style={{ color: '#cbd5e1', fontSize: '14px', marginBottom: '8px', display: 'block' }}>
              Descripción del curso
            </label>
            <textarea
              value={newCourse.description}
              onChange={(e) => setNewCourse({...newCourse, description: e.target.value})}
              placeholder="Describe los objetivos, contenido y metodología del curso..."
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

          {/* Prerequisites Section */}
          <PrerequisitesSection 
            newCourse={newCourse}
            allCourses={allCourses}
            selectedSubcategory={selectedSubcategory}
            addPrerequisite={addPrerequisite}
            removePrerequisite={removePrerequisite}
            getCourseById={getCourseById}
          />

          {/* Active Status */}
          <div style={{ marginBottom: '24px' }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px'
            }}>
              <input
                type="checkbox"
                id="isActive"
                checked={newCourse.isActive}
                onChange={(e) => setNewCourse({...newCourse, isActive: e.target.checked})}
                style={{
                  width: '18px',
                  height: '18px',
                  accentColor: selectedSubcategory.color,
                  cursor: 'pointer'
                }}
              />
              <label 
                htmlFor="isActive"
                style={{ 
                  color: '#cbd5e1', 
                  fontSize: '14px',
                  cursor: 'pointer',
                  userSelect: 'none'
                }}
              >
                Curso activo (disponible para matrícula)
              </label>
            </div>
          </div>

          {/* Form Actions */}
          <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
            <button
              onClick={resetForm}
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
              onClick={editingCourse ? handleUpdateCourse : handleAddCourse}
              disabled={!newCourse.name.trim() || !newCourse.code.trim()}
              style={{
                padding: '10px 20px',
                borderRadius: '8px',
                border: 'none',
                background: (!newCourse.name.trim() || !newCourse.code.trim()) 
                  ? 'rgba(148, 163, 184, 0.3)' 
                  : `linear-gradient(135deg, ${selectedSubcategory.color}, ${selectedSubcategory.color}80)`,
                color: 'white',
                cursor: (!newCourse.name.trim() || !newCourse.code.trim()) ? 'not-allowed' : 'pointer',
                fontSize: '14px',
                fontWeight: '600',
                opacity: (!newCourse.name.trim() || !newCourse.code.trim()) ? 0.5 : 1
              }}
            >
              {editingCourse ? 'Actualizar' : 'Crear'} Curso
            </button>
          </div>
        </div>
      )}

      {/* Courses Table */}
      <div style={{
        background: 'linear-gradient(135deg, rgba(15, 23, 42, 0.9) 0%, rgba(30, 41, 59, 0.8) 100%)',
        borderRadius: '16px',
        border: '1px solid rgba(148, 163, 184, 0.3)',
        overflow: 'hidden'
      }}>
        {/* Table Header */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 2fr 1fr 1.5fr 1fr 1.5fr',
          gap: '16px',
          padding: '20px',
          background: 'rgba(30, 41, 59, 0.6)',
          borderBottom: '1px solid rgba(148, 163, 184, 0.3)',
          fontWeight: '600',
          color: '#67e8f9',
          fontSize: '14px'
        }}>
          <div>Código</div>
          <div>Nombre del Curso</div>
          <div>Créditos</div>
          <div>Horas</div>
          <div>Estado</div>
          <div>Acciones</div>
        </div>
        
        {/* Table Rows */}
        {filteredCourses.map((course) => (
          <CourseRow 
            key={course.id}
            course={course}
            selectedSubcategory={selectedSubcategory}
            onEdit={handleEditCourse}
            onDelete={handleDeleteCourse}
            onScheduleManager={handleScheduleManager}
            getCourseById={getCourseById}
          />
        ))}
      </div>

      {filteredCourses.length === 0 && (
        <div style={{
          textAlign: 'center',
          padding: '64px 24px',
          color: '#94a3b8'
        }}>
          <div style={{ fontSize: '48px', marginBottom: '16px' }}>📚</div>
          <h3 style={{ fontSize: '20px', marginBottom: '8px' }}>
            No se encontraron cursos
          </h3>
          <p style={{ fontSize: '16px' }}>
            {searchTerm ? 'Intenta con otros términos de búsqueda' : 'Comienza creando tu primer curso'}
          </p>
        </div>
      )}

      {/* Course Schedule Manager Modal/Overlay */}
      {showScheduleManager && selectedCourseForSchedule && (
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
            border: `1px solid ${selectedSubcategory.color}60`,
            padding: '32px',
            maxWidth: '90vw',
            maxHeight: '90vh',
            overflow: 'auto',
            position: 'relative'
          }}>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '24px'
            }}>
              <h3 style={{
                color: selectedSubcategory.color,
                fontSize: '24px',
                fontWeight: '700',
                margin: 0
              }}>
                📅 Gestión de Horarios: {selectedCourseForSchedule.code}
              </h3>
              <button
                onClick={() => {
                  setShowScheduleManager(false);
                  setSelectedCourseForSchedule(null);
                }}
                style={{
                  background: 'rgba(239, 68, 68, 0.2)',
                  border: 'none',
                  borderRadius: '8px',
                  color: '#ef4444',
                  cursor: 'pointer',
                  fontSize: '18px',
                  padding: '8px 16px',
                  fontWeight: '600'
                }}
              >
                ✕ Cerrar
              </button>
            </div>
            
            {/* Placeholder for CourseScheduleManager component */}
            <div style={{
              textAlign: 'center',
              padding: '64px 24px',
              color: '#94a3b8'
            }}>
              <div style={{ fontSize: '48px', marginBottom: '16px' }}>🚧</div>
              <h4 style={{ fontSize: '20px', marginBottom: '8px', color: selectedSubcategory.color }}>
                CourseScheduleManager en desarrollo
              </h4>
              <p style={{ fontSize: '16px' }}>
                Aquí se gestionarán los ciclos y horarios del curso:<br/>
                <strong style={{ color: 'white' }}>{selectedCourseForSchedule.name}</strong>
              </p>
              <p style={{ fontSize: '14px', marginTop: '16px', fontStyle: 'italic' }}>
                Ciclos programados: {selectedCourseForSchedule.scheduledCycles.length > 0 
                  ? selectedCourseForSchedule.scheduledCycles.join(', ') 
                  : 'Ninguno aún'}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// Componente para la sección de prerrequisitos
const PrerequisitesSection = ({ newCourse, allCourses, selectedSubcategory, addPrerequisite, removePrerequisite, getCourseById }) => {
  const [selectedPrereqCourse, setSelectedPrereqCourse] = useState('');
  const [selectedMinGradeCourse, setSelectedMinGradeCourse] = useState('');
  const [minGradeValue, setMinGradeValue] = useState(11);
  const [selectedCoreqCourse, setSelectedCoreqCourse] = useState('');

  return (
    <div style={{ marginBottom: '24px' }}>
      <h4 style={{ color: '#67e8f9', fontSize: '16px', marginBottom: '16px' }}>
        🔗 Prerrequisitos y Correquisitos
      </h4>

      {/* Prerequisites (Aprobado) */}
      <div style={{ marginBottom: '20px' }}>
        <label style={{ color: '#cbd5e1', fontSize: '14px', marginBottom: '8px', display: 'block' }}>
          Prerrequisitos (debe estar aprobado)
        </label>
        <div style={{ display: 'flex', gap: '8px', marginBottom: '8px', flexWrap: 'wrap' }}>
          <select
            value={selectedPrereqCourse}
            onChange={(e) => setSelectedPrereqCourse(e.target.value)}
            style={{
              padding: '8px 12px',
              borderRadius: '6px',
              border: '1px solid rgba(148, 163, 184, 0.3)',
              background: 'rgba(15, 23, 42, 0.6)',
              color: 'white',
              fontSize: '12px',
              outline: 'none'
            }}
          >
            <option value="">Seleccionar curso...</option>
            {allCourses
              .filter(c => !newCourse.prerequisites.includes(c.id) && c.id !== newCourse.id)
              .map(course => (
                <option key={course.id} value={course.id}>
                  {course.code} - {course.name}
                </option>
              ))}
          </select>
          <button
            onClick={() => {
              if (selectedPrereqCourse) {
                addPrerequisite('prerequisite', selectedPrereqCourse);
                setSelectedPrereqCourse('');
              }
            }}
            style={{
              padding: '8px 12px',
              borderRadius: '6px',
              border: 'none',
              background: '#10b981',
              color: 'white',
              cursor: 'pointer',
              fontSize: '12px'
            }}
          >
            + Agregar
          </button>
        </div>
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          {newCourse.prerequisites.map((prereqId, index) => {
            const course = getCourseById(prereqId);
            return (
              <span
                key={index}
                style={{
                  padding: '4px 8px',
                  borderRadius: '12px',
                  background: '#10b98120',
                  color: '#10b981',
                  fontSize: '12px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px'
                }}
              >
                {course.code}
                <button
                  onClick={() => removePrerequisite('prerequisite', index)}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: '#10b981',
                    cursor: 'pointer',
                    fontSize: '10px',
                    padding: '0 2px'
                  }}
                >
                  ×
                </button>
              </span>
            );
          })}
        </div>
      </div>

      {/* Min Grade Prerequisites */}
      <div style={{ marginBottom: '20px' }}>
        <label style={{ color: '#cbd5e1', fontSize: '14px', marginBottom: '8px', display: 'block' }}>
          Prerrequisitos con nota mínima
        </label>
        <div style={{ display: 'flex', gap: '8px', marginBottom: '8px', flexWrap: 'wrap' }}>
          <select
            value={selectedMinGradeCourse}
            onChange={(e) => setSelectedMinGradeCourse(e.target.value)}
            style={{
              padding: '8px 12px',
              borderRadius: '6px',
              border: '1px solid rgba(148, 163, 184, 0.3)',
              background: 'rgba(15, 23, 42, 0.6)',
              color: 'white',
              fontSize: '12px',
              outline: 'none'
            }}
          >
            <option value="">Seleccionar curso...</option>
            {allCourses
              .filter(c => !newCourse.minGradePrereqs.some(mgp => mgp.courseId === c.id) && c.id !== newCourse.id)
              .map(course => (
                <option key={course.id} value={course.id}>
                  {course.code} - {course.name}
                </option>
              ))}
          </select>
          <input
            type="number"
            min="11"
            max="20"
            value={minGradeValue}
            onChange={(e) => setMinGradeValue(parseInt(e.target.value))}
            placeholder="Nota mín."
            style={{
              width: '80px',
              padding: '8px 12px',
              borderRadius: '6px',
              border: '1px solid rgba(148, 163, 184, 0.3)',
              background: 'rgba(15, 23, 42, 0.6)',
              color: 'white',
              fontSize: '12px',
              outline: 'none'
            }}
          />
          <button
            onClick={() => {
              if (selectedMinGradeCourse && minGradeValue >= 11) {
                addPrerequisite('minGrade', selectedMinGradeCourse, minGradeValue);
                setSelectedMinGradeCourse('');
                setMinGradeValue(11);
              }
            }}
            style={{
              padding: '8px 12px',
              borderRadius: '6px',
              border: 'none',
              background: '#f59e0b',
              color: 'white',
              cursor: 'pointer',
              fontSize: '12px'
            }}
          >
            + Agregar
          </button>
        </div>
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          {newCourse.minGradePrereqs.map((prereq, index) => {
            const course = getCourseById(prereq.courseId);
            return (
              <span
                key={index}
                style={{
                  padding: '4px 8px',
                  borderRadius: '12px',
                  background: '#f59e0b20',
                  color: '#f59e0b',
                  fontSize: '12px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px'
                }}
              >
                {course.code} (≥{prereq.minGrade})
                <button
                  onClick={() => removePrerequisite('minGrade', index)}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: '#f59e0b',
                    cursor: 'pointer',
                    fontSize: '10px',
                    padding: '0 2px'
                  }}
                >
                  ×
                </button>
              </span>
            );
          })}
        </div>
      </div>

      {/* Corequisites */}
      <div style={{ marginBottom: '20px' }}>
        <label style={{ color: '#cbd5e1', fontSize: '14px', marginBottom: '8px', display: 'block' }}>
          Correquisitos (debe cursarse simultáneamente)
        </label>
        <div style={{ display: 'flex', gap: '8px', marginBottom: '8px', flexWrap: 'wrap' }}>
          <select
            value={selectedCoreqCourse}
            onChange={(e) => setSelectedCoreqCourse(e.target.value)}
            style={{
              padding: '8px 12px',
              borderRadius: '6px',
              border: '1px solid rgba(148, 163, 184, 0.3)',
              background: 'rgba(15, 23, 42, 0.6)',
              color: 'white',
              fontSize: '12px',
              outline: 'none'
            }}
          >
            <option value="">Seleccionar curso...</option>
            {allCourses
              .filter(c => !newCourse.corequisites.includes(c.id) && c.id !== newCourse.id)
              .map(course => (
                <option key={course.id} value={course.id}>
                  {course.code} - {course.name}
                </option>
              ))}
          </select>
          <button
            onClick={() => {
              if (selectedCoreqCourse) {
                addPrerequisite('corequisite', selectedCoreqCourse);
                setSelectedCoreqCourse('');
              }
            }}
            style={{
              padding: '8px 12px',
              borderRadius: '6px',
              border: 'none',
              background: '#06b6d4',
              color: 'white',
              cursor: 'pointer',
              fontSize: '12px'
            }}
          >
            + Agregar
          </button>
        </div>
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          {newCourse.corequisites.map((coreqId, index) => {
            const course = getCourseById(coreqId);
            return (
              <span
                key={index}
                style={{
                  padding: '4px 8px',
                  borderRadius: '12px',
                  background: '#06b6d420',
                  color: '#06b6d4',
                  fontSize: '12px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px'
                }}
              >
                {course.code}
                <button
                  onClick={() => removePrerequisite('corequisite', index)}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: '#06b6d4',
                    cursor: 'pointer',
                    fontSize: '10px',
                    padding: '0 2px'
                  }}
                >
                  ×
                </button>
              </span>
            );
          })}
        </div>
      </div>
    </div>
  );
};

// Componente para las filas de la tabla de cursos
const CourseRow = ({ course, selectedSubcategory, onEdit, onDelete, onScheduleManager, getCourseById }) => {
  const [showDetails, setShowDetails] = useState(false);
  const totalHours = course.hours.theory + course.hours.practice + course.hours.lab;

  return (
    <>
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr 2fr 1fr 1.5fr 1fr 1.5fr',
          gap: '16px',
          padding: '16px 20px',
          borderBottom: '1px solid rgba(148, 163, 184, 0.1)',
          transition: 'background 0.2s ease',
          cursor: 'pointer'
        }}
        onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(6, 182, 212, 0.05)'}
        onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
        onClick={() => setShowDetails(!showDetails)}
      >
        <div style={{ 
          color: selectedSubcategory.color, 
          fontWeight: '600',
          fontSize: '14px'
        }}>
          {course.code}
        </div>
        <div style={{ color: '#cbd5e1', fontSize: '14px' }}>
          {course.name}
        </div>
        <div style={{ color: '#94a3b8', fontSize: '14px' }}>
          {course.credits}
        </div>
        <div style={{ color: '#94a3b8', fontSize: '14px' }}>
          {totalHours}h
          {course.scheduledCycles.length > 0 && (
            <div style={{ 
              fontSize: '11px', 
              color: selectedSubcategory.color,
              marginTop: '2px'
            }}>
              {course.scheduledCycles.length} ciclo{course.scheduledCycles.length !== 1 ? 's' : ''}
            </div>
          )}
        </div>
        <div>
          <span style={{
            padding: '4px 8px',
            borderRadius: '12px',
            background: course.isActive ? '#10b98120' : '#ef444420',
            color: course.isActive ? '#10b981' : '#ef4444',
            fontSize: '12px',
            fontWeight: '500'
          }}>
            {course.isActive ? '✅ Activo' : '❌ Inactivo'}
          </span>
        </div>
        <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onScheduleManager(course);
            }}
            style={{
              padding: '6px 12px',
              borderRadius: '6px',
              border: 'none',
              background: `${selectedSubcategory.color}20`,
              color: selectedSubcategory.color,
              cursor: 'pointer',
              fontSize: '12px',
              fontWeight: '500',
              transition: 'all 0.2s ease'
            }}
            onMouseEnter={(e) => e.currentTarget.style.background = `${selectedSubcategory.color}30`}
            onMouseLeave={(e) => e.currentTarget.style.background = `${selectedSubcategory.color}20`}
          >
            📅 Horarios
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onEdit(course);
            }}
            style={{
              padding: '6px 12px',
              borderRadius: '6px',
              border: 'none',
              background: 'rgba(16, 185, 129, 0.2)',
              color: '#10b981',
              cursor: 'pointer',
              fontSize: '12px',
              fontWeight: '500'
            }}
          >
            ✏️ Editar
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onDelete(course.id);
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
        </div>
      </div>

      {/* Expanded Details */}
      {showDetails && (
        <div style={{
          gridColumn: '1 / -1',
          padding: '20px',
          background: 'rgba(15, 23, 42, 0.6)',
          borderBottom: '1px solid rgba(148, 163, 184, 0.1)'
        }}>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: '20px'
          }}>
            {/* Description */}
            <div>
              <h5 style={{ color: '#67e8f9', fontSize: '14px', marginBottom: '8px' }}>
                📝 Descripción
              </h5>
              <p style={{ color: '#cbd5e1', fontSize: '13px', lineHeight: '1.4' }}>
                {course.description || 'Sin descripción disponible'}
              </p>
            </div>

            {/* Hours Breakdown */}
            <div>
              <h5 style={{ color: '#67e8f9', fontSize: '14px', marginBottom: '8px' }}>
                ⏰ Distribución de Horas
              </h5>
              <div style={{ display: 'flex', gap: '16px', fontSize: '13px' }}>
                <div style={{ color: '#cbd5e1' }}>
                  <span style={{ color: '#94a3b8' }}>Teoría:</span> {course.hours.theory}h
                </div>
                <div style={{ color: '#cbd5e1' }}>
                  <span style={{ color: '#94a3b8' }}>Práctica:</span> {course.hours.practice}h
                </div>
                <div style={{ color: '#cbd5e1' }}>
                  <span style={{ color: '#94a3b8' }}>Lab:</span> {course.hours.lab}h
                </div>
              </div>
            </div>

            {/* Prerequisites */}
            {(course.prerequisites.length > 0 || course.minGradePrereqs.length > 0 || course.corequisites.length > 0) && (
              <div>
                <h5 style={{ color: '#67e8f9', fontSize: '14px', marginBottom: '8px' }}>
                  🔗 Requisitos
                </h5>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  {course.prerequisites.length > 0 && (
                    <div style={{ fontSize: '12px' }}>
                      <span style={{ color: '#10b981' }}>Prerrequisitos:</span>{' '}
                      {course.prerequisites.map(prereqId => getCourseById(prereqId).code).join(', ')}
                    </div>
                  )}
                  {course.minGradePrereqs.length > 0 && (
                    <div style={{ fontSize: '12px' }}>
                      <span style={{ color: '#f59e0b' }}>Nota mínima:</span>{' '}
                      {course.minGradePrereqs.map(prereq => 
                        `${getCourseById(prereq.courseId).code} (≥${prereq.minGrade})`
                      ).join(', ')}
                    </div>
                  )}
                  {course.corequisites.length > 0 && (
                    <div style={{ fontSize: '12px' }}>
                      <span style={{ color: '#06b6d4' }}>Correquisitos:</span>{' '}
                      {course.corequisites.map(coreqId => getCourseById(coreqId).code).join(', ')}
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default CoursesTab;