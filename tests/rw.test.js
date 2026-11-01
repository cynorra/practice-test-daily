import { test } from "node:test";
import assert from "node:assert/strict";
import { RW } from "../src/lib/quiz/bank.js";

for (const [key, s] of Object.entries(RW)) {
  test(`R&W bank: ${key}`, () => {
    assert.ok(s.items.length >= 4);
    const keys = new Set();
    for (const it of s.items) {
      assert.equal(it.choices.length, 4, it.id);
      assert.equal(new Set(it.choices).size, 4, `${it.id} duplicate choices`);
      assert.ok(it.answer >= 0 && it.answer < 4);
      assert.ok(it.explanation[0].length > 30, `${it.id} explanation`);
      assert.equal(it.wrongNotes.filter(Boolean).length, 3, `${it.id} needs a note for each wrong choice`);
      assert.equal(it.wrongNotes[it.answer], null);
      assert.ok(!keys.has(it.stem), `${it.id} duplicate stem`);
      keys.add(it.stem);
    }
    // Keys are spread across positions, not stuck at one letter.
    const pos = new Set(s.items.map((i) => i.answer));
    assert.ok(pos.size >= 2, `${key}: answer always in the same position`);
  });
}
