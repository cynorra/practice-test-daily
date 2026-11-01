/**
 * Content policy for the Practice Tests Daily generator: what an SAT article may promise.
 * Score guarantees, "official" framing and leaked/real test content are refused
 * (AdSense misleading-claims risk, College Board trademark, copyright).
 */
const PROMISE_TITLE_RE =
  /\b(guarantee[sd]?|guaranteed|\+\s?\d{2,3}\s?points?|raise (?:your )?(?:sat )?score by \d+|perfect 1600 (?:in|with)|official (?:sat )?(?:questions?|answers?|test)|leaked|real (?:sat )?(?:questions?|test)|actual (?:sat )?questions?|answer key to)\b/i;

export function isMonetaryPromiseTitle(title: string): boolean {
  // Name kept for compatibility with claims-check.ts; here it means "promise the page cannot keep".
  return PROMISE_TITLE_RE.test(title);
}

export const REFUSED_TITLE_RE = PROMISE_TITLE_RE;

/** Why a proposed topic is refused, or null. */
export function whyTopicRefused(title: string): string | null {
  if (PROMISE_TITLE_RE.test(title)) return 'promises a score gain, official or real test content';
  if (/\b(20[0-2]\d)\b/.test(title) && !/\b2026|2027\b/.test(title)) return 'names an old year';
  return null;
}
