import { create } from "zustand";

import type { OriginalResumeData, OptimizedResumeData } from "./source-tracking";
import { DEFAULT_RESUME_TEMPLATE } from "./template-catalog";
import type { AnyTemplateId } from "./template-catalog";

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

export type EducationItem = {
  id: string;
  schoolName: string;
  degree: string;
  fieldOfStudy: string;
  startDate: string;
  endDate: string | null;
  location: string;
  grade?: string;
};

export type PersonalInfo = {
  fullName: string;
  professionalTitle: string;
  email: string;
  phone: string;
  city: string;
  state: string;
  country: string;
  linkedin: string;
  github: string;
  portfolio: string;
  website: string;
};

export type CertificationItem = {
  id: string;
  name: string;
  issuer: string;
  issueDate: string;
  expirationDate: string;
  credentialUrl: string;
};

export type AdditionalEntry = {
  id: string;
  title: string;
  subtitle: string;
  date: string;
  description: string;
  url: string;
};

export type AdditionalSection = {
  id: string;
  title: string;
  entries: AdditionalEntry[];
};

export function createEmptyPersonalInfo(): PersonalInfo {
  return {
    fullName: "",
    professionalTitle: "",
    email: "",
    phone: "",
    city: "",
    state: "",
    country: "",
    linkedin: "",
    github: "",
    portfolio: "",
    website: "",
  };
}

export function createEmptyCertification(): CertificationItem {
  return {
    id: `certification-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    name: "",
    issuer: "",
    issueDate: "",
    expirationDate: "",
    credentialUrl: "",
  };
}

export function createEmptyAdditionalSection(title = ""): AdditionalSection {
  return {
    id: `additional-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    title,
    entries: [],
  };
}

export function createEmptyAdditionalEntry(): AdditionalEntry {
  return {
    id: `entry-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    title: "",
    subtitle: "",
    date: "",
    description: "",
    url: "",
  };
}

export const RESUME_SECTION_ORDER = [
  "summary",
  "skills",
  "experience",
  "projects",
  "education",
] as const;

export type ResumeSectionId = (typeof RESUME_SECTION_ORDER)[number];

export const RESUME_SECTION_LABELS: Record<ResumeSectionId, string> = {
  summary: "Professional summary",
  skills: "Technical skills",
  experience: "Work experience",
  projects: "Projects",
  education: "Education",
};

export function createDefaultSectionOrder(): ResumeSectionId[] {
  return [...RESUME_SECTION_ORDER];
}

export {
  DEFAULT_RESUME_TEMPLATE,
  RESUME_TEMPLATE_LABELS,
  RESUME_TEMPLATES,
  CUSTOM_TEMPLATE_PREFIX,
  type CustomTemplateId,
  type AnyTemplateId,
  isCustomTemplateId,
  isAnyTemplateId,
} from "./template-catalog";
export type { ResumeTemplateId } from "./template-catalog";

export type EditorResumeData = {
  jobTitle: string | null;
  professionalSummary: string | null;
  skills: string[];
  experience: ExperienceItem[];
  projects: ProjectItem[];
  education: EducationItem[];
  personalInfo?: PersonalInfo;
  certifications?: CertificationItem[];
  additionalSections?: AdditionalSection[];
  coverLetter?: string;
};

export type ResumeEditorState = {
  originalResume: OriginalResumeData | null;
  optimizedResume: OptimizedResumeData | null;
  workingResume: EditorResumeData | null;
  sectionOrder: ResumeSectionId[];
  template: AnyTemplateId;
  isDirty: boolean;

  setResumes: (
    original: OriginalResumeData,
    optimized: OptimizedResumeData,
  ) => void;
  updateJobTitle: (value: string | null) => void;
  updateProfessionalSummary: (value: string | null) => void;
  updateCoverLetter: (value: string) => void;
  updatePersonalInfo: (updates: Partial<PersonalInfo>) => void;
  updateSkills: (skills: string[]) => void;
  addExperience: (item: ExperienceItem) => void;
  updateExperience: (id: string, updates: Partial<ExperienceItem>) => void;
  removeExperience: (id: string) => void;
  moveExperience: (id: string, direction: "up" | "down") => void;
  addProject: (item: ProjectItem) => void;
  updateProject: (id: string, updates: Partial<ProjectItem>) => void;
  removeProject: (id: string) => void;
  moveProject: (id: string, direction: "up" | "down") => void;
  addEducation: (item: EducationItem) => void;
  updateEducation: (id: string, updates: Partial<EducationItem>) => void;
  removeEducation: (id: string) => void;
  addCertification: (item: CertificationItem) => void;
  updateCertification: (
    id: string,
    updates: Partial<CertificationItem>,
  ) => void;
  removeCertification: (id: string) => void;
  addAdditionalSection: (section: AdditionalSection) => void;
  updateAdditionalSection: (id: string, title: string) => void;
  removeAdditionalSection: (id: string) => void;
  addAdditionalEntry: (sectionId: string, entry: AdditionalEntry) => void;
  updateAdditionalEntry: (
    sectionId: string,
    entryId: string,
    updates: Partial<AdditionalEntry>,
  ) => void;
  removeAdditionalEntry: (sectionId: string, entryId: string) => void;
  moveSection: (id: ResumeSectionId, direction: "up" | "down") => void;
  resetSectionOrder: () => void;
  setTemplate: (template: AnyTemplateId) => void;
  hydrateSavedResume: (
    original: OriginalResumeData,
    optimized: OptimizedResumeData,
    resume: EditorResumeData,
    sectionOrder: ResumeSectionId[],
    template: AnyTemplateId,
  ) => void;
  resetWorkingResume: () => void;
  setDirty: (dirty: boolean) => void;
};

function cloneEditorResume(resume: EditorResumeData): EditorResumeData {
  return {
    jobTitle: resume.jobTitle,
    professionalSummary: resume.professionalSummary,
    skills: [...resume.skills],
    experience: resume.experience.map((item) => ({
      ...item,
      achievements: [...item.achievements],
    })),
    projects: resume.projects.map((item) => ({
      ...item,
      technologies: [...item.technologies],
      achievements: item.achievements ? [...item.achievements] : undefined,
    })),
    education: resume.education.map((item) => ({ ...item })),
    personalInfo: resume.personalInfo ? { ...resume.personalInfo } : undefined,
    certifications: resume.certifications
      ? resume.certifications.map((item) => ({ ...item }))
      : undefined,
    additionalSections: resume.additionalSections
      ? resume.additionalSections.map((section) => ({
          ...section,
          entries: section.entries.map((entry) => ({ ...entry })),
        }))
      : undefined,
    coverLetter: resume.coverLetter,
  };
}

function moveById<T extends { id: string }>(
  items: T[],
  id: string,
  direction: "up" | "down",
): T[] {
  const index = items.findIndex((item) => item.id === id);
  const target = direction === "up" ? index - 1 : index + 1;

  if (index === -1 || target < 0 || target >= items.length) {
    return items;
  }

  const next = [...items];
  const [moved] = next.splice(index, 1);
  next.splice(target, 0, moved);
  return next;
}

export const useResumeEditorStore = create<ResumeEditorState>((set) => ({
  originalResume: null,
  optimizedResume: null,
  workingResume: null,
  sectionOrder: createDefaultSectionOrder(),
  template: DEFAULT_RESUME_TEMPLATE,
  isDirty: false,

  setResumes: (original, optimized) => {
    set((state) => {
      const isSameResume =
        state.originalResume?.id === original.id &&
        state.optimizedResume?.id === optimized.id;

      if (isSameResume) {
        return state;
      }

      const working: EditorResumeData = {
        jobTitle: optimized.jobTitle ?? null,
        professionalSummary: optimized.professionalSummary ?? null,
        skills: [...optimized.skills],
        experience: optimized.experience.map((item) => ({
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
        })),
        projects: optimized.projects.map((item) => ({
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
        })),
        education: optimized.education
          ? optimized.education.map((item) => ({ ...item }))
          : [],
        personalInfo: optimized.personalInfo
          ? { ...optimized.personalInfo }
          : undefined,
        certifications: optimized.certifications
          ? optimized.certifications.map((item) => ({ ...item }))
          : undefined,
        additionalSections: optimized.additionalSections
          ? optimized.additionalSections.map((section) => ({
              ...section,
              entries: section.entries.map((entry) => ({ ...entry })),
            }))
          : undefined,
        coverLetter: optimized.coverLetter,
      };

      return {
        originalResume: original,
        optimizedResume: optimized,
        workingResume: working,
        sectionOrder: createDefaultSectionOrder(),
        template: DEFAULT_RESUME_TEMPLATE,
        isDirty: false,
      };
    });
  },

  updateJobTitle: (value) =>
    set((state) => {
      if (!state.workingResume) return state;
      return {
        workingResume: { ...state.workingResume, jobTitle: value },
        isDirty: true,
      };
    }),

  updateProfessionalSummary: (value) =>
    set((state) => {
      if (!state.workingResume) return state;
      return {
        workingResume: {
          ...state.workingResume,
          professionalSummary: value,
        },
        isDirty: true,
      };
    }),

  updateCoverLetter: (value) =>
    set((state) => {
      if (!state.workingResume) return state;
      return {
        workingResume: {
          ...state.workingResume,
          coverLetter: value,
        },
        isDirty: true,
      };
    }),

  updatePersonalInfo: (updates) =>
    set((state) => {
      if (!state.workingResume) return state;
      return {
        workingResume: {
          ...state.workingResume,
          personalInfo: {
            ...createEmptyPersonalInfo(),
            ...state.workingResume.personalInfo,
            ...updates,
          },
        },
        isDirty: true,
      };
    }),

  updateSkills: (skills) =>
    set((state) => {
      if (!state.workingResume) return state;
      return {
        workingResume: { ...state.workingResume, skills: [...skills] },
        isDirty: true,
      };
    }),

  addExperience: (item) =>
    set((state) => {
      if (!state.workingResume) return state;
      return {
        workingResume: {
          ...state.workingResume,
          experience: [...state.workingResume.experience, item],
        },
        isDirty: true,
      };
    }),

  updateExperience: (id, updates) =>
    set((state) => {
      if (!state.workingResume) return state;
      return {
        workingResume: {
          ...state.workingResume,
          experience: state.workingResume.experience.map((item) =>
            item.id === id ? { ...item, ...updates } : item,
          ),
        },
        isDirty: true,
      };
    }),

  removeExperience: (id) =>
    set((state) => {
      if (!state.workingResume) return state;
      return {
        workingResume: {
          ...state.workingResume,
          experience: state.workingResume.experience.filter((item) => item.id !== id),
        },
        isDirty: true,
      };
    }),

  moveExperience: (id, direction) =>
    set((state) => {
      if (!state.workingResume) return state;
      return {
        workingResume: {
          ...state.workingResume,
          experience: moveById(state.workingResume.experience, id, direction),
        },
        isDirty: true,
      };
    }),

  addProject: (item) =>
    set((state) => {
      if (!state.workingResume) return state;
      return {
        workingResume: {
          ...state.workingResume,
          projects: [...state.workingResume.projects, item],
        },
        isDirty: true,
      };
    }),

  updateProject: (id, updates) =>
    set((state) => {
      if (!state.workingResume) return state;
      return {
        workingResume: {
          ...state.workingResume,
          projects: state.workingResume.projects.map((item) =>
            item.id === id ? { ...item, ...updates } : item,
          ),
        },
        isDirty: true,
      };
    }),

  removeProject: (id) =>
    set((state) => {
      if (!state.workingResume) return state;
      return {
        workingResume: {
          ...state.workingResume,
          projects: state.workingResume.projects.filter((item) => item.id !== id),
        },
        isDirty: true,
      };
    }),

  moveProject: (id, direction) =>
    set((state) => {
      if (!state.workingResume) return state;
      return {
        workingResume: {
          ...state.workingResume,
          projects: moveById(state.workingResume.projects, id, direction),
        },
        isDirty: true,
      };
    }),

  addEducation: (item) =>
    set((state) => {
      if (!state.workingResume) return state;
      return {
        workingResume: {
          ...state.workingResume,
          education: [...state.workingResume.education, item],
        },
        isDirty: true,
      };
    }),

  updateEducation: (id, updates) =>
    set((state) => {
      if (!state.workingResume) return state;
      return {
        workingResume: {
          ...state.workingResume,
          education: state.workingResume.education.map((item) =>
            item.id === id ? { ...item, ...updates } : item,
          ),
        },
        isDirty: true,
      };
    }),

  removeEducation: (id) =>
    set((state) => {
      if (!state.workingResume) return state;
      return {
        workingResume: {
          ...state.workingResume,
          education: state.workingResume.education.filter((item) => item.id !== id),
        },
        isDirty: true,
      };
    }),

  addCertification: (item) =>
    set((state) => {
      if (!state.workingResume) return state;
      return {
        workingResume: {
          ...state.workingResume,
          certifications: [...(state.workingResume.certifications ?? []), item],
        },
        isDirty: true,
      };
    }),

  updateCertification: (id, updates) =>
    set((state) => {
      if (!state.workingResume) return state;
      return {
        workingResume: {
          ...state.workingResume,
          certifications: (state.workingResume.certifications ?? []).map((item) =>
            item.id === id ? { ...item, ...updates } : item,
          ),
        },
        isDirty: true,
      };
    }),

  removeCertification: (id) =>
    set((state) => {
      if (!state.workingResume) return state;
      return {
        workingResume: {
          ...state.workingResume,
          certifications: (state.workingResume.certifications ?? []).filter(
            (item) => item.id !== id,
          ),
        },
        isDirty: true,
      };
    }),

  addAdditionalSection: (section) =>
    set((state) => {
      if (!state.workingResume) return state;
      return {
        workingResume: {
          ...state.workingResume,
          additionalSections: [
            ...(state.workingResume.additionalSections ?? []),
            section,
          ],
        },
        isDirty: true,
      };
    }),

  updateAdditionalSection: (id, title) =>
    set((state) => {
      if (!state.workingResume) return state;
      return {
        workingResume: {
          ...state.workingResume,
          additionalSections: (state.workingResume.additionalSections ?? []).map(
            (section) => (section.id === id ? { ...section, title } : section),
          ),
        },
        isDirty: true,
      };
    }),

  removeAdditionalSection: (id) =>
    set((state) => {
      if (!state.workingResume) return state;
      return {
        workingResume: {
          ...state.workingResume,
          additionalSections: (state.workingResume.additionalSections ?? []).filter(
            (section) => section.id !== id,
          ),
        },
        isDirty: true,
      };
    }),

  addAdditionalEntry: (sectionId, entry) =>
    set((state) => {
      if (!state.workingResume) return state;
      return {
        workingResume: {
          ...state.workingResume,
          additionalSections: (state.workingResume.additionalSections ?? []).map(
            (section) =>
              section.id === sectionId
                ? { ...section, entries: [...section.entries, entry] }
                : section,
          ),
        },
        isDirty: true,
      };
    }),

  updateAdditionalEntry: (sectionId, entryId, updates) =>
    set((state) => {
      if (!state.workingResume) return state;
      return {
        workingResume: {
          ...state.workingResume,
          additionalSections: (state.workingResume.additionalSections ?? []).map(
            (section) =>
              section.id === sectionId
                ? {
                    ...section,
                    entries: section.entries.map((entry) =>
                      entry.id === entryId ? { ...entry, ...updates } : entry,
                    ),
                  }
                : section,
          ),
        },
        isDirty: true,
      };
    }),

  removeAdditionalEntry: (sectionId, entryId) =>
    set((state) => {
      if (!state.workingResume) return state;
      return {
        workingResume: {
          ...state.workingResume,
          additionalSections: (state.workingResume.additionalSections ?? []).map(
            (section) =>
              section.id === sectionId
                ? {
                    ...section,
                    entries: section.entries.filter(
                      (entry) => entry.id !== entryId,
                    ),
                  }
                : section,
          ),
        },
        isDirty: true,
      };
    }),

  moveSection: (id, direction) =>
    set((state) => {
      const index = state.sectionOrder.indexOf(id);
      if (index === -1) return state;

      const targetIndex = direction === "up" ? index - 1 : index + 1;
      if (targetIndex < 0 || targetIndex >= state.sectionOrder.length) {
        return state;
      }

      const nextOrder = [...state.sectionOrder];
      [nextOrder[index], nextOrder[targetIndex]] = [
        nextOrder[targetIndex],
        nextOrder[index],
      ];

      return { sectionOrder: nextOrder, isDirty: true };
    }),

  resetSectionOrder: () =>
    set({ sectionOrder: createDefaultSectionOrder(), isDirty: true }),

  setTemplate: (template) => set({ template, isDirty: true }),

  hydrateSavedResume: (original, optimized, resume, sectionOrder, template) =>
    set({
      originalResume: original,
      optimizedResume: optimized,
      workingResume: cloneEditorResume(resume),
      sectionOrder: [...sectionOrder],
      template,
      isDirty: false,
    }),

  resetWorkingResume: () =>
    set((state) => {
      if (!state.optimizedResume) return state;
      const working: EditorResumeData = {
        jobTitle: state.optimizedResume.jobTitle ?? null,
        professionalSummary: state.optimizedResume.professionalSummary ?? null,
        skills: [...state.optimizedResume.skills],
        experience: state.optimizedResume.experience.map((item) => ({
          id: item.id,
          jobTitle: item.jobTitle,
          companyName: item.companyName,
          startDate: item.startDate,
          endDate: item.endDate,
          description: item.description,
          achievements: [...item.achievements],
        })),
        projects: state.optimizedResume.projects.map((item) => ({
          id: item.id,
          name: item.name,
          description: item.description,
          technologies: [...item.technologies],
          link: item.link,
        })),
        education: [],
      };
      return {
        workingResume: working,
        sectionOrder: createDefaultSectionOrder(),
        isDirty: false,
      };
    }),

  setDirty: (dirty) => set({ isDirty: dirty }),
}));
