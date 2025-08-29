/**
 * PeerService - Handles WebRTC PeerConnection
 * ----------------------------------------------------
 * Responsibilities:
 * - Create & manage RTCPeerConnection
 * - Attach local stream (camera + mic)
 * - Handle remote tracks (incoming video/audio)
 * - Handle ICE candidate gathering
 */

class PeerService {
    constructor() {
        this.peer = null;
        this.localStream = null;

        // Callbacks set externally (by useRoom.js)
        this.onIceCandidate = null;
        this.onRemoteStream = null;
    }

    /**
     * Initialize a new RTCPeerConnection
     * - Attaches existing local stream if available
     */
    createPeerConnection() {
        // Close any existing connection
        if (this.peer) {
            this.peer.close();
        }

        this.peer = new RTCPeerConnection({
            iceServers: [{ urls: "stun:stun.l.google.com:19302" }],
        });

        // When an ICE candidate is found → send it to the other peer
        this.peer.onicecandidate = (event) => {
            if (event.candidate && this.onIceCandidate) {
                this.onIceCandidate(event.candidate);
            }
        };

        // When remote tracks are received → pass them to app
        this.peer.ontrack = (event) => {
            if (this.onRemoteStream) {
                // Typically event.streams[0] is the full MediaStream
                this.onRemoteStream(event.streams[0]);
            }
        };

        // Re-add local tracks if already available
        if (this.localStream) {
            this.localStream.getTracks().forEach((track) => {
                this.peer.addTrack(track, this.localStream);
            });
        }
    }

    /**
     * Attach local camera/mic stream to PeerConnection
     */
    setLocalStream(stream) {
        if (!stream) {
            console.error("setLocalStream called with null/undefined stream");
            return;
        }
        this.localStream = stream;

        if (!this.peer) {
            console.error("PeerConnection not created yet");
            return;
        }

        stream.getTracks().forEach((track) => {
            this.peer.addTrack(track, stream);
        });
    }

    /**
     * Create an SDP offer
     */
    async createOffer() {
        const offer = await this.peer.createOffer();
        await this.peer.setLocalDescription(offer);
        return offer;
    }

    /**
     * Create an SDP answer after receiving an offer
     */
    async createAnswer(offer) {
        await this.peer.setRemoteDescription(offer);
        const answer = await this.peer.createAnswer();
        await this.peer.setLocalDescription(answer);
        return answer;
    }

    /**
     * Apply remote SDP answer
     */
    async setRemoteAnswer(answer) {
        await this.peer.setRemoteDescription(answer);
    }

    /**
     * Add ICE candidate from the other peer
     */
    async addIceCandidate(candidate) {
        try {
            await this.peer.addIceCandidate(candidate);
        } catch (err) {
            console.error("❌ Failed to add ICE candidate:", err);
        }
    }

    /**
     * Close connection and reset state
     */
    closeConnection() {
        if (this.peer) {
            this.peer.onicecandidate = null;
            this.peer.ontrack = null;
            this.peer.close();
            this.peer = null;
        }
    }
}

// Export a single instance (singleton pattern)
export default new PeerService();
