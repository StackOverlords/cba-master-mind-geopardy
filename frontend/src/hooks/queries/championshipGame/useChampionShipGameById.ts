import { useQuery, keepPreviousData } from '@tanstack/react-query';
import { masterMindApi } from '../../../api/axios';
import { useAuthStore } from '../../../stores/authStore';
import { gameEndpoints } from '../../../api/endpoints';
import type { ChampioShipGame } from '../../../shared/types/ChampionShipGame';

interface PaginatedOptions {
  id?: string;
  status?: string;
  name?: string;
  user?: string;
}
interface GameResponse {
  page: number;
  limit: number;
  sort: 'asc' | 'desc';
  totalPages: number;
  totalCount: number;
  data: ChampioShipGame[];
}

export const useChampionShipGameById = ({
  id,
  status,
  name,
  user,
}: PaginatedOptions) => {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  return useQuery<ChampioShipGame>({
    queryKey: ['games', id, status, name, user],
    queryFn: async () => {
      const response = await masterMindApi.get<GameResponse>(gameEndpoints.getAll, {
        params: {
          id,
          ...(status ? { status } : {}),
          ...(name ? { name } : {}),
          ...(user ? { user } : {}),
        },
      });
      if (!response.data.data.length) {
        throw new Error('No se encontró el juego');
      }

      return response.data.data[0];
    },
    enabled: isAuthenticated, // Only fetch if the user is authenticated
    placeholderData: keepPreviousData,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};
