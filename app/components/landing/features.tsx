import {
  ThumbsUp,
  Radio,
  Users,
  Shield,
  Zap,
  ListOrdered,
} from "lucide-react"

const features = [
  {
    icon: Radio,
    title: "Create Streams Instantly",
    description:
      "Spin up a collaborative stream in seconds. Share the link and let anyone add videos to the queue.",
  },
  {
    icon: ThumbsUp,
    title: "Upvote to Vote",
    description:
      "Every viewer gets a voice. Upvote videos you want to see and influence what plays next.",
  },
  {
    icon: ListOrdered,
    title: "Democratic Queue",
    description:
      "The most upvoted video automatically plays next on the central server. The crowd controls the playlist.",
  },
  {
    icon: Users,
    title: "Real-Time Collaboration",
    description:
      "See votes update live. Watch as the queue reshuffles in real-time based on community preferences.",
  },
  {
    icon: Shield,
    title: "Moderation Tools",
    description:
      "Stream owners get powerful moderation controls. Block content, set rules, and keep the vibe right.",
  },
  {
    icon: Zap,
    title: "Zero Latency Sync",
    description:
      "Everyone sees the same video at the same time. Our sync engine keeps the experience seamless.",
  },
]

export function Features() {
  return (
    <section id="features" className="relative border-t border-border/50 py-24 lg:py-32">
      <div className="mx-auto max-w-7xl px-6">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-sm font-semibold uppercase tracking-wider text-primary">
            Features
          </p>
          <h2 className="mt-3 text-balance font-mono text-3xl font-bold tracking-tight text-foreground md:text-4xl">
            Everything you need to run a crowd-powered stream
          </h2>
          <p className="mt-4 text-pretty text-lg leading-relaxed text-muted-foreground">
            Built for watch parties, events, offices, and communities who want
            to decide together what plays on screen.
          </p>
        </div>

        <div className="mt-16 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {features.map((feature) => (
            <div
              key={feature.title}
              className="group flex flex-col gap-4 rounded-xl border border-border/50 bg-card p-6 transition-all hover:border-primary/30 hover:bg-card/80"
            >
              <div className="flex size-10 items-center justify-center rounded-lg bg-primary/10">
                <feature.icon className="size-5 text-primary" />
              </div>
              <h3 className="font-mono text-lg font-semibold text-foreground">
                {feature.title}
              </h3>
              <p className="text-sm leading-relaxed text-muted-foreground">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
