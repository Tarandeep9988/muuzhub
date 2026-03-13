"use client";

import { use, useEffect, useEffectEvent, useState } from "react";
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
  // console.log(roomId);
  // console.log(user);
  const [currentStream, setCurrentStream] = useState<Stream | null>(null);
  const [queue, setQueue] = useState<Stream[]>([]);
  const [streamUrl, setStreamUrl] = useState("wefowjefoiwejf");
  const [addingStream, setAddingStream] = useState(false);
  const [isAdmin] = useState(room.adminId === user.id);

  useEffect(() => {
    socket.on("connect", () => {
      // console.log("Connected to socket server with id: ", socket.id);
      // console.log("Joining room: ", roomId);
      socket.emit("joinRoom", { roomId, userId: user.id }, (response: any) => {
        if (!response.success) {
          console.error("Failed to join room: ", response.message);
        } else {
          console.log("Joined room successfully: ", response.message);
        }
      });
    });

    socket.on("disconnect", () => {
      console.log("Disconnected from socket server");
    });

    socket.on("queueUpdated", (queue: Stream[]) => {
      if (queue.length > 0) {
        if (currentStream !== queue[0]) {
          setCurrentStream(queue[0]);
        }
        setQueue(queue.slice(1));
      }
      else {
        setCurrentStream(null);
      }
    });

    return () => {
      socket.off("connect");
      socket.off("disconnect");
      socket.disconnect();
    };
  }, []);
  

  const handleAddToQueue = () => {
    // Emit directly to socket
    setAddingStream(true);
    socket.emit(
      "addStream",
      {
        url: streamUrl,
      },
      (response: any) => {
        if (response.success) {
          console.log("Stream added successfully");
          setStreamUrl("");
        } else {
          console.error("Failed to add stream: ", response.message);
        }
        setAddingStream(false);
      }
    );
  };

  const handleUpvote = (stream: Stream) => {
    const streamId = stream.id;
    socket.emit(
      "upvoteStream",
      {
        streamId,
      },
      (response: any) => {
        if (response.success) {
          console.log("Upvote successful");
          NotificationManager.success('Success message', 'Title here');
        } else {
          console.error("Upvote failed: ", response.message);
        }
      }
    );
  };
  const handleNextStream = () => {
    socket.emit(
      "nextStream",
      {},
      (response: any) => {
        if (response.success) {
          console.log("Next stream successful");
        } else {
          console.error("Next stream failed: ", response.message);
        }
      }
    );
  };

  return (
    <div className="my-10 min-h-screen space-y-8 p-6 md:p-10">
      <RoomHeader isAdmin={isAdmin} roomId={roomId} />

      <div className="grid gap-6 lg:grid-cols-3">
        <NowPlayingSection
          currentStream={currentStream}
          onSkip={handleNextStream}
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
