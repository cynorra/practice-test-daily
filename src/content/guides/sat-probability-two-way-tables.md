---
title: "SAT Probability Questions: Two-Way Tables and Conditional Probability"
description: "How to answer SAT math questions on probability from two-way tables: picking the right denominator, conditional probability, 'or' questions and estimates."
published: 2026-11-09
tool: math
---

<div class="key-takeaway"><p><strong>Quick answer:</strong> Every SAT probability question from a two-way table is a fraction: the number of outcomes you want over the size of the group you're choosing from. The words after "chosen at random" name that group. "A 10th grader" means the 10th-grade row total; "a student who prefers art" means the Art column total; "a student in the survey" means the grand total.</p></div>

Probability questions on the SAT almost always come with a two-way table: rows for one category, columns for another, and totals along the edges. The arithmetic is simple division. What these SAT math questions really test is whether you choose the right denominator. Once you can read the question for its group, they become some of the fastest points in the Problem-Solving and Data Analysis domain.

The examples below use tables and answers that were checked by code.

## How to read any probability question

Ask two questions, in this order:

1. **Who is being chosen?** That's your denominator. Find the phrase right after "chosen at random" or "selected at random," or after "given that."
2. **What are we hoping they are?** That's your numerator, and it must come from *inside* that group.

Write the fraction, then simplify if the choices are simplified.

<figure class="guide-figure"><img src="/images/guides/sat-probability-two-way-tables-figure.png" alt="Three copies of a two-way table highlighting a row total, a column total, and the grand total as the denominator for different probability questions." width="1000" height="560" loading="lazy" decoding="async"><figcaption>The denominator is the group the question restricts you to.</figcaption></figure>

## Example 1: probability within a row

A survey asked students in two grades whether they prefer art or music.

<div class="table-wrap"><table>
<thead><tr><th></th><th>Art</th><th>Music</th><th>Total</th></tr></thead>
<tbody>
<tr><td>9th grade</td><td>34</td><td>14</td><td>48</td></tr>
<tr><td>10th grade</td><td>26</td><td>33</td><td>59</td></tr>
<tr><td>Total</td><td>60</td><td>47</td><td>107</td></tr>
</tbody>
</table></div>

**If a 10th grader in the survey is chosen at random, what is the probability that the student prefers music?**

Who is chosen? A 10th grader, so the group is the 59 students in the 10th-grade row. Of those, 33 prefer music. The probability is **33/59**.

The trap choices on this question use the wrong group: 33/107 (all students) and 33/47 (all music students). Each uses the right numerator over the wrong denominator.

## Example 2: probability within a column

<div class="table-wrap"><table>
<thead><tr><th></th><th>Art</th><th>Music</th><th>Total</th></tr></thead>
<tbody>
<tr><td>9th grade</td><td>39</td><td>26</td><td>65</td></tr>
<tr><td>10th grade</td><td>21</td><td>35</td><td>56</td></tr>
<tr><td>Total</td><td>60</td><td>61</td><td>121</td></tr>
</tbody>
</table></div>

**If a student who prefers art is chosen at random, what is the probability that the student is in 9th grade?**

The group is the Art column: 60 students. Of those, 39 are 9th graders. The probability is 39/60 = **13/20**.

This is conditional probability: the probability of one thing *given* another. The SAT may phrase it as "given that the student prefers art" or simply describe the group, as here. Both mean you're working inside the Art column only.

## Example 3: probability from the whole table

<div class="table-wrap"><table>
<thead><tr><th></th><th>Art</th><th>Music</th><th>Total</th></tr></thead>
<tbody>
<tr><td>9th grade</td><td>20</td><td>27</td><td>47</td></tr>
<tr><td>10th grade</td><td>25</td><td>12</td><td>37</td></tr>
<tr><td>Total</td><td>45</td><td>39</td><td>84</td></tr>
</tbody>
</table></div>

**If a student in the survey is chosen at random, what is the probability that the student is a 9th grader who prefers music?**

Now the group is everyone: 84 students. The students who are both 9th graders *and* prefer music are in one cell: 27. The probability is 27/84 = **9/28**.

The trap is 27/47, which quietly restricts the group to 9th graders even though the question didn't.

## Example 4: an "or" question

Using the same table: **what is the probability that a randomly chosen student is a 9th grader or prefers music?**

Count everyone who is in the 9th-grade row *or* the Music column, without counting anyone twice. The 9th-grade row has 47 students, the Music column has 39, and 27 students are in both, so they were counted twice: 47 + 39 − 27 = 59. The probability is **59/84**.

You can also add the three cells directly: 20 + 27 + 12 = 59. Adding cells is often the safer way, because it's harder to double-count.

## Example 5: using a sample to estimate

Surveys on the SAT often lead to an estimate about a larger group.

**Based on Example 1's survey, about how many of a school's 590 10th graders would be expected to prefer music?**

In the sample, 33 of 59 10th graders prefer music. Apply that proportion: 590 × 33/59 = 10 × 33 = **330**.

The SAT also asks whether such an estimate is reasonable. It's only reasonable if the survey sample was chosen at random from the group the estimate is about. A sample from one club or one class can't be applied to the whole school.

## Common mistakes on probability questions

- **Using the grand total for every question.** Only use it when the question chooses from everyone.
- **Using a row total when the question describes a column** (or the other way around). Find the group phrase first, every time.
- **Double-counting in "or" questions.** Subtract the overlap, or add individual cells.
- **Not simplifying.** If your fraction isn't among the choices, simplify it: 39/60 is 13/20.

## Practice next

The [probability practice set](/sat/math/probability/) generates new two-way tables every set, with a different "chosen at random" group in each question, which is exactly the skill to drill. Probability sits next to [percentages](/guides/sat-percentage-problems/) and [mean and median](/sat/math/one-variable-data/) in the Problem-Solving and Data Analysis domain. For a mixed set across all four Math domains, try the [12 SAT math practice questions](/guides/sat-math-practice-questions/).

## Frequently asked questions

### How do you find probability from a two-way table on the SAT?

Divide the number of outcomes you want by the total of the group being chosen from. The phrase after "chosen at random" or "given that" tells you which row, column, or grand total to use.

### What is conditional probability on the SAT?

It's the probability of one outcome within a specific group, such as the probability that a student is in 9th grade given that the student prefers art. You work only inside that group's row or column.

### Why do I keep picking the wrong probability answer?

Most misses come from the right numerator over the wrong denominator. Before computing, write down which group is being chosen from and find its total.

### Do I need probability formulas for the SAT?

Rarely. Almost every SAT probability question can be answered by counting from a table and writing a fraction. For "or" questions, add the cells or subtract the overlap.

### Which Math domain includes probability?

Probability and conditional probability belong to Problem-Solving and Data Analysis, one of the four SAT Math domains.
