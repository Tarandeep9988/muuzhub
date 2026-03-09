import { Server, Socket } from "socket.io";

export function setupSocketHandlers(io: Server) {
  io.on("connection", (socket: Socket) => {
    console.log("New client connected: ", socket.id);

    socket.on("joinRoom", (roomId: string) => {
      console.log(`Client ${socket.id} joining room: ${roomId}`);
      socket.join(roomId);
    });

    socket.on("disconnect", () => {
      console.log("Client disconnected: ", socket.id);
    });
  });
}