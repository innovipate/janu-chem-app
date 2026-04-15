# Ion Quiz

A production-ready chemistry ion quiz app built with React + Vite + TypeScript + Tailwind CSS.

## Local Development

```bash
npm install
npm run dev
```

## Deploy to Vercel

1. Push this repo to GitHub
2. Import the repo in [vercel.com/new](https://vercel.com/new)
3. Build command: `npm run build`
4. Output directory: `dist`
5. Click Deploy — `vercel.json` handles client-side routing automatically

## How to Add More Questions

### Option A — Add more ions
Edit `src/data/ions.ts`. Add a new `Ion` object to the `IONS` array.  
All question generators (name→formula, formula→name, charge-select, MCQ, listing, etc.) will automatically include the new ion.

### Option B — Add custom questions manually
Edit `src/data/extraQuestions.ts`. Add objects matching the `Question` interface:

```typescript
{
  id: 'extra_001',        // must be unique
  type: 'mcq-name',
  prompt: 'What is the name of SO₄²⁻?',
  options: ['Sulfate', 'Sulfite', 'Thiosulfate', 'Silicate'],
  correctAnswer: 'Sulfate',
}
```

They merge automatically into Phase 4.

### Option C — Increase question counts
Edit `QUESTION_COUNTS` at the top of `src/data/questions.ts`:

```typescript
export const QUESTION_COUNTS = {
  mcqFormula: 40,        // was 20
  trueFalseCharge: 30,   // was 20
  nameToFormula: 'all',  // 'all' = one per ion
  // ...
};
```

### Option D — Ask Cursor (AI)
> "Add 20 more true/false questions about polyatomic anions"  
> "Add a new question type: give the name, identify which charge group it belongs to"

Cursor will add entries to `extraQuestions.ts` or extend the generator.

## Question Types

| Type | Description |
|------|-------------|
| `name-to-formula` | Type the formula given the ion name |
| `formula-to-name` | Type the name given the formula |
| `charge-select` | Click the correct charge button |
| `mcq-formula` | 4-option multiple choice — pick the formula |
| `mcq-name` | 4-option multiple choice — pick the name |
| `true-false-charge` | True or False: does this ion have charge X? |
| `true-false-formula` | True or False: is this the correct formula? |
| `odd-one-out` | Which of these 4 ions has a different charge? |
| `cation-or-anion` | Is this ion a cation or anion? |
| `mono-or-poly` | Is this ion monatomic or polyatomic? |
| `oxygen-count` | How many oxygen atoms does this ion contain? |
| `listing` | Select ALL ions from a given group (scrollable checklist) |

## Ion Dataset

81 ions total, exactly as specified. All data lives in `src/data/ions.ts` — the single source of truth.
