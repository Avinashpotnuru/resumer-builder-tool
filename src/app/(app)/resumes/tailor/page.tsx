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
    <div className="w-full space-y-8">
      <div className="max-w-2xl space-y-3">
        <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-accent">
          Tailor resume for a job
        </p>
        <h2 className="text-3xl font-semibold leading-tight tracking-tight text-ink sm:text-4xl">
          Match your resume to one role
        </h2>
        <p className="max-w-xl text-sm leading-6 text-muted sm:text-[15px]">
          Upload the resume you have and paste the job description. You will
          see matched, partial, and missing skills — confirm what is true,
          and we build a separate job-specific version. Your original stays
          untouched.
        </p>
        <p className="flex flex-wrap gap-x-4 gap-y-1 pt-1 text-[11px] text-muted">
          <span>1. Upload resume</span>
          <span>2. Paste job description</span>
          <span>3. Confirm missing skills</span>
          <span>4. Generate &amp; export</span>
        </p>
      </div>

      <ResumeWorkflow initialTemplate={template} />

      <p className="text-[11px] text-muted">
        Want a fresh start instead?{" "}
        <Link href="/resumes/create" className="font-medium text-ink hover:underline">
          Create a resume from your existing file
        </Link>{" "}
        — no job description needed.
      </p>
    </div>
  );
}
