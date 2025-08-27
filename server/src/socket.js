import { Server } from "socket.io";
import { registerSignalingHandlers } from "./services/signaling.service.js";

let io;

export const initSocket = (httpServer) => {
    io = new Server(httpServer, {
        cors: {
            methods: ["GET", "POST"],
            credentials: true,
        },
    });

    io.on("connection", (socket) => {
        console.log("Socket connected:", socket.id);
        registerSignalingHandlers(io, socket);
    });

    console.log("Socket initialized");
    return io;
};

export const getIO = () => io;
