import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Room from "./pages/Room";
import SignupPage from "./pages/Signup";
import LoginPage from "./pages/Login";

export default function App() {
    return (
        <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/signup" element={<SignupPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/room/:roomId" element={<Room />} />
        </Routes>
    );
}
