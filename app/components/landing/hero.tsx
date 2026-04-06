import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ArrowRight, ThumbsUp, Play } from "lucide-react"

export function Hero() {
  return (
    <section className="relative flex min-h-screen items-center overflow-hidden pt-20">
      {/* Subtle grid background */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)",
          backgroundSize: "64px 64px",
        }}
      />
      {/* Glow effect */}
      <div className="pointer-events-none absolute left-1/2 top-1/4 size-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/5 blur-[120px]" />

      <div className="relative mx-auto w-full max-w-7xl px-6 py-24 lg:py-32">
        <div className="grid items-center gap-16 lg:grid-cols-2">
          {/* Left column - Copy */}
          <div className="flex flex-col gap-8">
            <Badge variant="outline" className="w-fit gap-2 border-primary/30 px-3 py-1.5 text-primary">
              <span className="relative flex size-2">
                <span className="absolute inline-flex size-full animate-ping rounded-full bg-primary opacity-75" />
                <span className="relative inline-flex size-2 rounded-full bg-primary" />
              </span>
              Now in Public Beta
            </Badge>

            <div className="flex flex-col gap-4">
              <h1 className="text-balance font-mono text-4xl font-bold leading-tight tracking-tight text-foreground md:text-5xl lg:text-6xl">
                The crowd decides{" "}
                <span className="text-primary">what plays next.</span>
              </h1>
              <p className="max-w-lg text-pretty text-lg leading-relaxed text-muted-foreground">
                Create collaborative streams where everyone votes on the playlist.
                The most upvoted video plays on the central screen. Democracy meets entertainment.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-4">
              <Button size="lg" className="gap-2 font-semibold">
                Create a Stream
                <ArrowRight className="size-4" />
              </Button>
              <Button variant="outline" size="lg" className="gap-2 text-foreground">
                <Play className="size-4" />
                Watch Demo
              </Button>
            </div>

            <div className="flex items-center gap-6 pt-2">
              <div className="flex -space-x-2">
                {[1, 2, 3, 4, 5].map((i) => (
                  <div
                    key={i}
                    className="flex size-8 items-center justify-center rounded-full border-2 border-background bg-secondary text-xs font-medium text-secondary-foreground"
                  >
                    {String.fromCharCode(64 + i)}
                  </div>
                ))}
              </div>
              <p className="text-sm text-muted-foreground">
                <span className="font-semibold text-foreground">2,400+</span> streamers this week
              </p>
            </div>
          </div>

          {/* Right column - Interactive Preview */}
          <div className="relative">
            <div className="overflow-hidden rounded-xl border border-border bg-card p-1 shadow-2xl shadow-primary/5">
              {/* Player area */}
              <div className="relative flex aspect-video items-center justify-center rounded-lg bg-secondary">
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="flex flex-col items-center gap-3">
                    <div className="flex size-16 items-center justify-center rounded-full bg-primary/20">
                      <Play className="size-7 text-primary" />
                    </div>
                    <span className="text-sm font-medium text-muted-foreground">Now Playing</span>
                  </div>
                </div>
                {/* Overlay bar */}
                <div className="absolute bottom-0 left-0 right-0 flex items-center justify-between bg-background/80 px-4 py-2 backdrop-blur">
                  <span className="text-xs font-medium text-foreground">Lofi Chill Beats - Study Session</span>
                  <div className="flex items-center gap-3">
                    <span className="flex items-center gap-1 text-xs text-primary">
                      <ThumbsUp className="size-3" /> 142 upvotes
                    </span>
                  </div>
                </div>
              </div>

              {/* Queue */}
              <div className="flex flex-col gap-1 p-3">
                <span className="pb-1 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Up Next
                </span>
                {[
                  { title: "Epic Gaming Montage 2026", votes: 89 },
                  { title: "Synthwave Mix - Retro Vibes", votes: 67 },
                  { title: "Street Performance - NYC Subway", votes: 45 },
                ].map((item, i) => (
                  <div
                    key={i}
                    className="flex items-center justify-between rounded-lg px-3 py-2.5 transition-colors hover:bg-secondary"
                  >
                    <div className="flex items-center gap-3">
                      <span className="flex size-6 items-center justify-center rounded bg-secondary text-xs font-bold text-muted-foreground">
                        {i + 1}
                      </span>
                      <span className="text-sm font-medium text-foreground">{item.title}</span>
                    </div>
                    <button className="flex items-center gap-1 rounded-md px-2 py-1 text-xs text-primary transition-colors hover:bg-primary/10">
                      <ThumbsUp className="size-3" /> {item.votes}
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Floating badges */}
            <div className="absolute -right-3 -top-3 rounded-lg border border-border bg-card px-3 py-2 shadow-lg">
              <div className="flex items-center gap-2">
                <div className="size-2 rounded-full bg-primary" />
                <span className="text-xs font-medium text-foreground">347 watching</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
