import { Server, Socket } from "socket.io";

const addStreamHandler = async (
  io: Server,
  socket: Socket,
  data: { roomId: string; userId: string },
  callback: Function
) => {
  socket.data.roomId = data.roomId;
  socket.data.userId = data.userId;
  socket.join(data.roomId);
};
