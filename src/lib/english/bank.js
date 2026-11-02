// English test bank: builds the sets the pages render. Hand-written items keep the
// key at choices[0]; the order is shuffled by a stable hash so the HTML does not change
// between builds. Same item shape as the SAT Reading and Writing bank.
import { hash } from "../quiz/bank.js";
import { LEVEL_ITEMS, LEVELS } from "./level-test.js";
import { VOCAB_ITEMS } from "./vocabulary.js";
import { GRAMMAR_ITEMS } from "./grammar.js";
import { PRONOUN_ITEMS } from "./pronouns.js";
import { VERB_ITEMS } from "./verbs.js";
import { TOEFL_READING_ITEMS, TOEFL_WRITING_ITEMS } from "./toefl.js";

export function prepareEnglish(skill, items) {
  return items.map((it, i) => {
    const id = `${skill}-${i + 1}`;
    const order = [0, 1, 2, 3].sort((a, b) => hash(`${id}:${a}`) - hash(`${id}:${b}`));
    const choices = order.map((k) => it.choices[k]);
    const wrongWhy = it.explanation.slice(1);
    const notes = order.map((k) => (k === 0 ? null : wrongWhy[k - 1] ?? null));
    const stem = it.passage ? `${it.passage}\n${it.q}` : it.q;
    return { id, skill, stem, choices, answer: order.indexOf(0), explanation: [it.explanation[0]], wrongNotes: notes, difficulty: undefined, level: it.level, band: it.band };
  });
}

export const ENGLISH = {
  level: { name: "English level test", items: prepareEnglish("level", LEVEL_ITEMS), levels: LEVELS },
  vocabulary: { name: "Vocabulary test", items: prepareEnglish("vocabulary", VOCAB_ITEMS) },
  grammar: { name: "English grammar test", items: prepareEnglish("grammar", GRAMMAR_ITEMS) },
  pronouns: { name: "Pronoun test", items: prepareEnglish("pronouns", PRONOUN_ITEMS) },
  verbs: { name: "Verb tense test", items: prepareEnglish("verbs", VERB_ITEMS) },
  "toefl-reading": { name: "TOEFL reading practice", items: prepareEnglish("toefl-reading", TOEFL_READING_ITEMS) },
  "toefl-writing": { name: "TOEFL writing practice", items: prepareEnglish("toefl-writing", TOEFL_WRITING_ITEMS) },
};
