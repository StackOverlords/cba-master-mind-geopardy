import { useState } from "react"
import PlusIcon from "../../ui/icons/plusIcon"
import EditIcon from "../../ui/icons/editIcon"
import TrashIcon from "../../ui/icons/trashIcon"
import { usePaginatedCategories } from "../../../hooks/queries/category/useGetAllCategories"
import { useAuthStore } from "../../../stores/authStore"
import SearchIcon from "../../ui/icons/searchIcon"
import InputField from "../../ui/inputField"
import CategoryCardSkeleton from "../category/CategoryCardSkeleton"
import FileTextIcon from "../../ui/icons/fileTextIcon"
import type { CreateCategoryDto } from "../../../shared/types/category.dto"
import CategoryModal from "../category/categoryModal"
import { useCreateCategory, useDeleteCategory, useUpdateCategory } from "../../../hooks/mutations/categoryMutations"
import toast from "react-hot-toast"
import SuccessToast from "../../toastAlerts/successAlert"
import ErrorToast from "../../toastAlerts/errorAlert"
import type { Category } from "../../../shared/types/category"
import NotFoundData from "../../notFoundData"
import ErrorLoadingData from "../../errorLoadingData"
import type { DialogOptions } from "../../../shared/types"
import GlowButton from "../../ui/glowButton"
import Pagination from "../../pagination"
import SelectOptions from "../../ui/selectOptions"
import ConfirmationModal from "../../confirmationModal"

interface CategoryState extends CreateCategoryDto {
  _id?: string;
}
export function CategoriesSection() {
  const [dialogOptions, setDialogOptions] = useState<DialogOptions>({
    isOpenDialog: false,
    mode: null,
  })
  const [confirmingDeleteId, setConfirmingDeleteId] = useState<string | null>(null);

  const creatorId = useAuthStore((state) => state.user?._id)
  const [searchTerm, setSearchTerm] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [rowsPerPage, setRowsPerPage] = useState(10)
  const [sort, setSort] = useState<'asc' | 'desc'>('desc')
  const { data: categoriesData, isLoading, isError, isFetching } = usePaginatedCategories({
    page: currentPage,
    limit: rowsPerPage,
    sort: sort,
    name: searchTerm,
    // user: '',
  })

  const [category, setCategory] = useState<CategoryState>({
    name: '',
    description: '',
    user: ''
  })
  const { mutate: createCategory } = useCreateCategory()
  const { mutate: updateCategory } = useUpdateCategory()
  const { mutate: deleteCategory } = useDeleteCategory()

  const handleCreateCategory = () => {
    if (!category.name || !category.description) {
      toast.custom((t) => (
        <ErrorToast
          t={t}
          title="Validation Error"
          description="Please fill in all fields"
        />
      ))
      return
    }
    createCategory(
      {
        data: category,
      },
      {
        onSuccess: () => {
          toast.custom((t) => (
            <SuccessToast
              t={t}
              title="Category Created"
              description="Category created successfully!"
            />
          ))
          handleCloseDialog()
        },
        onError: () => {
          toast.custom((t) => (
            <ErrorToast
              t={t}
              title="Error"
              description={'Failed to create category'}
            />
          ))
        }
      }
    )
  }
  const handleUpdateCategory = () => {
    if (!category.name || !category.description) {
      toast.custom((t) => (
        <ErrorToast
          t={t}
          title="Validation Error"
          description="Please fill in all fields"
        />
      ))
      return
    }
    updateCategory(
      {
        id: category._id || '',
        data: category,
      },
      {
        onSuccess: () => {
          toast.custom((t) => (
            <SuccessToast
              t={t}
              title="Category Updated"
              description="Category updated successfully!"
            />
          ))
          handleCloseDialog()
        },
        onError: () => {
          toast.custom((t) => (
            <ErrorToast
              t={t}
              title="Error"
              description={'Failed to update category'}
            />
          ))
        }
      }
    )
  }
  const handleDeleteCategory = (categoryId: string) => {
    deleteCategory(
      {
        categoryId: categoryId,
      },
      {
        onSuccess: () => {
          toast.custom((t) => (
            <SuccessToast
              t={t}
              title="Category Deleted"
              description="Category deleted successfully!"
            />
          ))
        },
        onError: () => {
          toast.custom((t) => (
            <ErrorToast
              t={t}
              title="Error"
              description={'Failed to delete category'}
            />
          ))
        }
      }
    )
  }
  const filteredCategories = categoriesData?.data.filter(
    (category) =>
      category.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      category.description.toLowerCase().includes(searchTerm.toLowerCase()),
  ) || [];

  const handleOpenCreateDialog = () => {
    setDialogOptions({
      isOpenDialog: true,
      mode: 'create'
    })
    setCategory({
      ...category,
      user: creatorId || ''
    })
  }
  const handleOpenUpdateDialog = (category: Category) => {
    setDialogOptions({
      isOpenDialog: true,
      mode: 'update'
    })
    setCategory({
      _id: category._id,
      name: category.name,
      description: category.description,
      user: category.user
    })
  }
  const handleCloseDialog = () => {
    setDialogOptions({
      isOpenDialog: false,
      mode: null
    })
    setCategory({
      name: '',
      description: '',
      user: ''
    })
  }
  const handleChangeCategoryData = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setCategory({ ...category, [e.target.name]: e.target.value });
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleRowsChange = (rows: number) => {
    setRowsPerPage(rows);
    setCurrentPage(1);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center flex-wrap gap-4">
        <div className="grow">
          <h1 className="text-3xl font-bold text-white mb-2">Category Management</h1>
          <p className="text-slate-400">Organize and manage quiz question categories</p>
          <div className="flex items-center space-x-2 mt-4">
            <div className="relative w-max">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none z-10">
                <SearchIcon className="size-4 text-slate-400" />
              </div>
              <InputField
                type="text"
                name="search"
                placeholder="Search categories..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>

            <div className="relative w-max">
              <SelectOptions
                name="sort"
                value={sort}
                onChange={(e) => setSort(e.target.value as 'asc' | 'desc')}
              >
                <option value="asc">Asc</option>
                <option value="desc">Desc</option>
              </SelectOptions>
              <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                <svg
                  className="w-4 h-4 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>

          </div>
        </div>
        <GlowButton
          onClick={handleOpenCreateDialog}
        >
          <PlusIcon className="size-4 mr-2" />
          Add Category
        </GlowButton>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {
          isLoading || isFetching ? (
            Array.from({ length: 6 }).map((_, i) => (
              <CategoryCardSkeleton key={i} />
            ))
          ) : isError ? (
            <ErrorLoadingData
              title="Error Loading Categories"
              description="There was an error loading the categories. Please try again later."
              className="col-span-full"
            />
          ) :
            filteredCategories && filteredCategories?.length > 0 ? filteredCategories.map((category) => (
              !category.isDeleted && (
                <article
                  key={category._id}
                  className="bg-dashboard-bg/50 border border-dashboard-border/50 rounded-lg overflow-hidden hover:bg-dashboard-bg/70 transition-colors flex flex-col justify-between"
                >
                  <div className="p-4 border-b border-dashboard-border/50">
                    <header className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <div>
                          <h3 className="text-white font-medium">{category.name}</h3>
                          <span className="inline-block px-2 py-0.5 bg-purple-500/20 text-purple-300 rounded-full text-xs mt-1">
                            {category.questionCount} questions
                          </span>
                        </div>
                      </div>
                      <div className="flex space-x-1">
                        <button
                          onClick={() => handleOpenUpdateDialog(category)}
                          className="w-8 h-8 flex items-center justify-center text-slate-400 hover:text-white rounded-md hover:bg-dashboard-border/50 transition-colors">
                          <EditIcon className="size-4" />
                        </button>
                        <button
                          onClick={() => setConfirmingDeleteId(category._id)}
                          className="w-8 h-8 flex items-center justify-center text-red-400 hover:text-red-300 rounded-md hover:bg-red-900/20 transition-colors">
                          <TrashIcon className="size-4" />
                        </button>
                      </div>
                    </header>
                  </div>
                  <section className="px-4 py-2 flex-1">
                    <p className="text-slate-400 text-sm">{category.description}</p>
                  </section>
                  <footer className="px-4 pb-4">
                    <button className="px-3 py-1.5 border border-dashboard-border text-slate-400 hover:bg-dashboard-border/50 hover:text-white rounded-md text-sm flex items-center transition-colors w-max">
                      <FileTextIcon className="size-4 mr-2" />
                      View Questions
                    </button>
                  </footer>
                </article>
              )
            )) : (
              <NotFoundData
                title="No Categories Found"
                description="Create a new category to get started."
                className="col-span-full"
              />
            )
        }
      </div>
      {
        categoriesData && categoriesData.totalPages > 1 && (
          <Pagination
            currentPage={currentPage}
            totalPages={categoriesData?.totalPages || 1}
            onPageChange={handlePageChange}
            showRows={rowsPerPage}
            onShowRowsChange={handleRowsChange}
          />
        )
      }

      {dialogOptions.isOpenDialog && dialogOptions.mode === 'create' && (
        <CategoryModal
          title="Create New Category"
          description="Add a new category for organizing quiz questions"
          textButton="Create Category"
          category={category}
          handleCloseModal={handleCloseDialog}
          handleChangeCategoryData={handleChangeCategoryData}
          handleSubmit={handleCreateCategory}
        />
      )}
      {dialogOptions.isOpenDialog && dialogOptions.mode === 'update' && (
        <CategoryModal
          title="Update Category"
          description="Modify the selected category details"
          textButton="Update Category"
          category={category}
          handleCloseModal={handleCloseDialog}
          handleChangeCategoryData={handleChangeCategoryData}
          handleSubmit={handleUpdateCategory}
        />
      )}
      {confirmingDeleteId && (
        <ConfirmationModal
          confirmButtonText="Delete"
          onCancel={() => setConfirmingDeleteId(null)}
          onConfirm={() => {
            handleDeleteCategory(confirmingDeleteId);
            setConfirmingDeleteId(null);
          }}
          title="Delete Category"
          message="Are you sure you want to delete this category?"
          type="danger"
        />
      )}
    </div>
  )
}
