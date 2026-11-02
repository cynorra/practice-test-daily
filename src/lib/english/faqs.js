// FAQ for each English and TOEFL page. Every question is unique across the site
// (tests/english.test.js checks this against the SAT pages and the guides).

export const ENGLISH_FAQS = {
  hub: [
    { q: "Are these tests official English certificates?", a: "No. They are practice tests written for this site. Only an approved exam such as TOEFL or IELTS gives a certified result, so use these to find weak spots, not as proof of your level." },
    { q: "Do I need an account to take an English test here?", a: "No. Every test runs in your browser without signing in, and nothing you answer is stored on a server." },
    { q: "Which English test should I take first?", a: "Start with the level test if you do not know where you stand. If you already know your level, pick the vocabulary or grammar test and move to the pronoun or verb test for a single rule at a time." },
  ],
  level: [
    { q: "How accurate is an online English level test?", a: "It gives a rough estimate only. With five questions per level, a few guesses can move the result by a level, so retake the test later and look at the pattern rather than at one score." },
    { q: "What does a B2 result mean for an exam like TOEFL or IELTS?", a: "A B2 estimate suggests you can follow most general texts, but many universities ask for a specific official score. Check the requirement of the program you want, then practice the exam's own tasks." },
    { q: "Can this test tell me my IELTS band or TOEFL score?", a: "No. The CEFR bands shown here are a different scale from IELTS bands and the TOEFL scale, and this test does not convert between them." },
    { q: "How often should I retake the level test?", a: "Every four to six weeks is enough. Retaking it sooner mostly measures how well you remember the questions." },
  ],
  vocabulary: [
    { q: "How many English words do I need to know?", a: "There is no single number. What matters is knowing the words you meet in the texts you want to read, so work on words from your own reading rather than a fixed total." },
    { q: "Why does the test use sentences instead of a word and its translation?", a: "Many English words have several meanings, and the sentence shows which one is intended. Learning a word in a sentence also helps you use it correctly." },
    { q: "What is the best way to remember words I missed?", a: "Write your own sentence with each word, say it aloud, and review the list after a day, a week and a month. Seeing a word in several sentences helps more than copying its definition." },
  ],
  grammar: [
    { q: "Why do some correct answers feel wrong at first?", a: "Learners often rely on what sounds familiar from speech, and spoken English breaks several rules. The explanations point to the rule so you can tell the difference between common speech and standard written English." },
    { q: "Is it better to learn grammar rules or to read more?", a: "Both help. Reading builds a feel for natural sentences, and a few rules, such as the one for much and many, save you from errors that reading alone may not fix." },
    { q: "Should I memorize the whole rules table?", a: "No. Use it as a checklist. Pick the two rules you missed and use each one in three sentences of your own." },
  ],
  pronouns: [
    { q: "Is \"between you and I\" correct?", a: "Careful writers use \"between you and me\", because \"between\" is a preposition and takes the object form. \"Between you and I\" is common in speech but is treated as a mistake in formal English." },
    { q: "When do I use \"myself\" instead of \"me\"?", a: "Use \"myself\" when you are both the doer and the receiver of the action (I taught myself) or when you want to stress that you did it without help. Otherwise use \"me\"." },
    { q: "Can \"they\" refer to one person?", a: "Yes. Singular \"they\" is widely accepted for a person whose gender is unknown or not relevant, for example when the subject is \"everyone\". Some style guides prefer rewriting the sentence in formal contexts." },
  ],
  verbs: [
    { q: "How do I choose between the simple past and the present perfect?", a: "Use the simple past for an event at a finished time (I saw it yesterday). Use the present perfect when the time is not given or when the event still matters now (I have seen it)." },
    { q: "Why do \"lay\" and \"lie\" cause so much confusion?", a: "They look alike but are different verbs. \"Lay\" needs an object (lay a book down), while \"lie\" does not (lie down), and the past form of \"lie\" is \"lay\"." },
    { q: "Does a team take a singular or a plural verb?", a: "In American English a group noun such as team or committee usually takes a singular verb when it acts as one unit. British English often uses a plural verb." },
  ],
  toefl: [
    { q: "Is this the real TOEFL?", a: "No. The questions are written for this site as practice of the same skills, and ETS did not write or review them. ETS publishes its own official preparation materials." },
    { q: "Why are there no listening or speaking tasks?", a: "Those sections use audio and recorded answers, and this site only offers text-based practice. For those tasks, use ETS's official materials." },
    { q: "What changed in the TOEFL iBT score report in 2026?", a: "According to ETS, score reports for tests taken on or after January 21, 2026 use a 1–6 scale in half-point steps. For a two-year transition period ETS also reports a comparable overall score on the older 0–120 scale." },
    { q: "How long is the TOEFL iBT now?", a: "ETS says to allow about two hours, and notes that the test adapts, so test time and the number of items may vary." },
  ],
};
