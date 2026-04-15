export function normalizeFormula(s: string): string {
  return s.trim()
    .replace(/\s+/g, '')
    .replace(/[⁺]/g, '+').replace(/[⁻]/g, '-')
    .replace(/[²]/g, '2').replace(/[³]/g, '3').replace(/[⁴]/g, '4')
    .replace(/[₂]/g, '2').replace(/[₃]/g, '3').replace(/[₄]/g, '4')
    .replace(/[₆]/g, '6').replace(/[₇]/g, '7')
    .toLowerCase();
}

export function normalizeName(s: string): string {
  return s.trim().toLowerCase()
    .replace(/\s+/g, ' ')
    .replace(/\(\s*i\s*\)/g, '(i)')
    .replace(/\(\s*ii\s*\)/g, '(ii)')
    .replace(/\(\s*iii\s*\)/g, '(iii)')
    .replace(/\(\s*iv\s*\)/g, '(iv)');
}

export function checkFormula(input: string, correct: string): boolean {
  return normalizeFormula(input) === normalizeFormula(correct);
}

export function checkName(input: string, correct: string): boolean {
  return normalizeName(input) === normalizeName(correct);
}

export function formatCharge(c: number): string {
  if (c === 0) return '0';
  return c > 0 ? `+${c}` : `${c}`;
}
