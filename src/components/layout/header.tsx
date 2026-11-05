"use client";

import { usePathname } from "next/navigation";
import { getPageTitle } from "@/lib/navigation";
import { MenuIcon, UserIcon } from "@/components/ui/icons";

type HeaderProps = {
  onMenuClick: () => void;
};

export function Header({ onMenuClick }: HeaderProps) {
  const pathname = usePathname();
  const title = getPageTitle(pathname);

  return (
    <header className="sticky top-0 z-30 border-b border-line bg-background/90 backdrop-blur-md">
      <div className="flex h-16 items-center gap-2 px-4 sm:gap-4 sm:px-6 lg:px-10">
        <button
          type="button"
          onClick={onMenuClick}
          className="-ml-1 inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-lg text-ink/60 transition-colors hover:bg-ink/5 hover:text-ink focus-visible:ring-2 focus-visible:ring-ring/40 focus-visible:ring-offset-2 focus-visible:ring-offset-surface focus-visible:outline-none lg:hidden"
        >
          <MenuIcon className="h-5 w-5" />
          <span className="sr-only">Open navigation</span>
        </button>

        <h1 className="min-w-0 truncate text-lg font-semibold tracking-tight text-ink sm:text-xl">
          {title}
        </h1>

        <div className="ml-auto flex items-center gap-2 sm:gap-4">
          <span aria-hidden="true" className="hidden h-6 w-px bg-line sm:block" />
          <div className="flex h-10 w-10 items-center justify-center rounded-full border border-line bg-surface text-muted shadow-[0_1px_2px_rgba(15,23,42,0.06)]">
            <UserIcon className="h-[18px] w-[18px]" />
            <span className="sr-only">User avatar</span>
          </div>
        </div>
      </div>
    </header>
  );
}
