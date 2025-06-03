import { cn } from "../lib/utils";
import ModalContainer from "./ui/modalContainer";

interface ConfirmationModalProps {
    title: string;
    message: string;
    confirmButtonText?: string;
    onConfirm: () => void;
    onCancel: () => void;
    className?: string;
    classNameModal?: string;
    type?: "danger" | "info" | "warning";
}

const ConfirmationModal: React.FC<ConfirmationModalProps> = ({
    title,
    message,
    confirmButtonText,
    onConfirm,
    onCancel,
    className,
    classNameModal,
    type
}) => {
    const typeClass = {
        danger: "bg-red-900 hover:bg-red-700",
        warning: "bg-yellow-600 hover:bg-yellow-500",
        info: "bg-blue-600 hover:bg-blue-500"
    }[type ?? "info"]; // default a info si no se pasa nada

    const typeClassSpan = {
        danger: "bg-red-900/20 text-red-400 border-red-900/50",
        warning: "bg-yellow-500/20 text-yellow-400 border-yellow-500/50",
        info: "bg-blue-500/20 text-blue-400 border-blue-500/50"
    }[type ?? "info"];

    return (
        <ModalContainer
            className={classNameModal}
            handleCloseModal={onCancel}>
            <div className={cn("flex flex-col items-center justify-center p-4", className)}>
                <h3 className="text-xl font-medium text-white">{title}</h3>
                <p className="text-sm text-slate-400 text-center mt-2 text-wrap">{message}</p>
                <span className={cn("text-xs mt-4 w-full text-center p-2 border rounded-md", typeClassSpan)}>
                    {type === "danger" ? "This action cannot be undone." : "Please confirm your action."}
                </span>
                <footer className="mt-6 flex gap-4 text-sm">
                    <button
                        onClick={onCancel}
                        className="px-6 py-2 text-white rounded-md bg-dashboard-border/80 transition-colors ease-in-out duration-200"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={onConfirm}
                        className={cn("px-6 py-2 rounded-md transition-colors ease-in-out duration-200 text-white", typeClass)}
                    >
                        {confirmButtonText || "Confirm"}
                    </button>
                </footer>
            </div>
        </ModalContainer>
    );
};

export default ConfirmationModal;
