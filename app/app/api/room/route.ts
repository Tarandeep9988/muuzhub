import { prismaClient } from "@/lib/db";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession();
    if (!session?.user?.email) {
      return NextResponse.json({
        message: "Unauthenticated",
      }, {
        status: 401,
      });
    }

    const user = await prismaClient.user.findFirst({
      where: {
        email: session.user.email,
      }
    });

    if (!user) {
      return NextResponse.json({
        message: "Unauthenticated",
      }, {
        status: 401,
      });
    }
    
    const room = await prismaClient.room.create({
      data: {
        adminId: user.id,
      }
    });

    return NextResponse.json({
      message: "Room created successfully",
      room: room,
    }, {
      status: 201,
    });
    
  } catch (error) {
    return NextResponse.json({
      message: "Error creating room " + error,
    }, {
      status: 500,
    });
  }
}