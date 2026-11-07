import type { Metadata } from "next";
import { CustomTemplateEditorClient } from "./page.client";
import { PublicHeader } from "@/components/public/public-header";
import { PublicFooter } from "@/components/public/public-footer";
import { isResumeTemplateId, RESUME_TEMPLATE_LABELS } from "@/lib/resume/template-catalog";

// Reads the ?edit=, ?copy=, and ?base= search params, so this page renders dynamically.
export const instant = false;

type CustomTemplatePageProps = {
  searchParams: Promise<{ edit?: string; copy?: string; base?: string }>;
};

export async function generateMetadata({
  searchParams,
}: CustomTemplatePageProps): Promise<Metadata> {
  const { edit, copy, base } = await searchParams;
  const action = copy ? "Duplicate" : edit ? "Edit" : base ? "Customize" : "Create";
  return {
    title: `${action} Template`,
    description: "Design your own custom resume template.",
  };
}

export default async function CustomTemplateEditorPage({
  searchParams,
}: CustomTemplatePageProps) {
  const { edit, copy, base } = await searchParams;
  const baseTemplate = isResumeTemplateId(base) ? base : null;

  return (
    <div className="min-h-dvh overflow-x-clip bg-background">
      <PublicHeader variant="home" />
      <main className="mx-auto w-full max-w-7xl px-4 pb-24 pt-14 sm:px-6 sm:pt-20 lg:px-8">
        <div className="max-w-3xl">
          <p className="flex items-center gap-3 text-[10.5px] font-semibold uppercase tracking-[0.24em] text-accent">
            <span aria-hidden="true" className="h-px w-8 bg-accent" />
            {copy
              ? "Duplicate template"
              : edit
                ? "Edit template"
                : baseTemplate
                  ? `Customize ${RESUME_TEMPLATE_LABELS[baseTemplate]}`
                  : "Create your own template"}
          </p>
          <h1 className="mt-6 font-heading text-5xl font-semibold leading-[0.96] tracking-[-0.035em] text-ink sm:text-6xl">
            Design your
            <span className="block italic text-accent">own template.</span>
          </h1>
          <p className="mt-6 max-w-xl text-[14.5px] leading-7 text-muted">
            {copy
              ? "Customize your copy of this template. Change fonts, colors, spacing, and section order. Saved locally and reusable across any resume."
              : edit
                ? "Refine your template design. Changes are saved locally and apply to any resume using this template."
                : baseTemplate
                  ? `Start from the ${RESUME_TEMPLATE_LABELS[baseTemplate]} layout as a base, then change fonts, colors, spacing, and section order. Your design is saved locally and can be applied to any resume.`
                  : "Start from a blank design or customize an existing layout. Change fonts, colors, spacing, and section order. Your design is saved locally and can be applied to any resume."}
          </p>
        </div>

        <CustomTemplateEditorClient
          editId={edit}
          copyId={copy}
          baseId={base}
        />
      </main>
      <PublicFooter variant="home" />
    </div>
  );
}
