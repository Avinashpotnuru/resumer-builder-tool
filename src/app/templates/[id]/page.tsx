import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { PublicHeader } from "@/components/public/public-header";
import { PublicFooter } from "@/components/public/public-footer";
import { ResumeTemplate } from "@/components/create-resume/resume-templates";
import { RESUME_TEMPLATE_CATALOG } from "@/lib/resume/template-catalog";
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
    <div className="min-h-dvh overflow-x-clip bg-background">
      <PublicHeader variant="home" />
      <main className="mx-auto w-full max-w-7xl px-4 pb-24 pt-10 sm:px-6 sm:pt-14 lg:px-8">
        <Link
          href="/templates"
          className="inline-flex items-center gap-2 rounded-full border border-line bg-card px-4 py-2 text-[11px] font-medium text-muted transition-colors hover:border-primary/40 hover:text-ink focus-visible:ring-2 focus-visible:ring-ring/40 focus-visible:outline-none"
        >
          ← All templates
        </Link>

        <div className="mt-8 grid gap-12 lg:grid-cols-12 lg:gap-16">
          {/* Preview panel */}
          <div className="lg:col-span-7">
            <div className="rounded-[28px] border border-line bg-accent-soft/40 p-4 sm:p-6">
              <div className="overflow-hidden rounded-[14px] shadow-[0_36px_70px_-46px_rgba(27,33,29,0.6)] ring-1 ring-black/10">
                <ResumeTemplate template={template.id} resume={SAMPLE_RESUME} />
              </div>
            </div>
            <p className="mt-4 text-center text-[11px] text-muted">
              Previewed with realistic sample data — two companies, three projects.
            </p>
          </div>

          {/* Details panel */}
          <div className="lg:col-span-5 lg:pt-4">
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
                <li key={point} className="flex items-start gap-2.5 text-[13px] leading-6 text-ink">
                  <CheckIcon className="mt-1 h-4 w-4 shrink-0 text-accent" />
                  {point}
                </li>
              ))}
            </ul>

            <div className="mt-9 flex flex-col gap-3">
              <Link
                href={`/resumes/new?template=${template.id}`}
                className="group inline-flex h-12 items-center justify-center gap-2 rounded-full bg-primary px-6 text-[13px] font-medium text-primary-foreground transition-colors hover:bg-accent focus-visible:ring-2 focus-visible:ring-ring/40 focus-visible:outline-none"
              >
                Use this template
                <ArrowRightIcon className="h-4 w-4 transition-transform duration-150 group-hover:translate-x-0.5" />
              </Link>
              <Link
                href="/templates"
                className="inline-flex h-12 items-center justify-center rounded-full border border-line bg-card px-6 text-[13px] font-medium text-ink transition-colors hover:border-primary/40 hover:bg-accent-soft/50 focus-visible:ring-2 focus-visible:ring-ring/40 focus-visible:outline-none"
              >
                Compare other templates
              </Link>
            </div>
          </div>
        </div>
      </main>
      <PublicFooter variant="home" />
    </div>
  );
}
