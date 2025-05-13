import { useState } from "react";
import { signInWithGoogle } from "../../services/firebase";
import InputField from "../ui/inputField";
import EyeIcon from "../ui/icons/eyeIcon";
import EyeClosedIcon from "../ui/icons/eye-closedIcon";
import GlowButton from "../ui/glowButton";
import SeparatorWithText from "../ui/separatorWithText";
import GoogleIcon from "../ui/icons/googleIcon";
import type { LoginCredentials } from "../../shared/types";
import { loginUser } from "../../api/authApi";

const LoginForm = () => {
    const [error, setError] = useState<string | null>(null);
    const [loginData, setLoginData] = useState<LoginCredentials>({
        firebaseUid: '',
        name: '',
        email: '',
        password: ''
    })
    const [showPassword, setShowPassword] = useState<boolean>(false);

    const toggleShowPassword = () => {
        setShowPassword(!showPassword);
    };
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setLoginData({ ...loginData, [e.target.name]: e.target.value });
    };
    const handleSignInWithGoogle = async () => {
        const userResponse = await signInWithGoogle()
        if (userResponse) {
            setError(null)
            console.log(await loginUser(userResponse))
        }
        else {
            setError('Error signIn with Google');
        }
    }

    return (
        <section className="flex flex-col items-center justify-center min-h-screen">
            <h2 className="text-3xl font-semibold">Hi, welcome back!</h2>
            <form className="mt-4 px-6 py-2 
            flex flex-col gap-4 
            items-center 
            max-w-sm w-sm"
                action="">
                <div className="w-full">
                    <label htmlFor="">Email</label>
                    <InputField
                        name="email"
                        type="email"
                        value={loginData?.email}
                        onChange={handleChange}
                        placeholder="Your email"
                        required
                    />
                </div>

                <div className="relative w-full">
                    <label htmlFor="">Password</label>
                    <InputField
                        name="password"
                        type={showPassword ? "text" : "password"}
                        value={loginData?.password}
                        onChange={handleChange}
                        placeholder="Password"
                        required
                    />
                    <button
                        type="button"
                        onClick={toggleShowPassword}
                        className="absolute right-3 top-2/3 transform -translate-y-1/2 text-gray-400 hover:text-white"
                    >
                        {showPassword ? <EyeIcon className="size-6" /> : <EyeClosedIcon className="size-6" />}
                    </button>
                </div>

                <GlowButton
                    className="w-full"
                >
                    Sign In
                </GlowButton>
            </form>
            <section className="flex flex-col items-center justify-center max-w-sm w-sm px-6 mt-5 gap-6">
                <SeparatorWithText text="Or" className="w-full" />

                <button className="relative flex w-full items-center justify-center gap-4
                 bg-gray-700/30 hover:bg-gray-700/70 text-white 
                 border  border-gray-700/50
                 rounded-md px-6 py-3 group cursor-pointer 
                 transition-colors duration-500 ease-in-out"
                    onClick={() => handleSignInWithGoogle()}
                >
                    <GoogleIcon className="size-5" />
                    Continue with Google
                </button>
                {error && <p className="text-red-500 mt-2">{error}</p>}
            </section>

        </section>
    );
}

export default LoginForm;