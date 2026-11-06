import type { ReactNode } from "react";

type EmptyStateProps = {
  icon: ReactNode;
  title: string;
  description: string;
  action?: ReactNode;
};

export function EmptyState({ icon, title, description, action }: EmptyStateProps) {
  return (
    <div className="rounded-[28px] border border-line bg-card px-6 py-14 sm:px-12 sm:py-16">
      <div className="mx-auto flex max-w-md flex-col items-center text-center">
        <div className="flex h-14 w-14 items-center justify-center rounded-full border border-line bg-accent-soft/70 text-accent">
          {icon}
        </div>
        <h2 className="mt-5 font-heading text-2xl font-semibold tracking-[-0.02em] text-ink">
          {title}
        </h2>
        <p className="mt-3 text-sm leading-6 text-muted">{description}</p>
        {action ? <div className="mt-7">{action}</div> : null}
      </div>
    </div>
  );
}
