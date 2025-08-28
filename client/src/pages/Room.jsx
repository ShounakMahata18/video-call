// Room.jsx
import { useEffect, useRef, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { io } from "socket.io-client";
import VideoPlayer from "../components/VideoPlayer";
import CopyUrlButton from "../components/CopyUrlButton";
import peer from "../services/peer";

const SOCKET_URL = "http://192.168.0.107:5000";

export default function Room() {
    const { roomId } = useParams();
    const navigate = useNavigate();
    const socketRef = useRef(null);
    const otherUserRef = useRef(null);
    const [localStream, setLocalStream] = useState(null);
    const [remoteStream, setRemoteStream] = useState(null);

    useEffect(() => {
        async function initLocalStream() {
            try {
                const stream = await navigator.mediaDevices.getUserMedia({
                    video: {
                        width: { min: 320, ideal: 640, max: 1280 },
                        height: { min: 240, ideal: 360, max: 720 },
                        frameRate: { ideal: 24, max: 30 },
                    },
                    audio: true,
                });
                setLocalStream(stream);
                peer.setLocalStream(stream);
            } catch (error) {
                console.error("Error accessing media devices:", error);
            }
        }

        initLocalStream();
    }, []);

    useEffect(() => {
        if (!localStream) return;

        socketRef.current = io(SOCKET_URL, { transports: ["websocket"] });

        peer.createNewPeerConnection();
        peer.setLocalStream(localStream);

        socketRef.current.on("connect", () => {
            socketRef.current.emit("join-room", { roomId });
        });

        socketRef.current.on("room-error", ({ message }) => {
            alert(message);
            navigate("/");
        });

        socketRef.current.on("user-joined", async ({ id }) => {
            otherUserRef.current = id;
            const offer = await peer.getOffer();
            socketRef.current.emit("offer", { to: id, offer });
        });

        socketRef.current.on("offer", async ({ from, offer }) => {
            otherUserRef.current = from;
            const answer = await peer.getAnswer(offer);
            socketRef.current.emit("answer", { to: from, answer });
        });

        socketRef.current.on("answer", async ({ answer }) => {
            await peer.setRemoteAnswer(answer);
        });

        peer.onIceCandidate = (candidate) => {
            if (otherUserRef.current) {
                socketRef.current.emit("ice-candidate", {
                    to: otherUserRef.current,
                    candidate,
                });
            }
        };

        socketRef.current.on("ice-candidate", async ({ candidate }) => {
            await peer.addIceCandidate(candidate);
        });

        peer.onTrack = (stream) => {
            setRemoteStream(stream);
        };

        socketRef.current.on("user-left", ({ id }) => {
            if (otherUserRef.current === id) {
                if (remoteStream)
                    remoteStream.getTracks().forEach((t) => t.stop());
                setRemoteStream(null);
                otherUserRef.current = null;
            }
        });

        return () => leaveRoom();
    }, [roomId, localStream]);

    const leaveRoom = () => {
        if (localStream) {
            localStream.getTracks().forEach((track) => track.stop());
            setLocalStream(null);
        }

        if (remoteStream) {
            remoteStream.getTracks().forEach((track) => track.stop());
            setRemoteStream(null);
        }

        if (peer && peer.peer) {
            peer.peer.close();
            peer.peer = null;
        }
        otherUserRef.current = null;

        if (socketRef.current) {
            socketRef.current.disconnect();
        }

        setTimeout(() => navigate("/"), 100);
    };

    return (
        <div className="h-screen w-screen bg-gradient-to-br from-gray-900 to-gray-800 flex flex-col items-center">
            {/* Header */}
            <div className="w-full flex justify-between items-center px-4 py-3 bg-gray-900 shadow-md">
                <h1 className="text-2xl font-bold text-white">
                    Room: {roomId}
                </h1>

                {/* Buttons Container */}
                <div className="flex gap-2">
                    <CopyUrlButton
                        url={`http://localhost:5173/room/${roomId}`}
                    />
                    <button
                        onClick={leaveRoom}
                        className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-lg shadow-md transition"
                    >
                        Leave Room
                    </button>
                </div>
            </div>

            {/* Video Container */}
            <div
                className={`flex flex-1 w-full max-h-[calc(100vh-64px)] p-4 gap-4 justify-center items-center ${
                    remoteStream
                        ? "flex-col md:flex-row"
                        : "justify-center items-center"
                }`}
            >
                {localStream && (
                    <VideoPlayer
                        stream={localStream}
                        muted
                        className={`bg-black rounded-xl shadow-lg ${
                            remoteStream
                                ? "w-[90%] md:w-1/2 h-auto"
                                : "w-full h-full object-contain"
                        }`}
                    />
                )}

                {remoteStream && (
                    <VideoPlayer
                        stream={remoteStream}
                        muted={false}
                        className="bg-black w-[90%] md:w-1/2 h-auto rounded-xl shadow-lg"
                    />
                )}
            </div>
        </div>
    );
}
