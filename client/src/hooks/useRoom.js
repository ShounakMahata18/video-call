import { useEffect, useRef, useState } from "react";
import { io } from "socket.io-client";
import peer from "../services/peer";

const apiUrl = import.meta.env.VITE_BACKEND_BASE_URL;

/**
 * useRoom Hook
 * ----------------------------------------------------
 * Responsibilities:
 * - Handle local/remote media streams
 * - Manage socket.io connection for signaling
 * - Drive WebRTC offer/answer exchange
 * - Cleanup on exit
 *
 * @param {string} roomId - The ID of the current room
 * @param {function} onRoomError - Callback if joining the room fails
 * @returns {object} { localStream, remoteStream, leaveRoom }
 */
export default function useRoom(roomId, onRoomError) {
    const socketRef = useRef(null);
    const otherUserRef = useRef(null);

    const [localStream, setLocalStream] = useState(null);
    const [remoteStream, setRemoteStream] = useState(null);

    useEffect(() => {
        let isMounted = true;

        async function joinRoom() {
            try {
                /** STEP 1: Get local camera + mic */
                const stream = await navigator.mediaDevices.getUserMedia({
                    video: {
                        width: { ideal: 640, max: 640 },
                        height: { ideal: 360, max: 360 },
                        frameRate: { ideal: 20, max: 24 },
                    },
                    audio: {
                        echoCancellation: true,
                        noiseSuppression: true,
                        autoGainControl: true,
                        channelCount: 1,
                        sampleRate: 48000,
                        sampleSize: 24,
                    },
                });

                if (!isMounted) return;

                setLocalStream(stream);

                /** STEP 2: Initialize PeerConnection */
                peer.createPeerConnection();
                peer.setLocalStream(stream);

                // Handle ICE candidates
                peer.onIceCandidate = (candidate) => {
                    if (otherUserRef.current) {
                        socketRef.current.emit("ice-candidate", {
                            to: otherUserRef.current,
                            candidate,
                        });
                    }
                };

                // Handle remote stream
                peer.onRemoteStream = (remote) => {
                    setRemoteStream(remote);
                };

                /** STEP 3: Connect to signaling server */
                socketRef.current = io(apiUrl, { transports: ["websocket"] });

                socketRef.current.on("connect", () => {
                    socketRef.current.emit("join-room", { roomId });
                });

                /** STEP 4: Signaling Events */
                socketRef.current.on("room-error", ({ message }) => {
                    onRoomError?.(message);
                });

                // New user joined → send offer
                socketRef.current.on("user-joined", async ({ id }) => {
                    otherUserRef.current = id;
                    const offer = await peer.createOffer();
                    socketRef.current.emit("offer", { to: id, offer });
                });

                // Received an offer → send answer
                socketRef.current.on("offer", async ({ from, offer }) => {
                    otherUserRef.current = from;
                    const answer = await peer.createAnswer(offer);
                    socketRef.current.emit("answer", { to: from, answer });
                });

                // Received answer → set remote description
                socketRef.current.on("answer", async ({ answer }) => {
                    await peer.setRemoteAnswer(answer);
                });

                // Received ICE candidate from remote peer
                socketRef.current.on("ice-candidate", async ({ candidate }) => {
                    await peer.addIceCandidate(candidate);
                });

                // Remote peer left
                socketRef.current.on("user-left", ({ id }) => {
                    if (otherUserRef.current === id) {
                        if (remoteStream) {
                            remoteStream.getTracks().forEach((t) => t.stop());
                        }
                        setRemoteStream(null);
                        otherUserRef.current = null;
                    }
                });
            } catch (err) {
                console.error("Error initializing room:", err);
                onRoomError?.("Could not access camera/microphone");
            }
        }

        joinRoom();

        /** Cleanup on unmount */
        return () => {
            isMounted = false;
            leaveRoom();
        };

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [roomId]);

    /**
     * Leave room:
     * - Stop streams
     * - Close PeerConnection
     * - Disconnect socket
     */
    const leaveRoom = () => {
        try {
            // 1. Stop all local stream tracks (turns off camera/mic)
            if (localStream) {
                localStream.getTracks().forEach((track) => track.stop());
            }

            // 2. Stop all remote stream tracks (cleanup remote video)
            if (remoteStream) {
                remoteStream.getTracks().forEach((track) => track.stop());
            }

            // 3. Close peer connection
            peer.closeConnection();

            // 4. Disconnect socket
            if (socketRef.current) {
                socketRef.current.disconnect();
                socketRef.current = null;
            }

            // 5. Reset state
            setLocalStream(null);
            setRemoteStream(null);
            otherUserRef.current = null;
        } catch (err) {
            console.error("Error leaving room:", err);
        }
    };

    return { localStream, remoteStream, leaveRoom };
}
