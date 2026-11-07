import Link from "next/link";
import { PublicHeader } from "@/components/public/public-header";
import { PublicFooter } from "@/components/public/public-footer";
import { HeroVisual } from "@/components/public/hero-visual";
import { TemplatePreview } from "@/components/public/template-preview";
import { RESUME_TEMPLATE_CATALOG } from "@/lib/resume/template-catalog";
import {
  ArrowRightIcon,
  CheckIcon,
  DownloadIcon,
  FilesIcon,
  LayersIcon,
  PenIcon,
  ShieldIcon,
  TargetIcon,
  UploadIcon,
} from "@/components/ui/icons";

const steps = [
  {
    number: "01",
    title: "Start with what you have",
    body: "Upload a PDF or DOCX and the text is extracted in your browser — or begin from a blank page.",
  },
  {
    number: "02",
    title: "Edit the real details",
    body: "Everything lands in an editable form: experience, projects, education, skills. Fix one field, not the whole document.",
  },
  {
    number: "03",
    title: "Choose an ATS-friendly template",
    body: "Eight single-column layouts with real, selectable text. Switch anytime without retyping a thing.",
  },
  {
    number: "04",
    title: "Preview, then export",
    body: "Read the page you actually get, refine it field by field, then download a matching PDF or DOCX.",
  },
];

const workflows = [
  {
    number: "01",
    href: "/resumes/tailor",
    label: "Tailor a resume",
    title: "Tailor Resume for a Job",
    body: "Match your resume against a real job description and ship a job-specific version — matched, partial, and missing skills shown honestly before anything changes.",
    icon: TargetIcon,
    points: [
      "Paste the job description",
      "See matched, partial, and missing skills",
      "Confirm only what is genuinely yours",
    ],
  },
  {
    number: "02",
    href: "/resumes/create",
    label: "Create a resume",
    title: "Create a New Resume",
    body: "Upload your existing resume and we pre-fill the editor — personal details, experience, projects, education. Edit freely, pick a template, export. No job description needed.",
    icon: UploadIcon,
    points: [
      "Upload an existing resume or start blank",
      "Pre-fill and edit every section",
      "Pick a template and download",
    ],
  },
] as const;

const features = [
  {
    title: "Zero fabrication",
    body: "Deterministic rules against a maintained skill dictionary. If you didn't confirm it, it doesn't appear.",
    icon: ShieldIcon,
    href: "/resumes/tailor",
    label: "Tailor for a job",
  },
  {
    title: "Original stays original",
    body: "Every tailored version is stored separately. Your starting resume is never overwritten.",
    icon: FilesIcon,
    href: "/resumes/create",
    label: "Create from upload",
  },
  {
    title: "Independent records",
    body: "Each company, project, and education entry stays independent — never merged or flattened.",
    icon: LayersIcon,
    href: "/resumes/new",
    label: "Start from scratch",
  },
  {
    title: "Extracted, then editable",
    body: "What the parser finds lands in an editable form. Fix one field, not the whole document.",
    icon: PenIcon,
    href: "/resumes/create",
    label: "Create from upload",
  },
  {
    title: "Local by default",
    body: "Resumes are saved in this browser's storage. No account, no upload, nothing to sync.",
    icon: DownloadIcon,
    href: "/resumes/new",
    label: "Start from scratch",
  },
  {
    title: "Preview is the document",
    body: "The on-screen preview renders the same layout the PDF and Word exports produce.",
    icon: TargetIcon,
    href: "/templates",
    label: "Browse templates",
  },
];

const privacyPoints = [
  {
    title: "Parsed in memory",
    body: "PDF and DOCX text is extracted inside your browser tab. The file itself is never transmitted.",
  },
  {
    title: "No account, no upload",
    body: "There is no sign-in and no server round-trip for your resume. Nothing leaves the device.",
  },
  {
    title: "Saved only in your browser",
    body: "Resume data is kept in this browser's local storage on this device, so you can return to it later.",
  },
];

const atsPoints = [
  "Single-column layouts — no tables, columns, or text boxes",
  "Standard section headings ATS parsers already understand",
  "Real, selectable text — never an image of a resume",
  "Skills written the way the job description writes them",
  "Consistent date formats across roles and projects",
];

const faqs = [
  {
    question: "Does HonestCV use AI?",
    answer:
      "No. Tailoring here is deterministic: the app reads the job description against a maintained dictionary of skills and rules, then shows you exactly what matched, what partially matched, and what's missing. Nothing is generated or invented.",
  },
  {
    question: "Where is my resume stored?",
    answer:
      "In your browser's local storage on this device. There is no account, no upload, and no server round-trip.",
  },
  {
    question: "Will tailoring overwrite my original resume?",
    answer:
      "No. The original is stored once and treated as read-only. Each tailored version is saved as a separate copy.",
  },
  {
    question: "What happens to skills I don't have?",
    answer:
      "They stay out. Only skills you explicitly confirm as genuinely possessed are added.",
  },
  {
    question: "Can I start from scratch instead of uploading?",
    answer:
      "Yes. Choose 'Start from scratch' on the creation page and fill in the guided form.",
  },
  {
    question: "Do the PDF and Word exports match what I see?",
    answer:
      "Yes. The export uses the same template and content model as the live preview.",
  },
];

const featuredTemplates = RESUME_TEMPLATE_CATALOG.filter((template) =>
  ["professional-classic", "minimal-ats", "technical-ats"].includes(
    template.id,
  ),
);

export default function Home() {
  return (
    <div className="home-page min-h-dvh overflow-x-clip bg-background text-foreground">
      <PublicHeader variant="home" />

      <main>
        {/* ── Hero ── */}
        <section aria-labelledby="hero-heading" className="relative overflow-hidden">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -right-40 -top-56 h-[620px] w-[620px] rounded-full bg-[radial-gradient(circle,rgba(181,86,58,0.13),transparent_66%)] animate-drift-left"
          />
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -left-48 top-40 h-[520px] w-[520px] rounded-full bg-[radial-gradient(circle,rgba(31,61,51,0.08),transparent_68%)] animate-drift-right"
          />

          <div className="relative mx-auto grid w-full max-w-7xl gap-16 px-4 pb-20 pt-14 sm:px-6 sm:pb-24 sm:pt-20 lg:grid-cols-[minmax(0,1.02fr)_minmax(0,0.98fr)] lg:items-center lg:gap-12 lg:px-8 lg:pb-28 lg:pt-24">
            <div>
              <p className="reveal-stagger flex items-center gap-3 text-[10.5px] font-semibold uppercase tracking-[0.24em] text-muted">
                <span aria-hidden="true" className="h-px w-8 bg-accent" />
                Resume studio · no AI, no invention
              </p>

              <h1
                id="hero-heading"
                className="reveal-stagger mt-6 font-heading text-[44px] font-semibold leading-[0.94] tracking-[-0.035em] text-ink sm:text-6xl lg:text-[74px]"
              >
                The resume you already earned,
                <span className="mt-1 block italic text-accent">
                  beautifully told.
                </span>
              </h1>

              <p className="reveal-stagger mt-7 max-w-[47ch] text-[15px] leading-7 text-muted sm:text-[16px] sm:leading-8">
                Upload your resume, tune it to a real job description, and export
                a clean document — without inventing a single skill, employer, or
                date.
              </p>

              <div className="reveal-stagger mt-9 flex flex-col gap-3 sm:flex-row sm:items-center">
                <Link
                  href="/resumes/create"
                  className="group inline-flex h-13 items-center justify-center gap-2.5 rounded-full bg-primary px-7 text-[13.5px] font-medium text-primary-foreground transition-colors hover:bg-accent focus-visible:ring-2 focus-visible:ring-ring/40 focus-visible:outline-none"
                >
                  Create a resume
                  <ArrowRightIcon className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1" />
                </Link>
                <Link
                  href="/resumes/tailor"
                  className="group inline-flex h-13 items-center justify-center gap-2.5 rounded-full border border-line bg-surface/70 px-7 text-[13.5px] font-medium text-ink transition-colors hover:border-primary/40 hover:bg-surface focus-visible:ring-2 focus-visible:ring-ring/40 focus-visible:outline-none"
                >
                  Tailor for a job
                  <TargetIcon className="h-4 w-4 text-accent" />
                </Link>
              </div>

              <Link
                href="/resumes/new"
                className="reveal-stagger group mt-5 inline-flex items-center gap-1.5 text-[12px] font-medium text-muted transition-colors hover:text-ink"
              >
                Or start from a blank page
                <ArrowRightIcon className="h-3.5 w-3.5 transition-transform duration-200 group-hover:translate-x-0.5" />
              </Link>

              <ul
                className="reveal-stagger mt-10 flex flex-wrap gap-x-6 gap-y-3 border-t border-line pt-6 text-[11.5px] text-muted"
              >
                {[
                  "Parsed in your browser",
                  "No account required",
                  "PDF & DOCX export",
                ].map((item) => (
                  <li key={item} className="flex items-center gap-2">
                    <CheckIcon className="h-3.5 w-3.5 text-accent" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            <div className="reveal-stagger lg:pl-4">
              <HeroVisual />
            </div>
          </div>
        </section>

        {/* ── Two workflows ── */}
        <section
          id="workflows"
          aria-labelledby="workflows-heading"
          className="border-y border-line bg-surface/40"
        >
          <div className="mx-auto w-full max-w-7xl px-4 py-20 sm:px-6 sm:py-28 lg:px-8 lg:py-32">
            <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
              <div className="max-w-[46ch]">
                <p className="reveal-stagger text-[10.5px] font-semibold uppercase tracking-[0.24em] text-accent">
                  Two ways in
                </p>
                <h2
                  id="workflows-heading"
                  className="reveal-stagger mt-3 font-heading text-3xl font-semibold leading-[1.02] tracking-[-0.03em] text-ink sm:text-4xl lg:text-[44px]"
                >
                  One studio. Two honest paths.
                </h2>
              </div>
              <p className="reveal-stagger max-w-[34ch] text-[13px] leading-6 text-muted">
                They never mix. Pick one — you can always run the other later.
              </p>
            </div>

            <div className="mt-12 grid gap-5 lg:grid-cols-2 lg:gap-6">
              {workflows.map((workflow) => {
                const Icon = workflow.icon;

                return (
                  <Link
                    key={workflow.href}
                    href={workflow.href}
                    className="group relative flex flex-col overflow-hidden rounded-[28px] border border-line bg-card p-7 transition-all duration-300 hover:-translate-y-1 hover:border-primary/35 hover:shadow-[0_34px_70px_-42px_rgba(27,33,29,0.55)] focus-visible:ring-2 focus-visible:ring-ring/40 focus-visible:outline-none sm:p-9 reveal-stagger"
                  >
                    <span
                      aria-hidden="true"
                      className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-accent/50 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                    />
                    <span
                      aria-hidden="true"
                      className="absolute inset-0 bg-gradient-to-r from-accent/0 via-accent/10 to-accent/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
                    />
                    <div className="flex items-start justify-between gap-4">
                      <span className="flex h-11 w-11 items-center justify-center rounded-full border border-line bg-accent-soft/70 text-accent-strong transition-colors duration-300 group-hover:border-accent/30 group-hover:bg-accent group-hover:text-accent-foreground">
                        <Icon className="h-5 w-5" />
                      </span>
                      <span className="font-heading text-4xl font-medium leading-none text-line transition-colors duration-300 group-hover:text-accent/30">
                        {workflow.number}
                      </span>
                    </div>

                    <h3 className="mt-8 font-heading text-[27px] font-semibold leading-tight tracking-[-0.02em] text-ink">
                      {workflow.title}
                    </h3>
                    <p className="mt-3 max-w-[42ch] text-[13px] leading-6 text-muted">
                      {workflow.body}
                    </p>

                    <ul className="mt-6 space-y-2.5 border-t border-line/80 pt-5">
                      {workflow.points.map((point) => (
                        <li
                          key={point}
                          className="flex items-start gap-2.5 text-[12.5px] leading-5 text-ink/80"
                        >
                          <CheckIcon className="mt-0.5 h-3.5 w-3.5 shrink-0 text-accent" />
                          {point}
                        </li>
                      ))}
                    </ul>

                    <span className="mt-7 inline-flex items-center gap-2 text-[12.5px] font-semibold text-primary">
                      {workflow.label}
                      <ArrowRightIcon className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1" />
                    </span>
                  </Link>
                );
              })}
            </div>
          </div>
        </section>

        {/* ── How it works ── */}
        <section
          id="how-it-works"
          aria-labelledby="how-heading"
          className="scroll-mt-24 border-b border-line"
        >
          <div className="mx-auto w-full max-w-7xl px-4 py-20 sm:px-6 sm:py-28 lg:px-8 lg:py-32">
            <div className="max-w-2xl">
              <p className="reveal-stagger text-[10.5px] font-semibold uppercase tracking-[0.24em] text-accent">
                How it works
              </p>
              <h2
                id="how-heading"
                className="reveal-stagger mt-3 font-heading text-3xl font-semibold leading-[1.02] tracking-[-0.03em] text-ink sm:text-4xl lg:text-[44px]"
              >
                Four steps. Nothing added behind your back.
              </h2>
              <p className="reveal-stagger mt-5 max-w-[52ch] text-[13.5px] leading-7 text-muted">
                Every step keeps you in control. Nothing appears on the page that
                you didn&rsquo;t write or approve.
              </p>
            </div>

            <ol className="mt-14 grid gap-px overflow-hidden rounded-[28px] border border-line bg-line sm:grid-cols-2 lg:grid-cols-4 reveal-stagger">
              {steps.map((step) => (
                <li
                  key={step.number}
                  className="group relative bg-background p-7 transition-colors duration-300 hover:bg-surface sm:p-8"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-[10px] font-semibold uppercase tracking-[0.22em] text-muted">
                      Step {step.number}
                    </span>
                    <span
                      aria-hidden="true"
                      className="h-px w-8 bg-line transition-colors duration-300 group-hover:bg-accent"
                    />
                  </div>
                  <h3 className="mt-8 font-heading text-[21px] font-semibold leading-snug tracking-[-0.01em] text-ink">
                    {step.title}
                  </h3>
                  <p className="mt-3 text-[12.5px] leading-6 text-muted">
                    {step.body}
                  </p>
                </li>
              ))}
            </ol>

            <div className="mt-10">
              <Link
                href="/resumes/new"
                className="group inline-flex items-center gap-2 text-[12.5px] font-semibold text-primary"
              >
                Try the workflow
                <ArrowRightIcon className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1" />
              </Link>
            </div>
          </div>
        </section>

        {/* ── Templates showcase ── */}
        <section
          id="templates"
          aria-labelledby="templates-heading"
          className="scroll-mt-24 border-b border-line bg-surface/40"
        >
          <div className="mx-auto w-full max-w-7xl px-4 py-20 sm:px-6 sm:py-28 lg:px-8 lg:py-32">
            <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
              <div className="max-w-[48ch]">
                <p className="reveal-stagger text-[10.5px] font-semibold uppercase tracking-[0.24em] text-accent">
                  Templates
                </p>
                <h2
                  id="templates-heading"
                  className="reveal-stagger mt-3 font-heading text-3xl font-semibold leading-[1.02] tracking-[-0.03em] text-ink sm:text-4xl lg:text-[44px]"
                >
                  Quiet pages that read well twice.
                </h2>
                <p className="reveal-stagger mt-5 max-w-[48ch] text-[13.5px] leading-7 text-muted">
                  Eight ATS-safe layouts, rendered from the same content model as
                  the export. Once for the parser, once for the person.
                </p>
              </div>
              <Link
                href="/templates"
                className="group inline-flex items-center gap-2 whitespace-nowrap rounded-full border border-line bg-surface px-5 py-2.5 text-[12.5px] font-semibold text-ink transition-colors hover:border-primary/40 hover:bg-accent-soft focus-visible:ring-2 focus-visible:ring-ring/40 focus-visible:outline-none reveal-stagger"
              >
                View all templates
                <ArrowRightIcon className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1" />
              </Link>
            </div>

            <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3 reveal-stagger">
              {featuredTemplates.map((template) => (
                <Link
                  key={template.id}
                  href={`/templates/${template.id}`}
                  className="group relative flex flex-col overflow-hidden rounded-[24px] border border-line bg-card transition-all duration-300 hover:-translate-y-1 hover:border-primary/35 hover:shadow-[0_30px_60px_-40px_rgba(27,33,29,0.55)] focus-visible:ring-2 focus-visible:ring-ring/40 focus-visible:outline-none"
                >
                  <div className="relative border-b border-line bg-accent-soft/50 p-3.5">
                    <div className="overflow-hidden rounded-[12px] border border-black/10 bg-white shadow-sm">
                      <TemplatePreview template={template.id} />
                    </div>
                    <span
                      aria-hidden="true"
                      className="absolute inset-0 bg-gradient-to-b from-transparent via-white/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
                    />
                  </div>
                  <div className="flex flex-1 flex-col p-5">
                    <p className="text-[9.5px] font-semibold uppercase tracking-[0.2em] text-accent">
                      {template.category}
                    </p>
                    <h3 className="mt-2 font-heading text-[19px] font-semibold leading-tight tracking-[-0.01em] text-ink">
                      {template.name}
                    </h3>
                    <p className="mt-2 text-[12px] leading-5 text-muted">
                      {template.description}
                    </p>
                    <span className="mt-4 inline-flex items-center gap-1.5 pt-1 text-[11.5px] font-semibold text-primary">
                      Preview template
                      <ArrowRightIcon className="h-3.5 w-3.5 transition-transform duration-200 group-hover:translate-x-1" />
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* ── Features ── */}
        <section
          id="features"
          aria-labelledby="features-heading"
          className="scroll-mt-24 border-b border-line"
        >
          <div className="mx-auto grid w-full max-w-7xl gap-12 px-4 py-20 sm:px-6 sm:py-28 lg:grid-cols-[minmax(0,0.82fr)_minmax(0,1.18fr)] lg:gap-20 lg:px-8 lg:py-32">
            <div className="lg:sticky lg:top-28 lg:self-start">
              <p className="reveal-stagger text-[10.5px] font-semibold uppercase tracking-[0.24em] text-accent">
                Product principles
              </p>
              <h2
                id="features-heading"
                className="reveal-stagger mt-3 font-heading text-3xl font-semibold leading-[1.02] tracking-[-0.03em] text-ink sm:text-4xl lg:text-[44px]"
              >
                Software for people who actually read the job ad.
              </h2>
              <p className="reveal-stagger mt-5 max-w-[42ch] text-[13.5px] leading-7 text-muted">
                Deterministic rules, honest comparisons, and layouts that
                machines can parse — without inventing a single thing.
              </p>
              <Link
                href="/resumes/new"
                className="group mt-7 inline-flex items-center gap-2 text-[12.5px] font-semibold text-primary reveal-stagger"
              >
                See the workflow
                <ArrowRightIcon className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1" />
              </Link>
            </div>

            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 reveal-stagger">
              {features.map((feature) => {
                const Icon = feature.icon;

                return (
                  <Link
                    key={feature.title}
                    href={feature.href}
                    className="group relative flex flex-col overflow-hidden rounded-[24px] border border-line bg-card p-7 transition-all duration-300 hover:-translate-y-1 hover:border-primary/35 hover:shadow-[0_30px_60px_-40px_rgba(27,33,29,0.55)] focus-visible:ring-2 focus-visible:ring-ring/40 focus-visible:outline-none"
                  >
                    <span
                      aria-hidden="true"
                      className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-accent/50 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                    />
                    <span
                      aria-hidden="true"
                      className="absolute inset-0 bg-gradient-to-r from-accent/0 via-accent/10 to-accent/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
                    />
                    <div className="flex items-center gap-3 mb-4">
                      <span className="flex h-9 w-9 items-center justify-center rounded-full border border-line bg-accent-soft/60 text-accent-strong transition-colors duration-300 group-hover:bg-primary group-hover:text-primary-foreground">
                        <Icon className="h-4 w-4" />
                      </span>
                      <h3 className="text-[14px] font-semibold tracking-[-0.01em] text-ink leading-snug">
                        {feature.title}
                      </h3>
                    </div>
                    <p className="flex-1 mt-0 text-[12.5px] leading-6 text-muted">
                      {feature.body}
                    </p>
                    <span className="mt-6 inline-flex items-center gap-2 text-[12px] font-semibold text-primary">
                      {feature.label}
                      <ArrowRightIcon className="h-3.5 w-3.5 transition-transform duration-200 group-hover:translate-x-1" />
                    </span>
                  </Link>
                );
              })}
            </div>
          </div>
        </section>

        {/* ── Privacy ── */}
        <section
          id="privacy"
          aria-labelledby="privacy-heading"
          className="scroll-mt-24 border-b border-line"
        >
          <div className="mx-auto w-full max-w-7xl px-4 py-20 sm:px-6 sm:py-24 lg:px-8 lg:py-28">
            <div className="overflow-hidden rounded-[32px] bg-primary text-primary-foreground">
              <div className="grid gap-12 p-8 sm:p-12 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] lg:gap-16 lg:p-16">
                <div>
                  <p className="flex items-center gap-2.5 text-[10.5px] font-semibold uppercase tracking-[0.24em] opacity-70 reveal-stagger">
                    <ShieldIcon className="h-4 w-4" />
                    Privacy, by architecture
                  </p>
                  <h2
                    id="privacy-heading"
                    className="reveal-stagger mt-5 max-w-[18ch] font-heading text-3xl font-semibold leading-[1.02] tracking-[-0.03em] sm:text-4xl lg:text-[46px]"
                  >
                    Your resume never leaves this browser.
                  </h2>
                  <p className="reveal-stagger mt-5 max-w-[42ch] text-[13.5px] leading-7 opacity-75">
                    Not a policy promise — a property of how the app is built.
                    There is no resume server to send anything to.
                  </p>
                </div>

                <ul className="divide-y divide-primary-foreground/15 border-y border-primary-foreground/15 reveal-stagger">
                  {privacyPoints.map((point, index) => (
                    <li
                      key={point.title}
                      className="flex items-start gap-4 py-5 first:pt-0 last:pb-0"
                    >
                      <span className="mt-0.5 font-mono text-[10px] font-semibold tracking-[0.16em] opacity-60">
                        0{index + 1}
                      </span>
                      <div>
                        <h3 className="text-[13.5px] font-semibold tracking-[-0.01em]">
                          {point.title}
                        </h3>
                        <p className="mt-1.5 text-[12.5px] leading-6 opacity-75">
                          {point.body}
                        </p>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* ── ATS explainer ── */}
        <section
          aria-labelledby="ats-heading"
          className="border-b border-line bg-[#182a22] text-[#e9e3d6]"
        >
          <div className="mx-auto grid w-full max-w-7xl gap-12 px-4 py-20 sm:px-6 sm:py-28 lg:grid-cols-12 lg:gap-16 lg:px-8 lg:py-32">
            <div className="lg:col-span-5">
              <p className="flex items-center gap-3 text-[10.5px] font-semibold uppercase tracking-[0.24em] text-[#9dab9f] reveal-stagger">
                <span aria-hidden="true" className="h-px w-8 bg-[#d98a6b]" />
                The boring truth
              </p>
              <h2
                id="ats-heading"
                className="reveal-stagger mt-5 font-heading text-3xl font-semibold leading-[1.02] tracking-[-0.03em] text-white sm:text-4xl lg:text-[46px]"
              >
                What &ldquo;ATS-friendly&rdquo; actually means.
              </h2>
              <p className="reveal-stagger mt-5 max-w-[40ch] text-[13.5px] leading-7 text-[#9dab9f]">
                Applicant tracking systems don&rsquo;t admire design. They parse.
                Every layout in HonestCV keeps the machine-readable layers boring
                — so the human layer can be anything you want.
              </p>
            </div>
            <div className="lg:col-span-7">
              <ul className="divide-y divide-white/10 border-y border-white/10 reveal-stagger">
                {atsPoints.map((point) => (
                  <li key={point} className="flex items-start gap-4 py-4">
                    <CheckIcon className="mt-0.5 h-4.5 w-4.5 shrink-0 text-[#d98a6b]" />
                    <span className="text-[13px] leading-6 text-[#f1ece1]">
                      {point}
                    </span>
                  </li>
                ))}
              </ul>
              <p className="mt-6 text-[12px] leading-5 text-[#9dab9f]">
                The editor is beautiful. The document is calm. That combination
                is deliberate — it&rsquo;s what gets read twice: once by the
                parser, once by the person.
              </p>
            </div>
          </div>
        </section>

        {/* ── FAQ ── */}
        <section
          id="faq"
          aria-labelledby="faq-heading"
          className="scroll-mt-24 border-b border-line"
        >
          <div className="mx-auto grid w-full max-w-7xl gap-10 px-4 py-20 sm:px-6 sm:py-28 lg:grid-cols-12 lg:gap-16 lg:px-8 lg:py-32">
            <div className="lg:col-span-4">
              <p className="text-[10.5px] font-semibold uppercase tracking-[0.24em] text-accent">
                FAQ
              </p>
              <h2
                id="faq-heading"
                className="reveal-stagger mt-3 font-heading text-3xl font-semibold leading-[1.02] tracking-[-0.03em] text-ink sm:text-4xl lg:text-[46px]"
              >
                Fair questions.
              </h2>
              <p className="reveal-stagger mt-5 max-w-[30ch] text-[13px] leading-6 text-muted">
                The short version: your words, your browser, your call.
              </p>
            </div>
            <div className="lg:col-span-8">
              <div className="reveal-stagger">
                {faqs.map((item) => (
                  <details
                    key={item.question}
                    className="group border-t border-line last:border-b"
                  >
                  <summary className="flex cursor-pointer list-none items-center justify-between gap-6 py-5 focus-visible:outline-none [&::-webkit-details-marker]:hidden">
                    <span className="text-[14.5px] font-semibold tracking-[-0.01em] text-ink">
                      {item.question}
                    </span>
                    <span
                      aria-hidden="true"
                      className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-line text-ink transition-colors duration-200 group-hover:border-accent/50 group-hover:text-accent group-open:rotate-45"
                    >
                      <svg
                        width="12"
                        height="12"
                        viewBox="0 0 12 12"
                        fill="none"
                      >
                        <path
                          d="M6 1v10M1 6h10"
                          stroke="currentColor"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                        />
                      </svg>
                    </span>
                  </summary>
                  <p className="max-w-[62ch] pb-5 text-[13px] leading-6 text-muted">
                    {item.answer}
                  </p>
                </details>
              ))}
              </div>
            </div>
          </div>
        </section>

        {/* ── Final CTA ── */}
        <section aria-labelledby="cta-heading" className="relative overflow-hidden border-b border-line">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_bottom,rgba(181,86,58,0.12),transparent_62%)] animate-pulse-soft"
          />
          <div className="relative mx-auto w-full max-w-7xl px-4 py-20 text-center sm:px-6 sm:py-28 lg:px-8 lg:py-32">
            <p className="reveal-stagger text-[10.5px] font-semibold uppercase tracking-[0.24em] text-accent">
              Ready when you are
            </p>
            <h2
              id="cta-heading"
              className="reveal-stagger mx-auto mt-5 max-w-[24ch] font-heading text-4xl font-semibold leading-[0.98] tracking-[-0.035em] text-ink sm:text-5xl lg:text-[72px]"
            >
              The job description is already written.
            </h2>
            <p className="reveal-stagger mx-auto mt-6 max-w-[42ch] text-[14px] leading-7 text-muted sm:text-[15px]">
              Your resume can be ready before you finish your coffee. Start with
              what you already have.
            </p>
            <div className="reveal-stagger mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <Link
                href="/resumes/new"
                className="group inline-flex h-13 items-center justify-center gap-2.5 rounded-full bg-primary px-8 text-[13.5px] font-medium text-primary-foreground transition-colors hover:bg-accent focus-visible:ring-2 focus-visible:ring-ring/40 focus-visible:outline-none"
              >
                Start your resume
                <ArrowRightIcon className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1" />
              </Link>
              <Link
                href="/resumes/tailor"
                className="inline-flex h-13 items-center justify-center gap-2.5 rounded-full border border-line bg-surface/70 px-8 text-[13.5px] font-medium text-ink transition-colors hover:border-primary/40 hover:bg-surface focus-visible:ring-2 focus-visible:ring-ring/40 focus-visible:outline-none"
              >
                Tailor for a job
              </Link>
            </div>
          </div>
        </section>
      </main>

      <PublicFooter variant="home" />
    </div>
  );
}
