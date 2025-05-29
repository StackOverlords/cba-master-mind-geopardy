export interface CreateCategoryDto {
    name: string;
    description: string;
    user: string;
}
export interface UpdateCategoryDto extends Partial<CreateCategoryDto> { }