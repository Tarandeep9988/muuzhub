import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"

export function CTA() {
  return (
    <section className="border-t border-border/50 py-24 lg:py-32">
      <div className="mx-auto max-w-7xl px-6">
        <div className="relative overflow-hidden rounded-2xl border border-border/50 bg-card p-12 md:p-16 lg:p-20">
          {/* Background glow */}
          <div className="pointer-events-none absolute left-1/2 top-0 size-[500px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/5 blur-[100px]" />

          <div className="relative mx-auto flex max-w-2xl flex-col items-center gap-8 text-center">
            <h2 className="text-balance font-mono text-3xl font-bold tracking-tight text-foreground md:text-4xl lg:text-5xl">
              Ready to let the crowd decide?
            </h2>
            <p className="max-w-lg text-pretty text-lg leading-relaxed text-muted-foreground">
              Create your first stream for free. No credit card needed, no setup
              hassle. Just share the link and start voting.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-4">
              <Button size="lg" className="gap-2 font-semibold">
                Start Streaming Free
                <ArrowRight className="size-4" />
              </Button>
              <Button variant="outline" size="lg" className="text-foreground">
                View Documentation
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
