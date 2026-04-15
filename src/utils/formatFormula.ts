const SUB: Record<string, string> = {
  '0':'₀','1':'₁','2':'₂','3':'₃','4':'₄',
  '5':'₅','6':'₆','7':'₇','8':'₈','9':'₉',
};
const SUP: Record<string, string> = {
  '0':'⁰','1':'¹','2':'²','3':'³','4':'⁴',
  '5':'⁵','6':'⁶','7':'⁷','8':'⁸','9':'⁹',
};

function sub(n: string) { return n.split('').map(c => SUB[c] ?? c).join(''); }
function sup(n: string) { return n.split('').map(c => SUP[c] ?? c).join(''); }
function subAll(s: string) { return s.replace(/\d+/g, n => sub(n)); }

/**
 * Convert a typed ASCII formula string into a unicode-formatted preview.
 *
 * Rules:
 *  1. If the input contains a space before a trailing charge (e.g. "NO2 -" or "CO3 2-"):
 *     - Everything before the last space → formula part: digits become SUBSCRIPT
 *     - Everything after the last space   → charge part:  digits become SUPERSCRIPT, +→⁺, -→⁻
 *  2. If no space but ends in [digit?][+/-]:
 *     - Trailing digit+sign → SUPERSCRIPT charge
 *     - Rest of string      → formula part: digits become SUBSCRIPT
 *  3. No sign at all → all digits become SUBSCRIPT
 *
 * Examples:
 *   "Li+"       → Li⁺
 *   "Al3+"      → Al³⁺
 *   "NO2 -"     → NO₂⁻
 *   "CO3 2-"    → CO₃²⁻
 *   "NH4 +"     → NH₄⁺
 *   "Fe(CN)6 3-"→ Fe(CN)₆³⁻
 *   "Hg2 2+"    → Hg₂²⁺
 */
export function formatFormula(raw: string): string {
  if (!raw.trim()) return '';

  // ── Case 1: space before charge ─────────────────────────────────────────────
  // Match: [formula part] [space] [optional digit(s)] [+/-]
  const spaceMatch = raw.match(/^([\s\S]+?)\s+(\d*)\s*([+\-])\s*$/);
  if (spaceMatch) {
    const formulaPart  = spaceMatch[1].trim();
    const chargeDigits = spaceMatch[2];
    const chargeSign   = spaceMatch[3] === '+' ? '⁺' : '⁻';
    return subAll(formulaPart) + (chargeDigits ? sup(chargeDigits) : '') + chargeSign;
  }

  // ── Case 2: no space, trailing [digit?][+/-] ─────────────────────────────────
  const noSpaceMatch = raw.match(/^([\s\S]*?)(\d*)([+\-])$/);
  if (noSpaceMatch) {
    const formulaPart  = noSpaceMatch[1];
    const chargeDigits = noSpaceMatch[2];
    const chargeSign   = noSpaceMatch[3] === '+' ? '⁺' : '⁻';
    return subAll(formulaPart) + (chargeDigits ? sup(chargeDigits) : '') + chargeSign;
  }

  // ── Case 3: no sign at all ─────────────────────────────────────────────────
  return subAll(raw);
}

/** One-line cheat-sheet shown in the UI */
export const FORMULA_HINT =
  'Li+ → Li⁺  ·  NO2 − → NO₂⁻  ·  CO3 2− → CO₃²⁻  ·  Fe(CN)6 3− → Fe(CN)₆³⁻';
