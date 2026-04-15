import { useState } from 'react';
import type { Question } from '../../types';
import { IONS, ION_MAP } from '../../data/ions';

interface Props {
  question: Question;
  onAnswer: (answer: string[], score: number) => void;
}

type ItemState = 'idle' | 'selected' | 'correct' | 'wrong' | 'missed';

export default function ListingQuestion({ question, onAnswer }: Props) {
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState(0);

  const correctSet = new Set(question.correctAnswer as string[]);
  const pool = question.pool ? question.pool.map(id => ION_MAP[id]).filter(Boolean) : IONS;

  const toggle = (id: string) => {
    if (submitted) return;
    setSelected(prev => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const handleSubmit = () => {
    const correctSel = [...selected].filter(id => correctSet.has(id)).length;
    const wrongSel = [...selected].filter(id => !correctSet.has(id)).length;
    const s = Math.max(0, (correctSel - wrongSel) / correctSet.size);
    setScore(s);
    setSubmitted(true);
    onAnswer([...selected], s);
  };

  const getState = (id: string): ItemState => {
    if (!submitted) return selected.has(id) ? 'selected' : 'idle';
    const inCorrect = correctSet.has(id);
    const inSelected = selected.has(id);
    if (inSelected && inCorrect) return 'correct';
    if (inSelected && !inCorrect) return 'wrong';
    if (!inSelected && inCorrect) return 'missed';
    return 'idle';
  };

  const correctSel = submitted ? [...selected].filter(id => correctSet.has(id)).length : 0;
  const wrongSel = submitted ? [...selected].filter(id => !correctSet.has(id)).length : 0;
  const missedCount = submitted ? [...correctSet].filter(id => !selected.has(id)).length : 0;

  const itemClass: Record<ItemState, string> = {
    idle: 'bg-white border-gray-200 hover:border-blue-400 hover:bg-blue-50',
    selected: 'bg-blue-50 border-blue-500 ring-1 ring-blue-500',
    correct: 'bg-green-50 border-green-500',
    wrong: 'bg-red-50 border-red-400',
    missed: 'bg-amber-50 border-amber-500',
  };

  return (
    <div className="space-y-4">
      <p className="text-sm text-gray-500">
        Select every ion that belongs to this group — then press <strong>Submit</strong>.
      </p>

      <div className="max-h-[52vh] overflow-y-auto border border-gray-200 rounded-lg divide-y divide-gray-100">
        {pool.map(ion => {
          const st = getState(ion.id);
          return (
            <button
              key={ion.id}
              onClick={() => toggle(ion.id)}
              disabled={submitted}
              className={`w-full flex items-center gap-3 px-4 py-2.5 text-left transition-colors border-l-4 ${itemClass[st]}`}
            >
              <span className="text-sm font-mono font-bold text-slate-800 w-28 flex-shrink-0">
                {ion.symbol}
              </span>
              <span className="text-sm text-gray-600">{ion.name}</span>
              {submitted && st === 'correct' && <span className="ml-auto text-green-600 font-bold">✓</span>}
              {submitted && st === 'wrong' && <span className="ml-auto text-red-500 font-bold">✗</span>}
              {submitted && st === 'missed' && <span className="ml-auto text-amber-600 font-bold">!</span>}
            </button>
          );
        })}
      </div>

      {!submitted && (
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-500">{selected.size} selected</span>
          <button
            onClick={handleSubmit}
            disabled={selected.size === 0}
            className="px-6 py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          >
            Submit Selection
          </button>
        </div>
      )}

      {submitted && (
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 space-y-2">
          <div className="flex items-center gap-3 flex-wrap">
            <span className="text-2xl font-bold text-slate-800">
              {Math.round(score * 100)}%
            </span>
            <span className="text-sm text-green-700 bg-green-100 px-2 py-0.5 rounded-full">
              ✓ {correctSel} correct
            </span>
            {wrongSel > 0 && (
              <span className="text-sm text-red-700 bg-red-100 px-2 py-0.5 rounded-full">
                ✗ {wrongSel} wrong
              </span>
            )}
            {missedCount > 0 && (
              <span className="text-sm text-amber-700 bg-amber-100 px-2 py-0.5 rounded-full">
                ! {missedCount} missed
              </span>
            )}
          </div>
          <div className="flex gap-4 text-xs text-gray-500">
            <span><span className="inline-block w-2 h-2 rounded bg-green-400 mr-1"/>Correct selection</span>
            <span><span className="inline-block w-2 h-2 rounded bg-red-400 mr-1"/>Wrong selection</span>
            <span><span className="inline-block w-2 h-2 rounded bg-amber-400 mr-1"/>Missed</span>
          </div>
        </div>
      )}
    </div>
  );
}
