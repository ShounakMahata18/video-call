import { setUidAndSocketId } from "../lib/socket-state.js";

export const registerSignalingHandlers = (io, socket) => {
    socket.on("room:join", (data) => {
        const {uid, room} = data;
        setUidAndSocketId(uid, socket.id);
        io.to(room).emit("user:joined", { uid, id: socket.id });    
        socket.join(room);
        io.to(socket.id).emit("room:join", data);
    });

    socket.on("user:call", ({ to, offer}) => {
        io.to(to).emit("incomming:call", { from: socket.id, offer});
    });

    socket.on("user:call", ({ to, offer}) => {
        io.to(to).emit("accepted:call", { from: socket.id, offer});
    });
};
