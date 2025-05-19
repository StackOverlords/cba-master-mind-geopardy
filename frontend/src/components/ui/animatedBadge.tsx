import { AnimatePresence, motion } from "motion/react";
import { useEffect, useState } from "react";
import StarsIcon from "./icons/starsIcon";

export function AnimatedBadge() {
    const [isFirst, setIsFirst] = useState(true);

    useEffect(() => {
        const interval = setInterval(() => {
            setIsFirst((prev) => !prev);
        }, 2500); // Switch every 2 seconds

        return () => clearInterval(interval);
    }, []);

    return (
        <div className="flex w-[18ch] items-center justify-center gap-2 rounded-full border border-border/50 bg-background/20 px-3 py-1.5 backdrop-blur-sm">
            <AnimatePresence mode="wait">
                <motion.div
                    key={isFirst ? "vercel" : "crafter"}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.3 }}
                    className="flex items-center justify-center gap-2"
                >
                    {/* {isFirst ? (
                        <StarsIcon className="text-foreground size-3" />
                    ) : (
                        <StarsIcon className="text-foreground size-3" />
                    )} */}
                    <StarsIcon className="size-3 text-amber-300 drop-shadow-md drop-shadow-amber-100/50" />
                    <span className="text-center text-muted-foreground text-xs">
                        {isFirst
                            ? "Built by Ronald Gallardo"
                            : "Built by Olivio Subelza"}
                    </span>
                </motion.div>
            </AnimatePresence>
        </div>
    );
}
