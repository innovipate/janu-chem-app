import { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../components/Layout';
import ProgressBar from '../components/ProgressBar';
import { FLASHCARD_GROUPS } from '../data/ions';
import { checkFormula, checkName } from '../utils/normalize';
import { useQuiz } from '../context/QuizContext';
import type { PhaseFlashcardState } from '../types';

interface Props {
  phaseKey: 'phase1' | 'phase2';
  direction: 'name-to-formula' | 'formula-to-name';
}

type CardState = 'idle' | 'correct' | 'wrong';

export default function FlashcardPhase({ phaseKey, direction }: Props) {
  const navigate = useNavigate();
  const { state, update } = useQuiz();
  const phaseState = state[phaseKey] as PhaseFlashcardState;

  const [groupIdx, setGroupIdx] = useState(phaseState.currentGroupIndex);
  const [cardIdx, setCardIdx] = useState(phaseState.currentCardIndex);
  const [cardState, setCardState] = useState<CardState>('idle');
  const [inputVal, setInputVal] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  // Prevent double-advance (e.g. timer fires and user also clicks Next)
  const advancedRef = useRef(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Stable refs so callbacks never become stale while still reading latest state
  const cardStateRef = useRef<CardState>('idle');
  cardStateRef.current = cardState;
  const inputValRef = useRef('');
  inputValRef.current = inputVal;

  const groups = FLASHCARD_GROUPS;
  const currentGroup = groups[groupIdx];
  const ion = currentGroup?.ions[cardIdx];
  const totalCards = currentGroup?.ions.length ?? 0;

  const isFormula = direction === 'name-to-formula';
  const prompt = isFormula ? ion?.name : ion?.symbol;
  const correctAnswer = isFormula ? ion?.symbol : ion?.name;

  useEffect(() => {
    advancedRef.current = false;
    if (timerRef.current) { clearTimeout(timerRef.current); timerRef.current = null; }
    setCardState('idle');
    setInputVal('');
    setTimeout(() => inputRef.current?.focus(), 40);
  }, [groupIdx, cardIdx]);

  useEffect(() => () => { if (timerRef.current) clearTimeout(timerRef.current); }, []);

  const saveProgress = useCallback((gi: number, ci: number, completedGroups: number[]) => {
    update({
      [phaseKey]: { ...phaseState, currentGroupIndex: gi, currentCardIndex: ci, completedGroups },
    });
  }, [phaseKey, phaseState, update]);

  // advance() is stable during a card's lifetime; guard prevents double-fire
  const advance = useCallback(() => {
    if (advancedRef.current) return;
    advancedRef.current = true;
    if (timerRef.current) { clearTimeout(timerRef.current); timerRef.current = null; }

    const nextCard = cardIdx + 1;
    if (nextCard < totalCards) {
      setCardIdx(nextCard);
      saveProgress(groupIdx, nextCard, phaseState.completedGroups);
    } else {
      const completedGroups = phaseState.completedGroups.includes(groupIdx)
        ? phaseState.completedGroups
        : [...phaseState.completedGroups, groupIdx];
      const nextGroup = groupIdx + 1;
      if (nextGroup < groups.length) {
        setGroupIdx(nextGroup);
        setCardIdx(0);
        saveProgress(nextGroup, 0, completedGroups);
      } else {
        update({ [phaseKey]: { ...phaseState, completed: true, completedGroups } });
        navigate('/');
      }
    }
  }, [cardIdx, totalCards, groupIdx, groups.length, phaseState, saveProgress, update, phaseKey, navigate]);

  // Called ONLY from input onKeyDown or the ✓ button — never from the window handler
  const submitAnswer = () => {
    if (cardStateRef.current !== 'idle' || !inputValRef.current.trim()) return;
    const correct = isFormula
      ? checkFormula(inputValRef.current, correctAnswer!)
      : checkName(inputValRef.current, correctAnswer!);
    setCardState(correct ? 'correct' : 'wrong');
    if (correct) {
      timerRef.current = setTimeout(advance, 800);
    }
  };

  // Global handler: Escape only + arrow/Enter to advance after wrong.
  // Deliberately does NOT call submitAnswer — the input's onKeyDown does that.
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') { navigate('/'); return; }
      if (cardStateRef.current === 'wrong' &&
          (e.key === 'Enter' || e.key === 'ArrowRight')) {
        advance();
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [advance, navigate]); // cardState read via ref, so no dep needed

  const navigateToGroup = (gi: number) => {
    if (gi === groupIdx) return;
    if (!phaseState.completedGroups.includes(gi)) return;
    setGroupIdx(gi);
    setCardIdx(0);
    saveProgress(gi, 0, phaseState.completedGroups);
  };

  if (!ion) return null;

  const cardBorder =
    cardState === 'idle'    ? 'border-gray-200' :
    cardState === 'correct' ? 'border-green-500 bg-green-50' :
                              'border-red-400 bg-red-50';

  const inputBorder =
    cardState === 'idle'    ? 'border-gray-300' :
    cardState === 'correct' ? 'border-green-500' :
                              'border-red-400';

  const phaseTitle = isFormula
    ? 'Phase 1 — Name → Formula'
    : 'Phase 2 — Formula → Name';

  return (
    <Layout>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <button onClick={() => navigate('/')} className="text-gray-400 hover:text-gray-600 text-sm">
          ← Home
        </button>
        <h1 className="text-sm font-bold text-slate-600 uppercase tracking-wide">{phaseTitle}</h1>
        <span className="text-sm text-gray-400">Group {groupIdx + 1}/{groups.length}</span>
      </div>

      {/* Group navigation pills */}
      <div className="flex flex-wrap gap-2 mb-5">
        {groups.map((g, gi) => {
          const isDone    = phaseState.completedGroups.includes(gi);
          const isCurrent = gi === groupIdx;
          return (
            <button
              key={gi}
              type="button"
              onClick={() => navigateToGroup(gi)}
              disabled={!isDone && !isCurrent}
              className={`text-xs font-semibold px-3 py-1 rounded-full border transition-colors ${
                isCurrent ? 'bg-blue-600 text-white border-blue-600'
                : isDone  ? 'bg-green-100 text-green-700 border-green-300 hover:bg-green-200'
                          : 'bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed'
              }`}
            >
              {isDone && !isCurrent ? '✓ ' : ''}{g.label}
            </button>
          );
        })}
      </div>

      {/* Progress bar */}
      <div className="mb-6">
        <ProgressBar
          value={cardIdx / totalCards}
          label={`${currentGroup.label} — Card ${cardIdx + 1} of ${totalCards}`}
        />
      </div>

      {/* Flashcard */}
      <div className={`bg-white rounded-2xl border-2 shadow-sm p-8 text-center transition-colors duration-200 ${cardBorder}`}>
        <p className="text-xs uppercase tracking-widest text-gray-400 mb-3">
          {isFormula ? 'Ion Name' : 'Ion Formula'}
        </p>
        <div className="text-4xl font-bold text-slate-800 mb-8 min-h-[3rem] flex items-center justify-center">
          {prompt}
        </div>

        <div className="max-w-xs mx-auto space-y-3">
          <div className={`flex rounded-xl border-2 overflow-hidden transition-colors ${inputBorder}`}>
            <input
              ref={inputRef}
              value={inputVal}
              onChange={e => setInputVal(e.target.value)}
              onKeyDown={e => {
                // ONLY this handler submits — global handler deliberately excluded
                if (e.key === 'Enter') {
                  e.stopPropagation();   // prevent the window handler from also seeing it
                  submitAnswer();
                }
              }}
              disabled={cardState !== 'idle'}
              placeholder={isFormula ? 'Type formula…' : 'Type name…'}
              className="flex-1 px-4 py-3 text-base bg-transparent outline-none text-slate-800 placeholder-gray-400 text-center"
              spellCheck={false}
              autoComplete="off"
              autoCorrect="off"
            />
            {cardState === 'idle' && (
              <button
                type="button"
                onClick={submitAnswer}
                disabled={!inputVal.trim()}
                className="px-4 bg-blue-600 text-white font-bold hover:bg-blue-700 disabled:opacity-40 transition-colors"
              >
                ✓
              </button>
            )}
          </div>

          {cardState === 'correct' && (
            <p className="text-green-700 font-semibold text-sm">✓ Correct!</p>
          )}
          {cardState === 'wrong' && (
            <div className="space-y-2">
              <p className="text-red-600 font-semibold text-sm">✗ Incorrect</p>
              <div className="bg-white border border-red-200 rounded-lg px-4 py-2 text-sm">
                Answer: <strong className="text-slate-800">{correctAnswer}</strong>
              </div>
              <button
                type="button"
                onClick={advance}
                className="w-full py-2.5 bg-slate-700 text-white font-semibold rounded-lg hover:bg-slate-800 text-sm transition-colors"
              >
                Next → <span className="text-slate-400 text-xs ml-1">(Enter or →)</span>
              </button>
            </div>
          )}
        </div>
      </div>

      <p className="text-center text-xs text-gray-400 mt-4">
        Enter to check · Esc for Home
      </p>
    </Layout>
  );
}
