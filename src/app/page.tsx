import Link from "next/link";
import { PublicHeader } from "@/components/public/public-header";
import { PublicFooter } from "@/components/public/public-footer";
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
    title: "Upload your resume",
    body: "Drop in your current PDF or DOCX. Text is extracted in your browser — nothing is uploaded.",
  },
  {
    number: "02",
    title: "Paste the job description",
    body: "See matched, partial, and missing skills — shown honestly before anything changes.",
  },
  {
    number: "03",
    title: "Confirm what's true",
    body: "Missing skills stay out unless you confirm you genuinely have them. Nothing is fabricated.",
  },
  {
    number: "04",
    title: "Pick a template, export",
    body: "Choose from eight ATS-safe layouts, refine every field, then download PDF or DOCX.",
  },
];

const features = [
  {
    title: "Zero fabrication",
    body: "Deterministic rules against a maintained skill dictionary. If you didn't confirm it, it doesn't appear.",
    icon: <ShieldIcon className="h-5 w-5" />,
    color: "bg-accent-soft text-accent",
  },
  {
    title: "Original stays original",
    body: "Every tailored version is stored separately. Your starting resume is never overwritten.",
    icon: <FilesIcon className="h-5 w-5" />,
    color: "bg-primary/10 text-primary",
  },
  {
    title: "Independent records",
    body: "Each company, project, and education entry stays independent — never merged or flattened.",
    icon: <LayersIcon className="h-5 w-5" />,
    color: "bg-accent-soft text-accent",
  },
  {
    title: "Extracted, then editable",
    body: "What the parser finds lands in an editable form. Fix one field, not the whole document.",
    icon: <PenIcon className="h-5 w-5" />,
    color: "bg-primary/10 text-primary",
  },
  {
    title: "Local by default",
    body: "Resumes are saved in this browser's storage. No account, no upload, nothing to sync.",
    icon: <DownloadIcon className="h-5 w-5" />,
    color: "bg-accent-soft text-accent",
  },
  {
    title: "Preview is the document",
    body: "The on-screen preview renders the same layout the PDF and Word exports produce.",
    icon: <TargetIcon className="h-5 w-5" />,
    color: "bg-primary/10 text-primary",
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

export default function Home() {
  return (
    <div className="min-h-dvh">
      <PublicHeader />

      <main>
        {/* ── Two workflows: Premium cards ── */}

        {/* ── Two workflows: Premium cards ── */}
        <section id="workflows" aria-labelledby="workflows-heading" className="border-b border-line bg-background">
          <div className="mx-auto w-full max-w-7xl px-4 py-20 sm:px-6 sm:py-28 lg:py-36">
            <div className="max-w-[48ch]">
              <p className="text-[10px] font-semibold uppercase tracking-[0.24em] text-primary">
                Two workflows, one studio
              </p>
              <h2 id="workflows-heading" className="mt-3 font-serif text-2xl font-bold leading-tight tracking-tight text-ink sm:text-3xl">
                Choose how to start.
              </h2>
              <p className="mt-5 max-w-[40ch] text-[13px] leading-6 text-muted">
                They never mix. Pick one — you can always run the other later.
              </p>
            </div>

            <div className="mt-12 grid gap-8 sm:gap-10 lg:grid-cols-2">
              <Link
                href="/resumes/tailor"
                className="group relative overflow-hidden rounded-2xl border border-line bg-surface p-8 transition-all duration-300 hover:border-primary/50 hover:shadow-[0_40px_80px_-32px_rgba(15,23,42,0.12)] focus-visible:ring-2 focus-visible:ring-primary/40 focus-visible:outline-none"
              >
                <div className="absolute inset-y-0 left-0 w-px bg-primary group-hover:bg-accent transition-colors duration-300" />
                <div className="relative z-10">
                  <div className="flex items-center justify-between gap-4 mb-8">
                    <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-accent-soft text-accent">
                      <TargetIcon className="h-5 w-5" />
                    </span>
                    <span className="text-[10px] font-semibold uppercase tracking-[0.22em] text-muted">
                      Option 1
                    </span>
                  </div>
                  <h3 className="text-xl font-bold tracking-tight text-ink">
                    Tailor Resume for a Job
                  </h3>
                  <p className="mt-3 text-[12.5px] leading-6 text-muted max-w-[38ch]">
                    Match your resume against a job description and ship a
                    job-specific version — matched, partial, and missing skills
                    shown honestly before anything changes.
                  </p>
                  <span className="mt-8 inline-flex items-center gap-2 text-[13px] font-semibold text-primary">
                    Tailor a resume
                    <ArrowRightIcon className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1" />
                  </span>
                </div>
              </Link>

              <Link
                href="/resumes/create"
                className="group relative overflow-hidden rounded-2xl border border-line bg-surface p-8 transition-all duration-300 hover:border-primary/50 hover:shadow-[0_40px_80px_-32px_rgba(15,23,42,0.12)] focus-visible:ring-2 focus-visible:ring-primary/40 focus-visible:outline-none"
              >
                <div className="absolute inset-y-0 left-0 w-px bg-ink group-hover:bg-primary transition-colors duration-300" />
                <div className="relative z-10">
                  <div className="flex items-center justify-between gap-4 mb-8">
                    <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-surface text-ink">
                      <UploadIcon className="h-5 w-5" />
                    </span>
                    <span className="text-[10px] font-semibold uppercase tracking-[0.22em] text-muted">
                      Option 2
                    </span>
                  </div>
                  <h3 className="text-xl font-bold tracking-tight text-ink">
                    Create a New Resume
                  </h3>
                  <p className="mt-3 text-[12.5px] leading-6 text-muted max-w-[38ch]">
                    Upload your existing resume and we pre-fill the editor —
                    personal details, experience, projects, education. Edit
                    freely, pick a template, export. No job description needed.
                  </p>
                  <span className="mt-8 inline-flex items-center gap-2 text-[13px] font-semibold text-primary">
                    Create a resume
                    <ArrowRightIcon className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1" />
                  </span>
                </div>
              </Link>
            </div>
          </div>
        </section>

        {/* ── How it works: Numbered steps grid ── */}
        <section id="how-it-works" aria-labelledby="how-heading" className="scroll-mt-24 border-b border-line bg-background">
          <div className="mx-auto w-full max-w-7xl px-4 py-20 sm:px-6 sm:py-28 lg:py-36">
            <div className="grid gap-12 lg:grid-cols-12 lg:gap-12">
              <div className="lg:col-span-3 lg:pr-10">
                <p className="text-[10px] font-semibold uppercase tracking-[0.24em] text-muted">
                  How it works
                </p>
                <h2 id="how-heading" className="mt-3 font-serif text-2xl font-bold leading-tight tracking-tight text-ink sm:text-3xl">
                  Four steps, four honest ones.
                </h2>
                <p className="mt-5 max-w-[34ch] text-[13px] leading-6 text-muted">
                  Every step keeps you in control. Nothing is added to your
                  resume that you didn&rsquo;t put or approve there.
                </p>
                <Link
                  href="/resumes/new"
                  className="group mt-8 inline-flex items-center gap-2 text-[13px] font-semibold text-primary"
                >
                  Try the workflow
                  <ArrowRightIcon className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1" />
                </Link>
              </div>

              <div className="lg:col-span-9 grid gap-7 py-8 sm:grid-cols-[1fr_1fr]">
                {steps.map((step) => (
                  <div
                    key={step.number}
                    className="relative group rounded-2xl border border-line bg-surface p-7 transition-all duration-300 hover:border-primary/30 hover:shadow-[0_24px_48px_-24px_rgba(15,23,42,0.08)]"
                  >
                    <span className="font-serif text-5xl font-light leading-none text-primary/10">
                      {step.number}
                    </span>
                    <h3 className="mt-3 text-lg font-bold tracking-tight text-ink">
                      {step.title}
                    </h3>
                    <p className="mt-2.5 text-[13px] leading-6 text-muted">
                      {step.body}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ── Features: Premium bento grid ── */}
        <section id="features" aria-labelledby="features-heading" className="border-b border-line bg-background">
          <div className="mx-auto w-full max-w-7xl px-4 py-20 sm:px-6 sm:py-28 lg:py-36">
            <div className="grid gap-12 sm:gap-16 lg:grid-cols-2">
              <div className="space-y-8">
                <div className="inline-flex items-center gap-2 rounded-lg border border-line bg-primary/10 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.24em] text-primary">
                  <span aria-hidden="true" className="h-2 w-2 rounded-full bg-primary" />
                  <span>Product principles</span>
                </div>
                <h2 id="features-heading" className="font-serif text-2xl font-bold leading-tight tracking-tight text-ink sm:text-3xl">
                  Software for people who actually read the job ad.
                </h2>
                <p className="mt-5 max-w-[44ch] text-[13px] leading-6 text-muted">
                  Deterministic rules, honest comparisons, and layouts that
                  machines can parse — without inventing a single thing.
                </p>
              </div>

              {/* Premium bento grid */}
              <div className="grid gap-6 sm:gap-8 lg:gap-10 lg:grid-cols-3 lg:grid-rows-2 lg:auto-rows-min">
                {/* Large: Zero fabrication */}
                <div
                  className="lg:col-span-2 group relative overflow-hidden rounded-2xl border border-line bg-surface p-7 transition-all duration-300 hover:border-primary/50 hover:shadow-[0_24px_48px_-24px_rgba(15,23,42,0.10)] group-hover:-translate-y-1"
                >
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-accent-soft text-accent mb-5 group-hover:bg-primary group-hover:text-surface transition-colors duration-300">
                    {features[0].icon}
                  </div>
                  <h3 className="text-[15px] font-bold tracking-tight text-ink">
                    {features[0].title}
                  </h3>
                  <p className="mt-3 text-[12.5px] leading-6 text-muted line-clamp-3">
                    {features[0].body}
                  </p>
                </div>

                {/* Small: Original stays original */}
                <div className="group relative overflow-hidden rounded-2xl border border-line bg-surface p-5 transition-all duration-300 hover:border-primary/30 hover:-translate-y-1">
                  <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-accent-soft text-accent mb-3 group-hover:bg-primary group-hover:text-surface transition-colors duration-300">
                    {features[1].icon}
                  </div>
                  <h3 className="text-[13px] font-bold tracking-tight text-ink">
                    {features[1].title}
                  </h3>
                  <p className="mt-2 text-[11.5px] leading-5 text-muted line-clamp-2">
                    {features[1].body}
                  </p>
                </div>

                {/* Small: Independent records */}
                <div className="group relative overflow-hidden rounded-2xl border border-line bg-surface p-5 transition-all duration-300 hover:border-primary/30 hover:-translate-y-1">
                  <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-accent-soft text-accent mb-3 group-hover:bg-primary group-hover:text-surface transition-colors duration-300">
                    {features[2].icon}
                  </div>
                  <h3 className="text-[13px] font-bold tracking-tight text-ink">
                    {features[2].title}
                  </h3>
                  <p className="mt-2 text-[11.5px] leading-5 text-muted line-clamp-2">
                    {features[2].body}
                  </p>
                </div>

                {/* Large: Extracted, then editable */}
                <div
                  className="lg:col-span-2 group relative overflow-hidden rounded-2xl border border-line bg-surface p-7 transition-all duration-300 hover:border-primary/50 hover:shadow-[0_24px_48px_-24px_rgba(15,23,42,0.10)] group-hover:-translate-y-1"
                >
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-accent-soft text-accent mb-5 group-hover:bg-primary group-hover:text-surface transition-colors duration-300">
                    {features[3].icon}
                  </div>
                  <h3 className="text-[15px] font-bold tracking-tight text-ink">
                    {features[3].title}
                  </h3>
                  <p className="mt-3 text-[12.5px] leading-6 text-muted line-clamp-3">
                    {features[3].body}
                  </p>
                </div>

                {/* Small: Local by default */}
                <div className="group relative overflow-hidden rounded-2xl border border-line bg-surface p-5 transition-all duration-300 hover:border-primary/30 hover:-translate-y-1">
                  <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-accent-soft text-accent mb-3 group-hover:bg-primary group-hover:text-surface transition-colors duration-300">
                    {features[4].icon}
                  </div>
                  <h3 className="text-[13px] font-bold tracking-tight text-ink">
                    {features[4].title}
                  </h3>
                  <p className="mt-2 text-[11.5px] leading-5 text-muted line-clamp-2">
                    {features[4].body}
                  </p>
                </div>

                {/* Small: Preview is the document */}
                <div className="group relative overflow-hidden rounded-2xl border border-line bg-surface p-5 transition-all duration-300 hover:border-primary/30 hover:-translate-y-1">
                  <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-accent-soft text-accent mb-3 group-hover:bg-primary group-hover:text-surface transition-colors duration-300">
                    {features[5].icon}
                  </div>
                  <h3 className="text-[13px] font-bold tracking-tight text-ink">
                    {features[5].title}
                  </h3>
                  <p className="mt-2 text-[11.5px] leading-5 text-muted line-clamp-2">
                    {features[5].body}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── ATS explainer: Dark ── */}
        <section className="border-b border-line bg-[#0f172a] text-[#e2e8f0]">
          <div className="mx-auto grid w-full max-w-7xl gap-12 px-4 py-20 sm:px-6 sm:py-28 lg:grid-cols-12 lg:gap-16 lg:py-36">
            <div className="lg:col-span-5">
              <p className="text-[10px] font-semibold uppercase tracking-[0.24em] text-[#94a3b8]">
                The boring truth
              </p>
              <h2 className="mt-3 font-serif text-2xl font-bold leading-tight tracking-tight text-white sm:text-3xl">
                What “ATS-friendly” actually means.
              </h2>
              <p className="mt-5 max-w-[40ch] text-[13px] leading-6 text-[#94a3b8]">
                Applicant tracking systems don&rsquo;t admire design. They parse.
                Every layout in HonestCV keeps the machine-readable layers boring
                — so the human layer can be anything you want.
              </p>
            </div>
            <div className="lg:col-span-7">
              <ul className="divide-y divide-white/10 border-y border-white/10">
                {atsPoints.map((point) => (
                  <li key={point} className="flex items-start gap-4 py-4">
                    <CheckIcon className="mt-0.5 h-5 w-5 shrink-0 text-[#94a3b8]" />
                    <span className="text-[13px] leading-6 text-[#f1f5f9]">
                      {point}
                    </span>
                  </li>
                ))}
              </ul>
              <p className="mt-6 text-[12px] leading-5 text-[#94a3b8]">
                The editor is beautiful. The document is calm. That combination
                is deliberate — it&rsquo;s what gets read twice: once by the
                parser, once by the person.
              </p>
            </div>
          </div>
        </section>

        {/* ── FAQ ── */}
        <section id="faq" aria-labelledby="faq-heading" className="scroll-mt-24 border-b border-line">
          <div className="mx-auto grid w-full max-w-7xl gap-10 px-4 py-20 sm:px-6 sm:py-28 lg:grid-cols-12 lg:gap-16 lg:py-36">
            <div className="lg:col-span-3">
              <p className="text-[10px] font-semibold uppercase tracking-[0.24em] text-muted">
                FAQ
              </p>
              <h2 id="faq-heading" className="mt-3 font-serif text-3xl font-bold leading-tight tracking-tight text-ink sm:text-4xl">
                Fair questions.
              </h2>
            </div>
            <div className="lg:col-span-9">
              {faqs.map((item) => (
                <details
                  key={item.question}
                  className="group border-t border-line/50 last:border-b"
                >
                  <summary className="flex cursor-pointer list-none items-center justify-between gap-6 py-5 focus-visible:outline-none [&::-webkit-details-marker]:hidden">
                    <span className="text-[15px] font-bold tracking-tight text-ink">
                      {item.question}
                    </span>
                    <span
                      aria-hidden="true"
                      className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full border border-line/15 text-ink transition-transform duration-200 group-open:rotate-45"
                    >
                      <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                        <path d="M6 1v10M1 6h10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                      </svg>
                    </span>
                  </summary>
                  <p className="max-w-[56ch] pb-5 text-[13px] leading-6 text-muted">
                    {item.answer}
                  </p>
                </details>
              ))}
            </div>
          </div>
        </section>

        {/* ── Final CTA ── */}
        <section aria-labelledby="cta-heading" className="border-b border-line bg-background">
          <div className="mx-auto w-full max-w-7xl px-4 py-20 sm:px-6 sm:py-28 lg:py-36 text-center">
            <h2 id="cta-heading" className="mx-auto max-w-[52ch] font-serif text-3xl font-bold leading-[1.05] tracking-tight text-ink sm:text-4xl lg:text-[4.5rem]">
              The job description is already written.
            </h2>
            <p className="mx-auto mt-5 max-w-[42ch] text-[14px] leading-6 text-muted sm:text-base">
              Your resume can be ready before you finish your coffee.
            </p>
            <Link
              href="/resumes/new"
              className="group mt-10 inline-flex h-15 items-center gap-2.5 rounded-lg bg-primary px-8 text-sm font-medium text-surface transition-colors hover:bg-primary/90 focus-visible:ring-2 focus-visible:ring-primary/40 focus-visible:outline-none"
            >
              Tailor my resume
              <ArrowRightIcon className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1" />
            </Link>
          </div>
        </section>
      </main>

      <PublicFooter />
    </div>
  );
}
