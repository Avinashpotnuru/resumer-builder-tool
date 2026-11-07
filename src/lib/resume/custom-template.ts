"use client";

import type {
  AnyTemplateId,
  ResumeSectionId,
  ResumeTemplateId,
} from "./editor-store";
import {
  CUSTOM_TEMPLATE_PREFIX,
  DEFAULT_RESUME_TEMPLATE,
  RESUME_TEMPLATES,
  isCustomTemplateId,
} from "./template-catalog";

/**
 * Custom template design configuration.
 *
 * A custom template is a user-created design configuration derived from a
 * built-in template or a blank starting point. It stores only design tokens
 * (typography, colors, layout, section preferences) — never resume content.
 * Resume content remains stored separately in the resume library.
 */

/* ------------------------------------------------------------------ */
/* Typography                                                         */
/* ------------------------------------------------------------------ */

export type TemplateTypography = {
  /** CSS font-family value applied to the resume document. */
  fontFamily: string;
  /** Name (title) font size, e.g. "28px". */
  nameFontSize: string;
  /** Section heading font size, e.g. "13px". */
  headingFontSize: string;
  /** Body text font size, e.g. "11px". */
  bodyFontSize: string;
  /** Body font weight (400 | 500 | 600 | 700). */
  fontWeight: 400 | 500 | 600 | 700;
  /** Line height multiplier (1.4 | 1.5 | 1.6 | 1.75 | 2). */
  lineHeight: 1.4 | 1.5 | 1.6 | 1.75 | 2;
  /** Letter spacing: normal | tight | wide. */
  letterSpacing: "normal" | "tight" | "wide";
};

/* ------------------------------------------------------------------ */
/* Colors                                                             */
/* ------------------------------------------------------------------ */

export type TemplateColors = {
  primary: string;      // hex
  secondary: string;    // hex
  accent: string;       // hex
  text: string;         // hex (body text)
  mutedText: string;    // hex (secondary/muted text)
  headingColor: string; // hex (section headings)
  dividerColor: string; // hex (section dividers/rules)
  pageBackground: string; // hex (page canvas background)
};

/* ------------------------------------------------------------------ */
/* Layout                                                             */
/* ------------------------------------------------------------------ */

export type TemplateLayout = {
  columnCount: 1 | 2;
  pageMargins: "narrow" | "standard" | "wide";
  sectionSpacing: string; // e.g. "1.5rem"
  contentSpacing: string; // e.g. "1rem"
  headerAlignment: "left" | "center";
  pageSize: "A4" | "US Letter";
  dividerVisibility: boolean;
};

/* ------------------------------------------------------------------ */
/* Sections                                                           */
/* ------------------------------------------------------------------ */

export type TemplateSections = {
  sectionOrder: ResumeSectionId[];
  sectionVisibility: Record<ResumeSectionId, boolean>;
  sectionHeadings: Partial<Record<ResumeSectionId, string>>;
  showSectionHeadings: boolean;
};

/* ------------------------------------------------------------------ */
/* Config                                                             */
/* ------------------------------------------------------------------ */

export type CustomTemplateConfig = {
  id: string; // `${CUSTOM_TEMPLATE_PREFIX}${uuid}`
  name: string;
  /** Which built-in template this customizes, or "blank". */
  baseTemplate: ResumeTemplateId | "blank";
  typography: TemplateTypography;
  colors: TemplateColors;
  layout: TemplateLayout;
  sections: TemplateSections;
  createdAt: string;
  updatedAt: string;
};

export type CustomTemplateListItem = {
  id: string;
  name: string;
  baseTemplate: string;
  updatedAt: string;
  thumbnail?: string; // data URL placeholder for future preview image
};

/* ------------------------------------------------------------------ */
/* Defaults                                                           */
/* ------------------------------------------------------------------ */

const DEFAULT_TYPOGRAPHY: TemplateTypography = {
  fontFamily: 'var(--font-serif), ui-serif, Georgia, "Times New Roman", serif',
  nameFontSize: "28px",
  headingFontSize: "13px",
  bodyFontSize: "11px",
  fontWeight: 500,
  lineHeight: 1.5,
  letterSpacing: "normal",
};

const DEFAULT_COLORS: TemplateColors = {
  primary: "#1f3d33",
  secondary: "#b5563a",
  accent: "#b5563a",
  text: "#1b211d",
  mutedText: "#6b6a60",
  headingColor: "#1f3d33",
  dividerColor: "#e0d8c9",
  pageBackground: "#fffdf8",
};

const DEFAULT_LAYOUT: TemplateLayout = {
  columnCount: 1,
  pageMargins: "standard",
  sectionSpacing: "1.5rem",
  contentSpacing: "1rem",
  headerAlignment: "left",
  pageSize: "A4",
  dividerVisibility: true,
};

const DEFAULT_SECTIONS: TemplateSections = {
  sectionOrder: ["summary", "skills", "experience", "projects", "education"],
  sectionVisibility: {
    summary: true,
    skills: true,
    experience: true,
    projects: true,
    education: true,
  },
  sectionHeadings: {},
  showSectionHeadings: true,
};

/**
 * Design seeds for starting a custom template from a built-in layout.
 *
 * These only translate each built-in template's visual character (type
 * pairing, accent color, density, header alignment) into editable design
 * tokens. They do not reproduce built-in template markup, and the user can
 * change every value afterwards.
 */
type BaseTemplateSeed = {
  typography: Partial<TemplateTypography>;
  colors: Partial<TemplateColors>;
  layout: Partial<TemplateLayout>;
};

const BASE_TEMPLATE_SEEDS: Record<ResumeTemplateId, BaseTemplateSeed> = {
  "professional-classic": {
    typography: {
      fontFamily: 'var(--font-serif), ui-serif, Georgia, "Times New Roman", serif',
      nameFontSize: "30px",
      headingFontSize: "13px",
      bodyFontSize: "11px",
      fontWeight: 500,
      lineHeight: 1.5,
    },
    colors: {
      primary: "#1b1a17",
      secondary: "#4a463c",
      accent: "#1b1a17",
      headingColor: "#1b1a17",
      dividerColor: "#d9d4c8",
      pageBackground: "#ffffff",
    },
    layout: {
      headerAlignment: "center",
      pageMargins: "standard",
      dividerVisibility: false,
      columnCount: 1,
    },
  },
  "modern-ats": {
    typography: {
      fontFamily: 'var(--font-sans), ui-sans-serif, system-ui, sans-serif',
      nameFontSize: "30px",
      headingFontSize: "12px",
      bodyFontSize: "11px",
      fontWeight: 500,
      lineHeight: 1.5,
    },
    colors: {
      primary: "#1b211d",
      secondary: "#2f6b57",
      accent: "#2f6b57",
      headingColor: "#2f6b57",
      dividerColor: "#e0e6e1",
      pageBackground: "#ffffff",
    },
    layout: {
      headerAlignment: "left",
      pageMargins: "standard",
      dividerVisibility: true,
      columnCount: 1,
    },
  },
  "compact-ats": {
    typography: {
      fontFamily: 'var(--font-sans), ui-sans-serif, system-ui, sans-serif',
      nameFontSize: "26px",
      headingFontSize: "11px",
      bodyFontSize: "10px",
      fontWeight: 500,
      lineHeight: 1.4,
    },
    colors: {
      primary: "#1b1a17",
      secondary: "#495057",
      accent: "#495057",
      headingColor: "#1b1a17",
      dividerColor: "#d8dade",
      pageBackground: "#ffffff",
    },
    layout: {
      headerAlignment: "left",
      pageMargins: "narrow",
      sectionSpacing: "1.1rem",
      contentSpacing: "0.7rem",
      dividerVisibility: true,
      columnCount: 1,
    },
  },
  "technical-ats": {
    typography: {
      fontFamily: "var(--font-mono), ui-monospace, SFMono-Regular, monospace",
      nameFontSize: "28px",
      headingFontSize: "12px",
      bodyFontSize: "10px",
      fontWeight: 500,
      lineHeight: 1.5,
    },
    colors: {
      primary: "#1f3a5f",
      secondary: "#2b4c7e",
      accent: "#2b4c7e",
      headingColor: "#2b4c7e",
      dividerColor: "#d5dfea",
      pageBackground: "#ffffff",
    },
    layout: {
      headerAlignment: "left",
      pageMargins: "standard",
      dividerVisibility: true,
      columnCount: 1,
    },
  },
  "minimal-ats": {
    typography: {
      fontFamily: 'var(--font-sans), ui-sans-serif, system-ui, sans-serif',
      nameFontSize: "28px",
      headingFontSize: "11px",
      bodyFontSize: "11px",
      fontWeight: 400,
      lineHeight: 1.6,
    },
    colors: {
      primary: "#2a2a28",
      secondary: "#5c5a54",
      accent: "#5c5a54",
      headingColor: "#5c5a54",
      dividerColor: "#ecebe7",
      pageBackground: "#ffffff",
    },
    layout: {
      headerAlignment: "left",
      pageMargins: "wide",
      sectionSpacing: "1.75rem",
      contentSpacing: "1.1rem",
      dividerVisibility: false,
      columnCount: 1,
    },
  },
  "entry-level-ats": {
    typography: {
      fontFamily: 'var(--font-serif), ui-serif, Georgia, "Times New Roman", serif',
      nameFontSize: "30px",
      headingFontSize: "12px",
      bodyFontSize: "11px",
      fontWeight: 500,
      lineHeight: 1.5,
    },
    colors: {
      primary: "#2c241b",
      secondary: "#8a5a2b",
      accent: "#8a5a2b",
      headingColor: "#8a5a2b",
      dividerColor: "#e8ddcd",
      pageBackground: "#ffffff",
    },
    layout: {
      headerAlignment: "center",
      pageMargins: "standard",
      dividerVisibility: true,
      columnCount: 1,
    },
  },
  "executive-ats": {
    typography: {
      fontFamily: 'var(--font-serif), ui-serif, Georgia, "Times New Roman", serif',
      nameFontSize: "32px",
      headingFontSize: "14px",
      bodyFontSize: "11px",
      fontWeight: 500,
      lineHeight: 1.5,
    },
    colors: {
      primary: "#3d2f2a",
      secondary: "#3d2f2a",
      accent: "#3d2f2a",
      headingColor: "#3d2f2a",
      dividerColor: "#ddd4cd",
      pageBackground: "#ffffff",
    },
    layout: {
      headerAlignment: "center",
      pageMargins: "wide",
      dividerVisibility: false,
      columnCount: 1,
    },
  },
  "project-focused-ats": {
    typography: {
      fontFamily: 'var(--font-sans), ui-sans-serif, system-ui, sans-serif',
      nameFontSize: "30px",
      headingFontSize: "12px",
      bodyFontSize: "11px",
      fontWeight: 500,
      lineHeight: 1.5,
    },
    colors: {
      primary: "#1b211d",
      secondary: "#5b3b6b",
      accent: "#5b3b6b",
      headingColor: "#5b3b6b",
      dividerColor: "#e4dbe8",
      pageBackground: "#ffffff",
    },
    layout: {
      headerAlignment: "left",
      pageMargins: "standard",
      dividerVisibility: true,
      columnCount: 1,
    },
  },
};

export function createDefaultCustomTemplate(
  id: string,
  name: string,
  baseTemplate: ResumeTemplateId | "blank" = "blank",
): CustomTemplateConfig {
  const seed =
    baseTemplate === "blank" ? null : BASE_TEMPLATE_SEEDS[baseTemplate];

  return {
    id,
    name,
    baseTemplate,
    typography: {
      ...DEFAULT_TYPOGRAPHY,
      ...(seed?.typography ?? {}),
    },
    colors: {
      ...DEFAULT_COLORS,
      ...(seed?.colors ?? {}),
    },
    layout: {
      ...DEFAULT_LAYOUT,
      ...(seed?.layout ?? {}),
    },
    sections: {
      ...DEFAULT_SECTIONS,
      sectionHeadings: {},
    },
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
}

export function isBlankBase(base: ResumeTemplateId | "blank"): base is "blank" {
  return base === "blank";
}

/** CSS page margin for a custom template's page-margin token. */
export function pageMarginCss(value: TemplateLayout["pageMargins"]): string {
  switch (value) {
    case "narrow":
      return "0.75in";
    case "wide":
      return "1.25in";
    case "standard":
    default:
      return "1in";
  }
}

/** CSS `@page size` value for a custom template's page-size token. */
export function pageSizeCss(value: TemplateLayout["pageSize"]): string {
  return value === "US Letter" ? "Letter" : "A4";
}

/* ------------------------------------------------------------------ */
/* Storage (localStorage, mirroring resume library persistence)       */
/* ------------------------------------------------------------------ */

export const CUSTOM_TEMPLATES_STORAGE_KEY = "resume-builder.custom-templates.v1";
export const CUSTOM_TEMPLATES_SCHEMA_VERSION = 1;

type CustomTemplatesStore = {
  version: number;
  templates: CustomTemplateConfig[];
};

const EMPTY_STORE: CustomTemplatesStore = {
  version: CUSTOM_TEMPLATES_SCHEMA_VERSION,
  templates: [],
};

const listeners = new Set<() => void>();

let cachedRaw: string | null | undefined;
let cachedStore: CustomTemplatesStore = EMPTY_STORE;

function getStorage(): Storage | null {
  try {
    const candidate = (globalThis as typeof globalThis & {
      localStorage?: Storage;
    }).localStorage;

    if (!candidate) return null;

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
    return storage.getItem(CUSTOM_TEMPLATES_STORAGE_KEY);
  } catch {
    return null;
  }
}

function isCustomTemplateConfig(value: unknown): value is CustomTemplateConfig {
  if (typeof value !== "object" || value === null || Array.isArray(value)) {
    return false;
  }

  const record = value as Record<string, unknown>;

  return (
    typeof record.id === "string" &&
    record.id.startsWith(CUSTOM_TEMPLATE_PREFIX) &&
    typeof record.name === "string" &&
    typeof record.baseTemplate === "string" &&
    typeof record.createdAt === "string" &&
    typeof record.updatedAt === "string" &&
    typeof record.typography === "object" &&
    record.typography !== null &&
    typeof (record.typography as Record<string, unknown>).fontFamily === "string" &&
    typeof (record.typography as Record<string, unknown>).nameFontSize === "string" &&
    typeof (record.typography as Record<string, unknown>).headingFontSize === "string" &&
    typeof (record.typography as Record<string, unknown>).bodyFontSize === "string" &&
    typeof (record.typography as Record<string, unknown>).fontWeight === "number" &&
    typeof (record.typography as Record<string, unknown>).lineHeight === "number" &&
    typeof (record.typography as Record<string, unknown>).letterSpacing === "string" &&
    typeof record.colors === "object" &&
    record.colors !== null &&
    Object.values((record.colors as Record<string, unknown>) as Record<string, string>).every(
      (value) => typeof value === "string",
    ) &&
    typeof record.layout === "object" &&
    record.layout !== null &&
    typeof (record.layout as Record<string, unknown>).columnCount === "number" &&
    typeof (record.layout as Record<string, unknown>).pageMargins === "string" &&
    typeof (record.layout as Record<string, unknown>).sectionSpacing === "string" &&
    typeof (record.layout as Record<string, unknown>).contentSpacing === "string" &&
    typeof (record.layout as Record<string, unknown>).headerAlignment === "string" &&
    typeof (record.layout as Record<string, unknown>).pageSize === "string" &&
    typeof (record.layout as Record<string, unknown>).dividerVisibility === "boolean" &&
    typeof record.sections === "object" &&
    record.sections !== null &&
    Array.isArray((record.sections as Record<string, unknown>).sectionOrder) &&
    typeof (record.sections as Record<string, unknown>).sectionVisibility === "object" &&
    typeof (record.sections as Record<string, unknown>).showSectionHeadings === "boolean"
  );
}

function parseStore(raw: string | null): CustomTemplatesStore {
  if (raw === null) return EMPTY_STORE;

  let parsed: unknown;
  try {
    parsed = JSON.parse(raw);
  } catch {
    return EMPTY_STORE;
  }

  if (typeof parsed !== "object" || parsed === null || Array.isArray(parsed)) {
    return EMPTY_STORE;
  }

  const record = parsed as Record<string, unknown>;

  if (record.version !== CUSTOM_TEMPLATES_SCHEMA_VERSION) {
    return EMPTY_STORE;
  }

  if (!Array.isArray(record.templates)) {
    return EMPTY_STORE;
  }

  const templates: CustomTemplateConfig[] = [];
  const seen = new Set<string>();

  for (const item of record.templates) {
    if (!isCustomTemplateConfig(item) || seen.has(item.id)) continue;
    seen.add(item.id);
    templates.push(item);
  }

  return {
    version: CUSTOM_TEMPLATES_SCHEMA_VERSION,
    templates,
  };
}

function writeStore(store: CustomTemplatesStore): boolean {
  const storage = getStorage();
  if (!storage) return false;

  let serialized: string;
  try {
    serialized = JSON.stringify(store);
  } catch {
    return false;
  }

  try {
    storage.setItem(CUSTOM_TEMPLATES_STORAGE_KEY, serialized);
  } catch {
    return false;
  }

  cachedRaw = serialized;
  cachedStore = store;
  for (const listener of listeners) {
    listener();
  }
  return true;
}

export function getCustomTemplates(): CustomTemplateConfig[] {
  const raw = readRaw();

  if (raw === cachedRaw) {
    return cachedStore.templates;
  }

  cachedRaw = raw;
  cachedStore = parseStore(raw);
  return cachedStore.templates;
}

/** Stable empty snapshot used during server rendering and hydration. */
export function getCustomTemplatesServerSnapshot(): CustomTemplateConfig[] {
  return EMPTY_STORE.templates;
}

export function subscribeToCustomTemplates(listener: () => void): () => void {
  listeners.add(listener);

  if (typeof window === "undefined") {
    return () => {
      listeners.delete(listener);
    };
  }

  const handleStorage = (event: StorageEvent) => {
    if (event.key !== null && event.key !== CUSTOM_TEMPLATES_STORAGE_KEY) {
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

export function getCustomTemplate(id: string): CustomTemplateConfig | null {
  return getCustomTemplates().find((item) => item.id === id) ?? null;
}

export function saveCustomTemplate(config: CustomTemplateConfig): boolean {
  const store = getCustomTemplates();
  const existingIndex = store.findIndex((item) => item.id === config.id);

  const next: CustomTemplateConfig[] = existingIndex === -1
    ? [...store, config]
    : store.map((item, index) => (index === existingIndex ? config : item));

  return writeStore({
    version: CUSTOM_TEMPLATES_SCHEMA_VERSION,
    templates: next,
  });
}

export function deleteCustomTemplate(id: string): boolean {
  const store = getCustomTemplates();
  const exists = store.some((item) => item.id === id);

  if (!exists) return false;

  return writeStore({
    version: CUSTOM_TEMPLATES_SCHEMA_VERSION,
    templates: store.filter((item) => item.id !== id),
  });
}

export function renameCustomTemplate(id: string, name: string): boolean {
  const trimmed = name.trim();
  if (!trimmed) return false;

  const existing = getCustomTemplate(id);
  if (!existing) return false;

  return saveCustomTemplate({
    ...existing,
    name: trimmed,
    updatedAt: new Date().toISOString(),
  });
}

export function createCustomTemplateId(): string {
  const cryptoApi = globalThis.crypto;

  if (cryptoApi && typeof cryptoApi.randomUUID === "function") {
    return `${CUSTOM_TEMPLATE_PREFIX}${cryptoApi.randomUUID()}`;
  }

  return `${CUSTOM_TEMPLATE_PREFIX}${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
}

export function isBuiltInTemplateId(
  id: AnyTemplateId | undefined | null,
): id is ResumeTemplateId {
  return (
    id !== undefined &&
    id !== null &&
    !isCustomTemplateId(id) &&
    (RESUME_TEMPLATES as readonly string[]).includes(id)
  );
}

export function isCustomTemplateConfigId(id: string): boolean {
  return id.startsWith(CUSTOM_TEMPLATE_PREFIX);
}

export function defaultBaseTemplate(): ResumeTemplateId | "blank" {
  return DEFAULT_RESUME_TEMPLATE;
}
