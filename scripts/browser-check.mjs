// Smoke test against a running preview (npm run build && npm run preview):
// screenshots in both themes and two widths, overflow and console-error checks,
// and real interactions with a practice set.
//   CHROME_PATH=/path/to/chrome OUT=/tmp/shots node scripts/browser-check.mjs
import { chromium } from "playwright-core";
import { mkdirSync } from "node:fs";

const B = process.env.BASE ?? "http://localhost:4321";
const OUT = process.env.OUT ?? "./.shots";
mkdirSync(OUT, { recursive: true });
const b = await chromium.launch({ executablePath: process.env.CHROME_PATH });
const errors = [];

for (const [w, h, tag] of [[1280, 900, "desk"], [390, 844, "phone"]]) {
  for (const scheme of ["light", "dark"]) {
    const p = await b.newPage({ viewport: { width: w, height: h }, colorScheme: scheme });
    p.on("console", (m) => (m.type() === "error" || m.type() === "warning") && errors.push(`${tag}/${scheme}: ${m.text().slice(0, 200)}`));
    p.on("pageerror", (e) => errors.push(e.message));
    for (const path of ["/", "/sat/", "/sat/math/", "/sat/math/probability/", "/sat/reading-writing/", "/sat/reading-writing/boundaries/", "/how-we-write-questions/", ...(process.env.GUIDE ? [process.env.GUIDE] : [])]) {
      await p.goto(B + path, { waitUntil: "networkidle" });
      await p.waitForTimeout(400);
      const overflow = await p.evaluate(() => document.documentElement.scrollWidth > window.innerWidth + 1);
      if (overflow) errors.push(`overflow ${tag} ${scheme} ${path}`);
      const name = (path === "/" ? "home" : path.replace(/\//g, "_")) + `-${tag}-${scheme}.png`;
      await p.screenshot({ path: `${OUT}/${name}`, fullPage: tag === "desk" && (path === "/" || path === "/sat/math/probability/") });
    }
    await p.close();
  }
}

const p = await b.newPage({ viewport: { width: 1280, height: 900 } });
p.on("pageerror", (e) => errors.push(e.message));

// Answering a question shows feedback; a new math set changes the questions.
await p.goto(B + "/sat/math/percentages/", { waitUntil: "networkidle" });
const first = p.locator("#practice ol > li").first();
await first.scrollIntoViewIfNeeded();
await first.getByRole("radio").first().click();
const fb = await first.locator("p.font-semibold").first().textContent();
if (!/Correct|Not quite/.test(fb ?? "")) errors.push(`quiz feedback: ${fb}`);
const before = await first.locator("p").first().textContent();
await p.getByRole("button", { name: /New set/ }).click();
const after = await p.locator("#practice ol > li").first().locator("p").first().textContent();
if (before === after) errors.push("new set did not change the first question");
console.log({ fb, newSet: before !== after });
console.log(errors.length ? errors : "no errors");
await b.close();
