"use client";

import {
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import { useRouter } from "next/navigation";

import { AnalysisSummary } from "@/components/create-resume/analysis-summary";
import {
  JobDescriptionSection,
  JobTitleCompanyFields,
} from "@/components/create-resume/job-description-form";
import { ResumeUpload } from "@/components/create-resume/resume-upload";
import { ArrowRightIcon } from "@/components/ui/icons";
import { StepIndicator } from "@/components/ui/step-indicator";
import { buildTailoredResume } from "@/lib/resume/build-tailored-resume";
import { analyzeJobDescription } from "@/lib/resume/jd-analysis";
import {
  findIdenticalOriginal,
  saveTailoredResume,
} from "@/lib/resume/persistence";
import type { ResumeTemplateId } from "@/lib/resume/editor-store";

const steps = ["Upload Resume", "Job Description", "Analyze"];

export function ResumeWorkflow({
  initialTemplate = "professional-classic",
}: {
  initialTemplate?: ResumeTemplateId;
}) {
  const router = useRouter();
  const [resumeText, setResumeText] = useState("");
  const [jobDescription, setJobDescription] = useState("");
  const [targetJobTitle, setTargetJobTitle] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [analysisVisible, setAnalysisVisible] = useState(false);
  const [continueError, setContinueError] = useState<string | null>(null);
  const [generateError, setGenerateError] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [confirmations, setConfirmations] = useState<
    Record<string, "confirmed" | "not-possessed">
  >({});
  const analysisRef = useRef<HTMLDivElement>(null);

  const handleExtractedTextChange = useCallback((value: string | null) => {
    const nextValue = value ?? "";
    setResumeText(nextValue);
    setContinueError(null);
    setGenerateError(null);
    if (!nextValue.trim()) {
      setAnalysisVisible(false);
    }
  }, []);

  const handleJobDescriptionChange = useCallback((value: string) => {
    setJobDescription(value);
    setContinueError(null);
    setGenerateError(null);
    if (!value.trim()) {
      setAnalysisVisible(false);
    }
    setConfirmations((previous) => {
      const current = new Set(
        analyzeJobDescription(value).requirements.map((requirement) => requirement.name),
      );
      const pruned = Object.fromEntries(
        Object.entries(previous).filter(([name]) => current.has(name)),
      );
      return JSON.stringify(pruned) === JSON.stringify(previous) ? previous : pruned;
    });
  }, []);

  const handleJobTitleChange = useCallback((value: string) => {
    setTargetJobTitle(value);
    setContinueError(null);
    setGenerateError(null);
  }, []);

  const handleCompanyNameChange = useCallback((value: string) => {
    setCompanyName(value);
    setContinueError(null);
    setGenerateError(null);
  }, []);

  const handleConfirmationChange = useCallback(
    (name: string, status: "confirmed" | "not-possessed" | null) => {
      setContinueError(null);
      setGenerateError(null);
      setAnalysisVisible(true);
      setConfirmations((previous) => {
        const next = { ...previous };
        if (status === null) {
          delete next[name];
        } else {
          next[name] = status;
        }
        return next;
      });
    },
    [],
  );

  useEffect(() => {
    if (!analysisVisible) return;

    const frame = window.requestAnimationFrame(() => {
      analysisRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
      analysisRef.current?.focus({ preventScroll: true });
    });

    return () => window.cancelAnimationFrame(frame);
  }, [analysisVisible]);

  const handleContinue = useCallback(() => {
    const hasResume = resumeText.trim().length > 0;
    const hasJobDescription = jobDescription.trim().length > 0;

    if (!hasResume && !hasJobDescription) {
      setContinueError(
        "Upload and review your resume, and add a job description before continuing.",
      );
      return;
    }

    if (!hasResume) {
      setContinueError("Upload and review your resume before continuing.");
      return;
    }

    if (!hasJobDescription) {
      setContinueError("Add a job description before continuing.");
      return;
    }

    setContinueError(null);
    setAnalysisVisible(true);
  }, [jobDescription, resumeText]);

  const handleGenerate = useCallback(() => {
    const cleanText = resumeText.trim();
    const cleanJd = jobDescription.trim();

    if (!cleanText && !cleanJd) {
      setGenerateError(
        "Upload and review your resume, and add a job description before generating.",
      );
      return;
    }

    if (!cleanText) {
      setGenerateError("Upload and review your resume before generating.");
      return;
    }

    if (!cleanJd) {
      setGenerateError("Add a job description before generating.");
      return;
    }

    setIsGenerating(true);
    setGenerateError(null);

    const result = buildTailoredResume({
      resumeText: cleanText,
      jdText: cleanJd,
      confirmations,
      targetJobTitle: targetJobTitle.trim() || null,
      companyName: companyName.trim() || null,
    });

    if (!result.ok) {
      setIsGenerating(false);
      setGenerateError(result.reason);
      return;
    }

    const existingOriginal = findIdenticalOriginal(result.original);
    const originalToSave = existingOriginal
      ? {
          ...result.original,
          id: existingOriginal.id,
          createdAt: existingOriginal.createdAt,
        }
      : result.original;

    const saved = saveTailoredResume({
      original: originalToSave,
      targetJobTitle: result.targetJobTitle,
      companyName: result.companyName,
      template: initialTemplate,
      sectionOrder: result.sectionOrder,
      resume: result.workingResume,
    });

    if (!saved) {
      setIsGenerating(false);
      setGenerateError(
        "The tailored resume could not be saved in this browser. Make sure storage is available and try again.",
      );
      return;
    }

    router.push(`/resumes/${saved.id}`);
  }, [companyName, confirmations, jobDescription, resumeText, router, targetJobTitle, initialTemplate]);

  return (
    <div className="space-y-10">
      <div className="rounded-[26px] border border-line bg-card px-5 py-6 sm:px-8">
        <StepIndicator steps={steps} current={analysisVisible ? 2 : 1} />
      </div>

      <div className="grid gap-8 lg:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)] lg:items-start">
        <div className="space-y-8">
          <ResumeUpload onExtractedTextChange={handleExtractedTextChange} />
          <JobDescriptionSection onJobDescriptionChange={handleJobDescriptionChange} />
        </div>

        <div className="space-y-8">
          <JobTitleCompanyFields
            onJobTitleChange={handleJobTitleChange}
            onCompanyNameChange={handleCompanyNameChange}
          />

          <div className="rounded-[26px] border border-line bg-card p-5 sm:p-6">
            <p className="text-xs leading-5 text-muted">
              Continue reveals the analysis summary for this resume and job
              description.
            </p>

            <button
              type="button"
              onClick={handleContinue}
              aria-controls="analysis-summary"
              aria-expanded={analysisVisible}
              className="group mt-5 inline-flex h-11 w-full items-center justify-center gap-2 rounded-full bg-accent px-5 text-sm font-medium text-surface transition-colors duration-150 hover:bg-accent-strong focus-visible:ring-2 focus-visible:ring-ring/40 focus-visible:ring-offset-2 focus-visible:ring-offset-surface focus-visible:outline-none"
            >
              {analysisVisible ? "View analysis" : "Continue"}
              <ArrowRightIcon className="h-4 w-4 transition-transform duration-150 group-hover:translate-x-0.5" />
            </button>

            {continueError ? (
              <p
                role="alert"
                className="mt-4 rounded-[22px] border border-danger/20 bg-danger-soft px-4 py-3 text-xs leading-5 text-danger"
              >
                {continueError}
              </p>
            ) : null}
          </div>
        </div>
      </div>

      {analysisVisible ? (
        <div
          ref={analysisRef}
          id="analysis-summary"
          tabIndex={-1}
          className="scroll-mt-6 focus:outline-none"
        >
          <AnalysisSummary
            resumeText={resumeText}
            jdText={jobDescription}
            confirmations={confirmations}
            onConfirmationChange={handleConfirmationChange}
            onGenerate={handleGenerate}
            isGenerating={isGenerating}
            generateError={generateError}
          />
        </div>
      ) : null}
    </div>
  );
}
