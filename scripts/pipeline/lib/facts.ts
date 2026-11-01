/**
 * The facts about the SAT an article may state, with their sources, and the
 * grounding gate that holds any test-fact sentence using a number not listed
 * here. Update CHECKED and the values together when the test changes.
 */
export const FACTS_CHECKED = '2026-11-01';

export const SAT_FACTS = `FACTS ABOUT THE DIGITAL SAT (checked ${FACTS_CHECKED}; the only test facts you may state):
- Two sections: Reading and Writing, then Math. Each section has two modules; the second module's difficulty depends on performance on the first (multistage adaptive).
- Reading and Writing: 54 questions in two modules of 27; 32 minutes per module, 64 minutes total.
- Math: 44 questions in two modules of 22; 35 minutes per module, 70 minutes total.
- Each module includes 2 unscored pretest questions that are not marked (25 scored per Reading and Writing module, 20 per Math module).
- Total testing time is about 2 hours 14 minutes (134 minutes), with a short break between the sections.
- Total score range 400-1600; each section is scored 200-800.
- Reading and Writing domains: Information and Ideas; Craft and Structure; Expression of Ideas; Standard English Conventions. Each question has a short passage and four answer choices.
- Math domains: Algebra; Advanced Math; Problem-Solving and Data Analysis; Geometry and Trigonometry. Most questions are multiple choice with four choices; the rest are student-produced responses (you enter the answer).
- Sources: College Board, SAT content domains (satsuite.collegeboard.org/practice/content-domains); UWorld College Prep, SAT test format and sections.
Do NOT state: percentiles, average scores, score-increase promises, registration fees, test dates, college admission cutoffs, or anything about the test not listed above.`;

/** Numbers that may appear in a sentence about the test's counts, times or scores. */
const ALLOWED = new Set(['2', '4', '20', '22', '25', '27', '32', '35', '44', '54', '64', '70', '98', '134', '14', '200', '400', '800', '1600', 'two', 'four']);
const TEST_FACT_RE = /\b(sat|section|module|test)\b/i;
const COUNT_RE = /\b(\d{1,4})\s*(questions?|minutes?|modules?)\b|\bscore[sd]? (?:of |between |from )?(\d{3,4})\b/gi;

/** Sentences that state a count/time/score of the test with a number we don't have. */
export function findUngroundedTestFacts(plain: string): string[] {
  const out: string[] = [];
  for (const s of plain.split(/(?<=[.!?])\s+/)) {
    if (!TEST_FACT_RE.test(s)) continue;
    for (const m of s.matchAll(COUNT_RE)) {
      const n = m[1] ?? m[3];
      if (n && !ALLOWED.has(n)) out.push(`test-fact sentence uses a number not in the facts block (${n}): "${s.slice(0, 140)}" — use only the facts block, or make clear it's a worked example`);
    }
    if (/\b\d{1,2}(?:st|nd|rd|th)? percentile\b|\bpercentile\b.*\d/i.test(s)) out.push(`states a percentile, which the facts block does not support: "${s.slice(0, 120)}"`);
  }
  return [...new Set(out)];
}
