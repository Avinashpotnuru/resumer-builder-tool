import type { EditorResumeData } from "./editor-store";

/**
 * Sample resume used for marketing thumbnails and template previews.
 * This data is illustrative and never stored as a candidate's resume.
 * It deliberately exercises multiple companies and projects so
 * template previews show realistic, independent records.
 */
export const SAMPLE_RESUME: EditorResumeData = {
  jobTitle: "Maya Ellison",
  professionalSummary:
    "Frontend engineer focused on design systems, accessible interfaces, and fast, reliable storefronts. Five years shipping product with React and TypeScript across retail and logistics.",
  skills: [
    "Languages: TypeScript, JavaScript, HTML, CSS",
    "Frameworks: React, Next.js, Astro",
    "Tools: Git, GitHub Actions, Playwright, Figma",
    "Databases: PostgreSQL, Redis",
  ],
  experience: [
    {
      id: "sample-exp-1",
      jobTitle: "Senior Frontend Engineer",
      companyName: "Northwind Retail Group",
      employmentType: "Full-time",
      location: "Chicago, IL",
      startDate: "2022-04",
      endDate: null,
      isCurrent: true,
      description: "",
      achievements: [
        "Own the storefront design system used across 14 surfaces; cut component duplication by 60%.",
        "Rebuilt product pages in React Server Components, lifting Core Web Vitals pass rate from 68% to 94%.",
      ],
    },
    {
      id: "sample-exp-2",
      jobTitle: "Frontend Engineer",
      companyName: "Helio Freight",
      employmentType: "Full-time",
      location: "Remote",
      startDate: "2019-06",
      endDate: "2022-03",
      description: "",
      achievements: [
        "Shipped dispatcher dashboards handling 4,000+ shipments per day with sub-second table load times.",
        "Introduced component-level visual regression testing, reducing UI regressions by 45%.",
      ],
    },
  ],
  projects: [
    {
      id: "sample-proj-1",
      name: "Meridian — Design System",
      description:
        "Accessible component library with tokens, dark mode, and docs generated from source.",
      technologies: ["TypeScript", "React", "Radix UI", "Storybook"],
      url: "example.com/meridian",
      githubUrl: "github.com/mayaellison/meridian",
      startDate: "2022-09",
      endDate: null,
      achievements: ["Adopted by 5 product teams; 90% component test coverage."],
    },
    {
      id: "sample-proj-2",
      name: "Routewise — Dispatcher Toolkit",
      description:
        "Keyboard-first route planner prototype exploring high-density table interactions.",
      technologies: ["React", "TanStack Table", "Vite"],
      githubUrl: "github.com/mayaellison/routewise",
      startDate: "2021-03",
      endDate: "2021-11",
      achievements: [],
    },
    {
      id: "sample-proj-3",
      name: "Price Lens",
      description:
        "Browser extension that compares unit prices across grocery chains.",
      technologies: ["JavaScript", "WebExtensions", "IndexedDB"],
      url: "example.com/pricelens",
      startDate: "2020-01",
      endDate: "2020-07",
      achievements: [],
    },
  ],
  education: [
    {
      id: "sample-edu-1",
      schoolName: "University of Illinois Urbana-Champaign",
      degree: "B.S.",
      fieldOfStudy: "Computer Science",
      startDate: "2015",
      endDate: "2019",
      location: "Urbana, IL",
      grade: "3.8 GPA",
    },
  ],
  personalInfo: {
    fullName: "Maya Ellison",
    professionalTitle: "Senior Frontend Engineer",
    email: "maya@example.com",
    phone: "(312) 555-0147",
    city: "Chicago",
    state: "IL",
    country: "USA",
    linkedin: "linkedin.com/in/mayaellison",
    github: "github.com/mayaellison",
    portfolio: "mayaellison.dev",
    website: "",
  },
  certifications: [
    {
      id: "sample-cert-1",
      name: "AWS Certified Cloud Practitioner",
      issuer: "Amazon Web Services",
      issueDate: "2023-05",
      expirationDate: "2026-05",
      credentialUrl: "",
    },
  ],
  additionalSections: [
    {
      id: "sample-add-1",
      title: "Languages",
      entries: [
        {
          id: "sample-lang-1",
          title: "Spanish",
          subtitle: "Professional working proficiency",
          date: "",
          description: "",
          url: "",
        },
        {
          id: "sample-lang-2",
          title: "English",
          subtitle: "Native",
          date: "",
          description: "",
          url: "",
        },
      ],
    },
  ],
};
