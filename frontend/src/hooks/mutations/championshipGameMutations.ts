import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { CreateGameChampionShipDto } from "../../shared/types/game.dto";
import { masterMindApi } from "../../api/axios";
import { gameEndpoints } from "../../api/endpoints";
import type { ChampioShipGame, SubmitAnswerPayload } from "../../shared/types/ChampionShipGame";

interface UpdateGameInput {
    id: string;
    data: Partial<ChampioShipGame>;
}

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
            queryClient.invalidateQueries({ queryKey: ['ChampionShipGame'] });
        },
    });
};

export const useUpdateChampionShipGame = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({ id, data }: UpdateGameInput) => {
            const response = await masterMindApi.put(gameEndpoints.update(id), data);
            return response.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['ChampionShipGame'] });
        },
    });
};

export const useAnswerChampionshipGame = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (data: SubmitAnswerPayload) => {
            const response = await masterMindApi.post(gameEndpoints.answer, data)
            return response.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['ChampionShipGame'] });
        },
    });
};