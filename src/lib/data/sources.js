// Sources for facts about the SAT itself (format, timing, domains). Pages cite by key.
export const CHECKED = "2026-11-01";
export const SOURCES = {
  cbDomains: { label: "College Board: SAT content domains (Reading and Writing, Math)", href: "https://satsuite.collegeboard.org/practice/content-domains", checked: CHECKED },
  uworldFormat: { label: "UWorld College Prep: SAT test format and sections", href: "https://collegeprep.uworld.com/sat/test-format-and-sections", checked: CHECKED },
  cbSat: { label: "College Board: the SAT", href: "https://satsuite.collegeboard.org/sat", checked: CHECKED },
};
export const src = (key) => {
  const s = SOURCES[key];
  if (!s) throw new Error(`Unknown source "${key}"`);
  return s;
};
