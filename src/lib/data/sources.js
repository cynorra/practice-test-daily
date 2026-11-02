// Sources for facts about the SAT itself (format, timing, domains). Pages cite by key.
export const CHECKED = "2026-11-01";
export const SOURCES = {
  cbDomains: { label: "College Board: SAT content domains (Reading and Writing, Math)", href: "https://satsuite.collegeboard.org/practice/content-domains", checked: CHECKED },
  uworldFormat: { label: "UWorld College Prep: SAT test format and sections", href: "https://collegeprep.uworld.com/sat/test-format-and-sections", checked: CHECKED },
  cbSat: { label: "College Board: the SAT", href: "https://satsuite.collegeboard.org/sat", checked: CHECKED },
};
// English and TOEFL sources, read on 2026-11-02.
export const CHECKED_ENGLISH = "2026-11-02";
SOURCES.etsToeflContent = { label: "ETS: TOEFL iBT test content and structure", href: "https://www.ets.org/toefl/test-takers/ibt/about/content.html", checked: CHECKED_ENGLISH };
SOURCES.etsToeflScores = { label: "ETS: TOEFL iBT score scale guidance (1–6 scale)", href: "https://www.ets.org/toefl/test-takers/ibt/scores/understand-scores.html", checked: CHECKED_ENGLISH };
SOURCES.etsToeflSpec = { label: "ETS: TOEFL iBT test specifications 2026 (PDF)", href: "https://www.ets.org/content/dam/ets-org/pdfs/toefl/toefl-ibt-test-specifications-2026.pdf", checked: CHECKED_ENGLISH };
SOURCES.ieltsAcademic = { label: "IELTS: Academic test format", href: "https://ielts.org/take-a-test/test-types/ielts-academic-test", checked: CHECKED_ENGLISH };
SOURCES.ieltsScoring = { label: "IELTS: scoring in detail", href: "https://ielts.org/take-a-test/your-results/ielts-scoring-in-detail", checked: CHECKED_ENGLISH };
SOURCES.ieltsWays = { label: "IELTS: ways to take IELTS", href: "https://ielts.org/take-a-test/why-choose-ielts/ways-to-take-ielts", checked: CHECKED_ENGLISH };
SOURCES.cbRegistration = { label: "College Board: register for the SAT", href: "https://satsuite.collegeboard.org/sat/registration", checked: CHECKED_ENGLISH };
SOURCES.cbFees = { label: "College Board: SAT test fees", href: "https://satsuite.collegeboard.org/sat/registration/fees-refunds/test-fees", checked: CHECKED_ENGLISH };
SOURCES.cbDates = { label: "College Board: SAT dates and deadlines", href: "https://satsuite.collegeboard.org/sat/dates-deadlines", checked: CHECKED_ENGLISH };
SOURCES.cbFeeWaivers = { label: "College Board: SAT fee waivers", href: "https://satsuite.collegeboard.org/sat/registration/fee-waivers", checked: CHECKED_ENGLISH };
SOURCES.actConcordance = { label: "ACT: ACT/SAT concordance tables (2018)", href: "https://www.act.org/content/act/en/products-and-services/the-act/scores/act-sat-concordance.html", checked: CHECKED_ENGLISH };
SOURCES.actTest = { label: "ACT: the ACT test overview", href: "https://www.act.org/content/act/en/products-and-services/the-act.html", checked: CHECKED_ENGLISH };
export const src = (key) => {
  const s = SOURCES[key];
  if (!s) throw new Error(`Unknown source "${key}"`);
  return s;
};
