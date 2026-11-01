import { test } from "node:test";
import assert from "node:assert/strict";
import { SKILL_KEYS, makeQuestion, checkQuestion, makeSet } from "../src/lib/quiz/math.js";

// Every generator, 400 seeds: four distinct choices, a key that the
// independent check confirms, no NaN/undefined/Infinity in any text.
for (const skill of SKILL_KEYS) {
  test(`math generator: ${skill}`, () => {
    for (let seed = 1; seed <= 400; seed++) {
      const q = makeQuestion(skill, seed);
      const text = [q.stem, ...q.choices, ...q.explanation].join(" ");
      assert.ok(!/NaN|undefined|Infinity|\[object/.test(text), `${skill}#${seed} bad text: ${text.slice(0, 200)}`);
      assert.equal(new Set(q.choices).size, 4, `${skill}#${seed} duplicate choices`);
      assert.ok(q.answer >= 0 && q.answer < 4);
      assert.ok(checkQuestion(q), `${skill}#${seed} failed check: ${q.stem} | ${q.choices} | key ${q.answer}`);
      assert.ok(q.explanation.length >= 1);
    }
  });
}

test("sets are deterministic", () => {
  assert.deepEqual(makeSet("percentages", 1, 5), makeSet("percentages", 1, 5));
});
