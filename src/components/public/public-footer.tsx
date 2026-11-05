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

export function PublicFooter() {
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
          <p>© 2026 HonestCV. Every word on the page is yours.</p>
          <p>
            Tailoring never fabricates skills, employers, or dates. You confirm
            everything before it ships.
          </p>
        </div>
      </div>
    </footer>
  );
}
