import type { AnchorHTMLAttributes } from "react";

interface Props extends AnchorHTMLAttributes<HTMLAnchorElement> {
    text?: string;
}
const SocialButton: React.FC<Props> = ({ children, className, ...props }) => {
    return (
        <a
            {...props}
            rel="noreferrer"
            target="_blank"
            className={`text-gray-400 hover:text-white border-border/50 bg-background/20 hover:bg-background/70 transition-colors duration-500 ease-in-out border backdrop-blur-sm rounded-full p-2 ${className}`}>
            {children}
        </a>
    );
}

export default SocialButton;