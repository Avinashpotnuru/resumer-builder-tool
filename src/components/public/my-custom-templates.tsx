"use client";

import Link from "next/link";
import { useState, type FormEvent } from "react";

import { ArrowRightIcon, PenIcon, TrashIcon } from "@/components/ui/icons";
import {
  deleteCustomTemplate,
  renameCustomTemplate,
  type CustomTemplateConfig,
} from "@/lib/resume/custom-template";
import { useCustomTemplates } from "@/lib/resume/use-custom-templates";

const secondaryActionClass =
  "inline-flex h-9 flex-1 items-center justify-center gap-1.5 rounded-full border border-line bg-card px-3 text-[11px] font-medium text-ink transition-colors hover:border-primary/40 hover:bg-accent-soft/50 focus-visible:ring-2 focus-visible:ring-ring/40 focus-visible:outline-none";

export function MyCustomTemplates() {
  const customTemplates = useCustomTemplates();

  if (customTemplates.length === 0) return null;

  return (
    <div className="mt-16">
      <div className="flex items-center justify-between gap-4 mb-6">
        <div>
          <h2 className="font-heading text-3xl font-semibold tracking-[-0.03em] text-ink sm:text-4xl">
            My Custom Templates
          </h2>
          <p className="mt-2 text-[14px] leading-6 text-muted">
            Templates you have designed and saved. Apply them to any resume or
            edit them further.
          </p>
        </div>
      </div>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {customTemplates.map((template) => (
          <CustomTemplateCard key={template.id} template={template} />
        ))}
      </div>
    </div>
  );
}

function CustomTemplateCard({ template }: { template: CustomTemplateConfig }) {
  const [renaming, setRenaming] = useState(false);
  const [draftName, setDraftName] = useState(template.name);
  const [error, setError] = useState<string | null>(null);

  const handleRename = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const ok = renameCustomTemplate(template.id, draftName);

    if (ok) {
      setRenaming(false);
      setError(null);
      return;
    }

    setError("Enter a name to save this template.");
  };

  const handleDelete = () => {
    const confirmed = window.confirm(
      `Delete “${template.name}”? Resumes using it will fall back to the default layout.`,
    );

    if (confirmed) {
      deleteCustomTemplate(template.id);
    }
  };

  return (
    <article className="group flex flex-col overflow-hidden rounded-[26px] border border-line bg-card transition-all duration-300 hover:-translate-y-1 hover:border-primary/35 hover:shadow-[0_30px_60px_-42px_rgba(27,33,29,0.5)]">
      <div
        aria-hidden="true"
        className="h-1.5 w-full"
        style={{
          background: `linear-gradient(90deg, ${template.colors.primary}, ${template.colors.accent})`,
        }}
      />

      <div className="flex items-start justify-between gap-4 p-5 pb-0">
        <div
          className="flex h-10 w-10 items-center justify-center rounded-full border border-line text-[12px] font-bold"
          style={{
            backgroundColor: `${template.colors.accent}14`,
            color: template.colors.primary,
          }}
        >
          {template.name.charAt(0).toUpperCase()}
        </div>
        <button
          type="button"
          onClick={handleDelete}
          aria-label={`Delete ${template.name}`}
          className="rounded-full p-1.5 text-muted transition-colors hover:bg-danger-soft hover:text-danger focus-visible:ring-2 focus-visible:ring-ring/40 focus-visible:outline-none"
        >
          <TrashIcon className="h-4 w-4" />
        </button>
      </div>

      <div className="p-5">
        {renaming ? (
          <form onSubmit={handleRename} className="space-y-2">
            <label className="sr-only" htmlFor={`rename-${template.id}`}>
              Template name
            </label>
            <input
              id={`rename-${template.id}`}
              value={draftName}
              autoFocus
              onChange={(event) => setDraftName(event.target.value)}
              className="h-9 w-full rounded-[22px] border border-line bg-accent-soft/40 px-3 text-sm font-medium text-ink transition-colors focus:border-primary focus:ring-2 focus:ring-ring/20 focus:outline-none"
            />
            <div className="flex gap-2">
              <button
                type="submit"
                className="h-8 rounded-full bg-accent px-3 text-[11px] font-medium text-accent-foreground transition-colors hover:bg-accent-strong"
              >
                Save name
              </button>
              <button
                type="button"
                onClick={() => {
                  setRenaming(false);
                  setDraftName(template.name);
                  setError(null);
                }}
                className="h-8 rounded-full border border-line px-3 text-[11px] font-medium text-muted transition-colors hover:bg-accent-soft/50"
              >
                Cancel
              </button>
            </div>
            {error ? (
              <p role="alert" className="text-[11px] text-danger">
                {error}
              </p>
            ) : null}
          </form>
        ) : (
          <>
            <div className="flex items-start justify-between gap-2">
              <h3 className="font-heading text-lg font-semibold leading-tight tracking-[-0.01em] text-ink">
                {template.name}
              </h3>
              <button
                type="button"
                onClick={() => {
                  setDraftName(template.name);
                  setRenaming(true);
                }}
                aria-label={`Rename ${template.name}`}
                className="shrink-0 rounded-full p-1 text-muted transition-colors hover:bg-accent-soft/50 hover:text-ink focus-visible:ring-2 focus-visible:ring-ring/40 focus-visible:outline-none"
              >
                <PenIcon className="h-3.5 w-3.5" />
              </button>
            </div>
            <p className="mt-1 text-[10px] font-medium uppercase tracking-[0.2em] text-accent-strong">
              Based on {template.baseTemplate}
            </p>
            <p className="mt-3 text-[12px] leading-5 text-muted">
              {template.sections.sectionOrder.filter(
                (id) => template.sections.sectionVisibility[id] ?? true,
              ).length}{" "}
              sections • customized{" "}
              {new Date(template.updatedAt).toLocaleDateString(undefined, {
                month: "short",
                day: "numeric",
                year: "numeric",
              })}
            </p>
          </>
        )}
      </div>

      <div className="mt-auto space-y-2 border-t border-line bg-background/50 p-4">
        <Link
          href={`/resumes/new?template=${encodeURIComponent(template.id)}`}
          className="group/apply inline-flex h-9 w-full items-center justify-center gap-2 rounded-full bg-primary px-3 text-[12px] font-medium text-primary-foreground transition-colors hover:bg-accent focus-visible:ring-2 focus-visible:ring-ring/40 focus-visible:outline-none"
        >
          Use this template
          <ArrowRightIcon className="h-3.5 w-3.5 transition-transform duration-150 group-hover/apply:translate-x-0.5" />
        </Link>

        <div className="flex flex-wrap gap-2">
          <Link
            href={`/templates/${encodeURIComponent(template.id)}`}
            className={secondaryActionClass}
          >
            Preview
          </Link>
          <Link
            href={`/templates/custom?edit=${encodeURIComponent(template.id)}`}
            className={secondaryActionClass}
          >
            Edit
          </Link>
          <Link
            href={`/templates/custom?copy=${encodeURIComponent(template.id)}`}
            className={secondaryActionClass}
          >
            Duplicate
          </Link>
        </div>
      </div>
    </article>
  );
}
