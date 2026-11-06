import Link from "next/link";
import { LogoIcon } from "@/components/ui/icons";

const columns = [
  {
    title: "Product",
    links: [
      { href: "/resumes/tailor", label: "Tailor for a job" },
      { href: "/resumes/create", label: "Create a new resume" },
      { href: "/templates", label: "Templates" },
      { href: "/#features", label: "Features" },
      { href: "/#how-it-works", label: "How it works" },
      { href: "/#faq", label: "FAQ" },
    ],
  },
  {
    title: "Company",
    links: [
      { href: "/", label: "Home" },
    ],
  },
] as const;

type PublicFooterProps = {
  /**
   * "home" renders the landing-page footer. All other routes keep the
   * existing footer markup untouched.
   */
  variant?: "default" | "home";
};

export function PublicFooter({ variant = "default" }: PublicFooterProps) {
  if (variant === "home") {
    return (
      <footer className="border-t border-line/70 bg-[#14211b] text-[#e9e3d6]">
        <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-12 py-16 md:grid-cols-[minmax(0,1.5fr)_minmax(0,1fr)_minmax(0,1fr)] lg:py-20">
            <div>
              <Link
                href="/"
                className="flex w-fit items-center gap-3 rounded-md focus-visible:ring-2 focus-visible:ring-[#efe9dd]/40 focus-visible:outline-none"
              >
                <span className="flex h-10 w-10 items-center justify-center rounded-full bg-[#efe9dd] text-[#14211b]">
                  <LogoIcon className="h-5 w-5" />
                </span>
                <span className="font-heading text-[24px] font-semibold tracking-[-0.02em]">
                  HonestCV
                </span>
              </Link>
              <p className="mt-5 max-w-sm text-[13.5px] leading-7 text-[#a7b2a8]">
                A resume studio for people who would rather tell the truth
                beautifully than invent a career they don&rsquo;t have.
              </p>
              <p className="mt-6 inline-flex items-center gap-2 rounded-full border border-white/10 px-3 py-1.5 text-[11px] font-medium tracking-[0.02em] text-[#c6cec4]">
                <span
                  aria-hidden="true"
                  className="h-1.5 w-1.5 rounded-full bg-[#d98a6b]"
                />
                Files stay in your browser
              </p>
            </div>

            {columns.map((column) => (
              <nav key={column.title} aria-label={column.title}>
                <h3 className="text-[10.5px] font-semibold uppercase tracking-[0.2em] text-[#8b978c]">
                  {column.title}
                </h3>
                <ul className="mt-5 space-y-3">
                  {column.links.map((link) => (
                    <li key={link.href + link.label}>
                      <Link
                        href={link.href}
                        className="text-[13px] text-[#d6d0c4] transition-colors hover:text-white"
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </nav>
            ))}
          </div>

          <div className="flex flex-col gap-3 border-t border-white/10 py-6 text-[11px] leading-5 text-[#8b978c] sm:flex-row sm:items-center sm:justify-between">
            <p>© 2026 HonestCV. Every word on the page is yours.</p>
            <p>
              Built with{" "}
              <Link
                href="https://avinashpotnuruportfolio.netlify.app/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#d98a6b] hover:text-[#efb499] hover:underline"
              >
                Avinash Potnuru
              </Link>
            </p>
            <p>Tailoring never fabricates skills, employers, or dates.</p>
          </div>
        </div>
      </footer>
    );
  }

  return (
    <footer className="border-t border-line bg-background">
      <div className="mx-auto w-full max-w-6xl px-4 py-12 sm:px-6 sm:py-16">
        <div className="grid gap-10 md:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)_minmax(0,1fr)]">
          <div>
            <Link
              href="/"
              className="flex w-fit items-center gap-2.5 focus-visible:ring-2 focus-visible:ring-ring/40 focus-visible:outline-none"
            >
              <span className="flex h-8 w-8 items-center justify-center rounded-md bg-ink text-surface">
                <LogoIcon className="h-4.5 w-4.5" />
              </span>
              <span className="font-serif text-[19px] font-semibold tracking-tight text-ink">
                HonestCV
              </span>
            </Link>
            <p className="mt-4 max-w-xs text-[13px] leading-6 text-muted">
              A resume studio that helps you tailor what you already have —
              without inventing a single thing.
            </p>
          </div>

          {columns.map((column) => (
            <nav key={column.title} aria-label={column.title}>
              <h3 className="text-[11px] font-semibold uppercase tracking-[0.18em] text-muted">
                {column.title}
              </h3>
              <ul className="mt-4 space-y-2.5">
                {column.links.map((link) => (
                  <li key={link.href + link.label}>
                    <Link
                      href={link.href}
                      className="text-[13px] text-ink/80 transition-colors hover:text-ink"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          ))}
        </div>

        <div className="mt-12 flex flex-col gap-3 border-t border-line pt-6 text-[11px] leading-5 text-muted sm:flex-row sm:items-center sm:justify-between">
          <p className="text-ink/80">
            © 2026 HonestCV. Every word on the page is yours.
          </p>
          <p className="text-ink/80">
            Built with{" "}
            <Link
              href="https://avinashpotnuruportfolio.netlify.app/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-accent-strong hover:text-accent hover:underline"
            >
              Avinash Potnuru
            </Link>
          </p>
          <p className="text-ink/80">
            Tailoring never fabricates skills, employers, or dates. You confirm
            everything before it ships.
          </p>
        </div>
      </div>
    </footer>
  );
}
