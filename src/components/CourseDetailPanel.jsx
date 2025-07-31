import React, { useState, useCallback, useMemo } from 'react';
import 'reactflow/dist/style.css';
import { checkPrerequisites, getCourseStatus } from '../utils/prerequisiteUtils.js';
import PrerequisitesPanel from '../components/PrerequisitesPanel.jsx';
const cycleData = {
  'Todos': {
    professors: 'Varios profesores',
    difficulty: 4,
    ratings: 127,
    comments: [
      { 
        id: 1, 
        author: 'Juan Pérez', 
        content: '¿Recomiendan llevar este curso en verano?', 
        timestamp: '2 días ago',
        likes: 5,
        dislikes: 1,
        replies: [
          {
            id: 11,
            author: 'Ana García',
            content: 'Es mejor con más tiempo. Las prácticas son semanales.',
            timestamp: '1 día ago',
            likes: 8,
            dislikes: 0,
            replies: [
              {
                id: 111,
                author: 'Carlos Ruiz',
                content: 'Totalmente de acuerdo, yo lo llevé en verano y fue agotador.',
                timestamp: '12 horas ago',
                likes: 3,
                dislikes: 0,
                replies: []
              }
            ]
          }
        ]
      },
      { 
        id: 2, 
        author: 'María López', 
        content: 'El laboratorio es fundamental para entender la teoría.', 
        timestamp: '3 días ago',
        likes: 12,
        dislikes: 0,
        replies: []
      }
    ]
  },
  '2025-1': {
    professors: 'Dr. Carlos Mendoza',
    difficulty: 4.2,
    ratings: 45,
    comments: [
      { 
        id: 1, 
        author: 'María López', 
        content: 'El Dr. Mendoza explica muy bien, pero es exigente.', 
        timestamp: '1 semana ago',
        likes: 15,
        dislikes: 2,
        replies: []
      },
      { 
        id: 2, 
        author: 'Pedro Vega', 
        content: 'Los exámenes son difíciles pero justos.', 
        timestamp: '3 días ago',
        likes: 8,
        dislikes: 1,
        replies: []
      }
    ]
  },
  '2024-2': {
    professors: 'Dra. Laura Jiménez',
    difficulty: 3.8,
    ratings: 52,
    comments: [
      { 
        id: 1, 
        author: 'Sofia Chen', 
        content: 'Excelente profesora, muy didáctica.', 
        timestamp: '2 meses ago',
        likes: 20,
        dislikes: 0,
        replies: []
      },
      { 
        id: 2, 
        author: 'Diego Ruiz', 
        content: 'Las clases son dinámicas y entretenidas.', 
        timestamp: '1 mes ago',
        likes: 12,
        dislikes: 1,
        replies: []
      }
    ]
  },
  '2024-1': {
    professors: 'Dr. Roberto Silva',
    difficulty: 4.5,
    ratings: 38,
    comments: [
      { 
        id: 1, 
        author: 'Andrea Morales', 
        content: 'Muy teórico, necesitas estudiar bastante.', 
        timestamp: '6 meses ago',
        likes: 9,
        dislikes: 3,
        replies: []
      },
      { 
        id: 2, 
        author: 'Luis Herrera', 
        content: 'Si le dedicas tiempo, aprendes mucho.', 
        timestamp: '5 meses ago',
        likes: 14,
        dislikes: 0,
        replies: []
      }
    ]
  }
};

const CourseDetailPanel = ({ course, onClose, isOpen, courseGrades }) => {
  const [newComment, setNewComment] = useState('');
  const [selectedCycle, setSelectedCycle] = useState('Todos');
  const [newRating, setNewRating] = useState(0);
  const [comments, setComments] = useState([]);
  const [sortBy, setSortBy] = useState('recent'); // 'recent' o 'top_rated'
  const [replyTo, setReplyTo] = useState(null); // ID del comentario al que se está respondiendo
  const [replyContent, setReplyContent] = useState('');
  
  // Actualizar comentarios cuando cambia el ciclo seleccionado
  React.useEffect(() => {
    if (selectedCycle && cycleData[selectedCycle]) {
      let sortedComments = [...cycleData[selectedCycle].comments];
      if (sortBy === 'top_rated') {
        sortedComments.sort((a, b) => (b.likes - b.dislikes) - (a.likes - a.dislikes));
      } else {
        // Por defecto ordenar por reciente (asumir que IDs más altos son más recientes)
        sortedComments.sort((a, b) => b.id - a.id);
      }
      setComments(sortedComments);
    }
  }, [selectedCycle, sortBy]);

  const currentData = cycleData[selectedCycle] || cycleData['Todos'];
  const canInteract = course?.status === 'approved';
  const prerequisites = course ? checkPrerequisites(course.id) : [];

  const handleAddComment = () => {
    if (newComment.trim() && canInteract) {
      const comment = {
        id: Math.max(...comments.map(c => c.id)) + 1,
        author: 'Usuario Actual',
        content: newComment,
        timestamp: 'ahora',
        likes: 0,
        dislikes: 0,
        replies: []
      };
      setComments([comment, ...comments]);
      setNewComment('');
    }
  };

  const handleAddReply = (parentId, depth = 0) => {
    if (replyContent.trim() && canInteract) {
      const newReply = {
        id: Date.now(), // Usar timestamp para IDs únicos
        author: 'Usuario Actual',
        content: replyContent,
        timestamp: 'ahora',
        likes: 0,
        dislikes: 0,
        replies: []
      };
      
      // Función recursiva para agregar respuesta
      const addReplyToComment = (comments, targetId) => {
        return comments.map(comment => {
          if (comment.id === targetId) {
            return { ...comment, replies: [...comment.replies, newReply] };
          } else if (comment.replies && comment.replies.length > 0) {
            return { ...comment, replies: addReplyToComment(comment.replies, targetId) };
          }
          return comment;
        });
      };
      
      setComments(addReplyToComment(comments, parentId));
      setReplyContent('');
      setReplyTo(null);
    }
  };

  const handleLike = (commentId, isReply = false, parentPath = []) => {
    // En una implementación real, esto sería una llamada a la API
    console.log(`Like comentario ${commentId}`);
  };

  const handleDislike = (commentId, isReply = false, parentPath = []) => {
    // En una implementación real, esto sería una llamada a la API
    console.log(`Dislike comentario ${commentId}`);
  };

  const handleReport = (commentId, isReply = false, parentPath = []) => {
    // En una implementación real, esto abriría un modal de reporte
    alert(`Reportar comentario ${commentId}`);
  };

  const renderComment = (comment, depth = 0) => {
    const marginLeft = depth * 20;
    const maxDepth = 3; // Máximo 3 niveles de profundidad
    
    return (
      <div key={comment.id} style={{ marginLeft: `${marginLeft}px`, marginBottom: '12px' }}>
        <div style={{ 
          padding: '12px', 
          borderRadius: '8px', 
          background: `rgba(51, 65, 85, ${0.7 - (depth * 0.1)})`, // Menos opacidad en mayor profundidad
          borderLeft: depth > 0 ? '3px solid #06b6d4' : 'none'
        }}>
          {/* Header del comentario */}
          <div style={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'flex-start', 
            marginBottom: '8px' 
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ fontWeight: '600', fontSize: '14px', color: '#67e8f9' }}>
                {comment.author}
              </span>
              {depth > 0 && (
                <span style={{ fontSize: '12px', color: '#94a3b8', fontStyle: 'italic' }}>
                  respondiendo
                </span>
              )}
            </div>
            <span style={{ fontSize: '12px', color: '#94a3b8' }}>
              {comment.timestamp}
            </span>
          </div>
          
          {/* Contenido del comentario */}
          <p style={{ fontSize: '14px', color: '#cbd5e1', lineHeight: '1.5', margin: '0 0 12px 0' }}>
            {comment.content}
          </p>
          
          {/* Botones de interacción */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px', fontSize: '12px' }}>
            <button
              onClick={() => handleLike(comment.id)}
              style={{
                background: 'none',
                border: 'none',
                color: '#94a3b8',
                cursor: canInteract ? 'pointer' : 'not-allowed',
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
                padding: '4px 8px',
                borderRadius: '4px',
                transition: 'all 0.2s ease'
              }}
              disabled={!canInteract}
              onMouseEnter={(e) => {
                if (canInteract) e.target.style.background = 'rgba(34, 197, 94, 0.1)';
              }}
              onMouseLeave={(e) => {
                e.target.style.background = 'none';
              }}
            >
              👍 {comment.likes}
            </button>
            
            <button
              onClick={() => handleDislike(comment.id)}
              style={{
                background: 'none',
                border: 'none',
                color: '#94a3b8',
                cursor: canInteract ? 'pointer' : 'not-allowed',
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
                padding: '4px 8px',
                borderRadius: '4px',
                transition: 'all 0.2s ease'
              }}
              disabled={!canInteract}
              onMouseEnter={(e) => {
                if (canInteract) e.target.style.background = 'rgba(239, 68, 68, 0.1)';
              }}
              onMouseLeave={(e) => {
                e.target.style.background = 'none';
              }}
            >
              👎 {comment.dislikes}
            </button>
            
            {depth < maxDepth && canInteract && (
              <button
                onClick={() => setReplyTo(replyTo === comment.id ? null : comment.id)}
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#94a3b8',
                  cursor: 'pointer',
                  padding: '4px 8px',
                  borderRadius: '4px',
                  transition: 'all 0.2s ease'
                }}
                onMouseEnter={(e) => e.target.style.background = 'rgba(6, 182, 212, 0.1)'}
                onMouseLeave={(e) => e.target.style.background = 'none'}
              >
                💬 Responder
              </button>
            )}
            
            <button
              onClick={() => handleReport(comment.id)}
              style={{
                background: 'none',
                border: 'none',
                color: '#94a3b8',
                cursor: 'pointer',
                padding: '4px 8px',
                borderRadius: '4px',
                transition: 'all 0.2s ease'
              }}
              onMouseEnter={(e) => e.target.style.background = 'rgba(239, 68, 68, 0.1)'}
              onMouseLeave={(e) => e.target.style.background = 'none'}
            >
              🚩 Reportar
            </button>
          </div>
          
          {/* Campo de respuesta */}
          {replyTo === comment.id && (
            <div style={{ marginTop: '12px', padding: '12px', background: 'rgba(30, 41, 59, 0.5)', borderRadius: '6px' }}>
              <textarea
                value={replyContent}
                onChange={(e) => setReplyContent(e.target.value)}
                placeholder="Escribe tu respuesta..."
                style={{
                  width: '100%',
                  minHeight: '60px',
                  padding: '8px',
                  borderRadius: '4px',
                  background: 'rgba(51, 65, 85, 0.8)',
                  border: '1px solid rgba(148, 163, 184, 0.3)',
                  color: 'white',
                  fontSize: '13px',
                  resize: 'vertical',
                  outline: 'none',
                  boxSizing: 'border-box'
                }}
              />
              <div style={{ display: 'flex', gap: '8px', marginTop: '8px' }}>
                <button
                  onClick={() => handleAddReply(comment.id, depth)}
                  disabled={!replyContent.trim()}
                  style={{
                    padding: '6px 12px',
                    borderRadius: '4px',
                    border: 'none',
                    background: replyContent.trim() ? 'linear-gradient(to right, #06b6d4, #3b82f6)' : '#64748b',
                    color: 'white',
                    fontSize: '12px',
                    cursor: replyContent.trim() ? 'pointer' : 'not-allowed'
                  }}
                >
                  Responder
                </button>
                <button
                  onClick={() => { setReplyTo(null); setReplyContent(''); }}
                  style={{
                    padding: '6px 12px',
                    borderRadius: '4px',
                    border: '1px solid #64748b',
                    background: 'transparent',
                    color: '#94a3b8',
                    fontSize: '12px',
                    cursor: 'pointer'
                  }}
                >
                  Cancelar
                </button>
              </div>
            </div>
          )}
        </div>
        
        {/* Renderizar respuestas recursivamente */}
        {comment.replies && comment.replies.length > 0 && (
          <div style={{ marginTop: '8px' }}>
            {comment.replies.map(reply => renderComment(reply, depth + 1))}
          </div>
        )}
      </div>
    );
  };

  const handleRatingClick = (rating) => {
    if (canInteract) {
      setNewRating(rating);
    }
  };

  if (!isOpen || !course) return null;

  return (
    <div 
      style={{ 
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: 'linear-gradient(135deg, rgba(0, 0, 0, 0.7) 0%, rgba(15, 23, 42, 0.8) 100%)',
        backdropFilter: 'blur(8px)',
        zIndex: 1000,
        display: 'flex',
        alignItems: 'stretch'
      }}
      onClick={onClose}
    >
      <div 
        style={{
          marginLeft: 'auto',
          width: '100%',
          maxWidth: '450px',
          height: '100vh',
          background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #334155 100%)',
          borderLeft: '1px solid rgba(148, 163, 184, 0.3)',
          boxShadow: '-20px 0 40px rgba(0, 0, 0, 0.5)',
          color: 'white',
          padding: '24px',
          overflowY: 'auto',
          transform: isOpen ? 'translateX(0)' : 'translateX(100%)',
          transition: 'transform 0.3s ease-in-out'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '24px' }}>
          <div>
            <h2 style={{ 
              fontSize: '24px', 
              fontWeight: 'bold', 
              background: 'linear-gradient(to right, #06b6d4, #3b82f6)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
              margin: 0,
              marginBottom: '4px'
            }}>
              {course.label}
            </h2>
            <p style={{ fontSize: '14px', color: '#cbd5e1', margin: 0 }}>
              Ciclo {course.cycle} • {course.credits} créditos
            </p>
          </div>
          <button 
            onClick={onClose} 
            style={{
              background: 'rgba(100, 116, 139, 0.2)',
              backdropFilter: 'blur(10px)',
              color: '#94a3b8',
              border: 'none',
              fontSize: '24px',
              width: '40px',
              height: '40px',
              borderRadius: '50%',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'all 0.2s ease'
            }}
            onMouseEnter={(e) => {
              e.target.style.color = 'white';
              e.target.style.background = 'rgba(100, 116, 139, 0.4)';
            }}
            onMouseLeave={(e) => {
              e.target.style.color = '#94a3b8';
              e.target.style.background = 'rgba(100, 116, 139, 0.2)';
            }}
          >
            ×
          </button>
        </div>

        {/* Selector de Ciclo */}
        <div style={{ 
          marginBottom: '24px', 
          padding: '16px', 
          borderRadius: '12px', 
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
            📅 Ciclo Académico
          </h3>
          <select 
            value={selectedCycle} 
            onChange={(e) => setSelectedCycle(e.target.value)}
            style={{
              width: '100%',
              padding: '8px',
              borderRadius: '8px',
              background: 'linear-gradient(135deg, #1e293b 0%, #334155 100%)',
              border: '1px solid rgba(148, 163, 184, 0.3)',
              color: 'white',
              fontSize: '14px',
              outline: 'none'
            }}
          >
            <option value="Todos">📊 Todos los ciclos</option>
            <option value="2025-1">🔥 2025-1 (Actual)</option>
            <option value="2024-2">❄️ 2024-2</option>
            <option value="2024-1">🌱 2024-1</option>
          </select>
        </div>

        {/* Estado del curso */}
        <div style={{ marginBottom: '24px' }}>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            padding: '8px 16px',
            borderRadius: '20px',
            fontSize: '14px',
            fontWeight: '600',
            background: course.status === 'approved' ? 'linear-gradient(to right, #10b981, #059669)' :
                       course.status === 'available' ? 'linear-gradient(to right, #06b6d4, #0891b2)' :
                       course.status === 'in_progress' ? 'linear-gradient(to right, #f59e0b, #d97706)' :
                       'linear-gradient(to right, #64748b, #475569)',
            color: 'white'
          }}>
            {course.status === 'approved' ? '✓ Aprobado' :
             course.status === 'available' ? '○ Disponible' :
             course.status === 'in_progress' ? '◐ En Progreso' :
             '🔒 Requiere Prerrequisitos'}
          </div>
          {!canInteract && (
            <p style={{ fontSize: '12px', color: '#fbbf24', marginTop: '8px', margin: '8px 0 0 0' }}>
              ⚠️ Información de solo lectura - Aprueba el curso para interactuar
            </p>
          )}
        </div>
  
        
        {/* Panel de prerrequisitos mejorado */}
        <PrerequisitesPanel course={course} courseGrades={courseGrades} />


        {/* Información del Profesor */}
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
            👨‍🏫 Profesor ({selectedCycle})
          </h3>
          <p style={{ fontSize: '14px', color: '#cbd5e1', margin: 0 }}>{currentData.professors}</p>
        </div>
        {/* Descripción */}
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
            📚 Descripción del Curso
          </h3>
          <p style={{ fontSize: '14px', color: '#cbd5e1', lineHeight: '1.6', margin: 0 }}>
            Este curso proporciona una introducción completa a los conceptos fundamentales de {course.label.toLowerCase()}. 
            Los estudiantes desarrollarán habilidades prácticas y teóricas necesarias para 
            el siguiente nivel de su formación académica en Ingeniería de Telecomunicaciones.
          </p>
        </div>
        {/* Calificación de Dificultad */}
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
            ⭐ Dificultad del Curso ({selectedCycle})
          </h3>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
            {[1, 2, 3, 4, 5].map(star => (
              <span 
                key={star} 
                style={{
                  fontSize: '20px',
                  cursor: canInteract ? 'pointer' : 'default',
                  color: star <= Math.round(currentData.difficulty) ? '#fbbf24' : '#64748b',
                  transition: 'all 0.2s ease',
                  filter: canInteract ? 'none' : 'grayscale(50%)'
                }}
                onClick={() => handleRatingClick(star)}
                onMouseEnter={(e) => {
                  if (canInteract) e.target.style.transform = 'scale(1.1)';
                }}
                onMouseLeave={(e) => {
                  if (canInteract) e.target.style.transform = 'scale(1)';
                }}
              >
                {star <= Math.round(currentData.difficulty) ? '★' : '☆'}
              </span>
            ))}
            <span style={{ fontSize: '14px', color: '#94a3b8', marginLeft: '8px' }}>
              ({currentData.difficulty}/5.0 - {currentData.ratings} valoraciones)
            </span>
          </div>
          {canInteract && newRating > 0 && (
            <div style={{ fontSize: '12px', color: '#06b6d4' }}>
              Tu calificación: {newRating}/5 ⭐
            </div>
          )}
        </div>
        
        {/* Foro de Comentarios MEJORADO */}
        <div style={{ 
          padding: '16px', 
          borderRadius: '12px', 
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
              💬 Foro de Estudiantes ({selectedCycle})
            </h3>
            
            {/* Selector de ordenamiento */}
            <select 
              value={sortBy} 
              onChange={(e) => setSortBy(e.target.value)}
              style={{
                padding: '4px 8px',
                borderRadius: '6px',
                background: 'linear-gradient(135deg, #1e293b 0%, #334155 100%)',
                border: '1px solid rgba(148, 163, 184, 0.3)',
                color: 'white',
                fontSize: '12px',
                outline: 'none'
              }}
            >
              <option value="recent">🕒 Más recientes</option>
              <option value="top_rated">⭐ Mejor valorados</option>
            </select>
          </div>
          
          {/* Lista de comentarios con respuestas anidadas */}
          <div style={{ 
            marginBottom: '16px', 
            maxHeight: '400px', 
            overflowY: 'auto',
            paddingRight: '4px'
          }}>
            {comments.map(comment => renderComment(comment, 0))}
          </div>
          
          {/* Agregar nuevo comentario */}
          <div style={{ borderTop: '1px solid #64748b', paddingTop: '16px' }}>
            <textarea 
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              style={{
                width: '100%',
                borderRadius: '8px',
                padding: '12px',
                fontSize: '14px',
                color: 'white',
                background: canInteract ? 'linear-gradient(135deg, #1e293b 0%, #334155 100%)' : 'rgba(71, 85, 105, 0.5)',
                border: '1px solid rgba(148, 163, 184, 0.3)',
                cursor: canInteract ? 'text' : 'not-allowed',
                resize: 'vertical',
                outline: 'none',
                boxSizing: 'border-box',
                minHeight: '80px'
              }}
              placeholder={canInteract ? "Comparte tu experiencia o haz una pregunta..." : "Debes aprobar el curso para comentar..."}
              disabled={!canInteract}
            />
            <button 
              onClick={handleAddComment}
              style={{
                width: '100%',
                marginTop: '12px',
                fontWeight: '600',
                padding: '12px 16px',
                borderRadius: '8px',
                border: 'none',
                cursor: canInteract && newComment.trim() ? 'pointer' : 'not-allowed',
                background: canInteract && newComment.trim() 
                  ? 'linear-gradient(to right, #06b6d4, #3b82f6)' 
                  : '#64748b',
                color: canInteract && newComment.trim() ? 'white' : '#94a3b8',
                transition: 'all 0.2s ease'
              }}
              disabled={!canInteract || !newComment.trim()}
              onMouseEnter={(e) => {
                if (canInteract && newComment.trim()) {
                  e.target.style.background = 'linear-gradient(to right, #0891b2, #2563eb)';
                }
              }}
              onMouseLeave={(e) => {
                if (canInteract && newComment.trim()) {
                  e.target.style.background = 'linear-gradient(to right, #06b6d4, #3b82f6)';
                }
              }}
            >
              {canInteract ? '📝 Publicar Comentario' : '🔒 Requiere Aprobación del Curso'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};


export default CourseDetailPanel;