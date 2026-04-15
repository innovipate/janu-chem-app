export type QuestionType =
  | 'name-to-formula'
  | 'formula-to-name'
  | 'charge-select'
  | 'mcq-formula'
  | 'mcq-name'
  | 'true-false-charge'
  | 'true-false-formula'
  | 'fill-charge'
  | 'odd-one-out'
  | 'cation-or-anion'
  | 'mono-or-poly'
  | 'oxygen-count'
  | 'listing';

export type IonType =
  | 'monatomic-cation'
  | 'polyatomic-cation'
  | 'monatomic-anion'
  | 'polyatomic-anion';

export interface Ion {
  id: string;
  symbol: string;
  name: string;
  charge: number;
  type: IonType;
  oxygenCount?: number;
}

export interface Question {
  id: string;
  type: QuestionType;
  prompt: string;
  ionId?: string;
  options?: string[];
  pool?: string[];           // ion IDs shown in listing checklist
  correctAnswer: string | string[];
}

export interface Answer {
  questionId: string;
  userAnswer: string | string[];
  correct: boolean;
  partialScore?: number;     // 0–1 for listing questions
}

export interface PhaseFlashcardState {
  completed: boolean;
  currentGroupIndex: number;
  currentCardIndex: number;
  completedGroups: number[];
}

export interface Phase3State {
  completed: boolean;
}

export interface Phase4State {
  started: boolean;
  completed: boolean;
  questionIds: string[];
  currentIndex: number;
  answers: Record<string, Answer>;
  startTime: number | null;
  endTime: number | null;
  isRetry: boolean;
}

export interface StoredState {
  phase1: PhaseFlashcardState;
  phase2: PhaseFlashcardState;
  phase3: Phase3State;
  phase4: Phase4State;
  bestScore: number | null;
  bestTime: number | null;
}

export const INITIAL_STATE: StoredState = {
  phase1: { completed: false, currentGroupIndex: 0, currentCardIndex: 0, completedGroups: [] },
  phase2: { completed: false, currentGroupIndex: 0, currentCardIndex: 0, completedGroups: [] },
  phase3: { completed: false },
  phase4: {
    started: false, completed: false, questionIds: [], currentIndex: 0,
    answers: {}, startTime: null, endTime: null, isRetry: false,
  },
  bestScore: null,
  bestTime: null,
};
