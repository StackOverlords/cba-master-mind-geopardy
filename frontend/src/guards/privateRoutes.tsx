import { Navigate } from 'react-router';
import type { FC, ReactNode } from 'react';
import { useAuthStore } from '../stores/authStore';
import type { UserRole } from '../shared/auth.types';

interface ProtectedRouteProps {
  children: ReactNode;
  roles?: UserRole[];
}

const ProtectedRoute: FC<ProtectedRouteProps> = ({ children, roles }) => {
  const { user, isLoading, hasRole } = useAuthStore();
  
  // Mostrar spinner mientras se carga
  if (isLoading) {
    return <div className="loading">Cargando...</div>;
  }
  
  // Redirigir si no está autenticado
  if (!user) {
    return <Navigate to="/auth/sign-in" replace />;
  }
  
  // Verificar roles si se especifican
  if (roles && roles.length > 0) {
    const hasRequiredRole = roles.some(role => hasRole(role));
    if (!hasRequiredRole) {
      return <Navigate to="/unauthorized" replace />;
    }
  }
  
  // Todo en orden, renderizar el componente hijo
  return <>{children}</>;
};

export default ProtectedRoute;