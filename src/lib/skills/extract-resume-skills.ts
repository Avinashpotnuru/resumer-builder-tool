import { extractSkills } from "./extract-skills";
import type { Skill } from "./skill-dictionary";

export function extractResumeSkills(text: string): Skill[] {
  const { skills } = extractSkills(text);
  return skills;
}
