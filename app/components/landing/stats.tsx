const stats = [
  { value: "12K+", label: "Active Streams" },
  { value: "2.4M", label: "Votes Cast" },
  { value: "890K", label: "Videos Queued" },
  { value: "99.9%", label: "Uptime" },
]

export function Stats() {
  return (
    <section id="stats" className="border-t border-border/50 py-24 lg:py-32">
      <div className="mx-auto max-w-7xl px-6">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-sm font-semibold uppercase tracking-wider text-primary">
            Community
          </p>
          <h2 className="mt-3 text-balance font-mono text-3xl font-bold tracking-tight text-foreground md:text-4xl">
            Trusted by streamers worldwide
          </h2>
        </div>

        <div className="mt-16 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat) => (
            <div
              key={stat.label}
              className="flex flex-col items-center gap-2 rounded-xl border border-border/50 bg-card p-8 text-center"
            >
              <span className="font-mono text-4xl font-bold text-primary">
                {stat.value}
              </span>
              <span className="text-sm text-muted-foreground">{stat.label}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
