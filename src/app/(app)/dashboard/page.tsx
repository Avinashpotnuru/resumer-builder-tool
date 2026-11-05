import { ActionLink } from "@/components/ui/action-link";
import { DashboardContent } from "@/components/dashboard/dashboard-content";

export default function DashboardPage() {
  return (
    <div className="w-full space-y-10">
      <section className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
        <div className="max-w-2xl space-y-3">
          <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-primary">
            Overview
          </p>
          <h2 className="text-3xl font-bold leading-tight tracking-tight text-ink sm:text-4xl">
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
