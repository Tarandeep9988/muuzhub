import { Server, Socket } from "socket.io";
import youtubeUrl from 'youtube-url';
import { prismaClient } from "./db";

interface SocketWithRoom extends Socket {
  data: {
    roomId: string;
    userId: string;
  }
}

const getQueue = async (roomId: string) => {
  const queue = await prismaClient.stream.findMany({
    where: {
      roomId,
    },
    orderBy: {
      createdAt: "asc",
    }
  });
  return queue;
}

export function setupSocketHandlers(io: Server) {

  const emitUpdatedQueue = async (roomId: string) => {
    const queue = await getQueue(roomId);
    io.to(roomId).emit("queueUpdated", queue);
  };

  io.on("connection", (socket: SocketWithRoom) => {
    // console.log("New client connected: ", socket.id);

    socket.on("joinRoom", async (data: { roomId: string; userId: string }, callback) => {
      // console.log("Something is trying to join the room: ", data);
      socket.data.roomId = data.roomId;
      socket.data.userId = data.userId;
      socket.join(data.roomId);

      // console.log(`User ${data.userId} joined room ${data.roomId}`);
      await emitUpdatedQueue(data.roomId);
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
      // console.log(`User ${userId} is adding stream to room ${roomId}: `, data.streamUrl);
      try {
        const stream = await prismaClient.stream.create({
          data: {
            userId,
            url: data.streamUrl,
            roomId,
          }
        });
        await emitUpdatedQueue(roomId);
        // console.log(`User ${userId} added stream ${stream.id} to room ${roomId}`);
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