/**
 * Editorial forms — the answer to "scaled content / template farm".
 *
 * Varying headings is not enough: two articles can have different words and still be the same shape
 * (quick answer, definition, 6 numbered sections, FAQ). So every article is assigned ONE editorial form
 * that changes how it is organised, how it opens and what its spine is — a diagnostic tree, a decision
 * memo, an annotated source excerpt, a build log, a misconception-led piece, a worked-numbers piece...
 *
 * The form is chosen from the real corpus: the least-used form that suits the cluster, never one of the
 * last few used, ties broken by a hash of the slug (not a rotating pool — usage counts decide). The
 * chosen id is stored on the article (`editorialForm`) so the next run sees it.
 *
 * The opening of every article is also compared with the corpus (first three words of the first
 * paragraph after the quick-answer box) so no two articles start the same way.
 */
export interface EditorialForm {
  id: string;
  clusters: string[];
  directive: string;
}

const ALL = ['math', 'reading-writing', 'strategy'];

export const EDITORIAL_FORMS: EditorialForm[] = [
  { id: 'worked-problems-ladder', clusters: ['math'], directive: 'Build the article around the WORKED PROBLEMS supplied below, easiest to hardest. For each: state the problem, solve it step by step with every number shown, then name the one rule it used. Between problems, say what changes in the next one. Use only the supplied problems and their supplied answers; do not invent new problems with new numbers.' },
  { id: 'trap-catalogue', clusters: ['math', 'reading-writing', 'english', 'toefl'], directive: 'Organise the article around the specific wrong answers students pick. Each H2 names one trap in plain words; under it show a supplied problem or example, the tempting wrong answer, why it is tempting and the check that catches it. End with a short checklist of the checks.' },
  { id: 'rule-then-examples', clusters: ['reading-writing'], directive: 'State each rule in one sentence, then give three short example sentences for it: one correct, one incorrect with the error marked, and one SAT-style blank with the right choice explained. Keep each rule section under 200 words.' },
  { id: 'decision-tree', clusters: ['reading-writing', 'math', 'english'], directive: 'Write the article as a decision procedure a student runs on test day: a numbered sequence of questions to ask ("Is the part after the blank a complete sentence?") and what each answer means. Illustrate each branch with one supplied example.' },
  { id: 'before-after', clusters: ['reading-writing', 'math', 'english', 'toefl'], directive: 'For each point, show a wrong attempt first (a sentence or a calculation), say exactly what is wrong with it, then show the corrected version. Use the supplied examples.' },
  { id: 'timed-walkthrough', clusters: ['strategy', 'math'], directive: 'Walk through one module of the test in time order, minute by minute or question by question, using the official counts and times from the facts block. Give concrete pacing numbers derived by arithmetic from those facts and show the arithmetic.' },
  { id: 'misconception-led', clusters: ['strategy', 'reading-writing', 'math', 'english', 'toefl'], directive: 'Organise around three or four specific beliefs students commonly hold about this topic. Each H2 states the belief; the section says what is actually true, citing the facts block or a supplied example.' },
  { id: 'question-ladder', clusters: ['strategy', 'math', 'reading-writing', 'english', 'toefl'], directive: 'Make the H2s the questions a student asks next, in the order they ask them, worded as real search queries (see the query list). Each section answers its question in the first sentence, then gives the evidence.' },
  { id: 'checklist-with-reasons', clusters: ['strategy', 'reading-writing', 'english', 'toefl'], directive: 'Organise as a checklist where every item carries its reason: the item, the fact or rule behind it, and what goes wrong without it.' },
];


function hash(s: string): number {
  let h = 0;
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) >>> 0;
  return h;
}

/** Least-used suitable form, excluding the last `recentWindow` used; ties by slug hash. */
export function pickEditorialForm(cluster: string, slug: string, usedNewestFirst: (string | undefined)[], recentWindow = 3): EditorialForm {
  const suitable = EDITORIAL_FORMS.filter((f) => f.clusters.includes(cluster));
  const pool = suitable.length ? suitable : EDITORIAL_FORMS.filter((f) => f.clusters.some((c) => ALL.includes(c)));
  const recent = new Set(usedNewestFirst.filter(Boolean).slice(0, recentWindow) as string[]);
  const counts = new Map<string, number>();
  for (const id of usedNewestFirst) if (id) counts.set(id, (counts.get(id) ?? 0) + 1);
  let candidates = pool.filter((f) => !recent.has(f.id));
  if (candidates.length === 0) candidates = pool;
  const min = Math.min(...candidates.map((f) => counts.get(f.id) ?? 0));
  const least = candidates.filter((f) => (counts.get(f.id) ?? 0) === min);
  return least[hash(`${slug}:form`) % least.length];
}

export function formPromptBlock(form: EditorialForm): string {
  return `\nEDITORIAL FORM FOR THIS ARTICLE (assigned so that this article is not shaped like the others on the site — follow it):\n${form.directive}\nThe form governs the organisation, the opening and the spine of the article. It does not relax any accuracy rule below.\n`;
}

const OPENER_BANNED_RE = /^(in this (article|guide|post|tutorial)|this (article|guide|post) (will|explains|covers)|whether you|if you(?:'|’)?re (a|an|looking|new)|are you (looking|struggling)|welcome to|today(?:,|\s)|as (ai|llms?|developers))/i;

/** First three words of the first paragraph after the quick-answer box. */
export function openingKey(html: string): string {
  const afterBox = html.replace(/^\s*<div[\s\S]*?<\/div>\s*/i, '');
  const m = /<p[^>]*>([\s\S]*?)<\/p>/i.exec(afterBox);
  if (!m) return '';
  return m[1].replace(/<[^>]+>/g, ' ').toLowerCase().replace(/[^a-z0-9\s]/g, ' ').split(/\s+/).filter(Boolean).slice(0, 3).join(' ');
}

export function findOpeningIssues(html: string, corpusOpenings: Set<string>): string[] {
  const issues: string[] = [];
  const afterBox = html.replace(/^\s*<div[\s\S]*?<\/div>\s*/i, '');
  const first = (/<p[^>]*>([\s\S]*?)<\/p>/i.exec(afterBox)?.[1] ?? '').replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
  if (OPENER_BANNED_RE.test(first)) issues.push(`the opening paragraph starts with a stock opener ("${first.slice(0, 40)}…") — open on the specific symptom, fact, number or scenario this article is about`);
  const key = openingKey(html);
  if (key && corpusOpenings.has(key)) issues.push(`the opening paragraph starts with "${key}…", exactly like another article on this site — start differently`);
  return issues;
}
