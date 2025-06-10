import type { InputHTMLAttributes } from "react";

interface Props extends InputHTMLAttributes<HTMLInputElement> {
    name?: string;
}
const InputField: React.FC<Props> = ({ name, type, className, ...props }) => {
    return (
        <input
            name={name}
            type={type}
            className={`text-xs sm:text-sm w-full px-4 py-2 mt-1 bg-gray-800/50 backdrop-blur-md border border-gray-700 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500/50 ${className}`}
            {...props}
        // ref={ref}
        />
    );
}

export default InputField;