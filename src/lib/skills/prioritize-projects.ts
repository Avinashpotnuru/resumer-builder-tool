import { extractSkills } from "./extract-skills";

export type ProjectItem = {
  id: string;
  name: string;
  description: string;
  technologies: string[];
  link?: string;
  url?: string;
  githubUrl?: string;
  startDate?: string;
  endDate?: string | null;
  achievements?: string[];
};

export type PrioritizedProjectItem = ProjectItem & {
  originalIndex: number;
  relevanceScore: number;
  matchedKeywords: string[];
};

export type PrioritizedProjectResult = {
  prioritizedProjects: PrioritizedProjectItem[];
  relevantProjects: PrioritizedProjectItem[];
  additionalProjects: PrioritizedProjectItem[];
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
 * Prioritizes project items based on relevance to JD skills and keywords.
 * Relevant projects (items mentioning JD skills/keywords) are placed first,
 * followed by unrelated projects. All original project data is preserved.
 * Missing JD skills are never added to project items.
 * Original source index is tracked for each reordered item.
 */
export function prioritizeProjects(
  projectItems: ProjectItem[],
  jdText: string,
): PrioritizedProjectResult {
  const jdSkills = extractSkillsFromJd(jdText);
  const jdKeywords = jdSkills.map((skill) => normalizeKeyword(skill.name));

  const prioritized: PrioritizedProjectItem[] = projectItems.map(
    (item, index) => {
      const itemKeywords = extractKeywordsFromText(
        `${item.name} ${item.description} ${item.technologies.join(" ")}`,
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

  const relevantProjects = prioritized.filter((item) => item.relevanceScore > 0);
  const additionalProjects = prioritized.filter((item) => item.relevanceScore === 0);

  return {
    prioritizedProjects: prioritized,
    relevantProjects,
    additionalProjects,
  };
}
