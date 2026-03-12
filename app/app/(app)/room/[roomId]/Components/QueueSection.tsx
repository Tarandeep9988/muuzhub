import type { Stream } from '@/prisma/generated/prisma/client'
import StreamComponent from './StreamComponent'

interface QueueSectionProps {
  queue: Stream[]
  streamUrl: string
  addingStream: boolean
  onStreamUrlChange: (value: string) => void
  onAddToQueue: () => void
  onUpvote: (stream: Stream) => void
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
            className="w-full cursor-pointer rounded-lg bg-primary px-3 py-2 text-sm font-medium text-primary-foreground transition-colors hover:opacity-90 disabled:opacity-50"
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
            <StreamComponent key={stream.id} stream={stream} index={index} onUpvote={onUpvote} />
          ))
        )}
      </div>
    </div>
  )
}
