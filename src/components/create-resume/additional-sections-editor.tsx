"use client";

import { useState } from "react";
import {
  createEmptyAdditionalEntry,
  createEmptyAdditionalSection,
  useResumeEditorStore,
} from "@/lib/resume/editor-store";
import { TrashIcon, PlusIcon, CloseIcon } from "@/components/ui/icons";

const inputClassName =
  "h-10 w-full rounded-lg border border-line bg-surface/40 px-3.5 text-sm text-ink transition-colors placeholder:text-muted/60 focus:border-primary focus:ring-2 focus:ring-ring/20 focus:outline-none";

const labelClassName = "block text-[11px] font-medium text-muted";

const PRESET_TITLES = [
  "Achievements",
  "Awards",
  "Publications",
  "Languages",
  "Volunteer Experience",
  "Interests",
] as const;

/**
 * Free-form additional sections (achievements, awards, languages…). Sections
 * are fully removable; entries inside them are independent records.
 */
export function AdditionalSectionsEditor() {
  const sections =
    useResumeEditorStore(
      (state) => state.workingResume?.additionalSections,
    ) ?? [];
  const addAdditionalSection = useResumeEditorStore(
    (state) => state.addAdditionalSection,
  );
  const updateAdditionalSection = useResumeEditorStore(
    (state) => state.updateAdditionalSection,
  );
  const removeAdditionalSection = useResumeEditorStore(
    (state) => state.removeAdditionalSection,
  );
  const addAdditionalEntry = useResumeEditorStore(
    (state) => state.addAdditionalEntry,
  );
  const updateAdditionalEntry = useResumeEditorStore(
    (state) => state.updateAdditionalEntry,
  );
  const removeAdditionalEntry = useResumeEditorStore(
    (state) => state.removeAdditionalEntry,
  );

  const [customTitle, setCustomTitle] = useState("");

  const existingTitles = new Set(
    sections.map((section) => section.title.trim().toLowerCase()),
  );

  const addCustomSection = () => {
    const title = customTitle.trim();
    if (!title) return;
    addAdditionalSection(createEmptyAdditionalSection(title));
    setCustomTitle("");
  };

  return (
    <div className="space-y-4">
      <div>
        <p className={labelClassName}>Add a section</p>
        <div className="mt-1.5 flex flex-wrap gap-1.5">
          {PRESET_TITLES.map((title) => {
            const used = existingTitles.has(title.toLowerCase());
            return (
              <button
                key={title}
                type="button"
                disabled={used}
                onClick={() =>
                  addAdditionalSection(createEmptyAdditionalSection(title))
                }
                className="inline-flex h-8 items-center rounded-full border border-line bg-surface px-3 text-[11px] font-medium text-ink transition-colors hover:border-ink/30 hover:bg-surface/50 focus-visible:ring-2 focus-visible:ring-ring/40 focus-visible:outline-none disabled:pointer-events-none disabled:opacity-35"
              >
                {title}
              </button>
            );
          })}
        </div>
        <div className="mt-2 flex gap-2">
          <input
            type="text"
            value={customTitle}
            onChange={(event) => setCustomTitle(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === "Enter") {
                event.preventDefault();
                addCustomSection();
              }
            }}
            placeholder="Or a custom section title…"
            aria-label="Custom section title"
            className={inputClassName}
          />
          <button
            type="button"
            onClick={addCustomSection}
            disabled={!customTitle.trim()}
            className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-line bg-surface text-ink transition-colors hover:bg-surface/50 focus-visible:ring-2 focus-visible:ring-ring/40 focus-visible:outline-none disabled:pointer-events-none disabled:opacity-35"
            aria-label="Add custom section"
          >
            <PlusIcon className="h-4 w-4" />
          </button>
        </div>
      </div>

      {sections.length === 0 ? (
        <p className="text-[11px] italic text-muted">
          Optional — achievements, awards, publications, languages, volunteer
          work, interests.
        </p>
      ) : null}

      {sections.map((section) => (
        <div
          key={section.id}
          className="rounded-xl border border-line bg-surface/50 p-4"
        >
          <div className="flex items-center gap-2">
            <input
              type="text"
              value={section.title}
              onChange={(event) =>
                updateAdditionalSection(section.id, event.target.value)
              }
              placeholder="Section title"
              aria-label="Section title"
              className="h-10 flex-1 rounded-lg border border-line bg-surface px-3.5 text-sm font-semibold text-ink transition-colors focus:border-primary focus:ring-2 focus:ring-ring/20 focus:outline-none"
            />
            <button
              type="button"
              onClick={() => removeAdditionalSection(section.id)}
              className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-lg text-danger/70 transition-colors hover:bg-danger-soft hover:text-danger focus-visible:ring-2 focus-visible:ring-danger/30 focus-visible:outline-none"
              aria-label="Remove section"
            >
              <CloseIcon className="h-4 w-4" />
            </button>
          </div>

          <ul className="mt-3 space-y-2">
            {section.entries.map((entry) => (
              <li
                key={entry.id}
                className="rounded-lg border border-line bg-surface p-3"
              >
                <div className="flex items-start gap-2">
                  <div className="grid flex-1 gap-2 sm:grid-cols-2">
                    <input
                      type="text"
                      value={entry.title}
                      onChange={(event) =>
                        updateAdditionalEntry(section.id, entry.id, {
                          title: event.target.value,
                        })
                      }
                      placeholder="Title"
                      aria-label="Entry title"
                      className={inputClassName}
                    />
                    <input
                      type="text"
                      value={entry.subtitle}
                      onChange={(event) =>
                        updateAdditionalEntry(section.id, entry.id, {
                          subtitle: event.target.value,
                        })
                      }
                      placeholder="Subtitle / issuer"
                      aria-label="Entry subtitle"
                      className={inputClassName}
                    />
                    <input
                      type="text"
                      value={entry.date}
                      onChange={(event) =>
                        updateAdditionalEntry(section.id, entry.id, {
                          date: event.target.value,
                        })
                      }
                      placeholder="Date (optional)"
                      aria-label="Entry date"
                      className={inputClassName}
                    />
                    <input
                      type="text"
                      value={entry.url}
                      onChange={(event) =>
                        updateAdditionalEntry(section.id, entry.id, {
                          url: event.target.value,
                        })
                      }
                      placeholder="URL (optional)"
                      aria-label="Entry URL"
                      className={inputClassName}
                    />
                    <textarea
                      value={entry.description}
                      onChange={(event) =>
                        updateAdditionalEntry(section.id, entry.id, {
                          description: event.target.value,
                        })
                      }
                      rows={2}
                      placeholder="Details (optional)"
                      aria-label="Entry description"
                      className="col-span-full w-full resize-y rounded-lg border border-line bg-surface/40 px-3.5 py-2 text-sm text-ink transition-colors placeholder:text-muted/60 focus:border-primary focus:ring-2 focus:ring-ring/20 focus:outline-none"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() => removeAdditionalEntry(section.id, entry.id)}
                    className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-md text-danger/70 transition-colors hover:bg-danger-soft hover:text-danger focus-visible:ring-2 focus-visible:ring-danger/30 focus-visible:outline-none"
                    aria-label="Remove entry"
                  >
                    <TrashIcon className="h-3.5 w-3.5" />
                  </button>
                </div>
              </li>
            ))}
          </ul>

          <button
            type="button"
            onClick={() =>
              addAdditionalEntry(section.id, createEmptyAdditionalEntry())
            }
            className="mt-2 inline-flex h-9 items-center rounded-lg border border-line bg-surface px-3 text-[11px] font-medium text-ink transition-colors hover:bg-surface/50 focus-visible:ring-2 focus-visible:ring-ring/40 focus-visible:outline-none"
          >
            Add entry
          </button>
        </div>
      ))}
    </div>
  );
}
