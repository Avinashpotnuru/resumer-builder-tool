"use client";

import { useMemo } from "react";
import { calculateSkillMatchPercentage } from "@/lib/skills/calculate-skill-match";
import { compareResumeAndJd } from "@/lib/skills/compare-skills";

type ResumeMatchResultsProps = {
  resumeText: string;
  jdText: string;
};

export function ResumeMatchResults({ resumeText, jdText }: ResumeMatchResultsProps) {
  const comparison = useMemo(() => compareResumeAndJd(resumeText, jdText), [resumeText, jdText]);
  const { matchedCount, totalRequiredCount, percentage } = useMemo(
    () => calculateSkillMatchPercentage(resumeText, jdText),
    [resumeText, jdText],
  );

  const resumeReady = resumeText.trim().length > 0;

  if (totalRequiredCount === 0) {
    return (
      <section
        aria-labelledby="match-results-heading"
        className="rounded-[26px] border border-line bg-card p-6 sm:p-8"
      >
        <h3 id="match-results-heading" className="font-heading text-lg font-semibold tracking-[-0.01em] text-ink">
          Skill match
        </h3>
        <p className="mt-3 text-xs leading-5 text-muted">
          No skills were found in the job description to compare.
        </p>
      </section>
    );
  }

  if (!resumeReady) {
    return (
      <section
        aria-labelledby="match-results-heading"
        className="rounded-[26px] border border-line bg-card p-6 sm:p-8"
      >
        <h3 id="match-results-heading" className="font-heading text-lg font-semibold tracking-[-0.01em] text-ink">
          Skill match
        </h3>
        <p className="mt-2 text-xs leading-5 text-muted">
          Upload and review your resume to compare it against this job description.
        </p>
      </section>
    );
  }

  return (
    <section
      aria-labelledby="match-results-heading"
      className="rounded-[26px] border border-line bg-card p-6 sm:p-8"
    >
      <div className="flex items-baseline justify-between gap-3">
        <h3 id="match-results-heading" className="font-heading text-lg font-semibold tracking-[-0.01em] text-ink">
          Skill match
        </h3>
        <span className="shrink-0 text-[11px] text-muted">
          {matchedCount} of {totalRequiredCount} required skills matched
        </span>
      </div>

      <div className="mt-5 flex items-center gap-3">
        <span className="font-heading text-3xl font-semibold text-ink">{percentage}%</span>
        <div
          className="h-2 w-full max-w-xs rounded-full bg-ink/5"
          role="progressbar"
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={Math.round(percentage)}
          aria-label="Skill match percentage"
        >
          <div
            className="h-full rounded-full bg-accent"
            style={{ width: `${Math.min(percentage, 100)}%` }}
          />
        </div>
      </div>

      <div className="mt-5 grid gap-4 sm:grid-cols-2">
        <div className="rounded-[22px] border border-line bg-accent-soft/40 px-4 py-3">
          <h4 className="text-xs font-semibold tracking-tight text-ink">Matched skills</h4>
          {comparison.matchedSkills.length > 0 ? (
            <ul className="mt-2 flex flex-wrap gap-2">
              {comparison.matchedSkills.map((skill) => (
                <li
                  key={skill.name}
                  className="rounded-full border border-accent/20 bg-accent-soft px-2.5 py-1 text-[11px] font-medium text-accent"
                >
                  {skill.name}
                </li>
              ))}
            </ul>
          ) : (
            <p className="mt-2 text-xs leading-5 text-muted">No matching skills found.</p>
          )}
        </div>

        <div className="rounded-[22px] border border-line bg-danger-soft px-4 py-3">
          <h4 className="text-xs font-semibold tracking-tight text-ink">Missing JD skills</h4>
          {comparison.missingJdSkills.length > 0 ? (
            <ul className="mt-2 flex flex-wrap gap-2">
              {comparison.missingJdSkills.map((skill) => (
                <li
                  key={skill.name}
                  className="rounded-full border border-danger/30 bg-danger-soft px-2.5 py-1 text-[11px] font-medium text-danger"
                >
                  {skill.name}
                </li>
              ))}
            </ul>
          ) : (
            <p className="mt-2 text-xs leading-5 text-muted">No missing skills found.</p>
          )}
        </div>
      </div>

      {comparison.additionalResumeSkills.length > 0 ? (
        <div className="mt-5">
          <h4 className="text-xs font-semibold tracking-tight text-ink">Additional resume skills</h4>
          <ul className="mt-2 flex flex-wrap gap-2">
            {comparison.additionalResumeSkills.map((skill) => (
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
    </section>
  );
}
