import { useRef, useEffect } from 'react';
import { formatFormula } from '../utils/formatFormula';

interface Props {
  value: string;
  onChange: (v: string) => void;
  onSubmit: () => void;
  disabled?: boolean;
  feedback?: 'correct' | 'wrong' | null;  // null = not yet submitted
  autoFocus?: boolean;
}

export default function FormulaInput({
  value, onChange, onSubmit, disabled = false, feedback = null, autoFocus = true,
}: Props) {
  const ref = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (autoFocus && !disabled) setTimeout(() => ref.current?.focus(), 40);
  }, [autoFocus, disabled]);

  const preview = value.trim() ? formatFormula(value) : '';

  const borderClass =
    feedback === null  ? 'border-gray-300 focus-within:border-blue-500 bg-white' :
    feedback === 'correct' ? 'border-green-500 bg-green-50' :
                             'border-red-400 bg-red-50';

  return (
    <div className="space-y-2">
      {/* Input row */}
      <div className={`flex rounded-xl border-2 overflow-hidden transition-colors ${borderClass}`}>
        <input
          ref={ref}
          value={value}
          onChange={e => onChange(e.target.value)}
          onKeyDown={e => {
            if (e.key === 'Enter') { e.preventDefault(); onSubmit(); }
          }}
          disabled={disabled}
          placeholder="Type formula…"
          className="flex-1 px-4 py-3 text-base bg-transparent outline-none text-slate-800 placeholder-gray-400 font-mono"
          spellCheck={false}
          autoCapitalize="off"
          autoComplete="off"
          autoCorrect="off"
        />
        {!disabled && (
          <button
            onClick={onSubmit}
            disabled={!value.trim()}
            className="px-5 bg-blue-600 text-white font-bold hover:bg-blue-700 disabled:opacity-40 transition-colors text-lg"
            tabIndex={-1}
          >
            ✓
          </button>
        )}
      </div>

      {/* Live preview */}
      {preview && (
        <div className="flex items-center gap-2 px-1">
          <span className="text-xs text-gray-400 flex-shrink-0">Preview:</span>
          <span className="text-base font-semibold text-blue-700 font-mono tracking-wide">
            {preview}
          </span>
        </div>
      )}

      {/* Typing guide — collapsed by default, expands on ? hover/click */}
      <details className="group">
        <summary className="text-xs text-gray-400 cursor-pointer select-none list-none flex items-center gap-1 hover:text-gray-600">
          <span className="inline-block w-4 h-4 rounded-full border border-gray-300 text-center leading-4 text-gray-400 group-open:text-blue-600 group-open:border-blue-400">?</span>
          How to type formulas
        </summary>
        <div className="mt-2 rounded-lg bg-slate-50 border border-slate-200 px-3 py-2 text-xs text-slate-600 space-y-1">
          <p className="font-semibold text-slate-700 mb-1">Typing guide (Mac keyboard)</p>
          <div className="grid grid-cols-2 gap-x-4 gap-y-0.5">
            <span>Type <code className="bg-white px-1 rounded border">Li+</code></span>        <span>→ Li⁺</span>
            <span>Type <code className="bg-white px-1 rounded border">Mg 2+</code></span>      <span>→ Mg²⁺</span>
            <span>Type <code className="bg-white px-1 rounded border">NO2 -</code></span>      <span>→ NO₂⁻</span>
            <span>Type <code className="bg-white px-1 rounded border">CO3 2-</code></span>     <span>→ CO₃²⁻</span>
            <span>Type <code className="bg-white px-1 rounded border">NH4 +</code></span>      <span>→ NH₄⁺</span>
            <span>Type <code className="bg-white px-1 rounded border">Fe(CN)6 3-</code></span> <span>→ Fe(CN)₆³⁻</span>
          </div>
          <p className="text-gray-500 mt-1 leading-snug">
            <strong>Rule:</strong> numbers in the formula → subscript automatically.
            Add a <strong>space</strong> before the charge (e.g. <code className="bg-white px-0.5 rounded">NO2&nbsp;-</code>)
            to separate formula numbers from the charge number.
          </p>
        </div>
      </details>
    </div>
  );
}
