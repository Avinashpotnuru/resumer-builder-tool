const BULLET_GLYPHS = "•·▪◦‣∙○●■□➢➤➥➔➜✓✔";

/**
 * Supports normal bullet markers plus the private-use glyphs (for example
 * U+F0B7) that PDF and DOCX extraction often emits from symbol fonts.
 */
const LEADING_BULLET_PATTERN = new RegExp(
  `^[\\s\\u00A0]*(?:[-*]\\s+|(?:[${BULLET_GLYPHS}]|[\\uE000-\\uF8FF])\\s*)`,
);

export function isBulletLine(line: string): boolean {
  return LEADING_BULLET_PATTERN.test(line);
}

export function stripBulletMarker(line: string): string {
  return line.replace(LEADING_BULLET_PATTERN, "").trim();
}
