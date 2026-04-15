import { useMemo, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../components/Layout';
import ProgressBar from '../components/ProgressBar';
import QuestionCard from '../components/questions/QuestionCard';
import { generateAllQuestions } from '../data/questions';
import { extraQuestions } from '../data/extraQuestions';
import { shuffle } from '../utils/shuffle';
import { useQuiz } from '../context/QuizContext';
import { useTimer } from '../hooks/useTimer';
import type { Answer } from '../types';

export default function Phase4() {
  const navigate = useNavigate();
  const { state, update } = useQuiz();
  const p4 = state.phase4;

  // Generate deterministic question set on mount (options may re-shuffle each load — that's fine)
  const allQuestions = useMemo(() => {
    const qs = [...generateAllQuestions(), ...extraQuestions];
    return Object.fromEntries(qs.map(q => [q.id, q]));
  }, []);

  const allIds = useMemo(() => Object.keys(allQuestions), [allQuestions]);

  const { formatted: timerStr } = useTimer(!p4.completed);

  // Initialize or resume
  useEffect(() => {
    if (!p4.started) {
      const shuffledIds = shuffle([...allIds]);
      update({
        phase4: {
          ...p4,
          started: true,
          questionIds: shuffledIds,
          currentIndex: 0,
          answers: {},
          startTime: Date.now(),
          endTime: null,
          isRetry: false,
        },
      });
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const questionIds = p4.questionIds.length > 0 ? p4.questionIds : allIds;
  const currentId = questionIds[p4.currentIndex];
  const question = currentId ? allQuestions[currentId] : null;
  const total = questionIds.length;
  const answered = p4.answers;

  // Score calculation
  const score = useMemo(() => {
    const vals = Object.values(answered);
    if (vals.length === 0) return 0;
    const pts = vals.reduce((sum, a) => {
      if (a.partialScore !== undefined) return sum + a.partialScore;
      return sum + (a.correct ? 1 : 0);
    }, 0);
    return Math.round((pts / vals.length) * 100);
  }, [answered]);

  const handleAnswered = useCallback((answer: Answer) => {
    update({
      phase4: {
        ...p4,
        answers: { ...p4.answers, [answer.questionId]: answer },
      },
    });
  }, [p4, update]);

  const handleNext = useCallback(() => {
    const nextIdx = p4.currentIndex + 1;
    if (nextIdx >= total) {
      const endTime = Date.now();
      const timeSec = p4.startTime ? Math.floor((endTime - p4.startTime) / 1000) : 0;
      const allAns = Object.values(p4.answers);
      const pts = allAns.reduce((sum, a) => {
        if (a.partialScore !== undefined) return sum + a.partialScore;
        return sum + (a.correct ? 1 : 0);
      }, 0);
      const pct = Math.round((pts / allAns.length) * 100);
      const newBestScore = state.bestScore === null ? pct : Math.max(state.bestScore, pct);
      const newBestTime = state.bestTime === null ? timeSec : (pct >= (state.bestScore ?? 0) ? timeSec : state.bestTime);

      update({
        phase4: { ...p4, completed: true, currentIndex: nextIdx, endTime },
        bestScore: newBestScore,
        bestTime: newBestTime,
      });
      navigate('/results');
    } else {
      update({ phase4: { ...p4, currentIndex: nextIdx } });
    }
  }, [p4, total, state, update, navigate]);

  useEffect(() => {
    if (p4.completed) navigate('/results');
  }, [p4.completed, navigate]);

  if (!question || !p4.started) {
    return (
      <Layout>
        <div className="flex items-center justify-center h-64">
          <div className="text-gray-400">Loading questions…</div>
        </div>
      </Layout>
    );
  }

  const answeredCount = Object.keys(answered).length;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Sticky top bar */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-2xl mx-auto px-4 py-3 flex items-center gap-4">
          <button
            onClick={() => navigate('/')}
            className="text-gray-400 hover:text-gray-600 text-sm flex-shrink-0"
          >
            ← Home
          </button>
          <div className="flex-1">
            <ProgressBar value={answeredCount / total} />
          </div>
          <span className="text-xs font-mono text-gray-500 flex-shrink-0 tabular-nums">
            ⏱ {timerStr}
          </span>
          <span className="text-xs font-semibold text-blue-700 flex-shrink-0">
            {score}%
          </span>
        </div>
        <div className="max-w-2xl mx-auto px-4 pb-1">
          <span className="text-xs text-gray-400">
            Q {p4.currentIndex + 1} / {total}
          </span>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 py-6">
        <div className="animate-fade">
          <QuestionCard
            key={currentId}
            question={question}
            onAnswered={handleAnswered}
            onNext={handleNext}
            questionNum={p4.currentIndex + 1}
            total={total}
          />
        </div>
      </div>
    </div>
  );
}
