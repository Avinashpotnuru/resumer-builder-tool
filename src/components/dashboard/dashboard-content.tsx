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
import { RESUME_TEMPLATE_LABELS, isCustomTemplateId } from "@/lib/resume/editor-store";
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
    <div className="rounded-[22px] border border-line bg-card p-6">
      <div className="flex items-start justify-between gap-4">
        <dt className="text-[9.5px] font-semibold uppercase tracking-[0.22em] text-muted">
          {label}
        </dt>
        <span
          aria-hidden="true"
          className="flex h-8 w-8 items-center justify-center rounded-full border border-line bg-accent-soft/60 text-accent-strong"
        >
          {icon}
        </span>
      </div>
      <dd className="mt-5">
        <p className="font-heading text-3xl font-semibold tabular-nums tracking-[-0.02em] text-ink sm:text-4xl">
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
            className="h-48 animate-pulse rounded-[22px] border border-line bg-card"
          />
        ))}
      </div>
      <div className="h-64 animate-pulse rounded-[22px] border border-line bg-card" />
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
            hint="ATS-safe layouts — or design your own"
            icon={<LayersIcon className="h-[18px] w-[18px]" />}
          />
        </dl>
      </section>

      <section className="overflow-hidden rounded-[26px] border border-primary/20 bg-accent-soft/50 p-6 sm:p-8">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-start gap-4">
            <span
              aria-hidden="true"
              className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-line bg-card text-accent-strong"
            >
              <LayersIcon className="h-5 w-5" />
            </span>
            <div>
              <p className="text-[9.5px] font-semibold uppercase tracking-[0.22em] text-accent">
                Template studio
              </p>
              <h2 className="mt-1.5 font-heading text-xl font-semibold tracking-[-0.02em] text-ink">
                Create your own resume template
              </h2>
              <p className="mt-1.5 max-w-xl text-xs leading-5 text-muted">
                Change fonts, colors, spacing, columns, and section order with a
                live preview. Save it locally and reuse it on any resume.
              </p>
            </div>
          </div>
          <div className="flex shrink-0 flex-wrap items-center gap-2 sm:justify-end">
            <ActionLink href="/templates/custom">Create a template</ActionLink>
            <ActionLink href="/templates" variant="quiet">
              Browse gallery
            </ActionLink>
          </div>
        </div>
      </section>

      <section className="space-y-4">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <h2 className="font-heading text-xl font-semibold tracking-[-0.02em] text-ink">
              Recent Resumes
            </h2>
            <p className="mt-1 text-xs leading-5 text-muted">
              The versions you touched most recently.
            </p>
          </div>
          <Link
            href="/resumes"
            className="rounded-full border border-line bg-card px-4 py-2 text-xs font-medium text-ink transition-colors hover:border-primary/40 hover:bg-accent-soft/50 focus-visible:ring-2 focus-visible:ring-ring/40 focus-visible:outline-none"
          >
            View all
          </Link>
        </div>

        {recent.length > 0 ? (
          <ul className="divide-y divide-line overflow-hidden rounded-[22px] border border-line bg-card">
            {recent.slice(0, 5).map((record) => {
              const original = originalsById.get(record.originalResumeId);
              const originalName =
                original?.data.jobTitle?.trim() || "the stored original";

              return (
                <li key={record.id}>
                  <Link
                    href={`/resumes/${record.id}`}
                    className="flex flex-col gap-3 px-5 py-4 transition-colors hover:bg-accent-soft/30 focus-visible:bg-accent-soft/30 focus-visible:outline-none sm:flex-row sm:items-center sm:justify-between sm:px-6"
                  >
                    <div className="flex min-w-0 items-start gap-3">
                      <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-line bg-background text-accent-strong">
                        <FilesIcon className="h-4 w-4" />
                      </span>
                      <div className="min-w-0">
                        <p className="truncate text-sm font-semibold text-ink">
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
                      <span className="inline-flex items-center rounded-full border border-line bg-background px-2.5 py-1 text-[10px] font-medium uppercase tracking-[0.12em] text-muted">
                        {isCustomTemplateId(record.template)
                          ? "Custom Template"
                          : RESUME_TEMPLATE_LABELS[record.template]}
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
