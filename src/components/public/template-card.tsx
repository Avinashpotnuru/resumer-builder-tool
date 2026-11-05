import Link from "next/link";
import type { ResumeTemplateMeta } from "@/lib/resume/template-catalog";
import { ResumeTemplateInline } from "./resume-template-inline";

export function TemplateCard({ template }: { template: ResumeTemplateMeta }) {
  return (
    <article className="group flex flex-col overflow-hidden rounded-xl border border-line bg-surface transition-shadow duration-200 hover:shadow-[0_18px_40px_-24px_rgba(15,23,42,0.12)]">
      <Link
        href={`/templates/${template.id}`}
        aria-label={`Preview ${template.name}`}
        className="block focus-visible:ring-2 focus-visible:ring-ring/40 focus-visible:outline-none"
      >
        <div className="relative aspect-[210/297] w-full overflow-hidden rounded-none border-b border-line">
          <div aria-hidden="true" className="absolute inset-0 flex items-center justify-center p-8 text-[9px] font-medium text-muted opacity-0 group-hover:opacity-100 transition-opacity duration-200">
            Preview
          </div>
          <div
            className="pointer-events-none absolute left-0 top-0 origin-top-left select-none"
            style={{ width: "166.67%", transform: "scale(0.6)" }}
            aria-hidden="true"
          >
            <ResumeTemplateInline template={template.id} />
          </div>
        </div>
      </Link>

      <div className="flex flex-1 flex-col gap-3 p-4 sm:p-5">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h3 className="text-[15px] font-semibold tracking-tight text-ink">
              {template.name}
            </h3>
            <p className="mt-0.5 text-[10.5px] font-medium uppercase tracking-[0.14em] text-muted">
              {template.category}
            </p>
          </div>
          <span
            aria-hidden="true"
            className="mt-1 h-2.5 w-2.5 shrink-0 rounded-full border border-ink/10"
            style={{ backgroundColor: template.accent }}
          />
        </div>

        <p className="text-[12px] leading-5 text-muted">{template.description}</p>

        <div className="mt-auto flex items-center gap-2 pt-2">
          <Link
            href={`/templates/${template.id}`}
            className="inline-flex h-9 flex-1 items-center justify-center rounded-md border border-line px-3 text-[12px] font-medium text-ink transition-colors hover:bg-surface/50 focus-visible:ring-2 focus-visible:ring-ring/40 focus-visible:outline-none"
          >
            Preview
          </Link>
          <Link
            href={`/resumes/new?template=${template.id}`}
            className="inline-flex h-9 flex-1 items-center justify-center rounded-md bg-ink px-3 text-[12px] font-medium text-surface transition-colors hover:bg-accent-strong focus-visible:ring-2 focus-visible:ring-ring/40 focus-visible:outline-none"
          >
            Use template
          </Link>
        </div>
      </div>
    </article>
  );
}
