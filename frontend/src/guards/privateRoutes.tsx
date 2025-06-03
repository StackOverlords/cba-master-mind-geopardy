import { Navigate } from 'react-router';
import type { FC, ReactNode } from 'react';
import { useAuthStore } from '../stores/authStore';
import type { UserRole } from '../shared/auth.types';
import GradientBackground from '../components/ui/gradientBackground';

interface ProtectedRouteProps {
  children: ReactNode;
  roles?: UserRole[];
  skeleton?: ReactNode
}

const ProtectedRoute: FC<ProtectedRouteProps> = ({ children, roles, skeleton }) => {
  const { user, isLoading, hasRole } = useAuthStore();

  // Mostrar spinner mientras se carga
  if (isLoading) {
    return (
      <div className="w-full min-h-screen flex items-center justify-center relative">
        <GradientBackground />
        {skeleton || (
          <div className='flex gap-2 items-end text-xl font-bold font-PressStart2P'>
            <span>Loading</span>
            <span className="text-blue-700 animate-bounce">.</span>
            <span className="text-blue-700 animate-bounce [animation-delay:-.3s]">.</span>
            <span className="text-blue-700 animate-bounce [animation-delay:-.5s]">.</span>
          </div>
        )}
      </div>
    )
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