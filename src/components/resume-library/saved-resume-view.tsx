"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  useCallback,
  useMemo,
  useRef,
  useState,
  type FormEvent,
} from "react";

import {
  ResumeEditor,
  type ResumeEditorSaveData,
} from "@/components/create-resume/resume-editor";
import { ActionLink } from "@/components/ui/action-link";
import { FilesIcon, TrashIcon } from "@/components/ui/icons";
import {
  RESUME_TEMPLATE_LABELS,
  type ResumeTemplateId,
} from "@/lib/resume/editor-store";
import {
  deleteTailoredResume,
  saveTailoredResume,
  toOptimizedResumeData,
  updateTailoredResumeMetadata,
  type OriginalResumeRecord,
  type TailoredResumeRecord,
} from "@/lib/resume/persistence";
import {
  useIsClient,
  useResumeLibrary,
} from "@/lib/resume/use-resume-library";

type SaveStatus = "idle" | "saved" | "error";

const fieldClassName =
  "h-11 w-full rounded-lg border border-line bg-canvas/40 px-3.5 text-sm text-ink transition-colors placeholder:text-muted/60 focus:border-accent focus:bg-surface focus:ring-2 focus:ring-accent/20 focus:outline-none";

function TemplateBadge({ template }: { template: ResumeTemplateId }) {
  return (
    <span className="rounded-full bg-ink/[0.05] px-2.5 py-1 text-[10px] font-medium uppercase tracking-[0.12em] text-muted">
      {RESUME_TEMPLATE_LABELS[template]}
    </span>
  );
}

function StatusMessage({ status }: { status: SaveStatus }) {
  if (status === "saved") {
    return (
      <p role="status" className="text-[11px] text-accent">
        Saved locally in this browser.
      </p>
    );
  }

  if (status === "error") {
    return (
      <p role="alert" className="text-[11px] text-danger">
        Changes could not be saved in this browser.
      </p>
    );
  }

  return null;
}

export function SavedResumeView({ resumeId }: { resumeId: string }) {
  const library = useResumeLibrary();
  const isClient = useIsClient();

  const record =
    library.tailored.find((item) => item.id === resumeId) ?? null;
  const original = record
    ? library.originals.find(
        (item) => item.id === record.originalResumeId,
      ) ?? null
    : null;

  if (!isClient) {
    return (
      <div
        aria-hidden="true"
        className="h-48 rounded-xl border border-line bg-surface"
      />
    );
  }

  if (!record || !original) {
    return (
      <div className="rounded-xl border border-line bg-surface px-6 py-14 sm:px-12 sm:py-16">
        <div className="mx-auto flex max-w-md flex-col items-center text-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-accent-soft text-accent">
            <FilesIcon className="h-5 w-5" />
          </div>
          <h2 className="mt-5 text-lg font-semibold tracking-tight text-ink">
            Saved resume not found
          </h2>
          <p className="mt-2 text-sm leading-6 text-muted">
            This version may have been deleted, or it may be stored in another
            browser.
          </p>
          <div className="mt-7">
            <ActionLink href="/resumes">Back to library</ActionLink>
          </div>
        </div>
      </div>
    );
  }

  return (
    <SavedResumeContent
      key={record.id}
      record={record}
      original={original}
    />
  );
}

function SavedResumeContent({
  record,
  original,
}: {
  record: TailoredResumeRecord;
  original: OriginalResumeRecord;
}) {
  const router = useRouter();
  const targetJobTitleRef = useRef<HTMLInputElement>(null);
  const companyNameRef = useRef<HTMLInputElement>(null);
  const [status, setStatus] = useState<SaveStatus>("idle");

  const optimized = useMemo(() => toOptimizedResumeData(record), [record]);
  const savedVersion = useMemo(
    () => ({
      key: record.id,
      resume: record.resume,
      sectionOrder: record.sectionOrder,
      template: record.template,
    }),
    [record],
  );

  const title =
    record.targetJobTitle.trim() ||
    record.resume.jobTitle?.trim() ||
    "Saved resume";

  const handleSave = useCallback(
    (data: ResumeEditorSaveData) => {
      const result = saveTailoredResume({
        id: record.id,
        original: data.original,
        targetJobTitle:
          targetJobTitleRef.current?.value ?? record.targetJobTitle,
        companyName: companyNameRef.current?.value ?? record.companyName,
        template: data.template,
        sectionOrder: data.sectionOrder,
        resume: data.workingResume,
      });

      if (!result) {
        setStatus("error");
        return false;
      }

      setStatus("saved");
      return true;
    },
    [record.id, record.targetJobTitle, record.companyName],
  );

  const handleMetadataSave = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const result = updateTailoredResumeMetadata(record.id, {
      targetJobTitle: targetJobTitleRef.current?.value ?? "",
      companyName: companyNameRef.current?.value ?? "",
    });

    setStatus(result ? "saved" : "error");
  };

  const handleDelete = () => {
    const confirmed = window.confirm(
      "Delete this saved resume version? The original resume will be kept.",
    );
    if (!confirmed) return;

    if (!deleteTailoredResume(record.id)) {
      setStatus("error");
      return;
    }

    router.push("/resumes");
  };

  return (
    <div className="space-y-8">
      <div className="space-y-5">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="space-y-2">
            <Link
              href="/resumes"
              className="text-[11px] font-medium text-muted transition-colors hover:text-ink"
            >
              ← Back to library
            </Link>
            <h2 className="text-3xl font-semibold leading-tight tracking-tight text-ink sm:text-4xl">
              {title}
            </h2>
            <p className="text-sm leading-6 text-muted">
              {record.companyName.trim() || "No company added"}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <TemplateBadge template={record.template} />
            <button
              type="button"
              onClick={handleDelete}
              className="inline-flex h-9 items-center gap-1.5 rounded-lg px-3 text-xs font-medium text-danger transition-colors hover:bg-danger-soft focus-visible:ring-2 focus-visible:ring-danger/30 focus-visible:outline-none"
            >
              <TrashIcon className="h-3.5 w-3.5" />
              Delete resume
            </button>
          </div>
        </div>

        <form
          onSubmit={handleMetadataSave}
          className="rounded-xl border border-line bg-surface p-5 sm:p-6"
        >
          <div className="flex flex-wrap items-baseline justify-between gap-3">
            <h3 className="text-sm font-semibold tracking-tight text-ink">
              Role details
            </h3>
            <StatusMessage status={status} />
          </div>

          <div className="mt-5 grid gap-4 sm:grid-cols-2">
            <div className="space-y-1.5">
              <label
                htmlFor="saved-job-title"
                className="block text-xs font-medium text-ink"
              >
                Job title
              </label>
              <input
                id="saved-job-title"
                ref={targetJobTitleRef}
                type="text"
                name="jobTitle"
                autoComplete="off"
                defaultValue={record.targetJobTitle}
                placeholder="e.g. Senior Product Designer"
                className={fieldClassName}
              />
            </div>

            <div className="space-y-1.5">
              <label
                htmlFor="saved-company-name"
                className="block text-xs font-medium text-ink"
              >
                Company name
              </label>
              <input
                id="saved-company-name"
                ref={companyNameRef}
                type="text"
                name="companyName"
                autoComplete="organization"
                defaultValue={record.companyName}
                placeholder="e.g. Northwind Studio"
                className={fieldClassName}
              />
            </div>
          </div>

          <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
            <p className="text-[11px] leading-5 text-muted">
              Tailored from{" "}
              <span className="text-ink">
                {original.data.jobTitle?.trim() || "the stored original"}
              </span>
              . The original is never overwritten.
            </p>
            <button
              type="submit"
              className="inline-flex h-9 items-center justify-center rounded-lg border border-line bg-surface px-4 text-xs font-medium text-ink transition-colors hover:bg-ink/5 focus-visible:ring-2 focus-visible:ring-accent/40 focus-visible:ring-offset-2 focus-visible:ring-offset-surface focus-visible:outline-none"
            >
              Save details
            </button>
          </div>
        </form>
      </div>

      <ResumeEditor
        originalResume={original.data}
        optimizedResume={optimized}
        savedVersion={savedVersion}
        onSave={handleSave}
      />
    </div>
  );
}
