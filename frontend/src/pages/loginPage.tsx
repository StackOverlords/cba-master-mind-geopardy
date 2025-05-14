import { Outlet } from "react-router";
import logoMastermindDark from "../assets/appLogo/Logo-MasterMind.webp"

const LoginPage = () => {
    return (
        <main className="flex flex-col items-center justify-center min-h-screen w-full py-6 px-4">
            <img
                className="h-16"
                src={logoMastermindDark} alt="Jeopardy Master Mind" />
            <h1
                className="text-4xl font-extrabold mb-2
                bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
                Master Mind
            </h1>
            <Outlet />
        </main>
    );
}

export default LoginPage;