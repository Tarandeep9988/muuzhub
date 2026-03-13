import {
  addStream,
  deleteStream,
  getStreamsQueue,
  setStreamActive,
  setStreamPlayed,
  upvoteStream,
} from "@/services/stream";
import { Server, Socket } from "socket.io";
import * as z from "zod";

const addStreamHandlerDataSchema = z.object({
  url: z.string(),
});

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
      throw new Error("User is not in a room");
    }

    const parsedData = await addStreamHandlerDataSchema.safeParse(data);
    if (!parsedData.success) {
      throw new Error("Invalid data for adding stream");
    }

    const stream = await addStream(parsedData.data.url, roomId, userId);

    await broadCastQueue(io, roomId);

    return callback({
      success: true,
      message: "Stream added successfully",
      stream,
    });
  } catch (error) {
    return callback({
      success: false,
      message:
        error instanceof Error
          ? error.message
          : "Internal server error while adding stream",
    });
  }
}

const deleteStreamHandlerDataSchema = z.object({
  id: z.string(),
});

export async function deleteStreamHandler(
  io: Server,
  socket: Socket,
  data: { id: string },
  callback: Function
) {
  try {
    const { roomId, userId } = socket.data;
    // Check if user is in a room
    if (!roomId || !userId) {
      throw new Error("User is not in a room");
    }

    const parsedData = await deleteStreamHandlerDataSchema.safeParse(data);
    if (!parsedData.success) {
      throw new Error("Invalid data for deleting stream");
    }

    const deletedStream = await deleteStream(parsedData.data.id);
    await broadCastQueue(io, roomId);

    return callback({
      success: true,
      message: "Stream deleted successfully",
      stream: deletedStream,
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

export async function nextStreamHandler(
  io: Server,
  socket: Socket,
  data: any,
  callback: Function
): Promise<void> {
  try {
    const { roomId, userId } = socket.data;
    // Check if user is in a room
    if (!roomId || !userId) {
      throw new Error("User is not in a room");
    }

    const queue = await getStreamsQueue(roomId);
    if (queue.length === 0) {
      return broadCastQueue(io, roomId);
    }

    const currentStream = queue[0];
    const nextStream = queue.length > 1 ? queue[1] : null;

    await setStreamActive(currentStream.id, false);
    await setStreamPlayed(currentStream.id, true);
    if (nextStream) {
      await setStreamActive(nextStream.id, true);
    }

    await broadCastQueue(io, roomId);

    return callback({
      success: true,
      message: "Moved to next stream successfully",
    });
  } catch (error) {
    return callback({
      success: false,
      message:
        error instanceof Error
          ? error.message
          : "Internal server error while fetching next stream",
    });
  }
}

const upvoteStreamHandlerDataSchema = z.object({
  streamId: z.string(),
});

export async function upvoteStreamHandler(
  io: Server,
  socket: Socket,
  data: any,
  callback: Function
) {
  try {
    const { roomId, userId } = socket.data;
    // Check if user is in a room
    if (!roomId || !userId) {
      throw new Error("User is not in a room");
    }
    
    const parsedData = await upvoteStreamHandlerDataSchema.safeParse(data); 
    if (!parsedData.success) {
      throw new Error("Invalid data for upvoting stream");
    }

    const { streamId } = parsedData.data;
    const stream = await upvoteStream(streamId, userId);

    await broadCastQueue(io, roomId);

    return callback({
      success: true,
      message: "Stream upvoted successfully",
      stream,
    });

    
  } catch (error) {
    return callback({
      success: false,
      message:
        error instanceof Error
          ? error.message
          : "Internal server error while fetching next stream",
    });
  }
}

export async function broadCastQueue(
  io: Server,
  roomId: string,
  socket?: Socket
) {
  try {
    const queue = await getStreamsQueue(roomId);
    if (socket) {
      socket.emit("queueUpdated", queue);
      return;
    }

    io.to(roomId).emit("queueUpdated", queue);
  } catch (error) {
    throw new Error(
      error instanceof Error
        ? error.message
        : "Internal server error while fetching next stream"
    );
  }
}
