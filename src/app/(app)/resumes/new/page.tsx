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
    <div className="w-full space-y-8">
      <div className="max-w-2xl space-y-3">
        <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-accent">
          New resume
        </p>
        <h2 className="text-3xl font-semibold leading-tight tracking-tight text-ink sm:text-4xl">
          Choose how to start
        </h2>
        <p className="max-w-xl text-sm leading-6 text-muted sm:text-[15px]">
          Two different jobs, two different workflows. Pick the one that fits
          what you need right now.
        </p>
      </div>

      <div className="grid gap-5 lg:grid-cols-2">
        {options.map((option) => (
          <Link
            key={option.title}
            href={option.href}
            className="group flex flex-col rounded-xl border border-line bg-surface p-6 transition-all duration-200 hover:-translate-y-0.5 hover:border-ink/20 hover:shadow-[0_20px_44px_-28px_rgba(23,26,24,0.5)] focus-visible:ring-2 focus-visible:ring-accent/40 focus-visible:outline-none"
          >
            <span
              className={[
                "flex h-11 w-11 items-center justify-center rounded-lg",
                option.accent
                  ? "bg-accent-soft text-accent"
                  : "bg-ink/[0.06] text-ink",
              ].join(" ")}
            >
              {option.icon}
            </span>

            <span className="mt-5 text-[10px] font-semibold uppercase tracking-[0.2em] text-muted">
              {option.step}
            </span>
            <span className="mt-1.5 text-xl font-semibold leading-snug tracking-tight text-ink">
              {option.title}
            </span>
            <span className="mt-2 text-[12.5px] leading-6 text-muted">
              {option.body}
            </span>

            <ul className="mt-4 space-y-1.5">
              {option.points.map((point) => (
                <li
                  key={point}
                  className="flex items-start gap-2 text-[11.5px] leading-5 text-ink/80"
                >
                  <span
                    aria-hidden="true"
                    className="mt-[7px] h-1 w-1 shrink-0 rounded-full bg-accent"
                  />
                  {point}
                </li>
              ))}
            </ul>

            <span className="mt-6 inline-flex items-center gap-2 text-[13px] font-semibold text-accent-strong">
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
