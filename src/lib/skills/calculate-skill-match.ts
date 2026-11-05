import { compareResumeAndJd } from "./compare-skills";

export type SkillMatchPercentage = {
  matchedCount: number;
  totalRequiredCount: number;
  percentage: number;
};

export function calculateSkillMatchPercentage(
  resumeText: string,
  jdText: string,
): SkillMatchPercentage {
  const comparison = compareResumeAndJd(resumeText, jdText);

  const totalRequiredCount = comparison.missingJdSkills.length + comparison.matchedSkills.length;
  const matchedCount = comparison.matchedSkills.length;

  const percentage =
    totalRequiredCount === 0
      ? 0
      : Math.round((matchedCount / totalRequiredCount) * 10000) / 100;

  return { matchedCount, totalRequiredCount, percentage };
}
