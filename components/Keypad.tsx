
import React from 'react';
import { 
  RotateCcw, Delete, Equal, 
  Pi, Divide, X, Minus, Plus, 
  ArrowLeftRight, HelpCircle
} from 'lucide-react';

interface KeypadProps {
  onInput: (value: string) => void;
  onClear: () => void;
  onDelete: () => void;
  onCalculate: () => void;
  onToggleMode: () => void;
  onAskAI: () => void;
  mode: 'DEG' | 'RAD';
}

const Keypad: React.FC<KeypadProps> = ({ 
  onInput, onClear, onDelete, onCalculate, onToggleMode, onAskAI, mode 
}) => {
  const sciKeys = [
    { label: 'sin', value: 'sin(' }, { label: 'cos', value: 'cos(' }, { label: 'tan', value: 'tan(' },
    { label: 'log', value: 'log10(' }, { label: 'ln', value: 'log(' }, { label: '√', value: 'sqrt(' },
    { label: 'x²', value: '^2' }, { label: 'xʸ', value: '^' }, { label: 'exp', value: 'exp(' },
    { label: '(', value: '(' }, { label: ')', value: ')' }, { label: 'abs', value: 'abs(' },
  ];

  const mainKeys = [
    '7', '8', '9', '/',
    '4', '5', '6', '*',
    '1', '2', '3', '-',
    '0', '.', 'π', '+'
  ];

  const btnClass = "flex items-center justify-center p-4 rounded-xl text-lg font-medium transition-all active:scale-95";
  const numBtnClass = `${btnClass} bg-slate-800 text-slate-100 hover:bg-slate-700`;
  const opBtnClass = `${btnClass} bg-indigo-600/20 text-indigo-400 hover:bg-indigo-600/30`;
  const sciBtnClass = `${btnClass} bg-slate-800/40 text-slate-400 hover:bg-slate-700/60 text-sm font-mono`;
  const actionBtnClass = `${btnClass} bg-amber-600/20 text-amber-500 hover:bg-amber-600/30`;
  const equalBtnClass = `${btnClass} bg-indigo-600 text-white hover:bg-indigo-500 shadow-lg shadow-indigo-500/20`;

  return (
    <div className="grid grid-cols-1 gap-6">
      {/* Scientific Functions */}
      <div className="grid grid-cols-4 sm:grid-cols-6 gap-2">
        <button onClick={onToggleMode} className={sciBtnClass}>
          {mode}
        </button>
        {sciKeys.map((key) => (
          <button key={key.label} onClick={() => onInput(key.value)} className={sciBtnClass}>
            {key.label}
          </button>
        ))}
        <button onClick={() => onInput('pi')} className={sciBtnClass}><Pi size={18} /></button>
        <button onClick={() => onInput('e')} className={sciBtnClass}>e</button>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-4 gap-3">
        {/* Row 1 Controls */}
        <button onClick={onClear} className={`${actionBtnClass} text-red-400 hover:bg-red-400/10`}>AC</button>
        <button onClick={onDelete} className={actionBtnClass}><Delete size={20} /></button>
        <button onClick={onAskAI} className={actionBtnClass}><HelpCircle size={20} /></button>
        <button onClick={() => onInput('/')} className={opBtnClass}><Divide size={20} /></button>

        {/* Numeric Keys + Ops */}
        {mainKeys.map((key) => {
          const isOperator = ['/', '*', '-', '+'].includes(key);
          const isSpecial = key === 'π';
          
          let icon = null;
          if (key === '/') icon = <Divide size={20} />;
          if (key === '*') icon = <X size={20} />;
          if (key === '-') icon = <Minus size={20} />;
          if (key === '+') icon = <Plus size={20} />;
          if (key === 'π') icon = <Pi size={20} />;

          return (
            <button
              key={key}
              onClick={() => onInput(key === 'π' ? 'pi' : key)}
              className={isOperator ? opBtnClass : numBtnClass}
            >
              {icon || key}
            </button>
          );
        })}

        {/* Bottom Row */}
        <button onClick={() => onInput('ans')} className={numBtnClass}>ANS</button>
        <button onClick={() => onInput(',')} className={numBtnClass}>,</button>
        <button onClick={onCalculate} className={`${equalBtnClass} col-span-2`}>
          <Equal size={24} />
        </button>
      </div>
    </div>
  );
};

export default Keypad;
