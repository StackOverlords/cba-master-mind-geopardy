import React, { useEffect } from "react";
import { motion } from "framer-motion";

interface CountdownProps {
  timer: number;
}

export const Countdown: React.FC<CountdownProps> = ({ timer }) => {
  useEffect(() => {}, [timer]);

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50">
      <motion.div
        className="text-center p-8 bg-white dark:bg-gray-800 rounded-3xl shadow-2xl border border-gray-200 dark:border-gray-700"
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
      >
        {timer > 0 ? (
          <motion.div
            key={timer}
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="text-6xl font-bold text-blue-600 dark:text-blue-400 mb-2"
          >
            {timer}
          </motion.div>
        ) : (
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="text-4xl font-bold text-green-500"
          >
            ¡Comienza!
          </motion.div>
        )}
        <p className="text-gray-600 dark:text-gray-400 text-sm mt-2">
          Prepárate para la primera pregunta
        </p>
      </motion.div>
    </div>
  );
};
