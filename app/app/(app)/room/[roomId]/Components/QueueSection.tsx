import type { Video } from './types'

interface QueueSectionProps {
  queue: Video[]
  videoUrl: string
  addingVideo: boolean
  onVideoUrlChange: (value: string) => void
  onAddToQueue: () => void
  onUpvote: (videoId: string) => void
}

export default function QueueSection({
  queue,
  videoUrl,
  addingVideo,
  onVideoUrlChange,
  onAddToQueue,
  onUpvote,
}: QueueSectionProps) {
  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold text-foreground">Queue</h2>

      <div className="rounded-lg border border-border bg-card p-4">
        <label htmlFor="video-url" className="block text-sm font-medium text-foreground">
          Add Video
        </label>
        <form
          onSubmit={(e) => {
            e.preventDefault()
            onAddToQueue()
          }}
          className="mt-2 space-y-2"
        >
          <input
            id="video-url"
            type="text"
            placeholder="Paste YouTube URL..."
            value={videoUrl}
            onChange={(e) => onVideoUrlChange(e.target.value)}
            disabled={addingVideo}
            className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground placeholder-muted-foreground transition-colors focus:outline-none focus:ring-2 focus:ring-primary disabled:opacity-50"
          />
          <button
            type="submit"
            disabled={addingVideo || !videoUrl.trim()}
            className="w-full rounded-lg bg-primary px-3 py-2 text-sm font-medium text-primary-foreground transition-colors hover:opacity-90 disabled:opacity-50"
          >
            {addingVideo ? 'Adding...' : 'Add'}
          </button>
        </form>
      </div>

      <div className="max-h-96 space-y-2 overflow-y-auto">
        {queue.length === 0 ? (
          <p className="text-center text-sm text-muted-foreground">Queue is empty</p>
        ) : (
          queue.map((video, index) => (
            <div key={video.id} className="rounded-lg border border-border bg-card p-3">
              <div className="flex items-start gap-2">
                <span className="text-sm font-bold text-primary">#{index + 1}</span>
                <div className="min-w-0 flex-1">
                  <p className="line-clamp-2 text-sm font-medium text-foreground">{video.title}</p>
                </div>
                <button
                  onClick={() => onUpvote(video.id)}
                  className="shrink-0 rounded-lg bg-primary/20 px-2 py-1 text-xs font-medium text-primary transition-colors hover:bg-primary/30"
                >
                  +1 {video.upvotes}
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
