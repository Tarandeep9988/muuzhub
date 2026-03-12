import * as z from "zod";
import { Server, Socket } from "socket.io";
import { getStreamsQueue } from "@/services/stream";

const joinRoomHandlerDataSchema = z.object({
  roomId: z.string(),
  userId: z.string(),
})

export async function joinRoomHandler(
  io: Server,
  socket: Socket,
  data: any,
  callback: Function
) {
  try {
    const parsedData = await joinRoomHandlerDataSchema.safeParse(data);
    if (!parsedData.success) {
      throw new Error("Invalid data for joining room");
    }
    const {roomId, userId} = parsedData.data;
    socket.data.roomId = roomId;
    socket.data.userId = userId;
    socket.join(roomId);

    // Emiting updated queue to user
    const queue = await getStreamsQueue(roomId);
    socket.emit("queueUpdated", queue);

    return callback({
      success: true,
      message: "Joined room successfully",
    })
  } catch (error) {
    return callback({
      success: false,
      message: error instanceof Error ? error.message : "Internal server error while joining room",
    });
  }
}
