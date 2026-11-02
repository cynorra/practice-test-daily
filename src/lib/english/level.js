// Turns the number of correct answers per CEFR level into an *estimated* band.
// This is a practice estimate, not a certified level.
//
// Rule (5 items per level):
//   - A level is "secure" when the learner got 4 or 5 of 5 right and every lower level is secure too.
//   - If the next level above the highest secure level has 2 or more right, the estimate
//     spans both levels ("B1-B2"); otherwise it is the secure level alone.
//   - If A1 is not secure but has 2 or more right, the estimate is "A1".
//   - Otherwise the estimate is "below A1".
import { LEVELS } from "./level-test.js";

export const ITEMS_PER_LEVEL = 5;
export const SECURE_AT = 4;
export const PARTIAL_AT = 2;

/** @param {Record<string, number>} correct number of correct answers per level, e.g. { A1: 5, A2: 4 } */
export function estimateBand(correct) {
  let secure = -1;
  for (let i = 0; i < LEVELS.length; i++) {
    if ((correct[LEVELS[i]] ?? 0) >= SECURE_AT) secure = i;
    else break;
  }
  const nextCorrect = secure + 1 < LEVELS.length ? correct[LEVELS[secure + 1]] ?? 0 : 0;
  if (secure === -1) {
    return (correct.A1 ?? 0) >= PARTIAL_AT ? { label: "A1", low: "A1", high: "A1" } : { label: "below A1", low: null, high: null };
  }
  if (nextCorrect >= PARTIAL_AT && secure + 1 < LEVELS.length) {
    const low = LEVELS[secure], high = LEVELS[secure + 1];
    return { label: `${low}–${high}`, low, high };
  }
  return { label: LEVELS[secure], low: LEVELS[secure], high: LEVELS[secure] };
}
