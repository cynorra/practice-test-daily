/**
 * Seed topic bank for the SAT site. Keywords and volumes come from the owner's
 * Google Keyword Planner export of 2026-11-01 (US). Each topic is tied to
 * practice skills so the article can use real, code-verified examples.
 * The generator takes the first topic that passes findTopicIssues and is not a
 * duplicate of anything in Firestore.
 */
import type { SatTopic } from './lib/sat-intent';

// Topics already covered by the hand-written launch guides in
// src/content/guides/ (practice tests, format, mixed math, grammar, reading,
// percentages, vocabulary, systems, study plan, linear, transitions,
// quadratics, probability, mock test review, circles) are not repeated here;
// the generator also refuses near-duplicate titles.
export const TOPICS: SatTopic[] = [
  { title: 'SAT Linear Inequalities Practice: Solving, Flipping the Sign and Word Problems', keyword: 'sat math practice', volume: 5000, tool: 'math', skills: ['linear-inequalities'], image: 'linear-inequalities', asset: 'generated inequality problems with verified answers, including the sign-flip trap and boundary values' },
  { title: 'SAT Exponent Rules: Equivalent Expressions Practice With Worked Examples', keyword: 'sat math prep', volume: 5000, tool: 'math', skills: ['exponents-and-equivalent-expressions'], image: 'exponents-and-equivalent-expressions', asset: 'generated exponent and equivalent-expression problems with verified answers and the rule behind each trap' },
  { title: 'SAT Ratios, Rates and Unit Conversions: Practice Problems Step by Step', keyword: 'sat math questions', volume: 50000, tool: 'math', skills: ['ratios-rates-and-units'], image: 'ratios-rates-and-units', asset: 'generated ratio, rate and unit-conversion problems with verified answers and the setup for each' },
  { title: 'SAT Mean and Median Questions: Data Practice With Explanations', keyword: 'sat math practice test', volume: 50000, tool: 'math', skills: ['one-variable-data'], image: 'one-variable-data', asset: 'generated mean, median and missing-value problems with verified answers and the unsorted-list trap' },
  { title: 'SAT Right Triangle Trigonometry: Sine, Cosine and Tangent Practice', keyword: 'sat test questions', volume: 50000, tool: 'math', skills: ['right-triangles-and-trigonometry'], image: 'right-triangles-and-trigonometry', asset: 'generated right-triangle problems with verified answers, labeling opposite, adjacent and hypotenuse each time' },
  { title: 'SAT Area and Volume Questions: Formulas and the Scaling Trap', keyword: 'sat exam questions', volume: 50000, tool: 'math', skills: ['area-and-volume'], image: 'area-and-volume', asset: 'generated area, volume and similar-figure scaling problems with verified answers' },
  { title: 'SAT Exponential Functions: Growth, Decay and Function Notation Practice', keyword: 'sat math review', volume: 500, tool: 'math', skills: ['nonlinear-functions'], image: 'nonlinear-functions', asset: 'generated exponential and quadratic function problems with verified answers and the order-of-operations trap' },
  { title: 'SAT Rhetorical Synthesis Questions: How to Use the Student Notes', keyword: 'sat writing practice', volume: 50000, tool: 'reading-writing', skills: ['rhetorical-synthesis'], image: 'rhetorical-synthesis', asset: 'the rhetorical synthesis question bank: the stated goal in each item and why each wrong choice misses it' },
  { title: 'SAT Central Ideas and Details Questions: Finding the Main Idea Fast', keyword: 'sat reading questions', volume: 5000, tool: 'reading-writing', skills: ['central-ideas-and-details'], image: 'central-ideas-and-details', asset: 'the central ideas question bank: the main idea of each passage and why the narrow or overreaching choices fail' },
];

// English and TOEFL topics (keywords and volumes from the Keyword Planner export of 2026-11-01, US).
// Each is tied to a question set in src/lib/english/ and must use at least four of its items and link its test page.
export const ENGLISH_TOPICS: SatTopic[] = [
  { title: 'English Vocabulary Test: Everyday to Advanced Words in Context', keyword: 'vocabulary test', volume: 50000, tool: 'english', skills: ['vocabulary'], asset: 'words in context from the vocabulary test question set, each with its meaning, an example sentence and why the other choices fail' },
  { title: 'English Pronoun Exercises: Subject, Object and Reflexive Forms With Answers', keyword: 'pronoun exam', volume: 50000, tool: 'english', skills: ['pronouns'], asset: 'pronoun exercises from the pronoun test question set with the rule and the tempting mistake behind each answer' },
  { title: 'English Verb Tense Exercises: Past, Present and Perfect With Answers', keyword: 'verb exam', volume: 50000, tool: 'english', skills: ['verbs'], asset: 'verb exercises from the verb test question set with the time clue that decides each tense' },
  { title: 'English Grammar Test Practice: Prepositions, Quantifiers and Verb Patterns', keyword: 'grammar test', volume: 5000, tool: 'english', skills: ['grammar'], asset: 'grammar questions from the grammar test question set grouped by rule, with the common learner mistake for each' },
  { title: 'CEFR Level Test Practice: Sample Questions From A1 to C2 With Explanations', keyword: 'cefr level test', volume: 500, tool: 'english', skills: ['level'], asset: 'questions from the level test question set at several CEFR levels, with what makes each level harder' },
  { title: 'TOEFL Reading Practice: Everyday Texts and Academic Passages With Answers', keyword: 'toefl reading test', volume: 5000, tool: 'toefl', skills: ['toefl-reading'], asset: 'text-based reading practice from the TOEFL reading question set, with how to find the answer in each text' },
  { title: 'TOEFL Writing Practice: Word Order, Emails and Discussion Replies', keyword: 'toefl exam practice', volume: 5000, tool: 'toefl', skills: ['toefl-writing'], asset: 'word-order, email and discussion-reply practice from the TOEFL writing question set, with the reason each choice works or fails' },
];
TOPICS.push(...ENGLISH_TOPICS);
