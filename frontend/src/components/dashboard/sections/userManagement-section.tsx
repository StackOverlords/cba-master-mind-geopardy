import { useEffect, useState, type FormEvent } from "react"
import SearchIcon from "../../ui/icons/searchIcon"
import UpdateUserModal from "../user/updateUserModal"
import InputField from "../../ui/inputField"
import { useBreakpoint } from "../../../hooks/useBreakpoint"
import type { User } from "../../../shared/types/user"
import { usePaginatedUsers } from "../../../hooks/queries/user/userQueries"
import { useUserByFirebaseId } from "../../../hooks/queries/user/useUserById"
import { useUpdateUser } from "../../../hooks/mutations/useUpdateUser"
import toast from "react-hot-toast"
import SuccessToast from "../../toastAlerts/successAlert"
import ErrorToast from "../../toastAlerts/errorAlert"
import SkeletonUserCard from "../user/skeletonUserCard"
import ErrorLoadingData from "../../errorLoadingData"
import NotFoundData from "../../notFoundData"
import Pagination from "../../pagination"
import SelectOptions from "../../ui/selectOptions"
import type { UserRole } from "../../../shared/auth.types"
import ConfirmationModal from "../../confirmationModal"
import EditIcon from "../../ui/icons/editIcon"
import TrashIcon from "../../ui/icons/trashIcon"

export function UserManagementSection() {
    const [confirmingDeleteId, setConfirmingDeleteId] = useState<string | null>(null);

    const { isMobile } = useBreakpoint();
    const [searchTerm, setSearchTerm] = useState("")
    const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [rowsPerPage, setRowsPerPage] = useState<number>(10);
    const [role, setRole] = useState<UserRole>('guest');
    const [sort, setSort] = useState<'asc' | 'desc'>('desc');
    const [firebaseUid, setFirebaseUid] = useState<string>('');

    const { mutate: updateUser } = useUpdateUser()

    const { data: users, isLoading, isError, isFetching } = usePaginatedUsers({
        page: currentPage,
        limit: rowsPerPage,
        role: role === 'guest' ? undefined : role,
        sort,
        // firebaseUid: firebaseUid ? firebaseUid : null,
    });
    const { data: userData } = useUserByFirebaseId({
        id: firebaseUid,
    });
    const [selectedUser, setSelectedUser] = useState<User>({
        _id: "",
        name: "",
        email: "",
        role: "player",
        firebaseUid: ""
    });
    const handleChangeUserData = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setSelectedUser({ ...selectedUser, [e.target.name]: e.target.value });
    };

    const handleClickUpdate = (firebaseUid: string) => {
        setIsCreateDialogOpen(true)
        setFirebaseUid(firebaseUid)
    }
    useEffect(() => {
        if (userData) {
            setSelectedUser(userData)
        }
    }, [userData])

    const filteredUsers = users?.data.filter(
        (user) =>
            user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            user.email.toLowerCase().includes(searchTerm.toLowerCase()),
    )

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault()
        if (!selectedUser._id) return;
        updateUser(
            {
                id: selectedUser.firebaseUid,
                data: {
                    name: selectedUser.name,
                    email: selectedUser.email,
                    role: selectedUser.role,
                },
            },
            {
                onSuccess: () => {
                    toast.custom((t) => (
                        <SuccessToast
                            title="Success"
                            description="User updated successfully"
                            t={t} />
                    ));
                    setIsCreateDialogOpen(false)
                },
                onError: () => {
                    toast.custom((t) => (
                        <ErrorToast
                            title="Error"
                            description="Failed to update user"
                            t={t} />
                    ));
                },
            }
        );
    }
    const handleCloseModal = () => {
        setIsCreateDialogOpen(false);
        setSelectedUser({
            _id: "",
            name: "",
            email: "",
            role: "player",
            firebaseUid: ""
        });
        setFirebaseUid('');
    }

    const handlePageChange = (page: number) => {
        setCurrentPage(page);
    };

    const handleRowsChange = (rows: number) => {
        setRowsPerPage(rows);
        setCurrentPage(1);
    };
    return (
        <div className="space-y-6">
            <header className="flex justify-between items-center flex-wrap gap-2">
                <div>
                    <h1 className="text-xl sm:text-3xl font-bold text-white mb-2">User Management</h1>
                    <p className="text-xs sm:text-base text-slate-400">Manage user accounts, roles, and permissions</p>
                </div>
            </header>

            <div className="bg-dashboard-bg/50 border border-dashboard-border/50 rounded-lg ">
                <section className="p-2 sm:p-4 border-b border-dashboard-border/50 text-xs sm:text-base">
                    <h3 className="text-base sm:text-lg font-medium text-white">Users</h3>
                    <p className="text-xs sm:text-sm text-slate-400 mb-4">Manage all registered users and their permissions</p>
                    <div className="flex items-center space-x-2 grow flex-wrap gap-y-1.5">
                        <div className="relative sm:max-w-xs sm:w-full">
                            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none z-10">
                                <SearchIcon className="w-4 h-4 text-slate-400" />
                            </div>
                            <InputField
                                type="text"
                                name="search"
                                placeholder="Search users..."
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
                        <div className="relative w-max">
                            <SelectOptions
                                name="role"
                                value={role}
                                onChange={(e) => setRole(e.target.value as UserRole)}
                            >
                                <option className="bg-gray-800 text-gray-300" value="guest">All users</option>
                                <option className="bg-gray-800 text-gray-300" value="player">Player</option>
                                <option className="bg-gray-800 text-gray-300" value="admin">Admin</option>
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
                </section>
                <div className="p-2 sm:p-4 relative flex flex-col gap-2">
                    {
                        isLoading || isFetching ? (
                            [...Array(5)].map((_, index) => (
                                <SkeletonUserCard key={index} />
                            ))
                        ) : isError ? (
                            <ErrorLoadingData
                                title="Error loading users"
                                description="There was an error fetching the user data. Please try again later."
                            />
                        ) : filteredUsers?.length === 0 ? (
                            <NotFoundData
                                title="No users found"
                                description="No users match your search criteria or filters."
                            />
                        ) : isMobile ? (
                            // 🔹 Vista móvil: tarjetas
                            filteredUsers && filteredUsers.map((user) => (
                                <div
                                    key={user._id}
                                    className="grid sm:grid-cols-2 items-center p-2 sm:p-4 rounded-lg bg-dashboard-bg/50 border border-dashboard-border/50 hover:bg-dashboard-bg/70 transition-colors"
                                >
                                    <div className="flex items-center space-x-3">
                                        <div className="size-7 sm:size-8 rounded-full bg-purple-600 flex items-center justify-center text-white text-xs uppercase">
                                            {user.name
                                                .split(" ")
                                                .slice(0, 2)
                                                .map((n) => n[0])
                                                .join("")}
                                        </div>
                                        <div>
                                            <div className="text-white text-sm sm:text-base">{user.name}</div>
                                            <div className="text-xs sm:text-sm text-slate-400">{user.email}</div>
                                        </div>
                                    </div>

                                    <div className="flex items-center justify-end gap-2 sm:gap-4 mt-2">
                                        <span
                                            className={`px-2 py-1 rounded-full text-xs ${user.role === "admin"
                                                ? "bg-red-500/20 text-red-300"
                                                : "bg-purple-500/20 text-purple-300"
                                                }`}
                                        >
                                            {user.role}
                                        </span>

                                        <div className="flex items-center gap-2 relative">
                                            <button
                                                onClick={() => handleClickUpdate(user.firebaseUid)}
                                                className="w-8 h-8 flex items-center justify-center text-slate-400 hover:text-white rounded-md hover:bg-dashboard-border/50 transition-colors">
                                                <EditIcon className="size-4" />
                                            </button>
                                            <button
                                                onClick={() => setConfirmingDeleteId(user._id)}
                                                className="w-8 h-8 flex items-center justify-center text-red-400 hover:text-red-300 rounded-md hover:bg-red-900/20 transition-colors">
                                                <TrashIcon className="size-4" />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))
                        ) : (
                            // 🔸 Vista desktop: tabla
                            <table className="w-full">
                                <thead>
                                    <tr className="border-b border-[#2a2550]">
                                        <th className="text-left py-3 px-4 text-slate-300 font-medium">User</th>
                                        <th className="text-left py-3 px-4 text-slate-300 font-medium">Role</th>
                                        <th className="text-left py-3 px-4 text-slate-300 font-medium">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredUsers && filteredUsers.map((user) => (
                                        <tr key={user._id} className="border-b border-[#2a2550]">
                                            <td className="py-3 px-4">
                                                <div className="flex items-center space-x-3">
                                                    <div className="w-8 h-8 rounded-full bg-purple-600 flex items-center justify-center text-white text-xs uppercase">
                                                        {user.name
                                                            .split(" ")
                                                            .slice(0, 2)
                                                            .map((n) => n[0])
                                                            .join("")}
                                                    </div>
                                                    <div>
                                                        <div className="text-white">{user.name}</div>
                                                        <div className="text-sm text-slate-400">{user.email}</div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="py-3 px-4">
                                                <span
                                                    className={`px-2 py-1 rounded-full text-xs ${user.role === "admin"
                                                        ? "bg-red-500/20 text-red-300"
                                                        : "bg-purple-500/20 text-purple-300"
                                                        }`}
                                                >
                                                    {user.role}
                                                </span>
                                            </td>
                                            <td className="py-3 px-4 relative flex items-center gap-2">
                                                <button
                                                    onClick={() => handleClickUpdate(user.firebaseUid)}
                                                    className="w-8 h-8 flex items-center justify-center text-slate-400 hover:text-white rounded-md hover:bg-dashboard-border/50 transition-colors">
                                                    <EditIcon className="size-4" />
                                                </button>
                                                <button
                                                    onClick={() => setConfirmingDeleteId(user._id)}
                                                    className="w-8 h-8 flex items-center justify-center text-red-400 hover:text-red-300 rounded-md hover:bg-red-900/20 transition-colors">
                                                    <TrashIcon className="size-4" />
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        )}
                    {
                        filteredUsers && filteredUsers.length > 10 && (
                            <Pagination
                                currentPage={currentPage}
                                totalPages={users?.totalPages || 1}
                                onPageChange={handlePageChange}
                                showRows={rowsPerPage}
                                onShowRowsChange={handleRowsChange}
                            />
                        )
                    }
                </div>
            </div>
            <UpdateUserModal
                handleSubmit={handleSubmit}
                handleChangeUserData={handleChangeUserData}
                user={selectedUser}
                handleCloseModal={handleCloseModal}
                isModalOpen={isCreateDialogOpen}
            />
            {
                confirmingDeleteId && (
                    <ConfirmationModal
                        confirmButtonText="Delete"
                        onCancel={() => setConfirmingDeleteId(null)}
                        onConfirm={() => {
                            // handleDeleteQuestion(question._id)
                            setConfirmingDeleteId(null)
                        }}
                        title="Delete User"
                        message="Are you sure you want to delete this user?"
                        type="danger"
                    />
                )
            }
        </div>
    )
}
