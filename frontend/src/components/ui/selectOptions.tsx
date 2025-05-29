import type { SelectHTMLAttributes } from "react";
import { cn } from "../../lib/utils";

interface Props extends SelectHTMLAttributes<HTMLSelectElement> {
    name?: string;
}
const SelectOptions: React.FC<Props> = ({ children, name, className, ...props }) => {
    return (
        <select
            name={name}
            className={cn(
                'appearance-none text-sm w-full pl-4 pr-8 py-2 mt-1',
                'bg-gray-800/50 backdrop-blur-md border border-gray-700',
                'rounded-md text-white focus:outline-none focus:ring-2 focus:ring-purple-500/50',
                className
            )}
            {...props}>
            {children}
        </select>
    );
}

export default SelectOptions;