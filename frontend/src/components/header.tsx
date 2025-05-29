import { useEffect, useState } from "react";
import logoCBADark from "../assets/appLogo/logo_cba_white.webp"
import { useAuthStore } from "../stores/authStore";
import { hasLoggedBefore } from "../utils/localStorage";
import AccountMenu from "./ui/accountMenu";
import UserIcon from "./ui/icons/userIcon";

const LANDING_PAGE_CONTENT = {
    altTexts: {
        cbaTarija: "Logo de CBA Tarija",
    },
    navigation: {
        signIn: "Sign In",
        signUp: "Sign Up",
    }
} as const;

const Header = () => {
    const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
    const [hasLogged, setHasLogged] = useState<boolean>(hasLoggedBefore());
    useEffect(() => {
        setHasLogged(hasLoggedBefore());
    }, [isAuthenticated]);

    return (
        <nav className="absolute top-0 px-4 py-4 w-full flex items-center justify-center">
            <div className="w-full xl:w-7xl flex items-center justify-between px-6 z-20">
                <div className="flex items-center justify-center gap-3">
                    <img
                        className="h-5 drop-shadow-xl/45 drop-shadow-blue-500 hidden"
                        src={logoCBADark}
                        alt={LANDING_PAGE_CONTENT.altTexts.cbaTarija} />
                </div>
                <div className="flex items-center justify-center gap-2 text-xs sm:text-sm">
                    {
                        isAuthenticated ? (
                            <AccountMenu />
                        ) : hasLogged ? (
                            <div className="size-10 flex items-center justify-center rounded-full animate-pulse border-border/60 bg-background/50 hover:bg-background/70 border backdrop-blur-sm">
                                <UserIcon className="size-5 text-border/60" />
                            </div>
                        ) : (
                            <>
                                <a
                                    href="/auth/sign-in"
                                    className={`relative flex items-center justify-center gap-4
                            text-gray-300 hover:text-white border-border/60 bg-background/50 hover:bg-background/70 border backdrop-blur-sm
                            rounded-md px-6 py-2 group  
                            transition-colors duration-500 ease-in-out`}
                                >
                                    {LANDING_PAGE_CONTENT.navigation.signIn}
                                </a>

                                <a
                                    href="/auth/sign-up"
                                    className={`relative bg-[#170a2e] text-white border border-purple-500/50 rounded-md px-6 py-2 group cursor-pointer`}
                                >
                                    {LANDING_PAGE_CONTENT.navigation.signUp}
                                    <div className="absolute inset-0 opacity-30 group-hover:opacity-70 rounded-md transition-all duration-300 ease-in-out"
                                        style={{ boxShadow: 'inset 0 0 15px #622F8E' }}></div>
                                </a>
                            </>
                        )
                    }
                </div>
            </div>
        </nav>
    );
}

export default Header;