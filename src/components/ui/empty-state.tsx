import type { ReactNode } from "react";

type EmptyStateProps = {
  icon: ReactNode;
  title: string;
  description: string;
  action?: ReactNode;
};

export function EmptyState({ icon, title, description, action }: EmptyStateProps) {
  return (
    <div className="rounded-xl border border-line bg-surface px-6 py-14 sm:px-12 sm:py-16">
      <div className="mx-auto flex max-w-md flex-col items-center text-center">
        <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-accent-soft text-accent">
          {icon}
        </div>
        <h2 className="mt-5 text-lg font-semibold tracking-tight text-ink">{title}</h2>
        <p className="mt-2 text-sm leading-6 text-muted">{description}</p>
        {action ? <div className="mt-7">{action}</div> : null}
      </div>
    </div>
  );
}
