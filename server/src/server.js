import express from "express";
import "dotenv/config"
import { createServer } from "http"

import authRoutes from "./routes/auth.routes.js"
// import callRoutes from "./routes/call.routes.js"
import { connectDB } from "./lib/connction.js"
import { initSocket } from "./socket.js";

const app = express();
const port = process.env.PORT || 5000;

// middlewares
app.use(express.json());

// routes
app.use("/api/auth", authRoutes);
// app.use("/api/call", callRoutes);

// create a http server and attach socket.io
const httpServer = createServer(app);

// attach Socket.IO
initSocket(httpServer);

// create the server with the given port
httpServer.listen(port, () => {
    console.log(`server started at PORT:${port}`);
    connectDB();
});