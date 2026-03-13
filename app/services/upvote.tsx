import { prismaClient } from "@/lib/db";
import { Upvote } from "@/prisma/generated/prisma/client";

export async function createUpvote(streamId: string, userId: string): Promise<Upvote> {
  return prismaClient.$transaction(async (tx) => {
    const target = await tx.stream.findFirst({
      where: {
        id: streamId,
        played: false,
        room: { isActive: true },
      },
      select: { roomId: true },
    });

    if (!target) {
      throw new Error("Stream is not votable");
    }

    // Optional: toggle off when clicking same stream again
    const same = await tx.upvote.findUnique({
      where: { userId_streamId: { userId, streamId } },
    });

    if (same) {
      await tx.upvote.delete({ where: { id: same.id } });
      return same;
    }

    // Remove previous upvote(s) by this user in the same room
    await tx.upvote.deleteMany({
      where: {
        userId,
        stream: {
          roomId: target.roomId,
          id: { not: streamId },
          played: false,
        },
      },
    });

    return tx.upvote.create({
      data: { streamId, userId },
    });
  });
}