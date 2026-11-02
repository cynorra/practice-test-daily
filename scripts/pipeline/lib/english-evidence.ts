/**
 * Evidence rules for the English and TOEFL topics: the article draws its examples from the
 * site's own hand-written English question sets, must use at least four of them, and must link
 * the matching test page. Kept out of generate.ts so the offline self-test can import it
 * (generate.ts starts the generator when imported).
 */
import { ENGLISH } from '../../../src/lib/english/bank.js';
import type { SatTopic } from './sat-intent';
import { ENGLISH_TEST_PAGES, isEnglishTopic } from './sat-intent';

export interface Example { skill: string; stem: string; choices: string[]; answer: string; explanation: string; href: string }

export const MIN_ENGLISH_ITEMS = 4;
/** How many items an English article is handed (it must use at least MIN_ENGLISH_ITEMS). */
export const SUPPLIED_ENGLISH_ITEMS = 6;

/** Items from the English question bank for one skill key (level, vocabulary, grammar, pronouns, verbs, toefl-reading, toefl-writing). */
export function englishExamples(skill: string): Example[] {
  const set = (ENGLISH as any)[skill];
  if (!set) return [];
  return set.items.slice(0, SUPPLIED_ENGLISH_ITEMS).map((q: any) => ({
    skill,
    stem: q.stem,
    choices: q.choices,
    answer: q.choices[q.answer],
    explanation: [...q.explanation, ...(q.wrongNotes ?? []).filter(Boolean)].join(' '),
    href: ENGLISH_TEST_PAGES[skill],
  }));
}

/** How many supplied items the article must reproduce. */
export const requiredExamples = (topic: SatTopic): number => (isEnglishTopic(topic) ? MIN_ENGLISH_ITEMS : 3);

/** An English or TOEFL article must link the test page its items come from. */
export function findTestPageLinkIssues(html: string, topic: SatTopic): string[] {
  if (!isEnglishTopic(topic)) return [];
  const missing = [...new Set(topic.skills.map((s) => ENGLISH_TEST_PAGES[s]))].filter((href) => !new RegExp(`href=["'](?:https?://[^/"']+)?${href.replace(/\//g, '\/')}["']`).test(html));
  return missing.map((href) => `must link the practice page ${href} from the article body`);
}
