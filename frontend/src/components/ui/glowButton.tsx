import type { CommonProps } from "../../shared/types";

interface Props extends CommonProps {
    children?: React.ReactNode;
    onClick?: () => void;
}

const GlowButton: React.FC<Props> = ({ children, onClick, className }) => {
    return (
        <button
            onClick={onClick}
            className={`relative bg-[#170a2e] text-white border border-purple-500/50 rounded-md px-6 py-3 group cursor-pointer ${className}`}
        >
            {children}
            <div className="absolute inset-0 opacity-30 group-hover:opacity-70 rounded-md transition-all duration-300 ease-in-out"
                style={{ boxShadow: 'inset 0 0 15px #622F8E' }}></div>
        </button>
    );
};

export default GlowButton;