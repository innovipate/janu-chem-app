import { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../components/Layout';
import { useQuiz } from '../context/QuizContext';
import { generateAllQuestions } from '../data/questions';
import { extraQuestions } from '../data/extraQuestions';
import { shuffle } from '../utils/shuffle';
import type { Question } from '../types';

const TYPE_LABELS: Record<string, string> = {
  'name-to-formula':    'Name → Formula',
  'formula-to-name':    'Formula → Name',
  'charge-select':      'Charge Select',
  'fill-charge':        'Fill Charge',
  'mcq-formula':        'MCQ Formula',
  'mcq-name':           'MCQ Name',
  'true-false-charge':  'True/False Charge',
  'true-false-formula': 'True/False Formula',
  'odd-one-out':        'Odd One Out',
  'cation-or-anion':    'Cation or Anion',
  'mono-or-poly':       'Mono or Poly',
  'oxygen-count':       'Oxygen Count',
  'listing':            'Listing',
};

function grade(pct: number) {
  if (pct >= 90) return { letter: 'A', color: 'text-green-600' };
  if (pct >= 80) return { letter: 'B', color: 'text-blue-600' };
  if (pct >= 70) return { letter: 'C', color: 'text-yellow-600' };
  if (pct >= 60) return { letter: 'D', color: 'text-orange-500' };
  return { letter: 'F', color: 'text-red-600' };
}

function fmt(s: number | null) {
  if (s === null) return '--:--';
  return `${String(Math.floor(s / 60)).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}`;
}

export default function Results() {
  const navigate = useNavigate();
  const { state, update } = useQuiz();
  const p4 = state.phase4;

  const questionMap = useMemo(() => {
    const qs = [...generateAllQuestions(), ...extraQuestions];
    return Object.fromEntries(qs.map(q => [q.id, q]));
  }, []);

  const answers = p4.answers;

  const timeSec = p4.startTime && p4.endTime
    ? Math.floor((p4.endTime - p4.startTime) / 1000)
    : null;

  const { score, wrongIds } = useMemo(() => {
    const vals = Object.values(answers);
    if (!vals.length) return { score: 0, wrongIds: [] };
    const pts = vals.reduce((s, a) => s + (a.partialScore ?? (a.correct ? 1 : 0)), 0);
    const pct = Math.round((pts / vals.length) * 100);
    const wrong = vals.filter(a => !a.correct || (a.partialScore !== undefined && a.partialScore < 1)).map(a => a.questionId);
    return { score: pct, wrongIds: wrong };
  }, [answers]);

  // Breakdown by type
  const byType = useMemo(() => {
    const map: Record<string, { correct: number; total: number }> = {};
    for (const [qid, ans] of Object.entries(answers)) {
      const q = questionMap[qid];
      if (!q) continue;
      const t = q.type;
      if (!map[t]) map[t] = { correct: 0, total: 0 };
      map[t].total++;
      if (ans.correct) map[t].correct++;
    }
    return map;
  }, [answers, questionMap]);

  const wrongQuestions: { q: Question; userAns: string; correctAns: string }[] = useMemo(() => {
    return wrongIds
      .map(id => {
        const q = questionMap[id];
        const ans = answers[id];
        if (!q || !ans) return null;
        const userAns = Array.isArray(ans.userAnswer)
          ? `${(ans.userAnswer as string[]).length} selected (${Math.round((ans.partialScore ?? 0) * 100)}%)`
          : String(ans.userAnswer);
        const correctAns = Array.isArray(q.correctAnswer)
          ? `${(q.correctAnswer as string[]).length} ions`
          : String(q.correctAnswer);
        return { q, userAns, correctAns };
      })
      .filter(Boolean) as typeof wrongQuestions;
  }, [wrongIds, questionMap, answers]);

  const { letter, color } = grade(score);

  const handleRetryMissed = () => {
    if (!wrongIds.length) return;
    const shuffledWrong = shuffle([...wrongIds]);
    update({
      phase4: {
        started: true,
        completed: false,
        questionIds: shuffledWrong,
        currentIndex: 0,
        answers: {},
        startTime: Date.now(),
        endTime: null,
        isRetry: true,
      },
    });
    navigate('/phase/4');
  };

  const handleRestart = () => {
    update({
      phase4: {
        started: false,
        completed: false,
        questionIds: [],
        currentIndex: 0,
        answers: {},
        startTime: null,
        endTime: null,
        isRetry: false,
      },
    });
    navigate('/phase/4');
  };

  return (
    <Layout>
      {/* Score hero */}
      <div className="text-center mb-8">
        <div className="text-5xl mb-2">📊</div>
        <h1 className="text-2xl font-extrabold text-slate-800">Phase 4 Results</h1>
        {p4.isRetry && <p className="text-sm text-amber-600 mt-1">Retry session</p>}
        <div className="mt-4 flex items-end justify-center gap-2">
          <span className={`text-7xl font-extrabold ${color}`}>{letter}</span>
          <span className="text-4xl font-bold text-slate-700 mb-1">{score}%</span>
        </div>
        <p className="text-gray-500 text-sm mt-2">
          {Object.keys(answers).length} questions answered
          {timeSec !== null && ` · ${fmt(timeSec)}`}
        </p>
      </div>

      {/* Type breakdown */}
      <div className="bg-white border border-gray-200 rounded-2xl p-5 mb-6">
        <h2 className="font-bold text-slate-700 mb-4">By Question Type</h2>
        <div className="space-y-3">
          {Object.entries(byType).map(([type, { correct, total }]) => {
            const pct = Math.round((correct / total) * 100);
            return (
              <div key={type}>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-600">{TYPE_LABELS[type] ?? type}</span>
                  <span className="font-semibold text-slate-700">{correct}/{total} ({pct}%)</span>
                </div>
                <div className="w-full bg-gray-100 rounded-full h-1.5">
                  <div
                    className={`h-1.5 rounded-full ${pct >= 80 ? 'bg-green-500' : pct >= 60 ? 'bg-yellow-400' : 'bg-red-400'}`}
                    style={{ width: `${pct}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Wrong answers */}
      {wrongQuestions.length > 0 && (
        <div className="bg-white border border-gray-200 rounded-2xl p-5 mb-6">
          <h2 className="font-bold text-slate-700 mb-4 flex items-center gap-2">
            <span className="text-red-500">✗</span>
            {wrongQuestions.length} Incorrect Answer{wrongQuestions.length > 1 ? 's' : ''}
          </h2>
          <div className="space-y-3 max-h-96 overflow-y-auto">
            {wrongQuestions.map(({ q, userAns, correctAns }) => (
              <div key={q.id} className="border border-gray-100 rounded-lg p-3 text-sm">
                <p className="text-gray-600 font-medium mb-1 line-clamp-2">{q.prompt}</p>
                <div className="flex flex-wrap gap-x-6 gap-y-1 text-xs">
                  <span className="text-red-600">
                    Your answer: <strong>{userAns || '(blank)'}</strong>
                  </span>
                  <span className="text-green-700">
                    Correct: <strong>{correctAns}</strong>
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Actions */}
      <div className="flex flex-col sm:flex-row gap-3">
        {wrongIds.length > 0 && (
          <button
            onClick={handleRetryMissed}
            className="flex-1 py-3 bg-amber-500 text-white font-bold rounded-xl hover:bg-amber-600 transition-colors"
          >
            Retry Missed Only ({wrongIds.length})
          </button>
        )}
        <button
          onClick={handleRestart}
          className="flex-1 py-3 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 transition-colors"
        >
          Restart Full Test
        </button>
        <button
          onClick={() => navigate('/')}
          className="flex-1 py-3 bg-white border-2 border-gray-200 text-slate-700 font-bold rounded-xl hover:border-gray-400 transition-colors"
        >
          Home
        </button>
      </div>
    </Layout>
  );
}
