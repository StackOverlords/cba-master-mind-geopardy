import { useQuery, keepPreviousData } from '@tanstack/react-query';
import type { Category } from '../../../shared/types/category';
import { masterMindApi } from '../../../api/axios';
import { categoryEndpoints } from '../../../api/endpoints';
import { useAuthStore } from '../../../stores/authStore';

interface PaginatedCategoriesResponse {
  data: Category[];
  totalCount: number;
  page: number;
  limit: number;
  totalPages: number;
}

interface UsePaginatedCategoriesOptions {
  page?: number;
  limit?: number;
  sort?: 'asc' | 'desc';
  name?: string;
  description?: string;
  user?: string;
}

export const usePaginatedCategories = ({
  page,
  limit,
  sort,
  name,
  description,
  user,
}: UsePaginatedCategoriesOptions) => {
      const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  return useQuery<PaginatedCategoriesResponse>({
    queryKey: ['categories', page, limit, sort, name, description, user],
    queryFn: async () => {
      const response = await masterMindApi.get(categoryEndpoints.getAll, {
        params: {
          page,
          limit,
          sort,
          ...(name ? { name } : {}),
          ...(description ? { description } : {}),
          ...(user ? { user } : {}),
        },
      });
      return response.data;
    },
    enabled: isAuthenticated, // Only fetch if the user is authenticated
    placeholderData: keepPreviousData,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};
