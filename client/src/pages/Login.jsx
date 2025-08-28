import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function LoginPage() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        setError("");

        try {
            const res = await fetch("http://localhost:5000/api/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ username, password }),
            });

            const data = await res.json();

            if (!res.ok) {
                setError(data.message || "Login failed");
                return;
            }

            localStorage.setItem("jwtToken", data.token);
            navigate("/dashboard"); // redirect after login
        } catch (err) {
            setError("Server error");
            console.error(err);
        }
    };

    return (
        <div className="h-screen w-screen flex items-center justify-center bg-gray-900">
            <form
                onSubmit={handleLogin}
                className="bg-gray-800 p-8 rounded-lg shadow-lg w-96 flex flex-col gap-4"
            >
                <h2 className="text-2xl text-white font-bold text-center">Login</h2>

                {error && <p className="text-red-500 text-center">{error}</p>}

                <input
                    type="text"
                    placeholder="Username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="p-2 rounded bg-gray-700 text-white focus:outline-none"
                    required
                />
                <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="p-2 rounded bg-gray-700 text-white focus:outline-none"
                    required
                />

                <button
                    type="submit"
                    className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded transition"
                >
                    Login
                </button>

                <p className="text-gray-400 text-center">
                    Don't have an account?{" "}
                    <span
                        className="text-blue-400 hover:underline cursor-pointer"
                        onClick={() => navigate("/signup")}
                    >
                        Sign Up
                    </span>
                </p>
            </form>
        </div>
    );
}
