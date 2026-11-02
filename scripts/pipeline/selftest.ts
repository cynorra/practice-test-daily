/**
 * Offline self-test for the pipeline gates (no network, no keys):
 *   npx tsx --test scripts/pipeline/selftest.ts
 * Pins what must be caught and what must not.
 */
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { findUngroundedTestFacts } from './lib/facts';
import { findTopicIssues } from './lib/sat-intent';
import { TOPICS } from './topics';
import { findHypeIssues, findBrokenInternalLinks } from './lib/hype-check';
import { findLowValueSignals, measureValue } from './lib/value';
import { findUnsupportedClaims } from './lib/claims-check';
import { whyTopicRefused } from './lib/policy';
import { pickEditorialForm, EDITORIAL_FORMS } from './lib/forms';
import { makeSet } from '../../src/lib/quiz/math.js';
import { englishExamples, requiredExamples, findTestPageLinkIssues } from './lib/english-evidence';
import { ENGLISH_TEST_PAGES, isEnglishTopic } from './lib/sat-intent';
import { ENGLISH_TOPICS } from './topics';
import { factsFor } from './lib/facts';

test('facts gate: official counts pass, invented ones fail', () => {
  assert.deepEqual(findUngroundedTestFacts('The Math section has 44 questions in two modules of 22. Each module lasts 35 minutes.'), []);
  assert.equal(findUngroundedTestFacts('The SAT Math section has 58 questions.').length, 1);
  assert.equal(findUngroundedTestFacts('A 1200 on the SAT is the 74th percentile.').length, 1);
  // Worked-problem numbers outside test-fact sentences are fine.
  assert.deepEqual(findUngroundedTestFacts('If 3x + 2 = x + 24, then x = 11.'), []);
});

test('policy refuses promises and official framing', () => {
  assert.ok(whyTopicRefused('Raise Your SAT Score by 200 Points in a Week'));
  assert.ok(whyTopicRefused('Real SAT Questions From the March Test'));
  assert.equal(whyTopicRefused('SAT Comma Rules With Examples'), null);
});

test('every seed topic passes the topic gate', () => {
  for (const t of TOPICS) assert.deepEqual(findTopicIssues(t), [], t.title);
});

test('hype and claims gates', () => {
  assert.ok(findHypeIssues('This method is the gold standard for SAT prep.').length > 0);
  assert.ok(findHypeIssues('This guarantees a higher score.').length > 0);
  assert.equal(findHypeIssues('This does not guarantee a higher score.').length, 0);
  assert.ok(findUnsupportedClaims('Students who use this cut their mistakes by up to 60%.').length > 0);
});

test('internal links to unknown guides are caught', () => {
  const html = '<p>See <a href="/guides/real-one/">this</a> and <a href="/guides/made-up/">that</a>.</p>';
  assert.deepEqual(findBrokenInternalLinks(html, new Set(['real-one'])).length, 1);
});

test('value gate: worked SAT content passes, generic filler fails', () => {
  const qs = makeSet('linear-equations-one-variable', 101, 6);
  const good = qs.map((q) => `<h2>${q.stem}</h2><p>${q.explanation.join(' ')}</p><p>The module has 22 questions and lasts 35 minutes, so you have about 95 seconds per question.</p>`).join('');
  assert.deepEqual(findLowValueSignals(good, 'math'), [], JSON.stringify(measureValue(good)));
  const bad = '<p>' + 'Studying plays a crucial role in success. When it comes to the SAT, it is worth noting that practice matters. '.repeat(30) + '</p>';
  assert.ok(findLowValueSignals(bad, 'math').length > 0);
});

test('editorial forms rotate', () => {
  const a = pickEditorialForm('math', 'x', []);
  const b = pickEditorialForm('math', 'x', [a.id]);
  assert.notEqual(a.id, b.id);
  assert.ok(EDITORIAL_FORMS.every((f) => f.clusters.length > 0));
});

test('English and TOEFL topics: gate, evidence and test-page link', () => {
  assert.ok(ENGLISH_TOPICS.length >= 6 && ENGLISH_TOPICS.length <= 8);
  for (const t of ENGLISH_TOPICS) {
    assert.ok(isEnglishTopic(t), t.title);
    assert.deepEqual(findTopicIssues(t), [], t.title);
    for (const s of t.skills) {
      assert.ok(ENGLISH_TEST_PAGES[s], s);
      const ex = englishExamples(s);
      assert.ok(ex.length >= requiredExamples(t), `${s}: supplies ${ex.length} items, needs ${requiredExamples(t)}`);
      assert.ok(ex.every((e) => e.href === ENGLISH_TEST_PAGES[s]));
    }
    // The article must link its test page.
    const page = ENGLISH_TEST_PAGES[t.skills[0]];
    assert.equal(findTestPageLinkIssues(`<p>See the <a href="${page}">test</a>.</p>`, t).length, 0);
    assert.equal(findTestPageLinkIssues('<p>No link here.</p>', t).length, 1);
  }
  assert.equal(requiredExamples({ tool: 'math' } as any), 3);
  assert.equal(requiredExamples(ENGLISH_TOPICS[0]), 4);
  assert.notEqual(factsFor('english'), factsFor('math'));
  assert.ok(factsFor('toefl').includes('January 21, 2026'));
});

test('English topics are rejected without a known question set', () => {
  const bad = { ...ENGLISH_TOPICS[0], skills: ['nope'] };
  assert.ok(findTopicIssues(bad).some((i) => /unknown English question set/.test(i)));
  assert.ok(findTopicIssues({ ...ENGLISH_TOPICS[0], skills: [] }).length > 0);
});

test('generate.ts parses (the generator starts only when run, so compile-check it)', async () => {
  const { transform } = await import('esbuild');
  const src = (await import('node:fs')).readFileSync(new URL('./generate.ts', import.meta.url), 'utf8');
  await transform(src, { loader: 'ts' });
});
