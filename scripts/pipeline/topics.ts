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
  { title: 'SAT Linear Inequalities Practice: Solving, Flipping the Sign and Word Problems', keyword: 'sat math practice', volume: 5000, tool: 'math', skills: ['linear-inequalities'], asset: 'generated inequality problems with verified answers, including the sign-flip trap and boundary values' },
  { title: 'SAT Exponent Rules: Equivalent Expressions Practice With Worked Examples', keyword: 'sat math prep', volume: 5000, tool: 'math', skills: ['exponents-and-equivalent-expressions'], asset: 'generated exponent and equivalent-expression problems with verified answers and the rule behind each trap' },
  { title: 'SAT Ratios, Rates and Unit Conversions: Practice Problems Step by Step', keyword: 'sat math questions', volume: 50000, tool: 'math', skills: ['ratios-rates-and-units'], asset: 'generated ratio, rate and unit-conversion problems with verified answers and the setup for each' },
  { title: 'SAT Mean and Median Questions: Data Practice With Explanations', keyword: 'sat math practice test', volume: 50000, tool: 'math', skills: ['one-variable-data'], asset: 'generated mean, median and missing-value problems with verified answers and the unsorted-list trap' },
  { title: 'SAT Right Triangle Trigonometry: Sine, Cosine and Tangent Practice', keyword: 'sat test questions', volume: 50000, tool: 'math', skills: ['right-triangles-and-trigonometry'], asset: 'generated right-triangle problems with verified answers, labeling opposite, adjacent and hypotenuse each time' },
  { title: 'SAT Area and Volume Questions: Formulas and the Scaling Trap', keyword: 'sat exam questions', volume: 50000, tool: 'math', skills: ['area-and-volume'], asset: 'generated area, volume and similar-figure scaling problems with verified answers' },
  { title: 'SAT Exponential Functions: Growth, Decay and Function Notation Practice', keyword: 'sat math review', volume: 500, tool: 'math', skills: ['nonlinear-functions'], asset: 'generated exponential and quadratic function problems with verified answers and the order-of-operations trap' },
  { title: 'SAT Rhetorical Synthesis Questions: How to Use the Student Notes', keyword: 'sat writing practice', volume: 50000, tool: 'reading-writing', skills: ['rhetorical-synthesis'], asset: 'the rhetorical synthesis question bank: the stated goal in each item and why each wrong choice misses it' },
  { title: 'SAT Central Ideas and Details Questions: Finding the Main Idea Fast', keyword: 'sat reading questions', volume: 5000, tool: 'reading-writing', skills: ['central-ideas-and-details'], asset: 'the central ideas question bank: the main idea of each passage and why the narrow or overreaching choices fail' },
];
