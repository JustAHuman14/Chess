import express from "express";
import { Server } from "socket.io";
import { Chess } from "chess.js";
import http from "http";

const app = express();
const httpServer = http.createServer(app);
const io = new Server(httpServer, {
  serveClient: true,
});
const chess = new Chess();
let players = {};

app.use(express.static("public"));

io.on("connection", (socket) => {
  if (!players.white) {
    players.white = socket.id;
    socket.emit("playerRole", "w");
    socket.emit("status", "finding");
  } else if (!players.black) {
    players.black = socket.id;
    socket.emit("playerRole", "b");
    io.emit("status", "connected");
  } else {
    socket.emit("playerRole", "spectator");
    socket.emit("status", "spectating");
  }

  socket.on("move", (move) => {
    try {
      chess.move(move);
      io.emit("move", move);
    } catch (err) {
      return;
    }
  });

  socket.emit("boardState", chess.fen());

  socket.on("disconnect", () => {
    let winner;
    if (socket.id === players.white) {
      delete players.white;
      winner = "b";
    } else if (socket.id === players.black) {
      delete players.black;
      winner = "w";
    } else {
      return;
    }

    if (winner) {
      io.emit("playerLeft", winner);
      chess.reset();
    }
  });
});

httpServer.listen(3000, () => {
  console.log("Server is running in http://localhost:3000");
});
