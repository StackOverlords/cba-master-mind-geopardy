import { CornerUpLeft } from "lucide-react";
import { useNavigate } from "react-router";
import { cn } from "../../lib/utils";

interface BackButtonProps {
    text?: string;
    className?: string;
    href: string;
    handleCleanGame: () => void;
}

const BackButton: React.FC<BackButtonProps> = ({ text, className, href, handleCleanGame }) => {
    const navigate = useNavigate()
    const handleGoBack = () => {
        handleCleanGame();
        sessionStorage.removeItem('gameCode');
        navigate(href);
    };

    return (
        <button
            onClick={handleGoBack}
            className={cn(
            "absolute left-0 flex items-center gap-2 p-1 text-xs sm:text-sm text-purple-200 hover:text-white z-50 cursor-pointer backdrop-blur-sm rounded-lg",
            className
            )}
        >
            <CornerUpLeft className="size-4" />
            {text || 'Back'}
        </button>
    );
};

export default BackButton;