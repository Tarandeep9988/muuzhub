import { prismaClient } from "@/lib/db";
import { getYoutubeVideoId, getYoutubeVideoDetails } from "@/lib/youtube";
import { Stream } from "@/prisma/generated/prisma/client";

export async function getStreamsQueue (roomId: string) : Promise<Stream[]> { 
  try {
    const queue = await prismaClient.stream.findMany({
      where: {
        roomId,
        played: false,
      },
      orderBy: [
        {
          active: "desc",
        },
        {
          createdAt: "asc",
        }
      ]
    });
    if (queue.length > 0 && queue[0].active === false) {
      await setStreamActive(queue[0].id, true);
      return await getStreamsQueue(roomId);
    }
    return queue;
  } catch (error) {
    throw new Error("Error fetching streams queue from db.");
  }
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

export async function setStreamActive(streamId: string, active: boolean) : Promise<Stream> {
  try {
    const updatedStream = await prismaClient.stream.update({
      where: {
        id: streamId,
      }, 
      data: {
        active,
      }
    });
    if(!updatedStream) {
      throw new Error("Stream not found for updating active status");
    }
    return updatedStream;
  } catch (error) {
    throw new Error("Error setting stream active in db");
  }
}

export async function setStreamPlayed(streamId: string, played: boolean) : Promise<Stream> {
  try {
    const updatedStream = await prismaClient.stream.update({
      where: {
        id: streamId,
      }, 
      data: {
        played,
      }
    });
    if (!updatedStream) {
      throw new Error("Stream not found for updating played status");
    }
    return updatedStream;
  } catch (error) {
    throw new Error("Error setting stream played in db");
  }
}


export async function addStream(url : string, roomId: string, userId: string) : Promise<Stream> {
  try {
    const videoId = getYoutubeVideoId(url);
    const videoInfo = await getYoutubeVideoDetails(videoId);

    const newStream = await prismaClient.stream.create({
      data: {
        url,
        roomId,
        userId,
        videoId,
        title: videoInfo.title,
        duration: videoInfo.duration,
        thumbnailUrlHQ: videoInfo.thumbnailUrlHQ,
        thumbnailUrlLQ: videoInfo.thumbnailUrlLQ,
      }
    });

    if (!newStream) {
      throw new Error("Error adding stream to db");
    }
    
    return newStream;
  } catch (error) {
    throw new Error("Error adding stream to db");
  }
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