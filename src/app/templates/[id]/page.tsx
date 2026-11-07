import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { PublicHeader } from "@/components/public/public-header";
import { PublicFooter } from "@/components/public/public-footer";
import { TemplateDetailClient } from "./page.client";
import {
  RESUME_TEMPLATE_CATALOG,
  isCustomTemplateId,
} from "@/lib/resume/template-catalog";

type TemplatePageProps = {
  params: Promise<{ id: string }>;
};

export function generateStaticParams() {
  return RESUME_TEMPLATE_CATALOG.map((template) => ({ id: template.id }));
}

export async function generateMetadata({
  params,
}: TemplatePageProps): Promise<Metadata> {
  const { id } = await params;
  const template = RESUME_TEMPLATE_CATALOG.find((item) => item.id === id);

  if (!template && !isCustomTemplateId(id)) {
    return { title: "Template not found" };
  }

  if (isCustomTemplateId(id)) {
    return {
      title: "Custom Template",
      description: "Custom resume template designed by you.",
    };
  }

  return {
    title: template!.name,
    description: template!.description,
  };
}

export default async function TemplateDetailPage({ params }: TemplatePageProps) {
  const { id } = await params;
  const template = RESUME_TEMPLATE_CATALOG.find((item) => item.id === id);
  const isCustom = isCustomTemplateId(id);

  if (!template && !isCustom) {
    notFound();
  }

  return (
    <div className="min-h-dvh overflow-x-clip bg-background">
      <PublicHeader variant="home" />
      <main className="mx-auto w-full max-w-7xl px-4 pb-24 pt-10 sm:px-6 sm:pt-14 lg:px-8">
        <Link
          href="/templates"
          className="inline-flex items-center gap-2 rounded-full border border-line bg-card px-4 py-2 text-[11px] font-medium text-muted transition-colors hover:border-primary/40 hover:text-ink focus-visible:ring-2 focus-visible:ring-ring/40 focus-visible:outline-none"
        >
          ← All templates
        </Link>

        <TemplateDetailClient
          id={id}
          isCustom={isCustom}
          template={template}
        />
      </main>
      <PublicFooter variant="home" />
    </div>
  );
}
