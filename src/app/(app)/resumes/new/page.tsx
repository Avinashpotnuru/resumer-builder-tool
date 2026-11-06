import Link from "next/link";
import { BlankResumeOption } from "@/components/create-resume/start-options";
import {
  ArrowRightIcon,
  TargetIcon,
  UploadIcon,
} from "@/components/ui/icons";
import { normalizeTemplateId } from "@/lib/resume/template-catalog";

// Reads the ?template= search param, so this page renders dynamically.
export const instant = false;

export default async function NewResumePage({
  searchParams,
}: {
  searchParams: Promise<{ template?: string | string[] }>;
}) {
  const params = await searchParams;
  const raw = params.template;
  const templateQuery = Array.isArray(raw) ? raw[0] : raw;
  const template = normalizeTemplateId(templateQuery);
  const suffix = templateQuery ? `?template=${encodeURIComponent(template)}` : "";

  const options = [
    {
      href: `/resumes/tailor${suffix}`,
      step: "Option 1",
      title: "Tailor Resume for a Job",
      body: "Upload your resume and paste a job description. See matched, partial, and missing skills — confirm what is actually true — and generate a separate, job-specific resume.",
      points: [
        "Job-description skill comparison",
        "Matched / partial / missing breakdown",
        "Nothing added without your confirmation",
      ],
      icon: <TargetIcon className="h-5 w-5" />,
      accent: true,
      action: "Tailor my resume",
    },
    {
      href: `/resumes/create${suffix}`,
      step: "Option 2",
      title: "Create a New Resume",
      body: "Upload your existing resume and we pre-fill the editor with what we find — personal details, summary, skills, experience, projects, education. Then edit freely and export.",
      points: [
        "No job description required",
        "Every field editable, reorderable, removable",
        "Eight ATS-safe templates included",
      ],
      icon: <UploadIcon className="h-5 w-5" />,
      accent: false,
      action: "Create my resume",
    },
  ];

  return (
    <div className="w-full space-y-10">
      <div className="max-w-2xl space-y-6">
        <p className="flex items-center gap-3 text-[10px] font-semibold uppercase tracking-[0.22em] text-accent">
          <span aria-hidden="true" className="h-px w-7 bg-accent" />
          New resume
        </p>
        <h2 className="font-heading text-4xl font-semibold leading-[1.02] tracking-[-0.03em] text-ink sm:text-5xl">
          Choose how
          <span className="block italic text-accent">to start.</span>
        </h2>
        <p className="max-w-xl text-sm leading-6 text-muted sm:text-[15px]">
          Two different jobs, two different workflows. Pick the one that fits
          what you need right now.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {options.map((option) => (
          <Link
            key={option.title}
            href={option.href}
            className="group flex flex-col rounded-[26px] border border-line bg-card p-7 transition-all duration-300 hover:-translate-y-1 hover:border-primary/35 hover:shadow-[0_34px_64px_-44px_rgba(27,33,29,0.55)] focus-visible:ring-2 focus-visible:ring-ring/40 focus-visible:ring-offset-2 focus-visible:ring-offset-surface focus-visible:outline-none sm:p-8"
          >
            <span
              className={[
                "flex h-12 w-12 items-center justify-center rounded-full border",
                option.accent
                  ? "border-accent/25 bg-accent-soft text-accent"
                  : "border-line bg-background text-primary",
              ].join(" ")}
            >
              {option.icon}
            </span>

            <span className="mt-6 text-[9.5px] font-semibold uppercase tracking-[0.22em] text-accent-strong">
              {option.step}
            </span>
            <span className="mt-2 font-heading text-2xl font-semibold leading-snug tracking-[-0.01em] text-ink">
              {option.title}
            </span>
            <span className="mt-3 text-[13px] leading-6 text-muted">
              {option.body}
            </span>

            <ul className="mt-5 space-y-2">
              {option.points.map((point) => (
                <li
                  key={point}
                  className="flex items-start gap-2.5 text-[12px] leading-5 text-ink"
                >
                  <span
                    aria-hidden="true"
                    className="mt-[7px] h-1.5 w-1.5 shrink-0 rounded-full bg-accent"
                  />
                  {point}
                </li>
              ))}
            </ul>

            <span className="mt-auto inline-flex items-center gap-2 pt-7 text-[13px] font-semibold text-primary">
              {option.action}
              <ArrowRightIcon className="h-4 w-4 transition-transform duration-150 group-hover:translate-x-0.5" />
            </span>
          </Link>
        ))}
      </div>

      <BlankResumeOption initialTemplate={template} />
    </div>
  );
}
