import type { Metadata } from "next";
import { PublicHeader } from "@/components/public/public-header";
import { PublicFooter } from "@/components/public/public-footer";
import { TemplateGallery } from "@/components/public/template-gallery";
import { MyCustomTemplates } from "@/components/public/my-custom-templates";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Templates",
  description:
    "Browse ATS-friendly resume templates and create your own custom template. Preview each layout with realistic sample data and start with one click.",
};

export default function TemplatesPage() {
  return (
    <div className="min-h-dvh overflow-x-clip bg-background">
      <PublicHeader variant="home" />
      <main className="mx-auto w-full max-w-7xl px-4 pb-24 pt-14 sm:px-6 sm:pt-20 lg:px-8">
        <div className="max-w-3xl">
          <p className="flex items-center gap-3 text-[10.5px] font-semibold uppercase tracking-[0.24em] text-accent">
            <span aria-hidden="true" className="h-px w-8 bg-accent" />
            Template library
          </p>
          <h1 className="mt-6 font-heading text-5xl font-semibold leading-[0.96] tracking-[-0.035em] text-ink sm:text-6xl">
            Pick the voice
            <span className="block italic text-accent">your resume speaks.</span>
          </h1>
          <p className="mt-6 max-w-xl text-[14.5px] leading-7 text-muted">
            Choose a built-in layout or create your own custom template. Every
            template is rendered from your resume data — switch any time
            without losing a word.
          </p>
          <ul className="mt-7 flex flex-wrap gap-x-6 gap-y-2 text-[11.5px] text-muted">
            {["Eight layouts", "ATS-parseable", "PDF & DOCX", "Custom templates"].map((item) => (
              <li key={item} className="flex items-center gap-2">
                <span aria-hidden="true" className="h-1.5 w-1.5 rounded-full bg-accent" />
                {item}
              </li>
            ))}
          </ul>
        </div>

        <div className="mt-12">
          <TemplateGallery />
        </div>

        {/* Create your own template entry point */}
        <div className="mt-16">
          <div className="rounded-[32px] border border-line bg-card p-8 sm:p-12">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <h2 className="font-heading text-3xl font-semibold tracking-[-0.03em] text-ink sm:text-4xl">
                  Create your own template
                </h2>
                <p className="mt-3 text-[14px] leading-6 text-muted">
                  Start from a blank design or base it on a built-in layout.
                  Customize fonts, colors, spacing, and section order. Saved
                  locally and reusable across any resume.
                </p>
              </div>
              <Link
                href="/templates/custom"
                className="inline-flex flex-shrink-0 h-11 items-center justify-center gap-2 rounded-full bg-accent px-6 text-[13px] font-medium text-accent-foreground whitespace-nowrap transition-colors hover:bg-accent-strong focus-visible:ring-2 focus-visible:ring-ring/40 focus-visible:outline-none"
              >
                <span className="flex-shrink-0">Start designing</span>
                <span aria-hidden="true" className="h-4 w-4 transition-transform duration-150 group-hover:translate-x-0.5">→</span>
              </Link>
            </div>
          </div>
        </div>

        <MyCustomTemplates />
      </main>
      <PublicFooter variant="home" />
    </div>
  );
}
