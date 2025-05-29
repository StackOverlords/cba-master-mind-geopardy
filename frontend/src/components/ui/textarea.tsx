import type { TextareaHTMLAttributes } from "react";

interface Props extends TextareaHTMLAttributes<HTMLTextAreaElement> {
    name: string;
}
const TextArea: React.FC<Props> = ({ name, className, ...props }) => {
    return (
        <textarea
            name={name}
            className={`text-sm w-full px-4 py-2 mt-1 bg-gray-800/50 backdrop-blur-md border border-gray-700 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500/50 ${className}`}
            {...props}
        />
    );
}

export default TextArea;