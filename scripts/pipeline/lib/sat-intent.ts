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
  tool: 'math' | 'reading-writing' | 'strategy';
  /** practice skills the article draws its examples from (keys in src/lib/quiz) */
  skills: string[];
  /** what the article delivers that an overview can't: worked problems, drills, a pacing plan from the facts */
  asset: string;
}

const DEFINITION_RE = /^(what\s+(?:is|are|does)|who\s+is)\b|\bexplained\b|\bintroduction to\b/i;
const LISTICLE_RE = /\b(best|top\s*\d+|\d+\s+(?:best|tips|tricks|hacks)|ranked|vs\.?|versus|review)\b/i;

export function findTopicIssues(t: SatTopic): string[] {
  const issues: string[] = [];
  const refused = whyTopicRefused(t.title);
  if (refused) issues.push(`refused: ${refused}`);
  if (DEFINITION_RE.test(t.title)) issues.push('definitional title: an AI Overview answers it; reframe around practice ("… with 10 worked examples")');
  if (LISTICLE_RE.test(t.title)) issues.push('listicle / ranking / review title');
  if (!t.keyword || t.volume < 500) issues.push('needs a planner keyword with at least 500 monthly searches');
  if (t.tool !== 'strategy' && t.skills.length === 0) issues.push('a math or reading-writing article must draw on at least one practice skill');
  if (t.asset.split(/\s+/).length < 6) issues.push('describe the asset the page delivers (worked problems, a drill, a pacing table)');
  return issues;
}
