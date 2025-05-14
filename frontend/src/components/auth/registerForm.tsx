import { useState, type FormEvent } from "react";
import { signInWithGoogle, signUpWithEmailAndPassword } from "../../services/firebase";
import InputField from "../ui/inputField";
import EyeIcon from "../ui/icons/eyeIcon";
import EyeClosedIcon from "../ui/icons/eye-closedIcon";
import GlowButton from "../ui/glowButton";
import SeparatorWithText from "../ui/separatorWithText";
import GoogleIcon from "../ui/icons/googleIcon";
import type { SignUpCredentials } from "../../shared/types";
import { createUserApi } from "../../api/authApi";
import AuthProviderButton from "../ui/authProviderButton";

const SignUpForm = () => {
    const [error, setError] = useState<string | null>(null);
    const [loginData, setLoginData] = useState<SignUpCredentials>({
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
        const userResponse = await signInWithGoogle()
        if (userResponse) {
            setError(null)
            console.log(await createUserApi(userResponse))
        }
        else {
            setError('Error signIn with Google');
        }
    }

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setError(null);
        if (!loginData.email || !loginData.password || !loginData.name) {
            setError('Please fill in all fields');
            return;
        }
        try {
            const userResponse = await signUpWithEmailAndPassword(loginData);
            console.log(userResponse);
            setError(null);
        } catch (error) {
            setError('Invalid email or password');
        }
    };

    return (
        <section className="flex flex-col items-center justify-center p-2">
            {/* <h2 className="text-2xl font-semibold">Hi, welcome back!</h2> */}
            <form className="mt-4 px-4 py-2 
            flex flex-col gap-4 
            items-center 
            max-w-sm w-sm"
                action="" onSubmit={handleSubmit}>
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

                <div className="w-full">
                    <label htmlFor="">Name</label>
                    <InputField
                        name="name"
                        type="text"
                        value={loginData?.name}
                        onChange={handleChange}
                        placeholder="Username"
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
                    type="submit"
                    className="w-full"
                >
                    Sign Up
                </GlowButton>
                <p className="text-sm">Already have an account?
                    <a
                        href="/login"
                        className="text-purple-400 hover:text-purple-300 transition-colors duration-300 ease-in-out"> Sign in</a>
                </p>
            </form>
            <section className="flex flex-col items-center justify-center max-w-sm w-sm px-6 mt-5 gap-6">
                <SeparatorWithText text="Or" className="w-full" />

                <AuthProviderButton onClick={() => handleSignInWithGoogle()}>
                    <GoogleIcon className="size-5" />
                    Continue with Google
                </AuthProviderButton>

                {error && <p className="text-red-500 mt-2">{error}</p>}
            </section>

        </section>
    );
}

export default SignUpForm;