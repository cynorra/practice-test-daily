// Alt text and captions for guide illustrations, keyed by article slug.
// guide-images.json is written by scripts/make-guide-images.mjs and by the auto-blog pipeline.
import data from "./guide-images.json" with { type: "json" };
export const GUIDE_IMAGES = data;
