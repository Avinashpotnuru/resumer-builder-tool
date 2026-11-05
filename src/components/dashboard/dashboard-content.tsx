"use client";

import Link from "next/link";
import type { ReactNode } from "react";

import { ActionLink } from "@/components/ui/action-link";
import { EmptyState } from "@/components/ui/empty-state";
import {
  ClockIcon,
  FilesIcon,
  LayersIcon,
  TargetIcon,
} from "@/components/ui/icons";
import { RESUME_TEMPLATE_LABELS } from "@/lib/resume/editor-store";
import {
  useIsClient,
  useResumeLibrary,
} from "@/lib/resume/use-resume-library";
import type { TailoredResumeRecord } from "@/lib/resume/persistence";

function formatShortDate(value: string): string {
  const time = Date.parse(value);
  if (Number.isNaN(time)) return "Unknown date";

  return new Date(time).toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function relativeTime(value: string): string {
  const time = Date.parse(value);
  if (Number.isNaN(time)) return "Unknown";

  const diffMs = Date.now() - time;
  const minutes = Math.floor(diffMs / 60_000);

  if (minutes < 1) return "Just now";
  if (minutes < 60) return `${minutes} minute${minutes === 1 ? "" : "s"} ago`;

  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours} hour${hours === 1 ? "" : "s"} ago`;

  const days = Math.floor(hours / 24);
  if (days < 30) return `${days} day${days === 1 ? "" : "s"} ago`;

  const months = Math.floor(days / 30);
  if (months < 12) return `${months} month${months === 1 ? "" : "s"} ago`;

  const years = Math.floor(months / 12);
  return `${years} year${years === 1 ? "" : "s"} ago`;
}

function recordTitle(record: TailoredResumeRecord): string {
  return (
    record.targetJobTitle.trim() ||
    record.resume.personalInfo?.fullName?.trim() ||
    record.resume.jobTitle?.trim() ||
    "Untitled resume"
  );
}

function StatCard({
  label,
  value,
  hint,
  icon,
}: {
  label: string;
  value: string;
  hint: string;
  icon: ReactNode;
}) {
  return (
    <div className="rounded-2xl border border-line bg-surface p-6 shadow-sm">
      <div className="flex items-start justify-between gap-4">
        <dt className="text-[10px] font-semibold uppercase tracking-[0.22em] text-muted">
          {label}
        </dt>
        <span aria-hidden="true" className="text-muted/30">
          {icon}
        </span>
      </div>
      <dd className="mt-5">
        <p className="text-3xl font-bold tabular-nums tracking-tight text-ink sm:text-4xl">
          {value}
        </p>
        <p className="mt-2 text-xs leading-5 text-muted">{hint}</p>
      </dd>
    </div>
  );
}

function DashboardSkeleton() {
  return (
    <div aria-hidden="true" className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {[0, 1, 2].map((item) => (
          <div
            key={item}
            className="h-48 animate-pulse rounded-2xl border border-line bg-surface"
          />
        ))}
      </div>
      <div className="h-64 animate-pulse rounded-2xl border border-line bg-surface" />
    </div>
  );
}

export function DashboardContent() {
  const library = useResumeLibrary();
  const isClient = useIsClient();

  if (!isClient) {
    return <DashboardSkeleton />;
  }

  const originalsById = new Map(
    library.originals.map((item) => [item.id, item] as const),
  );

  const recent = [...library.tailored].sort((a, b) => {
    const first = Date.parse(a.updatedAt);
    const second = Date.parse(b.updatedAt);
    return (
      (Number.isNaN(second) ? 0 : second) - (Number.isNaN(first) ? 0 : first)
    );
  });

  const latestUpdate = recent[0]?.updatedAt ?? null;
  const tailoredCount = library.tailored.length;
  const originalsCount = library.originals.length;

  return (
    <div className="space-y-10">
      <section aria-label="Resume summary">
        <dl className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard
            label="Total Resumes"
            value={String(tailoredCount)}
            hint="Saved versions in your workspace"
            icon={<FilesIcon className="h-[18px] w-[18px]" />}
          />
          <StatCard
            label="Source Resumes"
            value={String(originalsCount)}
            hint="Original files on file — never overwritten"
            icon={<TargetIcon className="h-[18px] w-[18px]" />}
          />
          <StatCard
            label="Recent Activity"
            value={latestUpdate ? relativeTime(latestUpdate) : "No activity yet"}
            hint={
              latestUpdate
                ? `Latest save · ${formatShortDate(latestUpdate)}`
                : "Create your first resume to get started"
            }
            icon={<ClockIcon className="h-[18px] w-[18px]" />}
          />
          <StatCard
            label="Templates Used"
            value="8"
            hint="ATS-safe layouts available"
            icon={<LayersIcon className="h-[18px] w-[18px]" />}
          />
        </dl>
      </section>

      <section className="space-y-4">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <h2 className="text-base font-bold tracking-tight text-ink">
              Recent Resumes
            </h2>
            <p className="mt-1 text-xs leading-5 text-muted">
              The versions you touched most recently.
            </p>
          </div>
          <Link
            href="/resumes"
            className="rounded-lg border border-line bg-surface px-3 py-2 text-xs font-medium text-accent transition-colors hover:bg-primary/50 hover:text-primary focus-visible:ring-2 focus-visible:ring-primary/40 focus-visible:outline-none underline-offset-4 hover:underline"
          >
            View all
          </Link>
        </div>

        {recent.length > 0 ? (
          <ul className="divide-y divide-line overflow-hidden rounded-2xl border border-line bg-surface">
            {recent.slice(0, 5).map((record) => {
              const original = originalsById.get(record.originalResumeId);
              const originalName =
                original?.data.jobTitle?.trim() || "the stored original";

              return (
                <li key={record.id}>
                  <Link
                    href={`/resumes/${record.id}`}
                    className="flex flex-col gap-3 px-5 py-4 transition-colors hover:bg-surface/50 focus-visible:bg-surface/50 focus-visible:outline-none sm:flex-row sm:items-center sm:justify-between sm:px-6"
                  >
                    <div className="flex min-w-0 items-start gap-3">
                      <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-surface/50 text-muted">
                        <FilesIcon className="h-4 w-4" />
                      </span>
                      <div className="min-w-0">
                        <p className="truncate text-sm font-bold text-ink">
                          {recordTitle(record)}
                        </p>
                        <p className="mt-0.5 text-[11px] leading-5 text-muted">
                          {record.companyName.trim()
                            ? record.companyName
                            : `Tailored from ${originalName}`}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 pl-12 sm:shrink-0 sm:justify-end sm:pl-0">
                      <span className="inline-flex items-center rounded-full bg-surface px-2.5 py-1 text-[10px] font-medium uppercase tracking-[0.12em] text-muted border border-line">
                        {RESUME_TEMPLATE_LABELS[record.template]}
                      </span>
                      <span className="whitespace-nowrap text-[11px] text-muted">
                        {relativeTime(record.updatedAt)}
                      </span>
                    </div>
                  </Link>
                </li>
              );
            })}
          </ul>
        ) : (
          <EmptyState
            icon={<FilesIcon className="h-5 w-5" />}
            title="No resumes yet"
            description="Tailor a resume for a role or build one from your existing file. Your saved versions will appear here."
            action={
              <ActionLink href="/resumes/new">Choose how to start</ActionLink>
            }
          />
        )}
      </section>
    </div>
  );
}
