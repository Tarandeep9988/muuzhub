import { prismaClient } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";
import z from "zod";
import youtubesearchapi from "youtube-search-api";
import youtubeUrl from 'youtube-url';

const CreateStreamSchema = z.object({
  creatorId: z.string(),
  url: z.string(),
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

    const extractedId = youtubeUrl.extractId(data.url) ?? "";

    const {title, thumbnail} = await youtubesearchapi.GetVideoDetails(extractedId);

    const thumbnails = getTwoBiggestThumbnail(thumbnail.thumbnails);
    const stream = await prismaClient.stream.create({
      data: {
        userId: data.creatorId,
        url: data.url,
        extractedId,
        title,
        smallImageUrl: thumbnails.smaller?.url ?? "",
        bigImageUrl: thumbnails.bigger?.url ?? "",
        type: "Youtube"
      }
    });

    return NextResponse.json({
      message: "Stream added successfully",
      id: stream.id,
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

function getTwoBiggestThumbnail(thumbnails: Array<{url: string, width: number, height: number}>) : any {
  if (thumbnails.length === 0) {
    return {
      smaller: null,
      bigger: null,
    }
  }
  if (thumbnails.length === 1) {
    return {
      smaller: thumbnails[0],
      bigger: thumbnails[0],
    }
  }
  
  const sortedThumbnails = thumbnails.sort((a, b) => (b.width * b.height) - (a.width * a.height));
  return {
    smaller: sortedThumbnails[1],
    bigger: sortedThumbnails[0],
  }
} 