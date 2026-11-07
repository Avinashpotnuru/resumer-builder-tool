"use client";

import { useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";

import { TemplateCustomizer } from "@/components/create-resume/template-customizer";
import {
  createDefaultCustomTemplate,
  createCustomTemplateId,
  getCustomTemplate,
  type CustomTemplateConfig,
} from "@/lib/resume/custom-template";
import {
  RESUME_TEMPLATE_LABELS,
  isResumeTemplateId,
} from "@/lib/resume/template-catalog";
import { useIsClient } from "@/lib/resume/use-resume-library";

type CustomTemplateEditorClientProps = {
  editId?: string;
  copyId?: string;
  baseId?: string;
};

/**
 * Custom templates live in localStorage, so the editor is resolved on the
 * client. The server render is intentionally empty until hydration completes
 * to avoid generating a shared template id at build time.
 */
export function CustomTemplateEditorClient({
  editId,
  copyId,
  baseId,
}: CustomTemplateEditorClientProps) {
  const router = useRouter();
  const isClient = useIsClient();
  const existing = editId ?? copyId;
  const baseTemplate = isResumeTemplateId(baseId) ? baseId : null;

  const config = useMemo<CustomTemplateConfig | null>(() => {
    if (!isClient) return null;

    if (!existing) {
      return createDefaultCustomTemplate(
        createCustomTemplateId(),
        baseTemplate
          ? `${RESUME_TEMPLATE_LABELS[baseTemplate]} Custom`
          : "My Custom Template",
        baseTemplate ?? "blank",
      );
    }

    const custom = getCustomTemplate(existing);
    if (!custom) return null;

    if (copyId) {
      const now = new Date().toISOString();
      return {
        ...custom,
        id: createCustomTemplateId(),
        name: `${custom.name} (Copy)`,
        createdAt: now,
        updatedAt: now,
      };
    }

    return custom;
  }, [isClient, existing, copyId, baseTemplate]);

  const missing = isClient && Boolean(existing) && config === null;

  useEffect(() => {
    if (missing) {
      router.push("/templates");
    }
  }, [missing, router]);

  if (!config) return null;

  return (
    <div className="mt-10">
      <TemplateCustomizer initialConfig={config} />
    </div>
  );
}
