export type NavIcon = "dashboard" | "create" | "resumes" | "templates";

export type NavItem = {
  href: string;
  label: string;
  icon: NavIcon;
};

export const navigation: NavItem[] = [
  { href: "/dashboard", label: "Dashboard", icon: "dashboard" },
  { href: "/resumes/new", label: "Create Resume", icon: "create" },
  { href: "/resumes", label: "My Resumes", icon: "resumes" },
  { href: "/templates", label: "Templates", icon: "templates" },
];

export function isActivePath(pathname: string, href: string): boolean {
  if (href === "/resumes") {
    return pathname === "/resumes";
  }

  return pathname === href || pathname.startsWith(`${href}/`);
}

const pageTitles: Array<{ href: string; label: string }> = [
  { href: "/resumes/new", label: "Create Resume" },
  { href: "/resumes/tailor", label: "Tailor Resume" },
  { href: "/resumes/create", label: "Create from Resume" },
];

export function getPageTitle(pathname: string): string {
  const current = navigation.find((item) => isActivePath(pathname, item.href));

  if (current) return current.label;

  const extra = pageTitles.find(
    (item) => pathname === item.href || pathname.startsWith(`${item.href}/`),
  );

  return extra?.label ?? "Dashboard";
}
