
import React from 'react';

interface DisplayProps {
  expression: string;
  result: string;
  error?: string;
}

const Display: React.FC<DisplayProps> = ({ expression, result, error }) => {
  return (
    <div className="w-full bg-slate-900/50 p-6 rounded-2xl border border-slate-700/50 flex flex-col items-end justify-end mb-6 shadow-inner min-h-[140px]">
      <div className="text-slate-400 text-sm mb-1 mono h-6 overflow-hidden whitespace-nowrap overflow-ellipsis w-full text-right">
        {expression}
      </div>
      <div className="text-4xl font-bold mono tracking-tight text-white overflow-hidden whitespace-nowrap overflow-ellipsis w-full text-right">
        {error ? (
          <span className="text-red-400 text-lg uppercase tracking-widest">{error}</span>
        ) : (
          result || '0'
        )}
      </div>
    </div>
  );
};

export default Display;
