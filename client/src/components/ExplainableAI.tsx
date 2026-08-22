import React from 'react';
import { XAiFeature } from '../types/threat';
import { Brain, BarChart3 } from 'lucide-react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Cell } from 'recharts';

interface ExplainableAIProps {
  features: XAiFeature[];
  overallScore: number;
}

export const ExplainableAI: React.FC<ExplainableAIProps> = ({ features, overallScore }) => {
  const chartData = features.map(f => ({
    name: f.name.length > 22 ? f.name.substring(0, 20) + '...' : f.name,
    score: f.score,
    weight: f.weight,
    status: f.status
  }));

  return (
    <div className="glass-panel rounded-xl p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Brain className="w-5 h-5 text-indigo-400" />
          <h3 className="text-sm font-mono font-bold text-slate-100 uppercase tracking-wide">
            EXPLAINABLE AI (XAI) FEATURE IMPORTANCE ANALYSIS
          </h3>
        </div>
        <span className="text-xs font-mono text-indigo-300 bg-indigo-950/60 px-2.5 py-1 rounded border border-indigo-500/30 flex items-center gap-1">
          <BarChart3 className="w-3.5 h-3.5" />
          Feature Impact Model
        </span>
      </div>

      <p className="text-xs text-slate-400 font-mono">
        Explainable AI breaks down neural feature weights explaining why the model assigned a risk score of <strong className="text-cyan-300">{overallScore}/100</strong>.
      </p>

      <div className="h-48 w-full">
        <ResponsiveContainer width="100%" height="100%" minWidth={100} minHeight={180}>
          <BarChart data={chartData} layout="vertical" margin={{ top: 5, right: 30, left: 40, bottom: 5 }}>
            <XAxis type="number" domain={[0, 100]} stroke="#475569" tick={{ fontSize: 11, fill: '#94a3b8' }} />
            <YAxis dataKey="name" type="category" stroke="#475569" tick={{ fontSize: 11, fill: '#cbd5e1' }} width={160} />
            <Tooltip
              contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px', fontSize: '12px', fontFamily: 'monospace' }}
              itemStyle={{ color: '#00f3ff' }}
            />
            <Bar dataKey="score" radius={[0, 4, 4, 0]}>
              {chartData.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={
                    entry.status === 'DANGER'
                      ? '#ff0055'
                      : entry.status === 'WARNING'
                      ? '#ff9900'
                      : '#00ff88'
                  }
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {features.map((feat, idx) => (
          <div key={idx} className="p-3.5 rounded-lg bg-slate-900/80 border border-slate-800 space-y-1.5 font-mono text-xs">
            <div className="flex items-center justify-between">
              <span className="font-bold text-slate-200">{feat.name}</span>
              <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${
                feat.status === 'DANGER' ? 'bg-pink-950 text-pink-300 border-pink-500/40' : feat.status === 'WARNING' ? 'bg-amber-950 text-amber-300 border-amber-500/40' : 'bg-emerald-950 text-emerald-300 border-emerald-500/40'
              }`}>
                {feat.status} ({feat.score} pts)
              </span>
            </div>
            <p className="text-slate-400 text-[11px] leading-relaxed">{feat.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
};
