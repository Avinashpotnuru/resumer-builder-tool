import mammoth from "mammoth";
import { normalizeResumeText } from "@/lib/resume-text-normalization";

export type DocxExtractionSuccess = {
  success: true;
  paragraphs: string[];
  originalText: string;
  text: string;
  characterCount: number;
};

export type DocxExtractionErrorCode = "empty-file" | "no-text" | "corrupted" | "unreadable";

export type DocxExtractionFailure = {
  success: false;
  code: DocxExtractionErrorCode;
  error: string;
};

export type DocxExtractionResult = DocxExtractionSuccess | DocxExtractionFailure;

const ERROR_MESSAGES: Record<DocxExtractionErrorCode, string> = {
  "empty-file": "This document is empty. Choose a different file.",
  "no-text": "No selectable text was found in this document.",
  corrupted: "This document could not be read. It may be corrupted. Try a different file.",
  unreadable: "We could not read the text from this document. Try a different file.",
};

// Paragraph breaks are represented by one or more blank lines.
const PARAGRAPH_SEPARATOR = /\r\n\r\n|\r\r|\n\n/;

function failure(code: DocxExtractionErrorCode): DocxExtractionFailure {
  return { success: false, code, error: ERROR_MESSAGES[code] };
}

/**
 * Extracts raw text from a DOCX document, preserving paragraphs and line breaks.
 * Runs in the browser because Mammoth works on ArrayBuffers.
 */
export async function extractDocxText(file: Blob): Promise<DocxExtractionResult> {
  if (file.size === 0) {
    return failure("empty-file");
  }

  try {
    const result = await mammoth.extractRawText({ arrayBuffer: await file.arrayBuffer() });
    const paragraphs = result.value
      .split(PARAGRAPH_SEPARATOR)
      .map((paragraph) => paragraph.trim())
      .filter((paragraph) => paragraph.length > 0);
    const originalText = paragraphs.join("\n\n");
    const text = normalizeResumeText(originalText);

    if (text.length === 0) {
      return failure("no-text");
    }

    return {
      success: true,
      paragraphs,
      originalText,
      text,
      characterCount: text.length,
    };
  } catch {
    return failure("corrupted");
  }
}
