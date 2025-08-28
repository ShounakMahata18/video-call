import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";

export default function Home() {
  const [roomId, setRoomId] = useState("");
  const navigate = useNavigate();

  const createRoom = async () => {
    try {
      const res = await fetch("http://192.168.0.107:5000/api/call/create-room", {
        method: "POST",
      });
      const data = await res.json();
      navigate(`/room/${data.roomId}`);
    } catch (error) {
      console.error(error);
    }
  };

  const joinRoom = () => {
    if (roomId.trim()) {
      navigate(`/room/${roomId}`);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />

      <div className="flex flex-col items-center justify-center flex-1 px-4">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-8 text-center">
          Video Calling App
        </h1>

        <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 w-full max-w-md">
          {/* Create Room Button */}
          <button
            onClick={createRoom}
            className="w-full sm:w-auto px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg shadow-md transition"
          >
            Create Room
          </button>

          {/* Join Room Section */}
          <div className="flex flex-col sm:flex-row gap-2 w-full">
            <button
              onClick={joinRoom}
              className="px-6 py-3 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-lg shadow-md transition w-full sm:w-auto"
            >
              Join Room
            </button>
            <input
              type="text"
              placeholder="Enter Room ID"
              value={roomId}
              onChange={(e) => setRoomId(e.target.value)}
              className="flex-1 border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
