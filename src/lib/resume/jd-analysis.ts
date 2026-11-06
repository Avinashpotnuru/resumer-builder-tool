import { compareResumeAndJd } from "../skills/compare-skills";
import { extractSkills } from "../skills/extract-skills";
import {
  SKILL_DICTIONARY,
  normalizeSkill,
} from "../skills/skill-dictionary";
import type { Skill } from "../skills/skill-dictionary";
import { stripBulletMarker } from "./bullet-text";

export type JdRequirementKind = "required" | "preferred";

export type JdRequirement = {
  name: string;
  kind: JdRequirementKind;
};

export type JdRequirementAnalysis = {
  requirements: JdRequirement[];
  requiredSkills: Skill[];
  preferredSkills: Skill[];
  responsibilities: string[];
};

export type JdSkillStatus =
  | "matched"
  | "confirmed"
  | "unconfirmed"
  | "not-possessed"
  | "partial";

export type JdCoverage = {
  requirements: JdRequirement[];
  matchedSkills: Skill[];
  confirmedMissingSkills: Skill[];
  unconfirmedMissingSkills: Skill[];
  notPossessedSkills: Skill[];
  partiallyMatchingSkills: Skill[];
  /** Everything the generated resume is allowed to present as possessed. */
  possessedSkills: Skill[];
  responsibilities: string[];
};

export type JdCoverageInput = {
  resumeText: string;
  jdText: string;
  /** Raw candidate choices keyed by canonical skill name. */
  confirmations: Record<string, "confirmed" | "not-possessed">;
};

const REQUIRED_MARKERS =
  /^(required|requirements|required skills|required qualifications|must have|must-have|what you bring|what you'll bring|what you need|what we need|minimum qualifications|minimum requirements|posted ability|qualifications)\s*:?$/i;
const PREFERENCE_MARKERS =
  /^(preferred|preferred skills|preferred qualifications|nice to have|nice-to-have|bonus|desirable|plus)\s*:?$/i;
const RESPONSIBILITIES_MARKERS =
  /^(responsibilities|what you'll do|what you will do|role overview|about the role|key responsibilities|day to day|duties|what the role involves)\s*:?$/i;

type RequirementSection =
  | "required"
  | "preferred"
  | "responsibilities"
  | "general";

function splitLines(text: string): string[] {
  return text
    .replace(/\r\n?/g, "\n")
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);
}

function markerSection(line: string): RequirementSection | null {
  const value = line.trim().replace(/:$/, "").trim();
  if (REQUIRED_MARKERS.test(value)) return "required";
  if (PREFERENCE_MARKERS.test(value)) return "preferred";
  if (RESPONSIBILITIES_MARKERS.test(value)) return "responsibilities";
  return null;
}

function findSkills(line: string): Skill[] {
  return extractSkills(line).skills;
}

/**
 * Splits a JD into candidate-relevant sections and the dictionary skills that
 * appear in it. Lines under explicit responsibilities headers are preserved
 * separately so the caller can display them, but their skills still count.
 */
export function analyzeJobDescription(jdText: string): JdRequirementAnalysis {
  const sections: Array<{ section: RequirementSection; line: string }> = [];

  let current: RequirementSection = "general";
  for (const line of splitLines(jdText)) {
    const marker = markerSection(line);
    if (marker) {
      current = marker;
      sections.push({ section: current, line });
      continue;
    }

    sections.push({ section: current, line });
  }

  const seen = new Map<string, JdRequirementKind>();
  const responsibilities: string[] = [];

  for (const { section, line } of sections) {
    if (markerSection(line)) continue;

    if (section === "responsibilities") {
      responsibilities.push(stripBulletMarker(line));
    }

    const kind: JdRequirementKind = section === "required" ? "required" : "preferred";
    for (const skill of findSkills(line)) {
      const existing = seen.get(skill.name);
      if (existing === undefined) {
        seen.set(skill.name, kind);
      } else if (existing === "preferred" && kind === "required") {
        // A skill seen under uncategorized/preferred and later in required is required.
        seen.set(skill.name, "required");
      }
    }
  }

  const requiredSkills: Skill[] = [];
  const preferredSkills: Skill[] = [];

  for (const [name, kind] of seen) {
    const skill = SKILL_DICTIONARY.find((item) => item.name === name);
    if (!skill) continue;
    if (kind === "required") requiredSkills.push(skill);
    else preferredSkills.push(skill);
  }

  const requirements: JdRequirement[] = [
    ...requiredSkills.map((name) => ({ name: name.name, kind: "required" as const })),
    ...preferredSkills.map((name) => ({ name: name.name, kind: "preferred" as const })),
  ];

  return {
    requirements,
    requiredSkills,
    preferredSkills,
    responsibilities,
  };
}

function escapeRegExp(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function isPartialMatch(jdSkill: Skill, resumeText: string): boolean {
  const normalizedResume = normalizeSkill(resumeText);
  const tokens = normalizeSkill(jdSkill.name).split(" ").filter((token) => token.length >= 3);
  return tokens.some((token) =>
    new RegExp(`(?<![a-zA-Z0-9.])${escapeRegExp(token)}(?![a-zA-Z0-9.])`, "i").test(normalizedResume),
  );
}

function dedupeSkills(skills: readonly Skill[]): Skill[] {
  const seen = new Set<string>();
  return skills.filter((skill) => {
    if (seen.has(skill.name)) return false;
    seen.add(skill.name);
    return true;
  });
}

/**
 * Builds the deterministic coverage result for a resume against a JD.
 * A skill counts as possessed only when it was matched in the resume or the candidate
 * confirmed they possess it; partial token matches never count.
 */
export function coverageForJobDescription(input: JdCoverageInput): JdCoverage {
  const { resumeText, jdText, confirmations } = input;
  const analysis = analyzeJobDescription(jdText);
  const allSkills = dedupeSkills([...analysis.requiredSkills, ...analysis.preferredSkills]);
  const comparison = compareResumeAndJd(resumeText, jdText);
  const matched = dedupeSkills(comparison.matchedSkills);
  const matchedNames = new Set(matched.map((skill) => skill.name));
  const partial = new Map<string, Skill>();
  const missing = new Map<string, Skill>();
  const confirmed: Skill[] = [];
  const unconfirmed: Skill[] = [];
  const notPossessed: Skill[] = [];

  for (const skill of allSkills) {
    if (matchedNames.has(skill.name)) continue;

    if (isPartialMatch(skill, resumeText)) {
      partial.set(skill.name, skill);
    }

    const status = confirmations[skill.name];
    if (status === "confirmed") confirmed.push(skill);
    else if (status === "not-possessed") notPossessed.push(skill);
    else {
      missing.set(skill.name, skill);
      unconfirmed.push(skill);
    }
  }

  const possessed = dedupeSkills([...matched, ...confirmed]);

  return {
    requirements: analysis.requirements,
    matchedSkills: matched,
    confirmedMissingSkills: confirmed,
    unconfirmedMissingSkills: unconfirmed,
    notPossessedSkills: notPossessed,
    partiallyMatchingSkills: [...partial.values()],
    possessedSkills: possessed,
    responsibilities: analysis.responsibilities,
  };
}
