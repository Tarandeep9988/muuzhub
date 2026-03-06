'use client'

import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Plus, Play, Users } from 'lucide-react'
import Link from 'next/link'
import { useState, useEffect } from 'react'

interface Stream {
  id: string
  name: string
  description: string
  viewers: number
  upvotes: number
}

export default function Dashboard() {
  const [streams, setStreams] = useState<Stream[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchStreams = async () => {
      try {
        const res = await fetch('/api/streams')
        const data = await res.json()
        setStreams(data)
      } catch (error) {
        console.error('Error fetching streams:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchStreams()
  }, [])

  return (
    <div className="space-y-8 p-6 md:p-10">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Your Streams</h1>
          <p className="mt-2 text-muted-foreground">Create and manage your collaborative streams</p>
        </div>
        <Link href="/streams/create">
          <Button size="lg" className="gap-2">
            <Plus className="size-4" />
            Create Stream
          </Button>
        </Link>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="text-center text-muted-foreground">Loading streams...</div>
      )}

      {/* Streams Grid */}
      {!loading && streams.length > 0 && (
        <div className="grid gap-4 md:grid-cols-2">
          {streams.map((stream) => (
            <Card key={stream.id} className="overflow-hidden transition-all hover:shadow-lg">
              <div className="space-y-4 p-6">
                <h3 className="text-xl font-bold text-foreground">{stream.name}</h3>
                <p className="text-sm text-muted-foreground">{stream.description}</p>
                <div className="flex items-center gap-4 pt-2">
                  <div className="flex items-center gap-2 text-sm text-foreground">
                    <Users className="size-4" />
                    {stream.viewers} viewers
                  </div>
                  <div className="flex items-center gap-2 text-sm text-primary">
                    👍 {stream.upvotes} upvotes
                  </div>
                </div>
                <Link href={`/streams/${stream.id}`}>
                  <Button variant="outline" className="w-full gap-2">
                    <Play className="size-4" />
                    Go to Stream
                  </Button>
                </Link>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Empty State */}
      {!loading && streams.length === 0 && (
        <Card className="border-dashed">
          <div className="flex flex-col items-center justify-center space-y-4 p-12 text-center">
            <Plus className="size-12 text-muted-foreground" />
            <h3 className="text-lg font-semibold text-foreground">No streams yet</h3>
            <p className="text-sm text-muted-foreground">Create your first stream to get started</p>
            <Link href="/streams/create">
              <Button>Create Stream</Button>
            </Link>
          </div>
        </Card>
      )}
    </div>
  )
}
