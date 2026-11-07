# Project Memory & Operating Guidelines: Practice Tests Daily

This document serves as the persistent memory and operational guide for agents working on `practice-test-daily`.

---

## 1. URL Architecture & Silo Structure

### A. Major Standardized Exams (Root-Level Slugs)
* High-volume, standardized tests must maintain dedicated root-level slugs for maximum SEO authority, CTR, and search intent capture.
* Examples:
  * `/sat/` (Hub for SAT skills & format: `/sat/math/`, `/sat/reading-writing/`)
  * `/toefl/` (Hub for TOEFL iBT reading & writing practice)
  * Future major exams: `/act/`, `/gre/`, `/ielts/` must be top-level root slugs (do NOT nest under `/english/`).

### B. General English & Language Skills (`/english/...`)
* General language skills, diagnostic tests, grammar, and vocabulary must strictly reside under the `/english/` prefix.
* The `/english/` root path must not be broken or altered.
* Existing structure:
  * `/english/` (Diagnostic & practice hub)
  * `/english/english-level-test/` (CEFR A1–C2 level test)
  * `/english/vocabulary-test/`
  * `/english/grammar-test/`
  * `/english/grammar-test/pronouns/`
  * `/english/grammar-test/verbs/`
* Any future general language test (e.g. prepositions, idioms, phrasal verbs) must follow `/english/[skill-or-test-slug]/`.

---

## 2. Publishing Schedule & Auto-Blog Pipeline

* **Publishing Frequency**: 7 days a week, 1 guide per day.
* **Cron Triggers**:
  * Auto-blog pipeline: Runs at 04:00 UTC daily (`.github/workflows/auto-blog.yml`).
  * Daily deploy: Runs at 13:05 UTC daily (`.github/workflows/deploy.yml`).
* **Firestore Sync**:
  * Articles are served from Firestore in production.
  * Whenever guides are rescheduled, added, or edited locally, run:
    ```bash
    node scripts/push-guides.mjs
    ```
* **Topic Selection Rules**:
  * NEVER add or generate Khan Academy topics (user explicitly forbade this).
  * Always cross-reference keywords with volume from Keyword Planner (e.g. `sat practice`: 50,000/mo, `sat practice test`: 500,000/mo, `sat math practice`: 5,000/mo).

---

## 3. Guide Generation & Quality Gates

When creating or modifying guides in `src/content/guides/` or through `scripts/pipeline/`:
1. **Title Matching**: Guide title must contain the core keyword tokens (validated by `fuzzyCount(title, keyword) > 0`).
2. **Word Count & Density**:
   - Minimum 1,000 to 1,500 words.
   - Specificity density: at least 16 test-specific terms / formulas per 1,000 words.
   - Use `<code>` tags for mathematical formulas, algebra equations, and grammar tokens.
3. **Practice Items**:
   - Must include full step-by-step walkthroughs of 3 distinct practice items.
4. **FAQs**:
   - Must answer user search intent directly.
   - Every FAQ answer must contain concrete facts, numbers (`\d` or spelled out), or formulas (prevents `findGenericFaqAnswers` failure).
   - No duplicate FAQ questions across the site (checked by `tests/english.test.js`).
5. **No Shared Copy**:
   - Sentences longer than 8 words must not be duplicated across pages or guides.

---

## 4. Legal & Trademark Compliance

* **College Board**: Whenever mentioning SAT or PSAT, include the disclaimer:
  > "SAT is a registered trademark of the College Board. This site is not affiliated with or endorsed by the College Board."
* **ETS**: Whenever mentioning TOEFL or GRE, include the disclaimer:
  > "TOEFL and TOEFL iBT are registered trademarks of ETS. This site is not affiliated with or endorsed by ETS."
* **Never Call Questions "Official"**: Our practice questions must never be described as "official" items. Use "practice questions", "text-based practice", etc.

---

## 5. Verification Checklist

Before pushing any changes:
```bash
node scripts/check-links.mjs
npm test
npm run test:pipeline
npm run build
```
All must pass with 0 errors.

