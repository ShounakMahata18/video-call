import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: false,
        select: false
    },
    avatar: {
        type: String
    },
    provider: {
        type: String,
        enum: ["local", "google", "facebook", "linkedin"],
        default: "local"
    },
    googleId: {
        type: String
    },
    facebookId: {
        type: String
    },
    linkedinId: {
        type: String
    },
    isVerified: {
        type: Boolean,
        default: false
    },
    resetpasswordToken: {
        type: String,
        select: false
    },
    resetPasswordExpires: {
        type: Date,
        select: false
    },
    lastLogin: {
        type: Date
    }
}, { timestamps: true });

const User = mongoose.model("User", userSchema);

export default User;