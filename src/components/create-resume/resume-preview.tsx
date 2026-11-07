"use client";

import { useCallback, useSyncExternalStore } from "react";
import Link from "next/link";
import { createPortal } from "react-dom";

import { CustomTemplateRenderer } from "@/components/create-resume/custom-template-renderer";
import {
  hasResumeContent,
  ResumeTemplate,
} from "@/components/create-resume/resume-templates";
import {
  pageMarginCss,
  pageSizeCss,
  type CustomTemplateConfig,
} from "@/lib/resume/custom-template";
import { downloadResumeDocx } from "@/lib/resume/docx-export";
import {
  DEFAULT_RESUME_TEMPLATE,
  RESUME_TEMPLATE_LABELS,
  RESUME_TEMPLATES,
  isCustomTemplateId,
  useResumeEditorStore,
  type AnyTemplateId,
  type EditorResumeData,
  type ResumeSectionId,
  type ResumeTemplateId,
} from "@/lib/resume/editor-store";
import { isResumeTemplateId } from "@/lib/resume/template-catalog";
import { useCustomTemplates } from "@/lib/resume/use-custom-templates";

const subscribeToHydration = () => () => {};

function EmptyPreview() {
  return (
    <div className="flex min-h-64 items-center justify-center rounded-[26px] border border-dashed border-line bg-accent-soft/40 px-6 py-12 text-center">
      <p className="max-w-xs text-xs leading-5 text-muted">
        Your resume preview will appear here once the editor is ready.
      </p>
    </div>
  );
}

type ResumeDocumentProps = {
  resume: EditorResumeData;
  template: AnyTemplateId;
  sectionOrder: ResumeSectionId[];
  customConfig: CustomTemplateConfig | null;
};

function ResumeDocument({
  resume,
  template,
  sectionOrder,
  customConfig,
}: ResumeDocumentProps) {
  if (customConfig) {
    return <CustomTemplateRenderer resume={resume} config={customConfig} />;
  }

  const builtIn: ResumeTemplateId = isResumeTemplateId(template)
    ? template
    : DEFAULT_RESUME_TEMPLATE;

  return (
    <ResumeTemplate
      template={builtIn}
      resume={resume}
      sectionOrder={sectionOrder}
    />
  );
}

export function ResumePreview() {
  const workingResume = useResumeEditorStore((state) => state.workingResume);
  const sectionOrder = useResumeEditorStore((state) => state.sectionOrder);
  const template = useResumeEditorStore((state) => state.template);
  const setTemplate = useResumeEditorStore((state) => state.setTemplate);
  const customTemplates = useCustomTemplates();
  const isClient = useSyncExternalStore(
    subscribeToHydration,
    () => true,
    () => false,
  );

  const customConfig = isCustomTemplateId(template)
    ? customTemplates.find((item) => item.id === template) ?? null
    : null;
  const customUnavailable = isCustomTemplateId(template) && !customConfig;

  const canExport = Boolean(
    workingResume && hasResumeContent(workingResume),
  );

  const handlePrint = useCallback(() => {
    if (!customConfig) {
      window.print();
      return;
    }

    // The global print stylesheet uses fixed A4 margins. Custom templates need
    // their own page size and margin values, applied only for this print job.
    const style = document.createElement("style");
    style.dataset.customTemplatePrint = "true";
    style.textContent = `@media print {
      @page {
        size: ${pageSizeCss(customConfig.layout.pageSize)};
        margin: ${pageMarginCss(customConfig.layout.pageMargins)};
      }
      #resume-print-root article[data-resume-template="custom"] {
        width: 100% !important;
        max-width: none !important;
        margin: 0 !important;
        padding: 0 !important;
      }
    }`;
    document.head.appendChild(style);
    window.print();
    window.setTimeout(() => style.remove(), 1500);
  }, [customConfig]);

  return (
    <aside
      aria-labelledby="resume-preview-heading"
      className="xl:sticky xl:top-6"
    >
      <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-baseline gap-3">
          <h3
            id="resume-preview-heading"
            className="font-heading text-lg font-semibold tracking-[-0.01em] text-ink"
          >
            Live preview
          </h3>
          <span className="text-[11px] text-muted">Updates as you edit</span>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={handlePrint}
            disabled={!canExport}
            title="Opens the browser print dialog. Choose Save as PDF."
            className="h-9 rounded-full bg-accent px-4 text-[12px] font-medium text-accent-foreground transition-colors hover:bg-accent-strong focus-visible:ring-2 focus-visible:ring-ring/40 focus-visible:ring-offset-2 focus-visible:ring-offset-surface focus-visible:outline-none disabled:pointer-events-none disabled:opacity-40"
          >
            Download PDF
          </button>
          <button
            type="button"
            onClick={() => {
              if (!workingResume) return;
              void downloadResumeDocx(
                workingResume,
                sectionOrder,
                template,
                customConfig,
              );
            }}
            disabled={!canExport}
            title="Downloads an editable Word document."
            className="h-9 rounded-full border border-line bg-card px-4 text-[12px] font-medium text-ink transition-colors hover:border-primary/40 hover:bg-accent-soft/50 focus-visible:ring-2 focus-visible:ring-ring/40 focus-visible:ring-offset-2 focus-visible:ring-offset-surface focus-visible:outline-none disabled:pointer-events-none disabled:opacity-40"
          >
            Download DOCX
          </button>
          <div className="flex items-center gap-2">
            <label className="text-[11px] font-medium text-muted sr-only">
              Template
            </label>
            <select
              value={template}
              onChange={(event) =>
                setTemplate(event.target.value as AnyTemplateId)
              }
              className="h-8 max-w-[10rem] rounded-[22px] border border-line bg-accent-soft/40 px-2 text-[11px] font-medium text-ink transition-colors focus:border-primary focus:ring-2 focus:ring-ring/20 focus:outline-none"
            >
              {RESUME_TEMPLATES.map((templateId) => (
                <option key={templateId} value={templateId}>
                  {RESUME_TEMPLATE_LABELS[templateId]}
                </option>
              ))}
              {customTemplates.length > 0 ? (
                <optgroup label="My custom templates">
                  {customTemplates.map((custom) => (
                    <option key={custom.id} value={custom.id}>
                      {custom.name}
                    </option>
                  ))}
                </optgroup>
              ) : null}
              {customUnavailable ? (
                <option value={template}>Custom template (unavailable)</option>
              ) : null}
            </select>
            <Link
              href={
                isCustomTemplateId(template)
                  ? `/templates/custom?edit=${encodeURIComponent(template)}`
                  : `/templates/custom?base=${encodeURIComponent(template)}`
              }
              title="Open the custom template designer"
              className="whitespace-nowrap text-[11px] font-medium text-accent-strong underline-offset-2 hover:underline focus-visible:ring-2 focus-visible:ring-ring/40 focus-visible:outline-none"
            >
              {isCustomTemplateId(template) ? "Edit template" : "Customize"}
            </Link>
          </div>
        </div>
      </div>

      {customUnavailable ? (
        <p className="mb-3 rounded-[18px] border border-danger/20 bg-danger-soft px-3 py-2 text-[11px] leading-5 text-danger">
          This custom template is no longer available in this browser. The
          preview falls back to the default layout until you pick another
          template.
        </p>
      ) : null}

      <div className="relative max-h-[calc(100vh-10rem)] overflow-y-auto rounded-[32px] border border-line bg-card p-4 sm:p-6 shadow-sm">
        {workingResume && canExport ? (
          <div className="mx-auto max-w-[210mm] min-h-[297mm] bg-card border border-line shadow-[0_36px_70px_-46px_rgba(27,33,29,0.6)]">
            <ResumeDocument
              resume={workingResume}
              template={template}
              sectionOrder={sectionOrder}
              customConfig={customConfig}
            />
          </div>
        ) : (
          <EmptyPreview />
        )}
      </div>

      {isClient && workingResume && canExport
        ? createPortal(
            <div id="resume-print-root" className="hidden">
              <ResumeDocument
                resume={workingResume}
                template={template}
                sectionOrder={sectionOrder}
                customConfig={customConfig}
              />
            </div>,
            document.body,
          )
        : null}
    </aside>
  );
}
