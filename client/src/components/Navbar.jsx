import { useNavigate } from "react-router-dom";

export default function Navbar() {
    const navigate = useNavigate();
    const token = localStorage.getItem("jwtToken");

    const handleLogout = () => {
        localStorage.removeItem("jwtToken");
        navigate("/login");
    };

    return (
        <nav className="w-full bg-gray-900 text-white shadow-md px-6 py-4 flex justify-between items-center">
            {/* Left: Logo / Title */}
            <div className="text-xl font-bold cursor-pointer" onClick={() => navigate("/")}>
                VideoCall
            </div>

            {/* Right: Auth Buttons */}
            <div className="flex gap-4">
                {!token ? (
                    <>
                        <button
                            onClick={() => navigate("/login")}
                            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg transition"
                        >
                            Login
                        </button>
                        <button
                            onClick={() => navigate("/signup")}
                            className="px-4 py-2 bg-green-600 hover:bg-green-700 rounded-lg transition"
                        >
                            Sign Up
                        </button>
                    </>
                ) : (
                    <button
                        onClick={handleLogout}
                        className="px-4 py-2 bg-red-600 hover:bg-red-700 rounded-lg transition"
                    >
                        Logout
                    </button>
                )}
            </div>
        </nav>
    );
}
