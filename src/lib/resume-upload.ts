export const ACCEPTED_RESUME_EXTENSIONS = [".pdf", ".docx"] as const;

export const RESUME_FILE_ACCEPT = ACCEPTED_RESUME_EXTENSIONS.join(",");

export const MAX_RESUME_FILE_SIZE_BYTES = 5 * 1024 * 1024;

export const MAX_RESUME_FILE_SIZE_LABEL = "5 MB";

export type ResumeFileValidation =
  | { valid: true }
  | { valid: false; error: string };

function getFileExtension(fileName: string): string {
  const dotIndex = fileName.lastIndexOf(".");

  if (dotIndex === -1) {
    return "";
  }

  return fileName.slice(dotIndex).toLowerCase();
}

/**
 * Validates a resume file by extension and size.
 * MIME types are not relied on because some browsers report an empty type
 * for files dragged in from the operating system.
 */
export function validateResumeFile(file: File): ResumeFileValidation {
  const extension = getFileExtension(file.name);
  const hasAcceptedExtension = (ACCEPTED_RESUME_EXTENSIONS as readonly string[]).includes(
    extension,
  );

  if (!hasAcceptedExtension) {
    return {
      valid: false,
      error: "That file type is not supported. Upload a PDF or DOCX file.",
    };
  }

  if (file.size === 0) {
    return {
      valid: false,
      error: "That file is empty. Choose a different file.",
    };
  }

  if (file.size > MAX_RESUME_FILE_SIZE_BYTES) {
    return {
      valid: false,
      error: `That file is larger than ${MAX_RESUME_FILE_SIZE_LABEL}. Choose a smaller file.`,
    };
  }

  return { valid: true };
}

export function formatResumeFileSize(bytes: number): string {
  if (bytes < 1024) {
    return `${bytes} B`;
  }

  const kilobytes = bytes / 1024;

  if (kilobytes < 1024) {
    return `${Math.round(kilobytes)} KB`;
  }

  return `${(kilobytes / 1024).toFixed(1)} MB`;
}
