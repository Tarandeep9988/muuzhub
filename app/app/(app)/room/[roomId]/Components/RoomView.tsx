"use client";

import { use, useEffect, useState } from "react";
import NowPlayingSection from "./NowPlayingSection";
import QueueSection from "./QueueSection";
import RoomHeader from "./RoomHeader";
import type { Room, User, Stream } from "@/prisma/generated/prisma/client";
import { socket } from "@/app/socket";

type RoomViewProps = {
  params: Promise<{ roomId: string }>;
  user: User;
  room: Room;
};

export default function RoomView({ params, user, room }: RoomViewProps) {
  const { roomId } = use(params);
  console.log(roomId);
  console.log(user);
  const [currentStream, setCurrentStream] = useState<Stream | null>(null);
  const [queue, setQueue] = useState<Stream[]>([]);
  const [streamUrl, setStreamUrl] = useState("");
  const [addingStream, setAddingStream] = useState(false);
  const [isAdmin] = useState(room.adminId === user.id);

  useEffect(() => {

    socket.on("connect", () => {
      console.log("Connected to socket server with id: ", socket.id);
      console.log("Joining room: ", roomId);
      socket.emit("joinRoom", roomId);
    });

    socket.on("disconnect", () => {
      console.log("Disconnected from socket server");
    });

    return () => {
      socket.off("connect");
      socket.off("disconnect");
      socket.disconnect();
    };
  }, []);

  const handleAddToQueue = () => {
    fetch(`/api/stream/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        url: streamUrl,
        adminId: user.id,
        roomId: roomId,
      }),
    })
      .then((res) => {
        return res.json();
      })
      .then((data) => {
        setQueue((prevQueue) => [...prevQueue, data.stream]);
        setStreamUrl("");
      })
      .catch((err) => {
        console.error("Error adding stream to queue: ", err);
      });
  };

  const handleUpvote = async (streamId: string) => {};
  const handleSkip = async () => {};

  return (
    <div className="my-10 min-h-screen space-y-8 p-6 md:p-10">
      <RoomHeader isAdmin={isAdmin} roomId={roomId} />

      <div className="grid gap-6 lg:grid-cols-3">
        <NowPlayingSection
          currentStream={currentStream}
          onSkip={handleSkip}
          isAdmin={isAdmin}
        />

        <QueueSection
          queue={queue}
          streamUrl={streamUrl}
          addingStream={addingStream}
          onStreamUrlChange={setStreamUrl}
          onAddToQueue={handleAddToQueue}
          onUpvote={handleUpvote}
        />
      </div>
    </div>
  );
}
