"use client";

import Link from "next/link";

import { CustomTemplateRenderer } from "@/components/create-resume/custom-template-renderer";
import { ResumeTemplate } from "@/components/create-resume/resume-templates";
import { ArrowRightIcon, CheckIcon } from "@/components/ui/icons";
import type { ResumeTemplateId } from "@/lib/resume/template-catalog";
import { SAMPLE_RESUME } from "@/lib/resume/sample-resume";
import { useCustomTemplate } from "@/lib/resume/use-custom-templates";
import { useIsClient } from "@/lib/resume/use-resume-library";

type TemplateDetailClientProps = {
  id: string;
  isCustom: boolean;
  template:
    | {
        id: ResumeTemplateId;
        name: string;
        category: string;
        description: string;
        bestFor: string;
      }
    | undefined;
};

export function TemplateDetailClient({
  id,
  isCustom,
  template,
}: TemplateDetailClientProps) {
  const isClient = useIsClient();
  const customTemplate = useCustomTemplate(isCustom ? id : null);

  if (!isCustom && !template) {
    return (
      <div className="rounded-[26px] border border-line bg-card p-8">
        <p className="text-sm text-muted">Template not found.</p>
        <Link
          href="/templates"
          className="mt-4 inline-flex text-[13px] font-semibold text-primary underline decoration-accent/40 underline-offset-4"
        >
          Browse all templates
        </Link>
      </div>
    );
  }

  if (isCustom && !isClient) {
    return (
      <div
        aria-hidden="true"
        className="h-96 animate-pulse rounded-[28px] border border-line bg-accent-soft/40"
      />
    );
  }

  if (isCustom && !customTemplate) {
    return (
      <div className="rounded-[26px] border border-line bg-card p-8">
        <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-accent-strong">
          Custom template
        </p>
        <h1 className="mt-3 font-heading text-3xl font-semibold tracking-[-0.02em] text-ink">
          This template is no longer available.
        </h1>
        <p className="mt-3 max-w-md text-[13px] leading-6 text-muted">
          Custom templates are stored locally in the browser that created them.
          It may have been deleted, or you may be using a different browser.
        </p>
        <div className="mt-6 flex flex-wrap gap-3">
          <Link
            href="/templates"
            className="inline-flex h-10 items-center justify-center rounded-full bg-primary px-5 text-[12px] font-medium text-primary-foreground transition-colors hover:bg-accent"
          >
            Browse templates
          </Link>
          <Link
            href="/templates/custom"
            className="inline-flex h-10 items-center justify-center rounded-full border border-line bg-card px-5 text-[12px] font-medium text-ink transition-colors hover:border-primary/40 hover:bg-accent-soft/50"
          >
            Create a new template
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="mt-8 grid gap-12 lg:grid-cols-12 lg:gap-16">
      {/* Preview panel */}
      <div className="lg:col-span-7">
        <div className="rounded-[28px] border border-line bg-accent-soft/40 p-4 sm:p-6">
          <div className="overflow-hidden rounded-[14px] shadow-[0_36px_70px_-46px_rgba(27,33,29,0.6)] ring-1 ring-black/10">
            {isCustom && customTemplate ? (
              <CustomTemplateRenderer
                resume={SAMPLE_RESUME}
                config={customTemplate}
              />
            ) : template ? (
              <ResumeTemplate template={template.id} resume={SAMPLE_RESUME} />
            ) : null}
          </div>
        </div>
        <p className="mt-4 text-center text-[11px] text-muted">
          {isCustom
            ? "Previewed with realistic sample data — your design, your content."
            : "Previewed with realistic sample data — two companies, three projects."}
        </p>
      </div>

      {/* Details panel */}
      <div className="lg:col-span-5 lg:pt-4">
        {isCustom && customTemplate ? (
          <div className="space-y-4">
            <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-accent-strong">
              Custom template
            </p>
            <h1 className="mt-3 font-heading text-5xl font-semibold leading-[0.98] tracking-[-0.035em] text-ink">
              {customTemplate.name}
            </h1>
            <p className="mt-5 text-[14px] leading-7 text-muted">
              A custom resume template based on{" "}
              {customTemplate.baseTemplate === "blank"
                ? "a blank design"
                : customTemplate.baseTemplate}
              , designed by you.
            </p>

            <div className="mt-7 grid grid-cols-2 gap-3">
              <div className="rounded-2xl border border-line bg-card p-4">
                <p className="text-[9.5px] font-semibold uppercase tracking-[0.2em] text-muted">
                  Base template
                </p>
                <p className="mt-2 text-[13px] leading-6 text-ink">
                  {customTemplate.baseTemplate === "blank"
                    ? "Blank"
                    : customTemplate.baseTemplate}
                </p>
              </div>
              <div className="rounded-2xl border border-line bg-card p-4">
                <p className="text-[9.5px] font-semibold uppercase tracking-[0.2em] text-muted">
                  Page size
                </p>
                <p className="mt-2 text-[13px] leading-6 text-ink">
                  {customTemplate.layout.pageSize}
                </p>
              </div>
            </div>

            <div className="mt-4 flex items-center gap-2 rounded-2xl border border-line bg-card p-4">
              {(["primary", "secondary", "accent", "dividerColor"] as const).map(
                (key) => (
                  <span
                    key={key}
                    className="h-5 w-5 rounded-full border border-line"
                    style={{ backgroundColor: customTemplate.colors[key] }}
                    title={key}
                  />
                ),
              )}
              <span className="ml-1 text-[11px] text-muted">Color palette</span>
            </div>

            <ul className="mt-7 space-y-3">
              {[
                "Custom typography, colors, and spacing",
                "Custom section order and visibility",
                "Saved locally in your browser",
                "Reusable across any resume",
              ].map((point) => (
                <li
                  key={point}
                  className="flex items-start gap-2.5 text-[13px] leading-6 text-ink"
                >
                  <CheckIcon className="mt-1 h-4 w-4 shrink-0 text-accent" />
                  {point}
                </li>
              ))}
            </ul>
          </div>
        ) : template ? (
          <div className="space-y-4">
            <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-accent-strong">
              {template.category}
            </p>
            <h1 className="mt-3 font-heading text-5xl font-semibold leading-[0.98] tracking-[-0.035em] text-ink">
              {template.name}
            </h1>
            <p className="mt-5 text-[14px] leading-7 text-muted">
              {template.description}
            </p>

            <div className="mt-7 rounded-2xl border border-line bg-card p-5">
              <p className="text-[9.5px] font-semibold uppercase tracking-[0.2em] text-muted">
                Best for
              </p>
              <p className="mt-2 text-[13px] leading-6 text-ink">
                {template.bestFor}
              </p>
            </div>

            <ul className="mt-7 space-y-3">
              {[
                "Single-column, ATS-parseable text",
                "Multiple companies and projects kept separate",
                "Empty optional fields stay hidden",
                "PDF and DOCX export included",
              ].map((point) => (
                <li
                  key={point}
                  className="flex items-start gap-2.5 text-[13px] leading-6 text-ink"
                >
                  <CheckIcon className="mt-1 h-4 w-4 shrink-0 text-accent" />
                  {point}
                </li>
              ))}
            </ul>
          </div>
        ) : null}

        <div className="mt-9 flex flex-col gap-3">
          {isCustom ? (
            <>
              <Link
                href={`/resumes/new?template=${encodeURIComponent(id)}`}
                className="group inline-flex h-12 items-center justify-center gap-2 rounded-full bg-primary px-6 text-[13px] font-medium text-primary-foreground transition-colors hover:bg-accent focus-visible:ring-2 focus-visible:ring-ring/40 focus-visible:outline-none"
              >
                Use this template
                <ArrowRightIcon className="h-4 w-4 transition-transform duration-150 group-hover:translate-x-0.5" />
              </Link>
              <div className="flex gap-3">
                <Link
                  href={`/templates/custom?edit=${encodeURIComponent(id)}`}
                  className="inline-flex h-12 flex-1 items-center justify-center gap-2 rounded-full border border-line bg-card px-4 text-[13px] font-medium text-ink transition-colors hover:border-primary/40 hover:bg-accent-soft/50 focus-visible:ring-2 focus-visible:ring-ring/40 focus-visible:outline-none"
                >
                  Edit design
                </Link>
                <Link
                  href={`/templates/custom?copy=${encodeURIComponent(id)}`}
                  className="inline-flex h-12 flex-1 items-center justify-center gap-2 rounded-full border border-line bg-card px-4 text-[13px] font-medium text-ink transition-colors hover:border-primary/40 hover:bg-accent-soft/50 focus-visible:ring-2 focus-visible:ring-ring/40 focus-visible:outline-none"
                >
                  Duplicate
                </Link>
              </div>
            </>
          ) : (
            <>
              <Link
                href={`/resumes/new?template=${template!.id}`}
                className="group inline-flex h-12 items-center justify-center gap-2 rounded-full bg-primary px-6 text-[13px] font-medium text-primary-foreground transition-colors hover:bg-accent focus-visible:ring-2 focus-visible:ring-ring/40 focus-visible:outline-none"
              >
                Use this template
                <ArrowRightIcon className="h-4 w-4 transition-transform duration-150 group-hover:translate-x-0.5" />
              </Link>
              <Link
                href={`/templates/custom?base=${template!.id}`}
                className="inline-flex h-12 items-center justify-center gap-2 rounded-full border border-line bg-card px-6 text-[13px] font-medium text-ink transition-colors hover:border-primary/40 hover:bg-accent-soft/50 focus-visible:ring-2 focus-visible:ring-ring/40 focus-visible:outline-none"
              >
                Customize this template
              </Link>
              <Link
                href="/templates"
                className="inline-flex h-12 items-center justify-center rounded-full border border-line bg-card px-6 text-[13px] font-medium text-ink transition-colors hover:border-primary/40 hover:bg-accent-soft/50 focus-visible:ring-2 focus-visible:ring-ring/40 focus-visible:outline-none"
              >
                Compare other templates
              </Link>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
