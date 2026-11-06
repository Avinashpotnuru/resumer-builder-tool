import { ResumeTemplate } from "@/components/create-resume/resume-templates";
import { SAMPLE_RESUME } from "@/lib/resume/sample-resume";
import type { ResumeTemplateId } from "@/lib/resume/template-catalog";

/**
 * Homepage-only miniature of a real template. The full renderer is scaled
 * inside a clipped frame, so the showcase is always in sync with the actual
 * resume output without duplicating template markup.
 */
export function TemplatePreview({
  template,
  height = "h-[300px] sm:h-[330px]",
}: {
  template: ResumeTemplateId;
  height?: string;
}) {
  return (
    <div
      aria-hidden="true"
      className={`relative overflow-hidden bg-white ${height}`}
    >
      <div
        className="pointer-events-none absolute left-0 top-0 origin-top-left select-none"
        style={{ width: "180%", transform: "scale(0.5556)" }}
      >
        <ResumeTemplate template={template} resume={SAMPLE_RESUME} />
      </div>
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-white via-white/75 to-transparent" />
    </div>
  );
}
