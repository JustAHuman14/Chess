import express from "express";
import { Server } from "socket.io";
import { Chess } from "chess.js";
import http from "http";

const app = express();
const httpServer = http.createServer(app);
const io = new Server(httpServer);

app.use(express.static("public"));

io.on("connection", (socket) => {
    console.log(socket.id + " connected")
});

app.listen(3000, () => {
  console.log("Server is running in http://localhost:3000");
});
