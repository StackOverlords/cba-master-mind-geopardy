import XIcon from "../../ui/icons/xIcon";
import InputField from "../../ui/inputField";
import type { User } from "../../../shared/types/user";
import SelectOptions from "../../ui/selectOptions";
import ModalContainer from "../../ui/modalContainer";

type Props = {
    user: User
    isModalOpen: boolean
    handleCloseModal: () => void
    handleChangeUserData?: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void
    handleSubmit: () => void
}

const UpdateUserModal: React.FC<Props> = ({
    user,
    handleCloseModal,
    handleChangeUserData,
    handleSubmit
}) => {

    return (
        <ModalContainer handleCloseModal={handleCloseModal}>
            {/* Glass overlay */}
            <div className="absolute inset-0 bg-[#6f65ff]/5" />

            {/* Content */}
            <section className="relative z-10">
                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                    <div>
                        <h3 className="text-xl font-medium text-white">Update User</h3>
                        <p className="text-sm text-slate-400">Modify the user's information</p>
                    </div>

                    <div className="flex items-center space-x-4">
                        <button
                            className="p-1 rounded-md hover:bg-dashboard-border/50 transition-colors ease-in-out delay-100"
                            onClick={() => handleCloseModal()}
                        >
                            <XIcon className="w-5 h-5" />
                        </button>
                    </div>
                </div>

                <div className="space-y-4">
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
                </div>

                <div className="flex justify-end space-x-3 mt-6 text-sm">
                    <button
                        onClick={() => handleCloseModal()}
                        className="px-4 py-2 border border-transparent text-slate-300 rounded-md hover:bg-dashboard-border/80 transition-colors"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={() => handleSubmit()}
                        className="px-4 py-2 bg-dashboard-border/50 hover:bg-dashboard-border/80 text-white rounded-md transition-colors">
                        Update User
                    </button>
                </div>
            </section>
        </ModalContainer>
    );
}

export default UpdateUserModal;