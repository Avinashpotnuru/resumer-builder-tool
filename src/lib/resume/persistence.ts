import {
  RESUME_SECTION_ORDER,
  type EditorResumeData,
  type EducationItem,
  type ExperienceItem,
  type ProjectItem,
  type ResumeSectionId,
  type ResumeTemplateId,
} from "./editor-store";
import { isResumeTemplateId, normalizeTemplateId } from "./template-catalog";
import type {
  OptimizedResumeData,
  OriginalResumeData,
} from "./source-tracking";

/**
 * Local resume persistence.
 *
 * The library keeps original resumes and tailored versions in separate
 * collections. A tailored version references its original by id and stores
 * only the working resume, template, section order, and target role details.
 * Original resumes are never overwritten once stored.
 */

export const RESUME_LIBRARY_STORAGE_KEY = "resume-builder.library.v1";
export const RESUME_LIBRARY_SCHEMA_VERSION = 1;

export type OriginalResumeRecord = {
  id: string;
  updatedAt: string;
  data: OriginalResumeData;
};

export type TailoredResumeRecord = {
  id: string;
  originalResumeId: string;
  createdAt: string;
  updatedAt: string;
  targetJobTitle: string;
  companyName: string;
  template: ResumeTemplateId;
  sectionOrder: ResumeSectionId[];
  resume: EditorResumeData;
};

export type ResumeLibrary = {
  version: number;
  originals: OriginalResumeRecord[];
  tailored: TailoredResumeRecord[];
};

export type SaveTailoredResumeInput = {
  id?: string;
  original: OriginalResumeData;
  targetJobTitle: string;
  companyName: string;
  template: ResumeTemplateId;
  sectionOrder: ResumeSectionId[];
  resume: EditorResumeData;
};

const EMPTY_LIBRARY: ResumeLibrary = {
  version: RESUME_LIBRARY_SCHEMA_VERSION,
  originals: [],
  tailored: [],
};

const listeners = new Set<() => void>();

let cachedRaw: string | null | undefined;
let cachedLibrary: ResumeLibrary = EMPTY_LIBRARY;

function getStorage(): Storage | null {
  try {
    const candidate = (globalThis as typeof globalThis & {
      localStorage?: Storage;
    }).localStorage;

    if (!candidate) return null;

    // Access can throw in privacy-restricted contexts.
    void candidate.length;
    return candidate;
  } catch {
    return null;
  }
}

function readRaw(): string | null {
  const storage = getStorage();
  if (!storage) return null;

  try {
    return storage.getItem(RESUME_LIBRARY_STORAGE_KEY);
  } catch {
    return null;
  }
}

function notifyListeners(): void {
  for (const listener of listeners) {
    listener();
  }
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function isNonEmptyString(value: unknown): value is string {
  return typeof value === "string" && value.trim().length > 0;
}

function isNullableString(value: unknown): value is string | null {
  return value === null || typeof value === "string";
}

function isStringArray(value: unknown): value is string[] {
  return Array.isArray(value) && value.every((item) => typeof item === "string");
}

function isTimestamp(value: unknown): value is string {
  return typeof value === "string" && !Number.isNaN(Date.parse(value));
}

function isExperienceItem(value: unknown): value is ExperienceItem {
  if (!isRecord(value)) return false;

  return (
    isNonEmptyString(value.id) &&
    typeof value.jobTitle === "string" &&
    typeof value.companyName === "string" &&
    typeof value.startDate === "string" &&
    isNullableString(value.endDate) &&
    typeof value.description === "string" &&
    isStringArray(value.achievements)
  );
}

function isProjectItem(value: unknown): value is ProjectItem {
  if (!isRecord(value)) return false;

  return (
    isNonEmptyString(value.id) &&
    typeof value.name === "string" &&
    typeof value.description === "string" &&
    isStringArray(value.technologies) &&
    (value.link === undefined || typeof value.link === "string")
  );
}

function isEducationItem(value: unknown): value is EducationItem {
  if (!isRecord(value)) return false;

  return (
    isNonEmptyString(value.id) &&
    typeof value.schoolName === "string" &&
    typeof value.degree === "string" &&
    typeof value.fieldOfStudy === "string" &&
    typeof value.startDate === "string" &&
    isNullableString(value.endDate) &&
    typeof value.location === "string"
  );
}

function isOriginalResumeData(value: unknown): value is OriginalResumeData {
  if (!isRecord(value)) return false;

  return (
    isNonEmptyString(value.id) &&
    isNullableString(value.jobTitle) &&
    isNullableString(value.professionalSummary) &&
    isStringArray(value.skills) &&
    Array.isArray(value.experience) &&
    value.experience.every(isExperienceItem) &&
    Array.isArray(value.projects) &&
    value.projects.every(isProjectItem) &&
    isTimestamp(value.createdAt)
  );
}

function isEditorResumeData(value: unknown): value is EditorResumeData {
  if (!isRecord(value)) return false;

  return (
    isNullableString(value.jobTitle) &&
    isNullableString(value.professionalSummary) &&
    isStringArray(value.skills) &&
    Array.isArray(value.experience) &&
    value.experience.every(isExperienceItem) &&
    Array.isArray(value.projects) &&
    value.projects.every(isProjectItem) &&
    Array.isArray(value.education) &&
    value.education.every(isEducationItem)
  );
}

function isSectionOrder(value: unknown): value is ResumeSectionId[] {
  if (!Array.isArray(value)) return false;
  if (value.length !== RESUME_SECTION_ORDER.length) return false;

  const seen = new Set<string>();

  return value.every((item) => {
    if (
      typeof item !== "string" ||
      !(RESUME_SECTION_ORDER as readonly string[]).includes(item) ||
      seen.has(item)
    ) {
      return false;
    }

    seen.add(item);
    return true;
  });
}

function isTemplateId(value: unknown): value is ResumeTemplateId {
  if (isResumeTemplateId(value)) return true;

  // Older saved versions used the "classic" and "modern" ids.
  return value === "classic" || value === "modern";
}

function isOriginalResumeRecord(value: unknown): value is OriginalResumeRecord {
  if (!isRecord(value)) return false;
  if (!isNonEmptyString(value.id) || !isTimestamp(value.updatedAt)) {
    return false;
  }
  if (!isOriginalResumeData(value.data)) return false;

  return value.data.id === value.id;
}

function isTailoredResumeRecord(value: unknown): value is TailoredResumeRecord {
  if (!isRecord(value)) return false;

  return (
    isNonEmptyString(value.id) &&
    isNonEmptyString(value.originalResumeId) &&
    isTimestamp(value.createdAt) &&
    isTimestamp(value.updatedAt) &&
    typeof value.targetJobTitle === "string" &&
    typeof value.companyName === "string" &&
    isTemplateId(value.template) &&
    isSectionOrder(value.sectionOrder) &&
    isEditorResumeData(value.resume)
  );
}

function parseLibrary(raw: string | null): ResumeLibrary {
  if (raw === null) return EMPTY_LIBRARY;

  let parsed: unknown;
  try {
    parsed = JSON.parse(raw);
  } catch {
    return EMPTY_LIBRARY;
  }

  if (!isRecord(parsed)) return EMPTY_LIBRARY;
  if (parsed.version !== RESUME_LIBRARY_SCHEMA_VERSION) {
    return EMPTY_LIBRARY;
  }
  if (!Array.isArray(parsed.originals) || !Array.isArray(parsed.tailored)) {
    return EMPTY_LIBRARY;
  }

  const originals: OriginalResumeRecord[] = [];
  const originalIds = new Set<string>();

  for (const item of parsed.originals) {
    if (!isOriginalResumeRecord(item) || originalIds.has(item.id)) continue;
    originalIds.add(item.id);
    originals.push(item);
  }

  const tailored: TailoredResumeRecord[] = [];
  const tailoredIds = new Set<string>();

  for (const item of parsed.tailored) {
    if (!isTailoredResumeRecord(item) || tailoredIds.has(item.id)) continue;
    if (!originalIds.has(item.originalResumeId)) continue;
    tailoredIds.add(item.id);
    tailored.push({
      ...item,
      template: normalizeTemplateId(item.template),
    });
  }

  return {
    version: RESUME_LIBRARY_SCHEMA_VERSION,
    originals,
    tailored,
  };
}

function writeLibrary(library: ResumeLibrary): boolean {
  const storage = getStorage();
  if (!storage) return false;

  let serialized: string;
  try {
    serialized = JSON.stringify(library);
  } catch {
    return false;
  }

  try {
    storage.setItem(RESUME_LIBRARY_STORAGE_KEY, serialized);
  } catch {
    return false;
  }

  cachedRaw = serialized;
  cachedLibrary = library;
  notifyListeners();
  return true;
}

function cloneExperience(item: ExperienceItem): ExperienceItem {
  return { ...item, achievements: [...item.achievements] };
}

function cloneProject(item: ProjectItem): ProjectItem {
  return {
    ...item,
    technologies: [...item.technologies],
    achievements: item.achievements ? [...item.achievements] : undefined,
  };
}

function cloneEducation(item: EducationItem): EducationItem {
  return { ...item };
}

function clonePersonalInfo(
  info: EditorResumeData["personalInfo"],
): EditorResumeData["personalInfo"] {
  return info ? { ...info } : undefined;
}

function cloneCertifications(
  items: EditorResumeData["certifications"],
): EditorResumeData["certifications"] {
  return items ? items.map((item) => ({ ...item })) : undefined;
}

function cloneAdditionalSections(
  sections: EditorResumeData["additionalSections"],
): EditorResumeData["additionalSections"] {
  return sections
    ? sections.map((section) => ({
        ...section,
        entries: section.entries.map((entry) => ({ ...entry })),
      }))
    : undefined;
}

export function cloneEditorResume(resume: EditorResumeData): EditorResumeData {
  return {
    jobTitle: resume.jobTitle,
    professionalSummary: resume.professionalSummary,
    skills: [...resume.skills],
    experience: resume.experience.map(cloneExperience),
    projects: resume.projects.map(cloneProject),
    education: resume.education.map(cloneEducation),
    personalInfo: clonePersonalInfo(resume.personalInfo),
    certifications: cloneCertifications(resume.certifications),
    additionalSections: cloneAdditionalSections(resume.additionalSections),
  };
}

function cloneOriginalResume(resume: OriginalResumeData): OriginalResumeData {
  return {
    id: resume.id,
    jobTitle: resume.jobTitle,
    professionalSummary: resume.professionalSummary,
    skills: [...resume.skills],
    experience: resume.experience.map(cloneExperience),
    projects: resume.projects.map(cloneProject),
    createdAt: resume.createdAt,
    education: resume.education?.map(cloneEducation),
    personalInfo: clonePersonalInfo(resume.personalInfo),
    certifications: cloneCertifications(resume.certifications),
    additionalSections: cloneAdditionalSections(resume.additionalSections),
  };
}

function createId(): string {
  const cryptoApi = globalThis.crypto;

  if (cryptoApi && typeof cryptoApi.randomUUID === "function") {
    return cryptoApi.randomUUID();
  }

  return `${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
}

function replaceTailored(
  library: ResumeLibrary,
  record: TailoredResumeRecord,
): TailoredResumeRecord[] {
  const index = library.tailored.findIndex((item) => item.id === record.id);

  if (index === -1) {
    return [...library.tailored, record];
  }

  return library.tailored.map((item) =>
    item.id === record.id ? record : item,
  );
}

export function getResumeLibrarySnapshot(): ResumeLibrary {
  const raw = readRaw();

  if (raw === cachedRaw) {
    return cachedLibrary;
  }

  cachedRaw = raw;
  cachedLibrary = parseLibrary(raw);
  return cachedLibrary;
}

export function getResumeLibraryServerSnapshot(): ResumeLibrary {
  return EMPTY_LIBRARY;
}

export function subscribeToResumeLibrary(listener: () => void): () => void {
  listeners.add(listener);

  if (typeof window === "undefined") {
    return () => {
      listeners.delete(listener);
    };
  }

  const handleStorage = (event: StorageEvent) => {
    if (event.key !== null && event.key !== RESUME_LIBRARY_STORAGE_KEY) {
      return;
    }
    listener();
  };

  window.addEventListener("storage", handleStorage);

  return () => {
    listeners.delete(listener);
    window.removeEventListener("storage", handleStorage);
  };
}

export function getTailoredResume(
  id: string,
): TailoredResumeRecord | null {
  return (
    getResumeLibrarySnapshot().tailored.find((item) => item.id === id) ?? null
  );
}

export function getOriginalResume(
  id: string,
): OriginalResumeRecord | null {
  return (
    getResumeLibrarySnapshot().originals.find((item) => item.id === id) ?? null
  );
}

function fingerprintOriginal(value: unknown): string {
  return JSON.stringify(value, (key, item) =>
    key === "id" || key === "createdAt" || key === "updatedAt"
      ? undefined
      : item,
  );
}

/**
 * Returns the id and createdAt of a previously stored original with identical
 * content, or null. Parse output is deterministic for the same text, so this
 * lets repeat imports reuse the stored original instead of duplicating it.
 */
export function findIdenticalOriginal(
  data: OriginalResumeData,
): { id: string; createdAt: string } | null {
  const wanted = fingerprintOriginal(data);
  const match = getResumeLibrarySnapshot().originals.find(
    (item) => fingerprintOriginal(item.data) === wanted,
  );

  return match ? { id: match.id, createdAt: match.data.createdAt } : null;
}

export function saveTailoredResume(
  input: SaveTailoredResumeInput,
): TailoredResumeRecord | null {
  const library = getResumeLibrarySnapshot();
  const existing = input.id
    ? library.tailored.find((item) => item.id === input.id) ?? null
    : null;
  const now = new Date().toISOString();

  const originals = library.originals.some(
    (item) => item.id === input.original.id,
  )
    ? library.originals
    : [
        ...library.originals,
        {
          id: input.original.id,
          updatedAt: input.original.createdAt,
          data: cloneOriginalResume(input.original),
        },
      ];

  const record: TailoredResumeRecord = {
    id: existing?.id ?? input.id ?? createId(),
    originalResumeId: input.original.id,
    createdAt: existing?.createdAt ?? now,
    updatedAt: now,
    targetJobTitle: input.targetJobTitle.trim(),
    companyName: input.companyName.trim(),
    template: input.template,
    sectionOrder: [...input.sectionOrder],
    resume: cloneEditorResume(input.resume),
  };

  const nextLibrary: ResumeLibrary = {
    ...library,
    originals,
    tailored: replaceTailored(library, record),
  };

  return writeLibrary(nextLibrary) ? record : null;
}

export function updateTailoredResumeMetadata(
  id: string,
  updates: { targetJobTitle: string; companyName: string },
): TailoredResumeRecord | null {
  const library = getResumeLibrarySnapshot();
  const existing = library.tailored.find((item) => item.id === id);

  if (!existing) return null;

  const record: TailoredResumeRecord = {
    ...existing,
    targetJobTitle: updates.targetJobTitle.trim(),
    companyName: updates.companyName.trim(),
    updatedAt: new Date().toISOString(),
  };

  const nextLibrary: ResumeLibrary = {
    ...library,
    tailored: replaceTailored(library, record),
  };

  return writeLibrary(nextLibrary) ? record : null;
}

/**
 * Deletes a tailored version. The original resume is intentionally kept so the
 * source data remains available.
 */
export function deleteTailoredResume(id: string): boolean {
  const library = getResumeLibrarySnapshot();
  const exists = library.tailored.some((item) => item.id === id);

  if (!exists) return false;

  return writeLibrary({
    ...library,
    tailored: library.tailored.filter((item) => item.id !== id),
  });
}

/**
 * Rebuilds the optimized resume shape expected by the editor from a saved
 * working resume. No separate optimized copy is persisted.
 */
export function toOptimizedResumeData(
  record: TailoredResumeRecord,
): OptimizedResumeData {
  const resume = record.resume;

  return {
    id: `${record.id}-optimized`,
    originalResumeId: record.originalResumeId,
    optimizedAt: record.updatedAt,
    jobTitle: resume.jobTitle,
    professionalSummary: resume.professionalSummary,
    skills: [...resume.skills],
    experience: resume.experience.map(cloneExperience),
    projects: resume.projects.map(cloneProject),
    provenance: [],
    changes: [],
    education: resume.education.map(cloneEducation),
    personalInfo: clonePersonalInfo(resume.personalInfo),
    certifications: cloneCertifications(resume.certifications),
    additionalSections: cloneAdditionalSections(resume.additionalSections),
  };
}
