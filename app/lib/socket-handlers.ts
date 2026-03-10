import { Server, Socket } from "socket.io";
import { addStreamHandler } from "@/handlers/stream";
import { joinRoomHandler } from "@/handlers/room";


export function setupSocketHandlers(io: Server) {
  io.on("connection", (socket: Socket) => {
    socket.on("joinRoom", async (data, callback) => {
      await joinRoomHandler(io, socket, data, callback);
    });

    socket.on("addStream", async (data, callback) => {
      await addStreamHandler(io, socket, data, callback);
    });

    socket.on("disconnect", () => {
      console.log("Client disconnected: ", socket.id);
    });
  });
}