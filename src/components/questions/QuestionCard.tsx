import { useState, useEffect, useRef, useCallback } from 'react';
import type { Question, Answer } from '../../types';
import { checkFormula, checkName } from '../../utils/normalize';
import ListingQuestion from './ListingQuestion';

interface Props {
  question: Question;
  onAnswered: (answer: Answer) => void;
  onNext: () => void;
  questionNum: number;
  total: number;
}

const CHARGES = ['-3', '-2', '-1', '+1', '+2', '+3', '+4'];

export default function QuestionCard({ question, onAnswered, onNext, questionNum, total }: Props) {
  const [input, setInput] = useState('');
  const [selected, setSelected] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  // Guard: safeNext fires onNext exactly once per question
  const firedRef   = useRef(false);
  const timerRef   = useRef<ReturnType<typeof setTimeout> | null>(null);
  // Stable ref so the global keydown handler always reads the latest submitted state
  const submittedRef = useRef(false);
  submittedRef.current = submitted;

  useEffect(() => {
    setInput('');
    setSelected(null);
    setSubmitted(false);
    setIsCorrect(false);
    firedRef.current = false;
    if (timerRef.current) { clearTimeout(timerRef.current); timerRef.current = null; }
    setTimeout(() => inputRef.current?.focus(), 40);
  }, [question.id]);

  useEffect(() => () => { if (timerRef.current) clearTimeout(timerRef.current); }, []);

  const safeNext = useCallback(() => {
    if (firedRef.current) return;
    firedRef.current = true;
    if (timerRef.current) { clearTimeout(timerRef.current); timerRef.current = null; }
    onNext();
  }, [onNext]);

  // Global handler: Escape only + ArrowRight to advance after submission.
  // Uses refs so it never needs to be re-registered when state changes.
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') { window.location.href = '/'; return; }
      if (e.key === 'ArrowRight' && submittedRef.current) safeNext();
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [safeNext]); // only re-register when safeNext identity changes (i.e. when question changes)

  // ── Text-input submit ──────────────────────────────────────────────────────
  const submitText = () => {
    if (submitted || !input.trim()) return;
    const correct = question.type === 'name-to-formula'
      ? checkFormula(input, question.correctAnswer as string)
      : checkName(input, question.correctAnswer as string);
    setIsCorrect(correct);
    setSubmitted(true);
    onAnswered({ questionId: question.id, userAnswer: input, correct });
    if (correct) {
      timerRef.current = setTimeout(safeNext, 800);
    }
  };

  // ── Option-button submit ───────────────────────────────────────────────────
  const submitOption = (opt: string) => {
    if (submitted) return;
    const correct = opt === (question.correctAnswer as string);
    setSelected(opt);
    setIsCorrect(correct);
    setSubmitted(true);
    onAnswered({ questionId: question.id, userAnswer: opt, correct });
    if (correct) {
      timerRef.current = setTimeout(safeNext, 700);
    }
  };

  // ── Listing submit ─────────────────────────────────────────────────────────
  const handleListingAnswer = (answer: string[], score: number) => {
    const correct = score >= 1;
    onAnswered({ questionId: question.id, userAnswer: answer, correct, partialScore: score });
  };

  // ── Style helpers ──────────────────────────────────────────────────────────
  const optionClass = (opt: string) => {
    const base = 'px-4 py-3 rounded-lg border-2 text-sm font-semibold transition-all text-left';
    if (!submitted)
      return `${base} border-gray-200 hover:border-blue-500 hover:bg-blue-50 bg-white cursor-pointer`;
    const ca = question.correctAnswer as string;
    if (opt === ca) return `${base} border-green-500 bg-green-100 text-green-800`;
    if (opt === selected && opt !== ca) return `${base} border-red-400 bg-red-100 text-red-800`;
    return `${base} border-gray-200 bg-gray-50 text-gray-400`;
  };

  const inputBorderClass = () => {
    if (!submitted) return 'border-gray-300 focus-within:border-blue-500';
    return isCorrect ? 'border-green-500 bg-green-50' : 'border-red-400 bg-red-50';
  };

  const { type, prompt, options, correctAnswer } = question;
  const isText   = type === 'name-to-formula' || type === 'formula-to-name';
  const isCharge = type === 'charge-select' || type === 'fill-charge';
  const isTF     = type === 'true-false-charge' || type === 'true-false-formula';
  const isOxygen = type === 'oxygen-count';
  const isMCQ    = type === 'mcq-formula' || type === 'mcq-name' || type === 'odd-one-out' ||
                   type === 'cation-or-anion' || type === 'mono-or-poly';

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 space-y-5">
      {/* Q counter */}
      <div className="flex items-center gap-2">
        <span className="text-xs font-semibold text-gray-400 uppercase tracking-wide">
          Q {questionNum} / {total}
        </span>
        <span className="text-xs bg-slate-100 text-slate-500 px-2 py-0.5 rounded-full capitalize">
          {type.replace(/-/g, ' ')}
        </span>
      </div>

      {/* Prompt */}
      <p className="text-lg font-semibold text-slate-800 leading-snug">{prompt}</p>

      {/* ── Text input ──────────────────────────────────────────────────────── */}
      {isText && (
        <div className="space-y-3">
          <div className={`flex rounded-lg border-2 overflow-hidden transition-colors ${inputBorderClass()}`}>
            <input
              ref={inputRef}
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => {
                // Only fire submitText here; stopPropagation keeps the
                // window handler from seeing the same Enter key press.
                if (e.key === 'Enter' && !submitted) {
                  e.stopPropagation();
                  submitText();
                }
              }}
              disabled={submitted}
              placeholder={type === 'name-to-formula' ? 'Type formula…' : 'Type name…'}
              className="flex-1 px-4 py-3 text-base bg-transparent outline-none text-slate-800 placeholder-gray-400"
              spellCheck={false}
              autoComplete="off"
            />
            {!submitted && (
              <button
                type="button"
                onClick={submitText}
                disabled={!input.trim()}
                className="px-4 bg-blue-600 text-white font-semibold hover:bg-blue-700 disabled:opacity-40 transition-colors"
              >
                Check
              </button>
            )}
          </div>
          {submitted && !isCorrect && (
            <div className="flex items-start gap-2 text-sm bg-red-50 border border-red-200 rounded-lg px-3 py-2">
              <span className="text-red-500 mt-0.5">✗</span>
              <span className="text-gray-700">
                Correct answer: <strong className="text-slate-800">{correctAnswer as string}</strong>
              </span>
            </div>
          )}
          {submitted && isCorrect && (
            <p className="text-sm text-green-700 flex items-center gap-1">✓ Correct!</p>
          )}
        </div>
      )}

      {/* ── Charge buttons ──────────────────────────────────────────────────── */}
      {isCharge && (
        <div className="space-y-3">
          <div className="flex flex-wrap gap-2">
            {CHARGES.map(c => (
              <button type="button" key={c} onClick={() => submitOption(c)} className={optionClass(c)}>
                {c}
              </button>
            ))}
          </div>
          {submitted && !isCorrect && (
            <p className="text-sm text-red-700">
              Correct: <strong>{correctAnswer as string}</strong>
            </p>
          )}
        </div>
      )}

      {/* ── True / False ────────────────────────────────────────────────────── */}
      {isTF && (
        <div className="space-y-3">
          <div className="flex gap-3">
            {['True', 'False'].map(opt => (
              <button type="button" key={opt} onClick={() => submitOption(opt)} className={`flex-1 ${optionClass(opt)}`}>
                {opt}
              </button>
            ))}
          </div>
          {submitted && !isCorrect && (
            <p className="text-sm text-red-700">
              Correct: <strong>{correctAnswer as string}</strong>
            </p>
          )}
        </div>
      )}

      {/* ── MCQ + oxygen-count ──────────────────────────────────────────────── */}
      {(isMCQ || isOxygen) && options && (
        <div className="space-y-3">
          <div className="grid grid-cols-2 gap-3">
            {options.map(opt => (
              <button type="button" key={opt} onClick={() => submitOption(opt)} className={optionClass(opt)}>
                {opt}
              </button>
            ))}
          </div>
          {submitted && !isCorrect && (
            <p className="text-sm text-red-700">
              Correct: <strong>{correctAnswer as string}</strong>
            </p>
          )}
        </div>
      )}

      {/* ── Listing ─────────────────────────────────────────────────────────── */}
      {type === 'listing' && (
        <ListingQuestion question={question} onAnswer={handleListingAnswer} />
      )}

      {/* ── Next button (wrong answers + listing) ───────────────────────────── */}
      {submitted && !isCorrect && type !== 'listing' && (
        <button
          type="button"
          onClick={safeNext}
          className="w-full py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors"
        >
          Next → <span className="text-blue-200 text-xs ml-1">(or →)</span>
        </button>
      )}
      {submitted && type === 'listing' && (
        <button
          type="button"
          onClick={safeNext}
          className="w-full py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors"
        >
          Next Question →
        </button>
      )}
    </div>
  );
}
