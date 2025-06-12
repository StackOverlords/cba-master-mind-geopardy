import { useEffect, useState, type FormEvent } from "react"
import PlusIcon from "../../ui/icons/plusIcon"
import SearchIcon from "../../ui/icons/searchIcon"
import EditIcon from "../../ui/icons/editIcon"
import TrashIcon from "../../ui/icons/trashIcon"
import EyeIcon from "../../ui/icons/eyeIcon"
import InputField from "../../ui/inputField"
import SelectOptions from "../../ui/selectOptions"
import { useAuthStore } from "../../../stores/authStore"
import { usePaginatedCategories } from "../../../hooks/queries/category/useGetAllCategories"
import SkeletonQuestionCard from "../question/skeletonQuestionCard"
import { usePaginatedQuestions } from "../../../hooks/queries/question/usePaginatedQuestion"
import ErrorLoadingData from "../../errorLoadingData"
import NotFoundData from "../../notFoundData"
import Pagination from "../../pagination"
import { useCreateQuestion, useDeleteQuestion, useUpdateQuestion } from "../../../hooks/mutations/questionMutations"
import type { DialogOptions } from "../../../shared/types"
import type { CreateQuestionDto } from "../../../shared/types/question.dto"
import toast from "react-hot-toast"
import ErrorToast from "../../toastAlerts/errorAlert"
import SuccessToast from "../../toastAlerts/successAlert"
import type { Question } from "../../../shared/types/question"
import QuestionModal from "../question/questionModal"
import UploadIcon from "../../ui/icons/uploadIcon"
import GlowButton from "../../ui/glowButton"
import UploadFilesModal from "../../uploadFilesModal"
import ConfirmationModal from "../../confirmationModal"
import { useSearchParams } from "react-router"
interface QuestionState extends CreateQuestionDto {
  _id?: string;
}

export function QuestionsSection() {
  const [dialogOptions, setDialogOptions] = useState<DialogOptions>({
    isOpenDialog: false,
    mode: null,
  })
  const [openUploadModal, setOpenUploadModal] = useState<boolean>(false)
  const [confirmingDeleteId, setConfirmingDeleteId] = useState<string | null>(null);

  const creatorId = useAuthStore((state) => state.user?._id)
  const [searchTerm, setSearchTerm] = useState("")
  const [searchParams] = useSearchParams();
  const categoryFromParams = searchParams.get("category") || "all";
  const [selectedCategory, setSelectedCategory] = useState("all");

  useEffect(() => {
    setSelectedCategory(categoryFromParams);
  }, [categoryFromParams]);

  const [currentPage, setCurrentPage] = useState<number>(1);
  const [rowsPerPage, setRowsPerPage] = useState<number>(10);
  const [sort, setSort] = useState<'asc' | 'desc'>('desc')
  const { data: questionsData, isLoading, isError, isFetching } = usePaginatedQuestions({
    page: currentPage,
    limit: rowsPerPage,
    sort: sort,
    categoryId: selectedCategory === "all" ? undefined : selectedCategory,
    question: searchTerm,
    // user: '',
  })
  const { data: categories } = usePaginatedCategories({
    limit: -1 // Fetch all categories
  })
  const [currentQuestion, setCurrentQuestion] = useState<QuestionState>({
    categoryId: "",
    question: "",
    answers: [
      { text: "", isCorrect: true },
      { text: "", isCorrect: false }
    ],
    user: "",
  })
  const { mutate: createQuestion } = useCreateQuestion()
  const { mutate: updateQuestion } = useUpdateQuestion()
  const { mutate: deleteQuestion } = useDeleteQuestion()

  const filteredQuestions = questionsData ? questionsData.data.filter((question) => {
    const matchesSearch = question.question.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = selectedCategory === "all" || question.categoryId === selectedCategory
    return matchesSearch && matchesCategory
  }) : []

  // useEffect(() => { console.log(userToken) }, [userToken])

  const handleCreateQuestion = (e: FormEvent) => {
    e.preventDefault()
    if (!currentQuestion.question || !currentQuestion.categoryId) {
      toast.custom((t) => (
        <ErrorToast
          t={t}
          title="Validation Error"
          description="Please fill in all fields"
        />
      ))
      return
    }
    createQuestion(
      currentQuestion,
      {
        onSuccess: () => {
          toast.custom((t) => (
            <SuccessToast
              t={t}
              title="Question Created"
              description="Question created successfully!"
            />
          ))
          handleCloseDialog()
        },
        onError: () => {
          toast.custom((t) => (
            <ErrorToast
              t={t}
              title="Error"
              description={'Failed to create question'}
            />
          ))
        }
      }
    )
  }
  const handleUpdateQuestion = (e: FormEvent) => {
    e.preventDefault()
    if (!currentQuestion.question || !currentQuestion.categoryId) {
      toast.custom((t) => (
        <ErrorToast
          t={t}
          title="Validation Error"
          description="Please fill in all fields"
        />
      ))
      return
    }

    updateQuestion(
      {
        id: currentQuestion._id || '',
        data: currentQuestion
      },
      {
        onSuccess: () => {
          toast.custom((t) => (
            <SuccessToast
              t={t}
              title="Question Updated"
              description="Question updated successfully!"
            />
          ))
          handleCloseDialog()
        },
        onError: () => {
          toast.custom((t) => (
            <ErrorToast
              t={t}
              title="Error"
              description={'Failed to update question'}
            />
          ))
        }
      }
    )
  }
  const handleDeleteQuestion = (questionId: string) => {
    deleteQuestion(
      questionId,
      {
        onSuccess: () => {
          toast.custom((t) => (
            <SuccessToast
              t={t}
              title="Question Deleted"
              description="Question deleted successfully!"
            />
          ))
        },
        onError: () => {
          toast.custom((t) => (
            <ErrorToast
              t={t}
              title="Error"
              description={'Failed to delete question'}
            />
          ))
        }
      }
    )
  }
  const handleOpenCreateDialog = () => {
    setDialogOptions({
      isOpenDialog: true,
      mode: 'create'
    })
    setCurrentQuestion({
      ...currentQuestion,
      user: creatorId || ''
    })
  }
  const handleOpenUpdateDialog = (question: Question) => {
    setDialogOptions({
      isOpenDialog: true,
      mode: 'update'
    })
    setCurrentQuestion({
      _id: question._id,
      categoryId: question.categoryId,
      question: question.question,
      answers: question.answers.map((answer) => ({
        text: answer.text,
        isCorrect: answer.isCorrect
      })),
      user: question.user
    })
  }
  const handleCloseDialog = () => {
    setDialogOptions({
      isOpenDialog: false,
      mode: null
    })
    setCurrentQuestion({
      categoryId: "",
      question: "",
      answers: [
        { text: "", isCorrect: true },
        { text: "", isCorrect: false }
      ],
      user: "",
    })
  }

  const handleAnswerTextChange = (index: number, text: string) => {
    const newAnswers = [...currentQuestion.answers]
    newAnswers[index].text = text
    setCurrentQuestion((prev) => ({ ...prev, answers: newAnswers }))
  }

  const handleCorrectAnswerChange = (index: number) => {
    const newAnswers = currentQuestion.answers.map((answer, i) => ({
      ...answer,
      isCorrect: i === index,
    }))
    setCurrentQuestion((prev) => ({ ...prev, answers: newAnswers }))
  }

  const handleAddAnswer = () => {
    if (currentQuestion.answers.length < 6) {
      setCurrentQuestion((prev) => ({
        ...prev,
        answers: [...prev.answers, { text: "", isCorrect: false }],
      }))
    }
  }
  const handleRemoveAnswer = (index: number) => {
    if (currentQuestion.answers.length > 2) {
      const newAnswers = currentQuestion.answers.filter((_, i) => i !== index)
      // If we removed the correct answer, make the first one correct
      if (currentQuestion.answers[index].isCorrect && newAnswers.length > 0) {
        newAnswers[0].isCorrect = true
      }
      setCurrentQuestion((prev) => ({ ...prev, answers: newAnswers }))
    }
  }
  const handleChangeQuestionData = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setCurrentQuestion({ ...currentQuestion, [e.target.name]: e.target.value });
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleRowsChange = (rows: number) => {
    setRowsPerPage(rows);
    setCurrentPage(1);
  };
  return (
    <section className="space-y-3">
      <header className="flex justify-between items-center flex-wrap gap-4">
        <div>
          <h1 className="text-xl sm:text-3xl font-bold text-white mb-2">Question Management</h1>
          <p className="text-xs sm:yext-base text-slate-400">Create, edit, and organize quiz questions</p>
        </div>
        <div className="flex items-center gap-2 flex-wrap text-xs sm:text-sm">
          <GlowButton
            onClick={handleOpenCreateDialog}
          >
            <PlusIcon className="w-4 h-4 mr-2" />
            Add Question
          </GlowButton>
          <button
            onClick={() => setOpenUploadModal(true)}
            className="px-4 py-2 bg-dashboard-border/50 hover:bg-dashboard-border/80 text-white rounded-md transition-colors flex items-center"
          >
            <UploadIcon className="w-4 h-4 mr-2" />
            Upload Questions
          </button>
        </div>
      </header>

      <div className="flex items-center flex-wrap gap-2 mb-4">
        <div className="relative sm:w-full sm:max-w-sm">
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none z-10">
            <SearchIcon className="size-4 text-slate-400" />
          </div>
          <InputField
            type="text"
            name="search"
            placeholder="Search questions..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <div className="relative w-max">
          <SelectOptions
            name="category"
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
          >
            <option className="bg-gray-800 text-gray-300" value="all">All Categories</option>
            {categories && categories.data.map((category) => (
              <option className="bg-gray-800 text-gray-300" key={category._id} value={category._id}>
                {category.name}
              </option>
            ))}
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

        <div className="relative w-max">
          <SelectOptions
            name="sort"
            value={sort}
            onChange={(e) => setSort(e.target.value as 'asc' | 'desc')}
          >
            <option className="bg-gray-800 text-gray-300" value="asc">Asc</option>
            <option className="bg-gray-800 text-gray-300" value="desc">Desc</option>
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
      <div className="overflow-y-auto flex flex-col gap-2 sm:gap-4">
        {
          isLoading || isFetching ? (
            [...Array(5)].map((_, index) => (
              <SkeletonQuestionCard key={index} />
            ))
          ) : isError ? (
            <ErrorLoadingData
              title="Error Loading Questions"
              description="There was an error loading the questions. Please try again later."
            />
          ) :
            filteredQuestions && filteredQuestions?.length > 0 ? filteredQuestions.map((question) => (
              <article key={question._id} className="bg-dashboard-bg/50 border border-dashboard-border/50 rounded-lg overflow-hidden hover:bg-dashboard-bg/70 transition-colors">
                <div className="flex items-start p-2 sm:p-4">
                  <div className="flex-1">
                    <header className="flex items-center justify-between gap-2 sm:gap-3 mb-1 sm:mb-2">
                      <span className="inline-block px-2 py-0.5 bg-purple-500/20 text-purple-300 rounded-full text-xs mt-1" >
                        {categories?.data.find((cat) => cat._id === question.categoryId)?.name || "Uncategorized"}
                      </span>
                      <div className="flex items-center gap-2">
                        <button
                          // onClick={() => handleOpenUpdateDialog(category)}
                          className="w-8 h-8 flex items-center justify-center text-slate-400 hover:text-white rounded-md hover:bg-dashboard-border/50 transition-colors">
                          <EyeIcon className="size-4" />
                        </button>
                        <button
                          onClick={() => handleOpenUpdateDialog(question)}
                          className="w-8 h-8 flex items-center justify-center text-slate-400 hover:text-white rounded-md hover:bg-dashboard-border/50 transition-colors">
                          <EditIcon className="size-4" />
                        </button>
                        <button
                          onClick={() => setConfirmingDeleteId(question._id)}
                          className="w-8 h-8 flex items-center justify-center text-red-400 hover:text-red-300 rounded-md hover:bg-red-900/20 transition-colors">
                          <TrashIcon className="size-4" />
                        </button>
                      </div>
                    </header>
                    <h3 className="font-medium text-xs sm:text-base mb-2">{question.question}</h3>
                    <footer className="text-xs sm:text-sm text-muted-foreground mb-2">
                      <strong className="text-emerald-300">Respuesta correcta: </strong>
                      {question.answers.find((answer) => answer.isCorrect)?.text || "N/A"}
                    </footer>
                  </div>
                </div>
              </article>
            )) :
              (
                <NotFoundData
                  title="No Questions Found"
                  description="There are currently no questions available. You can create a new question using the button above."
                />
              )
        }
        {
          questionsData && questionsData.totalPages > 1 && (
            <Pagination
              currentPage={currentPage}
              totalPages={questionsData?.totalPages || 1}
              onPageChange={handlePageChange}
              showRows={rowsPerPage}
              onShowRowsChange={handleRowsChange}
            />
          )
        }
      </div>


      {dialogOptions.isOpenDialog && dialogOptions.mode === 'create' && (
        <QuestionModal
          title="Create New Question"
          description="Add a new question to the quiz database"
          textButton="Create Question"
          question={currentQuestion}
          categories={categories ? categories.data : []}
          handleCloseModal={handleCloseDialog}
          handleChangeQuestionData={handleChangeQuestionData}
          handleSubmit={handleCreateQuestion}
          handleAnswerTextChange={handleAnswerTextChange}
          handleCorrectAnswerChange={handleCorrectAnswerChange}
          handleAddAnswer={handleAddAnswer}
          handleRemoveAnswer={handleRemoveAnswer}
        />
      )}
      {dialogOptions.isOpenDialog && dialogOptions.mode === 'update' && (
        <QuestionModal
          title="Update Question"
          description="Edit the details of the question"
          textButton="Update Question"
          question={currentQuestion}
          categories={categories ? categories.data : []}
          handleCloseModal={handleCloseDialog}
          handleChangeQuestionData={handleChangeQuestionData}
          handleSubmit={handleUpdateQuestion}
          handleAnswerTextChange={handleAnswerTextChange}
          handleCorrectAnswerChange={handleCorrectAnswerChange}
          handleAddAnswer={handleAddAnswer}
          handleRemoveAnswer={handleRemoveAnswer}
        />
      )}

      {
        openUploadModal && (
          <UploadFilesModal
            handleCloseModal={() => setOpenUploadModal(false)}
          />
        )
      }
      {
        confirmingDeleteId && (
          <ConfirmationModal
            confirmButtonText="Delete"
            onCancel={() => setConfirmingDeleteId(null)}
            onConfirm={() => {
              handleDeleteQuestion(confirmingDeleteId)
              setConfirmingDeleteId(null)
            }}
            title="Delete Question"
            message="Are you sure you want to delete this question?"
            type="danger"
          />
        )
      }
    </section>
  )
}
