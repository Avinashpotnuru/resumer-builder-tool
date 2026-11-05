import Link from "next/link";
import { CreateFromResume } from "@/components/create-resume/create-from-resume";
import { normalizeTemplateId } from "@/lib/resume/template-catalog";

// Reads the ?template= search param, so this page renders dynamically.
export const instant = false;

export default async function CreateFromResumePage({
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
          Create a new resume
        </p>
        <h2 className="text-3xl font-semibold leading-tight tracking-tight text-ink sm:text-4xl">
          Build from your existing resume
        </h2>
        <p className="max-w-xl text-sm leading-6 text-muted sm:text-[15px]">
          Upload a PDF or DOCX and we pre-fill everything we can find —
          personal details, summary, skills, experience, projects, and
          education. Then edit anything, choose a template, and export.
        </p>
        <p className="flex flex-wrap gap-x-4 gap-y-1 pt-1 text-[11px] text-muted">
          <span>1. Upload resume</span>
          <span>2. Review pre-filled fields</span>
          <span>3. Edit, add, remove, reorder</span>
          <span>4. Export PDF or DOCX</span>
        </p>
        <p className="text-[11px] font-medium text-muted">
          No job description is involved. Nothing is compared against a role,
          and nothing is written that is not in your file.
        </p>
      </div>

      <CreateFromResume initialTemplate={template} />

      <p className="text-[11px] text-muted">
        Have a specific role in mind?{" "}
        <Link href="/resumes/tailor" className="font-medium text-ink hover:underline">
          Tailor a resume for a job
        </Link>{" "}
        instead.
      </p>
    </div>
  );
}
