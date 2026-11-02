// English level test: 30 hand-written items, 5 per CEFR level, mixing grammar,
// vocabulary and short reading. The key is always choices[0]; order is shuffled
// when the page is built. explanation[0] says why the key is right, the rest
// explain each wrong choice in order.

export const LEVELS = ["A1", "A2", "B1", "B2", "C1", "C2"];

export const LEVEL_ITEMS = [
  // ------------------------------------------------------------------ A1
  { level: "A1", q: "My sister ______ a teacher.", choices: ["is", "are", "am", "be"],
    explanation: ["\"Is\" is the form of \"be\" that goes with a singular third person such as \"my sister\".", "\"Are\" goes with you, we and they.", "\"Am\" is used only with \"I\".", "\"Be\" is the base form and cannot be the main verb of this simple present sentence."] },
  { level: "A1", q: "______ you like coffee?", choices: ["Do", "Does", "Are", "Is"],
    explanation: ["\"Do\" is the helping verb for questions in the simple present with \"you\".", "\"Does\" is used with he, she and it.", "\"Are\" is a form of \"be\"; with the verb \"like\" the question needs \"do\".", "\"Is\" is also a form of \"be\" and does not combine with \"you\" or with the verb \"like\" here."] },
  { level: "A1", q: "Which word is the opposite of \"big\"?", choices: ["small", "tall", "new", "fast"],
    explanation: ["\"Small\" describes size, just as \"big\" does, but at the other end.", "\"Tall\" describes height, and a tall thing can still be small in other ways.", "\"New\" is the opposite of \"old\".", "\"Fast\" is the opposite of \"slow\"."] },
  { level: "A1", q: "There are three ______ on the table.", choices: ["books", "book", "a book", "bookes"],
    explanation: ["After a number above one, the noun takes the plural ending: \"books\".", "\"Book\" is singular and cannot follow \"three\".", "\"A book\" means one book, which conflicts with \"three\".", "\"Bookes\" is a spelling mistake; the plural of \"book\" is \"books\"."] },
  { level: "A1", passage: "Tom gets up at 7:00 and eats breakfast at 7:30. He leaves for school at 8:00.", q: "What does Tom do at 7:30?", choices: ["He eats breakfast.", "He gets up.", "He leaves for school.", "He goes to bed."],
    explanation: ["The text says he eats breakfast at 7:30.", "He gets up at 7:00, half an hour earlier.", "He leaves for school at 8:00.", "Going to bed is not mentioned in the text."] },

  // ------------------------------------------------------------------ A2
  { level: "A2", q: "I ______ to the cinema yesterday.", choices: ["went", "go", "goed", "going"],
    explanation: ["\"Yesterday\" points to the past, and the past tense of \"go\" is the irregular form \"went\".", "\"Go\" is the present form and does not fit \"yesterday\".", "\"Goed\" treats \"go\" as a regular verb, but it is irregular.", "\"Going\" cannot be the only verb in a past-tense sentence."] },
  { level: "A2", q: "My brother is ______ than I am.", choices: ["taller", "more tall", "tallest", "tall"],
    explanation: ["Short adjectives form the comparative with -er, and \"than\" signals a comparison.", "\"More tall\" is not used; one-syllable adjectives take -er.", "\"Tallest\" is the superlative and does not combine with \"than\".", "\"Tall\" alone has no comparison, so it does not fit with \"than\"."] },
  { level: "A2", q: "We didn't have ______ milk, so I went to the shop.", choices: ["any", "some", "a", "many"],
    explanation: ["\"Any\" is the usual choice in negative sentences, and \"milk\" is uncountable.", "\"Some\" normally appears in positive statements.", "\"A\" cannot go before an uncountable noun like \"milk\".", "\"Many\" is used with countable nouns, and milk is not countable."] },
  { level: "A2", q: "\"What are you doing this weekend?\" Which answer fits best?", choices: ["I'm going to visit my grandparents.", "I visited my grandparents.", "I visit my grandparents yesterday.", "I have visit my grandparents."],
    explanation: ["The question asks about a plan, and \"going to\" expresses a plan for the future.", "The past tense answers a question about what happened, not about plans.", "\"Yesterday\" cannot combine with the present tense, and it does not answer a question about this weekend.", "\"Have visit\" is not a correct verb form; it needs \"visited\" or \"have visited\"."] },
  { level: "A2", passage: "Dear Anna, thanks for your invitation. I can't come on Saturday because I have to work, but I'd love to meet next week. Are you free on Tuesday? Best, Mia", q: "Why is Mia writing to Anna?", choices: ["To decline Saturday and suggest another day", "To invite Anna to a party on Saturday", "To ask Anna for a job", "To say that she is free on Saturday"],
    explanation: ["Mia says she can't come on Saturday and asks about Tuesday instead.", "Anna sent the invitation, not Mia.", "Mia mentions her own work, not a job offer for Anna.", "Mia says she has to work on Saturday, so she is not free."] },

  // ------------------------------------------------------------------ B1
  { level: "B1", q: "If I ______ more time, I would learn Spanish.", choices: ["had", "have", "will have", "would have"],
    explanation: ["An unreal present condition uses the past tense in the if-clause: \"if I had\".", "\"Have\" belongs to the real condition: \"if I have time, I will learn\".", "\"Will\" does not go in an if-clause.", "\"Would\" belongs in the result clause, not in the if-clause."] },
  { level: "B1", q: "She has lived in this city ______ 2019.", choices: ["since", "for", "from", "during"],
    explanation: ["\"Since\" is followed by a starting point in time such as a year.", "\"For\" is followed by a length of time, such as \"for five years\".", "\"From\" needs an end point (\"from 2019 to 2023\") and does not combine with the present perfect.", "\"During\" is followed by an event or period, not by a single year as a starting point."] },
  { level: "B1", q: "I'm not used to ______ up so early.", choices: ["getting", "get", "got", "be getting"],
    explanation: ["After \"be used to\" the verb takes the -ing form: \"used to getting\".", "The base form \"get\" belongs after \"used to\" without \"be\" (\"I used to get up\").", "\"Got\" cannot follow \"to\" in this structure.", "\"Be getting\" is not a possible form after \"used to\" here."] },
  { level: "B1", q: "The report ______ by the manager before Friday.", choices: ["must be finished", "must finish", "must be finish", "must to be finished"],
    explanation: ["A passive after a modal verb is \"modal + be + past participle\".", "\"Must finish\" is active, so the report would be doing the finishing.", "\"Be finish\" is missing the participle ending.", "\"Must to\" is wrong because modals are not followed by \"to\"."] },
  { level: "B1", q: "\"The meeting was postponed.\" This means that the meeting was ______.", choices: ["moved to a later time", "cancelled for good", "made shorter", "held earlier than planned"],
    explanation: ["To postpone means to arrange for something to happen later than planned.", "Cancelling means it will not happen at all.", "Postponing says nothing about the length.", "Earlier is the opposite of postponed."] },

  // ------------------------------------------------------------------ B2
  { level: "B2", q: "By the time we arrived, the film ______.", choices: ["had already started", "already started", "has already started", "was already starting"],
    explanation: ["The past perfect shows that the film began before another past moment, our arrival.", "The simple past does not make clear that one event came before the other.", "The present perfect connects to now, but the sentence is about the past.", "\"Was starting\" describes an action in progress, but the film had finished starting before we arrived."] },
  { level: "B2", q: "I wish I ______ the job offer last year.", choices: ["had accepted", "accepted", "would accept", "have accepted"],
    explanation: ["A wish about the past uses the past perfect.", "The simple past would express a wish about the present.", "\"Would accept\" expresses a wish for future behavior.", "\"Wish\" is not followed by the present perfect."] },
  { level: "B2", q: "Hardly ______ the house when it began to rain.", choices: ["had she left", "she had left", "did she leave", "she left"],
    explanation: ["After \"hardly\" at the start of a sentence, the helping verb comes before the subject, and the earlier action takes the past perfect.", "This keeps normal word order, which does not work after \"hardly\" at the beginning.", "\"Did she leave\" would put the earlier action in the simple past, which does not match the usual \"hardly ... when\" pattern.", "Normal word order again, and the simple past does not show which action came first."] },
  { level: "B2", q: "He gave a ______ explanation that left no room for doubt.", choices: ["convincing", "convinced", "convince", "convincingly"],
    explanation: ["The adjective \"convincing\" describes a thing that persuades.", "\"Convinced\" describes a person who has been persuaded, not an explanation.", "\"Convince\" is a verb and cannot describe a noun.", "\"Convincingly\" is an adverb and cannot modify a noun."] },
  { level: "B2", passage: "Many companies now let employees work from home two or three days a week. Supporters say this saves commuting time and improves focus. Critics argue that it weakens teamwork because colleagues see each other less often.", q: "Which statement best sums up the critics' view?", choices: ["Working from home may harm collaboration.", "Commuting makes people more productive.", "Companies should close their offices.", "Employees concentrate better at home."],
    explanation: ["The critics say teamwork weakens because colleagues meet less.", "Commuting is mentioned only as time that supporters say is saved.", "Nobody in the text suggests closing offices.", "That is the supporters' point about focus, not the critics'."] },

  // ------------------------------------------------------------------ C1
  { level: "C1", q: "Not only ______ the deadline, but she also exceeded every target.", choices: ["did she meet", "she met", "she did meet", "met she"],
    explanation: ["When \"not only\" opens the sentence, the helping verb comes before the subject: \"did she meet\".", "Normal word order is not used after a fronted \"not only\".", "\"She did meet\" keeps the subject first, so there is no inversion.", "Inversion needs a helping verb in the simple past; \"met she\" is not standard."] },
  { level: "C1", q: "Her argument was so ______ that even her critics conceded the point.", choices: ["compelling", "compulsive", "compelled", "compulsory"],
    explanation: ["\"Compelling\" means convincing and hard to resist, which fits an argument.", "\"Compulsive\" describes behavior a person cannot stop.", "\"Compelled\" means forced and describes people, not arguments.", "\"Compulsory\" means required by rule."] },
  { level: "C1", q: "Had the board been informed earlier, the crisis ______ avoided.", choices: ["might have been", "might be been", "might had been", "might have"],
    explanation: ["An unreal past condition takes \"might have + past participle\", and here the passive needs \"been\".", "\"Might be been\" mixes present and past forms.", "After a modal, \"had\" is not used.", "\"Might have\" alone leaves out the participle needed for the passive."] },
  { level: "C1", q: "Scarcely had the announcement been made ______ shares began to fall.", choices: ["when", "than", "that", "then"],
    explanation: ["\"Scarcely ... when\" is the matching pair, like \"hardly ... when\".", "\"Than\" pairs with \"no sooner\", not \"scarcely\".", "\"That\" does not complete the pair.", "\"Then\" is an adverb and does not join the two clauses."] },
  { level: "C1", passage: "The museum's new policy offers free admission on weekdays but charges more at weekends, in order to broaden its audience. Yet the attendance figures show that most weekday visitors are retirees who used to pay for tickets, while weekend numbers have dropped slightly.", q: "What can be inferred from the passage?", choices: ["The policy has not clearly reached the new audience it aimed at.", "The policy has doubled attendance.", "Retirees dislike the museum.", "Weekend visitors prefer the new prices."],
    explanation: ["The people now coming for free are existing visitors, and weekends have lost visitors, so the aim of reaching a broader audience is not clearly met.", "The text gives no sign that attendance has doubled.", "The retirees are visiting, so nothing suggests they dislike the museum.", "Weekend attendance dropped slightly, which does not suggest a preference for the higher prices."] },

  // ------------------------------------------------------------------ C2
  { level: "C2", q: "The minister's reply was a masterpiece of ______: it said a great deal without committing to anything.", choices: ["equivocation", "equation", "equilibrium", "equity"],
    explanation: ["Equivocation means using vague language to avoid a clear position, which matches the description.", "An equation is a mathematical statement.", "Equilibrium is a state of balance.", "Equity means fairness."] },
  { level: "C2", q: "It is imperative that every applicant ______ the form by Friday.", choices: ["submit", "submits", "submitted", "will submit"],
    explanation: ["After expressions of necessity such as \"imperative that\", formal English uses the base form (the subjunctive).", "\"Submits\" is the ordinary present form and does not follow \"imperative that\" in formal usage.", "\"Submitted\" is a past form and does not fit a requirement about the future.", "\"Will submit\" is not used in the subjunctive clause."] },
  { level: "C2", q: "Her ______ remarks seemed polite, but they concealed a sharp criticism.", choices: ["veiled", "revealed", "unveiled", "veined"],
    explanation: ["\"Veiled\" remarks are indirect or disguised, which fits the idea of concealing a criticism.", "\"Revealed\" is the opposite of concealed.", "\"Unveiled\" also means shown openly, the reverse of the meaning needed.", "\"Veined\" describes a pattern of lines and has nothing to do with speech."] },
  { level: "C2", q: "I would rather he ______ nothing about the matter for now.", choices: ["said", "says", "would say", "had said"],
    explanation: ["After \"would rather\" with a different subject, a preference about the present or future takes the past form: \"he said\".", "\"Says\" is the plain present form, which is not used after \"would rather\" with a new subject.", "\"Would say\" repeats the modal and is not used in this pattern.", "\"Had said\" would express a regret about something that already happened."] },
  { level: "C2", passage: "Economists often assume that people act in their own interest. Yet experiments repeatedly show participants sharing resources in ways that cost them money. Some researchers conclude that the assumption is false; others, more cautiously, that it is incomplete.", q: "Which statement best describes the more cautious researchers' position?", choices: ["The assumption explains some behavior but leaves part of it out.", "The assumption is entirely correct.", "People never act in their own interest.", "The assumption cannot be tested in experiments."],
    explanation: ["\"Incomplete\" means true as far as it goes but missing something, which is the cautious position.", "The experiments are the reason the researchers question the assumption.", "That is the stronger claim made by researchers who call the assumption false.", "The passage says experiments were run and found results."] },
];
