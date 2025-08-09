import React, { useState, useEffect } from 'react';

const CoursesTab = ({ selectedSubcategory, onCourseSelect, onBack }) => {
  // Mock data para cursos
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
      isVisible: true, // Cambié isActive por isVisible (equivalente a no oculto)
      isFrozen: false,
      scheduledCycles: ['2024-1', '2024-2', '2025-1'],
      schedulesCount: 3,
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
      isVisible: true,
      isFrozen: false,
      scheduledCycles: ['2024-2', '2025-1'],
      schedulesCount: 2,
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
      prerequisites: ['c1', 'm1'],
      minGradePrereqs: [
        { courseId: 'f1', minGrade: 13 }
      ],
      corequisites: ['i1'],
      cycle: 2,
      isVisible: false, // Curso oculto
      isFrozen: true, // Curso congelado
      scheduledCycles: [],
      schedulesCount: 0,
      createdAt: '2024-02-01'
    }
  ]);

  // Mock data para horarios por curso
  const [schedulesByCourse] = useState({
    1: [
      {
        id: 1,
        cycle: '2024-1',
        name: 'Horario Principal',
        days: ['Lunes 08:00-10:00', 'Miércoles 08:00-10:00'],
        professors: ['Dr. Angelo Velarde', 'Dr. Juan Huapaya'],
        classroom: 'Aula 201',
        enrolledStudents: 25
      },
      {
        id: 2,
        cycle: '2024-2',
        name: 'Horario Principal',
        days: ['Martes 10:00-12:00', 'Jueves 10:00-12:00'],
        professors: ['Dr. Angelo Velarde'],
        classroom: 'Aula 305',
        enrolledStudents: 30
      }
    ],
    2: [
      {
        id: 3,
        cycle: '2024-2',
        name: 'Horario Mañana',
        days: ['Lunes 08:00-10:00'],
        professors: ['Dra. Ana Vásquez'],
        classroom: 'Aula 102',
        enrolledStudents: 20
      }
    ],
    3: [] // Sin horarios
  });

  // Simulamos todos los cursos disponibles para prerrequisitos
  const [allCourses] = useState([
    { id: 'c1', code: 'MAT101', name: 'Cálculo 1', cycle: 1 },
    { id: 'm1', code: 'FIS101', name: 'Física 1', cycle: 1 },
    { id: 'f1', code: 'QUI101', name: 'Química General', cycle: 1 },
    { id: 'i1', code: 'ING101', name: 'Introducción a la Ingeniería', cycle: 1 },
    { id: 'prog1', code: 'COM101', name: 'Programación 1', cycle: 2 }
  ]);

  // Estados del componente
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingCourse, setEditingCourse] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterVisible, setFilterVisible] = useState('all'); // 'all', 'visible', 'hidden'
  const [selectedCourseInfo, setSelectedCourseInfo] = useState(null);
  const [showScheduleManager, setShowScheduleManager] = useState(false);
  
  // Estados para modales de confirmación
  const [showFreezeConfirmation, setShowFreezeConfirmation] = useState(null);
  const [showUnfreezeConfirmation, setShowUnfreezeConfirmation] = useState(null);
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(null);
  const [confirmationTimer, setConfirmationTimer] = useState(10);
  const [canConfirm, setCanConfirm] = useState(false);
  
  const [newCourse, setNewCourse] = useState({
    code: '',
    name: '',
    description: '',
    credits: 3,
    hours: { theory: 2, practice: 2, lab: 0 },
    prerequisites: [],
    minGradePrereqs: [],
    corequisites: [],
    cycle: selectedSubcategory?.cycle || 1,
    isVisible: true
  });

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

  // Funciones auxiliares
  const resetConfirmationState = () => {
    setShowFreezeConfirmation(null);
    setShowUnfreezeConfirmation(null);
    setShowDeleteConfirmation(null);
    setConfirmationTimer(10);
    setCanConfirm(false);
  };

  const getStatusColor = (course) => {
    if (course.isFrozen || selectedSubcategory?.isFrozen) return '#64748b';
    if (!course.isVisible) return '#f59e0b';
    return selectedSubcategory?.color || '#8b5cf6';
  };

  const getStatusIcon = (course) => {
    if (course.isFrozen || selectedSubcategory?.isFrozen) return '❄️';
    if (!course.isVisible) return '👁️‍🗨️';
    return '✅';
  };

  const getCourseById = (courseId) => {
    return allCourses.find(c => c.id === courseId) || { code: courseId, name: 'Curso no encontrado' };
  };

  // Filtros
  const filteredCourses = courses.filter(course => {
    const matchesSearch = course.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         course.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         course.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesFilter = filterVisible === 'all' || 
                         (filterVisible === 'visible' && course.isVisible) ||
                         (filterVisible === 'hidden' && !course.isVisible);
    
    return matchesSearch && matchesFilter;
  });

  // Handlers
  const handleAddCourse = () => {
    if (newCourse.name.trim() && newCourse.code.trim()) {
      const course = {
        id: Date.now(),
        ...newCourse,
        isFrozen: false,
        scheduledCycles: [],
        schedulesCount: 0,
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

  const handleDeleteCourse = (course) => {
    setShowDeleteConfirmation(course);
  };

  const confirmDeleteCourse = () => {
    setCourses(courses.filter(course => course.id !== showDeleteConfirmation.id));
    resetConfirmationState();
  };

  const handleFreezeCourse = (course) => {
    setShowFreezeConfirmation(course);
  };

  const confirmFreezeCourse = () => {
    setCourses(courses.map(course => 
      course.id === showFreezeConfirmation.id ? { ...course, isFrozen: true } : course
    ));
    resetConfirmationState();
  };

  const handleUnfreezeCourse = (course) => {
    setShowUnfreezeConfirmation(course);
  };

  const confirmUnfreezeCourse = () => {
    setCourses(courses.map(course => 
      course.id === showUnfreezeConfirmation.id ? { ...course, isFrozen: false } : course
    ));
    resetConfirmationState();
  };

  const handleToggleVisible = (courseId) => {
    setCourses(courses.map(course => 
      course.id === courseId ? { ...course, isVisible: !course.isVisible } : course
    ));
  };

  const handleCourseClick = (course) => {
    if (course.isFrozen || selectedSubcategory?.isFrozen) return;
    
    if (selectedCourseInfo?.id === course.id) {
      onCourseSelect(course);
    } else {
      setSelectedCourseInfo(course);
    }
  };

  const handleScheduleManager = (course) => {
    setSelectedCourseInfo(course);
    setShowScheduleManager(true);
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
      cycle: selectedSubcategory?.cycle || 1,
      isVisible: true
    });
  };

  // Si la subcategoría padre está congelada
  if (selectedSubcategory?.isFrozen) {
    return (
      <div style={{ padding: '32px' }}>
        <div style={{
          textAlign: 'center',
          padding: '64px 24px',
          background: 'rgba(100, 116, 139, 0.1)',
          borderRadius: '16px',
          border: '1px solid rgba(100, 116, 139, 0.3)'
        }}>
          <div style={{ fontSize: '48px', marginBottom: '16px' }}>❄️</div>
          <h3 style={{ fontSize: '24px', marginBottom: '8px', color: '#64748b' }}>
            Subcategoría Congelada
          </h3>
          <p style={{ fontSize: '16px', color: '#94a3b8', marginBottom: '24px' }}>
            La subcategoría "{selectedSubcategory.name}" está congelada. No se pueden realizar acciones en sus cursos.
          </p>
          <button
            onClick={onBack}
            style={{
              padding: '12px 24px',
              borderRadius: '8px',
              border: 'none',
              background: 'rgba(148, 163, 184, 0.3)',
              color: '#cbd5e1',
              cursor: 'pointer',
              fontSize: '14px'
            }}
          >
            ← Volver a Subcategorías
          </button>
        </div>
      </div>
    );
  }

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
          onClick={onBack}
          style={{
            background: 'none',
            border: 'none',
            color: '#06b6d4',
            cursor: 'pointer',
            fontSize: '14px',
            textDecoration: 'underline'
          }}
        >
          📁 Subcategorías
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
            background: selectedSubcategory?.color || '#8b5cf6'
          }} />
          <span style={{ color: 'white', fontWeight: '500' }}>
            {selectedSubcategory?.name || 'Subcategoría no seleccionada'}
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
            background: `linear-gradient(to right, ${selectedSubcategory?.color || '#8b5cf6'}, ${selectedSubcategory?.color || '#8b5cf6'}80)`,
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            margin: 0,
            marginBottom: '8px'
          }}>
            📚 Cursos de {selectedSubcategory?.name}
          </h2>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flexWrap: 'wrap' }}>
            <p style={{ color: '#94a3b8', margin: 0, fontSize: '16px' }}>
              {selectedSubcategory?.description}
            </p>
            {selectedSubcategory?.requiredCourses && (
              <span style={{
                padding: '4px 12px',
                borderRadius: '12px',
                background: `${selectedSubcategory?.color || '#8b5cf6'}20`,
                color: selectedSubcategory?.color || '#8b5cf6',
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
            background: `linear-gradient(135deg, ${selectedSubcategory?.color || '#8b5cf6'}, ${selectedSubcategory?.color || '#8b5cf6'}80)`,
            color: 'white',
            cursor: 'pointer',
            fontSize: '16px',
            fontWeight: '600',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            transition: 'all 0.3s ease',
            boxShadow: `0 4px 15px ${selectedSubcategory?.color || '#8b5cf6'}30`
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
          value={filterVisible}
          onChange={(e) => setFilterVisible(e.target.value)}
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
          <option value="visible">Solo visibles</option>
          <option value="hidden">Solo ocultos</option>
        </select>
      </div>

      {/* Add/Edit Form */}
      {showAddForm && (
        <CourseForm
          newCourse={newCourse}
          setNewCourse={setNewCourse}
          selectedSubcategory={selectedSubcategory}
          allCourses={allCourses}
          editingCourse={editingCourse}
          onSave={editingCourse ? handleUpdateCourse : handleAddCourse}
          onCancel={resetForm}
          getCourseById={getCourseById}
        />
      )}

      {/* Main Content Layout */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: selectedCourseInfo ? '1fr 400px' : '1fr',
        gap: '32px'
      }}>
        
        {/* Courses Grid */}
        <div>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))',
            gap: '24px'
          }}>
            {filteredCourses.map((course) => (
              <CourseCard
                key={course.id}
                course={course}
                selectedSubcategory={selectedSubcategory}
                isSelected={selectedCourseInfo?.id === course.id}
                onSelect={() => handleCourseClick(course)}
                onEdit={() => handleEditCourse(course)}
                onDelete={() => handleDeleteCourse(course)}
                onFreeze={() => handleFreezeCourse(course)}
                onUnfreeze={() => handleUnfreezeCourse(course)}
                onToggleVisible={() => handleToggleVisible(course.id)}
                onScheduleManager={() => handleScheduleManager(course)}
                getStatusColor={getStatusColor}
                getStatusIcon={getStatusIcon}
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
        </div>

        {/* Course Details Panel */}
        {selectedCourseInfo && !showScheduleManager && (
          <CourseDetailsPanel
            course={selectedCourseInfo}
            schedules={schedulesByCourse[selectedCourseInfo.id] || []}
            selectedSubcategory={selectedSubcategory}
            onClose={() => setSelectedCourseInfo(null)}
            onNavigateToSchedules={() => onCourseSelect(selectedCourseInfo)}
            onScheduleManager={() => setShowScheduleManager(true)}
            getStatusColor={getStatusColor}
            getCourseById={getCourseById}
          />
        )}

        {/* Schedule Manager Panel */}
        {selectedCourseInfo && showScheduleManager && (
          <ScheduleManagerPanel
            course={selectedCourseInfo}
            schedules={schedulesByCourse[selectedCourseInfo.id] || []}
            selectedSubcategory={selectedSubcategory}
            onClose={() => {
              setShowScheduleManager(false);
              setSelectedCourseInfo(null);
            }}
            onBackToDetails={() => setShowScheduleManager(false)}
          />
        )}
      </div>

      {/* Confirmation Modals */}
      {(showFreezeConfirmation || showUnfreezeConfirmation || showDeleteConfirmation) && (
        <ConfirmationModal
          type={showFreezeConfirmation ? 'freeze' : showUnfreezeConfirmation ? 'unfreeze' : 'delete'}
          item={showFreezeConfirmation || showUnfreezeConfirmation || showDeleteConfirmation}
          itemType="curso"
          timer={confirmationTimer}
          canConfirm={canConfirm}
          onConfirm={showFreezeConfirmation ? confirmFreezeCourse : showUnfreezeConfirmation ? confirmUnfreezeCourse : confirmDeleteCourse}
          onCancel={resetConfirmationState}
        />
      )}
    </div>
  );
};


const CourseCard = ({ 
  course, selectedSubcategory, isSelected, onSelect, onEdit, onDelete, onFreeze, onUnfreeze, onToggleVisible, onScheduleManager,
  getStatusColor, getStatusIcon, getCourseById 
}) => {
  const canDelete = course.schedulesCount === 0;
  const isDisabled = course.isFrozen || selectedSubcategory?.isFrozen;
  const totalHours = course.hours.theory + course.hours.practice + course.hours.lab;
  
  return (
    <div
      onClick={onSelect}
      style={{
        background: 'linear-gradient(135deg, rgba(15, 23, 42, 0.9) 0%, rgba(30, 41, 59, 0.8) 100%)',
        borderRadius: '16px',
        border: `2px solid ${isSelected ? getStatusColor(course) : `${getStatusColor(course)}60`}`,
        padding: '24px',
        transition: 'all 0.3s ease',
        backdropFilter: 'blur(10px)',
        position: 'relative',
        overflow: 'hidden',
        cursor: isDisabled ? 'not-allowed' : 'pointer',
        opacity: isDisabled ? 0.7 : 1,
        transform: isSelected ? 'scale(1.02)' : 'scale(1)',
        boxShadow: isSelected ? `0 8px 30px ${getStatusColor(course)}40` : 'none'
      }}
      onMouseEnter={(e) => {
        if (!isDisabled) {
          e.currentTarget.style.transform = isSelected ? 'scale(1.02)' : 'translateY(-4px)';
          e.currentTarget.style.boxShadow = `0 12px 40px ${getStatusColor(course)}40`;
        }
      }}
      onMouseLeave={(e) => {
        if (!isDisabled) {
          e.currentTarget.style.transform = isSelected ? 'scale(1.02)' : 'translateY(0)';
          e.currentTarget.style.boxShadow = isSelected ? `0 8px 30px ${getStatusColor(course)}40` : 'none';
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
        background: `linear-gradient(90deg, ${getStatusColor(course)}, ${getStatusColor(course)}80)`
      }} />
      
      {/* Status indicator */}
      <div style={{
        position: 'absolute',
        top: '12px',
        right: '12px',
        fontSize: '20px'
      }}>
        {getStatusIcon(course)}
      </div>
      
      {/* Header */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: '16px'
      }}>
        <div>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            marginBottom: '8px'
          }}>
            <span style={{
              padding: '4px 8px',
              borderRadius: '6px',
              background: `${getStatusColor(course)}20`,
              color: getStatusColor(course),
              fontSize: '12px',
              fontWeight: '600'
            }}>
              {course.code}
            </span>
            <span style={{
              color: '#94a3b8',
              fontSize: '12px'
            }}>
              {course.credits} créditos • {totalHours}h
            </span>
          </div>
          <h3 style={{
            color: 'white',
            fontSize: '18px',
            fontWeight: '700',
            margin: 0
          }}>
            {course.name}
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
        {course.description || 'Sin descripción disponible'}
      </p>

      {/* Action Buttons */}
      <div style={{
        display: 'flex',
        gap: '8px',
        flexWrap: 'wrap',
        marginBottom: '16px'
      }}>
        <button
          onClick={(e) => {
            e.stopPropagation();
            onScheduleManager();
          }}
          style={{
            padding: '6px 12px',
            borderRadius: '6px',
            border: 'none',
            background: `${getStatusColor(course)}20`,
            color: getStatusColor(course),
            cursor: 'pointer',
            fontSize: '12px',
            fontWeight: '500',
            transition: 'all 0.2s ease'
          }}
        >
          📅 Horarios ({course.schedulesCount})
        </button>

        {!isDisabled && (
          <>
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
                onFreeze(course);
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
                onToggleVisible(course.id);
              }}
              style={{
                padding: '6px 12px',
                borderRadius: '6px',
                border: 'none',
                background: course.isVisible ? 'rgba(245, 158, 11, 0.2)' : 'rgba(16, 185, 129, 0.2)',
                color: course.isVisible ? '#f59e0b' : '#10b981',
                cursor: 'pointer',
                fontSize: '12px',
                fontWeight: '500'
              }}
            >
              {course.isVisible ? '🙈 Ocultar' : '👁️ Mostrar'}
            </button>
          </>
        )}

        {course.isFrozen && !selectedSubcategory?.isFrozen && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onUnfreeze(course);
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

        {canDelete && !isDisabled && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onDelete(course);
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

      {/* Prerequisites */}
      {(course.prerequisites.length > 0 || course.minGradePrereqs.length > 0 || course.corequisites.length > 0) && (
        <div style={{
          padding: '12px',
          borderRadius: '8px',
          background: 'rgba(30, 41, 59, 0.4)',
          marginBottom: '12px'
        }}>
          <h5 style={{
            color: '#cbd5e1',
            fontSize: '12px',
            fontWeight: '600',
            marginBottom: '8px'
          }}>
            🔗 Requisitos
          </h5>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', fontSize: '11px' }}>
            {course.prerequisites.length > 0 && (
              <div>
                <span style={{ color: '#10b981' }}>Prerrequisitos: </span>
                <span style={{ color: '#cbd5e1' }}>
                  {course.prerequisites.map(prereqId => getCourseById(prereqId).code).join(', ')}
                </span>
              </div>
            )}
            {course.minGradePrereqs.length > 0 && (
              <div>
                <span style={{ color: '#f59e0b' }}>Nota mínima: </span>
                <span style={{ color: '#cbd5e1' }}>
                  {course.minGradePrereqs.map(prereq => 
                    `${getCourseById(prereq.courseId).code} (≥${prereq.minGrade})`
                  ).join(', ')}
                </span>
              </div>
            )}
            {course.corequisites.length > 0 && (
              <div>
                <span style={{ color: '#06b6d4' }}>Correquisitos: </span>
                <span style={{ color: '#cbd5e1' }}>
                  {course.corequisites.map(coreqId => getCourseById(coreqId).code).join(', ')}
                </span>
              </div>
            )}
          </div>
        </div>
      )}

      {!canDelete && !isDisabled && (
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
          No se puede eliminar: tiene horarios programados
        </div>
      )}

      {/* Selection indicator */}
      {isSelected && (
        <div style={{
          position: 'absolute',
          bottom: '12px',
          right: '12px',
          color: getStatusColor(course),
          fontSize: '14px',
          animation: 'pulse 2s infinite'
        }}>
          ✨ Seleccionado
        </div>
      )}

      {/* Click indicator */}
      {!isDisabled && !isSelected && (
        <div style={{
          position: 'absolute',
          bottom: '12px',
          right: '12px',
          color: getStatusColor(course),
          fontSize: '14px',
          opacity: 0.6
        }}>
          👆 Clic para detalles
        </div>
      )}
    </div>
  );
};

const CourseDetailsPanel = ({ course, schedules, selectedSubcategory, onClose, onNavigateToSchedules, onScheduleManager, getStatusColor, getCourseById }) => {
  const totalHours = course.hours.theory + course.hours.practice + course.hours.lab;

  return (
    <div style={{
      background: 'linear-gradient(135deg, rgba(15, 23, 42, 0.9) 0%, rgba(30, 41, 59, 0.8) 100%)',
      borderRadius: '16px',
      border: `1px solid ${getStatusColor(course)}60`,
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
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            marginBottom: '8px'
          }}>
            <span style={{
              padding: '4px 8px',
              borderRadius: '6px',
              background: `${getStatusColor(course)}20`,
              color: getStatusColor(course),
              fontSize: '12px',
              fontWeight: '600'
            }}>
              {course.code}
            </span>
          </div>
          <h3 style={{
            color: getStatusColor(course),
            fontSize: '20px',
            fontWeight: '700',
            margin: 0,
            marginBottom: '8px'
          }}>
            📚 {course.name}
          </h3>
          <p style={{
            color: '#94a3b8',
            fontSize: '14px',
            margin: 0,
            lineHeight: '1.4'
          }}>
            {course.description}
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
          background: `${getStatusColor(course)}20`,
          color: getStatusColor(course),
          fontSize: '12px',
          fontWeight: '600'
        }}>
          {course.isFrozen || selectedSubcategory?.isFrozen ? '❄️ Congelado' : !course.isVisible ? '🙈 Oculto' : '✅ Visible'}
        </span>
        
        <span style={{
          padding: '4px 8px',
          borderRadius: '12px',
          background: 'rgba(148, 163, 184, 0.2)',
          color: '#94a3b8',
          fontSize: '12px',
          fontWeight: '600'
        }}>
          {course.credits} créditos • {totalHours}h
        </span>
      </div>

      {/* Hours Breakdown */}
      <div style={{
        padding: '16px',
        borderRadius: '8px',
        background: 'rgba(30, 41, 59, 0.6)',
        marginBottom: '20px'
      }}>
        <h4 style={{
          color: '#cbd5e1',
          fontSize: '14px',
          fontWeight: '600',
          marginBottom: '12px'
        }}>
          ⏰ Distribución de Horas
        </h4>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: '12px'
        }}>
          <div style={{ textAlign: 'center' }}>
            <div style={{
              fontSize: '18px',
              fontWeight: '700',
              color: getStatusColor(course)
            }}>
              {course.hours.theory}h
            </div>
            <div style={{
              fontSize: '12px',
              color: '#94a3b8'
            }}>
              Teoría
            </div>
          </div>
          <div style={{ textAlign: 'center' }}>
            <div style={{
              fontSize: '18px',
              fontWeight: '700',
              color: getStatusColor(course)
            }}>
              {course.hours.practice}h
            </div>
            <div style={{
              fontSize: '12px',
              color: '#94a3b8'
            }}>
              Práctica
            </div>
          </div>
          <div style={{ textAlign: 'center' }}>
            <div style={{
              fontSize: '18px',
              fontWeight: '700',
              color: getStatusColor(course)
            }}>
              {course.hours.lab}h
            </div>
            <div style={{
              fontSize: '12px',
              color: '#94a3b8'
            }}>
              Laboratorio
            </div>
          </div>
        </div>
      </div>

      {/* Prerequisites */}
      {(course.prerequisites.length > 0 || course.minGradePrereqs.length > 0 || course.corequisites.length > 0) && (
        <div style={{ marginBottom: '20px' }}>
          <h4 style={{
            color: '#cbd5e1',
            fontSize: '14px',
            fontWeight: '600',
            marginBottom: '12px'
          }}>
            🔗 Requisitos
          </h4>
          <div style={{
            padding: '12px',
            borderRadius: '8px',
            background: 'rgba(30, 41, 59, 0.4)',
            display: 'flex',
            flexDirection: 'column',
            gap: '8px',
            fontSize: '13px'
          }}>
            {course.prerequisites.length > 0 && (
              <div>
                <span style={{ color: '#10b981', fontWeight: '600' }}>Prerrequisitos: </span>
                <span style={{ color: '#cbd5e1' }}>
                  {course.prerequisites.map(prereqId => getCourseById(prereqId).code).join(', ')}
                </span>
              </div>
            )}
            {course.minGradePrereqs.length > 0 && (
              <div>
                <span style={{ color: '#f59e0b', fontWeight: '600' }}>Nota mínima: </span>
                <span style={{ color: '#cbd5e1' }}>
                  {course.minGradePrereqs.map(prereq => 
                    `${getCourseById(prereq.courseId).code} (≥${prereq.minGrade})`
                  ).join(', ')}
                </span>
              </div>
            )}
            {course.corequisites.length > 0 && (
              <div>
                <span style={{ color: '#06b6d4', fontWeight: '600' }}>Correquisitos: </span>
                <span style={{ color: '#cbd5e1' }}>
                  {course.corequisites.map(coreqId => getCourseById(coreqId).code).join(', ')}
                </span>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Schedules List */}
      <div style={{ marginBottom: '20px' }}>
        <h4 style={{
          color: '#cbd5e1',
          fontSize: '14px',
          fontWeight: '600',
          marginBottom: '12px'
        }}>
          📅 Horarios Programados ({schedules.length})
        </h4>
        
        {schedules.length > 0 ? (
          <div style={{
            maxHeight: '200px',
            overflowY: 'auto',
            display: 'flex',
            flexDirection: 'column',
            gap: '8px'
          }}>
            {schedules.map(schedule => (
              <div
                key={schedule.id}
                style={{
                  padding: '12px',
                  borderRadius: '8px',
                  background: 'rgba(30, 41, 59, 0.4)',
                  border: `1px solid ${getStatusColor(course)}30`,
                  transition: 'all 0.2s ease'
                }}
                onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(30, 41, 59, 0.6)'}
                onMouseLeave={(e) => e.currentTarget.style.background = 'rgba(30, 41, 59, 0.4)'}
              >
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'flex-start',
                  marginBottom: '8px'
                }}>
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px'
                  }}>
                    <span style={{
                      color: getStatusColor(course),
                      fontSize: '12px',
                      fontWeight: '600',
                      padding: '2px 6px',
                      borderRadius: '4px',
                      background: `${getStatusColor(course)}20`
                    }}>
                      {schedule.cycle}
                    </span>
                    <span style={{
                      color: '#cbd5e1',
                      fontSize: '14px',
                      fontWeight: '500'
                    }}>
                      {schedule.name}
                    </span>
                  </div>
                  <span style={{
                    color: '#94a3b8',
                    fontSize: '12px'
                  }}>
                    {schedule.enrolledStudents} estudiantes
                  </span>
                </div>
                
                <div style={{
                  fontSize: '12px',
                  color: '#94a3b8',
                  marginBottom: '4px'
                }}>
                  📍 {schedule.classroom} • 👨‍🏫 {schedule.professors.join(', ')}
                </div>
                
                <div style={{
                  fontSize: '12px',
                  color: '#cbd5e1'
                }}>
                  ⏰ {schedule.days.join(' • ')}
                </div>
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
            No hay horarios programados
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
          onClick={onScheduleManager}
          style={{
            padding: '12px 20px',
            borderRadius: '8px',
            border: 'none',
            background: `linear-gradient(135deg, ${getStatusColor(course)}, ${getStatusColor(course)}80)`,
            color: 'white',
            cursor: 'pointer',
            fontSize: '14px',
            fontWeight: '600',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px'
          }}
        >
          <span>📅</span>
          Gestionar Horarios
        </button>
      </div>
    </div>
  );
};

const ScheduleManagerPanel = ({ course, schedules: initialSchedules, selectedSubcategory, onClose, onBackToDetails }) => {
  const [schedules, setSchedules] = useState(initialSchedules || []);
  const [showAddCycleForm, setShowAddCycleForm] = useState(false);
  const [showAddScheduleForm, setShowAddScheduleForm] = useState(false);
  const [selectedCycleForSchedule, setSelectedCycleForSchedule] = useState('');
  const [editingSchedule, setEditingSchedule] = useState(null);
  const [expandedCycle, setExpandedCycle] = useState(null);
  
  // Estados para confirmación de eliminación
  const [showDeleteCycleConfirmation, setShowDeleteCycleConfirmation] = useState(null);
  const [showDeleteScheduleConfirmation, setShowDeleteScheduleConfirmation] = useState(null);
  const [confirmationTimer, setConfirmationTimer] = useState(10);
  const [canConfirm, setCanConfirm] = useState(false);

  const [newCycle, setNewCycle] = useState('');
  const [newSchedule, setNewSchedule] = useState({
    name: '',
    days: [{ day: 'Lunes', startTime: '08:00', endTime: '10:00' }],
    professors: [],
    classroom: '',
    maxStudents: 30
  });

  // Mock data para profesores disponibles
  const [availableProfessors] = useState([
    'Dr. Angelo Velarde',
    'Dr. Juan Huapaya',
    'Dr. Carlos Mendoza',
    'Dra. Ana Vásquez',
    'Dr. Luis Torres',
    'Dra. María González',
    'Ing. Roberto Silva'
  ]);

  const daysOfWeek = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
  const timeSlots = Array.from({length: 14}, (_, i) => {
    const hour = 7 + i;
    return `${hour.toString().padStart(2, '0')}:00`;
  });

  // Agrupar horarios por ciclo
  const schedulesByCycle = schedules.reduce((acc, schedule) => {
    if (!acc[schedule.cycle]) acc[schedule.cycle] = [];
    acc[schedule.cycle].push(schedule);
    return acc;
  }, {});

  const sortedCycles = Object.keys(schedulesByCycle).sort((a, b) => {
    const [yearA, cycleA] = a.split('-');
    const [yearB, cycleB] = b.split('-');
    if (yearA !== yearB) return parseInt(yearB) - parseInt(yearA);
    return parseInt(cycleB) - parseInt(cycleA);
  });

  // Timer para confirmaciones
  useEffect(() => {
    let timer;
    if ((showDeleteCycleConfirmation || showDeleteScheduleConfirmation) && confirmationTimer > 0) {
      timer = setTimeout(() => {
        setConfirmationTimer(confirmationTimer - 1);
      }, 1000);
    } else if (confirmationTimer === 0) {
      setCanConfirm(true);
    }
    return () => clearTimeout(timer);
  }, [showDeleteCycleConfirmation, showDeleteScheduleConfirmation, confirmationTimer]);

  const resetConfirmationState = () => {
    setShowDeleteCycleConfirmation(null);
    setShowDeleteScheduleConfirmation(null);
    setConfirmationTimer(10);
    setCanConfirm(false);
  };

  // Handlers
  const handleAddCycle = () => {
    if (newCycle && !schedulesByCycle[newCycle]) {
      // El ciclo se añadirá automáticamente cuando se cree el primer horario
      setSelectedCycleForSchedule(newCycle);
      setNewCycle('');
      setShowAddCycleForm(false);
      setShowAddScheduleForm(true);
    }
  };

  const handleDeleteCycle = (cycle) => {
    setShowDeleteCycleConfirmation(cycle);
  };

  const confirmDeleteCycle = () => {
    setSchedules(schedules.filter(s => s.cycle !== showDeleteCycleConfirmation));
    resetConfirmationState();
  };

  const handleAddSchedule = () => {
    if (selectedCycleForSchedule && newSchedule.name.trim()) {
      const schedule = {
        id: Date.now(),
        cycle: selectedCycleForSchedule,
        enrolledStudents: 0,
        ...newSchedule
      };
      
      setSchedules([...schedules, schedule]);
      resetScheduleForm();
    }
  };

  const handleEditSchedule = (schedule) => {
    setEditingSchedule(schedule);
    setSelectedCycleForSchedule(schedule.cycle);
    setNewSchedule({
      name: schedule.name,
      days: [...schedule.days],
      professors: [...schedule.professors],
      classroom: schedule.classroom,
      maxStudents: schedule.maxStudents || 30
    });
    setShowAddScheduleForm(true);
  };

  const handleUpdateSchedule = () => {
    setSchedules(schedules.map(s => 
      s.id === editingSchedule.id ? {
        ...s,
        ...newSchedule,
        cycle: selectedCycleForSchedule
      } : s
    ));
    resetScheduleForm();
  };

  const handleDeleteSchedule = (schedule) => {
    setShowDeleteScheduleConfirmation(schedule);
  };

  const confirmDeleteSchedule = () => {
    setSchedules(schedules.filter(s => s.id !== showDeleteScheduleConfirmation.id));
    resetConfirmationState();
  };

  const resetScheduleForm = () => {
    setShowAddScheduleForm(false);
    setSelectedCycleForSchedule('');
    setEditingSchedule(null);
    setNewSchedule({
      name: '',
      days: [{ day: 'Lunes', startTime: '08:00', endTime: '10:00' }],
      professors: [],
      classroom: '',
      maxStudents: 30
    });
  };

  return (
    <div style={{
      background: 'linear-gradient(135deg, rgba(15, 23, 42, 0.9) 0%, rgba(30, 41, 59, 0.8) 100%)',
      borderRadius: '16px',
      border: `1px solid ${selectedSubcategory?.color || '#8b5cf6'}60`,
      padding: '24px',
      height: 'fit-content',
      position: 'sticky',
      top: '20px',
      maxHeight: '90vh',
      overflowY: 'auto'
    }}>
      {/* Header */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '20px'
      }}>
        <h3 style={{
          color: selectedSubcategory?.color || '#8b5cf6',
          fontSize: '20px',
          fontWeight: '700',
          margin: 0
        }}>
          📅 Gestión de Horarios
        </h3>
        <div style={{ display: 'flex', gap: '8px' }}>
          <button
            onClick={onBackToDetails}
            style={{
              background: 'rgba(148, 163, 184, 0.2)',
              border: 'none',
              borderRadius: '6px',
              color: '#94a3b8',
              cursor: 'pointer',
              fontSize: '12px',
              padding: '6px 10px'
            }}
          >
            ← Detalles
          </button>
          <button
            onClick={onClose}
            style={{
              background: 'rgba(239, 68, 68, 0.2)',
              border: 'none',
              borderRadius: '6px',
              color: '#ef4444',
              cursor: 'pointer',
              fontSize: '12px',
              padding: '6px 10px'
            }}
          >
            ✕ Cerrar
          </button>
        </div>
      </div>

      {/* Course Info */}
      <CourseInfoCard course={course} selectedSubcategory={selectedSubcategory} />

      {/* Quick Actions */}
      <div style={{
        display: 'flex',
        gap: '12px',
        marginBottom: '24px',
        flexWrap: 'wrap'
      }}>
        <button
          onClick={() => setShowAddCycleForm(true)}
          style={{
            padding: '10px 16px',
            borderRadius: '8px',
            border: 'none',
            background: 'linear-gradient(135deg, #06b6d4, #3b82f6)',
            color: 'white',
            cursor: 'pointer',
            fontSize: '14px',
            fontWeight: '600',
            display: 'flex',
            alignItems: 'center',
            gap: '6px'
          }}
        >
          <span>+</span>
          Agregar Ciclo
        </button>

        <button
          onClick={() => {
            if (sortedCycles.length > 0) {
              setSelectedCycleForSchedule(sortedCycles[0]);
              setShowAddScheduleForm(true);
            } else {
              setShowAddCycleForm(true);
            }
          }}
          style={{
            padding: '10px 16px',
            borderRadius: '8px',
            border: 'none',
            background: 'linear-gradient(135deg, #10b981, #059669)',
            color: 'white',
            cursor: 'pointer',
            fontSize: '14px',
            fontWeight: '600',
            display: 'flex',
            alignItems: 'center',
            gap: '6px'
          }}
        >
          <span>📅</span>
          Nuevo Horario
        </button>
      </div>

      {/* Add Cycle Form */}
      {showAddCycleForm && (
        <AddCycleForm
          newCycle={newCycle}
          setNewCycle={setNewCycle}
          onSave={handleAddCycle}
          onCancel={() => {
            setShowAddCycleForm(false);
            setNewCycle('');
          }}
          selectedSubcategory={selectedSubcategory}
        />
      )}

      {/* Add/Edit Schedule Form */}
      {showAddScheduleForm && (
        <ScheduleForm
          newSchedule={newSchedule}
          setNewSchedule={setNewSchedule}
          selectedCycleForSchedule={selectedCycleForSchedule}
          setSelectedCycleForSchedule={setSelectedCycleForSchedule}
          sortedCycles={sortedCycles}
          daysOfWeek={daysOfWeek}
          timeSlots={timeSlots}
          availableProfessors={availableProfessors}
          editingSchedule={editingSchedule}
          onSave={editingSchedule ? handleUpdateSchedule : handleAddSchedule}
          onCancel={resetScheduleForm}
          selectedSubcategory={selectedSubcategory}
        />
      )}

      {/* Cycles List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {sortedCycles.length === 0 ? (
          <div style={{
            textAlign: 'center',
            padding: '40px 20px',
            color: '#94a3b8'
          }}>
            <div style={{ fontSize: '48px', marginBottom: '16px' }}>📅</div>
            <h4 style={{ fontSize: '18px', marginBottom: '8px' }}>
              No hay ciclos programados
            </h4>
            <p style={{ fontSize: '14px' }}>
              Comienza agregando un ciclo académico para este curso
            </p>
          </div>
        ) : (
          sortedCycles.map(cycle => (
            <CycleCard
              key={cycle}
              cycle={cycle}
              schedules={schedulesByCycle[cycle]}
              isExpanded={expandedCycle === cycle}
              onToggleExpand={() => setExpandedCycle(expandedCycle === cycle ? null : cycle)}
              onDeleteCycle={() => handleDeleteCycle(cycle)}
              onAddSchedule={() => {
                setSelectedCycleForSchedule(cycle);
                setShowAddScheduleForm(true);
              }}
              onEditSchedule={handleEditSchedule}
              onDeleteSchedule={handleDeleteSchedule}
              selectedSubcategory={selectedSubcategory}
            />
          ))
        )}
      </div>

      {/* Confirmation Modals */}
      {(showDeleteCycleConfirmation || showDeleteScheduleConfirmation) && (
        <DeleteConfirmationModal
          type={showDeleteCycleConfirmation ? 'cycle' : 'schedule'}
          item={showDeleteCycleConfirmation || showDeleteScheduleConfirmation}
          timer={confirmationTimer}
          canConfirm={canConfirm}
          onConfirm={showDeleteCycleConfirmation ? confirmDeleteCycle : confirmDeleteSchedule}
          onCancel={resetConfirmationState}
        />
      )}
    </div>
  );
};

// Componente para mostrar información del curso
const CourseInfoCard = ({ course, selectedSubcategory }) => (
  <div style={{
    padding: '16px',
    borderRadius: '8px',
    background: 'rgba(30, 41, 59, 0.6)',
    marginBottom: '20px'
  }}>
    <div style={{
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
      marginBottom: '8px'
    }}>
      <span style={{
        padding: '4px 8px',
        borderRadius: '6px',
        background: `${selectedSubcategory?.color || '#8b5cf6'}20`,
        color: selectedSubcategory?.color || '#8b5cf6',
        fontSize: '12px',
        fontWeight: '600'
      }}>
        {course.code}
      </span>
      <span style={{
        color: '#94a3b8',
        fontSize: '12px'
      }}>
        {course.credits} créditos
      </span>
    </div>
    <h4 style={{
      color: 'white',
      fontSize: '16px',
      fontWeight: '600',
      margin: 0
    }}>
      {course.name}
    </h4>
  </div>
);

const AddCycleForm = ({ newCycle, setNewCycle, onSave, onCancel, selectedSubcategory }) => (
  <div style={{
    background: `linear-gradient(135deg, ${selectedSubcategory?.color || '#8b5cf6'}15 0%, rgba(30, 41, 59, 0.8) 100%)`,
    borderRadius: '12px',
    border: `1px solid ${selectedSubcategory?.color || '#8b5cf6'}30`,
    padding: '20px',
    marginBottom: '20px'
  }}>
    <h4 style={{
      color: '#67e8f9',
      marginBottom: '16px',
      fontSize: '16px'
    }}>
      ✨ Agregar Nuevo Ciclo
    </h4>
    <div style={{
      display: 'flex',
      gap: '12px',
      alignItems: 'center',
      flexWrap: 'wrap'
    }}>
      <input
        type="text"
        placeholder="Ej: 2025-2, 2026-0..."
        value={newCycle}
        onChange={(e) => setNewCycle(e.target.value)}
        style={{
          padding: '10px 14px',
          borderRadius: '6px',
          border: '1px solid rgba(148, 163, 184, 0.3)',
          background: 'rgba(15, 23, 42, 0.6)',
          color: 'white',
          fontSize: '14px',
          outline: 'none',
          minWidth: '150px'
        }}
      />
      <button
        onClick={onSave}
        disabled={!newCycle.trim()}
        style={{
          padding: '10px 16px',
          borderRadius: '6px',
          border: 'none',
          background: !newCycle.trim() ? 'rgba(148, 163, 184, 0.3)' : '#06b6d4',
          color: 'white',
          cursor: !newCycle.trim() ? 'not-allowed' : 'pointer',
          fontSize: '14px',
          fontWeight: '600',
          opacity: !newCycle.trim() ? 0.5 : 1
        }}
      >
        Agregar
      </button>
      <button
        onClick={onCancel}
        style={{
          padding: '10px 16px',
          borderRadius: '6px',
          border: '1px solid rgba(148, 163, 184, 0.3)',
          background: 'transparent',
          color: '#94a3b8',
          cursor: 'pointer',
          fontSize: '14px'
        }}
      >
        Cancelar
      </button>
    </div>
  </div>
);

// Componente para cada card de ciclo
const CycleCard = ({ 
  cycle, schedules, isExpanded, onToggleExpand, onDeleteCycle, 
  onAddSchedule, onEditSchedule, onDeleteSchedule, selectedSubcategory 
}) => {
  const totalStudents = schedules.reduce((total, schedule) => total + schedule.enrolledStudents, 0);
  const canDeleteCycle = schedules.every(schedule => schedule.enrolledStudents === 0);

  return (
    <div style={{
      background: 'linear-gradient(135deg, rgba(15, 23, 42, 0.9) 0%, rgba(30, 41, 59, 0.8) 100%)',
      borderRadius: '12px',
      border: '1px solid rgba(148, 163, 184, 0.3)',
      overflow: 'hidden'
    }}>
      {/* Cycle Header */}
      <div 
        onClick={onToggleExpand}
        style={{
          padding: '16px',
          cursor: 'pointer',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          transition: 'background 0.2s ease'
        }}
        onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(6, 182, 212, 0.05)'}
        onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
      >
        <div>
          <h4 style={{
            color: '#06b6d4',
            fontSize: '16px',
            fontWeight: '700',
            margin: 0,
            marginBottom: '4px'
          }}>
            📅 Ciclo {cycle}
          </h4>
          <p style={{
            color: '#94a3b8',
            fontSize: '12px',
            margin: 0
          }}>
            {schedules.length} horario{schedules.length !== 1 ? 's' : ''} • {totalStudents} estudiante{totalStudents !== 1 ? 's' : ''}
          </p>
        </div>

        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px'
        }}>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onAddSchedule();
            }}
            style={{
              padding: '6px 12px',
              borderRadius: '6px',
              border: 'none',
              background: '#10b981',
              color: 'white',
              cursor: 'pointer',
              fontSize: '10px',
              fontWeight: '500'
            }}
          >
            + Horario
          </button>

          {canDeleteCycle && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onDeleteCycle();
              }}
              style={{
                padding: '6px 10px',
                borderRadius: '6px',
                border: 'none',
                background: 'rgba(239, 68, 68, 0.2)',
                color: '#ef4444',
                cursor: 'pointer',
                fontSize: '10px',
                fontWeight: '500'
              }}
            >
              🗑️
            </button>
          )}

          <div style={{
            color: '#06b6d4',
            fontSize: '14px',
            transform: isExpanded ? 'rotate(180deg)' : 'rotate(0deg)',
            transition: 'transform 0.3s ease'
          }}>
            ▼
          </div>
        </div>
      </div>

      {/* Expanded Content */}
      {isExpanded && (
        <div style={{
          borderTop: '1px solid rgba(148, 163, 184, 0.2)',
          padding: '16px'
        }}>
          {schedules.length === 0 ? (
            <div style={{
              textAlign: 'center',
              padding: '24px',
              color: '#94a3b8'
            }}>
              <div style={{ fontSize: '24px', marginBottom: '8px' }}>📅</div>
              <p style={{ fontSize: '12px' }}>
                No hay horarios programados para este ciclo
              </p>
            </div>
          ) : (
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))',
              gap: '12px'
            }}>
              {schedules.map(schedule => (
                <ScheduleCard
                  key={schedule.id}
                  schedule={schedule}
                  onEdit={() => onEditSchedule(schedule)}
                  onDelete={() => onDeleteSchedule(schedule)}
                  selectedSubcategory={selectedSubcategory}
                />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

// Componente para el formulario de horarios (CORREGIDO)
const ScheduleForm = ({ 
  newSchedule, setNewSchedule, selectedCycleForSchedule, setSelectedCycleForSchedule,
  sortedCycles, daysOfWeek, timeSlots, availableProfessors, editingSchedule,
  onSave, onCancel, selectedSubcategory 
}) => {
  const [selectedProfessor, setSelectedProfessor] = useState('');

  const addDay = () => {
    setNewSchedule({
      ...newSchedule,
      days: [...newSchedule.days, { day: 'Lunes', startTime: '08:00', endTime: '10:00' }]
    });
  };

  const removeDay = (index) => {
    setNewSchedule({
      ...newSchedule,
      days: newSchedule.days.filter((_, i) => i !== index)
    });
  };

  const updateDay = (index, field, value) => {
    const updatedDays = newSchedule.days.map((day, i) => 
      i === index ? { ...day, [field]: value } : day
    );
    setNewSchedule({ ...newSchedule, days: updatedDays });
  };

  const addProfessor = (professor) => {
    if (!newSchedule.professors.includes(professor)) {
      setNewSchedule({
        ...newSchedule,
        professors: [...newSchedule.professors, professor]
      });
    }
  };

  const removeProfessor = (professor) => {
    setNewSchedule({
      ...newSchedule,
      professors: newSchedule.professors.filter(p => p !== professor)
    });
  };

  return (
    <div style={{
      background: `linear-gradient(135deg, ${selectedSubcategory?.color || '#8b5cf6'}15 0%, rgba(30, 41, 59, 0.8) 100%)`,
      borderRadius: '12px',
      border: `1px solid ${selectedSubcategory?.color || '#8b5cf6'}30`,
      padding: '20px',
      marginBottom: '20px'
    }}>
      <h4 style={{
        color: '#67e8f9',
        marginBottom: '16px',
        fontSize: '16px'
      }}>
        {editingSchedule ? '✏️ Editar Horario' : '📅 Nuevo Horario'}
      </h4>

      {/* Basic Info */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
        gap: '16px',
        marginBottom: '16px'
      }}>
        <div>
          <label style={{ color: '#cbd5e1', fontSize: '12px', marginBottom: '6px', display: 'block' }}>
            Ciclo académico
          </label>
          <select
            value={selectedCycleForSchedule}
            onChange={(e) => setSelectedCycleForSchedule(e.target.value)}
            disabled={editingSchedule !== null}
            style={{
              width: '100%',
              padding: '8px 12px',
              borderRadius: '6px',
              border: '1px solid rgba(148, 163, 184, 0.3)',
              background: 'rgba(15, 23, 42, 0.6)',
              color: 'white',
              fontSize: '12px',
              outline: 'none'
            }}
          >
            <option value="">Seleccionar...</option>
            {sortedCycles.map(cycle => (
              <option key={cycle} value={cycle}>{cycle}</option>
            ))}
            {!sortedCycles.includes(selectedCycleForSchedule) && selectedCycleForSchedule && (
              <option value={selectedCycleForSchedule}>{selectedCycleForSchedule}</option>
            )}
          </select>
        </div>

        <div>
          <label style={{ color: '#cbd5e1', fontSize: '12px', marginBottom: '6px', display: 'block' }}>
            Nombre del horario
          </label>
          <input
            type="text"
            value={newSchedule.name}
            onChange={(e) => setNewSchedule({...newSchedule, name: e.target.value})}
            placeholder="Ej: Principal, Mañana..."
            style={{
              width: '100%',
              padding: '8px 12px',
              borderRadius: '6px',
              border: '1px solid rgba(148, 163, 184, 0.3)',
              background: 'rgba(15, 23, 42, 0.6)',
              color: 'white',
              fontSize: '12px',
              outline: 'none'
            }}
          />
        </div>

        <div>
          <label style={{ color: '#cbd5e1', fontSize: '12px', marginBottom: '6px', display: 'block' }}>
            Aula
          </label>
          <input
            type="text"
            value={newSchedule.classroom}
            onChange={(e) => setNewSchedule({...newSchedule, classroom: e.target.value})}
            placeholder="Ej: Aula 201..."
            style={{
              width: '100%',
              padding: '8px 12px',
              borderRadius: '6px',
              border: '1px solid rgba(148, 163, 184, 0.3)',
              background: 'rgba(15, 23, 42, 0.6)',
              color: 'white',
              fontSize: '12px',
              outline: 'none'
            }}
          />
        </div>

        <div>
          <label style={{ color: '#cbd5e1', fontSize: '12px', marginBottom: '6px', display: 'block' }}>
            Máx. estudiantes
          </label>
          <input
            type="number"
            min="1"
            max="100"
            value={newSchedule.maxStudents}
            onChange={(e) => setNewSchedule({...newSchedule, maxStudents: parseInt(e.target.value)})}
            style={{
              width: '100%',
              padding: '8px 12px',
              borderRadius: '6px',
              border: '1px solid rgba(148, 163, 184, 0.3)',
              background: 'rgba(15, 23, 42, 0.6)',
              color: 'white',
              fontSize: '12px',
              outline: 'none'
            }}
          />
        </div>
      </div>

      {/* Days and Times */}
      <div style={{ marginBottom: '16px' }}>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '12px'
        }}>
          <label style={{ color: '#cbd5e1', fontSize: '12px' }}>
            Días y horarios
          </label>
          <button
            onClick={addDay}
            style={{
              padding: '4px 8px',
              borderRadius: '4px',
              border: 'none',
              background: '#10b981',
              color: 'white',
              cursor: 'pointer',
              fontSize: '10px'
            }}
          >
            + Día
          </button>
        </div>

        {newSchedule.days.map((day, index) => (
          <div key={index} style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr 1fr auto',
            gap: '8px',
            marginBottom: '8px',
            padding: '8px',
            background: 'rgba(15, 23, 42, 0.4)',
            borderRadius: '6px'
          }}>
            <select
              value={day.day}
              onChange={(e) => updateDay(index, 'day', e.target.value)}
              style={{
                padding: '6px 8px',
                borderRadius: '4px',
                border: '1px solid rgba(148, 163, 184, 0.3)',
                background: 'rgba(30, 41, 59, 0.6)',
                color: 'white',
                fontSize: '11px',
                outline: 'none'
              }}
            >
              {daysOfWeek.map(d => (
                <option key={d} value={d}>{d}</option>
              ))}
            </select>

            <select
              value={day.startTime}
              onChange={(e) => updateDay(index, 'startTime', e.target.value)}
              style={{
                padding: '6px 8px',
                borderRadius: '4px',
                border: '1px solid rgba(148, 163, 184, 0.3)',
                background: 'rgba(30, 41, 59, 0.6)',
                color: 'white',
                fontSize: '11px',
                outline: 'none'
              }}
            >
              {timeSlots.map(time => (
                <option key={time} value={time}>{time}</option>
              ))}
            </select>

            <select
              value={day.endTime}
              onChange={(e) => updateDay(index, 'endTime', e.target.value)}
              style={{
                padding: '6px 8px',
                borderRadius: '4px',
                border: '1px solid rgba(148, 163, 184, 0.3)',
                background: 'rgba(30, 41, 59, 0.6)',
                color: 'white',
                fontSize: '11px',
                outline: 'none'
              }}
            >
              {timeSlots.map(time => (
                <option key={time} value={time}>{time}</option>
              ))}
            </select>

            {newSchedule.days.length > 1 && (
              <button
                onClick={() => removeDay(index)}
                style={{
                  padding: '6px',
                  borderRadius: '4px',
                  border: 'none',
                  background: '#ef4444',
                  color: 'white',
                  cursor: 'pointer',
                  fontSize: '10px'
                }}
              >
                ×
              </button>
            )}
          </div>
        ))}
      </div>

      {/* Professors */}
      <div style={{ marginBottom: '16px' }}>
        <label style={{ color: '#cbd5e1', fontSize: '12px', marginBottom: '8px', display: 'block' }}>
          Profesores
        </label>
        <div style={{
          display: 'flex',
          gap: '8px',
          marginBottom: '8px',
          flexWrap: 'wrap'
        }}>
          <select
            value={selectedProfessor}
            onChange={(e) => setSelectedProfessor(e.target.value)}
            style={{
              padding: '6px 8px',
              borderRadius: '4px',
              border: '1px solid rgba(148, 163, 184, 0.3)',
              background: 'rgba(15, 23, 42, 0.6)',
              color: 'white',
              fontSize: '11px',
              outline: 'none'
            }}
          >
            <option value="">Seleccionar...</option>
            {availableProfessors
              .filter(prof => !newSchedule.professors.includes(prof))
              .map(prof => (
                <option key={prof} value={prof}>{prof}</option>
              ))}
          </select>
          <button
            onClick={() => {
              if (selectedProfessor) {
                addProfessor(selectedProfessor);
                setSelectedProfessor('');
              }
            }}
            style={{
              padding: '6px 12px',
              borderRadius: '4px',
              border: 'none',
              background: '#10b981',
              color: 'white',
              cursor: 'pointer',
              fontSize: '11px'
            }}
          >
            + Agregar
          </button>
        </div>
        <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
          {newSchedule.professors.map(prof => (
            <span
              key={prof}
              style={{
                padding: '3px 6px',
                borderRadius: '8px',
                background: '#10b98120',
                color: '#10b981',
                fontSize: '10px',
                display: 'flex',
                alignItems: 'center',
                gap: '4px'
              }}
            >
              {prof}
              <button
                onClick={() => removeProfessor(prof)}
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#10b981',
                  cursor: 'pointer',
                  fontSize: '8px',
                  padding: '0 2px'
                }}
              >
                ×
              </button>
            </span>
          ))}
        </div>
      </div>

      {/* Form Actions */}
      <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
        <button
          onClick={onCancel}
          style={{
            padding: '8px 16px',
            borderRadius: '6px',
            border: '1px solid rgba(148, 163, 184, 0.3)',
            background: 'transparent',
            color: '#94a3b8',
            cursor: 'pointer',
            fontSize: '12px'
          }}
        >
          Cancelar
        </button>
        <button
          onClick={onSave}
          disabled={!selectedCycleForSchedule || !newSchedule.name.trim()}
          style={{
            padding: '8px 16px',
            borderRadius: '6px',
            border: 'none',
            background: (!selectedCycleForSchedule || !newSchedule.name.trim()) 
              ? 'rgba(148, 163, 184, 0.3)' 
              : `linear-gradient(135deg, ${selectedSubcategory?.color || '#8b5cf6'}, ${selectedSubcategory?.color || '#8b5cf6'}80)`,
            color: 'white',
            cursor: (!selectedCycleForSchedule || !newSchedule.name.trim()) ? 'not-allowed' : 'pointer',
            fontSize: '12px',
            fontWeight: '600',
            opacity: (!selectedCycleForSchedule || !newSchedule.name.trim()) ? 0.5 : 1
          }}
        >
          {editingSchedule ? 'Actualizar' : 'Crear'} Horario
        </button>
      </div>
    </div>
  );
};

// Componente para cada card de horario
const ScheduleCard = ({ schedule, onEdit, onDelete, selectedSubcategory }) => {
  const formatTimeRange = (days) => {
    return days.map(day => `${day.day} ${day.startTime}-${day.endTime}`).join(', ');
  };

  const canDelete = schedule.enrolledStudents === 0;

  return (
    <div style={{
      background: 'rgba(30, 41, 59, 0.6)',
      borderRadius: '8px',
      border: '1px solid rgba(148, 163, 184, 0.2)',
      padding: '12px',
      transition: 'all 0.3s ease'
    }}
    onMouseEnter={(e) => {
      e.currentTarget.style.transform = 'translateY(-2px)';
      e.currentTarget.style.boxShadow = `0 4px 15px ${selectedSubcategory?.color || '#8b5cf6'}20`;
    }}
    onMouseLeave={(e) => {
      e.currentTarget.style.transform = 'translateY(0)';
      e.currentTarget.style.boxShadow = 'none';
    }}
    >
      {/* Schedule Header */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: '10px'
      }}>
        <h5 style={{
          color: 'white',
          fontSize: '14px',
          fontWeight: '600',
          margin: 0
        }}>
          {schedule.name}
        </h5>
        
        <div style={{ display: 'flex', gap: '4px' }}>
          <button
            onClick={onEdit}
            style={{
              padding: '3px 6px',
              borderRadius: '4px',
              border: 'none',
              background: 'rgba(16, 185, 129, 0.2)',
              color: '#10b981',
              cursor: 'pointer',
              fontSize: '9px',
              fontWeight: '500'
            }}
          >
            ✏️
          </button>
          {canDelete && (
            <button
              onClick={onDelete}
              style={{
                padding: '3px 6px',
                borderRadius: '4px',
                border: 'none',
                background: 'rgba(239, 68, 68, 0.2)',
                color: '#ef4444',
                cursor: 'pointer',
                fontSize: '9px',
                fontWeight: '500'
              }}
            >
              🗑️
            </button>
          )}
        </div>
      </div>

      {/* Schedule Details */}
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '6px',
        fontSize: '11px'
      }}>
        {/* Time Slots */}
        <div>
          <span style={{ color: '#94a3b8' }}>⏰ </span>
          <span style={{ color: '#cbd5e1' }}>
            {formatTimeRange(schedule.days)}
          </span>
        </div>

        {/* Classroom */}
        {schedule.classroom && (
          <div>
            <span style={{ color: '#94a3b8' }}>🏫 </span>
            <span style={{ color: '#cbd5e1' }}>
              {schedule.classroom}
            </span>
          </div>
        )}

        {/* Professors */}
        <div>
          <span style={{ color: '#94a3b8' }}>👨‍🏫 </span>
          <span style={{ color: '#cbd5e1' }}>
            {schedule.professors.length > 0 ? schedule.professors.join(', ') : 'Sin asignar'}
          </span>
        </div>

        {/* Students */}
        <div>
          <span style={{ color: '#94a3b8' }}>👥 </span>
          <span style={{ color: selectedSubcategory?.color || '#8b5cf6', fontWeight: '600' }}>
            {schedule.enrolledStudents}
          </span>
          <span style={{ color: '#94a3b8' }}>
            /{schedule.maxStudents || 30} estudiantes
          </span>
        </div>
      </div>

      {/* Capacity Bar */}
      <div style={{
        marginTop: '8px',
        height: '4px',
        borderRadius: '2px',
        background: 'rgba(148, 163, 184, 0.3)',
        overflow: 'hidden'
      }}>
        <div style={{
          height: '100%',
          width: `${Math.min((schedule.enrolledStudents / (schedule.maxStudents || 30)) * 100, 100)}%`,
          background: schedule.enrolledStudents > (schedule.maxStudents || 30) * 0.8 
            ? '#ef4444' 
            : schedule.enrolledStudents > (schedule.maxStudents || 30) * 0.6 
            ? '#f59e0b' 
            : '#10b981',
          transition: 'width 0.3s ease'
        }} />
      </div>

      {/* Warning for deletion */}
      {!canDelete && (
        <div style={{
          marginTop: '8px',
          padding: '6px 8px',
          borderRadius: '4px',
          background: 'rgba(239, 68, 68, 0.1)',
          fontSize: '9px',
          color: '#ef4444',
          display: 'flex',
          alignItems: 'center',
          gap: '4px'
        }}>
          <span>⚠️</span>
          No se puede eliminar: tiene estudiantes inscritos
        </div>
      )}

      {/* Visual Schedule Grid */}
      <div style={{
        marginTop: '10px',
        padding: '6px',
        background: 'rgba(15, 23, 42, 0.6)',
        borderRadius: '4px'
      }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(6, 1fr)',
          gap: '2px',
          fontSize: '8px'
        }}>
          {['L', 'M', 'X', 'J', 'V', 'S'].map((day, index) => {
            const dayNames = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
            const hasClass = schedule.days.some(d => d.day === dayNames[index]);
            return (
              <div
                key={day}
                style={{
                  padding: '3px 1px',
                  textAlign: 'center',
                  borderRadius: '2px',
                  background: hasClass ? (selectedSubcategory?.color || '#8b5cf6') : 'rgba(148, 163, 184, 0.2)',
                  color: hasClass ? 'white' : '#94a3b8',
                  fontWeight: hasClass ? '600' : '400'
                }}
              >
                {day}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

// Componente para modales de confirmación de eliminación
const DeleteConfirmationModal = ({ type, item, timer, canConfirm, onConfirm, onCancel }) => {
  const getModalConfig = () => {
    if (type === 'cycle') {
      return {
        title: '🗑️ Eliminar Ciclo',
        message: `¿Estás seguro de que deseas eliminar el ciclo "${item}"?`,
        warning: 'Esta acción eliminará todos los horarios asociados a este ciclo. Solo es posible si no hay estudiantes inscritos.',
        confirmText: 'Eliminar Ciclo',
        color: '#ef4444'
      };
    } else {
      return {
        title: '🗑️ Eliminar Horario',
        message: `¿Estás seguro de que deseas eliminar el horario "${item.name}"?`,
        warning: 'Esta acción es irreversible. El horario será eliminado permanentemente.',
        confirmText: 'Eliminar Horario',
        color: '#ef4444'
      };
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
              animation: 'spin 1s linear infinite'
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
            ✅ Ya puedes confirmar la eliminación
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

export default CoursesTab;