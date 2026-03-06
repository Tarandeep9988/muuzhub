'use client'

import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { ThumbsUp, Plus, Volume2 } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { useState, useEffect } from 'react'

interface Video {
  id: string
  title: string
  artist: string
  duration: string
  upvotes: number
}

interface StreamPageProps {
  params: {
    id: string
  }
}

export default function StreamPage({ params }: StreamPageProps) {
  const [videos, setVideos] = useState<Video[]>([])
  const [videoUrl, setVideoUrl] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchVideos = async () => {
      try {
        const res = await fetch(`/api/streams/${params.id}/videos`)
        const data = await res.json()
        setVideos(data)
      } catch (error) {
        console.error('Error fetching videos:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchVideos()
  }, [params.id])

  const handleAddVideo = async () => {
    if (!videoUrl.trim()) return

    try {
      const res = await fetch(`/api/streams/${params.id}/videos`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: videoUrl }),
      })

      if (res.ok) {
        const newVideo = await res.json()
        setVideos([...videos, newVideo])
        setVideoUrl('')
      }
    } catch (error) {
      console.error('Error adding video:', error)
    }
  }

  const handleUpvote = async (videoId: string) => {
    try {
      const res = await fetch(`/api/streams/${params.id}/videos/${videoId}/upvote`, {
        method: 'POST',
      })

      if (res.ok) {
        setVideos(
          videos.map((v) =>
            v.id === videoId ? { ...v, upvotes: v.upvotes + 1 } : v
          )
        )
      }
    } catch (error) {
      console.error('Error upvoting:', error)
    }
  }

  const sortedVideos = [...videos].sort((a, b) => b.upvotes - a.upvotes)

  return (
    <div className="min-h-screen space-y-8 p-6 md:p-10">
      {/* Stream Header */}
      <div className="space-y-4">
        <h1 className="text-4xl font-bold text-foreground">Stream</h1>
        <p className="text-muted-foreground">Community-driven video queue</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Main Player Area */}
        <div className="space-y-6 lg:col-span-2">
          {/* Video Player */}
          <Card className="overflow-hidden bg-secondary">
            <div className="relative aspect-video flex items-center justify-center bg-background">
              <div className="flex flex-col items-center gap-4">
                <Volume2 className="size-16 text-muted-foreground" />
                <div className="text-center">
                  <p className="text-sm font-semibold text-foreground">
                    {sortedVideos[0]?.title || 'No videos'}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {sortedVideos[0]?.artist || 'N/A'}
                  </p>
                </div>
              </div>
            </div>
          </Card>

          {/* Add Video Form */}
          <Card className="p-6">
            <h3 className="mb-4 font-semibold text-foreground">Add to Queue</h3>
            <div className="flex gap-2">
              <Input
                placeholder="Paste video URL or search..."
                value={videoUrl}
                onChange={(e) => setVideoUrl(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleAddVideo()}
              />
              <Button onClick={handleAddVideo} size="sm" className="gap-2">
                <Plus className="size-4" />
                Add
              </Button>
            </div>
          </Card>
        </div>

        {/* Queue Sidebar */}
        <div className="space-y-4">
          <h2 className="text-xl font-bold text-foreground">Queue</h2>
          {loading ? (
            <div className="text-sm text-muted-foreground">Loading...</div>
          ) : (
            <div className="space-y-2">
              {sortedVideos.length === 0 ? (
                <p className="text-sm text-muted-foreground">No videos yet. Add one!</p>
              ) : (
                sortedVideos.map((video) => (
                  <Card key={video.id} className="transition-all hover:border-primary/50">
                    <div className="space-y-2 p-4">
                      <p className="line-clamp-2 text-sm font-medium text-foreground">
                        {video.title}
                      </p>
                      <p className="text-xs text-muted-foreground">{video.duration}</p>
                      <Button
                        variant="outline"
                        size="sm"
                        className="w-full gap-2"
                        onClick={() => handleUpvote(video.id)}
                      >
                        <ThumbsUp className="size-3" />
                        <span>{video.upvotes}</span>
                      </Button>
                    </div>
                  </Card>
                ))
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
