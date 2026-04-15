import { useNavigate } from 'react-router-dom';
import Layout from '../components/Layout';
import { useQuiz } from '../context/QuizContext';

const PHASES = [
  { n: 1, title: 'Flashcards: Name → Formula', desc: 'Type the formula given the ion name', route: '/phase/1' },
  { n: 2, title: 'Flashcards: Formula → Name', desc: 'Type the name given the ion formula', route: '/phase/2' },
  { n: 3, title: 'Charge Drill', desc: 'Click the charge for each ion shown', route: '/phase/3' },
  { n: 4, title: 'Full Test', desc: '220+ mixed questions — all types combined', route: '/phase/4' },
];

function formatTime(s: number | null) {
  if (s === null) return null;
  return `${String(Math.floor(s / 60)).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}`;
}

export default function Home() {
  const navigate = useNavigate();
  const { state, resetAll } = useQuiz();

  const completed = [
    state.phase1.completed,
    state.phase2.completed,
    state.phase3.completed,
    state.phase4.completed,
  ];

  const inProgress = [
    !state.phase1.completed && state.phase1.currentGroupIndex > 0,
    !state.phase2.completed && state.phase2.currentGroupIndex > 0,
    !state.phase3.completed,
    !state.phase4.completed && state.phase4.started,
  ];

  const unlocked = [true, completed[0], completed[1], completed[2]];

  const handleReset = () => {
    if (confirm('Reset all progress? This cannot be undone.')) resetAll();
  };

  return (
    <Layout>
      {/* Hero */}
      <div className="text-center mb-10">
        <div className="text-5xl mb-3">⚗️</div>
        <h1 className="text-3xl font-extrabold text-slate-800 tracking-tight">Ion Quiz</h1>
        <p className="text-gray-500 mt-2">Ionic compounds — names, formulas, charges</p>
        {state.bestScore !== null && (
          <div className="mt-4 inline-flex items-center gap-4 bg-blue-50 border border-blue-200 rounded-xl px-5 py-2 text-sm">
            <span className="text-blue-700 font-semibold">🏆 Best score: {state.bestScore}%</span>
            {state.bestTime !== null && (
              <span className="text-blue-600">⏱ {formatTime(state.bestTime)}</span>
            )}
          </div>
        )}
      </div>

      {/* Phase cards */}
      <div className="space-y-4">
        {PHASES.map((p, idx) => {
          const isLocked = !unlocked[idx];
          const isDone = completed[idx];
          const isInProg = inProgress[idx] && !isDone;

          let statusBadge = (
            <span className="text-xs font-semibold bg-gray-100 text-gray-400 px-3 py-1 rounded-full">
              Locked 🔒
            </span>
          );
          if (!isLocked && isDone) {
            statusBadge = (
              <span className="text-xs font-semibold bg-green-100 text-green-700 px-3 py-1 rounded-full">
                Completed ✓
              </span>
            );
          } else if (!isLocked && isInProg) {
            statusBadge = (
              <span className="text-xs font-semibold bg-amber-100 text-amber-700 px-3 py-1 rounded-full">
                In Progress →
              </span>
            );
          } else if (!isLocked) {
            statusBadge = (
              <span className="text-xs font-semibold bg-blue-100 text-blue-700 px-3 py-1 rounded-full">
                Start
              </span>
            );
          }

          return (
            <button
              key={p.n}
              disabled={isLocked}
              onClick={() => navigate(p.route)}
              className={`w-full text-left bg-white rounded-2xl border-2 p-5 transition-all ${
                isLocked
                  ? 'border-gray-100 opacity-50 cursor-not-allowed'
                  : isDone
                  ? 'border-green-200 hover:border-green-400 hover:shadow-md'
                  : 'border-gray-200 hover:border-blue-400 hover:shadow-md'
              }`}
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-start gap-4">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center font-extrabold text-lg flex-shrink-0 ${
                    isDone ? 'bg-green-500 text-white' : isLocked ? 'bg-gray-200 text-gray-400' : 'bg-blue-600 text-white'
                  }`}>
                    {isDone ? '✓' : p.n}
                  </div>
                  <div>
                    <h2 className="font-bold text-slate-800">{p.title}</h2>
                    <p className="text-sm text-gray-500 mt-0.5">{p.desc}</p>
                    {p.n === 4 && state.bestScore !== null && (
                      <p className="text-xs text-blue-600 mt-1 font-medium">
                        Best: {state.bestScore}% {state.bestTime !== null ? `· ${formatTime(state.bestTime)}` : ''}
                      </p>
                    )}
                  </div>
                </div>
                {statusBadge}
              </div>
            </button>
          );
        })}
      </div>

      {/* Footer */}
      <div className="mt-10 flex justify-center">
        <button
          onClick={handleReset}
          className="text-sm text-gray-400 hover:text-red-500 underline underline-offset-2 transition-colors"
        >
          Reset All Progress
        </button>
      </div>
    </Layout>
  );
}
