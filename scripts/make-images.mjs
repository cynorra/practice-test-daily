// Renders public/og.png (1200x630), public/logo-512.png and public/apple-touch-icon.png
// from HTML using the site's own fonts. Run after changing the brand name:
//   CHROME_PATH=/path/to/chrome node scripts/make-images.mjs
import { chromium } from "playwright-core";
import { readFileSync } from "node:fs";
import { SITE } from "../src/site.config.js";

const font = (p) => `data:font/woff2;base64,${readFileSync(new URL(`../node_modules/${p}`, import.meta.url)).toString("base64")}`;
const archivo = font("@fontsource-variable/fraunces/files/fraunces-latin-full-normal.woff2");
const geist = font("@fontsource-variable/geist/files/geist-latin-wght-normal.woff2");
const mono = font("@fontsource-variable/geist-mono/files/geist-mono-latin-wght-normal.woff2");

const css = `
@font-face{font-family:A;src:url(${archivo})}@font-face{font-family:G;src:url(${geist})}@font-face{font-family:M;src:url(${mono})}
*{margin:0;box-sizing:border-box}body{width:1200px;height:630px;background:#fbf8f1;color:#1f2a44;font-family:G;position:relative;overflow:hidden}
.ruled{position:absolute;inset:0;background:linear-gradient(90deg,transparent 0 90px,#d9534f40 90px 92px,transparent 92px),repeating-linear-gradient(0deg,#3b6fd618 0 2px,transparent 2px 44px)}
.wrap{position:absolute;inset:0;padding:70px 80px 70px 130px;display:flex;flex-direction:column}
.brand{display:flex;align-items:center;gap:14px;font-family:A;font-weight:800;font-size:34px}
h1{font-family:A;font-weight:800;font-size:76px;line-height:1.04;margin-top:46px;max-width:900px}
.row{margin-top:auto;display:flex;gap:14px;align-items:center;font-size:26px;color:#4a5570}
.b{width:44px;height:44px;border-radius:50%;border:3px solid #1f2a44;display:grid;place-items:center;font-weight:700}.b.on{background:#2e9a5a;border-color:#2e9a5a;color:#fff}`;
const mark = (s) => `<svg width="${s}" height="${s}" viewBox="0 0 32 32"><path d="M4 26 L12 18 L18 22 L27 9" fill="none" stroke="#3b6fd6" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"/><circle cx="27" cy="9" r="4.2" fill="#3b6fd6"/><circle cx="12" cy="18" r="2.6" fill="#fbf8f1" stroke="#1f2a44" stroke-width="1.6"/><circle cx="4" cy="26" r="2.6" fill="#fbf8f1" stroke="#1f2a44" stroke-width="1.6"/></svg>`;
const og = `<style>${css}</style><div class="ruled"></div><div class="wrap"><div class="brand">${mark(46)}${SITE.name}</div>
<h1>Free SAT practice tests. A new set every day.</h1>
<div class="row"><span class="b">A</span><span class="b on">B</span><span class="b">C</span><span class="b">D</span><span style="margin-left:14px">Math · Reading & Writing · unlimited sets</span></div></div>`;
const icon = (size) => `<style>*{margin:0}body{width:${size}px;height:${size}px;background:#1f2a44;display:grid;place-items:center}</style><svg width="${size * 0.7}" height="${size * 0.7}" viewBox="0 0 32 32"><path d="M4 26 L12 18 L18 22 L27 9" fill="none" stroke="#5b8def" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"/><circle cx="27" cy="9" r="4.2" fill="#5b8def"/><circle cx="12" cy="18" r="2.6" fill="#1f2a44" stroke="#fff" stroke-width="1.6"/><circle cx="4" cy="26" r="2.6" fill="#1f2a44" stroke="#fff" stroke-width="1.6"/></svg>`;

const browser = await chromium.launch({ executablePath: process.env.CHROME_PATH });
async function shot(html, w, h, out) {
  const page = await browser.newPage({ viewport: { width: w, height: h } });
  await page.setContent(html, { waitUntil: "load" });
  await page.evaluate(() => document.fonts.ready);
  await page.screenshot({ path: new URL(`../public/${out}`, import.meta.url).pathname });
  await page.close();
}
await shot(og, 1200, 630, "og.png");
await shot(icon(512), 512, 512, "logo-512.png");
await shot(icon(180), 180, 180, "apple-touch-icon.png");
await browser.close();
console.log("Wrote public/og.png, public/logo-512.png, public/apple-touch-icon.png");
