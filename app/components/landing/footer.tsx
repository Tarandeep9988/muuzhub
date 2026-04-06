import { Play } from "lucide-react"

const links = {
  Product: ["Features", "Pricing", "Changelog", "Integrations"],
  Resources: ["Documentation", "API Reference", "Guides", "Blog"],
  Company: ["About", "Careers", "Contact", "Press"],
  Legal: ["Privacy", "Terms", "Cookies"],
}

export function Footer() {
  return (
    <footer className="border-t border-border/50 py-16">
      <div className="mx-auto max-w-7xl px-6">
        <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-5">
          <div className="lg:col-span-2">
            <a href="/" className="flex items-center gap-2">
              <div className="flex size-8 items-center justify-center rounded-lg bg-primary">
                <Play className="size-4 text-primary-foreground" />
              </div>
              <span className="text-lg font-bold tracking-tight text-foreground">
                muuzHub
              </span>
            </a>
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-muted-foreground">
              The democratic video streaming platform. Let the crowd decide what
              plays next.
            </p>
          </div>

          {Object.entries(links).map(([category, items]) => (
            <div key={category}>
              <h4 className="text-sm font-semibold text-foreground">{category}</h4>
              <ul className="mt-4 flex flex-col gap-3">
                {items.map((item) => (
                  <li key={item}>
                    <a
                      href="#"
                      className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                    >
                      {item}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-16 flex flex-col items-center justify-between gap-4 border-t border-border/50 pt-8 md:flex-row">
          <p className="text-xs text-muted-foreground">
            &copy; {new Date().getFullYear()} muuzHub. All rights reserved.
          </p>
          <div className="flex items-center gap-6">
            <a href="#" className="text-xs text-muted-foreground transition-colors hover:text-foreground">
              Twitter
            </a>
            <a href="#" className="text-xs text-muted-foreground transition-colors hover:text-foreground">
              GitHub
            </a>
            <a href="#" className="text-xs text-muted-foreground transition-colors hover:text-foreground">
              Discord
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}
