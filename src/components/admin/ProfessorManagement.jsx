import React, { useState } from 'react';

const ProfessorManagement = () => {
  const [professors, setProfessors] = useState([
    { 
      id: 1, 
      name: 'Dr. Carlos López', 
      email: 'carlos.lopez@pucp.edu.pe',
      specialization: 'Matemáticas',
      courses: 3
    },
    { 
      id: 2, 
      name: 'Dra. Ana Martín', 
      email: 'ana.martin@pucp.edu.pe',
      specialization: 'Física',
      courses: 2
    }
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
            background: 'linear-gradient(to right, #10b981, #059669)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            margin: 0
          }}>
            👨‍🏫 Gestión de Profesores
          </h1>
          
          <button style={{
            padding: '12px 24px',
            borderRadius: '8px',
            border: 'none',
            background: 'linear-gradient(135deg, #10b981, #059669)',
            color: 'white',
            cursor: 'pointer',
            fontSize: '16px',
            fontWeight: '600'
          }}>
            + Agregar Profesor
          </button>
        </div>

        {/* Tabla de profesores */}
        <div style={{
          background: 'linear-gradient(135deg, rgba(15, 23, 42, 0.9) 0%, rgba(30, 41, 59, 0.8) 100%)',
          backdropFilter: 'blur(20px)',
          borderRadius: '16px',
          border: '1px solid rgba(148, 163, 184, 0.3)',
          overflow: 'hidden'
        }}>
          <div style={{
            display: 'grid',
            gridTemplateColumns: '2fr 2fr 1.5fr 1fr 1fr',
            gap: '16px',
            padding: '20px',
            background: 'rgba(30, 41, 59, 0.6)',
            borderBottom: '1px solid rgba(148, 163, 184, 0.3)',
            fontWeight: '600',
            color: '#67e8f9'
          }}>
            <div>Nombre</div>
            <div>Email</div>
            <div>Especialización</div>
            <div>Cursos</div>
            <div>Acciones</div>
          </div>
          
          {professors.map((professor) => (
            <div key={professor.id} style={{
              display: 'grid',
              gridTemplateColumns: '2fr 2fr 1.5fr 1fr 1fr',
              gap: '16px',
              padding: '20px',
              borderBottom: '1px solid rgba(148, 163, 184, 0.1)',
              transition: 'background 0.2s ease'
            }}
            onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(16, 185, 129, 0.05)'}
            onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
            >
              <div style={{ color: '#cbd5e1' }}>{professor.name}</div>
              <div style={{ color: '#94a3b8' }}>{professor.email}</div>
              <div style={{ color: '#94a3b8' }}>{professor.specialization}</div>
              <div style={{ color: '#94a3b8' }}>{professor.courses}</div>
              <div style={{ display: 'flex', gap: '8px' }}>
                <button style={{
                  padding: '6px 12px',
                  borderRadius: '6px',
                  border: 'none',
                  background: '#06b6d4',
                  color: 'white',
                  cursor: 'pointer',
                  fontSize: '12px'
                }}>
                  Ver
                </button>
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
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProfessorManagement;