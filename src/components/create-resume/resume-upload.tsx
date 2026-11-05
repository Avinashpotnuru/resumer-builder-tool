"use client";

import { useEffect, useRef, useState, type ChangeEvent, type DragEvent } from "react";
import {
  ResumeTextReview,
  type TextExtractionState,
} from "@/components/create-resume/resume-text-review";
import { DocumentPlusIcon, UploadIcon } from "@/components/ui/icons";
import { extractDocxText } from "@/lib/docx/extract-docx-text";
import { extractPdfText } from "@/lib/pdf/extract-pdf-text";
import {
  RESUME_FILE_ACCEPT,
  formatResumeFileSize,
  validateResumeFile,
} from "@/lib/resume-upload";

function isPdfFile(file: File): boolean {
  return file.name.toLowerCase().endsWith(".pdf");
}

type ResumeUploadProps = {
  onExtractedTextChange?: (value: string | null) => void;
  stepLabel?: string;
};

export function ResumeUpload({
  onExtractedTextChange,
  stepLabel = "Step 1 of 3",
}: ResumeUploadProps = {}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const extractionRequestRef = useRef(0);
  const [file, setFile] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [extraction, setExtraction] = useState<TextExtractionState>({ status: "idle" });
  const [editedText, setEditedText] = useState<string | null>(null);

  useEffect(() => {
    onExtractedTextChange?.(editedText);
  }, [editedText, onExtractedTextChange]);

  const openFilePicker = () => inputRef.current?.click();

  const resetExtraction = () => {
    extractionRequestRef.current += 1;
    setExtraction({ status: "idle" });
  };

  const startExtraction = (candidate: File) => {
    const requestId = extractionRequestRef.current + 1;
    extractionRequestRef.current = requestId;

    setExtraction({ status: "extracting" });

    void (async () => {
      try {
        if (isPdfFile(candidate)) {
          const result = await extractPdfText(candidate);

          if (extractionRequestRef.current !== requestId) {
            return;
          }

          if (result.success) {
            setEditedText(result.text);
            setExtraction({ status: "success-pdf", result });
          } else {
            setEditedText(null);
            setExtraction({ status: "error", error: result.error });
          }
        } else {
          const result = await extractDocxText(candidate);

          if (extractionRequestRef.current !== requestId) {
            return;
          }

          if (result.success) {
            setEditedText(result.text);
            setExtraction({ status: "success-docx", result });
          } else {
            setEditedText(null);
            setExtraction({ status: "error", error: result.error });
          }
        }
      } catch {
        if (extractionRequestRef.current !== requestId) {
          return;
        }

        setExtraction({
          status: "error",
          error: "We could not read the text from this file. Try a different file.",
        });
      }
    })();
  };

  const applyFile = (candidate: File | undefined) => {
    if (!candidate) {
      return;
    }

    const result = validateResumeFile(candidate);

    if (!result.valid) {
      setError(result.error);
      return;
    }

    setFile(candidate);
    setError(null);
    startExtraction(candidate);
  };

  const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    applyFile(event.target.files?.[0]);
    event.target.value = "";
  };

  const handleDragOver = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (event: DragEvent<HTMLDivElement>) => {
    if (event.currentTarget.contains(event.relatedTarget as Node | null)) {
      return;
    }

    setIsDragging(false);
  };

  const handleDrop = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDragging(false);

    const droppedFiles = event.dataTransfer.files;

    if (droppedFiles.length > 1) {
      setError("Upload one resume at a time.");
      return;
    }

    applyFile(droppedFiles[0]);
  };

  const removeFile = () => {
    setFile(null);
    setError(null);
    resetExtraction();
    setEditedText(null);
  };

  const fileKind = file && isPdfFile(file) ? "PDF" : "DOCX";

  return (
    <>
      <section
        aria-labelledby="upload-heading"
        className="rounded-xl border border-line bg-surface p-5 sm:p-6"
      >
        <div className="flex items-baseline justify-between gap-3">
          <h3 id="upload-heading" className="text-sm font-semibold tracking-tight text-ink">
            Resume upload
          </h3>
          <span className="text-[11px] text-muted">{stepLabel}</span>
        </div>

        <div
          onDragOver={handleDragOver}
          onDragEnter={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          className={[
            "mt-5 rounded-xl border border-dashed transition-colors duration-150",
            isDragging ? "border-accent bg-accent-soft/50" : "border-line bg-surface/50",
          ].join(" ")}
        >
          <input
            ref={inputRef}
            type="file"
            accept={RESUME_FILE_ACCEPT}
            onChange={handleInputChange}
            tabIndex={-1}
            className="sr-only"
          />

          {file ? (
            <div className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:justify-between sm:p-5">
              <div className="flex min-w-0 items-center gap-3">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-accent-soft text-accent">
                  <DocumentPlusIcon className="h-5 w-5" />
                </span>
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium text-ink">{file.name}</p>
                  <p className="mt-0.5 text-xs text-muted">
                    {fileKind} · {formatResumeFileSize(file.size)}
                  </p>
                </div>
              </div>

              <div className="flex shrink-0 items-center gap-1 pl-[52px] sm:pl-0">
                <button
                  type="button"
                  onClick={openFilePicker}
                  className="rounded-lg px-3 py-2 text-xs font-medium text-muted transition-colors hover:bg-surface/50 hover:text-ink focus-visible:ring-2 focus-visible:ring-ring/40 focus-visible:ring-offset-2 focus-visible:ring-offset-surface focus-visible:outline-none"
                >
                  Replace
                </button>
                <button
                  type="button"
                  onClick={removeFile}
                  className="rounded-lg px-3 py-2 text-xs font-medium text-danger transition-colors hover:bg-danger-soft focus-visible:ring-2 focus-visible:ring-danger/30 focus-visible:ring-offset-2 focus-visible:ring-offset-surface focus-visible:outline-none"
                >
                  Remove
                </button>
              </div>
            </div>
          ) : (
            <button
              type="button"
              onClick={openFilePicker}
              aria-describedby={error ? "resume-upload-error" : undefined}
              className="flex w-full flex-col items-center justify-center rounded-xl px-6 py-12 text-center focus-visible:ring-2 focus-visible:ring-ring/40 focus-visible:ring-inset focus-visible:outline-none sm:py-14"
            >
              <span className="flex h-11 w-11 items-center justify-center rounded-lg bg-surface text-accent shadow-[0_1px_2px_rgba(15,23,42,0.06)]">
                <UploadIcon className="h-5 w-5" />
              </span>
              <span className="mt-4 text-sm font-medium text-ink">
                Drag and drop your resume here
              </span>
              <span className="mt-1 text-xs leading-5 text-muted">
                PDF or DOCX, up to 5 MB ·{" "}
                <span className="font-medium text-accent">browse files</span>
              </span>
            </button>
          )}
        </div>

        {error ? (
          <p
            id="resume-upload-error"
            role="alert"
            className="mt-3 flex items-start gap-2 rounded-lg border border-danger/20 bg-danger-soft px-3 py-2 text-xs leading-5 text-danger"
          >
            <span
              aria-hidden="true"
              className="mt-[7px] h-1.5 w-1.5 shrink-0 rounded-full bg-danger"
            />
            {error}
          </p>
        ) : null}
      </section>

      {file ? (
        <ResumeTextReview
          state={extraction}
          editedText={editedText}
          onEditedTextChange={setEditedText}
        />
      ) : null}
    </>
  );
}
