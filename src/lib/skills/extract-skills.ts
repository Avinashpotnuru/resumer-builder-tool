import { getUniqueSkills, normalizeSkill, type Skill } from "./skill-dictionary";

export { normalizeSkill };
const escapeRegExp = (value: string): string => value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

export type SkillExtraction = {
  skills: Skill[];
};

export function extractSkills(text: string): SkillExtraction {
  const normalizedText = normalizeSkill(text);
  const matchedSkills = new Map<string, Skill>();

  for (const skill of getUniqueSkills()) {
    const candidates = [skill.name, ...skill.aliases];
    const isMatch = candidates.some((candidate) => {
      // Treat a period as a boundary only at true sentence/clause ends, so
      // "TypeScript." matches while "Node.js" does not count as "Node" or "JS".
      const boundaryBefore = `(?<![a-zA-Z0-9])(?<![a-zA-Z0-9]\\.)`;
      const boundaryAfter = `(?=$|[^a-zA-Z0-9.]|\\.(?![a-zA-Z0-9]))`;
      const pattern = new RegExp(
        `${boundaryBefore}${escapeRegExp(normalizeSkill(candidate))}${boundaryAfter}`,
        "i",
      );
      return pattern.test(normalizedText);
    });

    if (isMatch) {
      matchedSkills.set(skill.name, skill);
    }
  }

  return { skills: [...matchedSkills.values()] };
}
