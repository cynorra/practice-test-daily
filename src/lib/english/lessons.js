// Page copy for the English tests, written by hand for each page. A block is
// { h2, p: [...], ul: [...], table: { head, rows } }. `pre` renders above the
// practice set, `post` below it. Nothing here is shared between pages.

export const ENGLISH_PAGES = {
  level: {
    path: "/english/english-level-test/",
    title: "English Level Test: Find Your CEFR Level (A1–C2)",
    h1: "English level test",
    description: "Free English level test with 30 questions, five for each CEFR level from A1 to C2. Get an estimated band and an explanation for every answer.",
    lead: "Thirty questions, five for each level from A1 to C2, in grammar, vocabulary and short reading. At the end you see an estimated band, not a certificate.",
    pre: [
      { h2: "How the test works", p: [
        "The questions start easy and get harder. The first five are A1 questions, such as choosing the right form of \"be\"; the last five are C2 questions that need fine control of grammar, word meaning and the logic of a short text.",
        "There is no timer. Answer in order, and do not look anything up. If you are not sure, pick the answer that sounds most natural, then read the explanation. Plan on about fifteen to twenty minutes.",
      ] },
      { h2: "How your estimate is calculated", p: [
        "Each level has five questions. A level counts as secure when you answer four or five of them correctly and every lower level is secure too. If the next level up has at least two correct answers, the estimate covers both levels, for example B1–B2. Otherwise it shows the secure level alone.",
      ], table: { head: ["Your result", "Estimate shown"], rows: [
        ["4–5 correct at A1 to B1, 3 at B2", "B1–B2"],
        ["4–5 correct at A1 to B2, 0–1 at C1", "B2"],
        ["Fewer than 4 correct at A1, but 2 or 3", "A1"],
        ["Fewer than 2 correct at A1", "below A1"],
      ] },
        p2: ["Because there are only five questions per level, one lucky guess or one careless slip can move the result. Treat the estimate as a starting point and take the test again a few weeks later."] },
    ],
    post: [
      { h2: "What the levels mean in practice", p: [
        "The six levels come from the Common European Framework of Reference for Languages, usually shortened to CEFR. A1 and A2 describe a basic user, B1 and B2 an independent user, and C1 and C2 a proficient user. The short descriptions below are our own summary, not a quotation of the official text.",
      ], table: { head: ["Level", "What you can usually do", "What to practice next"], rows: [
        ["A1", "Understand and use very simple phrases about yourself and daily needs.", "Core verbs (be, have, do), numbers, simple questions."],
        ["A2", "Handle short, routine exchanges and write simple messages.", "Past simple, comparatives, countable and uncountable nouns."],
        ["B1", "Cope with most travel situations and write connected text on familiar topics.", "Conditionals, present perfect, linking words."],
        ["B2", "Follow longer texts and talk with fluency on many subjects.", "Passive forms, reported speech, word families."],
        ["C1", "Understand demanding texts and express ideas flexibly.", "Inversion, collocations, tone and register."],
        ["C2", "Handle nearly everything with precision and nuance.", "Subtle meaning differences, idiom, formal structures."],
      ] } },
      { h2: "Using the result", p: [
        "If your estimate is below the level a course or exam asks for, work on the level you just missed rather than the level you want. Review each explanation you got wrong, then try the vocabulary, grammar, pronoun and verb tests on this site for the same weak spots.",
        "Remember that no website test replaces an official exam. If a school, employer or immigration office needs proof of your English, you will need a certificate from an approved test.",
      ] },
    ],
    facts: [{ label: "Questions", value: "30 (5 per level)" }, { label: "Levels", value: "A1 to C2" }, { label: "Time", value: "about 15–20 minutes" }, { label: "Result", value: "Estimated band" }],
  },

  vocabulary: {
    path: "/english/vocabulary-test/",
    title: "Vocabulary Test: 40 Words From Everyday to Advanced",
    h1: "Vocabulary test",
    description: "Free vocabulary test with 40 English words in context, in four bands from everyday to advanced. Every answer explains the meaning and why the other choices fail.",
    lead: "Forty words in four bands of ten, each in a sentence. Choose the meaning that fits the context, then read the explanation for the meaning and an example.",
    pre: [
      { h2: "Words in context, not word lists", p: [
        "Each question shows a word inside a sentence and asks what it means there. That is closer to real reading than a list of definitions, because the sentence usually gives you a clue: a contrast, an example, or a result.",
        "The questions are grouped by band. Everyday words come first, then intermediate, upper-intermediate and advanced. The bands are the author's judgment of how common and how abstract a word is; they are not an official ranking.",
      ] },
      { h2: "How to get the most from it", p: [
        "Read the whole sentence before you look at the choices. If you cannot recall the word, look for a clue: words like \"but\" and \"however\" signal opposites, and \"for example\" signals an illustration.",
      ], ul: [
        "Cover the choices and guess a meaning from the sentence first.",
        "After each answer, read the example sentence in the explanation and say it aloud.",
        "Write down every word you missed and use each one in a sentence of your own within a day.",
      ] },
    ],
    post: [
      { h2: "Reading your score", p: [
        "A rough guide: if you answer nearly everything in the first two bands correctly and miss most of the last two, your reading vocabulary is probably at an intermediate level. Missing items in the second band suggests that common academic words, such as \"efficient\" or \"adequate\", are the best place to start.",
        "A single set of forty questions only samples a vocabulary of thousands of words. Retake it after a few weeks of reading and compare which band changed.",
      ], table: { head: ["Band", "Words in this test", "What they are like"], rows: [
        ["Everyday", "queue, borrow, enormous", "Common words in daily conversation"],
        ["Intermediate", "reluctant, exaggerate, efficient", "Words in news and workplace texts"],
        ["Upper-intermediate", "inevitable, scarce, ambiguous", "Words in articles and academic reading"],
        ["Advanced", "ubiquitous, meticulous, ephemeral", "Words in formal writing and literature"],
      ] } },
      { h2: "Next steps", p: [
        "Vocabulary grows fastest when you meet a word several times in different contexts. Read something you enjoy, keep a short list, and test yourself again. The grammar test on this site is a good companion if you also want to check how you use words in sentences.",
      ] },
    ],
    facts: [{ label: "Words", value: "40 in 4 bands" }, { label: "Format", value: "Word in a sentence" }, { label: "Explanations", value: "Meaning, example, distractors" }, { label: "Time", value: "about 15 minutes" }],
  },

  grammar: {
    path: "/english/grammar-test/",
    title: "English Grammar Test: 30 Questions With Explanations",
    h1: "English grammar test",
    description: "Free English grammar test with 30 mixed questions: tenses, prepositions, quantifiers, relative pronouns and more, each with an explanation for every choice.",
    lead: "Thirty mixed questions on the points that cost learners the most marks: prepositions, quantifiers, tenses, relative pronouns and verb patterns.",
    pre: [
      { h2: "What the test covers", p: [
        "The questions mix several areas on purpose, so that you practice choosing the rule as well as applying it. You will meet countable and uncountable nouns (much and many, fewer and less), verb patterns (enjoy doing, suggest doing), conditionals, reported questions, passive forms, and the choice between who, whom and whose.",
        "Each wrong answer is a mistake that learners really make. After you choose, the explanation tells you why the right answer works and why each of the other three does not.",
      ] },
      { h2: "A short routine", p: [
        "Do the whole test once without stopping. Then go back to every question you missed and write the rule in your own words. Tomorrow, retake only the questions you missed.",
      ], ul: [
        "Look at the word right before and after the gap; many rules depend on them.",
        "If two choices look right, find what makes one of them wrong, such as a plural verb after a singular subject.",
        "When a rule has an exception, note it with an example sentence.",
      ] },
    ],
    post: [
      { h2: "Rules behind the questions", p: [
        "The table lists the rules you will meet most often in this test, with one example each.",
      ], table: { head: ["Rule", "Example"], rows: [
        ["Uncountable nouns take much, not many", "There isn't much sugar left."],
        ["Enjoy, suggest and mind take the -ing form", "We enjoyed exploring the town."],
        ["After since, use a point in time; after for, a length of time", "Since last month / for a month"],
        ["Fewer with countable, less with uncountable", "fewer students, less water"],
        ["Look forward to is followed by -ing", "I look forward to seeing you."],
      ] } },
      { h2: "Going further", p: [
        "If you want to work on one area, try the pronoun test for subject, object and reflexive forms, or the verb test for tenses and irregular verbs. Both are shorter and each question there targets a single rule.",
      ] },
    ],
    facts: [{ label: "Questions", value: "30" }, { label: "Topics", value: "Mixed grammar" }, { label: "Explanations", value: "Every choice" }, { label: "Time", value: "about 15 minutes" }],
  },

  pronouns: {
    path: "/english/grammar-test/pronouns/",
    title: "Pronoun Test: Subject, Object, Possessive and Reflexive",
    h1: "Pronoun test",
    description: "Free English pronoun test with 20 questions on subject, object, possessive, reflexive and relative pronouns, plus a quick rules table and explanations.",
    lead: "Twenty questions on pronouns: I or me, hers or her, himself or him, who or whom. A rules table sits below the questions.",
    pre: [
      { h2: "Why pronouns cause mistakes", p: [
        "Pronouns change form depending on their job in the sentence. The same person can be \"I\", \"me\", \"my\", \"mine\" or \"myself\", and the right form depends on whether the pronoun is a subject, an object, a possessor or a repeat of the subject.",
        "A reliable trick is to remove the other person from the sentence. \"My brother and me are going\" sounds wrong once you hear \"me are going\", so the subject form \"I\" is needed.",
      ] },
      { h2: "How to use this set", p: [
        "Answer all twenty questions and read the explanation for each. Pay attention to the questions where the choices look similar, such as \"theirs\" and \"their\", because the difference is whether a noun follows.",
      ] },
    ],
    post: [
      { h2: "Pronoun forms at a glance", p: [
        "Use this table to check a form when an explanation mentions it.",
      ], table: { head: ["Subject", "Object", "Possessive determiner", "Possessive pronoun", "Reflexive"], rows: [
        ["I", "me", "my", "mine", "myself"],
        ["you", "you", "your", "yours", "yourself"],
        ["he", "him", "his", "his", "himself"],
        ["she", "her", "her", "hers", "herself"],
        ["it", "it", "its", "—", "itself"],
        ["we", "us", "our", "ours", "ourselves"],
        ["they", "them", "their", "theirs", "themselves"],
      ] } },
      { h2: "Three habits that help", p: [
        "After a preposition, use the object form: between you and me, to Sara and me. Use reflexive pronouns only when the doer and the receiver are the same person. And when a pronoun could point to two people, repeat the name instead.",
      ] },
    ],
    facts: [{ label: "Questions", value: "20" }, { label: "Topic", value: "Pronouns" }, { label: "Includes", value: "Forms table" }, { label: "Explanations", value: "Every choice" }],
  },

  verbs: {
    path: "/english/grammar-test/verbs/",
    title: "Verb Tense Test: 12 Tenses, Irregular Verbs and Agreement",
    h1: "Verb tense test",
    description: "Free English verb test with 20 questions on tenses, irregular verbs and subject-verb agreement, plus a table of the twelve tenses with explanations.",
    lead: "Twenty questions on tenses, irregular verbs and agreement, with a tense table below the set.",
    pre: [
      { h2: "What you will practice", p: [
        "Verb mistakes usually fall into three groups: choosing the wrong tense for the time frame, using the wrong form of an irregular verb, and making the verb disagree with its subject. This set has questions from all three groups.",
        "Look for time words first: yesterday, since, by next June, at 8 p.m. They usually point to one tense and rule out the others.",
      ] },
      { h2: "A way to work through it", p: [
        "Say the sentence aloud with each choice and listen for the one that sounds right, then check it against the explanation. Pay special attention to the pairs that are often confused, such as lay and lie, rise and raise, and simple past and present perfect.",
      ] },
    ],
    post: [
      { h2: "The twelve tenses", p: [
        "English has twelve tenses when you combine three time frames with four aspects. The table shows each one with a short example.",
      ], table: { head: ["", "Simple", "Continuous", "Perfect", "Perfect continuous"], rows: [
        ["Present", "She works.", "She is working.", "She has worked.", "She has been working."],
        ["Past", "She worked.", "She was working.", "She had worked.", "She had been working."],
        ["Future", "She will work.", "She will be working.", "She will have worked.", "She will have been working."],
      ] } },
      { h2: "Common irregular verbs", p: [
        "A short list of irregular verbs appears again and again. Learn the three forms together.",
      ], table: { head: ["Base", "Past", "Past participle"], rows: [
        ["swim", "swam", "swum"], ["see", "saw", "seen"], ["rise", "rose", "risen"], ["lay", "laid", "laid"], ["lie", "lay", "lain"],
      ] } },
    ],
    facts: [{ label: "Questions", value: "20" }, { label: "Topic", value: "Tenses and verb forms" }, { label: "Includes", value: "Tense table" }, { label: "Explanations", value: "Every choice" }],
  },
};
