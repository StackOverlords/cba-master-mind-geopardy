import { useState, type FormEvent } from "react";
import InputField from "../ui/inputField";
import EyeIcon from "../ui/icons/eyeIcon";
import EyeClosedIcon from "../ui/icons/eye-closedIcon";
import GlowButton from "../ui/glowButton";
import SeparatorWithText from "../ui/separatorWithText";
import GoogleIcon from "../ui/icons/googleIcon";
import AuthProviderButton from "../ui/authProviderButton";
import type { RegisterCredentials } from "../../shared/auth.types";
import { useAuthStore } from "../../stores/authStore";
import { useNavigate } from "react-router";
import SpinnerIcon from "../ui/icons/spinnerIcon";

const SignUpForm = () => {
    const { loginWithGoogle, register, isLoading } = useAuthStore()
    const navigate = useNavigate();
    const [error, setError] = useState<string | null>(null);
    const [loginData, setLoginData] = useState<RegisterCredentials>({
        email: '',
        name: '',
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
        try {
            setError(null);
            await loginWithGoogle()
            setTimeout(() => {
                navigate('/');
            }, 500);
        } catch (error) {
            setError('Error with Google sign in');
        }
    }

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        if (!loginData.email || !loginData.password || !loginData.name) {
            setError('Please fill in all fields');
            return;
        }
        try {
            await register(loginData)
            setError(null);
        } catch (error) {
            setError('Invalid email or password');
        }
    };

    return (
        <section className="flex flex-col items-center justify-center p-2">
            {/* <h2 className="text-2xl font-semibold">Hi, welcome back!</h2> */}
            <form className="mt-4 py-2 
            flex flex-col gap-4 
            items-center 
            sm:max-w-sm sm:w-sm w-auto text-xs sm:text-sm"
                action="" onSubmit={handleSubmit}>
                <div className="w-full">
                    <label htmlFor="email">Email</label>
                    <InputField
                        id="email"
                        name="email"
                        type="email"
                        value={loginData?.email}
                        onChange={handleChange}
                        placeholder="Your email"
                        required
                    />
                </div>

                <div className="w-full">
                    <label htmlFor="name">Name</label>
                    <InputField
                        id="name"
                        name="name"
                        type="text"
                        value={loginData?.name}
                        onChange={handleChange}
                        placeholder="Username"
                        required
                    />
                </div>

                <div className="relative w-full">
                    <label htmlFor="password">Password</label>
                    <InputField
                        id="password"
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
                    type="submit"
                    className="w-full"
                >
                    Sign Up
                </GlowButton>
                <p className="text-center">Already have an account?
                    <a
                        href="/auth/sign-in"
                        className="text-purple-400 hover:text-purple-300 transition-colors duration-300 ease-in-out"> Sign in</a>
                </p>
            </form>
            <section className="flex flex-col items-center justify-center sm:max-w-sm sm:w-sm w-full mt-5 gap-6">
                <SeparatorWithText text="Or" className="w-full" />

                <AuthProviderButton
                    onClick={() => handleSignInWithGoogle()}
                    disabled={isLoading}
                    className={`${isLoading ? 'opacity-70 cursor-not-allowed' : 'cursor-pointer'}`}
                >
                    {isLoading ? (
                        <SpinnerIcon className="size-4 animate-spin" />
                    ) : (
                        <GoogleIcon className="size-4" />
                    )}
                    Continue with Google
                </AuthProviderButton>

                {error && <p className="text-red-500 mt-2">{error}</p>}
            </section>

        </section>
    );
}

export default SignUpForm;