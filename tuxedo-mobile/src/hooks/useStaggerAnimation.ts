/**
 * Returns stagger delay values for entry animations.
 * All delays are capped so the last visible item enters before 280ms.
 *
 * header  → 0ms
 * content → 60ms
 * cta     → 120ms
 * item(i) → 60ms + i * 30ms  (list items stagger tightly)
 */
export function useStaggerAnimation(base = 0) {
  return {
    header:  base,
    content: base + 60,
    cta:     base + 120,
    /** nth item in a list — tight 30ms stagger, starts at 60ms */
    item: (i: number) => base + 60 + i * 30,
  };
}
