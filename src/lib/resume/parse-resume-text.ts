import type {
  EducationItem,
  EditorResumeData,
  ExperienceItem,
  PersonalInfo,
  ProjectItem,
} from "./editor-store";
import { createEmptyPersonalInfo } from "./editor-store";
import type { OriginalResumeData } from "./source-tracking";
import { SKILL_DICTIONARY, normalizeSkill } from "../skills/skill-dictionary";
import type { Skill } from "../skills/skill-dictionary";

type SectionId =
  | "summary"
  | "skills"
  | "experience"
  | "projects"
  | "education";

export type ParsedResume = {
  jobTitle: string | null;
  professionalSummary: string | null;
  skills: string[];
  experience: ExperienceItem[];
  projects: ProjectItem[];
  education: EducationItem[];
  personalInfo: PersonalInfo;
};

const SECTION_PATTERNS: Record<SectionId, RegExp> = {
  summary: /^(professional\s+)?(summary|profile)\s*:?\s*$/i,
  skills: /^(technical|key)?\s*skills?\s*:?\s*$/i,
  experience: /^(work|professional|employment)?\s*experience\s*:?\s*$/i,
  projects: /^projects?\s*:?\s*$/i,
  education: /^education\s*:?\s*$/i,
};

const MONTHS =
  "(?:jan(?:uary)?|feb(?:ruary)?|mar(?:ch)?|apr(?:il)?|may|jun(?:e)?|jul(?:y)?|aug(?:ust)?|sep(?:t(?:ember)?|t)?|oct(?:ober)?|nov(?:ember)?|dec(?:ember)?)";

const DATE_RANGE_PATTERNS = [
  new RegExp(
    `\\b(${MONTHS}\\.?\\s*'?(?:19|20)\\d{2})\\s*(?:-|–|—|to)\\s*(${MONTHS}\\.?\\s*'?(?:19|20)\\d{2}|present|current|ongoing)\\b`,
    "i",
  ),
  /\b(\d{1,2}[\/.-](?:\d{1,2}[\/.-](?:19|20)?\d{2}|(?:19|20)\d{2}))\s*(?:-|–|—|to)\s*(\d{1,2}[\/.-](?:\d{1,2}[\/.-](?:19|20)?\d{2}|(?:19|20)\d{2})|present|current|ongoing)\b/i,
  /\b((?:19|20)\d{2})\s*(?:-|–|—|to)\s*((?:19|20)\d{2}|present|current|ongoing)\b/i,
];

const SINGLE_DATE_PATTERNS = [
  new RegExp(
    `\\b(${MONTHS}\\.?\\s*'?(?:19|20)\\d{2})\\s*(?:-|–|—|to)?\\s*(present|current|ongoing)\\b`,
    "i",
  ),
  /\b((?:19|20)\d{2})\s*(?:-|–|—|to)?\s*(present|current|ongoing)\b/i,
];

const DEGREE_KEYWORDS = [
  "bachelor",
  "bachelors",
  "bsc",
  "b.s",
  "bs",
  "ba",
  "b.a",
  "master",
  "masters",
  "msc",
  "m.s",
  "ms",
  "mba",
  "phd",
  "ph.d",
  "doctorate",
  "diploma",
  "associate",
  "certificate",
];

function normalize(text: string): string {
  return text.replace(/\r\n?/g, "\n").trim();
}

function removeDateRanges(line: string): string {
  let result = line;

  for (const pattern of [...DATE_RANGE_PATTERNS, ...SINGLE_DATE_PATTERNS]) {
    const flags = pattern.flags.includes("g") ? pattern.flags : `${pattern.flags}g`;
    result = result.replace(new RegExp(pattern.source, flags), " ");
  }

  return result;
}

function isDateOnlyLine(line: string): boolean {
  const value = line.trim();
  if (!value) return false;

  // A line is date-only when nothing but separators remains after removing
  // every date range. Lines like "Company A | Jan 2022 – Dec 2023" keep their
  // company text and must not be dropped.
  return removeDateRanges(value).replace(/[\s\-–—|•·,()/]/g, "").length === 0;
}

type DateRange = {
  start: string;
  end: string | null;
  raw: string;
};

function parseDateRange(text: string): DateRange | null {
  for (const pattern of [...DATE_RANGE_PATTERNS, ...SINGLE_DATE_PATTERNS]) {
    const match = pattern.exec(text);
    if (match) {
      return { start: match[1], end: match[2] ?? null, raw: match[0] };
    }
  }

  return null;
}

function stripDateRange(line: string, raw: string): string {
  return line
    .replace(raw, " ")
    .replace(/^[\s\-–—|•·,]+|[\s\-–—|•·,]+$/g, "")
    .replace(/\s{2,}/g, " ")
    .trim();
}

function isContactLike(line: string): boolean {
  return /(@|^(?:\+?\d[\d\s().-]{7,}|tel:|phone)\b|^https?:|^www\.|^[\w.-]+\.(com|io|dev|net|org)\b)/i.test(
    line.trim(),
  );
}

function firstMatch(text: string, pattern: RegExp): string {
  return text.match(pattern)?.[0]?.replace(/[.,;|]+$/, "").trim() ?? "";
}

function parsePersonalInfo(
  headerLines: string[],
  jobTitle: string | null,
): PersonalInfo {
  const info = createEmptyPersonalInfo();
  info.fullName = jobTitle?.trim() ?? "";

  const nonContact = headerLines
    .map((line) => line.trim())
    .filter((line) => line && !isContactLike(line));

  if (nonContact.length > 1) {
    info.professionalTitle = nonContact[1].slice(0, 90).trim();
  }

  const joined = headerLines.join(" | ");
  info.email = firstMatch(joined, /[\w.+-]+@[\w.-]+\.[A-Za-z]{2,}/);
  info.phone = firstMatch(joined, /(?:\+?\d[\d\s().-]{7,}\d)/);

  const linkedin = firstMatch(
    joined,
    /(?:https?:\/\/)?(?:www\.)?linkedin\.com\/[^\s|,;]+/i,
  );
  const github = firstMatch(
    joined,
    /(?:https?:\/\/)?(?:www\.)?github\.com\/[^\s|,;]+/i,
  );
  info.linkedin = linkedin;
  info.github = github;

  const urls = joined.match(
    /(?:https?:\/\/|www\.)[^\s|,;]+|\b[\w-]+\.(?:com|io|dev|net|org|me|co)\b[^\s|,;]*/gi,
  ) ?? [];
  const otherUrl = urls.find(
    (url) =>
      url !== linkedin &&
      url !== github &&
      !/linkedin\.com|github\.com/i.test(url),
  );
  if (otherUrl) {
    if (/portfolio/i.test(otherUrl)) {
      info.portfolio = otherUrl;
    } else {
      info.website = otherUrl;
    }
  }

  for (const line of headerLines) {
    const location = line.match(
      /^([A-Za-z .'-]{2,}),\s*([A-Za-z .'-]{2,})(?:\s*,\s*([A-Za-z .'-]{2,}))?$/,
    );
    if (location) {
      info.city = location[1].trim();
      if (location[3]?.trim()) {
        info.state = location[2].trim();
        info.country = location[3].trim();
      } else {
        info.state = location[2].trim();
      }
      break;
    }
  }

  return info;
}

function sectionOf(line: string): SectionId | null {
  const value = line.trim().replace(/\s*:?$/, "");

  for (const [section, pattern] of Object.entries(SECTION_PATTERNS) as Array<
    [SectionId, RegExp]
  >) {
    if (pattern.test(value)) {
      return section;
    }
  }

  return null;
}

function splitCandidateTitle(value: string): { jobTitle: string; companyName: string } {
  const cleaned = value.trim();

  // "Senior Engineer at Acme" / "Acme | Engineer" / "Engineer — Acme"
  const atMatch = cleaned.match(/^(.*?)\s+\bat\s+(.*)$/i);
  if (atMatch?.[1]?.trim() && atMatch[2]?.trim()) {
    return { jobTitle: atMatch[1].trim(), companyName: atMatch[2].trim() };
  }

  const separated = cleaned.split(/\s*(?:—|–|-|\||•)\s*/);
  if (separated.length >= 2 && separated[0].trim() && separated[1].trim()) {
    const first = separated[0].trim();
    const second = separated[1].trim();

    // "Acme | Engineer" style lines put the company first.
    if (!ROLE_TITLE_PATTERN.test(first) && ROLE_TITLE_PATTERN.test(second)) {
      return { jobTitle: second, companyName: first };
    }

    return { jobTitle: first, companyName: second };
  }

  const parenthesesMatch = cleaned.match(/^(.*?)\s*\(([^)]+)\)\s*$/);
  if (parenthesesMatch?.[1]?.trim() && parenthesesMatch[2]?.trim()) {
    return {
      jobTitle: parenthesesMatch[1].trim(),
      companyName: parenthesesMatch[2].trim(),
    };
  }

  return { jobTitle: cleaned, companyName: "" };
}

function stripBullets(lines: string[]): {
  achievements: string[];
  body: string[];
} {
  const achievements: string[] = [];
  const body: string[] = [];

  for (const line of lines) {
    const trimmed = line.trim();
    const bulletMatch = trimmed.match(/^[-*•·]\s+(.*)$/);
    if (bulletMatch?.[1]) {
      achievements.push(bulletMatch[1].trim());
      continue;
    }

    body.push(trimmed);
  }

  return { achievements, body };
}

function slug(value: string, fallback: string): string {
  const out = value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
  return out || fallback;
}

function collectSectionLines(text: string): Record<SectionId | "header", string[]> {
  const sections: Record<SectionId | "header", string[]> = {
    header: [],
    summary: [],
    skills: [],
    experience: [],
    projects: [],
    education: [],
  };
  let current: SectionId | "header" = "header";

  for (const rawLine of normalize(text).split("\n")) {
    const line = rawLine.trim();
    if (!line) continue;

    const marker = sectionOf(line);
    if (marker) {
      current = marker;
      continue;
    }

    // A marker and content on one line ("Skills: TypeScript, React")
    const inlineMarker = line.match(
      /^(summary|skills|experience|projects|education)\s*:\s*(.+)$/i,
    );
    if (inlineMarker) {
      const inlineSection = sectionOf(inlineMarker[1]);
      if (inlineSection) {
        current = inlineSection;
        sections[current].push(inlineMarker[2].trim());
      }
      continue;
    }

    sections[current].push(line);
  }

  return sections;
}

const ROLE_TITLE_PATTERN =
  /\b(engineer|developer|manager|analyst|consultant|designer|architect|scientist|specialist|director|lead|intern|administrator|coordinator|officer|executive|programmer|associate|head)\b/i;

const ACTION_START_PATTERN =
  /^(led|built|developed|designed|managed|created|implemented|improved|shipped|migrated|mentored|reduced|increased|collaborated|delivered|spearheaded|architected|optimized|automated|launched|owned|drove|established|maintained|supported|worked|responsible)\b/i;

function looksTitleCased(line: string): boolean {
  const words = line.trim().split(/\s+/).filter(Boolean);
  return (
    words.length > 0 &&
    words.every((word) => /^[A-Z0-9]/.test(word) || /^[&/+.'()-]+$/.test(word))
  );
}

function looksLikeRoleHeading(line: string): boolean {
  const trimmed = line.trim();
  if (!trimmed || trimmed.length > 90) return false;
  if (/[.!?]$/.test(trimmed)) return false;
  if (ACTION_START_PATTERN.test(trimmed)) return false;
  if (parseDateRange(trimmed)) return true;
  if (/\bat\b|\|/.test(trimmed)) return true;
  if (ROLE_TITLE_PATTERN.test(trimmed)) return true;

  // Short, title-cased lines are usually company names or role headers.
  return trimmed.length <= 45 && /^[A-Z0-9]/.test(trimmed) && looksTitleCased(trimmed);
}

function splitExperienceBlocks(lines: string[]): string[][] {
  const blocks: string[][] = [];
  let current: string[] = [];
  let hasDate = false;
  let hasSeenContent = false;

  const flush = () => {
    if (current.length > 0) {
      blocks.push(current);
      current = [];
      hasDate = false;
      hasSeenContent = false;
    }
  };

  for (const line of lines) {
    const isBullet = /^[-*•·]\s+/.test(line);
    const hasDateToken = Boolean(parseDateRange(line));
    const isHeading = !isBullet && looksLikeRoleHeading(line);

    // A new heading after a role's content (or a second date line) starts a new role.
    if (
      current.length > 0 &&
      isHeading &&
      (hasSeenContent || (hasDate && hasDateToken))
    ) {
      flush();
    }

    current.push(line);
    if (hasDateToken) hasDate = true;
    if (isBullet || (!isHeading && current.length > 1)) {
      hasSeenContent = true;
    }
  }

  flush();
  return blocks;
}

function looksLikeCompanyLine(line: string): boolean {
  const trimmed = line.trim();
  if (!trimmed || trimmed.length > 90) return false;
  if (/^[-*•·]\s+/.test(trimmed)) return false;
  if (/[.!?]$/.test(trimmed)) return false;
  if (ACTION_START_PATTERN.test(trimmed)) return false;
  return (
    /\d{4}/.test(trimmed) ||
    /[|·—–,]/.test(trimmed) ||
    (trimmed.length <= 60 && /^[A-Z0-9]/.test(trimmed))
  );
}

function parseExperienceParagraph(lines: string[], index: number): ExperienceItem {
  const raw = lines.join("\n");
  const date = parseDateRange(raw);
  const contentLines = lines
    .map((line) => (date && isDateOnlyLine(line) ? "" : line))
    .filter((line) => line.trim().length > 0);

  const firstLine = contentLines[0] ?? "";
  const afterDate = date ? stripDateRange(firstLine, date.raw) : firstLine.trim();
  const parsedTitle = splitCandidateTitle(afterDate);
  const jobTitle = parsedTitle.jobTitle;
  let companyName = parsedTitle.companyName;
  let rest = contentLines.slice(1);

  // Role title and company commonly sit on separate lines:
  // "Frontend Developer" followed by "Company A | Jan 2022 – Dec 2023".
  if (!companyName && rest.length > 0 && looksLikeCompanyLine(rest[0])) {
    const withoutDate = date ? stripDateRange(rest[0], date.raw) : rest[0].trim();
    const cleanedCompany = withoutDate
      .replace(/^[\s\-–—|•·,]+|[\s\-–—|•·,]+$/g, "")
      .trim();

    if (cleanedCompany) {
      companyName = cleanedCompany;
      rest = rest.slice(1);
    }
  }

  const { achievements, body } = stripBullets(rest);
  const description = body.join("\n").trim();

  return {
    id: `experience-${slug(afterDate, String(index + 1))}-${index + 1}`,
    jobTitle: jobTitle || "Untitled role",
    companyName,
    startDate: date?.start ?? "",
    endDate: date?.end ?? null,
    description,
    achievements,
  };
}

function looksLikeSkillList(line: string): boolean {
  const trimmed = line.trim();
  if (!trimmed || /[.!?]$/.test(trimmed)) return false;

  const parts = trimmed
    .split(/[,;|]/)
    .map((part) => part.trim())
    .filter(Boolean);

  if (parts.length < 2) return false;

  return parts.every((part) => part.split(/\s+/).length <= 4);
}

function splitProjectBlocks(lines: string[]): string[][] {
  const blocks: string[][] = [];
  let current: string[] = [];
  let hasContent = false;

  const flush = () => {
    if (current.length > 0) {
      blocks.push(current);
      current = [];
      hasContent = false;
    }
  };

  const isHeadingCandidate = (line: string): boolean => {
    const trimmed = line.trim();
    if (!trimmed || trimmed.length > 90) return false;
    if (/^[-*•·]\s+/.test(trimmed)) return false;
    if (/^technologies?\s*:/i.test(trimmed)) return false;
    if (/[.!?]$/.test(trimmed)) return false;
    if (ACTION_START_PATTERN.test(trimmed)) return false;
    if (looksLikeSkillList(trimmed)) return false;

    const currentName = current[0]?.trim() ?? "";
    return !(currentName && trimmed.startsWith(`${currentName} `));
  };

  const isProjectContent = (line: string): boolean =>
    /^[-*•·]\s+/.test(line) ||
    /^technologies?\s*:/i.test(line) ||
    ACTION_START_PATTERN.test(line) ||
    /[.!?]$/.test(line);

  const isStrongBoundary = (line: string): boolean =>
    /^[-*•·]\s+/.test(line) || /^technologies?\s*:/i.test(line);

  const confirmsNewProject = (index: number): boolean => {
    const next = lines[index + 1]?.trim();
    if (next && isProjectContent(next)) return true;

    // A standalone project name can end the section without any content of
    // its own. Only treat it as a heading when the previous line is clearly
    // the end of a project (a bullet or its Technologies line); otherwise a
    // final bullet whose glyph was lost during extraction becomes a project.
    const previous = lines[index - 1]?.trim();
    return !next && Boolean(previous) && isStrongBoundary(previous);
  };

  lines.forEach((line, index) => {
    // Project names are often sentence case, so do not rely on title casing.
    // A heading is any short, non-bullet, non-content line that starts a new
    // project and is followed by that project's content.
    const startsNewProject =
      current.length > 0 &&
      hasContent &&
      isHeadingCandidate(line) &&
      confirmsNewProject(index);

    if (startsNewProject) {
      flush();
    }

    current.push(line);
    if (current.length > 1) {
      hasContent = true;
    }
  });

  flush();
  return blocks;
}

function parseProjectParagraph(lines: string[], index: number): ProjectItem {
  const firstLine = lines[0]?.trim() ?? "Untitled project";
  const firstWithoutBullet = firstLine.replace(/^[-*•·]\s*/, "").trim();
  const linkMatch = firstWithoutBullet.match(/https?:\/\/\S+|\b\S+\.(com|io|dev|net|org)\b/i);
  const link = linkMatch?.[0];

  const technologies = Array.from(
    new Set(
      lines.flatMap((line) => {
        if (!/^technologies?\s*:/i.test(line.trim())) return [];
        return line
          .split(":")
          .slice(1)
          .join(":")
          .split(/[,;]/g);
      }),
    ),
  )
    .map((value) => value.trim())
    .filter(Boolean);

  const description = lines
    .slice(1)
    .filter((line) => !/^technologies?\s*:/i.test(line.trim()))
    .map((line) => line.trim())
    .filter(Boolean)
    .join("\n")
    .trim();

  return {
    id: `project-${slug(firstWithoutBullet, String(index + 1))}-${index + 1}`,
    name: firstWithoutBullet.replace(link ?? "", "").trim() || "Untitled project",
    description,
    technologies,
    link,
  };
}

function parseEducationParagraph(lines: string[], index: number): EducationItem {
  const raw = lines.join("\n");
  const date = parseDateRange(raw);
  const remaining = lines
    .map((line) => (date && isDateOnlyLine(line) ? "" : line))
    .filter((line) => line.trim().length > 0);

  // Find a degree-like line, if any.
  const degreeLine = remaining.find((line) =>
    DEGREE_KEYWORDS.some((keyword) => normalizeSkill(line).includes(keyword)),
  );

  const schoolLine =
    remaining.find((line) => line !== degreeLine && !isContactLike(line)) ??
    remaining[0] ??
    "";
  const qualificationParts = degreeLine
    ? degreeLine
        .split(/,| in /i)
        .map((part) => part.trim())
        .filter(Boolean)
    : [];

  return {
    id: `education-${slug(schoolLine, String(index + 1))}-${index + 1}`,
    schoolName: schoolLine,
    degree: qualificationParts[0] ?? "",
    fieldOfStudy: qualificationParts.slice(1).join(", "),
    startDate: date?.start ?? "",
    endDate: date?.end ?? null,
    location: "",
  };
}

function escapeRegExp(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function findSkillsInText(text: string): Skill[] {
  const normalized = normalizeSkill(text);
  const matches: Skill[] = [];

  for (const skill of SKILL_DICTIONARY) {
    const candidates = [skill.name, ...skill.aliases];
    const isMatch = candidates.some((candidate) => {
      const pattern = new RegExp(
        `(?<![a-zA-Z0-9.])${escapeRegExp(normalizeSkill(candidate))}(?![a-zA-Z0-9.])`,
        "i",
      );
      return pattern.test(normalized);
    });

    if (isMatch) {
      matches.push(skill);
    }
  }

  return matches;
}

function collectSectionSkills(raw: string): string[] {
  const seen = new Set<string>();
  const skills: string[] = [];

  for (const skill of findSkillsInText(raw)) {
    if (seen.has(skill.name)) continue;
    seen.add(skill.name);
    skills.push(skill.name);
  }

  return skills;
}

/**
 * A deterministic, line-oriented parser for the typical text a resume keeps
 * after PDF/DOCX extraction. It preserves sections and content it cannot
 * structure, and leaves unreadable fields blank rather than inventing them.
 */
export function parseResumeText(raw: string): ParsedResume {
  const sectionLines = collectSectionLines(raw);

  const headerLines = sectionLines.header;
  const jobTitle = headerLines.find((line) => !isContactLike(line))?.trim() ?? null;

  const summaryLines = sectionLines.summary;
  const professionalSummary =
    summaryLines.length > 0 ? summaryLines.join(" ").trim() : null;

  const headerBody = sectionLines.header
    .slice(jobTitle ? 1 : 0)
    .join(" ")
    .trim();

  const skills = collectSectionSkills(raw);

  const experience = splitExperienceBlocks(sectionLines.experience).map(
    (lines, index) => parseExperienceParagraph(lines, index),
  );

  const projects = splitProjectBlocks(sectionLines.projects).map(
    (lines, index) => parseProjectParagraph(lines, index),
  );

  const education =
    sectionLines.education.length > 0
      ? [parseEducationParagraph(sectionLines.education, 0)]
      : [];

  return {
    jobTitle,
    professionalSummary: professionalSummary ?? (headerBody || null),
    skills,
    experience,
    projects,
    education,
    personalInfo: parsePersonalInfo(headerLines, jobTitle),
  };
}

export function toEditorResume(parsed: ParsedResume): EditorResumeData {
  return {
    jobTitle: parsed.jobTitle,
    professionalSummary: parsed.professionalSummary,
    skills: [...parsed.skills],
    experience: parsed.experience.map((item) => ({
      ...item,
      achievements: [...item.achievements],
    })),
    projects: parsed.projects.map((item) => ({
      ...item,
      technologies: [...item.technologies],
    })),
    education: parsed.education.map((item) => ({ ...item })),
    personalInfo: { ...parsed.personalInfo },
  };
}

function createId(): string {
  if (typeof globalThis.crypto?.randomUUID === "function") {
    return globalThis.crypto.randomUUID();
  }

  return `${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
}

export function createOriginalResumeFromText(raw: string): OriginalResumeData {
  const parsed = parseResumeText(raw);

  return {
    id: createId(),
    jobTitle: parsed.jobTitle,
    professionalSummary: parsed.professionalSummary,
    skills: [...parsed.skills],
    experience: parsed.experience.map((item) => ({
      ...item,
      achievements: [...item.achievements],
    })),
    projects: parsed.projects.map((item) => ({
      ...item,
      technologies: [...item.technologies],
    })),
    education: parsed.education.map((item) => ({ ...item })),
    personalInfo: { ...parsed.personalInfo },
    createdAt: new Date().toISOString(),
  };
}
