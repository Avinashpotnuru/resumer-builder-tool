"use client";

import { useEffect, useState, useSyncExternalStore } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  CloseIcon,
  HelpIcon,
  LogoIcon,
  MenuIcon,
} from "@/components/ui/icons";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import {
  WELCOME_DISMISSED_KEY,
  WelcomeModal,
} from "@/components/workspace/welcome-modal";

const navItems = [
  { href: "/", label: "Home" },
  { href: "/templates", label: "Templates" },
  { href: "/#features", label: "Features" },
] as const;

const subscribeToHydration = () => () => {};

function readWelcomeDismissed(): boolean {
  try {
    return Boolean(window.localStorage.getItem(WELCOME_DISMISSED_KEY));
  } catch {
    return false;
  }
}

type PublicHeaderProps = {
  /**
   * "home" applies the landing-page visual treatment only. Every other route
   * keeps the default header unchanged.
   */
  variant?: "default" | "home";
};

export function PublicHeader({ variant = "default" }: PublicHeaderProps) {
  const isHome = variant === "home";
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const isClient = useSyncExternalStore(
    subscribeToHydration,
    () => true,
    () => false,
  );
  const [dismissed, setDismissed] = useState(readWelcomeDismissed);
  const [helpOpen, setHelpOpen] = useState(false);

  const welcomeOpen = isClient && (!dismissed || helpOpen);

  useEffect(() => {
    if (!open) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [open]);

  const closeMenu = () => setOpen(false);

  const dismissWelcome = () => {
    setDismissed(true);
    setHelpOpen(false);

    try {
      window.localStorage.setItem(WELCOME_DISMISSED_KEY, "1");
    } catch {
      // Keep the session-scoped dismissal even if persistence fails.
    }
  };

  const openHelp = () => {
    setOpen(false);
    setHelpOpen(true);
  };

  return (
    <>
      <header
        className={
          isHome
            ? "sticky top-0 z-40 border-b border-line/80 bg-background/85 backdrop-blur-xl"
            : "sticky top-0 z-40 border-b border-line bg-background/90 backdrop-blur-md"
        }
      >
        <div
          className={
            isHome
              ? "mx-auto flex h-[72px] w-full max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8"
              : "mx-auto flex h-16 w-full max-w-6xl items-center justify-between gap-4 px-4 sm:px-6"
          }
        >
          <Link
            href="/"
            className="flex items-center gap-2.5 rounded-md outline-none transition-opacity hover:opacity-80 focus-visible:ring-2 focus-visible:ring-ring/40"
            aria-label="HonestCV — home"
          >
            <span
              className={
                isHome
                  ? "flex h-9 w-9 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-[0_8px_20px_-12px_rgba(31,61,51,0.9)]"
                  : "flex h-8 w-8 items-center justify-center rounded-md bg-ink text-surface"
              }
            >
              <LogoIcon className={isHome ? "h-5 w-5" : "h-4.5 w-4.5"} />
            </span>
            <span
              className={
                isHome
                  ? "font-heading text-[21px] font-semibold leading-none tracking-[-0.02em] text-ink"
                  : "font-serif text-[19px] font-semibold leading-none tracking-tight text-ink"
              }
            >
              HonestCV
            </span>
          </Link>

          <nav
            aria-label="Primary"
            className={
              isHome
                ? "hidden items-center gap-9 md:flex"
                : "hidden items-center gap-7 md:flex"
            }
          >
            {navItems.map((item) => {
              const active =
                item.href === "/"
                  ? pathname === "/"
                  : item.href !== "/#features" && pathname.startsWith("/templates");

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  aria-current={active ? "page" : undefined}
                  className={
                    isHome
                      ? `relative text-[13px] font-medium tracking-[0.01em] transition-colors hover:text-ink ${
                          active ? "text-ink" : "text-muted"
                        }`
                      : "text-[13.5px] font-medium text-muted transition-colors hover:text-ink"
                  }
                >
                  {item.label}
                  {isHome && active ? (
                    <span
                      aria-hidden="true"
                      className="absolute -bottom-[26px] left-0 h-px w-full bg-accent"
                    />
                  ) : null}
                </Link>
              );
            })}
          </nav>

          <div className="flex items-center gap-2">
            <ThemeToggle />
            <button
              type="button"
              onClick={openHelp}
              aria-label="Open getting started guide"
              title="Getting started"
              className={
                isHome
                  ? "inline-flex h-10 w-10 items-center justify-center rounded-full text-muted transition-colors hover:bg-accent-soft hover:text-ink focus-visible:ring-2 focus-visible:ring-ring/40 focus-visible:outline-none"
                  : "inline-flex h-10 w-10 items-center justify-center rounded-md text-ink/65 transition-colors hover:bg-muted hover:text-ink focus-visible:ring-2 focus-visible:ring-ring/40 focus-visible:outline-none"
              }
            >
              <HelpIcon className="h-5 w-5" />
            </button>
            <Link
              href="/resumes/new"
              className={
                isHome
                  ? "hidden h-10 items-center justify-center rounded-full bg-primary px-5 text-[12.5px] font-medium tracking-[0.01em] text-primary-foreground transition-colors hover:bg-accent focus-visible:ring-2 focus-visible:ring-ring/40 focus-visible:outline-none sm:inline-flex"
                  : "hidden h-10 items-center justify-center rounded-md bg-ink px-4 text-[13px] font-medium text-surface transition-colors hover:bg-accent-strong focus-visible:ring-2 focus-visible:ring-ring/40 focus-visible:outline-none sm:inline-flex"
              }
            >
              Get started
            </Link>
            <button
              type="button"
              className={
                isHome
                  ? "inline-flex h-10 w-10 items-center justify-center rounded-full text-ink transition-colors hover:bg-accent-soft focus-visible:ring-2 focus-visible:ring-ring/40 focus-visible:outline-none md:hidden"
                  : "inline-flex h-10 w-10 items-center justify-center rounded-md text-ink transition-colors hover:bg-muted focus-visible:ring-2 focus-visible:ring-ring/40 focus-visible:outline-none md:hidden"
              }
              aria-expanded={open}
              aria-controls="public-mobile-nav"
              onClick={() => setOpen((value) => !value)}
            >
              {open ? <CloseIcon className="h-5 w-5" /> : <MenuIcon className="h-5 w-5" />}
              <span className="sr-only">{open ? "Close menu" : "Open menu"}</span>
            </button>
          </div>
        </div>

        {open ? (
          <div
            id="public-mobile-nav"
            className={
              isHome
                ? "border-t border-line/80 bg-background md:hidden"
                : "border-t border-line bg-background md:hidden"
            }
          >
            <nav
              aria-label="Mobile"
              className={
                isHome
                  ? "mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8"
                  : "mx-auto max-w-6xl px-4 py-4 sm:px-6"
              }
            >
              <ul className="divide-y divide-line">
                {navItems.map((item) => (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      onClick={closeMenu}
                      className="block py-3 text-[15px] font-medium text-ink"
                    >
                      {item.label}
                    </Link>
                  </li>
                ))}
                <li>
                  <button
                    type="button"
                    onClick={openHelp}
                    className="block w-full py-3 text-left text-[15px] font-medium text-ink"
                  >
                    Getting started
                  </button>
                </li>
                <li>
                  <Link
                    href="/resumes/new"
                    onClick={closeMenu}
                    className="block py-3 text-[15px] font-semibold text-accent-strong"
                  >
                    Get started
                  </Link>
                </li>
              </ul>
            </nav>
          </div>
        ) : null}
      </header>

      <WelcomeModal open={welcomeOpen} onDismiss={dismissWelcome} />
    </>
  );
}
