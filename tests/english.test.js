import { test } from "node:test";
import assert from "node:assert/strict";
import { readdirSync, readFileSync } from "node:fs";
import { ENGLISH } from "../src/lib/english/bank.js";
import { LEVELS } from "../src/lib/english/level-test.js";
import { estimateBand } from "../src/lib/english/level.js";
import { ENGLISH_PAGES } from "../src/lib/english/lessons.js";
import { ENGLISH_FAQS } from "../src/lib/english/faqs.js";
import { RW } from "../src/lib/quiz/bank.js";
import { SKILLS, makeSet } from "../src/lib/quiz/math.js";
import { PAGE_DATES, ENGLISH_PATHS, pageDates } from "../src/page-dates.js";
import { guideFaqs } from "../src/lib/guide-faqs.js";

const EXPECTED = { level: 30, vocabulary: 40, grammar: 30, pronouns: 20, verbs: 20, "toefl-reading": 12, "toefl-writing": 12 };
const NEW_GUIDES = new Set(["sat-vs-act", "sat-to-act-score-conversion", "english-level-test-cefr-levels", "how-to-improve-english-vocabulary", "english-pronouns-rules", "english-verb-tenses-chart", "toefl-practice-test-guide", "how-to-register-for-the-sat", "toefl-vs-ielts", "gre-vocabulary-study-plan", "english-grammar-rules-adults"].map((g) => g + ".md"));
const isNew = (where) => where.startsWith("guide:") ? NEW_GUIDES.has(where.slice(6)) : /^(english|lesson|faq):/.test(where);
const read = (p) => readFileSync(new URL(p, import.meta.url), "utf8");
const guideFiles = readdirSync(new URL("../src/content/guides/", import.meta.url)).filter((f) => f.endsWith(".md"));

for (const [key, set] of Object.entries(ENGLISH)) {
  test(`English bank: ${key}`, () => {
    assert.equal(set.items.length, EXPECTED[key], `${key} item count`);
    const stems = new Set();
    for (const it of set.items) {
      assert.equal(it.choices.length, 4, it.id);
      assert.ok(it.choices.every((c) => typeof c === "string" && c.trim().length > 0), `${it.id} empty choice`);
      assert.equal(new Set(it.choices).size, 4, `${it.id} duplicate choices`);
      assert.ok(it.answer >= 0 && it.answer < 4, it.id);
      assert.ok(it.explanation[0].length > 30, `${it.id} explanation`);
      assert.equal(it.wrongNotes.filter(Boolean).length, 3, `${it.id} needs an explanation for every wrong choice`);
      assert.ok(it.wrongNotes.every((n, i) => i === it.answer ? n === null : n.length > 15), `${it.id} wrong-choice note too short`);
      assert.ok(!stems.has(it.stem), `${it.id} duplicate stem within set`);
      stems.add(it.stem);
    }
    const pos = new Set(set.items.map((i) => i.answer));
    assert.ok(pos.size >= 2, `${key}: key always in the same position`);
  });
}

test("English items are not repeated anywhere in the site's question banks", () => {
  const other = new Set();
  for (const s of Object.values(RW)) for (const it of s.items) other.add(it.stem);
  for (const key of Object.keys(SKILLS)) for (const q of makeSet(key, 1, 20)) other.add(q.stem);
  for (const [k, set] of Object.entries(ENGLISH)) for (const it of set.items) assert.ok(!other.has(it.stem), `${k}/${it.id} repeats an existing item`);
  const all = Object.values(ENGLISH).flatMap((s) => s.items.map((i) => i.stem));
  assert.equal(new Set(all).size, all.length, "an English item stem appears in two English sets");
});

test("level test has 5 items for each CEFR level", () => {
  for (const l of LEVELS) assert.equal(ENGLISH.level.items.filter((i) => i.level === l).length, 5, l);
});

test("band estimate for fixed answer patterns", () => {
  const p = (a1, a2, b1, b2, c1, c2) => ({ A1: a1, A2: a2, B1: b1, B2: b2, C1: c1, C2: c2 });
  assert.equal(estimateBand(p(0, 0, 0, 0, 0, 0)).label, "below A1");
  assert.equal(estimateBand(p(1, 0, 0, 0, 0, 0)).label, "below A1");
  assert.equal(estimateBand(p(3, 0, 0, 0, 0, 0)).label, "A1");
  assert.equal(estimateBand(p(5, 1, 0, 0, 0, 0)).label, "A1");
  assert.equal(estimateBand(p(5, 2, 0, 0, 0, 0)).label, "A1–A2");
  assert.equal(estimateBand(p(5, 5, 4, 1, 0, 0)).label, "B1");
  assert.equal(estimateBand(p(5, 5, 4, 3, 0, 0)).label, "B1–B2");
  assert.equal(estimateBand(p(5, 4, 4, 4, 4, 2)).label, "C1–C2");
  assert.equal(estimateBand(p(5, 5, 5, 5, 5, 5)).label, "C2");
  // A weak lower level stops the climb even when a higher level looks strong.
  assert.equal(estimateBand(p(5, 2, 5, 5, 5, 5)).label, "A1–A2");
});

test("every new page path has a date", () => {
  for (const path of ENGLISH_PATHS) {
    assert.ok(PAGE_DATES[path], path);
    assert.equal(pageDates(path).published.toISOString().slice(0, 10), "2026-11-02", path);
  }
  assert.equal(PAGE_DATES["/sat/"].published, "2026-11-01", "existing page dates must not change");
});

const astroText = (p) => read(p).replace(/^---[\s\S]*?---/, "").replace(/<[^>]+>/g, " ").replace(/\{[^}]*\}/g, " ").replace(/\s+/g, " ");
const blocksText = (page) => [...page.pre, ...page.post].flatMap((b) => [...(b.p ?? []), ...(b.ul ?? []), ...(b.p2 ?? []), ...(b.table ? b.table.rows.flat() : [])]).join(" ");

test("each new page has at least 200 words of its own text outside the questions", () => {
  for (const [k, page] of Object.entries(ENGLISH_PAGES)) {
    const words = `${page.lead} ${blocksText(page)} ${ENGLISH_FAQS[k].map((f) => f.a).join(" ")}`.split(/\s+/).length;
    assert.ok(words >= 200, `${k}: ${words} words`);
  }
  for (const p of ["../src/pages/english/index.astro", "../src/pages/toefl/index.astro"]) {
    const words = astroText(p).split(/\s+/).length;
    assert.ok(words >= 200, `${p}: ${words} words`);
  }
});

test("no FAQ question is repeated across the site", () => {
  const seen = new Map();
  const add = (q, where) => {
    const key = q.trim().toLowerCase();
    const prev = seen.get(key);
    assert.ok(!prev || (!isNew(prev) && !isNew(where)), `"${q}" appears in ${prev} and ${where}`);
    if (!prev) seen.set(key, where);
  };
  for (const [k, list] of Object.entries(ENGLISH_FAQS)) for (const f of list) add(f.q, `english:${k}`);
  for (const f of guideFiles) for (const q of guideFaqs(read(`../src/content/guides/${f}`))) add(q.q, `guide:${f}`);
  for (const f of ["../src/pages/sat/index.astro"]) for (const m of read(f).matchAll(/q: "([^"]+)"/g)) add(m[1], f);
});

test("no sentence of body copy is shared between two pages", () => {
  const sentences = new Map();
  const problems = [];
  const add = (text, where) => {
    for (const s of text.replace(/\s+/g, " ").split(/(?<=[.!?])\s+/)) {
      const words = s.trim().split(/\s+/);
      if (words.length < 8 || /trademark|not affiliated/i.test(s)) continue;
      const key = s.trim().toLowerCase();
      const prev = sentences.get(key);
      if (prev && prev !== where && (isNew(prev) || isNew(where))) problems.push(`"${s.trim().slice(0, 80)}" in ${prev} and ${where}`);
      if (!prev) sentences.set(key, where);
    }
  };
  for (const [k, page] of Object.entries(ENGLISH_PAGES)) add(`${page.lead} ${blocksText(page)}`, `lesson:${k}`);
  for (const [k, list] of Object.entries(ENGLISH_FAQS)) add(list.map((f) => f.a).join(" "), `faq:${k}`);
  for (const f of guideFiles) add(read(`../src/content/guides/${f}`).replace(/^---[\s\S]*?---/, "").replace(/<[^>]+>/g, " ").replace(/[#*`]|\[([^\]]+)\]\([^)]+\)/g, "$1"), `guide:${f}`);
  assert.deepEqual(problems, [], "shared sentences between pages");
});
