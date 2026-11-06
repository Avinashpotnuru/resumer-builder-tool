import Link from "next/link";
import type { ReactNode } from "react";
import { ArrowRightIcon } from "./icons";

type ActionLinkProps = {
  href: string;
  children: ReactNode;
  variant?: "primary" | "quiet";
};

const baseClassName =
  "inline-flex h-11 items-center justify-center gap-2 rounded-full text-[13px] font-medium transition-colors duration-150 focus-visible:ring-2 focus-visible:ring-ring/40 focus-visible:ring-offset-2 focus-visible:ring-offset-surface focus-visible:outline-none";

const variantClassNames = {
  primary:
    "group bg-primary px-5 text-primary-foreground shadow-[0_14px_30px_-20px_rgba(31,61,51,0.9)] hover:bg-accent",
  quiet: "px-4 text-muted hover:bg-accent-soft/60 hover:text-ink",
} as const;

export function ActionLink({ href, children, variant = "primary" }: ActionLinkProps) {
  return (
    <Link href={href} className={`${baseClassName} ${variantClassNames[variant]}`}>
      {children}
      {variant === "primary" ? (
        <ArrowRightIcon className="h-4 w-4 transition-transform duration-150 group-hover:translate-x-0.5" />
      ) : null}
    </Link>
  );
}
