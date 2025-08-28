import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";

const apiUrl = import.meta.env.VITE_API_URL;

export default function SignupPage() {
    const [fullname, setFullname] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false); // toggle state
    const [error, setError] = useState("");
    const navigate = useNavigate();

    const handleSignup = async (e) => {
        e.preventDefault();
        setError("");

        try {
            const res = await fetch(`${apiUrl}/api/auth/signup`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ fullname, email, password }),
            });

            const data = await res.json();

            if (!res.ok) {
                setError(data.message || "Signup failed");
                return;
            }

            navigate("/login"); // redirect after signup
        } catch (err) {
            setError("Server error");
            console.error(err);
        }
    };

    return (
        <div className="h-screen w-screen bg-gray-900 flex flex-col">
            {/* Navbar */}
            <Navbar />

            {/* Signup Form */}
            <div className="flex flex-1 items-center justify-center">
                <form
                    onSubmit={handleSignup}
                    className="bg-gray-800 p-8 rounded-lg shadow-lg w-96 flex flex-col gap-4"
                >
                    <h2 className="text-2xl text-white font-bold text-center">Sign Up</h2>

                    {error && <p className="text-red-500 text-center">{error}</p>}

                    <input
                        type="text"
                        placeholder="Full Name"
                        value={fullname}
                        onChange={(e) => setFullname(e.target.value)}
                        className="p-2 rounded bg-gray-700 text-white focus:outline-none"
                        required
                    />

                    <input
                        type="email"
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
                            {showPassword ? (
                                // Eye Open SVG
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none"
                                    viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                                        d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                                        d="M2.458 12C3.732 7.943 7.523 5 12 5c4.477 0 
                                        8.268 2.943 9.542 7-1.274 4.057-5.065 
                                        7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                </svg>
                            ) : (
                                // Eye Slash SVG
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none"
                                    viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                                        d="M13.875 18.825A10.05 10.05 0 0112 
                                        19c-4.478 0-8.269-2.943-9.543-7a9.956 
                                        9.956 0 012.164-3.368m2.734-2.528A9.956 
                                        9.956 0 0112 5c4.478 0 8.269 2.943 
                                        9.543 7a9.956 9.956 0 01-4.293 
                                        5.188M15 12a3 3 0 11-6 0 3 3 0 
                                        016 0z" />
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                                        d="M3 3l18 18" />
                                </svg>
                            )}
                        </button>
                    </div>

                    <button
                        type="submit"
                        className="bg-green-600 hover:bg-green-700 text-white font-semibold py-2 rounded transition"
                    >
                        Sign Up
                    </button>

                    <p className="text-gray-400 text-center">
                        Already have an account?{" "}
                        <span
                            className="text-blue-400 hover:underline cursor-pointer"
                            onClick={() => navigate("/login")}
                        >
                            Login
                        </span>
                    </p>
                </form>
            </div>
        </div>
    );
}
