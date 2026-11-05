type IconProps = {
  className?: string;
};

const baseProps = {
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.6,
  strokeLinecap: "round",
  strokeLinejoin: "round",
  "aria-hidden": true,
  focusable: "false",
} as const;

export function LogoIcon({ className }: IconProps) {
  return (
    <svg {...baseProps} className={className} strokeWidth={1.7}>
      <path d="M13.5 3.5H7.5A1.5 1.5 0 0 0 6 5v14a1.5 1.5 0 0 0 1.5 1.5h9A1.5 1.5 0 0 0 18 19V8l-4.5-4.5Z" />
      <path d="M13.5 3.5V8H18" />
      <path d="M9 12.5h6M9 16h3.5" />
    </svg>
  );
}

export function DashboardIcon({ className }: IconProps) {
  return (
    <svg {...baseProps} className={className}>
      <rect x="3.5" y="3.5" width="7" height="7" rx="1.5" />
      <rect x="13.5" y="3.5" width="7" height="7" rx="1.5" />
      <rect x="3.5" y="13.5" width="7" height="7" rx="1.5" />
      <rect x="13.5" y="13.5" width="7" height="7" rx="1.5" />
    </svg>
  );
}

export function DocumentPlusIcon({ className }: IconProps) {
  return (
    <svg {...baseProps} className={className}>
      <path d="M14 3.5H7a2 2 0 0 0-2 2v13a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8.5L14 3.5Z" />
      <path d="M14 3.5v5h5" />
      <path d="M12 12v5M9.5 14.5h5" />
    </svg>
  );
}

export function FilesIcon({ className }: IconProps) {
  return (
    <svg {...baseProps} className={className}>
      <path d="M7.5 7.5V5.5A2 2 0 0 1 9.5 3.5h5.2L19 7.8v8.7a2 2 0 0 1-2 2h-1.5" />
      <rect x="5" y="7.5" width="9.5" height="13" rx="2" />
      <path d="M8 12h3.5M8 15.5h3.5" />
    </svg>
  );
}

export function MenuIcon({ className }: IconProps) {
  return (
    <svg {...baseProps} className={className}>
      <path d="M4 7h16M4 12h16M4 17h16" />
    </svg>
  );
}

export function CloseIcon({ className }: IconProps) {
  return (
    <svg {...baseProps} className={className}>
      <path d="M6 6l12 12M18 6L6 18" />
    </svg>
  );
}

export function UserIcon({ className }: IconProps) {
  return (
    <svg {...baseProps} className={className}>
      <path d="M12 12.5a4 4 0 1 0 0-8 4 4 0 0 0 0 8Z" />
      <path d="M4.5 20.5a7.5 7.5 0 0 1 15 0" />
    </svg>
  );
}

export function ArrowRightIcon({ className }: IconProps) {
  return (
    <svg {...baseProps} className={className}>
      <path d="M5 12h14M13 6l6 6-6 6" />
    </svg>
  );
}

export function TargetIcon({ className }: IconProps) {
  return (
    <svg {...baseProps} className={className}>
      <circle cx="12" cy="12" r="8" />
      <circle cx="12" cy="12" r="4.5" />
      <circle cx="12" cy="12" r="1" fill="currentColor" stroke="none" />
    </svg>
  );
}

export function ClockIcon({ className }: IconProps) {
  return (
    <svg {...baseProps} className={className}>
      <circle cx="12" cy="12" r="8.5" />
      <path d="M12 7.5V12l3 1.8" />
    </svg>
  );
}

export function UploadIcon({ className }: IconProps) {
  return (
    <svg {...baseProps} className={className}>
      <path d="M12 15.5V4.5M8.5 8L12 4.5 15.5 8" />
      <path d="M4.5 14.5v3a2 2 0 0 0 2 2h11a2 2 0 0 0 2-2v-3" />
    </svg>
  );
}

export function CheckIcon({ className }: IconProps) {
  return (
    <svg {...baseProps} className={className} strokeWidth={2}>
      <path d="M5 12.5l4.5 4.5L19 7.5" />
    </svg>
  );
}

export function PlusIcon({ className }: IconProps) {
  return (
    <svg {...baseProps} className={className}>
      <path d="M12 5v14M5 12h14" />
    </svg>
  );
}

export function TrashIcon({ className }: IconProps) {
  return (
    <svg {...baseProps} className={className}>
      <path d="M3 6h18M3 6v14a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V6M8 6V4a1 1 0 0 1 1-1h6a1 1 0 0 1 1 1v2M16 6V4a1 1 0 0 0-1-1h-4a1 1 0 0 0-1 1v2" />
    </svg>
  );
}

export function ChevronUpIcon({ className }: IconProps) {
  return (
    <svg {...baseProps} className={className}>
      <path d="M6 14.5l6-6 6 6" />
    </svg>
  );
}

export function ChevronDownIcon({ className }: IconProps) {
  return (
    <svg {...baseProps} className={className}>
      <path d="M6 9.5l6 6 6-6" />
    </svg>
  );
}

export function HelpIcon({ className }: IconProps) {
  return (
    <svg {...baseProps} className={className}>
      <circle cx="12" cy="12" r="9" />
      <path d="M9.5 9.2a2.5 2.5 0 0 1 4.9.7c0 1.7-2.4 2.1-2.4 3.6" />
      <path d="M12 16.6h.01" />
    </svg>
  );
}

export function ShieldIcon({ className }: IconProps) {
  return (
    <svg {...baseProps} className={className}>
      <path d="M12 3.5 5 6v5.2c0 4.5 3 8.6 7 10.3 4-1.7 7-5.8 7-10.3V6l-7-2.5Z" />
      <path d="m9.4 12 1.8 1.8 3.4-3.8" />
    </svg>
  );
}

export function PenIcon({ className }: IconProps) {
  return (
    <svg {...baseProps} className={className}>
      <path d="M4 20l1-4L14.5 6.5a2.12 2.12 0 0 1 3 3L8 19l-4 1Z" />
      <path d="m13 8 3 3" />
    </svg>
  );
}

export function LayersIcon({ className }: IconProps) {
  return (
    <svg {...baseProps} className={className}>
      <path d="m12 3 9 5-9 5-9-5 9-5Z" />
      <path d="m3 13 9 5 9-5" />
    </svg>
  );
}

export function DownloadIcon({ className }: IconProps) {
  return (
    <svg {...baseProps} className={className}>
      <path d="M12 4v10" />
      <path d="m8 10.5 4 4 4-4" />
      <path d="M5 18h14" />
    </svg>
  );
}
