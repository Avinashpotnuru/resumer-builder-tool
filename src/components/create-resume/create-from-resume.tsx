"use client";

import { useCallback, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

import { ResumeUpload } from "@/components/create-resume/resume-upload";
import { ArrowRightIcon } from "@/components/ui/icons";
import {
  createDefaultSectionOrder,
  isCustomTemplateId,
  RESUME_TEMPLATE_LABELS,
  RESUME_TEMPLATES,
  type AnyTemplateId,
  type EditorResumeData,
} from "@/lib/resume/editor-store";
import { useCustomTemplates } from "@/lib/resume/use-custom-templates";
import {
  findIdenticalOriginal,
  saveTailoredResume,
} from "@/lib/resume/persistence";
import { createOriginalResumeFromText, parseResumeText } from "@/lib/resume/parse-resume-text";

const selectClassName =
  "h-11 w-full rounded-lg border border-line bg-surface px-3.5 text-sm text-ink transition-colors focus:border-primary focus:ring-2 focus:ring-ring/20 focus:outline-none";

export function CreateFromResume({
  initialTemplate = "professional-classic",
}: {
  initialTemplate?: AnyTemplateId;
}) {
  const router = useRouter();
  const [resumeText, setResumeText] = useState<string | null>(null);
  const [template, setTemplate] = useState<AnyTemplateId>(initialTemplate);
  const customTemplates = useCustomTemplates();
  const [error, setError] = useState<string | null>(null);
  const [isCreating, setCreating] = useState(false);

  const handleExtractedTextChange = useCallback((value: string | null) => {
    setResumeText(value);
    setError(null);
  }, []);

  const handleCreate = useCallback(() => {
    const cleanText = resumeText?.trim() ?? "";

    if (!cleanText) {
      setError(
        "Upload a resume first — we need the file before we can pre-fill your details.",
      );
      return;
    }

    setCreating(true);
    setError(null);

    const parsed = parseResumeText(cleanText);
    const original = createOriginalResumeFromText(cleanText);

    const identical = findIdenticalOriginal(original);
    const originalToSave = identical
      ? {
          ...original,
          id: identical.id,
          createdAt: identical.createdAt,
        }
      : original;

    const workingResume: EditorResumeData = {
      jobTitle: parsed.jobTitle,
      professionalSummary: parsed.professionalSummary,
      skills: [...parsed.skills],
      experience: parsed.experience.map((item) => ({
        ...item,
        achievements: [...item.achievements],
      })),
      projects: parsed.projects.map((item) => ({
        ...item,
        technologies: [...item.technologies],
        achievements: item.achievements ? [...item.achievements] : undefined,
      })),
      education: parsed.education.map((item) => ({ ...item })),
      personalInfo: { ...parsed.personalInfo },
      certifications: [],
      additionalSections: [],
    };

    const saved = saveTailoredResume({
      original: originalToSave,
      targetJobTitle: "",
      companyName: "",
      template,
      sectionOrder: createDefaultSectionOrder(),
      resume: workingResume,
    });

    if (!saved) {
      setCreating(false);
      setError(
        "The resume could not be created in this browser. Make sure local storage is available and try again.",
      );
      return;
    }

    router.push(`/resumes/${saved.id}`);
  }, [resumeText, router, template]);

  const canCreate = Boolean(resumeText?.trim()) && !isCreating;

  return (
    <div className="space-y-8">
      <div className="rounded-[26px] border border-line bg-card p-6 sm:p-8">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="max-w-md">
            <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-accent">
              What happens next
            </p>
            <ul className="mt-3 space-y-1.5 text-[12.5px] leading-6 text-ink">
              {[
                "We extract the text from your file, locally",
                "Every field is editable — fix anything before saving",
                "Add, remove, or reorder experience, projects and sections",
                "Pick any of the eight templates and export PDF or DOCX",
              ].map((point) => (
                <li key={point} className="flex items-start gap-3">
                  <span aria-hidden="true" className="mt-[7px] h-1.5 w-1.5 shrink-0 rounded-full bg-accent" />
                  {point}
                </li>
              ))}
            </ul>
          </div>

          <div
            className="flex max-w-[13rem] items-start gap-2 rounded-[22px] border border-line bg-accent-soft/60 p-4 text-[11px] leading-5 text-muted"
            aria-label="No job description is used"
          >
            <span className="mt-0.5 h-4 w-4 shrink-0 text-accent-strong" />
            <span>
              No job description. No skill matching. No fabricated content.
            </span>
          </div>
        </div>
      </div>

      <ResumeUpload
        onExtractedTextChange={handleExtractedTextChange}
        stepLabel="Step 1 of 2"
      />

      <div className="grid gap-5 rounded-[26px] border border-line bg-card p-6 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-center sm:gap-6">
        <div className="space-y-2">
          <label
            htmlFor="starter-template"
            className="block text-[10px] font-semibold uppercase tracking-[0.18em] text-muted"
          >
            Starting template
          </label>
          <select
            id="starter-template"
            value={template}
            onChange={(event) =>
              setTemplate(event.target.value as AnyTemplateId)
            }
            className={`mt-0 max-w-[22rem] ${selectClassName}`}
          >
            {RESUME_TEMPLATES.map((templateId) => (
              <option key={templateId} value={templateId}>
                {RESUME_TEMPLATE_LABELS[templateId]}
              </option>
            ))}
            {customTemplates.length > 0 ? (
              <optgroup label="My custom templates">
                {customTemplates.map((custom) => (
                  <option key={custom.id} value={custom.id}>
                    {custom.name}
                  </option>
                ))}
              </optgroup>
            ) : null}
          </select>
          <p className="mt-0 text-[11px] leading-5 text-muted">
            You can switch templates any time — your information stays put.{" "}
            <Link
              href={
                isCustomTemplateId(template)
                  ? `/templates/custom?edit=${encodeURIComponent(template)}`
                  : `/templates/custom?base=${encodeURIComponent(template)}`
              }
              className="font-medium text-accent-strong underline-offset-2 hover:underline focus-visible:ring-2 focus-visible:ring-ring/40 focus-visible:outline-none"
            >
              {isCustomTemplateId(template)
                ? "Edit this custom template"
                : "Customize this design"}
            </Link>
          </p>
        </div>

        <button
          type="button"
          onClick={handleCreate}
          disabled={!canCreate}
          className="group inline-flex w-full sm:w-auto h-12 items-center justify-center gap-2 rounded-full bg-accent px-6 text-sm font-medium text-surface transition-colors hover:bg-accent-strong focus-visible:ring-2 focus-visible:ring-ring/40 focus-visible:outline-none disabled:pointer-events-none disabled:bg-line/50 disabled:text-ink/40 disabled:hover:bg-line/50 disabled:shadow-none"
        >
          {isCreating ? "Creating…" : "Create my resume"}
          <ArrowRightIcon className="h-4 w-4 transition-transform duration-150 group-hover:translate-x-0.5" />
        </button>
      </div>

      {error ? (
        <p
          role="alert"
          className="rounded-[22px] border border-danger/20 bg-danger-soft px-4 py-3 text-xs leading-5 text-danger"
        >
          {error}
        </p>
      ) : null}
    </div>
  );
}
