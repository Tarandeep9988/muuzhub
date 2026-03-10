import { getStream, getStreamsQueue } from "@/services/stream";
import { Server, Socket } from "socket.io";
import youtubeUrl from 'youtube-url';

export async function addStreamHandler(
  io: Server,
  socket: Socket,
  data: { streamUrl: string },
  callback: Function
) {
  try {
    const { roomId, userId } = socket.data;
    // Check if user is in a room
    if (!roomId || !userId) {
      throw new Error("User is not in a room")
    }
  
    // Check if valid streamUrl
    if (!youtubeUrl.valid(data.streamUrl)) {
      throw new Error("Invalid stream URL. Please provide a valid YouTube URL");
    }
  
    const stream = await getStream(userId, roomId);

    // broadcase to all users in same room
    const queue = await getStreamsQueue(roomId);
    io.to(roomId).emit("queueUpdated", queue);

    return callback({
      success: true,
      message: "Stream added successfully",
      stream,
    });
  } catch (error) {
    return callback({
      success: false,
      error:
        error instanceof Error
          ? error.message
          : "Internal server error while adding stream",
    });
  }
}
