# Practice Tests Daily (practicetestsdaily.com)

SAT pratik sitesi: beceri bazlı SAT Math (kodla doğrulanmış, sınırsız üretilen sorular) ve Reading & Writing (elle yazılmış sorular), her şık için açıklama, SAT format rehberi, İngilizce testleri (`/english/`), TOEFL okuma-yazma pratiği (`/toefl/`) ve otomatik blog pipeline'ı.

> Marka/domain: `src/site.config.js` (name, domain, url, email); görseller `scripts/make-images.mjs` ile üretilir.

## Çalıştırma

```bash
npm install
npm run dev
npm test                 # soru bankası: 14 math becerisi x 400 tohum doğrulama + R&W kontrolleri
npm run test:pipeline    # pipeline kapılarının offline self-test'i
npm run build
node scripts/check-links.mjs
```

## Soru bankası

| Dosya | İçerik |
| --- | --- |
| `src/lib/quiz/math.js` | 14 math becerisi. Her biri: şablon + bağımsız `check` (cevabı başka yoldan çözer). Test 400 tohumda anahtarı doğrular. |
| `src/lib/quiz/rw-conventions.js`, `rw-ideas.js` | Elle yazılmış R&W soruları (anahtar `choices[0]` ya da `answer`; sayfada karıştırılır). Her yanlış şık için açıklama zorunlu. |
| `src/lib/quiz/lessons.js` | Her becerinin kural + tuzak dersi |
| `src/lib/quiz/bank.js` | Beceri kataloğu, sayfa yolları |
| `src/components/quiz/Quiz.tsx` | Quiz arayüzü (sunucuda tam HTML, açıklamalar `<details>` içinde) |

Yeni R&W sorusu: ilgili diziye ekle → `npm test`. Yeni math becerisi: `math.js`'e `def(...)` + `lessons.js`'e ders → `npm test`.

## İngilizce testleri ve TOEFL

| Dosya | İçerik |
| --- | --- |
| `src/lib/english/level-test.js` | Seviye testi: 30 soru, her CEFR seviyesinden (A1–C2) 5 tane. Anahtar `choices[0]` |
| `src/lib/english/level.js` | Doğru sayısından *tahmini* bant üretir (kural dosyanın başında ve sayfada yazılı) |
| `vocabulary.js`, `grammar.js`, `pronouns.js`, `verbs.js` | Kelime (40), gramer (30), zamir (20), fiil (20) soruları, elle yazıldı |
| `toefl.js` | TOEFL tarzı okuma (12) ve yazma (12) pratiği. Görev adları ETS sayfasından; sorular bize ait, ETS sorusu değil |
| `bank.js` | Hepsini sayfalara hazırlar (seçenekleri sabit hash ile karıştırır) |
| `lessons.js`, `faqs.js` | Her sayfanın kendi metni ve SSS'si. Sayfalar arası aynı cümle olmamalı |

Sayfalar `src/components/quiz/EnglishTestPage.astro` ile çizilir; `/english/` ve `/toefl/` kendi .astro dosyalarındadır. Yeni sayfa yolu eklenirse `src/page-dates.js` içindeki `ENGLISH_PATHS`'e de eklenmeli. `npm test` `tests/english.test.js` ile soru biçimini, seviye testi dağılımını, tekrar eden SSS/cümleleri ve sayfa tarihlerini kontrol eder.

TOEFL biçim bilgileri (bölümler, görev adları, süre, 1–6 ölçeği) ETS sayfalarından alındı ve `src/lib/data/sources.js` içinde tarihiyle kayıtlı. Biçim değişirse önce ETS sayfasını yeniden okuyun.

Yerelde, henüz yayınlanmamış rehberlerle önizleme: `FIREBASE_PROJECT_ID= PREVIEW_FUTURE=1 npm run build`.

## Otomatik blog (aiandsoftwarehub pipeline'ının portu)

`scripts/pipeline/`:
- `generate.ts`: topics.ts'den konu (Planner keyword + konu kapısı + tekrar kontrolü) → soru bankasından **kodla doğrulanmış örnekler** + SAT facts bloğu → autocomplete keyword planı + editoryal form → Gemini JSON → deterministik kapılar (değer, dolgu, şablon başlık, iddia, hype, kırık link, facts grounding, açılış, FAQ, keyword, örnek kullanımı) → 1 tamir turu → **draft** olarak `.md` + Firestore (aynı byte'lar).
- `auto-publish.ts`: draft'ları tekrar kapılardan + bağımsız AI denetiminden geçirir (fail-closed), geçenleri tarihine yayınlar, `.md`'yi `draft: false` yapar.
- `selftest.ts`: kapıların offline testleri.
- `.github/workflows/auto-blog.yml`: **cron kapalı**. İlk makaleleri elle oku (playbook kural 10), sonra schedule'ı aç.

Secrets: `GEMINI_API_KEY`, `FIREBASE_SERVICE_ACCOUNT` (service account JSON'unun tamamı), `CLOUDFLARE_API_TOKEN`, `CLOUDFLARE_ACCOUNT_ID`. Variables: `CLOUDFLARE_PAGES_PROJECT`, `FIREBASE_PROJECT_ID`. Service account sadece auto-blog job'unda; build sadece project id ile okur (rules sadece yayınlanmış makaleleri açar).

## Kurulum

1. Firebase projesi (Spark, ücretsiz, kart gerekmez) → Firestore Database oluştur (production mode, konum `nam5` ya da `us-central1`) → Rules sekmesine `firestore.rules` içeriğini yapıştır → Publish. Project settings → Service accounts → *Generate new private key* → JSON'u GitHub secret `FIREBASE_SERVICE_ACCOUNT` olarak ekle (dosyayı repoya koyma).
2. **15 hazır rehberi Firestore'a bas** (build Firestore'dan okur; bu adım yapılmazsa canlı sitede rehber görünmez): `.env`'e `FIREBASE_SERVICE_ACCOUNT` koy → `node scripts/push-guides.mjs --dry-run` → `node scripts/push-guides.mjs`. Tarihleri gelmemiş olanlar zamanı gelince günlük deploy'la yayına girer (1 Kasım'da 5 tane, sonra Pazar hariç her gün 1).
3. GitHub repo + secrets/variable → push.
4. Cloudflare Pages projesi + domain; Email Routing `hello@practicetestsdaily.com`.
5. Actions → "Daily Auto-Blog Generator & Publisher" → elle çalıştır, çıktıyı oku, ilk makaleyi elle kontrol et; sonra cron'u aç.
6. Search Console + Bing; AdSense'e Material Guides onayından sonra aynı hesaba ekle.

## Hazır rehberler

`src/content/guides/` altında elle yazılmış 15 rehber var (keyword kümeleri Keyword Planner verisinden). Matematik örnekleri soru bankasından (tohum 201+) alındı ve kodla doğrulandı. Yayın takvimi: 1 Kasım'da 5 rehber, sonra Pazar hariç her gün 1 (12 Kasım'a kadar). Takvimi kaydırmak için: `node scripts/reschedule.mjs YYYY-MM-DD` → `node scripts/push-guides.mjs`.

### Keyword haritası (Planner, ABD aylık arama)

| Rehber (yayın) | Ana keyword | Yan keyword'ler |
| --- | --- | --- |
| sat-practice-test (1 Kas) | sat practice test (500K) | practice sat test online, sat practice exam, sat mock test online, sat timer |
| digital-sat-format (1 Kas) | sat test / sat exam (50K / 5K) | how long is the sat, how many questions, sat reading and writing, new sat |
| sat-math-practice-questions (1 Kas) | sat math practice questions (50K) | sat math questions, sat math practice test, sat math test, sat math |
| sat-grammar-rules (1 Kas) | sat grammar rules (5K) | sat writing practice (50K), sat grammar practice, sat punctuation rules, sat english rules |
| sat-reading-practice-questions (1 Kas) | sat reading practice (5K) | sat reading questions, sat reading comprehension, sat reading practice test |
| sat-percentage-problems (2 Kas) | sat math practice test (50K) | percent change, sat math prep |
| sat-vocabulary-words-in-context (3 Kas) | sat vocabulary (5K) | sat vocabulary words, sat words list, sat vocab quiz, sat vocabulary list |
| sat-systems-of-equations (4 Kas) | sat practice questions (50K) | sat questions, sat prep questions |
| sat-study-plan (5 Kas) | sat prep (50K) | sat study, sat study guide, sat exam preparation, online sat prep, khan academy sat prep |
| sat-linear-equations-and-functions (6 Kas) | sat math practice (5K) | sat math review |
| sat-transitions-questions (7 Kas) | sat writing (500) | sat reading and writing |
| sat-quadratic-equations (9 Kas) | sat math prep (5K) | sat math |
| sat-probability-two-way-tables (10 Kas) | sat math questions (50K) | sat questions |
| sat-mock-test-review (11 Kas) | sat mock test (5K) | sat review, sat diagnostic test, sat practice exam |
| sat-circle-questions (12 Kas) | sat test questions (50K) | sat exam questions |

## İçerik kuralları

- Resmi SAT sorusu, sızdırılmış/gerçek sınav içeriği, puan garantisi yok. "SAT®" College Board'un tescilli markası; sitede her yerde bağımsızlık notu var.
- Test hakkındaki sayılar sadece `scripts/pipeline/lib/facts.ts` ve `src/lib/data/sources.js`'teki kaynaklı değerler.
- Yüzdelik dilim, ortalama puan, kayıt ücreti gibi doğrulanmamış bilgiler yazılmaz.
