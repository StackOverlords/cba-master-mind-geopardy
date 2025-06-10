import { Outlet } from "react-router";
import logoMastermindDark from "../assets/appLogo/Logo-MasterMind.webp"
import GradientBackground from "../components/ui/gradientBackground";
import BackButton from "../components/ui/backButton";

const LoginPage = () => {
    return (
        <>
            <GradientBackground />
            <main className="flex flex-col items-center justify-center min-h-dvh w-full py-6 px-3">
                <BackButton
                    href="/"
                    className="left-4 top-4"
                    text="Go Back"
                />
                <div className="relative mb-6">
                    <div
                        className="absolute inset-[-8px] animate-[pulse_3s_ease-in-out_infinite] rounded-full bg-blue-500/20 blur-lg"
                        style={{ transform: "scale(1.2)" }}
                    />
                    <img
                        className="h-16 sm:h-24"
                        src={logoMastermindDark} alt="Jeopardy Master Mind" />
                </div>
                <h1
                    className="font-PressStart2P text-2xl font-extrabold mb-2
                bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent text-center">
                    Master Mind
                </h1>
                <Outlet />
            </main>
        </>
    );
}

export default LoginPage;