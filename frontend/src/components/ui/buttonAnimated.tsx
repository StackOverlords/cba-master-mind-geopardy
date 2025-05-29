import { motion } from "framer-motion";

export const ButtonAnimated = ({ 
  onClick, 
  isAnimated, 
  className, 
  children 
}: any) => {
  return (
    <motion.button
      onClick={onClick}
      className={className}
      animate={{
        rotate: isAnimated ? 360 : 0,
        scale: isAnimated ? [1, 1.1, 1] : 1
      }}
      transition={{
        rotate: {
          duration: 0.8,
          ease: "linear",
          repeat: isAnimated ? Infinity : 0
        },
        scale: {
          duration: 0.3,
          ease: "easeInOut"
        }
      }}
    >
      {children}
    </motion.button>
  );
};