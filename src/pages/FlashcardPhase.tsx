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

  const groups = FLASHCARD_GROUPS;
  const currentGroup = groups[groupIdx];
  const ion = currentGroup?.ions[cardIdx];
  const totalCards = currentGroup?.ions.length ?? 0;

  const prompt = direction === 'name-to-formula' ? ion?.name : ion?.symbol;
  const correctAnswer = direction === 'name-to-formula' ? ion?.symbol : ion?.name;
  const inputPlaceholder = direction === 'name-to-formula' ? 'Type formula…' : 'Type name…';
  const phaseTitle = direction === 'name-to-formula' ? 'Phase 1 — Name → Formula' : 'Phase 2 — Formula → Name';

  useEffect(() => {
    setTimeout(() => inputRef.current?.focus(), 50);
  }, [groupIdx, cardIdx]);

  // Save progress
  const saveProgress = useCallback((gi: number, ci: number, completedGroups: number[]) => {
    update({
      [phaseKey]: {
        ...phaseState,
        currentGroupIndex: gi,
        currentCardIndex: ci,
        completedGroups,
      },
    });
  }, [phaseKey, phaseState, update]);

  const advance = useCallback(() => {
    const nextCard = cardIdx + 1;
    if (nextCard < totalCards) {
      setCardIdx(nextCard);
      setCardState('idle');
      setInputVal('');
      saveProgress(groupIdx, nextCard, phaseState.completedGroups);
    } else {
      // Group done
      const completedGroups = phaseState.completedGroups.includes(groupIdx)
        ? phaseState.completedGroups
        : [...phaseState.completedGroups, groupIdx];
      const nextGroup = groupIdx + 1;
      if (nextGroup < groups.length) {
        setGroupIdx(nextGroup);
        setCardIdx(0);
        setCardState('idle');
        setInputVal('');
        saveProgress(nextGroup, 0, completedGroups);
      } else {
        // Phase complete
        update({
          [phaseKey]: {
            ...phaseState,
            completed: true,
            completedGroups,
          },
        });
        navigate('/');
      }
    }
  }, [cardIdx, totalCards, groupIdx, groups.length, phaseState, saveProgress, update, phaseKey, navigate]);

  const submitAnswer = () => {
    if (cardState !== 'idle' || !inputVal.trim()) return;
    const correct = direction === 'name-to-formula'
      ? checkFormula(inputVal, correctAnswer!)
      : checkName(inputVal, correctAnswer!);
    setCardState(correct ? 'correct' : 'wrong');
    if (correct) setTimeout(advance, 800);
  };

  // Keyboard
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') { navigate('/'); return; }
      if (e.key === 'Enter') {
        if (cardState === 'idle') submitAnswer();
        else if (cardState === 'wrong') advance();
      }
      if (e.key === 'ArrowRight' && cardState !== 'idle') advance();
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  });

  const navigateToGroup = (gi: number) => {
    if (gi === groupIdx) return;
    if (!phaseState.completedGroups.includes(gi) && gi !== groupIdx) return;
    setGroupIdx(gi);
    setCardIdx(0);
    setCardState('idle');
    setInputVal('');
    saveProgress(gi, 0, phaseState.completedGroups);
  };

  if (!ion) return null;

  const containerClass = cardState === 'idle'
    ? 'border-gray-200'
    : cardState === 'correct'
    ? 'border-green-500 bg-green-50'
    : 'border-red-400 bg-red-50';

  return (
    <Layout>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <button onClick={() => navigate('/')} className="text-gray-400 hover:text-gray-600 text-sm flex items-center gap-1">
          ← Home
        </button>
        <h1 className="text-sm font-bold text-slate-600 uppercase tracking-wide">{phaseTitle}</h1>
        <span className="text-sm text-gray-400">
          Group {groupIdx + 1}/{groups.length}
        </span>
      </div>

      {/* Group navigation pills */}
      <div className="flex flex-wrap gap-2 mb-5">
        {groups.map((g, gi) => {
          const isDone = phaseState.completedGroups.includes(gi);
          const isCurrent = gi === groupIdx;
          const canClick = isDone || isCurrent;
          return (
            <button
              key={gi}
              onClick={() => navigateToGroup(gi)}
              disabled={!canClick}
              className={`text-xs font-semibold px-3 py-1 rounded-full border transition-colors ${
                isCurrent
                  ? 'bg-blue-600 text-white border-blue-600'
                  : isDone
                  ? 'bg-green-100 text-green-700 border-green-300 hover:bg-green-200'
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
          value={(cardIdx) / totalCards}
          label={`${currentGroup.label} — Card ${cardIdx + 1} of ${totalCards}`}
        />
      </div>

      {/* Flashcard */}
      <div className={`bg-white rounded-2xl border-2 shadow-sm p-8 text-center transition-colors duration-200 ${containerClass}`}>
        <p className="text-xs uppercase tracking-widest text-gray-400 mb-3">
          {direction === 'name-to-formula' ? 'Ion Name' : 'Ion Formula'}
        </p>
        <div className="text-4xl font-bold text-slate-800 mb-8 min-h-[3rem] flex items-center justify-center">
          {prompt}
        </div>

        <div className="max-w-xs mx-auto space-y-3">
          <div className={`flex rounded-xl border-2 overflow-hidden transition-colors ${
            cardState === 'idle' ? 'border-gray-300' : cardState === 'correct' ? 'border-green-500' : 'border-red-400'
          }`}>
            <input
              ref={inputRef}
              value={inputVal}
              onChange={e => setInputVal(e.target.value)}
              disabled={cardState !== 'idle'}
              placeholder={inputPlaceholder}
              className="flex-1 px-4 py-3 text-base bg-transparent outline-none text-slate-800 placeholder-gray-400 text-center"
            />
            {cardState === 'idle' && (
              <button
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
                onClick={advance}
                className="w-full py-2.5 bg-slate-700 text-white font-semibold rounded-lg hover:bg-slate-800 text-sm transition-colors"
              >
                Next → (Enter)
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Keyboard hint */}
      <p className="text-center text-xs text-gray-400 mt-4">
        Enter to check · Esc for Home
      </p>
    </Layout>
  );
}
