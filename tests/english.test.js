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

// Three full answer patterns run through the real bank: the band must make sense for each.
function bandFor(correctUpTo) {
  const byLevel = Object.fromEntries(LEVELS.map((l) => [l, 0]));
  for (const it of ENGLISH.level.items) {
    if (LEVELS.indexOf(it.level) <= correctUpTo) byLevel[it.level] += 1; // answered with the key
  }
  return { byLevel, band: estimateBand(byLevel) };
}
test("level test: all 30 correct gives C2", () => {
  const { byLevel, band } = bandFor(5);
  assert.deepEqual(Object.values(byLevel), [5, 5, 5, 5, 5, 5]);
  assert.equal(band.label, "C2");
});
test("level test: only A1-B1 correct gives B1", () => {
  const { byLevel, band } = bandFor(2);
  assert.deepEqual(Object.values(byLevel), [5, 5, 5, 0, 0, 0]);
  assert.equal(band.label, "B1");
});
test("level test: all 30 wrong gives below A1", () => {
  const { byLevel, band } = bandFor(-1);
  assert.deepEqual(Object.values(byLevel), [0, 0, 0, 0, 0, 0]);
  assert.equal(band.label, "below A1");
});

test("every new page path has a date", () => {
  for (const path of ENGLISH_PATHS) {
    assert.ok(PAGE_DATES[path], path);
    assert.equal(pageDates(path).published.toISOString().slice(0, 10), "2026-11-02", path);
  }
  assert.equal(PAGE_DATES["/sat/"].published, "2026-11-01", "existing page dates must not change");
});

const astroText = (p) => read(p).replace(/^---[\s\S]*?---/, "").replace(/<[^>]+>/g, " ").replace(/\{[^}]*\}/g, " ").replace(/\s+/g, " ");
const blocksText = (page) => [...page.pre, ...page.post].flatMap((b) => [...(b.p ?? []), ...(b.ul ?? []), ...(b.p2 ?? []), ...(b.table ? b.table.rows.flat() : [])]).join("\n");

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

test("every TOEFL page and guide shows the ETS trademark disclaimer, and nothing calls our questions official", () => {
  const D = "TOEFL and TOEFL iBT are registered trademarks of ETS. This site is not affiliated with or endorsed by ETS.";
  const files = [
    ...guideFiles.map((g) => `../src/content/guides/${g}`),
    "../src/pages/toefl/index.astro", "../src/pages/english/index.astro", "../src/pages/index.astro", "../src/pages/about.astro",
    "../src/pages/how-we-write-questions.astro", "../src/components/quiz/EnglishTestPage.astro",
  ];
  for (const f of files) {
    const text = read(f);
    if (/toefl/i.test(text)) assert.ok(text.includes(D), `${f} mentions TOEFL but lacks the ETS disclaimer`);
  }
  // "official" may negate ("not official") or point at someone else's material, never describe our questions.
  const EXTERNAL = /\b(not|no|never)\b|n't|ETS|College Board|ACT|IELTS|Council|approved|exam|framework|requirement|page|pages|table|tables|scale|materials|concordance|source|center|centre|score|GRE|SAT|CEFR|text/i;
  const copy = [
    ...Object.values(ENGLISH_PAGES).map((p) => `${p.lead} ${blocksText(p)}`),
    ...Object.values(ENGLISH_FAQS).flat().map((f) => `${f.q} ${f.a}`),
    ...Object.values(ENGLISH).flatMap((s) => s.items.map((i) => `${i.stem} ${i.choices.join(" ")} ${i.explanation.join(" ")} ${i.wrongNotes.filter(Boolean).join(" ")}`)),
    ...files.map((f) => read(f)),
  ].join("\n");
  for (const sentence of copy.replace(/<[^>]+>/g, " ").split(/(?<=[.!?])\s+|\n/)) {
    if (/\bofficial\b/i.test(sentence) && !sentence.trim().endsWith("?")) assert.ok(EXTERNAL.test(sentence), `check wording: "${sentence.slice(0, 120)}"`);
    assert.ok(/\b(not|no|never)\b|n't/i.test(sentence) || !/\b(our|these|this site's) (practice )?(questions|items|tests|sets)\b[^.]{0,40}\b(are|is) official\b/i.test(sentence), `calls our questions official: "${sentence.slice(0, 120)}"`);
  }
});
