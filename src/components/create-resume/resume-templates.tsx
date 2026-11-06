import { Fragment, type ReactNode } from "react";

import type {
  EditorResumeData,
  EducationItem,
  ExperienceItem,
  ProjectItem,
  ResumeSectionId,
  ResumeTemplateId,
} from "@/lib/resume/editor-store";
import { createDefaultSectionOrder } from "@/lib/resume/editor-store";
import { categorizeSkills } from "@/lib/resume/categorize-skills";
import { isBulletLine, stripBulletMarker } from "@/lib/resume/bullet-text";

type TemplateSpec = {
  id: ResumeTemplateId;
  article: string;
  header: string;
  headerAlign: "left" | "center";
  name: string;
  role: string;
  contact: string;
  contactSeparator: string;
  sectionGap: string;
  heading: string;
  headingAccent: "none" | "bar" | "rule" | "thick";
  body: string;
  meta: string;
  entryTitle: string;
  entrySubtitle: string;
  bullets: "dots" | "dashes" | "none";
  skillsLayout: "rows" | "inline" | "columns";
  preferredOrder?: ResumeSectionId[];
};

const baseArticle =
  "mx-auto w-full min-w-0 bg-white text-black ring-1 ring-black/10";

const specs: Record<ResumeTemplateId, TemplateSpec> = {
  "professional-classic": {
    id: "professional-classic",
    article: `professional-classic-template ${baseArticle} px-6 py-8 sm:px-10 sm:py-10`,
    header: "border-b border-black/20 pb-5",
    headerAlign: "center",
    name: "text-[26px] font-bold leading-[1.1] tracking-tight text-black",
    role: "mt-1 text-[12px] font-medium text-black/80",
    contact: "mt-2 text-[10.5px] leading-[1.5] text-black/80",
    contactSeparator: " · ",
    sectionGap: "space-y-5",
    heading: "text-[13px] font-bold leading-tight text-black",
    headingAccent: "none",
    body: "text-[11px] leading-[1.55] text-black",
    meta: "text-[10.5px] leading-[1.45] text-black/80",
    entryTitle: "text-[11.5px] font-bold leading-[1.4] text-black",
    entrySubtitle: "text-[10.5px] italic leading-[1.45] text-black/90",
    bullets: "dots",
    skillsLayout: "rows",
  },
  "modern-ats": {
    id: "modern-ats",
    article: `${baseArticle} px-6 py-8 sm:px-10 sm:py-11`,
    header: "border-b border-black/15 pb-5",
    headerAlign: "left",
    name: "text-[27px] font-semibold leading-[1.05] tracking-tight text-[#1f3a2f]",
    role: "mt-1 text-[12px] font-medium text-[#2f6b57]",
    contact: "mt-2.5 text-[10.5px] leading-[1.55] text-black/70",
    contactSeparator: "  ·  ",
    sectionGap: "space-y-5",
    heading: "text-[10px] font-semibold uppercase tracking-[0.2em] text-[#2f6b57]",
    headingAccent: "bar",
    body: "text-[11px] leading-[1.58] text-black/85",
    meta: "text-[10.5px] leading-[1.45] text-black/65",
    entryTitle: "text-[12px] font-semibold leading-[1.4] text-black",
    entrySubtitle: "text-[11px] font-medium leading-[1.45] text-[#2f6b57]",
    bullets: "dots",
    skillsLayout: "columns",
  },
  "compact-ats": {
    id: "compact-ats",
    article: `${baseArticle} px-5 py-7 sm:px-8 sm:py-8`,
    header: "border-b border-black/25 pb-3.5",
    headerAlign: "left",
    name: "text-[22px] font-bold leading-[1.05] tracking-tight text-black",
    role: "mt-0.5 text-[11px] font-medium text-black/75",
    contact: "mt-1 text-[9.5px] leading-[1.45] text-black/70",
    contactSeparator: " | ",
    sectionGap: "space-y-3",
    heading: "border-b border-black/20 pb-0.5 text-[9px] font-bold uppercase tracking-[0.18em] text-black",
    headingAccent: "none",
    body: "text-[10px] leading-[1.45] text-black/85",
    meta: "text-[9.5px] leading-[1.4] text-black/65",
    entryTitle: "text-[10.5px] font-bold leading-[1.35] text-black",
    entrySubtitle: "text-[10px] leading-[1.4] text-black/75",
    bullets: "none",
    skillsLayout: "inline",
  },
  "technical-ats": {
    id: "technical-ats",
    article: `${baseArticle} px-6 py-8 sm:px-10 sm:py-10`,
    header: "border-b-2 border-[#2b4c7e] pb-4",
    headerAlign: "left",
    name: "text-[25px] font-semibold leading-[1.05] tracking-tight text-[#1f3a5f]",
    role: "mt-1 font-mono text-[11px] font-medium uppercase tracking-[0.12em] text-[#2b4c7e]",
    contact: "mt-2 font-mono text-[10px] leading-[1.55] text-black/70",
    contactSeparator: "  /  ",
    sectionGap: "space-y-4",
    heading: "font-mono text-[10px] font-bold uppercase tracking-[0.18em] text-[#2b4c7e]",
    headingAccent: "rule",
    body: "text-[10.5px] leading-[1.55] text-black/85",
    meta: "font-mono text-[9.5px] leading-[1.45] text-black/65",
    entryTitle: "text-[11.5px] font-semibold leading-[1.4] text-[#1f3a5f]",
    entrySubtitle: "font-mono text-[10px] leading-[1.45] text-[#2b4c7e]",
    bullets: "dashes",
    skillsLayout: "rows",
  },
  "minimal-ats": {
    id: "minimal-ats",
    article: `${baseArticle} px-7 py-10 sm:px-12 sm:py-12`,
    header: "pb-6",
    headerAlign: "left",
    name: "text-[27px] font-light leading-[1.05] tracking-[-0.02em] text-black",
    role: "mt-1 text-[12px] font-normal text-black/65",
    contact: "mt-3 text-[10px] leading-[1.6] text-black/60",
    contactSeparator: "   ·   ",
    sectionGap: "space-y-6",
    heading: "text-[10px] font-medium uppercase tracking-[0.24em] text-black/55",
    headingAccent: "none",
    body: "text-[11px] leading-[1.65] text-black/80",
    meta: "text-[10px] leading-[1.5] text-black/55",
    entryTitle: "text-[12px] font-medium leading-[1.45] text-black",
    entrySubtitle: "text-[10.5px] leading-[1.5] text-black/65",
    bullets: "dots",
    skillsLayout: "inline",
  },
  "entry-level-ats": {
    id: "entry-level-ats",
    article: `${baseArticle} px-6 py-8 sm:px-10 sm:py-10`,
    header: "border-b border-[#c9b8a6] pb-4",
    headerAlign: "center",
    name: "text-[25px] font-semibold leading-[1.1] tracking-tight text-[#3f2d1c]",
    role: "mt-1 text-[11.5px] font-medium text-[#8a5a2b]",
    contact: "mt-2.5 text-[10.5px] leading-[1.55] text-black/70",
    contactSeparator: " · ",
    sectionGap: "space-y-5",
    heading: "border-b border-[#e2d7c9] pb-1 text-[10px] font-bold uppercase tracking-[0.2em] text-[#8a5a2b]",
    headingAccent: "none",
    body: "text-[11px] leading-[1.58] text-black/85",
    meta: "text-[10.5px] leading-[1.45] text-black/65",
    entryTitle: "text-[12px] font-semibold leading-[1.4] text-black",
    entrySubtitle: "text-[11px] leading-[1.45] text-[#8a5a2b]",
    bullets: "dots",
    skillsLayout: "columns",
    preferredOrder: ["summary", "education", "skills", "projects", "experience"],
  },
  "executive-ats": {
    id: "executive-ats",
    article: `${baseArticle} px-7 py-10 sm:px-12 sm:py-12`,
    header: "border-b-4 border-double border-[#3d2f2a] pb-5",
    headerAlign: "center",
    name: "font-serif text-[30px] font-semibold leading-[1.05] tracking-[0.01em] text-[#3d2f2a]",
    role: "mt-1.5 text-[10px] font-semibold uppercase tracking-[0.24em] text-[#3d2f2a]",
    contact: "mt-2.5 text-[10.5px] leading-[1.55] text-black/70",
    contactSeparator: "  ·  ",
    sectionGap: "space-y-6",
    heading: "border-b border-[#3d2f2a]/30 pb-1 font-serif text-[13px] font-semibold leading-tight text-[#3d2f2a]",
    headingAccent: "none",
    body: "text-[11.5px] leading-[1.6] text-black/85",
    meta: "text-[10.5px] leading-[1.5] text-black/60",
    entryTitle: "text-[12.5px] font-semibold leading-[1.4] text-black",
    entrySubtitle: "text-[11px] italic leading-[1.45] text-[#3d2f2a]",
    bullets: "dots",
    skillsLayout: "rows",
    preferredOrder: ["summary", "skills", "experience", "projects", "education"],
  },
  "project-focused-ats": {
    id: "project-focused-ats",
    article: `${baseArticle} px-6 py-8 sm:px-10 sm:py-10`,
    header: "border-b-2 border-[#5b3b6b] pb-4",
    headerAlign: "left",
    name: "text-[25px] font-semibold leading-[1.05] tracking-tight text-[#3c2546]",
    role: "mt-1 text-[11.5px] font-medium text-[#5b3b6b]",
    contact: "mt-2 text-[10.5px] leading-[1.5] text-black/70",
    contactSeparator: "  ·  ",
    sectionGap: "space-y-4",
    heading: "border-b border-[#d9cde0] pb-1 text-[10px] font-bold uppercase tracking-[0.2em] text-[#5b3b6b]",
    headingAccent: "none",
    body: "text-[10.5px] leading-[1.55] text-black/85",
    meta: "text-[10px] leading-[1.45] text-black/65",
    entryTitle: "text-[12px] font-semibold leading-[1.4] text-black",
    entrySubtitle: "text-[10.5px] leading-[1.45] text-[#5b3b6b]",
    bullets: "dots",
    skillsLayout: "rows",
    preferredOrder: ["summary", "skills", "projects", "experience", "education"],
  },
};

function formatDateRange(startDate: string, endDate: string | null): string {
  const start = startDate.trim();
  const end = endDate?.trim() ?? "";

  if (start && end) return `${start} – ${end}`;
  return start || end;
}

function splitDescription(description: string): {
  prose: string[];
  bullets: string[];
} {
  const lines = description
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean);

  const prose: string[] = [];
  const bullets: string[] = [];

  for (const line of lines) {
    if (isBulletLine(line)) {
      bullets.push(stripBulletMarker(line));
    } else {
      prose.push(line);
    }
  }

  if (bullets.length === 0 && prose.length > 1) {
    return { prose: prose.slice(0, 1), bullets: prose.slice(1) };
  }

  return { prose, bullets };
}

function contactItems(resume: EditorResumeData): string[] {
  const info = resume.personalInfo;
  if (!info) return [];

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
    .filter((value): value is string => Boolean(value));
}

function displayName(resume: EditorResumeData): string {
  return (
    resume.personalInfo?.fullName?.trim() ||
    resume.jobTitle?.trim() ||
    "Your Name"
  );
}

function displayRole(resume: EditorResumeData): string {
  return resume.personalInfo?.professionalTitle?.trim() ?? "";
}

function BulletLine({
  children,
  spec,
}: {
  children: string;
  spec: TemplateSpec;
}) {
  if (spec.bullets === "none") {
    return <li className={spec.body}>{children}</li>;
  }

  return (
    <li className={`flex gap-2 ${spec.body}`}>
      <span
        aria-hidden="true"
        className="mt-[7px] h-1 w-1 shrink-0 rounded-full bg-black/60"
      />
      <span>{children}</span>
    </li>
  );
}

function SectionHeading({
  children,
  spec,
}: {
  children: string;
  spec: TemplateSpec;
}) {
  return (
    <div
      className={
        spec.headingAccent === "bar"
          ? "flex items-center gap-2"
          : spec.headingAccent === "rule" ||
              spec.headingAccent === "thick"
            ? "flex items-center gap-3"
            : undefined
      }
    >
      {spec.headingAccent === "bar" ? (
        <span
          aria-hidden="true"
          className="h-3 w-0.5 shrink-0 rounded-full bg-[#2f6b57]"
        />
      ) : null}
      <h2 className={`${spec.heading} ${spec.headingAccent === "rule" ? "shrink-0" : ""}`}>
        {children}
      </h2>
      {spec.headingAccent === "rule" ? (
        <span aria-hidden="true" className="h-px flex-1 bg-[#2b4c7e]/25" />
      ) : null}
      {spec.headingAccent === "thick" ? (
        <span aria-hidden="true" className="h-0.5 flex-1 bg-black/25" />
      ) : null}
    </div>
  );
}

function ExperienceEntry({
  item,
  spec,
}: {
  item: ExperienceItem;
  spec: TemplateSpec;
}) {
  const dateRange = formatDateRange(
    item.startDate,
    item.isCurrent ? "Present" : item.endDate,
  );
  const { prose, bullets } = splitDescription(item.description);
  const achievements = item.achievements
    .map(stripBulletMarker)
    .filter(Boolean);
  const meta = [item.employmentType, item.location].filter(Boolean).join(" · ");

  return (
    <article className="break-inside-avoid">
      <div className="flex flex-col gap-0.5 sm:flex-row sm:items-baseline sm:justify-between sm:gap-4">
        <h3 className={spec.entryTitle}>
          {item.jobTitle.trim() || "Untitled role"}
        </h3>
        {dateRange ? <p className={`shrink-0 ${spec.meta}`}>{dateRange}</p> : null}
      </div>

      {item.companyName.trim() || meta ? (
        <p className={spec.entrySubtitle}>
          {[item.companyName.trim(), meta].filter(Boolean).join(" · ")}
        </p>
      ) : null}

      {prose.length > 0 ? (
        <p className={`mt-1 whitespace-pre-line ${spec.body}`}>
          {prose.join("\n")}
        </p>
      ) : null}

      {bullets.length > 0 || achievements.length > 0 ? (
        <ul className="mt-1.5 space-y-1">
          {[...bullets, ...achievements].map((line, index) => (
            <BulletLine key={`${item.id}-bullet-${index}`} spec={spec}>
              {line}
            </BulletLine>
          ))}
        </ul>
      ) : null}
    </article>
  );
}

function ProjectEntry({
  item,
  spec,
}: {
  item: ProjectItem;
  spec: TemplateSpec;
}) {
  const { prose, bullets } = splitDescription(item.description);
  const technologies = item.technologies
    .map((technology) => technology.trim())
    .filter(Boolean);
  const links = [item.link, item.url, item.githubUrl]
    .map((value) => value?.trim())
    .filter((value): value is string => Boolean(value));
  const dateRange = formatDateRange(item.startDate ?? "", item.endDate ?? null);
  const achievements = (item.achievements ?? [])
    .map(stripBulletMarker)
    .filter(Boolean);

  return (
    <article className="break-inside-avoid">
      <div className="flex flex-col gap-0.5 sm:flex-row sm:items-baseline sm:justify-between sm:gap-4">
        <h3 className={spec.entryTitle}>
          {item.name.trim() || "Untitled project"}
        </h3>
        {dateRange ? <p className={`shrink-0 ${spec.meta}`}>{dateRange}</p> : null}
      </div>

      {links.length > 0 ? (
        <p className={`${spec.meta} break-all`}>{links.join(" · ")}</p>
      ) : null}

      {technologies.length > 0 ? (
        <p className={spec.entrySubtitle}>
          <span className="font-semibold">Technologies:</span>{" "}
          {technologies.join(", ")}
        </p>
      ) : null}

      {prose.length > 0 ? (
        <p className={`mt-1 whitespace-pre-line ${spec.body}`}>
          {prose.join("\n")}
        </p>
      ) : null}

      {bullets.length > 0 || achievements.length > 0 ? (
        <ul className="mt-1.5 space-y-1">
          {[...bullets, ...achievements].map((line, index) => (
            <BulletLine key={`${item.id}-bullet-${index}`} spec={spec}>
              {line}
            </BulletLine>
          ))}
        </ul>
      ) : null}
    </article>
  );
}

function EducationEntry({
  item,
  spec,
}: {
  item: EducationItem;
  spec: TemplateSpec;
}) {
  const qualification = [item.degree, item.fieldOfStudy]
    .map((value) => value.trim())
    .filter(Boolean)
    .join(", ");
  const dateRange = formatDateRange(item.startDate, item.endDate);
  const details = [item.location.trim(), item.grade?.trim()]
    .filter(Boolean)
    .join(" · ");

  return (
    <article className="break-inside-avoid">
      <div className="flex flex-col gap-0.5 sm:flex-row sm:items-baseline sm:justify-between sm:gap-4">
        <h3 className={spec.entryTitle}>
          {qualification || item.schoolName.trim() || "Untitled education"}
        </h3>
        {dateRange ? <p className={`shrink-0 ${spec.meta}`}>{dateRange}</p> : null}
      </div>

      {item.schoolName.trim() && qualification ? (
        <p className={spec.entrySubtitle}>{item.schoolName.trim()}</p>
      ) : null}

      {details ? <p className={spec.meta}>{details}</p> : null}
    </article>
  );
}

function SkillsBlock({
  skills,
  spec,
}: {
  skills: string[];
  spec: TemplateSpec;
}) {
  const categories = categorizeSkills(skills);

  if (spec.skillsLayout === "inline") {
    return (
      <p className={spec.body}>
        {categories.flatMap((category) => category.items).join(" · ")}
      </p>
    );
  }

  if (spec.skillsLayout === "columns") {
    return (
      <ul className="grid grid-cols-1 gap-x-6 gap-y-1 sm:grid-cols-2">
        {categories.flatMap((category) =>
          category.items.map((item, index) => (
            <li
              key={`${category.label}-${item}-${index}`}
              className={`flex gap-2 ${spec.body}`}
            >
              <span
                aria-hidden="true"
                className="mt-[7px] h-1 w-1 shrink-0 rounded-full bg-black/55"
              />
              <span>{item}</span>
            </li>
          )),
        )}
      </ul>
    );
  }

  return (
    <ul className="space-y-1">
      {categories.map((category) => (
        <li key={category.label} className={spec.body}>
          <span className="font-semibold">{category.label}:</span>{" "}
          {category.items.join(", ")}
        </li>
      ))}
    </ul>
  );
}

function ResumeSections({
  resume,
  spec,
  sectionOrder,
}: {
  resume: EditorResumeData;
  spec: TemplateSpec;
  sectionOrder?: ResumeSectionId[];
}) {
  const skills = resume.skills.map((skill) => skill.trim()).filter(Boolean);
  const experience = resume.experience.filter(
    (item) =>
      item.jobTitle.trim() ||
      item.companyName.trim() ||
      item.description.trim() ||
      item.achievements.some((achievement) => achievement.trim()),
  );
  const projects = resume.projects.filter(
    (item) =>
      item.name.trim() ||
      item.description.trim() ||
      item.technologies.some((technology) => technology.trim()) ||
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

  const sections: Record<ResumeSectionId, ReactNode> = {
    summary: resume.professionalSummary?.trim() ? (
      <section>
        <SectionHeading spec={spec}>Professional Summary</SectionHeading>
        <p className={`mt-1.5 whitespace-pre-line ${spec.body}`}>
          {resume.professionalSummary}
        </p>
      </section>
    ) : null,

    skills:
      skills.length > 0 ? (
        <section>
          <SectionHeading spec={spec}>Skills</SectionHeading>
          <div className="mt-1.5">
            <SkillsBlock skills={skills} spec={spec} />
          </div>
        </section>
      ) : null,

    experience:
      experience.length > 0 ? (
        <section>
          <SectionHeading spec={spec}>Work Experience</SectionHeading>
          <div className="mt-2 space-y-3.5">
            {experience.map((item) => (
              <ExperienceEntry key={item.id} item={item} spec={spec} />
            ))}
          </div>
        </section>
      ) : null,

    projects:
      projects.length > 0 ? (
        <section>
          <SectionHeading spec={spec}>Projects</SectionHeading>
          <div className="mt-2 space-y-3.5">
            {projects.map((item) => (
              <ProjectEntry key={item.id} item={item} spec={spec} />
            ))}
          </div>
        </section>
      ) : null,

    education:
      education.length > 0 ? (
        <section>
          <SectionHeading spec={spec}>Education</SectionHeading>
          <div className="mt-2 space-y-3">
            {education.map((item) => (
              <EducationEntry key={item.id} item={item} spec={spec} />
            ))}
          </div>
        </section>
      ) : null,
  };

  const defaultOrder = createDefaultSectionOrder();
  const usesDefaultOrder =
    !sectionOrder ||
    (sectionOrder.length === defaultOrder.length &&
      sectionOrder.every((sectionId, index) => sectionId === defaultOrder[index]));

  const order =
    usesDefaultOrder && spec.preferredOrder
      ? spec.preferredOrder
      : (sectionOrder ?? defaultOrder);

  return (
    <div className={spec.sectionGap}>
      {order.map((sectionId) => (
        <Fragment key={sectionId}>{sections[sectionId]}</Fragment>
      ))}

      {certifications.length > 0 ? (
        <section>
          <SectionHeading spec={spec}>Certifications</SectionHeading>
          <div className="mt-2 space-y-2">
            {certifications.map((item) => (
              <article key={item.id} className="break-inside-avoid">
                <div className="flex flex-col gap-0.5 sm:flex-row sm:items-baseline sm:justify-between sm:gap-4">
                  <h3 className={spec.entryTitle}>{item.name.trim()}</h3>
                  {item.issueDate.trim() || item.expirationDate.trim() ? (
                    <p className={`shrink-0 ${spec.meta}`}>
                      {[item.issueDate.trim(), item.expirationDate.trim()]
                        .filter(Boolean)
                        .join(" – ")}
                    </p>
                  ) : null}
                </div>
                {item.issuer.trim() ? (
                  <p className={spec.entrySubtitle}>{item.issuer.trim()}</p>
                ) : null}
                {item.credentialUrl.trim() ? (
                  <p className={`${spec.meta} break-all`}>
                    {item.credentialUrl.trim()}
                  </p>
                ) : null}
              </article>
            ))}
          </div>
        </section>
      ) : null}

      {additionalSections.map((section) => (
        <section key={section.id}>
          <SectionHeading spec={spec}>{section.title.trim()}</SectionHeading>
          <div className="mt-2 space-y-2">
            {section.entries
              .filter((entry) => entry.title.trim() || entry.description.trim())
              .map((entry) => (
                <article key={entry.id} className="break-inside-avoid">
                  <div className="flex flex-col gap-0.5 sm:flex-row sm:items-baseline sm:justify-between sm:gap-4">
                    <h3 className={spec.entryTitle}>{entry.title.trim()}</h3>
                    {entry.date.trim() ? (
                      <p className={`shrink-0 ${spec.meta}`}>{entry.date.trim()}</p>
                    ) : null}
                  </div>
                  {entry.subtitle.trim() ? (
                    <p className={spec.entrySubtitle}>{entry.subtitle.trim()}</p>
                  ) : null}
                  {entry.description.trim() ? (
                    <p className={spec.body}>{entry.description.trim()}</p>
                  ) : null}
                  {entry.url.trim() ? (
                    <p className={`${spec.meta} break-all`}>{entry.url.trim()}</p>
                  ) : null}
                </article>
              ))}
          </div>
        </section>
      ))}

      {resume.coverLetter?.trim() ? (
        <section className="break-inside-avoid">
          <SectionHeading spec={spec}>Cover Letter</SectionHeading>
          <p className={`mt-1.5 whitespace-pre-line ${spec.body}`}>
            {resume.coverLetter.trim()}
          </p>
        </section>
      ) : null}
    </div>
  );
}

function TemplateDocument({
  resume,
  spec,
  sectionOrder,
}: {
  resume: EditorResumeData;
  spec: TemplateSpec;
  sectionOrder?: ResumeSectionId[];
}) {
  const contacts = contactItems(resume);
  const role = displayRole(resume);

  return (
    <article
      data-resume-template={spec.id}
      className={`${spec.article} ${spec.headerAlign === "center" ? "text-center" : "text-left"}`}
    >
      <header className={spec.header}>
        <h1 className={spec.name}>{displayName(resume)}</h1>
        {role ? <p className={spec.role}>{role}</p> : null}
        {contacts.length > 0 ? (
          <p className={`${spec.contact} [overflow-wrap:anywhere]`}>
            {contacts.map((contact, index) => (
              <Fragment key={`${contact}-${index}`}>
                {index > 0 ? (
                  <span aria-hidden="true">{spec.contactSeparator}</span>
                ) : null}
                {contact}
              </Fragment>
            ))}
          </p>
        ) : null}
      </header>

      <div className={`mt-5 ${spec.headerAlign === "center" ? "text-left" : ""}`}>
        <ResumeSections resume={resume} spec={spec} sectionOrder={sectionOrder} />
      </div>
    </article>
  );
}

type ResumeTemplateProps = {
  resume: EditorResumeData;
  sectionOrder?: ResumeSectionId[];
};

function makeTemplate(id: ResumeTemplateId) {
  return function Template({ resume, sectionOrder }: ResumeTemplateProps) {
    return (
      <TemplateDocument
        resume={resume}
        spec={specs[id]}
        sectionOrder={sectionOrder}
      />
    );
  };
}

export const ProfessionalClassicResumeTemplate = makeTemplate(
  "professional-classic",
);
export const ModernAtsResumeTemplate = makeTemplate("modern-ats");
export const CompactAtsResumeTemplate = makeTemplate("compact-ats");
export const TechnicalAtsResumeTemplate = makeTemplate("technical-ats");
export const MinimalAtsResumeTemplate = makeTemplate("minimal-ats");
export const EntryLevelAtsResumeTemplate = makeTemplate("entry-level-ats");
export const ExecutiveAtsResumeTemplate = makeTemplate("executive-ats");
export const ProjectFocusedAtsResumeTemplate = makeTemplate(
  "project-focused-ats",
);

const templateComponents: Record<
  ResumeTemplateId,
  (props: ResumeTemplateProps) => ReactNode
> = {
  "professional-classic": ProfessionalClassicResumeTemplate,
  "modern-ats": ModernAtsResumeTemplate,
  "compact-ats": CompactAtsResumeTemplate,
  "technical-ats": TechnicalAtsResumeTemplate,
  "minimal-ats": MinimalAtsResumeTemplate,
  "entry-level-ats": EntryLevelAtsResumeTemplate,
  "executive-ats": ExecutiveAtsResumeTemplate,
  "project-focused-ats": ProjectFocusedAtsResumeTemplate,
};

export function hasResumeContent(resume: EditorResumeData): boolean {
  return (
    Boolean(resume.jobTitle?.trim()) ||
    Boolean(resume.personalInfo?.fullName?.trim()) ||
    Boolean(resume.professionalSummary?.trim()) ||
    resume.skills.some((skill) => skill.trim()) ||
    resume.experience.length > 0 ||
    resume.projects.length > 0 ||
    resume.education.length > 0 ||
    (resume.certifications?.length ?? 0) > 0 ||
    (resume.additionalSections?.length ?? 0) > 0 ||
    Boolean(resume.coverLetter?.trim())
  );
}

export function ResumeTemplate({
  template,
  resume,
  sectionOrder,
}: ResumeTemplateProps & { template: ResumeTemplateId }) {
  const Component = templateComponents[template];
  return <Component resume={resume} sectionOrder={sectionOrder} />;
}
