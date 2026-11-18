---
title: "SAT Quadratic Equations: Factoring, Shortcuts and the Discriminant"
description: "How to solve SAT quadratic equations fast: factoring, the sum and product of roots, the quadratic formula, the discriminant, and vertex form, with worked examples."
published: 2026-11-08
tool: math
updated: 2026-11-20
---

<div class="key-takeaway"><p><strong>Quick answer:</strong> Try factoring first: find two numbers that multiply to c and add to b. If the question asks for the sum of the solutions of x² + bx + c = 0, the answer is −b, and the product is c, with no solving needed. Use the quadratic formula when factoring fails, and the discriminant b² − 4ac when the question asks how many solutions there are.</p></div>

Quadratic equations are the most common question type in the SAT's Advanced Math domain. Some ask you to solve, some ask for the sum of the solutions, some ask how many solutions there are, and some ask what a graph's vertex or intercepts mean. A few shortcuts handle most of them in under a minute, and those shortcuts are the focus of this SAT math prep guide.

All answers below were checked by code.

## Method 1: Factoring

For x² + bx + c = 0, look for two numbers that **multiply to c** and **add to b**.

**Example 1.** What is the positive solution to x² − 6x − 16 = 0?

Two numbers that multiply to −16 and add to −6: −8 and 2. So (x − 8)(x + 2) = 0, and x = 8 or x = −2. The positive solution is **8**.

The trap answers are −8 and 2: the numbers inside the factors with their signs unflipped. Setting each factor equal to zero flips the sign: x − 8 = 0 gives x = 8.

<figure class="guide-figure"><img src="/images/guides/sat-quadratic-equations-figure.png" alt="Three small parabolas: one crossing the x-axis twice when the discriminant is positive, one touching it once when zero, and one never reaching it when negative." width="1000" height="560" loading="lazy" decoding="async"><figcaption>Positive, zero, or negative discriminant: two, one, or no real solutions.</figcaption></figure>

## Shortcut: sum and product of the solutions

For any quadratic x² + bx + c = 0:

- **Sum of the solutions = −b**
- **Product of the solutions = c**

For ax² + bx + c = 0 with a leading coefficient other than 1, the sum is −b/a and the product is c/a.

**Example 2.** What is the sum of the solutions to x² − 5x − 36 = 0?

The sum is −(−5) = **5**. You can confirm by factoring, (x − 9)(x + 4) = 0, which gives solutions 9 and −4, and 9 + (−4) = 5. The common trap is −5, which forgets the negative sign in "sum = −b."

**Example 3.** What is the sum of the solutions to x² − 10x + 16 = 0?

Sum = **10**. (The solutions are 2 and 8.) When a question asks only for the sum or product, use the shortcut and skip factoring entirely.

## Method 2: The quadratic formula

When nothing factors nicely, use

x = (−b ± √(b² − 4ac)) / 2a

**Example 4.** Solve x² − 4x − 1 = 0.

Here a = 1, b = −4, c = −1. The discriminant is b² − 4ac = 16 + 4 = 20, so x = (4 ± √20) / 2 = (4 ± 2√5) / 2 = **2 ± √5**.

The SAT often writes these answers in simplified radical form, so practice simplifying: √20 = √(4 × 5) = 2√5.

## How many solutions? The discriminant

The discriminant, b² − 4ac, tells you how many real solutions a quadratic has without solving it:

<div class="table-wrap"><table>
<thead><tr><th>Discriminant</th><th>Real solutions</th><th>Graph</th></tr></thead>
<tbody>
<tr><td>Positive</td><td>Two</td><td>Crosses the x-axis twice</td></tr>
<tr><td>Zero</td><td>Exactly one</td><td>Touches the x-axis once</td></tr>
<tr><td>Negative</td><td>None</td><td>Never meets the x-axis</td></tr>
</tbody>
</table></div>

**Example 5.** For what value of k does x² + 6x + k = 0 have exactly one real solution?

Set the discriminant to zero: 6² − 4(1)(k) = 0, so 36 − 4k = 0 and **k = 9**. Check: x² + 6x + 9 = (x + 3)², which has only one solution, x = −3.

## Vertex form and what the graph shows

A quadratic written as y = a(x − h)² + k has its vertex at (h, k). If a is positive the parabola opens up and the vertex is a minimum; if a is negative it opens down and the vertex is a maximum.

**Example 6.** The function f(x) = (x − 3)² − 4. What is the vertex, and where does the graph cross the x-axis?

The vertex is **(3, −4)**: watch the sign, since x − 3 means h = 3. To find the x-intercepts, set f(x) = 0: (x − 3)² = 4, so x − 3 = ±2, which gives **x = 1 and x = 5**. Notice that the vertex's x-coordinate, 3, is exactly halfway between the intercepts. That symmetry is a fast check.

In word problems, the vertex usually answers "maximum height," "minimum cost," or "when does it peak," and the x-intercepts answer "when does it hit the ground."

## Difference of squares

x² − 49 = 0 factors as (x − 7)(x + 7) = 0, so x = 7 or x = −7. Recognizing a² − b² = (a − b)(a + b) on sight saves a lot of time, and it appears in equivalent-expression questions too.

## Which method should you use?

1. **Asked for the sum or product?** Use −b/a or c/a. Done.
2. **Small whole-number coefficients?** Try factoring for about 15 seconds.
3. **Asked how many solutions?** Use the discriminant.
4. **Nothing factors?** Use the quadratic formula, or graph it in Desmos and read the x-intercepts.

## Practice next

The [quadratic equations practice set](/sat/math/quadratic-equations/) generates new quadratics every set, with the factoring and the sum-of-roots shortcut shown in each explanation. Quadratics connect to [nonlinear functions](/sat/math/nonlinear-functions/) and to the [exponent rules](/sat/math/exponents-and-equivalent-expressions/) used in equivalent-expression questions. For the linear skills underneath all of this, see the [SAT linear equations and functions guide](/guides/sat-linear-equations-and-functions/).

## Sources

The skills and question types in this guide come from College Board's own description of the test, last checked on November 17, 2026:

- [College Board: SAT content domains (Reading and Writing, Math)](https://satsuite.collegeboard.org/practice/content-domains)
- [College Board: the SAT Math section](https://satsuite.collegeboard.org/sat/whats-on-the-test/math)

The explanations, examples and practice questions are our own. This site is independent and not affiliated with College Board. SAT® is a trademark registered by the College Board.

## Frequently asked questions

### What is the fastest way to solve a quadratic on the SAT?

If it factors with small numbers, factor it. If the question asks for the sum or product of the solutions, use −b/a or c/a without solving. Otherwise use the quadratic formula or graph it.

### How do I find the sum of the solutions of a quadratic?

For ax² + bx + c = 0, the sum of the solutions is −b/a. For x² − 5x − 36 = 0, that's 5.

### What does the discriminant tell you?

The value of b² − 4ac tells you how many real solutions a quadratic has: two if it's positive, one if it's zero, and none if it's negative.

### Do I need to memorize the quadratic formula for the SAT?

It's worth memorizing. It isn't needed often, but when a quadratic doesn't factor it's the most reliable method, and knowing it well also makes discriminant questions easy.

### Where are quadratics on the SAT?

Quadratic equations and functions belong to the Advanced Math domain, one of the four Math domains, along with exponential functions and equivalent expressions.

For related coverage, see our guide on [SAT Circle Questions: Arc Length, Sector Area and Circle Equations](/guides/sat-circle-questions/).

For related coverage, see our guide on [SAT Math Prep: Exponent Rules and Practice](/guides/sat-math-prep-exponent-rules-and-practice/).

For related coverage, see our guide on [Mastering SAT Math Questions on Ratios and Rates](/guides/mastering-sat-math-questions-on-ratios-and-rates/).

For related coverage, see our guide on [SAT Test Questions: Right Triangle Trigonometry](/guides/sat-test-questions-right-triangle-trigonometry/).
