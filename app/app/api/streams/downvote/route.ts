import { prismaClient } from "@/lib/db";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import z from "zod";

const DownvoteSchema = z.object({
  streamId: z.string(),
})

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession();
    const user = await prismaClient.user.findFirst({
      where: {
        email: session?.user?.email ?? "",
      }
    });
    
    if (!user) {
      return NextResponse.json({
        message: "Unauthenticated",
      }, {
        status: 401,
      });
    }

    const data = DownvoteSchema.parse(await request.json());
    prismaClient.upvotes.delete({
        where: {
          userId_streamId: {
            userId: user.id,
            streamId: data.streamId,
          }
        }
    });

  } catch (error) {
    return NextResponse.json({
      message: "Error while upvoting"
    }, {
      status: 500,
    })
  }
}