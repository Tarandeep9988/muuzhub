import { prismaClient } from "@/app/lib/db";
import { NextRequest, NextResponse } from "next/server";
import z from "zod";

const YT_REGEX = new RegExp(/^https:\/\/(www\.)?youtube\.com\/watch\?v=[A-Za-z0-9_-]{11}(&t=\d+s?)?$/);

const CreateStreamSchema = z.object({
  creatorId: z.string(),
  url: z.string(),
})

export async function POST(request : NextRequest) {
  try {
    const data = CreateStreamSchema.parse(await request.json());
    const isYt = YT_REGEX.test(data.url);
    
    if(!isYt) {
      return NextResponse.json({
        message: "Wrong url format",
      }, {
        status: 400,
      })
    }

    const extractedId = data.url.split("?v=")[-1];


    await prismaClient.stream.create({
      data: {
        userId: data.creatorId,
        url: data.url,
        extractedId,
        type: "Youtube"
      }
    })
  } catch (error) {
    return NextResponse.json({
      message: "Error while adding a stream"
    }, {
      status: 411,
    })
  }
}


export async function GET(request: NextRequest) {
  try {
    const creatorId = request.nextUrl.searchParams.get("creatorId");
    const streams = await prismaClient.stream.findMany({
      where: {
        userId: creatorId ?? "",
      }
    });
    return NextResponse.json({
      streams,
    })
  } catch (error) {
    return NextResponse.json({
      message: "Error while fetching streams"
    }, {
      status: 500,
    });
  }
}