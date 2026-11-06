import { ActionLink } from "@/components/ui/action-link";
import { DashboardContent } from "@/components/dashboard/dashboard-content";

export default function DashboardPage() {
  return (
    <div className="w-full space-y-10">
      <section className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
        <div className="max-w-2xl space-y-3">
          <p className="flex items-center gap-3 text-[10px] font-semibold uppercase tracking-[0.22em] text-accent">
            <span aria-hidden="true" className="h-px w-7 bg-accent" />
            Overview
          </p>
          <h2 className="font-heading text-4xl font-semibold leading-[1.02] tracking-[-0.03em] text-ink sm:text-5xl">
            Welcome to HonestCV
          </h2>
          <p className="max-w-xl text-sm leading-6 text-muted sm:text-[15px]">
            Build a clear, professional resume and keep every version organised
            in one quiet workspace.
          </p>
        </div>

        <div className="shrink-0">
          <ActionLink href="/resumes/new">Create New Resume</ActionLink>
        </div>
      </section>

      <DashboardContent />
    </div>
  );
}
