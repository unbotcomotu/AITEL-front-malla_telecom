import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext'; // ← CAMBIO: importar useAuth desde AuthContext


// Importar componentes
import AuthView from './components/auth/AuthView';
import CurriculumView from './components/curriculum/CurriculumView';
import AdminDashboard from './components/admin/AdminDashboard';
import CourseManagement from './components/admin/CourseManagement';
import ProfessorManagement from './components/admin/ProfessorManagement';
import StudentOnboarding from './components/student/StudentOnboarding';
import ProtectedRoute from './components/auth/ProtectedRoute';
import Layout from './components/common/Layout';

// Componente principal
function App() {
  return (
    <AuthProvider>
      <Router>
        <div style={{ 
          fontFamily: 'system-ui, -apple-system, sans-serif',
          minHeight: '100vh'
        }}>
          <Routes>
            {/* Rutas públicas */}
            <Route path="/auth" element={<AuthView />} />
            
            {/* Rutas protegidas con Layout */}
            <Route path="/" element={
              <ProtectedRoute>
                <Layout />
              </ProtectedRoute>
            }>
              {/* Ruta por defecto - redirige según el tipo de usuario */}
              <Route index element={<DashboardRedirect />} />
              
              {/* Rutas de estudiante */}
              <Route path="curriculum" element={<CurriculumView />} />
              <Route path="onboarding" element={<StudentOnboarding />} />
              
              {/* Rutas de administrador */}
              <Route path="admin" element={<AdminDashboard />} />
              <Route path="admin/courses" element={<CourseManagement />} />
              <Route path="admin/professors" element={<ProfessorManagement />} />
            </Route>
            
            {/* Ruta catch-all */}
            <Route path="*" element={<Navigate to="/auth" />} />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

// Componente para redirigir según el tipo de usuario
function DashboardRedirect() {
  const { user, loading } = useAuth();
  
  console.log('🔍 DashboardRedirect - Estado actual:', { user, loading });
  
  // Mostrar loading mientras se carga
  if (loading) {
    console.log('⏳ Todavía cargando...');
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 25%, #334155 75%, #475569 100%)',
        color: 'white'
      }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{
            width: '40px',
            height: '40px',
            border: '4px solid transparent',
            borderTop: '4px solid #06b6d4',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite',
            margin: '0 auto 16px'
          }} />
          <p>Cargando usuario...</p>
        </div>
      </div>
    );
  }

  // Si no hay usuario, redirigir a auth
  if (!user) {
    console.log('❌ No hay usuario, redirigiendo a /auth');
    return <Navigate to="/auth" replace />;
  }

  // Decidir redirección según el usuario
  console.log('👤 Usuario encontrado:', user);
  console.log('🔀 Evaluando redirección...');
  
  if (user.role === 'admin') {
    console.log('🔀 Redirigiendo a /admin (usuario es admin)');
    return <Navigate to="/admin" replace />;
  } else if (user.isFirstLogin) {
    console.log('🔀 Redirigiendo a /onboarding (primer login)');
    return <Navigate to="/onboarding" replace />;
  } else {
    console.log('🔀 Redirigiendo a /curriculum (usuario regular)');
    return <Navigate to="/curriculum" replace />;
  }
}

export default App;