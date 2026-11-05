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
    <div className="relative mx-auto w-full max-w-[420px]">
      {/* backdrop frame */}
      <div
        aria-hidden="true"
        className="absolute -right-4 -top-4 hidden h-full w-full rounded-xl border border-ink/10 sm:block"
      />

      <figure className="relative overflow-hidden rounded-xl border border-ink/15 bg-surface shadow-[0_24px_60px_-32px_rgba(15,23,42,0.5)] ring-1 ring-black/5">
        <figcaption className="flex items-center justify-between border-b border-line bg-surface px-4 py-2.5">
          <div className="flex items-center gap-2">
            <span className="flex gap-1.5">
              <span aria-hidden="true" className="h-2 w-2 rounded-full bg-ink/15" />
              <span aria-hidden="true" className="h-2 w-2 rounded-full bg-ink/15" />
              <span aria-hidden="true" className="h-2 w-2 rounded-full bg-ink/15" />
            </span>
            <span className="ml-2 font-mono text-[10px] uppercase tracking-[0.16em] text-muted">
              maya-ellison.pdf
            </span>
          </div>
          <span className="rounded-full border border-accent/25 bg-accent-soft px-2 py-0.5 font-mono text-[9px] font-medium uppercase tracking-[0.14em] text-accent-strong">
            ATS · A4
          </span>
        </figcaption>

        <div className="relative h-[330px] overflow-hidden sm:h-[370px]">
          <div
            className="pointer-events-none absolute left-0 top-0 origin-top-left select-none"
            style={{ width: "166.67%", transform: "scale(0.6)" }}
            aria-hidden="true"
          >
            <ResumeTemplate template="professional-classic" resume={SAMPLE_RESUME} />
          </div>
          {/* fade the page fold */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-surface via-surface/85 to-transparent"
          />
        </div>
      </figure>

      {/* floating verification chip */}
      <div className="absolute -bottom-4 -left-2 flex items-center gap-2 rounded-lg border border-ink/10 bg-surface py-2 pl-2 pr-3 shadow-[0_14px_32px_-18px_rgba(15,23,42,0.55)] sm:-left-6">
        <span className="flex h-6 w-6 items-center justify-center rounded-full bg-accent text-surface">
          <CheckIcon className="h-3.5 w-3.5" />
        </span>
        <div className="leading-tight">
          <p className="text-[11px] font-semibold text-ink">3 projects, 0 merged</p>
          <p className="text-[10px] text-muted">Every record travels intact</p>
        </div>
      </div>
    </div>
  );
}
