// Guide sections. `key` is the value of `tool` in guide frontmatter and in the
// Firestore articles collection (the column name is shared with the other sites).
export const TOPICS = [
  { key: "math", name: "SAT Math", topic: "SAT Math", href: "/sat/math/", label: "SAT Math", hubName: "SAT Math practice", ctaKicker: "Practice this now", blurb: "Unlimited generated questions with step-by-step explanations." },
  { key: "reading-writing", name: "SAT Reading and Writing", topic: "Reading and Writing", href: "/sat/reading-writing/", label: "Reading & Writing", hubName: "Reading & Writing practice", ctaKicker: "Practice this now", blurb: "Hand-written questions with an explanation for every choice." },
  { key: "strategy", name: "Test strategy", topic: "Strategy", href: "/sat/", label: "Strategy", hubName: "About the SAT", ctaKicker: "Know the test", blurb: "Format, timing, scoring and how the adaptive modules work." },
];
export const TOPIC_KEYS = TOPICS.map((t) => t.key);
export const TOPIC_BY_KEY = Object.fromEntries(TOPICS.map((t) => [t.key, t]));
