import { AnimatePresence, motion } from "motion/react";
import XIcon from "./icons/xIcon";
import { useEffect } from "react";
import { createPortal } from "react-dom";

type Props = {
    children?: React.ReactNode
    handleCloseModal: () => void
}

const ModalContainer: React.FC<Props> = ({
    children,
    handleCloseModal,
}) => {

    useEffect(() => {
        const originalStyle = window.getComputedStyle(document.body).overflow;
        document.body.style.overflow = "hidden";

        return () => {
            document.body.style.overflow = originalStyle;
        };
    }, []);


    return createPortal(
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50 backdrop-blur-md p-4"
                onClick={() => handleCloseModal()}
            >
                <motion.div
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.9, opacity: 0 }}
                    transition={{ type: "spring", damping: 20, stiffness: 300 }}
                    className="relative w-full max-w-max md:max-w-xl overflow-y-hidden rounded-xl
                        bg-gradient-to-br from-leaderboard-bg/60 to-black/30 backdrop-blur-sm 
                        border border-border/70 shadow-[0_0_15px_rgba(72,66,165,0.3)] z-3 max-h-full py-2"
                    onClick={(e) => e.stopPropagation()}
                >
                    <div className="absolute inset-0 bg-[#6f65ff]/5" />
                    <button
                        className="p-1 rounded-md hover:bg-dashboard-border/50 transition-colors ease-in-out delay-100 absolute top-6 right-4 z-40"
                        onClick={() => handleCloseModal()}
                    >
                        <XIcon className="w-5 h-5" />
                    </button>
                    <section className="relative z-10 overflow-y-auto py-6 px-8 max-h-[85vh]">
                        {children}
                    </section>
                </motion.div>
            </motion.div>
        </AnimatePresence>,
        document.body
    );
}

export default ModalContainer;