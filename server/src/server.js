import express from "express";
import "dotenv/config";
import { createServer } from "http";
import cors from "cors";

import authRoutes from "./routes/auth.routes.js";
import callRoutes from "./routes/call.routes.js";
import { connectDB } from "./lib/connction.js";
import { initSocket } from "./socket.js";

const app = express();
const PORT = process.env.PORT || 5000;

// middlewares
app.use(express.json());
app.use(
    cors({
        origin: process.env.CLIENT_URL,
        methods: ["GET", "POST"],
        credentials: true,
    }),
);

// all rooms
export const activeRooms = new Map();

// trigger route to prevent render from sleeping
app.get("/api/trigger", (_, res) => {
    res.json({ status: "OK", service: "running" });
});

// routes
app.use("/api/auth", authRoutes);
app.use("/api/call", callRoutes);

// create a http server and attach socket.io
const httpServer = createServer(app);

// attach Socket.IO
initSocket(httpServer);

// create the server with the given port
httpServer.listen(PORT, () => {
    console.log(`server started at PORT:${PORT}`);
    connectDB();
});
