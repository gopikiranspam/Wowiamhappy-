
import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { create, all } from 'mathjs';
import { Activity } from 'lucide-react';

const math = create(all);

interface GrapherProps {
  expression: string;
}

const Grapher: React.FC<GrapherProps> = ({ expression }) => {
  const [data, setData] = useState<{ x: number; y: number }[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    try {
      // Try to detect if the expression contains 'x'
      if (!expression.toLowerCase().includes('x')) {
        setData([]);
        return;
      }

      const points = [];
      const compiled = math.compile(expression);
      
      for (let x = -10; x <= 10; x += 0.5) {
        try {
          const y = compiled.evaluate({ x });
          if (typeof y === 'number' && isFinite(y)) {
            points.push({ x, y: parseFloat(y.toFixed(4)) });
          }
        } catch (e) {
          // Skip points that result in errors (e.g., division by zero)
        }
      }
      
      if (points.length > 0) {
        setData(points);
        setError(null);
      } else {
        setError("Function returned no valid points");
      }
    } catch (e) {
      setError("Invalid function for graphing (use 'x')");
      setData([]);
    }
  }, [expression]);

  if (!expression.toLowerCase().includes('x')) {
    return (
      <div className="flex flex-col items-center justify-center h-full p-6 text-slate-500 italic text-center text-sm">
        <Activity size={32} className="mb-2 opacity-20" />
        Enter a function with 'x' (e.g., sin(x) * x) to visualize it here.
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      <div className="text-slate-300 font-semibold mb-4 px-2 flex items-center gap-2">
        <Activity size={18} />
        Live Function Plot
      </div>
      
      <div className="flex-1 bg-slate-900/50 rounded-2xl border border-slate-700/50 p-2 overflow-hidden">
        {error ? (
          <div className="h-full flex items-center justify-center text-red-400 text-xs text-center p-4">
            {error}
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
              <XAxis 
                dataKey="x" 
                stroke="#64748b" 
                fontSize={10} 
                tickLine={false} 
                axisLine={false} 
              />
              <YAxis 
                stroke="#64748b" 
                fontSize={10} 
                tickLine={false} 
                axisLine={false} 
              />
              <Tooltip 
                contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: '8px' }}
                itemStyle={{ color: '#818cf8' }}
              />
              <Line 
                type="monotone" 
                dataKey="y" 
                stroke="#6366f1" 
                strokeWidth={2} 
                dot={false} 
                animationDuration={500}
              />
            </LineChart>
          </ResponsiveContainer>
        )}
      </div>
      <div className="mt-3 text-[10px] text-slate-500 text-center mono uppercase tracking-wider">
        Plotting Range: x ∈ [-10, 10]
      </div>
    </div>
  );
};

export default Grapher;
