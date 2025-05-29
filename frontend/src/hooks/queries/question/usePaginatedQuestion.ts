import { useQuery, keepPreviousData } from '@tanstack/react-query';
import { masterMindApi } from '../../../api/axios';
import { questionEndpoints } from '../../../api/endpoints';
import type { Question } from '../../../shared/types/question';
import { useAuthStore } from '../../../stores/authStore';

interface PaginatedQuestionsResponse {
    data: Question[];
    totalCount: number;
    page: number;
    limit: number;
    totalPages: number;
}

interface UsePaginatedQuestionsOptions {
    page?: number;
    limit?: number;
    sort?: 'asc' | 'desc';
    categoryId?: string;
    user?: string;
    question?: string;
}


export const usePaginatedQuestions = ({
    page,
    limit,
    sort,
    categoryId,
    user,
    question,
}: UsePaginatedQuestionsOptions) => {
    const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
    return useQuery<PaginatedQuestionsResponse>({
        queryKey: ['questions', page, limit, sort, categoryId, user, question],
        queryFn: async () => {
            const response = await masterMindApi.get(questionEndpoints.getAll, {
                params: {
                    page,
                    limit,
                    sort,
                    ...(categoryId ? { categoryId } : {}),
                    ...(user ? { user } : {}),
                    ...(question ? { question } : {}),
                },
            });
            return response.data;
        },
        enabled: isAuthenticated, 
        placeholderData: keepPreviousData,
        staleTime: 1000 * 60 * 5, // 5 minutes
    });
};
