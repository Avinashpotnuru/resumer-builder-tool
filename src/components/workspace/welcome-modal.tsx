"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { createPortal } from "react-dom";
import {
  CheckIcon,
  CloseIcon,
  DownloadIcon,
  LayersIcon,
  PenIcon,
  ShieldIcon,
  UploadIcon,
} from "@/components/ui/icons";

export const WELCOME_DISMISSED_KEY = "honestcv.welcome.dismissed.v1";

const steps: Array<{
  number: string;
  title: string;
  icon: ReactNode;
  points: string[];
}> = [
  {
    number: "Step 1",
    title: "Upload Your Resume",
    icon: <UploadIcon className="h-5 w-5" />,
    points: [
      "Upload an existing PDF or DOCX resume.",
      "Alternatively, start with a blank resume.",
    ],
  },
  {
    number: "Step 2",
    title: "Edit Your Information",
    icon: <PenIcon className="h-5 w-5" />,
    points: [
      "Automatically populate info from the uploaded resume.",
      "Edit existing info or add new projects, experience, skills, education, and certifications.",
      "Remove or reorder sections.",
    ],
  },
  {
    number: "Step 3",
    title: "Choose Your Template",
    icon: <LayersIcon className="h-5 w-5" />,
    points: [
      "Browse professional ATS-friendly templates.",
      "Preview different designs.",
      "Select your preferred template.",
    ],
  },
  {
    number: "Step 4",
    title: "Download Your Resume",
    icon: <DownloadIcon className="h-5 w-5" />,
    points: [
      "Preview the final resume.",
      "Export as PDF or DOCX.",
    ],
  },
];

const focusableSelector =
  'a[href], button:not([disabled]), textarea, input, select, [tabindex]:not([tabindex="-1"])';

export function WelcomeModal({
  open,
  onDismiss,
}: {
  open: boolean;
  onDismiss: () => void;
}) {
  const dialogRef = useRef<HTMLDivElement>(null);
  const getStartedRef = useRef<HTMLButtonElement>(null);
  const previouslyFocusedRef = useRef<Element | null>(null);

  useEffect(() => {
    if (!open) return;

    const html = document.documentElement;
    const body = document.body;
    const previousHtmlOverflow = html.style.overflow;
    const previousBodyOverflow = body.style.overflow;
    const previousHtmlOverscroll = html.style.overscrollBehavior;
    const previousBodyOverscroll = body.style.overscrollBehavior;

    html.style.overflow = "hidden";
    body.style.overflow = "hidden";
    html.style.overscrollBehavior = "none";
    body.style.overscrollBehavior = "none";

    return () => {
      html.style.overflow = previousHtmlOverflow;
      body.style.overflow = previousBodyOverflow;
      html.style.overscrollBehavior = previousHtmlOverscroll;
      body.style.overscrollBehavior = previousBodyOverscroll;
    };
  }, [open]);

  useEffect(() => {
    if (!open) return;

    previouslyFocusedRef.current = document.activeElement;
    getStartedRef.current?.focus();

    const dialog = dialogRef.current;
    if (!dialog) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        onDismiss();
        return;
      }

      if (event.key !== "Tab") return;

      const focusable = Array.from(
        dialog.querySelectorAll<HTMLElement>(focusableSelector),
      ).filter((element) => element.offsetParent !== null);

      if (focusable.length === 0) {
        event.preventDefault();
        return;
      }

      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      const active = document.activeElement as HTMLElement | null;

      if (event.shiftKey) {
        if (active === first || !dialog.contains(active)) {
          event.preventDefault();
          last.focus();
        }
      } else if (active === last || !dialog.contains(active)) {
        event.preventDefault();
        first.focus();
      }
    };

    dialog.addEventListener("keydown", handleKeyDown);

    return () => {
      dialog.removeEventListener("keydown", handleKeyDown);
      const previous = previouslyFocusedRef.current;
      if (previous instanceof HTMLElement) {
        previous.focus();
      }
    };
  }, [open, onDismiss]);

  if (!open) return null;

  return createPortal(
    <div className="fixed inset-0 z-50" role="presentation">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-ink/55 backdrop-blur-md"
      />

      <div
        className="absolute inset-0 overflow-y-auto overscroll-contain"
        onClick={onDismiss}
      >
        <div className="flex min-h-full items-center justify-center p-4 sm:p-6">
          <div
            ref={dialogRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby="welcome-title"
            aria-describedby="welcome-description"
            onClick={(event) => event.stopPropagation()}
            className="relative w-full rounded-2xl border border-line bg-surface shadow-[0_32px_80px_-32px_rgba(15,23,42,0.6)] sm:w-[80vw]"
          >
            <button
              type="button"
              onClick={onDismiss}
              aria-label="Close"
              className="absolute right-4 top-4 inline-flex h-10 w-10 items-center justify-center rounded-lg text-muted transition-colors hover:bg-surface/50 hover:text-ink focus-visible:ring-2 focus-visible:ring-ring/40 focus-visible:outline-none"
            >
              <CloseIcon className="h-5 w-5" />
            </button>

            <div className="p-6 sm:p-8">
              <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-accent">
                Getting started
              </p>
              <h1
                id="welcome-title"
                className="mt-2 font-serif text-2xl font-semibold leading-tight tracking-tight text-ink sm:text-3xl"
              >
                Welcome to Your Resume Builder
              </h1>
              <p id="welcome-description" className="mt-2 text-sm leading-6 text-muted">
                Create a professional resume in a few simple steps.
              </p>

              <ol className="mt-6 grid gap-3 sm:grid-cols-2">
                {steps.map((step) => (
                  <li
                    key={step.number}
                    className="rounded-xl border border-line bg-surface p-4"
                  >
                    <div className="flex items-center gap-2.5">
                      <span
                        aria-hidden="true"
                        className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-accent-soft text-accent"
                      >
                        {step.icon}
                      </span>
                      <div className="min-w-0">
                        <p className="font-mono text-[9px] font-medium uppercase tracking-[0.18em] text-muted">
                          {step.number}
                        </p>
                        <h2 className="text-[13px] font-semibold leading-snug text-ink">
                          {step.title}
                        </h2>
                      </div>
                    </div>
                    <ul className="mt-2.5 space-y-1.5">
                      {step.points.map((point) => (
                        <li
                          key={point}
                          className="flex items-start gap-1.5 text-[11px] leading-5 text-muted"
                        >
                          <CheckIcon className="mt-0.5 h-3.5 w-3.5 shrink-0 text-accent/70" />
                          <span>{point}</span>
                        </li>
                      ))}
                    </ul>
                  </li>
                ))}
              </ol>

              <div className="mt-4 rounded-xl border border-accent/25 bg-accent-soft p-4 sm:p-5">
                <div className="flex items-start gap-3">
                  <span
                    aria-hidden="true"
                    className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-accent text-surface"
                  >
                    <ShieldIcon className="h-5 w-5" />
                  </span>
                  <div className="min-w-0">
                    <h2 className="text-[13px] font-semibold tracking-tight text-accent-strong">
                      Your Privacy Matters
                    </h2>
                    <p className="mt-1 text-[12px] leading-5 text-ink/85">
                      Your resume information is stored locally in your browser. We
                      do not save your personal resume details in our application
                      database.
                    </p>
                    <p className="mt-1.5 text-[10.5px] leading-4 text-muted">
                      Uploads, text extraction, parsing, and saving all happen on
                      this device. Nothing is uploaded, transmitted, or shared —
                      clearing your browser data clears your library.
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-6 flex flex-col items-stretch gap-3 sm:flex-row sm:items-center sm:justify-between">
                <p className="text-[11px] leading-5 text-muted">
                  You can reopen these instructions any time from the help button
                  in the header.
                </p>
                <button
                  type="button"
                  ref={getStartedRef}
                  onClick={onDismiss}
                  className="inline-flex h-12 shrink-0 items-center justify-center rounded-lg bg-ink px-8 text-sm font-semibold text-surface transition-colors hover:bg-accent-strong focus-visible:ring-2 focus-visible:ring-ring/40 focus-visible:ring-offset-2 focus-visible:ring-offset-surface focus-visible:outline-none"
                >
                  Get Started
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>,
    document.body,
  );
}
