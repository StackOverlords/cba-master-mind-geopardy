interface Props {
    title: string;
    description: string;
    className?: string;
}
const ErrorLoadingData: React.FC<Props> = ({ title, description, className }) => {
    return (
        <article className={`text-red-500 text-center rounded-lg px-4 py-8 bg-red-900/20 ${className}`}>
            <h2 className="text-lg font-semibold mb-2">{title}</h2>
            <p className="text-sm">{description}</p>
        </article>
    );
}

export default ErrorLoadingData;