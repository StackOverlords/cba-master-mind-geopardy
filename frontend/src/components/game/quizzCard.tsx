interface Props {
    Icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
    color: string;
}

const QuizzCard: React.FC<Props> = ({
    Icon,
    color
}) => {

    return (
        <>
            <article
                className="relative size-18 sm:size-24 md:h-24 lg:w-26 xl:w-32 cursor-pointer transition-all duration-300 border-indigo-400/50 bg-indigo-900/60 border rounded-lg hover:bg-indigo-800/80"
            >
                <div className="absolute inset-0 bg-gradient-to-br from-transparent via-indigo-500/5 to-white/7" />
                <div className="absolute inset-0 flex flex-col items-center justify-center gap-2">
                    <Icon
                        className={`size-6 ${color} filter drop-shadow-[0_0_8px_rgba(255,255,255,0.3)]`}
                    />
                </div>
            </article>

        </>
    );
}

export default QuizzCard;