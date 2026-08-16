import { Server } from "socket.io";
import http from "http";
import express from "express";

const app = express();
const server = http.createServer(app);

// create socket.io server
const io = new Server(server, {
    cors: {
        origin: ["http://localhost:5173"]
    }
});

// helper function that we are using in the messageController
export function getReceiverSocketId(userId) {
    return userSocketMap[userId];
}

// used to store online users
const userSocketMap = {}; // {userId: socketId}


// here listening for any incoming connection...
io.on("connection", (socket) => {
    console.log("A user connected", socket.id);

    // here getting user id and setting it to the userSocketMap with socket id (key-value pair)
    const userId = socket.handshake.query.userId;
    if (userId) userSocketMap[userId] = socket.id;

    // io.emit() is used to send events to all the connected clients
    io.emit("getOnlineUsers", Object.keys(userSocketMap));

    socket.on("disconnect", () => {
        console.log("A user disconnect", socket.id);
        delete userSocketMap[userId];
        io.emit("getOnlineUsers", Object.keys(userSocketMap));
    }); 
});

export {app, server, io};