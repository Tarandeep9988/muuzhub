import { prismaClient } from "@/lib/db";
import { Upvote } from "@/prisma/generated/prisma/browser";

export async function createUpvote(streamId: string, userId: string) : Promise<Upvote> {
  try {
    const upvote = await prismaClient.upvote.create({
      data: {
        streamId,
        userId,
      }
    });
    if (!upvote) {
      throw new Error("Error creating upvote in db");
    }
    return upvote;
  } catch (error) {
    throw new Error("Error creating upvote in db");
  }
}
