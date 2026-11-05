# HonestCV - Resume Builder & Resume Tailoring SaaS

**HonestCV** is a premium, public-facing SaaS website that helps candidates tailor their existing resume to a specific job description — without using AI. It uses deterministic rules against a maintained skill dictionary, keeps every company/project record independent, and never fabricates skills or experience.

---

## Features

### Core Workflows
- **Upload & Tailor**: Upload a PDF/DOCX resume, paste a job description, see matched/partial/missing skills, confirm what's true, and generate a separate job-specific resume.
- **Create from Resume**: Upload an existing resume, auto-populate editable fields, refine everything, pick a template, and export — no job description required.
- **Blank Resume**: Start from scratch and build a resume section by section.

### Editable Resume Fields
- **Personal Information**: Full name, title, email, phone, city/state/country, LinkedIn, GitHub, portfolio, website
- **Professional Summary**: Editable text area
- **Skills**: Categorized skills (languages, frameworks, tools, databases, etc.) with category prefixes
- **Work Experience**: Title, company, employment type, location, dates, "currently working" checkbox, bullet achievements — reorderable
- **Projects**: Name, description, technologies, URL, GitHub URL, dates, bullet achievements — independent records
- **Education**: Degree, specialization, institution, location, dates, grade
- **Certifications**: Name, issuer, issue/expiration dates, credential URL
- **Additional Sections**: Achievements, awards, publications, languages, volunteer experience, interests

### Resume Templates (Eight ATS-Friendly Layouts)
1. Professional Classic
2. Modern ATS
3. Compact ATS
4. Technical ATS
5. Minimal ATS
6. Entry-Level ATS
7. Executive ATS
8. Project-Focused ATS

All templates share the same data model — switch templates anytime without losing data.

### Export
- **PDF**: Browser print-to-PDF with print-optimized CSS
- **DOCX**: Fully editable Word document via `docx` library

### Data Privacy
- Everything is processed locally in the browser (PDF/DOCX parsing via pdf.js, DOCX via mammoth)
- Resumes are stored in `localStorage` — nothing is uploaded to a server
- Original resumes are treated as read-only; tailored versions are stored separately

---

## Tech Stack

| Layer | Technology |
|-------|------------|
| Framework | Next.js 16.4.3 (App Router) |
| Language | TypeScript (strict mode) |
| Styling | Tailwind CSS v4 |
| State Management | Zustand |
| PDF Parsing | pdfjs-dist |
| DOCX Parsing | mammoth |
| DOCX Generation | docx |
| Icons | Custom SVG icons |

---

## Project Structure

```
resume builder/
├── src/
│   ├── app/
│   │   ├── layout.ts                 # Root layout with fonts & metadata
│   │   ├── globals.css               # Design tokens, Tailwind config, print styles
│   │   ├── page.tsx                  # Landing page (editorial landing page)
│   │   ├── layout.tsx
│   │   ├── templates/
│   │   │   ├── page.tsx              # Template gallery
│   │   │   └── [id]/page.tsx         # Template detail preview
│   │   └── (app)/                    # Workspace routes (authenticated shell)
│   │       ├── layout.tsx            # App shell with sidebar
│   │       ├── dashboard/page.tsx    # Dashboard with real stats
│   │       ├── resumes/page.tsx      # Resume library
│   │       ├── resumes/[id]/page.tsx # Resume editor
│   │       ├── resumes/new/page.tsx  # Resume creation entry (two options)
│   │       ├── resumes/tailor/page.tsx # Tailor for a job workflow
│   │       └── resumes/create/page.tsx # Create from resume workflow
│   ├── components/
│   │   ├── public/
│   │   │   ├── public-header.tsx     # Public header with help modal
│   │   │   ├── public-footer.tsx     # Public footer
│   │   │   ├── hero-visual.tsx       # Hero visual with live template render
│   │   │   ├── template-thumbnail.tsx # Template thumbnail with live render
│   │   │   ├── template-card.tsx     # Template card component
│   │   │   ├── template-gallery.tsx  # Template gallery with category filter
│   │   │   └── resume-template-inline.tsx # Inline template renderer
│   │   ├── create-resume/
│   │   │   ├── resume-workflow.tsx   # Tailor workflow (upload → JD → analyze)
│   |   │   ├── create-from-resume.tsx # Create from resume (upload → prefill → edit)
│   |   │   ├── start-options.tsx     # Blank resume option
│   |   │   ├── resume-upload.tsx     # PDF/DOCX upload with drag-drop
│   |   │   ├── resume-workflow.tsx   # Tailor workflow
│   |   │   ├── job-description-form.tsx # JD input + role details
│   |   │   ├── analysis-summary.tsx  # Skill comparison results
│   |   │   ├── resume-editor.tsx     # Main editor (desktop + mobile preview)
│   |   │   ├── personal-info-editor.tsx
│   |   │   ├── certifications-editor.tsx
│   |   │   ├── additional-sections-editor.tsx
│   |   │   ├── resume-preview.tsx    # Live preview with PDF/DOCX export
│   |   │   ├── resume-templates.tsx   # Eight template components (shared renderer)
│   |   │   └── resume-upload.tsx     # Resume upload component
│   ├── dashboard/
│   │   └── dashboard-content.tsx   # Dashboard stats & recent resumes
│   ├── layout/
│   │   ├── app-shell.tsx           # Workspace shell (sidebar + header)
│   │   ├── header.tsx              # Workspace header
│   │   └── sidebar.tsx             # Workspace sidebar
│   ├── ui/
│   │   ├── action-link.tsx         # Styled link component
│   │   ├── empty-state.tsx         # Empty state component
│   │   ├── icons.tsx               # Custom SVG icons
│   │   └── step-indicator.tsx      # Step progress indicator
│   └── workspace/
│       └── welcome-modal.tsx       # First-time welcome modal
├── lib/
│   ├── resume/
│   │   ├── editor-store.ts         # Zustand store (resume state + actions)
│   |   ├── template-catalog.ts     # Eight template catalog & legacy ID mapping
│   |   ├── parse-resume-text.ts    # PDF/DOCX text parser
│   |   ├── docx-export.ts          # DOCX export generator
│   |   ├── persistence.ts          # localStorage persistence
│   |   ├── source-tracking.ts      # Original vs optimized resume tracking
│   |   ├── build-tailored-resume.ts # Tailoring pipeline
│   |   ├── jd-analysis.ts          # JD skill extraction
│   |   ├── categorize-skills.ts    # Skill categorization
│   |   └── sample-resume.ts        # Sample resume for previews
│   ├── skills/
│   │   ├── skill-dictionary.ts     # Skill dictionary
│   |   |── extract-skills.ts       # Skill extraction
│   |   |── prioritize-experience.ts
│   |   |── prioritize-projects.ts
│   |   |-- prioritize-skills.ts
│   |   |-- generate-summary.ts
│   |   |-- calculate-skill-match.ts
│   |   |-- compare-skills.ts
│   |   |-- extract-resume-skills.ts
│   ├── resume-upload.ts            # File validation
│   ├── navigation.ts               # Navigation config
│   └── use-resume-library.ts       # Resume library hook
├── docs/
│   ├── PROJECT.md                  # Product brief
│   └── TASKS.md                    # Development tasks
├── public/
│   └── ...
├── package.json
├── next.config.ts
├── tailwind.config.ts
├── tsconfig.json
└── .eslintrc.json
```

---

## Getting Started

### Prerequisites
- Node.js 18+
- npm, yarn, or pnpm

### Install
```bash
cd "resume builder"
npm install
```

### Development
```bash
npm run dev
```
Open `http://localhost:3000`.

### Production Build
```bash
npm run build
npm start
```

### Lint & Type Check
```bash
npx tsc --noEmit
npx eslint src/
```

---

## Design System

The project uses a premium Swiss-inspired minimal design system defined in `src/app/globals.css`:

- **Primary**: `#1E3A5F` (navy)
- **Accent**: `#16A34A` (green)
- **Background**: `#F8FAFC`
- **Surface**: `#FFFFFF`
- **Ink**: `#0F172A`
- **Muted**: `#64748B`
- **Border**: `#CBD5E1`

Fonts: Geist Sans & Geist Mono (via Next.js fonts).

---

## Key Design Decisions

- **No AI**: All tailoring is deterministic — rules-based skill matching against a maintained dictionary
- **Independent Records**: Every company, project, and education entry is stored as a separate record — never merged or flattened
- **Original Stays Original**: Original resumes are read-only; tailored versions are separate copies
- **Local Storage**: All data persists in browser localStorage — nothing is uploaded
- **Preview = Document**: PDF/DOCX exports use the same template and content as the live preview
- **Template Independence**: Changing templates never destroys resume data — all eight templates share one data model

---

## License

MIT