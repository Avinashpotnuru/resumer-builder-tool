const LINE_BREAK_PATTERN = /\r\n|\r|\n/;

function normalizeLineBreaks(text: string): string {
  return text.replace(LINE_BREAK_PATTERN, "\n");
}

function normalizeParagraphs(text: string): string[] {
  return text
    .split(/\n{2,}/)
    .map((paragraph) =>
      paragraph
        .split("\n")
        .map((line) => line.replace(/[ \t]{2,}/g, " ").trim())
        .filter((line) => line.length > 0)
        .join("\n"),
    )
    .filter((paragraph) => paragraph.length > 0);
}

/**
 * Normalizes extracted resume text for review and downstream processing:
 * consistent line endings, trimmed lines/paragraphs, collapsed repeated
 * whitespace, and no empty paragraphs. Meaningful paragraphs and headings are
 * preserved.
 */
export function normalizeResumeText(rawText: string): string {
  const normalized = normalizeLineBreaks(rawText);
  const paragraphs = normalizeParagraphs(normalized);

  return paragraphs.join("\n\n").trim();
}
