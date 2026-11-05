"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { isActivePath, navigation } from "@/lib/navigation";
import {
  CloseIcon,
  DashboardIcon,
  DocumentPlusIcon,
  FilesIcon,
  LogoIcon,
} from "@/components/ui/icons";

type SidebarProps = {
  open: boolean;
  onNavigate: () => void;
  onClose: () => void;
};

const icons = {
  dashboard: DashboardIcon,
  create: DocumentPlusIcon,
  resumes: FilesIcon,
} as const;

export function Sidebar({ open, onNavigate, onClose }: SidebarProps) {
  const pathname = usePathname();

  return (
    <aside
      aria-label="Main navigation"
      className={[
        "fixed inset-y-0 left-0 z-50 flex w-[272px] shrink-0 flex-col overflow-hidden border-r border-line bg-surface px-5 pb-8 pt-6",
        "transition-[transform,visibility] duration-300 ease-out",
        "lg:visible lg:translate-x-0 lg:shadow-none",
        open ? "visible translate-x-0 shadow-[0_24px_60px_-24px_rgba(15,23,42,0.12)]" : "invisible -translate-x-full",
      ].join(" ")}
    >
      {/* Logo / brand area */}
      <div className="relative flex items-center justify-between gap-2 mb-8">
        <Link
          href="/dashboard"
          onClick={onNavigate}
          className="group flex items-center gap-2.5 rounded-lg px-1 py-1 focus-visible:ring-2 focus-visible:ring-ring/40 focus-visible:ring-offset-2 focus-visible:ring-offset-surface focus-visible:outline-none"
        >
          <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary text-surface shadow-sm">
            <LogoIcon className="h-5 w-5" />
          </span>
          <span className="flex flex-col leading-tight">
            <span className="text-[15px] font-semibold tracking-tight text-ink">
              HonestCV
            </span>
            <span className="mt-0.5 text-[10px] font-medium uppercase tracking-[0.18em] text-muted">
              Workspace
            </span>
          </span>
        </Link>

        <button
          type="button"
          onClick={onClose}
          className="inline-flex h-10 w-10 items-center justify-center rounded-lg text-muted transition-colors hover:bg-surface/50 hover:text-ink focus-visible:ring-2 focus-visible:ring-ring/40 focus-visible:ring-offset-2 focus-visible:ring-offset-surface focus-visible:outline-none lg:hidden"
          aria-label="Close navigation"
        >
          <CloseIcon className="h-5 w-5" />
        </button>
      </div>

      {/* Navigation */}
      <nav aria-label="Primary" className="flex-1">
        <p className="px-0.5 text-[10px] font-semibold uppercase tracking-[0.22em] text-muted mb-4">
          Navigation
        </p>
        <ul className="space-y-0.5">
          {navigation.map((item) => {
            const active = isActivePath(pathname, item.href);
            const Icon = icons[item.icon];

            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  onClick={onNavigate}
                  aria-current={active ? "page" : undefined}
                  className={[
                    "relative flex h-10 items-center gap-3 rounded-lg px-3 text-sm transition-colors duration-200 focus-visible:ring-2 focus-visible:ring-ring/40 focus-visible:ring-offset-1 focus-visible:outline-none",
                    active
                      ? "bg-primary/10 text-primary font-medium"
                      : "text-muted/60 hover:bg-surface/50 hover:text-ink",
                  ].join(" ")}
                >
                  {active ? (
                    <span
                      aria-hidden="true"
                      className="absolute left-0 top-1/2 h-[16px] w-[2px] -translate-y-1/2 rounded-full bg-primary"
                    />
                  ) : null}
                  <Icon
                    className={
                      active
                        ? "h-[17px] w-[17px] shrink-0 text-primary"
                        : "h-[17px] w-[17px] shrink-0 text-muted/40"
                    }
                  />
                  <span className={active ? "font-medium" : undefined}>
                    {item.label}
                  </span>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Bottom section */}
      <div className="relative border-t border-line pt-6 mt-auto">
        <Link
          href="/"
          onClick={onNavigate}
          className="group flex h-10 items-center gap-2.5 rounded-lg px-3 text-sm transition-colors duration-200 focus-visible:ring-2 focus-visible:ring-ring/40 focus-visible:ring-offset-1 focus-visible:outline-none"
        >
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={1.6}
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
            className="h-5 w-5 shrink-0 text-muted/50 transition-transform duration-200 group-hover:-translate-x-0.5"
          >
            <path d="M10 6H6a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-4" />
            <path d="M14 4h6v6" />
            <path d="M20 4 10.5 13.5" />
          </svg>
          <span className="text-muted/70 group-hover:text-ink transition-colors">
            Back to website
          </span>
        </Link>
      </div>
    </aside>
  );
}
