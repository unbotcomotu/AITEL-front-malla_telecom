import { initialEdgesData, initialNodesData, PREREQUISITE_TYPES } from '../data/courseData.js';

export const checkPrerequisites = (courseId, courseGrades = {}) => {
  const prerequisites = initialEdgesData.filter(e => e.target === courseId);
  
  return prerequisites.map(prereq => {
    const sourceNode = initialNodesData.find(n => n.id === prereq.source);
    const grade = courseGrades[prereq.source] || 0;
    
    let isMet = false;
    let statusText = '';
    let statusColor = '#ef4444'; // rojo por defecto
    let recommendation = '';
    
    switch (prereq.type) {
      case PREREQUISITE_TYPES.APPROVED:
        isMet = grade >= 11;
        statusText = isMet ? '✓ Aprobado' : grade > 0 ? `✗ Nota: ${grade}/20 (requiere ≥11)` : '✗ No cursado';
        statusColor = isMet ? '#10b981' : '#ef4444';
        recommendation = isMet ? '' : grade > 0 ? 'Necesitas recuperar o volver a llevar este curso' : 'Debes cursar y aprobar este curso primero';
        break;
        
      case PREREQUISITE_TYPES.MIN_GRADE:
        isMet = grade >= prereq.minGrade;
        statusText = isMet ? `✓ Nota: ${grade}/20` : grade > 0 ? `✗ Nota: ${grade}/20 (requiere ≥${prereq.minGrade})` : `✗ No cursado (requiere ≥${prereq.minGrade})`;
        statusColor = isMet ? '#10b981' : '#ef4444';
        recommendation = isMet ? '' : grade > 0 ? `Necesitas al menos ${prereq.minGrade} para poder llevar este curso` : `Debes cursar este curso y obtener al menos ${prereq.minGrade}`;
        break;
        
      case PREREQUISITE_TYPES.COREQUISITE:
        isMet = true; // Los correquisitos se pueden llevar simultáneamente
        statusText = '○ Correquisito (se puede llevar junto)';
        statusColor = '#06b6d4';
        recommendation = 'Puedes llevarlo en el mismo ciclo que este curso';
        break;
        
      default:
        statusText = '? Tipo desconocido';
        recommendation = 'Consulta con coordinación académica';
    }
    
    return {
      id: prereq.source,
      name: sourceNode?.name || 'Curso desconocido',
      type: prereq.type,
      minGrade: prereq.minGrade,
      currentGrade: grade,
      isMet,
      statusText,
      statusColor,
      recommendation
    };
  });
};

export const getCourseStatus = (courseId, approvedCourses, courseGrades) => {
  const isApproved = approvedCourses.includes(courseId);
  const prerequisites = checkPrerequisites(courseId, courseGrades);
  const arePrerequisitesMet = prerequisites.every(p => p.isMet);
  
  if (isApproved) return 'approved';
  if (arePrerequisitesMet) return 'available';
  return 'locked';
};