import type { Room, User, Stream } from '@/prisma/generated/prisma/client'

interface QueueSectionProps {
  queue: Stream[]
  streamUrl: string
  addingStream: boolean
  onStreamUrlChange: (value: string) => void
  onAddToQueue: () => void
  onUpvote: (streamId: string) => void
}

export default function QueueSection({
  queue,
  streamUrl,
  addingStream,
  onStreamUrlChange,
  onAddToQueue,
  onUpvote,
}: QueueSectionProps) {
  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold text-foreground">Queue</h2>

      <div className="rounded-lg border border-border bg-card p-4">
        <label htmlFor="stream-url" className="block text-sm font-medium text-foreground">
          Add Stream
        </label>
        <form
          onSubmit={(e) => {
            e.preventDefault()
            onAddToQueue()
          }}
          className="mt-2 space-y-2"
        >
          <input
            id="stream-url"
            type="text"
            placeholder="Paste YouTube URL..."
            value={streamUrl}
            onChange={(e) => onStreamUrlChange(e.target.value)}
            disabled={addingStream}
            className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground placeholder-muted-foreground transition-colors focus:outline-none focus:ring-2 focus:ring-primary disabled:opacity-50"
          />
          <button
            type="submit"
            disabled={addingStream || !streamUrl.trim()}
            className="w-full rounded-lg bg-primary px-3 py-2 text-sm font-medium text-primary-foreground transition-colors hover:opacity-90 disabled:opacity-50"
          >
            {addingStream ? 'Adding...' : 'Add'}
          </button>
        </form>
      </div>

      <div className="max-h-96 space-y-2 overflow-y-auto">
        {queue.length === 0 ? (
          <p className="text-center text-sm text-muted-foreground">Queue is empty</p>
        ) : (
          queue.map((stream, index) => (
            <div key={stream.id} className="rounded-lg border border-border bg-card p-3">
              <div className="flex items-start gap-2">
                <span className="text-sm font-bold text-primary">#{index + 1}</span>
                <div className="min-w-0 flex-1">
                  <p className="line-clamp-2 text-sm font-medium text-foreground">{stream.url}</p>
                </div>
                <button
                  onClick={() => onUpvote(stream.id)}
                  className="shrink-0 rounded-lg bg-primary/20 px-2 py-1 text-xs font-medium text-primary transition-colors hover:bg-primary/30"
                >
                  +1
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
