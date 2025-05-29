import type { CreateCategoryDto } from "../../../shared/types/category.dto";
import InputField from "../../ui/inputField";
import ModalContainer from "../../ui/modalContainer";
import TextArea from "../../ui/textarea";
type Props = {
    title: string
    description?: string
    textButton?: string
    category: CreateCategoryDto
    handleCloseModal: () => void
    handleChangeCategoryData?: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void
    handleSubmit: () => void
}
const CategoryModal: React.FC<Props> = ({
    title,
    description,
    textButton,
    category,
    handleCloseModal,
    handleChangeCategoryData,
    handleSubmit
}) => {
    return (
        <ModalContainer
            handleCloseModal={handleCloseModal}
        >
            <header className="mb-4">
                <h3 className="text-xl font-medium text-white">{title || "Category"}</h3>
                <p className="text-sm text-slate-400">{description}</p>
            </header>

            <form className="space-y-4">
                <div className="space-y-2">
                    <label htmlFor="name" className="block text-sm font-medium text-slate-300">
                        Category Name
                    </label>
                    <InputField
                        id="name"
                        name="name"
                        type="text"
                        placeholder="Enter category name"
                        value={category.name}
                        onChange={handleChangeCategoryData}
                        required
                    />
                </div>

                <div className="space-y-2">
                    <label htmlFor="description" className="block text-sm font-medium text-slate-300">
                        Description
                    </label>
                    <TextArea
                        id="description"
                        name="description"
                        placeholder="Enter category description"
                        rows={3}
                        value={category.description}
                        onChange={handleChangeCategoryData}
                        required
                    />
                </div>
            </form>

            <footer className="flex justify-end space-x-3 mt-6 text-sm">
                <button
                    onClick={() => handleCloseModal()}
                    className="px-4 py-2 border border-transparent text-slate-300 rounded-md hover:bg-dashboard-border/80 transition-colors"
                >
                    Cancel
                </button>
                <button
                    onClick={() => handleSubmit()}
                    className="px-4 py-2 bg-dashboard-border/50 hover:bg-dashboard-border/80 text-white rounded-md transition-colors">
                    {textButton || "Send"}
                </button>
            </footer>
        </ModalContainer>
    );
}

export default CategoryModal;