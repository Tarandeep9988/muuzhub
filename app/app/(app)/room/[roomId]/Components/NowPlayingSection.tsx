import type { Video } from './types'

interface NowPlayingSectionProps {
  currentVideo: Video | null
  onSkip: () => void
}

export default function NowPlayingSection({ currentVideo, onSkip }: NowPlayingSectionProps) {
  return (
    <div className="space-y-6 lg:col-span-2">
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
              onClick={onSkip}
              className="mt-4 w-full rounded-lg bg-primary px-4 py-2 font-medium text-primary-foreground transition-colors hover:opacity-90"
            >
              Skip to Next
            </button>
          </div>
        ) : (
          <div className="flex items-center justify-center rounded-lg border border-dashed border-border p-12 text-center">
            <div className="space-y-2">
              <p className="text-muted-foreground">No video playing. Add one to the queue.</p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
