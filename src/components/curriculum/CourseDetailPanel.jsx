// Actualizar comentarios cuando cambia el ciclo o horarioimport React, { useState, useMemo } from 'react';
import { checkPrerequisites } from '../../utils/prerequisiteUtils.js';
import PrerequisitesPanel from './PrerequisitesPanel.jsx';
import React, { useState, useCallback, useMemo } from 'react';
const CourseDetailPanel = ({ 
  course, 
  onClose, 
  isOpen, 
  courseGrades,
  cycleData, // Datos de ciclos y horarios
  commentsData // Datos de comentarios
}) => {
  const [selectedCycle, setSelectedCycle] = useState('Todos');
  const [selectedSchedule, setSelectedSchedule] = useState('general');
  const [newRating, setNewRating] = useState(0);
  const [sortBy, setSortBy] = useState('recent');
  
  // Estados para comentarios y respuestas
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [replyingTo, setReplyingTo] = useState(null);
  const [newReply, setNewReply] = useState('');
  const [expandedComments, setExpandedComments] = useState(new Set());

  // ID del usuario actual para el sistema de likes
  const currentUserId = 'current_user';

  // Información de aprobación del usuario actual (esto vendría del backend)
  const userCourseInfo = courseGrades[course?.id] ? {
    grade: courseGrades[course?.id],
    semester: '2024-1',
    schedule: 'horario_1',
    professor: 'Dr. Mendoza, Dra. García'
  } : null;

  // Obtener horarios disponibles para el ciclo seleccionado
  const availableSchedules = useMemo(() => {
    if (cycleData && cycleData[selectedCycle] && cycleData[selectedCycle].schedules) {
      return Object.entries(cycleData[selectedCycle].schedules).map(([key, data]) => ({
        key,
        ...data
      }));
    }
    return [];
  }, [selectedCycle, cycleData]);

  // Obtener datos del horario actual
  const currentScheduleData = useMemo(() => {
    if (cycleData && cycleData[selectedCycle] && cycleData[selectedCycle].schedules) {
      return cycleData[selectedCycle].schedules[selectedSchedule];
    }
    return cycleData?.['Todos']?.schedules?.general || {};
  }, [selectedCycle, selectedSchedule, cycleData]);

  // Actualizar comentarios cuando cambia el ciclo o horario
  React.useEffect(() => {
    if (commentsData) {
      let currentComments = [];
      
      if (selectedCycle === 'Todos') {
        currentComments = commentsData['Todos_general'] || [];
      } else {
        // Nueva estructura: commentsData['2025-1'].horario_1
        const cycleData = commentsData[selectedCycle];
        if (cycleData && cycleData[selectedSchedule]) {
          currentComments = cycleData[selectedSchedule] || [];
        }
      }
      
      if (sortBy === 'top_rated') {
        currentComments = [...currentComments].sort((a, b) => (b.likes - b.dislikes) - (a.likes - a.dislikes));
      } else {
        currentComments = [...currentComments].sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
      }
      
      setComments(currentComments);
    }
  }, [selectedCycle, selectedSchedule, sortBy, commentsData]);

  // Actualizar horario cuando cambia el ciclo
  React.useEffect(() => {
    if (availableSchedules.length > 0) {
      setSelectedSchedule(availableSchedules[0].key);
    }
  }, [availableSchedules]);

  // Funciones para manejar likes y dislikes
  const handleLike = (commentId, replyId = null) => {
    setComments(prevComments => {
      return prevComments.map(comment => {
        if (comment.id === commentId) {
          if (replyId) {
            // Manejar like en respuesta
            return {
              ...comment,
              replies: comment.replies.map(reply => {
                if (reply.id === replyId) {
                  const hasLiked = reply.likedBy?.includes(currentUserId);
                  const hasDisliked = reply.dislikedBy?.includes(currentUserId);
                  
                  let newLikedBy = reply.likedBy || [];
                  let newDislikedBy = reply.dislikedBy || [];
                  
                  if (hasLiked) {
                    // Quitar like
                    newLikedBy = newLikedBy.filter(id => id !== currentUserId);
                  } else {
                    // Agregar like
                    newLikedBy = [...newLikedBy, currentUserId];
                    // Si había dislike, quitarlo
                    if (hasDisliked) {
                      newDislikedBy = newDislikedBy.filter(id => id !== currentUserId);
                    }
                  }
                  
                  return {
                    ...reply,
                    likes: newLikedBy.length,
                    dislikes: newDislikedBy.length,
                    likedBy: newLikedBy,
                    dislikedBy: newDislikedBy
                  };
                }
                return reply;
              })
            };
          } else {
            // Manejar like en comentario principal
            const hasLiked = comment.likedBy?.includes(currentUserId);
            const hasDisliked = comment.dislikedBy?.includes(currentUserId);
            
            let newLikedBy = comment.likedBy || [];
            let newDislikedBy = comment.dislikedBy || [];
            
            if (hasLiked) {
              // Quitar like
              newLikedBy = newLikedBy.filter(id => id !== currentUserId);
            } else {
              // Agregar like
              newLikedBy = [...newLikedBy, currentUserId];
              // Si había dislike, quitarlo
              if (hasDisliked) {
                newDislikedBy = newDislikedBy.filter(id => id !== currentUserId);
              }
            }
            
            return {
              ...comment,
              likes: newLikedBy.length,
              dislikes: newDislikedBy.length,
              likedBy: newLikedBy,
              dislikedBy: newDislikedBy
            };
          }
        }
        return comment;
      });
    });
  };

  const handleDislike = (commentId, replyId = null) => {
    setComments(prevComments => {
      return prevComments.map(comment => {
        if (comment.id === commentId) {
          if (replyId) {
            // Manejar dislike en respuesta
            return {
              ...comment,
              replies: comment.replies.map(reply => {
                if (reply.id === replyId) {
                  const hasLiked = reply.likedBy?.includes(currentUserId);
                  const hasDisliked = reply.dislikedBy?.includes(currentUserId);
                  
                  let newLikedBy = reply.likedBy || [];
                  let newDislikedBy = reply.dislikedBy || [];
                  
                  if (hasDisliked) {
                    // Quitar dislike
                    newDislikedBy = newDislikedBy.filter(id => id !== currentUserId);
                  } else {
                    // Agregar dislike
                    newDislikedBy = [...newDislikedBy, currentUserId];
                    // Si había like, quitarlo
                    if (hasLiked) {
                      newLikedBy = newLikedBy.filter(id => id !== currentUserId);
                    }
                  }
                  
                  return {
                    ...reply,
                    likes: newLikedBy.length,
                    dislikes: newDislikedBy.length,
                    likedBy: newLikedBy,
                    dislikedBy: newDislikedBy
                  };
                }
                return reply;
              })
            };
          } else {
            // Manejar dislike en comentario principal
            const hasLiked = comment.likedBy?.includes(currentUserId);
            const hasDisliked = comment.dislikedBy?.includes(currentUserId);
            
            let newLikedBy = comment.likedBy || [];
            let newDislikedBy = comment.dislikedBy || [];
            
            if (hasDisliked) {
              // Quitar dislike
              newDislikedBy = newDislikedBy.filter(id => id !== currentUserId);
            } else {
              // Agregar dislike
              newDislikedBy = [...newDislikedBy, currentUserId];
              // Si había like, quitarlo
              if (hasLiked) {
                newLikedBy = newLikedBy.filter(id => id !== currentUserId);
              }
            }
            
            return {
              ...comment,
              likes: newLikedBy.length,
              dislikes: newDislikedBy.length,
              likedBy: newLikedBy,
              dislikedBy: newDislikedBy
            };
          }
        }
        return comment;
      });
    });
  };

  // Función para truncar texto
  const truncateText = (text, maxLength = 50) => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
  };

  // Función para formatear contenido (sin procesamiento de menciones)
  const formatContent = (content) => {
    return content;
  };

  const canInteract = course?.status === 'approved';

  // Funciones para manejar comentarios
  const handleAddComment = () => {
    if (newComment.trim() && canInteract) {
      const comment = {
        id: Date.now(),
        author: 'Usuario Actual',
        authorId: currentUserId,
        content: newComment,
        timestamp: new Date().toISOString(),
        likes: 0,
        dislikes: 0,
        likedBy: [],
        dislikedBy: [],
        replies: []
      };
      
      setComments([comment, ...comments]);
      setNewComment('');
    }
  };

  const handleAddReply = (commentId) => {
    if (newReply.trim() && canInteract) {
      const reply = {
        id: Date.now(),
        author: 'Usuario Actual',
        authorId: currentUserId,
        content: newReply, // Sin @mención en el contenido
        timestamp: new Date().toISOString(),
        likes: 0,
        dislikes: 0,
        likedBy: [],
        dislikedBy: [],
        replyTo: replyingTo ? {
          author: replyingTo.author,
          content: replyingTo.content,
          isReply: replyingTo.isReply || false
        } : null
      };

      setComments(comments.map(comment => {
        if (comment.id === commentId) {
          return {
            ...comment,
            replies: [...(comment.replies || []), reply]
          };
        }
        return comment;
      }));

      setNewReply('');
      setReplyingTo(null);
    }
  };

  const handleReply = (targetData, isReplyToReply = false) => {
    setReplyingTo({ 
      commentId: targetData.commentId || targetData.id, 
      author: targetData.author,
      content: targetData.content,
      isReply: isReplyToReply,
      replyId: isReplyToReply ? targetData.id : null
    });
    
    setNewReply(''); // Sin pre-llenar con @mención
    
    // Expandir el comentario para mostrar las respuestas
    const commentId = targetData.commentId || targetData.id;
    setExpandedComments(prev => new Set([...prev, commentId]));
    
    // Auto-scroll al área de respuesta
    setTimeout(() => {
      const replyArea = document.getElementById(`reply-area-${commentId}`);
      if (replyArea) {
        replyArea.scrollIntoView({ behavior: 'smooth', block: 'center' });
        replyArea.focus();
      }
    }, 100);
  };

  const handleReport = (commentId, replyId = null) => {
    alert(`Reportar ${replyId ? 'respuesta' : 'comentario'} ${replyId || commentId}`);
  };

  const toggleCommentExpansion = (commentId) => {
    setExpandedComments(prev => {
      const newSet = new Set(prev);
      if (newSet.has(commentId)) {
        newSet.delete(commentId);
      } else {
        newSet.add(commentId);
      }
      return newSet;
    });
  };

  const handleRatingClick = (rating) => {
    if (canInteract) {
      setNewRating(rating);
    }
  };

  // Renderizar una respuesta
  const renderReply = (reply, commentId) => {
    return (
      <div key={reply.id} style={{
        marginLeft: '20px',
        marginTop: '12px',
        padding: '12px',
        borderRadius: '8px',
        background: 'rgba(30, 41, 59, 0.6)',
        borderLeft: '3px solid #06b6d4'
      }}>
        {/* Contexto de respuesta - Información de a quién responde */}
        {reply.replyTo && (
          <div style={{
            fontSize: '11px',
            color: '#94a3b8',
            marginBottom: '8px',
            padding: '6px 10px',
            background: 'rgba(148, 163, 184, 0.1)',
            borderRadius: '6px',
            borderLeft: '2px solid #06b6d4',
            display: 'flex',
            alignItems: 'flex-start',
            gap: '8px'
          }}>
            <div style={{ 
              color: '#06b6d4', 
              fontWeight: '600',
              minWidth: 'fit-content'
            }}>
              💬 {reply.replyTo.author}:
            </div>
            <div style={{ 
              fontStyle: 'italic',
              opacity: 0.9,
              lineHeight: '1.3'
            }}>
              "{truncateText(reply.replyTo.content, 60)}"
            </div>
          </div>
        )}

        {/* Header de la respuesta */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
          marginBottom: '8px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontWeight: '600', fontSize: '13px', color: '#67e8f9' }}>
              {reply.author}
            </span>
          </div>
          <span style={{ fontSize: '11px', color: '#94a3b8' }}>
            {new Date(reply.timestamp).toLocaleString()}
          </span>
        </div>

        {/* Contenido de la respuesta */}
        <p style={{
          fontSize: '13px',
          color: '#cbd5e1',
          lineHeight: '1.4',
          margin: '0 0 8px 0',
          wordBreak: 'break-word'
        }}>
          {formatContent(reply.content)}
        </p>

        {/* Botones de interacción de la respuesta */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '11px' }}>
          <button
            onClick={() => handleLike(commentId, reply.id)}
            disabled={!canInteract}
            style={{
              background: 'none',
              border: 'none',
              color: reply.likedBy?.includes(currentUserId) ? '#10b981' : '#94a3b8',
              cursor: canInteract ? 'pointer' : 'not-allowed',
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
              padding: '2px 6px',
              borderRadius: '4px',
              fontWeight: reply.likedBy?.includes(currentUserId) ? '600' : 'normal',
              transition: 'all 0.2s ease'
            }}
          >
            👍 {reply.likes}
          </button>

          <button
            onClick={() => handleDislike(commentId, reply.id)}
            disabled={!canInteract}
            style={{
              background: 'none',
              border: 'none',
              color: reply.dislikedBy?.includes(currentUserId) ? '#ef4444' : '#94a3b8',
              cursor: canInteract ? 'pointer' : 'not-allowed',
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
              padding: '2px 6px',
              borderRadius: '4px',
              fontWeight: reply.dislikedBy?.includes(currentUserId) ? '600' : 'normal',
              transition: 'all 0.2s ease'
            }}
          >
            👎 {reply.dislikes}
          </button>

          {canInteract && (
            <button
              onClick={() => handleReply({ 
                commentId: commentId, 
                author: reply.author, 
                content: reply.content 
              }, true)}
              style={{
                background: 'none',
                border: 'none',
                color: '#94a3b8',
                cursor: 'pointer',
                padding: '2px 6px',
                borderRadius: '4px',
                fontSize: '11px'
              }}
            >
              💬 Responder
            </button>
          )}

          <button
            onClick={() => handleReport(commentId, reply.id)}
            style={{
              background: 'none',
              border: 'none',
              color: '#94a3b8',
              cursor: 'pointer',
              padding: '2px 6px',
              borderRadius: '4px',
              fontSize: '11px'
            }}
          >
            🚩
          </button>
        </div>
      </div>
    );
  };

  // Renderizar un comentario principal
  const renderComment = (comment) => {
    const isExpanded = expandedComments.has(comment.id);
    const hasReplies = comment.replies && comment.replies.length > 0;
    const isReplying = replyingTo?.commentId === comment.id;

    return (
      <div key={comment.id} style={{ marginBottom: '20px' }}>
        <div style={{
          padding: '16px',
          borderRadius: '12px',
          background: 'rgba(51, 65, 85, 0.7)',
          border: '1px solid rgba(148, 163, 184, 0.2)'
        }}>
          {/* Header del comentario */}
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-start',
            marginBottom: '8px'
          }}>
            <span style={{ fontWeight: '600', fontSize: '14px', color: '#67e8f9' }}>
              {comment.author}
            </span>
            <span style={{ fontSize: '12px', color: '#94a3b8' }}>
              {new Date(comment.timestamp).toLocaleString()}
            </span>
          </div>

          {/* Contenido del comentario */}
          <p style={{
            fontSize: '14px',
            color: '#cbd5e1',
            lineHeight: '1.5',
            margin: '0 0 12px 0',
            wordBreak: 'break-word'
          }}>
            {formatContent(comment.content)}
          </p>

          {/* Botones de interacción del comentario */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px', fontSize: '12px' }}>
            <button
              onClick={() => handleLike(comment.id)}
              disabled={!canInteract}
              style={{
                background: 'none',
                border: 'none',
                color: comment.likedBy?.includes(currentUserId) ? '#10b981' : '#94a3b8',
                cursor: canInteract ? 'pointer' : 'not-allowed',
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
                padding: '4px 8px',
                borderRadius: '6px',
                fontWeight: comment.likedBy?.includes(currentUserId) ? '600' : 'normal',
                transition: 'all 0.2s ease'
              }}
            >
              👍 {comment.likes}
            </button>

            <button
              onClick={() => handleDislike(comment.id)}
              disabled={!canInteract}
              style={{
                background: 'none',
                border: 'none',
                color: comment.dislikedBy?.includes(currentUserId) ? '#ef4444' : '#94a3b8',
                cursor: canInteract ? 'pointer' : 'not-allowed',
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
                padding: '4px 8px',
                borderRadius: '6px',
                fontWeight: comment.dislikedBy?.includes(currentUserId) ? '600' : 'normal',
                transition: 'all 0.2s ease'
              }}
            >
              👎 {comment.dislikes}
            </button>

            {canInteract && (
              <button
                onClick={() => handleReply({
                  id: comment.id,
                  author: comment.author,
                  content: comment.content
                }, false)}
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#94a3b8',
                  cursor: 'pointer',
                  padding: '4px 8px',
                  borderRadius: '6px',
                  fontSize: '12px'
                }}
              >
                💬 Responder
              </button>
            )}

            {hasReplies && (
              <button
                onClick={() => toggleCommentExpansion(comment.id)}
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#06b6d4',
                  cursor: 'pointer',
                  padding: '4px 8px',
                  borderRadius: '6px',
                  fontSize: '12px',
                  fontWeight: '600'
                }}
              >
                {isExpanded ? '▼' : '▶'} {comment.replies.length} respuesta{comment.replies.length !== 1 ? 's' : ''}
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
                borderRadius: '6px',
                fontSize: '12px'
              }}
            >
              🚩 Reportar
            </button>
          </div>
        </div>

        {/* Respuestas expandidas */}
        {isExpanded && hasReplies && (
          <div style={{ marginTop: '8px' }}>
            {comment.replies.map(reply => renderReply(reply, comment.id))}
          </div>
        )}

        {/* Área de respuesta */}
        {isReplying && (
          <div style={{
            marginTop: '12px',
            padding: '12px',
            borderRadius: '8px',
            background: 'rgba(6, 182, 212, 0.1)',
            border: '1px solid rgba(6, 182, 212, 0.3)'
          }}>
            {/* Información de a quién se está respondiendo */}
            <div style={{
              marginBottom: '12px',
              padding: '8px 12px',
              background: 'rgba(6, 182, 212, 0.15)',
              borderRadius: '6px',
              borderLeft: '3px solid #06b6d4'
            }}>
              <div style={{
                color: '#06b6d4',
                fontSize: '12px',
                fontWeight: '600',
                marginBottom: '4px',
                display: 'flex',
                alignItems: 'center',
                gap: '6px'
              }}>
                <span>💬</span>
                <span>Respondiendo a {replyingTo.author}:</span>
              </div>
              <div style={{
                color: '#0891b2',
                fontSize: '11px',
                fontStyle: 'italic',
                lineHeight: '1.3',
                opacity: 0.9
              }}>
                "{truncateText(replyingTo.content, 80)}"
              </div>
            </div>

            <textarea
              id={`reply-area-${comment.id}`}
              value={newReply}
              onChange={(e) => setNewReply(e.target.value)}
              placeholder="Escribe tu respuesta..."
              style={{
                width: '100%',
                minHeight: '60px',
                padding: '8px 12px',
                borderRadius: '6px',
                border: '1px solid rgba(148, 163, 184, 0.3)',
                background: 'rgba(30, 41, 59, 0.8)',
                color: 'white',
                fontSize: '13px',
                resize: 'vertical',
                outline: 'none',
                boxSizing: 'border-box'
              }}
            />
            <div style={{ display: 'flex', gap: '8px', marginTop: '8px', justifyContent: 'flex-end' }}>
              <button
                onClick={() => {
                  setReplyingTo(null);
                  setNewReply('');
                }}
                style={{
                  padding: '6px 12px',
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
                onClick={() => handleAddReply(comment.id)}
                disabled={!newReply.trim()}
                style={{
                  padding: '6px 12px',
                  borderRadius: '6px',
                  border: 'none',
                  background: newReply.trim() ? '#06b6d4' : '#64748b',
                  color: 'white',
                  cursor: newReply.trim() ? 'pointer' : 'not-allowed',
                  fontSize: '12px',
                  fontWeight: '600'
                }}
              >
                Responder
              </button>
            </div>
          </div>
        )}
      </div>
    );
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
          maxWidth: '500px',
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
          >
            ×
          </button>
        </div>

        {/* Selector de Ciclo y Horario */}
        {cycleData && (
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
              📅 Ciclo y Horario
            </h3>
            
            {/* Selector de Ciclo */}
            <div style={{ marginBottom: availableSchedules.length > 1 ? '12px' : '0' }}>
              <label style={{ display: 'block', color: '#cbd5e1', fontSize: '14px', marginBottom: '6px' }}>
                Ciclo Académico
              </label>
              <select 
                value={selectedCycle} 
                onChange={(e) => setSelectedCycle(e.target.value)}
                style={{
                  width: '100%',
                  padding: '8px 12px',
                  borderRadius: '8px',
                  background: 'linear-gradient(135deg, #1e293b 0%, #334155 100%)',
                  border: '1px solid rgba(148, 163, 184, 0.3)',
                  color: 'white',
                  fontSize: '14px',
                  outline: 'none'
                }}
              >
                {Object.keys(cycleData).map(cycle => (
                  <option key={cycle} value={cycle}>
                    {cycle === 'Todos' ? '📊 Todos los ciclos' : cycle}
                  </option>
                ))}
              </select>
            </div>

            {/* Selector de Horario */}
            {availableSchedules.length > 1 && (
              <div>
                <label style={{ display: 'block', color: '#cbd5e1', fontSize: '14px', marginBottom: '6px' }}>
                  Horario
                </label>
                <select 
                  value={selectedSchedule} 
                  onChange={(e) => setSelectedSchedule(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '8px 12px',
                    borderRadius: '8px',
                    background: 'linear-gradient(135deg, #1e293b 0%, #334155 100%)',
                    border: '1px solid rgba(148, 163, 184, 0.3)',
                    color: 'white',
                    fontSize: '14px',
                    outline: 'none'
                  }}
                >
                  {availableSchedules.map((schedule, index) => (
                    <option key={schedule.key} value={schedule.key}>
                      Horario {index + 1}: {schedule.schedule}
                    </option>
                  ))}
                </select>
              </div>
            )}
          </div>
        )}

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
          
          {/* Información de aprobación del usuario */}
          {userCourseInfo && (
            <div style={{
              marginTop: '12px',
              padding: '12px 16px',
              borderRadius: '12px',
              background: 'rgba(16, 185, 129, 0.1)',
              border: '1px solid rgba(16, 185, 129, 0.3)'
            }}>
              <div style={{ 
                color: '#10b981', 
                fontSize: '12px', 
                fontWeight: '600',
                marginBottom: '6px'
              }}>
                📊 Tu información del curso:
              </div>
              <div style={{ fontSize: '13px', color: '#34d399', lineHeight: '1.4' }}>
                <div><strong>Nota:</strong> {userCourseInfo.grade}/20</div>
                <div><strong>Semestre:</strong> {userCourseInfo.semester}</div>
                <div><strong>Profesor(es):</strong> {userCourseInfo.professor}</div>
                <div><strong>Horario:</strong> {userCourseInfo.schedule.replace('_', ' ')}</div>
              </div>
            </div>
          )}
          
          {!canInteract && (
            <p style={{ fontSize: '12px', color: '#fbbf24', marginTop: '8px', margin: '8px 0 0 0' }}>
              ⚠️ Solo lectura - Aprueba el curso para interactuar
            </p>
          )}
        </div>

        {/* Panel de prerrequisitos */}
        <PrerequisitesPanel course={course} courseGrades={courseGrades} />

        {/* Información del Profesor y Horario */}
        {currentScheduleData && Object.keys(currentScheduleData).length > 0 && (
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
              👨‍🏫 Información del Horario
            </h3>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '14px' }}>
              {currentScheduleData.professors && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ color: '#94a3b8' }}>👨‍🏫 Profesor{currentScheduleData.professors.length > 1 ? 'es' : ''}:</span>
                  <span style={{ color: '#cbd5e1' }}>{currentScheduleData.professors.join(', ')}</span>
                </div>
              )}
              
              {currentScheduleData.classroom && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ color: '#94a3b8' }}>📍 Aula:</span>
                  <span style={{ color: '#cbd5e1' }}>{currentScheduleData.classroom}</span>
                </div>
              )}
              
              {currentScheduleData.schedule && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ color: '#94a3b8' }}>🕐 Horario:</span>
                  <span style={{ color: '#cbd5e1' }}>{currentScheduleData.schedule}</span>
                </div>
              )}
            </div>
          </div>
        )}

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
        {currentScheduleData && currentScheduleData.difficulty && (
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
              ⭐ Dificultad del Curso
            </h3>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
              {[1, 2, 3, 4, 5].map(star => (
                <span 
                  key={star} 
                  style={{
                    fontSize: '20px',
                    cursor: canInteract ? 'pointer' : 'default',
                    color: star <= Math.round(currentScheduleData.difficulty) ? '#fbbf24' : '#64748b',
                    transition: 'all 0.2s ease'
                  }}
                  onClick={() => handleRatingClick(star)}
                >
                  {star <= Math.round(currentScheduleData.difficulty) ? '★' : '☆'}
                </span>
              ))}
              <span style={{ fontSize: '14px', color: '#94a3b8', marginLeft: '8px' }}>
                ({currentScheduleData.difficulty}/5.0 - {currentScheduleData.ratings || 0} valoraciones)
              </span>
            </div>
            {canInteract && newRating > 0 && (
              <div style={{ fontSize: '12px', color: '#06b6d4' }}>
                Tu calificación: {newRating}/5 ⭐
              </div>
            )}
          </div>
        )}
        
        {/* Foro de Comentarios */}
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
              💬 Foro de Estudiantes
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
          
          {/* Lista de comentarios */}
          <div style={{ 
            marginBottom: '16px', 
            maxHeight: '400px', 
            overflowY: 'auto',
            paddingRight: '4px'
          }}>
            {comments.length > 0 ? (
              comments.map(comment => renderComment(comment))
            ) : (
              <div style={{
                textAlign: 'center',
                padding: '32px',
                color: '#94a3b8'
              }}>
                <div style={{ fontSize: '32px', marginBottom: '8px' }}>💬</div>
                <p style={{ fontSize: '14px' }}>
                  No hay comentarios para este horario aún.
                  {canInteract && ' ¡Sé el primero en comentar!'}
                </p>
              </div>
            )}
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
              placeholder={canInteract 
                ? "Comparte tu experiencia o haz una pregunta..."
                : "Debes aprobar el curso para comentar..."
              }
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
                transition: 'all 0.2s ease',
                fontSize: '14px'
              }}
              disabled={!canInteract || !newComment.trim()}
            >
              {canInteract ? '📝 Publicar Comentario' : '🔒 Requiere Aprobación del Curso'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CourseDetailPanel;