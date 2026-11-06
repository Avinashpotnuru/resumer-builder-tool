import { CheckIcon } from "@/components/ui/icons";

type StepIndicatorProps = {
  steps: readonly string[];
  current?: number;
};

export function StepIndicator({ steps, current = 1 }: StepIndicatorProps) {
  return (
    <ol aria-label="Form progress" className="relative grid grid-cols-3">
      <span
        aria-hidden="true"
        className="absolute left-[16.6%] right-[16.6%] top-3.5 h-px bg-line"
      />

      {steps.map((label, index) => {
        const stepNumber = index + 1;
        const isCurrent = stepNumber === current;
        const isComplete = stepNumber < current;

        return (
          <li
            key={label}
            aria-current={isCurrent ? "step" : undefined}
            className="relative flex flex-col items-center gap-2.5 text-center"
          >
            <span
              className={[
                "relative z-10 flex h-7 w-7 items-center justify-center rounded-full border text-[11px] font-semibold tabular-nums",
                isCurrent
                  ? "border-primary bg-primary text-primary-foreground shadow-[0_0_0_4px_var(--color-accent-soft)]"
                  : isComplete
                    ? "border-accent/30 bg-accent-soft text-accent-strong"
                    : "border-line bg-card text-muted",
              ].join(" ")}
            >
              {isComplete ? <CheckIcon className="h-3.5 w-3.5" /> : stepNumber}
            </span>
            <span
              className={[
                "max-w-[110px] text-[11px] leading-4 sm:text-xs",
                isCurrent ? "font-medium text-ink" : "text-muted",
              ].join(" ")}
            >
              {label}
            </span>
          </li>
        );
      })}
    </ol>
  );
}
