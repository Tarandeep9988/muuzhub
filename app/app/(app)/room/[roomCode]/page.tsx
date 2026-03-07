import { getServerSession } from "next-auth";
import RoomView from "./Components/roomView";
import { notFound, redirect } from "next/navigation";
import { prismaClient } from "@/lib/db";

export default async function RoomPage({ params }: { params: Promise<{ roomCode: string }> }) {
  const session = await getServerSession();

  // if not authenticated, redirect to home page
  if (!session?.user?.email) {
    return redirect("/");
  }
  const { roomCode } = await params;

  const user = await prismaClient.user.findFirst({
    where: {
      email: session.user.email,
    }
  });

  const room = await prismaClient.room.findFirst({
    where: {
      id: roomCode,
    }
  });

  if (!room) {
    console.log("Invalid room id");
    notFound();
    return;
  }


  return (
    <>
      <RoomView params={params}  />
    </>
  )
}
