interface Props {
    title: string;
    description: string;
    className?: string;
}
const NotFoundData: React.FC<Props> = ({ title, description, className }) => {
    return (
        <article className={`text-center text-slate-400 rounded-lg px-4 py-8 bg-dashboard-bg/50 ${className}`}>
            <h2 className="text-lg font-semibold mb-2">{title}</h2>
            <p className="text-sm">{description}</p>
        </article>
    );
}

export default NotFoundData;