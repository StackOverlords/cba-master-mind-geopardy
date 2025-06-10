import type { ButtonHTMLAttributes } from "react";
interface Props extends ButtonHTMLAttributes<HTMLButtonElement> {
    name?: string;
}
const AuthProviderButton: React.FC<Props> = ({ children, className, disabled, ...props }) => {
    return (
        <button
            {...props}
            disabled={disabled}
            className={`relative flex w-full items-center justify-center gap-4
                 bg-gray-700/30 hover:bg-gray-700/70 text-white 
                 border  border-gray-700/50
                 rounded-md px-6 py-2 group  
                 text-xs sm:text-sm 
                 transition-colors duration-500 ease-in-out ${className}`}
        >
            {children}
        </button>
    );
}

export default AuthProviderButton;