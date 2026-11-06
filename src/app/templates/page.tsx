import type { Metadata } from "next";
import { PublicHeader } from "@/components/public/public-header";
import { PublicFooter } from "@/components/public/public-footer";
import { TemplateGallery } from "@/components/public/template-gallery";

export const metadata: Metadata = {
  title: "Templates",
  description:
    "Browse eight ATS-friendly resume templates — from Professional Classic to Executive and Project-Focused. Preview each layout with realistic sample data and start with one click.",
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
            Eight layouts, all single-column, all machine-readable. Every one is
            rendered from the same data — switch any time without losing a word.
          </p>
          <ul className="mt-7 flex flex-wrap gap-x-6 gap-y-2 text-[11.5px] text-muted">
            {["Eight layouts", "ATS-parseable", "PDF & DOCX"].map((item) => (
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
      </main>
      <PublicFooter variant="home" />
    </div>
  );
}
