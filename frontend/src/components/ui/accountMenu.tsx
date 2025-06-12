import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router";
import { useAuthStore } from "../../stores/authStore";
import DashboardIcon from "./icons/dashboardIcon";
import HelpIcon from "./icons/helpIcon";
import LogoutIcon from "./icons/logoutIcon";
import UserIcon from "./icons/userIcon";
import SpinnerIcon from "./icons/spinnerIcon";
// import HelpModal from "../help/helpModal";

// Constants
const AVATAR_COLORS = ["#d59bf6", "#ffc93c", "#42b883", "#cca8e9"] as const;
const LOCAL_STORAGE_COLOR_KEY = "color";

// Add types for better type safety
interface MenuItemProps {
    icon: React.ReactNode;
    text: string;
    onClick?: () => void;
    children?: React.ReactNode;
}

const AccountMenu = () => {
    const { user: userData, isAuthenticated, hasRole, logout, isLoadingButtons } = useAuthStore();
    const [isOpen, setIsOpen] = useState(false);
    const [openProfile, setOpenProfile] = useState(false);
    const divRef = useRef<HTMLDivElement>(null);
    const navigate = useNavigate();

    const toggleDropdown = () => setIsOpen(prev => !prev);

    const handleClickOutside = (event: MouseEvent) => {
        if (divRef.current && !divRef.current.contains(event.target as Node)) {
            setIsOpen(false);
        }
    };

    const handleLogout = async () => {
        try {
            await logout();
            navigate("/");
        } catch (error) {
            console.error('Error during logout:', error);
        }
    };

    const initializeAvatarColor = async (): Promise<void> => {
        const localColor = localStorage.getItem(LOCAL_STORAGE_COLOR_KEY);
        if (!localColor) {
            const randomColor = AVATAR_COLORS[Math.floor(Math.random() * AVATAR_COLORS.length)];
            localStorage.setItem(LOCAL_STORAGE_COLOR_KEY, randomColor);
        }
    };

    useEffect(() => {
        initializeAvatarColor();
        document.addEventListener('click', handleClickOutside);
        return () => document.removeEventListener('click', handleClickOutside);
    }, []);

    useEffect(() => {
        document.body.style.overflow = openProfile ? 'hidden' : 'auto';
    }, [openProfile]);

    const getUserInitials = (name?: string): string => {
        return name ? name.substring(0, 2).toUpperCase() : 'U';
    };

    const renderAvatar = () => {
        if (isAuthenticated && !userData?.photoURL) {
            return (
                <div
                    className="border p-2 rounded-full size-8 sm:size-10 font-bold uppercase flex justify-center items-center border-border/50 transition-colors duration-500 ease-in-out backdrop-blur-sm cursor-pointer text-sm sm:text-base"
                    style={{ background: localStorage.getItem(LOCAL_STORAGE_COLOR_KEY) || AVATAR_COLORS[0] }}
                    onClick={toggleDropdown}
                >
                    <span>{getUserInitials(userData?.displayName || 'User')}</span>
                </div>
            );
        }

        return (
            <button
                className="border-border/50 bg-background/20 w-max hover:bg-background/70 transition-colors duration-500 ease-in-out border backdrop-blur-sm rounded-full cursor-pointer size-8 sm:size-10"
                onClick={toggleDropdown}
            >
                <img
                    src={userData?.photoURL || ''}
                    alt="User Avatar"
                    className="rounded-full size-8 sm:size-10 w-max"
                />
            </button>
        );
    };

    const renderDropdownMenuItem = ({ icon, text, onClick,children }: MenuItemProps) => (
        <li>
            <button
                onClick={onClick}
                className="w-full my-1.5 rounded-md flex items-center py-2 px-2 sm:px-4 text-xs sm:text-sm transition-colors duration-300 text-gray-300 hover:bg-border/50 hover:text-white cursor-pointer"
                role="menuitem"
            >
                <span className="inline-flex items-center justify-center" aria-hidden="true">
                    {icon}
                </span>
                <span className="mx-1 ml-5">{text}</span>
                {children}
            </button>
        </li>
    );

    return (
        <div className="relative inline-block" ref={divRef}>
            {renderAvatar()}

            {isOpen && (
                <nav
                    id="account-menu"
                    className="absolute right-0 z-50 w-60 sm:w-max p-1 sm:p-2 mt-2 overflow-hidden origin-top-right rounded-md shadow-xl bg-background/50 backdrop-blur-xl"
                    role="menu"
                    aria-orientation="vertical"
                    aria-labelledby="user-menu-button"
                >
                    <header className="flex items-center gap-2 p-2 sm:p-3 -mt-2 text-xs sm:text-sm transition-colors duration-300">
                        {renderAvatar()}
                        <div className="mx-1">
                            <h2 className="font-semibold text-gray-200 text-start text break-all sm:break-normal">
                                {userData?.displayName}
                            </h2>
                            <p className="text-gray-400 break-all">
                                {userData?.email}
                            </p>
                        </div>
                    </header>

                    <hr className="border border-border/50" role="separator" />

                    <ul className="py-2" role="menu">
                        {renderDropdownMenuItem({
                            icon: (
                                <UserIcon className="size-4 sm:size-5" />
                            ),
                            text: "My account",
                            onClick: () => {
                                setOpenProfile(true);
                                setIsOpen(false);
                            },
                            children: (
                                <> 
                                    <span className="ml-2 px-2 py-0.5 rounded bg-yellow-400 text-gray-800 text-[10px] sm:text-xs font-semibold">
                                        Coming soon
                                    </span>
                                </>
                            )
                        })}

                        {hasRole('admin') && (
                            <>
                                {renderDropdownMenuItem({
                                    icon: <DashboardIcon className="size-5" />,
                                    text: "Dashboard",
                                    onClick: () => navigate("/dashboard")
                                })}
                            </>
                        )}

                        <hr className="border border-border/50" role="separator" />

                        {renderDropdownMenuItem({
                            icon: <HelpIcon className="size-5" />,
                            text: "About",
                            onClick: () => navigate("/about")
                        })}
                        {renderDropdownMenuItem({
                            icon: isLoadingButtons.withGoogle || isLoadingButtons.withEmail || isLoadingButtons.login ? <SpinnerIcon className="size-5 animate-spin" /> : <LogoutIcon className="size-5" />,
                            text: "Sign out",
                            onClick: handleLogout
                        })}
                    </ul>
                </nav>
            )}
            {/* Help Modal */}
            {/* <HelpModal
                isOpen={showHelpModal}
                onClose={() => setShowHelpModal(false)}
            /> */}
        </div>
    );
};

export default AccountMenu;