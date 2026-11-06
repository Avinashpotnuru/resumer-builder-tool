"use client";

import { ResumeTemplate } from "@/components/create-resume/resume-templates";
import { SAMPLE_RESUME } from "@/lib/resume/sample-resume";
import { CheckIcon } from "@/components/ui/icons";

/**
 * Marketing visual: the actual parser-ready template renderer applied to the
 * sample resume — a true preview, not a mockup.
 */
export function HeroVisual() {
  return (
    <div className="relative mx-auto w-full max-w-[560px]">
      {/* stacked paper layers */}
      <div
        aria-hidden="true"
        className="absolute inset-x-8 -bottom-3 top-10 rotate-[2.4deg] rounded-[26px] border border-line/70 bg-surface/70"
      />
      <div
        aria-hidden="true"
        className="absolute inset-x-4 -bottom-1.5 top-6 rotate-[1.2deg] rounded-[24px] border border-line bg-accent-soft/40"
      />

      <figure className="relative overflow-hidden rounded-[24px] border border-line bg-surface p-2 shadow-[0_40px_90px_-50px_rgba(27,33,29,0.65)] ring-1 ring-black/5">
        <figcaption className="flex items-center justify-between gap-3 px-3 py-2.5">
          <div className="flex min-w-0 items-center gap-2.5">
            <span aria-hidden="true" className="flex gap-1.5">
              <span className="h-2 w-2 rounded-full bg-accent/70" />
              <span className="h-2 w-2 rounded-full bg-line" />
              <span className="h-2 w-2 rounded-full bg-line" />
            </span>
            <span className="truncate font-mono text-[10px] uppercase tracking-[0.16em] text-muted">
              maya-ellison.pdf
            </span>
          </div>
          <span className="shrink-0 rounded-full border border-primary/20 bg-primary/5 px-2.5 py-1 font-mono text-[9px] font-medium uppercase tracking-[0.14em] text-primary">
            ATS · A4
          </span>
        </figcaption>

        <div className="relative h-[380px] overflow-hidden rounded-[16px] border border-line/70 bg-white sm:h-[440px] lg:h-[470px]">
          <div
            className="pointer-events-none absolute left-0 top-0 origin-top-left select-none"
            style={{ width: "160%", transform: "scale(0.625)" }}
            aria-hidden="true"
          >
            <ResumeTemplate
              template="professional-classic"
              resume={SAMPLE_RESUME}
            />
          </div>
          {/* soften the page fold */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-white via-white/80 to-transparent"
          />
        </div>
      </figure>

      {/* floating skill match card */}
      <div className="absolute -left-3 top-[24%] hidden w-[190px] rounded-2xl border border-line bg-surface p-3.5 shadow-[0_20px_44px_-26px_rgba(27,33,29,0.7)] sm:block lg:-left-8">
        <p className="text-[9.5px] font-semibold uppercase tracking-[0.18em] text-muted">
          Job description
        </p>
        <p className="mt-2 font-heading text-[21px] leading-none tracking-tight text-ink">
          12 of 14
        </p>
        <p className="mt-1 text-[10.5px] leading-4 text-muted">
          required skills matched
        </p>
        <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-line/70">
          <div className="h-full w-[86%] rounded-full bg-primary" />
        </div>
      </div>

      {/* floating verification chip */}
      <div className="absolute -bottom-5 left-4 flex items-center gap-2.5 rounded-2xl border border-line bg-surface py-2.5 pl-2.5 pr-4 shadow-[0_18px_40px_-24px_rgba(27,33,29,0.6)] sm:-left-5">
        <span className="flex h-7 w-7 items-center justify-center rounded-full bg-primary text-primary-foreground">
          <CheckIcon className="h-3.5 w-3.5" />
        </span>
        <div className="leading-tight">
          <p className="text-[11.5px] font-semibold text-ink">
            3 projects, 0 merged
          </p>
          <p className="mt-0.5 text-[10px] text-muted">
            Every record travels intact
          </p>
        </div>
      </div>

      {/* export tag */}
      <div className="absolute -right-2 top-[18%] hidden rotate-3 rounded-xl border border-line bg-accent-soft px-3 py-2 text-[9.5px] font-semibold uppercase tracking-[0.16em] text-accent-strong shadow-sm sm:block lg:-right-5">
        PDF · DOCX
      </div>
    </div>
  );
}
