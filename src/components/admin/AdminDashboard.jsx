import React from 'react';
import { useAuth } from '../../hooks/useAuth';

const AdminDashboard = () => {
  const { user } = useAuth();

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
        <h1 style={{
          fontSize: '32px',
          fontWeight: 'bold',
          background: 'linear-gradient(to right, #06b6d4, #3b82f6, #8b5cf6)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          marginBottom: '32px'
        }}>
          Panel de Administración
        </h1>
        
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: '24px',
          marginBottom: '32px'
        }}>
          {/* Tarjeta de Estadísticas */}
          <div style={{
            background: 'linear-gradient(135deg, rgba(15, 23, 42, 0.9) 0%, rgba(30, 41, 59, 0.8) 100%)',
            backdropFilter: 'blur(20px)',
            borderRadius: '16px',
            border: '1px solid rgba(148, 163, 184, 0.3)',
            padding: '24px'
          }}>
            <h3 style={{ color: '#67e8f9', marginBottom: '16px', fontSize: '18px' }}>
              📊 Estadísticas Generales
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: '#cbd5e1' }}>Total de Cursos:</span>
                <span style={{ color: '#06b6d4', fontWeight: 'bold' }}>156</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: '#cbd5e1' }}>Total de Profesores:</span>
                <span style={{ color: '#10b981', fontWeight: 'bold' }}>42</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: '#cbd5e1' }}>Estudiantes Activos:</span>
                <span style={{ color: '#f59e0b', fontWeight: 'bold' }}>1,247</span>
              </div>
            </div>
          </div>

          {/* Tarjeta de Acciones Rápidas */}
          <div style={{
            background: 'linear-gradient(135deg, rgba(15, 23, 42, 0.9) 0%, rgba(30, 41, 59, 0.8) 100%)',
            backdropFilter: 'blur(20px)',
            borderRadius: '16px',
            border: '1px solid rgba(148, 163, 184, 0.3)',
            padding: '24px'
          }}>
            <h3 style={{ color: '#67e8f9', marginBottom: '16px', fontSize: '18px' }}>
              ⚡ Acciones Rápidas
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <button style={{
                padding: '12px 16px',
                borderRadius: '8px',
                border: 'none',
                background: 'linear-gradient(135deg, #06b6d4, #3b82f6)',
                color: 'white',
                cursor: 'pointer',
                fontSize: '14px',
                fontWeight: '500'
              }}>
                + Agregar Nuevo Curso
              </button>
              <button style={{
                padding: '12px 16px',
                borderRadius: '8px',
                border: 'none',
                background: 'linear-gradient(135deg, #10b981, #059669)',
                color: 'white',
                cursor: 'pointer',
                fontSize: '14px',
                fontWeight: '500'
              }}>
                + Registrar Profesor
              </button>
              <button style={{
                padding: '12px 16px',
                borderRadius: '8px',
                border: 'none',
                background: 'linear-gradient(135deg, #f59e0b, #d97706)',
                color: 'white',
                cursor: 'pointer',
                fontSize: '14px',
                fontWeight: '500'
              }}>
                📊 Generar Reporte
              </button>
            </div>
          </div>
        </div>

        {/* Actividad Reciente */}
        <div style={{
          background: 'linear-gradient(135deg, rgba(15, 23, 42, 0.9) 0%, rgba(30, 41, 59, 0.8) 100%)',
          backdropFilter: 'blur(20px)',
          borderRadius: '16px',
          border: '1px solid rgba(148, 163, 184, 0.3)',
          padding: '24px'
        }}>
          <h3 style={{ color: '#67e8f9', marginBottom: '16px', fontSize: '18px' }}>
            🕒 Actividad Reciente
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {[
              { action: 'Curso "Redes Avanzadas" fue actualizado', time: '2 horas ago', user: 'Admin' },
              { action: 'Nuevo profesor "Dr. García" registrado', time: '5 horas ago', user: 'Admin' },
              { action: 'Estudiante completó onboarding', time: '1 día ago', user: 'Sistema' }
            ].map((activity, index) => (
              <div key={index} style={{
                padding: '12px',
                borderRadius: '8px',
                background: 'rgba(30, 41, 59, 0.6)',
                borderLeft: '3px solid #06b6d4'
              }}>
                <div style={{ color: '#cbd5e1', fontSize: '14px' }}>{activity.action}</div>
                <div style={{ color: '#94a3b8', fontSize: '12px', marginTop: '4px' }}>
                  {activity.time} • {activity.user}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
