"use client";

import { useMemo, useState } from "react";
import {
  RESUME_TEMPLATE_CATALOG,
  RESUME_TEMPLATE_CATEGORIES,
  type ResumeTemplateCategory,
} from "@/lib/resume/template-catalog";
import { TemplateCard } from "./template-card";

type GalleryFilter = "All" | ResumeTemplateCategory;

export function TemplateGallery() {
  const [filter, setFilter] = useState<GalleryFilter>("All");

  const visible = useMemo(
    () =>
      filter === "All"
        ? RESUME_TEMPLATE_CATALOG
        : RESUME_TEMPLATE_CATALOG.filter((template) => template.category === filter),
    [filter],
  );

  return (
    <div>
      <div
        role="group"
        aria-label="Filter templates by category"
        className="flex flex-wrap gap-2.5"
      >
        {RESUME_TEMPLATE_CATEGORIES.map((category) => {
          const active = category === filter;
          return (
            <button
              key={category}
              type="button"
              aria-pressed={active}
              onClick={() => setFilter(category)}
              className={[
                "h-9 rounded-full border px-4 text-[12px] font-medium transition-colors focus-visible:ring-2 focus-visible:ring-ring/40 focus-visible:outline-none",
                active
                  ? "border-primary bg-primary text-primary-foreground"
                  : "border-line bg-card text-muted hover:border-primary/40 hover:text-ink",
              ].join(" ")}
            >
              {category}
            </button>
          );
        })}
      </div>

      <p className="mt-5 text-[12px] text-muted" role="status">
        Showing {visible.length} {visible.length === 1 ? "template" : "templates"}
        {filter === "All" ? "" : ` in ${filter}`}.
      </p>

      <div className="mt-7 grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {visible.map((template) => (
          <TemplateCard key={template.id} template={template} />
        ))}
      </div>
    </div>
  );
}
