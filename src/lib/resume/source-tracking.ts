import type { ExperienceItem } from "../skills/prioritize-experience";
import type { ProjectItem } from "../skills/prioritize-projects";
import type {
  AdditionalSection,
  CertificationItem,
  EducationItem,
  PersonalInfo,
} from "./editor-store";

export type SourceType = "original" | "optimized" | "user-edited";

export type SectionProvenance = {
  sectionId: string;
  sectionType: "summary" | "skills" | "experience" | "projects";
  sourceType: SourceType;
  originalField?: string;
  templateUsed?: string;
  changeReason?: string;
  optimizedAt?: string;
};

export type ChangeRecord = {
  field: string;
  originalValue: unknown;
  optimizedValue: unknown;
  changed: boolean;
};

export type SectionChangeSummary = {
  sectionId: string;
  sectionType: string;
  fieldsChanged: ChangeRecord[];
  changed: boolean;
};

export type OriginalResumeData = {
  id: string;
  jobTitle: string | null;
  professionalSummary: string | null;
  skills: string[];
  experience: ExperienceItem[];
  projects: ProjectItem[];
  createdAt: string;
  education?: EducationItem[];
  personalInfo?: PersonalInfo;
  certifications?: CertificationItem[];
  additionalSections?: AdditionalSection[];
  coverLetter?: string;
};

export type OptimizedResumeData = {
  id: string;
  originalResumeId: string;
  optimizedAt: string;
  jobTitle: string | null;
  professionalSummary: string | null;
  skills: string[];
  experience: ExperienceItem[];
  projects: ProjectItem[];
  provenance: SectionProvenance[];
  changes: SectionChangeSummary[];
  education?: EducationItem[];
  personalInfo?: PersonalInfo;
  certifications?: CertificationItem[];
  additionalSections?: AdditionalSection[];
  coverLetter?: string;
};

export type ResumeComparison = {
  originalResumeId: string;
  optimizedResumeId: string;
  sectionsCompared: SectionComparison[];
  overallChanged: boolean;
};

export type SectionComparison = {
  sectionId: string;
  sectionType: string;
  changed: boolean;
  originalValue: unknown;
  optimizedValue: unknown;
  sourceType: SourceType;
};

/**
 * Creates an immutable snapshot of the original resume data.
 * The returned object is frozen to prevent accidental mutation.
 */
export function createOriginalResume(data: {
  id: string;
  jobTitle: string | null;
  professionalSummary: string | null;
  skills: string[];
  experience: ExperienceItem[];
  projects: ProjectItem[];
  education?: EducationItem[];
  personalInfo?: PersonalInfo;
  certifications?: CertificationItem[];
  additionalSections?: AdditionalSection[];
  coverLetter?: string;
}): OriginalResumeData {
  const now = new Date().toISOString();

  const original: OriginalResumeData = {
    id: data.id,
    jobTitle: data.jobTitle ?? null,
    professionalSummary: data.professionalSummary ?? null,
    skills: [...data.skills],
    experience: data.experience.map((item) => ({
      ...item,
      achievements: [...item.achievements],
    })),
    projects: data.projects.map((item) => ({
      ...item,
      technologies: [...item.technologies],
    })),
    createdAt: now,
    education: data.education?.map((item) => ({ ...item })),
    personalInfo: data.personalInfo ? { ...data.personalInfo } : undefined,
    certifications: data.certifications
      ? data.certifications.map((item) => ({ ...item }))
      : undefined,
    additionalSections: data.additionalSections
      ? data.additionalSections.map((section) => ({
          ...section,
          entries: section.entries.map((entry) => ({ ...entry })),
        }))
      : undefined,
    coverLetter: data.coverLetter,
  };

  return Object.freeze(original);
}

/**
 * Creates an optimized resume from original data and optimization results.
 * The original resume is never modified; optimized data is stored separately.
 */
export function createOptimizedResume(params: {
  originalResume: OriginalResumeData;
  optimizedAt?: string;
  jobTitle?: string | null;
  professionalSummary?: string | null;
  skills?: string[];
  experience?: ExperienceItem[];
  projects?: ProjectItem[];
  education?: EducationItem[];
  provenance: SectionProvenance[];
  changes: SectionChangeSummary[];
  personalInfo?: PersonalInfo;
  certifications?: CertificationItem[];
  additionalSections?: AdditionalSection[];
  coverLetter?: string;
}): OptimizedResumeData {
  const optimizedAt = params.optimizedAt ?? new Date().toISOString();

  const optimized: OptimizedResumeData = {
    id: `${params.originalResume.id}-optimized`,
    originalResumeId: params.originalResume.id,
    optimizedAt,
    jobTitle: params.jobTitle ?? null,
    professionalSummary: params.professionalSummary ?? null,
    skills: params.skills ?? [],
    experience: (params.experience ?? []).map((item) => ({ ...item })),
    projects: (params.projects ?? []).map((item) => ({ ...item })),
    education: params.education
      ? params.education.map((item) => ({ ...item }))
      : params.originalResume.education
        ? params.originalResume.education.map((item) => ({ ...item }))
        : undefined,
    provenance: [...params.provenance],
    changes: [...params.changes],
    personalInfo: params.personalInfo
      ? { ...params.personalInfo }
      : params.originalResume.personalInfo
        ? { ...params.originalResume.personalInfo }
        : undefined,
    certifications: params.certifications
      ? params.certifications.map((item) => ({ ...item }))
      : params.originalResume.certifications
        ? params.originalResume.certifications.map((item) => ({ ...item }))
        : undefined,
    additionalSections: params.additionalSections
      ? params.additionalSections.map((section) => ({
          ...section,
          entries: section.entries.map((entry) => ({ ...entry })),
        }))
      : params.originalResume.additionalSections
        ? params.originalResume.additionalSections.map((section) => ({
            ...section,
            entries: section.entries.map((entry) => ({ ...entry })),
          }))
        : undefined,
    coverLetter: params.coverLetter,
  };

  return Object.freeze(optimized);
}

/**
 * Compares original and optimized resume data section by section.
 * Returns which sections changed and how.
 */
export function compareOriginalVsOptimized(
  original: OriginalResumeData,
  optimized: OptimizedResumeData,
): ResumeComparison {
  const sections: SectionComparison[] = [];

  // Compare job title
  const jobTitleChanged = original.jobTitle !== optimized.jobTitle;
  sections.push({
    sectionId: "jobTitle",
    sectionType: "metadata",
    changed: jobTitleChanged,
    originalValue: original.jobTitle,
    optimizedValue: optimized.jobTitle,
    sourceType: jobTitleChanged ? "optimized" : "original",
  });

  // Compare professional summary
  const summaryChanged = original.professionalSummary !== optimized.professionalSummary;
  sections.push({
    sectionId: "professionalSummary",
    sectionType: "summary",
    changed: summaryChanged,
    originalValue: original.professionalSummary,
    optimizedValue: optimized.professionalSummary,
    sourceType: summaryChanged ? "optimized" : "original",
  });

  // Compare skills
  const originalSkills = [...original.skills].sort();
  const optimizedSkills = [...optimized.skills].sort();
  const skillsChanged = JSON.stringify(originalSkills) !== JSON.stringify(optimizedSkills);
  sections.push({
    sectionId: "skills",
    sectionType: "skills",
    changed: skillsChanged,
    originalValue: original.skills,
    optimizedValue: optimized.skills,
    sourceType: skillsChanged ? "optimized" : "original",
  });

  // Compare experience count and IDs (structure preserved)
  const experienceChanged =
    original.experience.length !== optimized.experience.length ||
    original.experience.some((exp, i) => {
      const opt = optimized.experience[i];
      return (
        exp.jobTitle !== opt.jobTitle ||
        exp.companyName !== opt.companyName ||
        exp.description !== opt.description
      );
    });
  sections.push({
    sectionId: "experience",
    sectionType: "experience",
    changed: experienceChanged,
    originalValue: original.experience,
    optimizedValue: optimized.experience,
    sourceType: experienceChanged ? "optimized" : "original",
  });

  // Compare projects
  const projectsChanged =
    original.projects.length !== optimized.projects.length ||
    original.projects.some((proj, i) => {
      const opt = optimized.projects[i];
      return (
        proj.name !== opt.name ||
        proj.description !== opt.description ||
        JSON.stringify(proj.technologies) !== JSON.stringify(opt.technologies)
      );
    });
  sections.push({
    sectionId: "projects",
    sectionType: "projects",
    changed: projectsChanged,
    originalValue: original.projects,
    optimizedValue: optimized.projects,
    sourceType: projectsChanged ? "optimized" : "original",
  });

  return {
    originalResumeId: original.id,
    optimizedResumeId: optimized.id,
    sectionsCompared: sections,
    overallChanged: sections.some((s) => s.changed),
  };
}

/**
 * Creates a provenance entry for a section that was optimized from original data.
 */
export function createProvenance(params: {
  sectionId: string;
  sectionType: SectionProvenance["sectionType"];
  sourceType: SourceType;
  originalField?: string;
  templateUsed?: string;
  changeReason?: string;
}): SectionProvenance {
  return {
    sectionId: params.sectionId,
    sectionType: params.sectionType,
    sourceType: params.sourceType,
    originalField: params.originalField ?? undefined,
    templateUsed: params.templateUsed ?? undefined,
    changeReason: params.changeReason ?? undefined,
    optimizedAt: new Date().toISOString(),
  };
}

/**
 * Creates a change record for a field that was modified during optimization.
 */
function deepEqual(a: unknown, b: unknown): boolean {
  if (a === b) {
    return true;
  }

  if (Array.isArray(a) && Array.isArray(b)) {
    if (a.length !== b.length) {
      return false;
    }

    return a.every((item, index) => deepEqual(item, b[index]));
  }

  if (
    typeof a === "object" &&
    a !== null &&
    typeof b === "object" &&
    b !== null
  ) {
    const keysA = Object.keys(a as Record<string, unknown>);
    const keysB = Object.keys(b as Record<string, unknown>);

    if (keysA.length !== keysB.length) {
      return false;
    }

    return keysA.every((key) => deepEqual((a as Record<string, unknown>)[key], (b as Record<string, unknown>)[key]));
  }

  return false;
}

/**
 * Creates a change record for a field that was modified during optimization.
 */
export function createChangeRecord(params: {
  field: string;
  originalValue: unknown;
  optimizedValue: unknown;
}): ChangeRecord {
  return {
    field: params.field,
    originalValue: params.originalValue,
    optimizedValue: params.optimizedValue,
    changed: !deepEqual(params.originalValue, params.optimizedValue),
  };
}

/**
 * Checks whether optimized content contains only facts traceable to the original resume.
 * Returns true if no new information was introduced beyond what existed in the original.
 */
export function isContentTraceableToOriginal(
  original: OriginalResumeData,
  optimized: OptimizedResumeData,
): boolean {
  // Skills in optimized must be a subset of original skills
  const originalSkills = new Set(original.skills.map((s) => s.toLowerCase().trim()));
  const optimizedSkills = optimized.skills.map((s) => s.toLowerCase().trim());
  const skillsSubset = optimizedSkills.every((s) => originalSkills.has(s));

  // Experience items must have matching IDs in original
  const originalExpIds = new Set(original.experience.map((e) => e.id));
  const experienceIdsValid = optimized.experience.every((e) => originalExpIds.has(e.id));

  // Projects items must have matching IDs in original
  const originalProjectIds = new Set(original.projects.map((p) => p.id));
  const projectIdsValid = optimized.projects.every((p) => originalProjectIds.has(p.id));

  return skillsSubset && experienceIdsValid && projectIdsValid;
}
