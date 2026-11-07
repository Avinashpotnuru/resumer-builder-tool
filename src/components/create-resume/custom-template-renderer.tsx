"use client";

import React, { type ReactNode } from "react";

import {
  contactItems,
  displayName,
  displayRole,
  formatDateRange,
  splitDescription,
} from "@/components/create-resume/resume-templates";
import {
  pageMarginCss,
  type CustomTemplateConfig,
} from "@/lib/resume/custom-template";
import type {
  EditorResumeData,
  ExperienceItem,
  EducationItem,
  ProjectItem,
  ResumeSectionId,
} from "@/lib/resume/editor-store";

/**
 * CustomTemplateRenderer renders a resume using a user-created
 * CustomTemplateConfig. Design tokens (typography, colors, layout, sections)
 * are applied as CSS custom properties on the document container, so every
 * element below inherits the user's chosen design without hardcoding
 * per-template classes.
 *
 * Resume content is never modified — only the visual presentation changes.
 */

/* ------------------------------------------------------------------ */
/* Style helpers                                                      */
/* ------------------------------------------------------------------ */

function marginValue(layout: CustomTemplateConfig["layout"]): string {
  return pageMarginCss(layout.pageMargins);
}

function sectionsContainerStyle(
  layout: CustomTemplateConfig["layout"],
): React.CSSProperties {
  if (layout.columnCount === 2) {
    return {
      display: "grid",
      gridTemplateColumns: "minmax(0, 1fr) minmax(0, 1fr)",
      columnGap: layout.contentSpacing,
      rowGap: layout.sectionSpacing,
      alignItems: "start",
    };
  }

  return {
    display: "flex",
    flexDirection: "column",
    gap: layout.sectionSpacing,
  };
}

function sectionHeadingText(
  config: CustomTemplateConfig,
  id: ResumeSectionId,
  fallback: string,
): string | null {
  if (!config.sections.showSectionHeadings) return null;
  const override = config.sections.sectionHeadings[id]?.trim();
  return override || fallback;
}

function letterSpacing(value: CustomTemplateConfig["typography"]["letterSpacing"]): string {
  switch (value) {
    case "tight":
      return "-0.02em";
    case "wide":
      return "0.05em";
    case "normal":
    default:
      return "normal";
  }
}

/* ------------------------------------------------------------------ */
/* Primitives                                                         */
/* ------------------------------------------------------------------ */

function BulletLine({ children }: { children: string }) {
  return (
    <li className="flex gap-1.5">
      <span
        aria-hidden="true"
        className="mt-[7px] h-1 w-1 shrink-0 rounded-full bg-current/60"
      />
      <span>{children}</span>
    </li>
  );
}

function SectionHeading({
  children,
  config,
}: {
  children: string;
  config: CustomTemplateConfig;
}) {
  return (
    <div className="flex items-center gap-2">
      {config.layout.dividerVisibility ? (
        <span
          aria-hidden="true"
          className="h-3 w-0.5 shrink-0 rounded-full bg-current"
          style={{
            backgroundColor: "var(--ct-divider-color)",
          }}
        />
      ) : null}
      <h2
        className="text-base font-semibold leading-tight"
        style={{
          fontSize: "var(--ct-heading-font-size)",
          fontWeight: "var(--ct-font-weight)",
          letterSpacing: "var(--ct-letter-spacing)",
          color: "var(--ct-heading-color)",
          margin: 0,
        }}
      >
        {children}
      </h2>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Entry renderers                                                    */
/* ------------------------------------------------------------------ */

function ExperienceEntry({
  item,
}: {
  item: ExperienceItem;
}) {
  const dateRange = formatDateRange(
    item.startDate,
    item.isCurrent ? "Present" : item.endDate,
  );
  const { prose, bullets } = splitDescription(item.description);
  const achievements = item.achievements
    .map((a) => a.replace(/^[•▪▫‣⁃]\s*/, ""))
    .filter(Boolean);
  const meta = [item.employmentType, item.location]
    .filter(Boolean)
    .join(" · ");

  return (
    <article className="break-inside-avoid">
      <div className="flex flex-col gap-0.5 sm:flex-row sm:items-baseline sm:justify-between sm:gap-4">
        <h3
          className="min-w-0 text-sm font-semibold leading-[1.4]"
          style={{
            fontSize: "var(--ct-entry-title-size)",
            fontWeight: "var(--ct-font-weight)",
            color: "var(--ct-text)",
            margin: 0,
          }}
        >
          {item.jobTitle.trim() || "Untitled role"}
        </h3>
        {dateRange ? (
          <p
            className="shrink-0 text-xs leading-[1.45]"
            style={{
              color: "var(--ct-muted-text)",
              margin: 0,
            }}
          >
            {dateRange}
          </p>
        ) : null}
      </div>

      {item.companyName.trim() || meta ? (
        <p className="text-xs italic leading-[1.45]" style={{ color: "var(--ct-muted-text)", margin: 0 }}>
          {[item.companyName.trim(), meta].filter(Boolean).join(" · ")}
        </p>
      ) : null}

      {prose.length > 0 ? (
        <p className="mt-1 whitespace-pre-line text-sm leading-[1.55]" style={{ color: "var(--ct-text)", margin: 0 }}>
          {prose.join("\n")}
        </p>
      ) : null}

      {bullets.length > 0 || achievements.length > 0 ? (
        <ul className="mt-1.5 space-y-1" style={{ paddingLeft: "1.25rem", margin: 0 }}>
          {[...bullets, ...achievements].map((line, index) => (
            <BulletLine key={`${item.id}-bullet-${index}`}>{line}</BulletLine>
          ))}
        </ul>
      ) : null}
    </article>
  );
}

function ProjectEntry({
  item,
}: {
  item: ProjectItem;
}) {
  const { prose, bullets } = splitDescription(item.description);
  const technologies = item.technologies
    .map((t) => t.trim())
    .filter(Boolean);
  const links = [item.link, item.url, item.githubUrl]
    .map((v) => v?.trim())
    .filter((v): v is string => Boolean(v));
  const dateRange = formatDateRange(item.startDate ?? "", item.endDate ?? null);
  const achievements = (item.achievements ?? [])
    .map((a) => a.replace(/^[•▪▫‣⁃]\s*/, ""))
    .filter(Boolean);

  return (
    <article className="break-inside-avoid">
      <div className="flex flex-col gap-0.5 sm:flex-row sm:items-baseline sm:justify-between sm:gap-4">
        <h3
          className="min-w-0 text-sm font-semibold leading-[1.4]"
          style={{
            fontSize: "var(--ct-entry-title-size)",
            fontWeight: "var(--ct-font-weight)",
            color: "var(--ct-text)",
            margin: 0,
          }}
        >
          {item.name.trim() || "Untitled project"}
        </h3>
        {dateRange ? (
          <p
            className="shrink-0 text-xs leading-[1.45]"
            style={{ color: "var(--ct-muted-text)", margin: 0 }}
          >
            {dateRange}
          </p>
        ) : null}
      </div>

      {links.length > 0 ? (
        <p
          className="text-xs leading-[1.45] break-all"
          style={{ color: "var(--ct-muted-text)", margin: 0 }}
        >
          {links.join(" · ")}
        </p>
      ) : null}

      {technologies.length > 0 ? (
        <p className="text-xs italic leading-[1.45]" style={{ color: "var(--ct-muted-text)", margin: 0 }}>
          <span className="font-semibold">Technologies:</span>{" "}
          {technologies.join(", ")}
        </p>
      ) : null}

      {prose.length > 0 ? (
        <p className="mt-1 whitespace-pre-line text-sm leading-[1.55]" style={{ color: "var(--ct-text)", margin: 0 }}>
          {prose.join("\n")}
        </p>
      ) : null}

      {bullets.length > 0 || achievements.length > 0 ? (
        <ul className="mt-1.5 space-y-1" style={{ paddingLeft: "1.25rem", margin: 0 }}>
          {[...bullets, ...achievements].map((line, index) => (
            <BulletLine key={`${item.id}-bullet-${index}`}>{line}</BulletLine>
          ))}
        </ul>
      ) : null}
    </article>
  );
}

function EducationEntry({
  item,
}: {
  item: EducationItem;
}) {
  const qualification = [item.degree, item.fieldOfStudy]
    .map((v) => v.trim())
    .filter(Boolean)
    .join(", ");
  const dateRange = formatDateRange(item.startDate, item.endDate);
  const details = [item.location.trim(), item.grade?.trim()]
    .filter(Boolean)
    .join(" · ");

  return (
    <article className="break-inside-avoid">
      <div className="flex flex-col gap-0.5 sm:flex-row sm:items-baseline sm:justify-between sm:gap-4">
        <h3
          className="min-w-0 text-sm font-semibold leading-[1.4]"
          style={{
            fontSize: "var(--ct-entry-title-size)",
            fontWeight: "var(--ct-font-weight)",
            color: "var(--ct-text)",
            margin: 0,
          }}
        >
          {qualification || item.schoolName.trim() || "Untitled education"}
        </h3>
        {dateRange ? (
          <p
            className="shrink-0 text-xs leading-[1.45]"
            style={{ color: "var(--ct-muted-text)", margin: 0 }}
          >
            {dateRange}
          </p>
        ) : null}
      </div>

      {item.schoolName.trim() && qualification ? (
        <p className="text-xs italic leading-[1.45]" style={{ color: "var(--ct-muted-text)", margin: 0 }}>
          {item.schoolName.trim()}
        </p>
      ) : null}

      {details ? (
        <p className="text-xs leading-[1.45]" style={{ color: "var(--ct-muted-text)", margin: 0 }}>
          {details}
        </p>
      ) : null}
    </article>
  );
}

function SkillsBlock({
  skills,
}: {
  skills: string[];
}) {
  const categories = categorizeSkills(skills);

  return (
    <ul className="space-y-1" style={{ paddingLeft: 0, margin: 0, listStyle: "none" }}>
      {categories.map((category) => (
        <li key={category.label} style={{ margin: 0 }}>
          <span className="font-semibold" style={{ color: "var(--ct-text)" }}>
            {category.label}:
          </span>{" "}
          {category.items.join(", ")}
        </li>
      ))}
    </ul>
  );
}

/* ------------------------------------------------------------------ */
/* Skills categorization (local copy to avoid circular deps)          */
/* ------------------------------------------------------------------ */

function categorizeSkills(skills: string[]): Array<{
  label: string;
  items: string[];
}> {
  const categories: Record<string, string[]> = {};
  const uncategorized: string[] = [];

  for (const skill of skills) {
    const trimmed = skill.trim();
    if (!trimmed) continue;

    const colonIndex = trimmed.indexOf(":");
    if (colonIndex > 0) {
      const label = trimmed.slice(0, colonIndex).trim();
      const item = trimmed.slice(colonIndex + 1).trim();
      if (!categories[label]) categories[label] = [];
      if (item) categories[label].push(item);
    } else {
      uncategorized.push(trimmed);
    }
  }

  const result: Array<{ label: string; items: string[] }> = [];
  if (uncategorized.length > 0) {
    result.push({ label: "Skills", items: uncategorized });
  }
  for (const [label, items] of Object.entries(categories)) {
    result.push({ label, items });
  }
  return result;
}

/* ------------------------------------------------------------------ */
/* Main renderer                                                      */
/* ------------------------------------------------------------------ */

type CustomTemplateRendererProps = {
  resume: EditorResumeData;
  config: CustomTemplateConfig;
  sectionOrder?: ResumeSectionId[];
  /** Overrides the screen-only page padding; print uses `@page` margins. */
  pagePadding?: string;
};

export function CustomTemplateRenderer({
  resume,
  config,
  sectionOrder,
  pagePadding,
}: CustomTemplateRendererProps) {
  const contacts = contactItems(resume);
  const role = displayRole(resume);
  const skills = resume.skills.map((s) => s.trim()).filter(Boolean);
  const experience = resume.experience.filter(
    (item) =>
      item.jobTitle.trim() ||
      item.companyName.trim() ||
      item.description.trim() ||
      item.achievements.some((a) => a.trim()),
  );
  const projects = resume.projects.filter(
    (item) =>
      item.name.trim() ||
      item.description.trim() ||
      item.technologies.some((t) => t.trim()) ||
      Boolean(item.link?.trim()) ||
      Boolean(item.url?.trim()) ||
      Boolean(item.githubUrl?.trim()),
  );
  const education = resume.education.filter(
    (item) =>
      item.schoolName.trim() || item.degree.trim() || item.fieldOfStudy.trim(),
  );
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

  const labels: Record<ResumeSectionId, string | null> = {
    summary: sectionHeadingText(config, "summary", "Professional Summary"),
    skills: sectionHeadingText(config, "skills", "Skills"),
    experience: sectionHeadingText(config, "experience", "Work Experience"),
    projects: sectionHeadingText(config, "projects", "Projects"),
    education: sectionHeadingText(config, "education", "Education"),
  };

  const sections: Record<ResumeSectionId, ReactNode> = {
    summary:
      resume.professionalSummary?.trim() ? (
        <section key="summary">
          {labels.summary ? (
            <SectionHeading config={config}>{labels.summary}</SectionHeading>
          ) : null}
          <p
            className="mt-1.5 whitespace-pre-line text-sm leading-[1.55]"
            style={{
              fontSize: "var(--ct-body-font-size)",
              lineHeight: "var(--ct-line-height)",
              color: "var(--ct-text)",
              margin: 0,
            }}
          >
            {resume.professionalSummary}
          </p>
        </section>
      ) : null,
    skills:
      skills.length > 0 ? (
        <section key="skills">
          {labels.skills ? (
            <SectionHeading config={config}>{labels.skills}</SectionHeading>
          ) : null}
          <div className="mt-1.5">
            <SkillsBlock skills={skills} />
          </div>
        </section>
      ) : null,
    experience:
      experience.length > 0 ? (
        <section key="experience">
          {labels.experience ? (
            <SectionHeading config={config}>{labels.experience}</SectionHeading>
          ) : null}
          <div className="mt-2 space-y-3.5">
            {experience.map((item) => (
              <ExperienceEntry key={item.id} item={item} />
            ))}
          </div>
        </section>
      ) : null,
    projects:
      projects.length > 0 ? (
        <section key="projects">
          {labels.projects ? (
            <SectionHeading config={config}>{labels.projects}</SectionHeading>
          ) : null}
          <div className="mt-2 space-y-3.5">
            {projects.map((item) => (
              <ProjectEntry key={item.id} item={item} />
            ))}
          </div>
        </section>
      ) : null,
    education:
      education.length > 0 ? (
        <section key="education">
          {labels.education ? (
            <SectionHeading config={config}>{labels.education}</SectionHeading>
          ) : null}
          <div className="mt-2 space-y-3">
            {education.map((item) => (
              <EducationEntry key={item.id} item={item} />
            ))}
          </div>
        </section>
      ) : null,
  };

  const customOrder = config.sections.sectionOrder;

  const defaultOrder: ResumeSectionId[] = [
    "summary",
    "skills",
    "experience",
    "projects",
    "education",
  ];
  const fallbackOrder =
    sectionOrder && sectionOrder.length === defaultOrder.length &&
    sectionOrder.every((id, i) => id === defaultOrder[i])
      ? defaultOrder
      : (sectionOrder ?? defaultOrder);
  const order =
    customOrder.length > 0 ? customOrder : fallbackOrder;

  const visibleSections = order.filter(
    (id) => config.sections.sectionVisibility[id] ?? true,
  );

  const containerStyle = {
    fontFamily: "var(--ct-font-family)",
    fontSize: "var(--ct-body-font-size)",
    fontWeight: "var(--ct-font-weight)",
    lineHeight: "var(--ct-line-height)",
    letterSpacing: "var(--ct-letter-spacing)",
    color: "var(--ct-text)",
    backgroundColor: "var(--ct-page-bg)",
    margin: 0,
    padding: pagePadding ?? marginValue(config.layout),
    boxSizing: "border-box",
    "--ct-primary": config.colors.primary,
    "--ct-secondary": config.colors.secondary,
    "--ct-accent": config.colors.accent,
    "--ct-text": config.colors.text,
    "--ct-muted-text": config.colors.mutedText,
    "--ct-heading-color": config.colors.headingColor,
    "--ct-divider-color": config.colors.dividerColor,
    "--ct-page-bg": config.colors.pageBackground,
    "--ct-font-family": config.typography.fontFamily,
    "--ct-name-font-size": config.typography.nameFontSize,
    "--ct-heading-font-size": config.typography.headingFontSize,
    "--ct-body-font-size": config.typography.bodyFontSize,
    "--ct-font-weight": String(config.typography.fontWeight),
    "--ct-line-height": String(config.typography.lineHeight),
    "--ct-letter-spacing": letterSpacing(config.typography.letterSpacing),
    "--ct-entry-title-size": config.typography.headingFontSize,
  } as React.CSSProperties;

  return (
    <article
      data-resume-template="custom"
      className="mx-auto w-full min-w-0 break-words"
      style={containerStyle}
    >
      <header
        className="pb-5"
        style={{
          borderBottom: config.layout.dividerVisibility
            ? `1px solid var(--ct-divider-color)`
            : "none",
          paddingBottom: "0.75rem",
          textAlign: config.layout.headerAlignment,
        }}
      >
        <h1
          className="text-2xl font-bold leading-[1.1] tracking-tight"
          style={{
            fontSize: "var(--ct-name-font-size)",
            fontWeight: "var(--ct-font-weight)",
            letterSpacing: "var(--ct-letter-spacing)",
            color: "var(--ct-primary)",
            margin: 0,
          }}
        >
          {displayName(resume)}
        </h1>
        {role ? (
          <p
            className="mt-1 text-xs font-medium"
            style={{
              color: "var(--ct-secondary)",
              margin: 0,
            }}
          >
            {role}
          </p>
        ) : null}
        {contacts.length > 0 ? (
          <p
            className="mt-2 text-xs leading-[1.5]"
            style={{
              color: "var(--ct-muted-text)",
              margin: 0,
            }}
          >
            {contacts.map((contact, index) => (
              <React.Fragment key={`${contact}-${index}`}>
                {index > 0 ? <span aria-hidden="true"> · </span> : null}
                {contact}
              </React.Fragment>
            ))}
          </p>
        ) : null}
      </header>

      <div
        className="mt-5"
        style={{
          marginTop: config.layout.sectionSpacing,
          ...sectionsContainerStyle(config.layout),
        }}
      >
        {visibleSections.map((sectionId) => (
          <React.Fragment key={sectionId}>{sections[sectionId]}</React.Fragment>
        ))}

        {certifications.length > 0 ? (
          <section className="break-inside-avoid">
            {config.sections.showSectionHeadings ? (
              <SectionHeading config={config}>Certifications</SectionHeading>
            ) : null}
            <div className="mt-2 space-y-2">
              {certifications.map((item) => (
                <article key={item.id} className="break-inside-avoid">
                  <div className="flex flex-col gap-0.5 sm:flex-row sm:items-baseline sm:justify-between sm:gap-4">
                    <h3
                      className="min-w-0 text-sm font-semibold leading-[1.4]"
                      style={{
                        fontSize: "var(--ct-entry-title-size)",
                        fontWeight: "var(--ct-font-weight)",
                        color: "var(--ct-text)",
                        margin: 0,
                      }}
                    >
                      {item.name.trim() || "Untitled certification"}
                    </h3>
                    {item.issueDate.trim() || item.expirationDate.trim() ? (
                      <p
                        className="shrink-0 text-xs leading-[1.45]"
                        style={{ color: "var(--ct-muted-text)", margin: 0 }}
                      >
                        {[item.issueDate.trim(), item.expirationDate.trim()]
                          .filter(Boolean)
                          .join(" – ")}
                      </p>
                    ) : null}
                  </div>
                  {item.issuer.trim() ? (
                    <p className="text-xs italic leading-[1.45]" style={{ color: "var(--ct-muted-text)", margin: 0 }}>
                      {item.issuer.trim()}
                    </p>
                  ) : null}
                  {item.credentialUrl.trim() ? (
                    <p
                      className="text-xs leading-[1.45] break-all"
                      style={{ color: "var(--ct-muted-text)", margin: 0 }}
                    >
                      {item.credentialUrl.trim()}
                    </p>
                  ) : null}
                </article>
              ))}
            </div>
          </section>
        ) : null}

        {additionalSections.map((section) => (
          <section key={section.id} className="break-inside-avoid">
            {config.sections.showSectionHeadings ? (
              <SectionHeading config={config}>{section.title.trim()}</SectionHeading>
            ) : null}
            <div className="mt-2 space-y-2">
              {section.entries
                .filter(
                  (entry) => entry.title.trim() || entry.description.trim(),
                )
                .map((entry) => (
                  <article
                    key={entry.id}
                    className="break-inside-avoid"
                  >
                    <div className="flex flex-col gap-0.5 sm:flex-row sm:items-baseline sm:justify-between sm:gap-4">
                      <h3
                        className="min-w-0 text-sm font-semibold leading-[1.4]"
                        style={{
                          fontSize: "var(--ct-entry-title-size)",
                          fontWeight: "var(--ct-font-weight)",
                          color: "var(--ct-text)",
                          margin: 0,
                        }}
                      >
                        {entry.title.trim()}
                      </h3>
                      {entry.date.trim() ? (
                        <p
                          className="shrink-0 text-xs leading-[1.45]"
                          style={{ color: "var(--ct-muted-text)", margin: 0 }}
                        >
                          {entry.date.trim()}
                        </p>
                      ) : null}
                    </div>
                    {entry.subtitle.trim() ? (
                      <p className="text-xs italic leading-[1.45]" style={{ color: "var(--ct-muted-text)", margin: 0 }}>
                        {entry.subtitle.trim()}
                      </p>
                    ) : null}
                    {entry.description.trim() ? (
                      <p
                        className="text-sm leading-[1.55]"
                        style={{ color: "var(--ct-text)", margin: 0 }}
                      >
                        {entry.description.trim()}
                      </p>
                    ) : null}
                    {entry.url.trim() ? (
                      <p
                        className="text-xs leading-[1.45] break-all"
                        style={{ color: "var(--ct-muted-text)", margin: 0 }}
                      >
                        {entry.url.trim()}
                      </p>
                    ) : null}
                  </article>
                ))}
            </div>
          </section>
        ))}

        {resume.coverLetter?.trim() ? (
          <section className="break-inside-avoid">
            {config.sections.showSectionHeadings ? (
              <SectionHeading config={config}>Cover Letter</SectionHeading>
            ) : null}
            <p
              className="mt-1.5 whitespace-pre-line text-sm leading-[1.55]"
              style={{
                fontSize: "var(--ct-body-font-size)",
                lineHeight: "var(--ct-line-height)",
                color: "var(--ct-text)",
                margin: 0,
              }}
            >
              {resume.coverLetter.trim()}
            </p>
          </section>
        ) : null}
      </div>
    </article>
  );
}
