import {
  AlignmentType,
  BorderStyle,
  Document,
  Packer,
  Paragraph,
  Tab,
  TabStopType,
  TextRun,
} from "docx";

import type {
  AdditionalSection,
  AnyTemplateId,
  CertificationItem,
  EditorResumeData,
  EducationItem,
  ExperienceItem,
  ProjectItem,
  ResumeSectionId,
  ResumeTemplateId,
} from "./editor-store";
import { DEFAULT_RESUME_TEMPLATE, RESUME_SECTION_LABELS } from "./editor-store";
import { isCustomTemplateId } from "./template-catalog";
import type {
  CustomTemplateConfig,
  TemplateLayout as CustomTemplateLayout,
} from "./custom-template";
import { categorizeSkills } from "./categorize-skills";
import { isBulletLine, stripBulletMarker } from "./bullet-text";

const COLORS = {
  ink: "1B1A17",
  body: "3F3D38",
  muted: "6B6860",
  line: "E6E2D9",
  accent: "2F6B57",
  black: "000000",
};

const PAGE_WIDTH = 11906;
const PAGE_HEIGHT = 16838;
const STANDARD_PAGE_MARGIN = 900;
const PROFESSIONAL_PAGE_MARGIN = 720;
const STANDARD_CONTENT_WIDTH = PAGE_WIDTH - STANDARD_PAGE_MARGIN * 2;

const BODY_SIZE = 21;
const SECTION_HEADING_SIZE = 20;
const ENTRY_TITLE_SIZE = 22;
const META_SIZE = 19;
const TITLE_SIZE = 44;

type TemplateLayout = "classic" | "modern" | "professional";

type TemplateFormat = {
  layout: TemplateLayout;
  margin: number;
  contentWidth: number;
  bodySize: number;
  sectionHeadingSize: number;
  entryTitleSize: number;
  metaSize: number;
  titleSize: number;
  headerAlignment: (typeof AlignmentType)[keyof typeof AlignmentType];
  headerBorderTarget: "label" | "title" | "none";
  headerBorderColor: string;
  headerBorderSize: number;
  headerLabelColor: string;
  headerLabelSize: number;
  titleColor: string;
  headingColor: string;
  headingBorder: boolean;
  bodyColor: string;
  entryTitleColor: string;
  entrySubtitleColor: string;
  /** Optional override for heading capitalization; defaults by layout. */
  uppercaseHeadings?: boolean;
};

const TEMPLATE_FORMATS: Record<ResumeTemplateId, TemplateFormat> = {
  "professional-classic": {
    layout: "professional",
    margin: PROFESSIONAL_PAGE_MARGIN,
    contentWidth: PAGE_WIDTH - PROFESSIONAL_PAGE_MARGIN * 2,
    bodySize: 22,
    sectionHeadingSize: 28,
    entryTitleSize: 23,
    metaSize: 19,
    titleSize: 52,
    headerAlignment: AlignmentType.CENTER,
    headerBorderTarget: "none",
    headerBorderColor: COLORS.black,
    headerBorderSize: 0,
    headerLabelColor: COLORS.black,
    headerLabelSize: 18,
    titleColor: COLORS.black,
    headingColor: COLORS.black,
    headingBorder: false,
    bodyColor: COLORS.black,
    entryTitleColor: COLORS.black,
    entrySubtitleColor: COLORS.black,
  },
  "modern-ats": {
    layout: "modern",
    margin: STANDARD_PAGE_MARGIN,
    contentWidth: STANDARD_CONTENT_WIDTH,
    bodySize: BODY_SIZE,
    sectionHeadingSize: SECTION_HEADING_SIZE,
    entryTitleSize: ENTRY_TITLE_SIZE,
    metaSize: META_SIZE,
    titleSize: TITLE_SIZE,
    headerAlignment: AlignmentType.LEFT,
    headerBorderTarget: "title",
    headerBorderColor: COLORS.line,
    headerBorderSize: 6,
    headerLabelColor: COLORS.accent,
    headerLabelSize: 18,
    titleColor: COLORS.ink,
    headingColor: COLORS.accent,
    headingBorder: false,
    bodyColor: COLORS.body,
    entryTitleColor: COLORS.ink,
    entrySubtitleColor: COLORS.accent,
  },
  "compact-ats": {
    layout: "modern",
    margin: 760,
    contentWidth: PAGE_WIDTH - 760 * 2,
    bodySize: 19,
    sectionHeadingSize: 18,
    entryTitleSize: 21,
    metaSize: 17,
    titleSize: 40,
    headerAlignment: AlignmentType.LEFT,
    headerBorderTarget: "title",
    headerBorderColor: COLORS.ink,
    headerBorderSize: 8,
    headerLabelColor: COLORS.muted,
    headerLabelSize: 16,
    titleColor: COLORS.ink,
    headingColor: COLORS.ink,
    headingBorder: true,
    bodyColor: COLORS.body,
    entryTitleColor: COLORS.ink,
    entrySubtitleColor: COLORS.muted,
  },
  "technical-ats": {
    layout: "modern",
    margin: STANDARD_PAGE_MARGIN,
    contentWidth: STANDARD_CONTENT_WIDTH,
    bodySize: 21,
    sectionHeadingSize: 19,
    entryTitleSize: 22,
    metaSize: 18,
    titleSize: 46,
    headerAlignment: AlignmentType.LEFT,
    headerBorderTarget: "title",
    headerBorderColor: COLORS.ink,
    headerBorderSize: 4,
    headerLabelColor: "2B4C7E",
    headerLabelSize: 17,
    titleColor: "1F3A5F",
    headingColor: "2B4C7E",
    headingBorder: true,
    bodyColor: COLORS.body,
    entryTitleColor: "1F3A5F",
    entrySubtitleColor: "2B4C7E",
  },
  "minimal-ats": {
    layout: "modern",
    margin: 1080,
    contentWidth: PAGE_WIDTH - 1080 * 2,
    bodySize: 21,
    sectionHeadingSize: 18,
    entryTitleSize: 22,
    metaSize: 18,
    titleSize: 40,
    headerAlignment: AlignmentType.LEFT,
    headerBorderTarget: "none",
    headerBorderColor: COLORS.line,
    headerBorderSize: 0,
    headerLabelColor: COLORS.muted,
    headerLabelSize: 17,
    titleColor: COLORS.ink,
    headingColor: COLORS.muted,
    headingBorder: false,
    bodyColor: COLORS.body,
    entryTitleColor: COLORS.ink,
    entrySubtitleColor: COLORS.muted,
  },
  "entry-level-ats": {
    layout: "classic",
    margin: STANDARD_PAGE_MARGIN,
    contentWidth: STANDARD_CONTENT_WIDTH,
    bodySize: 21,
    sectionHeadingSize: 20,
    entryTitleSize: 22,
    metaSize: 18,
    titleSize: 46,
    headerAlignment: AlignmentType.CENTER,
    headerBorderTarget: "label",
    headerBorderColor: COLORS.line,
    headerBorderSize: 6,
    headerLabelColor: "8A5A2B",
    headerLabelSize: 18,
    titleColor: COLORS.ink,
    headingColor: "8A5A2B",
    headingBorder: true,
    bodyColor: COLORS.body,
    entryTitleColor: COLORS.ink,
    entrySubtitleColor: "8A5A2B",
  },
  "executive-ats": {
    layout: "professional",
    margin: 1080,
    contentWidth: PAGE_WIDTH - 1080 * 2,
    bodySize: 22,
    sectionHeadingSize: 26,
    entryTitleSize: 23,
    metaSize: 19,
    titleSize: 54,
    headerAlignment: AlignmentType.CENTER,
    headerBorderTarget: "none",
    headerBorderColor: COLORS.ink,
    headerBorderSize: 0,
    headerLabelColor: "3D2F2A",
    headerLabelSize: 18,
    titleColor: "3D2F2A",
    headingColor: "3D2F2A",
    headingBorder: false,
    bodyColor: COLORS.body,
    entryTitleColor: "3D2F2A",
    entrySubtitleColor: COLORS.body,
  },
  "project-focused-ats": {
    layout: "modern",
    margin: STANDARD_PAGE_MARGIN,
    contentWidth: STANDARD_CONTENT_WIDTH,
    bodySize: 21,
    sectionHeadingSize: 20,
    entryTitleSize: 22,
    metaSize: 18,
    titleSize: 46,
    headerAlignment: AlignmentType.LEFT,
    headerBorderTarget: "title",
    headerBorderColor: "5B3B6B",
    headerBorderSize: 8,
    headerLabelColor: "5B3B6B",
    headerLabelSize: 17,
    titleColor: COLORS.ink,
    headingColor: "5B3B6B",
    headingBorder: true,
    bodyColor: COLORS.body,
    entryTitleColor: COLORS.ink,
    entrySubtitleColor: "5B3B6B",
  },
};

/* ------------------------------------------------------------------ */
/* Custom template → DOCX format                                      */
/* ------------------------------------------------------------------ */

function normalizeHexColor(value: string, fallback: string): string {
  const cleaned = value.replace(/^#/, "").trim();

  if (/^[0-9a-fA-F]{3}$/.test(cleaned)) {
    return cleaned
      .split("")
      .map((character) => `${character}${character}`)
      .join("")
      .toUpperCase();
  }

  return /^[0-9a-fA-F]{6}$/.test(cleaned)
    ? cleaned.toUpperCase()
    : fallback;
}

function pxToHalfPoints(value: string, fallback: number): number {
  const parsed = Number.parseFloat(value);
  return Number.isFinite(parsed) && parsed > 0
    ? Math.round(parsed * 1.5)
    : fallback;
}

function marginToTwips(value: CustomTemplateLayout["pageMargins"]): number {
  switch (value) {
    case "narrow":
      return 1080; // 0.75in
    case "wide":
      return 1800; // 1.25in
    case "standard":
    default:
      return STANDARD_PAGE_MARGIN;
  }
}

function formatFromCustomConfig(config: CustomTemplateConfig): TemplateFormat {
  const margin = marginToTwips(config.layout.pageMargins);
  const bodySize = pxToHalfPoints(config.typography.bodyFontSize, BODY_SIZE);
  const headingSize = pxToHalfPoints(
    config.typography.headingFontSize,
    SECTION_HEADING_SIZE,
  );
  const titleSize = pxToHalfPoints(config.typography.nameFontSize, TITLE_SIZE);
  const dividerColor = normalizeHexColor(config.colors.dividerColor, COLORS.line);

  return {
    layout: "modern",
    margin,
    contentWidth: PAGE_WIDTH - margin * 2,
    bodySize,
    sectionHeadingSize: headingSize,
    entryTitleSize: headingSize,
    metaSize: Math.max(bodySize - 1, 14),
    titleSize,
    headerAlignment:
      config.layout.headerAlignment === "center"
        ? AlignmentType.CENTER
        : AlignmentType.LEFT,
    headerBorderTarget: config.layout.dividerVisibility ? "title" : "none",
    headerBorderColor: dividerColor,
    headerBorderSize: config.layout.dividerVisibility ? 6 : 0,
    headerLabelColor: normalizeHexColor(config.colors.accent, COLORS.accent),
    headerLabelSize: Math.max(bodySize - 2, 14),
    titleColor: normalizeHexColor(config.colors.primary, COLORS.ink),
    headingColor: normalizeHexColor(config.colors.headingColor, COLORS.ink),
    headingBorder: config.layout.dividerVisibility,
    bodyColor: normalizeHexColor(config.colors.text, COLORS.body),
    entryTitleColor: normalizeHexColor(config.colors.text, COLORS.ink),
    entrySubtitleColor: normalizeHexColor(
      config.colors.secondary,
      COLORS.muted,
    ),
    uppercaseHeadings: false,
  };
}

function resolveFormat(
  template: AnyTemplateId,
  customConfig: CustomTemplateConfig | null | undefined,
): TemplateFormat {
  if (isCustomTemplateId(template) && customConfig) {
    return formatFromCustomConfig(customConfig);
  }

  if (template in TEMPLATE_FORMATS) {
    return TEMPLATE_FORMATS[template as ResumeTemplateId];
  }

  return TEMPLATE_FORMATS[DEFAULT_RESUME_TEMPLATE];
}

function formatDateRange(startDate: string, endDate: string | null): string {
  const start = startDate.trim();
  const end = endDate?.trim() ?? "";

  if (start && end) return `${start} – ${end}`;
  return start || end;
}

function displayName(resume: EditorResumeData): string {
  return (
    resume.personalInfo?.fullName?.trim() ||
    resume.jobTitle?.trim() ||
    "Resume"
  );
}

function displayRole(resume: EditorResumeData): string {
  return resume.personalInfo?.professionalTitle?.trim() ?? "";
}

function contactLine(resume: EditorResumeData): string {
  const info = resume.personalInfo;
  if (!info) return "";

  const location = [info.city, info.state, info.country]
    .map((value) => value.trim())
    .filter(Boolean)
    .join(", ");

  return [
    info.email,
    info.phone,
    location,
    info.linkedin,
    info.github,
    info.portfolio,
    info.website,
  ]
    .map((value) => value?.trim())
    .filter((value): value is string => Boolean(value))
    .join("  ·  ");
}

function isImpactful(text: string): boolean {
  return /\d/.test(text);
}

function bodyParagraph(text: string, format: TemplateFormat): Paragraph {
  return new Paragraph({
    children: [
      new TextRun({ text, size: format.bodySize, color: format.bodyColor }),
    ],
    spacing: { after: 60, line: 264 },
    keepLines: true,
  });
}

function bodyParagraphs(text: string, format: TemplateFormat): Paragraph[] {
  return text
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => bodyParagraph(line, format));
}

function bulletParagraph(
  text: string,
  format: TemplateFormat,
  bold = false,
): Paragraph {
  return new Paragraph({
    children: [
      new TextRun({
        text,
        size: format.bodySize,
        color: format.bodyColor,
        bold,
      }),
    ],
    bullet: { level: 0 },
    spacing: { after: 40, line: 264 },
    keepLines: true,
  });
}

function sectionHeading(
  label: string,
  format: TemplateFormat,
): Paragraph {
  const professional = format.layout === "professional";
  const uppercase = format.uppercaseHeadings ?? !professional;

  return new Paragraph({
    children: [
      new TextRun({
        text: uppercase ? label.toUpperCase() : label,
        bold: true,
        allCaps: uppercase,
        size: format.sectionHeadingSize,
        color: format.headingColor,
        characterSpacing: professional ? 0 : 30,
      }),
    ],
    spacing: { before: professional ? 220 : 280, after: professional ? 80 : 100 },
    keepNext: true,
    border: format.headingBorder
      ? {
          bottom: {
            style: BorderStyle.SINGLE,
            size: 6,
            color: COLORS.line,
            space: 4,
          },
        }
      : undefined,
  });
}

function entryHeading(
  title: string,
  meta: string,
  format: TemplateFormat,
): Paragraph {
  const children = [
    new TextRun({
      text: title,
      bold: true,
      size: format.entryTitleSize,
      color: format.entryTitleColor,
    }),
  ];

  if (meta) {
    children.push(new TextRun({ children: [new Tab()] }));
    children.push(
      new TextRun({ text: meta, size: format.metaSize, color: format.bodyColor === COLORS.black ? COLORS.black : COLORS.muted }),
    );
  }

  return new Paragraph({
    children,
    tabStops: meta
      ? [{ type: TabStopType.RIGHT, position: format.contentWidth }]
      : undefined,
    spacing: { before: 220, after: 30, line: 252 },
    keepNext: true,
  });
}

function subtitleParagraph(
  text: string,
  format: TemplateFormat,
  italic = format.layout === "professional",
): Paragraph {
  return new Paragraph({
    children: [
      new TextRun({
        text,
        size: format.bodySize,
        color: format.entrySubtitleColor,
        italics: italic,
      }),
    ],
    spacing: { after: 60, line: 252 },
    keepNext: true,
  });
}

function boldTitleParagraph(title: string, format: TemplateFormat): Paragraph {
  return new Paragraph({
    children: [
      new TextRun({
        text: title,
        bold: true,
        size: format.entryTitleSize,
        color: format.entryTitleColor,
      }),
    ],
    spacing: { before: 200, after: 20, line: 252 },
    keepNext: true,
  });
}

function companyLine(text: string, format: TemplateFormat): Paragraph {
  return new Paragraph({
    children: [
      new TextRun({
        text,
        size: format.bodySize,
        color: format.entrySubtitleColor,
        italics: true,
      }),
    ],
    spacing: { after: 60, line: 252 },
    keepNext: true,
  });
}

function experienceParagraphs(
  item: ExperienceItem,
  format: TemplateFormat,
): Paragraph[] {
  const dateRange = formatDateRange(
    item.startDate,
    item.isCurrent ? "Present" : item.endDate,
  );
  const jobTitle = item.jobTitle.trim() || "Untitled role";
  const employmentMeta = [item.employmentType?.trim(), item.location?.trim()]
    .filter(Boolean)
    .join(" · ");
  const paragraphs: Paragraph[] = [];

  if (format.layout === "professional") {
    paragraphs.push(boldTitleParagraph(jobTitle, format));
    const companyWithDates = [
      [item.companyName.trim(), employmentMeta].filter(Boolean).join(" · "),
      dateRange,
    ]
      .filter(Boolean)
      .join(" · ");
    if (companyWithDates) {
      paragraphs.push(companyLine(companyWithDates, format));
    }

    const descriptionBullets = item.description
      .split(/\r?\n/)
      .map(stripBulletMarker)
      .filter(Boolean);

    descriptionBullets.forEach((line) => {
      paragraphs.push(bulletParagraph(line, format, isImpactful(line)));
    });

    item.achievements
      .map(stripBulletMarker)
      .filter(Boolean)
      .forEach((achievement) =>
        paragraphs.push(bulletParagraph(achievement, format, isImpactful(achievement))),
      );

    return paragraphs;
  }

  paragraphs.push(entryHeading(jobTitle, dateRange, format));

  const subtitle = [item.companyName.trim(), employmentMeta]
    .filter(Boolean)
    .join(" · ");
  if (subtitle) {
    paragraphs.push(subtitleParagraph(subtitle, format));
  }

  if (item.description.trim()) {
    paragraphs.push(...bodyParagraphs(item.description, format));
  }

  item.achievements
    .map((achievement) => achievement.trim())
    .filter(Boolean)
    .forEach((achievement) => paragraphs.push(bulletParagraph(achievement, format)));

  return paragraphs;
}

function projectParagraphs(
  item: ProjectItem,
  format: TemplateFormat,
): Paragraph[] {
  const technologies = item.technologies
    .map((technology) => technology.trim())
    .filter(Boolean);
  const paragraphs: Paragraph[] = [];

  const dateRange = formatDateRange(item.startDate ?? "", item.endDate ?? null);
  const links = [item.url, item.link, item.githubUrl]
    .map((value) => value?.trim())
    .filter((value): value is string => Boolean(value));
  const achievements = (item.achievements ?? [])
    .map(stripBulletMarker)
    .filter(Boolean);

  if (format.layout === "professional") {
    paragraphs.push(boldTitleParagraph(item.name.trim() || "Untitled project", format));

    if (links.length > 0 || technologies.length > 0 || dateRange) {
      paragraphs.push(
        new Paragraph({
          children: [
            links.length > 0
              ? new TextRun({
                  text: links.join(" · "),
                  italics: true,
                  size: format.bodySize,
                  color: format.bodyColor,
                })
              : null,
            links.length > 0 && (technologies.length > 0 || dateRange)
              ? new TextRun({
                  text: " · ",
                  size: format.bodySize,
                  color: format.bodyColor,
                })
              : null,
            dateRange
              ? new TextRun({
                  text: dateRange,
                  italics: true,
                  size: format.bodySize,
                  color: format.bodyColor,
                })
              : null,
            dateRange && technologies.length > 0
              ? new TextRun({
                  text: " · ",
                  size: format.bodySize,
                  color: format.bodyColor,
                })
              : null,
            technologies.length > 0
              ? new TextRun({
                  text: `Technologies: ${technologies.join(", ")}`,
                  italics: true,
                  size: format.bodySize,
                  color: format.bodyColor,
                })
              : null,
          ].filter((run): run is TextRun => run !== null),
          spacing: { after: 60, line: 252 },
          keepNext: true,
        }),
      );
    }

    const lines = item.description
      .split(/\r?\n/)
      .map((line) => line.trim())
      .filter(Boolean);
    const hasExplicitBullets = lines.some(isBulletLine);

    lines.forEach((line, lineIndex) => {
      if (!hasExplicitBullets && lineIndex > 0) {
        const text = stripBulletMarker(line);
        paragraphs.push(bulletParagraph(text, format, isImpactful(text)));
      } else if (isBulletLine(line)) {
        const text = stripBulletMarker(line);
        paragraphs.push(bulletParagraph(text, format, isImpactful(text)));
      } else {
        paragraphs.push(bodyParagraph(line, format));
      }
    });

    achievements.forEach((achievement) =>
      paragraphs.push(bulletParagraph(achievement, format, isImpactful(achievement))),
    );

    return paragraphs;
  }

  paragraphs.push(
    entryHeading(
      item.name.trim() || "Untitled project",
      links.join(" · "),
      format,
    ),
  );

  if (dateRange) {
    paragraphs.push(
      new Paragraph({
        children: [
          new TextRun({
            text: dateRange,
            size: format.metaSize,
            color: format.bodyColor === COLORS.black ? COLORS.black : COLORS.muted,
          }),
        ],
        spacing: { after: 40, line: 252 },
      }),
    );
  }

  if (item.description.trim()) {
    const descriptionLines = item.description
      .split(/\r?\n/)
      .map((line) => line.trim())
      .filter(Boolean);

    for (const line of descriptionLines) {
      if (isBulletLine(line)) {
        paragraphs.push(bulletParagraph(stripBulletMarker(line), format));
      } else {
        paragraphs.push(bodyParagraph(line, format));
      }
    }
  }

  achievements.forEach((achievement) =>
    paragraphs.push(bulletParagraph(achievement, format)),
  );

  if (technologies.length > 0) {
    paragraphs.push(
      new Paragraph({
        children: [
          new TextRun({
            text: "Technologies: ",
            bold: true,
            size: format.bodySize,
            color: format.entryTitleColor,
          }),
          new TextRun({
            text: technologies.join(", "),
            size: format.bodySize,
            color: format.bodyColor,
          }),
        ],
        spacing: { after: 60, line: 252 },
        keepLines: true,
      }),
    );
  }

  return paragraphs;
}

function educationParagraphs(
  item: EducationItem,
  format: TemplateFormat,
): Paragraph[] {
  const qualification = [item.degree, item.fieldOfStudy]
    .map((value) => value.trim())
    .filter(Boolean)
    .join(", ");
  const dateRange = formatDateRange(item.startDate, item.endDate);
  const paragraphs: Paragraph[] = [];

  if (format.layout === "professional") {
    paragraphs.push(boldTitleParagraph(qualification || item.schoolName.trim() || "Untitled education", format));

    if (item.schoolName.trim()) {
      paragraphs.push(subtitleParagraph(item.schoolName, format, false));
    }

    const graduation = item.endDate?.trim() || item.startDate.trim();
    const grade = item.grade?.trim();
    if (item.location.trim() || graduation || grade) {
      paragraphs.push(
        new Paragraph({
          children: [
            new TextRun({
              text: [item.location.trim(), grade, graduation].filter(Boolean).join(" · "),
              size: format.bodySize,
              color: format.bodyColor,
            }),
          ],
          spacing: { after: 60, line: 252 },
          keepNext: true,
        }),
      );
    }

    return paragraphs;
  }

  paragraphs.push(
    entryHeading(
      qualification || item.schoolName.trim() || "Untitled education",
      dateRange,
      format,
    ),
  );

  if (qualification && item.schoolName.trim()) {
    paragraphs.push(subtitleParagraph(item.schoolName, format));
  }

  const grade = item.grade?.trim();
  if (item.location.trim() || grade) {
    paragraphs.push(
      new Paragraph({
        children: [
          new TextRun({
            text: [item.location.trim(), grade].filter(Boolean).join(" · "),
            size: format.metaSize,
            color: format.bodyColor === COLORS.black ? COLORS.black : COLORS.muted,
          }),
        ],
        spacing: { after: 60, line: 252 },
      }),
    );
  }

  return paragraphs;
}

function sectionParagraphs(
  resume: EditorResumeData,
  sectionId: ResumeSectionId,
  format: TemplateFormat,
  options?: { heading?: string | null; showHeading?: boolean },
): Paragraph[] {
  const showHeading = options?.showHeading ?? true;
  const headingLabel = options?.heading ?? RESUME_SECTION_LABELS[sectionId];
  const heading = showHeading ? sectionHeading(headingLabel, format) : null;
  const withHeading = (paragraphs: Paragraph[]): Paragraph[] =>
    heading ? [heading, ...paragraphs] : paragraphs;

  switch (sectionId) {
    case "summary": {
      const summary = resume.professionalSummary?.trim();
      if (!summary) return [];
      return withHeading(bodyParagraphs(summary, format));
    }

    case "skills": {
      const skills = resume.skills
        .map((skill) => skill.trim())
        .filter(Boolean);
      if (skills.length === 0) return [];

      if (format.layout === "professional") {
        const categories = categorizeSkills(skills);
        return withHeading(
          categories.map(
            (category) =>
              new Paragraph({
                children: [
                  new TextRun({
                    text: `${category.label}: `,
                    bold: true,
                    size: format.bodySize,
                    color: format.bodyColor,
                  }),
                  new TextRun({
                    text: category.items.join(", "),
                    size: format.bodySize,
                    color: format.bodyColor,
                  }),
                ],
                spacing: { after: 40, line: 264 },
                keepLines: true,
              }),
          ),
        );
      }

      return withHeading(skills.map((skill) => bulletParagraph(skill, format)));
    }

    case "experience": {
      if (resume.experience.length === 0) return [];
      return withHeading(
        resume.experience.flatMap((item) => experienceParagraphs(item, format)),
      );
    }

    case "projects": {
      if (resume.projects.length === 0) return [];
      return withHeading(
        resume.projects.flatMap((item) => projectParagraphs(item, format)),
      );
    }

    case "education": {
      if (resume.education.length === 0) return [];
      return withHeading(
        resume.education.flatMap((item) => educationParagraphs(item, format)),
      );
    }
  }
}

function certificationParagraphs(
  items: CertificationItem[],
  format: TemplateFormat,
  showHeading = true,
): Paragraph[] {
  const heading = showHeading ? sectionHeading("Certifications", format) : null;

  return [
    ...(heading ? [heading] : []),
    ...items.flatMap((item) => {
      const dateRange = [item.issueDate.trim(), item.expirationDate.trim()]
        .filter(Boolean)
        .join(" – ");
      const paragraphs = [
        entryHeading(item.name.trim() || "Untitled certification", dateRange, format),
      ];

      if (item.issuer.trim()) {
        paragraphs.push(subtitleParagraph(item.issuer.trim(), format, format.layout === "professional"));
      }

      if (item.credentialUrl.trim()) {
        paragraphs.push(
          new Paragraph({
            children: [
              new TextRun({
                text: item.credentialUrl.trim(),
                size: format.metaSize,
                color: format.bodyColor,
              }),
            ],
            spacing: { after: 60, line: 252 },
          }),
        );
      }

      return paragraphs;
    }),
  ];
}

function additionalSectionParagraphs(
  section: AdditionalSection,
  format: TemplateFormat,
  showHeading = true,
): Paragraph[] {
  const title = section.title.trim();
  if (!title) return [];

  const heading = showHeading ? sectionHeading(title, format) : null;
  const paragraphs: Paragraph[] = heading ? [heading] : [];

  for (const entry of section.entries) {
    const entryTitle = entry.title.trim();
    const entryDescription = entry.description.trim();

    if (!entryTitle && !entryDescription) continue;

    paragraphs.push(entryHeading(entryTitle || "Untitled entry", entry.date.trim(), format));

    if (entry.subtitle.trim()) {
      paragraphs.push(
        subtitleParagraph(
          entry.subtitle.trim(),
          format,
          format.layout === "professional",
        ),
      );
    }

    if (entryDescription) {
      paragraphs.push(...bodyParagraphs(entryDescription, format));
    }

    if (entry.url.trim()) {
      paragraphs.push(
        new Paragraph({
          children: [
            new TextRun({
              text: entry.url.trim(),
              size: format.metaSize,
              color: format.bodyColor,
            }),
          ],
          spacing: { after: 60, line: 252 },
        }),
      );
    }
  }

  return paragraphs.length > (heading ? 1 : 0) ? paragraphs : [];
}

function coverLetterParagraphs(
  coverLetter: string,
  format: TemplateFormat,
  showHeading = true,
): Paragraph[] {
  const heading = showHeading ? sectionHeading("Cover Letter", format) : null;

  return [
    ...(heading ? [heading] : []),
    ...coverLetter.split("\n").map((line) => {
      if (line.trim() === "") {
        return new Paragraph({
          spacing: { after: 40, line: 264 },
        });
      }
      return new Paragraph({
        children: [new TextRun({ text: line, size: format.bodySize, color: format.bodyColor })],
        spacing: { after: 60, line: 264 },
        keepLines: true,
      });
    }),
  ];
}

function headerParagraphs(
  resume: EditorResumeData,
  format: TemplateFormat,
): Paragraph[] {
  const border = {
    bottom: {
      style: BorderStyle.SINGLE,
      size: format.headerBorderSize,
      color: format.headerBorderColor,
      space: 8,
    },
  };

  const role = displayRole(resume);
  const contact = contactLine(resume);
  const professional = format.layout === "professional";

  const label = new Paragraph({
    alignment: format.headerAlignment,
    children: [
      new TextRun({
        text: "Professional resume",
        allCaps: true,
        size: 18,
        color: format.headerLabelColor,
        characterSpacing: 40,
      }),
    ],
    spacing: {
      after: format.headerBorderTarget === "label" ? 200 : 40,
      line: 240,
    },
    border: format.headerBorderTarget === "label" ? border : undefined,
  });

  const title = new Paragraph({
    alignment: format.headerAlignment,
    children: [
      new TextRun({
        text: displayName(resume),
        bold: true,
        size: format.titleSize,
        color: format.titleColor,
      }),
    ],
    spacing: {
      before: 0,
      after:
        format.headerBorderTarget === "title"
          ? 120
          : professional
            ? role || contact
              ? 40
              : 220
            : role || contact
              ? 40
              : 140,
      line: 240,
    },
    border: format.headerBorderTarget === "title" ? border : undefined,
  });

  const roleParagraph = role
    ? new Paragraph({
        alignment: format.headerAlignment,
        children: [
          new TextRun({
            text: professional ? role : role.toUpperCase(),
            bold: true,
            allCaps: !professional,
            size: format.headerLabelSize + 2,
            color: format.headerLabelColor,
            characterSpacing: professional ? 0 : 30,
          }),
        ],
        spacing: { after: contact ? 40 : 140, line: 240 },
      })
    : null;

  const contactParagraph = contact
    ? new Paragraph({
        alignment: format.headerAlignment,
        children: [
          new TextRun({
            text: contact,
            size: format.metaSize - 1,
            color: format.bodyColor,
          }),
        ],
        spacing: { after: 200, line: 252 },
        border: professional
          ? { bottom: { style: BorderStyle.SINGLE, size: 8, color: COLORS.line, space: 8 } }
          : undefined,
      })
    : null;

  if (professional) {
    return [title, roleParagraph, contactParagraph].filter(
      (paragraph): paragraph is Paragraph => paragraph !== null,
    );
  }

  return [label, title, roleParagraph, contactParagraph].filter(
    (paragraph): paragraph is Paragraph => paragraph !== null,
  );
}

export function buildResumeDocx(
  resume: EditorResumeData,
  sectionOrder: ResumeSectionId[],
  template: AnyTemplateId,
  customConfig?: CustomTemplateConfig | null,
): Document {
  const format = resolveFormat(template, customConfig);
  const usingCustom = isCustomTemplateId(template) && Boolean(customConfig);
  const showHeadings = usingCustom
    ? customConfig!.sections.showSectionHeadings
    : true;
  const orderedSections = usingCustom
    ? customConfig!.sections.sectionOrder.filter(
        (id) => customConfig!.sections.sectionVisibility[id] ?? true,
      )
    : sectionOrder;
  const certifications = (resume.certifications ?? []).filter(
    (item) => item.name.trim() || item.issuer.trim(),
  );
  const additionalSections = (resume.additionalSections ?? []).filter(
    (section) =>
      section.title.trim() &&
      section.entries.some(
        (entry) => entry.title.trim() || entry.description.trim(),
      ),
  );

  const children: Paragraph[] = [
    ...headerParagraphs(resume, format),
    ...orderedSections.flatMap((sectionId) =>
      sectionParagraphs(
        resume,
        sectionId,
        format,
        usingCustom
          ? {
              heading: customConfig!.sections.sectionHeadings[sectionId] ?? null,
              showHeading: showHeadings,
            }
          : undefined,
      ),
    ),
    ...(certifications.length > 0
      ? certificationParagraphs(certifications, format, showHeadings)
      : []),
    ...additionalSections.flatMap((section) =>
      additionalSectionParagraphs(section, format, showHeadings),
    ),
    ...(resume.coverLetter?.trim()
      ? coverLetterParagraphs(resume.coverLetter, format, showHeadings)
      : []),
  ];

  const letterSize = usingCustom && customConfig!.layout.pageSize === "US Letter";
  const pageWidth = letterSize ? 12240 : PAGE_WIDTH;
  const pageHeight = letterSize ? 15840 : PAGE_HEIGHT;

  return new Document({
    creator: "HonestCV — Resume Builder",
    title: displayName(resume),
    description: "Resume exported from HonestCV — Resume Builder",
    styles: {
      default: {
        document: {
          run: {
            font: "Calibri",
            size: BODY_SIZE,
            color: COLORS.body,
          },
          paragraph: {
            spacing: { line: 264, after: 60 },
          },
        },
      },
    },
    sections: [
      {
        properties: {
          page: {
            size: { width: pageWidth, height: pageHeight },
            margin: {
              top: 720,
              right: format.margin,
              bottom: 720,
              left: format.margin,
            },
          },
        },
        children,
      },
    ],
  });
}

function createFileName(
  resume: EditorResumeData,
  template: AnyTemplateId,
): string {
  const slug = (
    resume.personalInfo?.fullName?.trim() ||
    resume.jobTitle ||
    ""
  )
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

  return `${slug || "resume"}-${template}.docx`;
}

export async function downloadResumeDocx(
  resume: EditorResumeData,
  sectionOrder: ResumeSectionId[],
  template: AnyTemplateId,
  customConfig?: CustomTemplateConfig | null,
): Promise<void> {
  const doc = buildResumeDocx(resume, sectionOrder, template, customConfig);
  const blob = await Packer.toBlob(doc);
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");

  link.href = url;
  link.download = createFileName(resume, template);
  document.body.appendChild(link);
  link.click();
  link.remove();
  window.setTimeout(() => URL.revokeObjectURL(url), 1000);
}
