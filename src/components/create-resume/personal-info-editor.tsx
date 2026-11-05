"use client";

import type { PersonalInfo } from "@/lib/resume/editor-store";
import { createEmptyPersonalInfo, useResumeEditorStore } from "@/lib/resume/editor-store";

const inputClassName =
  "h-10 w-full rounded-lg border border-line bg-surface/40 px-3.5 text-sm text-ink transition-colors placeholder:text-muted/60 focus:border-primary focus:ring-2 focus:ring-ring/20 focus:outline-none";

const fields: Array<{
  key: keyof PersonalInfo;
  label: string;
  placeholder: string;
  autoComplete?: string;
  span?: boolean;
}> = [
  { key: "fullName", label: "Full name", placeholder: "Maya Ellison", autoComplete: "name" },
  {
    key: "professionalTitle",
    label: "Professional title",
    placeholder: "Senior Frontend Engineer",
    autoComplete: "organization-title",
  },
  { key: "email", label: "Email", placeholder: "maya@example.com", autoComplete: "email" },
  { key: "phone", label: "Phone", placeholder: "+1 (312) 555-0147", autoComplete: "tel" },
  { key: "city", label: "City", placeholder: "Chicago" },
  { key: "state", label: "State / region", placeholder: "IL" },
  { key: "country", label: "Country", placeholder: "USA", autoComplete: "country-name" },
  { key: "linkedin", label: "LinkedIn", placeholder: "linkedin.com/in/you", autoComplete: "url" },
  { key: "github", label: "GitHub", placeholder: "github.com/you", autoComplete: "url" },
  {
    key: "portfolio",
    label: "Portfolio",
    placeholder: "yourportfolio.dev",
    autoComplete: "url",
  },
  {
    key: "website",
    label: "Personal website",
    placeholder: "yoursite.com",
    autoComplete: "url",
    span: true,
  },
];

export function PersonalInfoEditor() {
  const stored = useResumeEditorStore((state) => state.workingResume?.personalInfo);
  const updatePersonalInfo = useResumeEditorStore((state) => state.updatePersonalInfo);

  const info = stored ?? createEmptyPersonalInfo();

  return (
    <div className="grid gap-3 sm:grid-cols-2">
      {fields.map((field) => (
        <div
          key={field.key}
          className={field.span ? "sm:col-span-2" : undefined}
        >
          <label
            htmlFor={`personal-${field.key}`}
            className="block text-[11px] font-medium text-muted"
          >
            {field.label}
          </label>
          <input
            id={`personal-${field.key}`}
            type="text"
            value={info[field.key]}
            autoComplete={field.autoComplete}
            onChange={(event) =>
              updatePersonalInfo({ [field.key]: event.target.value })
            }
            placeholder={field.placeholder}
            className={`mt-1.5 ${inputClassName}`}
          />
        </div>
      ))}
      <p className="text-[11px] leading-5 text-muted sm:col-span-2">
        Only filled-in fields appear on the resume. Empty rows stay hidden.
      </p>
    </div>
  );
}
