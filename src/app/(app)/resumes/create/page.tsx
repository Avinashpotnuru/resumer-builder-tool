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
    <div className="w-full space-y-10">
      <div className="max-w-2xl space-y-5">
        <p className="flex items-center gap-3 text-[10px] font-semibold uppercase tracking-[0.22em] text-accent">
          <span aria-hidden="true" className="h-px w-7 bg-accent" />
          Create a new resume
        </p>
        <h2 className="font-heading text-4xl font-semibold leading-[1.02] tracking-[-0.03em] text-ink sm:text-5xl">
          Build from your
          <span className="block italic text-accent">existing resume.</span>
        </h2>
        <p className="max-w-xl text-sm leading-6 text-muted sm:text-[15px]">
          Upload a PDF or DOCX and we pre-fill everything we can find —
          personal details, summary, skills, experience, projects, and
          education. Then edit anything, choose a template, and export.
        </p>
        <ol className="flex flex-wrap gap-x-5 gap-y-2 pt-1 text-[11px] text-muted">
          {[
            "Upload resume",
            "Review pre-filled fields",
            "Edit, add, remove, reorder",
            "Export PDF or DOCX",
          ].map((step, index) => (
            <li key={step} className="flex items-center gap-2">
              <span className="flex h-5 w-5 items-center justify-center rounded-full border border-line bg-card text-[9px] font-semibold tabular-nums text-accent-strong">
                {index + 1}
              </span>
              {step}
            </li>
          ))}
        </ol>
        <p className="text-[11px] font-medium leading-5 text-muted">
          No job description is involved. Nothing is compared against a role,
          and nothing is written that is not in your file.
        </p>
      </div>

      <CreateFromResume initialTemplate={template} />

      <p className="text-[11.5px] text-muted">
        Have a specific role in mind?{" "}
        <Link
          href="/resumes/tailor"
          className="font-medium text-ink underline decoration-accent/40 underline-offset-4 transition-colors hover:text-accent-strong"
        >
          Tailor a resume for a job
        </Link>{" "}
        instead.
      </p>
    </div>
  );
}
