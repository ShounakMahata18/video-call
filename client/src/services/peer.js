class PeerService {
    constructor() {
        this.peer = null;
        this.onIceCandidate = null;
        this.onTrack = null;
    }

    createNewPeerConnection() {
        if (this.peer) this.peer.close();
        this.peer = new RTCPeerConnection({
            iceServers: [{ urls: "stun:stun.l.google.com:19302" }],
        });

        this.peer.onicecandidate = (event) => {
            if (event.candidate && this.onIceCandidate)
                this.onIceCandidate(event.candidate);
        };

        this.peer.ontrack = (event) => {
            if (this.onTrack) this.onTrack(event.streams[0]);
        };
    }

    // Add this method to handle the local stream
    setLocalStream(stream) {
        if (!stream) {
            console.error("No stream available");
            return;
        }
        if (!this.peer) {
            console.error("PeerConnection not initialized yet");
            return;
        }
        stream.getTracks().forEach((track) => {
            this.peer.addTrack(track, stream);
        });
    }

    async getOffer() {
        const offer = await this.peer.createOffer();
        await this.peer.setLocalDescription(offer);
        return offer;
    }

    async getAnswer(offer) {
        await this.peer.setRemoteDescription(offer);
        const answer = await this.peer.createAnswer();
        await this.peer.setLocalDescription(answer);
        return answer;
    }

    async setRemoteAnswer(answer) {
        await this.peer.setRemoteDescription(answer);
    }

    async addIceCandidate(candidate) {
        await this.peer.addIceCandidate(candidate);
    }
}

// Export a single instance
export default new PeerService();
