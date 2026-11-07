"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import {
  ArrowRightIcon,
  DocumentPlusIcon,
} from "@/components/ui/icons";
import { createEmptyPersonalInfo } from "@/lib/resume/editor-store";
import type { AnyTemplateId } from "@/lib/resume/editor-store";
import { createOriginalResume } from "@/lib/resume/source-tracking";
import { saveTailoredResume } from "@/lib/resume/persistence";

function createId(): string {
  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
    return crypto.randomUUID();
  }

  return `${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
}

export function BlankResumeOption({
  initialTemplate,
}: {
  initialTemplate: AnyTemplateId;
}) {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [creating, setCreating] = useState(false);

  const startBlank = () => {
    setError(null);
    setCreating(true);

    const id = createId();

    const blankEditor = {
      jobTitle: null,
      professionalSummary: null,
      skills: [],
      experience: [],
      projects: [],
      education: [],
      personalInfo: createEmptyPersonalInfo(),
      certifications: [],
      additionalSections: [],
    };

    const original = createOriginalResume({
      id,
      jobTitle: null,
      professionalSummary: null,
      skills: [],
      experience: [],
      projects: [],
      personalInfo: createEmptyPersonalInfo(),
      certifications: [],
      additionalSections: [],
    });

    const saved = saveTailoredResume({
      original,
      targetJobTitle: "",
      companyName: "",
      template: initialTemplate,
      sectionOrder: ["summary", "skills", "experience", "projects", "education"],
      resume: blankEditor,
    });

    if (!saved) {
      setError(
        "A blank resume could not be created in this browser. Make sure local storage is available and try again.",
      );
      setCreating(false);
      return;
    }

    router.push(`/resumes/${saved.id}`);
  };

  return (
    <div className="flex flex-col items-start gap-4 rounded-[26px] border border-dashed border-line bg-card/60 p-6 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex items-start gap-4">
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-line bg-background text-primary">
          <DocumentPlusIcon className="h-4.5 w-4.5" />
        </span>
        <div>
          <p className="font-heading text-lg font-semibold tracking-[-0.01em] text-ink">
            No resume file yet?
          </p>
          <p className="mt-1 text-[12px] leading-5 text-muted">
            Skip the upload and fill in the guided editor from scratch.
          </p>
        </div>
      </div>
      <button
        type="button"
        onClick={startBlank}
        disabled={creating}
        className="group inline-flex h-10 shrink-0 items-center gap-2 rounded-full border border-line bg-card px-5 text-xs font-medium text-ink transition-colors hover:border-primary/40 hover:bg-accent-soft/50 focus-visible:ring-2 focus-visible:ring-ring/40 focus-visible:outline-none disabled:cursor-wait disabled:opacity-60"
      >
        {creating ? "Opening editor…" : "Start blank"}
        <ArrowRightIcon className="h-3.5 w-3.5 transition-transform duration-150 group-hover:translate-x-0.5" />
      </button>
      {error ? (
        <p role="alert" className="w-full text-[11px] text-danger">
          {error}
        </p>
      ) : null}
    </div>
  );
}
