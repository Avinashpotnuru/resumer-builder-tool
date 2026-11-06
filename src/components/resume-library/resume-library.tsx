"use client";

import Link from "next/link";
import { useState } from "react";

import { ActionLink } from "@/components/ui/action-link";
import { EmptyState } from "@/components/ui/empty-state";
import { FilesIcon, TargetIcon, TrashIcon } from "@/components/ui/icons";
import {
  RESUME_TEMPLATE_LABELS,
  type ResumeTemplateId,
} from "@/lib/resume/editor-store";
import {
  deleteTailoredResume,
  type OriginalResumeRecord,
  type TailoredResumeRecord,
} from "@/lib/resume/persistence";
import {
  useIsClient,
  useResumeLibrary,
} from "@/lib/resume/use-resume-library";

function formatDate(value: string): string {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) return "Unknown date";

  return date.toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function originalTitle(original: OriginalResumeRecord): string {
  return original.data.jobTitle?.trim() || "Untitled original resume";
}

function tailoredTitle(record: TailoredResumeRecord): string {
  return (
    record.targetJobTitle.trim() ||
    record.resume.jobTitle?.trim() ||
    "Untitled tailored resume"
  );
}

function TemplateBadge({ template }: { template: ResumeTemplateId }) {
  return (
    <span className="rounded-full border border-line bg-background px-2.5 py-1 text-[10px] font-medium uppercase tracking-[0.12em] text-muted">
      {RESUME_TEMPLATE_LABELS[template]}
    </span>
  );
}

function SavedResumeCard({
  record,
  original,
  onDelete,
}: {
  record: TailoredResumeRecord;
  original: OriginalResumeRecord | null;
  onDelete: (id: string) => void;
}) {
  return (
    <li className="rounded-[22px] border border-line bg-card p-5 transition-colors hover:border-primary/25">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="min-w-0 space-y-1.5">
          <h3 className="truncate font-heading text-lg font-semibold tracking-[-0.01em] text-ink">
            {tailoredTitle(record)}
          </h3>
          <p className="text-xs leading-5 text-muted">
            {record.companyName.trim() || "No company added"}
          </p>
        </div>
        <TemplateBadge template={record.template} />
      </div>

      <dl className="mt-4 grid gap-2 text-[11px] text-muted sm:grid-cols-2">
        <div>
          <dt className="sr-only">Tailored from</dt>
          <dd>
            Tailored from{" "}
            <span className="text-ink">
              {original ? originalTitle(original) : "missing original"}
            </span>
          </dd>
        </div>
        <div>
          <dt className="sr-only">Last updated</dt>
          <dd>Updated {formatDate(record.updatedAt)}</dd>
        </div>
      </dl>

      <div className="mt-5 flex flex-wrap items-center gap-2">
        <Link
          href={`/resumes/${record.id}`}
          className="inline-flex h-9 items-center justify-center rounded-full bg-primary px-4 text-xs font-medium text-primary-foreground transition-colors hover:bg-accent focus-visible:ring-2 focus-visible:ring-ring/40 focus-visible:ring-offset-2 focus-visible:ring-offset-surface focus-visible:outline-none"
        >
          Open resume
        </Link>
        <button
          type="button"
          onClick={() => onDelete(record.id)}
          className="inline-flex h-9 items-center gap-1.5 rounded-full px-3 text-xs font-medium text-danger transition-colors hover:bg-danger-soft focus-visible:ring-2 focus-visible:ring-danger/30 focus-visible:outline-none"
        >
          <TrashIcon className="h-3.5 w-3.5" />
          Delete
        </button>
      </div>
    </li>
  );
}

export function ResumeLibrary() {
  const library = useResumeLibrary();
  const isClient = useIsClient();
  const [error, setError] = useState<string | null>(null);

  const sortedTailored = [...library.tailored].sort((a, b) =>
    b.updatedAt.localeCompare(a.updatedAt),
  );

  const handleDelete = (id: string) => {
    const confirmed = window.confirm(
      "Delete this saved resume version? The original resume will be kept.",
    );
    if (!confirmed) return;

    if (!deleteTailoredResume(id)) {
      setError("This saved resume could not be deleted.");
      return;
    }

    setError(null);
  };

  if (!isClient) {
    return (
      <div
        aria-hidden="true"
        className="h-40 rounded-[22px] border border-line bg-card"
      />
    );
  }

  return (
    <div className="space-y-8">
      {error ? (
        <p
          role="alert"
          className="rounded-lg border border-danger/20 bg-danger-soft px-3 py-2 text-xs leading-5 text-danger"
        >
          {error}
        </p>
      ) : null}

      {sortedTailored.length === 0 ? (
        <EmptyState
          icon={<TargetIcon className="h-5 w-5" />}
          title="No tailored resumes yet"
          description="Save a tailored resume and it will appear here, ready to reopen, update, or delete."
          action={<ActionLink href="/resumes/new">Create a resume</ActionLink>}
        />
      ) : (
        <section aria-labelledby="tailored-resumes-heading" className="space-y-4">
          <div className="flex flex-wrap items-baseline justify-between gap-3">
            <h2
              id="tailored-resumes-heading"
              className="font-heading text-xl font-semibold tracking-[-0.01em] text-ink"
            >
              Tailored versions
            </h2>
            <span className="text-[11px] text-muted">
              {sortedTailored.length}{" "}
              {sortedTailored.length === 1 ? "resume" : "resumes"}
            </span>
          </div>

          <ul className="grid gap-4 lg:grid-cols-2">
            {sortedTailored.map((record) => (
              <SavedResumeCard
                key={record.id}
                record={record}
                original={
                  library.originals.find(
                    (item) => item.id === record.originalResumeId,
                  ) ?? null
                }
                onDelete={handleDelete}
              />
            ))}
          </ul>
        </section>
      )}

      {library.originals.length > 0 ? (
        <section
          aria-labelledby="original-resumes-heading"
          className="rounded-[22px] border border-line bg-card p-5 sm:p-6"
        >
          <div className="flex items-center gap-2">
            <FilesIcon className="h-4 w-4 text-accent" />
            <h2
              id="original-resumes-heading"
              className="font-heading text-xl font-semibold tracking-[-0.01em] text-ink"
            >
              Original resumes
            </h2>
          </div>
          <p className="mt-1 text-xs leading-5 text-muted">
            Your originals are kept separate and are never overwritten by
            tailored versions.
          </p>

          <ul className="mt-4 divide-y divide-line overflow-hidden rounded-xl border border-line">
            {library.originals.map((original) => (
              <li
                key={original.id}
                className="flex flex-wrap items-baseline justify-between gap-2 px-3 py-2.5"
              >
                <span className="text-xs font-medium text-ink">
                  {originalTitle(original)}
                </span>
                <span className="text-[11px] text-muted">
                  Added {formatDate(original.data.createdAt)}
                </span>
              </li>
            ))}
          </ul>
        </section>
      ) : null}
    </div>
  );
}
