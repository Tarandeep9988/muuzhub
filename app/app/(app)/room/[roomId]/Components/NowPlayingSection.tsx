import type { Stream } from '@/prisma/generated/prisma/client'
import { useState, useEffect } from 'react';
import youtubesearchapi from "youtube-search-api";
import youtubeUrl from "youtube-url";


interface NowPlayingSectionProps {
  isAdmin: boolean
  currentStream: Stream | null
  onSkip: () => void
}

export default function NowPlayingSection({isAdmin, currentStream, onSkip }: NowPlayingSectionProps) {

  const [title, setTitle] = useState("Loading...");

  useEffect(() => {
    if (!currentStream) {
      return;
    }
    const videoId = youtubeUrl.extractId(currentStream?.url || "");
    youtubesearchapi.GetVideoDetails(videoId || "")
    .then((response) => {
      setTitle(response.title);
    }).catch((error) => {
      console.error("Failed to fetch video details: ", error);
      setTitle("Unknown Title");
    });
  }, [currentStream]);

  return (
    <div className="space-y-6 lg:col-span-2">
      <div className="space-y-4">
        <h2 className="text-xl font-bold text-foreground">Now Playing</h2>
        {currentStream ? (
          <div className="rounded-lg border border-primary bg-primary/10 p-6">
            <div className="aspect-video rounded-lg bg-secondary">
              <p className="flex items-center justify-center h-full w-full text-sm text-muted-foreground">
                {title}
              </p>
            </div>
            <div className="mt-4 space-y-2">
              <h3 className="font-semibold text-foreground">{currentStream.url}</h3>
              <p className="text-xs text-muted-foreground">Active: {currentStream.active ? 'Yes' : 'No'}</p>
            </div>
            {
              isAdmin && (
                <button
                  onClick={onSkip}
                  className="mt-4 w-full rounded-lg bg-primary px-4 py-2 font-medium text-primary-foreground transition-colors hover:opacity-90"
                >
                  Skip to Next
                </button>
              )
            }
          </div>
        ) : (
          <div className="flex items-center justify-center rounded-lg border border-dashed border-border p-12 text-center">
            <div className="space-y-2">
              <p className="text-muted-foreground">No stream playing. Add one to the queue.</p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
