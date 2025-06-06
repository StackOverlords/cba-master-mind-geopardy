import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { CreateGameChampionShipDto } from "../../shared/types/game.dto";
import { masterMindApi } from "../../api/axios";
import { gameEndpoints } from "../../api/endpoints";

export const useCreateChampionshipGame = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (data: CreateGameChampionShipDto) => {
            const cleanedPlayers = data.playersLocal.map(({ username, score }) => ({
                username,
                score,
            }));

            const cleanedData = {
                ...data,
                playersLocal: cleanedPlayers,
            };
            const response = await masterMindApi.post(gameEndpoints.create, cleanedData)
            return response.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['games'] });
        },
    });
};