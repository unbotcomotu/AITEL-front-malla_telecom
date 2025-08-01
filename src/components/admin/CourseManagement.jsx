import React, { useState } from 'react';

const CourseManagement = () => {
  const [courses, setCourses] = useState([
    { id: 1, name: 'Cálculo 1', cycle: 1, credits: 5, professor: 'Dr. López' },
    { id: 2, name: 'Física 1', cycle: 2, credits: 4, professor: 'Dra. Martín' },
    { id: 3, name: 'Programación', cycle: 1, credits: 4, professor: 'Ing. García' }
  ]);

  return (
    <div style={{
      padding: '24px',
      color: 'white',
      minHeight: '100vh'
    }}>
      <div style={{
        maxWidth: '1200px',
        margin: '0 auto'
      }}>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '32px'
        }}>
          <h1 style={{
            fontSize: '32px',
            fontWeight: 'bold',
            background: 'linear-gradient(to right, #06b6d4, #3b82f6)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            margin: 0
          }}>
            📚 Gestión de Cursos
          </h1>
          
          <button style={{
            padding: '12px 24px',
            borderRadius: '8px',
            border: 'none',
            background: 'linear-gradient(135deg, #06b6d4, #3b82f6)',
            color: 'white',
            cursor: 'pointer',
            fontSize: '16px',
            fontWeight: '600'
          }}>
            + Agregar Curso
          </button>
        </div>

        {/* Tabla de cursos */}
        <div style={{
          background: 'linear-gradient(135deg, rgba(15, 23, 42, 0.9) 0%, rgba(30, 41, 59, 0.8) 100%)',
          backdropFilter: 'blur(20px)',
          borderRadius: '16px',
          border: '1px solid rgba(148, 163, 184, 0.3)',
          overflow: 'hidden'
        }}>
          <div style={{
            display: 'grid',
            gridTemplateColumns: '2fr 1fr 1fr 2fr 1fr',
            gap: '16px',
            padding: '20px',
            background: 'rgba(30, 41, 59, 0.6)',
            borderBottom: '1px solid rgba(148, 163, 184, 0.3)',
            fontWeight: '600',
            color: '#67e8f9'
          }}>
            <div>Nombre del Curso</div>
            <div>Ciclo</div>
            <div>Créditos</div>
            <div>Profesor</div>
            <div>Acciones</div>
          </div>
          
          {courses.map((course) => (
            <div key={course.id} style={{
              display: 'grid',
              gridTemplateColumns: '2fr 1fr 1fr 2fr 1fr',
              gap: '16px',
              padding: '20px',
              borderBottom: '1px solid rgba(148, 163, 184, 0.1)',
              transition: 'background 0.2s ease'
            }}
            onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(6, 182, 212, 0.05)'}
            onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
            >
              <div style={{ color: '#cbd5e1' }}>{course.name}</div>
              <div style={{ color: '#94a3b8' }}>{course.cycle}</div>
              <div style={{ color: '#94a3b8' }}>{course.credits}</div>
              <div style={{ color: '#94a3b8' }}>{course.professor}</div>
              <div style={{ display: 'flex', gap: '8px' }}>
                <button style={{
                  padding: '6px 12px',
                  borderRadius: '6px',
                  border: 'none',
                  background: '#10b981',
                  color: 'white',
                  cursor: 'pointer',
                  fontSize: '12px'
                }}>
                  Editar
                </button>
                <button style={{
                  padding: '6px 12px',
                  borderRadius: '6px',
                  border: 'none',
                  background: '#ef4444',
                  color: 'white',
                  cursor: 'pointer',
                  fontSize: '12px'
                }}>
                  Eliminar
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CourseManagement;