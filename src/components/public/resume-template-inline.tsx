"use client";

import { ResumeTemplate } from "@/components/create-resume/resume-templates";
import type { ResumeTemplateId } from "@/lib/resume/editor-store";
import { SAMPLE_RESUME } from "@/lib/resume/sample-resume";

export function ResumeTemplateInline({
  template,
}: {
  template: ResumeTemplateId;
}) {
  return (
    <ResumeTemplate template={template} resume={SAMPLE_RESUME} />
  );
}
