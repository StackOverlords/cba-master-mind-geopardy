// hooks/useEditUser.ts
import { useMutation, useQueryClient } from '@tanstack/react-query';
import type { User } from '../../shared/types/user';
import { masterMindApi } from '../../api/axios';
import { userEndpoints } from '../../api/endpoints';

interface EditUserInput {
    id: string;
    data: Partial<User>;
}

export const useUpdateUser = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({ id, data }: EditUserInput) => {
            const response = await masterMindApi.put(userEndpoints.update(id), data);
            return response.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['users'] });
        },
    });
};
