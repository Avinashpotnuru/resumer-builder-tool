export const RESUME_TEMPLATES = [
  "professional-classic",
  "modern-ats",
  "compact-ats",
  "technical-ats",
  "minimal-ats",
  "entry-level-ats",
  "executive-ats",
  "project-focused-ats",
] as const;

export type ResumeTemplateId = (typeof RESUME_TEMPLATES)[number];

export const DEFAULT_RESUME_TEMPLATE: ResumeTemplateId = "professional-classic";

export const RESUME_TEMPLATE_LABELS: Record<ResumeTemplateId, string> = {
  "professional-classic": "Professional Classic",
  "modern-ats": "Modern ATS",
  "compact-ats": "Compact ATS",
  "technical-ats": "Technical ATS",
  "minimal-ats": "Minimal ATS",
  "entry-level-ats": "Entry-Level ATS",
  "executive-ats": "Executive ATS",
  "project-focused-ats": "Project-Focused ATS",
};

export type ResumeTemplateCategory =
  | "Professional"
  | "Modern"
  | "Technical"
  | "Entry level"
  | "Leadership"
  | "Project-focused";

export type ResumeTemplateMeta = {
  id: ResumeTemplateId;
  name: string;
  category: ResumeTemplateCategory;
  description: string;
  bestFor: string;
  accent: string;
};

export const RESUME_TEMPLATE_CATALOG: ResumeTemplateMeta[] = [
  {
    id: "professional-classic",
    name: "Professional Classic",
    category: "Professional",
    description:
      "A balanced, formal layout with clear section rules and comfortable spacing.",
    bestFor: "General professional roles across every industry.",
    accent: "#1b1a17",
  },
  {
    id: "modern-ats",
    name: "Modern ATS",
    category: "Modern",
    description:
      "Left-aligned header with restrained accent headings and a clean reading rhythm.",
    bestFor: "Modern teams, product roles, and general applications.",
    accent: "#2f6b57",
  },
  {
    id: "compact-ats",
    name: "Compact ATS",
    category: "Professional",
    description:
      "A dense, efficient layout that keeps long careers on fewer pages.",
    bestFor: "Experienced professionals with extensive content.",
    accent: "#495057",
  },
  {
    id: "technical-ats",
    name: "Technical ATS",
    category: "Technical",
    description:
      "Monospaced details and structured skill groups for engineering profiles.",
    bestFor: "Software developers, data, and IT professionals.",
    accent: "#2b4c7e",
  },
  {
    id: "minimal-ats",
    name: "Minimal ATS",
    category: "Modern",
    description:
      "Quiet typography, generous whitespace, and no decorative separators.",
    bestFor: "Designers, researchers, and understated professional profiles.",
    accent: "#5c5a54",
  },
  {
    id: "entry-level-ats",
    name: "Entry-Level ATS",
    category: "Entry level",
    description:
      "Education-forward layout with approachable spacing for early careers.",
    bestFor: "Graduates, interns, and junior professionals.",
    accent: "#8a5a2b",
  },
  {
    id: "executive-ats",
    name: "Executive ATS",
    category: "Leadership",
    description:
      "Formal serif headings and a confident header for senior leadership.",
    bestFor: "Directors, executives, and senior managers.",
    accent: "#3d2f2a",
  },
  {
    id: "project-focused-ats",
    name: "Project-Focused ATS",
    category: "Project-focused",
    description:
      "Projects take priority, with technology notes and outcomes kept distinct.",
    bestFor: "Developers and candidates with strong project portfolios.",
    accent: "#5b3b6b",
  },
];

export const RESUME_TEMPLATE_CATEGORIES: Array<
  "All" | ResumeTemplateCategory
> = [
  "All",
  "Professional",
  "Modern",
  "Technical",
  "Entry level",
  "Leadership",
  "Project-focused",
];

const LEGACY_TEMPLATE_IDS: Record<string, ResumeTemplateId> = {
  classic: "professional-classic",
  modern: "modern-ats",
};

export function normalizeTemplateId(value: unknown): ResumeTemplateId {
  if (typeof value === "string") {
    if ((RESUME_TEMPLATES as readonly string[]).includes(value)) {
      return value as ResumeTemplateId;
    }

    const legacy = LEGACY_TEMPLATE_IDS[value];
    if (legacy) return legacy;
  }

  return DEFAULT_RESUME_TEMPLATE;
}

export function isResumeTemplateId(
  value: unknown,
): value is ResumeTemplateId {
  return (
    typeof value === "string" &&
    (RESUME_TEMPLATES as readonly string[]).includes(value)
  );
}
