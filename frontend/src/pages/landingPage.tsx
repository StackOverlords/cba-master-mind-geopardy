import DeviceGameIcon from "../components/ui/icons/deviceGameIcon";
import PlayButton from "../components/ui/playButton";
import logoMastermindDark from "../assets/appLogo/Logo-MasterMind.webp";
import bghero from "../assets/bghero.webp";
import logoCBADark from "../assets/appLogo/logo_cba_white.webp";

const LandingPage = () => {
    return (
        <main
            style={{ backgroundImage: `url(${bghero})` }}
            className="relative flex flex-col items-center justify-center min-h-screen w-full py-6 px-4 bg-cover bg-no-repeat bg-center">
            <nav className="absolute top-0 px-6 py-2 w-full xl:w-7xl flex items-center justify-between">
                <img
                    className="h-7"
                    src={logoCBADark} alt="Logo de CBA Tarija" />
                <div className="flex items-center  justify-center gap-2 text-xs sm:text-sm">

                    <a
                        href="/auth/sign-in"
                        className={`relative flex items-center justify-center gap-4
                            bg-gray-700/30 hover:bg-gray-700/70 text-white 
                            border  border-gray-500/50
                            rounded-md px-6 py-2 group cursor-pointer 
                            transition-colors duration-500 ease-in-out`}
                    >
                        Sign In
                    </a>

                    <a
                        href="/auth/sign-up"
                        className={`relative bg-[#170a2e] text-white border border-purple-500/50 rounded-md px-6 py-2 group cursor-pointer`}
                    >
                        Sign Up
                        <div className="absolute inset-0 opacity-30 group-hover:opacity-70 rounded-md transition-all duration-300 ease-in-out"
                            style={{ boxShadow: 'inset 0 0 15px #622F8E' }}></div>
                    </a>
                </div>
            </nav>
            <img
                className="h-12 sm:h-16 mt-20 drop-shadow-xl/35 drop-shadow-blue-500"
                src={logoMastermindDark} alt="Jeopardy Master Mind" />
            <h1
                className="text-3xl sm:text-5xl mt-8 font-extrabold mb-2
                bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent font-PressStart2P">
                Master Mind
            </h1>
            <section className="flex flex-col items-center max-w-4xl justify-center gap-4 px-6 py-6">
                <h2 className="text-3xl sm:text-5xl font-extrabold text-center text-wrap">
                    Challenge your mind with Jeopardy
                    {/* <span
                        className="bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent font-PressStart2P">
                        Master Mind
                    </span> */}
                </h2>
                <p className="text-xs sm:text-base text-center text-gray-400 text-wrap w-full px-14">
                    Not just a trivia game, but a complete experience that will test your knowledge in various categories.
                </p>
                <PlayButton className="mt-14">
                    <DeviceGameIcon className="size-8" />
                    Play
                </PlayButton>
            </section>
        </main>
    );
}

export default LandingPage;