import type { Metadata } from "next";
import { Fraunces, Geist, Geist_Mono } from "next/font/google";
import { THEME_INIT_SCRIPT } from "@/lib/theme";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const fraunces = Fraunces({
  variable: "--font-fraunces",
  subsets: ["latin"],
  style: ["normal", "italic"],
});

export const metadata: Metadata = {
  title: {
    default: "HonestCV - Resume builder & ATS tailoring",
    template: "%s · HonestCV",
  },
  description:
    "Tailor the resume you already have to the job you want. Upload a PDF or DOCX, review matched and missing skills honestly, choose an ATS-friendly template, and export to PDF or Word.",
  openGraph: {
    title: "HonestCV - Resume builder & ATS tailoring",
    description:
      "ATS-friendly templates, honest skill matching, and one-click PDF and DOCX export.",
    type: "website",
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} ${fraunces.variable} antialiased`}
      suppressHydrationWarning
    >
      <body className="min-h-dvh bg-canvas text-ink">
        <script dangerouslySetInnerHTML={{ __html: THEME_INIT_SCRIPT }} />
        {children}
      </body>
    </html>
  );
}
