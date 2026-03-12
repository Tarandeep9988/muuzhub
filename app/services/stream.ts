import { prismaClient } from "@/lib/db";
import { Stream } from "@/prisma/generated/prisma/client";

export async function getStreamsQueue (roomId: string) : Promise<Stream[]> {
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

export async function getStream(roomId: string, streamId: string) : Promise<Stream> {

  const stream = await prismaClient.stream.findFirst({
    where: {
      id: streamId,
      roomId,
    }
  });

  if (!stream) {
    throw new Error("Error fetching stream from db");  
  }

  return stream;
}

export async function deleteStream(id: string) : Promise<Stream>{

  try {
    const deletedStream = await prismaClient.stream.delete({
      where: {
        id,
      }
    });

    if (!deletedStream) {
      throw new Error("Stream not found for deletion");
    }

    return deletedStream;
  } catch (error) {
    throw new Error("Error deleting stream from db");
  }
}