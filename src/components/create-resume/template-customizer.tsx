"use client";

import { useCallback, useMemo, useState, type ReactNode } from "react";
import { useRouter } from "next/navigation";

import {
  CustomTemplateRenderer,
} from "@/components/create-resume/custom-template-renderer";
import { hasResumeContent } from "@/components/create-resume/resume-templates";
import {
  createDefaultCustomTemplate,
  createCustomTemplateId,
  saveCustomTemplate,
  type CustomTemplateConfig,
} from "@/lib/resume/custom-template";
import {
  DEFAULT_RESUME_TEMPLATE,
  useResumeEditorStore,
  type EditorResumeData,
  type ResumeSectionId,
} from "@/lib/resume/editor-store";
import {
  ArrowRightIcon,
  CheckIcon,
  ChevronDownIcon,
  ChevronUpIcon,
} from "@/components/ui/icons";

/* ------------------------------------------------------------------ */
/* Sample resume data for preview                                     */
/* ------------------------------------------------------------------ */

const SAMPLE_RESUME: EditorResumeData = {
  jobTitle: "Senior Product Designer",
  professionalSummary:
    "Product designer with 8+ years of experience designing end-to-end digital experiences for B2B SaaS and consumer platforms. Passionate about design systems, accessibility, and shipping measurable outcomes.",
  skills: [
    "UI Design",
    "UX Research",
    "Design Systems",
    "Figma",
    "Prototyping",
    "Accessibility (WCAG)",
    "Design Handoff",
    "User Testing",
    "React",
    "HTML/CSS",
  ],
  experience: [
    {
      id: "exp-1",
      jobTitle: "Senior Product Designer",
      companyName: "Northwind Studio",
      startDate: "2021",
      endDate: null,
      isCurrent: true,
      location: "Remote",
      employmentType: "Full-time",
      description:
        "Lead the design of the company's flagship design system, adopted across 6 product teams and 40+ components.",
      achievements: [
        "Reduced design-to-development handoff time by 40% through a documented component library.",
        "Improved accessibility audit score from 72 to 96 across core user flows.",
        "Grew the design team from 3 to 8 members through hiring and mentorship.",
      ],
    },
    {
      id: "exp-2",
      jobTitle: "Product Designer",
      companyName: "Meridian Corp",
      startDate: "2017",
      endDate: "2021",
      isCurrent: false,
      location: "Chicago, IL",
      employmentType: "Full-time",
      description:
        "Designed customer-facing web and mobile applications for a B2B financial services platform.",
      achievements: [
        "Redesigned the onboarding flow, increasing conversion by 25%.",
        "Shiped 3 major platform releases serving 50,000+ monthly active users.",
      ],
    },
  ],
  projects: [
    {
      id: "proj-1",
      name: "Design System Rebuild",
      description:
        "A comprehensive component library and design token system for internal products.",
      technologies: ["Figma", "React", "Storybook", "TypeScript"],
      link: "https://example.com/design-system",
      startDate: "2022",
      endDate: "2023",
      achievements: [
        "Adopted by 6 product teams.",
        "40+ documented components.",
      ],
    },
    {
      id: "proj-2",
      name: "Accessibility Audit Tool",
      description:
        "A browser extension that flags WCAG contrast and keyboard navigation issues in real time.",
      technologies: ["JavaScript", "Chrome Extension API", "axe-core"],
      githubUrl: "https://github.com/example/a11y-tool",
      startDate: "2021",
      endDate: null,
      achievements: [
        "1,000+ active users.",
        "4.8-star rating on Chrome Web Store.",
      ],
    },
    {
      id: "proj-3",
      name: "User Research Portal",
      description:
        "A repository and analysis platform for user research findings and usability test videos.",
      technologies: ["React", "Node.js", "PostgreSQL"],
      url: "https://example.com/research-portal",
      startDate: "2020",
      endDate: "2021",
      achievements: [],
    },
  ],
  education: [
    {
      id: "edu-1",
      schoolName: "University of Illinois",
      degree: "Bachelor of Fine Arts",
      fieldOfStudy: "Graphic Design",
      startDate: "2013",
      endDate: "2017",
      location: "Chicago, IL",
      grade: "3.8",
    },
  ],
  personalInfo: {
    fullName: "Alex Rivera",
    professionalTitle: "Senior Product Designer",
    email: "alex.rivera@example.com",
    phone: "(555) 123-4567",
    city: "Chicago",
    state: "IL",
    country: "US",
    linkedin: "https://linkedin.com/in/alexrivera",
    github: "https://github.com/alexrivera",
    portfolio: "https://alexrivera.design",
    website: "",
  },
  certifications: [
    {
      id: "cert-1",
      name: "Certified Accessibility Professional",
      issuer: "International Association of Accessibility Professionals",
      issueDate: "2022",
      expirationDate: "2025",
      credentialUrl: "https://example.com/cert/cap",
    },
  ],
  additionalSections: [
    {
      id: "add-1",
      title: "Languages",
      entries: [
        {
          id: "entry-1",
          title: "English",
          subtitle: "Native",
          date: "",
          description: "",
          url: "",
        },
        {
          id: "entry-2",
          title: "Spanish",
          subtitle: "Professional working proficiency",
          date: "",
          description: "",
          url: "",
        },
      ],
    },
  ],
  coverLetter: "",
};

/* ------------------------------------------------------------------ */
/* Presets                                                            */
/* ------------------------------------------------------------------ */

const FONT_FAMILY_PRESETS: Array<{ label: string; value: string }> = [
  {
    label: "Serif (Fraunces)",
    value: 'var(--font-serif), ui-serif, Georgia, "Times New Roman", serif',
  },
  {
    label: "Sans (Geist)",
    value: "var(--font-sans), ui-sans-serif, system-ui, sans-serif",
  },
  {
    label: "Monospace",
    value: "var(--font-mono), ui-monospace, SFMono-Regular, monospace",
  },
];

const FONT_WEIGHT_PRESETS: Array<{ label: string; value: 400 | 500 | 600 | 700 }> = [
  { label: "Light (400)", value: 400 },
  { label: "Medium (500)", value: 500 },
  { label: "Semibold (600)", value: 600 },
  { label: "Bold (700)", value: 700 },
];

const LINE_HEIGHT_PRESETS: Array<{ label: string; value: CustomTemplateConfig["typography"]["lineHeight"] }> = [
  { label: "1.4 (Compact)", value: 1.4 },
  { label: "1.5", value: 1.5 },
  { label: "1.6", value: 1.6 },
  { label: "1.75 (Relaxed)", value: 1.75 },
  { label: "2.0 (Open)", value: 2 },
];

const LETTER_SPACING_PRESETS: Array<{ label: string; value: CustomTemplateConfig["typography"]["letterSpacing"] }> = [
  { label: "Normal", value: "normal" },
  { label: "Tight", value: "tight" },
  { label: "Wide", value: "wide" },
];

const PAGE_MARGIN_PRESETS: Array<{ label: string; value: CustomTemplateConfig["layout"]["pageMargins"] }> = [
  { label: "Narrow (0.75in)", value: "narrow" },
  { label: "Standard (1in)", value: "standard" },
  { label: "Wide (1.25in)", value: "wide" },
];

/**
 * On screen the resume page scales down with the viewport, so fixed inch
 * margins would eat almost the entire content width on phones. Keep the
 * screen-only padding proportional to the page width instead. Print output
 * still uses the exact page margins through `@page`.
 */
function previewPagePadding(
  margins: CustomTemplateConfig["layout"]["pageMargins"],
): string {
  switch (margins) {
    case "narrow":
      return "clamp(1rem, 9%, 0.75in)";
    case "wide":
      return "clamp(1rem, 15%, 1.25in)";
    case "standard":
    default:
      return "clamp(1rem, 12%, 1in)";
  }
}

/* ------------------------------------------------------------------ */
/* Shared panel shell                                                 */
/* ------------------------------------------------------------------ */

function ControlGroup({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  return (
    <section className="rounded-[22px] border border-line bg-background/60 p-4">
      <h4 className="mb-4 flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.18em] text-muted">
        <span aria-hidden="true" className="h-1.5 w-1.5 rounded-full bg-accent" />
        {title}
      </h4>
      {children}
    </section>
  );
}

function ToggleSwitch({
  checked,
  onChange,
  label,
}: {
  checked: boolean;
  onChange: () => void;
  label: string;
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={label}
      onClick={onChange}
      className={`relative inline-flex h-5 w-9 shrink-0 items-center rounded-full border transition-colors focus-visible:ring-2 focus-visible:ring-ring/40 focus-visible:outline-none ${
        checked
          ? "border-primary bg-primary"
          : "border-line bg-accent-soft/70"
      }`}
    >
      <span
        className={`inline-block h-3.5 w-3.5 rounded-full shadow-sm transition-transform ${
          checked
            ? "translate-x-[17px] bg-white"
            : "translate-x-[2px] bg-white"
        }`}
      />
    </button>
  );
}

/* ------------------------------------------------------------------ */
/* Typography controls                                                */
/* ------------------------------------------------------------------ */

function TypographyControls({
  config,
  onChange,
}: {
  config: CustomTemplateConfig["typography"];
  onChange: (updates: Partial<CustomTemplateConfig["typography"]>) => void;
}) {
  return (
    <ControlGroup title="Typography">
      <div className="space-y-3">
        <div className="space-y-1.5">
          <label className="text-[11px] font-medium text-ink">Font family</label>
          <select
            value={config.fontFamily}
            onChange={(event) =>
              onChange({ fontFamily: event.target.value })
            }
            className="h-9 w-full rounded-[22px] border border-line bg-accent-soft/40 px-3.5 text-xs text-ink transition-colors focus:border-primary focus:ring-2 focus:ring-ring/20 focus:outline-none"
          >
            {FONT_FAMILY_PRESETS.map((preset) => (
              <option key={preset.label} value={preset.value}>
                {preset.label}
              </option>
            ))}
          </select>
        </div>

        <div className="grid grid-cols-3 gap-3">
          <div className="space-y-1.5">
            <label className="text-[11px] font-medium text-ink">Name</label>
            <select
              value={config.nameFontSize}
              onChange={(event) =>
                onChange({ nameFontSize: event.target.value })
              }
              className="h-9 w-full rounded-[22px] border border-line bg-accent-soft/40 px-3.5 text-xs text-ink transition-colors focus:border-primary focus:ring-2 focus:ring-ring/20 focus:outline-none"
            >
              {["24px", "28px", "32px", "36px", "40px"].map((size) => (
                <option key={size} value={size}>
                  {size}
                </option>
              ))}
            </select>
          </div>
          <div className="space-y-1.5">
            <label className="text-[11px] font-medium text-ink">Heading</label>
            <select
              value={config.headingFontSize}
              onChange={(event) =>
                onChange({ headingFontSize: event.target.value })
              }
              className="h-9 w-full rounded-[22px] border border-line bg-accent-soft/40 px-3.5 text-xs text-ink transition-colors focus:border-primary focus:ring-2 focus:ring-ring/20 focus:outline-none"
            >
              {["10px", "11px", "12px", "13px", "14px", "16px"].map((size) => (
                <option key={size} value={size}>
                  {size}
                </option>
              ))}
            </select>
          </div>
          <div className="space-y-1.5">
            <label className="text-[11px] font-medium text-ink">Body</label>
            <select
              value={config.bodyFontSize}
              onChange={(event) =>
                onChange({ bodyFontSize: event.target.value })
              }
              className="h-9 w-full rounded-[22px] border border-line bg-accent-soft/40 px-3.5 text-xs text-ink transition-colors focus:border-primary focus:ring-2 focus:ring-ring/20 focus:outline-none"
            >
              {["9px", "10px", "11px", "12px", "13px", "14px"].map((size) => (
                <option key={size} value={size}>
                  {size}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1.5">
            <label className="text-[11px] font-medium text-ink">Font weight</label>
            <select
              value={String(config.fontWeight)}
              onChange={(event) =>
                onChange({
                  fontWeight: event.target.value as unknown as 400 | 500 | 600 | 700,
                })
              }
              className="h-9 w-full rounded-[22px] border border-line bg-accent-soft/40 px-3.5 text-xs text-ink transition-colors focus:border-primary focus:ring-2 focus:ring-ring/20 focus:outline-none"
            >
              {FONT_WEIGHT_PRESETS.map((preset) => (
                <option key={String(preset.value)} value={String(preset.value)}>
                  {preset.label}
                </option>
              ))}
            </select>
          </div>
          <div className="space-y-1.5">
            <label className="text-[11px] font-medium text-ink">Line height</label>
            <select
              value={String(config.lineHeight)}
              onChange={(event) =>
                onChange({
                  lineHeight: event.target.value as unknown as 1.4 | 1.5 | 1.6 | 1.75 | 2,
                })
              }
              className="h-9 w-full rounded-[22px] border border-line bg-accent-soft/40 px-3.5 text-xs text-ink transition-colors focus:border-primary focus:ring-2 focus:ring-ring/20 focus:outline-none"
            >
              {LINE_HEIGHT_PRESETS.map((preset) => (
                <option key={String(preset.value)} value={String(preset.value)}>
                  {preset.label}
                </option>
              ))}
            </select>
          </div>
          <div className="col-span-2 space-y-1.5">
            <label className="text-[11px] font-medium text-ink">Letter spacing</label>
            <select
              value={config.letterSpacing}
              onChange={(event) =>
                onChange({
                  letterSpacing: event.target.value as unknown as "normal" | "tight" | "wide",
                })
              }
              className="h-9 w-full rounded-[22px] border border-line bg-accent-soft/40 px-3.5 text-xs text-ink transition-colors focus:border-primary focus:ring-2 focus:ring-ring/20 focus:outline-none"
            >
              {LETTER_SPACING_PRESETS.map((preset) => (
                <option key={preset.value} value={preset.value}>
                  {preset.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>
    </ControlGroup>
  );
}

/* ------------------------------------------------------------------ */
/* Color controls                                                     */
/* ------------------------------------------------------------------ */

type ColorField = keyof CustomTemplateConfig["colors"];

const COLOR_FIELDS: Array<{ key: ColorField; label: string; default: string }> = [
  { key: "primary", label: "Primary", default: "#1f3d33" },
  { key: "secondary", label: "Secondary", default: "#b5563a" },
  { key: "accent", label: "Accent", default: "#b5563a" },
  { key: "text", label: "Body text", default: "#1b211d" },
  { key: "mutedText", label: "Muted text", default: "#6b6a60" },
  { key: "headingColor", label: "Section headings", default: "#1f3d33" },
  { key: "dividerColor", label: "Dividers", default: "#e0d8c9" },
  { key: "pageBackground", label: "Page background", default: "#fffdf8" },
];

const COLOR_PRESETS: Array<{
  label: string;
  colors: CustomTemplateConfig["colors"];
}> = [
  {
    label: "Forest",
    colors: {
      primary: "#1f3d33",
      secondary: "#b5563a",
      accent: "#b5563a",
      text: "#1b211d",
      mutedText: "#6b6a60",
      headingColor: "#1f3d33",
      dividerColor: "#e0d8c9",
      pageBackground: "#fffdf8",
    },
  },
  {
    label: "Slate",
    colors: {
      primary: "#2b4c7e",
      secondary: "#5c7ba1",
      accent: "#2b4c7e",
      text: "#1f2933",
      mutedText: "#6b7280",
      headingColor: "#2b4c7e",
      dividerColor: "#d5dfea",
      pageBackground: "#ffffff",
    },
  },
  {
    label: "Ink",
    colors: {
      primary: "#1b1a17",
      secondary: "#4a463c",
      accent: "#1b1a17",
      text: "#1b1a17",
      mutedText: "#6b6860",
      headingColor: "#1b1a17",
      dividerColor: "#d9d4c8",
      pageBackground: "#ffffff",
    },
  },
  {
    label: "Plum",
    colors: {
      primary: "#5b3b6b",
      secondary: "#8a5a2b",
      accent: "#5b3b6b",
      text: "#2a2430",
      mutedText: "#6d6475",
      headingColor: "#5b3b6b",
      dividerColor: "#e4dbe8",
      pageBackground: "#ffffff",
    },
  },
  {
    label: "Warm",
    colors: {
      primary: "#3d2f2a",
      secondary: "#8a5a2b",
      accent: "#8a5a2b",
      text: "#2c241b",
      mutedText: "#746457",
      headingColor: "#3d2f2a",
      dividerColor: "#e8ddcd",
      pageBackground: "#fffdf8",
    },
  },
];

function ColorControls({
  config,
  onChange,
}: {
  config: CustomTemplateConfig["colors"];
  onChange: (updates: Partial<CustomTemplateConfig["colors"]>) => void;
}) {
  return (
    <ControlGroup title="Colors">
      <div className="space-y-4">
        <div className="space-y-1.5">
          <label className="text-[11px] font-medium text-ink">Presets</label>
          <div className="flex flex-wrap gap-2">
            {COLOR_PRESETS.map((preset) => (
              <button
                key={preset.label}
                type="button"
                onClick={() => onChange(preset.colors)}
                className="inline-flex items-center gap-1.5 rounded-full border border-line bg-card px-2.5 py-1 text-[10px] font-medium text-ink transition-colors hover:border-primary/40 hover:bg-accent-soft/50 focus-visible:ring-2 focus-visible:ring-ring/40 focus-visible:outline-none"
              >
                <span aria-hidden="true" className="flex -space-x-1">
                  {[
                    preset.colors.primary,
                    preset.colors.accent,
                    preset.colors.dividerColor,
                  ].map((color, index) => (
                    <span
                      key={`${preset.label}-swatch-${index}`}
                      className="h-3 w-3 rounded-full border border-white"
                      style={{ backgroundColor: color }}
                    />
                  ))}
                </span>
                {preset.label}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          {COLOR_FIELDS.map((field) => (
            <div key={field.key} className="space-y-1.5">
              <label className="text-[11px] font-medium text-ink">
                {field.label}
              </label>
              <div className="flex min-w-0 items-center gap-1.5">
                <input
                  type="color"
                  value={config[field.key]}
                  onChange={(event) =>
                    onChange({ [field.key]: event.target.value })
                  }
                  className="h-8 w-8 shrink-0 cursor-pointer rounded-[22px] border-none bg-transparent p-0"
                />
                <input
                  type="text"
                  value={config[field.key]}
                  onChange={(event) =>
                    onChange({ [field.key]: event.target.value })
                  }
                  className="h-8 min-w-0 flex-1 rounded-[22px] border border-line bg-accent-soft/40 px-1.5 font-mono text-[10px] text-ink transition-colors focus:border-primary focus:ring-2 focus:ring-ring/20 focus:outline-none"
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </ControlGroup>
  );
}

/* ------------------------------------------------------------------ */
/* Layout controls                                                    */
/* ------------------------------------------------------------------ */

function LayoutControls({
  config,
  onChange,
}: {
  config: CustomTemplateConfig["layout"];
  onChange: (updates: Partial<CustomTemplateConfig["layout"]>) => void;
}) {
  return (
    <ControlGroup title="Layout">
      <div className="space-y-4">
        <div className="space-y-1.5">
          <label className="text-[11px] font-medium text-ink">Columns</label>
          <div className="grid grid-cols-2 gap-1 rounded-[22px] border border-line bg-accent-soft/40 p-1">
            {[
              { value: 1 as const, label: "Single" },
              { value: 2 as const, label: "Two column" },
            ].map((option) => (
              <button
                key={option.value}
                type="button"
                role="radio"
                aria-checked={config.columnCount === option.value}
                onClick={() => onChange({ columnCount: option.value })}
                className={`h-7 rounded-full text-[11px] font-medium transition-colors ${
                  config.columnCount === option.value
                    ? "bg-card text-ink shadow-sm"
                    : "text-muted hover:text-ink"
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>
          <p className="text-[10px] leading-snug text-muted">
            Two-column layout applies to the preview structure where supported.
          </p>
        </div>

        <div className="space-y-1.5">
          <label className="text-[11px] font-medium text-ink">Page margins</label>
          <select
            value={config.pageMargins}
            onChange={(event) =>
              onChange({
                pageMargins: event.target.value as unknown as "narrow" | "standard" | "wide",
              })
            }
            className="h-9 w-full rounded-[22px] border border-line bg-accent-soft/40 px-3.5 text-xs text-ink transition-colors focus:border-primary focus:ring-2 focus:ring-ring/20 focus:outline-none"
          >
            {PAGE_MARGIN_PRESETS.map((preset) => (
              <option key={preset.value} value={preset.value}>
                {preset.label}
              </option>
            ))}
          </select>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1.5">
            <label className="text-[11px] font-medium text-ink">
              Section spacing
            </label>
            <select
              value={config.sectionSpacing}
              onChange={(event) =>
                onChange({ sectionSpacing: event.target.value })
              }
              className="h-9 w-full rounded-[22px] border border-line bg-accent-soft/40 px-3.5 text-xs text-ink transition-colors focus:border-primary focus:ring-2 focus:ring-ring/20 focus:outline-none"
            >
              {["1rem", "1.25rem", "1.5rem", "1.75rem", "2rem"].map((gap) => (
                <option key={gap} value={gap}>
                  {gap}
                </option>
              ))}
            </select>
          </div>
          <div className="space-y-1.5">
            <label className="text-[11px] font-medium text-ink">
              Column spacing
            </label>
            <select
              value={config.contentSpacing}
              onChange={(event) =>
                onChange({ contentSpacing: event.target.value })
              }
              className="h-9 w-full rounded-[22px] border border-line bg-accent-soft/40 px-3.5 text-xs text-ink transition-colors focus:border-primary focus:ring-2 focus:ring-ring/20 focus:outline-none"
            >
              {["0.75rem", "1rem", "1.25rem", "1.5rem", "2rem"].map((gap) => (
                <option key={gap} value={gap}>
                  {gap}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1.5">
            <label className="text-[11px] font-medium text-ink">Page size</label>
            <select
              value={config.pageSize}
              onChange={(event) =>
                onChange({
                  pageSize: event.target.value as unknown as "A4" | "US Letter",
                })
              }
              className="h-9 w-full rounded-[22px] border border-line bg-accent-soft/40 px-3.5 text-xs text-ink transition-colors focus:border-primary focus:ring-2 focus:ring-ring/20 focus:outline-none"
            >
              {["A4", "US Letter"].map((size) => (
                <option key={size} value={size}>
                  {size}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-1.5">
            <label className="text-[11px] font-medium text-ink">Header alignment</label>
            <select
              value={config.headerAlignment}
              onChange={(event) =>
                onChange({
                  headerAlignment: event.target.value as unknown as "left" | "center",
                })
              }
              className="h-9 w-full rounded-[22px] border border-line bg-accent-soft/40 px-3.5 text-xs text-ink transition-colors focus:border-primary focus:ring-2 focus:ring-ring/20 focus:outline-none"
            >
              <option value="left">Left</option>
              <option value="center">Center</option>
            </select>
          </div>
        </div>

        <div className="flex items-center justify-between gap-3 rounded-[18px] border border-line bg-card px-3 py-2">
          <div className="min-w-0">
            <p className="text-[11px] font-medium text-ink">Section dividers</p>
            <p className="text-[10px] leading-snug text-muted">
              Lines between resume sections.
            </p>
          </div>
          <ToggleSwitch
            checked={config.dividerVisibility}
            onChange={() => onChange({ dividerVisibility: !config.dividerVisibility })}
            label="Toggle section dividers"
          />
        </div>
      </div>
    </ControlGroup>
  );
}

/* ------------------------------------------------------------------ */
/* Section controls                                                   */
/* ------------------------------------------------------------------ */

const SECTION_FIELDS: Array<{
  id: ResumeSectionId;
  label: string;
}> = [
  { id: "summary", label: "Professional Summary" },
  { id: "skills", label: "Skills" },
  { id: "experience", label: "Work Experience" },
  { id: "projects", label: "Projects" },
  { id: "education", label: "Education" },
];

function SectionControls({
  config,
  onChange,
}: {
  config: CustomTemplateConfig["sections"];
  onChange: (updater: (prev: CustomTemplateConfig["sections"]) => CustomTemplateConfig["sections"]) => void;
}) {
  const moveSection = useCallback(
    (id: ResumeSectionId, direction: "up" | "down") => {
      onChange((prev) => {
        const order = [...prev.sectionOrder];
        const index = order.indexOf(id);
        const target = direction === "up" ? index - 1 : index + 1;
        if (index === -1 || target < 0 || target >= order.length) return prev;
        [order[index], order[target]] = [order[target], order[index]];
        return { ...prev, sectionOrder: order };
      });
    },
    [onChange],
  );

  return (
    <ControlGroup title="Sections">
      <div className="space-y-4">
        <div className="space-y-2">
          <div className="flex items-baseline justify-between gap-2">
            <label className="text-[11px] font-medium text-ink">Section order</label>
            <span className="text-[10px] text-muted">Toggle to hide</span>
          </div>
          <ol className="space-y-1.5">
            {config.sectionOrder.map((id, index) => {
              const field = SECTION_FIELDS.find((f) => f.id === id);
              const visible = config.sectionVisibility[id] ?? true;
              const label = field?.label ?? id;
              return (
                <li
                  key={id}
                  className="flex items-center gap-2 rounded-[18px] border border-line bg-card py-1.5 pl-2 pr-1.5"
                >
                  <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-accent-soft text-[10px] font-semibold text-muted">
                    {index + 1}
                  </span>
                  <span
                    className={`min-w-0 flex-1 truncate text-[11px] font-medium ${
                      visible ? "text-ink" : "text-muted line-through"
                    }`}
                    title={label}
                  >
                    {label}
                  </span>
                  <ToggleSwitch
                    checked={visible}
                    onChange={() =>
                      onChange((prev) => ({
                        ...prev,
                        sectionVisibility: {
                          ...prev.sectionVisibility,
                          [id]: !visible,
                        },
                      }))
                    }
                    label={`${visible ? "Hide" : "Show"} ${label}`}
                  />
                  <div className="flex shrink-0 items-center overflow-hidden rounded-full border border-line bg-background">
                    <button
                      type="button"
                      onClick={() => moveSection(id, "up")}
                      disabled={index === 0}
                      className="flex h-6 w-6 items-center justify-center text-muted transition-colors hover:bg-accent-soft hover:text-ink disabled:pointer-events-none disabled:opacity-30"
                      aria-label={`Move ${label} up`}
                    >
                      <ChevronUpIcon className="h-3 w-3" />
                    </button>
                    <span className="h-3.5 w-px bg-line" />
                    <button
                      type="button"
                      onClick={() => moveSection(id, "down")}
                      disabled={index === config.sectionOrder.length - 1}
                      className="flex h-6 w-6 items-center justify-center text-muted transition-colors hover:bg-accent-soft hover:text-ink disabled:pointer-events-none disabled:opacity-30"
                      aria-label={`Move ${label} down`}
                    >
                      <ChevronDownIcon className="h-3 w-3" />
                    </button>
                  </div>
                </li>
              );
            })}
          </ol>
        </div>

        <div className="space-y-2">
          <label className="text-[11px] font-medium text-ink">
            Rename section headings
          </label>
          <p className="text-[10px] leading-snug text-muted">
            Leave a field blank to use its default heading.
          </p>
          <div className="space-y-1.5">
            {config.sectionOrder.map((id) => {
              const field = SECTION_FIELDS.find((item) => item.id === id);
              return (
                <div key={id} className="flex items-center gap-2">
                  <span className="w-[72px] shrink-0 truncate text-[10px] text-muted">
                    {field?.label ?? id}
                  </span>
                  <input
                    value={config.sectionHeadings[id] ?? ""}
                    placeholder={field?.label ?? id}
                    onChange={(event) =>
                      onChange((prev) => {
                        const nextHeadings = { ...prev.sectionHeadings };

                        if (event.target.value.trim()) {
                          nextHeadings[id] = event.target.value;
                        } else {
                          delete nextHeadings[id];
                        }

                        return { ...prev, sectionHeadings: nextHeadings };
                      })
                    }
                    className="h-8 min-w-0 flex-1 rounded-[18px] border border-line bg-card px-2.5 text-[11px] text-ink transition-colors placeholder:text-muted/60 focus:border-primary focus:ring-2 focus:ring-ring/20 focus:outline-none"
                  />
                </div>
              );
            })}
          </div>
        </div>

        <div className="flex items-center justify-between gap-3 rounded-[18px] border border-line bg-card px-3 py-2">
          <div className="min-w-0">
            <p className="text-[11px] font-medium text-ink">Show section headings</p>
            <p className="text-[10px] leading-snug text-muted">
              Display the heading above each section.
            </p>
          </div>
          <ToggleSwitch
            checked={config.showSectionHeadings}
            onChange={() =>
              onChange((prev) => ({
                ...prev,
                showSectionHeadings: !prev.showSectionHeadings,
              }))
            }
            label="Toggle section headings"
          />
        </div>
      </div>
    </ControlGroup>
  );
}

/* ------------------------------------------------------------------ */
/* Main customizer                                                    */
/* ------------------------------------------------------------------ */

type TemplateCustomizerProps = {
  initialConfig?: CustomTemplateConfig;
};

export function TemplateCustomizer({
  initialConfig,
}: TemplateCustomizerProps) {
  const router = useRouter();
  const [name, setName] = useState(initialConfig?.name ?? "My Custom Template");
  const [config, setConfig] = useState<CustomTemplateConfig>(
    initialConfig ?? createDefaultCustomTemplate(createCustomTemplateId(), name, DEFAULT_RESUME_TEMPLATE),
  );
  const [saving, setSaving] = useState(false);
  const [previewMode, setPreviewMode] = useState(false);
  const workingResume = useResumeEditorStore((state) => state.workingResume);
  const previewResume =
    workingResume && hasResumeContent(workingResume)
      ? workingResume
      : SAMPLE_RESUME;
  const usingRealResume = previewResume !== SAMPLE_RESUME;

  const baseTemplate = initialConfig?.baseTemplate ?? DEFAULT_RESUME_TEMPLATE;

  const updateConfig = useCallback(
    (updater: (prev: CustomTemplateConfig) => CustomTemplateConfig) => {
      setConfig((prev) => {
        const next = updater(prev);
        return {
          ...next,
          updatedAt: new Date().toISOString(),
        };
      });
    },
    [],
  );

  const handleSave = useCallback(() => {
    const next: CustomTemplateConfig = {
      ...config,
      name,
      baseTemplate,
      updatedAt: new Date().toISOString(),
    };
    setSaving(true);
    const ok = saveCustomTemplate(next);
    setSaving(false);
    if (ok) {
      router.push(`/templates/${next.id}`);
    }
    return ok;
  }, [config, name, baseTemplate, router]);

  const handleReset = useCallback(() => {
    const reset = createDefaultCustomTemplate(
      config.id,
      name,
      config.baseTemplate,
    );
    setConfig(reset);
    setName(reset.name);
  }, [config.id, config.baseTemplate, name]);

  const previewSections = useMemo(() => {
    const defaultOrder: ResumeSectionId[] = [
      "summary",
      "skills",
      "experience",
      "projects",
      "education",
    ];
    const order =
      config.sections.sectionOrder.length === defaultOrder.length &&
      config.sections.sectionOrder.every((id, i) => id === defaultOrder[i])
        ? defaultOrder
        : config.sections.sectionOrder;
    return order.filter((id) => config.sections.sectionVisibility[id] ?? true);
  }, [config.sections]);

  return (
    <div className="flex min-w-0 flex-col">
      {/* Top toolbar */}
      <header className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b border-line bg-background/90 backdrop-blur-md px-4 py-4 sm:px-6 sticky top-[72px] z-30">
        <div className="flex flex-wrap items-center gap-3">
          <label className="text-[11px] font-medium text-muted">Template name</label>
          <input
            value={name}
            onChange={(event) => setName(event.target.value)}
            className="h-9 rounded-[22px] border border-line bg-card px-3.5 text-sm font-medium text-ink transition-colors focus:border-primary focus:ring-2 focus:ring-ring/20 focus:outline-none"
          />
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setPreviewMode((value) => !value)}
            aria-pressed={previewMode}
            className="inline-flex h-9 items-center gap-1.5 rounded-[22px] border border-line bg-card px-3 text-[11px] font-medium text-ink transition-colors hover:bg-accent-soft/50 focus-visible:ring-2 focus-visible:ring-ring/40 focus-visible:outline-none"
          >
            {previewMode ? "Exit preview" : "Preview"}
          </button>
          <button
            type="button"
            onClick={handleReset}
            className="inline-flex h-9 items-center gap-1.5 rounded-[22px] border border-line bg-card px-3 text-[11px] font-medium text-muted transition-colors hover:bg-accent-soft/50 focus-visible:ring-2 focus-visible:ring-ring/40 focus-visible:outline-none"
          >
            <ArrowRightIcon className="h-3.5 w-3.5" /> Reset
          </button>
          <button
            type="button"
            onClick={handleSave}
            disabled={saving}
            className="inline-flex h-9 items-center gap-1.5 rounded-full bg-accent px-3.5 text-[11px] font-medium text-accent-foreground transition-colors hover:bg-accent-strong disabled:opacity-60 focus-visible:ring-2 focus-visible:ring-ring/40 focus-visible:outline-none"
          >
            {saving ? "Saving…" : (
              <>
                <CheckIcon className="h-3.5 w-3.5" />Save template
              </>
            )}
          </button>
        </div>
      </header>

      <div className="flex min-w-0 flex-col lg:flex-row">
        {/* Left panel: controls */}
        {previewMode ? null : (
          <aside
            className="min-w-0 border-b border-line bg-card p-6 sm:p-8 lg:w-[360px] lg:shrink-0 lg:overflow-y-auto lg:border-b-0 lg:border-r xl:w-[400px]"
          >
            <div className="space-y-6">
              <TypographyControls
                config={config.typography}
                onChange={(updates) =>
                  updateConfig((prev) => ({ ...prev, typography: { ...prev.typography, ...updates } }))
                }
              />
              <ColorControls
                config={config.colors}
                onChange={(updates) =>
                  updateConfig((prev) => ({ ...prev, colors: { ...prev.colors, ...updates } }))
                }
              />
              <LayoutControls
                config={config.layout}
                onChange={(updates) =>
                  updateConfig((prev) => ({ ...prev, layout: { ...prev.layout, ...updates } }))
                }
              />
              <SectionControls
                config={config.sections}
                onChange={(updater) =>
                  updateConfig((prev) => ({
                    ...prev,
                    sections: updater(prev.sections),
                  }))
                }
              />
            </div>
          </aside>
        )}

        {/* Right panel: live preview */}
        <main className="min-w-0 flex-1 bg-background p-4 sm:p-6 lg:p-8">
          <div className="mx-auto w-full max-w-full">
            <div
              className="mx-auto rounded-[32px] border border-line bg-card shadow-[0_30px_60px_-30px_rgba(27,33,29,0.35)] overflow-hidden"
              style={{
                width:
                  config.layout.pageSize === "US Letter"
                    ? "8.5in"
                    : "210mm",
                maxWidth: "100%",
                backgroundColor: config.colors.pageBackground,
              }}
            >
              <CustomTemplateRenderer
                resume={previewResume}
                config={config}
                sectionOrder={previewSections}
                pagePadding={previewPagePadding(config.layout.pageMargins)}
              />
            </div>
            <p className="mt-4 text-[11px] text-muted text-center">
              {usingRealResume
                ? "Preview uses your current resume content. Applying this template never changes the text."
                : "Preview uses realistic sample data. Your actual resume content is preserved when you apply this template."}
            </p>
          </div>
        </main>
      </div>
    </div>
  );
}
