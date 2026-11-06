"use client";

import type { DocxExtractionSuccess } from "@/lib/docx/extract-docx-text";
import type { PdfExtractionSuccess } from "@/lib/pdf/extract-pdf-text";

export type TextExtractionState =
  | { status: "idle" }
  | { status: "extracting" }
  | { status: "success-pdf"; result: PdfExtractionSuccess }
  | { status: "success-docx"; result: DocxExtractionSuccess }
  | { status: "error"; error: string };

type ResumeTextReviewProps = {
  state: TextExtractionState;
  editedText: string | null;
  onEditedTextChange: (value: string) => void;
};

export function ResumeTextReview({ state, editedText, onEditedTextChange }: ResumeTextReviewProps) {
  if (state.status === "idle") {
    return null;
  }

  const pdfResult = state.status === "success-pdf" ? state.result : null;
  const docxResult = state.status === "success-docx" ? state.result : null;

  let meta: string | null = null;
  let extractedText = "";

  if (state.status === "success-pdf" && pdfResult) {
    extractedText = pdfResult.text;
    meta = `${pdfResult.pageCount} ${pdfResult.pageCount === 1 ? "page" : "pages"} · ${pdfResult.characterCount.toLocaleString()} characters`;
  }

  if (state.status === "success-docx" && docxResult) {
    extractedText = docxResult.text;
    meta = `${docxResult.paragraphs.length} ${docxResult.paragraphs.length === 1 ? "paragraph" : "paragraphs"} · ${docxResult.characterCount.toLocaleString()} characters`;
  }

  const value = editedText ?? extractedText;

  const fieldId = "resume-extracted-text";

  return (
    <section
      aria-labelledby="extracted-text-heading"
      className="rounded-[26px] border border-line bg-card p-6 sm:p-8"
    >
      <div className="flex items-baseline justify-between gap-3">
        <h3 id="extracted-text-heading" className="font-heading text-lg font-semibold tracking-[-0.01em] text-ink">
          Extracted text
        </h3>
        {meta ? <span className="shrink-0 text-[11px] text-muted">{meta}</span> : null}
      </div>

      {state.status === "extracting" ? (
        <div role="status" className="mt-5 flex items-center gap-3 rounded-[22px] bg-accent-soft/60 p-5">
          <span
            aria-hidden="true"
            className="h-5 w-5 shrink-0 animate-spin rounded-full border-2 border-line border-t-accent"
          />
          <p className="text-xs leading-5 text-muted">Reading the text from your document…</p>
        </div>
      ) : null}

      {state.status === "error" ? (
        <p
          role="alert"
          className="mt-4 flex items-start gap-3 rounded-[22px] border border-danger/20 bg-danger-soft px-4 py-3 text-xs leading-5 text-danger"
        >
          <span aria-hidden="true" className="mt-[7px] h-1.5 w-1.5 shrink-0 rounded-full bg-danger" />
          {state.error}
        </p>
      ) : null}

      {state.status === "success-pdf" || state.status === "success-docx" ? (
        <div className="mt-5">
          <label htmlFor={fieldId} className="block text-[10px] font-semibold uppercase tracking-[0.18em] text-muted">
            Review and correct your resume text
          </label>
          <textarea
            id={fieldId}
            value={value}
            onChange={(event) => onEditedTextChange(event.target.value)}
            readOnly={false}
            rows={12}
            placeholder="Corrected resume text will appear here."
            aria-describedby="resume-extracted-text-hint"
            className="mt-2 max-h-96 w-full resize-y overflow-y-auto rounded-[22px] border border-line bg-canvas/40 px-3.5 py-3 text-sm leading-6 text-ink transition-colors placeholder:text-muted/60 focus:border-accent focus:bg-surface focus:ring-2 focus:ring-accent/20 focus:outline-none"
          />
          <p id="resume-extracted-text-hint" className="mt-2 text-[11px] leading-5 text-muted">
            Correct any mistakes the parser made. Your original extracted text is kept separate
            from the edits.
          </p>
        </div>
      ) : null}
    </section>
  );
}
