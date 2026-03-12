import { isYoutubeUrlValid } from "@/lib/youtube";
import { addStream, deleteStream, getStreamsQueue } from "@/services/stream";
import { Server, Socket } from "socket.io";
import * as z from "zod";

const addStreamHandlerDataSchema = z.object({
  url: z.string(),
})

export async function addStreamHandler(
  io: Server,
  socket: Socket,
  data: { url: string },
  callback: Function
) {
  try {
    const { roomId, userId } = socket.data;
    // Check if user is in a room
    if (!roomId || !userId) {
      throw new Error("User is not in a room")
    }
  
    const parsedData = await addStreamHandlerDataSchema.safeParse(data);
    if (!parsedData.success) {
      throw new Error("Invalid data for adding stream");
    }

    const stream = await addStream(parsedData.data.url, roomId, userId);

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



const deleteStreamHandlerDataSchema = z.object({
  id: z.string(),
})

export async function deleteStreamHandler (
  io: Server,
  socket: Socket,
  data: { id: string },
  callback: Function
) {
  try {
    const { roomId, userId } = socket.data;
    // Check if user is in a room
    if (!roomId || !userId) {
      throw new Error("User is not in a room")
    }

    const parsedData = await deleteStreamHandlerDataSchema.safeParse(data);
    if (!parsedData.success) {
      throw new Error("Invalid data for deleting stream");
    }

    const deletedStream = await deleteStream(parsedData.data.id);

    return callback({
      success: true,
      message: "Stream deleted successfully",
      stream: deletedStream
    });
  } catch (error) {
    return callback({
      success: false,
      message:
        error instanceof Error
          ? error.message
          : "Internal server error while deleting stream",
    });
  }
}