import Link from "next/link";
import type { ResumeTemplateMeta } from "@/lib/resume/template-catalog";
import { ResumeTemplateInline } from "./resume-template-inline";

export function TemplateCard({ template }: { template: ResumeTemplateMeta }) {
  return (
    <article className="group flex flex-col overflow-hidden rounded-[22px] border border-line bg-card transition-all duration-300 hover:-translate-y-1 hover:border-primary/35 hover:shadow-[0_30px_60px_-42px_rgba(27,33,29,0.5)]">
      <Link
        href={`/templates/${template.id}`}
        aria-label={`Preview ${template.name}`}
        className="block focus-visible:ring-2 focus-visible:ring-ring/40 focus-visible:outline-none"
      >
        <div className="relative aspect-[210/297] w-full overflow-hidden rounded-none border-b border-line bg-accent-soft/35">
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
            <h3 className="font-heading text-[19px] font-semibold leading-tight tracking-[-0.01em] text-ink">
              {template.name}
            </h3>
            <p className="mt-1 text-[9.5px] font-semibold uppercase tracking-[0.2em] text-accent-strong">
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
            className="inline-flex h-9 flex-1 items-center justify-center rounded-full border border-line px-3 text-[12px] font-medium text-ink transition-colors hover:border-primary/40 hover:bg-accent-soft/50 focus-visible:ring-2 focus-visible:ring-ring/40 focus-visible:outline-none"
          >
            Preview
          </Link>
          <Link
            href={`/resumes/new?template=${template.id}`}
            className="inline-flex h-9 flex-1 items-center justify-center rounded-full bg-primary px-3 text-[12px] font-medium text-primary-foreground transition-colors hover:bg-accent focus-visible:ring-2 focus-visible:ring-ring/40 focus-visible:outline-none"
          >
            Use template
          </Link>
        </div>
      </div>
    </article>
  );
}
