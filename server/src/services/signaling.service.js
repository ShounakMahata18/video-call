import { activeRooms } from "../server.js";

export const registerSignalingHandlers = (io, socket) => {
    socket.on("join-room", ({ roomId }) => {
        if (!activeRooms.has(roomId)) {
            activeRooms.set(roomId, new Set());
        }
        activeRooms.get(roomId).add(socket.id);

        socket.join(roomId);
        console.log(`User ${socket.id} joined room ${roomId}`);
        socket.to(roomId).emit("user-joined", { id: socket.id });
    });

    socket.on("offer", ({ to, offer }) => {
        io.to(to).emit("offer", { from: socket.id, offer });
    });

    socket.on("answer", ({ to, answer }) => {
        io.to(to).emit("answer", { from: socket.id, answer });
    });

    socket.on("ice-candidate", ({ to, candidate }) => {
        socket.to(to).emit("ice-candidate", { from: socket.id, candidate });
    });

    socket.on("disconnecting", () => {
        for (const roomId of socket.rooms) {
            if (activeRooms.has(roomId)) {
                // Notify other users in the room that this user is leaving
                socket.to(roomId).emit("user-left", { id: socket.id });

                // Remove this user from the room
                activeRooms.get(roomId).delete(socket.id);

                // Delete the room if empty
                if (activeRooms.get(roomId).size === 0) {
                    activeRooms.delete(roomId);
                    console.log(`Room ${roomId} deleted`);
                }
            }
        }
    });
};
