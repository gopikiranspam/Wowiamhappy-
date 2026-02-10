
import React, { useState, useEffect, useCallback } from 'react';
import { create, all } from 'mathjs';
import { 
  History as HistoryIcon, 
  Activity, 
  Settings, 
  Sparkles, 
  X,
  Maximize2,
  Terminal,
  BrainCircuit
} from 'lucide-react';
import Display from './components/Display';
import Keypad from './components/Keypad';
import History from './components/History';
import Grapher from './components/Grapher';
import { CalculationHistory, CalcMode } from './types';
import { explainMath } from './services/geminiService';

// Create a local mathjs instance with the desired configuration
const math = create(all, {
  number: 'BigNumber',
  precision: 64
});

const App: React.FC = () => {
  const [expression, setExpression] = useState('');
  const [result, setResult] = useState('');
  const [error, setError] = useState('');
  const [lastResult, setLastResult] = useState('');
  const [history, setHistory] = useState<CalculationHistory[]>([]);
  const [mode, setMode] = useState<CalcMode>(CalcMode.DEG);
  const [activeTab, setActiveTab] = useState<'history' | 'graph'>('history');
  
  // AI Modal State
  const [isAIExplaining, setIsAIExplaining] = useState(false);
  const [aiExplanation, setAiExplanation] = useState('');
  const [loadingAI, setLoadingAI] = useState(false);

  const handleInput = (val: string) => {
    setError('');
    if (val === 'ans') {
      setExpression(prev => prev + lastResult);
    } else {
      setExpression(prev => prev + val);
    }
  };

  const handleClear = () => {
    setExpression('');
    setResult('');
    setError('');
  };

  const handleDelete = () => {
    setExpression(prev => prev.slice(0, -1));
  };

  const handleCalculate = useCallback(() => {
    if (!expression) return;
    try {
      // Basic validation
      let processedExpr = expression;
      
      // Handle degrees/radians for trig functions
      // mathjs sin/cos/tan expect radians
      if (mode === CalcMode.DEG) {
         processedExpr = processedExpr.replace(/sin\((.*?)\)/g, 'sin(($1) deg)');
         processedExpr = processedExpr.replace(/cos\((.*?)\)/g, 'cos(($1) deg)');
         processedExpr = processedExpr.replace(/tan\((.*?)\)/g, 'tan(($1) deg)');
      }

      const res = math.evaluate(processedExpr);
      const formattedRes = math.format(res, { precision: 14 });
      
      setResult(formattedRes.toString());
      setLastResult(formattedRes.toString());
      
      const newHistory: CalculationHistory = {
        id: crypto.randomUUID(),
        expression,
        result: formattedRes.toString(),
        timestamp: Date.now()
      };
      
      setHistory(prev => [...prev, newHistory]);
    } catch (e: any) {
      setError('Syntax Error');
      console.error(e);
    }
  }, [expression, mode]);

  const toggleMode = () => {
    setMode(prev => prev === CalcMode.DEG ? CalcMode.RAD : CalcMode.DEG);
  };

  const handleAskAI = async () => {
    if (!result) {
      alert("Please perform a calculation first to get an explanation.");
      return;
    }
    
    setIsAIExplaining(true);
    setLoadingAI(true);
    setAiExplanation('');
    
    const explanation = await explainMath(expression, result);
    setAiExplanation(explanation);
    setLoadingAI(false);
  };

  const selectHistoryItem = (item: CalculationHistory) => {
    setExpression(item.expression);
    setResult(item.result);
    setError('');
  };

  return (
    <div className="min-h-screen bg-[#0f172a] text-slate-100 flex items-center justify-center p-4 md:p-8 selection:bg-indigo-500/30">
      
      {/* AI Modal Overlay */}
      {isAIExplaining && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm p-4">
          <div className="bg-slate-900 border border-slate-700 w-full max-w-2xl rounded-3xl overflow-hidden shadow-2xl flex flex-col max-h-[80vh] animate-in fade-in zoom-in duration-300">
            <div className="p-6 border-b border-slate-700 flex justify-between items-center bg-indigo-950/20">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-indigo-500/20 rounded-xl text-indigo-400">
                  <BrainCircuit size={24} />
                </div>
                <div>
                  <h2 className="text-xl font-bold">AI Math Explainer</h2>
                  <p className="text-xs text-slate-400">Powered by Gemini 3 Flash</p>
                </div>
              </div>
              <button onClick={() => setIsAIExplaining(false)} className="text-slate-400 hover:text-white transition-colors">
                <X size={24} />
              </button>
            </div>
            
            <div className="p-8 overflow-y-auto no-scrollbar flex-1">
              <div className="mb-6">
                <div className="text-xs font-mono uppercase tracking-widest text-slate-500 mb-2">Subject Equation</div>
                <div className="bg-slate-800/50 p-4 rounded-xl font-mono text-indigo-300 text-lg border border-slate-700/50">
                  {expression} = {result}
                </div>
              </div>

              {loadingAI ? (
                <div className="flex flex-col items-center justify-center py-12">
                  <div className="w-12 h-12 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin mb-4"></div>
                  <p className="text-slate-400 animate-pulse">Analyzing mathematical context...</p>
                </div>
              ) : (
                <div className="prose prose-invert max-w-none">
                  <div className="text-slate-300 leading-relaxed whitespace-pre-wrap text-lg">
                    {aiExplanation}
                  </div>
                </div>
              )}
            </div>
            
            <div className="p-6 border-t border-slate-700 bg-slate-900/50">
              <button 
                onClick={() => setIsAIExplaining(false)}
                className="w-full bg-slate-800 hover:bg-slate-700 text-white font-semibold py-3 rounded-xl transition-all"
              >
                Close Explanation
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Main Container */}
      <div className="w-full max-w-6xl flex flex-col lg:flex-row gap-6 h-full max-h-[900px]">
        
        {/* Calculator Body */}
        <div className="flex-1 bg-slate-900 border border-slate-800 rounded-[2.5rem] p-8 shadow-2xl flex flex-col min-w-0">
          <header className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-600/20">
                <Terminal className="text-white" size={20} />
              </div>
              <h1 className="text-xl font-bold tracking-tight bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent">
                NovaCalc <span className="text-indigo-500 text-xs align-top ml-1 font-mono uppercase">Pro</span>
              </h1>
            </div>
            <div className="flex items-center gap-2">
              <button className="p-2 text-slate-400 hover:text-white transition-colors bg-slate-800 rounded-lg">
                <Settings size={18} />
              </button>
              <button className="p-2 text-slate-400 hover:text-white transition-colors bg-slate-800 rounded-lg">
                <Maximize2 size={18} />
              </button>
            </div>
          </header>

          <Display expression={expression} result={result} error={error} />

          <div className="flex-1 overflow-y-auto no-scrollbar">
            <Keypad 
              onInput={handleInput}
              onClear={handleClear}
              onDelete={handleDelete}
              onCalculate={handleCalculate}
              onToggleMode={toggleMode}
              onAskAI={handleAskAI}
              mode={mode}
            />
          </div>

          <footer className="mt-8 pt-6 border-t border-slate-800/50 flex items-center justify-between text-slate-500 text-xs font-medium">
             <div className="flex gap-4">
                <span className="flex items-center gap-1.5"><Sparkles size={14} className="text-amber-500" /> AI Features Ready</span>
                <span className="flex items-center gap-1.5 font-mono"><div className="w-1.5 h-1.5 bg-green-500 rounded-full"></div> System v2.4.0</span>
             </div>
             <div className="italic">Standard precision: 64-bit</div>
          </footer>
        </div>

        {/* Sidebar (History & Graphing) */}
        <div className="w-full lg:w-[380px] flex flex-col gap-6 h-full min-h-[500px]">
          
          {/* Tab Switcher */}
          <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-1.5 flex gap-1">
            <button 
              onClick={() => setActiveTab('history')}
              className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-xl transition-all ${activeTab === 'history' ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/20' : 'text-slate-400 hover:bg-slate-800'}`}
            >
              <HistoryIcon size={16} />
              <span className="text-sm font-medium">History</span>
            </button>
            <button 
              onClick={() => setActiveTab('graph')}
              className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-xl transition-all ${activeTab === 'graph' ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/20' : 'text-slate-400 hover:bg-slate-800'}`}
            >
              <Activity size={16} />
              <span className="text-sm font-medium">Grapher</span>
            </button>
          </div>

          <div className="flex-1 bg-slate-900/40 border border-slate-800/60 rounded-3xl p-6 backdrop-blur-sm overflow-hidden min-h-0 shadow-inner">
            {activeTab === 'history' ? (
              <History 
                history={history} 
                onClearHistory={() => setHistory([])}
                onSelectHistory={selectHistoryItem}
              />
            ) : (
              <Grapher expression={expression} />
            )}
          </div>

          {/* Feature Highlight Card */}
          <div className="bg-gradient-to-br from-indigo-600 to-violet-700 rounded-3xl p-6 relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16 blur-3xl group-hover:bg-white/20 transition-all duration-700"></div>
            <BrainCircuit className="text-indigo-200 mb-3" size={28} />
            <h4 className="text-white font-bold mb-1">Advanced Reasoning</h4>
            <p className="text-indigo-100 text-xs leading-relaxed opacity-90">
              NovaCalc uses Gemini 3 Pro to solve complex word problems and explain derivations. Try the Help icon on the keypad.
            </p>
          </div>

        </div>
      </div>
    </div>
  );
};

export default App;
