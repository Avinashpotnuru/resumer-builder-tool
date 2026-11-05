import { ResumeTemplate } from "@/components/create-resume/resume-templates";
import type { ResumeTemplateId } from "@/lib/resume/editor-store";
import { SAMPLE_RESUME } from "@/lib/resume/sample-resume";

/**
 * Static A4-ratio thumbnail of a real template rendering real sample data.
 * The resume renders at 2.72× natural width and is scaled down, so the
 * thumbnail is a faithful, proportioned preview rather than a mock.
 */
export function TemplateThumbnail({
  template,
  className = "",
}: {
  template: ResumeTemplateId;
  className?: string;
}) {
  return (
    <div
      className={`relative w-full overflow-hidden rounded-md border border-ink/10 bg-surface ${className}`}
    >
      <div className="aspect-[210/297] w-full" aria-hidden="true" />
      <div
        className="pointer-events-none absolute left-0 top-0 origin-top-left select-none"
        style={{ width: "272%", transform: "scale(0.3676)" }}
        aria-hidden="true"
      >
        <ResumeTemplate template={template} resume={SAMPLE_RESUME} />
      </div>
    </div>
  );
}
