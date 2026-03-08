import { getServerSession } from "next-auth";
import { notFound, redirect } from "next/navigation";
import { prismaClient } from "@/lib/db";
import RoomView from "./Components/RoomView";


export default async function Page({ params }: { params: Promise<{ roomId: string }> }) {

  // check user is authenticated
  const session = await getServerSession();

  // if not authenticated, redirect to home page
  if (!session?.user?.email) {
    return redirect("/");
  }

  const user = await prismaClient.user.findFirst({
    where: {
      email: session.user.email,
    }
  });
  
  const { roomId } = await params;
  const room = await prismaClient.room.findFirst({
    where: {
      id: roomId,
    }
  });

  if (!room) {
    console.log("Room not found");
    notFound();
    return;
  }
  if (!user) {
    console.log("User not found");
    notFound();
    return;
  }
  // return <RoomPage room={room} user={user} />
  return <RoomView  params={params} user={user} room={room} />
}
