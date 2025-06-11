interface Props {
    title: string;
    description: string;
    className?: string;
}
const NotFoundData: React.FC<Props> = ({ title, description, className }) => {
    return (
        <article className={`text-center text-slate-400 rounded-lg px-4 py-8 bg-dashboard-bg/50 ${className}`}>
            <h2 className="text-base sm:text-lg font-semibold mb-2 text-center">{title}</h2>
            <p className="text-xs sm:text-sm text-center">{description}</p>
        </article>
    );
}

export default NotFoundData;