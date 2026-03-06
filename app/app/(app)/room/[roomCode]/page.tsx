'use client'

import { useState, useEffect, use } from 'react'
import Link from 'next/link'

interface Video {
  id: string
  title: string
  thumbnail: string
  channel: string
  duration: string
  upvotes: number
  youtubeId: string
  isPlaying: boolean
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

export default function RoomPage({ params }: { params: Promise<{ roomCode: string }> }) {
  const { roomCode } = use(params)
  const [currentVideo, setCurrentVideo] = useState<Video | null>(MOCK_VIDEOS[0])
  const [queue, setQueue] = useState<Video[]>(MOCK_VIDEOS.slice(1))
  const [loading, setLoading] = useState(false)
  const [showShareModal, setShowShareModal] = useState(false)
  const [copied, setCopied] = useState(false)
  const [isAdmin, setIsAdmin] = useState(true)
  const [videoUrl, setVideoUrl] = useState('')
  const [addingVideo, setAddingVideo] = useState(false)

  useEffect(() => {
    // Uncomment when backend is ready
    // const fetchRoom = async () => {
    //   try {
    //     const res = await fetch(`/api/room/${roomCode}`)
    //     const data = await res.json()
    //     setCurrentVideo(data.currentVideo)
    //     setQueue(data.queue)
    //     setIsAdmin(data.isAdmin)
    //   } catch (error) {
    //     console.error('Error fetching room:', error)
    //   } finally {
    //     setLoading(false)
    //   }
    // }
    // fetchRoom()
  }, [roomCode])

  const handleAddToQueue = async (youtubeUrl: string) => {
    if (!youtubeUrl.trim()) return

    setAddingVideo(true)
    try {
      const res = await fetch(`/api/room/${roomCode}/videos`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ youtubeUrl: youtubeUrl.trim() }),
      })

      if (res.ok) {
        const newVideo = await res.json()
        setQueue([...queue, newVideo.video])
        setVideoUrl('')
      }
    } catch (error) {
      console.error('Error adding video:', error)
    } finally {
      setAddingVideo(false)
    }
  }

  const handleUpvote = (videoId: string) => {
    setQueue(
      queue
        .map((v) => (v.id === videoId ? { ...v, upvotes: v.upvotes + 1 } : v))
        .sort((a, b) => b.upvotes - a.upvotes)
    )
    if (currentVideo?.id === videoId) {
      setCurrentVideo({ ...currentVideo, upvotes: currentVideo.upvotes + 1 })
    }
  }

  const handleSkip = async () => {
    try {
      const res = await fetch(`/api/room/${roomCode}/skip`, {
        method: 'POST',
      })

      if (res.ok) {
        const data = await res.json()
        setCurrentVideo(data.currentVideo)
        setQueue(data.queue)
      }
    } catch (error) {
      console.error('Error skipping:', error)
    }
  }

  const inviteUrl = typeof window !== 'undefined' ? `${window.location.origin}/room/${roomCode}` : ''

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(inviteUrl)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (error) {
      console.error('Error copying to clipboard:', error)
    }
  }

  const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(inviteUrl)}`

  const handleDownloadQR = () => {
    const link = document.createElement('a')
    link.href = qrCodeUrl
    link.download = `room-${roomCode}-qr.png`
    link.click()
  }

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-muted-foreground">Loading stream...</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen space-y-8 p-6 md:p-10">
      {/* Header */}
      <div className="flex flex-col items-start justify-between gap-4 md:flex-row md:items-center">
        <div>
          <h1 className="text-3xl font-bold text-foreground">{isAdmin ? 'Room Control' : 'Room'}</h1>
          <p className="mt-2 text-muted-foreground">Room Code: {roomCode}</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setShowShareModal(true)}
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

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Now Playing */}
        <div className="space-y-6 lg:col-span-2">
          {/* Current Video */}
          <div className="space-y-4">
            <h2 className="text-xl font-bold text-foreground">Now Playing</h2>
            {currentVideo ? (
              <div className="rounded-lg border border-primary bg-primary/10 p-6">
                <div className="aspect-video rounded-lg bg-secondary">
                  {currentVideo.thumbnail && (
                    <img
                      src={currentVideo.thumbnail}
                      alt={currentVideo.title}
                      className="h-full w-full rounded-lg object-cover"
                    />
                  )}
                </div>
                <div className="mt-4 space-y-2">
                  <h3 className="font-semibold text-foreground">{currentVideo.title}</h3>
                  <p className="text-sm text-muted-foreground">{currentVideo.channel}</p>
                  <p className="text-xs text-muted-foreground">{currentVideo.duration}</p>
                </div>
                <button
                  onClick={handleSkip}
                  className="mt-4 w-full rounded-lg bg-primary px-4 py-2 font-medium text-primary-foreground transition-colors hover:opacity-90"
                >
                  Skip to Next
                </button>
              </div>
            ) : (
              <div className="flex items-center justify-center rounded-lg border border-dashed border-border p-12 text-center">
                <div className="space-y-2">
                  <p className="text-2xl">🎵</p>
                  <p className="text-muted-foreground">No video playing. Add one to the queue.</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Queue */}
        <div className="space-y-4">
          <h2 className="text-xl font-bold text-foreground">Queue</h2>

          {/* Add Video Form */}
          <div className="rounded-lg border border-border bg-card p-4">
            <label htmlFor="url" className="block text-sm font-medium text-foreground">
              Add Video
            </label>
            <form
              onSubmit={(e) => {
                e.preventDefault()
                const input = (e.target as HTMLFormElement).querySelector('input') as HTMLInputElement
                handleAddToQueue(input.value)
                input.value = ''
              }}
              className="mt-2 space-y-2"
            >
              <input
                type="text"
                placeholder="Paste YouTube URL..."
                className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground placeholder-muted-foreground transition-colors focus:outline-none focus:ring-2 focus:ring-primary"
              />
              <button
                type="submit"
                className="w-full rounded-lg bg-primary px-3 py-2 text-sm font-medium text-primary-foreground transition-colors hover:opacity-90"
              >
                Add
              </button>
            </form>
          </div>

          {/* Queue List */}
          <div className="space-y-2 max-h-96 overflow-y-auto">
            {queue.length === 0 ? (
              <p className="text-center text-sm text-muted-foreground">Queue is empty</p>
            ) : (
              queue.map((video, index) => (
                <div key={video.id} className="rounded-lg border border-border bg-card p-3">
                  <div className="flex items-start gap-2">
                    <span className="text-sm font-bold text-primary">#{index + 1}</span>
                    <div className="flex-1 min-w-0">
                      <p className="line-clamp-2 text-sm font-medium text-foreground">{video.title}</p>
                    </div>
                    <button
                      onClick={() => handleUpvote(video.id)}
                      className="flex-shrink-0 rounded-lg bg-primary/20 px-2 py-1 text-xs font-medium text-primary transition-colors hover:bg-primary/30"
                    >
                      👍 {video.upvotes}
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Share Modal */}
      {showShareModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50 p-4 z-50">
          <div className="w-full max-w-md rounded-lg border border-border bg-card p-8 space-y-6">
            {/* Modal Header */}
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-foreground">Share Room</h2>
              <button
                onClick={() => setShowShareModal(false)}
                className="text-2xl text-muted-foreground transition-colors hover:text-foreground"
              >
                ×
              </button>
            </div>

            {/* Invite Link */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-foreground">Invite Link</label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={inviteUrl}
                  readOnly
                  className="flex-1 rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground"
                />
                <button
                  onClick={handleCopyLink}
                  className={`rounded-lg px-4 py-2 font-medium transition-colors ${
                    copied
                      ? 'bg-primary/20 text-primary'
                      : 'bg-primary text-primary-foreground hover:opacity-90'
                  }`}
                >
                  {copied ? 'Copied!' : 'Copy'}
                </button>
              </div>
            </div>

            {/* Room Code */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-foreground">Room Code</label>
              <div className="inline-block rounded-lg bg-primary/10 px-4 py-2 text-lg font-bold text-primary">
                {roomCode}
              </div>
            </div>

            {/* QR Code */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-foreground">QR Code</label>
              <div className="flex justify-center rounded-lg border border-border bg-background p-4">
                <img
                  src={qrCodeUrl}
                  alt="Invite QR Code"
                  className="h-48 w-48"
                />
              </div>
            </div>

            {/* Download QR Button */}
            <button
              onClick={handleDownloadQR}
              className="w-full rounded-lg border border-primary bg-primary/10 px-4 py-2 font-medium text-primary transition-colors hover:bg-primary/20"
            >
              Download QR Code
            </button>

            {/* Close Button */}
            <button
              onClick={() => setShowShareModal(false)}
              className="w-full rounded-lg border border-border bg-secondary px-4 py-2 font-medium text-foreground transition-colors hover:bg-secondary/80"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
