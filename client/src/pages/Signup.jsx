import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import eyeOpen from "@/assets/icons/eye-open.svg";
import eyeClose from "@/assets/icons/eye-close.svg";

const apiUrl = import.meta.env.VITE_API_URL;

export default function SignupPage() {
    const [fullname, setFullname] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false); // toggle state
    const [showConfirmPassword, setShowConfirmPassword] = useState(false); // Confirm Password toggle state
    const [error, setError] = useState("");
    const navigate = useNavigate();

    const handleSignup = async (e) => {
        e.preventDefault();
        setError("");

        try {
            if(password !== confirmPassword){
                setError("Confirm Password mismatch");
                return;
            }

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
                    <h2 className="text-2xl text-white font-bold text-center">
                        Sign Up
                    </h2>

                    {error && (
                        <p className="text-red-500 text-center">{error}</p>
                    )}

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
                            <img
                                src={showPassword ? eyeOpen : eyeClose}
                                alt={
                                    showPassword
                                        ? "Hide password"
                                        : "Show password"
                                }
                                className="h-5 w-5 stroke-white"
                            />
                        </button>
                    </div>

                    {/*Confirm Password*/}
                    <div className="relative">
                        <input
                            type={setConfirmPassword ? "text" : "password"}
                            placeholder="Confirm Password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            className="p-2 pr-10 rounded bg-gray-700 text-white focus:outline-none w-full"
                            required
                        />
                        <button
                            type="button"
                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                            className="absolute inset-y-0 right-2 flex items-center text-gray-400 hover:text-white"
                        >
                            <img
                                src={showConfirmPassword ? eyeOpen : eyeClose}
                                alt={
                                    showConfirmPassword
                                        ? "Hide password"
                                        : "Show password"
                                }
                                className="h-5 w-5 stroke-white"
                            />
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
