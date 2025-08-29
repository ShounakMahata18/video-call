import React, { useState, useEffect } from "react";
import VideoPlayer from "./VideoPlayer";

export default function VideoLayout({ localStream, remoteStream }) {
    const [localOrientation, setLocalOrientation] = useState(null);
    const [remoteOrientation, setRemoteOrientation] = useState(null);
    const [isRemoteEnlarged, setIsRemoteEnlarged] = useState(false);

    // Detect orientation from MediaStream
    const detectOrientation = (stream, setOrientation) => {
        if (!stream) return;
        const track = stream.getVideoTracks()[0];
        if (track) {
            const { width, height } = track.getSettings();
            if (width && height) {
                setOrientation(height > width ? "vertical" : "horizontal");
            }
        }
    };

    useEffect(() => {
        detectOrientation(localStream, setLocalOrientation);
    }, [localStream]);

    useEffect(() => {
        detectOrientation(remoteStream, setRemoteOrientation);
    }, [remoteStream]);

    // 🔑 Decide layout classes dynamically
    const getClasses = (who) => {
        const orientation =
            who === "local" ? localOrientation : remoteOrientation;
        const other = who === "local" ? remoteOrientation : localOrientation;

        // If enlarge is active → remote dominates
        if (who === "remote" && isRemoteEnlarged) return "flex-[2]";
        if (who === "local" && isRemoteEnlarged) return "flex-[1]";

        // Only one stream → full space
        if (!other) return "flex-1";

        // Both same orientation → equal space
        if (orientation && orientation === other) return "flex-1";

        // One vertical, one horizontal → vertical bigger
        if (orientation === "vertical") return "basis-2/3 md:flex-[2]";
        if (orientation === "horizontal") return "basis-1/3 md:flex-[1]";

        return "flex-1";
    };

    return (
        <div className="flex flex-col md:flex-row w-full h-full gap-2 p-2 md:p-4">
            {/* Local */}
            {localStream && (
                <div
                    className={`flex items-center justify-center rounded-2xl overflow-hidden bg-gray-900 
            ${getClasses("local")} transition-all duration-500 ease-in-out`}
                >
                    <VideoPlayer
                        stream={localStream}
                        muted
                        className="w-full h-full object-contain"
                    />
                </div>
            )}

            {/* Remote */}
            {remoteStream && (
                <div
                    className={`relative flex items-center justify-center rounded-2xl overflow-hidden bg-gray-900 
            ${getClasses("remote")} transition-all duration-500 ease-in-out`}
                >
                    <VideoPlayer
                        stream={remoteStream}
                        muted={false}
                        className={`w-full h-full object-contain transition-transform duration-500 ease-in-out ${
                            isRemoteEnlarged
                                ? "scale-110 md:scale-125"
                                : "scale-100"
                        }`}
                    />

                    {/* Enlarge Button */}
                    <button
                        onClick={() => setIsRemoteEnlarged((prev) => !prev)}
                        className="absolute bottom-2 right-2 bg-black/60 hover:bg-black/80 text-white p-2 rounded-full shadow-lg transition"
                    >
                        {isRemoteEnlarged ? (
                            // Minimize SVG
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="w-4 h-4"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                                strokeWidth={2}
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="M4 10h6V4M4 4l6 6m10 4h-6v6m6 0l-6-6"
                                />
                            </svg>
                        ) : (
                            // Maximize SVG
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="w-4 h-4"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                                strokeWidth={2}
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="M4 8V4h4M4 4l6 6m10 6v4h-4m4 0l-6-6"
                                />
                            </svg>
                        )}
                    </button>
                </div>
            )}
        </div>
    );
}
