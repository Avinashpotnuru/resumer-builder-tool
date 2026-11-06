import Link from "next/link";
import { ResumeWorkflow } from "@/components/create-resume/resume-workflow";
import { normalizeTemplateId } from "@/lib/resume/template-catalog";

// Reads the ?template= search param, so this page renders dynamically.
export const instant = false;

export default async function TailorResumePage({
  searchParams,
}: {
  searchParams: Promise<{ template?: string | string[] }>;
}) {
  const params = await searchParams;
  const raw = params.template;
  const template = normalizeTemplateId(Array.isArray(raw) ? raw[0] : raw);

  return (
    <div className="w-full space-y-10">
      <div className="max-w-2xl space-y-5">
        <p className="flex items-center gap-3 text-[10px] font-semibold uppercase tracking-[0.22em] text-accent">
          <span aria-hidden="true" className="h-px w-7 bg-accent" />
          Tailor resume for a job
        </p>
        <h2 className="font-heading text-4xl font-semibold leading-[1.02] tracking-[-0.03em] text-ink sm:text-5xl">
          Match your resume
          <span className="block italic text-accent">to one role.</span>
        </h2>
        <p className="max-w-xl text-sm leading-6 text-muted sm:text-[15px]">
          Upload the resume you have and paste the job description. You will
          see matched, partial, and missing skills — confirm what is true,
          and we build a separate job-specific version. Your original stays
          untouched.
        </p>
        <ol className="flex flex-wrap gap-x-5 gap-y-2 pt-1 text-[11px] text-muted">
          {[
            "Upload resume",
            "Paste job description",
            "Confirm missing skills",
            "Generate & export",
          ].map((step, index) => (
            <li key={step} className="flex items-center gap-2">
              <span className="flex h-5 w-5 items-center justify-center rounded-full border border-line bg-card text-[9px] font-semibold tabular-nums text-accent-strong">
                {index + 1}
              </span>
              {step}
            </li>
          ))}
        </ol>
      </div>

      <ResumeWorkflow initialTemplate={template} />

      <p className="text-[11.5px] text-muted">
        Want a fresh start instead?{" "}
        <Link
          href="/resumes/create"
          className="font-medium text-ink underline decoration-accent/40 underline-offset-4 transition-colors hover:text-accent-strong"
        >
          Create a resume from your existing file
        </Link>{" "}
        — no job description needed.
      </p>
    </div>
  );
}
