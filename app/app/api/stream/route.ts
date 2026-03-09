import { prismaClient } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";
import z from "zod";
import youtubeUrl from 'youtube-url';

const CreateStreamSchema = z.object({
  adminId: z.string(),
  url: z.string(),
  roomId: z.string(),
})

export async function POST(request : NextRequest) {
  try {
    const data = CreateStreamSchema.parse(await request.json());
    const isYt = youtubeUrl.valid(data.url);

    if(!isYt) {
      return NextResponse.json({
        message: "Wrong url format",
      }, {
        status: 400,
      })
    }

    const stream = await prismaClient.stream.create({
      data: {
        userId: data.adminId,
        url: data.url,
        roomId: data.roomId,
      }
    });


    return NextResponse.json({
      message: "Stream added successfully",
      stream,
    }, {
      status: 201,
    })

  } catch (error) {
    return NextResponse.json({
      message: "Error while adding a stream"
    }, {
      status: 411,
    })
  }
}
