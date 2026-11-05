import type {
  EditorResumeData,
  ExperienceItem,
  ProjectItem,
  ResumeSectionId,
} from "./editor-store";
import { createDefaultSectionOrder } from "./editor-store";
import { coverageForJobDescription, analyzeJobDescription } from "./jd-analysis";
import {
  createOriginalResumeFromText,
  parseResumeText,
} from "./parse-resume-text";
import {
  prioritizeExperience,
} from "../skills/prioritize-experience";
import { prioritizeProjects } from "../skills/prioritize-projects";
import { generateProfessionalSummary } from "../skills/generate-summary";
import type { OptimizedResumeData } from "./source-tracking";

export type SkillConfirmation = "confirmed" | "not-possessed";
export type SkillConfirmations = Record<string, SkillConfirmation>;

export type BuildTailoredResumeInput = {
  resumeText: string;
  jdText: string;
  /** Optional candidate-confirmed missing skills. */
  confirmations: SkillConfirmations;
  /** User-provided JD role title and company, when supplied. */
  targetJobTitle?: string | null;
  companyName?: string | null;
};

export type BuildTailoredResumeResult =
  | {
      ok: true;
      original: ReturnType<typeof createOriginalResumeFromText>;
      optimized: OptimizedResumeData;
      workingResume: EditorResumeData;
      sectionOrder: ResumeSectionId[];
      targetJobTitle: string;
      companyName: string;
    }
  | {
      ok: false;
      reason: string;
    };

function stripExperienceMetadata(item: ExperienceItem): ExperienceItem {
  return {
    id: item.id,
    jobTitle: item.jobTitle,
    companyName: item.companyName,
    startDate: item.startDate,
    endDate: item.endDate,
    description: item.description,
    achievements: [...item.achievements],
    employmentType: item.employmentType,
    location: item.location,
    isCurrent: item.isCurrent,
  };
}

function stripProjectMetadata(item: ProjectItem): ProjectItem {
  return {
    id: item.id,
    name: item.name,
    description: item.description,
    technologies: [...item.technologies],
    link: item.link,
    url: item.url,
    githubUrl: item.githubUrl,
    startDate: item.startDate,
    endDate: item.endDate,
    achievements: item.achievements ? [...item.achievements] : undefined,
  };
}

function uniquePreservingOrder<T>(items: readonly T[], key: (item: T) => string): T[] {
  const seen = new Set<string>();
  return items.filter((item) => {
    const id = key(item);
    if (seen.has(id)) return false;
    seen.add(id);
    return true;
  });
}

function parseResumeSafe(raw: string) {
  return parseResumeText(raw);
}

/**
 * Deterministically builds a job-specific tailored resume from one uploaded
 * resume. It never invents facts and only unlocks pre-existing or
 * candidate-confirmed content.
 */
export function buildTailoredResume(
  input: BuildTailoredResumeInput,
): BuildTailoredResumeResult {
  const { resumeText, jdText, confirmations, targetJobTitle, companyName } = input;
  const analysis = analyzeJobDescription(jdText);
  const allRequirementNames = analysis.requirements.map((requirement) => requirement.name);

  if (allRequirementNames.length === 0) {
    return {
      ok: false,
      reason: "The job description does not contain any dictionary skills to target.",
    };
  }

  const coverage = coverageForJobDescription({
    resumeText,
    jdText,
    confirmations,
  });

  if (coverage.unconfirmedMissingSkills.length > 0) {
    const names = coverage.unconfirmedMissingSkills.slice(0, 5).map((skill) => skill.name);
    return {
      ok: false,
      reason: `Confirm or decline these missing skills first: ${names.join(", ")}.`,
    };
  }

  const parsed = parseResumeSafe(resumeText);
  const original = createOriginalResumeFromText(resumeText);
  const prioritizedExperience = prioritizeExperience(parsed.experience, jdText)
    .prioritizedExperience.map(stripExperienceMetadata);
  const prioritizedProjects = prioritizeProjects(parsed.projects, jdText)
    .prioritizedProjects.map(stripProjectMetadata);

  const jobTitle = targetJobTitle?.trim() || parsed.jobTitle || null;
  const skills = uniquePreservingOrder(coverage.possessedSkills, (skill) => skill.name).map(
    (skill) => skill.name,
  );

  const summary = generateProfessionalSummary(
    {
      jobTitle,
      professionalSummary: parsed.professionalSummary,
      skills,
      experience: parsed.experience,
    },
    jdText,
    "skills-focused",
  );

  const confirmedMissing = coverage.confirmedMissingSkills.map((skill) => skill.name);
  const changedSkills = JSON.stringify(parsed.skills) !== JSON.stringify(skills) || confirmedMissing.length > 0;

  const optimized: OptimizedResumeData = {
    id: `${original.id}-optimized`,
    originalResumeId: original.id,
    optimizedAt: new Date().toISOString(),
    jobTitle,
    professionalSummary: summary.text.length > 0 ? summary.text : parsed.professionalSummary,
    skills,
    experience: prioritizedExperience,
    projects: prioritizedProjects,
    provenance:
      coverage.confirmedMissingSkills.length > 0
        ? [
            {
              sectionId: "skills",
              sectionType: "skills",
              sourceType: "user-edited",
              changeReason: "candidate-confirmed JD skills",
              templateUsed: "skills-focused",
              optimizedAt: new Date().toISOString(),
            },
          ]
        : [],
    personalInfo: original.personalInfo,
    certifications: original.certifications,
    additionalSections: original.additionalSections,
    education: parsed.education.map((item) => ({ ...item })),
    changes: [
      {
        sectionId: "skills",
        sectionType: "skills",
        fieldsChanged: [
          {
            field: "skills",
            originalValue: parsed.skills,
            optimizedValue: skills,
            changed: JSON.stringify(parsed.skills) !== JSON.stringify(skills),
          },
          ...confirmedMissing.map((skill) => ({
            field: `skills:${skill}`,
            originalValue: "missing",
            optimizedValue: "candidate-confirmed",
            changed: true,
          })),
        ],
        changed: changedSkills,
      },
    ],
  };

  const workingResume: EditorResumeData = {
    jobTitle: optimized.jobTitle,
    professionalSummary: optimized.professionalSummary,
    skills: [...optimized.skills],
    experience: optimized.experience.map((item) => ({
      ...item,
      achievements: [...item.achievements],
    })),
    projects: optimized.projects.map((item) => ({
      ...item,
      technologies: [...item.technologies],
    })),
    education: parsed.education.map((item) => ({ ...item })),
    personalInfo: original.personalInfo,
    certifications: original.certifications,
    additionalSections: original.additionalSections,
  };

  return {
    ok: true,
    original,
    optimized,
    workingResume,
    sectionOrder: createDefaultSectionOrder(),
    targetJobTitle: jobTitle ?? "Tailored resume",
    companyName: companyName?.trim() ?? "",
  };
}
