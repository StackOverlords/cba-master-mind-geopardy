import InputField from "../../ui/inputField";
import type { User } from "../../../shared/types/user";
import SelectOptions from "../../ui/selectOptions";
import ModalContainer from "../../ui/modalContainer";
import type { FormEvent } from "react";

type Props = {
    user: User
    isModalOpen: boolean
    handleCloseModal: () => void
    handleChangeUserData?: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void
    handleSubmit: (e: FormEvent) => void
}

const UpdateUserModal: React.FC<Props> = ({
    user,
    isModalOpen,
    handleCloseModal,
    handleChangeUserData,
    handleSubmit
}) => {

    return (
        isModalOpen && (
            <ModalContainer handleCloseModal={handleCloseModal}>
                {/* Content */}
                <section className="relative z-10">
                    {/* Header */}
                    <header className="flex items-center justify-between mb-6">
                        <div>
                            <h3 className="text-xl font-medium text-white">Update User</h3>
                            <p className="text-sm text-slate-400">Modify the user's information</p>
                        </div>
                    </header>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="w-full">
                            <label htmlFor="name" className="block text-sm font-medium text-slate-300">Name</label>
                            <InputField
                                id="name"
                                name="name"
                                type="text"
                                value={user?.name}
                                onChange={handleChangeUserData}
                                placeholder="Enter full name"
                                required
                            />
                        </div>

                        <div className="w-full">
                            <label htmlFor="email" className="block text-sm font-medium text-slate-300">Email</label>
                            <InputField
                                id="email"
                                name="email"
                                type="email"
                                value={user?.email}
                                onChange={handleChangeUserData}
                                placeholder="Enter email address"
                                required
                            />
                        </div>
                        <div className="space-y-2">
                            <label htmlFor="role" className="block text-sm font-medium text-slate-300">
                                Role
                            </label>
                            <div className="relative">
                                <SelectOptions
                                    name="role"
                                    id="role"
                                    value={user?.role}
                                    onChange={handleChangeUserData}
                                >
                                    <option value="player">Player</option>
                                    <option value="admin">Admin</option>
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
                        <div className="flex justify-end space-x-3 mt-6 text-sm">
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
                                aria-label="Update User"
                                className="px-4 py-2 bg-dashboard-border/50 hover:bg-dashboard-border/80 text-white rounded-md transition-colors">
                                Update User
                            </button>
                        </div>
                    </form>

                </section>
            </ModalContainer>
        )
    );
}

export default UpdateUserModal;