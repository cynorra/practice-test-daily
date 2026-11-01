// Reading and Writing: Expression of Ideas, Craft and Structure, Information
// and Ideas. Written by hand; the key is always choices[0] here and the order
// is shuffled when a set is built. Passages use well-established facts only.

export const TRANSITIONS = [
  {
    passage: "Saturn is the second-largest planet in the solar system. ______ its average density is lower than that of water.",
    q: "Which choice completes the text with the most logical transition?",
    choices: ["Surprisingly,", "Therefore,", "For example,", "Similarly,"],
    explanation: ["A huge planet with a density lower than water's is unexpected, so \"Surprisingly\" fits the contrast in expectations.", "\"Therefore\" claims the low density follows from the size, which it doesn't.", "\"For example\" would need the second sentence to illustrate the first.", "\"Similarly\" needs two comparable facts."],
  },
  {
    passage: "Plants need sunlight to carry out photosynthesis. ______ many plants that grow on a shaded forest floor have broad, thin leaves that capture as much light as possible.",
    q: "Which choice completes the text with the most logical transition?",
    choices: ["For this reason,", "However,", "In contrast,", "Meanwhile,"],
    explanation: ["The broad leaves are a consequence of plants needing light in the shade, so a cause-and-effect transition fits.", "\"However\" signals a contradiction that isn't there.", "\"In contrast\" needs two things being contrasted.", "\"Meanwhile\" signals something happening at the same time, not a result."],
  },
  {
    passage: "The first successful powered airplane flight, by the Wright brothers in 1903, lasted only 12 seconds. ______ it showed that controlled, powered flight was possible.",
    q: "Which choice completes the text with the most logical transition?",
    choices: ["Nevertheless,", "As a result,", "In other words,", "Likewise,"],
    explanation: ["The flight was very short, yet it proved something important, so a concession like \"Nevertheless\" fits.", "\"As a result\" would say the 12-second length caused the proof, which misses the contrast.", "\"In other words\" would need a restatement.", "\"Likewise\" needs a similar second example."],
  },
  {
    passage: "Some animals hibernate through the winter to save energy. Black bears, ______ can go months without eating, drinking or leaving their dens.",
    q: "Which choice completes the text with the most logical transition?",
    choices: ["for instance,", "however,", "in conclusion,", "nonetheless,"],
    explanation: ["Black bears are an example of animals that save energy through the winter, so \"for instance\" fits.", "\"however\" signals a contrast.", "\"in conclusion\" signals a summary, not an example.", "\"nonetheless\" signals a concession."],
  },
  {
    passage: "Light travels about 300,000 kilometers per second. Sound, ______ travels through air at only about 343 meters per second.",
    q: "Which choice completes the text with the most logical transition?",
    choices: ["by contrast,", "consequently,", "for example,", "in addition,"],
    explanation: ["The text compares two very different speeds, so \"by contrast\" fits.", "\"consequently\" would say light's speed causes sound's speed.", "\"for example\" would make sound an example of light.", "\"in addition\" adds a similar point rather than a contrast."],
  },
  {
    passage: "To make the solution, the students first measured 50 milliliters of water. ______ they slowly stirred in the salt until no more would dissolve.",
    q: "Which choice completes the text with the most logical transition?",
    choices: ["Next,", "Instead,", "Similarly,", "In fact,"],
    explanation: ["The text describes steps in order, so a sequence word like \"Next\" fits.", "\"Instead\" would say they skipped the first step.", "\"Similarly\" compares two parallel things.", "\"In fact\" emphasizes or corrects a claim."],
  },
  {
    passage: "Glass looks solid and behaves like a solid at room temperature. ______ it has no crystal structure; its atoms are arranged irregularly, as in a liquid.",
    q: "Which choice completes the text with the most logical transition?",
    choices: ["Yet", "Thus", "Accordingly", "Likewise"],
    explanation: ["The second sentence describes something that runs against the first impression of glass, so \"Yet\" signals the contrast.", "\"Thus\" signals a conclusion drawn from the first sentence.", "\"Accordingly\" also signals a result.", "\"Likewise\" signals similarity."],
  },
  {
    passage: "Recycling one aluminum can saves energy compared with making a new can from raw ore. ______ aluminum can be recycled again and again without losing quality.",
    q: "Which choice completes the text with the most logical transition?",
    choices: ["Moreover,", "However,", "Instead,", "Even so,"],
    explanation: ["The second sentence adds another advantage of recycling aluminum, so \"Moreover\" fits.", "\"However\" signals a contrast.", "\"Instead\" signals an alternative.", "\"Even so\" signals a concession."],
  },
];

export const WORDS_IN_CONTEXT = [
  {
    passage: "Although the first results were promising, the scientists were careful not to ______ them; they repeated the experiment three more times before announcing anything.",
    q: "Which choice completes the text with the most logical and precise word or phrase?",
    choices: ["overstate", "ignore", "measure", "postpone"],
    explanation: ["The scientists wanted to avoid claiming too much before repeating the experiment, so \"overstate\" fits.", "They weren't at risk of ignoring promising results.", "Measuring results is what experiments do; being careful not to measure makes no sense.", "\"postpone them\" doesn't fit results that already exist."],
  },
  {
    passage: "The new bridge design was praised for being ______: it used less steel than older designs while carrying the same load.",
    q: "Which choice completes the text with the most logical and precise word or phrase?",
    choices: ["efficient", "ornate", "temporary", "controversial"],
    explanation: ["Using less material for the same job is the definition of efficient.", "\"ornate\" describes decoration, not material use.", "Nothing suggests the bridge is temporary.", "It was praised, which doesn't suggest controversy."],
  },
  {
    passage: "Rather than present a single explanation, the documentary ______ several competing theories and lets viewers weigh the evidence for each.",
    q: "Which choice completes the text with the most logical and precise word or phrase?",
    choices: ["lays out", "dismisses", "invents", "conceals"],
    explanation: ["The documentary shows several theories so viewers can compare them: \"lays out.\"", "It doesn't dismiss them; viewers weigh them.", "Nothing suggests the theories were invented.", "Concealing theories contradicts letting viewers weigh them."],
  },
  {
    passage: "The author's tone in the letter is ______; she thanks the committee warmly but makes clear that she disagrees with its decision.",
    q: "Which choice completes the text with the most logical and precise word or phrase?",
    choices: ["gracious but firm", "angry and dismissive", "uncertain and confused", "playful and mocking"],
    explanation: ["She is warm (gracious) yet clearly disagrees (firm).", "Warm thanks rule out angry and dismissive.", "Making her disagreement clear isn't uncertain.", "Nothing in the description suggests mockery."],
  },
  {
    passage: "Because the old map was ______, the hikers relied on it only for the main trails and used a compass for everything else.",
    q: "Which choice completes the text with the most logical and precise word or phrase?",
    choices: ["unreliable", "detailed", "colorful", "valuable"],
    explanation: ["The hikers trusted the map only partly, which follows from it being unreliable.", "A detailed map would be more useful, not less.", "Color has nothing to do with whether to rely on it.", "\"valuable\" doesn't explain why they used a compass instead."],
  },
  {
    passage: "The species is so ______ that biologists have recorded it only a handful of times in the past century.",
    q: "Which choice completes the text with the most logical and precise word or phrase?",
    choices: ["elusive", "abundant", "aggressive", "familiar"],
    explanation: ["Being seen only a handful of times means the species is hard to find: elusive.", "\"abundant\" means plentiful, the opposite.", "Aggression doesn't explain how rarely it's recorded.", "\"familiar\" contradicts the rare sightings."],
  },
  {
    passage: "The committee's report was ______: in just two pages, it summarized a year of research and listed every recommendation.",
    q: "Which choice completes the text with the most logical and precise word or phrase?",
    choices: ["concise", "lengthy", "vague", "repetitive"],
    explanation: ["Covering a lot in two pages is the meaning of concise.", "Two pages is the opposite of lengthy.", "Listing every recommendation isn't vague.", "Nothing suggests it repeated itself."],
  },
  {
    passage: "At first the inventor's idea was met with ______, but after a working prototype was demonstrated, investors lined up to fund it.",
    q: "Which choice completes the text with the most logical and precise word or phrase?",
    choices: ["skepticism", "enthusiasm", "confusion about its cost", "immediate approval"],
    explanation: ["\"At first … but after\" signals a change from doubt to support, so \"skepticism\" fits.", "Enthusiasm at first wouldn't need to change.", "Nothing mentions cost.", "Immediate approval contradicts the change the sentence describes."],
  },
];

export const RHETORICAL_SYNTHESIS = [
  {
    notes: ["The Amazon is the largest tropical rainforest on Earth.", "It spans parts of nine countries.", "Brazil contains the largest share of it.", "It is home to an enormous variety of plant and animal species."],
    q: "The student wants to emphasize how many countries the Amazon rainforest spans. Which choice most effectively uses relevant information from the notes to accomplish this goal?",
    choices: ["The Amazon, the largest tropical rainforest on Earth, spans parts of nine countries.", "Brazil contains the largest share of the Amazon rainforest.", "The Amazon is home to an enormous variety of plant and animal species.", "The Amazon is a tropical rainforest found in Brazil."],
    explanation: ["Only this choice states that the rainforest spans nine countries.", "This focuses on one country, Brazil.", "This is about biodiversity, not countries.", "This mentions only Brazil and suggests the forest is in one country."],
  },
  {
    notes: ["Mercury is the closest planet to the Sun.", "It completes an orbit in about 88 Earth days.", "Neptune is the farthest planet from the Sun.", "Neptune takes about 165 Earth years to orbit the Sun."],
    q: "The student wants to contrast the orbital periods of two planets. Which choice most effectively uses relevant information from the notes to accomplish this goal?",
    choices: ["Mercury orbits the Sun in about 88 Earth days, while Neptune takes about 165 Earth years.", "Mercury is the closest planet to the Sun, and Neptune is the farthest.", "Neptune, the farthest planet from the Sun, takes about 165 Earth years to orbit it.", "Mercury completes an orbit of the Sun in about 88 Earth days."],
    explanation: ["This states both orbital periods and contrasts them.", "This contrasts distance, not orbital period.", "This gives only one planet's period.", "This also gives only one period."],
  },
  {
    notes: ["The Rosetta Stone was found in 1799.", "It carries the same decree in three scripts: hieroglyphic, Demotic and ancient Greek.", "Scholars could read the Greek text.", "It helped Jean-François Champollion decipher Egyptian hieroglyphs in the 1820s."],
    q: "The student wants to explain why the Rosetta Stone was useful to scholars. Which choice most effectively uses relevant information from the notes to accomplish this goal?",
    choices: ["Because the Rosetta Stone carries the same decree in hieroglyphic, Demotic and Greek, scholars who could read the Greek used it to work out the hieroglyphs.", "The Rosetta Stone was found in 1799.", "Jean-François Champollion deciphered Egyptian hieroglyphs in the 1820s.", "The Rosetta Stone carries a decree."],
    explanation: ["This explains the reason: the same text in a readable script and in hieroglyphs.", "The date found doesn't explain its usefulness.", "This states what happened but not why the stone helped.", "This leaves out the three scripts, the key to its usefulness."],
  },
  {
    notes: ["A leap year has 366 days instead of 365.", "The extra day is February 29.", "Leap years keep the calendar in step with Earth's orbit, which takes about 365.24 days.", "Under the Gregorian rules, years divisible by 100 are not leap years unless they are also divisible by 400."],
    q: "The student wants to explain why the year 1900 was not a leap year. Which choice most effectively uses relevant information from the notes to accomplish this goal?",
    choices: ["Although 1900 is divisible by 4, it is divisible by 100 but not by 400, so under the Gregorian rules it was not a leap year.", "A leap year adds February 29, making the year 366 days long.", "Leap years keep the calendar in step with Earth's orbit of about 365.24 days.", "The year 2000 was a leap year because it is divisible by 400."],
    explanation: ["This applies the century rule directly to 1900.", "This describes leap years in general.", "This explains why leap years exist, not why 1900 wasn't one.", "This is about 2000, not 1900."],
  },
];

export const CENTRAL_IDEAS = [
  {
    passage: "For centuries, sailors relied on the stars to find their latitude, but longitude was much harder to determine at sea. Finding it required knowing the exact time at a reference location while at sea, and the pendulum clocks of the period did not keep accurate time on a rolling ship. In the eighteenth century, the English clockmaker John Harrison built a series of marine chronometers that kept time accurately enough to solve the problem.",
    q: "Which choice best states the main idea of the text?",
    choices: ["Harrison's marine chronometers solved the problem of finding longitude at sea by keeping accurate time on board.", "Sailors could not find their latitude until the eighteenth century.", "Pendulum clocks were the most accurate timekeepers available to sailors.", "John Harrison was the first person to use the stars for navigation."],
    explanation: ["The text sets up the longitude problem and explains how Harrison's clocks solved it.", "The text says latitude was found from the stars long before.", "The text says pendulum clocks failed at sea.", "The text says sailors had used the stars for centuries."],
  },
  {
    passage: "Coral reefs cover a tiny fraction of the ocean floor, yet they support roughly a quarter of all known marine species. Reef-building corals depend on algae that live inside their tissues and supply them with food. When water becomes too warm, corals expel these algae and turn white, a process called bleaching. If high temperatures last too long, the corals can die.",
    q: "Based on the text, why are high water temperatures a threat to corals?",
    choices: ["Warm water causes corals to expel the algae that supply their food.", "Warm water makes coral reefs cover more of the ocean floor.", "Warm water increases the number of species living on reefs.", "Warm water makes corals change color permanently without harming them."],
    explanation: ["The text says heat makes corals expel the algae that feed them, and prolonged heat can kill them.", "Nothing links temperature to reef area.", "The text doesn't say heat increases species.", "The text says prolonged bleaching can kill corals."],
  },
  {
    passage: "The printing press developed by Johannes Gutenberg around 1440 used movable metal type, which could be rearranged to print any page. Before it, books in Europe were mostly copied by hand, a slow and costly process. Printed books could be produced far faster and more cheaply, and within decades presses had spread to cities across Europe.",
    q: "Which choice best describes the function of the second sentence in the text?",
    choices: ["It describes how books were made before the printing press, to show what the press changed.", "It explains how movable metal type worked.", "It gives the date when the printing press was developed.", "It names the cities where presses spread."],
    explanation: ["The second sentence describes hand-copying, setting up the contrast with faster printing.", "Movable type is explained in the first sentence.", "The date is in the first sentence.", "The text doesn't name any cities."],
  },
  {
    passage: "Penicillin was discovered in 1928 when Alexander Fleming noticed that a mold growing on one of his bacterial cultures had killed the bacteria around it. Fleming published his observation, but it was more than a decade before other scientists developed a way to purify and produce the drug in large amounts. By the mid-1940s, penicillin was saving many lives by treating bacterial infections.",
    q: "According to the text, what happened after Fleming published his observation?",
    choices: ["Other scientists later found a way to purify and mass-produce penicillin.", "Fleming immediately began treating patients with penicillin.", "Scientists showed that the mold had no effect on bacteria.", "Penicillin was used mainly to treat viral infections."],
    explanation: ["The text says it took over a decade before others developed purification and production.", "The text doesn't say Fleming treated patients.", "The text says the mold killed bacteria.", "The text says penicillin treated bacterial infections."],
  },
];
