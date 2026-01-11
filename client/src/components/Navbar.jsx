import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { selectCurrentToken, logOut } from "../features/auth/authSlice"

import { useLogoutMutation } from "../features/auth/authApiSlice";

export default function Navbar() {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const token = useSelector(selectCurrentToken);
    const [logoutApi] = useLogoutMutation();

    const handleLogout = async () => {
        try {
            await logoutApi().unwrap();
        } catch (err) {
            console.error("Logout API failed", err);
        } finally {
            dispatch(logOut());
            navigate("/");
        }
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
