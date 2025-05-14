import type { ButtonHTMLAttributes } from "react";
interface Props extends ButtonHTMLAttributes<HTMLButtonElement> {
    name?: string;
}
const AuthProviderButton: React.FC<Props> = ({ children, className, ...props }) => {
    return (
        <button
            {...props}
            className={`relative flex w-full items-center justify-center gap-4
                 bg-gray-700/30 hover:bg-gray-700/70 text-white 
                 border  border-gray-700/50
                 rounded-md px-6 py-3 group cursor-pointer 
                 transition-colors duration-500 ease-in-out ${className}`}
        >
            {children}
        </button>
    );
}

export default AuthProviderButton;