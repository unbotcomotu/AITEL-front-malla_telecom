import React, { useState, useMemo } from 'react';

const StudentCourseRegistration = () => {
  // Estados principales
  const [currentStep, setCurrentStep] = useState('initial'); // 'initial', 'semester', 'completed'
  const [startingSemester, setStartingSemester] = useState('');
  const [currentSemesterIndex, setCurrentSemesterIndex] = useState(0);
  const [registeredSemesters, setRegisteredSemesters] = useState({});
  const [showSuspendOption, setShowSuspendOption] = useState(false);
  const [validationErrors, setValidationErrors] = useState([]);

  // Datos mock del sistema académico
  const [academicSystem] = useState({
    currentCycle: '2025-2',
    availableCourses: {
      // Cursos obligatorios organizados por ciclo
      obligatory: {
        1: [
          { id: 'mat101', code: 'MAT101', name: 'Fundamentos de Cálculo', credits: 4, prerequisites: [], minGradePrereqs: [] },
          { id: 'fis101', code: 'FIS101', name: 'Fundamentos de Física', credits: 4, prerequisites: [], minGradePrereqs: [] },
          { id: 'com101', code: 'COM101', name: 'Comunicación Académica', credits: 3, prerequisites: [], minGradePrereqs: [] }
        ],
        2: [
          { id: 'mat201', code: 'MAT201', name: 'Cálculo Diferencial', credits: 4, prerequisites: ['mat101'], minGradePrereqs: [] },
          { id: 'fis201', code: 'FIS201', name: 'Física 1', credits: 4, prerequisites: ['fis101'], minGradePrereqs: [] },
          { id: 'ing101', code: 'ING101', name: 'Dibujo en Ingeniería', credits: 3, prerequisites: [], minGradePrereqs: [] }
        ]
      },
      // Cursos electivos organizados por subcategoría
      elective: {
        'Electivo de Humanidades 1': {
          cycle: 2,
          requiredCourses: 1,
          courses: [
            { id: 'hum101', code: 'HUM101', name: 'Motivación y Liderazgo', credits: 3 },
            { id: 'hum102', code: 'HUM102', name: 'Desarrollo de Habilidades Personales', credits: 3 },
            { id: 'hum103', code: 'HUM103', name: 'Ética y Ciudadanía', credits: 3 }
          ]
        },
        'Electivo de Humanidades 2': {
          cycle: 5,
          requiredCourses: 1,
          courses: [
            { id: 'hum201', code: 'HUM201', name: 'Ética Profesional', credits: 2 },
            { id: 'hum202', code: 'HUM202', name: 'Responsabilidad Social', credits: 2 }
          ]
        }
      }
    }
  });

  // Generar lista de semestres disponibles
  const availableSemesters = useMemo(() => {
    const semesters = [];
    for (let year = 2018; year <= 2025; year++) {
      semesters.push(`${year}-1`, `${year}-2`);
      if (year >= 2019) semesters.push(`${year}-0`); // Ciclos de verano
    }
    return semesters.sort().reverse(); // Más recientes primero
  }, []);

  // Generar secuencia de semestres desde el inicial
  const semesterSequence = useMemo(() => {
    if (!startingSemester) return [];
    
    const sequence = [];
    const [startYear, startCycle] = startingSemester.split('-').map(Number);
    let currentYear = startYear;
    let currentCycle = startCycle;
    
    const currentSemesterData = academicSystem.currentCycle.split('-').map(Number);
    const [currentAcademicYear, currentAcademicCycle] = currentSemesterData;
    
    while (currentYear < currentAcademicYear || 
           (currentYear === currentAcademicYear && currentCycle <= currentAcademicCycle)) {
      sequence.push(`${currentYear}-${currentCycle}`);
      
      // Lógica para el siguiente ciclo
      if (currentCycle === 1) {
        currentCycle = 2;
      } else if (currentCycle === 2) {
        currentCycle = 0; // Verano
        currentYear++;
      } else { // currentCycle === 0 (verano)
        currentCycle = 1;
      }
    }
    
    return sequence;
  }, [startingSemester, academicSystem.currentCycle]);

  const currentSemester = semesterSequence[currentSemesterIndex] || '';
  const isLastSemester = currentSemesterIndex >= semesterSequence.length - 1;
  const isCurrentAcademicCycle = currentSemester === academicSystem.currentCycle;

  // Obtener cursos disponibles para un ciclo específico
  const getCoursesForCycle = (cycle) => {
    const obligatoryCourses = academicSystem.availableCourses.obligatory[cycle] || [];
    const electiveCourses = [];
    
    Object.entries(academicSystem.availableCourses.elective).forEach(([subcategoryName, subcategory]) => {
      if (subcategory.cycle === cycle) {
        electiveCourses.push({
          type: 'elective',
          subcategoryName,
          requiredCourses: subcategory.requiredCourses,
          courses: subcategory.courses
        });
      }
    });
    
    return { obligatoryCourses, electiveCourses };
  };

  // Validar prerrequisitos
  const validatePrerequisites = (courseId, semesterCourses) => {
    const allCourses = [
      ...Object.values(academicSystem.availableCourses.obligatory).flat(),
      ...Object.values(academicSystem.availableCourses.elective).flatMap(subcat => subcat.courses)
    ];
    
    const course = allCourses.find(c => c.id === courseId);
    if (!course) return { valid: true, errors: [] };
    
    const errors = [];
    const approvedCourses = [];
    
    // Recopilar cursos aprobados de semestres anteriores
    Object.entries(registeredSemesters).forEach(([semester, data]) => {
      if (data.courses) {
        data.courses.forEach(semesterCourse => {
          if (semesterCourse.grade >= 11) {
            approvedCourses.push(semesterCourse.courseId);
          }
        });
      }
    });
    
    // Verificar prerrequisitos básicos
    course.prerequisites.forEach(prereqId => {
      if (!approvedCourses.includes(prereqId)) {
        const prereqCourse = allCourses.find(c => c.id === prereqId);
        errors.push(`Requiere haber aprobado: ${prereqCourse?.name || prereqId}`);
      }
    });
    
    // Verificar prerrequisitos con nota mínima
    course.minGradePrereqs.forEach(({ courseId: prereqId, minGrade }) => {
      const semesterWithCourse = Object.values(registeredSemesters).find(semester =>
        semester.courses?.some(c => c.courseId === prereqId && c.grade >= minGrade)
      );
      
      if (!semesterWithCourse) {
        const prereqCourse = allCourses.find(c => c.id === prereqId);
        errors.push(`Requiere nota mínima de ${minGrade} en: ${prereqCourse?.name || prereqId}`);
      }
    });
    
    return { valid: errors.length === 0, errors };
  };

  // Manejar inicio del registro
  const handleStartRegistration = () => {
    if (!startingSemester) {
      alert('Por favor selecciona tu primer semestre');
      return;
    }
    setCurrentStep('semester');
  };

  // Manejar registro de cursos del semestre
  const handleRegisterSemester = (semesterData) => {
    // Validar todos los cursos
    const allErrors = [];
    
    semesterData.courses?.forEach(course => {
      const validation = validatePrerequisites(course.courseId, semesterData.courses);
      if (!validation.valid && !course.exception) {
        allErrors.push(`${course.courseName}: ${validation.errors.join(', ')}`);
      }
    });
    
    if (allErrors.length > 0 && !semesterData.suspended) {
      setValidationErrors(allErrors);
      return;
    }
    
    // Guardar el semestre
    setRegisteredSemesters(prev => ({
      ...prev,
      [currentSemester]: semesterData
    }));
    
    setValidationErrors([]);
    
    // Avanzar al siguiente semestre o finalizar
    if (isLastSemester) {
      setCurrentStep('completed');
    } else {
      setCurrentSemesterIndex(prev => prev + 1);
    }
  };

  // Renderizar paso inicial
  const renderInitialStep = () => (
    <div style={{
      background: 'linear-gradient(135deg, rgba(15, 23, 42, 0.9) 0%, rgba(30, 41, 59, 0.8) 100%)',
      backdropFilter: 'blur(20px)',
      borderRadius: '20px',
      border: '1px solid rgba(148, 163, 184, 0.3)',
      padding: '40px',
      maxWidth: '600px',
      margin: '0 auto'
    }}>
      <div style={{ textAlign: 'center', marginBottom: '32px' }}>
        <h2 style={{
          fontSize: '28px',
          fontWeight: 'bold',
          background: 'linear-gradient(to right, #06b6d4, #3b82f6, #8b5cf6)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          margin: 0,
          marginBottom: '12px'
        }}>
          📚 Registro de Cursos Académicos
        </h2>
        <p style={{ color: '#94a3b8', fontSize: '16px', margin: 0 }}>
          Registra tu historial académico semestre por semestre
        </p>
      </div>

      <div style={{ marginBottom: '32px' }}>
        <label style={{
          display: 'block',
          color: '#cbd5e1',
          fontSize: '16px',
          fontWeight: '600',
          marginBottom: '12px'
        }}>
          ¿Cuál fue tu primer semestre en la universidad?
        </label>
        
        <select
          value={startingSemester}
          onChange={(e) => setStartingSemester(e.target.value)}
          style={{
            width: '100%',
            padding: '16px 20px',
            borderRadius: '12px',
            border: '1px solid rgba(148, 163, 184, 0.3)',
            background: 'rgba(30, 41, 59, 0.6)',
            color: 'white',
            fontSize: '16px',
            outline: 'none',
            cursor: 'pointer'
          }}
        >
          <option value="">Selecciona tu primer semestre...</option>
          {availableSemesters.map(semester => (
            <option key={semester} value={semester}>
              {semester.endsWith('-0') ? `Verano ${semester.split('-')[0]}` : semester}
            </option>
          ))}
        </select>
      </div>

      <div style={{
        background: 'rgba(6, 182, 212, 0.1)',
        border: '1px solid rgba(6, 182, 212, 0.3)',
        borderRadius: '12px',
        padding: '20px',
        marginBottom: '32px'
      }}>
        <div style={{ color: '#67e8f9', fontSize: '16px', fontWeight: '600', marginBottom: '8px' }}>
          💡 ¿Qué vas a registrar?
        </div>
        <ul style={{ color: '#cbd5e1', fontSize: '14px', margin: 0, paddingLeft: '20px' }}>
          <li>Los cursos que llevaste en cada semestre</li>
          <li>Las notas que obtuviste (para validar prerrequisitos)</li>
          <li>Excepciones de matrícula cuando aplique</li>
          <li>Semestres suspendidos (si los hubo)</li>
        </ul>
      </div>

      <button
        onClick={handleStartRegistration}
        disabled={!startingSemester}
        style={{
          width: '100%',
          padding: '16px 24px',
          borderRadius: '12px',
          border: 'none',
          background: startingSemester 
            ? 'linear-gradient(135deg, #06b6d4, #3b82f6)' 
            : 'rgba(148, 163, 184, 0.3)',
          color: 'white',
          cursor: startingSemester ? 'pointer' : 'not-allowed',
          fontSize: '16px',
          fontWeight: '600',
          transition: 'all 0.3s ease',
          opacity: startingSemester ? 1 : 0.5
        }}
      >
        🚀 Comenzar Registro
      </button>
    </div>
  );

  // Renderizar paso de registro por semestre
  const renderSemesterStep = () => (
    <div style={{
      background: 'linear-gradient(135deg, rgba(15, 23, 42, 0.9) 0%, rgba(30, 41, 59, 0.8) 100%)',
      backdropFilter: 'blur(20px)',
      borderRadius: '20px',
      border: '1px solid rgba(148, 163, 184, 0.3)',
      padding: '32px',
      maxWidth: '1000px',
      margin: '0 auto'
    }}>
      <SemesterRegistrationForm
        semester={currentSemester}
        semesterIndex={currentSemesterIndex}
        totalSemesters={semesterSequence.length}
        isCurrentCycle={isCurrentAcademicCycle}
        availableCourses={getCoursesForCycle(Math.ceil((currentSemesterIndex + 1) / 2))}
        onRegister={handleRegisterSemester}
        onBack={() => {
          if (currentSemesterIndex > 0) {
            setCurrentSemesterIndex(prev => prev - 1);
          } else {
            setCurrentStep('initial');
          }
        }}
        validationErrors={validationErrors}
        previousSemesters={registeredSemesters}
      />
    </div>
  );

  // Renderizar paso completado
  const renderCompletedStep = () => (
    <div style={{
      background: 'linear-gradient(135deg, rgba(15, 23, 42, 0.9) 0%, rgba(30, 41, 59, 0.8) 100%)',
      backdropFilter: 'blur(20px)',
      borderRadius: '20px',
      border: '1px solid rgba(148, 163, 184, 0.3)',
      padding: '40px',
      maxWidth: '600px',
      margin: '0 auto',
      textAlign: 'center'
    }}>
      <div style={{ fontSize: '64px', marginBottom: '24px' }}>🎉</div>
      <h2 style={{
        fontSize: '28px',
        fontWeight: 'bold',
        color: '#10b981',
        margin: '0 0 16px 0'
      }}>
        ¡Registro Completado!
      </h2>
      <p style={{ color: '#cbd5e1', fontSize: '16px', marginBottom: '32px' }}>
        Has registrado exitosamente tu historial académico. Ahora puedes visualizar tu malla curricular 
        con todos tus cursos aprobados y planificar tu ruta académica.
      </p>
      
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: '16px',
        marginBottom: '32px'
      }}>
        <div style={{
          background: 'rgba(16, 185, 129, 0.1)',
          border: '1px solid rgba(16, 185, 129, 0.3)',
          borderRadius: '12px',
          padding: '20px'
        }}>
          <div style={{ color: '#10b981', fontSize: '24px', marginBottom: '8px' }}>
            {Object.keys(registeredSemesters).length}
          </div>
          <div style={{ color: '#cbd5e1', fontSize: '14px' }}>
            Semestres registrados
          </div>
        </div>
        
        <div style={{
          background: 'rgba(6, 182, 212, 0.1)',
          border: '1px solid rgba(6, 182, 212, 0.3)',
          borderRadius: '12px',
          padding: '20px'
        }}>
          <div style={{ color: '#06b6d4', fontSize: '24px', marginBottom: '8px' }}>
            {Object.values(registeredSemesters).reduce((total, semester) => 
              total + (semester.courses?.length || 0), 0
            )}
          </div>
          <div style={{ color: '#cbd5e1', fontSize: '14px' }}>
            Cursos registrados
          </div>
        </div>
      </div>

      <button
        onClick={() => {
          // En producción, redireccionar a la malla curricular
          alert('Redirigiendo a la malla curricular...');
        }}
        style={{
          width: '100%',
          padding: '16px 24px',
          borderRadius: '12px',
          border: 'none',
          background: 'linear-gradient(135deg, #10b981, #059669)',
          color: 'white',
          cursor: 'pointer',
          fontSize: '16px',
          fontWeight: '600'
        }}
      >
        🗺️ Ver Mi Malla Curricular
      </button>
    </div>
  );

  return (
    <div style={{
      padding: '24px',
      color: 'white',
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    }}>
      {currentStep === 'initial' && renderInitialStep()}
      {currentStep === 'semester' && renderSemesterStep()}
      {currentStep === 'completed' && renderCompletedStep()}
    </div>
  );
};

// Componente para el formulario de registro de cada semestre
const SemesterRegistrationForm = ({ 
  semester, 
  semesterIndex, 
  totalSemesters, 
  isCurrentCycle,
  availableCourses, 
  onRegister, 
  onBack,
  validationErrors,
  previousSemesters 
}) => {
  const [semesterData, setSemesterData] = useState({
    courses: [],
    suspended: false,
    notes: ''
  });
  const [showElectiveOptions, setShowElectiveOptions] = useState({});

  const handleAddCourse = (course, isElective = false, subcategoryName = '') => {
    const newCourse = {
      courseId: course.id,
      courseCode: course.code,
      courseName: course.name,
      credits: course.credits,
      grade: isCurrentCycle ? null : 11, // Si es ciclo actual, no se puede poner nota aún
      exception: false,
      isElective,
      subcategoryName
    };

    setSemesterData(prev => ({
      ...prev,
      courses: [...prev.courses, newCourse]
    }));
  };

  const handleRemoveCourse = (courseId) => {
    setSemesterData(prev => ({
      ...prev,
      courses: prev.courses.filter(c => c.courseId !== courseId)
    }));
  };

  const handleUpdateGrade = (courseId, grade) => {
    setSemesterData(prev => ({
      ...prev,
      courses: prev.courses.map(c => 
        c.courseId === courseId ? { ...c, grade: parseInt(grade) } : c
      )
    }));
  };

  const handleToggleException = (courseId) => {
    setSemesterData(prev => ({
      ...prev,
      courses: prev.courses.map(c => 
        c.courseId === courseId ? { ...c, exception: !c.exception } : c
      )
    }));
  };

  const toggleElectiveOptions = (subcategoryName) => {
    setShowElectiveOptions(prev => ({
      ...prev,
      [subcategoryName]: !prev[subcategoryName]
    }));
  };

  const isCourseTaken = (courseId) => {
    return semesterData.courses.some(c => c.courseId === courseId);
  };

  const handleSubmit = () => {
    onRegister(semesterData);
  };

  return (
    <>
      {/* Header */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '32px',
        paddingBottom: '20px',
        borderBottom: '1px solid rgba(148, 163, 184, 0.2)'
      }}>
        <div>
          <h3 style={{
            fontSize: '24px',
            fontWeight: 'bold',
            color: '#06b6d4',
            margin: 0,
            marginBottom: '4px'
          }}>
            📅 Semestre {semester}
            {isCurrentCycle && (
              <span style={{
                marginLeft: '12px',
                padding: '4px 8px',
                borderRadius: '12px',
                background: '#10b98120',
                color: '#10b981',
                fontSize: '12px',
                fontWeight: '600'
              }}>
                ⚡ ACTUAL
              </span>
            )}
          </h3>
          <p style={{ color: '#94a3b8', margin: 0 }}>
            {semester.endsWith('-0') ? 'Ciclo de Verano' : 'Ciclo Regular'}
          </p>
        </div>
        
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '16px',
          color: '#94a3b8',
          fontSize: '14px'
        }}>
          <span>Semestre {semesterIndex + 1} de {totalSemesters}</span>
          <div style={{
            width: '100px',
            height: '6px',
            background: 'rgba(148, 163, 184, 0.3)',
            borderRadius: '3px',
            overflow: 'hidden'
          }}>
            <div style={{
              width: `${((semesterIndex + 1) / totalSemesters) * 100}%`,
              height: '100%',
              background: 'linear-gradient(135deg, #06b6d4, #3b82f6)',
              transition: 'width 0.3s ease'
            }} />
          </div>
        </div>
      </div>

      {/* Suspend Semester Option */}
      <div style={{
        marginBottom: '24px',
        padding: '16px',
        background: 'rgba(245, 158, 11, 0.1)',
        border: '1px solid rgba(245, 158, 11, 0.3)',
        borderRadius: '12px'
      }}>
        <label style={{
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          cursor: 'pointer'
        }}>
          <input
            type="checkbox"
            checked={semesterData.suspended}
            onChange={(e) => setSemesterData(prev => ({
              ...prev,
              suspended: e.target.checked,
              courses: e.target.checked ? [] : prev.courses
            }))}
            style={{
              width: '18px',
              height: '18px',
              accentColor: '#f59e0b'
            }}
          />
          <div>
            <span style={{ color: '#fbbf24', fontSize: '16px', fontWeight: '600' }}>
              ⏸️ Suspendí este semestre
            </span>
            <p style={{ color: '#cbd5e1', fontSize: '14px', margin: '4px 0 0 0' }}>
              Marca esta opción si no llevaste cursos en este semestre
            </p>
          </div>
        </label>
      </div>

      {!semesterData.suspended && (
        <>
          {/* Available Courses */}
          <div style={{ marginBottom: '32px' }}>
            <h4 style={{ color: '#67e8f9', fontSize: '18px', marginBottom: '16px' }}>
              📚 Cursos Disponibles
            </h4>
            
            {/* Obligatory Courses */}
            {availableCourses.obligatoryCourses.length > 0 && (
              <div style={{ marginBottom: '24px' }}>
                <h5 style={{ color: '#cbd5e1', fontSize: '16px', marginBottom: '12px' }}>
                  Cursos Obligatorios
                </h5>
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
                  gap: '12px'
                }}>
                  {availableCourses.obligatoryCourses.map(course => (
                    <CourseCard
                      key={course.id}
                      course={course}
                      isTaken={isCourseTaken(course.id)}
                      onAdd={() => handleAddCourse(course)}
                      onRemove={() => handleRemoveCourse(course.id)}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Elective Courses */}
            {availableCourses.electiveCourses.length > 0 && (
              <div>
                <h5 style={{ color: '#cbd5e1', fontSize: '16px', marginBottom: '12px' }}>
                  Cursos Electivos
                </h5>
                {availableCourses.electiveCourses.map(subcategory => (
                  <div key={subcategory.subcategoryName} style={{ marginBottom: '16px' }}>
                    <button
                      onClick={() => toggleElectiveOptions(subcategory.subcategoryName)}
                      style={{
                        width: '100%',
                        padding: '16px',
                        borderRadius: '12px',
                        border: '1px solid rgba(139, 92, 246, 0.3)',
                        background: 'rgba(139, 92, 246, 0.1)',
                        color: '#a855f7',
                        cursor: 'pointer',
                        fontSize: '16px',
                        fontWeight: '600',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        textAlign: 'left'
                      }}
                    >
                      <div>
                        <div>{subcategory.subcategoryName}</div>
                        <div style={{ fontSize: '12px', opacity: 0.8, marginTop: '4px' }}>
                          Requiere {subcategory.requiredCourses} curso{subcategory.requiredCourses !== 1 ? 's' : ''}
                        </div>
                      </div>
                      <span style={{
                        transform: showElectiveOptions[subcategory.subcategoryName] ? 'rotate(180deg)' : 'rotate(0deg)',
                        transition: 'transform 0.3s ease'
                      }}>
                        ▼
                      </span>
                    </button>
                    
                    {showElectiveOptions[subcategory.subcategoryName] && (
                      <div style={{
                        marginTop: '12px',
                        padding: '16px',
                        background: 'rgba(30, 41, 59, 0.4)',
                        borderRadius: '12px',
                        border: '1px solid rgba(148, 163, 184, 0.2)'
                      }}>
                        <div style={{
                          display: 'grid',
                          gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
                          gap: '12px'
                        }}>
                          {subcategory.courses.map(course => (
                            <CourseCard
                              key={course.id}
                              course={course}
                              isTaken={isCourseTaken(course.id)}
                              onAdd={() => handleAddCourse(course, true, subcategory.subcategoryName)}
                              onRemove={() => handleRemoveCourse(course.id)}
                              isElective={true}
                            />
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Selected Courses */}
          {semesterData.courses.length > 0 && (
            <div style={{ marginBottom: '32px' }}>
              <h4 style={{ color: '#67e8f9', fontSize: '18px', marginBottom: '16px' }}>
                ✅ Cursos Seleccionados ({semesterData.courses.length})
              </h4>
              
              <div style={{
                background: 'rgba(30, 41, 59, 0.4)',
                borderRadius: '12px',
                border: '1px solid rgba(148, 163, 184, 0.2)',
                overflow: 'hidden'
              }}>
                {semesterData.courses.map((course, index) => (
                  <SelectedCourseRow
                    key={course.courseId}
                    course={course}
                    index={index}
                    isCurrentCycle={isCurrentCycle}
                    onRemove={() => handleRemoveCourse(course.courseId)}
                    onUpdateGrade={(grade) => handleUpdateGrade(course.courseId, grade)}
                    onToggleException={() => handleToggleException(course.courseId)}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Validation Errors */}
          {validationErrors.length > 0 && (
            <div style={{
              marginBottom: '24px',
              padding: '16px',
              background: 'rgba(239, 68, 68, 0.1)',
              border: '1px solid rgba(239, 68, 68, 0.3)',
              borderRadius: '12px'
            }}>
              <h5 style={{ color: '#ef4444', fontSize: '16px', marginBottom: '12px' }}>
                ⚠️ Errores de Prerrequisitos
              </h5>
              <ul style={{ color: '#fca5a5', fontSize: '14px', margin: 0, paddingLeft: '20px' }}>
                {validationErrors.map((error, index) => (
                  <li key={index} style={{ marginBottom: '4px' }}>{error}</li>
                ))}
              </ul>
              <p style={{ color: '#cbd5e1', fontSize: '12px', marginTop: '12px', margin: '12px 0 0 0' }}>
                💡 Tip: Puedes marcar "Excepción de matrícula" en los cursos que llevaste sin cumplir prerrequisitos
              </p>
            </div>
          )}
        </>
      )}

      {/* Navigation */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: '32px',
        paddingTop: '20px',
        borderTop: '1px solid rgba(148, 163, 184, 0.2)'
      }}>
        <button
          onClick={onBack}
          style={{
            padding: '12px 24px',
            borderRadius: '12px',
            border: '1px solid rgba(148, 163, 184, 0.3)',
            background: 'rgba(30, 41, 59, 0.6)',
            color: '#cbd5e1',
            cursor: 'pointer',
            fontSize: '14px',
            fontWeight: '500'
          }}
        >
          ← Anterior
        </button>

        <div style={{ display: 'flex', gap: '12px' }}>
          <button
            onClick={() => setSemesterData({ courses: [], suspended: false, notes: '' })}
            style={{
              padding: '12px 20px',
              borderRadius: '12px',
              border: '1px solid rgba(148, 163, 184, 0.3)',
              background: 'transparent',
              color: '#94a3b8',
              cursor: 'pointer',
              fontSize: '14px'
            }}
          >
            🗑️ Limpiar
          </button>
          
          <button
            onClick={handleSubmit}
            disabled={!semesterData.suspended && semesterData.courses.length === 0}
            style={{
              padding: '12px 24px',
              borderRadius: '12px',
              border: 'none',
              background: (!semesterData.suspended && semesterData.courses.length === 0)
                ? 'rgba(148, 163, 184, 0.3)'
                : 'linear-gradient(135deg, #10b981, #059669)',
              color: 'white',
              cursor: (!semesterData.suspended && semesterData.courses.length === 0) ? 'not-allowed' : 'pointer',
              fontSize: '14px',
              fontWeight: '600',
              opacity: (!semesterData.suspended && semesterData.courses.length === 0) ? 0.5 : 1
            }}
          >
            {semesterData.suspended ? '⏸️ Registrar Suspensión' : '✅ Confirmar Semestre'} →
          </button>
        </div>
      </div>
    </>
  );
};

// Componente para cada curso disponible
const CourseCard = ({ course, isTaken, onAdd, onRemove, isElective = false }) => {
  return (
    <div style={{
      background: isTaken ? 'rgba(16, 185, 129, 0.1)' : 'rgba(30, 41, 59, 0.6)',
      border: `1px solid ${isTaken ? 'rgba(16, 185, 129, 0.3)' : 'rgba(148, 163, 184, 0.2)'}`,
      borderRadius: '12px',
      padding: '16px',
      transition: 'all 0.3s ease'
    }}>
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: '8px'
      }}>
        <div style={{ flex: 1 }}>
          <div style={{
            color: isElective ? '#a855f7' : '#06b6d4',
            fontSize: '14px',
            fontWeight: '600',
            marginBottom: '4px'
          }}>
            {course.code}
          </div>
          <div style={{
            color: '#cbd5e1',
            fontSize: '16px',
            fontWeight: '600',
            marginBottom: '4px'
          }}>
            {course.name}
          </div>
          <div style={{
            color: '#94a3b8',
            fontSize: '12px'
          }}>
            {course.credits} crédito{course.credits !== 1 ? 's' : ''}
          </div>
        </div>

        <button
          onClick={isTaken ? onRemove : onAdd}
          style={{
            padding: '8px 12px',
            borderRadius: '8px',
            border: 'none',
            background: isTaken ? '#ef4444' : '#10b981',
            color: 'white',
            cursor: 'pointer',
            fontSize: '12px',
            fontWeight: '600',
            transition: 'all 0.2s ease'
          }}
        >
          {isTaken ? '✕' : '+'}
        </button>
      </div>
    </div>
  );
};

// Componente para cada curso seleccionado
const SelectedCourseRow = ({ 
  course, 
  index, 
  isCurrentCycle, 
  onRemove, 
  onUpdateGrade, 
  onToggleException 
}) => {
  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: '2fr 1fr 1fr 1fr auto',
      gap: '16px',
      padding: '16px 20px',
      borderBottom: index < 999 ? '1px solid rgba(148, 163, 184, 0.1)' : 'none',
      alignItems: 'center'
    }}>
      {/* Course Info */}
      <div>
        <div style={{
          color: course.isElective ? '#a855f7' : '#06b6d4',
          fontSize: '14px',
          fontWeight: '600',
          marginBottom: '2px'
        }}>
          {course.courseCode}
          {course.isElective && (
            <span style={{
              marginLeft: '8px',
              padding: '2px 6px',
              borderRadius: '10px',
              background: '#a855f720',
              fontSize: '10px'
            }}>
              ELECTIVO
            </span>
          )}
        </div>
        <div style={{ color: '#cbd5e1', fontSize: '14px' }}>
          {course.courseName}
        </div>
        {course.subcategoryName && (
          <div style={{ color: '#94a3b8', fontSize: '12px', marginTop: '2px' }}>
            {course.subcategoryName}
          </div>
        )}
      </div>

      {/* Credits */}
      <div style={{ color: '#94a3b8', fontSize: '14px' }}>
        {course.credits} crédito{course.credits !== 1 ? 's' : ''}
      </div>

      {/* Grade Input */}
      <div>
        {isCurrentCycle ? (
          <span style={{
            padding: '6px 12px',
            borderRadius: '8px',
            background: '#f59e0b20',
            color: '#f59e0b',
            fontSize: '12px',
            fontWeight: '600'
          }}>
            En curso
          </span>
        ) : (
          <input
            type="number"
            min="0"
            max="20"
            value={course.grade || ''}
            onChange={(e) => onUpdateGrade(e.target.value)}
            placeholder="Nota"
            style={{
              width: '60px',
              padding: '6px 8px',
              borderRadius: '6px',
              border: '1px solid rgba(148, 163, 184, 0.3)',
              background: 'rgba(15, 23, 42, 0.6)',
              color: 'white',
              fontSize: '14px',
              textAlign: 'center',
              outline: 'none'
            }}
          />
        )}
      </div>

      {/* Exception Checkbox */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        <label style={{
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
          cursor: 'pointer',
          fontSize: '12px',
          color: '#94a3b8'
        }}>
          <input
            type="checkbox"
            checked={course.exception}
            onChange={onToggleException}
            style={{
              width: '14px',
              height: '14px',
              accentColor: '#f59e0b'
            }}
          />
          Excepción
        </label>
      </div>

      {/* Remove Button */}
      <button
        onClick={onRemove}
        style={{
          padding: '6px 8px',
          borderRadius: '6px',
          border: 'none',
          background: 'rgba(239, 68, 68, 0.2)',
          color: '#ef4444',
          cursor: 'pointer',
          fontSize: '12px'
        }}
      >
        🗑️
      </button>
    </div>
  );
};

export default StudentCourseRegistration;