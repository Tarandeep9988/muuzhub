import { prismaClient } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest, {params}: {params: Promise<{roomId: string}>}) {
  try {
    const { roomId } = await params;
    const streams = await prismaClient.stream.findMany({
      where: {
        roomId,
      },
      orderBy: {
        createdAt: 'asc',
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