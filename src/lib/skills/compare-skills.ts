import { extractResumeSkills } from "./extract-resume-skills";
import { extractSkills, normalizeSkill } from "./extract-skills";

export type SkillComparison = {
  matchedSkills: ReturnType<typeof extractResumeSkills>;
  missingJdSkills: ReturnType<typeof extractSkills>["skills"];
  additionalResumeSkills: ReturnType<typeof extractResumeSkills>;
};

export function compareResumeAndJd(
  resumeText: string,
  jdText: string,
): SkillComparison {
  const resumeSkills = extractResumeSkills(resumeText);
  const jdSkills = extractSkills(jdText).skills;

  const resumeKeys = new Set(resumeSkills.map((skill) => normalizeSkill(skill.name)));
  const jdKeys = new Set(jdSkills.map((skill) => normalizeSkill(skill.name)));

  const matchedSkills = resumeSkills.filter((skill) =>
    jdKeys.has(normalizeSkill(skill.name)),
  );
  const missingJdSkills = jdSkills.filter((skill) => !resumeKeys.has(normalizeSkill(skill.name)));
  const additionalResumeSkills = resumeSkills.filter(
    (skill) => !jdKeys.has(normalizeSkill(skill.name)),
  );

  return {
    matchedSkills,
    missingJdSkills,
    additionalResumeSkills,
  };
}
