import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import eyeOpen from "@/assets/icons/eye-open.svg";
import eyeClose from "@/assets/icons/eye-close.svg";

import { useDispatch, useSelector } from "react-redux";
import { setCredentials, selectCurrentToken } from "../features/auth/authSlice";
import { useLoginMutation } from "../features/auth/authApiSlice";

const apiUrl = import.meta.env.BASE_URL;

export default function LoginPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false); // eye toggle state
    const [error, setError] = useState("");
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const [login, { isLoading }] = useLoginMutation();

    const handleLogin = async (e) => {
        e.preventDefault(); 
        setError("");

        try {
            const res = await login({ email, password }).unwrap();
            dispatch(setCredentials({ ...res, email }));
            setEmail('');
            setPassword('');

            navigate("/");
        } catch (err) {
            if (!err?.response) {
                setError("No server response");
            } else if (err.response?.status === 400) {
                setError("Missing email or password");
            } else if (err.response?.status === 401) {
                setError("Unauthorized");
            } else {
                setError("Login Failed");
            }
        }
    };

    return (
        <div className="min-h-screen flex flex-col bg-gray-900">
            {/* Navbar stays at the top */}
            <Navbar />

            {/* form is centered in the remaining space */}
            <div className="flex flex-1 items-center justify-center">
                <form
                    onSubmit={handleLogin}
                    className="bg-gray-800 p-8 rounded-lg shadow-lg w-96 flex flex-col gap-4"
                >
                    <h2 className="text-2xl text-white font-bold text-center">
                        Login
                    </h2>

                    {error && (
                        <p className="text-red-500 text-center">{error}</p>
                    )}

                    <input
                        type="text"
                        placeholder="Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="p-2 rounded bg-gray-700 text-white focus:outline-none"
                        required
                    />

                    {/* Password with eye button */}
                    <div className="relative">
                        <input
                            type={showPassword ? "text" : "password"}
                            placeholder="Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="p-2 pr-10 rounded bg-gray-700 text-white focus:outline-none w-full"
                            required
                        />
                        <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute inset-y-0 right-2 flex items-center text-gray-400 hover:text-white"
                        >
                            <img
                                src={showPassword ? eyeOpen : eyeClose}
                                alt={
                                    showPassword
                                        ? "Hide password"
                                        : "Show password"
                                }
                                className="h-5 w-5"
                            />
                        </button>
                    </div>

                    <button
                        type="submit"
                        className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded transition"
                    >
                        Login
                    </button>

                    <p className="text-gray-400 text-center">
                        Don&apos;t have an account?{" "}
                        <span
                            className="text-blue-400 hover:underline cursor-pointer"
                            onClick={() => navigate("/signup")}
                        >
                            Sign Up
                        </span>
                    </p>
                </form>
            </div>
        </div>
    );
}
