"use client";

import { useSyncExternalStore } from "react";
import { createPortal } from "react-dom";

import {
  hasResumeContent,
  ResumeTemplate,
} from "@/components/create-resume/resume-templates";
import { downloadResumeDocx } from "@/lib/resume/docx-export";
import type { ResumeTemplateId } from "@/lib/resume/editor-store";
import {
  RESUME_TEMPLATE_LABELS,
  RESUME_TEMPLATES,
  useResumeEditorStore,
} from "@/lib/resume/editor-store";

const subscribeToHydration = () => () => {};

function EmptyPreview() {
  return (
    <div className="flex min-h-64 items-center justify-center rounded-xl border border-dashed border-line bg-surface/50 px-6 py-12 text-center">
      <p className="max-w-xs text-xs leading-5 text-muted">
        Your resume preview will appear here once the editor is ready.
      </p>
    </div>
  );
}

export function ResumePreview() {
  const workingResume = useResumeEditorStore((state) => state.workingResume);
  const sectionOrder = useResumeEditorStore((state) => state.sectionOrder);
  const template = useResumeEditorStore((state) => state.template);
  const setTemplate = useResumeEditorStore((state) => state.setTemplate);
  const isClient = useSyncExternalStore(
    subscribeToHydration,
    () => true,
    () => false,
  );

  const canExport = Boolean(
    workingResume && hasResumeContent(workingResume),
  );

  return (
    <aside
      aria-labelledby="resume-preview-heading"
      className="xl:sticky xl:top-6"
    >
      <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-baseline gap-3">
          <h3
            id="resume-preview-heading"
            className="text-sm font-bold tracking-tight text-ink"
          >
            Live preview
          </h3>
          <span className="text-[11px] text-muted">Updates as you edit</span>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => window.print()}
            disabled={!canExport}
            title="Opens the browser print dialog. Choose Save as PDF."
            className="h-9 rounded-lg bg-primary px-3 text-[11px] font-medium text-surface transition-colors hover:bg-primary/90 focus-visible:ring-2 focus-visible:ring-primary/40 focus-visible:ring-offset-2 focus-visible:ring-offset-surface focus-visible:outline-none disabled:pointer-events-none disabled:opacity-40"
          >
            Download PDF
          </button>
          <button
            type="button"
            onClick={() => {
              if (!workingResume) return;
              void downloadResumeDocx(workingResume, sectionOrder, template);
            }}
            disabled={!canExport}
            title="Downloads an editable Word document."
            className="h-9 rounded-lg border border-line bg-surface px-3 text-[11px] font-medium text-ink transition-colors hover:bg-surface/50 focus-visible:ring-2 focus-visible:ring-ring/40 focus-visible:ring-offset-2 focus-visible:ring-offset-surface focus-visible:outline-none disabled:pointer-events-none disabled:opacity-40"
          >
            Download DOCX
          </button>
          <div className="flex items-center gap-2">
            <label className="text-[11px] font-medium text-muted sr-only">
              Template
            </label>
            <select
              value={template}
              onChange={(event) => setTemplate(event.target.value as ResumeTemplateId)}
              className="h-8 max-w-[10rem] rounded-lg border border-line bg-surface px-2 text-[11px] font-medium text-ink transition-colors focus:border-primary focus:ring-2 focus:ring-primary/20 focus:outline-none"
            >
              {RESUME_TEMPLATES.map((templateId) => (
                <option key={templateId} value={templateId}>
                  {RESUME_TEMPLATE_LABELS[templateId]}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      <div className="relative max-h-[calc(100vh-10rem)] overflow-y-auto rounded-2xl border border-line bg-surface p-3 sm:p-4 shadow-sm">
        {workingResume && canExport ? (
          <div className="mx-auto max-w-[210mm] min-h-[297mm] bg-surface border border-line shadow-[0_24px_60px_-32px_rgba(15,23,42,0.10)]">
            <ResumeTemplate
              template={template}
              resume={workingResume}
              sectionOrder={sectionOrder}
            />
          </div>
        ) : (
          <EmptyPreview />
        )}
      </div>

      {isClient && workingResume && canExport
        ? createPortal(
            <div id="resume-print-root" className="hidden">
              <ResumeTemplate
                template={template}
                resume={workingResume}
                sectionOrder={sectionOrder}
              />
            </div>,
            document.body,
          )
        : null}
    </aside>
  );
}
