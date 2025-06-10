import { useEffect } from "react";
import PodiumResults from "./podiumResults";
import confetti from "canvas-confetti";
import { motion } from "framer-motion";
import type { ChampionShipPlayer } from "../../shared/types/ChampionShipGame";

const overlayVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: {
        opacity: 1,
        scale: 1,
        transition: { duration: 0.6, ease: "easeOut" },
    },
};

const launchConfetti = () => {
    const count = 10;
    const defaults = {
        origin: { y: 0.7 },
        spread: 60,
        ticks: 200,
        zIndex: 1000,
    };

    for (let i = 0; i < count; i++) {
        setTimeout(() => {
            confetti({
                ...defaults,
                particleCount: 50,
                angle: 60 + Math.random() * 60,
                origin: { x: Math.random(), y: Math.random() * 0.5 },
                colors: ['#00e0ff', '#ffffff', '#ffe400'],
            });
        }, i * 400); // lanzamientos separados
    }
};
interface Props {
    players: ChampionShipPlayer[];
};
const AnimatedPodiumOverlay:React.FC<Props> = ({
    players
}) => {
    useEffect(() => {
        document.body.style.overflow = "hidden";
        launchConfetti();

        return () => {
            document.body.style.overflow = "";
        };
    }, []);

    return (
        <motion.div
            className="fixed inset-0 bg-black/80 backdrop-blur-sm bg-opacity-70 z-50 flex items-center justify-center"
            initial="hidden"
            animate="visible"
            variants={overlayVariants}
        >
            <PodiumResults
            players={players}
            />
        </motion.div>
    );
};

export default AnimatedPodiumOverlay;
