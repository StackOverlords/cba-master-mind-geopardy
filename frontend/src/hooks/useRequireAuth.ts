import { useEffect } from 'react';
import { useNavigate } from 'react-router';
import type { UserRole } from '../shared/auth.types';
import { useAuthStore } from '../stores/authStore';

interface UseRequireAuthOptions {
    redirectTo?: string;
    requiredRoles?: UserRole[];
}

export const useRequireAuth = (options: UseRequireAuthOptions = {}) => {
    const { redirectTo = '/auth/sign-in', requiredRoles } = options;
    const { user, isLoading, hasRole } = useAuthStore();
    const navigate = useNavigate();

    useEffect(() => {
        if (isLoading) return;

        // Si no hay usuario autenticado
        if (!user) {
            navigate(redirectTo, { replace: true });
            return;
        }

        // Si se requieren roles específicos
        if (requiredRoles && requiredRoles.length > 0) {
            const hasRequiredRole = requiredRoles.some(role => hasRole(role));
            if (!hasRequiredRole) {
                navigate('/unauthorized', { replace: true });
            }
        }
    }, [user, isLoading, navigate, redirectTo, requiredRoles, hasRole]);

    return { user, isLoading };
};