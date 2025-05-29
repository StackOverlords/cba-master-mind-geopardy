import { keepPreviousData, useQuery } from '@tanstack/react-query';
import type { User } from '../../../shared/types/user';
import type { UserRole } from '../../../shared/auth.types';
import { masterMindApi } from '../../../api/axios';
import { endpoints } from '../../../api/endpoints';
import { useAuthStore } from '../../../stores/authStore';

interface UsersResponse {
    data: User[];
    totalCount: number;
    page: number;
    limit: number;
    totalPages: number;
}

interface UsePaginatedUsersOptions {
    page?: number;
    limit?: number;
    role?: UserRole;
    sort?: 'asc' | 'desc';
    firebaseUid?: string | null;
}

export const usePaginatedUsers = ({
    page,
    limit,
    role,
    sort,
    firebaseUid,
}: UsePaginatedUsersOptions) => {
        const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
    return useQuery<UsersResponse>({
        queryKey: ['users', page, limit, role, sort, firebaseUid],
        queryFn: async () => {
            const response = await masterMindApi.get(endpoints.users, {
                params: {
                    page,
                    limit,
                    role,
                    sort,
                    ...(firebaseUid ? { firebaseUid } : {}),
                },
            });
            return response.data;
        },
        enabled: isAuthenticated, // Only fetch if the user is authenticated
        placeholderData: keepPreviousData,
        staleTime: 1000 * 60 * 5, // 5 minutes
    });
};
