import type { PDFDocumentLoadingTask, PDFDocumentProxy } from "pdfjs-dist";
import type { TextItem, TextMarkedContent } from "pdfjs-dist/types/src/display/api";
import { normalizeResumeText } from "@/lib/resume-text-normalization";

export type PdfPageText = {
  pageNumber: number;
  text: string;
};

export type PdfExtractionSuccess = {
  success: true;
  pageCount: number;
  pages: PdfPageText[];
  originalText: string;
  text: string;
  characterCount: number;
};

export type PdfExtractionErrorCode =
  | "empty-file"
  | "no-text"
  | "password-protected"
  | "corrupted"
  | "unreadable";

export type PdfExtractionFailure = {
  success: false;
  code: PdfExtractionErrorCode;
  error: string;
};

export type PdfExtractionResult = PdfExtractionSuccess | PdfExtractionFailure;

const ERROR_MESSAGES: Record<PdfExtractionErrorCode, string> = {
  "empty-file": "This PDF is empty. Choose a different file.",
  "no-text": "No selectable text was found in this PDF. It may be a scanned document.",
  "password-protected": "This PDF is password protected. Remove the password and try again.",
  corrupted: "This PDF could not be read. It may be corrupted. Try a different file.",
  unreadable: "We could not read the text from this PDF. Try a different file.",
};

// Text items within this vertical distance belong to the same visual line.
const LINE_Y_TOLERANCE = 1;

type PdfjsModule = typeof import("pdfjs-dist");

let pdfjsPromise: Promise<PdfjsModule> | null = null;

function loadPdfjs(): Promise<PdfjsModule> {
  if (!pdfjsPromise) {
    pdfjsPromise = import("pdfjs-dist").then((pdfjs) => {
      pdfjs.GlobalWorkerOptions.workerSrc = new URL(
        "pdfjs-dist/build/pdf.worker.min.mjs",
        import.meta.url,
      ).toString();

      return pdfjs;
    });
  }

  return pdfjsPromise;
}

function failure(code: PdfExtractionErrorCode): PdfExtractionFailure {
  return { success: false, code, error: ERROR_MESSAGES[code] };
}

function isTextItem(item: TextItem | TextMarkedContent): item is TextItem {
  return "str" in item;
}

function normalizePageText(text: string): string {
  return text
    .replace(/\r\n?/g, "\n")
    .split("\n")
    .map((line) => line.replace(/[ \t]+$/g, ""))
    .join("\n")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

/**
 * Joins positioned text items back into readable lines.
 * A new line starts when the vertical position changes, and `hasEOL`
 * marks an explicit line break in the source document.
 */
function extractPageText(items: Array<TextItem | TextMarkedContent>): string {
  const lines: string[] = [];
  let currentLine = "";
  let previousY: number | null = null;

  for (const item of items) {
    if (!isTextItem(item)) {
      continue;
    }

    const y = item.transform[5] ?? null;

    if (
      currentLine !== "" &&
      previousY !== null &&
      y !== null &&
      Math.abs(y - previousY) > LINE_Y_TOLERANCE
    ) {
      lines.push(currentLine);
      currentLine = "";
    }

    currentLine += item.str;

    if (item.hasEOL) {
      lines.push(currentLine);
      currentLine = "";
      previousY = null;
    } else {
      previousY = y;
    }
  }

  if (currentLine !== "") {
    lines.push(currentLine);
  }

  return normalizePageText(lines.join("\n"));
}

function getErrorName(error: unknown): string | null {
  if (typeof error === "object" && error !== null && "name" in error) {
    const name = (error as { name?: unknown }).name;
    return typeof name === "string" ? name : null;
  }

  return null;
}

function toErrorCode(error: unknown): PdfExtractionErrorCode {
  const name = getErrorName(error);

  if (name === "PasswordException") {
    return "password-protected";
  }

  if (name === "InvalidPDFException" || name === "FormatError") {
    return "corrupted";
  }

  return "unreadable";
}

/**
 * Extracts selectable text from a PDF, page by page.
 * Runs in the browser because PDF.js uses a web worker.
 */
export async function extractPdfText(file: Blob): Promise<PdfExtractionResult> {
  if (file.size === 0) {
    return failure("empty-file");
  }

  let loadingTask: PDFDocumentLoadingTask | null = null;

  try {
    const pdfjs = await loadPdfjs();
    const data = new Uint8Array(await file.arrayBuffer());
    loadingTask = pdfjs.getDocument({ data });

    const pdf: PDFDocumentProxy = await loadingTask.promise;

    const pages: PdfPageText[] = [];

    for (let pageNumber = 1; pageNumber <= pdf.numPages; pageNumber += 1) {
      const page = await pdf.getPage(pageNumber);

      try {
        const content = await page.getTextContent();
        pages.push({ pageNumber, text: extractPageText(content.items) });
      } finally {
        page.cleanup();
      }
    }

    const originalText = pages
      .map((page) => page.text)
      .filter((pageText) => pageText.length > 0)
      .join("\n\n")
      .trim();
    const text = normalizeResumeText(originalText);

    if (text.length === 0) {
      return failure("no-text");
    }

    return {
      success: true,
      pageCount: pdf.numPages,
      pages,
      originalText,
      text,
      characterCount: text.length,
    };
  } catch (error) {
    return failure(toErrorCode(error));
  } finally {
    if (loadingTask) {
      await loadingTask.destroy().catch(() => undefined);
    }
  }
}
