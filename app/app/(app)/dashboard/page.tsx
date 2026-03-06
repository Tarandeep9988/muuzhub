'use client'

import { useRouter } from 'next/navigation'
import { useState } from 'react'

interface Room {
  code: string
  videoCount: number
  currentlyPlaying: string
}

const MOCK_ROOMS: Room[] = [
  { code: 'MUSIC01', videoCount: 12, currentlyPlaying: 'Never Gonna Give You Up - Rick Astley' },
  { code: 'PARTY22', videoCount: 8, currentlyPlaying: 'Blinding Lights - The Weeknd' },
  { code: 'CHILL05', videoCount: 15, currentlyPlaying: 'Sunroof - Nicky Youre' },
]

export default function Dashboard() {
  const router = useRouter()
  const [roomCode, setRoomCode] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleQuickJoin = (code: string) => {
    router.push(`/room/${code}`)
  }

  const handleCreateRoom = async () => {
    setError('')
    setLoading(true)

    try {
      const res = await fetch('/api/room/create', {
        method: 'POST',
      })

      if (res.ok) {
        const data = await res.json()
        router.push(`/room/${data.roomCode}`)
      } else {
        setError('Failed to create room')
      }
    } catch (error) {
      console.error('Error creating room:', error)
      setError('An error occurred')
    } finally {
      setLoading(false)
    }
  }

  const handleJoinRoom = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (!roomCode.trim()) {
      setError('Please enter a room code')
      return
    }

    setLoading(true)

    try {
      const res = await fetch(`/api/room/${roomCode.trim()}/verify`)
      
      if (res.ok) {
        router.push(`/room/${roomCode.trim()}`)
      } else {
        setError('Room not found')
      }
    } catch (error) {
      console.error('Error joining room:', error)
      setError('An error occurred')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="mx-auto max-w-5xl space-y-8">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-4xl font-bold text-foreground">muuzHub</h1>
          <p className="mt-2 text-muted-foreground">Create or join a room to get started</p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="rounded-lg bg-destructive/10 p-4 text-sm text-destructive">
            {error}
          </div>
        )}

        {/* Main Content Grid */}
        <div className="grid gap-6 lg:grid-cols-3">
          {/* Create Room Card */}
          <div className="rounded-lg border border-border bg-card p-8 space-y-4">
            <h2 className="text-2xl font-bold text-foreground">Create Room</h2>
            <p className="text-sm text-muted-foreground">Start a new room and become the admin. Share the code with others.</p>
            <button
              onClick={handleCreateRoom}
              disabled={loading}
              className="w-full rounded-lg bg-primary px-6 py-3 font-medium text-primary-foreground transition-colors hover:opacity-90 disabled:opacity-50"
            >
              {loading ? 'Creating...' : 'Create Room'}
            </button>
          </div>

          {/* Join Room Card */}
          <div className="rounded-lg border border-border bg-card p-8 space-y-4">
            <h2 className="text-2xl font-bold text-foreground">Join Room</h2>
            <p className="text-sm text-muted-foreground">Enter a room code to join an existing room and start voting.</p>
            <form onSubmit={handleJoinRoom} className="space-y-3">
              <input
                type="text"
                placeholder="Enter room code"
                value={roomCode}
                onChange={(e) => setRoomCode(e.target.value.toUpperCase())}
                disabled={loading}
                className="w-full rounded-lg border border-border bg-background px-4 py-2 text-foreground placeholder-muted-foreground transition-colors focus:outline-none focus:ring-2 focus:ring-primary disabled:opacity-50"
              />
              <button
                type="submit"
                disabled={loading}
                className="w-full rounded-lg bg-primary px-6 py-2 font-medium text-primary-foreground transition-colors hover:opacity-90 disabled:opacity-50"
              >
                {loading ? 'Joining...' : 'Join Room'}
              </button>
            </form>
          </div>

          {/* Active Rooms */}
          <div className="rounded-lg border border-border bg-card p-8 space-y-4">
            <h2 className="text-xl font-bold text-foreground">Active Rooms</h2>
            <div className="space-y-2">
              {MOCK_ROOMS.map((room) => (
                <button
                  key={room.code}
                  onClick={() => handleQuickJoin(room.code)}
                  className="w-full rounded-lg border border-border bg-background p-3 text-left transition-colors hover:bg-secondary"
                >
                  <div className="font-medium text-foreground">{room.code}</div>
                  <div className="text-xs text-muted-foreground">{room.videoCount} videos</div>
                  <div className="line-clamp-1 text-xs text-muted-foreground">{room.currentlyPlaying}</div>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
