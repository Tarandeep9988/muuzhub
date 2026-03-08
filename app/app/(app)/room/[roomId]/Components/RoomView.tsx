'use client'

import { use, useEffect, useState } from 'react'
import NowPlayingSection from './NowPlayingSection'
import QueueSection from './QueueSection'
import RoomHeader from './RoomHeader'
import ShareRoomModal from './ShareRoomModal'
import type { Video } from './types'

type RoomViewProps ={
  params: Promise<{ roomId: string }>
  user: unknown
  room: unknown
}

const MOCK_VIDEOS: Video[] = [
  {
    id: '1',
    title: 'Never Gonna Give You Up - Rick Astley',
    thumbnail: 'https://img.youtube.com/vi/dQw4w9WgXcQ/120.jpg',
    channel: 'Rick Astley',
    duration: '3:33',
    upvotes: 15,
    youtubeId: 'dQw4w9WgXcQ',
    isPlaying: true,
  },
  {
    id: '2',
    title: 'Blinding Lights - The Weeknd',
    thumbnail: 'https://img.youtube.com/vi/4NRXx6U8ABQ/120.jpg',
    channel: 'The Weeknd',
    duration: '3:20',
    upvotes: 12,
    youtubeId: '4NRXx6U8ABQ',
    isPlaying: false,
  },
  {
    id: '3',
    title: 'Sunroof - Nicky Youre',
    thumbnail: 'https://img.youtube.com/vi/aJGdvPJYXB8/120.jpg',
    channel: 'Nicky Youre',
    duration: '2:45',
    upvotes: 8,
    youtubeId: 'aJGdvPJYXB8',
    isPlaying: false,
  },
  {
    id: '4',
    title: 'Shape of You - Ed Sheeran',
    thumbnail: 'https://img.youtube.com/vi/JGwWNGJdvx8/120.jpg',
    channel: 'Ed Sheeran',
    duration: '3:53',
    upvotes: 5,
    youtubeId: 'JGwWNGJdvx8',
    isPlaying: false,
  },
]

export default function RoomView({ params, user, room }: RoomViewProps) {
  const { roomId } = use(params)
  const [currentVideo, setCurrentVideo] = useState<Video | null>(MOCK_VIDEOS[0] ?? null)
  const [queue, setQueue] = useState<Video[]>(MOCK_VIDEOS.slice(1))
  const [isAdmin] = useState(true)
  const [videoUrl, setVideoUrl] = useState('')
  const [addingVideo, setAddingVideo] = useState(false);
  

  const handleAddToQueue = async () => {
    if (!videoUrl.trim()) {
      return
    }

    setAddingVideo(true)
    try {
      const res = await fetch(`/api/room/${roomId}/videos`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ youtubeUrl: videoUrl.trim() }),
      })

      if (res.ok) {
        const response = (await res.json()) as { video?: Video }
        const queuedVideo = response.video
        if (queuedVideo) {
          setQueue((previousQueue) => [...previousQueue, queuedVideo])
        }
        setVideoUrl('')
      }
    } catch (error) {
      console.error('Error adding video:', error)
    } finally {
      setAddingVideo(false)
    }
  }

  const handleUpvote = (videoId: string) => {
    setQueue((previousQueue) =>
      previousQueue
        .map((v) => (v.id === videoId ? { ...v, upvotes: v.upvotes + 1 } : v))
        .sort((a, b) => b.upvotes - a.upvotes)
    )

    setCurrentVideo((previousVideo) => {
      if (!previousVideo || previousVideo.id !== videoId) {
        return previousVideo
      }

      return { ...previousVideo, upvotes: previousVideo.upvotes + 1 }
    })
  }

  const handleSkip = async () => {
    try {
      const res = await fetch(`/api/room/${roomId}/skip`, {
        method: 'POST',
      })

      if (res.ok) {
        const data = (await res.json()) as { currentVideo?: Video | null; queue?: Video[] }
        setCurrentVideo(data.currentVideo ?? null)
        setQueue(data.queue ?? [])
      }
    } catch (error) {
      console.error('Error skipping:', error)
    }
  }

  return (
    <div className="my-10 min-h-screen space-y-8 p-6 md:p-10">
      <RoomHeader isAdmin={isAdmin} roomId={roomId} />

      <div className="grid gap-6 lg:grid-cols-3">
        <NowPlayingSection currentVideo={currentVideo} onSkip={handleSkip} />

        <QueueSection
          queue={queue}
          videoUrl={videoUrl}
          addingVideo={addingVideo}
          onVideoUrlChange={setVideoUrl}
          onAddToQueue={handleAddToQueue}
          onUpvote={handleUpvote}
        />
      </div>
    </div>
  )
}
