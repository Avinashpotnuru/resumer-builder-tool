"use client";

import { useMemo, useState } from "react";
import { extractSkills } from "@/lib/skills/extract-skills";

type JobDescriptionSectionProps = {
  onJobDescriptionChange?: (value: string) => void;
};

export function JobDescriptionSection({
  onJobDescriptionChange,
}: JobDescriptionSectionProps = {}) {
  const [jobDescription, setJobDescription] = useState("");
  const extractedSkills = useMemo(() => extractSkills(jobDescription), [jobDescription]);

  const handleJobDescriptionChange = (value: string) => {
    setJobDescription(value);
    onJobDescriptionChange?.(value);
  };

  const handleClearJobDescription = () => {
    setJobDescription("");
    onJobDescriptionChange?.("");
  };

  const error = jobDescription.trim().length === 0 ? "Job description is required." : null;

  return (
    <section
      aria-labelledby="description-heading"
      className="rounded-[26px] border border-line bg-card p-6 sm:p-8"
    >
      <h3 id="description-heading" className="font-heading text-lg font-semibold tracking-[-0.01em] text-ink">
        Job description
      </h3>
      <p className="mt-1 text-xs leading-5 text-muted">
        Paste the posting you want to tailor your resume for.
      </p>

      <label htmlFor="job-description" className="sr-only">
        Job description
      </label>
      <textarea
        id="job-description"
        name="jobDescription"
        rows={9}
        value={jobDescription}
        onChange={(event) => handleJobDescriptionChange(event.target.value)}
        placeholder="Paste the job description here…"
        aria-describedby={error ? "job-description-error" : undefined}
        className="mt-4 w-full resize-y rounded-[22px] border border-line bg-accent-soft/40 px-3.5 py-3 text-sm leading-6 text-ink transition-colors placeholder:text-muted/60 focus:border-primary focus:bg-surface focus:ring-2 focus:ring-ring/20 focus:outline-none"
      />

      {error ? (
        <p
          id="job-description-error"
          role="alert"
          className="mt-3 flex items-start gap-3 rounded-[22px] border border-danger/20 bg-danger-soft px-4 py-3 text-xs leading-5 text-danger"
        >
          <span
            aria-hidden="true"
            className="mt-[7px] h-1.5 w-1.5 shrink-0 rounded-full bg-danger"
          />
          {error}
        </p>
      ) : null}

      {extractedSkills.skills.length > 0 ? (
        <div className="mt-4 flex flex-wrap gap-2">
          {extractedSkills.skills.map((skill) => (
            <span
              key={skill.name}
              className="rounded-full border border-accent/20 bg-accent-soft px-2.5 py-1 text-[11px] font-medium text-accent"
            >
              {skill.name}
            </span>
          ))}
        </div>
      ) : null}

      <div className="mt-4 flex items-center justify-between gap-3">
        <span className="text-[11px] text-muted">
          {jobDescription.length} {jobDescription.length === 1 ? "character" : "characters"}
        </span>
        {jobDescription.length > 0 ? (
          <button
            type="button"
            onClick={handleClearJobDescription}
            className="rounded-full border border-line bg-card px-3 py-1.5 text-xs font-medium text-muted transition-colors hover:bg-accent-soft/50 hover:text-ink focus-visible:ring-2 focus-visible:ring-ring/40 focus-visible:ring-offset-2 focus-visible:ring-offset-surface focus-visible:outline-none"
          >
            Clear
          </button>
        ) : null}
      </div>
    </section>
  );
}

export function JobTitleCompanyFields({
  onJobTitleChange,
  onCompanyNameChange,
}: {
  onJobTitleChange?: (value: string) => void;
  onCompanyNameChange?: (value: string) => void;
} = {}) {
  const [jobTitle, setJobTitle] = useState("");
  const [companyName, setCompanyName] = useState("");

  const handleJobTitleChange = (value: string) => {
    setJobTitle(value);
    onJobTitleChange?.(value);
  };

  const handleCompanyNameChange = (value: string) => {
    setCompanyName(value);
    onCompanyNameChange?.(value);
  };

  const fieldClassName =
    "h-11 w-full rounded-[22px] border border-line bg-accent-soft/40 px-3.5 text-sm text-ink transition-colors placeholder:text-muted/60 focus:border-primary focus:bg-surface focus:ring-2 focus:ring-ring/20 focus:outline-none";

  return (
    <section
      aria-labelledby="role-details-heading"
      className="rounded-[26px] border border-line bg-card p-6 sm:p-8"
    >
      <div className="flex items-center justify-between gap-3">
        <h3
          id="role-details-heading"
          className="font-heading text-lg font-semibold tracking-[-0.01em] text-ink"
        >
          Role details
        </h3>
        <span className="rounded-full border border-line bg-accent-soft/60 px-2.5 py-1 text-[10px] font-medium uppercase tracking-[0.12em] text-muted">
          Optional
        </span>
      </div>

      <div className="mt-5 space-y-4">
        <div className="space-y-1.5">
          <label htmlFor="job-title" className="block text-xs font-medium text-ink">
            Job title
          </label>
          <input
            id="job-title"
            name="jobTitle"
            type="text"
            autoComplete="off"
            value={jobTitle}
            onChange={(event) => handleJobTitleChange(event.target.value)}
            placeholder="e.g. Senior Product Designer"
            className={fieldClassName}
          />
        </div>

        <div className="space-y-1.5">
          <label htmlFor="company-name" className="block text-xs font-medium text-ink">
            Company name
          </label>
          <input
            id="company-name"
            name="companyName"
            type="text"
            autoComplete="organization"
            value={companyName}
            onChange={(event) => handleCompanyNameChange(event.target.value)}
            placeholder="e.g. Northwind Studio"
            className={fieldClassName}
          />
        </div>
      </div>

      <p className="mt-4 text-[11px] leading-5 text-muted">
        Adding these helps keep the resume organised in your workspace.
      </p>
    </section>
  );
}
