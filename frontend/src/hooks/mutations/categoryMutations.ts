// hooks/useEditUser.ts
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { masterMindApi } from '../../api/axios';
import { categoryEndpoints } from '../../api/endpoints';
import type { CreateCategoryDto, UpdateCategoryDto } from '../../shared/types/category.dto';

interface UpdateCategoryInput {
    id: string;
    data: UpdateCategoryDto;
}
interface CreateCategoryInput {
    data: CreateCategoryDto
}
interface DeleteCategoryInput {
    categoryId: string;
}
export const useUpdateCategory = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({ id, data }: UpdateCategoryInput) => {
            const response = await masterMindApi.put(categoryEndpoints.update(id), data);
            return response.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['categories'] });
        },
    });
};

export const useCreateCategory = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async ({ data }: CreateCategoryInput) => {
            const response = await masterMindApi.post(categoryEndpoints.create, data)
            return response.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['categories'] });
        },
    });
};

export const useDeleteCategory = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ categoryId }: DeleteCategoryInput) => masterMindApi.delete(categoryEndpoints.delete(categoryId)),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['categories'] });
        },
    });
};