import DeviceGameIcon from "../components/ui/icons/deviceGameIcon";
import PlayButton from "../components/ui/playButton";
import logoMastermindDark from "../assets/appLogo/Logo-MasterMind.webp";
import bghero from "../assets/bghero.webp";
import logoCBADark from "../assets/appLogo/logo_cba_white.webp";
import SocialButton from "../components/ui/socialButton";
import FacebookIcon from "../components/ui/icons/facebookIcon";
import WhatsAppIcon from "../components/ui/icons/WhatsAppIcon";
import WorldIcon from "../components/ui/icons/worldIcon";
import { AnimatedBadge } from "../components/ui/animatedBadge";

const LANDING_PAGE_CONTENT = {
    altTexts: {
        cbaTarija: "Logo de CBA Tarija",
        jeopardyMasterMind: "Jeopardy Master Mind",
    },
    hero: {
        title: "Master Mind",
        subtitle: "Challenge your mind with Jeopardy",
        description: "Not just a trivia game, but a complete experience that will test your knowledge in various categories.",
        playButton: "Play",
    },
} as const;

const LandingPage = () => {
    return (
        <main
            style={{ backgroundImage: `url(${bghero})` }}
            className="relative flex flex-col min-h-screen w-full bg-cover bg-no-repeat bg-center">
            {/* Contenedor para el contenido principal */}
            <div className="flex-1 flex flex-col items-center justify-center w-full py-6 px-4">
                {/* <img
                    className="h-12 sm:h-16 mt-20 drop-shadow-xl/35 drop-shadow-blue-500"
                    src={logoMastermindDark}
                    alt={LANDING_PAGE_CONTENT.altTexts.jeopardyMasterMind} /> */}

                <div className="relative mt-10">
                    <div
                        className="absolute inset-[-8px] animate-[pulse_3s_ease-in-out_infinite] rounded-full bg-blue-500/20 blur-lg"
                        style={{ transform: "scale(1.2)" }}
                    />
                    <img
                        className="h-12 sm:h-16"
                        src={logoMastermindDark}
                        alt={LANDING_PAGE_CONTENT.altTexts.jeopardyMasterMind} />
                </div>
                <h1
                    className="text-3xl sm:text-5xl mt-8 font-extrabold mb-2
                    bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent font-PressStart2P">
                    {LANDING_PAGE_CONTENT.hero.title}
                </h1>
                <section className="flex flex-col items-center max-w-4xl justify-center gap-4 px-6 py-6">
                    <h2 className="text-3xl sm:text-5xl font-extrabold text-center text-wrap">
                        {LANDING_PAGE_CONTENT.hero.subtitle}
                    </h2>
                    <p className="text-xs sm:text-base text-center text-gray-400 text-wrap w-full px-14">
                        {LANDING_PAGE_CONTENT.hero.description}
                    </p>
                    <PlayButton className="mt-14">
                        <DeviceGameIcon className="size-8" />
                        {LANDING_PAGE_CONTENT.hero.playButton}
                    </PlayButton>
                </section>
            </div>

            {/* Footer */}
            <footer className="w-full px-4 py-2 mt-auto flex items-center justify-center">
                <div className="w-full xl:w-7xl flex flex-col sm:flex-row items-center justify-center sm:justify-between px-6 z-20 sm:gap-2 gap-8">
                    <div>
                        <img
                            className="h-5 drop-shadow-xl/45 drop-shadow-blue-500"
                            src={logoCBADark}
                            alt={LANDING_PAGE_CONTENT.altTexts.cbaTarija} />
                    </div>
                    <AnimatedBadge />
                    <div className="flex gap-3">
                        <SocialButton href="https://es-la.facebook.com/centrobolivianoamericano.tarija">
                            <FacebookIcon className="size-6" />
                        </SocialButton>
                        <SocialButton href="https://api.whatsapp.com/send/?phone=59176192765&text&type=phone_number&app_absent=0">
                            <WhatsAppIcon className="size-6" />
                        </SocialButton>
                        <SocialButton href="https://cba.org.bo/">
                            <WorldIcon className="size-6" />
                        </SocialButton>
                    </div>
                </div>
            </footer>
        </main>
    );
}

export default LandingPage;