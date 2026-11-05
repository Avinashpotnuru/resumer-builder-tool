export type SkillCategory = {
  label: string;
  items: string[];
};

/**
 * Groups skills that are typed as "Category: skill, skill" lines into
 * categories. Everything else is grouped under "Technical skills".
 */
export function categorizeSkills(rawSkills: string[]): SkillCategory[] {
  const categories: SkillCategory[] = [];
  const order: string[] = [];
  const byName = new Map<string, SkillCategory>();

  const push = (label: string, item: string) => {
    const normalized = label.trim() || "Technical skills";
    let category = byName.get(normalized);

    if (!category) {
      category = { label: normalized, items: [] };
      byName.set(normalized, category);
      order.push(normalized);
      categories.push(category);
    }

    const trimmed = item.trim();
    if (trimmed && !category.items.includes(trimmed)) {
      category.items.push(trimmed);
    }
  };

  for (const raw of rawSkills) {
    const value = raw.trim();
    if (!value) continue;

    const separatorIndex = value.indexOf(":");
    if (separatorIndex > -1 && separatorIndex < value.length - 1) {
      const label = value.slice(0, separatorIndex).trim();
      const items = value
        .slice(separatorIndex + 1)
        .split(/[,;|]/)
        .map((item) => item.trim())
        .filter(Boolean);

      if (label.length > 0 && items.length > 0) {
        for (const item of items) {
          push(label, item);
        }
        continue;
      }
    }

    push("Technical skills", value);
  }

  return order
    .map((label) => byName.get(label))
    .filter((category): category is SkillCategory => Boolean(category))
    .filter((category) => category.items.length > 0);
}
