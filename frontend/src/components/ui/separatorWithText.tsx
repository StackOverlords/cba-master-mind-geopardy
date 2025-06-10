interface Props {
    text?: string;
    className?: string;
}

const SeparatorWithText: React.FC<Props> = ({ text, className }) => {
    return (
        <div className={`flex items-center justify-center gap-3 mt-4 ${className}`}>
            <hr className="flex-grow border-t border-gray-500" />
            <span className="text-xs sm:text-sm text-gray-500 font-medium">{text}</span>
            <hr className="flex-grow border-t border-gray-500" />
        </div>
    );
};
export default SeparatorWithText;

