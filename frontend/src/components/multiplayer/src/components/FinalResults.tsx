import { motion } from "framer-motion"; 

interface CountdownProps {
  children: React.ReactNode;
}

export const FinalResults: React.FC<CountdownProps> = ({ children }) => {
  return (
    <div className="fixed inset-0 backdrop-blur-lg flex items-center  w-full  justify-center z-50">
      <motion.div
        className="text-center rounded-3xl shadow-2xl  w-full  "
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
      >
        {children}
      </motion.div>
    </div>
  );
};
