// Reading and Writing: Standard English Conventions. Written by hand. Each
// item has one blank (______), four choices, one key, and an explanation that
// says why the key is right and what is wrong with each other choice.
// Passages use only well-established facts or plainly general statements.

export const BOUNDARIES = [
  {
    passage: "The honeybee waggle dance tells nestmates where to find food. The angle of the dance relative to vertical indicates the direction of the food source relative to the ______ the duration of the waggle run indicates its distance.",
    choices: ["sun, and", "sun and,", "sun", "sun, so that"],
    answer: 0,
    explanation: ["Two independent clauses (\"The angle … indicates the direction …\" and \"the duration … indicates its distance\") are joined here. Two independent clauses need a comma plus a coordinating conjunction: \"sun, and.\"", "\"sun and,\" puts the comma after the conjunction, which isn't standard.", "\"sun\" with no punctuation creates a run-on.", "\"so that\" says the second fact happens because of the first, which the passage doesn't claim."],
  },
  {
    passage: "Mount Everest's summit sits on the border between two countries ______ Nepal and China.",
    choices: ["countries:", "countries;", "countries, and", "countries. Those being"],
    answer: 0,
    explanation: ["A colon can introduce a list or explanation after a complete sentence. \"Mount Everest's summit sits on the border between two countries\" is complete, and \"Nepal and China\" names them.", "A semicolon must join two independent clauses; \"Nepal and China\" is not a clause.", "\"countries, and Nepal and China\" makes no grammatical sense.", "\"Those being Nepal and China\" is a fragment."],
  },
  {
    passage: "Octopuses can change the color of their skin in a fraction of a second. ______ specialized cells called chromatophores, which expand and contract to show or hide pigment.",
    choices: ["They do this with", "Doing this with", "Which they do with", "With"],
    answer: 0,
    explanation: ["The second sentence needs a subject and a verb. \"They do this with specialized cells …\" is a complete sentence.", "\"Doing this with …\" has no main verb, so it's a fragment.", "\"Which they do with …\" is a dependent clause standing alone, a fragment.", "\"With specialized cells …\" has no subject or main verb."],
  },
  {
    passage: "The Great Wall of China was not built all at once. Different dynasties built and rebuilt sections over many centuries ______ much of what visitors see today dates from the Ming dynasty.",
    choices: ["centuries;", "centuries,", "centuries", "centuries, which"],
    answer: 0,
    explanation: ["Both sides are independent clauses, and a semicolon correctly joins two closely related independent clauses.", "A comma alone between two independent clauses is a comma splice.", "No punctuation creates a run-on sentence.", "\"which\" would make the second part refer to \"centuries,\" and the sentence would no longer make sense."],
  },
  {
    passage: "Marie Curie was the first person to win Nobel Prizes in two different sciences ______ physics in 1903 and chemistry in 1911.",
    choices: ["sciences:", "sciences;", "sciences, they were", "sciences. Being"],
    answer: 0,
    explanation: ["A colon after a complete sentence introduces the specifics: \"physics in 1903 and chemistry in 1911.\"", "A semicolon needs an independent clause after it; the phrase that follows isn't one.", "\"sciences, they were physics …\" is a comma splice.", "\"Being physics … \" is a fragment."],
  },
  {
    passage: "Tardigrades, tiny animals sometimes called water bears ______ can survive extreme cold, heat and dehydration by entering a dormant state.",
    choices: [",", ";", ":", "—"],
    answer: 0,
    explanation: ["\"tiny animals sometimes called water bears\" is an interrupting phrase that begins with a comma, so it must close with a comma too.", "A semicolon would split the subject \"Tardigrades\" from its verb \"can survive.\"", "A colon would also separate the subject from its verb.", "A dash can set off a phrase, but only if a dash opens it too. Here a comma opens it, so it must close with a comma."],
  },
  {
    passage: "Bats find insects in the dark by echolocation. They emit high-pitched calls and listen for the ______ returning echoes reveal the size and position of nearby objects.",
    choices: ["echoes. The", "echoes the", "echoes, the", "echoes, and so the"],
    answer: 0,
    explanation: ["\"They emit … and listen for the echoes\" and \"The returning echoes reveal …\" are complete sentences; a period separates them correctly.", "No punctuation runs the two sentences together.", "A comma alone between them is a comma splice.", "\"and so\" would say the echoes reveal positions because the bats listen, which reverses the logic."],
  },
  {
    passage: "The periodic table arranges the chemical elements by atomic number, which is the number of ______ in an atom's nucleus.",
    choices: ["protons", "protons,", "protons;", "protons:"],
    answer: 0,
    explanation: ["The sentence ends right after \"in an atom's nucleus,\" so no punctuation belongs between \"protons\" and \"in.\"", "A comma would split \"the number of protons\" from \"in an atom's nucleus,\" which belong together.", "A semicolon needs an independent clause on both sides.", "A colon needs a complete sentence before it and an explanation after it."],
  },
  {
    passage: "Venus is the hottest planet in the solar system, even though Mercury is closer to the ______ thick atmosphere of carbon dioxide traps heat.",
    choices: ["Sun. Venus's", "Sun, Venus's", "Sun Venus's", "Sun, while Venus's"],
    answer: 0,
    explanation: ["The first sentence is complete after \"closer to the Sun,\" and \"Venus's thick atmosphere … traps heat\" is a second complete sentence, so a period is correct.", "A comma alone joins two independent clauses: a comma splice.", "No punctuation is a run-on.", "\"while\" signals a contrast, but the second clause explains the first rather than contrasting with it."],
  },
  {
    passage: "Many deserts are not hot. Antarctica, for example ______ classified as a desert because it receives very little precipitation.",
    choices: [", is", "; is", "is", ": is"],
    answer: 0,
    explanation: ["\"for example\" interrupts the sentence, so it needs a comma on both sides: \"Antarctica, for example, is classified …\"", "A semicolon would split the subject from its verb.", "Leaving out the comma leaves \"for example\" half set off.", "A colon can't come between a subject and its verb."],
  },
];

export const FORM_STRUCTURE_SENSE = [
  {
    passage: "The collection of fossils discovered in the quarry ______ several species that had never been described before.",
    choices: ["includes", "include", "are including", "have included"],
    answer: 0,
    explanation: ["The subject is \"collection,\" which is singular; \"of fossils discovered in the quarry\" only describes it. A singular subject takes \"includes.\"", "\"include\" agrees with \"fossils,\" not the true subject.", "\"are including\" is plural and an awkward tense.", "\"have included\" is plural."],
  },
  {
    passage: "Each of the volunteers who cleaned the beach last weekend ______ a certificate of thanks from the city.",
    choices: ["received", "were receiving", "have received", "receive"],
    answer: 0,
    explanation: ["\"Each\" is singular, and \"last weekend\" places the action in the past, so the singular past \"received\" is correct.", "\"were receiving\" is plural.", "\"have received\" is plural.", "\"receive\" is plural and present tense, which clashes with \"last weekend.\""],
  },
  {
    passage: "When the river flooded in the spring, the farmers moved their equipment to higher ground so that ______ would not be damaged.",
    choices: ["it", "they", "she", "this"],
    answer: 0,
    explanation: ["The pronoun refers to \"equipment,\" a singular, uncountable noun, so \"it\" is correct.", "\"they\" would refer to the farmers, which changes the meaning.", "\"she\" has no antecedent.", "\"this\" is vague; it could refer to the whole situation."],
  },
  {
    passage: "By the time the expedition reached the summit, the team ______ for nearly nine hours.",
    choices: ["had been climbing", "has been climbing", "climbs", "will have climbed"],
    answer: 0,
    explanation: ["The climbing happened before another past event (reaching the summit), so the past perfect progressive \"had been climbing\" is correct.", "\"has been climbing\" is present perfect and doesn't fit a past narrative.", "\"climbs\" is present tense.", "\"will have climbed\" is future."],
  },
  {
    passage: "Neither the coach nor the players ______ expecting the match to be postponed.",
    choices: ["were", "was", "is", "has been"],
    answer: 0,
    explanation: ["With \"neither … nor,\" the verb agrees with the nearer subject, \"players,\" which is plural: \"were.\"", "\"was\" agrees with \"coach,\" the farther subject.", "\"is\" is singular and present tense.", "\"has been\" is singular."],
  },
  {
    passage: "Walking through the museum's new wing, ______",
    choices: ["the students were impressed by the size of the dinosaur skeletons.", "the size of the dinosaur skeletons impressed the students.", "the dinosaur skeletons impressed the students with their size.", "impressive was the size of the dinosaur skeletons to the students."],
    answer: 0,
    explanation: ["The opening phrase describes whoever is walking, so the subject right after the comma must be the walkers: \"the students.\"", "This makes \"the size\" the one walking through the museum, a dangling modifier.", "This makes \"the dinosaur skeletons\" the walkers.", "This also leaves the opening phrase without a logical subject."],
  },
  {
    passage: "The researchers compared the two methods and found that the newer one was faster, cheaper and ______",
    choices: ["more accurate.", "had more accuracy.", "it was more accurate.", "accuracy was better."],
    answer: 0,
    explanation: ["Items in a list should share the same form. \"faster, cheaper and more accurate\" keeps three comparative adjectives parallel.", "\"had more accuracy\" breaks the pattern with a verb phrase.", "\"it was more accurate\" adds a new clause into the list.", "\"accuracy was better\" also breaks the parallel structure."],
  },
  {
    passage: "The city's oldest bridge, along with two of its newer ones, ______ scheduled for repairs next year.",
    choices: ["is", "are", "were", "have been"],
    answer: 0,
    explanation: ["\"along with two of its newer ones\" is an add-on phrase that doesn't change the subject. The subject is \"bridge,\" singular, and \"next year\" calls for the present \"is scheduled.\"", "\"are\" treats the phrase as part of the subject.", "\"were\" is plural and past.", "\"have been\" is plural."],
  },
  {
    passage: "Hummingbirds beat their wings so quickly that the movement ______ a humming sound, which is how the birds got their name.",
    choices: ["produces", "produce", "producing", "to produce"],
    answer: 0,
    explanation: ["The clause after \"so quickly that\" needs a main verb that agrees with \"the movement,\" which is singular: \"produces.\"", "\"produce\" is plural.", "\"producing\" is not a main verb, which leaves the clause incomplete.", "\"to produce\" is also not a main verb."],
  },
  {
    passage: "The novel was so popular that the publisher printed a second edition only three weeks after the first one ______",
    choices: ["had sold out.", "sells out.", "will sell out.", "is selling out."],
    answer: 0,
    explanation: ["The first edition sold out before the second edition was printed, both in the past, so the past perfect \"had sold out\" correctly shows the earlier event.", "\"sells out\" is present tense.", "\"will sell out\" is future.", "\"is selling out\" is present progressive."],
  },
];
