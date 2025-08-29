import { useParams, useNavigate } from "react-router-dom";
import ShareButton from "../components/ShareButton";
import useRoom from "../hooks/useRoom";
import VideoLayout from "../components/VideoLayout";

export default function Room() {
  const { roomId } = useParams();
  const navigate = useNavigate();

  const { localStream, remoteStream, leaveRoom } = useRoom(roomId, (message) => {
    alert(message);
    navigate("/");
  });

  return (
    <div className="h-screen w-screen bg-gradient-to-br from-gray-900 to-gray-800 flex flex-col items-center">
      {/* Header */}
      <div className="w-full flex justify-between items-center px-4 py-3 bg-gray-900 shadow-md">
        <h1 className="text-2xl font-bold text-white">Room: {roomId}</h1>

        <div className="flex gap-2">
          <ShareButton roomId={roomId} />
          <button
            onClick={() => {
              leaveRoom();
              navigate("/");
            }}
            className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-lg shadow-md transition"
          >
            Leave Room
          </button>
        </div>
      </div>

      {/* Video Area */}
      <div className="flex flex-1 w-full h-[calc(100dvh-64px)] overflow-hidden">
        <VideoLayout localStream={localStream} remoteStream={remoteStream} />
      </div>
    </div>
  );
}
