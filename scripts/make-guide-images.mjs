// Renders two original illustrations per guide into public/images/guides/:
//   <slug>.png          1200x630 hero (also used as og:image)
//   <slug>-figure.png   1000x560 figure placed inside the article
// and writes src/lib/guide-images.js (alt text + captions) so pages and
// markdown use the same source of truth.
//   CHROME_PATH="C:/Program Files/Google/Chrome/Application/chrome.exe" node scripts/make-guide-images.mjs [slug...]
import { chromium } from "playwright-core";
import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { SITE } from "../src/site.config.js";

const font = (p) => `data:font/woff2;base64,${readFileSync(new URL(`../node_modules/${p}`, import.meta.url)).toString("base64")}`;
const fraunces = font("@fontsource-variable/fraunces/files/fraunces-latin-full-normal.woff2");
const geist = font("@fontsource-variable/geist/files/geist-latin-wght-normal.woff2");
const mono = font("@fontsource-variable/geist-mono/files/geist-mono-latin-wght-normal.woff2");

const C = { paper: "#fbf8f1", ink: "#1f2a44", mute: "#5a6480", blue: "#3b6fd6", blueSoft: "#dfe8fa", green: "#2e9a5a", greenSoft: "#dcf0e3", red: "#d9534f", redSoft: "#f8dedd", amber: "#d99a1e", amberSoft: "#faefd2", line: "#c9cfdd" };

const css = `
@font-face{font-family:F;src:url(${fraunces});font-weight:100 900}@font-face{font-family:G;src:url(${geist});font-weight:100 900}@font-face{font-family:M;src:url(${mono});font-weight:100 900}
*{margin:0;box-sizing:border-box}
body{background:${C.paper};color:${C.ink};font-family:G;position:relative;overflow:hidden}
.ruled{position:absolute;inset:0;background:repeating-linear-gradient(0deg,#3b6fd614 0 2px,transparent 2px 40px)}
.wrap{position:absolute;inset:0;padding:42px 56px 36px;display:flex;flex-direction:column}
.kicker{font-size:19px;font-weight:700;letter-spacing:.09em;text-transform:uppercase;color:${C.blue}}
h1{font-family:F;font-weight:800;font-size:46px;line-height:1.08;margin-top:6px}
.body{flex:1;margin-top:22px;position:relative;min-height:0}
.foot{position:absolute;right:56px;bottom:22px;font-size:17px;color:${C.mute};font-weight:600}
.card{background:#fff;border:2px solid ${C.ink};border-radius:14px;padding:16px 20px}
.m{font-family:M}
svg text{font-family:G}
`;

const esc = (s) => String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;");

function page({ w, h, kicker, title, body }) {
  return `<style>${css}body{width:${w}px;height:${h}px}</style><div class="ruled"></div><div class="wrap"><div class="kicker">${kicker}</div><h1>${title}</h1><div class="body">${body}</div></div><div class="foot">${SITE.name}</div>`;
}

/* ---------- SVG helpers ---------- */
function plot({ w, h, xr, yr, pad = [46, 18, 36, 18], xs = 1, ys = 1, xl = "x", yl = "y", ticks = true }) {
  const [l, t, b, r] = pad;
  const X = (x) => l + ((x - xr[0]) / (xr[1] - xr[0])) * (w - l - r);
  const Y = (y) => h - b - ((y - yr[0]) / (yr[1] - yr[0])) * (h - t - b);
  let g = "";
  for (let x = Math.ceil(xr[0] / xs) * xs; x <= xr[1]; x += xs) g += `<line x1="${X(x)}" y1="${Y(yr[0])}" x2="${X(x)}" y2="${Y(yr[1])}" stroke="${C.line}" stroke-width="1"/>`;
  for (let y = Math.ceil(yr[0] / ys) * ys; y <= yr[1]; y += ys) g += `<line x1="${X(xr[0])}" y1="${Y(y)}" x2="${X(xr[1])}" y2="${Y(y)}" stroke="${C.line}" stroke-width="1"/>`;
  const ax0 = xr[0] <= 0 && xr[1] >= 0 ? X(0) : X(xr[0]);
  const ay0 = yr[0] <= 0 && yr[1] >= 0 ? Y(0) : Y(yr[0]);
  g += `<line x1="${X(xr[0])}" y1="${ay0}" x2="${X(xr[1])}" y2="${ay0}" stroke="${C.ink}" stroke-width="2.4"/><line x1="${ax0}" y1="${Y(yr[0])}" x2="${ax0}" y2="${Y(yr[1])}" stroke="${C.ink}" stroke-width="2.4"/>`;
  if (ticks) {
    for (let x = Math.ceil(xr[0] / xs) * xs; x <= xr[1]; x += xs) if (x !== 0 || ax0 !== X(0)) g += `<text x="${X(x)}" y="${ay0 + 20}" font-size="15" fill="${C.mute}" text-anchor="middle">${x}</text>`;
    for (let y = Math.ceil(yr[0] / ys) * ys; y <= yr[1]; y += ys) if (y !== 0) g += `<text x="${ax0 - 8}" y="${Y(y) + 5}" font-size="15" fill="${C.mute}" text-anchor="end">${y}</text>`;
  }
  g += `<text x="${X(xr[1]) - 4}" y="${ay0 - 8}" font-size="17" font-style="italic" fill="${C.ink}" text-anchor="end">${xl}</text><text x="${ax0 + 8}" y="${Y(yr[1]) + 14}" font-size="17" font-style="italic" fill="${C.ink}">${yl}</text>`;
  const path = (fn, from = xr[0], to = xr[1], n = 160) => {
    let d = "";
    for (let i = 0; i <= n; i++) {
      const x = from + ((to - from) * i) / n;
      d += `${i ? "L" : "M"}${X(x).toFixed(1)} ${Y(fn(x)).toFixed(1)} `;
    }
    return d;
  };
  const dot = (x, y, fill = C.blue, r = 7) => `<circle cx="${X(x)}" cy="${Y(y)}" r="${r}" fill="${fill}" stroke="#fff" stroke-width="2.5"/>`;
  const label = (x, y, s, o = {}) => `<text x="${X(x) + (o.dx ?? 0)}" y="${Y(y) + (o.dy ?? 0)}" font-size="${o.size ?? 18}" font-weight="${o.weight ?? 600}" fill="${o.fill ?? C.ink}" text-anchor="${o.anchor ?? "start"}">${s}</text>`;
  return { w, h, X, Y, grid: g, path, dot, label, svg: (inner) => `<svg width="${w}" height="${h}" viewBox="0 0 ${w} ${h}">${g}${inner}</svg>` };
}
const curve = (d, color = C.blue, w = 4.5) => `<path d="${d}" fill="none" stroke="${color}" stroke-width="${w}" stroke-linecap="round" stroke-linejoin="round"/>`;
const chip = (text, bg, fg = C.ink, extra = "") => `<span style="display:inline-block;background:${bg};color:${fg};border-radius:999px;padding:6px 16px;font-weight:700;font-size:19px;${extra}">${text}</span>`;

const G = {}; // slug -> { alt, figAlt, caption, hero, fig, kicker, title, figKicker, figTitle }

/* =========================================================
   1. sat-practice-test
   ========================================================= */
G["sat-practice-test"] = {
  kicker: "Test-day timing", title: "One sitting, four timed modules",
  alt: "Timeline of the Digital SAT showing two 32-minute Reading and Writing modules, a break, and two 35-minute Math modules drawn to scale.",
  hero: () => {
    const sc = 1085 / 142, blk = (m, bg, a, b, c) => `<div style="width:${m * sc - 8}px;background:${bg};border:2px solid ${C.ink};border-radius:12px;padding:14px 12px;height:215px"><div style="font-weight:800;font-size:21px;line-height:1.15">${a}</div><div style="margin-top:8px;font-size:18px;color:${C.mute}">${b}</div><div class="m" style="margin-top:14px;font-weight:700;font-size:24px">${c}</div></div>`;
    return `<div style="display:flex;gap:8px;margin-top:20px">${blk(32, C.blueSoft, "Reading &amp; Writing", "Module 1", "32 min")}${blk(32, C.blueSoft, "Reading &amp; Writing", "Module 2", "32 min")}<div style="width:${8 * sc - 8}px;border:2px dashed ${C.mute};border-radius:12px;display:grid;place-items:center;height:215px;color:${C.mute};font-weight:700;font-size:17px;writing-mode:vertical-rl">BREAK</div>${blk(35, C.greenSoft, "Math", "Module 1", "35 min")}${blk(35, C.greenSoft, "Math", "Module 2", "35 min")}</div>
<div style="display:flex;gap:14px;margin-top:34px;flex-wrap:wrap">${chip("98 questions", C.amberSoft)}${chip("about 2 h 14 min of testing", C.amberSoft)}${chip("score 400–1600", C.amberSoft)}</div>
<p style="margin-top:26px;font-size:23px;color:${C.mute};max-width:900px">Block out about two and a half hours, use the device you will test on, and keep your phone in another room.</p>`;
  },
  figKicker: "Pacing checkpoints", figTitle: "Where you should be at the halfway mark",
  figAlt: "Two rows of question dots: about 14 of 27 Reading and Writing questions done with 16 minutes left, and about 11 of 22 Math questions done with 17 to 18 minutes left.",
  caption: "Rough pacing checkpoints for one module. Treat them as a guide, not a rule.",
  fig: () => {
    const row = (n, done, label, sub, color) => `<div style="margin-top:26px"><div style="font-weight:800;font-size:25px">${label} <span style="font-weight:500;color:${C.mute};font-size:20px">${sub}</span></div><div style="display:flex;gap:6px;margin-top:12px;flex-wrap:wrap">${Array.from({ length: n }, (_, i) => `<div style="width:30px;height:30px;border-radius:50%;border:2.5px solid ${C.ink};background:${i < done ? color : "#fff"};display:grid;place-items:center;font-size:13px;font-weight:700;color:${i < done ? "#fff" : C.mute}">${i + 1}</div>`).join("")}</div></div>`;
    return row(27, 14, "Reading and Writing module", "27 questions · 32 minutes · about 14 done when 16 min remain", C.blue) + row(22, 11, "Math module", "22 questions · 35 minutes · about 11 done when 17–18 min remain", C.green) + `<p style="margin-top:28px;font-size:21px;color:${C.mute}">Filled circles = questions you should have answered at the checkpoint.</p>`;
  },
};

/* =========================================================
   2. digital-sat-format
   ========================================================= */
G["digital-sat-format"] = {
  kicker: "Adaptive testing", title: "How each section adapts to you",
  alt: "Diagram of the adaptive Digital SAT: a first module of mixed difficulty leads to either an easier or a harder second module in each section.",
  hero: () => {
    const sec = (name, q, t, top, color) => `<div style="position:absolute;left:0;top:${top}px;width:100%;display:flex;align-items:center;gap:0">
      <div style="width:300px;background:${color};border:2px solid ${C.ink};border-radius:14px;padding:16px 18px"><div style="font-weight:800;font-size:23px">${name}: Module 1</div><div style="font-size:19px;color:${C.mute};margin-top:4px">${q} questions · ${t} min</div><div style="font-size:19px;margin-top:8px;font-weight:600">Easy, medium and hard mixed</div></div>
      <svg width="170" height="150" viewBox="0 0 170 150"><path d="M0 75 C70 75 70 25 160 25" fill="none" stroke="${C.ink}" stroke-width="3"/><path d="M0 75 C70 75 70 125 160 125" fill="none" stroke="${C.ink}" stroke-width="3"/><path d="M152 17 l12 8 -12 8z M152 117 l12 8 -12 8z" fill="${C.ink}"/><text x="8" y="58" font-size="15" fill="${C.mute}" font-weight="700">did well</text><text x="8" y="110" font-size="15" fill="${C.mute}" font-weight="700">needs work</text></svg>
      <div style="display:grid;gap:14px;width:320px"><div style="background:#fff;border:2px solid ${C.ink};border-radius:12px;padding:10px 16px"><b style="font-size:21px">Module 2 · harder</b><div style="font-size:17px;color:${C.mute}">${q} questions · ${t} min</div></div><div style="background:#fff;border:2px dashed ${C.ink};border-radius:12px;padding:10px 16px"><b style="font-size:21px">Module 2 · easier</b><div style="font-size:17px;color:${C.mute}">${q} questions · ${t} min</div></div></div></div>`;
    return sec("Reading &amp; Writing", 27, 32, 0, C.blueSoft) + sec("Math", 22, 35, 215, C.greenSoft);
  },
  figKicker: "What each section tests", figTitle: "Four domains in each section",
  figAlt: "Two columns listing the four Reading and Writing domains and the four Math domains of the Digital SAT.",
  caption: "The four domains of each section, as College Board describes them.",
  fig: () => {
    const col = (head, color, items) => `<div style="flex:1"><div style="background:${color};border:2px solid ${C.ink};border-radius:12px 12px 0 0;padding:12px 18px;font-weight:800;font-size:25px">${head}</div>${items.map(([a, b]) => `<div style="border:2px solid ${C.ink};border-top:0;background:#fff;padding:12px 18px"><div style="font-weight:700;font-size:21px">${a}</div><div style="font-size:17px;color:${C.mute}">${b}</div></div>`).join("")}</div>`;
    return `<div style="display:flex;gap:28px;margin-top:6px">${col("Reading and Writing", C.blueSoft, [["Information and Ideas", "central ideas, evidence, inferences"], ["Craft and Structure", "words in context, structure, purpose"], ["Expression of Ideas", "transitions, rhetorical synthesis"], ["Standard English Conventions", "boundaries, form, structure, sense"]])}${col("Math", C.greenSoft, [["Algebra", "linear equations, functions, systems"], ["Advanced Math", "quadratics, exponentials, equivalent forms"], ["Problem-Solving and Data Analysis", "ratios, percents, statistics, probability"], ["Geometry and Trigonometry", "area, volume, triangles, circles"]])}</div>`;
  },
};

/* =========================================================
   3. sat-math-practice-questions
   ========================================================= */
G["sat-math-practice-questions"] = {
  kicker: "SAT Math", title: "Four domains, one problem-solving routine",
  alt: "Four boxes naming the SAT Math domains: Algebra, Advanced Math, Problem-Solving and Data Analysis, and Geometry and Trigonometry, each with a sample expression.",
  hero: () => {
    const b = (t, ex, bg) => `<div style="background:${bg};border:2px solid ${C.ink};border-radius:16px;padding:20px 24px;height:190px"><div style="font-weight:800;font-size:27px;line-height:1.15">${t}</div><div class="m" style="margin-top:18px;font-size:26px;font-weight:600">${ex}</div></div>`;
    return `<div style="display:grid;grid-template-columns:1fr 1fr;gap:20px;margin-top:6px">${b("Algebra", "3x + 7 = 2x − 5", C.blueSoft)}${b("Advanced Math", "x² − 6x − 16 = 0", C.greenSoft)}${b("Problem-Solving and Data Analysis", "120 × 1.15 = ?", C.amberSoft)}${b("Geometry and Trigonometry", "A = πr²", C.redSoft)}</div>`;
  },
  figKicker: "A routine that works on every domain", figTitle: "Read, translate, solve, check",
  figAlt: "Four-step loop for SAT Math questions: read what is asked, translate to an equation, solve, then check the answer against the question.",
  caption: "The same four steps apply to every SAT Math domain.",
  fig: () => {
    const s = (n, t, d, bg) => `<div style="flex:1;background:${bg};border:2px solid ${C.ink};border-radius:14px;padding:18px 16px;min-height:250px"><div style="width:42px;height:42px;border-radius:50%;background:${C.ink};color:#fff;display:grid;place-items:center;font-weight:800;font-size:22px">${n}</div><div style="font-weight:800;font-size:25px;margin-top:14px">${t}</div><div style="font-size:19px;color:${C.mute};margin-top:8px;line-height:1.3">${d}</div></div>`;
    return `<div style="display:flex;gap:16px;align-items:stretch;margin-top:8px">${s(1, "Read", "Underline what the question asks for, not just the numbers.", C.blueSoft)}${s(2, "Translate", "Turn the words into an equation or a picture.", C.greenSoft)}${s(3, "Solve", "Do the algebra by hand or use the built-in calculator.", C.amberSoft)}${s(4, "Check", "Does your answer match what was asked, with the right units?", C.redSoft)}</div><p style="margin-top:26px;font-size:21px;color:${C.mute}">Most questions are multiple choice. The rest are student-produced responses: you type the answer in.</p>`;
  },
};

/* =========================================================
   4. sat-grammar-rules
   ========================================================= */
G["sat-grammar-rules"] = {
  kicker: "Sentence boundaries", title: "Three ways to join two complete sentences",
  alt: "Cheat sheet showing three correct ways to join two independent clauses: comma plus conjunction, semicolon, and colon, and the comma splice error to avoid.",
  hero: () => {
    const row = (pat, ex, ok = true) => `<div style="display:flex;align-items:center;gap:18px;background:#fff;border:2px solid ${ok ? C.ink : C.red};border-radius:14px;padding:12px 20px;margin-bottom:14px"><div style="width:40px;height:40px;border-radius:50%;background:${ok ? C.green : C.red};color:#fff;font-weight:800;font-size:24px;display:grid;place-items:center;flex:none">${ok ? "✓" : "✕"}</div><div><div class="m" style="font-size:20px;font-weight:700;color:${ok ? C.blue : C.red}">${pat}</div><div style="font-size:23px;margin-top:3px">${ex}</div></div></div>`;
    return row("complete sentence , and / but / so  complete sentence", "The lab opened early<b style='color:" + C.blue + "'>, but</b> the doors stayed locked.") + row("complete sentence ;  complete sentence", "The lab opened early<b style='color:" + C.blue + "'>;</b> the doors stayed locked.") + row("complete sentence :  explanation or list", "She packed one thing<b style='color:" + C.blue + "'>:</b> her old telescope.") + row("complete sentence ,  complete sentence   (comma splice)", "The lab opened early<b style='color:" + C.red + "'>,</b> the doors stayed locked.", false);
  },
  figKicker: "Subject-verb agreement", figTitle: "Cross out the phrase in the middle",
  figAlt: "Sentence 'The box of old photographs is in the attic' with the phrase 'of old photographs' crossed out and an arrow linking the subject 'box' to the verb 'is'.",
  caption: "Find the true subject by crossing out the phrase between it and the verb.",
  fig: () => `<div style="margin-top:6px;font-size:42px;font-family:F;font-weight:600;line-height:1.4;white-space:nowrap">
    The <span style="background:${C.blueSoft};border-bottom:5px solid ${C.blue};padding:0 6px">box</span> <span style="text-decoration:line-through;text-decoration-thickness:4px;text-decoration-color:${C.red};color:${C.mute}">of old photographs</span> <span style="background:${C.greenSoft};border-bottom:5px solid ${C.green};padding:0 6px">is</span> in the attic.</div>
    <div style="display:flex;gap:24px;margin-top:34px">
      <div class="card" style="flex:1"><div style="font-weight:800;font-size:23px;color:${C.blue}">1. Find the verb</div><div style="font-size:20px;color:${C.mute};margin-top:6px">The verb is "is" (or "are").</div></div>
      <div class="card" style="flex:1"><div style="font-weight:800;font-size:23px;color:${C.red}">2. Cross out the phrase</div><div style="font-size:20px;color:${C.mute};margin-top:6px">"of old photographs" only describes the box.</div></div>
      <div class="card" style="flex:1"><div style="font-weight:800;font-size:23px;color:${C.green}">3. Match</div><div style="font-size:20px;color:${C.mute};margin-top:6px">One box → "is". Not "are", because of the nearest noun.</div></div></div>`,
};

/* =========================================================
   5. sat-reading-practice-questions
   ========================================================= */
G["sat-reading-practice-questions"] = {
  kicker: "Reading questions", title: "Six question types, two domains",
  alt: "Two columns grouping SAT Reading question types: Information and Ideas (central ideas, evidence, inferences) and Craft and Structure (words in context, structure and purpose, cross-text connections).",
  hero: () => {
    const q = (t, tip, bg) => `<div style="background:${bg};border:2px solid ${C.ink};border-radius:12px;padding:12px 18px;margin-bottom:12px"><div style="font-weight:800;font-size:23px">${t}</div><div style="font-size:18px;color:${C.mute};margin-top:2px">${tip}</div></div>`;
    return `<div style="display:flex;gap:28px"><div style="flex:1"><div style="font-weight:800;font-size:24px;margin-bottom:12px;color:${C.blue}">Information and Ideas</div>${q("Central ideas and details", "What is the passage mainly about?", C.blueSoft)}${q("Command of evidence", "Which detail supports the claim?", C.blueSoft)}${q("Inferences", "What must be true based on the text?", C.blueSoft)}</div>
    <div style="flex:1"><div style="font-weight:800;font-size:24px;margin-bottom:12px;color:${C.green}">Craft and Structure</div>${q("Words in context", "Which word fits this meaning here?", C.greenSoft)}${q("Text structure and purpose", "Why did the author write this part?", C.greenSoft)}${q("Cross-text connections", "How does text 2 respond to text 1?", C.greenSoft)}</div></div>`;
  },
  figKicker: "Answer method", figTitle: "Predict first, then eliminate",
  figAlt: "Four-step method for SAT reading questions: read the question first, find the key line in the passage, predict an answer in your own words, then eliminate choices that do not match.",
  caption: "A short routine for any reading question.",
  fig: () => {
    const s = (n, t, d, c) => `<div style="display:flex;align-items:center;gap:20px;background:#fff;border:2px solid ${C.ink};border-radius:14px;padding:9px 22px;margin-bottom:11px"><div style="width:48px;height:48px;border-radius:50%;background:${c};color:#fff;font-weight:800;font-size:26px;display:grid;place-items:center;flex:none">${n}</div><div><div style="font-weight:800;font-size:25px">${t}</div><div style="font-size:19px;color:${C.mute}">${d}</div></div></div>`;
    return s(1, "Read the question first", "Know what you are hunting for before you read the passage.", C.blue) + s(2, "Find the key line", "Mark the sentence or phrase the question points to.", C.green) + s(3, "Predict in your own words", "Decide what the answer should say before looking at the choices.", C.amber) + s(4, "Eliminate", "Cross out choices that go beyond the text or change its meaning.", C.red);
  },
};

/* =========================================================
   6. sat-mock-test-review
   ========================================================= */
G["sat-mock-test-review"] = {
  kicker: "Error log", title: "Four columns that turn a miss into a plan",
  alt: "Example error log with columns for question, skill, why it was missed, and the fix, with two sample rows about percentages and subject-verb agreement.",
  hero: () => {
    const th = (t) => `<th style="text-align:left;padding:12px 16px;background:${C.ink};color:#fff;font-size:21px">${t}</th>`;
    const tr = (a, b, c, d) => `<tr>${[a, b, c, d].map((x) => `<td style="padding:16px;border:2px solid ${C.ink};background:#fff;font-size:21px;vertical-align:top">${x}</td>`).join("")}</tr>`;
    return `<table style="border-collapse:collapse;width:100%;margin-top:10px"><tr>${th("Question")}${th("Skill")}${th("Why I missed it")}${th("The fix")}</tr>${tr("Math, module 2, #14", "Percentages", chip("Trap answer", C.redSoft, C.red, "font-size:17px"), "Convert each change to a multiplier and multiply")}${tr("R&amp;W, module 1, #9", "Subject-verb agreement", chip("Didn't apply the rule", C.amberSoft, "#8a5f00", "font-size:17px"), "Cross out the phrase between subject and verb")}${tr("Math, module 1, #6", "Linear functions", chip("Careless slip", C.blueSoft, C.blue, "font-size:17px"), "Re-read the question before choosing")}</table><p style="margin-top:22px;font-size:21px;color:${C.mute}">Log every miss, every guess, and anything that ate too much time.</p>`;
  },
  figKicker: "Why students miss questions", figTitle: "Five reasons, five different fixes",
  figAlt: "Five labeled boxes for the reasons students miss SAT questions: content gap, trap answer, misreading, careless slip, and time pressure, each with its fix.",
  caption: "Naming the reason tells you what to practice next.",
  fig: () => {
    const r = (t, f, bg, c) => `<div style="flex:1;background:${bg};border:2px solid ${C.ink};border-radius:14px;padding:16px 14px;min-height:300px"><div style="font-weight:800;font-size:23px;color:${c}">${t}</div><div style="height:3px;background:${c};margin:12px 0;width:44px"></div><div style="font-size:19px;line-height:1.3">${f}</div></div>`;
    return `<div style="display:flex;gap:12px;margin-top:6px">${r("Content gap", "Learn the rule or method, then drill that skill.", C.blueSoft, C.blue)}${r("Trap answer", "Study how the wrong choice was built to tempt you.", C.redSoft, C.red)}${r("Misreading", "Underline what is asked; re-read before you choose.", C.amberSoft, "#8a5f00")}${r("Careless slip", "Slow down on arithmetic and write steps down.", C.greenSoft, C.green)}${r("Time", "Skip, flag, and return; practice with a timer.", "#ece9f7", "#5b4bb0")}</div>`;
  },
};

/* =========================================================
   7. sat-study-plan
   ========================================================= */
G["sat-study-plan"] = {
  kicker: "Six-week plan", title: "From a starting score to test-day ready",
  alt: "Six-week SAT study timeline: week 1 baseline practice test, weeks 2 and 3 fix weaknesses, week 4 second practice test, week 5 mixed timed practice, week 6 final test and test-day readiness.",
  hero: () => {
    const wk = (n, t, d, bg, w) => `<div style="width:${w}px;background:${bg};border:2px solid ${C.ink};border-radius:14px;padding:16px;height:215px"><div class="m" style="font-weight:700;font-size:19px;color:${C.mute}">${n}</div><div style="font-weight:800;font-size:25px;line-height:1.15;margin-top:6px">${t}</div><div style="font-size:18px;margin-top:10px;line-height:1.3;color:${C.ink}">${d}</div></div>`;
    return `<div style="display:flex;gap:10px;margin-top:6px">${wk("WEEK 1", "Baseline", "Full practice test, then review every miss.", C.blueSoft, 170)}${wk("WEEKS 2–3", "Fix weaknesses", "Rule, practice set, error log for your top skills.", C.greenSoft, 270)}${wk("WEEK 4", "Test again", "Second full test, adjust the plan.", C.blueSoft, 170)}${wk("WEEK 5", "Mixed and timed", "Mixed sets under time pressure.", C.amberSoft, 190)}${wk("WEEK 6", "Final test", "Last test early in the week, then ease off.", C.redSoft, 190)}</div>
    <div style="margin-top:30px;height:16px;border-radius:8px;background:linear-gradient(90deg,${C.blue} 0 17%,${C.green} 17% 50%,${C.blue} 50% 67%,${C.amber} 67% 83%,${C.red} 83% 100%)"></div>`;
  },
  figKicker: "A single study session", figTitle: "50 minutes: rule, practice, log",
  figAlt: "Stacked bar of a 50-minute SAT study session: 10 minutes on the rule, 30 minutes of practice on one skill, and 10 minutes on the error log.",
  caption: "The study-session pattern used in weeks 2 and 3.",
  fig: () => `<div style="display:flex;margin-top:30px;height:150px;border:2px solid ${C.ink};border-radius:16px;overflow:hidden">
    <div style="flex:10;background:${C.blueSoft};padding:18px;border-right:2px solid ${C.ink}"><div class="m" style="font-weight:800;font-size:34px">10</div><div style="font-weight:700;font-size:19px">min</div></div>
    <div style="flex:30;background:${C.greenSoft};padding:18px;border-right:2px solid ${C.ink}"><div class="m" style="font-weight:800;font-size:34px">30</div><div style="font-weight:700;font-size:19px">min</div></div>
    <div style="flex:10;background:${C.amberSoft};padding:18px"><div class="m" style="font-weight:800;font-size:34px">10</div><div style="font-weight:700;font-size:19px">min</div></div></div>
    <div style="display:flex;margin-top:18px;gap:0"><div style="flex:10;padding-right:8px"><b style="font-size:22px">Learn the rule</b><div style="font-size:18px;color:${C.mute};margin-top:4px">Read one lesson</div></div><div style="flex:30;padding:0 8px"><b style="font-size:22px">Practice one skill</b><div style="font-size:18px;color:${C.mute};margin-top:4px">One set slowly with every explanation, then a second set faster</div></div><div style="flex:10;padding-left:8px"><b style="font-size:22px">Error log</b><div style="font-size:18px;color:${C.mute};margin-top:4px">Add new misses</div></div></div>`,
};

/* =========================================================
   8. sat-percentage-problems
   ========================================================= */
G["sat-percentage-problems"] = {
  kicker: "Percent change", title: "Up 20% then down 20% is not back to 100",
  alt: "Bar chart: a quantity starts at 100, increases 20 percent to 120, then decreases 20 percent to 96, which is 4 percent lower than the start.",
  hero: () => {
    const p = plot({ w: 1050, h: 380, xr: [0, 3], yr: [0, 140], pad: [8, 24, 20, 8], ticks: false });
    const bar = (i, v, c, top, sub) => `<rect x="${p.X(i) + 70}" y="${p.Y(v)}" width="${190}" height="${p.Y(0) - p.Y(v)}" rx="8" fill="${c}" stroke="${C.ink}" stroke-width="2.4"/><text x="${p.X(i) + 165}" y="${p.Y(v) - 12}" font-size="32" font-weight="800" text-anchor="middle" style="font-family:M;paint-order:stroke;stroke:#fbf8f1;stroke-width:9px">${top}</text><text x="${p.X(i) + 165}" y="${p.Y(0) + 0}" dy="-14" font-size="20" font-weight="700" fill="#fff" text-anchor="middle">${sub}</text>`;
    return `<svg width="1050" height="380" viewBox="0 0 1050 380">${bar(0, 100, C.blue, "100", "start")}${bar(1, 120, C.green, "120", "× 1.20")}${bar(2, 96, C.red, "96", "× 0.80")}<line x1="40" x2="1040" y1="${p.Y(100)}" y2="${p.Y(100)}" stroke="${C.ink}" stroke-dasharray="8 7" stroke-width="2"/><text x="1030" y="${p.Y(100) - 8}" font-size="18" fill="${C.mute}" text-anchor="end">original 100</text><line x1="40" x2="1040" y1="${p.Y(0)}" y2="${p.Y(0)}" stroke="${C.ink}" stroke-width="3"/></svg>
    <p style="font-size:23px;color:${C.mute};margin-top:6px"><b style="color:${C.ink}">1.20 × 0.80 = 0.96</b>: the final value is 4% below the start, because the 20% drop applies to the larger number.</p>`;
  },
  figKicker: "Multipliers", figTitle: "Turn every percent into a multiplier",
  figAlt: "Four cards showing multipliers: 15 percent increase is times 1.15, 25 percent decrease is times 0.75, 5 percent growth for 3 years is 1.05 cubed, and a reverse percent divides by the multiplier.",
  caption: "Multipliers make every percent question a one-line calculation.",
  fig: () => {
    const c = (h, m, d, bg) => `<div style="background:${bg};border:2px solid ${C.ink};border-radius:14px;padding:16px 20px"><div style="font-size:20px;font-weight:700;color:${C.mute}">${h}</div><div class="m" style="font-size:35px;font-weight:800;margin-top:6px">${m}</div><div style="font-size:19px;margin-top:6px">${d}</div></div>`;
    return `<div style="display:grid;grid-template-columns:1fr 1fr;gap:16px;margin-top:4px">${c("Increase of 15%", "× 1.15", "100 + 15 = 115% of the original", C.greenSoft)}${c("Decrease of 25%", "× 0.75", "100 − 25 = 75% of the original", C.redSoft)}${c("5% growth for 3 years", "× 1.05³", "Repeat the multiplier once per period", C.blueSoft)}${c("Reverse percent", "÷ 0.80", "Price after 20% off is $60, so the original is 60 ÷ 0.80 = $75", C.amberSoft)}</div>`;
  },
};

/* =========================================================
   9. sat-circle-questions
   ========================================================= */
const polar = (cx, cy, r, deg) => [cx + r * Math.cos((deg * Math.PI) / 180), cy - r * Math.sin((deg * Math.PI) / 180)];
G["sat-circle-questions"] = {
  kicker: "Arc length and sector area", title: "A central angle is a fraction of the whole circle",
  alt: "Circle of radius 8 with a 120 degree sector shaded, labeled with arc length 16π/3 and sector area 64π/3, each one third of the circumference and area.",
  hero: () => {
    const cx = 270, cy = 235, r = 190, [x1, y1] = polar(cx, cy, r, 0), [x2, y2] = polar(cx, cy, r, 120), [lx, ly] = polar(cx, cy, 70, 60);
    return `<div style="display:flex;gap:30px"><svg width="560" height="470" viewBox="0 0 560 470"><circle cx="${cx}" cy="${cy}" r="${r}" fill="#fff" stroke="${C.ink}" stroke-width="3"/><path d="M${cx} ${cy} L${x1} ${y1} A${r} ${r} 0 0 0 ${x2} ${y2} Z" fill="${C.blueSoft}" stroke="${C.ink}" stroke-width="3"/><path d="M${x1} ${y1} A${r} ${r} 0 0 0 ${x2} ${y2}" fill="none" stroke="${C.blue}" stroke-width="9" stroke-linecap="round"/><circle cx="${cx}" cy="${cy}" r="6" fill="${C.ink}"/><path d="M${cx + 52} ${cy} A52 52 0 0 0 ${cx + 52 * Math.cos((120 * Math.PI) / 180)} ${cy - 52 * Math.sin((120 * Math.PI) / 180)}" fill="none" stroke="${C.red}" stroke-width="3.5"/><text x="${lx}" y="${ly + 6}" font-size="26" font-weight="800" fill="${C.red}" text-anchor="middle">120°</text><text x="${cx + 105}" y="${cy + 28}" font-size="23" font-weight="700" fill="${C.ink}" text-anchor="middle">r = 8</text></svg>
    <div style="flex:1;padding-top:10px"><div class="card" style="border-color:${C.blue}"><div style="font-size:19px;font-weight:700;color:${C.blue}">ARC LENGTH</div><div class="m" style="font-size:25px;margin-top:8px;line-height:1.4">120/360 × 2π(8)<br><b style="font-size:31px">= 16π/3</b></div></div>
    <div class="card" style="margin-top:20px;background:${C.blueSoft}"><div style="font-size:19px;font-weight:700;color:${C.blue}">SECTOR AREA</div><div class="m" style="font-size:25px;margin-top:8px;line-height:1.4">120/360 × π(8)²<br><b style="font-size:31px">= 64π/3</b></div></div>
    <p style="font-size:21px;color:${C.mute};margin-top:20px">Same fraction, 120/360 = 1/3, for both.</p></div></div>`;
  },
  figKicker: "Circle equations", figTitle: "(x − 3)² + (y + 2)² = 25",
  figAlt: "Coordinate grid with a circle centered at (3, −2) with radius 5, showing that the center signs are opposite those in the equation.",
  caption: "In (x − h)² + (y − k)² = r², the center is (h, k) and the radius is the square root of the right side.",
  fig: () => {
    const p = plot({ w: 480, h: 392, xr: [-3, 11], yr: [-8, 4], xs: 1, ys: 1, pad: [36, 8, 28, 8] });
    const sx = p.X(1) - p.X(0), sy = p.Y(0) - p.Y(1);
    const inner = `<ellipse cx="${p.X(3)}" cy="${p.Y(-2)}" rx="${5 * sx}" ry="${5 * sy}" fill="${C.blueSoft}" fill-opacity=".6" stroke="${C.blue}" stroke-width="4.5"/><line x1="${p.X(3)}" y1="${p.Y(-2)}" x2="${p.X(8)}" y2="${p.Y(-2)}" stroke="${C.red}" stroke-width="4"/>${p.dot(3, -2, C.ink)}${p.dot(8, -2, C.red)}${p.label(3, -2, "(3, −2)", { dx: -6, dy: 30, anchor: "end", size: 20 })}${p.label(5.5, -2, "r = 5", { dy: -12, anchor: "middle", fill: C.red, size: 21 })}`;
    return `<div style="display:flex;gap:30px">${p.svg(inner)}<div style="flex:1;padding-top:16px"><div class="card"><div class="m" style="font-size:19px;white-space:nowrap">(x − <b style="color:${C.blue}">3</b>)² + (y + <b style="color:${C.blue}">2</b>)² = <b style="color:${C.red}">25</b></div></div><ul style="margin-top:24px;font-size:22px;line-height:1.5;padding-left:22px"><li>Center is <b>(3, −2)</b>: flip the signs.</li><li>Radius is <b>5</b>: take the square root of 25.</li><li>A common trap is answering (−3, 2).</li></ul></div></div>`;
  },
};

/* =========================================================
   10. sat-linear-equations-and-functions
   ========================================================= */
G["sat-linear-equations-and-functions"] = {
  kicker: "Slope from two points", title: "f(−5) = 0 and f(−4) = 2 give f(x) = 2x + 10",
  alt: "Graph of the line f(x) = 2x + 10 through (−5, 0) and (−4, 2) with a slope triangle showing a run of 1 and a rise of 2.",
  hero: () => {
    const p = plot({ w: 640, h: 470, xr: [-8, 2], yr: [-2, 14], xs: 1, ys: 2, pad: [40, 10, 34, 10], yl: "f(x)" });
    const inner = curve(p.path((x) => 2 * x + 10, -6, 2)) + `<path d="M${p.X(-5)} ${p.Y(0)} L${p.X(-4)} ${p.Y(0)} L${p.X(-4)} ${p.Y(2)}" fill="none" stroke="${C.red}" stroke-width="4"/>${p.dot(-5, 0)}${p.dot(-4, 2)}${p.dot(0, 10, C.green)}${p.label(-4.5, 0, "run 1", { dy: 46, anchor: "middle", fill: C.red, size: 20 })}${p.label(-3.8, 1, "rise 2", { dx: 6, dy: 5, fill: C.red, size: 20 })}${p.label(0, 10, "(0, 10)", { dx: 12, dy: 6, size: 19 })}`;
    return `<div style="display:flex;gap:26px">${p.svg(inner)}<div style="flex:1;padding-top:10px"><div class="card"><div style="font-size:19px;font-weight:700;color:${C.blue}">STEP 1: SLOPE</div><div class="m" style="font-size:23px;margin-top:8px">(2 − 0) / (−4 − (−5)) = 2</div></div><div class="card" style="margin-top:16px"><div style="font-size:19px;font-weight:700;color:${C.blue}">STEP 2: INTERCEPT</div><div class="m" style="font-size:23px;margin-top:8px">0 = 2(−5) + b → b = 10</div></div><div class="card" style="margin-top:16px;background:${C.greenSoft}"><div style="font-size:19px;font-weight:700;color:${C.green}">STEP 3: EVALUATE</div><div class="m" style="font-size:23px;margin-top:8px">f(7) = 2(7) + 10 = <b>24</b></div></div></div></div>`;
  },
  figKicker: "Reading slope and intercept in context", figTitle: "C = 0.15m + 20",
  figAlt: "Graph of a phone plan cost C = 0.15m + 20 against minutes used, showing the 20 dollar intercept as the fixed monthly fee and the slope 0.15 as the cost per minute.",
  caption: "In a word problem, the intercept is the starting value and the slope is the rate of change.",
  fig: () => {
    const p = plot({ w: 560, h: 392, xr: [0, 200], yr: [0, 60], xs: 50, ys: 10, pad: [52, 10, 34, 30], xl: "m (minutes)", yl: "C ($)" });
    const inner = curve(p.path((m) => 0.15 * m + 20, 0, 200)) + p.dot(0, 20, C.green, 9) + `<path d="M${p.X(100)} ${p.Y(35)} L${p.X(200)} ${p.Y(35)} L${p.X(200)} ${p.Y(50)}" fill="none" stroke="${C.red}" stroke-width="3.5"/>${p.label(150, 35, "+100 min", { dy: 26, anchor: "middle", fill: C.red, size: 19 })}${p.label(200, 42, "+$15", { dx: -10, dy: 5, anchor: "end", fill: C.red, size: 19 })}`;
    return `<div style="display:flex;gap:30px">${p.svg(inner)}<div style="flex:1;padding-top:20px"><div class="card" style="background:${C.greenSoft}"><div class="m" style="font-size:30px;font-weight:800;color:${C.green}">20</div><div style="font-size:21px;margin-top:4px">Intercept: the fixed monthly fee, the cost when m = 0.</div></div><div class="card" style="margin-top:20px;background:${C.redSoft}"><div class="m" style="font-size:30px;font-weight:800;color:${C.red}">0.15</div><div style="font-size:21px;margin-top:4px">Slope: each extra minute adds $0.15.</div></div></div></div>`;
  },
};

/* =========================================================
   11. sat-quadratic-equations
   ========================================================= */
G["sat-quadratic-equations"] = {
  kicker: "Vertex form", title: "f(x) = (x − 3)² − 4 tells you the whole graph",
  alt: "Parabola f(x) = (x − 3)² − 4 with its vertex at (3, −4) and x-intercepts at (1, 0) and (5, 0).",
  hero: () => {
    const p = plot({ w: 640, h: 470, xr: [-1, 7], yr: [-5, 6], xs: 1, ys: 1, pad: [40, 10, 34, 10], yl: "f(x)" });
    const inner = `<line x1="${p.X(3)}" y1="${p.Y(-5)}" x2="${p.X(3)}" y2="${p.Y(6)}" stroke="${C.mute}" stroke-dasharray="8 6" stroke-width="2"/>` + curve(p.path((x) => (x - 3) ** 2 - 4, -0.12, 6.12)) + p.dot(3, -4, C.red, 9) + p.dot(1, 0, C.green, 9) + p.dot(5, 0, C.green, 9) + p.label(3, -4, "vertex (3, −4)", { dx: 14, dy: 8, fill: C.red, size: 20 }) + p.label(1, 0, "(1, 0)", { dx: -10, dy: -14, anchor: "end", fill: C.green, size: 20 }) + p.label(5, 0, "(5, 0)", { dx: 12, dy: -14, fill: C.green, size: 20 });
    return `<div style="display:flex;gap:26px">${p.svg(inner)}<div style="flex:1;padding-top:10px"><div class="card"><div style="font-size:19px;font-weight:700;color:${C.red}">VERTEX</div><div class="m" style="font-size:23px;margin-top:8px">(x − h)² + k → (3, −4)</div></div><div class="card" style="margin-top:16px;background:${C.greenSoft}"><div style="font-size:19px;font-weight:700;color:${C.green}">X-INTERCEPTS</div><div class="m" style="font-size:23px;margin-top:8px;line-height:1.5">(x − 3)² = 4<br>x − 3 = ±2 → x = 1, 5</div></div><p style="font-size:21px;color:${C.mute};margin-top:18px">Axis of symmetry: x = 3, halfway between the roots.</p></div></div>`;
  },
  figKicker: "The discriminant", figTitle: "b² − 4ac decides how many solutions",
  figAlt: "Three small parabolas: one crossing the x-axis twice when the discriminant is positive, one touching it once when zero, and one never reaching it when negative.",
  caption: "Positive, zero, or negative discriminant: two, one, or no real solutions.",
  fig: () => {
    const panel = (title, sub, fn, color, dots) => {
      const p = plot({ w: 262, h: 215, xr: [-3, 3], yr: [-3, 5], xs: 1, ys: 1, pad: [10, 10, 10, 10], ticks: false, xl: "", yl: "" });
      return `<div style="flex:1;min-width:0;text-align:center"><div class="card" style="padding:8px 8px 4px;background:#fff">${p.svg(curve(p.path(fn, -2.6, 2.6), color) + dots(p))}</div><div class="m" style="font-weight:800;font-size:25px;margin-top:14px">${title}</div><div style="font-size:21px;color:${C.mute};margin-top:4px">${sub}</div></div>`;
    };
    return `<div style="display:flex;gap:22px;margin-top:8px">${panel("b² − 4ac &gt; 0", "two real solutions", (x) => x * x - 2, C.green, (p) => p.dot(-Math.SQRT2, 0, C.green) + p.dot(Math.SQRT2, 0, C.green))}${panel("b² − 4ac = 0", "one real solution", (x) => x * x, C.amber, (p) => p.dot(0, 0, C.amber))}${panel("b² − 4ac &lt; 0", "no real solutions", (x) => x * x + 1.5, C.red, () => "")}</div>`;
  },
};

/* =========================================================
   12. sat-systems-of-equations
   ========================================================= */
G["sat-systems-of-equations"] = {
  kicker: "Where two equations meet", title: "The solution is the intersection point",
  alt: "Two lines for adult and child ticket counts crossing at (20, 30), the solution to a + c = 50 and 12a + 8c = 480.",
  hero: () => {
    const p = plot({ w: 640, h: 470, xr: [0, 45], yr: [0, 65], xs: 5, ys: 10, pad: [44, 10, 34, 10], xl: "a", yl: "c" });
    const inner = curve(p.path((a) => 50 - a, 0, 45), C.blue) + curve(p.path((a) => 60 - 1.5 * a, 0, 40), C.green) + p.dot(20, 30, C.red, 10) + p.label(20, 30, "(20, 30)", { dx: 16, dy: -12, fill: C.red, size: 22 }) + p.label(28, 25, "a + c = 50", { fill: C.blue, size: 20 }) + p.label(5, 58, "12a + 8c = 480", { fill: C.green, size: 20 });
    return `<div style="display:flex;gap:26px">${p.svg(inner)}<div style="flex:1;padding-top:10px"><div class="card"><div style="font-size:19px;font-weight:700;color:${C.blue}">THE SETUP</div><div style="font-size:21px;margin-top:8px;line-height:1.4">50 tickets: adult at $12, child at $8, total $480.</div></div><div class="card" style="margin-top:16px"><div style="font-size:19px;font-weight:700;color:${C.blue}">ELIMINATE</div><div class="m" style="font-size:21px;margin-top:8px;line-height:1.5">12a + 8c = 480<br>−(8a + 8c = 400)<br>4a = 80 → a = 20</div></div><div class="card" style="margin-top:16px;background:${C.greenSoft}"><div class="m" style="font-size:23px"><b>20 adults, 30 children</b></div></div></div></div>`;
  },
  figKicker: "How many solutions?", figTitle: "Compare the slopes and intercepts",
  figAlt: "Three panels of two lines: different slopes cross once (one solution), same slope different intercepts are parallel (no solution), and identical lines overlap (infinitely many solutions).",
  caption: "The three possible outcomes for a system of two linear equations.",
  fig: () => {
    const panel = (title, sub, lines, dots) => {
      const p = plot({ w: 262, h: 215, xr: [-4, 4], yr: [-4, 4], xs: 1, ys: 1, pad: [10, 10, 10, 10], ticks: false, xl: "", yl: "" });
      return `<div style="flex:1;min-width:0;text-align:center"><div class="card" style="padding:8px 8px 4px">${p.svg(lines.map(([f, c, w]) => curve(p.path(f, -4, 4), c, w ?? 4.5)).join("") + dots(p))}</div><div style="font-weight:800;font-size:25px;margin-top:14px">${title}</div><div style="font-size:20px;color:${C.mute};margin-top:4px">${sub}</div></div>`;
    };
    return `<div style="display:flex;gap:22px;margin-top:8px">${panel("One solution", "different slopes", [[(x) => x, C.blue], [(x) => -0.5 * x + 1.5, C.green]], (p) => p.dot(1, 1, C.red, 9))}${panel("No solution", "same slope, different intercepts", [[(x) => 0.5 * x + 1, C.blue], [(x) => 0.5 * x - 1.5, C.green]], () => "")}${panel("Infinitely many", "same line (all values match)", [[(x) => 0.5 * x, C.blue, 9], [(x) => 0.5 * x, C.green, 3.5]], () => "")}</div>`;
  },
};

/* =========================================================
   13. sat-probability-two-way-tables
   ========================================================= */
const tbl = (rows, hi = {}) => {
  const cell = (v, k, bold) => `<td style="padding:14px 18px;border:2px solid ${C.ink};font-size:25px;text-align:center;font-weight:${bold ? 800 : 600};background:${hi[k] ?? (bold ? "#f1eee4" : "#fff")}" class="m">${v}</td>`;
  const head = `<tr><th style="border:2px solid ${C.ink};padding:12px"></th>${["Has a job", "No job", "Total"].map((h) => `<th style="border:2px solid ${C.ink};padding:12px 18px;font-size:21px;background:${C.ink};color:#fff">${h}</th>`).join("")}</tr>`;
  return `<table style="border-collapse:collapse;width:100%">${head}${rows.map((r, i) => `<tr><th style="border:2px solid ${C.ink};padding:12px 18px;font-size:21px;text-align:left;background:#f1eee4">${r[0]}</th>${r.slice(1).map((v, j) => cell(v, `${i}${j}`, i === rows.length - 1 || j === 2)).join("")}</tr>`).join("")}</table>`;
};
const TW = [["Juniors", 18, 42, 60], ["Seniors", 30, 30, 60], ["Total", 48, 72, 120]];
G["sat-probability-two-way-tables"] = {
  kicker: "Two-way tables", title: "Pick the right row, column, or total",
  alt: "Two-way table of juniors and seniors by whether they have a job, with the juniors row highlighted to show the probability 18 out of 60.",
  hero: () => `<div style="display:flex;gap:30px;align-items:center"><div style="flex:1.25">${tbl(TW, { "00": C.amberSoft, "01": C.blueSoft, "02": C.blueSoft })}</div><div style="flex:1"><div class="card" style="background:${C.amberSoft}"><div style="font-size:19px;font-weight:700;color:#8a5f00">A RANDOM JUNIOR HAS A JOB</div><div class="m" style="font-size:34px;font-weight:800;margin-top:8px">18 / 60 = 0.30</div></div><p style="font-size:21px;color:${C.mute};margin-top:18px;line-height:1.4">"Given that" tells you which row or column is the whole group. The denominator is that group's total.</p></div></div>`,
  figKicker: "Choose the denominator", figTitle: "The question tells you the whole",
  figAlt: "Three copies of a two-way table highlighting a row total, a column total, and the grand total as the denominator for different probability questions.",
  caption: "The denominator is the group the question restricts you to.",
  fig: () => {
    const mini = (title, sub, hi) => `<div style="flex:1"><div style="font-weight:800;font-size:23px;margin-bottom:6px">${title}</div>${tbl(TW, hi).replace(/font-size:25px/g, "font-size:19px").replace(/padding:14px 18px/g, "padding:9px 8px").replace(/padding:12px 18px/g, "padding:8px 8px").replace(/font-size:21px/g, "font-size:15px")}<div style="font-size:19px;color:${C.mute};margin-top:8px;line-height:1.3">${sub}</div></div>`;
    return `<div style="display:flex;gap:18px;margin-top:10px">${mini("Given a junior", "whole = row total, 60", { "02": C.amberSoft, "00": C.blueSoft })}${mini("Given has a job", "whole = column total, 48", { 20: C.amberSoft, "00": C.blueSoft, "10": C.blueSoft })}${mini("From all students", "whole = grand total, 120", { 22: C.amberSoft })}</div>`;
  },
};

/* =========================================================
   14. sat-transitions-questions
   ========================================================= */
G["sat-transitions-questions"] = {
  kicker: "Transitions", title: "Name the relationship, then pick the word",
  alt: "Chart of transition word families: contrast, cause and effect, addition, example, and sequence, each with sample words.",
  hero: () => {
    const f = (name, desc, words, c, bg) => `<div style="display:flex;gap:18px;align-items:center;background:${bg};border:2px solid ${C.ink};border-radius:14px;padding:12px 20px;margin-bottom:12px"><div style="width:210px;flex:none"><div style="font-weight:800;font-size:25px;color:${c}">${name}</div><div style="font-size:17px;color:${C.mute}">${desc}</div></div><div style="font-size:23px;font-weight:600;line-height:1.3">${words}</div></div>`;
    return f("Contrast", "the ideas oppose each other", "However, But, Yet, Still, Nevertheless", C.red, C.redSoft) + f("Cause and effect", "the first leads to the second", "Therefore, Thus, As a result, Consequently", C.green, C.greenSoft) + f("Addition", "one more point, same direction", "Moreover, Furthermore, Also, Additionally", C.blue, C.blueSoft) + f("Example", "a specific case of the idea", "For example, For instance, In particular", "#8a5f00", C.amberSoft) + f("Sequence", "steps in time or order", "First, Then, Next, Finally, Subsequently", "#5b4bb0", "#ece9f7");
  },
  figKicker: "A worked check", figTitle: "Test the relationship, not the sound",
  figAlt: "Flow showing two sentences about early telescopes joined by a blank; the second sentence limits the first, so the relationship is contrast and the answer is a contrast word.",
  caption: "Read both sentences, name how they relate, and only then look at the choices.",
  fig: () => `<div class="card" style="font-size:25px;line-height:1.45;font-family:F;font-weight:500"><span style="background:${C.blueSoft};padding:2px 6px">Early telescopes could show that something unusual surrounded Saturn.</span> <b style="color:${C.red}">______</b> <span style="background:${C.amberSoft};padding:2px 6px">the blurry images made the rings look like two bumps on the planet.</span></div>
    <div style="display:flex;align-items:stretch;gap:0;margin-top:34px">
      <div class="card" style="flex:1;background:${C.blueSoft}"><div style="font-weight:800;font-size:21px">Sentence 1</div><div style="font-size:19px;color:${C.mute};margin-top:4px">Telescopes could detect the rings.</div></div>
      <div style="width:130px;display:grid;place-items:center;font-size:19px;font-weight:800;color:${C.red};text-align:center">limits →<br>CONTRAST</div>
      <div class="card" style="flex:1;background:${C.amberSoft}"><div style="font-weight:800;font-size:21px">Sentence 2</div><div style="font-size:19px;color:${C.mute};margin-top:4px">The images were too blurry to show them clearly.</div></div></div>
    <p style="margin-top:28px;font-size:23px"><b style="color:${C.red}">Pick:</b> However, Still, Yet. <b style="color:${C.mute}">Reject:</b> Therefore (nothing here is a result).</p>`,
};

/* =========================================================
   15. sat-vocabulary-words-in-context
   ========================================================= */
G["sat-vocabulary-words-in-context"] = {
  kicker: "Words in context", title: "Cover the choices and predict the word",
  alt: "Sample SAT words-in-context question with a blank and four choices, where 'reproducible' is checked because other labs repeated the experiment.",
  hero: () => {
    const ch = (l, w, ok, why) => `<div style="display:flex;align-items:center;gap:16px;background:${ok ? C.greenSoft : "#fff"};border:2px solid ${ok ? C.green : C.ink};border-radius:12px;padding:10px 18px;margin-bottom:10px"><div style="width:38px;height:38px;border-radius:50%;border:2.5px solid ${ok ? C.green : C.ink};background:${ok ? C.green : "#fff"};color:${ok ? "#fff" : C.ink};font-weight:800;font-size:21px;display:grid;place-items:center;flex:none">${ok ? "✓" : l}</div><div style="font-size:24px;font-weight:700;width:190px">${w}</div><div style="font-size:19px;color:${C.mute}">${why}</div></div>`;
    return `<div class="card" style="font-family:F;font-size:28px;line-height:1.4;font-weight:500;margin-bottom:18px">The scientist's findings were <span style="display:inline-block;width:130px;border-bottom:3px solid ${C.blue};margin:0 4px"></span>: other labs repeated the experiment and got the same result.</div>${ch("A", "reproducible", true, "matches the clue: repeated, same result")}${ch("B", "fleeting", false, "nothing in the text suggests brief")}${ch("C", "disputed", false, "the clue says labs agreed")}${ch("D", "ornate", false, "about decoration, not results")}`;
  },
  figKicker: "Same word, different meanings", figTitle: "The sentence decides the meaning",
  figAlt: "The word 'dense' used in two sentences: a dense forest means thick, while a dense argument means hard to follow, each with its context clue highlighted.",
  caption: "Many SAT vocabulary words have several meanings. The clues around the blank pick one.",
  fig: () => {
    const side = (sent, meaning, clue, c, bg) => `<div style="flex:1;background:${bg};border:2px solid ${C.ink};border-radius:16px;padding:22px 24px"><div class="m" style="font-weight:800;font-size:30px;color:${c}">dense</div><div style="font-family:F;font-size:28px;line-height:1.35;margin-top:14px;font-weight:500">${sent}</div><div style="margin-top:18px;font-size:20px;color:${C.mute}">Clue: <b style="color:${C.ink}">${clue}</b></div><div style="margin-top:10px;font-size:25px;font-weight:800;color:${c}">= ${meaning}</div></div>`;
    return `<div style="display:flex;gap:24px;margin-top:6px">${side("Sunlight barely reached the floor of the <mark style='background:#fff3b8'>dense</mark> forest, where trees stood close together.", "thick, crowded", "trees stood close together", C.green, C.greenSoft)}${side("Most readers found the <mark style='background:#fff3b8'>dense</mark> argument hard to follow without rereading it.", "hard to understand", "hard to follow", C.blue, C.blueSoft)}</div>`;
  },
};

/* =========================================================
   Queued auto-blog topics: images keyed by topic.image (see scripts/pipeline/topics.ts).
   generate.ts copies topic-<key>*.png to the article's slug when it drafts the article.
   ========================================================= */
const T = {};
const numline = ({ w = 1000, lo, hi, marks = [], shade }) => {
  const X = (v) => 50 + ((v - lo) / (hi - lo)) * (w - 100);
  let s = `<svg width="${w}" height="120" viewBox="0 0 ${w} 120"><line x1="30" y1="60" x2="${w - 30}" y2="60" stroke="${C.ink}" stroke-width="3"/>`;
  if (shade) s += `<line x1="${X(shade[0])}" y1="60" x2="${X(shade[1])}" y2="60" stroke="${C.blue}" stroke-width="12" stroke-linecap="butt"/>`;
  for (let v = lo; v <= hi; v++) s += `<line x1="${X(v)}" y1="52" x2="${X(v)}" y2="68" stroke="${C.ink}" stroke-width="2"/><text x="${X(v)}" y="94" font-size="20" text-anchor="middle" fill="${C.mute}">${v}</text>`;
  for (const [v, open] of marks) s += `<circle cx="${X(v)}" cy="60" r="11" fill="${open ? "#fff" : C.ink}" stroke="${C.ink}" stroke-width="3.5"/>`;
  return s + "</svg>";
};
const stepCard = (n, t, d, c) => `<div style="display:flex;align-items:center;gap:20px;background:#fff;border:2px solid ${C.ink};border-radius:14px;padding:10px 22px;margin-bottom:11px"><div style="width:46px;height:46px;border-radius:50%;background:${c};color:#fff;font-weight:800;font-size:25px;display:grid;place-items:center;flex:none">${n}</div><div><div style="font-weight:800;font-size:24px">${t}</div><div style="font-size:19px;color:${C.mute}">${d}</div></div></div>`;

T["linear-inequalities"] = {
  kicker: "Linear inequalities", title: "Divide by a negative and the sign flips",
  alt: "Number line showing the solution x < −2 to the inequality 3 − 2x > 7, with an open circle at −2 and shading to the left, and the steps showing the sign flip.",
  hero: () => `<div class="card" style="font-size:28px" ><span class="m"><b>3 − 2x &gt; 7</b></span> &nbsp;→&nbsp; <span class="m">−2x &gt; 4</span> &nbsp;→&nbsp; <span class="m"><b style="color:${C.red}">x &lt; −2</b></span> <span style="font-size:20px;color:${C.red};margin-left:12px">(dividing by −2 flips &gt; to &lt;)</span></div><div style="margin-top:34px">${numline({ lo: -6, hi: 2, marks: [[-2, true]], shade: [-6, -2] })}</div><p style="font-size:22px;color:${C.mute};margin-top:10px">Open circle: −2 itself is not a solution. Shading goes left because x is less than −2.</p>`,
  figKicker: "Reading the boundary", figTitle: "Open or closed, left or right",
  figAlt: "Four number lines showing x less than 1 (open circle, shade left), x less than or equal to 1 (closed circle, shade left), x greater than 1 (open circle, shade right), and x greater than or equal to 1 (closed circle, shade right).",
  caption: "Strict inequalities use an open circle; inequalities that include equality use a closed circle.",
  fig: () => { const r = (lab, open, sh) => `<div style="display:flex;align-items:center;gap:10px"><div class="m" style="width:150px;font-size:26px;font-weight:800">${lab}</div><div style="flex:1">${numline({ w: 700, lo: -2, hi: 4, marks: [[1, open]], shade: sh }).replace('height="120"', 'height="90"').replace('viewBox="0 0 700 120"', 'viewBox="0 10 700 100"')}</div></div>`; return r("x &lt; 1", true, [-2, 1]) + r("x ≤ 1", false, [-2, 1]) + r("x &gt; 1", true, [1, 4]) + r("x ≥ 1", false, [1, 4]); },
};

T["exponents-and-equivalent-expressions"] = {
  kicker: "Exponent rules", title: "Six rules cover almost every exponent question",
  alt: "Cheat sheet of six exponent rules: product, power of a power, quotient, zero exponent, negative exponent, and fractional exponent.",
  hero: () => { const c = (r, e, bg) => `<div style="background:${bg};border:2px solid ${C.ink};border-radius:14px;padding:16px 20px"><div style="font-size:19px;font-weight:700;color:${C.mute}">${r}</div><div class="m" style="font-size:27px;font-weight:700;margin-top:8px">${e}</div></div>`; return `<div style="display:grid;grid-template-columns:1fr 1fr;gap:16px">${c("Multiply, same base", "x<sup>a</sup> · x<sup>b</sup> = x<sup>a+b</sup>", C.blueSoft)}${c("Power of a power", "(x<sup>a</sup>)<sup>b</sup> = x<sup>ab</sup>", C.greenSoft)}${c("Divide, same base", "x<sup>a</sup> / x<sup>b</sup> = x<sup>a−b</sup>", C.amberSoft)}${c("Zero exponent", "x<sup>0</sup> = 1", C.redSoft)}${c("Negative exponent", "x<sup>−n</sup> = 1 / x<sup>n</sup>", C.blueSoft)}${c("Fractional exponent", "x<sup>1/2</sup> = √x", C.greenSoft)}</div>`; },
  figKicker: "The common trap", figTitle: "Apply the power to every factor",
  figAlt: "Worked example (2x³)² = 4x⁶, contrasted with the wrong answer 2x⁶ that forgets to square the coefficient.",
  caption: "An exponent outside parentheses applies to the coefficient as well as the variable.",
  fig: () => `<div class="card" style="font-size:44px;text-align:center" ><span class="m">(2x³)² = <b style="color:${C.green}">2² · x⁶ = 4x⁶</b></span></div><div style="display:flex;gap:22px;margin-top:26px"><div class="card" style="flex:1;border-color:${C.green};background:${C.greenSoft}"><div style="font-weight:800;font-size:23px;color:${C.green}">✓ Correct</div><div style="font-size:21px;margin-top:8px;line-height:1.4">Square the 2 to get 4, and multiply the exponents: 3 × 2 = 6.</div></div><div class="card" style="flex:1;border-color:${C.red};background:${C.redSoft}"><div style="font-weight:800;font-size:23px;color:${C.red}">✕ Trap: 2x⁶</div><div style="font-size:21px;margin-top:8px;line-height:1.4">Forgets that the coefficient 2 is inside the parentheses too.</div></div></div>`,
};

T["ratios-rates-and-units"] = {
  kicker: "Unit conversion", title: "Write the units and let them cancel",
  alt: "Conversion chain turning 90 kilometers per hour into 25 meters per second by multiplying by 1000 meters per kilometer and 1 hour per 3600 seconds, with units cancelling.",
  hero: () => `<div style="display:flex;align-items:center;gap:14px;margin-top:20px;font-size:30px;font-weight:700;flex-wrap:nowrap"><div class="card" style="padding:12px 18px"><div class="m">90 <s style="text-decoration-color:${C.red};text-decoration-thickness:3px">km</s></div><div style="height:3px;background:${C.ink}"></div><div class="m"><s style="text-decoration-color:${C.blue};text-decoration-thickness:3px">h</s></div></div>×<div class="card" style="padding:12px 18px"><div class="m">1000 m</div><div style="height:3px;background:${C.ink}"></div><div class="m"><s style="text-decoration-color:${C.red};text-decoration-thickness:3px">1 km</s></div></div>×<div class="card" style="padding:12px 18px"><div class="m"><s style="text-decoration-color:${C.blue};text-decoration-thickness:3px">1 h</s></div><div style="height:3px;background:${C.ink}"></div><div class="m">3600 s</div></div>=<div class="card" style="padding:12px 18px;background:${C.greenSoft}"><div class="m" style="color:${C.green}">25 m/s</div></div></div><p style="font-size:23px;color:${C.mute};margin-top:34px">Arrange each conversion factor so the unit you want to remove sits on the opposite side of the fraction.</p><div class="card" style="margin-top:26px;font-size:23px;line-height:1.5"><b>Check by reversing:</b> 25 m/s × 3600 s/h ÷ 1000 m/km = 90 km/h ✓</div>`,
  figKicker: "Ratios", figTitle: "Part-to-part versus part-to-whole",
  figAlt: "A bar split 3 to 5 representing 40 total: the 3 parts equal 15 and the 5 parts equal 25, showing that the ratio 3 to 5 has 8 parts in all.",
  caption: "Add the ratio parts to get the whole, then divide to find the size of one part.",
  fig: () => `<div style="display:flex;height:120px;border:2px solid ${C.ink};border-radius:14px;overflow:hidden;margin-top:14px"><div style="flex:3;background:${C.blueSoft};display:grid;place-items:center;border-right:2px solid ${C.ink}"><div class="m" style="font-size:36px;font-weight:800">15</div></div><div style="flex:5;background:${C.greenSoft};display:grid;place-items:center"><div class="m" style="font-size:36px;font-weight:800">25</div></div></div><div style="display:flex;margin-top:12px"><div style="flex:3;text-align:center;font-size:22px;font-weight:700">3 parts</div><div style="flex:5;text-align:center;font-size:22px;font-weight:700">5 parts</div></div><div class="card" style="margin-top:26px;font-size:22px;line-height:1.5">Ratio 3 : 5 with a total of 40 → 3 + 5 = <b>8 parts</b> → 40 ÷ 8 = <b>5 per part</b> → 3 × 5 = 15 and 5 × 5 = 25.</div>`,
};

T["one-variable-data"] = {
  kicker: "Mean and median", title: "One outlier moves the mean, not the median",
  alt: "Bar chart of the data set 3, 5, 6, 8 and 28 with the median 6 and the mean 10 marked, showing the outlier 28 pulls the mean above the median.",
  hero: () => { const vals = [3, 5, 6, 8, 28]; const p = plot({ w: 640, h: 380, xr: [0, 5], yr: [0, 30], pad: [10, 20, 14, 10], ticks: false }); const bars = vals.map((v, i) => `<rect x="${p.X(i) + 18}" y="${p.Y(v)}" width="${80}" height="${p.Y(0) - p.Y(v)}" rx="6" fill="${i === 4 ? C.red : C.blue}" stroke="${C.ink}" stroke-width="2.4"/><text x="${p.X(i) + 58}" y="${p.Y(v) - 8}" font-size="22" font-weight="800" text-anchor="middle" style="font-family:M">${v}</text>`).join(""); const ln = (y, c, l) => `<line x1="${p.X(0)}" x2="${p.X(5)}" y1="${p.Y(y)}" y2="${p.Y(y)}" stroke="${c}" stroke-width="3" stroke-dasharray="9 6"/><text x="${p.X(0) + 6}" y="${p.Y(y) - 6}" font-size="19" font-weight="800" fill="${c}">${l}</text>`; return `<div style="display:flex;gap:26px"><svg width="640" height="380" viewBox="0 0 640 380">${bars}${ln(10, C.green, "mean 10")}${ln(6, C.amber, "median 6")}<line x1="10" x2="630" y1="${p.Y(0)}" y2="${p.Y(0)}" stroke="${C.ink}" stroke-width="3"/></svg><div style="flex:1;padding-top:10px"><div class="card"><div style="font-size:19px;font-weight:700;color:${C.green}">MEAN</div><div class="m" style="font-size:22px;margin-top:6px">(3+5+6+8+28) / 5 = 10</div></div><div class="card" style="margin-top:16px"><div style="font-size:19px;font-weight:700;color:#8a5f00">MEDIAN</div><div class="m" style="font-size:22px;margin-top:6px">middle of the sorted list = 6</div></div><p style="font-size:21px;color:${C.mute};margin-top:16px">Sort the list before you pick the median.</p></div></div>`; },
  figKicker: "Missing value", figTitle: "Total = mean × count",
  figAlt: "Steps for finding a missing value: five numbers have a mean of 12 so the total is 60; four known numbers sum to 48, so the fifth number is 12.",
  caption: "Turn the mean into a total, subtract what you know, and what is left is the missing value.",
  fig: () => stepCard(1, "Mean × count = total", "5 numbers with mean 12 → total 12 × 5 = 60", C.blue) + stepCard(2, "Add the known values", "10 + 14 + 9 + 15 = 48", C.green) + stepCard(3, "Subtract", "60 − 48 = 12, so the fifth number is 12", C.amber),
};

T["right-triangles-and-trigonometry"] = {
  kicker: "Right-triangle trig", title: "Label opposite, adjacent and hypotenuse first",
  alt: "Right triangle with sides 3, 4 and 5 and angle A opposite the side of length 3, giving sin A = 3/5, cos A = 4/5 and tan A = 3/4.",
  hero: () => `<div style="display:flex;gap:30px"><svg width="560" height="400" viewBox="0 0 560 400"><polygon points="60,350 460,350 460,110" fill="${C.blueSoft}" stroke="${C.ink}" stroke-width="3.5"/><rect x="430" y="320" width="30" height="30" fill="none" stroke="${C.ink}" stroke-width="3"/><path d="M130 350 A70 70 0 0 0 119 311" fill="none" stroke="${C.red}" stroke-width="4"/><text x="152" y="338" font-size="26" font-weight="800" fill="${C.red}">A</text><text x="262" y="386" font-size="24" font-weight="700" text-anchor="middle">adjacent = 4</text><text x="488" y="238" font-size="24" font-weight="700" transform="rotate(90 488 238)" text-anchor="middle">opposite = 3</text><text x="230" y="205" font-size="24" font-weight="700" transform="rotate(-31 230 205)" text-anchor="middle" fill="${C.green}">hypotenuse = 5</text></svg><div style="flex:1;padding-top:10px"><div class="card"><div class="m" style="font-size:26px;line-height:1.6">sin A = <b>opp/hyp</b> = 3/5<br>cos A = <b>adj/hyp</b> = 4/5<br>tan A = <b>opp/adj</b> = 3/4</div></div><p style="font-size:22px;color:${C.mute};margin-top:18px">SOH · CAH · TOA</p></div></div>`,
  figKicker: "Complementary angles", figTitle: "sin A = cos B in a right triangle",
  figAlt: "The same 3-4-5 triangle with angles A and B, showing that the sine of one acute angle equals the cosine of the other, both 3/5.",
  caption: "The two acute angles add to 90°, so the side opposite one is adjacent to the other.",
  fig: () => `<div style="display:flex;gap:30px"><svg width="440" height="330" viewBox="0 0 440 330"><polygon points="40,290 360,290 360,50" fill="${C.greenSoft}" stroke="${C.ink}" stroke-width="3.5"/><text x="100" y="278" font-size="26" font-weight="800" fill="${C.red}">A</text><text x="318" y="100" font-size="26" font-weight="800" fill="${C.blue}">B</text><text x="200" y="318" font-size="22" text-anchor="middle">4</text><text x="392" y="175" font-size="22">3</text><text x="170" y="160" font-size="22" transform="rotate(-37 170 160)">5</text></svg><div style="flex:1;padding-top:14px"><div class="card" style="background:${C.redSoft}"><div class="m" style="font-size:24px">sin A = 3/5</div></div><div class="card" style="margin-top:14px;background:${C.blueSoft}"><div class="m" style="font-size:24px">cos B = 3/5</div></div><p style="font-size:21px;margin-top:16px;line-height:1.4">A + B = 90°, so sin A = cos(90° − A).</p></div></div>`,
};

T["area-and-volume"] = {
  kicker: "Scaling", title: "Double the sides: area ×4, volume ×8",
  alt: "A square of side 3 and a square of side 6 showing the area grows from 9 to 36, a factor of 4, while a cube's volume grows from 27 to 216, a factor of 8.",
  hero: () => { const sq = (s, label, color) => `<div style="text-align:center"><div style="width:${s}px;height:${s}px;background:${color};border:3px solid ${C.ink};margin:0 auto;display:grid;place-items:center" class="m"><b style="font-size:26px">${label}</b></div></div>`; return `<div style="display:flex;gap:50px;align-items:flex-end;margin-top:10px"><div>${sq(70, "9", C.blueSoft)}<div style="font-size:21px;margin-top:10px;text-align:center">side 3 → area 9</div></div><div style="font-size:60px;padding-bottom:50px">→</div><div>${sq(140, "36", C.greenSoft)}<div style="font-size:21px;margin-top:10px;text-align:center">side 6 → area 36</div></div><div style="flex:1"><div class="card" style="background:${C.amberSoft}"><div style="font-size:19px;font-weight:700;color:#8a5f00">SCALE FACTOR k = 2</div><div class="m" style="font-size:24px;margin-top:8px;line-height:1.5">area × k² = ×4<br>volume × k³ = ×8</div></div></div></div><p style="font-size:22px;color:${C.mute};margin-top:26px">Cube: 3³ = 27 becomes 6³ = 216, which is 8 times larger.</p>`; },
  figKicker: "Reference-sheet formulas", figTitle: "Area and volume formulas to recognize",
  figAlt: "Grid of formulas: rectangle area, triangle area, circle area, rectangular prism volume, cylinder volume, and sphere volume.",
  caption: "Most of these are on the SAT reference sheet, so practice reading them, not memorizing them.",
  fig: () => { const c = (n, f, bg) => `<div style="background:${bg};border:2px solid ${C.ink};border-radius:14px;padding:14px 18px"><div style="font-size:19px;font-weight:700;color:${C.mute}">${n}</div><div class="m" style="font-size:25px;font-weight:700;margin-top:6px">${f}</div></div>`; return `<div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:14px">${c("Rectangle", "A = ℓw", C.blueSoft)}${c("Triangle", "A = ½bh", C.greenSoft)}${c("Circle", "A = πr²", C.amberSoft)}${c("Rectangular prism", "V = ℓwh", C.blueSoft)}${c("Cylinder", "V = πr²h", C.greenSoft)}${c("Sphere", "V = 4/3πr³", C.amberSoft)}</div>`; },
};

T["nonlinear-functions"] = {
  kicker: "Exponential functions", title: "Growth multiplies, decay shrinks",
  alt: "Graph of f(x) = 100(1.2)^x rising and g(x) = 100(0.8)^x falling, both starting at 100 when x is 0.",
  hero: () => { const p = plot({ w: 640, h: 390, xr: [0, 8], yr: [0, 450], xs: 1, ys: 100, pad: [46, 10, 30, 10], yl: "y" }); const inner = curve(p.path((x) => 100 * 1.2 ** x, 0, 8), C.green) + curve(p.path((x) => 100 * 0.8 ** x, 0, 8), C.red) + p.dot(0, 100, C.ink, 8) + p.label(7.9, 430, "100 · 1.2^x", { anchor: "end", fill: C.green, size: 21, dx: -4 }) + p.label(5, 60, "100 · 0.8^x", { fill: C.red, size: 21, dy: -18 }) + p.label(0, 100, "start 100", { dx: 14, dy: -10, size: 19 }); return `<div style="display:flex;gap:26px">${p.svg(inner)}<div style="flex:1;padding-top:10px"><div class="card" style="background:${C.greenSoft}"><div style="font-size:19px;font-weight:700;color:${C.green}">GROWTH</div><div class="m" style="font-size:22px;margin-top:6px">b = 1.2 &gt; 1<br>+20% per step</div></div><div class="card" style="margin-top:16px;background:${C.redSoft}"><div style="font-size:19px;font-weight:700;color:${C.red}">DECAY</div><div class="m" style="font-size:22px;margin-top:6px">b = 0.8 &lt; 1<br>−20% per step</div></div></div></div>`; },
  figKicker: "Reading the equation", figTitle: "f(x) = a · bˣ",
  figAlt: "The form f(x) = a times b to the x, with a as the starting value and b as the growth factor, noting that 20 percent growth means b is 1.20, not 0.20.",
  caption: "Convert the percent to a multiplier before writing the equation.",
  fig: () => `<div class="card" style="font-size:52px;text-align:center"><span class="m">f(x) = <b style="color:${C.blue}">a</b> · <b style="color:${C.green}">b</b><sup>x</sup></span></div><div style="display:flex;gap:22px;margin-top:26px"><div class="card" style="flex:1;background:${C.blueSoft}"><div class="m" style="font-weight:800;font-size:28px;color:${C.blue}">a</div><div style="font-size:21px;margin-top:6px">Starting value: f(0) = a.</div></div><div class="card" style="flex:1;background:${C.greenSoft}"><div class="m" style="font-weight:800;font-size:28px;color:${C.green}">b</div><div style="font-size:21px;margin-top:6px">Factor per step. Growth of 20% → <b>1.20</b>. Decay of 20% → <b>0.80</b>.</div></div></div>`,
};

T["rhetorical-synthesis"] = {
  kicker: "Rhetorical synthesis", title: "The stated goal decides which notes matter",
  alt: "Diagram of a rhetorical synthesis question: a bulleted list of student notes flows through a stated goal to the one answer choice that uses the right notes.",
  hero: () => `<div style="display:flex;align-items:center;gap:20px"><div class="card" style="flex:1.2;background:${C.blueSoft}"><div style="font-weight:800;font-size:22px;color:${C.blue}">STUDENT NOTES</div><ul style="font-size:21px;line-height:1.5;margin-top:8px;padding-left:22px"><li>The bridge opened in 1932.</li><li>It is 1,149 meters long.</li><li>It carries both trains and cars.</li></ul></div><div style="font-size:46px">→</div><div class="card" style="flex:.8;background:${C.amberSoft}"><div style="font-weight:800;font-size:22px;color:#8a5f00">GOAL</div><div style="font-size:21px;margin-top:8px;line-height:1.4">Emphasize the bridge's size.</div></div><div style="font-size:46px">→</div><div class="card" style="flex:1;background:${C.greenSoft}"><div style="font-weight:800;font-size:22px;color:${C.green}">ANSWER</div><div style="font-size:21px;margin-top:8px;line-height:1.4">Uses the length note, not the date.</div></div></div><p style="font-size:22px;color:${C.mute};margin-top:30px">Read the goal first. Then pick the choice that uses the notes the goal asks for.</p>`,
  figKicker: "Method", figTitle: "Three checks for every choice",
  figAlt: "Three-step method for rhetorical synthesis: find the goal, match the notes it needs, and reject choices that miss the goal or add facts not in the notes.",
  caption: "A correct choice meets the goal using only the notes provided.",
  fig: () => stepCard(1, "Find the goal", "Underline the sentence that says what the writer wants to do.", C.blue) + stepCard(2, "Match the notes", "Which notes support that goal directly?", C.green) + stepCard(3, "Reject the near-misses", "Wrong choices drift from the goal, skip a needed fact, or add something not in the notes.", C.red),
};

T["central-ideas-and-details"] = {
  kicker: "Central ideas", title: "The main idea covers the whole passage",
  alt: "Tree diagram with the main idea at the top supported by three detail boxes beneath it.",
  hero: () => `<div style="display:flex;flex-direction:column;align-items:center"><div class="card" style="background:${C.blueSoft};width:620px;text-align:center"><div style="font-weight:800;font-size:19px;color:${C.blue};letter-spacing:.08em">MAIN IDEA</div><div style="font-size:26px;font-weight:700;margin-top:6px;font-family:F">What the whole passage is saying</div></div><svg width="760" height="60" viewBox="0 0 760 60"><path d="M380 0 V28 M120 28 H640 M120 28 V60 M380 28 V60 M640 28 V60" stroke="${C.ink}" stroke-width="3" fill="none"/></svg><div style="display:flex;gap:22px">${["Detail 1", "Detail 2", "Detail 3"].map((d) => `<div class="card" style="width:240px;text-align:center"><div style="font-weight:800;font-size:22px">${d}</div><div style="font-size:18px;color:${C.mute};margin-top:4px">supports the main idea</div></div>`).join("")}</div></div><p style="font-size:22px;color:${C.mute};margin-top:24px;text-align:center">Details are examples and evidence. The main idea is what they add up to.</p>`,
  figKicker: "Choosing an answer", figTitle: "Not too narrow, not too broad",
  figAlt: "Three-part scale: a choice that only covers one detail is too narrow, one that covers the whole passage is just right, and one that claims more than the passage says is too broad.",
  caption: "Wrong choices usually fail by being too narrow or going beyond the text.",
  fig: () => { const b = (t, d, bg, c) => `<div style="flex:1;background:${bg};border:2px solid ${C.ink};border-radius:14px;padding:18px;min-height:230px"><div style="font-weight:800;font-size:25px;color:${c}">${t}</div><div style="font-size:20px;margin-top:10px;line-height:1.4">${d}</div></div>`; return `<div style="display:flex;gap:16px">${b("Too narrow", "Only describes one detail or one paragraph.", C.amberSoft, "#8a5f00")}${b("Just right", "Covers the whole passage and nothing extra.", C.greenSoft, C.green)}${b("Too broad", "Claims more than the passage supports.", C.redSoft, C.red)}</div>`; },
};
/* ---------- English / TOEFL topics ---------- */
const cell = (t, bg, extra = "") => `<div style="background:${bg};border:2px solid ${C.ink};border-radius:12px;padding:12px 16px;${extra}">${t}</div>`;

T["english-vocabulary"] = {
  kicker: "Vocabulary in context", title: "Use the clues around an unknown word",
  alt: "Sentence 'The scientist's explanation was lucid, so even beginners understood it' with the word lucid highlighted and the clue 'even beginners understood it' pointing to the meaning clear.",
  hero: () => `<div style="font-family:F;font-size:38px;font-weight:600;line-height:1.4;margin-top:6px">The scientist's explanation was <span style="background:${C.amberSoft};border-bottom:5px solid ${C.amber};padding:0 6px">lucid</span>, so <span style="background:${C.greenSoft};border-bottom:5px solid ${C.green};padding:0 6px">even beginners understood it</span>.</div><div style="display:flex;gap:22px;margin-top:34px"><div class="card" style="flex:1;background:${C.greenSoft}"><div style="font-weight:800;font-size:21px;color:${C.green}">THE CLUE</div><div style="font-size:21px;margin-top:6px">Beginners understood it, so it was easy to follow.</div></div><div class="card" style="flex:1;background:${C.amberSoft}"><div style="font-weight:800;font-size:21px;color:#8a5f00">THE MEANING</div><div class="m" style="font-size:26px;margin-top:6px"><b>lucid</b> = clear</div></div></div>`,
  figKicker: "Clue types", figTitle: "Three places to look for the meaning",
  figAlt: "Three cards for vocabulary clues: a definition clue that restates the word, a contrast clue that signals an opposite, and an example clue that gives a sample.",
  caption: "Check the words next to an unknown word before guessing.",
  fig: () => `<div style="display:flex;gap:16px">${[["Definition", "The sentence explains the word.", "Words like “that is” or “meaning”.", C.blueSoft, C.blue], ["Contrast", "The word is the opposite of a nearby idea.", "Words like “but”, “however”, “unlike”.", C.redSoft, C.red], ["Example", "Examples show what the word covers.", "Words like “such as” or “for instance”.", C.greenSoft, C.green]].map(([t, a, b, bg, c]) => `<div style="flex:1;background:${bg};border:2px solid ${C.ink};border-radius:14px;padding:18px;min-height:250px"><div style="font-weight:800;font-size:26px;color:${c}">${t}</div><div style="font-size:21px;margin-top:10px;line-height:1.35">${a}</div><div style="font-size:18px;margin-top:12px;color:${C.mute}">${b}</div></div>`).join("")}</div>`,
};

T["english-pronouns"] = {
  kicker: "Pronoun forms", title: "Pick the form the sentence needs",
  alt: "Table of English pronoun forms: subject, object, possessive and reflexive, for I, he, she, we and they.",
  hero: () => { const th = (t) => `<th style="text-align:left;padding:10px 16px;background:${C.ink};color:#fff;font-size:21px">${t}</th>`; const tr = (a) => `<tr>${a.map((x, i) => `<td style="padding:10px 16px;border:2px solid ${C.ink};background:${i ? "#fff" : C.blueSoft};font-size:23px;font-weight:${i ? 500 : 700}">${x}</td>`).join("")}</tr>`; return `<table style="border-collapse:collapse;width:100%;margin-top:4px"><tr>${["Subject", "Object", "Possessive", "Reflexive"].map(th).join("")}</tr>${[["I", "me", "my", "myself"], ["he", "him", "his", "himself"], ["she", "her", "her", "herself"], ["we", "us", "our", "ourselves"], ["they", "them", "their", "themselves"]].map(tr).join("")}</table>`; },
  figKicker: "A quick test", figTitle: "Drop the other person and listen",
  figAlt: "Example 'Maria and me went home' tested by removing Maria to get 'me went home', which is wrong, so the correct sentence is 'Maria and I went home'.",
  caption: "Remove the other person from the sentence and see which pronoun still sounds right.",
  fig: () => stepCard(1, "Take the sentence", "Maria and (I / me) went home.", C.blue) + stepCard(2, "Drop the other person", "(I / me) went home. “Me went home” is wrong.", C.red) + stepCard(3, "Put it back", "Maria and I went home.", C.green),
};

T["english-verb-tenses"] = {
  kicker: "Verb tenses", title: "The time clue decides the tense",
  alt: "Timeline comparing past simple 'She visited Rome in 2019' with present perfect 'She has visited Rome twice' and present simple 'She visits Rome every year'.",
  hero: () => `<div style="position:relative;height:30px;margin-top:30px"><div style="position:absolute;left:0;right:0;top:12px;height:6px;background:${C.ink};border-radius:3px"></div><div style="position:absolute;left:62%;top:0;width:6px;height:30px;background:${C.red};border-radius:3px"></div><div style="position:absolute;left:62%;top:36px;transform:translateX(-50%);font-weight:800;font-size:19px;color:${C.red}">NOW</div></div><div style="display:flex;flex-direction:column;gap:14px;margin-top:70px">${[["Past simple", "She visited Rome in 2019.", "finished time: in 2019", C.blueSoft], ["Present perfect", "She has visited Rome twice.", "no finished time given", C.greenSoft], ["Present simple", "She visits Rome every year.", "habit or fact", C.amberSoft]].map(([a, b, c, bg]) => `<div style="display:flex;align-items:center;gap:20px;background:${bg};border:2px solid ${C.ink};border-radius:14px;padding:12px 20px"><div style="width:230px;font-weight:800;font-size:23px">${a}</div><div style="font-size:24px;flex:1">${b}</div><div style="font-size:18px;color:${C.mute}">${c}</div></div>`).join("")}</div>`,
  figKicker: "Time words", figTitle: "Match the clue word to the tense",
  figAlt: "Four groups of time clue words: yesterday and ago for past simple, since and already for present perfect, every day and usually for present simple, and tomorrow and next week for future.",
  caption: "Look for the time word first, then choose the verb form.",
  fig: () => `<div style="display:grid;grid-template-columns:1fr 1fr;gap:16px">${[["Past simple", "yesterday · last year · two days ago · in 2019", C.blueSoft], ["Present perfect", "since · for · already · yet · ever", C.greenSoft], ["Present simple", "every day · usually · always · never", C.amberSoft], ["Future", "tomorrow · next week · soon · in a month", C.redSoft]].map(([t, w, bg]) => `<div style="background:${bg};border:2px solid ${C.ink};border-radius:14px;padding:18px 20px;min-height:150px"><div style="font-weight:800;font-size:25px">${t}</div><div class="m" style="font-size:20px;margin-top:12px;line-height:1.5">${w}</div></div>`).join("")}</div>`,
};

T["english-grammar"] = {
  kicker: "Grammar test rules", title: "Prepositions, quantifiers and verb patterns",
  alt: "Three cards: prepositions of time and place (at 5 o'clock, on Monday, in May), quantifiers (many books, much water) and verb patterns (enjoy swimming, want to swim).",
  hero: () => `<div style="display:flex;gap:18px">${[["Prepositions", "at 5 o'clock<br>on Monday<br>in May", "at = exact time · on = day · in = month, year", C.blueSoft], ["Quantifiers", "many books<br>much water<br>a few / a little", "many + countable · much + uncountable", C.greenSoft], ["Verb patterns", "enjoy swimming<br>want to swim<br>must swim", "some verbs take -ing, some take to", C.amberSoft]].map(([t, ex, n, bg]) => `<div style="flex:1;background:${bg};border:2px solid ${C.ink};border-radius:16px;padding:20px;min-height:330px"><div style="font-weight:800;font-size:27px">${t}</div><div class="m" style="font-size:24px;margin-top:18px;line-height:1.6">${ex}</div><div style="font-size:18px;color:${C.mute};margin-top:18px;line-height:1.35">${n}</div></div>`).join("")}</div>`,
  figKicker: "Common learner mistakes", figTitle: "Spot the error, then fix it",
  figAlt: "Three incorrect sentences with their corrections: 'I enjoy to swim' becomes 'I enjoy swimming', 'much people' becomes 'many people', and 'on May' becomes 'in May'.",
  caption: "Most grammar test errors come from a small set of patterns.",
  fig: () => { const r = (w, ok) => `<div style="display:flex;align-items:center;gap:18px;background:#fff;border:2px solid ${C.ink};border-radius:14px;padding:14px 22px;margin-bottom:14px"><div style="flex:1;font-size:26px;color:${C.red};text-decoration:line-through;text-decoration-thickness:3px">${w}</div><div style="font-size:30px">→</div><div style="flex:1;font-size:26px;font-weight:700;color:${C.green}">${ok}</div></div>`; return r("I enjoy to swim.", "I enjoy swimming.") + r("There are much people.", "There are many people.") + r("My birthday is on May.", "My birthday is in May."); },
};

T["cefr-level-test"] = {
  kicker: "CEFR levels", title: "Six levels in three bands",
  alt: "Ladder of the six CEFR levels grouped as basic user A1 and A2, independent user B1 and B2, and proficient user C1 and C2.",
  hero: () => { const band = (name, lv, bg, w) => `<div style="display:flex;align-items:center;gap:16px;margin-bottom:14px"><div style="width:${w}px;background:${bg};border:2px solid ${C.ink};border-radius:14px;padding:14px 20px;display:flex;justify-content:space-between;align-items:center"><div style="font-weight:800;font-size:25px">${name}</div><div class="m" style="font-weight:800;font-size:30px">${lv}</div></div></div>`; return band("Proficient user", "C2 · C1", C.redSoft, 900) + band("Independent user", "B2 · B1", C.greenSoft, 700) + band("Basic user", "A2 · A1", C.blueSoft, 500) + `<p style="font-size:21px;color:${C.mute};margin-top:14px">A1 is the lowest level and C2 the highest.</p>`; },
  figKicker: "Using a level test", figTitle: "Treat the result as a starting point",
  figAlt: "Three steps for using a CEFR practice test: answer without help, check the level where mistakes begin, and study that level next.",
  caption: "A short practice test gives a rough estimate, not an official result.",
  fig: () => stepCard(1, "Answer without help", "No dictionary or translator, so the result is honest.", C.blue) + stepCard(2, "Find where mistakes begin", "The level where you start missing questions is your working level.", C.green) + stepCard(3, "Study that level", "Review the explanations, then retest in a few weeks.", C.amber),
};

T["toefl-reading"] = {
  kicker: "Reading practice", title: "The answer is in the text",
  alt: "A short text with one sentence highlighted as the evidence for a question, with an arrow from the question to the highlighted sentence.",
  hero: () => `<div style="display:flex;gap:26px;align-items:stretch"><div class="card" style="flex:1.5;background:#fff"><div style="font-weight:800;font-size:19px;color:${C.blue};letter-spacing:.08em">TEXT</div><div style="font-size:22px;line-height:1.6;margin-top:10px">The library will close early on Friday. <span style="background:${C.greenSoft};border-bottom:4px solid ${C.green};padding:0 4px">Staff will finish a system upgrade at 3 p.m.</span> Normal hours return on Monday.</div></div><div style="display:flex;align-items:center;font-size:46px">←</div><div class="card" style="flex:1;background:${C.blueSoft}"><div style="font-weight:800;font-size:19px;color:${C.blue};letter-spacing:.08em">QUESTION</div><div style="font-size:22px;line-height:1.4;margin-top:10px">Why is the library closing early?</div></div></div><p style="font-size:22px;color:${C.mute};margin-top:26px">Find the sentence that answers the question, then pick the choice that says the same thing.</p>`,
  figKicker: "Answer method", figTitle: "Question first, then the text",
  figAlt: "Three-step reading method: read the question first, find the matching line in the text, and choose the answer that restates it.",
  caption: "A short routine for any reading question.",
  fig: () => stepCard(1, "Read the question first", "Know what you are looking for.", C.blue) + stepCard(2, "Find the matching line", "Look for the same idea, not only the same words.", C.green) + stepCard(3, "Pick the restatement", "The right choice says the same thing in different words.", C.amber),
};

T["toefl-writing"] = {
  kicker: "Writing practice", title: "Put the words in the right order",
  alt: "Scrambled word chips 'closes', 'the library', 'on Fridays', 'at nine' arranged into the sentence 'The library closes at nine on Fridays.'",
  hero: () => `<div style="display:flex;gap:14px;flex-wrap:wrap;margin-top:6px">${["closes", "on Fridays", "the library", "at nine"].map((w) => chip(w, C.amberSoft, C.ink, "font-size:26px;padding:10px 22px;border:2px solid " + C.ink)).join("")}</div><div style="font-size:50px;margin:18px 0 10px">↓</div><div style="display:flex;gap:14px;flex-wrap:wrap">${[["The library", C.blueSoft, "who"], ["closes", C.greenSoft, "what"], ["at nine", C.amberSoft, "time"], ["on Fridays", C.redSoft, "day"]].map(([w, bg, l]) => `<div style="background:${bg};border:2px solid ${C.ink};border-radius:14px;padding:10px 22px"><div style="font-size:26px;font-weight:700">${w}</div><div style="font-size:16px;color:${C.mute};margin-top:2px">${l}</div></div>`).join("")}</div><p style="font-size:22px;color:${C.mute};margin-top:24px">Start with the subject and verb, then add time and place.</p>`,
  figKicker: "Email and discussion replies", figTitle: "A simple structure for short answers",
  figAlt: "Two lists of building blocks: an email with greeting, reason for writing, request and thanks, and a discussion reply with opinion, reason and example.",
  caption: "Answer every part of the prompt in a clear order.",
  fig: () => { const col = (h, bg, items) => `<div style="flex:1"><div style="background:${bg};border:2px solid ${C.ink};border-radius:12px 12px 0 0;padding:12px 18px;font-weight:800;font-size:25px">${h}</div>${items.map((t, i) => `<div style="border:2px solid ${C.ink};border-top:0;background:#fff;padding:14px 18px;font-size:22px"><b>${i + 1}.</b> ${t}</div>`).join("")}</div>`; return `<div style="display:flex;gap:26px">${col("Email", C.blueSoft, ["Greeting", "Reason for writing", "Your request or answer", "Thanks and closing"])}${col("Discussion reply", C.greenSoft, ["Your opinion", "One clear reason", "A short example"])}</div>`; },
};

/* ---------- render ---------- */
const only = process.argv.slice(2);
const OUT = new URL("../public/images/guides/", import.meta.url);
mkdirSync(OUT, { recursive: true });
const browser = await chromium.launch({ executablePath: process.env.CHROME_PATH });
async function shot(html, w, h, file) {
  const pg = await browser.newPage({ viewport: { width: w, height: h } });
  await pg.setContent(html, { waitUntil: "load" });
  await pg.evaluate(() => document.fonts.ready);
  await pg.screenshot({ path: new URL(file, OUT).pathname.replace(/^\/([A-Za-z]:)/, "$1") });
  await pg.close();
}
const jobs = [...Object.entries(G).map(([k, g]) => [k, k, g]), ...Object.entries(T).map(([k, g]) => [k, `topic-${k}`, g])];
for (const [key, file, g] of jobs) {
  if (only.length && !only.includes(key)) continue;
  await shot(page({ w: 1200, h: 630, kicker: g.kicker, title: g.title, body: g.hero() }), 1200, 630, `${file}.png`);
  await shot(page({ w: 1000, h: 560, kicker: g.figKicker, title: g.figTitle, body: g.fig() }), 1000, 560, `${file}-figure.png`);
  console.log("rendered", key);
}
await browser.close();

const metaOf = (o) => Object.fromEntries(Object.entries(o).map(([k, g]) => [k, { alt: g.alt, figAlt: g.figAlt, caption: g.caption }]));
const jsonUrl = new URL("../src/lib/guide-images.json", import.meta.url);
let existing = {};
try { existing = JSON.parse(readFileSync(jsonUrl, "utf8")); } catch {}
// Keep entries the pipeline added for auto-generated articles; refresh the hand-made ones.
writeFileSync(jsonUrl, JSON.stringify({ ...existing, ...metaOf(G) }, null, 2) + "\n");
writeFileSync(new URL("../src/lib/topic-images.json", import.meta.url), JSON.stringify(metaOf(T), null, 2) + "\n");
console.log("Wrote src/lib/guide-images.json and src/lib/topic-images.json");