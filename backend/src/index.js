import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";
import path from "path";

import { connectDB } from "./lib/db.js";

import authRoutes from "./routes/authRoutes.js";
import messageRoutes from "./routes/messageRoutes.js";
import {app, server} from "./lib/socket.js";



dotenv.config();



const port = process.env.PORT || 3003;
const __dirname = path.resolve();

app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ limit: "10mb", extended: true }));
app.use(cookieParser());
app.use(cors({
    origin: "http://localhost:5173",  // it can take string, array, or regex
    credentials: true,  // allow cookie to be sent
}));

app.use("/api/auth", authRoutes)
app.use("/api/messages", messageRoutes)

// if we are in production then go ahead and make the dist folder to be our static assets 
if(process.env.NODE_ENV==="production") {
    app.use(express.static(path.join(__dirname, "../frontend/dist")));

    // sending the frontend's index.html file for every route -> SPA Routing Fallback
    app.get("/{*splat}", (req, res) => {
        res.sendFile(path.join(__dirname, "../frontend", "dist", "index.html"));
    });
}

server.listen(port, () => {
    console.log(`Server is running on port ${port} `);
    connectDB();
})