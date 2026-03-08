"use client"

import Link from 'next/link'
import { useState } from 'react';
import ShareRoomModal from './ShareRoomModal';

interface RoomHeaderProps {
  isAdmin: boolean
  roomId: string
}

export default function RoomHeader({ isAdmin, roomId }: RoomHeaderProps) {

  const [showShareModal, setShowShareModal] = useState(false);

  return (
    <div className="flex flex-col items-start justify-between gap-4 md:flex-row md:items-center">
      {showShareModal && <ShareRoomModal 
        roomId={roomId}
        onClose={() => setShowShareModal(false)}
      />}

      <div>
        <h1 className="text-3xl font-bold text-foreground">{isAdmin ? 'Room Control' : 'Room'}</h1>
        <p className="mt-2 text-muted-foreground">Room Id: {roomId}</p>
      </div>
      <div className="flex gap-2">
        <button
          onClick={() => {setShowShareModal(true)}}
          className="rounded-lg bg-primary px-4 py-2 font-medium text-primary-foreground transition-colors hover:opacity-90"
        >
          Share Room
        </button>
        <Link
          href="/dashboard"
          className="rounded-lg border border-border bg-secondary px-4 py-2 font-medium text-foreground transition-colors hover:bg-secondary/80"
        >
          Exit Room
        </Link>
      </div>
    </div>
  )
}
