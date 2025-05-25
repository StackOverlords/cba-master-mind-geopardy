import trophy from "../../../assets/copa-victoria-icon-3d-ilustracion-fondo.webp"
const Trophy: React.FC = () => {
    return (
        <div className="h-20 w-32 flex items-center justify-center">
            <img
                className="animate-float delay-300 absolute h-44"
                src={trophy} alt="copa de victoria" />

            {/* Floating Clouds */}
            {/* <div className="absolute left-0 top-2 w-6 h-4 bg-white/80 rounded-full animate-float delay-300" />
            <div className="absolute right-0 top-6 w-5 h-3 bg-white/80 rounded-full animate-float delay-500" />
            <div className="absolute left-5 bottom-2 w-4 h-3 bg-white/80 rounded-full animate-float delay-200" /> */}
        </div>
    );
};

export default Trophy;