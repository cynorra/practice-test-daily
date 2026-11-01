// SAT-style math question generators. Every question is built from random
// integers chosen so the answer is exact, its wrong answers come from the
// mistakes students actually make, and each skill has an independent `check`
// that re-derives the answer a different way. tests/math.test.js runs every
// generator on hundreds of seeds and fails if any check disagrees, so no
// published question can have a wrong key.
//
// Item shape:
//   { id, skill, difficulty: 1|2|3, stem, choices: string[4] | null,
//     answer: index (multiple choice) | string (student-produced response),
//     explanation: string[] (steps), data?: any (for check) }

// ---- seeded randomness ---------------------------------------------------------
export function rng(seed) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
const int = (r, lo, hi) => lo + Math.floor(r() * (hi - lo + 1));
const pick = (r, arr) => arr[Math.floor(r() * arr.length)];
const nz = (r, lo, hi) => { let v = 0; while (v === 0) v = int(r, lo, hi); return v; };

// ---- formatting ---------------------------------------------------------------------
export const gcd = (a, b) => { a = Math.abs(a); b = Math.abs(b); while (b) [a, b] = [b, a % b]; return a || 1; };
export function frac(n, d) {
  if (d < 0) { n = -n; d = -d; }
  const g = gcd(n, d);
  n /= g; d /= g;
  return d === 1 ? String(n) : `${n}/${d}`;
}
const sup = (n) => String(n).replace(/[0-9-]/g, (c) => "⁰¹²³⁴⁵⁶⁷⁸⁹"["0123456789".indexOf(c)] ?? "⁻");
const signed = (n) => (n < 0 ? `− ${Math.abs(n)}` : `+ ${n}`);
/** "3x + 5", "−x − 2", "x", with proper minus signs. */
function lin(a, b, v = "x") {
  const lead = a === 1 ? v : a === -1 ? `−${v}` : `${a < 0 ? "−" : ""}${Math.abs(a)}${v}`;
  return b === 0 ? lead : `${lead} ${signed(b)}`;
}
const num = (n) => (n < 0 ? `−${Math.abs(n)}` : String(n));
/** A number inside an expression: negatives in parentheses, "(−15)". */
const pn = (n) => (n < 0 ? `(${num(n)})` : num(n));
/** "3x", "x", "−x" as a term. */
const cx = (a, v = "x") => (a === 1 ? v : a === -1 ? `−${v}` : `${num(a)}${v}`);
const money = (n) => `$${n.toFixed(2).replace(/\.00$/, "")}`;

/** Shuffle the right answer in among distinct distractors. */
function mc(r, correct, wrongs) {
  const seen = new Set([correct]);
  const ds = [];
  for (const w of wrongs) if (!seen.has(w)) { seen.add(w); ds.push(w); }
  let k = 1;
  while (ds.length < 3) { const extra = `${correct}${"′".repeat(k++)}`; if (!seen.has(extra)) ds.push(extra); }
  const choices = [correct, ...ds.slice(0, 3)];
  for (let i = choices.length - 1; i > 0; i--) { const j = Math.floor(r() * (i + 1)); [choices[i], choices[j]] = [choices[j], choices[i]]; }
  return { choices, answer: choices.indexOf(correct) };
}
/** Numeric distractors: nudge until all distinct and different from the answer. */
function numWrongs(correct, cands) {
  const out = [];
  const intOnly = Number.isInteger(correct);
  for (const c of cands) if (Number.isFinite(c) && (!intOnly || Number.isInteger(c)) && c !== correct && !out.includes(c)) out.push(c);
  let d = 1;
  while (out.length < 3) { for (const c of [correct + d, correct - d]) if (out.length < 3 && !out.includes(c) && c !== correct) out.push(c); d++; }
  return out.slice(0, 3);
}

// ---- generators ---------------------------------------------------------------------
export const SKILLS = {};
const def = (key, meta, gen, check) => (SKILLS[key] = { key, ...meta, gen, check });

// Algebra --------------------------------------------------------------------------
def("linear-equations-one-variable", { domain: "Algebra", name: "Linear equations in one variable" },
  (r) => {
    const x = int(r, -9, 12), a = nz(r, 2, 9), c = nz(r, -6, 6), b = int(r, -15, 15);
    if (a === c) return null;
    const d = (a - c) * x + b; // a x + b = c x + d
    const stem = `If ${lin(a, b)} = ${lin(c, d)}, what is the value of x?`;
    const { choices, answer } = mc(r, num(x), numWrongs(x, [(d + b) / (a - c), (d - b) / (a + c), -x, (d - b) / a]).map(num));
    return { difficulty: 1, stem, choices, answer, data: { a, b, c, d },
      explanation: [`Collect the x terms on one side: ${cx(a)} − ${c < 0 ? `(${cx(c)})` : cx(c)} = ${num(d)} − ${pn(b)}.`, `That gives ${cx(a - c)} = ${num(d - b)}.`, `Divide both sides by ${num(a - c)}: x = ${num(x)}.`, `Check: ${a}(${num(x)}) ${signed(b)} = ${num(a * x + b)} and ${c === 1 ? "" : num(c)}(${num(x)}) ${signed(d)} = ${num(c * x + d)}. Both sides match.`] };
  },
  (it) => { const { a, b, c, d } = it.data; const x = Number(it.choices[it.answer].replace("−", "-")); return a * x + b === c * x + d; });

def("linear-functions", { domain: "Algebra", name: "Linear functions" },
  (r) => {
    const m = nz(r, -6, 6), b = int(r, -12, 12), x1 = int(r, -5, 3), x2 = x1 + int(r, 1, 6), k = int(r, 4, 12);
    const y1 = m * x1 + b, y2 = m * x2 + b, ans = m * k + b;
    const stem = `A linear function f satisfies f(${num(x1)}) = ${num(y1)} and f(${num(x2)}) = ${num(y2)}. What is the value of f(${k})?`;
    const { choices, answer } = mc(r, num(ans), numWrongs(ans, [m * k, m * k - b, -m * k + b, (y2 - y1) * k + b]).map(num));
    return { difficulty: 2, stem, choices, answer, data: { x1, y1, x2, y2, k },
      explanation: [`Slope: m = (${num(y2)} − ${pn(y1)}) / (${num(x2)} − ${pn(x1)}) = ${num(y2 - y1)} / ${x2 - x1} = ${num(m)}.`, `Intercept: ${num(y1)} = ${num(m)}(${num(x1)}) + b, so b = ${num(b)}.`, `So f(x) = ${lin(m, b)}, and f(${k}) = ${num(m)}(${k}) ${signed(b)} = ${num(ans)}.`] };
  },
  (it) => { const { x1, y1, x2, y2, k } = it.data; const v = y1 + ((y2 - y1) / (x2 - x1)) * (k - x1); return Number(it.choices[it.answer].replace("−", "-")) === v; });

def("systems-of-linear-equations", { domain: "Algebra", name: "Systems of linear equations" },
  (r) => {
    const x = int(r, -6, 9), y = int(r, -6, 9), a = nz(r, 1, 5), b = nz(r, -5, 5), c = nz(r, 1, 5), d = nz(r, -5, 5);
    if (a * d - b * c === 0) return null;
    const e = a * x + b * y, f = c * x + d * y;
    const ask = pick(r, ["x", "x + y"]);
    const ans = ask === "x" ? x : x + y;
    const term = (co, v, first) => (first ? lin(co, 0, v) : `${co < 0 ? "−" : "+"} ${Math.abs(co) === 1 ? "" : Math.abs(co)}${v}`);
    const stem = `${term(a, "x", true)} ${term(b, "y")} = ${num(e)}\n${term(c, "x", true)} ${term(d, "y")} = ${num(f)}\nIf (x, y) is the solution to the system of equations above, what is the value of ${ask}?`;
    const { choices, answer } = mc(r, num(ans), numWrongs(ans, ask === "x" ? [y, -x, x + y] : [x - y, x, y]).map(num));
    return { difficulty: 2, stem, choices, answer, data: { a, b, c, d, e, f, ask },
      explanation: [`Eliminate one variable. Multiply the first equation by ${num(d)} and the second by ${num(b)}, then subtract: ${cx(a * d - b * c)} = ${num(e * d - f * b)}.`, `So x = ${num(x)}. Substitute into the first equation: ${a === 1 ? "" : a}(${num(x)}) ${b < 0 ? "−" : "+"} ${Math.abs(b) === 1 ? "" : Math.abs(b)}y = ${num(e)}, so y = ${num(y)}.`, ask === "x" ? `The question asks for x: ${num(x)}.` : `The question asks for x + y = ${num(x)} + ${pn(y)} = ${num(x + y)}.`] };
  },
  (it) => { const { a, b, c, d, e, f, ask } = it.data; const det = a * d - b * c; const x = (e * d - b * f) / det, y = (a * f - c * e) / det; const v = ask === "x" ? x : x + y; return Number(it.choices[it.answer].replace("−", "-")) === v; });

def("linear-inequalities", { domain: "Algebra", name: "Linear inequalities" },
  (r) => {
    const a = nz(r, -6, 6), k = int(r, -8, 8), b = int(r, -10, 10);
    const c = a * k + b; // a x + b > c  <=>  x > k (a>0) or x < k (a<0)
    const rel = pick(r, [">", "<"]);
    const flip = a < 0;
    const sol = (rel === ">") !== flip ? ">" : "<";
    const ok = sol === ">" ? k + int(r, 1, 4) : k - int(r, 1, 4);
    const bad = [k, sol === ">" ? k - 1 : k + 1, sol === ">" ? k - int(r, 2, 5) : k + int(r, 2, 5)];
    const stem = `Which of the following values of x satisfies the inequality ${lin(a, b)} ${rel} ${num(c)}?`;
    const { choices, answer } = mc(r, num(ok), numWrongs(ok, bad).map(num));
    return { difficulty: flip ? 2 : 1, stem, choices, answer, data: { a, b, c, rel },
      explanation: [`Subtract ${num(b)} from both sides: ${cx(a)} ${rel} ${num(c - b)}.`, `Divide by ${num(a)}${flip ? ", and because it's negative, flip the inequality sign" : ""}: x ${sol} ${num(k)}.`, `Only ${num(ok)} is ${sol === ">" ? "greater" : "less"} than ${num(k)}. (x = ${num(k)} itself makes the two sides equal, so it doesn't work.)`] };
  },
  (it) => { const { a, b, c, rel } = it.data; const ok = it.choices.map((s) => Number(s.replace("−", "-"))).map((x) => (rel === ">" ? a * x + b > c : a * x + b < c)); return ok.filter(Boolean).length === 1 && ok[it.answer]; });

// Advanced math ------------------------------------------------------------------------
def("quadratic-equations", { domain: "Advanced Math", name: "Quadratic equations" },
  (r) => {
    const p = int(r, -9, 9), q = int(r, -9, 9);
    if (p === q || p === -q) return null;
    const B = -(p + q), C = p * q;
    const ask = pick(r, ["sum", "positive"]);
    if (ask === "positive" && !((p > 0) !== (q > 0))) return null;
    const ans = ask === "sum" ? p + q : Math.max(p, q);
    const mid = B === 0 ? "" : ` ${B < 0 ? "−" : "+"} ${Math.abs(B) === 1 ? "" : Math.abs(B)}x`;
    const stem = `x²${mid} ${signed(C)} = 0\n${ask === "sum" ? "What is the sum of the solutions to the equation above?" : "What is the positive solution to the equation above?"}`;
    const wr = ask === "sum" ? [-(p + q), p * q, Math.abs(p - q)] : [-Math.max(p, q), Math.min(p, q), -Math.min(p, q)];
    const { choices, answer } = mc(r, num(ans), numWrongs(ans, wr).map(num));
    return { difficulty: 2, stem, choices, answer, data: { B, C, ask },
      explanation: [`Factor: find two numbers that multiply to ${num(C)} and add to ${num(B)}. They are ${num(-p)} and ${num(-q)}, so the equation is (x ${signed(-p)})(x ${signed(-q)}) = 0.`, `The solutions are x = ${num(p)} and x = ${num(q)}.`, ask === "sum" ? `Their sum is ${num(p + q)}. (Shortcut: for x² + bx + c = 0 the sum of the solutions is −b.)` : `The positive solution is ${num(Math.max(p, q))}.`] };
  },
  (it) => { const { B, C, ask } = it.data; const disc = B * B - 4 * C; const r1 = (-B + Math.sqrt(disc)) / 2, r2 = (-B - Math.sqrt(disc)) / 2; const v = ask === "sum" ? r1 + r2 : Math.max(r1, r2); return Math.abs(Number(it.choices[it.answer].replace("−", "-")) - v) < 1e-9; });

def("exponents-and-equivalent-expressions", { domain: "Advanced Math", name: "Equivalent expressions" },
  (r) => {
    const kind = pick(r, ["product", "power"]);
    if (kind === "product") {
      const a = int(r, 2, 9), b = int(r, 2, 9), c = int(r, 1, a + b - 1), e = a + b - c;
      const stem = `Which expression is equivalent to (x${sup(a)} · x${sup(b)}) / x${sup(c)}, where x > 0?`;
      const { choices, answer } = mc(r, `x${sup(e)}`, [`x${sup(a * b - c)}`, `x${sup(a + b + c)}`, `x${sup(Math.max(1, (a * b) / c | 0))}`]);
      return { difficulty: 1, stem, choices, answer, data: { kind, a, b, c },
        explanation: [`When you multiply powers of the same base, add the exponents: x${sup(a)} · x${sup(b)} = x${sup(a + b)}.`, `When you divide, subtract: x${sup(a + b)} / x${sup(c)} = x${sup(e)}.`] };
    }
    const k = int(r, 2, 5), a = int(r, 2, 6), n = int(r, 2, 3);
    const coef = k ** n, e = a * n;
    const stem = `Which expression is equivalent to (${k}x${sup(a)})${sup(n)}?`;
    const { choices, answer } = mc(r, `${coef}x${sup(e)}`, [`${k * n}x${sup(e)}`, `${coef}x${sup(a + n)}`, `${k}x${sup(e)}`]);
    return { difficulty: 2, stem, choices, answer, data: { kind, k, a, n },
      explanation: [`Raise each factor to the power ${n}: ${k}${sup(n)} = ${coef}.`, `For the variable, multiply the exponents: (x${sup(a)})${sup(n)} = x${sup(e)}.`, `So the expression equals ${coef}x${sup(e)}.`] };
  },
  (it) => {
    // Evaluate both sides at x = 2 and compare numerically.
    const d = it.data, X = 2;
    const want = d.kind === "product" ? (X ** d.a * X ** d.b) / X ** d.c : (d.k * X ** d.a) ** d.n;
    const parse = (s) => { const m = s.match(/^(\d*)x([⁰¹²³⁴⁵⁶⁷⁸⁹]+)$/); const exp = Number([...m[2]].map((c) => "⁰¹²³⁴⁵⁶⁷⁸⁹".indexOf(c)).join("")); return (m[1] ? Number(m[1]) : 1) * X ** exp; };
    return it.choices.filter((c) => parse(c) === want).length === 1 && parse(it.choices[it.answer]) === want;
  });

def("nonlinear-functions", { domain: "Advanced Math", name: "Nonlinear functions" },
  (r) => {
    const kind = pick(r, ["exp", "quad"]);
    if (kind === "exp") {
      const a = int(r, 2, 9), b = int(r, 2, 4), t = int(r, 2, 4), ans = a * b ** t;
      const { choices, answer } = mc(r, String(ans), numWrongs(ans, [(a * b) ** t, a * b * t, a + b ** t]).map(String));
      return { difficulty: 1, stem: `The function f is defined by f(x) = ${a}·${b}^x. What is the value of f(${t})?`, choices, answer, data: { kind, a, b, t },
        explanation: [`Substitute x = ${t}: f(${t}) = ${a} · ${b}^${t}.`, `${b}^${t} = ${b ** t}, so f(${t}) = ${a} · ${b ** t} = ${ans}.`, `A common mistake is multiplying first: (${a}·${b})^${t} = ${(a * b) ** t}. Exponents are applied before multiplication.`] };
    }
    const h = int(r, -5, 5), k = int(r, -9, 9), t = int(r, -4, 6), ans = (t - h) ** 2 + k;
    const stem = `The function g is defined by g(x) = (x ${signed(-h)})² ${signed(k)}. What is the value of g(${num(t)})?`;
    const { choices, answer } = mc(r, num(ans), numWrongs(ans, [(t + h) ** 2 + k, (t - h) ** 2 - k, t * t - h * h + k]).map(num));
    return { difficulty: 2, stem, choices, answer, data: { kind, h, k, t },
      explanation: [`Substitute x = ${num(t)}: g(${num(t)}) = (${num(t)} ${signed(-h)})² ${signed(k)}.`, `Inside the parentheses: ${num(t - h)}. Squared: ${(t - h) ** 2}.`, `Then ${(t - h) ** 2} ${signed(k)} = ${num(ans)}.`] };
  },
  (it) => { const d = it.data; const v = d.kind === "exp" ? d.a * Math.pow(d.b, d.t) : Math.pow(d.t - d.h, 2) + d.k; return Number(it.choices[it.answer].replace("−", "-")) === v; });

// Problem-solving and data analysis ---------------------------------------------------
def("percentages", { domain: "Problem-Solving and Data Analysis", name: "Percentages" },
  (r) => {
    const kind = pick(r, ["change", "of", "updown"]);
    if (kind === "of") {
      const p = pick(r, [5, 10, 12, 15, 20, 25, 30, 35, 40, 45, 60, 75]), base = int(r, 2, 40) * 20, ans = (p * base) / 100;
      const { choices, answer } = mc(r, String(ans), numWrongs(ans, [base - ans, ans * 10, base / p]).map((v) => String(Math.round(v * 100) / 100)));
      return { difficulty: 1, stem: `What is ${p}% of ${base}?`, choices, answer, data: { kind, p, base },
        explanation: [`${p}% means ${p}/100.`, `${p}/100 × ${base} = ${ans}.`] };
    }
    if (kind === "change") {
      const old = int(r, 4, 40) * 5, pct = pick(r, [10, 20, 25, 40, 50, 60, 75]) * pick(r, [1, -1]), neu = old + (old * pct) / 100;
      if (!Number.isInteger(neu)) return null;
      const stem = `The price of an item changed from ${money(old)} to ${money(neu)}. By what percent did the price ${pct > 0 ? "increase" : "decrease"}?`;
      const ans = `${Math.abs(pct)}%`;
      const wrongPct = Math.round((Math.abs(neu - old) / neu) * 1000) / 10;
      const { choices, answer } = mc(r, ans, [`${wrongPct}%`, `${Math.abs(neu - old)}%`, `${Math.abs(pct) * 2}%`]);
      return { difficulty: 2, stem, choices, answer, data: { kind, old, neu },
        explanation: [`Percent change = (new − old) / old × 100.`, `(${money(neu)} − ${money(old)}) / ${money(old)} × 100 = ${num(neu - old)} / ${old} × 100 = ${num(pct)}%.`, `Divide by the original price, not the new one: dividing by ${money(neu)} gives ${wrongPct}%, a common trap.`] };
    }
    const up = pick(r, [10, 20, 25, 50]), down = pick(r, [10, 20, 25, 50]), base = 100;
    const final = base * (1 + up / 100) * (1 - down / 100), net = Math.round((final - base) * 100) / 100;
    const ans = net === 0 ? "No change" : `${net > 0 ? "Increase" : "Decrease"} of ${Math.abs(net)}%`;
    const naive = up - down;
    const { choices, answer } = mc(r, ans, [naive === 0 ? "No change" : `${naive > 0 ? "Increase" : "Decrease"} of ${Math.abs(naive)}%`, `Increase of ${up + down}%`, `Decrease of ${Math.abs(net) + 5}%`]);
    return { difficulty: 3, stem: `A store raises the price of a jacket by ${up}%. Later, it lowers the new price by ${down}%. Compared with the original price, what is the overall change?`, choices, answer, data: { kind, up, down },
      explanation: [`Use a starting price of $100. After a ${up}% increase: $${100 + up}.`, `A ${down}% decrease applies to $${100 + up}: $${100 + up} × ${(1 - down / 100).toFixed(2)} = $${final.toFixed(2).replace(/\.00$/, "")}.`, `Compared with $100, that's ${net === 0 ? "no change" : `a ${ans.toLowerCase()}`}. Percent changes don't simply add: ${up}% − ${down}% = ${num(naive)}% is the trap.`] };
  },
  (it) => {
    const d = it.data, c = it.choices[it.answer];
    if (d.kind === "of") return Number(c) === (d.p * d.base) / 100;
    if (d.kind === "change") return c === `${Math.abs(Math.round(((d.neu - d.old) / d.old) * 100))}%`;
    const net = Math.round((100 * (1 + d.up / 100) * (1 - d.down / 100) - 100) * 100) / 100;
    return c === (net === 0 ? "No change" : `${net > 0 ? "Increase" : "Decrease"} of ${Math.abs(net)}%`);
  });

def("ratios-rates-and-units", { domain: "Problem-Solving and Data Analysis", name: "Ratios, rates and units" },
  (r) => {
    const kind = pick(r, ["rate", "ratio", "units"]);
    if (kind === "rate") {
      const speed = int(r, 3, 12) * 5, hours = int(r, 2, 6), minutes = pick(r, [0, 15, 30, 45]);
      const dist = speed * (hours + minutes / 60);
      if (!Number.isInteger(dist)) return null;
      const t = minutes ? `${hours} hours and ${minutes} minutes` : `${hours} hours`;
      const { choices, answer } = mc(r, String(dist), numWrongs(dist, [speed * hours + minutes, speed * hours, speed * (hours + minutes / 100)]).map((v) => String(Math.round(v * 10) / 10)));
      return { difficulty: 1, stem: `A train travels at a constant speed of ${speed} miles per hour. How many miles does it travel in ${t}?`, choices, answer, data: { kind, speed, hours, minutes },
        explanation: [`Convert the time to hours: ${t} = ${hours + minutes / 60} hours.`, `Distance = rate × time = ${speed} × ${hours + minutes / 60} = ${dist} miles.`] };
    }
    if (kind === "ratio") {
      const a = int(r, 1, 7), b = int(r, 1, 7), k = int(r, 3, 12);
      if (gcd(a, b) !== 1 || a === b) return null;
      const total = (a + b) * k, ans = a * k;
      const { choices, answer } = mc(r, String(ans), numWrongs(ans, [b * k, total / a, total - b]).map((v) => String(Math.round(v * 100) / 100)));
      return { difficulty: 2, stem: `The ratio of red marbles to blue marbles in a bag is ${a} to ${b}. If the bag holds ${total} marbles in total, how many are red?`, choices, answer, data: { kind, a, b, total },
        explanation: [`The ratio ${a}:${b} splits the bag into ${a + b} equal parts.`, `Each part is ${total} / ${a + b} = ${k} marbles.`, `Red marbles: ${a} × ${k} = ${ans}.`] };
    }
    const ft = int(r, 2, 9) * 3, sq = pick(r, [true, false]);
    if (sq) {
      const yd = ft / 3, ans = yd * yd;
      const { choices, answer } = mc(r, String(ans), numWrongs(ans, [ft * ft, ft * ft / 3, yd * 3]).map(String));
      return { difficulty: 3, stem: `A square rug measures ${ft} feet on each side. What is its area in square yards? (1 yard = 3 feet)`, choices, answer, data: { kind, ft, sq },
        explanation: [`Convert the side first: ${ft} feet = ${yd} yards.`, `Area = ${yd} × ${yd} = ${ans} square yards.`, `Dividing ${ft * ft} square feet by 3 is the trap: 1 square yard is 9 square feet, not 3.`] };
    }
    const inches = ft * 12;
    const { choices, answer } = mc(r, String(inches), numWrongs(inches, [ft * 3, ft * 10, ft / 12]).map((v) => String(Math.round(v * 100) / 100)));
    return { difficulty: 1, stem: `How many inches are in ${ft} feet? (1 foot = 12 inches)`, choices, answer, data: { kind, ft, sq },
      explanation: [`Multiply by 12: ${ft} × 12 = ${inches} inches.`] };
  },
  (it) => {
    const d = it.data, v = Number(it.choices[it.answer]);
    if (d.kind === "rate") return v === d.speed * (d.hours + d.minutes / 60);
    if (d.kind === "ratio") return v === (d.total * d.a) / (d.a + d.b);
    return d.sq ? v === (d.ft * d.ft) / 9 : v === d.ft * 12;
  });

def("one-variable-data", { domain: "Problem-Solving and Data Analysis", name: "One-variable data: mean and median" },
  (r) => {
    const n = int(r, 5, 7), kind = pick(r, ["mean", "missing", "median"]);
    const vals = Array.from({ length: n }, () => int(r, 2, 30));
    const sum = vals.reduce((s, v) => s + v, 0);
    if (kind === "mean") {
      if (sum % n) return null;
      const ans = sum / n;
      const sorted = [...vals].sort((a, b) => a - b);
      const { choices, answer } = mc(r, String(ans), numWrongs(ans, [sorted[(n - 1) >> 1], sum, Math.max(...vals) - Math.min(...vals)]).map(num));
      return { difficulty: 1, stem: `What is the mean of the data set ${vals.join(", ")}?`, choices, answer, data: { kind, vals },
        explanation: [`Add the values: ${vals.join(" + ")} = ${sum}.`, `Divide by the number of values, ${n}: ${sum} / ${n} = ${ans}.`] };
    }
    if (kind === "missing") {
      const m = int(r, 8, 20), target = m * (n + 1), x = target - sum;
      if (x < 1 || x > 60) return null;
      const { choices, answer } = mc(r, String(x), numWrongs(x, [m * n - sum, m, target]).map(num));
      return { difficulty: 2, stem: `The mean of ${n + 1} numbers is ${m}. ${n} of the numbers are ${vals.join(", ")}. What is the remaining number?`, choices, answer, data: { kind, vals, m },
        explanation: [`If the mean of ${n + 1} numbers is ${m}, their total is ${n + 1} × ${m} = ${target}.`, `The ${n} known numbers add to ${sum}.`, `The remaining number is ${target} − ${sum} = ${x}.`] };
    }
    const sorted = [...vals].sort((a, b) => a - b);
    const med = n % 2 ? sorted[(n - 1) / 2] : (sorted[n / 2 - 1] + sorted[n / 2]) / 2;
    const { choices, answer } = mc(r, String(med), numWrongs(med, [vals[(n - 1) >> 1], Math.round((sum / n) * 10) / 10, sorted[n >> 1] + 1]).map(num));
    return { difficulty: 2, stem: `What is the median of the data set ${vals.join(", ")}?`, choices, answer, data: { kind, vals },
      explanation: [`Put the values in order: ${sorted.join(", ")}.`, n % 2 ? `With ${n} values, the median is the middle one, the ${(n + 1) / 2}th: ${med}.` : `With ${n} values, the median is the mean of the two middle values: (${sorted[n / 2 - 1]} + ${sorted[n / 2]}) / 2 = ${med}.`, `Taking the middle value of the unsorted list is the most common mistake.`] };
  },
  (it) => {
    const d = it.data, v = Number(it.choices[it.answer]), n = d.vals.length, sum = d.vals.reduce((s, x) => s + x, 0);
    if (d.kind === "mean") return v * n === sum;
    if (d.kind === "missing") return (sum + v) / (n + 1) === d.m;
    const s = [...d.vals].sort((a, b) => a - b);
    return v === (n % 2 ? s[(n - 1) / 2] : (s[n / 2 - 1] + s[n / 2]) / 2);
  });

def("probability", { domain: "Problem-Solving and Data Analysis", name: "Probability and conditional probability" },
  (r) => {
    // Two-way table: rows = grade (9th, 10th), columns = prefers (Art, Music)
    const a = int(r, 8, 40), b = int(r, 8, 40), c = int(r, 8, 40), d = int(r, 8, 40);
    const kind = pick(r, ["given-row", "given-col", "simple"]);
    const table = `<table><thead><tr><th></th><th>Art</th><th>Music</th><th>Total</th></tr></thead><tbody><tr><td>9th grade</td><td>${a}</td><td>${b}</td><td>${a + b}</td></tr><tr><td>10th grade</td><td>${c}</td><td>${d}</td><td>${c + d}</td></tr><tr><td>Total</td><td>${a + c}</td><td>${b + d}</td><td>${a + b + c + d}</td></tr></tbody></table>`;
    let q, num_, den, wr;
    if (kind === "given-row") { q = "If a 10th grader in the survey is chosen at random, what is the probability that the student prefers music?"; num_ = d; den = c + d; wr = [frac(d, a + b + c + d), frac(d, b + d), frac(c, c + d)]; }
    else if (kind === "given-col") { q = "If a student who prefers art is chosen at random, what is the probability that the student is in 9th grade?"; num_ = a; den = a + c; wr = [frac(a, a + b), frac(a, a + b + c + d), frac(c, a + c)]; }
    else { q = "If a student in the survey is chosen at random, what is the probability that the student is a 9th grader who prefers music?"; num_ = b; den = a + b + c + d; wr = [frac(b, a + b), frac(b, b + d), frac(a + b, a + b + c + d)]; }
    const ans = frac(num_, den);
    const { choices, answer } = mc(r, ans, wr);
    return { difficulty: kind === "simple" ? 1 : 2, stem: `A survey asked students in two grades whether they prefer art or music. The results are shown in the table.\n${table}\n${q}`, choices, answer, data: { num: num_, den },
      explanation: [kind === "simple" ? `The whole survey is the group: ${den} students.` : `"Given" narrows the group: only the ${den} students in that ${kind === "given-row" ? "row" : "column"} count.`, `Of those, ${num_} match.`, `Probability = ${num_}/${den}${frac(num_, den) !== `${num_}/${den}` ? ` = ${frac(num_, den)}` : ""}.`] };
  },
  (it) => { const [n, d] = it.choices[it.answer].split("/").map(Number); return (d ? n / d : n) === it.data.num / it.data.den && it.choices.filter((c) => { const [x, y] = c.split("/").map(Number); return (y ? x / y : x) === it.data.num / it.data.den; }).length === 1; });

// Geometry and trigonometry ------------------------------------------------------------
const TRIPLES = [[3, 4, 5], [5, 12, 13], [8, 15, 17], [7, 24, 25], [20, 21, 29]];
def("right-triangles-and-trigonometry", { domain: "Geometry and Trigonometry", name: "Right triangles and trigonometry" },
  (r) => {
    const [p, q, h] = pick(r, TRIPLES), k = int(r, 1, 4), kind = pick(r, ["hyp", "leg", "sin", "cos", "tan"]);
    const A = p * k, B = q * k, C = h * k;
    if (kind === "hyp" || kind === "leg") {
      const ans = kind === "hyp" ? C : B;
      const stem = kind === "hyp" ? `A right triangle has legs of length ${A} and ${B}. What is the length of the hypotenuse?` : `A right triangle has a hypotenuse of length ${C} and one leg of length ${A}. What is the length of the other leg?`;
      const { choices, answer } = mc(r, String(ans), numWrongs(ans, kind === "hyp" ? [A + B, Math.abs(B - A), A * B / 2] : [C - A, C + A, A]).map(String));
      return { difficulty: 1, stem, choices, answer, data: { kind, A, B, C },
        explanation: kind === "hyp" ? [`Use the Pythagorean theorem: c² = ${A}² + ${B}² = ${A * A} + ${B * B} = ${C * C}.`, `c = √${C * C} = ${C}.`] : [`Use the Pythagorean theorem: b² = ${C}² − ${A}² = ${C * C} − ${A * A} = ${B * B}.`, `b = √${B * B} = ${B}.`] };
    }
    const ratio = { sin: frac(A, C), cos: frac(B, C), tan: frac(A, B) }[kind];
    const others = [frac(B, C), frac(A, C), frac(A, B), frac(B, A), frac(C, A)].filter((x) => x !== ratio);
    const stem = `In right triangle ABC, angle C is the right angle, BC = ${A}, AC = ${B} and AB = ${C}. What is the value of ${kind}(A)?`;
    const { choices, answer } = mc(r, ratio, others);
    const name = { sin: "opposite/hypotenuse", cos: "adjacent/hypotenuse", tan: "opposite/adjacent" }[kind];
    return { difficulty: 2, stem, choices, answer, data: { kind, A, B, C },
      explanation: [`For angle A, the opposite side is BC = ${A}, the adjacent side is AC = ${B} and the hypotenuse is AB = ${C}.`, `${kind}(A) = ${name} = ${kind === "sin" ? `${A}/${C}` : kind === "cos" ? `${B}/${C}` : `${A}/${B}`}${ratio.includes("/") && ratio !== (kind === "sin" ? `${A}/${C}` : kind === "cos" ? `${B}/${C}` : `${A}/${B}`) ? ` = ${ratio}` : ""}.`] };
  },
  (it) => {
    const d = it.data, c = it.choices[it.answer];
    if (d.A * d.A + d.B * d.B !== d.C * d.C) return false;
    if (d.kind === "hyp") return Number(c) === d.C;
    if (d.kind === "leg") return Number(c) === d.B;
    const [n, m] = c.split("/").map(Number), v = m ? n / m : n;
    const want = { sin: d.A / d.C, cos: d.B / d.C, tan: d.A / d.B }[d.kind];
    return Math.abs(v - want) < 1e-12;
  });

def("circles", { domain: "Geometry and Trigonometry", name: "Circles" },
  (r) => {
    const kind = pick(r, ["area-from-circ", "arc", "equation"]);
    if (kind === "area-from-circ") {
      const rad = int(r, 2, 12), ans = `${rad * rad}π`;
      const { choices, answer } = mc(r, ans, [`${2 * rad}π`, `${rad * rad * 4}π`, `${rad}π`]);
      return { difficulty: 2, stem: `A circle has a circumference of ${2 * rad}π. What is the area of the circle?`, choices, answer, data: { kind, rad },
        explanation: [`Circumference = 2πr, so 2πr = ${2 * rad}π and r = ${rad}.`, `Area = πr² = π(${rad})² = ${rad * rad}π.`] };
    }
    if (kind === "arc") {
      const rad = int(r, 2, 12), deg = pick(r, [30, 45, 60, 90, 120, 150, 180, 240, 270]);
      const arc = frac(2 * rad * deg, 360), ans = `${arc === "1" ? "" : arc}π`;
      const { choices, answer } = mc(r, ans, [`${frac(rad * deg, 360)}π`, `${frac(rad * rad * deg, 360)}π`, `${deg}π`].map((s) => s.replace(/^1π$/, "π")));
      return { difficulty: 3, stem: `A circle has a radius of ${rad}. What is the length of an arc formed by a central angle of ${deg}°?`, choices, answer, data: { kind, rad, deg },
        explanation: [`The full circumference is 2π(${rad}) = ${2 * rad}π.`, `A ${deg}° angle takes ${deg}/360 of the circle.`, `Arc length = ${deg}/360 × ${2 * rad}π = ${ans}.`] };
    }
    const h = int(r, -9, 9), k = int(r, -9, 9), rad = int(r, 2, 9);
    const sq = (v, s) => (v === 0 ? `${s}²` : `(${s} ${signed(-v)})²`);
    const ans = `(${num(h)}, ${num(k)}) and ${rad}`;
    const { choices, answer } = mc(r, ans, [`(${num(-h)}, ${num(-k)}) and ${rad}`, `(${num(h)}, ${num(k)}) and ${rad * rad}`, `(${num(-h)}, ${num(-k)}) and ${rad * rad}`]);
    return { difficulty: 2, stem: `The equation of a circle in the xy-plane is ${sq(h, "x")} + ${sq(k, "y")} = ${rad * rad}. What are the center and radius of the circle?`, choices, answer, data: { kind, h, k, rad },
      explanation: [`The standard form is (x − h)² + (y − k)² = r², with center (h, k) and radius r.`, `Here h = ${num(h)} and k = ${num(k)} (watch the signs: x ${signed(-h)} means h = ${num(h)}).`, `r² = ${rad * rad}, so r = ${rad}.`] };
  },
  (it) => {
    const d = it.data, c = it.choices[it.answer];
    if (d.kind === "area-from-circ") return c === `${d.rad * d.rad}π`;
    if (d.kind === "arc") { const v = (2 * Math.PI * d.rad * d.deg) / 360; const m = c.replace("π", ""); const [n, q] = (m || "1").split("/").map(Number); return Math.abs((q ? n / q : n) * Math.PI - v) < 1e-9; }
    return c === `(${num(d.h)}, ${num(d.k)}) and ${d.rad}`;
  });

def("area-and-volume", { domain: "Geometry and Trigonometry", name: "Area and volume" },
  (r) => {
    const kind = pick(r, ["prism", "cylinder", "scale"]);
    if (kind === "prism") {
      const l = int(r, 2, 12), w = int(r, 2, 12), h = int(r, 2, 12), ans = l * w * h;
      const { choices, answer } = mc(r, String(ans), numWrongs(ans, [2 * (l * w + w * h + l * h), l + w + h, l * w]).map(String));
      return { difficulty: 1, stem: `A rectangular box is ${l} inches long, ${w} inches wide and ${h} inches tall. What is its volume, in cubic inches?`, choices, answer, data: { kind, l, w, h },
        explanation: [`Volume = length × width × height = ${l} × ${w} × ${h} = ${ans} cubic inches.`] };
    }
    if (kind === "cylinder") {
      const rad = int(r, 2, 9), h = int(r, 2, 12), ans = `${rad * rad * h}π`;
      const { choices, answer } = mc(r, ans, [`${2 * rad * h}π`, `${rad * h}π`, `${4 * rad * rad * h}π`]);
      return { difficulty: 2, stem: `A right circular cylinder has a radius of ${rad} and a height of ${h}. What is its volume?`, choices, answer, data: { kind, rad, h },
        explanation: [`Volume of a cylinder = πr²h.`, `π(${rad})²(${h}) = π × ${rad * rad} × ${h} = ${rad * rad * h}π.`, `Using the diameter (${2 * rad}) instead of the radius gives ${4 * rad * rad * h}π, a common slip.`] };
    }
    const s = int(r, 2, 4), area = int(r, 3, 20);
    const ans = area * s * s;
    const { choices, answer } = mc(r, String(ans), numWrongs(ans, [area * s, area * s * s * s, area + s]).map(String));
    return { difficulty: 3, stem: `A triangle has an area of ${area} square centimeters. Each side of the triangle is multiplied by ${s} to make a larger, similar triangle. What is the area of the larger triangle, in square centimeters?`, choices, answer, data: { kind, area, s },
      explanation: [`When lengths are scaled by ${s}, areas are scaled by ${s}² = ${s * s}.`, `${area} × ${s * s} = ${ans} square centimeters.`, `Multiplying the area by ${s} (giving ${area * s}) is the trap.`] };
  },
  (it) => {
    const d = it.data, c = it.choices[it.answer];
    if (d.kind === "prism") return Number(c) === d.l * d.w * d.h;
    if (d.kind === "cylinder") return c === `${d.rad * d.rad * d.h}π`;
    return Number(c) === d.area * d.s * d.s;
  });

// ---- public API ---------------------------------------------------------------------------
export const SKILL_KEYS = Object.keys(SKILLS);

/** One question for a skill from a seed. Retries internal rejections deterministically. */
export function makeQuestion(skill, seed) {
  const S = SKILLS[skill];
  if (!S) throw new Error(`Unknown math skill ${skill}`);
  for (let attempt = 0; attempt < 200; attempt++) {
    const r = rng(seed * 7919 + attempt);
    const q = S.gen(r);
    if (q && q.choices.length === 4 && new Set(q.choices).size === 4 && !q.choices.some((c) => c.includes("′"))) {
      return { id: `${skill}-${seed}`, skill, domain: S.domain, ...q };
    }
  }
  throw new Error(`No valid question for ${skill} seed ${seed}`);
}

/** A set of n questions for a skill, starting at a seed. */
export const makeSet = (skill, start = 1, n = 10) => Array.from({ length: n }, (_, i) => makeQuestion(skill, start + i));

export const checkQuestion = (q) => SKILLS[q.skill].check(q);
