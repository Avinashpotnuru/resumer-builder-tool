import { prioritizeExperience } from "./prioritize-experience";
import type { ExperienceItem } from "./prioritize-experience";

export type ResumeSourceData = {
  jobTitle?: string | null;
  professionalSummary?: string | null;
  skills?: string[];
  experience?: ExperienceItem[];
};

export type SummaryFieldUsed =
  | "jobTitle"
  | "professionalSummary"
  | "skills"
  | "experience"
  | "projects"
  | "none";

export type GeneratedSummary = {
  text: string;
  fieldsUsed: SummaryFieldUsed[];
  isEditable: boolean;
  originalSummary: string | null;
};

export type SummaryTemplate = {
  id: string;
  name: string;
  template: string;
};

const SUMMARY_TEMPLATES: readonly SummaryTemplate[] = [
  {
    id: "skills-focused",
    name: "Skills-focused",
    template: "{jobTitle} with expertise in {skills}. {experienceHighlight}",
  },
  {
    id: "experience-focused",
    name: "Experience-focused",
    template: "{experienceHighlight}",
  },
  {
    id: "summary-based",
    name: "Summary-based",
    template: "{originalSummary}",
  },
  {
    id: "minimal",
    name: "Minimal",
    template: "{jobTitle}",
  },
];

export function getSummaryTemplates(): readonly SummaryTemplate[] {
  return SUMMARY_TEMPLATES;
}

function isEmpty(value: string | null | undefined): value is null | undefined {
  if (value === null || value === undefined) {
    return true;
  }

  return value.trim().length === 0;
}

function buildExperienceHighlight(
  experience: ExperienceItem[],
  jdText: string,
): { text: string; used: boolean } {
  if (experience.length === 0) {
    return { text: "", used: false };
  }

  const prioritized = prioritizeExperience(experience, jdText);
  const top = prioritized.relevantExperience[0] ?? experience[0];

  return {
    text: `Experienced ${top.jobTitle} at ${top.companyName}.`,
    used: true,
  };
}

/**
 * Generates a rule-based professional summary from verified resume information.
 * Never invents experience, years, skills, or achievements.
 * Uses only fields present in the source data; missing fields are skipped.
 * The original professional summary is preserved separately.
 */
export function generateProfessionalSummary(
  source: ResumeSourceData,
  jdText: string,
  templateId: string = "skills-focused",
): GeneratedSummary {
  const fieldsUsed = new Set<SummaryFieldUsed>();

  const jobTitle = isEmpty(source.jobTitle) ? null : source.jobTitle.trim();
  const originalSummary = isEmpty(source.professionalSummary)
    ? null
    : source.professionalSummary.trim();
  const skills = (source.skills ?? []).filter((s) => !isEmpty(s)).map((s) => s.trim());
  const experience = source.experience ?? [];

  const template =
    SUMMARY_TEMPLATES.find((t) => t.id === templateId) ?? SUMMARY_TEMPLATES[0];

  let jobTitlePart = "";
  if (jobTitle) {
    jobTitlePart = jobTitle;
    fieldsUsed.add("jobTitle");
  }

  let skillsPart = "";
  const topSkills = skills.slice(0, 3);
  if (topSkills.length > 0) {
    skillsPart = topSkills.join(", ");
    fieldsUsed.add("skills");
  }

  const experienceHighlight = buildExperienceHighlight(experience, jdText);
  if (experienceHighlight.used) {
    fieldsUsed.add("experience");
  }

  if (originalSummary && template.template.includes("{originalSummary}")) {
    fieldsUsed.add("professionalSummary");
  }

  let text = template.template
    .replace("{jobTitle}", jobTitlePart)
    .replace("{skills}", skillsPart)
    .replace("{experienceHighlight}", experienceHighlight.text)
    .replace("{originalSummary}", originalSummary ?? "");

  // Remove unfilled placeholders
  text = text.replace(/{[^}]+}/g, "");

  // Clean up dangling punctuation and whitespace from empty placeholders
  text = text
    .replace(/\s*with expertise in\s*\.\s*/g, " ")
    .replace(/\s*with expertise in\s*$/, "")
    .replace(/^\s*with expertise in\s*/, "")
    .replace(/^\s*[.,;]\s*/, "")
    .replace(/\s[.,;]\s*$/, "")
    .replace(/\s*\.\s*/g, ". ")
    .replace(/\.\s*\./g, ".")
    .replace(/,\s*,/g, ",")
    .replace(/\s{2,}/g, " ")
    .trim();

  // Fallback: if nothing could be composed, use the original summary if available
  if (text.length === 0) {
    if (originalSummary) {
      text = originalSummary;
      fieldsUsed.add("professionalSummary");
    } else {
      fieldsUsed.add("none");
    }
  }

  return {
    text,
    fieldsUsed: [...fieldsUsed],
    isEditable: true,
    originalSummary,
  };
}
