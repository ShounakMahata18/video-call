import mongoose from "mongoose";

const roomSchema = new mongoose.Schema({
    roomId: { 
        type: String, 
        unique: true, 
        required: true 
    },
    ownerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    participantId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        default: null,
    },
    active: {
        type: Boolean, 
        default: false 
    },
    createdAt: { 
        type: Date, 
        default: Date.now 
    },
    expiresAt: { 
        type: Date 
    },
});


export default mongoose.model("Room", roomSchema);