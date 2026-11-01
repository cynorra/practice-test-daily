// The short lesson above each practice set: what the skill covers on the SAT,
// the rules that solve most questions, and the traps the wrong answers are
// built on. Written by hand; examples on the pages come from the generators.

export const LESSONS = {
  // ---------------------------------------------------------------- Math: Algebra
  "linear-equations-one-variable": {
    title: "SAT Linear Equations Practice: Solve for x",
    description: "Free SAT practice on linear equations in one variable: 10 questions with step-by-step explanations, the rules that solve them and the traps to avoid.",
    lead: "Linear equations in one variable are among the most common Algebra questions on the SAT. The method is always the same: get every x term on one side, every number on the other, and divide.",
    rules: [
      "Do the same operation to both sides. Subtract the smaller x term from both sides first so the coefficient stays positive.",
      "Distribute before you collect terms: 3(x − 2) is 3x − 6, not 3x − 2.",
      "When the equation has fractions, multiply every term by the common denominator to clear them.",
      "Check by substituting your answer into both sides. On a timed test, this takes ten seconds and catches sign errors.",
    ],
    traps: [
      "Adding a term to one side instead of subtracting it from both (a sign error).",
      "Dividing by the wrong coefficient after collecting terms.",
      "Answering −x when the question asks for x.",
    ],
  },
  "linear-functions": {
    title: "SAT Linear Functions Practice: Slope, Intercept and f(x)",
    description: "Practice SAT linear function questions: find the slope from two points, write f(x) = mx + b and evaluate it. 10 questions with full explanations.",
    lead: "A linear function changes by the same amount every time x increases by 1. That amount is the slope. If you know two points, you know the whole function.",
    rules: [
      "Slope m = (y₂ − y₁) / (x₂ − x₁). Subtract in the same order on top and bottom.",
      "Find the intercept b by substituting one point into y = mx + b.",
      "f(a) means \"replace x with a.\"",
      "In a word problem, the slope is the rate (per hour, per item) and the intercept is the starting value.",
    ],
    traps: [
      "Subtracting the points in opposite orders, which flips the slope's sign.",
      "Forgetting the intercept and computing only m · x.",
      "Mixing up which value is the input and which is the output.",
    ],
  },
  "systems-of-linear-equations": {
    title: "SAT Systems of Linear Equations Practice",
    description: "Practice SAT systems of two linear equations with elimination and substitution. 10 questions, each with a worked explanation.",
    lead: "A system of two linear equations has one solution (x, y) that makes both equations true at once. The SAT rewards picking the fastest method and reading exactly what the question asks for.",
    rules: [
      "Elimination: multiply one or both equations so a variable has opposite coefficients, then add (or matching coefficients, then subtract).",
      "Substitution: when one equation already says y = … or x = …, plug it into the other.",
      "Read the question: it may ask for x + y or 2x − y, which you can sometimes get by adding or subtracting the equations directly.",
      "If two equations have the same slope and different intercepts, there is no solution; if they're the same line, there are infinitely many.",
    ],
    traps: [
      "Solving for x and stopping when the question asks for x + y.",
      "Multiplying only one side of an equation.",
      "Sign errors when subtracting equations.",
    ],
  },
  "linear-inequalities": {
    title: "SAT Linear Inequalities Practice",
    description: "SAT practice on linear inequalities: solve, flip the sign correctly and test values. 10 questions with explanations.",
    lead: "Inequalities are solved like equations, with one extra rule: multiplying or dividing by a negative number flips the inequality sign.",
    rules: [
      "Isolate x exactly as you would in an equation.",
      "Flip the sign (< becomes >) whenever you multiply or divide both sides by a negative number.",
      "To check a choice, substitute it into the original inequality.",
      "A strict inequality (< or >) excludes the boundary value; ≤ and ≥ include it.",
    ],
    traps: [
      "Forgetting to flip the sign after dividing by a negative.",
      "Choosing the boundary value itself for a strict inequality.",
    ],
  },
  // ------------------------------------------------------------- Math: Advanced Math
  "quadratic-equations": {
    title: "SAT Quadratic Equations Practice: Factoring and Solutions",
    description: "Practice SAT quadratic equations: factor, find the solutions and use the sum-of-roots shortcut. 10 questions with step-by-step explanations.",
    lead: "Most SAT quadratics can be solved by factoring. When they can't, the quadratic formula always works, and two shortcuts answer many questions without solving at all.",
    rules: [
      "Factor x² + bx + c by finding two numbers that multiply to c and add to b.",
      "If (x − p)(x − q) = 0, the solutions are x = p and x = q.",
      "For ax² + bx + c = 0, the solutions add to −b/a and multiply to c/a.",
      "Quadratic formula: x = (−b ± √(b² − 4ac)) / 2a. The discriminant b² − 4ac tells you how many real solutions there are (positive: two; zero: one; negative: none).",
    ],
    traps: [
      "Taking the signs from the factors instead of the solutions: (x + 7) = 0 means x = −7.",
      "Answering b instead of −b for the sum of solutions.",
    ],
  },
  "exponents-and-equivalent-expressions": {
    title: "SAT Exponents and Equivalent Expressions Practice",
    description: "Practice SAT exponent rules and equivalent expressions: products, quotients and powers of powers. 10 questions with explanations.",
    lead: "Equivalent-expression questions test a handful of exponent rules. Know them cold and these become some of the fastest points on the test.",
    rules: [
      "Multiply same-base powers: add exponents. xᵃ · xᵇ = xᵃ⁺ᵇ.",
      "Divide same-base powers: subtract exponents. xᵃ / xᵇ = xᵃ⁻ᵇ.",
      "Power of a power: multiply exponents. (xᵃ)ᵇ = xᵃᵇ.",
      "Power of a product: apply the exponent to every factor, including the number. (2x³)² = 4x⁶.",
      "Quick check: plug in x = 2 to both the original and a choice; equivalent expressions give the same value.",
    ],
    traps: [
      "Multiplying exponents when you should add them, or the reverse.",
      "Raising the variable to the power but not the coefficient.",
    ],
  },
  "nonlinear-functions": {
    title: "SAT Nonlinear Functions Practice: Exponential and Quadratic",
    description: "Practice evaluating exponential and quadratic functions the way the SAT asks. 10 questions with step-by-step explanations.",
    lead: "Nonlinear function questions usually ask you to evaluate a function, compare growth, or read a function's meaning in context. Order of operations decides most of them.",
    rules: [
      "Substitute first, then follow the order of operations: parentheses, exponents, multiplication, addition.",
      "In f(x) = a·bˣ, a is the starting value and b is the growth factor (b > 1 grows, 0 < b < 1 decays).",
      "Growth by r percent per period means multiplying by (1 + r/100) each period.",
      "In vertex form (x − h)² + k, the vertex is at (h, k).",
    ],
    traps: [
      "Multiplying a·b before applying the exponent.",
      "Getting the sign of h wrong in (x + 4)², where h = −4.",
    ],
  },
  // ------------------------------------------ Math: Problem-Solving and Data Analysis
  percentages: {
    title: "SAT Percentages Practice: Percent Change and Percent Of",
    description: "Practice SAT percent questions: percent of a number, percent increase and decrease, and back-to-back changes. 10 questions with explanations.",
    lead: "Percent questions are everywhere on the SAT, in word problems, tables and graphs. Three formulas handle nearly all of them.",
    rules: [
      "p% of n = (p/100) × n.",
      "Percent change = (new − old) / old × 100. Always divide by the original value.",
      "An increase of p% means multiplying by (1 + p/100); a decrease means multiplying by (1 − p/100).",
      "Successive changes multiply: a 10% increase then a 10% decrease is 1.10 × 0.90 = 0.99, a 1% decrease overall.",
    ],
    traps: [
      "Dividing the change by the new value instead of the original.",
      "Adding or subtracting successive percent changes.",
    ],
  },
  "ratios-rates-and-units": {
    title: "SAT Ratios, Rates and Unit Conversions Practice",
    description: "Practice SAT ratio, rate and unit conversion questions, including square-unit traps. 10 questions with step-by-step explanations.",
    lead: "Ratio and rate questions test whether you keep track of units. Write the units next to every number and most of these solve themselves.",
    rules: [
      "A ratio a : b splits a total into a + b equal parts.",
      "Distance = rate × time. Convert minutes to hours (divide by 60) before multiplying by a per-hour rate.",
      "Convert with fractions that equal 1, like 12 inches / 1 foot, so the units cancel.",
      "Square units scale by the square of the conversion: 1 square yard = 9 square feet.",
    ],
    traps: [
      "Treating 2 hours 30 minutes as 2.30 hours instead of 2.5.",
      "Converting square units with the linear factor.",
    ],
  },
  "one-variable-data": {
    title: "SAT Mean and Median Practice: One-Variable Data",
    description: "Practice SAT mean, median and missing-value questions. 10 questions with step-by-step explanations and the traps behind wrong answers.",
    lead: "One-variable data questions ask about the center and spread of a data set. The mean and median answer most of them, along with knowing how each one reacts to outliers.",
    rules: [
      "Mean = sum ÷ number of values. So sum = mean × number of values, which solves missing-value questions.",
      "Median: sort the values first. For an even count, average the two middle values.",
      "An outlier pulls the mean toward it much more than the median.",
      "Range = maximum − minimum; it measures spread, not center.",
    ],
    traps: [
      "Taking the middle value of an unsorted list as the median.",
      "Forgetting to include the missing value when multiplying the mean by the count.",
    ],
  },
  probability: {
    title: "SAT Probability Practice: Two-Way Tables and Conditional Probability",
    description: "Practice SAT probability and conditional probability from two-way tables. 10 questions, each with a full explanation.",
    lead: "SAT probability questions are almost always about counting the right group. The word \"given\" (or a phrase like \"if a 10th grader is chosen\") tells you which group is the denominator.",
    rules: [
      "Probability = (number of favorable outcomes) / (number of outcomes in the group you're choosing from).",
      "Conditional probability: restrict the denominator to the given group, the row or column total.",
      "\"And\" means one cell of the table; \"or\" means add the cells without double-counting.",
    ],
    traps: [
      "Using the grand total when the question restricts the group.",
      "Using the row total when the question restricts to a column.",
    ],
  },
  // ------------------------------------------------- Math: Geometry and Trigonometry
  "right-triangles-and-trigonometry": {
    title: "SAT Right Triangles and Trigonometry Practice",
    description: "Practice SAT right triangle questions: the Pythagorean theorem, common triples and sine, cosine and tangent. 10 questions with explanations.",
    lead: "Right triangle questions test the Pythagorean theorem and the three basic trigonometric ratios. Recognizing common side lengths saves time.",
    rules: [
      "Pythagorean theorem: a² + b² = c², where c is the hypotenuse, opposite the right angle.",
      "Common triples and their multiples: 3-4-5, 5-12-13, 8-15-17, 7-24-25.",
      "SOH-CAH-TOA: sine = opposite/hypotenuse, cosine = adjacent/hypotenuse, tangent = opposite/adjacent.",
      "In a right triangle, sin(A) = cos(B) for the two acute angles A and B.",
    ],
    traps: [
      "Adding the legs instead of squaring them.",
      "Using the side opposite the wrong angle.",
    ],
  },
  circles: {
    title: "SAT Circles Practice: Area, Arc Length and Circle Equations",
    description: "Practice SAT circle questions: area and circumference, arc length from a central angle, and the center and radius from an equation.",
    lead: "Circle questions use a small set of formulas. The equation of a circle in the xy-plane is the one students miss most, usually because of a sign.",
    rules: [
      "Circumference = 2πr; area = πr².",
      "Arc length = (central angle / 360°) × 2πr; sector area = (central angle / 360°) × πr².",
      "Equation: (x − h)² + (y − k)² = r² has center (h, k) and radius r.",
      "If the equation isn't in that form, complete the square for x and for y.",
    ],
    traps: [
      "Reading the center as (−h, −k) from (x − h)² + (y − k)².",
      "Answering r² as the radius.",
    ],
  },
  "area-and-volume": {
    title: "SAT Area and Volume Practice",
    description: "Practice SAT area and volume questions, including cylinders and how area changes when you scale a shape. 10 questions with explanations.",
    lead: "The SAT gives you a reference sheet with the main area and volume formulas, so these questions are less about memorizing and more about using the right one and scaling correctly.",
    rules: [
      "Rectangular prism: V = lwh. Cylinder: V = πr²h. Cone and pyramid: one third of the matching prism or cylinder.",
      "If lengths scale by k, areas scale by k² and volumes by k³.",
      "Use the radius, not the diameter, in circle formulas.",
    ],
    traps: [
      "Multiplying the area by k instead of k² after scaling.",
      "Using the diameter as the radius.",
    ],
  },

  // -------------------------------------------------------------- Reading and Writing
  boundaries: {
    title: "SAT Punctuation Practice: Commas, Semicolons and Colons",
    description: "Practice SAT Boundaries questions: when to use a comma, semicolon, colon, dash or period. 10 questions with an explanation for every choice.",
    lead: "Boundaries questions ask how to punctuate the point where two parts of a sentence meet. Decide whether each side is a complete sentence, and the right punctuation follows.",
    rules: [
      "Two complete sentences (independent clauses) can be joined by a period, a semicolon, or a comma plus and, but, or, so, for, nor or yet.",
      "A comma alone between two complete sentences is a comma splice, always wrong on the SAT.",
      "A colon follows a complete sentence and introduces a list, an explanation or an example.",
      "Interrupting phrases are set off on both sides with matching punctuation: two commas or two dashes.",
      "Never put punctuation between a subject and its verb, or between a verb and its object.",
    ],
    traps: [
      "A semicolon before a phrase that isn't a complete sentence.",
      "Closing an interrupting phrase with a different mark than the one that opened it.",
    ],
  },
  "form-structure-and-sense": {
    title: "SAT Grammar Practice: Subject-Verb Agreement, Pronouns and Tense",
    description: "Practice SAT Form, Structure and Sense questions: subject-verb agreement, pronouns, verb tense and modifiers. 10 questions with explanations.",
    lead: "Form, Structure and Sense questions test grammar inside a sentence: whether verbs agree with their subjects, pronouns match their nouns, tenses line up and modifiers sit next to what they describe.",
    rules: [
      "Find the true subject. Cross out phrases like \"of the students\" or \"along with its neighbors\"; they don't change the subject.",
      "Each, every, neither and either are singular.",
      "With neither … nor or either … or, the verb agrees with the closer subject.",
      "A pronoun must clearly refer to one noun and match it in number.",
      "An opening descriptive phrase must be followed by the thing it describes (otherwise it's a dangling modifier).",
      "Items in a list or comparison take the same grammatical form (parallel structure).",
    ],
    traps: [
      "Making the verb agree with the nearest noun instead of the subject.",
      "Choosing a tense that clashes with time words like \"last year\" or \"by the time.\"",
    ],
  },
  transitions: {
    title: "SAT Transitions Practice",
    description: "Practice SAT Transitions questions: choose the word that shows the right relationship between two sentences. 8 questions with explanations.",
    lead: "Transition questions ask for the word or phrase that shows how two sentences relate. Name the relationship first, then pick the transition that signals it.",
    rules: [
      "Contrast: however, yet, nevertheless, by contrast, even so.",
      "Cause and effect: therefore, as a result, consequently, for this reason.",
      "Addition: moreover, in addition, furthermore, likewise (for similarity).",
      "Example: for example, for instance. Sequence: first, next, finally. Restatement: in other words.",
      "Cover the choices, read the two sentences, and say the relationship in your own words before looking.",
    ],
    traps: [
      "Picking a transition that sounds formal but signals the wrong relationship.",
      "Choosing two transitions of the same type, which can't both be right.",
    ],
  },
  "rhetorical-synthesis": {
    title: "SAT Rhetorical Synthesis Practice: Student Notes Questions",
    description: "Practice SAT Rhetorical Synthesis questions, where you use a student's notes to meet a goal. Questions with an explanation for every choice.",
    lead: "Rhetorical Synthesis questions give you a student's notes and a goal, such as emphasizing a similarity or explaining a cause. The right answer is the one that meets the goal; accurate but off-goal choices are the trap.",
    rules: [
      "Read the goal first and underline its key words (contrast, emphasize, explain, introduce).",
      "Every choice is usually true according to the notes. Accuracy doesn't decide the answer; the goal does.",
      "For a contrast, the answer must mention both things being contrasted.",
      "For an explanation, look for a cause signal: because, so, as a result.",
    ],
    traps: [
      "Choosing the choice with the most details instead of the one that meets the goal.",
      "Choosing a choice that covers only one side of a comparison.",
    ],
  },
  "words-in-context": {
    title: "SAT Words in Context Practice: Vocabulary Questions",
    description: "Practice SAT Words in Context questions: choose the most logical and precise word for the sentence. 8 questions with explanations.",
    lead: "Words in Context questions don't test rare vocabulary as much as reading closely. The sentence always contains a clue to the missing word's meaning.",
    rules: [
      "Cover the choices and predict a word from the clue in the sentence.",
      "Look for signal words: although and but mean the word contrasts with something; because and so mean it agrees.",
      "A colon or semicolon often introduces an explanation of the missing word.",
      "Eliminate words that are positive when the clue is negative, and the reverse.",
    ],
    traps: [
      "Picking a word that fits the topic but not the clue.",
      "Ignoring a contrast word like although.",
    ],
  },
  "central-ideas-and-details": {
    title: "SAT Central Ideas and Details Practice",
    description: "Practice SAT Information and Ideas questions: main idea, details and the function of a sentence in short passages. Questions with explanations.",
    lead: "These questions ask what a short passage is mainly about, what it says about a detail, or what job a sentence does. The answer is always supported by the text itself, never by outside knowledge.",
    rules: [
      "Main idea: what the whole passage builds toward, usually stated or implied in the last sentences.",
      "Detail questions: find the exact sentence that answers the question before looking at the choices.",
      "Function questions: ask why the author included the sentence (to give background, contrast, an example).",
      "Eliminate choices that are too broad, too narrow, or contradict the passage.",
    ],
    traps: [
      "A choice that is true in general but not stated in the passage.",
      "A choice that repeats words from the passage but changes their meaning.",
    ],
  },
};
