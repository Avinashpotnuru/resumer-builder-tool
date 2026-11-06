import { Fragment, type ReactNode } from "react";

import type {
  EditorResumeData,
  EducationItem,
  ExperienceItem,
  ProjectItem,
  ResumeSectionId,
} from "@/lib/resume/editor-store";
import { categorizeSkills } from "@/lib/resume/categorize-skills";
import { isBulletLine, stripBulletMarker } from "@/lib/resume/bullet-text";

const sectionOrder: ResumeSectionId[] = [
  "summary",
  "skills",
  "experience",
  "projects",
  "education",
];

function formatDateRange(startDate: string, endDate: string | null): string {
  const start = startDate.trim();
  const end = endDate?.trim() ?? "";

  if (start && end) return `${start} – ${end}`;
  return start || end;
}

function isImpactful(text: string): boolean {
  return /\d/.test(text);
}

function splitDescriptionLines(description: string): { prose: string[]; bullets: string[] } {
  const lineDetails = description
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean);

  const prose: string[] = [];
  const bullets: string[] = [];

  for (const line of lineDetails) {
    if (isBulletLine(line)) {
      bullets.push(stripBulletMarker(line));
    } else {
      prose.push(line);
    }
  }

  // Plain-text uploads lose DOCX bullet markers; keep the first line as the
  // project summary and treat the remaining lines as bullets.
  if (bullets.length === 0 && prose.length > 1) {
    return { prose: prose.slice(0, 1), bullets: prose.slice(1) };
  }

  return { prose, bullets };
}

function Bullet({ children, bold = false }: { children: string; bold?: boolean }) {
  return (
    <li className="flex gap-2 text-[11px] leading-[1.55] text-black">
      <span aria-hidden="true" className="mt-[7px] h-1 w-1 shrink-0 rounded-full bg-black" />
      <span className={bold ? "font-semibold text-black" : "text-black"}>{children}</span>
    </li>
  );
}

function SectionHeading({ children }: { children: string }) {
  return (
    <h2 className="break-after-avoid text-[14px] font-bold leading-tight text-black">
      {children}
    </h2>
  );
}

function ExperienceEntry({ item }: { item: ExperienceItem }) {
  const dateRange = formatDateRange(item.startDate, item.endDate);
  const achievements = item.achievements
    .map(stripBulletMarker)
    .filter(Boolean);
  const descriptionBullets = item.description
    .split(/\r?\n/)
    .map(stripBulletMarker)
    .filter(Boolean);

  return (
    <article className="break-inside-avoid text-black">
      <h3 className="text-[11.5px] font-bold leading-[1.4]">
        {item.jobTitle?.trim() || "Untitled role"}
      </h3>
      {(item.companyName.trim() || dateRange) && (
        <p className="text-[10.5px] italic leading-[1.45] text-black/90">
          {[item.companyName.trim(), dateRange].filter(Boolean).join(" · ")}
        </p>
      )}

      {(descriptionBullets.length > 0 || achievements.length > 0) && (
        <ul className="mt-2.5 space-y-1">
          {descriptionBullets.map((line, index) => (
            <Bullet key={`experience-${item.id}-description-${index}`} bold={isImpactful(line)}>
              {line}
            </Bullet>
          ))}
          {achievements.map((achievement, index) => (
            <Bullet key={`experience-${item.id}-achievement-${index}`} bold={isImpactful(achievement)}>
              {achievement}
            </Bullet>
          ))}
        </ul>
      )}
    </article>
  );
}

function ProjectEntry({ item }: { item: ProjectItem }) {
  const { prose, bullets } = splitDescriptionLines(item.description);
  const technologies = item.technologies.map((technology) => technology.trim()).filter(Boolean);

  return (
    <article className="break-inside-avoid text-black">
      <h3 className="text-[11.5px] font-bold leading-[1.4]">
        {item.name?.trim() || "Untitled project"}
      </h3>
      {(item.link || technologies.length > 0) && (
        <p className="mt-0.5 text-[10.5px] leading-[1.45] text-black/90">
          {[
            item.link?.trim() || null,
            technologies.length > 0 ? `Technologies: ${technologies.join(", ")}` : null,
          ]
            .filter(Boolean)
            .join(" · ")}
        </p>
      )}

      {prose.length > 0 && (
        <p className="mt-1 whitespace-pre-line text-[11px] leading-[1.55] text-black">
          {prose.join("\n")}
        </p>
      )}

      {bullets.length > 0 && (
        <ul className="mt-2 space-y-1">
          {bullets.map((line, index) => (
            <Bullet key={`project-${item.id}-bullet-${index}`} bold={isImpactful(line)}>
              {line}
            </Bullet>
          ))}
        </ul>
      )}
    </article>
  );
}

function EducationEntry({ item }: { item: EducationItem }) {
  const qualification = [item.degree, item.fieldOfStudy]
    .map((value) => value.trim())
    .filter(Boolean)
    .join(", ");
  const graduation = item.endDate?.trim() || item.startDate.trim();

  return (
    <article className="break-inside-avoid text-black">
      <h3 className="text-[11.5px] font-bold leading-[1.4]">
        {qualification || item.schoolName?.trim() || "Untitled education"}
      </h3>
      {item.schoolName.trim() && (
        <p className="text-[10.5px] italic leading-[1.45] text-black/90">
          {item.schoolName.trim()}
        </p>
      )}
      {(item.location.trim() || graduation) && (
        <p className="text-[10.5px] leading-[1.45] text-black/90">
          {[item.location.trim(), graduation].filter(Boolean).join(" · ")}
        </p>
      )}
    </article>
  );
}

function ProfessionalClassicSections({ resume }: { resume: EditorResumeData }) {
  const skills = resume.skills.map((skill) => skill.trim()).filter(Boolean);
  const skillCategories = categorizeSkills(skills);
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
      Boolean(item.link?.trim()),
  );
  const education = resume.education.filter(
    (item) => item.schoolName.trim() || item.degree.trim() || item.fieldOfStudy.trim(),
  );

  const sections: Record<ResumeSectionId, ReactNode> = {
    summary: resume.professionalSummary?.trim() ? (
      <section className="space-y-2">
        <SectionHeading>Professional summary</SectionHeading>
        <p className="whitespace-pre-line text-[11px] leading-[1.55] text-black">
          {resume.professionalSummary}
        </p>
      </section>
    ) : null,

    skills:
      skillCategories.length > 0 ? (
        <section className="space-y-2">
          <SectionHeading>Skills</SectionHeading>
          <ul className="space-y-1">
            {skillCategories.map((category) => (
              <li
                key={category.label}
                className="text-[11px] leading-[1.55] text-black"
              >
                <span className="font-bold">{category.label}:</span>{" "}
                {category.items.join(", ")}.
              </li>
            ))}
          </ul>
        </section>
      ) : null,

    experience:
      experience.length > 0 ? (
        <section className="space-y-3">
          <SectionHeading>Work experience</SectionHeading>
          <div className="space-y-3.5">
            {experience.map((item) => (
              <ExperienceEntry key={item.id} item={item} />
            ))}
          </div>
        </section>
      ) : null,

    projects:
      projects.length > 0 ? (
        <section className="space-y-3">
          <SectionHeading>Projects</SectionHeading>
          <div className="space-y-3.5">
            {projects.map((item) => (
              <ProjectEntry key={item.id} item={item} />
            ))}
          </div>
        </section>
      ) : null,

    education:
      education.length > 0 ? (
        <section className="space-y-3">
          <SectionHeading>Education</SectionHeading>
          <div className="space-y-3.5">
            {education.map((item) => (
              <EducationEntry key={item.id} item={item} />
            ))}
          </div>
        </section>
      ) : null,
  };

  return (
    <div className="space-y-6">
      {sectionOrder.map((sectionId) => (
        <Fragment key={sectionId}>{sections[sectionId]}</Fragment>
      ))}
    </div>
  );
}

export function ProfessionalClassicResumeTemplate({
  resume,
}: {
  resume: EditorResumeData;
}) {
  const title = resume.jobTitle?.trim() || "Resume";

  return (
    <article
      data-resume-template="professional-classic"
      className="professional-classic-template mx-auto w-full min-w-0 bg-white px-6 py-8 text-black ring-1 ring-black/10 sm:px-10 sm:py-10"
    >
      <header className="text-center">
        <h1 className="text-[26px] font-bold leading-[1.1] tracking-tight text-black">
          {title}
        </h1>
      </header>

      <div className="mt-5">
        <ProfessionalClassicSections resume={resume} />
      </div>
    </article>
  );
}
