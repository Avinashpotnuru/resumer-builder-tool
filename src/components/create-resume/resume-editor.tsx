"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import {
  ArrowRightIcon,
  ChevronDownIcon,
  ChevronUpIcon,
  CloseIcon,
  PenIcon,
  TrashIcon,
} from "@/components/ui/icons";
import {
  RESUME_SECTION_LABELS,
  RESUME_SECTION_ORDER,
  RESUME_TEMPLATES,
  RESUME_TEMPLATE_LABELS,
  isCustomTemplateId,
  useResumeEditorStore,
} from "@/lib/resume/editor-store";
import type {
  AnyTemplateId,
  EditorResumeData,
  EducationItem,
  ExperienceItem,
  ProjectItem,
  ResumeSectionId,
} from "@/lib/resume/editor-store";
import { useCustomTemplates } from "@/lib/resume/use-custom-templates";
import {
  OriginalResumeData,
  OptimizedResumeData,
  compareOriginalVsOptimized,
} from "@/lib/resume/source-tracking";
import { ResumePreview } from "./resume-preview";
import { PersonalInfoEditor } from "./personal-info-editor";
import { CertificationsEditor } from "./certifications-editor";
import { AdditionalSectionsEditor } from "./additional-sections-editor";

const fieldClassName =
  "h-11 w-full rounded-[22px] border border-line bg-accent-soft/40 px-3.5 text-sm text-ink transition-colors placeholder:text-muted/60 focus:border-primary focus:bg-surface focus:ring-2 focus:ring-ring/20 focus:outline-none";

const textareaClassName =
  "h-32 w-full resize-y rounded-[22px] border border-line bg-accent-soft/40 px-3.5 py-3 text-sm leading-6 text-ink transition-colors placeholder:text-muted/60 focus:border-primary focus:bg-surface focus:ring-2 focus:ring-ring/20 focus:outline-none";

const buttonClassName =
  "rounded-full px-3 py-2 text-xs font-medium transition-colors focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-surface focus-visible:outline-none";

const secondaryButtonClassName = [
  buttonClassName,
  "border border-line bg-card text-muted hover:bg-accent-soft/50 hover:text-ink",
].join(" ");

const dangerButtonClassName = [
  buttonClassName,
  "border border-line bg-card text-danger hover:bg-danger-soft",
].join(" ");

const primaryButtonClassName = [
  buttonClassName,
  "bg-accent text-accent-foreground hover:bg-accent-strong",
].join(" ");

const orderButtonClassName =
  "inline-flex h-7 w-7 items-center justify-center rounded-full text-muted transition-colors focus-visible:ring-2 focus-visible:ring-ring/40 focus-visible:outline-none disabled:pointer-events-none disabled:opacity-30";

function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

function formatDateRange(start: string, end: string | null): string {
  const from = start.trim();
  const to = end?.trim() ?? "";
  if (from && to) return `${from} – ${to}`;
  return from || to;
}

function emptyExperience(): ExperienceItem {
  return {
    id: generateId(),
    jobTitle: "",
    companyName: "",
    startDate: "",
    endDate: null,
    description: "",
    achievements: [],
  };
}

function emptyProject(): ProjectItem {
  return {
    id: generateId(),
    name: "",
    description: "",
    technologies: [],
  };
}

function emptyEducation(): EducationItem {
  return {
    id: generateId(),
    schoolName: "",
    degree: "",
    fieldOfStudy: "",
    startDate: "",
    endDate: null,
    location: "",
  };
}

export type ResumeEditorSaveData = {
  original: OriginalResumeData;
  optimized: OptimizedResumeData;
  comparison: ReturnType<typeof compareOriginalVsOptimized>;
  workingResume: EditorResumeData;
  sectionOrder: ResumeSectionId[];
  template: AnyTemplateId;
};

type SavedResumeSnapshot = {
  key: string;
  resume: EditorResumeData;
  sectionOrder: ResumeSectionId[];
  template: AnyTemplateId;
};

type ResumeEditorProps = {
  originalResume: OriginalResumeData;
  optimizedResume: OptimizedResumeData;
  savedVersion?: SavedResumeSnapshot;
  onSave?: (data: ResumeEditorSaveData) => boolean | void;
};

export function ResumeEditor({
  originalResume,
  optimizedResume,
  savedVersion,
  onSave,
}: ResumeEditorProps) {
  const {
    workingResume,
    sectionOrder,
    template,
    isDirty,
    setResumes,
    updateProfessionalSummary,
    updateCoverLetter,
    updateSkills,
    addExperience,
    updateExperience,
    removeExperience,
    moveExperience,
    addProject,
    updateProject,
    removeProject,
    moveProject,
    addEducation,
    updateEducation,
    removeEducation,
    moveSection,
    resetSectionOrder,
    hydrateSavedResume,
    resetWorkingResume,
    setDirty,
    setTemplate,
  } = useResumeEditorStore();

  const hydratedKeyRef = useRef<string | null>(null);

  const [editingExperienceId, setEditingExperienceId] = useState<string | null>(
    null,
  );
  const [editingProjectId, setEditingProjectId] = useState<string | null>(null);
  const [editingEducationId, setEditingEducationId] = useState<string | null>(
    null,
  );
  const [mobileView, setMobileView] = useState<"edit" | "preview">("edit");

  useEffect(() => {
    if (!savedVersion) return;
    if (hydratedKeyRef.current === savedVersion.key) return;

    hydratedKeyRef.current = savedVersion.key;
    hydrateSavedResume(
      originalResume,
      optimizedResume,
      savedVersion.resume,
      savedVersion.sectionOrder,
      savedVersion.template,
    );
  }, [
    savedVersion,
    originalResume,
    optimizedResume,
    hydrateSavedResume,
  ]);

  useEffect(() => {
    setResumes(originalResume, optimizedResume);
  }, [originalResume, optimizedResume, setResumes]);

  const working = workingResume;
  const customTemplates = useCustomTemplates();

  const handleSave = useCallback(() => {
    if (!working || !onSave) return;

    const optimized: OptimizedResumeData = {
      id: `${originalResume.id}-edited`,
      originalResumeId: originalResume.id,
      optimizedAt: new Date().toISOString(),
      jobTitle: working.jobTitle,
      professionalSummary: working.professionalSummary,
      skills: working.skills,
      experience: working.experience,
      projects: working.projects,
      education: working.education,
      personalInfo: working.personalInfo,
      certifications: working.certifications,
      additionalSections: working.additionalSections,
      coverLetter: working.coverLetter,
      provenance: [],
      changes: [],
    };

    const comparison = compareOriginalVsOptimized(originalResume, optimized);

    const result = onSave({
      original: originalResume,
      optimized,
      comparison,
      workingResume: working,
      sectionOrder,
      template,
    });

    if (result !== false) {
      setDirty(false);
    }
  }, [
    working,
    originalResume,
    onSave,
    sectionOrder,
    template,
    setDirty,
  ]);

  const handleCancel = useCallback(() => {
    if (savedVersion) {
      hydrateSavedResume(
        originalResume,
        optimizedResume,
        savedVersion.resume,
        savedVersion.sectionOrder,
        savedVersion.template,
      );
    } else {
      resetWorkingResume();
    }

    setDirty(false);
  }, [
    originalResume,
    optimizedResume,
    savedVersion,
    hydrateSavedResume,
    resetWorkingResume,
    setDirty,
  ]);

  if (!working) return null;

  return (
    <section
      aria-labelledby="resume-editor-heading"
      className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_minmax(0,0.92fr)] xl:items-start"
    >
      {/* Mobile edit/preview switch */}
      <div
        role="group"
        aria-label="Editor view"
        className="xl:hidden mb-4 grid grid-cols-2 gap-1 rounded-[22px] border border-line bg-accent-soft/40 p-1"
      >
        {(
          [
            { value: "edit", label: "Edit details" },
            { value: "preview", label: "Preview resume" },
          ] as const
        ).map((tab) => {
          const active = mobileView === tab.value;
          return (
            <button
              key={tab.value}
              type="button"
              aria-pressed={active}
              onClick={() => setMobileView(tab.value)}
              className={[
                "h-10 rounded-[22px] text-[12px] font-medium transition-colors focus-visible:ring-2 focus-visible:ring-ring/40 focus-visible:outline-none",
                active ? "bg-accent text-accent-foreground shadow-sm" : "text-muted",
              ].join(" ")}
            >
              {tab.label}
            </button>
          );
        })}
      </div>

      <div
        className={`min-w-0 rounded-[32px] border border-line bg-card p-6 sm:p-8 ${
          mobileView === "edit" ? "" : "hidden xl:block"
        }`}
      >
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <div>
            <h3 id="resume-editor-heading" className="font-heading text-xl font-semibold tracking-[-0.01em] text-ink">
              Resume editor
            </h3>
            <span className="mt-1 text-[11px] text-muted">
              Refine every field — preview updates live
            </span>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <label className="text-[11px] font-medium text-muted sr-only">
              Template
            </label>
            <select
              value={template}
              onChange={(event) =>
                setTemplate(event.target.value as AnyTemplateId)
              }
              className="h-9 max-w-[11rem] rounded-[22px] border border-line bg-accent-soft/40 px-2.5 text-[11px] font-medium text-ink transition-colors focus:border-primary focus:ring-2 focus:ring-ring/20 focus:outline-none"
            >
              {RESUME_TEMPLATES.map((templateId) => (
                <option key={templateId} value={templateId}>
                  {RESUME_TEMPLATE_LABELS[templateId]}
                </option>
              ))}
              {customTemplates.length > 0 ? (
                <optgroup label="My custom templates">
                  {customTemplates.map((custom) => (
                    <option key={custom.id} value={custom.id}>
                      {custom.name}
                    </option>
                  ))}
                </optgroup>
              ) : null}
              {isCustomTemplateId(template) &&
              !customTemplates.some((custom) => custom.id === template) ? (
                <option value={template}>Custom template (unavailable)</option>
              ) : null}
            </select>
            <Link
              href={
                isCustomTemplateId(template)
                  ? `/templates/custom?edit=${encodeURIComponent(template)}`
                  : `/templates/custom?base=${encodeURIComponent(template)}`
              }
              title="Open the custom template designer"
              className="inline-flex h-9 items-center gap-1.5 rounded-full border border-line bg-card px-3 text-[11px] font-medium text-ink transition-colors hover:border-primary/40 hover:bg-accent-soft/50 focus-visible:ring-2 focus-visible:ring-ring/40 focus-visible:outline-none"
            >
              <PenIcon className="h-3.5 w-3.5" />
              {isCustomTemplateId(template)
                ? "Edit template"
                : "Customize template"}
            </Link>
            <button
              type="button"
              onClick={handleSave}
              disabled={!isDirty}
              className={[
                "inline-flex h-10 items-center justify-center gap-2 rounded-full bg-accent px-5 text-[12px] font-medium text-accent-foreground transition-colors hover:bg-accent-strong focus-visible:ring-2 focus-visible:ring-ring/40 focus-visible:ring-offset-2 focus-visible:ring-offset-surface focus-visible:outline-none disabled:pointer-events-none disabled:opacity-40",
                !isDirty && "pointer-events-none opacity-40",
              ].join(" ")}
            >
              Save changes
              <ArrowRightIcon className="h-3.5 w-3.5 transition-transform duration-200 group-hover:translate-x-1" />
            </button>
          </div>
        </div>

        <ResumeEditorHeader title="Personal info" />
        <PersonalInfoEditor />

        <SectionOrderPanel
          order={sectionOrder}
          onMove={moveSection}
          onReset={resetSectionOrder}
        />

        <ResumeEditorHeader title="Professional summary" />
        <SummaryEditor
          value={working.professionalSummary ?? ""}
          onChange={updateProfessionalSummary}
        />

        <ResumeEditorHeader title="Technical skills" />
        <SkillsEditor
          skills={working.skills}
          onChange={updateSkills}
        />

        <ResumeEditorHeader title="Work experience" />
        <ExperienceEditor
          items={working.experience}
          onAdd={addExperience}
          onUpdate={updateExperience}
          onRemove={removeExperience}
          onMove={moveExperience}
          editingId={editingExperienceId}
          setEditingId={setEditingExperienceId}
        />

        <ResumeEditorHeader title="Projects" />
        <ProjectsEditor
          items={working.projects}
          onAdd={addProject}
          onUpdate={updateProject}
          onRemove={removeProject}
          onMove={moveProject}
          editingId={editingProjectId}
          setEditingId={setEditingProjectId}
        />

        <ResumeEditorHeader title="Education" />
        <EducationEditor
          items={working.education}
          onAdd={addEducation}
          onUpdate={updateEducation}
          onRemove={removeEducation}
          editingId={editingEducationId}
          setEditingId={setEditingEducationId}
        />

        <ResumeEditorHeader title="Certifications" />
        <CertificationsEditor />

        <ResumeEditorHeader title="Additional sections" />
        <AdditionalSectionsEditor />

        <ResumeEditorHeader title="Cover letter" />
        <div className="space-y-3">
          <textarea
            value={working.coverLetter ?? ""}
            onChange={(event) => updateCoverLetter(event.target.value)}
            placeholder="Write a cover letter for this role. Only include facts you can verify."
            className={textareaClassName}
          />
          <p className="text-[11px] leading-5 text-muted">
            {working.coverLetter?.length ?? 0}{" "}
            {working.coverLetter?.length === 1 ? "character" : "characters"}
          </p>
        </div>

        <div className="mt-8 flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={handleCancel}
            disabled={!isDirty}
            className={[
              buttonClassName,
              "border border-line bg-card text-ink hover:bg-accent-soft/50 hover:text-ink focus-visible:ring-ring/40 disabled:pointer-events-none disabled:opacity-40",
              !isDirty && "pointer-events-none opacity-40",
            ].join(" ")}
          >
            Cancel
          </button>
        </div>
      </div>

      <div className={mobileView === "preview" ? "" : "hidden xl:block"}>
        <ResumePreview />
      </div>
    </section>
  );
}

type SectionOrderPanelProps = {
  order: ResumeSectionId[];
  onMove: (id: ResumeSectionId, direction: "up" | "down") => void;
  onReset: () => void;
};

function SectionOrderPanel({ order, onMove, onReset }: SectionOrderPanelProps) {
  const isDefaultOrder = order.every(
    (sectionId, index) => sectionId === RESUME_SECTION_ORDER[index],
  );

  return (
    <div className="mb-6 rounded-[22px] border border-line bg-card p-4">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h4 className="text-xs font-semibold text-ink">Section order</h4>
          <p className="mt-0.5 text-[11px] leading-5 text-muted">
            Move sections to change how they appear in the live preview.
          </p>
        </div>
        <button
          type="button"
          onClick={onReset}
          disabled={isDefaultOrder}
          className={[
            secondaryButtonClassName,
            "text-[11px]",
            isDefaultOrder && "pointer-events-none opacity-40",
          ].join(" ")}
        >
          Reset order
        </button>
      </div>

      <ol className="mt-3 space-y-1.5">
        {order.map((sectionId, index) => {
          const label = RESUME_SECTION_LABELS[sectionId];

          return (
            <li
              key={sectionId}
              className="flex items-center justify-between gap-2 rounded-[22px] border border-line bg-card px-3 py-1.5"
            >
              <span className="text-xs text-ink">{label}</span>
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={() => onMove(sectionId, "up")}
                  disabled={index === 0}
                  aria-label={`Move ${label} up`}
                  className={orderButtonClassName}
                >
                  <ChevronUpIcon className="h-3.5 w-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => onMove(sectionId, "down")}
                  disabled={index === order.length - 1}
                  aria-label={`Move ${label} down`}
                  className={orderButtonClassName}
                >
                  <ChevronDownIcon className="h-3.5 w-3.5" />
                </button>
              </div>
            </li>
          );
        })}
      </ol>
    </div>
  );
}

type ResumeEditorHeaderProps = {
  title: string;
};

function ResumeEditorHeader({ title }: ResumeEditorHeaderProps) {
  return (
    <div className="flex items-baseline justify-between gap-3 mt-8 mb-3">
      <h3 className="font-heading text-lg font-semibold tracking-[-0.01em] text-ink">
        {title}
      </h3>
    </div>
  );
}

type ReorderButtonsProps = {
  index: number;
  total: number;
  label: string;
  onMove: (id: string, direction: "up" | "down") => void;
  id: string;
};

function ReorderButtons({ index, total, label, onMove, id }: ReorderButtonsProps) {
  return (
    <div className="flex items-center gap-1" aria-label={`Reorder ${label}`}>
      <button
        type="button"
        onClick={() => onMove(id, "up")}
        disabled={index === 0}
        aria-label="Move up"
        className={orderButtonClassName}
      >
        <ChevronUpIcon className="h-3.5 w-3.5" />
      </button>
      <button
        type="button"
        onClick={() => onMove(id, "down")}
        disabled={index === total - 1}
        aria-label="Move down"
        className={orderButtonClassName}
      >
        <ChevronDownIcon className="h-3.5 w-3.5" />
      </button>
    </div>
  );
}

type SummaryEditorProps = {
  value: string;
  onChange: (value: string | null) => void;
};

function SummaryEditor({ value, onChange }: SummaryEditorProps) {
  return (
    <div className="space-y-1.5">
      <label htmlFor="editor-summary" className="sr-only">
        Professional summary
      </label>
      <textarea
        id="editor-summary"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        rows={6}
        placeholder="Write your professional summary…"
        className={textareaClassName}
      />
      <p className="text-[11px] leading-5 text-muted">
        {value.length} {value.length === 1 ? "character" : "characters"}
      </p>
    </div>
  );
}

type SkillsEditorProps = {
  skills: string[];
  onChange: (skills: string[]) => void;
};

function SkillsEditor({ skills, onChange }: SkillsEditorProps) {
  const [newSkill, setNewSkill] = useState("");

  const handleAddSkill = () => {
    const entries = newSkill
      .split(",")
      .map((entry) => entry.trim())
      .filter(Boolean);

    if (entries.length === 0) return;

    const seen = new Set(skills.map((skill) => skill.toLowerCase()));
    const additions = entries.filter((entry) => {
      const key = entry.toLowerCase();
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    });

    if (additions.length > 0) {
      onChange([...skills, ...additions]);
    }

    setNewSkill("");
  };

  const handleRemoveSkill = (index: number) => {
    onChange(skills.filter((_, i) => i !== index));
  };

  return (
    <div className="space-y-3">
      <div className="flex gap-2">
        <input
          type="text"
          value={newSkill}
          onChange={(event) => setNewSkill(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === "Enter") handleAddSkill();
          }}
          placeholder="Add a skill…"
          className="flex-1 h-10 rounded-lg border border-line bg-surface/40 px-3.5 text-sm text-ink transition-colors focus:border-primary focus:ring-2 focus:ring-ring/20 focus:outline-none"
        />
        <button
          type="button"
          onClick={handleAddSkill}
          disabled={!newSkill.trim()}
          className={secondaryButtonClassName}
        >
          Add
        </button>
      </div>
      <p className="text-[11px] leading-5 text-muted">
        Separate multiple skills with commas. Prefix with a category — e.g.{" "}
        <span className="font-medium text-ink">Languages: TypeScript, Python</span>{" "}
        — to group them on the resume.
      </p>

      {skills.length > 0 ? (
        <div className="flex flex-wrap gap-2">
          {skills.map((skill, index) => (
            <span
              key={skill}
              className="flex items-center gap-2 rounded-full border border-line bg-surface/40 px-2.5 py-1 text-[11px] text-ink"
            >
              {skill}
              <button
                type="button"
                onClick={() => handleRemoveSkill(index)}
                className="-ml-1 flex h-3 w-3 items-center justify-center rounded-full text-danger/60 hover:text-danger"
                aria-label={`Remove ${skill}`}
              >
                <CloseIcon className="h-2.5 w-2.5" />
              </button>
            </span>
          ))}
        </div>
      ) : (
        <p className="text-[11px] italic text-muted">
          No skills added yet.
        </p>
      )}
    </div>
  );
}

type ExperienceEditorProps = {
  items: ExperienceItem[];
  onAdd: (item: ExperienceItem) => void;
  onUpdate: (id: string, updates: Partial<ExperienceItem>) => void;
  onRemove: (id: string) => void;
  onMove: (id: string, direction: "up" | "down") => void;
  editingId: string | null;
  setEditingId: (id: string | null) => void;
};

function ExperienceEditor({
  items,
  onAdd,
  onUpdate,
  onRemove,
  onMove,
  editingId,
  setEditingId,
}: ExperienceEditorProps) {
  const [newItem, setNewItem] = useState(emptyExperience());

  const handleAdd = () => {
    if (!newItem.jobTitle.trim() || !newItem.companyName.trim()) return;
    onAdd(newItem);
    setNewItem(emptyExperience());
  };

  const handleUpdate = <K extends keyof ExperienceItem>(
    id: string,
    field: K,
    value: ExperienceItem[K],
  ) => {
    onUpdate(id, { [field]: value });
  };

  const handleToggleAchievement = (id: string, index: number) => {
    const item = items.find((i) => i.id === id);
    if (!item) return;
    const achievements = [...item.achievements];
    if (index < achievements.length) {
      achievements.splice(index, 1);
    } else {
      achievements.push("");
    }
    onUpdate(id, { achievements });
  };

  const handleAchievementChange = (id: string, achievementIndex: number, value: string) => {
    const item = items.find((i) => i.id === id);
    if (!item) return;
    const achievements = [...item.achievements];
    achievements[achievementIndex] = value;
    onUpdate(id, { achievements });
  };

  if (items.length === 0) {
    return (
      <div className="space-y-3">
        <div className="flex gap-2">
          <input
            type="text"
            value={newItem.jobTitle}
            onChange={(event) =>
              setNewItem({ ...newItem, jobTitle: event.target.value })
            }
            placeholder="Job title"
            className="flex-1 h-10 rounded-lg border border-line bg-surface/40 px-3.5 text-sm text-ink transition-colors focus:border-primary focus:ring-2 focus:ring-ring/20 focus:outline-none"
          />
          <input
            type="text"
            value={newItem.companyName}
            onChange={(event) =>
              setNewItem({ ...newItem, companyName: event.target.value })
            }
            placeholder="Company"
            className="flex-1 h-10 rounded-lg border border-line bg-surface/40 px-3.5 text-sm text-ink transition-colors focus:border-primary focus:ring-2 focus:ring-ring/20 focus:outline-none"
          />
          <button
            type="button"
            onClick={handleAdd}
            disabled={!newItem.jobTitle.trim() || !newItem.companyName.trim()}
            className={secondaryButtonClassName}
          >
            Add
          </button>
        </div>
        <p className="text-[11px] italic text-muted">
          No work experience added yet.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {items.map((item, index) => (
        <div
          key={item.id}
          className="rounded-[22px] border border-line bg-card p-4"
        >
          {editingId === item.id ? (
            <div className="space-y-3">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={item.jobTitle}
                  onChange={(event) =>
                    handleUpdate(item.id, "jobTitle", event.target.value)
                  }
                  placeholder="Job title"
                  className={fieldClassName}
                />
                <input
                  type="text"
                  value={item.companyName}
                  onChange={(event) =>
                    handleUpdate(item.id, "companyName", event.target.value)
                  }
                  placeholder="Company"
                  className={fieldClassName}
                />
              </div>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={item.startDate}
                  onChange={(event) =>
                    handleUpdate(item.id, "startDate", event.target.value)
                  }
                  placeholder="Start date"
                  className={fieldClassName}
                />
                <input
                  type="text"
                  value={item.endDate ?? ""}
                  onChange={(event) =>
                    handleUpdate(
                      item.id,
                      "endDate",
                      event.target.value || null,
                    )
                  }
                  placeholder="End date"
                  className={fieldClassName}
                />
              </div>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={item.employmentType ?? ""}
                  onChange={(event) =>
                    handleUpdate(item.id, "employmentType", event.target.value)
                  }
                  placeholder="Employment type (Full-time)"
                  aria-label="Employment type"
                  className={fieldClassName}
                />
                <input
                  type="text"
                  value={item.location ?? ""}
                  onChange={(event) =>
                    handleUpdate(item.id, "location", event.target.value)
                  }
                  placeholder="Location (Chicago, IL)"
                  aria-label="Location"
                  className={fieldClassName}
                />
              </div>
              <label className="flex w-fit cursor-pointer items-center gap-2 text-[12px] font-medium text-ink">
                <input
                  type="checkbox"
                  checked={Boolean(item.isCurrent)}
                  onChange={(event) => {
                    const current = event.target.checked;
                    onUpdate(item.id, {
                      isCurrent: current,
                      endDate: current ? null : item.endDate,
                    });
                  }}
                  className="h-4 w-4 rounded border-line accent-primary focus-visible:ring-2 focus-visible:ring-primary/40 focus-visible:outline-none"
                />
                I currently work here
              </label>
              <textarea
                value={item.description}
                onChange={(event) =>
                  handleUpdate(item.id, "description", event.target.value)
                }
                rows={3}
                placeholder="Description…"
                className={textareaClassName}
              />
              <div className="space-y-2">
                <p className="text-[11px] font-medium text-ink">Achievements</p>
                {item.achievements.map((achievement, index) => (
                  <div key={index} className="flex gap-2">
                    <input
                      type="text"
                      value={achievement}
                      onChange={(event) =>
                        handleAchievementChange(item.id, index, event.target.value)
                      }
                      placeholder="Achievement…"
                      className={fieldClassName}
                    />
                    <button
                      type="button"
                      onClick={() => handleToggleAchievement(item.id, index)}
                      className={dangerButtonClassName}
                      aria-label="Remove achievement"
                    >
                      <TrashIcon className="h-3 w-3" />
                    </button>
                  </div>
                ))}
                <button
                  type="button"
                  onClick={() =>
                    handleUpdate(item.id, "achievements", [
                      ...item.achievements,
                      "",
                    ])
                  }
                  className={secondaryButtonClassName}
                >
                  Add achievement
                </button>
              </div>
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setEditingId(null)}
                  className={secondaryButtonClassName}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={() => setEditingId(null)}
                  className={primaryButtonClassName}
                >
                  Save
                </button>
              </div>
            </div>
          ) : (
            <div className="space-y-2">
              <div className="flex items-baseline justify-between gap-2">
                <p className="font-heading text-base font-semibold tracking-[-0.01em] text-ink">
                  {item.jobTitle}
                </p>
                <p className="text-[11px] text-muted">{item.companyName}</p>
              </div>
              <p className="text-[11px] text-muted">
                {item.startDate}{item.endDate ? ` – ${item.endDate}` : ""}
              </p>
              <p className="text-sm leading-6 text-ink">{item.description}</p>
              {item.achievements.length > 0 && (
                <ul className="mt-2 space-y-1 text-sm leading-6 text-ink list-disc pl-5">
                  {item.achievements.map((a, i) => (
                    <li key={i}>{a}</li>
                  ))}
                </ul>
              )}
              <div className="flex items-center justify-between gap-2">
                <ReorderButtons
                  index={index}
                  total={items.length}
                  label="experience"
                  onMove={onMove}
                  id={item.id}
                />
                <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setEditingId(item.id)}
                  className={secondaryButtonClassName}
                >
                  Edit
                </button>
                <button
                  type="button"
                  onClick={() => onRemove(item.id)}
                  className={dangerButtonClassName}
                >
                  Remove
                </button>
                </div>
              </div>
            </div>
          )}
        </div>
      ))}
      <div className="mt-4 pt-4 border-t border-line/50">
        <div className="flex gap-2">
          <input
            type="text"
            value={newItem.jobTitle}
            onChange={(event) =>
              setNewItem({ ...newItem, jobTitle: event.target.value })
            }
            placeholder="Job title"
            className="flex-1 h-10 rounded-lg border border-line bg-surface/40 px-3.5 text-sm text-ink transition-colors focus:border-primary focus:ring-2 focus:ring-ring/20 focus:outline-none"
          />
          <input
            type="text"
            value={newItem.companyName}
            onChange={(event) =>
              setNewItem({ ...newItem, companyName: event.target.value })
            }
            placeholder="Company"
            className="flex-1 h-10 rounded-lg border border-line bg-surface/40 px-3.5 text-sm text-ink transition-colors focus:border-primary focus:ring-2 focus:ring-ring/20 focus:outline-none"
          />
          <button
            type="button"
            onClick={handleAdd}
            disabled={!newItem.jobTitle.trim() || !newItem.companyName.trim()}
            className={secondaryButtonClassName}
          >
            Add
          </button>
        </div>
      </div>
    </div>
  );
}

type ProjectsEditorProps = {
  items: ProjectItem[];
  onAdd: (item: ProjectItem) => void;
  onUpdate: (id: string, updates: Partial<ProjectItem>) => void;
  onRemove: (id: string) => void;
  onMove: (id: string, direction: "up" | "down") => void;
  editingId: string | null;
  setEditingId: (id: string | null) => void;
};

function ProjectsEditor({
  items,
  onAdd,
  onUpdate,
  onRemove,
  onMove,
  editingId,
  setEditingId,
}: ProjectsEditorProps) {
  const [newItem, setNewItem] = useState(emptyProject());

  const handleAdd = () => {
    if (!newItem.name.trim()) return;
    onAdd(newItem);
    setNewItem(emptyProject());
  };

  const handleUpdate = <K extends keyof ProjectItem>(
    id: string,
    field: K,
    value: ProjectItem[K],
  ) => {
    onUpdate(id, { [field]: value });
  };

  const handleToggleTech = (id: string, index: number) => {
    const item = items.find((i) => i.id === id);
    if (!item) return;
    const technologies = [...item.technologies];
    if (index < technologies.length) {
      technologies.splice(index, 1);
    } else {
      technologies.push("");
    }
    onUpdate(id, { technologies });
  };

  const handleTechChange = (id: string, techIndex: number, value: string) => {
    const item = items.find((i) => i.id === id);
    if (!item) return;
    const technologies = [...item.technologies];
    technologies[techIndex] = value;
    onUpdate(id, { technologies });
  };

  const handleProjectAchievementChange = (
    id: string,
    achievementIndex: number,
    value: string,
  ) => {
    const item = items.find((i) => i.id === id);
    if (!item) return;
    const achievements = [...(item.achievements ?? [])];
    achievements[achievementIndex] = value;
    onUpdate(id, { achievements });
  };

  const handleToggleProjectAchievement = (id: string, index: number) => {
    const item = items.find((i) => i.id === id);
    if (!item) return;
    const achievements = [...(item.achievements ?? [])];
    if (index < achievements.length) {
      achievements.splice(index, 1);
    } else {
      achievements.push("");
    }
    onUpdate(id, { achievements });
  };

  if (items.length === 0) {
    return (
      <div className="space-y-3">
        <div className="flex gap-2">
          <input
            type="text"
            value={newItem.name}
            onChange={(event) =>
              setNewItem({ ...newItem, name: event.target.value })
            }
            placeholder="Project name"
            className="flex-1 h-10 rounded-lg border border-line bg-surface/40 px-3.5 text-sm text-ink transition-colors focus:border-primary focus:ring-2 focus:ring-ring/20 focus:outline-none"
          />
          <button
            type="button"
            onClick={handleAdd}
            disabled={!newItem.name.trim()}
            className={secondaryButtonClassName}
          >
            Add
          </button>
        </div>
        <p className="text-[11px] italic text-muted">
          No projects added yet.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {items.map((item, index) => (
        <div
          key={item.id}
          className="rounded-[22px] border border-line bg-card p-4"
        >
          {editingId === item.id ? (
            <div className="space-y-3">
              <input
                type="text"
                value={item.name}
                onChange={(event) =>
                  handleUpdate(item.id, "name", event.target.value)
                }
                placeholder="Project name"
                className={fieldClassName}
              />
              <textarea
                value={item.description}
                onChange={(event) =>
                  handleUpdate(item.id, "description", event.target.value)
                }
                rows={3}
                placeholder="Description…"
                className={textareaClassName}
              />
              <div className="space-y-2">
                <p className="text-[11px] font-medium text-ink">Technologies</p>
                {item.technologies.map((tech, index) => (
                  <div key={index} className="flex gap-2">
                    <input
                      type="text"
                      value={tech}
                      onChange={(event) =>
                        handleTechChange(item.id, index, event.target.value)
                      }
                      placeholder="Technology…"
                      className={fieldClassName}
                    />
                    <button
                      type="button"
                      onClick={() => handleToggleTech(item.id, index)}
                      className={dangerButtonClassName}
                      aria-label="Remove technology"
                    >
                      <TrashIcon className="h-3 w-3" />
                    </button>
                  </div>
                ))}
                <button
                  type="button"
                  onClick={() =>
                    handleUpdate(item.id, "technologies", [
                      ...item.technologies,
                      "",
                    ])
                  }
                  className={secondaryButtonClassName}
                >
                  Add technology
                </button>
              </div>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={item.url ?? item.link ?? ""}
                  onChange={(event) =>
                    handleUpdate(item.id, "url", event.target.value)
                  }
                  placeholder="Project URL"
                  aria-label="Project URL"
                  className={fieldClassName}
                />
                <input
                  type="text"
                  value={item.githubUrl ?? ""}
                  onChange={(event) =>
                    handleUpdate(item.id, "githubUrl", event.target.value)
                  }
                  placeholder="GitHub URL"
                  aria-label="GitHub URL"
                  className={fieldClassName}
                />
              </div>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={item.startDate ?? ""}
                  onChange={(event) =>
                    handleUpdate(item.id, "startDate", event.target.value)
                  }
                  placeholder="Start date (optional)"
                  aria-label="Project start date"
                  className={fieldClassName}
                />
                <input
                  type="text"
                  value={item.endDate ?? ""}
                  onChange={(event) =>
                    handleUpdate(item.id, "endDate", event.target.value || null)
                  }
                  placeholder="End date (optional)"
                  aria-label="Project end date"
                  className={fieldClassName}
                />
              </div>
              <div className="space-y-2">
                <p className="text-[11px] font-medium text-ink">
                  Responsibilities & achievements
                </p>
                {(item.achievements ?? []).map((achievement, index) => (
                  <div key={index} className="flex gap-2">
                    <input
                      type="text"
                      value={achievement}
                      onChange={(event) =>
                        handleProjectAchievementChange(
                          item.id,
                          index,
                          event.target.value,
                        )
                      }
                      placeholder="Achievement…"
                      aria-label="Project achievement"
                      className={fieldClassName}
                    />
                    <button
                      type="button"
                      onClick={() => handleToggleProjectAchievement(item.id, index)}
                      className={dangerButtonClassName}
                      aria-label="Remove achievement"
                    >
                      <TrashIcon className="h-3 w-3" />
                    </button>
                  </div>
                ))}
                <button
                  type="button"
                  onClick={() =>
                    onUpdate(item.id, {
                      achievements: [...(item.achievements ?? []), ""],
                    })
                  }
                  className={secondaryButtonClassName}
                >
                  Add achievement
                </button>
              </div>
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setEditingId(null)}
                  className={secondaryButtonClassName}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={() => setEditingId(null)}
                  className={primaryButtonClassName}
                >
                  Save
                </button>
              </div>
            </div>
          ) : (
            <div className="space-y-2">
              <div className="flex flex-wrap items-baseline justify-between gap-2">
                <p className="font-heading text-base font-semibold tracking-[-0.01em] text-ink">
                  {item.name}
                </p>
                {formatDateRange(item.startDate ?? "", item.endDate ?? null) ? (
                  <p className="text-[11px] text-muted">
                    {formatDateRange(item.startDate ?? "", item.endDate ?? null)}
                  </p>
                ) : null}
              </div>
              {[item.url, item.githubUrl].filter(Boolean).length > 0 ? (
                <p className="break-all text-[11px] text-muted">
                  {[item.url, item.githubUrl].filter(Boolean).join(" · ")}
                </p>
              ) : null}
              <p className="text-sm leading-6 text-ink">{item.description}</p>
              {item.technologies.length > 0 && (
                <div className="mt-2 flex flex-wrap gap-2">
                  {item.technologies.map((tech) => (
                    <span
                      key={tech}
                      className="rounded-full border border-line bg-surface/40 px-2.5 py-1 text-[11px] text-ink"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              )}
              <div className="flex items-center justify-between gap-2">
                <ReorderButtons
                  index={index}
                  total={items.length}
                  label="project"
                  onMove={onMove}
                  id={item.id}
                />
                <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setEditingId(item.id)}
                  className={secondaryButtonClassName}
                >
                  Edit
                </button>
                <button
                  type="button"
                  onClick={() => onRemove(item.id)}
                  className={dangerButtonClassName}
                >
                  Remove
                </button>
                </div>
              </div>
            </div>
          )}
        </div>
      ))}
      <div className="mt-4 pt-4 border-t border-line/50">
        <div className="flex gap-2">
          <input
            type="text"
            value={newItem.name}
            onChange={(event) =>
              setNewItem({ ...newItem, name: event.target.value })
            }
            placeholder="Project name"
            className="flex-1 h-10 rounded-lg border border-line bg-surface/40 px-3.5 text-sm text-ink transition-colors focus:border-primary focus:ring-2 focus:ring-ring/20 focus:outline-none"
          />
          <button
            type="button"
            onClick={handleAdd}
            disabled={!newItem.name.trim()}
            className={secondaryButtonClassName}
          >
            Add
          </button>
        </div>
      </div>
    </div>
  );
}

type EducationEditorProps = {
  items: EducationItem[];
  onAdd: (item: EducationItem) => void;
  onUpdate: (id: string, updates: Partial<EducationItem>) => void;
  onRemove: (id: string) => void;
  editingId: string | null;
  setEditingId: (id: string | null) => void;
};

function EducationEditor({
  items,
  onAdd,
  onUpdate,
  onRemove,
  editingId,
  setEditingId,
}: EducationEditorProps) {
  const [newItem, setNewItem] = useState(emptyEducation());

  const handleAdd = () => {
    if (!newItem.schoolName.trim() || !newItem.degree.trim()) return;
    onAdd(newItem);
    setNewItem(emptyEducation());
  };

  const handleUpdate = <K extends keyof EducationItem>(
    id: string,
    field: K,
    value: EducationItem[K],
  ) => {
    onUpdate(id, { [field]: value });
  };

  if (items.length === 0) {
    return (
      <div className="space-y-3">
        <div className="flex gap-2">
          <input
            type="text"
            value={newItem.schoolName}
            onChange={(event) =>
              setNewItem({ ...newItem, schoolName: event.target.value })
            }
            placeholder="School"
            className="flex-1 h-10 rounded-lg border border-line bg-surface/40 px-3.5 text-sm text-ink transition-colors focus:border-primary focus:ring-2 focus:ring-ring/20 focus:outline-none"
          />
          <input
            type="text"
            value={newItem.degree}
            onChange={(event) =>
              setNewItem({ ...newItem, degree: event.target.value })
            }
            placeholder="Degree"
            className="flex-1 h-10 rounded-lg border border-line bg-surface/40 px-3.5 text-sm text-ink transition-colors focus:border-primary focus:ring-2 focus:ring-ring/20 focus:outline-none"
          />
          <button
            type="button"
            onClick={handleAdd}
            disabled={!newItem.schoolName.trim() || !newItem.degree.trim()}
            className={secondaryButtonClassName}
          >
            Add
          </button>
        </div>
        <p className="text-[11px] italic text-muted">
          No education added yet.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {items.map((item) => (
        <div
          key={item.id}
          className="rounded-[22px] border border-line bg-card p-4"
        >
          {editingId === item.id ? (
            <div className="space-y-3">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={item.schoolName}
                  onChange={(event) =>
                    handleUpdate(item.id, "schoolName", event.target.value)
                  }
                  placeholder="School"
                  className={fieldClassName}
                />
                <input
                  type="text"
                  value={item.degree}
                  onChange={(event) =>
                    handleUpdate(item.id, "degree", event.target.value)
                  }
                  placeholder="Degree"
                  className={fieldClassName}
                />
              </div>
              <input
                type="text"
                value={item.fieldOfStudy}
                onChange={(event) =>
                  handleUpdate(item.id, "fieldOfStudy", event.target.value)
                }
                placeholder="Field of study"
                className={fieldClassName}
              />
              <div className="flex gap-2">
                <input
                  type="text"
                  value={item.startDate}
                  onChange={(event) =>
                    handleUpdate(item.id, "startDate", event.target.value)
                  }
                  placeholder="Start date"
                  className={fieldClassName}
                />
                <input
                  type="text"
                  value={item.endDate ?? ""}
                  onChange={(event) =>
                    handleUpdate(item.id, "endDate", event.target.value || null)
                  }
                  placeholder="End date"
                  className={fieldClassName}
                />
                <input
                  type="text"
                  value={item.location}
                  onChange={(event) =>
                    handleUpdate(item.id, "location", event.target.value)
                  }
                  placeholder="Location"
                  className={fieldClassName}
                />
              </div>
              <input
                type="text"
                value={item.grade ?? ""}
                onChange={(event) =>
                  handleUpdate(item.id, "grade", event.target.value)
                }
                placeholder="Grade / CGPA (optional)"
                aria-label="Grade or percentage"
                className={fieldClassName}
              />
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setEditingId(null)}
                  className={secondaryButtonClassName}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={() => setEditingId(null)}
                  className={primaryButtonClassName}
                >
                  Save
                </button>
              </div>
            </div>
          ) : (
            <div className="space-y-2">
              <p className="font-heading text-base font-semibold tracking-[-0.01em] text-ink">
                {item.degree}
              </p>
              <p className="text-[11px] text-muted">
                {item.fieldOfStudy} · {item.schoolName}
              </p>
              <p className="text-[11px] text-muted">
                {item.startDate}
                {item.endDate ? ` – ${item.endDate}` : ""}
                {item.location ? ` · ${item.location}` : ""}
                {item.grade ? ` · Grade ${item.grade}` : ""}
              </p>
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setEditingId(item.id)}
                  className={secondaryButtonClassName}
                >
                  Edit
                </button>
                <button
                  type="button"
                  onClick={() => onRemove(item.id)}
                  className={dangerButtonClassName}
                >
                  Remove
                </button>
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
