export type Skill = {
  name: string;
  aliases: readonly string[];
};

export const SKILL_DICTIONARY: readonly Skill[] = [
  { name: "React", aliases: ["React", "React.js", "ReactJS"] },
  { name: "Next.js", aliases: ["Next.js", "NextJS", "Next"] },
  { name: "JavaScript", aliases: ["JavaScript", "Javascript", "JS"] },
  { name: "TypeScript", aliases: ["TypeScript", "TypeScript.js", "TS"] },
  { name: "HTML", aliases: ["HTML", "Html", "HTML5"] },
  { name: "CSS", aliases: ["CSS", "Css", "CSS3"] },
  { name: "Tailwind CSS", aliases: ["Tailwind CSS", "Tailwind", "Tailwindcss"] },
  { name: "Bootstrap", aliases: ["Bootstrap", "Bootstrap CSS"] },
  { name: "Redux", aliases: ["Redux", "ReduxJS"] },
  { name: "Redux Toolkit", aliases: ["Redux Toolkit", "ReduxToolkit", "RTK"] },
  { name: "Zustand", aliases: ["Zustand"] },
  { name: "Context API", aliases: ["Context API", "Context", "React Context"] },
  { name: "React Query", aliases: ["React Query", "ReactQuery", "TanStack Query"] },
  { name: "TanStack Table", aliases: ["TanStack Table", "TanStackTable", "TanStack"] },
  { name: "Axios", aliases: ["Axios"] },
  { name: "Git", aliases: ["Git", "Git VCS"] },
  { name: "GitHub", aliases: ["GitHub", "Git Hub", "GitHub.com"] },
  { name: "Jest", aliases: ["Jest", "JestJS"] },
  { name: "Node.js", aliases: ["Node.js", "Node", "NodeJS"] },
  { name: "Express.js", aliases: ["Express.js", "ExpressJS", "Express"] },
  { name: "REST API", aliases: ["REST API", "REST", "Rest API", "RESTful API"] },
  { name: "GraphQL", aliases: ["GraphQL"] },
];

export function normalizeSkill(value: string): string {
  return value.trim().toLowerCase().replace(/\s+/g, " ");
}

export function findSkill(value: string): Skill | undefined {
  const normalized = normalizeSkill(value);
  const match = SKILL_DICTIONARY.find((skill) => {
    const isAlias = skill.aliases.some((alias) => normalizeSkill(alias) === normalized);
    const isCanonical = normalizeSkill(skill.name) === normalized;

    return isAlias || isCanonical;
  });

  return match;
}

export function getUniqueSkills(): Skill[] {
  const seen = new Set<string>();
  const uniqueSkills: Skill[] = [];

  for (const skill of SKILL_DICTIONARY) {
    const keys = [normalizeSkill(skill.name), ...skill.aliases.map(normalizeSkill)];
    const isDuplicate = keys.some((key) => seen.has(key));

    if (isDuplicate) {
      continue;
    }

    keys.forEach((key) => seen.add(key));
    uniqueSkills.push(skill);
  }

  return uniqueSkills;
}

function toSkillKey(value: string): string {
  return value.trim().toLowerCase().replace(/[^a-z0-9]/g, "");
}

export function getSkillAliasMap(): Map<string, string> {
  const aliasMap = new Map<string, string>();

  for (const skill of SKILL_DICTIONARY) {
    const entries: Array<[string, string]> = [
      [toSkillKey(skill.name), skill.name],
      ...skill.aliases.map((alias): [string, string] => [toSkillKey(alias), alias]),
    ];

    for (const [key, display] of entries) {
      const existing = aliasMap.get(key);
      if (existing === undefined || display.length > existing.length) {
        aliasMap.set(key, display);
      }
    }
  }

  return aliasMap;
}

export function normalizeSkillTerm(value: string): string {
  const skill = findSkill(value);
  if (skill) {
    return skill.name;
  }

  const key = toSkillKey(value);
  const aliasMap = getSkillAliasMap();
  const canonical = aliasMap.get(key);

  return canonical ?? value.trim();
}
