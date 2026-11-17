---
title: "SAT Systems of Equations: Elimination, Substitution and Special Cases"
description: "How to solve SAT systems of equations questions fast: elimination, substitution, word problems, and no-solution or infinite-solution cases, with worked examples."
published: 2026-11-04
tool: math
---

<div class="key-takeaway"><p><strong>Quick answer:</strong> Use elimination when a variable's coefficients already match or are easy to match, and substitution when one equation is already solved for a variable. For "no solution" questions, the lines must have the same slope and different intercepts; for "infinitely many solutions," the two equations must be multiples of each other.</p></div>

Systems of linear equations are one of the most dependable question types on SAT Math. They show up as plain equation pairs, as word problems about tickets or mixtures, and as "for what value of k" questions about how many solutions a system has. All of them are in the Algebra domain, and all of them reward the same few moves.

These SAT practice questions on systems of equations walk through each type. Every answer was checked by code.

## Method 1: Elimination

Elimination works when adding or subtracting the equations cancels one variable.

**Example 1.**

3x + 4y = 35<br>
3x + 2y = 31

If (x, y) is the solution to the system, what is the value of x?

The x coefficients already match, so subtract the second equation from the first: (3x + 4y) − (3x + 2y) = 35 − 31, which gives 2y = 4 and y = 2. Substitute into the second equation: 3x + 2(2) = 31, so 3x = 27 and **x = 9**.

The trap choice on this question is 2, the value of y. You found y first, and it's tempting to stop there. Always reread what the question asks for.

**Example 2.**

3x − y = 15<br>
2x − 5y = 23

What is the value of x + y?

No coefficients match yet. Multiply the first equation by 5 so the y terms will cancel: 15x − 5y = 75. Now subtract the second equation: (15x − 5y) − (2x − 5y) = 75 − 23, so 13x = 52 and x = 4. Substitute into the first equation: 3(4) − y = 15, so y = −3. The question asks for x + y = 4 + (−3) = **1**.

Choose the variable that needs the smallest multiplier. Here, multiplying one equation by 5 was enough, which beats multiplying both equations to cancel x.

<figure class="guide-figure"><img src="/images/guides/sat-systems-of-equations-figure.png" alt="Three panels of two lines: different slopes cross once (one solution), same slope different intercepts are parallel (no solution), and identical lines overlap (infinitely many solutions)." width="1000" height="560" loading="lazy" decoding="async"><figcaption>The three possible outcomes for a system of two linear equations.</figcaption></figure>

## Method 2: Substitution

Substitution is fastest when one equation already gives a variable by itself, like y = 2x − 3 or x = 4y.

**Example 3.**

y = 2x − 3<br>
5x + 2y = 21

Replace y in the second equation with 2x − 3: 5x + 2(2x − 3) = 21. Distribute: 5x + 4x − 6 = 21, so 9x = 27 and x = 3. Then y = 2(3) − 3 = 3. The solution is **(3, 3)**.

The usual slip is forgetting to distribute the 2 to the −3, which gives 5x + 4x − 3 = 21 and a wrong x.

## Method 3: Let the calculator do it

On the Digital SAT, the built-in Desmos graphing calculator is available for every Math question. Type both equations in and click the point where the lines cross; that point is the solution. It's a fast way to solve messy systems and a good way to check an algebraic answer. Still learn elimination and substitution: some questions ask for an expression like x + y or 2x − y, and many are quicker by hand than by graphing.

## Systems in word problems

The hard part of a word problem is writing the system. Define your variables first, then write one equation for each fact.

**Example 4.** A theater sold 50 tickets. Adult tickets cost $12 and child tickets cost $8. Total sales were $480. How many adult tickets were sold?

Let a = adult tickets and c = child tickets.

- Count equation: a + c = 50
- Money equation: 12a + 8c = 480

From the first equation, c = 50 − a. Substitute: 12a + 8(50 − a) = 480, so 12a + 400 − 8a = 480, which gives 4a = 80 and **a = 20**. That leaves c = 30 child tickets. Check: 20 × $12 + 30 × $8 = $240 + $240 = $480. ✓

Almost every SAT word problem with two unknowns has this shape: one equation that counts things and one that adds up their values.

## How many solutions does a system have?

Two lines can cross once, never cross, or be the same line. The SAT asks about all three.

<div class="table-wrap"><table>
<thead><tr><th>Number of solutions</th><th>What the lines do</th><th>What the equations look like</th></tr></thead>
<tbody>
<tr><td>Exactly one</td><td>Cross at one point</td><td>Different slopes</td></tr>
<tr><td>None</td><td>Parallel</td><td>Same slope, different intercepts</td></tr>
<tr><td>Infinitely many</td><td>Same line</td><td>One equation is a multiple of the other</td></tr>
</tbody>
</table></div>

**Example 5 (no solution).** For what value of k does this system have no solution?

2x + 3y = 7<br>
4x + ky = 10

For no solution, the left sides must be proportional while the right sides are not. The x coefficient doubled (2 to 4), so the y coefficient must double too: **k = 6**. Then the second equation is 4x + 6y = 10, which is the same as 2x + 3y = 5. That can't be true at the same time as 2x + 3y = 7, so there's no solution.

**Example 6 (infinitely many).** For what value of c does this system have infinitely many solutions?

3x − 2y = 5<br>
6x − 4y = c

The second left side is exactly 2 times the first, so the whole second equation must be 2 times the first: **c = 10**. Then both equations describe the same line.

## Common mistakes on systems questions

- **Answering for the wrong variable.** Underline what's asked: x, y, x + y, or something else.
- **Sign errors when subtracting equations.** Subtracting a negative term adds it. Write the subtraction out in full for each term.
- **Not distributing in substitution.** 2(2x − 3) is 4x − 6, not 4x − 3.
- **Mixing up the special cases.** Parallel lines mean no solution; identical lines mean infinitely many.

## Practice next

The [systems of linear equations practice set](/sat/math/systems-of-linear-equations/) generates new systems every set, with the elimination steps shown in each explanation. Systems also connect to [linear functions](/sat/math/linear-functions/), since each equation is a line. For a mixed warm-up, try the [12 SAT math practice questions](/guides/sat-math-practice-questions/), and for percent-based word problems, the [SAT percentage problems guide](/guides/sat-percentage-problems/).

## Sources

The skills and question types in this guide come from College Board's own description of the test, last checked on November 17, 2026:

- [College Board: SAT content domains (Reading and Writing, Math)](https://satsuite.collegeboard.org/practice/content-domains)
- [College Board: the SAT Math section](https://satsuite.collegeboard.org/sat/whats-on-the-test/math)

The explanations, examples and practice questions are our own. This site is independent and not affiliated with College Board. SAT® is a trademark registered by the College Board.

## Frequently asked questions

### Should I use elimination or substitution on the SAT?

Use elimination when coefficients already match or can be matched with one small multiplier. Use substitution when one equation already gives a variable by itself. Both give the same answer, so pick whichever is fewer steps.

### How do I know if a system has no solution?

Rewrite both equations so you can compare them. If the x and y coefficients are proportional but the constants aren't, the lines are parallel and there's no solution.

### Can I use Desmos for systems of equations on the SAT?

Yes. Graph both equations and click the intersection point. It's especially useful for checking an answer or for systems with awkward numbers.

### What does it mean when a system has infinitely many solutions?

Both equations describe the same line, so every point on the line is a solution. One equation is an exact multiple of the other, constants included.

### Why do I keep getting systems questions wrong when my algebra is right?

The most common reason is answering for the wrong quantity, such as giving y when the question asks for x or for x + y. Reread the question before choosing.
