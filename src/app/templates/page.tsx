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
    <div className="min-h-dvh">
      <PublicHeader />
      <main className="mx-auto w-full max-w-6xl px-4 py-12 sm:px-6 sm:py-16">
        <div className="max-w-2xl">
          <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-muted">
            Template library
          </p>
          <h1 className="mt-3 font-serif text-4xl font-semibold leading-[1.05] tracking-tight text-ink sm:text-5xl">
            Pick the voice
            <br />
            your resume speaks.
          </h1>
          <p className="mt-4 max-w-lg text-[14px] leading-6 text-muted">
            Eight layouts, all single-column, all machine-readable. Every one is
            rendered from the same data — switch any time without losing a word.
          </p>
        </div>

        <div className="mt-10">
          <TemplateGallery />
        </div>
      </main>
      <PublicFooter />
    </div>
  );
}
