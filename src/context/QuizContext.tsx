import { createContext, useContext, useState, useCallback } from 'react';
import type { StoredState } from '../types';
import { INITIAL_STATE } from '../types';

const STORAGE_KEY = 'ion-quiz-state';

interface QuizCtx {
  state: StoredState;
  update: (patch: Partial<StoredState>) => void;
  resetAll: () => void;
}

const QuizContext = createContext<QuizCtx>({} as QuizCtx);

function load(): StoredState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw) as Partial<StoredState>;
      // Deep-merge with INITIAL_STATE so new fields are always present
      return {
        ...INITIAL_STATE,
        ...parsed,
        phase1: { ...INITIAL_STATE.phase1, ...parsed.phase1 },
        phase2: { ...INITIAL_STATE.phase2, ...parsed.phase2 },
        phase3: { ...INITIAL_STATE.phase3, ...parsed.phase3 },
        phase4: { ...INITIAL_STATE.phase4, ...parsed.phase4 },
      };
    }
  } catch {}
  return INITIAL_STATE;
}

export function QuizProvider({ children }: { children: React.ReactNode }) {
  const [state, setRaw] = useState<StoredState>(load);

  const update = useCallback((patch: Partial<StoredState>) => {
    setRaw(prev => {
      const next = { ...prev, ...patch };
      try { localStorage.setItem(STORAGE_KEY, JSON.stringify(next)); } catch {}
      return next;
    });
  }, []);

  const resetAll = useCallback(() => {
    try { localStorage.removeItem(STORAGE_KEY); } catch {}
    setRaw(INITIAL_STATE);
  }, []);

  return (
    <QuizContext.Provider value={{ state, update, resetAll }}>
      {children}
    </QuizContext.Provider>
  );
}

export function useQuiz() { return useContext(QuizContext); }
