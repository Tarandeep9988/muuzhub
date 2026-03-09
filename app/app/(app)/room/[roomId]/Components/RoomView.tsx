'use client'

import { use, useEffect, useState } from 'react'
import NowPlayingSection from './NowPlayingSection'
import QueueSection from './QueueSection'
import RoomHeader from './RoomHeader'
import type { Room, User, Stream } from '@/prisma/generated/prisma/client'

type RoomViewProps ={
  params: Promise<{ roomId: string }>
  user: User
  room: Room
}

export default function RoomView({ params, user, room }: RoomViewProps) {
  const { roomId } = use(params)
  const [currentStream, setCurrentStream] = useState<Stream | null>(null)
  const sampleStream: Stream = {
    id: '1',
    roomId: roomId,
    userId: user.id,
    url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    active: true,
    played: false,
    createdAt: new Date(),
  }
  const [queue, setQueue] = useState<Stream[]>([sampleStream]);
  const [streamUrl, setStreamUrl] = useState('')
  const [addingStream, setAddingStream] = useState(false);
  const [isAdmin] = useState(room.adminId === user.id);
  
  useEffect(() => {
    // fetch all the streams as the video loads
    // add sample stream
  }, [])
  

  const handleAddToQueue = async () => {
    
  }

  const handleUpvote = async (streamId: string) => {
    
  }
  const handleSkip = async () => {

  }

  return (
    <div className="my-10 min-h-screen space-y-8 p-6 md:p-10">
      <RoomHeader isAdmin={isAdmin} roomId={roomId} />

      <div className="grid gap-6 lg:grid-cols-3">
        <NowPlayingSection currentStream={currentStream} onSkip={handleSkip} isAdmin={isAdmin}/>

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
  )
}
