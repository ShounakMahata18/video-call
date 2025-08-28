import { useParams } from "react-router-dom";

export default function ShareButton() {
    const { roomId } = useParams();

    const handleShare = async () => {
        const shareText = `Welcome to the Video Call

Join Link: https://video-call-shounak.onrender.com/

Room ID: *${roomId}*

Thank You from Shounak
Follow: https://www.linkedin.com/in/shounakmahata`;

        if (navigator.share) {
            try {
                navigator.clipboard.writeText(shareText);
                await navigator.share({
                    title: "Video Call Invite",
                    text: shareText,
                });
            } catch (error) {
                console.error("Error sharing:", error);
            }
        } else {
            // Fallback: copy to clipboard
            navigator.clipboard.writeText(shareText);
            alert("Invitation copied to clipboard!");
        }
    };

    return (
        <button
            onClick={handleShare}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
            Share Invite
        </button>
    );
}
