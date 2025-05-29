import { useMutation, useQueryClient } from '@tanstack/react-query';
import type { User } from '../../shared/types/user';
import { masterMindApi } from '../../api/axios';
import { endpoints } from '../../api/endpoints';

export const useCreateUser = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (newUser: Omit<User, '_id'>) =>
            masterMindApi.post(`${endpoints.users}/create`, newUser),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['users'] });
        },
    });
};

export const useDeleteUser = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (userId: string) => masterMindApi.delete(`${endpoints.users}/${userId}/delete`),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['users'] });
        },
    });
};
