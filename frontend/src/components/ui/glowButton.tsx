import type { ButtonHTMLAttributes } from "react";
import { cn } from "../../lib/utils";
interface Props extends ButtonHTMLAttributes<HTMLButtonElement> {
    name?: string;
}

const GlowButton: React.FC<Props> = ({ children, onClick, className, type, ...props }) => {
    return (
        <button
            {...props}
            type={type}
            onClick={onClick}
            className={cn(
                "flex relative bg-[#170a2e] text-white border border-purple-500/50 rounded-md items-center justify-center px-6 text-xs py-2 sm:text-sm group cursor-pointer",
                className)}
        >
            {children}
            <div className="absolute inset-0 opacity-30 group-hover:opacity-70 rounded-md transition-all duration-300 ease-in-out"
                style={{ boxShadow: 'inset 0 0 15px #622F8E' }}></div>
        </button>
    );
};

export default GlowButton;