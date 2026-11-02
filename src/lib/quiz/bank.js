// The site's question bank: every practice skill, its section and domain,
// and how its questions are produced (generated math or hand-written R&W).
import { SKILLS as MATH, makeSet } from "./math.js";
import { BOUNDARIES, FORM_STRUCTURE_SENSE } from "./rw-conventions.js";
import { TRANSITIONS, WORDS_IN_CONTEXT, RHETORICAL_SYNTHESIS, CENTRAL_IDEAS } from "./rw-ideas.js";

/** Deterministic hash for stable shuffles. */
export function hash(s) {
  let h = 2166136261;
  for (const c of s) h = Math.imul(h ^ c.charCodeAt(0), 16777619);
  return h >>> 0;
}

/** Hand-written items keep the key at choices[0] (or `answer`); shuffle by id so the key moves. */
export function prepare(skill, items, defaults = {}) {
  return items.map((it, i) => {
    const id = `${skill}-${i + 1}`;
    const key = it.answer ?? 0;
    const order = [0, 1, 2, 3].sort((a, b) => hash(`${id}:${a}`) - hash(`${id}:${b}`));
    const choices = order.map((k) => it.choices[k]);
    // Explanations: [why the key is right, ...why each wrong choice (in original order, skipping the key)]
    const wrongWhy = it.explanation.slice(1);
    const wrongIdx = [0, 1, 2, 3].filter((k) => k !== key);
    const notes = order.map((k) => (k === key ? null : wrongWhy[wrongIdx.indexOf(k)] ?? null));
    const stem = it.notes
      ? `While researching a topic, a student has taken the following notes:\n${it.notes.map((n) => `• ${n}`).join("\n")}\n${it.q}`
      : `${it.passage}\n${it.q ?? defaults.q}`;
    return { id, skill, stem, choices, answer: order.indexOf(key), explanation: [it.explanation[0]], wrongNotes: notes, difficulty: it.difficulty ?? 2 };
  });
}

const CONVENTIONS_Q = "Which choice completes the text so that it conforms to the conventions of Standard English?";

export const RW = {
  boundaries: { name: "Boundaries (punctuation)", domain: "Standard English Conventions", items: prepare("boundaries", BOUNDARIES, { q: CONVENTIONS_Q }) },
  "form-structure-and-sense": { name: "Form, structure and sense (grammar)", domain: "Standard English Conventions", items: prepare("form-structure-and-sense", FORM_STRUCTURE_SENSE, { q: CONVENTIONS_Q }) },
  transitions: { name: "Transitions", domain: "Expression of Ideas", items: prepare("transitions", TRANSITIONS) },
  "rhetorical-synthesis": { name: "Rhetorical synthesis", domain: "Expression of Ideas", items: prepare("rhetorical-synthesis", RHETORICAL_SYNTHESIS) },
  "words-in-context": { name: "Words in context", domain: "Craft and Structure", items: prepare("words-in-context", WORDS_IN_CONTEXT) },
  "central-ideas-and-details": { name: "Central ideas and details", domain: "Information and Ideas", items: prepare("central-ideas-and-details", CENTRAL_IDEAS) },
};

export const MATH_DOMAINS = ["Algebra", "Advanced Math", "Problem-Solving and Data Analysis", "Geometry and Trigonometry"];
export const RW_DOMAINS = ["Information and Ideas", "Craft and Structure", "Expression of Ideas", "Standard English Conventions"];

export const mathSkills = () => Object.values(MATH).map((s) => ({ key: s.key, name: s.name, domain: s.domain, section: "math", href: `/sat/math/${s.key}/` }));
export const rwSkills = () => Object.entries(RW).map(([key, s]) => ({ key, name: s.name, domain: s.domain, section: "reading-writing", href: `/sat/reading-writing/${key}/`, count: s.items.length }));

/** The set a math page shows by default (fixed seeds so the HTML is stable). */
export const mathSet = (skill, n = 10) => makeSet(skill, 1, n);
