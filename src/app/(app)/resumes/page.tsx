import { ResumeLibrary } from "@/components/resume-library/resume-library";

export default function MyResumesPage() {
  return (
    <div className="w-full space-y-8">
      <div className="space-y-2">
        <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-accent">
          Library
        </p>
        <p className="max-w-xl text-sm leading-6 text-muted">
          Every resume you create is kept together here.
        </p>
      </div>

      <ResumeLibrary />
    </div>
  );
}
