import { Server as HTTPServer } from "http";
import { Server } from "socket.io";

let io: Server

export function initSocket(httpServer: HTTPServer) {
  io = new Server(httpServer, {
    cors: {
      origin: "*",
    }
  })

  io.on("connection", (socket) => {
    console.log("User connected: ", socket.id);

    socket.on('joinRoom', (roomId: string) => {
      socket.join(roomId);
      console.log(`User ${socket.id} joined room ${roomId}`);
    })

    socket.on("disconnect", () => {
      console.log("user disconnected: ", socket.id);  
    })
  })
  return io;
}

export function getIO() {
  return io;
}