import { useMutation, useQueryClient } from '@tanstack/react-query';
import { masterMindApi } from '../../api/axios';
import { questionEndpoints } from '../../api/endpoints';
import type { CreateQuestionDto, UpdateQuestionDto } from '../../shared/types/question.dto';

interface UpdateQuestionInput {
    id: string;
    data: Partial<UpdateQuestionDto>;
}

export const useUpdateQuestion = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({ id, data }: UpdateQuestionInput) => {
            const response = await masterMindApi.put(questionEndpoints.update(id), data);
            return response.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['questions'] });
        },
    });
};

export const useCreateQuestion = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (data: CreateQuestionDto) => {
            const response = await masterMindApi.post(questionEndpoints.create, data)
            return response.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['questions'] });
        },
    });
};

export const useDeleteQuestion = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (id: string) => masterMindApi.delete(questionEndpoints.delete(id)),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['questions'] });
        },
    });
};

export const useUploadQuestions = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (data: FormData) => {
            const response = await masterMindApi.post(questionEndpoints.import_excel, data, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            })
            return response.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['questions'] });
        },
    });
};