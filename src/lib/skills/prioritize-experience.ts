import { extractSkills } from "./extract-skills";

export type ExperienceItem = {
  id: string;
  jobTitle: string;
  companyName: string;
  startDate: string;
  endDate: string | null;
  description: string;
  achievements: string[];
  employmentType?: string;
  location?: string;
  isCurrent?: boolean;
};

export type PrioritizedExperienceItem = ExperienceItem & {
  originalIndex: number;
  relevanceScore: number;
  matchedKeywords: string[];
};

export type PrioritizedExperienceResult = {
  prioritizedExperience: PrioritizedExperienceItem[];
  relevantExperience: PrioritizedExperienceItem[];
  additionalExperience: PrioritizedExperienceItem[];
};

function normalizeKeyword(value: string): string {
  return value.trim().toLowerCase().replace(/\s+/g, " ");
}

function extractKeywordsFromText(text: string, keywords: readonly string[]): string[] {
  const normalizedText = normalizeKeyword(text);
  return keywords.filter((keyword) => {
    const normalizedKeyword = normalizeKeyword(keyword);
    return normalizedText.includes(normalizedKeyword);
  });
}

function extractSkillsFromJd(jdText: string): { name: string }[] {
  return extractSkills(jdText).skills;
}

/**
 * Prioritizes work experience items based on relevance to JD skills and keywords.
 * Relevant experience (items mentioning JD skills/keywords) is placed first,
 * followed by unrelated experience. All original data is preserved.
 * Missing JD skills are never added to experience items.
 * Original source index is tracked for each reordered item.
 */
export function prioritizeExperience(
  experienceItems: ExperienceItem[],
  jdText: string,
): PrioritizedExperienceResult {
  const jdSkills = extractSkillsFromJd(jdText);
  const jdKeywords = jdSkills.map((skill) => normalizeKeyword(skill.name));

  const prioritized: PrioritizedExperienceItem[] = experienceItems.map(
    (item, index) => {
      const itemKeywords = extractKeywordsFromText(
        `${item.description} ${item.achievements.join(" ")} ${item.jobTitle}`,
        jdKeywords,
      );

      return {
        ...item,
        originalIndex: index,
        relevanceScore: itemKeywords.length,
        matchedKeywords: itemKeywords,
      };
    },
  );

  prioritized.sort(
    (a, b) => b.relevanceScore - a.relevanceScore || a.originalIndex - b.originalIndex,
  );

  const relevantExperience = prioritized.filter((item) => item.relevanceScore > 0);
  const additionalExperience = prioritized.filter((item) => item.relevanceScore === 0);

  return {
    prioritizedExperience: prioritized,
    relevantExperience,
    additionalExperience,
  };
}
