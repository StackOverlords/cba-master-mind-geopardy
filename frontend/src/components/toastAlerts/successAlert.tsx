// components/SuccessToast.tsx
import { toast, type Toast } from 'react-hot-toast';
import CheckIcon from '../ui/icons/checkIcon';
import XIcon from '../ui/icons/xIcon';
import { AnimatePresence, motion } from 'motion/react';

type Props = {
    t: Toast;
    title?: string;
    description?: string;
};

export default function SuccessToast({ t, title, description }: Props) {
    return (
        <AnimatePresence>
            <motion.div
                key={t.id}
                initial={{ opacity: 0, x: 60 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 60 }}
                transition={{ duration: 0.3 }}
                className={`${t.visible ? 'animate-enter' : 'animate-leave'
                    } max-w-md w-full bg-gradient-to-br from-leaderboard-bg/50 to-black/50 text-white rounded-lg shadow-lg p-4 flex relative overflow-hidden backdrop-blur-xl items-center`}
            >

                <div className='absolute -top-10 -right-10 bg-linear-to-bl from-[#1D7469] to-transparent w-2/3 h-32 rounded-full mask-l-from-30% mask-b-from-70%' />
                <CheckIcon className="w-8 h-8 text-emerald-300 ml-4 mr-8" />
                <div className="flex-1">
                    <h3 className="text-lg font-semibold">
                        {title || 'Success'}
                    </h3>
                    <p className="text-sm text-gray-300">
                        {description || 'Operation completed successfully.'}
                    </p>
                    {/* <div className="mt-4 flex space-x-3">
                        <button className="bg-gray-800 hover:bg-lime-300 hover:text-black px-4 py-2 rounded text-sm">
                            Copy Link
                        </button>
                        <button className="bg-gray-800 hover:bg-emerald-500 px-4 py-2 rounded text-sm">
                            Done
                        </button>
                    </div> */}
                </div>
                <button onClick={() => toast.remove(t.id)} className="absolute top-2 right-2 p-1 rounded-md hover:bg-black/50 transition-colors">
                    <XIcon className="size-5 text-white" />
                </button>
            </motion.div>
        </AnimatePresence>
    );
}
