import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../components/Layout';
import ProgressBar from '../components/ProgressBar';
import { IONS } from '../data/ions';
import { shuffle } from '../utils/shuffle';
import { formatCharge } from '../utils/normalize';
import { useQuiz } from '../context/QuizContext';

const CHARGES = [-3, -2, -1, 1, 2, 3, 4];

export default function Phase3() {
  const navigate = useNavigate();
  const { update } = useQuiz();

  const [ions] = useState(() => shuffle([...IONS]));
  const [idx, setIdx] = useState(0);
  const [score, setScore] = useState(0);
  const [answered, setAnswered] = useState(false);
  const [chosenCharge, setChosenCharge] = useState<number | null>(null);
  const [showFormula, setShowFormula] = useState(false); // alternate name/formula

  const ion = ions[idx];
  const total = ions.length;
  const correct = ion?.charge;

  const advance = useCallback(() => {
    const nextIdx = idx + 1;
    if (nextIdx >= total) {
      update({ phase3: { completed: true } });
      navigate('/');
    } else {
      setIdx(nextIdx);
      setAnswered(false);
      setChosenCharge(null);
      setShowFormula(prev => !prev);
    }
  }, [idx, total, update, navigate]);

  const handleCharge = (c: number) => {
    if (answered) return;
    setChosenCharge(c);
    setAnswered(true);
    if (c === correct) setScore(s => s + 1);
  };

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') navigate('/');
      if (answered && (e.key === 'Enter' || e.key === 'ArrowRight')) advance();
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [answered, advance, navigate]);

  if (!ion) return null;

  const isCorrectChoice = chosenCharge === correct;

  return (
    <Layout>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <button onClick={() => navigate('/')} className="text-gray-400 hover:text-gray-600 text-sm">
          ← Home
        </button>
        <h1 className="text-sm font-bold text-slate-600 uppercase tracking-wide">Phase 3 — Charge Drill</h1>
        <span className="text-sm font-semibold text-blue-700">{score}/{total}</span>
      </div>

      <div className="mb-6">
        <ProgressBar value={idx / total} label={`${idx + 1} of ${total}`} />
      </div>

      {/* Card */}
      <div className={`bg-white rounded-2xl border-2 shadow-sm p-8 text-center mb-6 transition-colors ${
        !answered ? 'border-gray-200' : isCorrectChoice ? 'border-green-500 bg-green-50' : 'border-red-400 bg-red-50'
      }`}>
        <p className="text-xs uppercase tracking-widest text-gray-400 mb-2">
          {showFormula ? 'Formula' : 'Name'} — What is the charge?
        </p>
        <p className="text-4xl font-bold text-slate-800 min-h-[3rem] flex items-center justify-center">
          {showFormula ? ion.symbol : ion.name}
        </p>
        {answered && (
          <p className="mt-4 text-sm font-medium">
            {isCorrectChoice
              ? <span className="text-green-700">✓ Correct! Charge is {formatCharge(correct)}</span>
              : <span className="text-red-600">✗ Correct charge: <strong>{formatCharge(correct)}</strong></span>
            }
          </p>
        )}
      </div>

      {/* Charge buttons */}
      <div className="flex flex-wrap justify-center gap-3 mb-6">
        {CHARGES.map(c => {
          let cls = 'px-5 py-3 rounded-xl font-bold text-lg border-2 transition-all ';
          if (!answered) {
            cls += 'bg-white border-gray-200 hover:border-blue-500 hover:bg-blue-50 cursor-pointer';
          } else if (c === correct) {
            cls += 'bg-green-500 border-green-500 text-white';
          } else if (c === chosenCharge && c !== correct) {
            cls += 'bg-red-400 border-red-400 text-white';
          } else {
            cls += 'bg-gray-100 border-gray-200 text-gray-400 cursor-default';
          }
          return (
            <button key={c} onClick={() => handleCharge(c)} disabled={answered} className={cls}>
              {formatCharge(c)}
            </button>
          );
        })}
      </div>

      {answered && (
        <button
          onClick={advance}
          className="w-full py-3 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 transition-colors"
        >
          {idx + 1 < total ? 'Next →' : 'Finish Phase 3'}
        </button>
      )}

      <p className="text-center text-xs text-gray-400 mt-4">
        {answered ? 'Enter / → to continue · Esc for Home' : 'Click a charge · Esc for Home'}
      </p>
    </Layout>
  );
}
