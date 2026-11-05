import { compareResumeAndJd } from "./compare-skills";
import type { Skill } from "./skill-dictionary";

export type PrioritizedResumeSkills = {
  matchedSkills: Skill[];
  additionalResumeSkills: Skill[];
  missingJdSkills: Skill[];
  prioritizedSkills: Skill[];
};

/**
 * Prioritizes existing resume skills based on JD relevance.
 * Matched skills are placed before unrelated (additional) skills.
 * Missing JD skills are reported separately and never added to the resume.
 * Original skill names and information are preserved.
 */
export function prioritizeResumeSkills(
  resumeText: string,
  jdText: string,
): PrioritizedResumeSkills {
  const comparison = compareResumeAndJd(resumeText, jdText);

  const prioritizedSkills = [
    ...comparison.matchedSkills,
    ...comparison.additionalResumeSkills,
  ];

  return {
    matchedSkills: comparison.matchedSkills,
    additionalResumeSkills: comparison.additionalResumeSkills,
    missingJdSkills: comparison.missingJdSkills,
    prioritizedSkills,
  };
}
