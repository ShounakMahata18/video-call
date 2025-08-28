import express from "express";
import { activeRooms } from "../server.js";

const router = express.Router();

// helper: generate 6-char alphanumeric roomId
function generateRoomId(length = 6) {
    const chars =
        "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    let result = "";
    for (let i = 0; i < length; i++) {
        result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
}

// create a unique roomId
router.post("/create-room", (req, res) => {
    let roomId;
    do {
        roomId = generateRoomId(6); // 6-char ID
    } while (activeRooms.has(roomId)); // ensure it's not active already

    activeRooms.set(roomId, new Set());

    res.json({ roomId });
});

export default router;
