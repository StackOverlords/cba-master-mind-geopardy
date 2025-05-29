import { useQuery } from '@tanstack/react-query';
import type { User } from '../../../shared/types/user';
import { masterMindApi } from '../../../api/axios';
import { userEndpoints } from '../../../api/endpoints';

interface UseUserByIdOptions {
    id: string;
}

export const useUserByFirebaseId = ({ id }: UseUserByIdOptions) => {
    return useQuery<User>({
        queryKey: ['user', id],
        queryFn: async () => {
            const response = await masterMindApi.get(userEndpoints.userByFirebaseId(id));
            return response.data;
        },
        enabled: !!id
    });
};
