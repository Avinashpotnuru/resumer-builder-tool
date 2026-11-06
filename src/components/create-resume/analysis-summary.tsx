"use client";

import { useMemo } from "react";
import { calculateSkillMatchPercentage } from "@/lib/skills/calculate-skill-match";
import {
  analyzeJobDescription,
  coverageForJobDescription,
  type JdRequirementKind,
  type JdSkillStatus,
} from "@/lib/resume/jd-analysis";
import type { Skill } from "@/lib/skills/skill-dictionary";

export type AnalysisSummaryProps = {
  resumeText: string;
  jdText: string;
  confirmations: Record<string, "confirmed" | "not-possessed">;
  onConfirmationChange: (
    name: string,
    status: "confirmed" | "not-possessed" | null,
  ) => void;
  onGenerate: () => void;
  isGenerating: boolean;
  generateError: string | null;
};

function statusOf(
  skill: Skill,
  matchedNames: Set<string>,
  confirmation: "confirmed" | "not-possessed" | undefined,
): JdSkillStatus {
  if (matchedNames.has(skill.name)) return "matched";
  return confirmation ?? "unconfirmed";
}

function statusLabel(status: JdSkillStatus, isPartial: boolean): string {
  if (status === "matched") return "Matched";
  if (status === "confirmed") return "Verified by you";
  if (status === "not-possessed") return "Not possessed";
  if (isPartial) return "Partial match";
  return "Unconfirmed";
}

function statusClassName(status: JdSkillStatus, isPartial: boolean): string {
  if (status === "matched") return "border-primary/30 bg-primary-soft text-primary";
  if (status === "confirmed") return "border-primary/30 bg-primary-soft text-primary";
  if (status === "not-possessed") return "border-danger/20 bg-danger-soft text-danger";
  if (isPartial) return "border-line bg-surface/40 text-muted";
  return "border-line bg-surface/40 text-muted";
}

function requirementKindLabel(kind: JdRequirementKind): string {
  return kind === "required" ? "Required" : "Preferred";
}

export function AnalysisSummary({
  resumeText,
  jdText,
  confirmations,
  onConfirmationChange,
  onGenerate,
  isGenerating,
  generateError,
}: AnalysisSummaryProps) {
  const analysis = useMemo(() => analyzeJobDescription(jdText), [jdText]);
  const coverage = useMemo(
    () =>
      coverageForJobDescription({
        resumeText,
        jdText,
        confirmations,
      }),
    [confirmations, jdText, resumeText],
  );
  const { percentage, matchedCount, totalRequiredCount } = useMemo(
    () => calculateSkillMatchPercentage(resumeText, jdText),
    [jdText, resumeText],
  );

  const matchedNames = useMemo(
    () => new Set(coverage.matchedSkills.map((skill) => skill.name)),
    [coverage.matchedSkills],
  );
  const partialNames = useMemo(
    () => new Set(coverage.partiallyMatchingSkills.map((skill) => skill.name)),
    [coverage.partiallyMatchingSkills],
  );

  const confirmedNames = useMemo(
    () => new Set(coverage.confirmedMissingSkills.map((skill) => skill.name)),
    [coverage.confirmedMissingSkills],
  );

  const notPossessedNames = useMemo(
    () => new Set(coverage.notPossessedSkills.map((skill) => skill.name)),
    [coverage.notPossessedSkills],
  );

  const allRequirements = useMemo(
    () =>
      [
        ...new Map(
          [...analysis.requiredSkills, ...analysis.preferredSkills].map((skill) => [
            skill.name,
            skill,
          ]),
        ).values(),
      ],
    [analysis.preferredSkills, analysis.requiredSkills],
  );

  const unconfirmed = coverage.unconfirmedMissingSkills;
  const readyToGenerate = unconfirmed.length === 0;

  return (
    <section
      aria-labelledby="analysis-summary-heading"
      className="rounded-[26px] border border-line bg-card p-6 sm:p-8"
    >
      <div className="flex flex-wrap items-baseline justify-between gap-3">
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-accent">
            Step 2 of 3
          </p>
          <h3 id="analysis-summary-heading" className="mt-1 font-heading text-lg font-semibold tracking-[-0.01em] text-ink">
            Analysis summary
          </h3>
        </div>
        <span className="shrink-0 text-[11px] text-muted">
          {matchedCount} of {totalRequiredCount} JD skills matched
        </span>
      </div>

      <p className="mt-3 max-w-3xl text-xs leading-5 text-muted">
        Match calculation: unique dictionary skills found in the job description
        are counted once; skills also found in your resume are counted as
        matched. The percentage is a skill coverage indicator, not an ATS pass
        probability.
      </p>

      {allRequirements.length > 0 ? (
        <div className="mt-5">
          <h4 className="text-xs font-semibold tracking-tight text-ink">JD requirements</h4>
          <ul className="mt-2 grid gap-2 sm:grid-cols-2">
            {allRequirements.map((skill) => {
              const confirmation = confirmations[skill.name];
              const status = statusOf(skill, matchedNames, confirmation);
              const isPartial = partialNames.has(skill.name);
              const requirement = analysis.requirements.find(
                (item) => item.name === skill.name,
              );
              const kind = requirement?.kind ?? "required";

              return (
                <li
                  key={skill.name}
                  className="flex flex-wrap items-center justify-between gap-2 rounded-[22px] border border-line bg-accent-soft/40 px-3 py-2"
                >
                  <span className="min-w-0">
                    <span className="block truncate text-xs font-medium text-ink">
                      {skill.name}
                    </span>
                    <span className="block text-[10px] uppercase tracking-[0.12em] text-muted">
                      {requirementKindLabel(kind)}
                    </span>
                  </span>
                  <span
                    className={`shrink-0 rounded-full border px-2 py-0.5 text-[10px] font-medium ${statusClassName(status, isPartial)}`}
                  >
                    {statusLabel(status, isPartial)}
                  </span>
                </li>
              );
            })}
          </ul>
        </div>
      ) : (
        <p className="mt-5 text-xs leading-5 text-muted">
          No dictionary skills were found in this job description.
        </p>
      )}

      {coverage.partiallyMatchingSkills.length > 0 ? (
        <div className="mt-5 rounded-[22px] border border-line bg-card p-4">
          <h4 className="text-xs font-semibold tracking-tight text-muted">Partially matching</h4>
          <p className="mt-1 text-[11px] leading-5 text-muted">
            These tokens appear in your resume, but there is no full JD match.
            They never count as possessed unless you confirm them below.
          </p>
          <ul className="mt-3 flex flex-wrap gap-2">
            {coverage.partiallyMatchingSkills.map((skill) => (
              <li
                key={skill.name}
                className="rounded-full border border-line bg-accent-soft/40 px-2.5 py-1 text-[11px] font-medium text-muted"
              >
                {skill.name}
              </li>
            ))}
          </ul>
        </div>
      ) : null}

      <div className="mt-5 grid gap-4 lg:grid-cols-2">
        <div className="rounded-[22px] border border-line bg-card p-4 py-3">
          <h4 className="text-xs font-semibold tracking-tight text-ink">Missing skills to verify</h4>
          {unconfirmed.length > 0 ? (
            <ul className="mt-3 space-y-2">
              {unconfirmed.map((skill) => {
                const confirmation = confirmations[skill.name];
                return (
                  <li
                    key={skill.name}
                    className="flex flex-wrap items-center justify-between gap-2 rounded-[22px] border border-line bg-card px-2.5 py-2"
                  >
                    <span className="min-w-0">
                      <span className="block text-xs font-medium text-ink">{skill.name}</span>
                      <span className="block text-[10px] text-muted">Missing from your resume</span>
                    </span>
                    <span className="flex shrink-0 flex-wrap gap-1">
                      <button
                        type="button"
                        aria-pressed={confirmation === "confirmed"}
                        onClick={() => onConfirmationChange(skill.name, "confirmed")}
                        className="rounded-md border border-primary/30 bg-primary-soft px-2 py-1 text-[10px] font-medium text-primary"
                      >
                        I have this
                      </button>
                      <button
                        type="button"
                        aria-pressed={confirmation === "not-possessed"}
                        onClick={() => onConfirmationChange(skill.name, "not-possessed")}
                        className="rounded-md border border-danger/20 bg-danger-soft px-2 py-1 text-[10px] font-medium text-danger"
                      >
                        I don’t have it
                      </button>
                      {confirmation ? (
                        <button
                          type="button"
                          onClick={() => onConfirmationChange(skill.name, null)}
                          className="rounded-md border border-line bg-card px-2 py-1 text-[10px] font-medium text-muted"
                        >
                          Clear
                        </button>
                      ) : null}
                    </span>
                  </li>
                );
              })}
            </ul>
          ) : (
            <p className="mt-2 text-xs leading-5 text-muted">
              All JD skills are matched or confirmed.
            </p>
          )}

          {notPossessedNames.size > 0 ? (
            <div className="mt-3 border-t border-line/70 pt-3">
              <h5 className="text-[11px] font-medium text-muted">Not possessed</h5>
              <ul className="mt-1 flex flex-wrap gap-2">
                {coverage.notPossessedSkills.map((skill) => (
                  <li
                    key={skill.name}
                    className="rounded-full border border-danger/20 bg-danger-soft px-2 py-0.5 text-[11px] font-medium text-danger"
                  >
                    {skill.name}
                  </li>
                ))}
              </ul>
            </div>
          ) : null}

          {confirmedNames.size > 0 ? (
            <div className="mt-3 border-t border-line/70 pt-3">
              <h5 className="text-[11px] font-medium text-primary">Candidate-confirmed</h5>
              <ul className="mt-1 flex flex-wrap gap-2">
                {coverage.confirmedMissingSkills.map((skill) => (
                  <li
                    key={skill.name}
                    className="rounded-full border border-primary/30 bg-primary-soft px-2 py-0.5 text-[11px] font-medium text-primary"
                  >
                    {skill.name}
                  </li>
                ))}
              </ul>
            </div>
          ) : null}
        </div>

        <div className="rounded-[22px] border border-line bg-card p-4 py-3">
          <h4 className="text-xs font-semibold tracking-tight text-ink">Responsibilities from the job description</h4>
          {analysis.responsibilities.length > 0 ? (
            <ul className="mt-2 list-disc space-y-1.5 pl-4 text-xs leading-5 text-ink">
              {analysis.responsibilities.slice(0, 8).map((responsibility) => (
                <li key={responsibility}>{responsibility}</li>
              ))}
            </ul>
          ) : (
            <p className="mt-2 text-xs leading-5 text-muted">
              No explicit responsibilities were found in this job description.
            </p>
          )}
        </div>
      </div>

      <p className="mt-5 border-t border-line/70 pt-4 text-[11px] leading-5 text-muted">
        Matching found {percentage}% of JD skills in your resume. Missing or
        unconfirmed skills are shown as gaps and are never added to the
        generated resume automatically.
      </p>

      <div className="mt-5 flex flex-wrap items-center justify-between gap-3 border-t border-line/70 pt-4">
        <div className="min-w-0">
          <h4 className="text-xs font-semibold tracking-tight text-ink">Generate tailored resume</h4>
          <p className="mt-1 max-w-xl text-[11px] leading-5 text-muted">
            Candidate-confirmed skills are included; unconfirmed skills are
            excluded. The original resume stays unchanged and a separate
            tailored version is saved locally.
          </p>
          {generateError ? (
            <p role="alert" className="mt-2 text-[11px] leading-5 text-danger">
              {generateError}
            </p>
          ) : null}
        </div>

        <button
          type="button"
          onClick={onGenerate}
          disabled={!readyToGenerate || isGenerating}
          aria-describedby={!readyToGenerate ? "generate-requirements-note" : undefined}
          className="inline-flex h-10 shrink-0 items-center justify-center rounded-full bg-primary px-4 text-xs font-medium text-surface transition-colors hover:bg-accent-strong focus-visible:ring-2 focus-visible:ring-ring/40 focus-visible:ring-offset-2 focus-visible:ring-offset-surface focus-visible:outline-none disabled:pointer-events-none disabled:opacity-40"
        >
          {isGenerating ? "Generating…" : "Generate tailored resume"}
        </button>

        {!readyToGenerate ? (
          <p id="generate-requirements-note" className="w-full text-[11px] leading-5 text-muted">
            Confirm or decline the {unconfirmed.length} missing skill{unconfirmed.length === 1 ? "" : "s"} above to generate.
          </p>
        ) : null}
      </div>
    </section>
  );
}
