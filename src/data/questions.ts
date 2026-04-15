import type { Question, QuestionType } from '../types';
import { IONS, ION_MAP } from './ions';
import { shuffle, pick } from '../utils/shuffle';
import { formatCharge } from '../utils/normalize';

// ─── Tune question counts here ────────────────────────────────────────────────
export const QUESTION_COUNTS = {
  nameToFormula:    'all' as 'all' | number,  // ~81
  formulaToName:    'all' as 'all' | number,  // ~81
  chargeSelect:     'all' as 'all' | number,  // ~81
  mcqFormula:       20,
  mcqName:          20,
  trueFalseCharge:  20,
  trueFalseFormula: 15,
  oddOneOut:        10,
  cationOrAnion:    15,
  monoPoly:         15,
  oxygenCount:      10,
};

// ─── Helpers ──────────────────────────────────────────────────────────────────

function limitPool<T>(arr: T[], limit: 'all' | number): T[] {
  return limit === 'all' ? arr : arr.slice(0, limit);
}

/** Pick n distractors: prefer same type > same charge > everything else */
function distractors(correctId: string, n: number) {
  const correct = ION_MAP[correctId];
  const others = IONS.filter(i => i.id !== correctId);
  const sameTypeSameCharge = others.filter(i => i.type === correct.type && i.charge === correct.charge);
  const sameType = others.filter(i => i.type === correct.type && i.charge !== correct.charge);
  const rest = others.filter(i => i.type !== correct.type);
  const pool = [...sameTypeSameCharge, ...sameType, ...rest];
  // deduplicate while preserving priority
  const seen = new Set<string>();
  const unique: typeof IONS = [];
  for (const ion of pool) {
    if (!seen.has(ion.id)) { seen.add(ion.id); unique.push(ion); }
  }
  return shuffle(unique).slice(0, n);
}

// ─── Generators ───────────────────────────────────────────────────────────────

function genNameToFormula(): Question[] {
  return limitPool(IONS, QUESTION_COUNTS.nameToFormula).map(ion => ({
    id: `ntf_${ion.id}`,
    type: 'name-to-formula' as QuestionType,
    prompt: `What is the formula for ${ion.name}?`,
    ionId: ion.id,
    correctAnswer: ion.symbol,
  }));
}

function genFormulaToName(): Question[] {
  return limitPool(IONS, QUESTION_COUNTS.formulaToName).map(ion => ({
    id: `ftn_${ion.id}`,
    type: 'formula-to-name' as QuestionType,
    prompt: `What is the name of ${ion.symbol}?`,
    ionId: ion.id,
    correctAnswer: ion.name,
  }));
}

function genChargeSelect(): Question[] {
  return limitPool(IONS, QUESTION_COUNTS.chargeSelect).map(ion => ({
    id: `cs_${ion.id}`,
    type: 'charge-select' as QuestionType,
    prompt: `What is the charge of ${ion.name} (${ion.symbol})?`,
    ionId: ion.id,
    correctAnswer: formatCharge(ion.charge),
  }));
}

function genMcqFormula(): Question[] {
  const pool = shuffle([...IONS]);
  const chosen = pool.slice(0, QUESTION_COUNTS.mcqFormula);
  return chosen.map((ion, i) => {
    const wrong = distractors(ion.id, 3);
    const options = shuffle([ion.symbol, ...wrong.map(d => d.symbol)]);
    return {
      id: `mcqf_${i + 1}`,
      type: 'mcq-formula' as QuestionType,
      prompt: `What is the formula for ${ion.name}?`,
      ionId: ion.id,
      options,
      correctAnswer: ion.symbol,
    };
  });
}

function genMcqName(): Question[] {
  const pool = shuffle([...IONS]);
  const chosen = pool.slice(0, QUESTION_COUNTS.mcqName);
  return chosen.map((ion, i) => {
    const wrong = distractors(ion.id, 3);
    const options = shuffle([ion.name, ...wrong.map(d => d.name)]);
    return {
      id: `mcqn_${i + 1}`,
      type: 'mcq-name' as QuestionType,
      prompt: `What is the name of ${ion.symbol}?`,
      ionId: ion.id,
      options,
      correctAnswer: ion.name,
    };
  });
}

function genTrueFalseCharge(): Question[] {
  const out: Question[] = [];
  const pool = shuffle([...IONS]);
  for (let i = 0; i < QUESTION_COUNTS.trueFalseCharge; i++) {
    const ion = pool[i % pool.length];
    const isTrue = i % 2 === 0;
    const displayCharge = isTrue
      ? formatCharge(ion.charge)
      : formatCharge(pick([-3,-2,-1,1,2,3,4].filter(c => c !== ion.charge), 1)[0]);
    const correct = isTrue ? 'True' : 'False';
    out.push({
      id: `tfc_${i + 1}`,
      type: 'true-false-charge',
      prompt: `True or False: ${ion.name} has a ${displayCharge} charge.`,
      ionId: ion.id,
      options: ['True', 'False'],
      correctAnswer: correct,
    });
  }
  return out;
}

function genTrueFalseFormula(): Question[] {
  const out: Question[] = [];
  const pool = shuffle([...IONS]);
  for (let i = 0; i < QUESTION_COUNTS.trueFalseFormula; i++) {
    const ion = pool[i % pool.length];
    const isTrue = i % 2 === 0;
    const displayFormula = isTrue
      ? ion.symbol
      : pick(IONS.filter(x => x.id !== ion.id), 1)[0].symbol;
    const correct = isTrue ? 'True' : 'False';
    out.push({
      id: `tff_${i + 1}`,
      type: 'true-false-formula',
      prompt: `True or False: The formula for ${ion.name} is ${displayFormula}.`,
      ionId: ion.id,
      options: ['True', 'False'],
      correctAnswer: correct,
    });
  }
  return out;
}

function genOddOneOut(): Question[] {
  const out: Question[] = [];
  const charges = [2, -1, 1, -2, 3, -1, 2, -1, 1, -3] as const;
  const oddCharges = [-1, 1, -1, 1, 1, 2, -1, 2, -2, 1] as const;

  for (let i = 0; i < QUESTION_COUNTS.oddOneOut; i++) {
    const fc = charges[i % charges.length];
    const oc = oddCharges[i % oddCharges.length];
    const sameGroup = IONS.filter(x => x.charge === fc);
    const oddGroup = IONS.filter(x => x.charge === oc);
    if (sameGroup.length < 3 || oddGroup.length < 1) continue;
    // Use offset i to vary which ions appear
    const offset = (i * 3) % Math.max(sameGroup.length - 2, 1);
    const trio = sameGroup.slice(offset, offset + 3).length === 3
      ? sameGroup.slice(offset, offset + 3)
      : sameGroup.slice(0, 3);
    const oddIon = oddGroup[(i * 2) % oddGroup.length];
    const options = shuffle([...trio.map(x => x.symbol), oddIon.symbol]);
    out.push({
      id: `ooo_${i + 1}`,
      type: 'odd-one-out',
      prompt: `Which does NOT have a ${formatCharge(fc)} charge?`,
      options,
      correctAnswer: oddIon.symbol,
    });
  }
  return out;
}

function genCationOrAnion(): Question[] {
  const pool = shuffle([...IONS]);
  return pool.slice(0, QUESTION_COUNTS.cationOrAnion).map((ion, i) => {
    const isCation = ion.type === 'monatomic-cation' || ion.type === 'polyatomic-cation';
    return {
      id: `coa_${i + 1}`,
      type: 'cation-or-anion' as QuestionType,
      prompt: `Is ${ion.name} (${ion.symbol}) a cation or anion?`,
      ionId: ion.id,
      options: ['Cation', 'Anion'],
      correctAnswer: isCation ? 'Cation' : 'Anion',
    };
  });
}

function genMonoPoly(): Question[] {
  const pool = shuffle([...IONS]);
  return pool.slice(0, QUESTION_COUNTS.monoPoly).map((ion, i) => {
    const isMono = ion.type === 'monatomic-cation' || ion.type === 'monatomic-anion';
    return {
      id: `mp_${i + 1}`,
      type: 'mono-or-poly' as QuestionType,
      prompt: `Is ${ion.name} (${ion.symbol}) monatomic or polyatomic?`,
      ionId: ion.id,
      options: ['Monatomic', 'Polyatomic'],
      correctAnswer: isMono ? 'Monatomic' : 'Polyatomic',
    };
  });
}

function genOxygenCount(): Question[] {
  const oxyIons = IONS.filter(i =>
    (i.type === 'polyatomic-anion' || i.type === 'polyatomic-cation') &&
    (i.oxygenCount ?? 0) > 0
  );
  const allCounts = [...new Set(IONS.filter(x => x.oxygenCount !== undefined).map(x => x.oxygenCount!))];
  const chosen = shuffle([...oxyIons]).slice(0, QUESTION_COUNTS.oxygenCount);
  return chosen.map((ion, i) => {
    const correct = ion.oxygenCount!;
    const wrongs = shuffle(allCounts.filter(c => c !== correct)).slice(0, 3);
    while (wrongs.length < 3) {
      const candidate = correct + wrongs.length + 1;
      if (!wrongs.includes(candidate)) wrongs.push(candidate);
    }
    const options = shuffle([correct, ...wrongs]).map(String);
    return {
      id: `oxy_${i + 1}`,
      type: 'oxygen-count' as QuestionType,
      prompt: `How many oxygen atoms does ${ion.name} (${ion.symbol}) contain?`,
      ionId: ion.id,
      options,
      correctAnswer: String(correct),
    };
  });
}

function genListing(): Question[] {
  const allIds = IONS.map(i => i.id);
  return [
    {
      id: 'lst_1', type: 'listing' as QuestionType,
      prompt: 'Select ALL monatomic cations with a +1 charge',
      pool: allIds,
      correctAnswer: IONS.filter(i => i.type === 'monatomic-cation' && i.charge === 1).map(i => i.id),
    },
    {
      id: 'lst_2', type: 'listing' as QuestionType,
      prompt: 'Select ALL monatomic cations with a +2 charge',
      pool: allIds,
      correctAnswer: IONS.filter(i => i.type === 'monatomic-cation' && i.charge === 2).map(i => i.id),
    },
    {
      id: 'lst_3', type: 'listing' as QuestionType,
      prompt: 'Select ALL monatomic cations with a +3 charge',
      pool: allIds,
      correctAnswer: IONS.filter(i => i.type === 'monatomic-cation' && i.charge === 3).map(i => i.id),
    },
    {
      id: 'lst_4', type: 'listing' as QuestionType,
      prompt: 'Select ALL monatomic cations with a +4 charge',
      pool: allIds,
      correctAnswer: IONS.filter(i => i.type === 'monatomic-cation' && i.charge === 4).map(i => i.id),
    },
    {
      id: 'lst_5', type: 'listing' as QuestionType,
      prompt: 'Select ALL monatomic anions with a −1 charge',
      pool: allIds,
      correctAnswer: IONS.filter(i => i.type === 'monatomic-anion' && i.charge === -1).map(i => i.id),
    },
    {
      id: 'lst_6', type: 'listing' as QuestionType,
      prompt: 'Select ALL monatomic anions with a −2 charge',
      pool: allIds,
      correctAnswer: IONS.filter(i => i.type === 'monatomic-anion' && i.charge === -2).map(i => i.id),
    },
    {
      id: 'lst_7', type: 'listing' as QuestionType,
      prompt: 'Select ALL monatomic anions with a −3 charge',
      pool: allIds,
      correctAnswer: IONS.filter(i => i.type === 'monatomic-anion' && i.charge === -3).map(i => i.id),
    },
    {
      id: 'lst_8', type: 'listing' as QuestionType,
      prompt: 'Select ALL polyatomic anions with a −1 charge',
      pool: allIds,
      correctAnswer: IONS.filter(i => i.type === 'polyatomic-anion' && i.charge === -1).map(i => i.id),
    },
    {
      id: 'lst_9', type: 'listing' as QuestionType,
      prompt: 'Select ALL polyatomic anions with a −2 charge',
      pool: allIds,
      correctAnswer: IONS.filter(i => i.type === 'polyatomic-anion' && i.charge === -2).map(i => i.id),
    },
    {
      id: 'lst_10', type: 'listing' as QuestionType,
      prompt: 'Select ALL polyatomic anions with a −3 charge',
      pool: allIds,
      correctAnswer: IONS.filter(i => i.type === 'polyatomic-anion' && i.charge === -3).map(i => i.id),
    },
  ];
}

// ─── Public API ───────────────────────────────────────────────────────────────

export function generateAllQuestions(): Question[] {
  return [
    ...genNameToFormula(),
    ...genFormulaToName(),
    ...genChargeSelect(),
    ...genMcqFormula(),
    ...genMcqName(),
    ...genTrueFalseCharge(),
    ...genTrueFalseFormula(),
    ...genOddOneOut(),
    ...genCationOrAnion(),
    ...genMonoPoly(),
    ...genOxygenCount(),
    ...genListing(),
  ];
}
