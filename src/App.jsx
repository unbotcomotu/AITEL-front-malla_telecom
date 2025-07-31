import React, { useState, useCallback, useMemo } from 'react';
import ReactFlow, {
  ReactFlowProvider,
  useNodesState,
  useEdgesState,
  addEdge,
  Controls,
  Background,
  MiniMap,
} from 'reactflow';
import 'reactflow/dist/style.css';

// Simulando imports de los módulos (en tu proyecto real serían imports reales)
import { initialNodesData, initialEdgesData, PREREQUISITE_TYPES } from './data/courseData.js';
import { checkPrerequisites, getCourseStatus } from './utils/prerequisiteUtils.js';
import CourseNode from './components/CourseNode.jsx';
import CourseDetailPanel from './components/CourseDetailPanel.jsx';
import PrerequisitesPanel from './components/PrerequisitesPanel.jsx';
import { useStudentGrades } from './hooks/useApi.js';


const nodeTypes = { 
  courseNode: CourseNode 
};

// Componente Principal de la Aplicación
function App() {
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [isPanelOpen, setIsPanelOpen] = useState(false);
  
  // Simulamos notas del estudiante (esto vendría del backend via useStudentGrades hook)
  const courseGrades = {
    'c1': 15, // Aprobado con buena nota
    'm1': 12, // Aprobado
    'i1': 9,  // Aprobado pero con nota baja
    'f1': 7   // Desaprobado
  };
  
  const approvedCourses = Object.keys(courseGrades).filter(courseId => courseGrades[courseId] >= 11);
  
  const { nodes: layoutedNodes, edges: layoutedEdges } = useMemo(() => {
    const nodes = initialNodesData.map((node) => {
      const isApproved = approvedCourses.includes(node.id);
      const prerequisites = checkPrerequisites(node.id, courseGrades);
      const arePrerequisitesMet = prerequisites.every(p => p.isMet);
      
      let status = 'locked';
      if (isApproved) {
        status = 'approved';
      } else if (arePrerequisitesMet || prerequisites.length === 0) {
        status = 'available';
      }

      const nodesInCycle = initialNodesData.filter(n => n.cycle === node.cycle);
      const nodeIndexInCycle = nodesInCycle.indexOf(node);

      return {
        id: node.id,
        type: 'courseNode',
        position: { 
          x: node.cycle * 300, 
          y: nodeIndexInCycle * 180 + 50
        },
        data: { 
          label: node.name, 
          credits: node.credits,
          cycle: node.cycle,
          status: status,
          id: node.id,
          onClick: (data) => {
            setSelectedCourse(data);
            setIsPanelOpen(true);
          }
        },
      };
    });

    const edges = initialEdgesData.map(edge => {
      let strokeColor = '#06b6d4';
      let strokeDasharray = 'none';
      
      switch (edge.type) {
        case PREREQUISITE_TYPES.APPROVED:
          strokeColor = '#10b981';
          break;
        case PREREQUISITE_TYPES.MIN_GRADE:
          strokeColor = '#f59e0b';
          break;
        case PREREQUISITE_TYPES.COREQUISITE:
          strokeColor = '#06b6d4';
          strokeDasharray = '8,4';
          break;
        default:
          strokeColor = '#64748b';
      }
      
      return {
        ...edge,
        type: 'smoothstep',
        markerEnd: { type: 'arrowclosed' },
        style: { 
          stroke: strokeColor, 
          strokeWidth: 2, 
          strokeDasharray: strokeDasharray,
          filter: `drop-shadow(0 0 5px ${strokeColor}80)`
        },
        animated: edge.type === PREREQUISITE_TYPES.COREQUISITE
      };
    });

    return { nodes, edges };
  }, [approvedCourses, courseGrades]);

  const [nodes, setNodes, onNodesChange] = useNodesState(layoutedNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(layoutedEdges);

  const onConnect = useCallback((params) => setEdges((eds) => addEdge(params, eds)), [setEdges]);

  const handleClosePanel = () => {
    setIsPanelOpen(false);
    setSelectedCourse(null);
  };

  return (
    <div style={{
      width: '100vw',
      height: '100vh',
      color: 'white',
      fontFamily: 'system-ui, -apple-system, sans-serif',
      background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 25%, #334155 75%, #475569 100%)',
      position: 'relative'
    }}>
      {/* Header mejorado */}
      <header style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 10,
        padding: '24px',
        background: 'linear-gradient(135deg, rgba(15, 23, 42, 0.9) 0%, rgba(30, 41, 59, 0.8) 100%)',
        backdropFilter: 'blur(20px)',
        borderBottom: '1px solid rgba(148, 163, 184, 0.2)'
      }}>
        <h1 style={{
          fontSize: '32px',
          fontWeight: 'bold',
          background: 'linear-gradient(to right, #06b6d4, #3b82f6, #8b5cf6)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text',
          margin: 0
        }}>
          🎓 Malla Curricular
        </h1>
        <p style={{ fontSize: '14px', color: '#cbd5e1', marginTop: '4px', margin: '4px 0 16px 0' }}>
          Ingeniería de Telecomunicaciones - PUCP
        </p>
        
        {/* Leyenda mejorada */}
        <div style={{ 
          display: 'flex', 
          flexWrap: 'wrap', 
          gap: '24px', 
          fontSize: '12px' 
        }}>
          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: '8px', 
            padding: '6px 12px', 
            borderRadius: '20px', 
            background: 'rgba(16, 185, 129, 0.2)' 
          }}>
            <div style={{ 
              width: '12px', 
              height: '12px', 
              borderRadius: '50%', 
              background: 'linear-gradient(135deg, #10b981, #059669)' 
            }}></div>
            <span style={{ color: '#34d399', fontWeight: '500' }}>Aprobado</span>
          </div>
          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: '8px', 
            padding: '6px 12px', 
            borderRadius: '20px', 
            background: 'rgba(6, 182, 212, 0.2)' 
          }}>
            <div style={{ 
              width: '12px', 
              height: '12px', 
              borderRadius: '50%', 
              background: 'linear-gradient(135deg, #06b6d4, #0891b2)' 
            }}></div>
            <span style={{ color: '#22d3ee', fontWeight: '500' }}>Disponible</span>
          </div>
          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: '8px', 
            padding: '6px 12px', 
            borderRadius: '20px', 
            background: 'rgba(71, 85, 105, 0.2)' 
          }}>
            <div style={{ 
              width: '12px', 
              height: '12px', 
              borderRadius: '50%', 
              background: 'linear-gradient(135deg, #475569, #334155)' 
            }}></div>
            <span style={{ color: '#cbd5e1', fontWeight: '500' }}>Bloqueado</span>
          </div>
          
          {/* Separador */}
          <div style={{ width: '1px', height: '20px', background: '#64748b', margin: '0 8px' }}></div>
          
          {/* Leyenda de prerrequisitos */}
          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: '6px', 
            padding: '6px 12px', 
            borderRadius: '20px', 
            background: 'rgba(16, 185, 129, 0.15)' 
          }}>
            <div style={{ 
              width: '16px', 
              height: '2px', 
              background: '#10b981' 
            }}></div>
            <span style={{ color: '#34d399', fontWeight: '500', fontSize: '11px' }}>Aprobado (≥11)</span>
          </div>
          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: '6px', 
            padding: '6px 12px', 
            borderRadius: '20px', 
            background: 'rgba(245, 158, 11, 0.15)' 
          }}>
            <div style={{ 
              width: '16px', 
              height: '2px', 
              background: '#f59e0b' 
            }}></div>
            <span style={{ color: '#fbbf24', fontWeight: '500', fontSize: '11px' }}>Nota mínima</span>
          </div>
          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: '6px', 
            padding: '6px 12px', 
            borderRadius: '20px', 
            background: 'rgba(6, 182, 212, 0.15)' 
          }}>
            <div style={{ 
              width: '16px', 
              height: '2px', 
              background: '#06b6d4',
              backgroundImage: 'repeating-linear-gradient(90deg, #06b6d4 0, #06b6d4 4px, transparent 4px, transparent 8px)'
            }}></div>
            <span style={{ color: '#22d3ee', fontWeight: '500', fontSize: '11px' }}>Correquisito</span>
          </div>
        </div>
      </header>
      
      {/* ReactFlow Container */}
      <div style={{ width: '100%', height: '100%', paddingTop: '128px' }}>
        <ReactFlowProvider>
          <ReactFlow
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onConnect={onConnect}
            nodeTypes={nodeTypes}
            fitView
            minZoom={0.3}
            maxZoom={1.5}
            defaultViewport={{ x: 0, y: 0, zoom: 0.7 }}
            style={{
              background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 25%, #334155 75%, #475569 100%)'
            }}
          >
            <Background 
              color="rgba(148, 163, 184, 0.3)" 
              gap={32} 
              size={1}
              variant="dots"
              style={{
                opacity: 0.4
              }}
            />
            <Controls 
              style={{
                background: 'linear-gradient(135deg, rgba(15, 23, 42, 0.9) 0%, rgba(30, 41, 59, 0.8) 100%)',
                border: '1px solid rgba(148, 163, 184, 0.3)',
                borderRadius: '12px',
                backdropFilter: 'blur(10px)',
                boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)'
              }}
              showInteractive={false}
            />
            <MiniMap 
              nodeColor={(node) => {
                if (node.data.status === 'approved') return '#10b981';
                if (node.data.status === 'available') return '#06b6d4';
                if (node.data.status === 'in_progress') return '#f59e0b';
                return '#475569';
              }}
              style={{
                background: 'linear-gradient(135deg, rgba(15, 23, 42, 0.9) 0%, rgba(30, 41, 59, 0.8) 100%)',
                border: '1px solid rgba(148, 163, 184, 0.3)',
                borderRadius: '12px',
                backdropFilter: 'blur(10px)',
                boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)'
              }}
              pannable
              zoomable
            />
          </ReactFlow>
        </ReactFlowProvider>
      </div>

      {/* Panel de Detalles */}
      <CourseDetailPanel 
        course={selectedCourse} 
        onClose={handleClosePanel}
        isOpen={isPanelOpen}
        courseGrades={courseGrades}
      />
    </div>
  );
}

export default App;