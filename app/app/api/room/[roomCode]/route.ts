import { prismaClient } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

type Params = {
  params: Promise<{ roomCode: string}>
}

export async function GET(request: NextRequest, { params }: Params) {
  try {
    const { roomCode } = await params;
    const room = await prismaClient.room.findFirst({
      where: {
        id: roomCode,
      }
    });

    if (!room) {
      return NextResponse.json({
        message: "Room not found",
      }, {
        status: 404,
      });
    }
    
    return NextResponse.json({
      message: "Room found",
      room: room,
    });
  } catch (error) {
    return NextResponse.json({
      message: "An error occurred",
    }, {
      status: 500,
    });
  }
}