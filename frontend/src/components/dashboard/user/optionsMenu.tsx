import { useEffect, useRef } from "react";
import EditIcon from "../../ui/icons/editIcon";
import TrashIcon from "../../ui/icons/trashIcon";
interface MenuItemProps {
    icon: React.ReactNode;
    text: string;
    onClick?: () => void;
}
interface Props {
    className?: string
    toggleDropdown: () => void,
    handleEditFuction: () => void
    handleDeleteFunction?: () => void
}
const OptionsMenu = ({ toggleDropdown, className, handleDeleteFunction, handleEditFuction }: Props) => {
    const divRef = useRef<HTMLDivElement>(null);
    const ignoreClick = useRef<boolean>(true); // Usamos ref para evitar re-renders

    const handleClickOutside = (event: MouseEvent) => {
        if (ignoreClick.current) return;

        if (divRef.current && !divRef.current.contains(event.target as Node)) {
            toggleDropdown();
        }
    };

    useEffect(() => {
        // Ignorar el primer clic (el que abre el menú)
        ignoreClick.current = true;
        const timer = setTimeout(() => {
            ignoreClick.current = false;
        }, 0);

        document.addEventListener("click", handleClickOutside);
        return () => {
            clearTimeout(timer);
            document.removeEventListener("click", handleClickOutside);
        };
    }, []);

    const renderDropdownMenuItem = ({ icon, text, onClick }: MenuItemProps) => (
        <li>
            <button
                onClick={onClick}
                className="w-full my-1.5 rounded-md flex items-center py-1.5 px-3 text-sm transition-colors duration-300 text-gray-300 hover:bg-border/50 hover:text-white cursor-pointer"
                role="menuitem"
            >
                <span className="inline-flex items-center justify-center" aria-hidden="true">
                    {icon}
                </span>
                <span className="mx-1 ml-5">{text}</span>
            </button>
        </li>
    );

    return (
        <div
            id="account-menu"
            className={`${className} absolute z-30 w-36 px-2 overflow-hidden origin-top-right rounded-md shadow-xl bg-background/50 backdrop-blur-xl`}
            role="menu"
            aria-orientation="vertical"
            aria-labelledby="options-menu-button"
            ref={divRef}
        >
            <ul className="py-2" role="menu">
                {renderDropdownMenuItem({
                    icon: (
                        <EditIcon className="size-4" />
                    ),
                    text: "Edit",
                    onClick: () => {
                        handleEditFuction()
                        toggleDropdown()
                    }
                })}

                {/* {renderDropdownMenuItem({
                            icon: <DashboardIcon className="size-5" />,
                            text: "Dashboard",
                            onClick: () => navigate("/dashboard")
                        })} */}

                <hr className="border border-border/50" role="separator" />

                {renderDropdownMenuItem({
                    icon: <TrashIcon className="size-4" />,
                    text: "Delete"
                })}

            </ul>
        </div>
    );
}

export default OptionsMenu;