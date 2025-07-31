// 📁 components/PrerequisitesPanel.jsx
import React from 'react';
import { checkPrerequisites } from '../utils/prerequisiteUtils.js';
import { PREREQUISITE_TYPES } from '../data/courseData.js';

const PrerequisitesPanel = ({ course, courseGrades = {} }) => {
  const prerequisites = course ? checkPrerequisites(course.id, courseGrades) : [];

  const getPrerequisiteIcon = (type) => {
    switch (type) {
      case PREREQUISITE_TYPES.APPROVED:
        return '📚'; // Debe estar aprobado
      case PREREQUISITE_TYPES.MIN_GRADE:
        return '📊'; // Requiere nota mínima
      case PREREQUISITE_TYPES.COREQUISITE:
        return '🔗'; // Correquisito
      default:
        return '❓';
    }
  };

  const getTypeDescription = (type, minGrade) => {
    switch (type) {
      case PREREQUISITE_TYPES.APPROVED:
        return 'Debe estar aprobado (≥11)';
      case PREREQUISITE_TYPES.MIN_GRADE:
        return `Requiere nota mínima de ${minGrade}`;
      case PREREQUISITE_TYPES.COREQUISITE:
        return 'Se puede llevar simultáneamente';
      default:
        return 'Tipo de prerrequisito desconocido';
    }
  };

  const getActionButton = (prereq) => {
    if (prereq.isMet) return null;

    const buttonStyle = {
      padding: '4px 8px',
      borderRadius: '6px',
      border: 'none',
      fontSize: '11px',
      fontWeight: '500',
      cursor: 'pointer',
      transition: 'all 0.2s ease',
      marginTop: '8px'
    };

    if (prereq.currentGrade === 0) {
      // No ha cursado el curso
      return (
        <button
          style={{
            ...buttonStyle,
            background: 'linear-gradient(to right, #3b82f6, #1d4ed8)',
            color: 'white'
          }}
          onMouseEnter={(e) => {
            e.target.style.background = 'linear-gradient(to right, #2563eb, #1e40af)';
          }}
          onMouseLeave={(e) => {
            e.target.style.background = 'linear-gradient(to right, #3b82f6, #1d4ed8)';
          }}
        >
          📝 Matricular curso
        </button>
      );
    } else {
      // Tiene nota pero no cumple el requisito
      return (
        <button
          style={{
            ...buttonStyle,
            background: 'linear-gradient(to right, #f59e0b, #d97706)',
            color: 'white'
          }}
          onMouseEnter={(e) => {
            e.target.style.background = 'linear-gradient(to right, #eab308, #ca8a04)';
          }}
          onMouseLeave={(e) => {
            e.target.style.background = 'linear-gradient(to right, #f59e0b, #d97706)';
          }}
        >
          🔄 Volver a llevar
        </button>
      );
    }
  };

  if (prerequisites.length === 0) {
    return (
      <div style={{ 
        padding: '16px', 
        borderRadius: '12px', 
        marginBottom: '24px', 
        background: 'rgba(30, 41, 59, 0.6)', 
        backdropFilter: 'blur(10px)' 
      }}>
        <h3 style={{ 
          fontWeight: '600', 
          marginBottom: '12px', 
          color: '#67e8f9',
          fontSize: '16px',
          margin: '0 0 12px 0'
        }}>
          🎯 Prerrequisitos
        </h3>
        <div style={{ 
          display: 'flex', 
          alignItems: 'center', 
          gap: '8px',
          padding: '12px',
          borderRadius: '8px',
          background: 'rgba(16, 185, 129, 0.1)',
          border: '1px solid rgba(16, 185, 129, 0.3)'
        }}>
          <span style={{ fontSize: '20px' }}>🎉</span>
          <div>
            <p style={{ color: '#34d399', fontWeight: '500', margin: 0, fontSize: '14px' }}>
              ¡Sin prerrequisitos!
            </p>
            <p style={{ color: '#a7f3d0', fontSize: '12px', margin: '2px 0 0 0' }}>
              Puedes llevar este curso desde el primer ciclo
            </p>
          </div>
        </div>
      </div>
    );
  }

  const allMet = prerequisites.every(p => p.isMet);
  const metCount = prerequisites.filter(p => p.isMet).length;

  return (
    <div style={{ 
      padding: '16px', 
      borderRadius: '12px', 
      marginBottom: '24px', 
      background: 'rgba(30, 41, 59, 0.6)', 
      backdropFilter: 'blur(10px)' 
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
        <h3 style={{ 
          fontWeight: '600', 
          color: '#67e8f9',
          fontSize: '16px',
          margin: 0
        }}>
          🎯 Prerrequisitos
        </h3>
        <div style={{
          padding: '4px 12px',
          borderRadius: '12px',
          fontSize: '12px',
          fontWeight: '600',
          background: allMet ? 'linear-gradient(to right, #10b981, #059669)' : 'linear-gradient(to right, #f59e0b, #d97706)',
          color: 'white'
        }}>
          {metCount}/{prerequisites.length} cumplidos
        </div>
      </div>

      {/* Resumen general */}
      <div style={{
        padding: '12px',
        borderRadius: '8px',
        marginBottom: '16px',
        background: allMet ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)',
        border: `1px solid ${allMet ? 'rgba(16, 185, 129, 0.3)' : 'rgba(239, 68, 68, 0.3)'}`
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ fontSize: '18px' }}>
            {allMet ? '✅' : '⚠️'}
          </span>
          <div>
            <p style={{ 
              color: allMet ? '#34d399' : '#fbbf24', 
              fontWeight: '600', 
              margin: 0, 
              fontSize: '14px' 
            }}>
              {allMet ? '¡Listo para llevar!' : 'Prerrequisitos pendientes'}
            </p>
            <p style={{ 
              color: allMet ? '#a7f3d0' : '#fed7aa', 
              fontSize: '12px', 
              margin: '2px 0 0 0' 
            }}>
              {allMet 
                ? 'Todos los prerrequisitos han sido cumplidos'
                : `Te faltan ${prerequisites.length - metCount} prerrequisitos por cumplir`
              }
            </p>
          </div>
        </div>
      </div>

      {/* Lista detallada de prerrequisitos */}
      <div style={{ fontSize: '14px', color: '#cbd5e1' }}>
        <h4 style={{ 
          fontSize: '14px', 
          fontWeight: '600', 
          color: '#94a3b8', 
          marginBottom: '12px',
          margin: '0 0 12px 0'
        }}>
          📋 Detalle de prerrequisitos:
        </h4>
        
        {prerequisites.map((prereq, index) => (
          <div 
            key={prereq.id}
            style={{
              padding: '16px',
              borderRadius: '10px',
              marginBottom: '12px',
              background: prereq.isMet 
                ? 'rgba(16, 185, 129, 0.05)' 
                : 'rgba(239, 68, 68, 0.05)',
              border: `1px solid ${prereq.isMet 
                ? 'rgba(16, 185, 129, 0.2)' 
                : 'rgba(239, 68, 68, 0.2)'}`,
              transition: 'all 0.2s ease'
            }}
          >
            {/* Header del prerrequisito */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ fontSize: '16px' }}>
                  {getPrerequisiteIcon(prereq.type)}
                </span>
                <div>
                  <h5 style={{ 
                    color: '#f1f5f9', 
                    fontWeight: '600', 
                    margin: 0, 
                    fontSize: '14px' 
                  }}>
                    {prereq.name}
                  </h5>
                  <p style={{ 
                    color: '#94a3b8', 
                    fontSize: '11px', 
                    margin: '2px 0 0 0',
                    fontStyle: 'italic'
                  }}>
                    {getTypeDescription(prereq.type, prereq.minGrade)}
                  </p>
                </div>
              </div>
              
              {/* Status badge */}
              <div style={{
                padding: '4px 8px',
                borderRadius: '12px',
                fontSize: '11px',
                fontWeight: '600',
                background: prereq.statusColor,
                color: 'white',
                whiteSpace: 'nowrap'
              }}>
                {prereq.isMet ? '✓' : '✗'}
              </div>
            </div>

            {/* Estado actual */}
            <div style={{ marginBottom: '8px' }}>
              <p style={{ 
                color: prereq.statusColor, 
                fontWeight: '500', 
                margin: 0, 
                fontSize: '13px' 
              }}>
                {prereq.statusText}
              </p>
            </div>

            {/* Recomendación */}
            {prereq.recommendation && (
              <div style={{
                padding: '8px',
                borderRadius: '6px',
                background: 'rgba(100, 116, 139, 0.1)',
                marginBottom: '8px'
              }}>
                <p style={{ 
                  color: '#cbd5e1', 
                  fontSize: '12px', 
                  margin: 0,
                  lineHeight: '1.4'
                }}>
                  💡 <strong>Recomendación:</strong> {prereq.recommendation}
                </p>
              </div>
            )}

            {/* Información adicional para notas */}
            {prereq.currentGrade > 0 && (
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '6px 8px',
                borderRadius: '6px',
                background: 'rgba(71, 85, 105, 0.2)',
                fontSize: '11px'
              }}>
                <span style={{ color: '#94a3b8' }}>Tu nota actual:</span>
                <span style={{ 
                  color: prereq.currentGrade >= (prereq.minGrade || 11) ? '#34d399' : '#fbbf24',
                  fontWeight: '600'
                }}>
                  {prereq.currentGrade}/20
                </span>
              </div>
            )}

            {/* Botón de acción */}
            {getActionButton(prereq)}
          </div>
        ))}
      </div>

      {/* Consejos adicionales */}
      {!allMet && (
        <div style={{
          marginTop: '16px',
          padding: '12px',
          borderRadius: '8px',
          background: 'rgba(59, 130, 246, 0.1)',
          border: '1px solid rgba(59, 130, 246, 0.3)'
        }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '8px' }}>
            <span style={{ fontSize: '16px' }}>💡</span>
            <div>
              <p style={{ color: '#93c5fd', fontWeight: '500', margin: 0, fontSize: '13px' }}>
                Consejos para cumplir prerrequisitos:
              </p>
              <ul style={{ 
                color: '#bfdbfe', 
                fontSize: '12px', 
                margin: '4px 0 0 0',
                paddingLeft: '16px',
                lineHeight: '1.4'
              }}>
                <li>Planifica tus cursos con anticipación</li>
                <li>Consulta con tu coordinador académico</li>
                <li>Considera llevar cursos de verano si es necesario</li>
                {prerequisites.some(p => p.type === PREREQUISITE_TYPES.COREQUISITE) && (
                  <li>Los correquisitos se pueden llevar en el mismo ciclo</li>
                )}
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PrerequisitesPanel;