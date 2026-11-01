// Content dates of every non-guide page (shown on the page and used for <lastmod>).
// Change a date only when the page's content changes.
import { mathSkills, rwSkills } from "./lib/quiz/bank.js";
const D = "2026-11-01";
const paths = [
  "/", "/sat/", "/sat/math/", "/sat/reading-writing/", "/guides/", "/how-we-write-questions/",
  "/about/", "/author/eren-simsir/", "/contact/", "/editorial-policy/", "/privacy/", "/terms/", "/disclaimer/",
  ...mathSkills().map((s) => s.href), ...rwSkills().map((s) => s.href),
];
export const PAGE_DATES = Object.fromEntries(paths.map((p) => [p, { published: D }]));

export function pageDates(path) {
  const d = PAGE_DATES[path];
  if (!d) throw new Error(`No date for ${path} in src/page-dates.js`);
  return { published: new Date(d.published), updated: d.updated ? new Date(d.updated) : undefined };
}
export function lastModified(path) {
  const d = PAGE_DATES[path];
  return d ? d.updated ?? d.published : undefined;
}
