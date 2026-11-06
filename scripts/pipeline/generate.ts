/**
 * Practice Tests Daily article generator — the aiandsoftwarehub pipeline, adapted for an
 * SAT practice site and a Firestore backend.
 *
 *   npx tsx scripts/pipeline/generate.ts --dry-run        # write nothing; print the verdict
 *   npx tsx scripts/pipeline/generate.ts                  # one article -> draft (pending review)
 *   npx tsx scripts/pipeline/generate.ts --date 2026-11-10
 *
 * Flow: pick the next topic from topics.ts that passes the topic gate and is not
 * a duplicate -> build its evidence (code-verified practice questions from the
 * site's own bank + the SAT facts block) -> keyword plan (autocomplete) and an
 * editorial form chosen against the corpus -> Gemini writes structured JSON ->
 * deterministic gates -> one repair pass with the gate messages -> if it passes,
 * the exact markdown that was validated is written to src/content/guides/<slug>.md
 * with draft: true and the SAME bytes are upserted to Firestore as status 'draft'.
 * Nothing goes live here: auto-publish.ts runs the AI audit and publishes.
 *
 * Hard rules from the playbook: validated bytes = written bytes = pushed bytes;
 * links to unknown slugs are stripped before validation; truncated output fails;
 * the final Gemini error is never swallowed (exit code 1).
 */
import { readFileSync, writeFileSync, existsSync, readdirSync, copyFileSync } from 'node:fs';
import { join } from 'node:path';
import { initGemini, callGemini, slugify, isDuplicateTopic, fetchAllArticles, upsertArticle, SITE_NAME, SITE_NICHE, type ArticleRow } from './lib/shared';
import { TOPICS } from './topics';
import { findTopicIssues, type SatTopic } from './lib/sat-intent';
import { factsFor, findUngroundedTestFacts } from './lib/facts';
import { englishExamples, requiredExamples, findTestPageLinkIssues, type Example } from './lib/english-evidence';
import { isEnglishTopic } from './lib/sat-intent';
import { buildKeywordPlan, keywordPromptBlock, findKeywordCoverageIssues, findPlannerKeywordIssues, plannerKeywordPromptBlock, type KeywordPlan } from './lib/keywords';
import { pickEditorialForm, formPromptBlock, findOpeningIssues, openingKey } from './lib/forms';
import { findLowValueSignals, findBridgeFiller, swapBannedVerbs, findGenericFaqAnswers } from './lib/value';
import { findStockHeadings, findReusedHeadings, findStockLabels, collectHeadingSet } from './lib/structure';
import { findTitlePasteIssues } from './lib/title-paste';
import { findUnsupportedClaims, findTitlePromiseIssues } from './lib/claims-check';
import { findHypeIssues, findFieldClaimIssues, findBrokenInternalLinks } from './lib/hype-check';
// The site's own question bank: the same code the practice pages run.
import { makeSet, SKILLS as MATH_SKILLS } from '../../src/lib/quiz/math.js';
import { RW } from '../../src/lib/quiz/bank.js';

const ROOT = join(import.meta.dirname, '..', '..');
const GUIDES = join(ROOT, 'src', 'content', 'guides');
const IMG_DIR = join(ROOT, 'public', 'images', 'guides');
const TOPIC_IMAGES: Record<string, { alt: string; figAlt: string; caption: string }> = JSON.parse(readFileSync(join(ROOT, 'src', 'lib', 'topic-images.json'), 'utf8'));

/** Original illustration for a topic: the figure goes in the body (validated with the text); the hero is copied to the slug at write time. */
function figureHtml(topic: SatTopic): string {
  const m = topic.image ? TOPIC_IMAGES[topic.image] : undefined;
  if (!topic.image || !m) return '';
  return `<figure class="guide-figure"><img src="/images/guides/topic-${topic.image}-figure.png" alt="${esc(m.figAlt)}" width="1000" height="560" loading="lazy" decoding="async"><figcaption>${m.caption}</figcaption></figure>

`;
}

/** Copy the hero to <slug>.png and register its alt text so the guide page and og:image pick it up. */
function attachHero(slug: string, topic: SatTopic): void {
  const m = topic.image ? TOPIC_IMAGES[topic.image] : undefined;
  if (!topic.image || !m) return;
  copyFileSync(join(IMG_DIR, `topic-${topic.image}.png`), join(IMG_DIR, `${slug}.png`));
  const jsonPath = join(ROOT, 'src', 'lib', 'guide-images.json');
  const cur = JSON.parse(readFileSync(jsonPath, 'utf8'));
  cur[slug] = { alt: m.alt, figAlt: m.figAlt, caption: m.caption };
  writeFileSync(jsonPath, JSON.stringify(cur, null, 2) + '\n');
}
const DRY = process.argv.includes('--dry-run');
const dateArg = process.argv.indexOf('--date');
const PUBLISH_DATE = dateArg > -1 ? process.argv[dateArg + 1] : new Date().toISOString().slice(0, 10);
const MAX_OUTPUT_TOKENS = 8192;
const MIN_WORDS = 900;

// ---- evidence: practice items the article must use ---------------------------------------

function examplesFor(topic: SatTopic): Example[] {
  const out: Example[] = [];
  for (const skill of topic.skills) {
    if (MATH_SKILLS[skill]) {
      // Seeds 101+ so the article's problems differ from the practice page's default set.
      for (const q of makeSet(skill, 101, 4)) {
        out.push({ skill, stem: q.stem.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' '), choices: q.choices, answer: q.choices[q.answer], explanation: q.explanation.join(' '), href: `/sat/math/${skill}/` });
      }
    } else if (isEnglishTopic(topic)) {
      out.push(...englishExamples(skill));
    } else if ((RW as any)[skill]) {
      for (const q of (RW as any)[skill].items.slice(0, 5)) {
        out.push({ skill, stem: q.stem, choices: q.choices, answer: q.choices[q.answer], explanation: q.explanation.join(' '), href: `/sat/reading-writing/${skill}/` });
      }
    }
  }
  return out;
}

function examplesBlock(ex: Example[], need: number): string {
  if (!ex.length) return '';
  return `\nPRACTICE ITEMS YOU MUST USE (from the site's own question bank; math answers are verified by code — copy numbers and answers EXACTLY, do not change them, do not invent other problems with new numbers):\n${ex
    .map((e, i) => `#${i + 1} [${e.skill}] ${e.stem}\n   Choices: ${e.choices.join(' | ')}\n   Correct: ${e.answer}\n   Why: ${e.explanation}`)
    .join('\n')}\nUse at least ${need} of them in the article, worked or explained in your own words, and link the practice page(s): ${[...new Set(ex.map((e) => e.href))].join(', ')}.\n`;
}

/** At least three supplied items must appear (their correct answer and a distinctive piece of the stem). */
function findExampleUsageIssues(html: string, ex: Example[], need: number): string[] {
  if (!ex.length) return [];
  const plain = html.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ');
  const used = ex.filter((e) => {
    const probe = e.stem.replace(/^.*?(?=[A-Z0-9(])/, '').slice(0, 28);
    return plain.includes(e.answer) && (plain.includes(probe) || plain.includes(e.stem.slice(-40)));
  });
  return used.length >= Math.min(need, ex.length) ? [] : [`uses only ${used.length} of the supplied practice items (need ${need}): reproduce them with their exact numbers and answers`];
}

// ---- output contract --------------------------------------------------------------------------
const SCHEMA = {
  type: 'object',
  properties: {
    title: { type: 'string' },
    metaDescription: { type: 'string' },
    quickAnswer: { type: 'string' },
    bodyHtml: { type: 'string' },
    faqs: { type: 'array', items: { type: 'object', properties: { question: { type: 'string' }, answer: { type: 'string' } }, required: ['question', 'answer'] } },
  },
  required: ['title', 'metaDescription', 'quickAnswer', 'bodyHtml', 'faqs'],
};
interface Draft { title: string; metaDescription: string; quickAnswer: string; bodyHtml: string; faqs: { question: string; answer: string }[] }

const SYSTEM = `You write for ${SITE_NAME}, a free SAT practice site (${SITE_NICHE}). You are precise and plain-spoken. You never invent facts, statistics, studies, quotes, percentiles or score promises. You only state facts about the test that appear in the FACTS block, and you only use practice problems that are supplied to you, with their exact numbers. Return only the requested JSON.`;

function buildPrompt(topic: SatTopic, ex: Example[], plan: KeywordPlan, formBlock: string, candidates: ArticleRow[], feedback = ''): string {
  const links = candidates.filter((c) => c.status === 'published').slice(0, 25).map((c) => `- /guides/${c.slug}/ — ${c.title}`).join('\n');
  return `Write ${isEnglishTopic(topic) ? 'an English-learning guide' : 'an SAT guide'}.
Working title: "${topic.title}"
What this page must deliver that an AI Overview cannot: ${topic.asset}.
${plannerKeywordPromptBlock({ term: topic.keyword, volume: topic.volume, plannerDate: '2026-11-01' })}
${keywordPromptBlock(plan)}
${factsFor(topic.tool)}
${examplesBlock(ex, requiredExamples(topic))}
${formBlock}
FORMAT
- bodyHtml: HTML using only <h2>, <h3>, <p>, <ul>, <ol>, <li>, <strong>, <em>, <code>, <table>/<thead>/<tbody>/<tr>/<th>/<td>, <a href>. No <h1>, no inline styles, no scripts, no markdown.
- High concrete detail density: Wrap all math formulas, equations, inequalities, variables, numbers in worked steps, and test tokens in <code> tags (e.g. <code>2x + 5 &lt; 11</code>, <code>x &gt; 3</code>, <code>f(x)</code>).
- 1,200 to 1,700 words in bodyHtml. Short paragraphs. At least one table if the topic has numbers to compare.
- WORKED PRACTICE PROBLEMS: You MUST include at least 3 distinct practice problems from the 'PRACTICE ITEMS YOU MUST USE' list below. For each one, reproduce its exact question stem and numbers faithfully, quote the correct answer, and explain the step-by-step solution and wrong-answer traps in detail. Walking through all 3 problems step-by-step ensures thoroughness and meets the 1,200+ word requirement.
- quickAnswer: 2-3 sentences that answer the title directly with a concrete detail; it is shown in a box at the top.
- faqs: 3 or 4 questions people actually search. MANDATORY RULE: EVERY FAQ answer MUST include at least one concrete number, test duration/count from facts (e.g. 134 minutes, 44 questions, 2 modules), score range (e.g. 200 to 800), or math formula in <code>. Never write an answer without a number or code token; generic textbook definitions without numbers are strictly rejected.
- metaDescription: 120-160 characters, MUST include the primary keyword ("${topic.keyword}"), no hype.
- title: 40-70 characters, MUST include the primary keyword ("${topic.keyword}") naturally, no year, no promises.
- Primary keyword ("${topic.keyword}") placement: MUST appear naturally in the title, in the metaDescription, in the first 120 words of the body, in at least one <h2> or <h3> heading (or FAQ question), and at least 3 times in the body prose.
- Internal links: only to the practice pages named above and, if relevant, to these guides (copy the path exactly):
${links || '- (none yet)'}
- Do not start with "In this article", "Whether you", "Are you", or any sentence about the article itself.
- Never claim to be official, never use the words guarantee/guaranteed, never promise a score increase.
- Finish all paragraphs and sentences cleanly. Do not leave trailing or unfinished sentences.
${feedback ? `\nYOUR PREVIOUS DRAFT FAILED THESE CHECKS — fix every one:\n${feedback}\n` : ''}`;
}

// ---- assembly: the exact markdown that is validated, written and pushed -------------------------
const esc = (s: string) => s.replace(/"/g, "'");
function assemble(d: Draft, topic: SatTopic, knownSlugs: Set<string>): { md: string; html: string; title: string; description: string } {
  let body = swapBannedVerbs(d.bodyHtml).trim();
  // Rule 3: unwrap links to guides that don't exist (practice pages under /sat/ always exist).
  body = body.replace(/<a [^>]*href=["'](?:https?:\/\/[^/"']+)?\/guides\/([^"'#?/]+)\/?["'][^>]*>([\s\S]*?)<\/a>/gi, (m, slug, text) => (knownSlugs.has(slug) ? m : text));
  const faq = d.faqs.length ? `\n\n<h2>Frequently asked questions</h2>\n${d.faqs.map((f) => `<h3>${f.question.trim()}</h3>\n<p>${f.answer.trim()}</p>`).join('\n')}` : '';
  const html = `<div class="key-takeaway"><p><strong>Quick answer:</strong> ${d.quickAnswer.trim()}</p></div>\n\n${figureHtml(topic)}${body}${faq}\n`;
  const title = d.title.trim().slice(0, 80);
  const description = d.metaDescription.trim().replace(/\s+/g, ' ');
  const md = `---\ntitle: "${esc(title)}"\ndescription: "${esc(description)}"\npublished: ${PUBLISH_DATE}\ntool: ${topic.tool}\ndraft: true\n---\n\n${html}`;
  return { md, html, title, description };
}

function validate(a: { html: string; title: string; description: string }, d: Draft, topic: SatTopic, ex: Example[], plan: KeywordPlan, corpus: { headings: Set<string>; openings: Set<string>; slugs: Set<string> }): string[] {
  const plain = a.html.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
  const words = plain.split(' ').length;
  const issues: string[] = [];
  if (a.title.length < 15 || a.title.length > 80) issues.push(`title must be 15-80 characters (is ${a.title.length})`);
  if (a.description.length < 70 || a.description.length > 165) issues.push(`metaDescription must be 70-165 characters (is ${a.description.length})`);
  if (/\b20[0-2]\d\b/.test(a.title)) issues.push('title contains a year');
  if (words < MIN_WORDS) issues.push(`too short: ${words} words (need ${MIN_WORDS}+ of substance, not padding)`);
  // Rule 9: a body that doesn't end on a finished sentence is truncated output.
  const lastText = d.bodyHtml.replace(/<[^>]+>/g, ' ').trim();
  if (!/[.!?:)"”]$/.test(lastText)) issues.push('body does not end on a finished sentence (truncated output)');
  if (/<h1[\s>]|<script|style=/i.test(a.html)) issues.push('forbidden markup (<h1>, <script> or inline style)');
  issues.push(...findLowValueSignals(a.html, topic.tool));
  issues.push(...findBridgeFiller(a.html));
  const stock = findStockHeadings(a.html);
  if (stock.length) issues.push(`stock headings: ${stock.join(', ')}`);
  issues.push(...findReusedHeadings(a.html, corpus.headings));
  issues.push(...findStockLabels(a.html));
  issues.push(...findTitlePasteIssues(a.html, a.title));
  issues.push(...findUnsupportedClaims(plain));
  issues.push(...findTitlePromiseIssues(a.title, a.html));
  issues.push(...findHypeIssues(plain, 'body'));
  issues.push(...findFieldClaimIssues({ title: a.title, metaDescription: a.description, faqs: d.faqs }));
  issues.push(...findBrokenInternalLinks(a.html, corpus.slugs));
  if (!isEnglishTopic(topic)) issues.push(...findUngroundedTestFacts(plain));
  issues.push(...findOpeningIssues(a.html, corpus.openings));
  issues.push(...findGenericFaqAnswers(d.faqs));
  issues.push(...findExampleUsageIssues(a.html, ex, requiredExamples(topic)));
  issues.push(...findTestPageLinkIssues(a.html, topic));
  issues.push(...findPlannerKeywordIssues({ term: topic.keyword, volume: topic.volume, plannerDate: '2026-11-01' }, { title: a.title, seoTitle: a.title, metaDescription: a.description, html: a.html, faqs: d.faqs }).issues);
  issues.push(...findKeywordCoverageIssues(plan, a.html, d.faqs));
  return issues;
}

// ---- main ------------------------------------------------------------------------------------------
function localRows(): ArticleRow[] {
  if (!existsSync(GUIDES)) return [];
  return readdirSync(GUIDES).filter((f) => f.endsWith('.md')).map((f) => {
    const t = readFileSync(join(GUIDES, f), 'utf8');
    const title = /title: "(.*)"/.exec(t)?.[1] ?? f;
    return { slug: f.replace(/\.md$/, ''), title, description: '', body_md: t, tool: '', status: /draft: true/.test(t) ? 'draft' : 'published', published_at: null } as ArticleRow;
  });
}

async function main() {
  const clients = initGemini();
  let rows: ArticleRow[] = [];
  try { rows = await fetchAllArticles(); } catch (e) {
    if (!DRY) throw e;
    console.warn(`Firestore not reachable (${(e as Error).message}); dry run continues with local guides only.`);
  }
  const local = localRows();
  const all = [...new Map([...local, ...rows].map((r) => [r.slug, r])).values()];
  const titles = all.map((r) => r.title);
  const corpus = {
    headings: collectHeadingSet(all.map((r) => r.body_md)),
    openings: new Set(all.map((r) => openingKey(r.body_md)).filter(Boolean)),
    slugs: new Set(all.filter((r) => r.status === 'published').map((r) => r.slug)),
  };

  const topic = TOPICS.find((t) => findTopicIssues(t).length === 0 && !isDuplicateTopic(t.title, titles) && !all.some((r) => r.slug === slugify(t.title)));
  if (!topic) { console.log('No eligible topic left in topics.ts — add topics from the Keyword Planner export.'); return; }
  console.log(`Topic: ${topic.title}  [${topic.keyword}, ${topic.volume}/mo, ${topic.tool}]`);

  const ex = examplesFor(topic);
  const plan = await buildKeywordPlan(topic.title);
  const usedForms = all.map((r) => (r as any).meta?.form as string | undefined);
  const form = pickEditorialForm(topic.tool, slugify(topic.title), usedForms);
  console.log(`Form: ${form.id} · practice items: ${ex.length} · autocomplete queries: ${plan.queries.length}${plan.available ? '' : ' (unavailable)'}`);

  let feedback = '';
  for (let attempt = 1; attempt <= 3; attempt++) {
    const raw = await callGemini(clients, buildPrompt(topic, ex, plan, formPromptBlock(form), all, feedback), SCHEMA, MAX_OUTPUT_TOKENS, false, SYSTEM);
    if (!raw) { console.warn(`Attempt ${attempt}: no completed response from Gemini.`); continue; }
    let d: Draft;
    try { d = JSON.parse(raw); } catch { feedback = '- the response was not valid JSON matching the schema'; console.warn(`Attempt ${attempt}: invalid JSON`); continue; }
    const a = assemble(d, topic, corpus.slugs);
    const issues = validate(a, d, topic, ex, plan, corpus);
    if (issues.length) {
      console.warn(`Attempt ${attempt}: ${issues.length} quality issue(s):\n${issues.map((i) => `  - ${i}`).join('\n')}`);
      feedback = issues.map((i) => `- ${i}`).join('\n');
      continue;
    }
    const slug = slugify(a.title);
    if (DRY) {
      const out = join(ROOT, '.dry-run');
      if (!existsSync(out)) (await import('node:fs')).mkdirSync(out);
      writeFileSync(join(out, `${slug}.md`), a.md);
      console.log(`PASS (dry run): .dry-run/${slug}.md — nothing written to the site or Firestore.`);
      return;
    }
    // Rule 1: write, read back, push the bytes that were read back.
    const file = join(GUIDES, `${slug}.md`);
    writeFileSync(file, a.md);
    attachHero(slug, topic);
    const written = readFileSync(file, 'utf8');
    if (written !== a.md) throw new Error('written file differs from validated text');
    const body = written.split(/^---\n[\s\S]*?\n---\n\n/m)[1];
    await upsertArticle({ slug, title: a.title, description: a.description, body_md: body, tool: topic.tool, status: 'draft', published_at: null, meta: { form: form.id, keyword: topic.keyword, publishOn: PUBLISH_DATE, skills: topic.skills } } as any);
    console.log(`DRAFT written: src/content/guides/${slug}.md and Firestore (status draft). auto-publish.ts decides if it goes live.`);
    return;
  }
  // Rule 4: fail loudly.
  console.error('FAILED: no draft passed the quality gates after 3 attempts.');
  process.exit(1);
}

main().catch((e) => { console.error(e); process.exit(1); });
