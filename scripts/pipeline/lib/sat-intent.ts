/**
 * Topic gate for the SAT site (replaces the developer-focused intent.ts).
 * What an AI Overview cannot replace here is practice: problems with verified
 * answers, worked step by step, and drills tied to the site's question bank.
 * So every topic must (1) target a real planner keyword, (2) be tied to at
 * least one practice skill whose generated or hand-written questions the
 * article uses, and (3) avoid definitional / listicle / promise shapes.
 */
import { whyTopicRefused } from './policy';

export interface SatTopic {
  title: string;
  /** primary keyword from Google Keyword Planner */
  keyword: string;
  /** monthly searches bucket reported by the planner */
  volume: number;
  /** cluster / article tool field */
  tool: 'math' | 'reading-writing' | 'strategy' | 'english' | 'toefl';
  /** practice skills the article draws its examples from (keys in src/lib/quiz, or for english/toefl keys in src/lib/english/bank.js) */
  skills: string[];
  /** key into src/lib/topic-images.json: pre-made illustrations copied to the article slug at draft time */
  image?: string;
  /** what the article delivers that an overview can't: worked problems, drills, a pacing plan from the facts */
  asset: string;
}

/** English and TOEFL question sets and the page each one lives on. */
export const ENGLISH_TEST_PAGES: Record<string, string> = {
  level: '/english/english-level-test/',
  vocabulary: '/english/vocabulary-test/',
  grammar: '/english/grammar-test/',
  pronouns: '/english/grammar-test/pronouns/',
  verbs: '/english/grammar-test/verbs/',
  'toefl-reading': '/toefl/',
  'toefl-writing': '/toefl/',
};
export const isEnglishTopic = (t: Pick<SatTopic, 'tool'>) => t.tool === 'english' || t.tool === 'toefl';

const DEFINITION_RE = /^(what\s+(?:is|are|does)|who\s+is)\b|\bexplained\b|\bintroduction to\b/i;
const LISTICLE_RE = /\b(best|top\s*\d+|\d+\s+(?:best|tips|tricks|hacks)|ranked|vs\.?|versus|review)\b/i;

export function findTopicIssues(t: SatTopic): string[] {
  const issues: string[] = [];
  const refused = whyTopicRefused(t.title);
  if (refused) issues.push(`refused: ${refused}`);
  if (DEFINITION_RE.test(t.title)) issues.push('definitional title: an AI Overview answers it; reframe around practice ("… with 10 worked examples")');
  if (LISTICLE_RE.test(t.title)) issues.push('listicle / ranking / review title');
  if (!t.keyword || t.volume < 500) issues.push('needs a planner keyword with at least 500 monthly searches');
  if (isEnglishTopic(t)) {
    if (t.skills.length === 0) issues.push('an english or toefl article must draw on at least one English question set');
    for (const s of t.skills) if (!ENGLISH_TEST_PAGES[s]) issues.push(`unknown English question set: ${s}`);
  }
  if (t.tool !== 'strategy' && !isEnglishTopic(t) && t.skills.length === 0) issues.push('a math or reading-writing article must draw on at least one practice skill');
  if (t.asset.split(/\s+/).length < 6) issues.push('describe the asset the page delivers (worked problems, a drill, a pacing table)');
  return issues;
}
