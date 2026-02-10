
import React from 'react';
import { CalculationHistory } from '../types';
import { Trash2, History as HistoryIcon, Clock } from 'lucide-react';

interface HistoryProps {
  history: CalculationHistory[];
  onClearHistory: () => void;
  onSelectHistory: (item: CalculationHistory) => void;
}

const History: React.FC<HistoryProps> = ({ history, onClearHistory, onSelectHistory }) => {
  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between mb-4 px-2">
        <h3 className="text-slate-300 font-semibold flex items-center gap-2">
          <HistoryIcon size={18} />
          History
        </h3>
        {history.length > 0 && (
          <button 
            onClick={onClearHistory}
            className="text-slate-500 hover:text-red-400 transition-colors p-1"
          >
            <Trash2 size={18} />
          </button>
        )}
      </div>

      <div className="flex-1 overflow-y-auto pr-2 no-scrollbar space-y-3">
        {history.length === 0 ? (
          <div className="text-slate-500 text-center py-10 italic text-sm">
            No history yet
          </div>
        ) : (
          history.map((item) => (
            <div 
              key={item.id}
              onClick={() => onSelectHistory(item)}
              className="bg-slate-800/40 p-3 rounded-xl border border-slate-700/30 hover:border-indigo-500/50 cursor-pointer transition-all group"
            >
              <div className="text-xs text-slate-500 mb-1 flex items-center gap-1">
                <Clock size={12} />
                {new Date(item.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </div>
              <div className="text-slate-400 text-xs mono truncate">{item.expression}</div>
              <div className="text-indigo-300 font-bold mono mt-1">= {item.result}</div>
            </div>
          ))
        ).reverse()}
      </div>
    </div>
  );
};

export default History;
