import type { Question } from '../types';

/**
 * Add custom questions here — they merge automatically into Phase 4.
 *
 * Option A: Add ions to src/data/ions.ts → all generators pick them up.
 * Option B: Add Question objects to this array.
 * Option C: Adjust QUESTION_COUNTS in src/data/questions.ts.
 *
 * Example:
 * {
 *   id: 'extra_001',
 *   type: 'mcq-name',
 *   prompt: 'What is the name of SO₄²⁻?',
 *   options: ['Sulfate', 'Sulfite', 'Thiosulfate', 'Silicate'],
 *   correctAnswer: 'Sulfate',
 * },
 */
export const extraQuestions: Question[] = [];
