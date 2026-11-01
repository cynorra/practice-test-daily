// One place for everything that names the site. Change the brand or domain
// here and every page, meta tag and schema block follows.

export const SITE = {
  name: "Practice Tests Daily",
  domain: "practicetestsdaily.com",
  url: "https://practicetestsdaily.com",
  tagline: "Free SAT practice tests, a new set every day",
  description:
    "Free SAT practice tests and questions for Math and Reading and Writing, with an explanation for every answer choice. A new practice set every day, unlimited math sets and hand-written verbal questions.",
  language: "en-US",
  locale: "en_US",
  foundingYear: 2026,

  // A real inbox on the domain (Cloudflare Email Routing works).
  email: "hello@practicetestsdaily.com",

  // Optional form backend URL; empty shows the email address only.
  contactFormEndpoint: "",

  // Filled in when this site is approved; until then no ad script loads.
  adsensePublisherId: "",
  // The account's publisher ID, served in /ads.txt from day one so AdSense
  // can verify the site when it is added to the account.
  adsTxtPublisher: "pub-4674211063760769",

  verification: {
    google: "",
    bing: "",
    yandex: "",
  },

  // IndexNow key, served at /indexnow-key.txt. Keep stable.
  indexNowKey: "d28c5a05a99f5176adf74a2dd2414fd5",
};

export const AUTHOR = {
  name: "Eren Şimşir",
  slug: "eren-simsir",
  role: "Founder, Editor & Software Engineer",
  photo: "/images/eren-simsir.jpg",
  linkedin: "https://www.linkedin.com/in/ernsmsr/",
  github: "https://github.com/cynorra",
  shortBio:
    "Computer engineer (M.Sc. student at Kocaeli University, B.Sc. Düzce University) with a double major in industrial engineering. Writes the question generators on this site and the explanations behind every answer; each math question is checked by code before it is published.",
};

export const NAV = [
  { href: "/guides/", label: "Guides" },
  { href: "/sat/math/", label: "SAT Math" },
  { href: "/sat/reading-writing/", label: "Reading & Writing" },
  { href: "/sat/", label: "About the SAT" },
];

export const FOOTER_LINKS = [
  { href: "/about/", label: "About" },
  { href: `/author/${AUTHOR.slug}/`, label: "Author" },
  { href: "/how-we-write-questions/", label: "How we write questions" },
  { href: "/editorial-policy/", label: "Editorial policy" },
  { href: "/contact/", label: "Contact" },
  { href: "/privacy/", label: "Privacy policy" },
  { href: "/terms/", label: "Terms of use" },
  { href: "/disclaimer/", label: "Disclaimer" },
];
