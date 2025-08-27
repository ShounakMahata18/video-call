import { Routes, Route } from "react-router-dom";
import HomePage from "./pages/Home";
import RoomPage from "./pages/Room";

export default function App() {
  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<HomePage />}/>
        <Route path="/room/:roomId" element={<RoomPage />}/>
      </Routes>
    </div>
  );
}
