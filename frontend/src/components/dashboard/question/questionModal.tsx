import { motion } from "motion/react";
import type { Category } from "../../../shared/types/category";
import type { CreateQuestionDto } from "../../../shared/types/question.dto";
import PlusIcon from "../../ui/icons/plusIcon";
import ModalContainer from "../../ui/modalContainer";
import SelectOptions from "../../ui/selectOptions";
import TextArea from "../../ui/textarea";
import { useState, type FormEvent } from "react";
import InputField from "../../ui/inputField";
import Check2Icon from "../../ui/icons/check2Icon";
import TrashIcon from "../../ui/icons/trashIcon";
interface Props {
    title: string
    description?: string
    textButton?: string
    question: CreateQuestionDto
    categories: Category[]
    handleCloseModal: () => void
    handleChangeQuestionData: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => void
    handleSubmit: (e: FormEvent) => void
    handleAnswerTextChange: (index: number, text: string) => void
    handleCorrectAnswerChange: (index: number) => void
    handleAddAnswer: () => void
    handleRemoveAnswer: (index: number) => void
}
const QuestionModal: React.FC<Props> = ({
    title,
    description,
    textButton,
    question,
    categories,
    handleCloseModal,
    handleChangeQuestionData,
    handleSubmit,
    handleAnswerTextChange,
    handleCorrectAnswerChange,
    handleAddAnswer,
    handleRemoveAnswer
}) => {
    const [errors, setErrors] = useState<{
        question?: string
        answers?: string[]
        general?: string
    }>({})

    const validateForm = (): boolean => {
        const newErrors: typeof errors = {}

        if (!question.question.trim()) {
            newErrors.question = "Question text is required"
        }

        const answerErrors: string[] = []
        let hasCorrectAnswer = false
        let validAnswerCount = 0

        question.answers.forEach((answer, index) => {
            if (!answer.text.trim()) {
                answerErrors[index] = "Answer text is required"
            } else {
                validAnswerCount++
            }
            if (answer.isCorrect) {
                hasCorrectAnswer = true
            }
        })

        if (validAnswerCount < 2) {
            newErrors.general = "At least 2 answers are required"
        }

        if (!hasCorrectAnswer) {
            newErrors.general = "Please select a correct answer"
        }

        if (answerErrors.some((error) => error)) {
            newErrors.answers = answerErrors
        }

        setErrors(newErrors)
        return Object.keys(newErrors).length === 0
    }

    return (
        <ModalContainer
            handleCloseModal={() => handleCloseModal()}
        >
            <header className="mb-4">
                <h3 className="text-xl font-medium text-white">{title || 'Question'}</h3>
                <p className="text-sm text-slate-400">{description}</p>
            </header>

            <form onSubmit={(e) => {
                if (validateForm()) {
                    handleSubmit(e);
                }
            }}
                className="space-y-4">
                <div className="space-y-2">
                    <label htmlFor="question" className="block text-sm font-medium text-slate-300">
                        Question
                    </label>
                    <TextArea
                        id="question"
                        name="question"
                        onChange={handleChangeQuestionData}
                        placeholder="Enter your question here..."
                        rows={3}
                        value={question.question}
                        required
                    />
                </div>

                <div className="space-y-2">
                    <label htmlFor="category" className="block text-sm font-medium text-slate-300">
                        Category
                    </label>
                    <div className="relative">
                        <SelectOptions
                            id="categoryId"
                            name="categoryId"
                            onChange={handleChangeQuestionData}
                            value={question.categoryId}
                        >
                            {categories && categories.map((category) => (
                                <option key={category._id} value={category._id}>
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
                </div>

                {/* Answers Section */}
                <div className="mb-6 overflow-y-auto">
                    <div className="flex items-center justify-between mb-4">
                        <label className="block text-sm font-medium text-gray-300">Answer Options</label>
                        <button
                            type="button"
                            aria-label="Add answer"
                            onClick={handleAddAnswer}
                            disabled={question.answers.length >= 6}
                            className="px-4 py-2 bg-dashboard-border/50 hover:bg-dashboard-border/80 text-white rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-1 text-sm"
                        >
                            <PlusIcon className="size-4" />
                            Add Answer
                        </button>
                    </div>

                    <div className="space-y-3">
                        {question.answers.map((answer, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                className="flex items-center gap-3 rounded-lg"
                            >
                                {/* Radio Button */}
                                <span
                                    role="radio-button"
                                    onClick={() => handleCorrectAnswerChange(index)}
                                    className={`flex-shrink-0 size-5 rounded-full border-2 flex items-center justify-center transition-colors ${answer.isCorrect ? "border-green-500 bg-green-500" : "border-gray-500 hover:border-green-400"
                                        }`}
                                >
                                    {answer.isCorrect && <Check2Icon className="text-white size-4" />}
                                </span>

                                {/* Answer Input */}
                                <InputField
                                    name={`answer-${index}`}
                                    id={`answer-${index}`}
                                    type="text"
                                    value={answer.text}
                                    onChange={(e) => {
                                        handleAnswerTextChange(index, e.target.value);
                                        if (errors.answers?.[index]) {
                                            const newErrors = [...(errors.answers || [])];
                                            newErrors[index] = "";
                                            setErrors((prev) => ({ ...prev, answers: newErrors }));
                                        }
                                    }}
                                    placeholder={`Answer ${index + 1}`}
                                />

                                {/* Remove Button */}
                                <button
                                    type="button"
                                    aria-label={`Remove answer ${index + 1}`}
                                    onClick={() => handleRemoveAnswer(index)}
                                    disabled={question.answers.length <= 2}
                                    className="p-2 bg-dashboard-border/50 rounded-lg hover:bg-red-900/20 hover:text-red-300 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                >
                                    <TrashIcon className="size-4" />
                                </button>
                            </motion.div>
                        ))}
                    </div>

                    {errors.general && <p className="mt-2 text-sm text-red-400">{errors.general}</p>}
                </div>

                {/* Info Text */}
                <div className="text-sm text-gray-400 bg-gray-800 p-3 rounded-lg">
                    <p>• Click the circle next to an answer to mark it as correct</p>
                    <p>• You can add up to 6 answer options</p>
                    <p>• At least 2 answers are required</p>
                </div>
                <footer className="flex justify-end space-x-3 mt-6">
                    <button
                        type="button"
                        aria-label="Cancel"
                        onClick={() => handleCloseModal()}
                        className="px-4 py-2 border border-transparent text-slate-300 rounded-md hover:bg-dashboard-border/80 transition-colors"
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        aria-label="Submit"
                        // onClick={() => {
                        //     if (validateForm()) {
                        //         handleSubmit();
                        //     }
                        // }}
                        className="px-4 py-2 bg-dashboard-border/50 hover:bg-dashboard-border/80 text-white rounded-md transition-colors">
                        {textButton || "Send"}
                    </button>
                </footer>
            </form>
        </ModalContainer>
    );
}

export default QuestionModal;