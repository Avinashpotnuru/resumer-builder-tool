import { ResumeLibrary } from "@/components/resume-library/resume-library";

export default function MyResumesPage() {
  return (
    <div className="w-full space-y-8">
      <div className="max-w-2xl space-y-4">
        <p className="flex items-center gap-3 text-[10px] font-semibold uppercase tracking-[0.22em] text-accent">
          <span aria-hidden="true" className="h-px w-7 bg-accent" />
          Library
        </p>
        <h2 className="font-heading text-4xl font-semibold leading-[1.02] tracking-[-0.03em] text-ink">
          Every version, kept honestly.
        </h2>
        <p className="max-w-xl text-sm leading-6 text-muted">
          Every resume you create is kept together here.
        </p>
      </div>

      <ResumeLibrary />
    </div>
  );
}
