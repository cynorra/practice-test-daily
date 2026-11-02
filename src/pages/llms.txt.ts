import type { APIRoute } from "astro";
import { getCollection } from "astro:content";
import { SITE, AUTHOR } from "../site.config.js";
import { mathSkills, rwSkills } from "../lib/quiz/bank.js";

export const GET: APIRoute = async () => {
  const u = (p: string) => new URL(p, SITE.url).href;
  const guides = (await getCollection("guides", (g) => !g.data.draft)).sort((a, b) => a.data.title.localeCompare(b.data.title));
  const body = `# ${SITE.name}

> ${SITE.description} Written by ${AUTHOR.name}. Independent; not affiliated with College Board or ETS. Questions are original practice, not official questions.

## SAT Math practice (generated questions, answers verified by code)

${mathSkills().map((s) => `- [${s.name}](${u(s.href)}): ${s.domain}`).join("\n")}

## SAT Reading and Writing practice (hand-written questions)

${rwSkills().map((s) => `- [${s.name}](${u(s.href)}): ${s.domain}, ${s.count} questions`).join("\n")}

## English tests (hand-written questions)

- [English tests](${u("/english/")}): level, vocabulary and grammar practice
- [English level test](${u("/english/english-level-test/")}): 30 questions, CEFR A1–C2 estimate
- [Vocabulary test](${u("/english/vocabulary-test/")}): 40 words in context
- [English grammar test](${u("/english/grammar-test/")}), [pronouns](${u("/english/grammar-test/pronouns/")}), [verb tenses](${u("/english/grammar-test/verbs/")})
- [TOEFL reading and writing practice](${u("/toefl/")}): our own practice questions, not official TOEFL items

## Guides

- [How the digital SAT works](${u("/sat/")})
${guides.map((g) => `- [${g.data.title}](${u(`/guides/${g.id}/`)}): ${g.data.description}`).join("\n")}

## About

- [How we write and check questions](${u("/how-we-write-questions/")}) · [Editorial policy](${u("/editorial-policy/")}) · [About](${u("/about/")}) · [Author](${u(`/author/${AUTHOR.slug}/`)})
`;
  return new Response(body, { headers: { "Content-Type": "text/plain; charset=utf-8" } });
};
