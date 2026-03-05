import { MonitorPlay, PlusCircle, Vote, Play } from "lucide-react"

const steps = [
  {
    icon: MonitorPlay,
    step: "01",
    title: "Create a Stream",
    description:
      "Start a new stream room and share the invite link with your group, community, or event audience.",
  },
  {
    icon: PlusCircle,
    step: "02",
    title: "Add Videos",
    description:
      "Anyone in the room can submit videos to the queue. Paste a link and it gets added for everyone to see.",
  },
  {
    icon: Vote,
    step: "03",
    title: "Upvote to Vote",
    description:
      "Upvote videos you want to watch. The queue reorders in real-time based on votes.",
  },
  {
    icon: Play,
    step: "04",
    title: "Watch Together",
    description:
      "The top-voted video plays automatically on the central server. When it ends, the next most-voted takes over.",
  },
]

export function HowItWorks() {
  return (
    <section id="how-it-works" className="relative border-t border-border/50 py-24 lg:py-32">
      <div className="mx-auto max-w-7xl px-6">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-sm font-semibold uppercase tracking-wider text-primary">
            How It Works
          </p>
          <h2 className="mt-3 text-balance font-mono text-3xl font-bold tracking-tight text-foreground md:text-4xl">
            From zero to streaming in under a minute
          </h2>
        </div>

        <div className="mt-16 grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          {steps.map((step, index) => (
            <div key={step.step} className="relative flex flex-col gap-4">
              {/* Connector line */}
              {index < steps.length - 1 && (
                <div className="absolute left-1/2 top-6 hidden h-px w-full bg-border/50 lg:block" />
              )}

              <div className="relative flex flex-col items-center gap-4 text-center">
                <div className="relative z-10 flex size-12 items-center justify-center rounded-full border border-primary/30 bg-background">
                  <step.icon className="size-5 text-primary" />
                </div>
                <span className="font-mono text-xs font-bold uppercase tracking-widest text-primary">
                  Step {step.step}
                </span>
                <h3 className="font-mono text-lg font-semibold text-foreground">
                  {step.title}
                </h3>
                <p className="text-sm leading-relaxed text-muted-foreground">
                  {step.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
