import { Server, Socket } from "socket.io";
import youtubeUrl from 'youtube-url';
import { prismaClient } from "./db";

interface SocketWithRoom extends Socket {
  data: {
    roomId: string;
    userId: string;
  }
}

export function setupSocketHandlers(io: Server) {
  io.on("connection", (socket: SocketWithRoom) => {
    // console.log("New client connected: ", socket.id);

    socket.on("joinRoom", (data: { roomId: string; userId: string }, callback) => {
      console.log("Something is trying to join the room: ", data);
      socket.join(data.roomId);

      // after joining room send all existing streams in the room to the client
      prismaClient.stream.findMany({
        where: {
          roomId: data.roomId,
        },
        include: {
          user: true,
        }
      }).then((streams) => {
        socket.emit("initialStreams", { streams });
      }).catch((error) => {
        console.error("Error fetching initial streams for room:", error);
      });

      socket.data.roomId = data.roomId;
      socket.data.userId = data.userId;
      console.log(`User ${data.userId} joined room ${data.roomId}`);
      callback({ success: true, message: `Joined room ${data.roomId} successfully` });
    });

    socket.on("addStream", async (data: { streamUrl: string }, callback) => {
      const { roomId, userId } = socket.data;
      
      // Check if user is in a room
      if (!roomId || !userId) {
        return callback({
          success: false,
          error: "You must join a room first",
        });
      }
      
      // Check if valid streamUrl
      if (!youtubeUrl.valid(data.streamUrl)) {
        return callback({
          success: false,
          error: "Invalid stream URL. Please provide a valid YouTube URL.",
        });
      }
      console.log(`User ${userId} is adding stream to room ${roomId}: `, data.streamUrl);
      try {
        const stream = await prismaClient.stream.create({
          data: {
            userId,
            url: data.streamUrl,
            roomId,
          }
        });
        io.to(roomId).emit("streamAdded", {stream});
        console.log(`User ${userId} added stream ${stream.id} to room ${roomId}`);
        return callback({
          success: true,
          message: "Stream added successfully",
          stream,
        })
      } catch (error) {
        console.error("❌ Error adding stream:", error);
        return callback({
          success: false,
          error: error instanceof Error ? error.message : "Internal server error while adding stream",
        });
      }

    }); 

    socket.on("disconnect", () => {
      console.log("Client disconnected: ", socket.id);
    });
  });
}