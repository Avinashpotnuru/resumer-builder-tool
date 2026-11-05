import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { PublicHeader } from "@/components/public/public-header";
import { PublicFooter } from "@/components/public/public-footer";
import { ResumeTemplate } from "@/components/create-resume/resume-templates";
import {
  RESUME_TEMPLATE_CATALOG,
} from "@/lib/resume/template-catalog";
import { SAMPLE_RESUME } from "@/lib/resume/sample-resume";
import { ArrowRightIcon, CheckIcon } from "@/components/ui/icons";

type TemplatePageProps = {
  params: Promise<{ id: string }>;
};

export function generateStaticParams() {
  return RESUME_TEMPLATE_CATALOG.map((template) => ({ id: template.id }));
}

export async function generateMetadata({
  params,
}: TemplatePageProps): Promise<Metadata> {
  const { id } = await params;
  const template = RESUME_TEMPLATE_CATALOG.find((item) => item.id === id);

  if (!template) {
    return { title: "Template not found" };
  }

  return {
    title: template.name,
    description: template.description,
  };
}

export default async function TemplateDetailPage({ params }: TemplatePageProps) {
  const { id } = await params;
  const template = RESUME_TEMPLATE_CATALOG.find((item) => item.id === id);

  if (!template) {
    notFound();
  }

  return (
    <div className="min-h-dvh">
      <PublicHeader />
      <main className="mx-auto w-full max-w-6xl px-4 py-10 sm:px-6 sm:py-14">
        <Link
          href="/templates"
          className="text-[11px] font-medium text-muted transition-colors hover:text-ink"
        >
          ← All templates
        </Link>

        <div className="mt-5 grid gap-10 lg:grid-cols-12 lg:gap-14">
          {/* Preview panel */}
          <div className="lg:col-span-7">
            <div className="rounded-xl border border-line bg-[#e9e6de] p-4 sm:p-6">
              <div className="overflow-hidden rounded-md shadow-[0_18px_44px_-24px_rgba(23,26,24,0.55)] ring-1 ring-black/10">
                <ResumeTemplate template={template.id} resume={SAMPLE_RESUME} />
              </div>
            </div>
            <p className="mt-3 text-center text-[11px] text-muted">
              Previewed with realistic sample data — two companies, three projects.
            </p>
          </div>

          {/* Details panel */}
          <div className="lg:col-span-5">
            <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-muted">
              {template.category}
            </p>
            <h1 className="mt-2 font-serif text-4xl font-semibold leading-[1.05] tracking-tight text-ink">
              {template.name}
            </h1>
            <p className="mt-4 text-[14px] leading-6 text-muted">
              {template.description}
            </p>

            <div className="mt-6 rounded-lg border border-line bg-surface p-4">
              <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-muted">
                Best for
              </p>
              <p className="mt-1.5 text-[13px] leading-6 text-ink">
                {template.bestFor}
              </p>
            </div>

            <ul className="mt-6 space-y-2.5">
              {[
                "Single-column, ATS-parseable text",
                "Multiple companies and projects kept separate",
                "Empty optional fields stay hidden",
                "PDF and DOCX export included",
              ].map((point) => (
                <li key={point} className="flex items-start gap-2.5 text-[13px] leading-6 text-ink">
                  <CheckIcon className="mt-1 h-4 w-4 shrink-0 text-accent" />
                  {point}
                </li>
              ))}
            </ul>

            <div className="mt-8 flex flex-col gap-3">
              <Link
                href={`/resumes/new?template=${template.id}`}
                className="group inline-flex h-12 items-center justify-center gap-2 rounded-md bg-ink px-6 text-sm font-medium text-canvas transition-colors hover:bg-accent-strong focus-visible:ring-2 focus-visible:ring-accent/40 focus-visible:outline-none"
              >
                Use this template
                <ArrowRightIcon className="h-4 w-4 transition-transform duration-150 group-hover:translate-x-0.5" />
              </Link>
              <Link
                href="/templates"
                className="inline-flex h-12 items-center justify-center rounded-md border border-ink/20 px-6 text-sm font-medium text-ink transition-colors hover:border-ink hover:bg-ink/[0.04] focus-visible:ring-2 focus-visible:ring-accent/40 focus-visible:outline-none"
              >
                Compare other templates
              </Link>
            </div>
          </div>
        </div>
      </main>
      <PublicFooter />
    </div>
  );
}
